// 0x43d466afad6d9e89fd5b5f5f1a71d52600759179
pragma solidity ^0.4.0;

contract Peach {
    address public owner;
    mapping (address => Account) accounts;

    event Create (string descriptor, address creator);

    struct Account {
        string descriptor;
        uint funding;
    }

    function Peach () {
        owner = msg.sender;
    }

    function createPeach (string descriptor) {
        owner.send(msg.value);
        accounts[msg.sender] = Account(descriptor, msg.value);
        Create(descriptor, msg.sender);
    }
}
