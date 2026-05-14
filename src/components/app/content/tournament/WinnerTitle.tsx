import { useTranslation } from 'react-i18next'

interface WinnerTitleProps {
  disabled: boolean
}

export default function WinnerTitle({ disabled }: WinnerTitleProps) {
  const { t } = useTranslation(['app'])
  return (
    <div
      className={`w-full border-t border-b bg-black/5 dark:bg-white/5 lg:text-lg p-1 ${disabled ? 'text-muted-foreground' : ''}`}
    >
      {t('WINNER_TITLE')}
    </div>
  )
}
