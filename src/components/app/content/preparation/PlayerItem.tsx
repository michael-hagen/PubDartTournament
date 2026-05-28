import { useTranslation } from 'react-i18next'
import { Ban, Trash2 } from 'lucide-react'

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { useEffect, useRef, type ChangeEvent } from 'react'
import { useAppStore } from '@/store/AppStore'
import { Field, FieldError } from '@/components/ui/field'
import { addPlayer, removePlayer, updatePlayer } from '@/store/PlayerActions'
import { MAX_PLAYER_NAME_LENGTH } from '@/globals/globals'

interface PlayerProps {
  playerIndex: number
  isNewPlayer: boolean
  playerName: string
  gainFocus: boolean
  errorMessage: string | undefined
  handleSelectPlayer: (playerIndex: number) => void
  handleMoveFocus: (direction: string) => void
}

export default function PlayerItem({
  playerIndex,
  isNewPlayer,
  playerName,
  gainFocus,
  errorMessage,
  handleSelectPlayer,
  handleMoveFocus,
}: PlayerProps) {
  const { t } = useTranslation(['app'])
  const gameState = useAppStore((state) => state.gameState)
  const connectionMode = useAppStore((state) => state.connectionMode)
  const isObserverMode = connectionMode === 'CLIENT'
  const disabled = gameState === 'TOURNAMENT' || gameState === 'REPORT' || isObserverMode
  const inputRef = useRef<HTMLInputElement>(null)
  const errMsg = errorMessage !== undefined ? t(errorMessage) : null

  useEffect(() => {
    if (!gainFocus || !inputRef || !inputRef.current) return
    inputRef.current.focus()
  })

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'Enter':
        storePlayer()
        handleMoveFocus('down')
        break
      case 'ArrowUp':
        storePlayer()
        handleMoveFocus('up')
        break
      case 'ArrowDown':
        storePlayer()
        handleMoveFocus('down')
        break
    }
  }

  const handleOnChange = (event: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
    updatePlayer(playerIndex, event.target.value)
  }

  const handleRemovePlayer = () => {
    removePlayer(playerIndex)
  }

  const handleOnFocus = () => {
    handleSelectPlayer(playerIndex)
  }

  const handleOnBlur = () => {
    storePlayer()
    handleSelectPlayer(-1)
  }

  const storePlayer = () => {
    const value = inputRef.current?.value ? inputRef.current?.value.trim() : ''
    const length = Math.min(value.length, MAX_PLAYER_NAME_LENGTH)
    const name = value.substring(0, length)

    updatePlayer(playerIndex, name)
    if (isNewPlayer) {
      if (name.length > 0) {
        addPlayer()
      }
    } else {
      if (name.length === 0) {
        removePlayer(playerIndex)
      }
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
          value={playerName}
          disabled={disabled}
          onFocus={() => handleOnFocus()}
          onBlur={() => handleOnBlur()}
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
