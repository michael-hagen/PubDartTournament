// Some global constants
export const MIN_PLAYERS = 4
export const MAX_PLAYERS = 128
export const ACTUAL_FILE_VERSION = "1.0.0"

// Type declarations for File System Access API
declare global {
  interface Window {
    showSaveFilePicker?: (options?: {
      suggestedName?: string
      types?: Array<{
        description?: string
        accept: Record<string, string[]>
      }>
    }) => Promise<FileSystemFileHandle>

    showOpenFilePicker?: (options?: {
      multiple?: boolean
      types?: Array<{
        description?: string
        accept: Record<string, string[]>
      }>
    }) => Promise<FileSystemFileHandle[]>
  }
}
