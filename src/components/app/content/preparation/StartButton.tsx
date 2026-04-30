import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Goal } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface FinishButtonProps {
  disabled?: boolean
  handleClick?: () => void
}
export default function StartButton({ disabled, handleClick }: FinishButtonProps) {
  const { t } = useTranslation(['app'])
  return (
    <Tooltip delayDuration={1000}>
      <TooltipTrigger asChild>
        <Button disabled={disabled} className="min-w-60 mt-4" variant="outline" onClick={handleClick}>
          <Goal />
          {t('START_TOURNAMENT')}
        </Button>
      </TooltipTrigger>
      <TooltipContent className="max-w-100">
        <div className="flex flex-col gap-1">
          <p className="text-lg">{t('TIP.START_TOURNAMENT_TITLE')}</p>
          <p>{t('TIP.START_TOURNAMENT_CONTENT_1')}</p>
          <p>{t('TIP.START_TOURNAMENT_CONTENT_2')}</p>
          <p>{t('TIP.START_TOURNAMENT_CONTENT_3')}</p>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
