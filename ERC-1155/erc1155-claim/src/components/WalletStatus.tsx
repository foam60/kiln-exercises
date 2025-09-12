import { useEffect } from 'react'
import { useAccount, useBalance, useChainId, useConnect, useDisconnect, useSwitchChain } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
// import { RPC_URL } from '../lib/wagmi'

export function WalletStatus() {
  const { address, isConnected, chain } = useAccount()
  const chainId = useChainId()
  const { connect, connectors, isPending: isConnecting, error: connectError } = useConnect({
    onSuccess: (data) => {
      const connectedChainId = data.chainId
      if (connectedChainId !== baseSepolia.id) {
        switchChain({ chainId: baseSepolia.id })
      }
    },
  })
  const { disconnect } = useDisconnect()
  const { switchChain, isPending: isSwitching } = useSwitchChain()
  const { data: balance } = useBalance({
    address,
    chainId: baseSepolia.id,
    query: { enabled: Boolean(address) },
  })

  // Ask to change network if already connected but on wrong chain
  useEffect(() => {
    if (isConnected && chainId && chainId !== baseSepolia.id) {
      switchChain({ chainId: baseSepolia.id })
    }
  }, [isConnected, chainId, switchChain])

  if (!isConnected) {
    const injected = connectors.find(c => c.id === 'injected') ?? connectors[0]
    return (
      <button
        className="rounded-lg bg-slate-900 text-white px-3 py-1.5 text-sm hover:bg-slate-800"
        onClick={() => connect({ connector: injected, chainId: baseSepolia.id })}
        disabled={isConnecting}
      >
        {isConnecting ? 'Connecting…' : 'Connect Wallet'}
      </button>
    )
  }

  const onWrongChain = chainId !== baseSepolia.id

  return (
    <div className="flex items-center gap-3">
      {onWrongChain ? (
        <button
          className="rounded-lg bg-amber-500 text-white px-3 py-1.5 text-sm hover:bg-amber-600"
          onClick={() => switchChain({ chainId: baseSepolia.id })}
          disabled={isSwitching}
        >
          {isSwitching ? 'Switching…' : 'Switch to Base Sepolia'}
        </button>
      ) : (
        <div className="text-sm text-slate-700">
          {balance ? `${new Intl.NumberFormat(undefined, { maximumSignificantDigits: 5 }).format(Number(balance.formatted))} ${balance.symbol}` : '—'}
        </div>
      )}
      {/* <span className="text-xs text-slate-400 hidden md:inline">(chain {chainId} | rpc {RPC_URL})</span> */}
      <div className="text-sm text-slate-500 hidden sm:block">{address?.slice(0, 6)}…{address?.slice(-4)}</div>
      <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm" onClick={() => disconnect()}>
        Disconnect
      </button>
    </div>
  )
}


