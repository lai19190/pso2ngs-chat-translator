import { app } from 'electron'
import Store from 'electron-store'
import { fontSize, GamePlatform, GameVersion, Language, Locale, Settings, TranslatorType, TransliterationType } from '../../typings/types'

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
          gameVersion: GameVersion.PSO2NGS,
          gamePlatform: GamePlatform.JP,
          fontSize: fontSize.Medium,
          showChatWindowOnly: false,
          showTimestamp: true
        },
        translation: {
          translator: TranslatorType.GoogleTranslate,
          sourceLanguage: this.getDefaultSourceLanguage(),
          destinationLanguage: this.getDefaultDestinationLanguage(),
          showTransliteration: true,
          transliterationType: TransliterationType.Okurigana,
          openAI: {},
          gemini: {},
          localLLM: {},
          xai: {},
          deepl: {}
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

  getDefaultLocale(): Locale {
    if (this.locale.startsWith('en')) {
      return Locale.English
    }
    if (this.locale === 'ja') {
      return Locale.Japanese
    }
    if (this.locale.startsWith('zh')) {
      return Locale.Chinese
    }
    return Locale.English
  }

  getDefaultSourceLanguage(): Language {
    if (this.locale === 'ja') {
      return Language.English
    }
    return Language.Japanese
  }

  getDefaultDestinationLanguage(): Language {
    if (this.locale.startsWith('en')) {
      return Language.English
    }
    if (this.locale === 'ja') {
      return Language.Japanese
    }
    if (this.locale === 'zh-CN') {
      return Language.SimplifiedChinese
    }
    if (this.locale.startsWith('zh')) {
      return Language.TraditionalChinese
    }
    return Language.English
  }
}
