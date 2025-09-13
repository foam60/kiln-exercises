// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import { Script } from "forge-std/Script.sol";
import { USDK } from "../src/USDK.sol";
import { SimpleERC4626 } from "../src/SimpleERC4626.sol";
import { console } from "forge-std/console.sol";

contract Deploy is Script {
    function run() external {
        vm.startBroadcast();

        USDK token = new USDK(1_000_000 ether);
        SimpleERC4626 vault = new SimpleERC4626(token);

        console.log("USDK:", address(token));
        console.log("SimpleERC4626:", address(vault));

        vm.stopBroadcast();
    }
}