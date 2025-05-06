import { GoogleGenAI, Chat } from '@google/genai'
import { Translator } from '../../typings/interface'
import { Language, Settings, TranslatorMessageInput } from '../../typings/types'
import { DEFAULT_SYSTEM_PROMPT } from '../../typings/constants'

export class GeminiTranslator implements Translator {
  private sourceLanguage: Language
  private destinationLanguage: Language
  private APIClient: GoogleGenAI
  private chat: Chat

  constructor(settings: Settings) {
    const geminiConfig = settings.translation.gemini
    if (!geminiConfig.apiKey || !geminiConfig.model) {
      throw new Error('Please set Gemini model or api key')
    }
    this.sourceLanguage = settings.translation.sourceLanguage
    this.destinationLanguage = settings.translation.destinationLanguage
    this.APIClient = new GoogleGenAI({ apiKey: geminiConfig.apiKey })
    this.chat = this.APIClient.chats.create({
      model: geminiConfig.model,
      config: {
        systemInstruction: DEFAULT_SYSTEM_PROMPT
      }
    })
  }

  async translateToDestinationLanguage(name: string, message: string): Promise<string> {
    return await this.translate(name, message, this.destinationLanguage)
  }
  async translateToSourceLanguage(message: string): Promise<string> {
    return await this.translate('REPLY', message, this.sourceLanguage)
  }

  private async translate(name: string, message: string, targetLanguage: Language): Promise<string> {
    const translatorMessageInput: TranslatorMessageInput = {
      name,
      message,
      targetLanguage
    }
    const result = await this.chat.sendMessage({ message: JSON.stringify(translatorMessageInput) })
    return result.text ?? ''
  }
}
