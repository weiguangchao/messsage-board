// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";
contract MessageBoard is Ownable {
    event OnBoard(bytes content);

    event Received(address sender, uint value);
    event Fallback(address sender, uint value);
    event Withdraw(address receiver, uint value);

    mapping(bytes32 => bytes) public messageMap;

    function submitMessage(bytes32 key, bytes calldata content) external onlyOwner {
        require(content.length > 0, "Message is empty!");
        require(content.length < 50 * 4, "Message length too long!");

        require(key.length > 0, "Message is empty!");

        bytes memory value = messageMap[key];
        require(value.length < 1, "Message key repeat!");

        messageMap[key] = content;

        emit OnBoard(content);
    }

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    fallback() external payable {
        emit Fallback(msg.sender, msg.value);
    }

    function getBalance() public onlyOwner view returns (uint) {
        return address(this).balance;
    }

    function withdraw() external onlyOwner {
        uint balance = getBalance();
        (bool success,) = owner().call{value: balance}("");

        if (success) {
            emit Withdraw(msg.sender, balance);
        }
    }

    function getMessageByKey(bytes32 key) external view onlyOwner returns (bytes memory) {
        bytes memory value = messageMap[key];
        return value;
    }

}
