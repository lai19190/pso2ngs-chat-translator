import * as deepl from 'deepl-node'
import { Translator } from '../../typings/interface'
import { Language, Settings } from '../../typings/types'

export class DeepLTranslator implements Translator {
  private translator: deepl.Translator
  private sourceLanguage: Language
  private destinationLanguage: Language

  constructor(settings: Settings) {
    if (!settings.translation.deepl?.apiKey) {
      throw new Error('Translator.DeepL.errorMissingConfig')
    }
    this.translator = new deepl.Translator(settings.translation.deepl.apiKey)
    this.sourceLanguage = settings.translation.sourceLanguage
    this.destinationLanguage = settings.translation.destinationLanguage
  }

  async translateToDestinationLanguage(_name: string, message: string): Promise<string> {
    const result = await this.translator.translateText(message, null, this.mapToDeeplLanguageCode(this.destinationLanguage))
    return result.text
  }

  async translateToSourceLanguage(message: string): Promise<string> {
    const result = await this.translator.translateText(message, null, this.mapToDeeplLanguageCode(this.sourceLanguage))
    return result.text
  }

  private mapToDeeplLanguageCode(language: Language): deepl.TargetLanguageCode {
    const languageMap: Record<Language, deepl.TargetLanguageCode> = {
      en: 'en-US',
      ja: 'ja',
      'zh-TW': 'zh-HANS',
      'zh-CN': 'zh-HANT',
      es: 'es',
      pt: 'pt-BR',
      ko: 'ko',
      fr: 'fr',
      de: 'de',
      it: 'it',
      ru: 'ru',
      id: 'id',
      tl: 'en-US' // DeepL does not support Tagalog, default to English
    }
    return languageMap[language]
  }
}
