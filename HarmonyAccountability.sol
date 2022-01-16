// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";


contract HarmonyAccountability is ERC721URIStorage {
    
    string constant ape1 = 'ipfs://Qme5CsX2XstGbN2ziqziKt8BdyqSYcZCJwHescLxmSDzyg';
    string constant ape2 = 'ipfs://QmPh8szfUV6XkiueMFe9gYCF3WMj5hHwaiCobpMuxXPA3d';
    string constant ape3 = 'ipfs://QmWk4h4tHVU94ZrZuKGnQdPr7sydh7sT7hgkcmrrUhyNYR';
    string constant ape4 = 'ipfs://QmU4X3FFN2qsKBXr8L2nhdt1ZUoDo7m5QDHbd6rYpmTEja';
    string constant ape5 = 'ipfs://QmPKDSGxdGaKEE2xF9MvQUkGeYqNJH6S8kXfu5fDBtVWW9';
    string[6] tokenURIs = [ape1, ape2, ape3, ape4, ape5];
    event NFTMinted(uint256 _taskId);
    mapping(uint256 => bool) private isMinted;
    mapping(address => uint256) private tasksCompleted;

    uint256 private minDeposit; // minFlow rate to be set for a task, i tested with 1 DAI / montth
    uint256 private tasksCount;
    Task[] public tasks; // array containing tasks
    mapping(address => uint256) public senderToTaskId; // mapping tracking user recent task to task id
    mapping(address => uint256[]) public judgeToTaskId; // mapping tracking judge tasks
    enum TaskStatus {
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
        uint256 _minDeposit,
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
        uint256 deposit;
        uint256 expirationDate; // expiration date in seconds since 1970
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

   

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _minDeposit
    ) ERC721(_name, _symbol) {
        require(_minDeposit > 0, "deposit is zero ");

        //require(!host.isApp(ISuperApp(_receiver)), "receiver is an app");
        tasksCount = 0;
        minDeposit = _minDeposit;
        Task memory dummyTask = Task(
            "Task",
            "Dummy",
            0,
            address(0),
            address(0),
            address(0),
            TaskStatus.ABANDONNED,
            0,
            0
        );
        // We need to add this dummyTask in the tasks so that taskIds in tasks and senderToTaskId match
        // senderToTaskId is initialized with 0s, so real taskIds have to start at 1,
        // hence why we need to push a dummy task in tasks.
        tasks.push(dummyTask);

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
        uint256 _expirationDate
    ) external payable  {
        require(msg.sender != _receiver, "sender and receiver are the same");
        require(msg.sender != _judge, "sender and judge are the same");
        require(msg.value >= minDeposit, "deposit rate is small ");
        require(_expirationDate > block.timestamp, "expiration date is past ");
        tasksCount++; // so that no task had id = 0
        Task memory newTask = Task(
            _name,
            _description,
            tasksCount,
            msg.sender,
            _receiver,
            _judge,
            TaskStatus.STARTED,
            msg.value,
            _expirationDate
            
        );
        tasks.push(newTask);
        senderToTaskId[msg.sender] = tasksCount;
        judgeToTaskId[_judge].push(tasksCount);
        emit TaskCreated(
            tasksCount,
            msg.sender,
            _receiver,
            _judge,
            msg.value,
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
        payable(tasks[_taskId].sender).transfer( tasks[_taskId].deposit);
        uint256 apeId = tasksCompleted[msg.sender] % 5 ;
        tasksCompleted[msg.sender]++;
        string memory tokenURI = tokenURIs[apeId];
        emit NFTMinted(_taskId);
        // mint NFT
        _safeMint(msg.sender, _taskId);
        _setTokenURI(_taskId, tokenURI);
    }

    /// @dev function for user to abandon task, can only abandon if task is started
    function abandonTask(uint256 _taskId) external onlySender(_taskId) {
        require(
            tasks[_taskId].status == TaskStatus.STARTED,
            "cant abandon now"
        );
        tasks[_taskId].status = TaskStatus.ABANDONNED;
        emit TaskAbandonned(_taskId);
      
        payable(tasks[_taskId].receiver).transfer( tasks[_taskId].deposit);
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
        payable(tasks[_taskId].receiver).transfer( tasks[_taskId].deposit);
       
    }

  

    /**************************************************************************
     * Helpers functions
     *************************************************************************/
    /// show task
    function showTask(uint256 _taskId) public view returns (Task memory task) {
        task = tasks[_taskId];
    }

    
}
