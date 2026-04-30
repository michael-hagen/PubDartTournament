import { Input } from '@/components/ui/input'
import { TooltipTrigger, TooltipContent, Tooltip } from '@/components/ui/tooltip'
import { useAppStore } from '@/store/AppStore'
import { useTranslation } from 'react-i18next'

interface LegInputProps {
  value: number
  disabled?: boolean
  className?: string
}

export default function LegInput({ value, disabled, className }: LegInputProps) {
  const { t } = useTranslation(['app'])
  const gameMode = useAppStore((state) => state.gameMode)
  const maxLen = gameMode === 'MODE_1001' ? 4 : 3

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End']

    if (e.ctrlKey || e.metaKey || allowedKeys.includes(e.key)) {
      return
    }

    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault()
    }
  }

  return (
    <Tooltip delayDuration={1000}>
      <TooltipTrigger asChild>
        <Input
          value={value}
          disabled={disabled}
          className={`rounded-none text-right ${maxLen === 3 ? 'w-12' : 'w-14'} ${className}`}
          type="text"
          maxLength={maxLen}
          onKeyDown={handleKeyDown}
        />
      </TooltipTrigger>
      <TooltipContent>
        <div className="flex flex-col gap-1">
          <p className="text-lg">{t('TIP.LEG_INPUT_TITLE')}</p>
          <p>{t('TIP.LEG_INPUT_CONTENT_1')}</p>
          <p>{t('TIP.LEG_INPUT_CONTENT_2')}</p>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
