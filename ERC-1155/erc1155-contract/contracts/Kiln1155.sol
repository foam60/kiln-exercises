// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Kiln1155 is ERC1155, Ownable {
    uint256 public constant MAX_SUPPLY = 1000; // limits per ID
    mapping(uint256 => uint256) public totalMinted;

    constructor(string memory baseURI) ERC1155(baseURI) Ownable(msg.sender) {}

    function claim(uint256 id, uint256 amount) external {
        require(id < 5, "Invalid token ID"); // you have 5 NFTs: 0–4
        require(totalMinted[id] + amount <= MAX_SUPPLY, "Max supply reached");

        totalMinted[id] += amount;
        _mint(msg.sender, id, amount, "");
    }
}