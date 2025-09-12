import { memo, useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { useNft } from '../hooks/useNfts'
import { useClaim } from '../hooks/useClaim'
import { useBalance } from '../hooks/useBalance'
import { resolveIpfsUrl } from '../lib/ipfs'
import ethLogo from '../assets/eth-logo.png'
import shareLogo from '../assets/share-logo.png'
import likeLogo from '../assets/like-logo.png'

export const DetailsPanel = memo(function DetailsPanel({ selectedId }: { selectedId: string | null }) {
  const { isConnected } = useAccount()
  const { data: selected, isLoading: loadingSelected } = useNft(selectedId || undefined)
  const { claim, isPending, isConfirming, isSuccess, error, hash } = useClaim()
  const { balance, refetch } = useBalance(selected ? parseInt(selected.id) : 0)
  const [localBalance, setLocalBalance] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [walletError, setWalletError] = useState(false)
  
  // Update local balance when contract balance changes
  useEffect(() => {
    setLocalBalance(balance)
  }, [balance])
  
  // Update local balance immediately when claim is successful
  useEffect(() => {
    if (isSuccess) {
      setLocalBalance(prev => prev + 1)
      setShowSuccess(true)
      // Also refetch to ensure accuracy
      refetch()
      
      // Reset success state after 15 seconds
      const timer = setTimeout(() => {
        setShowSuccess(false)
      }, 7500)
      
      return () => clearTimeout(timer)
    }
  }, [isSuccess, refetch])
  
  if (!selectedId && !selected) return <div className="text-slate-500">Select an NFT to view details</div>
  
  const handleClaim = () => {
    if (!isConnected) {
      setWalletError(true)
      // Clear wallet error after 5 seconds
      setTimeout(() => setWalletError(false), 5000)
      return
    }
    
    if (selected) {
      setWalletError(false)
      claim(parseInt(selected.id), 1)
    }
  }

  const handleShare = async () => {
    if (!selected) return

    const shareData = {
      title: selected.metadata.name,
      text: `Check out this NFT: ${selected.metadata.name}`,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href)
        alert('Link copied to clipboard!')
      }
    } catch (error) {
      console.error('Error sharing:', error)
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        alert('Link copied to clipboard!')
      } catch (clipboardError) {
        console.error('Error copying to clipboard:', clipboardError)
        alert('Unable to share. Please copy the URL manually.')
      }
    }
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    // Here we could add API call to save like state
  }
  return (
    <section>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6">
          <div className="aspect-square w-full border border-slate-200 bg-slate-100 overflow-hidden">
            {selected ? (
              <img src={resolveIpfsUrl(selected.metadata.image)} alt={selected.metadata.name} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full animate-pulse bg-slate-200" />
            )}
          </div>
        </div>
        <div className="lg:col-span-6 space-y-5">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-semibold">{selected?.metadata.name || (loadingSelected ? 'Loading…' : '')}</h1>
              <h1 className="text-slate-500 text-sm">You own {localBalance}</h1>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleShare}
                className="w-8 h-8 border border-slate-300 flex items-center justify-center hover:bg-slate-100 transition-colors"
                title="Share NFT"
              >
                <img src={shareLogo} alt="Share" className="w-4 h-4" />
              </button>
              <button 
                onClick={handleLike}
                className="w-8 h-8 border border-slate-300 flex items-center justify-center hover:bg-slate-100 transition-colors"
                title={isLiked ? 'Unlike NFT' : 'Like NFT'}
              >
                <div className={`w-4 h-4 ${isLiked ? 'text-red-500' : 'text-black'}`}>
                  <svg 
                    viewBox="0 0 24 24" 
                    fill={isLiked ? 'currentColor' : 'none'} 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    className="w-full h-full"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </div>
              </button>
            </div>
          </div>

          {/* Description */}
          {selected?.metadata.description && <p className="text-slate-500 leading-7">{selected.metadata.description}</p>}
          
          {/* Attributes */}
          {selected?.metadata.attributes?.length ? (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {selected.metadata.attributes.map((attr, i) => (
                  <div key={i} className="border border-slate-200 p-3">
                    <div className="text-xs text-slate-500 uppercase mb-2">{attr.trait_type}</div>
                    <div className="text-sm text-black">{attr.value}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          
          {/* Divider */}
          <div className="border-t border-slate-200"></div>
          
          {/* Free Mint and Price */}
          <div className="space-y-2">
            <div className="bg-black text-white px-3 py-1 text-xs w-fit">Free Mint</div>
            <div className="flex items-center gap-2">
              <img src={ethLogo} alt="ETH" className="w-3 h-5" />
              <span className="text-2xl font-semibold">0 ETH</span>
            </div>
          </div>
          
          {/* Status Section */}
          {(isPending || isConfirming || showSuccess || error || walletError) && (
            <div className="border border-slate-200 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {isPending && (
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {isConfirming && (
                    <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {isSuccess && (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  {(error || walletError) && (
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  )}
                </div>
                
                {/* Status Text */}
                <div className="flex-1">
                  {isPending && (
                    <div>
                      <p className="text-sm font-medium text-blue-600">Confirming Transaction</p>
                      <p className="text-xs text-slate-500">Please confirm the transaction in your wallet</p>
                    </div>
                  )}
                  {isConfirming && (
                    <div>
                      <p className="text-sm font-medium text-orange-600">Claiming NFT</p>
                      <p className="text-xs text-slate-500">Transaction is being processed on the blockchain</p>
                    </div>
                  )}
                  {showSuccess && (
                    <div>
                      <p className="text-sm font-medium text-green-600">Successfully Claimed!</p>
                      <p className="text-xs text-slate-500">Your NFT has been added to your wallet</p>
                    </div>
                  )}
                  {walletError && (
                    <div>
                      <p className="text-sm font-medium text-red-600">Wallet Not Connected</p>
                      <p className="text-xs text-slate-500">Connect your wallet to claim NFT</p>
                    </div>
                  )}
                  {error && !walletError && (
                    <div>
                      <p className="text-sm font-medium text-red-600">Transaction Failed</p>
                      <p className="text-xs text-slate-500">{error.message}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Claim Now Button */}
          <button 
            onClick={handleClaim}
            disabled={isPending || isConfirming}
            className={`w-full py-1 text-lg transition-all duration-200 ${
              isPending || isConfirming 
                ? 'bg-slate-400 cursor-not-allowed' 
                : showSuccess
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-black hover:bg-slate-800'
            } text-white`}
          >
            {isPending ? 'Confirming...' : isConfirming ? 'Claiming...' : showSuccess ? 'Claimed!' : 'Claim Now'}
          </button>
          
          {/* BaseScan Button - Show only on success */}
          {showSuccess && hash && (
            <a
              href={`https://sepolia.basescan.org/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-4 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View on BaseScan
            </a>
          )}
        </div>
      </div>
    </section>
  )
})


