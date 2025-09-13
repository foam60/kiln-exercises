import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { listNfts, getNft } from '../lib/api'
import type { NFT } from '../types/nft'

export function useNfts() {
  return useQuery({
    queryKey: ['nfts'],
    queryFn: listNfts,
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useNft(id: string | undefined) {
  return useQuery<NFT | null>({
    queryKey: ['nft', id],
    queryFn: async () => (id ? getNft(id) : null),
    enabled: Boolean(id),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}