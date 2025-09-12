import { useReadContract, useAccount } from 'wagmi'
import Kiln1155ABI from '../abi/Kiln1155.json'

const CONTRACT_ADDRESS = '0x4b37bEa1E4049dC2bD9d12EB2E0Df4792E4a5440'

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
