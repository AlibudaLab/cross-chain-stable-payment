const abi = [
    {
      "type": "constructor",
      "inputs": [
        {
          "name": "router",
          "type": "address",
          "internalType": "address"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "receive",
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "acceptOwnership",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "ccipReceive",
      "inputs": [
        {
          "name": "message",
          "type": "tuple",
          "internalType": "struct Client.Any2EVMMessage",
          "components": [
            {
              "name": "messageId",
              "type": "bytes32",
              "internalType": "bytes32"
            },
            {
              "name": "sourceChainSelector",
              "type": "uint64",
              "internalType": "uint64"
            },
            {
              "name": "sender",
              "type": "bytes",
              "internalType": "bytes"
            },
            {
              "name": "data",
              "type": "bytes",
              "internalType": "bytes"
            },
            {
              "name": "destTokenAmounts",
              "type": "tuple[]",
              "internalType": "struct Client.EVMTokenAmount[]",
              "components": [
                {
                  "name": "token",
                  "type": "address",
                  "internalType": "address"
                },
                {
                  "name": "amount",
                  "type": "uint256",
                  "internalType": "uint256"
                }
              ]
            }
          ]
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "getLastReceivedMessageDetails",
      "inputs": [],
      "outputs": [
        {
          "name": "messageId",
          "type": "bytes32",
          "internalType": "bytes32"
        },
        {
          "name": "sourceChainSelector",
          "type": "uint64",
          "internalType": "uint64"
        },
        {
          "name": "sender",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "message",
          "type": "string",
          "internalType": "string"
        },
        {
          "name": "token",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "amount",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getNumberOfReceivedMessages",
      "inputs": [],
      "outputs": [
        {
          "name": "number",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getReceivedMessageAt",
      "inputs": [
        {
          "name": "index",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "name": "messageId",
          "type": "bytes32",
          "internalType": "bytes32"
        },
        {
          "name": "sourceChainSelector",
          "type": "uint64",
          "internalType": "uint64"
        },
        {
          "name": "sender",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "message",
          "type": "string",
          "internalType": "string"
        },
        {
          "name": "token",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "amount",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getReceivedMessageDetails",
      "inputs": [
        {
          "name": "messageId",
          "type": "bytes32",
          "internalType": "bytes32"
        }
      ],
      "outputs": [
        {
          "name": "sourceChainSelector",
          "type": "uint64",
          "internalType": "uint64"
        },
        {
          "name": "sender",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "message",
          "type": "string",
          "internalType": "string"
        },
        {
          "name": "token",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "amount",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getRouter",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "address"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "messageDetail",
      "inputs": [
        {
          "name": "",
          "type": "bytes32",
          "internalType": "bytes32"
        }
      ],
      "outputs": [
        {
          "name": "sourceChainSelector",
          "type": "uint64",
          "internalType": "uint64"
        },
        {
          "name": "sender",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "message",
          "type": "string",
          "internalType": "string"
        },
        {
          "name": "token",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "amount",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "owner",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "address"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "receivedMessages",
      "inputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "bytes32",
          "internalType": "bytes32"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "sendMessage",
      "inputs": [
        {
          "name": "destinationChainSelector",
          "type": "uint64",
          "internalType": "uint64"
        },
        {
          "name": "receiver",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "message",
          "type": "string",
          "internalType": "string"
        },
        {
          "name": "token",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "amount",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "name": "messageId",
          "type": "bytes32",
          "internalType": "bytes32"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "supportsInterface",
      "inputs": [
        {
          "name": "interfaceId",
          "type": "bytes4",
          "internalType": "bytes4"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "bool",
          "internalType": "bool"
        }
      ],
      "stateMutability": "pure"
    },
    {
      "type": "function",
      "name": "transferOwnership",
      "inputs": [
        {
          "name": "to",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "withdraw",
      "inputs": [
        {
          "name": "beneficiary",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "withdrawToken",
      "inputs": [
        {
          "name": "beneficiary",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "token",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "event",
      "name": "MessageReceived",
      "inputs": [
        {
          "name": "messageId",
          "type": "bytes32",
          "indexed": true,
          "internalType": "bytes32"
        },
        {
          "name": "sourceChainSelector",
          "type": "uint64",
          "indexed": true,
          "internalType": "uint64"
        },
        {
          "name": "sender",
          "type": "address",
          "indexed": false,
          "internalType": "address"
        },
        {
          "name": "message",
          "type": "string",
          "indexed": false,
          "internalType": "string"
        },
        {
          "name": "tokenAmount",
          "type": "tuple",
          "indexed": false,
          "internalType": "struct Client.EVMTokenAmount",
          "components": [
            {
              "name": "token",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "amount",
              "type": "uint256",
              "internalType": "uint256"
            }
          ]
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "MessageSent",
      "inputs": [
        {
          "name": "messageId",
          "type": "bytes32",
          "indexed": true,
          "internalType": "bytes32"
        },
        {
          "name": "destinationChainSelector",
          "type": "uint64",
          "indexed": true,
          "internalType": "uint64"
        },
        {
          "name": "receiver",
          "type": "address",
          "indexed": false,
          "internalType": "address"
        },
        {
          "name": "message",
          "type": "string",
          "indexed": false,
          "internalType": "string"
        },
        {
          "name": "tokenAmount",
          "type": "tuple",
          "indexed": false,
          "internalType": "struct Client.EVMTokenAmount",
          "components": [
            {
              "name": "token",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "amount",
              "type": "uint256",
              "internalType": "uint256"
            }
          ]
        },
        {
          "name": "fees",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "OwnershipTransferRequested",
      "inputs": [
        {
          "name": "from",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "to",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "OwnershipTransferred",
      "inputs": [
        {
          "name": "from",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "to",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "error",
      "name": "FailedToWithdrawEth",
      "inputs": [
        {
          "name": "owner",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "target",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "value",
          "type": "uint256",
          "internalType": "uint256"
        }
      ]
    },
    {
      "type": "error",
      "name": "IndexOutOfBound",
      "inputs": [
        {
          "name": "providedIndex",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "maxIndex",
          "type": "uint256",
          "internalType": "uint256"
        }
      ]
    },
    {
      "type": "error",
      "name": "InsufficientFeeTokenAmount",
      "inputs": []
    },
    {
      "type": "error",
      "name": "InvalidRouter",
      "inputs": [
        {
          "name": "router",
          "type": "address",
          "internalType": "address"
        }
      ]
    },
    {
      "type": "error",
      "name": "MessageIdNotExist",
      "inputs": [
        {
          "name": "messageId",
          "type": "bytes32",
          "internalType": "bytes32"
        }
      ]
    },
    {
      "type": "error",
      "name": "NoMessageReceived",
      "inputs": []
    },
    {
      "type": "error",
      "name": "NothingToWithdraw",
      "inputs": []
    }
  ] as const;

  export default abi;
  
  