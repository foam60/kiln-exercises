export function KilnCard() {
  return (
    <section>
      <div className="rounded-xl border border-slate-200 p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="/src/assets/kiln-logo.png" alt="Kiln" className="h-8 w-auto" />
          <div>
            <div className="font-medium">Kiln</div>
            <div className="text-sm text-slate-600">Staking infrastructure and Web3 tooling.</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href="https://twitter.com/kiln_finance" target="_blank" className="text-brand-600 hover:text-brand-700 text-sm">Twitter</a>
          <a href="https://instagram.com" target="_blank" className="text-brand-600 hover:text-brand-700 text-sm">Instagram</a>
        </div>
      </div>
    </section>
  )
}


