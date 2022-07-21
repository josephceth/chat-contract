// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract ChatLog {
    struct message {
        uint256 timestamp;
        address sender;
        string message;
    }

    mapping(bytes32 => message[]) allMessages;

    constructor() {
        console.log("We have been constructed!");
    }

    //hash the sender and receiver to get the chat log's key
    //stores all messages for that pair

    //sorts the addresses alphabetically and then hashes them to get the key
    //pure function, does not modify state
    function getChatKey(address a, address b) internal pure returns (bytes32) {
        if (a > b) {
            return keccak256(abi.encodePacked(b, a));
        } else {
            return keccak256(abi.encodePacked(a, b));
        }
    }

    //adds a message to the chat log
    function sendMessage(address receiver, string memory _msg) public {
        bytes32 key = getChatKey(msg.sender, receiver);
        message memory chat = message(block.timestamp, msg.sender, _msg);
        allMessages[key].push(chat);
    }

    //returns all messages between two addresses
    function getMessages(address a, address b)
        public
        view
        returns (message[] memory)
    {
        bytes32 key = getChatKey(a, b);
        return allMessages[key];
    }
}
