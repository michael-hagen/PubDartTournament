import NotImplementedDialog from '@/components/common/NotImplementedDialog'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function DonationPanel() {
  const { t } = useTranslation(['app'])

  const handleDonateClicked = () => {
    // Create a PayPal.Me Link in my PayPal account
    // Open the paypal link in a new Tab wth fixed 5€
    // window.open("https://paypal.me/my-name/5", "_blank", "noopener,noreferrer")
  }

  return (
    <NotImplementedDialog>
      <Button variant="outline" onClick={handleDonateClicked}>
        <Heart className="mr-2 text-emerald-600 dark:text-emerald-500" />
        {t('app:DONATE_5_EURO')}
      </Button>
    </NotImplementedDialog>
  )
}
