import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import Kiln1155ABI from '../abi/Kiln1155.json'

const CONTRACT_ADDRESS = '0x285C8b243838dA7Fe80EE161834a3f54f9f29e5c'

export function useClaim() {
  const { writeContract, data: hash, isPending, error } = useWriteContract() 
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ // Transaction status
    hash,
  })

  const claim = (tokenId: number, amount: number = 1) => { // Claim function
    writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: Kiln1155ABI,
      functionName: 'claim',
      args: [BigInt(tokenId), BigInt(amount)],
    })
  }

  return { // Return the claim function and transaction status
    claim,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  }
}
