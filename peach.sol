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
