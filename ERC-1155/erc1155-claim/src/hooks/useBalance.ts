import { useReadContract, useAccount } from 'wagmi'
import Kiln1155ABI from '../abi/Kiln1155.json'

const CONTRACT_ADDRESS = '0x285C8b243838dA7Fe80EE161834a3f54f9f29e5c'

export function useBalance(tokenId: number) {
  const { address } = useAccount() // Wallet address
  
  const { data: balance, refetch } = useReadContract({ // Wallet balance
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: Kiln1155ABI,
    functionName: 'balanceOf',
    args: address ? [address, BigInt(tokenId)] : undefined,
    query: {
      enabled: !!address,
    },
  })

  return { // Return the balance and refetch function
    balance: balance ? Number(balance) : 0,
    refetch,
  }
}
