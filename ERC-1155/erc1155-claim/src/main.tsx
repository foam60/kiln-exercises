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
  const [selectedId, setSelectedId] = useState<string | null>(null) // Selected NFT ID
  const { data, isLoading, error } = useNfts() // NFTs data

  // Initialize selection with the first NFT
  useEffect(() => {
    if (!selectedId && data && data.length > 0) {
      setSelectedId(data[0].id)
    }
  }, [data, selectedId])

  // Select handler
  const handleSelect = useCallback((id: string) => setSelectedId(id), [])

  if (isLoading) return <div className="text-slate-500">Loading NFTs…</div> // If loading, show a loading message
  if (error) return <div className="text-red-600">Failed to load NFTs</div> // If error, show a error message
  if (!data?.length) return <div className="text-slate-500">No NFTs found</div> // If no NFTs found, show a message

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

const router = createBrowserRouter([ // Router configuration
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Gallery /> },
    ],
  },
])

const queryClient = new QueryClient({ // Query client configuration
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
})

createRoot(document.getElementById('root')!).render( // Render the app
  <StrictMode> 
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
)