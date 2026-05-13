import { ACTUAL_FILE_VERSION } from '@/globals/globals'
import { getState, setState } from './AppStore'

export async function saveTournament(): Promise<string | null> {
  const state = getState()
  let errorMessage: string | null = null

  try {
    async function getFileHandle(): Promise<FileSystemFileHandle | null> {
      if ('showSaveFilePicker' in window) {
        try {
          const fileHandle = await window.showSaveFilePicker!({
            suggestedName: `${state.tournament.name}.json`,
            types: [
              {
                description: 'Tournament JSON',
                accept: { 'application/json': ['.json'] },
              },
            ],
          })
          return fileHandle
        } catch (error) {
          if (!(error instanceof DOMException && error.name === 'AbortError')) return null
          errorMessage = 'Browser does not support File System Access API'
        }
      }
      return null
    }

    const fileHandle = await getFileHandle()

    if (!fileHandle) return errorMessage

    const tournamentData = {
      actFileVersion: ACTUAL_FILE_VERSION,
      gameState: state.gameState,
      gameVariant: state.gameVariant,
      gameMode: state.gameMode,
      gameOpening: state.gameOpening,
      gameCheckout: state.gameCheckout,
      gameLegs: state.gameLegs,
      gameElimination: state.gameElimination,
      players: state.players,
      tournament: state.tournament,
      selectedTab: state.selectedTab,
      tournamentPanelScale: state.tournamentPanelScale,
    }
    const dataStr = JSON.stringify(tournamentData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })

    const writable = await fileHandle.createWritable()
    await writable.write(dataBlob)
    await writable.close()
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : String(error)
  }

  return errorMessage
}

export async function openTournament(): Promise<string | null> {
  let errorMessage: string | null = null

  try {
    async function getFileHandle(): Promise<FileSystemFileHandle | null> {
      if ('showOpenFilePicker' in window) {
        try {
          const [fileHandle] = await window.showOpenFilePicker!({
            multiple: false,
            types: [
              {
                description: 'Tournament JSON',
                accept: { 'application/json': ['.json'] },
              },
            ],
          })
          return fileHandle
        } catch (error) {
          if (error instanceof DOMException && error.name === 'AbortError') {
            // User cancelled the dialog
            return null
          }
          // Fall through to fallback method
        }
      }

      // Fallback for browsers that don't support File System Access API
      return new Promise<FileSystemFileHandle | null>((resolve) => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = '.json'
        input.style.display = 'none'

        input.onchange = (e: Event) => {
          const files = (e.target as HTMLInputElement).files
          if (!files || files.length === 0) {
            resolve(null) // User cancelled
            return
          }

          // Create a FileSystemFileHandle-like object from the File
          const file = files[0]
          const fileHandle = {
            getFile: async () => file,
          } as FileSystemFileHandle

          resolve(fileHandle)
        }

        input.oncancel = () => {
          resolve(null) // User cancelled
        }

        document.body.appendChild(input)
        input.click()
        document.body.removeChild(input)
      })
    }

    const fileHandle = await getFileHandle()

    if (!fileHandle) return errorMessage

    const jsonText = await (await fileHandle.getFile()).text()

    if (jsonText) {
      // const jsonObject = JSON.parse(jsonText)
      // return JSON.stringify(jsonObject, null, 4)
      return jsonText
    }

    const tournamentData = JSON.parse(jsonText)

    if (!tournamentData || typeof tournamentData !== 'object') {
      return 'Invalid tournament file'
    }

    if (tournamentData.actFileVersion !== ACTUAL_FILE_VERSION) {
      return `Tournament file version ${tournamentData.actFileVersion} does not match current version ${ACTUAL_FILE_VERSION}`
    }

    setState({
      gameState: tournamentData.gameState,
      gameVariant: tournamentData.gameVariant,
      gameMode: tournamentData.gameMode,
      gameOpening: tournamentData.gameOpening,
      gameCheckout: tournamentData.gameCheckout,
      gameLegs: tournamentData.gameLegs,
      gameElimination: tournamentData.gameElimination,
      players: tournamentData.players,
      tournament: tournamentData.tournament,
      selectedTab: tournamentData.selectedTab,
      tournamentPanelScale: tournamentData.tournamentPanelScale,
    })
  } catch (error) {
    errorMessage = `Error opening tournament file: ${error}`
  }

  return errorMessage
}
