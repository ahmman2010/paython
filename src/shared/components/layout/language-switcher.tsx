import { useLanguage } from '@/shared/hooks/useLanguage'
import { Globe } from 'lucide-react'

export function LanguageSwitcher() {
  const { currentLanguage, toggleLanguage } = useLanguage()

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
      aria-label="Switch language"
    >
      <Globe className="h-4 w-4" />
      <span>{currentLanguage === 'ar' ? 'EN' : 'عربي'}</span>
    </button>
  )
}
