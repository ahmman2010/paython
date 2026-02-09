import { useTranslation } from 'react-i18next'
import { useCallback, useEffect } from 'react'

export function useLanguage() {
  const { i18n } = useTranslation()

  const isRtl = i18n.language === 'ar'
  const currentLanguage = i18n.language as 'en' | 'ar'

  const toggleLanguage = useCallback(() => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar'
    i18n.changeLanguage(newLang)
    localStorage.setItem('language', newLang)
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = newLang
  }, [i18n])

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr'
    document.documentElement.lang = currentLanguage
  }, [isRtl, currentLanguage])

  return { isRtl, currentLanguage, toggleLanguage }
}
