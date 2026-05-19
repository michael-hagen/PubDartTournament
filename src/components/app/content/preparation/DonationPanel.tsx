import NotImplementedDialog from '@/components/common/NotImplementedDialog'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function DonationPanel() {
  const { t } = useTranslation(['app'])

  const handleDonateClicked = () => {
    // Erstelle zuvor ein PayPal.Me Link in meinem PayPal-Konto
    // Öffnet die PayPal-Seite in einem neuen Tab mit festen 5€
    // window.open("https://paypal.me/DeinName/5", "_blank", "noopener,noreferrer")
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
