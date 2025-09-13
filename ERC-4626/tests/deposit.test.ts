import { test, expect, beforeAll } from "bun:test";
import { createPublicClient, createWalletClient, http, parseEther, formatEther } from "viem";
import { foundry } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { loadArtifact, deposit, NotEnoughBalanceError, MissingAllowanceError, AmountExceedsMaxDepositError } from "../index";
import path from "path";
import { readFileSync } from "fs";

const rpcUrl = "http://127.0.0.1:8545";
const account = privateKeyToAccount(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" // Anvil default key[0]
);

const account2 = privateKeyToAccount(
  "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d" // Anvil default key[1]
);

const publicClient = createPublicClient({
  chain: foundry,
  transport: http(rpcUrl),
});

const walletClient = createWalletClient({
  account,
  chain: foundry,
  transport: http(rpcUrl),
});

const walletClient2 = createWalletClient({
  account: account2,
  chain: foundry,
  transport: http(rpcUrl),
});

// deploy helper
async function deploy(name: string, args: any[] = []) {
  const artifact = JSON.parse(
    readFileSync(
      path.resolve(__dirname, `../erc4626-vault/out/${name}.sol/${name}.json`),
      "utf8"
    )
  );
  const hash = await walletClient.deployContract({
    abi: artifact.abi,
    bytecode: artifact.bytecode.object as `0x${string}`,
    args,
  });
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  return receipt.contractAddress as `0x${string}`;
}

let token: `0x${string}`;
let vault: `0x${string}`;

beforeAll(async () => {
  token = await deploy("USDK", [parseEther("1000")]);
  vault = await deploy("SimpleERC4626", [token]);
  
  // Transfer some USDK to account2 for testing
  const transferHash = await walletClient.writeContract({
    address: token,
    abi: loadArtifact("USDK").abi,
    functionName: "transfer",
    args: [account2.address, parseEther("100")],
  });
  await publicClient.waitForTransactionReceipt({ hash: transferHash });
});

test("successful deposit", async () => {
  // approve vault
  const approveHash = await walletClient.writeContract({
    address: token,
    abi: loadArtifact("USDK").abi,
    functionName: "approve",
    args: [vault, parseEther("100")],
  });
  await publicClient.waitForTransactionReceipt({ hash: approveHash });

  const depositAmount = parseEther("10");
  
  console.log("\n" + "=".repeat(60));
  console.log("🚀 ERC-4626 VAULT DEPOSIT TEST");
  console.log("=".repeat(60));
  console.log(`💰 Deposit Amount: ${formatEther(depositAmount)} USDK`);
  
  // Check user's USDK balance before deposit
  const userUSDKBalanceBefore = await publicClient.readContract({
    address: token,
    abi: loadArtifact("USDK").abi,
    functionName: "balanceOf",
    args: [account.address],
  }) as bigint;
  
  console.log(`👤 User USDK Balance (Before): ${formatEther(userUSDKBalanceBefore)} USDK`);
  
  const tx = await deposit(publicClient, {
    wallet: account.address,
    vault,
    amount: depositAmount,
  });

  expect(tx.to).toBe(vault);
  expect(tx.data).toMatch(/^0x/);

  // Actually send the transaction
  console.log("\n📤 Sending transaction...");
  const txHash = await walletClient.sendTransaction(tx);
  console.log(`🔗 Transaction Hash: ${txHash}`);
  
  // Wait for transaction confirmation
  console.log("⏳ Waiting for confirmation...");
  const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
  console.log(`✅ Transaction confirmed in block: ${receipt.blockNumber}`);

  // Check balances after deposit
  console.log("\n📊 POST-TRANSACTION BALANCES");
  console.log("-".repeat(40));
  
  const vaultBalance = await publicClient.readContract({
    address: vault,
    abi: loadArtifact("SimpleERC4626").abi,
    functionName: "balanceOf",
    args: [account.address],
  }) as bigint;

  console.log(`🏦 User vUSDK Balance: ${formatEther(vaultBalance)} vUSDK`);
  
  // Check USDK balance of the vault contract
  const vaultUSDKBalance = await publicClient.readContract({
    address: token,
    abi: loadArtifact("USDK").abi,
    functionName: "balanceOf",
    args: [vault],
  }) as bigint;
  
  console.log(`🏛️  Vault USDK Balance: ${formatEther(vaultUSDKBalance)} USDK`);
  
  // Check user's USDK balance after deposit
  const userUSDKBalanceAfter = await publicClient.readContract({
    address: token,
    abi: loadArtifact("USDK").abi,
    functionName: "balanceOf",
    args: [account.address],
  }) as bigint;
  
  console.log(`👤 User USDK Balance (After): ${formatEther(userUSDKBalanceAfter)} USDK`);
  
  // Show the change
  const usdkChange = userUSDKBalanceBefore - userUSDKBalanceAfter;
  console.log(`📈 USDK Transferred: ${formatEther(usdkChange)} USDK`);
  console.log(`📈 vUSDK Minted: ${formatEther(vaultBalance)} vUSDK`);
  
  console.log("=".repeat(60));
});

