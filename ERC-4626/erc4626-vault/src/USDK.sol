// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {ERC20} from "openzeppelin-contracts/token/ERC20/ERC20.sol";

contract USDK is ERC20 {
    constructor(uint256 initialSupply) ERC20("USD Kiln", "USDK") {
        _mint(msg.sender, initialSupply);
    }
}