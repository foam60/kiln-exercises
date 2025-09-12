import { Outlet } from 'react-router-dom'
import kilnLogo from './assets/kiln-logo.png'
import './index.css'
import { WalletStatus } from './components/WalletStatus'

function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-[1400px] w-full px-16 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={kilnLogo} alt="Kiln" className="h-8 w-auto" />
        </div>
        <nav className="flex items-center gap-6 text-sm" />
        <WalletStatus />
      </div>
    </header>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <main className="mx-auto max-w-[1200px] w-full px-6 py-10">
        <Outlet />
      </main>
      <footer className="mt-10 bg-black text-white">
        <div className="mx-auto max-w-[1200px] w-full px-6 py-6 text-sm text-center">
          <p>All rights reserved.</p>
          <p>Kiln Fullstack Team, Inc 2025</p>
        </div>
      </footer>
    </div>
  )
}
