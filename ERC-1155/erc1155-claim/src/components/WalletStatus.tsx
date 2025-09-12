import { useAccount, useBalance, useConnect, useDisconnect } from 'wagmi'

export function WalletStatus() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending: isConnecting } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({
    address,
    query: { enabled: Boolean(address) },
  })

  if (!isConnected) {
    const injected = connectors.find(c => c.id === 'injected') ?? connectors[0]
    return (
      <button
        className="bg-slate-900 text-white px-3 py-1.5 text-sm hover:bg-slate-800"
        onClick={() => connect({ connector: injected })}
        disabled={isConnecting}
      >
        {isConnecting ? 'Connecting…' : 'Connect Wallet'}
      </button>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <div className="text-sm text-slate-700">
        {balance ? `${new Intl.NumberFormat(undefined, { maximumSignificantDigits: 5 }).format(Number(balance.formatted))} ${balance.symbol}` : '—'}
      </div>
      <div className="text-sm text-slate-500 hidden sm:block">{address?.slice(0, 6)}…{address?.slice(-4)}</div>
      <button className="border border-slate-200 px-3 py-1.5 text-sm" onClick={() => disconnect()}>
        Disconnect
      </button>
    </div>
  )
}