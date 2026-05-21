import { useTranslation } from 'react-i18next'
import { Ban, Trash2 } from 'lucide-react'

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useAppStore } from '@/store/AppStore'
import { Field, FieldError } from '@/components/ui/field'
import { addPlayer, removePlayer, updatePlayer } from '@/store/PlayerActions'

interface PlayerProps {
  playerIndex: number
  isNewPlayer: boolean
  player: string
  gainFocus: boolean
  errorMessage: string | undefined
  handleSelectPlayer: (playerIndex: number) => void
  handleMoveFocus: (direction: string) => void
}

export default function PlayerItem({
  playerIndex,
  isNewPlayer,
  player,
  gainFocus,
  errorMessage,
  handleSelectPlayer,
  handleMoveFocus,
}: PlayerProps) {
  const { t } = useTranslation(['app'])
  const gameState = useAppStore((state) => state.gameState)
  const disabled = gameState === 'TOURNAMENT' || gameState === 'REPORT'
  const [value, setValue] = useState(player)
  const inputRef = useRef<HTMLInputElement>(null)
  const errMsg = errorMessage !== undefined ? t(errorMessage) : null

  useEffect(() => {
    if (!gainFocus || !inputRef || !inputRef.current) return
    inputRef.current.focus()
  })

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'Enter':
        handleAcceptPlayer('down')
        break
      case 'ArrowUp':
        handleAcceptPlayer('up')
        break
      case 'ArrowDown':
        handleAcceptPlayer('down')
        break
    }
  }

  const handleOnChange = (event: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
    setValue(event.target.value)
  }

  const handleAcceptPlayer = (cursorDirection: string) => {
    const playerName = value ? value.trim() : ''
    updatePlayer(playerIndex, playerName)
    if (isNewPlayer) {
      if (playerName.length > 0) {
        addPlayer()
      }
      handleMoveFocus(cursorDirection)
    } else {
      if (playerName.length === 0) {
        removePlayer(playerIndex)
      } else {
        handleMoveFocus(cursorDirection)
      }
    }
  }

  const handleRemovePlayer = () => {
    removePlayer(playerIndex)
  }

  const handleOnFocus = (gained: boolean) => {
    if (gained) {
      handleSelectPlayer(playerIndex)
    } else {
      updatePlayer(playerIndex, value)
      handleSelectPlayer(-1)
    }
  }

  return (
    <Field data-invalid={errorMessage != null}>
      <InputGroup
        className={`rounded-none p-2 h-10 ${isNewPlayer ? '' : 'border-b-0'} ${disabled ? 'opacity-100! bg-background/50!' : ''}`}
      >
        <InputGroupInput
          ref={inputRef}
          placeholder={isNewPlayer ? t('NEW_PLAYER') : t('REMOVE_PLAYER')}
          value={value}
          disabled={disabled}
          onFocus={() => handleOnFocus(true)}
          onBlur={() => handleOnFocus(false)}
          onKeyDown={handleKeyDown}
          onChange={handleOnChange}
        />
        <InputGroupAddon align="inline-start" className="pe-2">
          <p>{playerIndex + 1}</p>
        </InputGroupAddon>
        {!isNewPlayer && !disabled && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton variant="secondary" onClick={handleRemovePlayer}>
              <Trash2 />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>
      {errMsg && (
        <FieldError>
          <div className="flex p-2 gap-1">
            <Ban className="w-4 h-4" />
            {errMsg}
          </div>
        </FieldError>
      )}
    </Field>
  )
}
