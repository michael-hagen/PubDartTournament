import { useTranslation } from 'react-i18next'
import { Ban, Trash2 } from 'lucide-react'

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useAppActions, useAppStore } from '@/store/AppStore'
import { Field, FieldError } from '@/components/ui/field'

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
  const { updatePlayer, addPlayer, removePlayer } = useAppActions()
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
    updatePlayer(playerIndex, value)
    if (isNewPlayer) {
      if (value.length > 0) {
        addPlayer()
      }
    } else {
      if (value.length === 0) {
        removePlayer(playerIndex)
      }
    }
    handleMoveFocus(cursorDirection)
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
      <InputGroup className="rounded-none border-t-0 border-b-input p-2 h-10">
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
        {!isNewPlayer && (
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
