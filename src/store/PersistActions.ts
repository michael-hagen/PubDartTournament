import { ACTUAL_FILE_VERSION } from '@/globals/globals'
import { getState, setState } from './AppStore'

export async function saveTournament(): Promise<string | null> {
  const state = getState()
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
  const content = JSON.stringify(tournamentData, null, 2)
  const errorMessage = await saveContent(`${state.tournament.name}.json`, content)
  return errorMessage
}

export async function openTournament(): Promise<string | null> {
  const result = await loadContent()
  if (result.content) {
    const tournamentData = JSON.parse(result.content)

    if (!tournamentData || typeof tournamentData !== 'object') {
      return 'Error: Invalid tournament file'
    }

    if (tournamentData.actFileVersion !== ACTUAL_FILE_VERSION) {
      return `Error: Tournament file version ${tournamentData.actFileVersion} does not match current version ${ACTUAL_FILE_VERSION}`
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
  }
  return result.errorMessage
}

//------------------------------------------------------------------------------
// Utility functions
//------------------------------------------------------------------------------
async function saveContent(filename: string, content: string): Promise<string | null> {
  if ('showSaveFilePicker' in window) {
    try {
      const fileHandle = await window.showSaveFilePicker!({
        suggestedName: filename,
        types: [
          {
            description: 'Tournament JSON',
            accept: { 'application/json': ['.json'] },
          },
        ],
      })
      const dataBlob = new Blob([content], { type: 'application/json' })
      const writable = await fileHandle.createWritable()
      await writable.write(dataBlob)
      await writable.close()

      return null
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) return null
      return `Error (File System API): ${error instanceof Error ? error.message : error}`
    }
  }

  // Fallback for older browser
  try {
    const blob = new Blob([content], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = filename

    document.body.appendChild(link)
    link.click()

    // Cleanup
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    return null
  } catch (error) {
    return `Error (fallback): ${error instanceof Error ? error.message : error}`
  }
}

type LoadResultType = {
  content: string | null
  errorMessage: string | null
}

async function loadContent(): Promise<LoadResultType> {
  // Try to open the file via File Access API
  if ('showOpenFilePicker' in window) {
    try {
      const [fileHandle] = await window.showOpenFilePicker!({
        types: [{ description: 'JSON Files', accept: { 'application/json': ['.json'] } }],
      })
      const file = await fileHandle.getFile()

      const content = await file.text()
      if (!content || content.trim().length === 0) {
        return { content: null, errorMessage: `Error File System API: Empty file: ${file.name} (${file.size} bytes)` }
      }
      return { content, errorMessage: null }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return { content: null, errorMessage: null }
      }
      return { content: null, errorMessage: `Error: ${error}` }
    }
  }

  // Fallback for old browsers
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json,application/json,text/plain'
    input.style.display = 'none'

    const cleanup = () => {
      if (document.body.contains(input)) {
        document.body.removeChild(input)
      }
    }

    input.oncancel = () => {
      cleanup()
      return { content: null, errorMessage: null }
    }

    input.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement
      const file = target.files?.[0]

      if (!file) {
        cleanup()
        resolve({ content: null, errorMessage: null })
        return
      }

      const reader = new FileReader()

      reader.onload = () => {
        const content = reader.result as string
        cleanup()

        if (!content || content.trim().length === 0) {
          resolve({content: null, errorMessage: `Error: File ${file.name} Size: ${file.size}`})
        }
        resolve({ content, errorMessage: null })
      }

      reader.onerror = () => {
        cleanup()
        resolve({ content: null, errorMessage: `Error: File ${file.name} Size: ${file.size}` })
      }

      reader.readAsText(file)
    }
    document.body.appendChild(input)
    input.click()
  })
}
