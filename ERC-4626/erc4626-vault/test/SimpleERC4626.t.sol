// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Test, console2} from "forge-std/Test.sol";
import {USDK} from "../src/USDK.sol";
import {SimpleERC4626} from "../src/SimpleERC4626.sol";

contract SimpleERC4626Test is Test {
    USDK internal token;
    SimpleERC4626 internal vault;

    address internal alice = address(0xA11CE);
    address internal bob = address(0xB0B);

    uint256 internal constant INITIAL_SUPPLY = 1_000_000 ether;

    function setUp() public {
        token = new USDK(INITIAL_SUPPLY);
        vault = new SimpleERC4626(token);

        // distribute tokens to test users
        token.transfer(alice, 10_000 ether);
        token.transfer(bob, 5_000 ether);
    }

    function test_DepositMintsShares1to1Initially() public {
        vm.startPrank(alice);
        uint256 amount = 1_000 ether;

        token.approve(address(vault), amount);
        uint256 shares = vault.deposit(amount, alice);

        assertEq(shares, amount, "Initial deposit should mint 1:1 shares");
        assertEq(vault.balanceOf(alice), amount, "Alice share balance");
        assertEq(token.balanceOf(address(vault)), amount, "Vault asset balance");
        vm.stopPrank();
    }

    function test_MultipleDepositorsMaintainFairness() public {
        // Alice deposits 1000
        vm.startPrank(alice);
        token.approve(address(vault), 1_000 ether);
        vault.deposit(1_000 ether, alice);
        vm.stopPrank();

        // Bob deposits 500
        vm.startPrank(bob);
        token.approve(address(vault), 500 ether);
        vault.deposit(500 ether, bob);
        vm.stopPrank();

        assertEq(vault.totalAssets(), 1_500 ether, "total assets");
        assertEq(vault.totalSupply(), 1_500 ether, "total shares");
        assertEq(vault.balanceOf(alice), 1_000 ether, "alice shares");
        assertEq(vault.balanceOf(bob), 500 ether, "bob shares");
    }

    function test_WithdrawBurnsSharesAndReturnsAssets() public {
        // Alice deposits then withdraws
        vm.startPrank(alice);
        token.approve(address(vault), 2_000 ether);
        vault.deposit(2_000 ether, alice);

        uint256 beforeAssets = token.balanceOf(alice);
        uint256 beforeShares = vault.balanceOf(alice);

        uint256 withdrawn = vault.withdraw(500 ether, alice, alice);

        assertEq(withdrawn, 500 ether, "assets withdrawn");
        assertEq(vault.balanceOf(alice), beforeShares - 500 ether, "shares burned");
        assertEq(token.balanceOf(alice), beforeAssets + 500 ether, "assets returned");
        vm.stopPrank();
    }

    function test_RedeemSharesForAssets() public {
        vm.startPrank(alice);
        token.approve(address(vault), 1_000 ether);
        vault.deposit(1_000 ether, alice);

        uint256 redeemed = vault.redeem(400 ether, alice, alice);
        assertEq(redeemed, 400 ether, "assets redeemed should equal shares initially");
        assertEq(vault.balanceOf(alice), 600 ether, "remaining shares");
        vm.stopPrank();
    }
}


