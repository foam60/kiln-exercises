import { hre } from "hardhat";

async function main() {
  console.log("Testing Kiln1155 claim function...\n");

  // Get the deployed contract (you'll need to replace this with your actual deployed address)
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with actual deployed address
  const kiln1155 = await hre.viem.getContractAt("Kiln1155", contractAddress);

  // Get test accounts
  const [deployer, user1, user2] = await hre.viem.getWalletClients();

  console.log("Deployer address:", deployer.account.address);
  console.log("User1 address:", user1.account.address);
  console.log("User2 address:", user2.account.address);
  console.log("Contract address:", contractAddress);
  console.log("");

  try {
    // Test 1: Claim token ID 0 with amount 1
    console.log("Test 1: Claiming token ID 0, amount 1...");
    const claimTx1 = await kiln1155.write.claim([0n, 1n], {
      account: user1.account,
    });
    console.log("✅ Claim transaction hash:", claimTx1);
    
    // Wait for transaction to be mined
    await hre.viem.publicClient.waitForTransactionReceipt({ hash: claimTx1 });
    console.log("✅ Transaction confirmed");

    // Check balance
    const balance1 = await kiln1155.read.balanceOf([user1.account.address, 0n]);
    console.log("✅ User1 balance of token ID 0:", balance1.toString());
    console.log("");

    // Test 2: Claim token ID 1 with amount 5
    console.log("Test 2: Claiming token ID 1, amount 5...");
    const claimTx2 = await kiln1155.write.claim([1n, 5n], {
      account: user2.account,
    });
    console.log("✅ Claim transaction hash:", claimTx2);
    
    await hre.viem.publicClient.waitForTransactionReceipt({ hash: claimTx2 });
    console.log("✅ Transaction confirmed");

    const balance2 = await kiln1155.read.balanceOf([user2.account.address, 1n]);
    console.log("✅ User2 balance of token ID 1:", balance2.toString());
    console.log("");

    // Test 3: Check total minted for token ID 0
    console.log("Test 3: Checking total minted for token ID 0...");
    const totalMinted0 = await kiln1155.read.totalMinted([0n]);
    console.log("✅ Total minted for token ID 0:", totalMinted0.toString());
    console.log("");

    // Test 4: Try to claim invalid token ID (should fail)
    console.log("Test 4: Attempting to claim invalid token ID 5 (should fail)...");
    try {
      await kiln1155.write.claim([5n, 1n], {
        account: user1.account,
      });
      console.log("❌ This should have failed!");
    } catch (error: any) {
      console.log("✅ Expected error caught:", error.message);
    }
    console.log("");

    // Test 5: Try to claim more than max supply (should fail)
    console.log("Test 5: Attempting to claim more than max supply (should fail)...");
    try {
      await kiln1155.write.claim([2n, 1001n], {
        account: user1.account,
      });
      console.log("❌ This should have failed!");
    } catch (error: any) {
      console.log("✅ Expected error caught:", error.message);
    }
    console.log("");

    // Test 6: Check MAX_SUPPLY constant
    console.log("Test 6: Checking MAX_SUPPLY constant...");
    const maxSupply = await kiln1155.read.MAX_SUPPLY();
    console.log("✅ MAX_SUPPLY:", maxSupply.toString());
    console.log("");

    // Test 7: Multiple claims by same user
    console.log("Test 7: Multiple claims by same user...");
    const claimTx3 = await kiln1155.write.claim([3n, 10n], {
      account: user1.account,
    });
    await hre.viem.publicClient.waitForTransactionReceipt({ hash: claimTx3 });
    
    const claimTx4 = await kiln1155.write.claim([3n, 5n], {
      account: user1.account,
    });
    await hre.viem.publicClient.waitForTransactionReceipt({ hash: claimTx4 });
    
    const balance3 = await kiln1155.read.balanceOf([user1.account.address, 3n]);
    console.log("✅ User1 balance of token ID 3 after multiple claims:", balance3.toString());
    
    const totalMinted3 = await kiln1155.read.totalMinted([3n]);
    console.log("✅ Total minted for token ID 3:", totalMinted3.toString());
    console.log("");

    console.log("🎉 All tests completed successfully!");

  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
