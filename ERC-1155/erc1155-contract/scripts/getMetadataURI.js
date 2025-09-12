// Simple script to get metadata URI for NFT token ID 4
import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";

async function main() {
  // Contract address from deployed_addresses.json
  const contractAddress = "0x285C8b243838dA7Fe80EE161834a3f54f9f29e5c";
  
  // Create a public client for Base Sepolia
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http("https://sepolia.base.org")
  });
  
  console.log("Contract Address:", contractAddress);
  console.log("Network: Base Sepolia");
  console.log("");
  
  try {
    // Get the URI for token ID 4
    const tokenId = 4n; // Use BigInt for token ID
    const uri = await publicClient.readContract({
      address: contractAddress,
      abi: [
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "uri",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ],
      functionName: "uri",
      args: [tokenId]
    });
    
    console.log(`Metadata URI for Token ID ${tokenId}:`);
    console.log(uri);
    console.log("");
    
    
  } catch (error) {
    console.error("Error fetching metadata URI:", error.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
