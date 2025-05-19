import { ElectronAPI } from '@electron-toolkit/preload'
import { Settings } from 'src/typings/types'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      minimizeWindow: () => void
      closeWindow: () => void
      getSettings: () => Promise<Settings>
      setSettings: (settings: Settings) => void
      onNewMessage: (callback: (message: ChatMessage | SystemMessage) => void) => void
      translateInputMessage: (message: string) => Promise<string>
      checkUpdate: () => Promise<AppUpdateInfo>
    }
  }
}
