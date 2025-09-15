import { describe, it } from "node:test";
import assert from "node:assert/strict";
import hre from "hardhat";
import { network } from "hardhat";


const BASE_URI = "ipfs://bafybeigibb4ce5dahgzrnuq2etx6yueod5popsdlo657d2lw3u2mtdml64/";

describe("Kiln1155", async () => {
  const { viem } = await network.connect();

  it("deploys and exposes correct base uri behavior", async () => {
    const kiln1155 = await viem.deployContract("Kiln1155", [BASE_URI]);

    const base = await kiln1155.read.uri([0n]);
    assert.equal(
      base,
      `${BASE_URI}0.json`,
      "uri(tokenId) should append token id and .json to base URI",
    );
  });

  it("allows claiming within limits and updates balances", async () => {
    const [deployer, user] = await viem.getWalletClients();
    const kiln1155 = await viem.deployContract("Kiln1155", [BASE_URI], {
      client: { wallet: deployer },
    });

    // user claims 2 of id 0
    await kiln1155.write.claim([0n, 2n], { account: user.account });

    const bal0 = await kiln1155.read.balanceOf([user.account.address, 0n]);
    assert.equal(bal0, 2n);

    // user claims 3 more
    await kiln1155.write.claim([0n, 3n], { account: user.account });
    const bal1 = await kiln1155.read.balanceOf([user.account.address, 0n]);
    assert.equal(bal1, 5n);
  });

  it("reverts on invalid token id", async () => {
    const [deployer, user] = await viem.getWalletClients();
    const kiln1155 = await viem.deployContract("Kiln1155", [BASE_URI], {
      client: { wallet: deployer },
    });

    await assert.rejects(
      kiln1155.write.claim([5n, 1n], { account: user.account }),
      /Invalid token ID/,
    );
  });

  it("reverts when exceeding MAX_SUPPLY per id", async () => {
    const [deployer, user] = await viem.getWalletClients();
    const kiln1155 = await viem.deployContract("Kiln1155", [BASE_URI], {
      client: { wallet: deployer },
    });

    // claim up to the max supply
    await kiln1155.write.claim([1n, 1000n], { account: user.account });

    // next claim should revert
    await assert.rejects(
      kiln1155.write.claim([1n, 1n], { account: user.account }),
      /Max supply reached/,
    );
  });
});


