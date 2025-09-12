import { Outlet, NavLink } from 'react-router-dom'
import kilnLogo from './assets/kiln-logo.png'
import './index.css'

function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-[1200px] w-full px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={kilnLogo} alt="Kiln" className="h-7 w-auto" />
        </div>
        <nav className="flex items-center gap-6 text-sm">
          <NavLink to="/" className={({isActive}) => isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'}>
            Gallery
          </NavLink>
        </nav>
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
    </div>
  )
}
