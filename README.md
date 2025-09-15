## Kiln Exercises

This repository contains multiple independent exercises and sample projects. Use the sections below to navigate and run each one.

### Repository structure

- `ERC-1155/erc1155-contract` — Hardhat 3 project with an ERC‑1155 contract (`Kiln1155`) and tests.
- `ERC-1155/erc1155-claim.md` — Frontend dApp exercise spec to build an ERC‑1155 minting UI on Base Sepolia.
- `ERC-4626/erc4626-deposit.md` — Backend/util exercise spec to implement a `deposit` helper for ERC‑4626 vaults using viem.

### ERC‑1155 contract project

Folder: `ERC-1155/erc1155-contract`

- Contract: `contracts/Kiln1155.sol` — claimable ERC‑1155 with `MAX_SUPPLY` per ID and `uri(id)` override.
- Deployment: Ignition module `ignition/modules/Kiln1155.ts` targeting Base Sepolia (`baseSepolia` network in `hardhat.config.ts`).
- Tests: `test/Kiln1155.node.test.ts` using `node:test` + Hardhat viem.

Common commands (run inside `ERC-1155/erc1155-contract`):

```bash
npm i
npx hardhat compile
npx hardhat test
# configure Base Sepolia via Hardhat keystore
npx hardhat keystore set BASE_SEPOLIA_RPC_URL
npx hardhat keystore set BASE_SEPOLIA_PRIVATE_KEY
# deploy to Base Sepolia
npx hardhat ignition deploy --network baseSepolia ignition/modules/Kiln1155.ts
```

### ERC‑1155 dApp exercise

Spec: `ERC-1155/erc1155-claim.md`

- Build a React + TypeScript dApp to browse and mint the ERC‑1155 NFTs on Base Sepolia.
- Uses a provided API for gallery data and wallet interactions via Wagmi/Viem.

Simple structure (suggested):

```
erc1155-dapp/
├─ src/
│  ├─ components/         # Gallery, NFTCard, WalletStatus, ClaimButton
│  ├─ hooks/              # useWallet, useClaim, useNfts
│  ├─ lib/                # wagmi/viem client, contract config
│  ├─ abi/                # contract ABIs (Kiln1155.json)
│  ├─ types/              # TypeScript types (NFT, API responses)
│  ├─ assets/             # static assets (logos, icons, images)
│  ├─ pages/              # routes (Home, Details)
│  └─ main.tsx            # app bootstrap
├─ public/
├─ index.html
├─ package.json
└─ tsconfig.json
```

Common commands (run inside your dApp folder):

```bash
npm i
npm run dev
```

### ERC‑4626 deposit exercise

Spec: `ERC-4626/erc4626-deposit.md`

- Implement a `deposit` function for an ERC‑4626-compliant vault using viem.
- Provide tests with Anvil.

Structure:

```
ERC-4626/
├─ erc4626-vault/         # Foundry project
│  ├─ src/                # Solidity contracts (USDK.sol, SimpleERC4626.sol)
│  ├─ test/               # Foundry Solidity tests
│  └─ out/                # Built artifacts used by TypeScript (after forge build)
├─ index.ts               # deposit() implementation building a tx for vault.deposit
├─ tests/
│  ├─ simple-deposit.test.ts
│  └─ deposit.test.ts     # runs against local Anvil
├─ bunfig.toml, package.json, tsconfig.json
└─ README.md              # detailed instructions
```

Run locally:

```bash
cd ERC-4626
bun install
# build contracts (artifacts consumed by index.ts)
cd erc4626-vault && forge install && forge build && cd ..
# start local chain (new terminal)
cd erc4626-vault && anvil
# run tests with coverage
bun test --coverage

# run only the deposit test file
bun test tests/deposit.test.ts --coverage
```

### Notes

- Each exercise is self-contained; follow the respective README/spec inside its folder.
- The contract project README in `ERC-1155/erc1155-contract/README.md` includes network config and deployment details.