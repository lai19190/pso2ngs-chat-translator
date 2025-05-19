import ChatWindow from './components/ChatWindow'
import InputWindow from './components/InputWindow'
import TitleBar from './components/TitleBar'
import { useState, useEffect } from 'react'
import { MainWindowContent, ChatMessage, Settings, SystemMessage, fontSize, AppUpdateInfo } from '../../typings/types'
import SettingsPage from './components/SettingsPage'
import i18next from 'i18next'

export default function App(): JSX.Element {
  const [content, setContent] = useState<MainWindowContent>(MainWindowContent.TRANSLATION)
  const [hovered, setHovered] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<string>('')
  const [messages, setMessages] = useState<(ChatMessage | SystemMessage)[]>()
  const [settings, setSettings] = useState<Settings>()
  const [appUpdateInfo, setAppUpdateInfo] = useState<AppUpdateInfo | null>(null)
  const { systemFontClassName, transliterationFontClassName } = getFontSize(settings)

  let hoveredTimeout: NodeJS.Timeout | null = null

  // fetch settings from store at start
  useEffect(() => {
    ;(async (): Promise<void> => {
      const settings = await window.api.getSettings()
      setSettings(settings)
    })()
  }, [])

  // watch for language change
  useEffect(() => {
    if (settings) {
      i18next.changeLanguage(settings.general.locale)
    }
  }, [settings])

  // check app update
  useEffect(() => {
    ;(async (): Promise<void> => {
      setAppUpdateInfo(await window.api.checkUpdate())
    })()
  }, [])

  // receive new chat message
  window.api.onNewMessage((message: ChatMessage | SystemMessage) => {
    const newMessages = [...(messages ?? []), message]
    // limit array size to 100 for performance
    if (newMessages.length > 100) {
      newMessages.shift()
    }
    setMessages(newMessages)
  })

  const onTranslationWindow = content === MainWindowContent.TRANSLATION
  const onSettingsWindow = content === MainWindowContent.SETTINGS
  const showAllWindows = hovered || !settings?.general.showChatWindowOnly

  return (
    <div
      className={`font-ngs flex h-screen w-screen flex-col overflow-hidden rounded-lg bg-blue-500/30 p-1.5 ${systemFontClassName}`}
      // tracking JP IME Composition State, avoid unexpcted unhovering
      onCompositionStart={onHovered}
      onCompositionUpdate={onHovered}
      onMouseOver={onHovered}
      onMouseLeave={onUnhovered}
    >
      <TitleBar content={content} setContent={setContent} onSaveSettingToStore={onSaveSettingToStore} />
      {onTranslationWindow && (
        <>
          <ChatWindow
            messages={messages}
            hovered={hovered}
            transliterationFontClassName={transliterationFontClassName}
            showTransliteration={settings?.translation.showTransliteration}
            appUpdateInfo={appUpdateInfo}
          />
          {showAllWindows && <InputWindow inputValue={inputValue} setInputValue={setInputValue} />}
        </>
      )}
      {onSettingsWindow && <SettingsPage settings={settings} setSettings={setSettings} />}
    </div>
  )

  function onHovered(): void {
    setHovered(true)
    if (hoveredTimeout) {
      clearTimeout(hoveredTimeout)
    }
  }

  function onUnhovered(): void {
    hoveredTimeout = setTimeout(() => {
      setHovered(false)
    }, 1000)
  }

  function onSaveSettingToStore(): void {
    if (settings) {
      window.api.setSettings(settings)
    }
  }

  function getFontSize(settings: Settings | undefined): {
    systemFontClassName: string
    transliterationFontClassName: string
  } {
    let systemFontClassName: string
    let transliterationFontClassName: string
    switch (settings?.general.fontSize) {
      case fontSize.Small:
        systemFontClassName = 'text-sm'
        transliterationFontClassName = 'text-xs'
        break
      case fontSize.Medium:
        systemFontClassName = 'text-base'
        transliterationFontClassName = 'text-sm'
        break
      case fontSize.Large:
        systemFontClassName = 'text-lg'
        transliterationFontClassName = 'text-base'
        break
      default:
        systemFontClassName = 'text-base'
        transliterationFontClassName = 'text-sm'
        break
    }
    return { systemFontClassName, transliterationFontClassName }
  }
}
