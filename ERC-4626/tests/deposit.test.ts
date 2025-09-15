import { test, expect, beforeAll } from "bun:test";
import {
  createPublicClient,
  createWalletClient,
  http,
  parseEther,
  formatEther,
} from "viem";
import { foundry } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import {
  loadArtifact,
  deposit,
  NotEnoughBalanceError,
  MissingAllowanceError,
  AmountExceedsMaxDepositError,
} from "../index";
import path from "path";
import { readFileSync } from "fs";

const rpcUrl = "http://127.0.0.1:8545";

const account = privateKeyToAccount(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
);
const account2 = privateKeyToAccount(
  "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
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

// ----------- Helper to deploy contracts -----------
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

  // fund account2
  const transferHash = await walletClient.writeContract({
    address: token,
    abi: loadArtifact("USDK").abi,
    functionName: "transfer",
    args: [account2.address, parseEther("100")],
  });
  await publicClient.waitForTransactionReceipt({ hash: transferHash });
});

// ----------- Tests -----------

test("successful deposit", async () => {
  const approveHash = await walletClient.writeContract({
    address: token,
    abi: loadArtifact("USDK").abi,
    functionName: "approve",
    args: [vault, parseEther("50")],
  });
  await publicClient.waitForTransactionReceipt({ hash: approveHash });

  const amount = parseEther("10");

  const tx = await deposit(publicClient, {
    wallet: account.address,
    vault,
    amount,
  });

  expect(tx.to).toBe(vault);
  expect(tx.data).toMatch(/^0x/);

  const txHash = await walletClient.sendTransaction(tx);
  await publicClient.waitForTransactionReceipt({ hash: txHash });

  const balance = (await publicClient.readContract({
    address: vault,
    abi: loadArtifact("SimpleERC4626").abi,
    functionName: "balanceOf",
    args: [account.address],
  })) as bigint;

  expect(balance).toBeGreaterThan(0n);
});

test("throws NotEnoughBalanceError", async () => {
  await expect(
    deposit(publicClient, {
      wallet: account.address,
      vault,
      amount: parseEther("999999"),
    })
  ).rejects.toThrow(NotEnoughBalanceError);
});

test("throws MissingAllowanceError", async () => {
  await expect(
    deposit(publicClient, {
      wallet: account2.address,
      vault,
      amount: parseEther("20"), // > allowance
    })
  ).rejects.toThrow(MissingAllowanceError);
});

test("throws AmountExceedsMaxDepositError", async () => {
  const maxDeposit = (await publicClient.readContract({
    address: vault,
    abi: loadArtifact("SimpleERC4626").abi,
    functionName: "maxDeposit",
    args: [account.address],
  })) as bigint;

  await expect(
    deposit(publicClient, {
      wallet: account.address,
      vault,
      amount: maxDeposit + 1n,
    })
  ).rejects.toThrow(AmountExceedsMaxDepositError);
});

test("throws on zero deposit", async () => {
  await expect(
    deposit(publicClient, {
      wallet: account.address,
      vault,
      amount: 0n,
    })
  ).rejects.toThrow("Deposit amount must be greater than zero");
});
