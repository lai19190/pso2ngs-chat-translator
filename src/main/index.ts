import { app, shell, BrowserWindow, ipcMain, clipboard, session as electronSession } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { ChatServiceController } from './chat-service-controller'
import { SettingsManager } from './settings-manager'
import { Settings } from '../typings/types'
import { installExtension, REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer'

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  await installExtension(REACT_DEVELOPER_TOOLS, { loadExtensionOptions: { allowFileAccess: true } })
  await launchExtensionBackgroundWorkers()

  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  const settingsManager = new SettingsManager()
  const settings = settingsManager.getSettings()
  const mainWindow = createWindow(settings)
  const chatServiceController = new ChatServiceController(mainWindow)
  chatServiceController.start(settings)

  ipcMain.handle('get-settings', async () => {
    return settingsManager.getSettings()
  })

  ipcMain.on('set-settings', (_event, settings: Settings) => {
    settingsManager.setSettings(settings)
    chatServiceController.restart(settings)
  })

  ipcMain.on('minimize-window', () => {
    mainWindow.minimize()
  })

  ipcMain.on('close-window', () => {
    settingsManager.setSettings({ window: mainWindow.getBounds() })
    mainWindow.close()
  })

  ipcMain.handle('translate-input-message', async (_event, message: string) => {
    const tranlatedMessage = await chatServiceController.translateInputMessage(message)
    clipboard.writeText(tranlatedMessage)
    return tranlatedMessage
  })
})

app.on('window-all-closed', () => {
  app.quit()
})

function createWindow(settings: Settings): BrowserWindow {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    show: false,
    icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    },
    alwaysOnTop: true,
    autoHideMenuBar: true,
    frame: false,
    transparent: true,
    fullscreenable: false
    // hasShadow: false,
    // roundedCorners: false,
    // thickFrame: false
  })
  mainWindow.setBounds(settings.window)

  mainWindow.setAlwaysOnTop(true, 'screen-saver')

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return mainWindow
}

function launchExtensionBackgroundWorkers(session = electronSession.defaultSession): Promise<void[]> {
  return Promise.all(
    session.getAllExtensions().map(async (extension) => {
      const manifest = extension.manifest
      if (manifest.manifest_version === 3 && manifest?.background?.service_worker) {
        await session.serviceWorkers.startWorkerForScope(extension.url)
      }
    })
  )
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