test("compare deposits from two users", async () => {
  const depositAmount = parseEther("10");
  
  console.log("\n" + "=".repeat(60));
  console.log("🔄 COMPARING DEPOSITS FROM TWO USERS");
  console.log("=".repeat(60));
  console.log(`💰 Deposit Amount: ${formatEther(depositAmount)} USDK each`);
  
  // Check initial balances before deposits
  const initialBalance1 = await publicClient.readContract({
    address: vault,
    abi: loadArtifact("SimpleERC4626").abi,
    functionName: "balanceOf",
    args: [account.address],
  }) as bigint;
  
  const initialBalance2 = await publicClient.readContract({
    address: vault,
    abi: loadArtifact("SimpleERC4626").abi,
    functionName: "balanceOf",
    args: [account2.address],
  }) as bigint;
  
  console.log(`📊 Initial vUSDK Balances:`);
  console.log(`👤 User 1: ${formatEther(initialBalance1)} vUSDK`);
  console.log(`👤 User 2: ${formatEther(initialBalance2)} vUSDK`);
  
  // First user (account) deposit
  console.log("\n👤 USER 1 DEPOSIT");
  console.log("-".repeat(30));
  
  // Approve vault for user 1
  const approveHash1 = await walletClient.writeContract({
    address: token,
    abi: loadArtifact("USDK").abi,
    functionName: "approve",
    args: [vault, depositAmount],
  });
  await publicClient.waitForTransactionReceipt({ hash: approveHash1 });
  
  const tx1 = await deposit(publicClient, {
    wallet: account.address,
    vault,
    amount: depositAmount,
  });
  
  const txHash1 = await walletClient.sendTransaction(tx1);
  const receipt1 = await publicClient.waitForTransactionReceipt({ hash: txHash1 });
  
  const finalBalance1 = await publicClient.readContract({
    address: vault,
    abi: loadArtifact("SimpleERC4626").abi,
    functionName: "balanceOf",
    args: [account.address],
  }) as bigint;
  
  const receivedAmount1 = finalBalance1 - initialBalance1;
  console.log(`✅ User 1 received: ${formatEther(receivedAmount1)} vUSDK`);
  console.log(`📊 User 1 total balance: ${formatEther(finalBalance1)} vUSDK`);
  
  // Second user (account2) deposit
  console.log("\n👤 USER 2 DEPOSIT");
  console.log("-".repeat(30));
  
  // Approve vault for user 2
  const approveHash2 = await walletClient2.writeContract({
    address: token,
    abi: loadArtifact("USDK").abi,
    functionName: "approve",
    args: [vault, depositAmount],
  });
  await publicClient.waitForTransactionReceipt({ hash: approveHash2 });
  
  const tx2 = await deposit(publicClient, {
    wallet: account2.address,
    vault,
    amount: depositAmount,
  });
  
  const txHash2 = await walletClient2.sendTransaction(tx2);
  const receipt2 = await publicClient.waitForTransactionReceipt({ hash: txHash2 });
  
  const finalBalance2 = await publicClient.readContract({
    address: vault,
    abi: loadArtifact("SimpleERC4626").abi,
    functionName: "balanceOf",
    args: [account2.address],
  }) as bigint;
  
  const receivedAmount2 = finalBalance2 - initialBalance2;
  console.log(`✅ User 2 received: ${formatEther(receivedAmount2)} vUSDK`);
  console.log(`📊 User 2 total balance: ${formatEther(finalBalance2)} vUSDK`);
  
  // Comparison
  console.log("\n📊 COMPARISON RESULTS");
  console.log("-".repeat(40));
  console.log(`👤 User 1 (${account.address.slice(0, 8)}...): received ${formatEther(receivedAmount1)} vUSDK`);
  console.log(`👤 User 2 (${account2.address.slice(0, 8)}...): received ${formatEther(receivedAmount2)} vUSDK`);
  
  if (receivedAmount1 === receivedAmount2) {
    console.log("✅ Both users received the same amount of vUSDK tokens!");
  } else {
    console.log("❌ Users received different amounts of vUSDK tokens!");
    const difference = receivedAmount1 > receivedAmount2 ? 
      receivedAmount1 - receivedAmount2 : 
      receivedAmount2 - receivedAmount1;
    console.log(`📈 Difference: ${formatEther(difference)} vUSDK`);
  }
  
  // Check total vault USDK balance
  const totalVaultUSDK = await publicClient.readContract({
    address: token,
    abi: loadArtifact("USDK").abi,
    functionName: "balanceOf",
    args: [vault],
  }) as bigint;
  
  console.log(`🏛️  Total Vault USDK Balance: ${formatEther(totalVaultUSDK)} USDK`);
  console.log(`📊 Expected additional USDK: ${formatEther(depositAmount * 2n)} USDK`);
  
  // Verify both users got the same amount from their deposits
  expect(receivedAmount1).toBe(receivedAmount2);
  expect(receivedAmount1).toBeGreaterThan(0n);
  expect(receivedAmount2).toBeGreaterThan(0n);
  
  console.log("=".repeat(60));
});

