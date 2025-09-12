import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import Kiln1155ABI from '../abi/Kiln1155.json'

const CONTRACT_ADDRESS = '0x4b37bEa1E4049dC2bD9d12EB2E0Df4792E4a5440'

export function useClaim() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const claim = (tokenId: number, amount: number = 1) => {
    writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: Kiln1155ABI,
      functionName: 'claim',
      args: [BigInt(tokenId), BigInt(amount)],
    })
  }

  return {
    claim,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  }
}
