import { useTranslation } from 'react-i18next'

import { DropdownMenuCheckboxItem } from '../../ui/dropdown-menu'

import { useAppActions, useAppStore } from '@/store/AppStore'
import FlagGermany from '@/assets/flag_germany_32x32.png'
import FlagUnitedKingdom from '@/assets/flag_united_kingdom_32x32.png'

export default function LanguageMenu() {
  const { t, i18n } = useTranslation(['common'])
  const language = useAppStore((state) => state.language)
  const { setLanguage } = useAppActions()

  const handleLanguageChange = (newLanguage: string) => {
    i18n.changeLanguage(newLanguage)
    setLanguage(newLanguage)
  }

  return (
    <>
      <DropdownMenuCheckboxItem checked={language === 'en'} onClick={() => handleLanguageChange('en')}>
        <img src={FlagUnitedKingdom} className="w-6 h-6" />
        {t('ENGLISH')}
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem checked={language === 'de'} onClick={() => handleLanguageChange('de')}>
        <img src={FlagGermany} className="w-6 h-6" />
        {t('GERMAN')}
      </DropdownMenuCheckboxItem>
    </>
  )
}
