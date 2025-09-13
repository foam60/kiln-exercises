import { StrictMode, useCallback, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { wagmiConfig } from './lib/wagmi'
import './index.css'
import { useNfts } from './hooks/useNfts'
import App from './App.tsx'
import { DetailsPanel } from './components/DetailsPanel'
import { KilnCard } from './components/KilnCard'
import { NFTCarousel } from './components/NFTCarousel'

function Gallery() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { data, isLoading, error } = useNfts()

  // Initialize selection with the first NFT
  useEffect(() => {
    if (!selectedId && data && data.length > 0) {
      setSelectedId(data[0].id)
    }
  }, [data, selectedId])

  // Select handler
  const handleSelect = useCallback((id: string) => setSelectedId(id), [])

  if (isLoading) return <div className="text-slate-500">Loading NFTs…</div>
  if (error) return <div className="text-red-600">Failed to load NFTs</div>
  if (!data?.length) return <div className="text-slate-500">No NFTs found</div>

  return (
    <div className="space-y-10">
      {/* DetailsPanel */}
      <DetailsPanel selectedId={selectedId} />

      {/* KilnCard */}
      <KilnCard />

      {/* NFTCarousel */}
      <NFTCarousel data={data} selectedId={selectedId} onSelect={handleSelect} />
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Gallery /> },
      // { path: 'nfts/:id', element: <NftDetails /> }, // to be added next
    ],
  },
])

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
)
