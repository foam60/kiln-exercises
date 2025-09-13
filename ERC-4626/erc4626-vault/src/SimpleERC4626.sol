// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {ERC4626} from "openzeppelin-contracts/token/ERC20/extensions/ERC4626.sol";
import {ERC20} from "openzeppelin-contracts/token/ERC20/ERC20.sol";

contract SimpleERC4626 is ERC4626 {
    constructor(ERC20 asset)
        ERC20("Vault USDK", "vUSDK")
        ERC4626(asset)
    {}
}