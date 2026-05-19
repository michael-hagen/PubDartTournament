import { useTranslation } from 'react-i18next'

interface LoserTitleProps {
  active: boolean
  isFinalRound: boolean
}

export default function LoserTitle({ active, isFinalRound }: LoserTitleProps) {
  const { t } = useTranslation(['app'])

  return (
    <div
      className={`w-full border-t border-b bg-black/5 dark:bg-white/5 lg:text-lg p-2 ${active ? '' : 'text-muted-foreground'}`}
    >
      {isFinalRound ? t('MATCH_FOR_THIRD_PLACE') : t('LOSER_TITLE')}
    </div>
  )
}
