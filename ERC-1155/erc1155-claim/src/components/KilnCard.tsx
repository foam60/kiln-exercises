import kilnLogo from '../assets/kiln-logo.png'
import xLogo from '../assets/x-logo.png'
import instagramLogo from '../assets/instagram-logo.png'
import verifiedLogo from '../assets/verified-logo.png'
import arrowLogo from '../assets/arrow.png'

export function KilnCard() {
  return (
    <section>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"> 
        <div className="lg:col-span-6">
          <div className="border border-slate-200 p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="relative">
              <img src={kilnLogo} alt="Kiln" className="h-12 w-12 rounded-full object-contain border border-slate-200" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4">
                <img src={verifiedLogo} alt="Verified" className="w-4 h-4" />
              </div>
            </div>
            <div className="text-left">
              <div className="text-2xl font-medium">KILN</div>
              <div className="text-l text-slate-500">@Kiln</div>
            </div>
          </div>
          <p className="text-sm text-slate-600 mb-4 leading-relaxed">
            Hundreds of companies use Kiln to earn rewards on their digital assets, or to whitelabel earning functionality into their products.
          </p>
          <div className="flex items-center gap-4 mb-4">
            <a href="https://twitter.com/kiln_finance" target="_blank" className="flex items-center gap-2 text-black hover:text-slate-800">
              <img src={xLogo} alt="X" className="w-5 h-5" />
              <span className="text-base">@Kiln</span>
            </a>
            <a href="https://instagram.com" target="_blank" className="flex items-center gap-2 text-black hover:text-slate-800">
              <img src={instagramLogo} alt="Instagram" className="w-5 h-5" />
              <span className="text-base">@Kiln</span>
            </a>
          </div>
          <div className="flex items-center gap-2">
            <a href="https://kiln.fi" target="_blank" className="flex-1 bg-black text-white px-4 py-2 text-sm hover:bg-slate-800 text-center">
              Website
            </a>
            <div className="w-9 h-9 flex items-center justify-center border border-slate-200">
              <img src={arrowLogo} alt="External link" className="w-5 h-5" />
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  )
}


