import AppIcon from '@/assets/app_icon_64x64.png'
import { useTranslation } from 'react-i18next'

export default function NavbarTitle() {
  const { t } = useTranslation(['common'])
  return (
    <div className="flex items-center space-x-1">
      <div>
        <img src={AppIcon} alt="Pub Dart Tournament" className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
      </div>
      <span className="text-lg md:text-2xl lg:text-3xl font-medium">
        <span className="text-primary">{t('PUB', { ns: 'app' })}</span>
        <span className="ps-1 pe-1 md:ps-2 md:pe-2 lg:ps-2 lg:pe-2">{t('DART', { ns: 'app' })}</span>
        <span className="text-primary">{t('TOURNAMENT', { ns: 'app' })}</span>
      </span>
    </div>
  )
}
