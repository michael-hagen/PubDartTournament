import { Input } from '@/components/ui/input'
import { TooltipTrigger, TooltipContent, Tooltip } from '@/components/ui/tooltip'
import { useAppStore } from '@/store/AppStore'
import { useRef, type ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'

interface LegInputProps {
  value: string
  legIndex: number
  disabled?: boolean
  errorMessage?: string
  className?: string
  handleOnChange: (event: ChangeEvent<HTMLInputElement, HTMLInputElement>, legIndex: number) => void
}

export default function LegInput({
  value,
  legIndex,
  disabled,
  errorMessage,
  className,
  handleOnChange,
}: LegInputProps) {
  const { t } = useTranslation(['app'])
  const inputRef = useRef<HTMLInputElement>(null)
  const gameMode = useAppStore((state) => state.gameMode)
  const maxLen = gameMode === 'MODE_1001' ? 4 : 3

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End']

    if (e.ctrlKey || e.metaKey || allowedKeys.includes(e.key)) {
      return
    }

    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault()
    }
  }

  const handleOnFocus = () => {
    inputRef.current?.setSelectionRange(0, value.length)
  }

  return (
    <Tooltip delayDuration={1000}>
      <TooltipTrigger asChild onFocus={(e) => e.preventDefault()}>
        <Input
          ref={inputRef}
          value={value}
          disabled={disabled}
          className={`rounded-none text-right ${maxLen === 3 ? 'w-12' : 'w-14'} ${errorMessage !== undefined ? 'border-destructive text-destructive' : ''} ${className}`}
          type="text"
          maxLength={maxLen}
          onKeyDown={handleOnKeyDown}
          onFocus={handleOnFocus}
          onChange={(e) => handleOnChange(e, legIndex)}
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
