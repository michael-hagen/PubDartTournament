import NotImplementedDialog from '@/components/common/NotImplementedDialog'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/AppStore'
import { Heart } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function DonationPanel() {
  const { t } = useTranslation(['app'])
  const connectionMode = useAppStore((state) => state.connectionMode)
  const isObserverMode = connectionMode === 'CLIENT'

  const handleDonateClicked = () => {
    // Create a PayPal.Me Link in my PayPal account
    // Open the paypal link in a new Tab wth fixed 5€
    // window.open("https://paypal.me/my-name/5", "_blank", "noopener,noreferrer")
  }

  return (
    <NotImplementedDialog>
      <Button disabled={isObserverMode} variant="outline" onClick={handleDonateClicked}>
        <Heart className="mr-2 text-primary" />
        {t('app:DONATE_5_EURO')}
      </Button>
    </NotImplementedDialog>
  )
}
