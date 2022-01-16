// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import {ISuperfluid, ISuperToken, ISuperApp, ISuperAgreement, ContextDefinitions, SuperAppDefinitions} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import {IConstantFlowAgreementV1} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";
import {SuperAppBase} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperAppBase.sol";

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

contract SuperAccountabilityX is SuperAppBase {
    ISuperfluid private host; // host
    IConstantFlowAgreementV1 private cfa; // the stored constant flow agreement class address
    ISuperToken private acceptedToken; // accepted token

    int96 private minFlowRate; // minFlow rate to be set for a task, i tested with 1 DAI / montth
    uint256 private tasksCount;
    Task[] public tasks; // array containing tasks
    mapping(address => uint256) public senderToTaskId; // mapping tracking user recent task to task id
    mapping(address => uint256[]) public judgeToTaskId; // mapping tracking judge tasks
    enum TaskStatus {
        NOT_STARTED,
        STARTED,
        FINISHED,
        ABANDONNED,
        EXPIRED
    }

    event TaskCreated(
        uint256 _taskId,
        address _sender,
        address _receiver,
        address _judge,
        int96 _flowRate,
        uint256 _expirationDate
    );
    event TaskStarted(uint256 _taskId);
    event TaskApproved(uint256 _taskId);
    event TaskAbandonned(uint256 _taskId);
    event TaskExpired(uint256 _taskId);

    struct Task {
        string name;
        string description;
        uint256 taskId;
        address sender;
        address receiver;
        address judge;
        TaskStatus status;
        int96 flowRate;
        uint256 expirationDate; // expiration date in seconds since 1970
        uint256 totalAmountStreamed; // total amount streamed by user calculated after each update to stream, to distribute money at the end
    }

    modifier onlySender(uint256 _taskId) {
        require(tasks[_taskId].sender == msg.sender, "Only sender Allowed");
        _;
    }

    modifier onlyReceiver(uint256 _taskId) {
        require(tasks[_taskId].receiver == msg.sender, "Only receiver Allowed");
        _;
    }

    modifier onlyJudge(uint256 _taskId) {
        //console.log(_taskId);
        require(tasks[_taskId].judge == msg.sender, "Only judge Allowed");
        _;
    }

    modifier noTaskStarted() {
        (, int96 oldFlow, , ) = cfa.getFlow(
            acceptedToken,
            msg.sender,
            address(this)
        );
        uint256 taskId = senderToTaskId[msg.sender];
        if(taskId > 0) {
            require(tasks[taskId].status != TaskStatus.NOT_STARTED, 'You already started a task');
        }
        require(oldFlow <= 0, "User already streaming");
        _;
    }

    constructor(
        int96 _minFlowRate,
        ISuperfluid _host,
        IConstantFlowAgreementV1 _cfa,
        ISuperToken _acceptedToken
    ) {
        require(_minFlowRate > 0, "flowrate is zero ");

        //require(!host.isApp(ISuperApp(_receiver)), "receiver is an app");
        tasksCount = 0;
        minFlowRate = _minFlowRate;
        host = _host;
        cfa = _cfa;
        acceptedToken = _acceptedToken;

        Task memory dummyTask = Task(
            "Task",
            "Dummy",
            0,
            address(0),
            address(0),
            address(0),
            TaskStatus.NOT_STARTED,
            0,
            0,
            0
        );
        // We need to add this dummyTask in the tasks so that taskIds in tasks and senderToTaskId match
        // senderToTaskId is initialized with 0s, so real taskIds have to start at 1,
        // hence why we need to push a dummy task in tasks.
        tasks.push(dummyTask);

        uint256 configWord = SuperAppDefinitions.APP_LEVEL_FINAL |
            SuperAppDefinitions.BEFORE_AGREEMENT_CREATED_NOOP;

        host.registerApp(configWord);
    }

    /**************************************************************************
     * Superfluid Accountability Logic
     *************************************************************************/

    /// @dev function for user to create a custom task /// maybe we add string name, string description for front end
    function createTask(
        string memory _name,
        string memory _description,
        address _receiver,
        address _judge,
        int96 _flowRate,
        uint256 _expirationDate
    ) external noTaskStarted {
        require(msg.sender != _receiver, "sender and receiver are the same");
        require(msg.sender != _judge, "sender and judge are the same");
        require(_flowRate >= minFlowRate, "flow rate is small ");
        require(_expirationDate > block.timestamp, "expiration date is past ");
        tasksCount++; // so that no task had id = 0
        Task memory newTask = Task(
            _name,
            _description,
            tasksCount,
            msg.sender,
            _receiver,
            _judge,
            TaskStatus.NOT_STARTED,
            _flowRate,
            _expirationDate,
            0
        );
        tasks.push(newTask);
        senderToTaskId[msg.sender] = tasksCount;
        judgeToTaskId[_judge].push(tasksCount);
        emit TaskCreated(
            tasksCount,
            msg.sender,
            _receiver,
            _judge,
            _flowRate,
            _expirationDate
        );
    }

    /// @dev function for judge to approve task, can only approve if task is started and expiration date not reached
    function approveTask(uint256 _taskId) external onlyJudge(_taskId) {
        require(_taskId >= 0, "taskId is negative");
        require(
            block.timestamp < tasks[_taskId].expirationDate,
            "Task expired"
        );
        require(
            tasks[_taskId].status == TaskStatus.STARTED,
            "Task cant be approved in current state"
        );
        tasks[_taskId].status = TaskStatus.FINISHED;
        emit TaskApproved(_taskId);
        // stop stream
        // withdraw to sender
        (uint256 timestamp, int96 flowRate, , ) = cfa.getFlow(
            acceptedToken,
            msg.sender,
            address(this)
        );
        uint256 amountToSendBack = uint256(uint96(flowRate)) *
            (block.timestamp - timestamp) +
            tasks[_taskId].totalAmountStreamed;
        tasks[_taskId].totalAmountStreamed = 0;
        _deleteFlow(tasks[_taskId].sender, address(this));
        IERC20(acceptedToken).transfer(tasks[_taskId].sender, amountToSendBack);
    }

    /// @dev function for user to abandon task, can only abandon if task is started
    function abandonTask(uint256 _taskId) external onlySender(_taskId) {
        require(
            tasks[_taskId].status == TaskStatus.STARTED,
            "cant abandon now"
        );
        tasks[_taskId].status = TaskStatus.ABANDONNED;
        emit TaskAbandonned(_taskId);
        (uint256 timestamp, int96 flowRate, , ) = cfa.getFlow(
            acceptedToken,
            msg.sender,
            address(this)
        );
        uint256 amountToSendBack = uint256(uint96(flowRate)) *
            (block.timestamp - timestamp) +
            tasks[_taskId].totalAmountStreamed;
        tasks[_taskId].totalAmountStreamed = 0;
        _deleteFlow(tasks[_taskId].sender, address(this));
        IERC20(acceptedToken).transfer(
            tasks[_taskId].receiver,
            amountToSendBack
        );
    }

    /// @dev function for receiver to expire a task that reached expiration, sends money to receiver
    function expireTask(uint256 _taskId) external onlyReceiver(_taskId) {
        require(
            block.timestamp > tasks[_taskId].expirationDate,
            "Contract not expired yet expired"
        );
        require(
            tasks[_taskId].status == TaskStatus.STARTED,
            "Task cant be expired in current state"
        );
        tasks[_taskId].status = TaskStatus.EXPIRED;
        emit TaskExpired(_taskId);
        (uint256 timestamp, int96 flowRate, , ) = cfa.getFlow(
            acceptedToken,
            tasks[_taskId].sender,
            address(this)
        );
        uint256 amountToSendBack = uint256(uint96(flowRate)) *
            (block.timestamp - timestamp) +
            tasks[_taskId].totalAmountStreamed;
        tasks[_taskId].totalAmountStreamed = 0;
        _deleteFlow(tasks[_taskId].sender, address(this));
        IERC20(acceptedToken).transfer(
            tasks[_taskId].receiver,
            amountToSendBack
        );
    }

    /// helper to delete flow
    function _deleteFlow(address _from, address _to) internal {
        host.callAgreement(
            cfa,
            abi.encodeWithSelector(
                cfa.deleteFlow.selector,
                acceptedToken,
                _from,
                _to,
                new bytes(0) // placeholder
            ),
            "0x"
        );
    }

    /**************************************************************************
     * Helpers functions
     *************************************************************************/
    /// show task
    function showTask(uint256 _taskId) public view returns (Task memory task) {
        task = tasks[_taskId];
    }

    /**************************************************************************
     * SuperApp callbacks
     *************************************************************************/

    function afterAgreementCreated(
        ISuperToken _superToken,
        address _agreementClass,
        bytes32, // _agreementId,
        bytes calldata _agreementData, /*_agreementData*/
        bytes calldata, // _cbdata,
        bytes calldata _ctx
    )
        external
        override
        onlyExpected(_superToken, _agreementClass)
        onlyHost
        returns (bytes memory newCtx)
    {
        // Logic after stream created
        // check if stream_flowrate > task_flowrate
        // change status of task to Started
        (address sender, ) = abi.decode(_agreementData, (address, address));
        (, int96 flowRate, , ) = cfa.getFlow(
            acceptedToken,
            sender,
            address(this)
        );
        // get taskId and taskFlow rate
        uint256 taskId = senderToTaskId[sender];
        int96 taskFlowRate = tasks[taskId].flowRate;

        if (
            flowRate >= taskFlowRate &&
            tasks[taskId].status == TaskStatus.NOT_STARTED
        ) {
            tasks[taskId].status = TaskStatus.STARTED;
            emit TaskStarted(taskId);
        }
        newCtx = _ctx;
    }

    function beforeAgreementUpdated(
        ISuperToken _superToken,
        address _agreementClass,
        bytes32, /*agreementId*/
        bytes calldata _agreementData, /*agreementData*/
        bytes calldata /*ctx*/
    )
        external
        view
        virtual
        override
        onlyExpected(_superToken, _agreementClass)
        onlyHost
        returns (bytes memory cbdata)
    {
        // get the amount streamer by sender before the update
        (address sender, ) = abi.decode(_agreementData, (address, address));
        (uint256 timestamp, int96 flowRate, , ) = cfa.getFlow(
            acceptedToken,
            sender,
            address(this)
        );
        uint256 updateAmount = uint256(uint96(flowRate)) *
            (block.timestamp - timestamp);

        cbdata = abi.encode(updateAmount);
    }

    function afterAgreementUpdated(
        ISuperToken _superToken,
        address _agreementClass,
        bytes32, //_agreementId,
        bytes calldata _agreementData, //agreementData,
        bytes calldata _cbdata,
        bytes calldata _ctx
    )
        external
        override
        onlyExpected(_superToken, _agreementClass)
        onlyHost
        returns (bytes memory newCtx)
    {
        // Logic after stream updated
        // update amount streamed by user
        (address sender, ) = abi.decode(_agreementData, (address, address));
        uint256 updateAmount = abi.decode(_cbdata, (uint256));
        (, int96 flowRate, , ) = cfa.getFlow(
            acceptedToken,
            sender,
            address(this)
        );
        uint256 taskId = senderToTaskId[sender];
        // update amount streamed first
        tasks[taskId].totalAmountStreamed += updateAmount;
        // check if stream_flowrate > flowrate and status not started => start task
        // check if new_flowrate < flowrate => Task abandonned and pay receiver
        if (
            flowRate >= tasks[taskId].flowRate &&
            tasks[taskId].status == TaskStatus.NOT_STARTED
        ) {
            tasks[taskId].status = TaskStatus.STARTED;
            emit TaskStarted(taskId);
        } else if (
            flowRate < tasks[taskId].flowRate &&
            tasks[taskId].status == TaskStatus.STARTED
        ) {
            tasks[taskId].status = TaskStatus.ABANDONNED;
            emit TaskAbandonned(taskId);
            IERC20(acceptedToken).transfer(
                tasks[taskId].receiver,
                tasks[taskId].totalAmountStreamed
            );
            tasks[taskId].totalAmountStreamed = 0;
        }
        newCtx = _ctx;
    }

    function beforeAgreementTerminated(
        ISuperToken, /*superToken*/
        address, /*agreementClass*/
        bytes32, /*agreementId*/
        bytes calldata _agreementData, /*agreementData*/
        bytes calldata /*ctx*/
    ) external view virtual override returns (bytes memory cbdata) {
        // get the amount streamer by sender before the update
        (address sender, ) = abi.decode(_agreementData, (address, address));
        (uint256 timestamp, int96 flowRate, , ) = cfa.getFlow(
            acceptedToken,
            sender,
            address(this)
        );
        uint256 updateAmount = uint256(uint96(flowRate)) *
            (block.timestamp - timestamp);
        cbdata = abi.encode(updateAmount);
    }

    function afterAgreementTerminated(
        ISuperToken _superToken,
        address _agreementClass,
        bytes32, //_agreementId,
        bytes calldata _agreementData, /*_agreementData*/
        bytes calldata _cbdata,
        bytes calldata _ctx
    ) external override onlyHost returns (bytes memory newCtx) {
        // According to the app basic law, we should never revert in a termination callback
        if (
            address(_superToken) != address(acceptedToken) ||
            ISuperAgreement(_agreementClass).agreementType() !=
            keccak256(
                "org.superfluid-finance.agreements.ConstantFlowAgreement.v1"
            )
        ) return _ctx;

        // depening on task state send money to receiver or sender
        // first update amount to send
        (address sender, ) = abi.decode(_agreementData, (address, address));
        uint256 taskId = senderToTaskId[sender];
        // update total amount streamed
        tasks[taskId].totalAmountStreamed += abi.decode(_cbdata, (uint256));
        uint256 amountToSend = tasks[taskId].totalAmountStreamed;

        if (tasks[taskId].status == TaskStatus.STARTED) {
            tasks[taskId].status = TaskStatus.ABANDONNED;
            emit TaskAbandonned(taskId);
            tasks[taskId].totalAmountStreamed = 0;
            IERC20(acceptedToken).transfer(
                tasks[taskId].receiver,
                amountToSend
            );
        } else if (tasks[taskId].status == TaskStatus.NOT_STARTED) {
            tasks[taskId].status = TaskStatus.ABANDONNED;
            emit TaskAbandonned(taskId);
            tasks[taskId].totalAmountStreamed = 0;
            IERC20(acceptedToken).transfer(sender, amountToSend);
        }
        newCtx = _ctx;
    }

    modifier onlyHost() {
        require(msg.sender == address(host), "Support only one host");
        _;
    }

    modifier onlyExpected(ISuperToken _superToken, address _agreementClass) {
        require(
            address(_superToken) == address(acceptedToken),
            "not accepted token"
        );
        require(
            ISuperAgreement(_agreementClass).agreementType() ==
                keccak256(
                    "org.superfluid-finance.agreements.ConstantFlowAgreement.v1"
                ),
            "only CFAv1 supported"
        );
        _;
    }
}
