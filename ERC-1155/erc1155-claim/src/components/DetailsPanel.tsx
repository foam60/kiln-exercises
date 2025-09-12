import { memo } from 'react'
import { useNft } from '../hooks/useNfts'
import { resolveIpfsUrl } from '../lib/ipfs'

export const DetailsPanel = memo(function DetailsPanel({ selectedId }: { selectedId: string | null }) {
  const { data: selected, isLoading: loadingSelected } = useNft(selectedId || undefined)
  if (!selectedId && !selected) return <div className="text-slate-500">Select an NFT to view details</div>
  return (
    <section>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6">
          <div className="aspect-square w-full rounded-xl border border-slate-200 bg-slate-100 overflow-hidden">
            {selected ? (
              <img src={resolveIpfsUrl(selected.metadata.image)} alt={selected.metadata.name} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full animate-pulse bg-slate-200" />
            )}
          </div>
        </div>
        <div className="lg:col-span-6 space-y-5">
          <div>
            <div className="text-sm text-slate-500">{selected ? `#${selected.id}` : ''}</div>
            <h1 className="text-2xl font-semibold">{selected?.metadata.name || (loadingSelected ? 'Loading…' : '')}</h1>
          </div>
          {selected?.metadata.description && <p className="text-slate-600 leading-7">{selected.metadata.description}</p>}
          {selected?.metadata.attributes?.length ? (
            <div>
              <div className="text-sm font-medium mb-2">Attributes</div>
              <div className="flex flex-wrap gap-2">
                {selected.metadata.attributes.map((attr, i) => (
                  <div key={i} className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-700">
                    <span className="font-medium mr-1">{attr.trait_type}:</span>
                    <span>{attr.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          <div className="flex items-center justify-between pt-2">
            <div className="text-lg font-semibold">Price: Free</div>
            <button className="inline-flex items-center justify-center rounded-lg bg-brand-600 text-white px-4 py-2 hover:bg-brand-700">Mint</button>
          </div>
        </div>
      </div>
    </section>
  )
})


