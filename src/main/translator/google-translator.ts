import { AxiosError } from 'axios'
import { DEFAULT_REQUEST_TIMEOUT } from '../../typings/constants'
import { Translator } from '../../typings/interface'
import { ChatMessage, Language, Settings } from '../../typings/types'
import { googletrans } from 'googletrans'

export class GoogleTranslator implements Translator {
  private sourceLanguage: Language
  private destinationLanguage: Language

  constructor(settings: Settings) {
    this.sourceLanguage = settings.translation.sourceLanguage
    this.destinationLanguage = settings.translation.destinationLanguage
  }

  async translateToDestinationLanguage(chatMessage: ChatMessage): Promise<string> {
    return this.translate(chatMessage.message, this.sourceLanguage, this.destinationLanguage)
  }

  async translateToSourceLanguage(message: string): Promise<string> {
    return this.translate(message, this.destinationLanguage, this.sourceLanguage)
  }

  private async translate(message: string, sourceLanguage: Language, destinationLanguage: Language): Promise<string> {
    try {
      const result = await googletrans(message, {
        from: sourceLanguage,
        to: destinationLanguage,
        signal: AbortSignal.timeout(DEFAULT_REQUEST_TIMEOUT)
      })
      return result.text
    } catch (error: unknown) {
      const axiosError = error as AxiosError
      throw new Error(`Google Translate request failed (${axiosError.response?.status})`)
    }
  }
}
