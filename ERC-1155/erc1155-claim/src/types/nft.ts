export interface NFTAttribute {
  trait_type: string
  value: string
}

export interface NFTMetadata {
  name: string
  description: string
  image: string
  attributes: NFTAttribute[]
}

export interface NFT {
  chainId: number
  id: string
  metadata: NFTMetadata
  tokenAddress: string
  tokenURI: string
  type: string
}


