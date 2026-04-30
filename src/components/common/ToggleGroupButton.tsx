import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'
import { ToggleGroupItem } from '@/components/ui/toggle-group'

interface ToggleGroupButtonProps {
  value: string
  currentValue: string
  children?: ReactNode
  className?: string
}

export function ToggleGroupButton({ value, currentValue, children, className }: ToggleGroupButtonProps) {
  const { t } = useTranslation(['app'])

  return (
    <ToggleGroupItem
      key={value}
      value={value}
      size="lg"
      className={
        cn(
          currentValue === value
            ? 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
            : 'bg-transparent',
        ) + (className ? ' ' + className : '')
      }
    >
      {children ? children : t(value)}
    </ToggleGroupItem>
  )
}
