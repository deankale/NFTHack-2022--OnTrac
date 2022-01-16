export const SuperAccountabilityXABI = [
  {
    inputs: [
      {
        internalType: 'int96',
        name: '_minFlowRate',
        type: 'int96',
      },
      {
        internalType: 'contract ISuperfluid',
        name: '_host',
        type: 'address',
      },
      {
        internalType: 'contract IConstantFlowAgreementV1',
        name: '_cfa',
        type: 'address',
      },
      {
        internalType: 'contract ISuperToken',
        name: '_acceptedToken',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: '_taskId',
        type: 'uint256',
      },
    ],
    name: 'TaskAbandonned',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: '_taskId',
        type: 'uint256',
      },
    ],
    name: 'TaskApproved',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: '_taskId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: '_sender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: '_receiver',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: '_judge',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'int96',
        name: '_flowRate',
        type: 'int96',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_expirationDate',
        type: 'uint256',
      },
    ],
    name: 'TaskCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: '_taskId',
        type: 'uint256',
      },
    ],
    name: 'TaskExpired',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: '_taskId',
        type: 'uint256',
      },
    ],
    name: 'TaskStarted',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_taskId',
        type: 'uint256',
      },
    ],
    name: 'abandonTask',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract ISuperToken',
        name: '_superToken',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_agreementClass',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
      {
        internalType: 'bytes',
        name: '_agreementData',
        type: 'bytes',
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
      {
        internalType: 'bytes',
        name: '_ctx',
        type: 'bytes',
      },
    ],
    name: 'afterAgreementCreated',
    outputs: [
      {
        internalType: 'bytes',
        name: 'newCtx',
        type: 'bytes',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract ISuperToken',
        name: '_superToken',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_agreementClass',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
      {
        internalType: 'bytes',
        name: '_agreementData',
        type: 'bytes',
      },
      {
        internalType: 'bytes',
        name: '_cbdata',
        type: 'bytes',
      },
      {
        internalType: 'bytes',
        name: '_ctx',
        type: 'bytes',
      },
    ],
    name: 'afterAgreementTerminated',
    outputs: [
      {
        internalType: 'bytes',
        name: 'newCtx',
        type: 'bytes',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract ISuperToken',
        name: '_superToken',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_agreementClass',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
      {
        internalType: 'bytes',
        name: '_agreementData',
        type: 'bytes',
      },
      {
        internalType: 'bytes',
        name: '_cbdata',
        type: 'bytes',
      },
      {
        internalType: 'bytes',
        name: '_ctx',
        type: 'bytes',
      },
    ],
    name: 'afterAgreementUpdated',
    outputs: [
      {
        internalType: 'bytes',
        name: 'newCtx',
        type: 'bytes',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_taskId',
        type: 'uint256',
      },
    ],
    name: 'approveTask',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract ISuperToken',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    name: 'beforeAgreementCreated',
    outputs: [
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract ISuperToken',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
      {
        internalType: 'bytes',
        name: '_agreementData',
        type: 'bytes',
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    name: 'beforeAgreementTerminated',
    outputs: [
      {
        internalType: 'bytes',
        name: 'cbdata',
        type: 'bytes',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract ISuperToken',
        name: '_superToken',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_agreementClass',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
      {
        internalType: 'bytes',
        name: '_agreementData',
        type: 'bytes',
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    name: 'beforeAgreementUpdated',
    outputs: [
      {
        internalType: 'bytes',
        name: 'cbdata',
        type: 'bytes',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_name',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_description',
        type: 'string',
      },
      {
        internalType: 'address',
        name: '_receiver',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_judge',
        type: 'address',
      },
      {
        internalType: 'int96',
        name: '_flowRate',
        type: 'int96',
      },
      {
        internalType: 'uint256',
        name: '_expirationDate',
        type: 'uint256',
      },
    ],
    name: 'createTask',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_taskId',
        type: 'uint256',
      },
    ],
    name: 'expireTask',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'judgeToTaskId',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'senderToTaskId',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_taskId',
        type: 'uint256',
      },
    ],
    name: 'showTask',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'description',
            type: 'string',
          },
          {
            internalType: 'uint256',
            name: 'taskId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'sender',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'receiver',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'judge',
            type: 'address',
          },
          {
            internalType: 'enum SuperAccountabilityX.TaskStatus',
            name: 'status',
            type: 'uint8',
          },
          {
            internalType: 'int96',
            name: 'flowRate',
            type: 'int96',
          },
          {
            internalType: 'uint256',
            name: 'expirationDate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'totalAmountStreamed',
            type: 'uint256',
          },
        ],
        internalType: 'struct SuperAccountabilityX.Task',
        name: 'task',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'tasks',
    outputs: [
      {
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'description',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'taskId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'receiver',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'judge',
        type: 'address',
      },
      {
        internalType: 'enum SuperAccountabilityX.TaskStatus',
        name: 'status',
        type: 'uint8',
      },
      {
        internalType: 'int96',
        name: 'flowRate',
        type: 'int96',
      },
      {
        internalType: 'uint256',
        name: 'expirationDate',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalAmountStreamed',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
