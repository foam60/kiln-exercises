import { useAccount, useBalance, useConnect, useDisconnect } from 'wagmi'

export function WalletStatus() {
  const { address, isConnected } = useAccount() // Wallet address and connection status
  const { connect, connectors, isPending: isConnecting } = useConnect() // Wallet connection and connectors
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({ // Wallet balance
    address,
    query: { enabled: Boolean(address) },
  })

  // If the wallet is not connected, show the connect button
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

  // If the wallet is connected, show the balance and address
  return (
    <div className="flex items-center gap-3">
      {/* Wallet Balance */}
      <div className="text-sm text-slate-700">
        {balance ? `${new Intl.NumberFormat(undefined, { maximumSignificantDigits: 3 }).format(Number(balance.formatted))} ${balance.symbol}` : '—'}
      </div>
      {/* Wallet Address */}
      <div className="text-sm text-slate-500 hidden sm:block">{address?.slice(0, 6)}…{address?.slice(-4)}</div>
      {/* Disconnect Button */}
      <button className="border border-slate-200 px-3 py-1.5 text-sm" onClick={() => disconnect()}>
        Disconnect
      </button>
    </div>
  )
}