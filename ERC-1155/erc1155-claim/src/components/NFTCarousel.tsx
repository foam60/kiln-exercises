import { memo, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { resolveIpfsUrl } from '../lib/ipfs'
import { getNft } from '../lib/api'
import type { useNfts } from '../hooks/useNfts'

export const NFTCarousel = memo(function NFTCarousel({ data, selectedId, onSelect }: { data: ReturnType<typeof useNfts>['data']; selectedId: string | null; onSelect: (id: string) => void }) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()
  if (!data?.length) return null
  
  // Filter out the selected NFT and limit to 4 items
  const filteredData = data.filter(nft => nft.id !== selectedId).slice(0, 4)
  
  return (
    <section className="mx-auto max-w-[1200px] w-full px-0">
      <h2 className="text-lg font-semibold mb-3">More from this collection</h2>
      <div ref={carouselRef} className="w-full flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 scrollbar-hide">
        {filteredData.map((nft) => (
          <button
            key={nft.id}
            onClick={() => onSelect(nft.id)}
            onMouseEnter={() => queryClient.prefetchQuery({ queryKey: ['nft', nft.id], queryFn: () => getNft(nft.id) })}
            className={`w-[calc(25%-18px)] lg:w-[calc(25%-18px)] flex-shrink-0 snap-start border overflow-hidden text-left ${
              selectedId === nft.id ? 'border-brand-500' : 'border-slate-200'
            }`}
          >
            <img src={resolveIpfsUrl(nft.metadata.image)} alt={nft.metadata.name} className="aspect-square w-full object-cover bg-slate-100 transition-transform duration-300 hover:scale-105" />
            <div className="p-3">
              <div className="text-l font-medium">{nft.metadata.name}</div>
              <div className="text-sm font-medium text-slate-500">0.0 ETH</div>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
})