import { encodeAbiParameters, parseAbiParameters } from "viem";

/**
 * Script to generate ABI-encoded constructor arguments for contract verification
 * Usage: npx hardhat run scripts/getConstructorArgs.ts
 */

async function main() {
  // The base URI used in the contract deployment
  const baseURI = "ipfs://bafybeigibb4ce5dahgzrnuq2etx6yueod5popsdlo657d2lw3u2mtdml64/";
  
  console.log("Base URI:", baseURI);
  console.log("");
  
  // ABI-encode the constructor arguments
  // The constructor takes a single string parameter (baseURI)
  const encodedArgs = encodeAbiParameters(
    parseAbiParameters("string"),
    [baseURI]
  );
  
  console.log("ABI-encoded constructor arguments:");
  console.log(encodedArgs);
  console.log("");
  console.log("Use this for contract verification:");
  console.log(`--constructor-args ${encodedArgs}`);
  console.log("");
  console.log("Or for Hardhat verify:");
  console.log(`npx hardhat verify --constructor-args ${encodedArgs} <CONTRACT_ADDRESS> --network baseSepolia`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
