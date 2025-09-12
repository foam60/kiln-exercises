import { useReadContract, useAccount } from 'wagmi'
import Kiln1155ABI from '../abi/Kiln1155.json'

const CONTRACT_ADDRESS = '0x285C8b243838dA7Fe80EE161834a3f54f9f29e5c'

export function useBalance(tokenId: number) {
  const { address } = useAccount()
  
  const { data: balance, refetch } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: Kiln1155ABI,
    functionName: 'balanceOf',
    args: address ? [address, BigInt(tokenId)] : undefined,
    query: {
      enabled: !!address,
    },
  })

  return {
    balance: balance ? Number(balance) : 0,
    refetch,
  }
}
