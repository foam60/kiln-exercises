# Kiln1155 ERC-1155 Contract (Hardhat 3 + Ignition + viem)

This project contains an ERC-1155 contract (`Kiln1155`) and a Hardhat 3 setup with Ignition for deployments and `viem` for interactions.

## Project Overview

- **Contract**: `Kiln1155.sol` — simple claimable ERC-1155 with capped supply per token ID
- **Deployment**: Ignition module `ignition/modules/Kiln1155.ts`
- **Network**: Ready for Base Sepolia via `hardhat.config.ts` (`baseSepolia` network)

## contracts/

- `contracts/Kiln1155.sol`
  - Inherits OpenZeppelin `ERC1155` and `Ownable`.
  - `MAX_SUPPLY = 1000` per token ID.
  - `uri(uint256 tokenId)` overrides base to return `<baseURI>/<tokenId>.json`.
  - `claim(uint256 id, uint256 amount)` mints to `msg.sender` with checks:
    - `id` must be 0–4
    - `totalMinted[id] + amount <= MAX_SUPPLY`

## Prerequisites

- Node.js 18+
- An account with funds on Base Sepolia
- A Base Sepolia RPC URL

## Install

```shell
pnpm i || yarn || npm i
```

## Build/Compile

```shell
npx hardhat compile
# or optimized build profile
npx hardhat compile --profile production
```

## Configure Base Sepolia

The `baseSepolia` network is defined in `hardhat.config.ts` and uses configuration variables:

- `BASE_SEPOLIA_RPC_URL`
- `BASE_SEPOLIA_PRIVATE_KEY`

Set them as environment variables before running commands:

```shell
export BASE_SEPOLIA_RPC_URL="https://base-sepolia.g.alchemy.com/v2/yourKey" \
       BASE_SEPOLIA_PRIVATE_KEY="0xYourPrivateKey"
```

Alternatively, you can use a shell env file (`.env`) and `export $(cat .env | xargs)` prior to commands.

## Deploy to Base Sepolia (Ignition)

The Ignition module `Kiln1155.ts` deploys the contract with a preconfigured IPFS base URI.

```shell
npx hardhat ignition deploy --network baseSepolia ignition/modules/Kiln1155.ts
```

Output will include the deployed `Kiln1155` address. Save it for interactions.

## Interact (examples)

Using Hardhat console with viem client (read-only sample):

```shell
npx hardhat console --network baseSepolia
```

```js
// in console
const [client, account] = await viem.getPublicClient();
// read the base URI (id 0 is ignored in override; it returns base)
// you can verify a token URI with tokenId, e.g., 0
```

Using `claim` requires writing a transaction from a funded account. You can add a small script or call via a dapp/wallet after deployment.

## Notes

- Base URI used at deployment is set in `ignition/modules/Kiln1155.ts`. Update it there if you host different metadata.
- The owner is set to the deployer via `Ownable(msg.sender)` in the constructor.
