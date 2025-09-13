import type { PublicClient } from "viem";
import { encodeFunctionData, parseEther, formatEther } from "viem";
import { readFileSync } from "fs";
import path from "path";

export type DepositParams = {
  wallet: `0x${string}`;
  vault: `0x${string}`;
  amount: bigint;
};

type Transaction = {
  data: `0x${string}`;
  from: `0x${string}`;
  to: `0x${string}`;
  value: bigint;
  gas: bigint;
};

export class NotEnoughBalanceError extends Error {
  constructor() {
    super("Not enough balance");
  }
}

export class MissingAllowanceError extends Error {
  constructor() {
    super("Not enough allowance");
  }
}

export class AmountExceedsMaxDepositError extends Error {
  constructor() {
    super("Amount exceeds max deposit");
  }
}

// helper: load Foundry artifacts
export function loadArtifact(name: string) {
  const artifactPath = path.resolve(
    __dirname,
    `./erc4626-vault/out/${name}.sol/${name}.json`
  );
  return JSON.parse(readFileSync(artifactPath, "utf8"));
}

/**
 * Deposit an amount of an asset into a given vault.
 *
 * @throws {NotEnoughBalanceError} if the wallet does not have enough balance to deposit the amount
 * @throws {MissingAllowanceError} if the wallet does not have enough allowance to deposit the amount
 * @throws {AmountExceedsMaxDepositError} if the amount exceeds the max deposit
 */
export async function deposit(
    client: PublicClient,
    { wallet, vault, amount }: DepositParams,
  ): Promise<Transaction> {
    // console.log("Deposit amount:", formatEther(amount), "ETH");
    
    // load ERC20 + ERC4626 ABIs
    const erc20 = loadArtifact("USDK").abi;
    const vaultAbi = loadArtifact("SimpleERC4626").abi;
  
    // get asset address first
    const asset = await client.readContract({
      address: vault,
      abi: vaultAbi,
      functionName: "asset",
      args: [],
    }) as `0x${string}`;

    // console.log("asset address", asset);

    // 1. check maxDeposit first
    const maxDeposit: bigint = await client.readContract({
      address: vault,
      abi: vaultAbi,
      functionName: "maxDeposit",
      args: [wallet],
    }) as bigint;

    // console.log("maxDeposit", formatEther(maxDeposit), "USDK");

    if (amount > maxDeposit) throw new AmountExceedsMaxDepositError();
  
    // 2. check balance
    const balance: bigint = await client.readContract({
      address: asset,
      abi: erc20,
      functionName: "balanceOf",
      args: [wallet],
    }) as bigint;

    // console.log("balance", formatEther(balance), "USDK");
  
    if (balance < amount) throw new NotEnoughBalanceError();
  
    // 3. check allowance
    const allowance: bigint = await client.readContract({
      address: asset,
      abi: erc20,
      functionName: "allowance",
      args: [wallet, vault],
    }) as bigint;
  
    // console.log("allowance", formatEther(allowance), "USDK");
  
    if (allowance < amount) throw new MissingAllowanceError();
  
    // 4. prepare tx
    const data = encodeFunctionData({
      abi: vaultAbi,
      functionName: "deposit",
      args: [amount, wallet],
    });

    // console.log("data", data);
  
    return {
      data,
      from: wallet,
      to: vault,
      value: 0n,
      gas: 200000n,
    };
  }
  
