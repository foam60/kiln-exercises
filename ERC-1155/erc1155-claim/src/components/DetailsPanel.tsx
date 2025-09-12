import { memo } from 'react'
import { useNft } from '../hooks/useNfts'
import { resolveIpfsUrl } from '../lib/ipfs'
import ethLogo from '../assets/eth-logo.png'

export const DetailsPanel = memo(function DetailsPanel({ selectedId }: { selectedId: string | null }) {
  const { data: selected, isLoading: loadingSelected } = useNft(selectedId || undefined)
  if (!selectedId && !selected) return <div className="text-slate-500">Select an NFT to view details</div>
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
          <h1 className="text-2xl font-semibold">{selected?.metadata.name || (loadingSelected ? 'Loading…' : '')}</h1>
          {selected?.metadata.description && <p className="text-slate-600 leading-7">{selected.metadata.description}</p>}
          {selected?.metadata.attributes?.length ? (
            <div>
              <div className="flex flex-wrap gap-4 items-start justify-start">
                {selected.metadata.attributes.map((attr, i) => (
                  <div key={i} className="border border-slate-200 px-8 py-5 text-left w-fit">
                    <div className="text-xs text-slate-500 uppercase mb-2 text-left">{attr.trait_type}</div>
                    <div className="text-sm text-black text-left">{attr.value}</div>
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
          
          {/* Claim Now Button */}
          <button className="w-full bg-black text-white py-1 text-lg hover:bg-slate-800">
            Claim Now
          </button>
        </div>
      </div>
    </section>
  )
})


