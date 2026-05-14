import { useTranslation } from 'react-i18next'

interface LoserTitleProps {
  disabled: boolean
}

export default function LoserTitle({ disabled }: LoserTitleProps) {
  const { t } = useTranslation(['app'])
  return (
    <div
      className={`w-full border-t border-b bg-black/5 dark:bg-white/5 lg:text-lg p-2 ${disabled ? 'text-muted-foreground' : ''}`}
    >
      {t('LOSER_TITLE')}
    </div>
  )
}
