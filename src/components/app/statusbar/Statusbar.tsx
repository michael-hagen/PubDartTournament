import { useAppStore } from '@/store/AppStore'
import ZoomSlider from './ZoomSlider'
import { useTranslation } from 'react-i18next'
import ConnectControl from './ConnectControl'

export default function Statusbar() {
  const { t } = useTranslation(['app'])
  const selectedTab = useAppStore((state) => state.selectedTab)
  const appVersion = import.meta.env.APP_VERSION ?? '0.0.0'
  const appDate = import.meta.env.APP_DATE ?? ''

  return (
    <div className="flex justify-center h-12 gap-6 ps-4 pt-2 pe-4 pb-2 no-print">
      <div className="w-0 lg:w-full pt-1 gap-2 text-sm text-muted-foreground whitespace-nowrap overflow-clip">
        {t('app:COPYRIGHT') + ` (Ver. ${appVersion} / ${appDate})`}
      </div>
      <div className="flex-1"></div>
      <div>{selectedTab === 'TOURNAMENT' && <ZoomSlider />}</div>
      <ConnectControl />
    </div>
  )
}
