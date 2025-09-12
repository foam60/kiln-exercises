import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * @file Kiln1155 Ignition Module
 * @description Hardhat Ignition deployment module for the Kiln1155 ERC1155 contract
 * @author Antoine Mousse
 */

/**
 * @dev Builds the Kiln1155 deployment module
 * @description This module deploys the Kiln1155 contract with the specified base URI
 * @returns The deployed Kiln1155 contract instance
 */
export default buildModule("Kiln1155Module", (m) => {
  // IPFS base URI for token metadata
  // This URI points to the metadata folder containing JSON files for tokens 0-4
  const baseURI = "ipfs://bafybeigibb4ce5dahgzrnuq2etx6yueod5popsdlo657d2lw3u2mtdml64/";
  
  // Deploy the Kiln1155 contract with the base URI as constructor parameter
  const kiln1155 = m.contract("Kiln1155", [baseURI]);

  // Optional: Uncomment to automatically claim a token during deployment
  // This would mint token ID 0 with amount 1 to the deployer
  // m.call(kiln1155, "claim", [0, 1n]);

  // Return the contract instance for use in other modules or scripts
  return { kiln1155 };
});