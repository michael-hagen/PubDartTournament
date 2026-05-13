import { useAppStore } from '@/store/AppStore'
import ZoomSlider from './ZoomSlider'
import { useTranslation } from 'react-i18next'

export default function Statusbar() {
  const { t } = useTranslation(['app'])
  const selectedTab = useAppStore((state) => state.selectedTab)
  const appVersion = import.meta.env.APP_VERSION ?? '0.0.0'
  const appDate = import.meta.env.APP_DATE ?? ''

  return (
    <div className="flex justify-center h-10 ps-4 pt-2 pe-4 pb-2 no-print">
      <div className="flex-1 flex gap-2 text-sm text-muted-foreground">
        {t('app:COPYRIGHT') + ` (Ver. ${appVersion} / ${appDate})`}
      </div>
      <div>{selectedTab === 'TOURNAMENT' && <ZoomSlider />}</div>
    </div>
  )
}
