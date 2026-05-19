import { useTranslation } from 'react-i18next'

interface WinnerTitleProps {
  active: boolean
  isFinalRound: boolean
}

export default function WinnerTitle({ active, isFinalRound }: WinnerTitleProps) {
  const { t } = useTranslation(['app'])

  return (
    <div
      className={`w-full border-t border-b bg-black/5 dark:bg-white/5 lg:text-lg p-1 ${active ? '' : 'text-muted-foreground'}`}
    >
      {isFinalRound ? t('MATCH_FOR_FIRST_PLACE') : t('WINNER_TITLE')}
    </div>
  )
}
