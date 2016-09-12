// 0xfedc8c66bb7c0ce1633eec8b47955971bc450fa9
pragma solidity ^0.4.0;

contract Peach {
    address public owner;
    mapping (address => Account) accounts;

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
    }
}
