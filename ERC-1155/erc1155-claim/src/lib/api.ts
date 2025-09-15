import type { NFT } from '../types/nft'

const API_BASE = 'https://mint-api-production-7d50.up.railway.app'

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  // Fetch all NFTs
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Accept': 'application/json' },
    ...init,
  })
  // If the response is not ok, throw an error
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`API ${res.status}: ${text || res.statusText}`)
  }
  // Return the JSON response
  return res.json() as Promise<T>
}
  
export function listNfts() {
  return http<NFT[]>('/nfts')
}

export function getNft(id: string) {
  return http<NFT>(`/nfts/${id}`)
}


