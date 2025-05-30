import React from 'react'
import { MainWindowContent } from '../../typings/types'

export type TitleBarProps = {
  content: MainWindowContent
  setContent: React.Dispatch<React.SetStateAction<MainWindowContent>>
  onSaveSettingToStore: () => void
}

export default function TitleBar({ content, setContent, onSaveSettingToStore }: TitleBarProps): JSX.Element {
  const onClickSettings = (): void => {
    switch (content) {
      case MainWindowContent.TRANSLATION:
        setContent(MainWindowContent.SETTINGS)
        break
      case MainWindowContent.SETTINGS:
        // save settings to store when user is back from settings page
        onSaveSettingToStore()
        setContent(MainWindowContent.TRANSLATION)
        break
    }
  }
  const onClickMinimize = (): void => {
    window.api.minimizeWindow()
  }
  const onClickClose = (): void => {
    window.api.closeWindow()
  }

  return (
    <div className={`flex h-10 w-full flex-row`}>
      {/* @ts-ignore WebkitAppRegion is a valid style */}
      <div style={{ WebkitAppRegion: 'drag' }} className="flex-grow"></div>
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none focus:ring-inset"
        onClick={onClickSettings}
      >
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0" />
          <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z" />
        </svg>
      </button>
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none focus:ring-inset"
        onClick={onClickMinimize}
      >
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 12h12" />
        </svg>
      </button>
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none focus:ring-inset"
        onClick={onClickClose}
      >
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
