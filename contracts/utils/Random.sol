// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Random {
    function generateUniqueBytes32(string calldata content) public view returns (bytes32) {
        bytes32 bytesArr = keccak256(abi.encodePacked(content, block.timestamp, block.difficulty));
        return bytesArr;
    }
}