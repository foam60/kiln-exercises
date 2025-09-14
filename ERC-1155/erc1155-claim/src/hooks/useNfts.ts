import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { listNfts, getNft } from '../lib/api'
import type { NFT } from '../types/nft'

export function useNfts() {
  return useQuery({
    queryKey: ['nfts'],
    queryFn: listNfts, // Fetch all NFTs
    placeholderData: keepPreviousData, // Keep previous data while fetching new data
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useNft(id: string | undefined) {
  return useQuery<NFT | null>({
    queryKey: ['nft', id],
    queryFn: async () => (id ? getNft(id) : null), // Fetch a single NFT by ID
    enabled: Boolean(id), // Only run the query if ID is provided
    placeholderData: keepPreviousData, // Keep previous data while fetching new data
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}