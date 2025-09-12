// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title Kiln1155
 * @dev ERC1155 token contract with claim functionality
 * @notice This contract allows users to claim NFTs (token IDs 0-4) with a maximum supply limit per ID
 * @author Antoine Mousse
 */
contract Kiln1155 is ERC1155, Ownable {
    /// @notice Maximum supply limit per token ID
    /// @dev Prevents minting more than 1000 tokens per ID
    uint256 public constant MAX_SUPPLY = 1000;
    
    /// @notice Tracks total minted tokens for each ID
    /// @dev Maps token ID to total amount minted for that ID
    mapping(uint256 => uint256) public totalMinted;

    /**
     * @dev Constructor initializes the ERC1155 contract with base URI and sets owner
     * @param baseURI The base URI for token metadata
     */
    constructor(string memory baseURI) ERC1155(baseURI) Ownable(msg.sender) {}

    /**
     * @notice Override the uri function to return the correct metadata URI for each token
     * @dev Constructs the full metadata URI by appending the token ID to the base URI
     * @param tokenId The token ID to get metadata for
     * @return The full metadata URI for the token
     */
    function uri(uint256 tokenId) public view override returns (string memory) {
        return string(abi.encodePacked(super.uri(0), Strings.toString(tokenId), ".json"));
    }

    /**
     * @notice Allows users to claim tokens
     * @dev Mints tokens to the caller's address with supply validation
     * @param id The token ID to claim (must be 0-4)
     * @param amount The number of tokens to claim
     * 
     * Requirements:
     * - `id` must be less than 5 (valid token IDs are 0-4)
     * - `totalMinted[id] + amount` must not exceed MAX_SUPPLY
     * 
     * Emits:
     * - TransferSingle event from ERC1155
     */
    function claim(uint256 id, uint256 amount) external {
        // Validate token ID is within allowed range (0-4)
        require(id < 5, "Invalid token ID");
        
        // Check that claiming this amount won't exceed max supply for this ID
        require(totalMinted[id] + amount <= MAX_SUPPLY, "Max supply reached");

        // Update the total minted count for this token ID
        totalMinted[id] += amount;
        
        // Mint the tokens to the caller
        _mint(msg.sender, id, amount, "");
    }
}