import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useTranslation } from 'react-i18next'

interface FinishButtonProps {
  disabled?: boolean
  handleClick?: () => void
}
export default function FinishButton({ disabled, handleClick }: FinishButtonProps) {
  const { t } = useTranslation(['app'])
  return (
    <Tooltip delayDuration={1000}>
      <TooltipTrigger asChild>
        <Button disabled={disabled} className="mt-4" variant="outline" onClick={handleClick}>
          {t('FINISH_ROUND')}
        </Button>
      </TooltipTrigger>
      <TooltipContent className="max-w-100">
        <div className="flex flex-col gap-1">
          <p className="text-lg">{t('TIP.FINISH_ROUND_BUTTON_TITLE')}</p>
          <p>{t('TIP.FINISH_ROUND_BUTTON_CONTENT_1')}</p>
          <p>{t('TIP.FINISH_ROUND_BUTTON_CONTENT_2')}</p>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