test("throws NotEnoughBalanceError", async () => {
  const amount = parseEther("999999");
  
  console.log("\n" + "=".repeat(60));
  console.log("❌ NOT ENOUGH BALANCE ERROR TEST");
  console.log("=".repeat(60));
  console.log(`💰 Attempting to deposit: ${formatEther(amount)} USDK`);
  console.log("🚫 Expected: NotEnoughBalanceError");
  
  await expect(
    deposit(publicClient, {
      wallet: account.address,
      vault,
      amount,
    }),
  ).rejects.toThrow(NotEnoughBalanceError);
  
  console.log("✅ Error thrown correctly!");
  console.log("=".repeat(60));
});

test("throws MissingAllowanceError", async () => {
  // Use the same account but with a fresh amount that exceeds the current allowance
  const amount = parseEther("200"); // More than the approved amount (100)
  
  console.log("\n" + "=".repeat(60));
  console.log("❌ MISSING ALLOWANCE ERROR TEST");
  console.log("=".repeat(60));
  console.log(`💰 Attempting to deposit: ${formatEther(amount)} USDK`);
  console.log(`🔒 Current allowance: 100 USDK`);
  console.log("🚫 Expected: MissingAllowanceError");
  
  await expect(
    deposit(publicClient, {
      wallet: account.address,
      vault,
      amount,
    }),
  ).rejects.toThrow(MissingAllowanceError);
  
  console.log("✅ Error thrown correctly!");
  console.log("=".repeat(60));
});

test("throws AmountExceedsMaxDepositError", async () => {
  // Use the same account but with an amount that exceeds maxDeposit
  // First, let's check what maxDeposit returns for this account
  const maxDeposit = await publicClient.readContract({
    address: vault,
    abi: loadArtifact("SimpleERC4626").abi,
    functionName: "maxDeposit",
    args: [account.address],
  }) as bigint;
  
  const amount = maxDeposit + 1n; // Just slightly more than maxDeposit
  
  console.log("\n" + "=".repeat(60));
  console.log("❌ AMOUNT EXCEEDS MAX DEPOSIT ERROR TEST");
  console.log("=".repeat(60));
  console.log(`💰 Attempting to deposit: ${formatEther(amount)} USDK`);
  console.log(`📊 Max deposit allowed: ${formatEther(maxDeposit)} USDK`);
  console.log("🚫 Expected: AmountExceedsMaxDepositError");
  
  // Try to deposit more than maxDeposit
  await expect(
    deposit(publicClient, {
      wallet: account.address,
      vault,
      amount,
    }),
  ).rejects.toThrow(AmountExceedsMaxDepositError);
  
  console.log("✅ Error thrown correctly!");
  console.log("=".repeat(60));
});
