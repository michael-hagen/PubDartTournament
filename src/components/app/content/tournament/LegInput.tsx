import { Input } from '@/components/ui/input'
import { TooltipTrigger, TooltipContent, Tooltip } from '@/components/ui/tooltip'
import { useAppActions, useAppStore } from '@/store/AppStore'
import { showNumpadDebounced } from '@/store/NumpadActions'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface LegInputProps {
  id: string
  value: string
  legIndex: number
  disabled?: boolean
  fieldError: boolean
  matchError: boolean
  className?: string
  handleOnChange: (newValue: string, legIndex: number) => void
}

export default function LegInput({
  id,
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
  const { setNumpadCallback } = useAppActions()

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End']

    if (e.ctrlKey || e.metaKey || allowedKeys.includes(e.key)) {
      return
    }

    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault()
    }
  }

  const myNumpadCallback = (e: KeyboardEvent) => {
    if (!inputRef.current || !document.activeElement) return
    if (document.activeElement.id !== inputRef.current.id) return

    const start = inputRef.current.selectionStart ?? 0
    const end = inputRef.current.selectionEnd ?? 0
    const currentValue = inputRef.current.value
    
    if (e.key in ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']) {
      const newValue = currentValue.substring(0, start) + e.key + currentValue.substring(end)
      if (newValue.length > maxLen) return
      inputRef.current.value = newValue
      inputRef.current.selectionStart = inputRef.current.selectionEnd = start + 1
      handleOnChange(inputRef.current.value, legIndex)
    } else if (e.key === 'Backspace') {
      inputRef.current.value = currentValue.substring(0, start - 1) + currentValue.substring(end)
      inputRef.current.selectionStart = inputRef.current.selectionEnd = start - 1
      handleOnChange(inputRef.current.value, legIndex)
    }
  }

  const handleOnFocus = () => {
    setTimeout(() => {
      inputRef.current?.setSelectionRange(0, value.length)
      setNumpadCallback(myNumpadCallback)
      showNumpadDebounced(true)
    })
  }

  const handleOnBlur = () => {
    showNumpadDebounced(false)
  }

  return (
    <Tooltip delayDuration={1000}>
      <TooltipTrigger asChild onFocus={(e) => e.preventDefault()}>
        <Input
          id={id}
          ref={inputRef}
          value={value}
          disabled={disabled}
          className={`rounded-none text-right ${maxLen === 3 ? 'w-12' : 'w-14'} ${fieldError ? 'text-destructive' : ''} ${matchError ? 'border-destructive' : ''} ${className}`}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="one-time-code"
          spellCheck="false"
          maxLength={maxLen}
          onKeyDown={handleOnKeyDown}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
          onChange={(e) => handleOnChange(e.target.value, legIndex)}
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
