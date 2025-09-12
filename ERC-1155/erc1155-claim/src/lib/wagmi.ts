import { createConfig, http } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const RPC_URL = import.meta.env.VITE_BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org'

export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors: [injected()],
  transports: {
    [baseSepolia.id]: http(RPC_URL),
  },
})

// Debug: log RPC and chain config at startup
// eslint-disable-next-line no-console
console.log('[wagmi] chainId:', baseSepolia.id, 'rpc:', RPC_URL)


