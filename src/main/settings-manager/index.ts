import { app } from 'electron'
import Store from 'electron-store'
import { fontSize, Language, Settings, TranslatorType, TransliterationType } from '../../typings/types'

export class SettingsManager {
  private settings: Store<Settings>
  private locale: string

  constructor() {
    this.locale = app.getLocale()
    this.settings = new Store<Settings>({
      name: 'settings',
      cwd: process.env.PORTABLE_EXECUTABLE_DIR ?? app.getPath('userData'),
      defaults: {
        general: {
          locale: this.getDefaultLocale(),
          fontSize: fontSize.Medium,
          showChatWindowOnly: false
        },
        translation: {
          translator: TranslatorType.GoogleTranslate,
          sourceLanguage: this.getDefaultSourceLanguage(),
          destinationLanguage: this.getDefaultLocale(),
          showTransliteration: true,
          transliterationType: TransliterationType.Okurigana,
          openAI: {},
          gemini: {},
          localLLM: {}
        },
        window: {
          width: 330,
          height: 400
        }
      }
    })
  }

  getSettings(): Settings {
    return this.settings.store
  }

  setSettings(settings: Partial<Settings>): void {
    this.settings.set(settings)
  }

  getDefaultLocale(): Language {
    if (this.locale.startsWith('en')) {
      return Language.English
    }
    if (this.locale === 'ja') {
      return Language.Japanese
    }
    if (this.locale.startsWith('zh')) {
      return Language.Chinese
    }
    return Language.English
  }

  getDefaultSourceLanguage(): Language {
    if (this.locale === 'ja') {
      return Language.English
    }
    return Language.Japanese
  }
}
