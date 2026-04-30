import { Input } from '@/components/ui/input'
import { useAppStore } from '@/store/AppStore'

interface LegInputProps {
  value: number
  disabled?: boolean
  className?: string
}

export default function LegInput({ value, disabled, className }: LegInputProps) {
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
    <Input
      value={value}
      disabled={disabled}
      className={`rounded-none text-right ${maxLen === 3 ? 'w-12' : 'w-14'} ${className}`}
      type="text"
      maxLength={maxLen}
      onKeyDown={handleKeyDown}
    />
  )
}
