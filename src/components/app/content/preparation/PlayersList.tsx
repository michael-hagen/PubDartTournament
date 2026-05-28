import { useAppStore } from '@/store/AppStore'
import PlayerItem from './PlayerItem'
import { useState } from 'react'

export default function PlayersList() {
  const players = useAppStore((state) => state.players)
  const [selectedPlayer, setSelectedPlayer] = useState(-1)

  const handleSelectPlayer = (playerIndex: number) => {
    if (playerIndex >= 0 && playerIndex <= players.length) {
      setSelectedPlayer(playerIndex)
    } else {
      setSelectedPlayer(-1)
    }
  }

  const handleMoveFocus = (direction: string) => {
    if (direction === 'up') {
      if (selectedPlayer > 0) {
        setSelectedPlayer(selectedPlayer - 1)
      }
    } else if (direction === 'down') {
      if (selectedPlayer < players.length) {
        setSelectedPlayer(selectedPlayer + 1)
      }
    }
  }

  return (
    <div className="w-full max-w-100 min-h-full max-h-80 overflow-auto border-none p-1">
      {players.map((player, playerIndex) => (
        <PlayerItem
          key={player.id}
          playerIndex={playerIndex}
          playerName={player.name}
          isNewPlayer={playerIndex === players.length - 1}
          gainFocus={playerIndex === selectedPlayer}
          errorMessage={player.errorMessage}
          handleSelectPlayer={handleSelectPlayer}
          handleMoveFocus={handleMoveFocus}
        />
      ))}
    </div>
  )
}
