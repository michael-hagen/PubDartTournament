import { Input } from '@/components/ui/input'
import { TooltipTrigger, TooltipContent, Tooltip } from '@/components/ui/tooltip'
import { useAppStore } from '@/store/AppStore'
import { useRef, type ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'

interface LegInputProps {
  value: string
  legIndex: number
  disabled?: boolean
  fieldError: boolean
  matchError: boolean
  className?: string
  handleOnChange: (event: ChangeEvent<HTMLInputElement, HTMLInputElement>, legIndex: number) => void
}

export default function LegInput({
  value,
  legIndex,
  disabled,
  fieldError,
  matchError,
  className,
  handleOnChange,
}: LegInputProps) {
  const { t } = useTranslation(['app'])
  const inputRef = useRef<HTMLInputElement>(null)
  const gameMode = useAppStore((state) => state.gameMode)
  const maxLen = gameMode === '1001' ? 4 : 3

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
    setTimeout(() => inputRef.current?.setSelectionRange(0, value.length), 50)
  }

  return (
    <Tooltip delayDuration={1000}>
      <TooltipTrigger asChild onFocus={(e) => e.preventDefault()}>
        <Input
          ref={inputRef}
          value={value}
          disabled={disabled}
          className={`rounded-none text-right ${maxLen === 3 ? 'w-12' : 'w-14'} ${fieldError ? 'text-destructive' : ''} ${matchError ? 'border-destructive' : ''} ${className}`}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          spellCheck="false"
          maxLength={maxLen}
          onKeyDown={handleOnKeyDown}
          onFocus={handleOnFocus}
          onChange={(e) => handleOnChange(e, legIndex)}
          onContextMenu={(e) => e.preventDefault()}
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
