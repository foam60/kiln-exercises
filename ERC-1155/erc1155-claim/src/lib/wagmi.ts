import { createConfig, http } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const RPC_URL = 'https://base-sepolia.g.alchemy.com/v2/Urw3rwRGWgSCUYIOhYrUy'

export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors: [injected()],
  transports: {
    [baseSepolia.id]: http(RPC_URL),
  },
})