import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAppStore } from '@/store/AppStore'
import { useTranslation } from 'react-i18next'

export default function ReportTab() {
  const { t } = useTranslation(['common', 'app'])
  const players = useAppStore((state) => state.players)
  const rounds = useAppStore((state) => state.tournament.rounds)

  return (
    <div className="border m-4">
      <Table>
        <TableHeader className="bg-background">
          <TableRow>
            <TableHead className="text-center w-40">{t('app:REPORT_HEADER_RANK')}</TableHead>
            <TableHead className="text-center w-80 overflow-hidden">{t('app:REPORT_HEADER_PLAYER')}</TableHead>
            <TableHead className="text-center w-40">{t('app:REPORT_HEADER_REACHED_ROUND')}</TableHead>
            <TableHead className="text-center w-40">{t('app:REPORT_HEADER_MATCHES')}</TableHead>
            <TableHead className="text-center w-40">{t('app:REPORT_HEADER_LEGS')}</TableHead>
            <TableHead className="text-center w-40">{t('app:REPORT_HEADER_REMAINING_POINTS')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((player) => (
            <TableRow key={player.id}>
              <TableCell className="text-center">{player.rank}</TableCell>
              <TableCell className="text-center">{player.name}</TableCell>
              <TableCell className="text-center">
                {player.roundReached === rounds.length - 1 ? t('app:FINAL') : player.roundReached + 1}
              </TableCell>
              <TableCell className="text-center">{player.wonMatches + ' / ' + player.lostMatches}</TableCell>
              <TableCell className="text-center">{player.wonLegs + ' / ' + player.lostLegs}</TableCell>
              <TableCell className="text-center">{player.remainingPoints}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
