import { Outlet, Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from './language-switcher'
import { Phone, MapPin } from 'lucide-react'

export function PublicLayout() {
  const { companySlug } = useParams<{ companySlug: string }>()
  const { t } = useTranslation()
  const base = `/${companySlug}`

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to={base} className="text-xl font-bold text-blue-600">
            {t('app.name')}
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to={`${base}/cars`} className="text-sm font-medium text-gray-600 hover:text-blue-600">
              {t('public.browseCars')}
            </Link>
            <Link to={`${base}/offers`} className="text-sm font-medium text-gray-600 hover:text-blue-600">
              {t('public.offers')}
            </Link>
            <Link to={`${base}/book`} className="text-sm font-medium text-gray-600 hover:text-blue-600">
              {t('public.bookAppointment')}
            </Link>
            <Link to={`${base}/contact`} className="text-sm font-medium text-gray-600 hover:text-blue-600">
              {t('public.contact')}
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">{t('app.name')}</h3>
              <p className="text-sm">{t('app.tagline')}</p>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-3">{t('public.contact')}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> +966 50 000 0000</div>
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Riyadh, Saudi Arabia</div>
              </div>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-3">{t('nav.cars')}</h4>
              <div className="space-y-2 text-sm">
                <Link to={`${base}/cars`} className="block hover:text-white">{t('public.browseCars')}</Link>
                <Link to={`${base}/offers`} className="block hover:text-white">{t('public.offers')}</Link>
                <Link to={`${base}/book`} className="block hover:text-white">{t('public.bookAppointment')}</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-xs">
            <p>&copy; 2024 {t('app.name')}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
