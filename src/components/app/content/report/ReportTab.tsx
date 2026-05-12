import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAppStore } from '@/store/AppStore'

export default function ReportTab() {
  const players = useAppStore((state) => state.players)
  const rounds = useAppStore((state) => state.tournament.rounds)

  return (
    <div className="border m-4">
      <Table>
        <TableHeader className="bg-background">
          <TableRow>
            <TableHead className="text-center w-40">Rang</TableHead>
            <TableHead className="text-center w-80 overflow-hidden">Spieler</TableHead>
            <TableHead className="text-center w-40">Erreichte Runde</TableHead>
            <TableHead className="text-center w-40">Spiele</TableHead>
            <TableHead className="text-center w-40">Legs</TableHead>
            <TableHead className="text-center w-40">Restpunkte</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((player) => (
            <TableRow key={player.id}>
              <TableCell className="text-center">{player.rank}</TableCell>
              <TableCell className="text-center">{player.name}</TableCell>
              <TableCell className="text-center">
                {player.roundReached === rounds.length - 1 ? 'Finale' : player.roundReached}
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
