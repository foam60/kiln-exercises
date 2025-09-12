import { memo, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { resolveIpfsUrl } from '../lib/ipfs'
import { getNft } from '../lib/api'
import type { useNfts } from '../hooks/useNfts'

export const NFTCarousel = memo(function NFTCarousel({ data, selectedId, onSelect }: { data: ReturnType<typeof useNfts>['data']; selectedId: string | null; onSelect: (id: string) => void }) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()
  const scrollBy = (delta: number) => {
    const el = carouselRef.current
    if (!el) return
    el.scrollBy({ left: delta, behavior: 'smooth' })
  }
  if (!data?.length) return null
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">All NFTs</h2>
        <div className="flex gap-2">
          <button onClick={() => scrollBy(-400)} className="rounded-md border border-slate-200 px-3 py-1 text-sm">Prev</button>
          <button onClick={() => scrollBy(400)} className="rounded-md border border-slate-200 px-3 py-1 text-sm">Next</button>
        </div>
      </div>
      <div ref={carouselRef} className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2">
        {data.map((nft) => (
          <button
            key={nft.id}
            onClick={() => onSelect(nft.id)}
            onMouseEnter={() => queryClient.prefetchQuery({ queryKey: ['nft', nft.id], queryFn: () => getNft(nft.id) })}
            className={`min-w-[200px] max-w-[200px] snap-start rounded-xl border overflow-hidden text-left ${
              selectedId === nft.id ? 'border-brand-500' : 'border-slate-200'
            }`}
          >
            <img src={resolveIpfsUrl(nft.metadata.image)} alt={nft.metadata.name} className="aspect-square w-full object-cover bg-slate-100" />
            <div className="p-3">
              <div className="text-xs text-slate-500">#{nft.id}</div>
              <div className="text-sm font-medium truncate">{nft.metadata.name}</div>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
})


