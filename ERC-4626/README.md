# ERC-4626 Vault Implementation

A comprehensive implementation of the ERC-4626 tokenized vault standard, featuring a simple vault that accepts USDK tokens and mints vUSDK shares in return.

## 🏗️ Project Structure

```
ERC-4626/
├── erc4626-vault/          # Foundry smart contract project
│   └── src/
│       ├── SimpleERC4626.sol   # ERC-4626 vault implementation
│       └── USDK.sol            # ERC-20 token for testing
├── tests/
│   └── deposit.test.ts         # Comprehensive test suite
├── index.ts                    # Main deposit function implementation
├── package.json
└── README.md
```

## 🚀 Installation

Install dependencies using Bun:

```bash
bun install
```

## 🔨 Building Smart Contracts

Before running tests, you need to build the smart contracts using Foundry:

```bash
cd erc4626-vault
forge build
cd ..
```

This compiles the Solidity contracts and generates the necessary artifacts that the TypeScript tests depend on.

## 🚀 Starting Local Blockchain

The tests run against a local Anvil node. Start Anvil in a new terminal:

```bash
cd erc4626-vault
anvil
```

This will start a local Ethereum node on `http://127.0.0.1:8545` with pre-funded test accounts.

## 🧪 Running Tests

Run the complete test suite with coverage:

```bash
bun test --coverage
```

This will execute all tests and provide coverage information for the TypeScript code.


## 📋 Smart Contracts

### USDK.sol - Test Token
```solidity
contract USDK is ERC20 {
    constructor(uint256 initialSupply) ERC20("USD Kiln", "USDK") {
        _mint(msg.sender, initialSupply);
    }
}
```

**Purpose**: A simple ERC-20 token used for testing the vault functionality.
- **Name**: USD Kiln
- **Symbol**: USDK
- **Features**: Standard ERC-20 implementation with initial supply minting

### SimpleERC4626.sol - Vault Implementation
```solidity
contract SimpleERC4626 is ERC4626 {
    constructor(ERC20 asset)
        ERC20("Vault USDK", "vUSDK")
        ERC4626(asset)
    {}
}
```

**Purpose**: An ERC-4626 compliant tokenized vault that accepts USDK tokens and mints vUSDK shares.
- **Name**: Vault USDK
- **Symbol**: vUSDK
- **Features**: 
  - Accepts USDK as the underlying asset
  - Mints vUSDK shares when users deposit
  - Implements all ERC-4626 standard functions
  - Built on OpenZeppelin's ERC4626 implementation

## 📁 Core Files

### index.ts - Deposit Function Implementation

The main TypeScript file containing the core deposit functionality:

**Key Features**:
- **Error Handling**: Custom error classes for different failure scenarios
  - `NotEnoughBalanceError`: When user doesn't have sufficient USDK balance
  - `MissingAllowanceError`: When vault doesn't have enough allowance
  - `AmountExceedsMaxDepositError`: When deposit amount exceeds vault limits
- **Validation**: Comprehensive pre-deposit checks
  - Balance verification
  - Allowance verification
  - Max deposit limit checking
- **Transaction Building**: Creates properly encoded deposit transactions

**Main Function**:
```typescript
export async function deposit(
    client: PublicClient,
    { wallet, vault, amount }: DepositParams,
): Promise<Transaction>
```

### deposit.test.ts - Comprehensive Test Suite

Test suite covering all aspects of the vault functionality:

**Test Coverage**:
1. **Successful Deposit**: Tests normal deposit flow with balance tracking
2. **Multi-User Deposits**: Compares deposits from different users to ensure fairness
3. **Error Scenarios**: Tests all error conditions
   - Insufficient balance
   - Missing allowance
   - Amount exceeding max deposit

**Key Test Features**:
- **Real Transaction Execution**: Tests actually send transactions to a local Anvil node
- **Balance Tracking**: Monitors USDK and vUSDK balances before/after transactions
- **Detailed Logging**: Detailed console output showing transaction details
- **Multi-User Testing**: Verifies that different users receive fair share amounts


## 📚 ERC-4626 Standard

The ERC-4626 standard defines a tokenized vault that:
- Accepts deposits of an underlying asset (USDK in this case)
- Mints shares (vUSDK) representing the user's portion of the vault
- Allows withdrawals by burning shares and returning the underlying asset

This implementation provides a solid foundation for building more complex vault strategies while maintaining compatibility with the ERC-4626 standard.

## 🔒 Security Considerations

### ⚠️ Most Common Attack: Donation Attack (Share Price Manipulation)

**How the Attack Works**:
1. **Attacker monitors mempool** for large deposit transactions
2. **Front-runs the deposit** by directly transferring assets to the vault (donation)
3. **Victim's deposit executes** but receives fewer shares due to inflated share price
4. **Attacker immediately withdraws** their donation, profiting from the price manipulation

**Example Scenario**:
```
Initial state: Vault has 1000 USDK, 1000 vUSDK shares (1:1 ratio)
1. User wants to deposit 1000 USDK (expects 1000 vUSDK shares)
2. Attacker front-runs: donates 1000 USDK to vault
3. New state: 2000 USDK, 1000 vUSDK shares (2:1 ratio)
4. User's deposit: 1000 USDK → only gets 500 vUSDK shares (50% loss!)
5. Attacker withdraws: 1000 USDK back (no loss, pure profit)
```

**Why This Attack Works**:
- ERC-4626 uses `totalAssets() / totalSupply()` for share price calculation
- Direct transfers to vault increase `totalAssets()` without minting shares
- This artificially inflates the share price, reducing shares received by legitimate depositors

**Mitigation Strategies**:
- **Virtual shares/assets**: Use virtual accounting to prevent donation manipulation
- **Minimum deposit amounts**: Require significant deposits to make attacks unprofitable
- **Time-weighted pricing**: Use TWAP (Time-Weighted Average Price) for share calculations
- **Access controls**: Restrict direct transfers to the vault
- **Deposit caps**: Limit maximum deposit amounts per transaction

### 🛡️ Other Security Considerations

**Important Security Notes**:
- **This implementation is vulnerable to donation attacks** - direct transfers to vault will manipulate share prices
- **No access controls** are implemented - anyone can deposit/withdraw without restrictions
- **No yield generation** - this vault simply holds the underlying asset without generating returns
- **No emergency pause mechanism** - consider implementing pause functionality for production use
- **No maximum deposit limits** - users can deposit unlimited amounts (subject to their balance)
- **No withdrawal fees or timelocks** - consider adding these for production vaults
- **Audit required** - any production deployment should undergo professional security auditing
