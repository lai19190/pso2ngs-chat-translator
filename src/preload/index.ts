import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { ChatMessage, Settings, SystemMessage } from '../typings/types'

// Custom APIs for renderer
const api = {
  minimizeWindow: (): void => {
    ipcRenderer.send('minimize-window')
  },
  closeWindow: (): void => {
    ipcRenderer.send('close-window')
  },
  getSettings: async (): Promise<Settings> => {
    return await ipcRenderer.invoke('get-settings')
  },
  setSettings: (settings: Settings): void => {
    ipcRenderer.send('set-settings', settings)
  },
  onNewMessage: (callback: (message: ChatMessage | SystemMessage) => void): void => {
    ipcRenderer.on('new-message', (_event, message) => callback(message))
  },
  translateInputMessage: async (message: string): Promise<string> => {
    return await ipcRenderer.invoke('translate-input-message', message)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
