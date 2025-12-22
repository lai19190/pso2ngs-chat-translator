import { GoogleGenAI } from '@google/genai'
import { Translator } from '../../typings/interface'
import { ChatMessage, Language, Settings, TranslatorMessageInput } from '../../typings/types'
import { DEFAULT_REQUEST_TIMEOUT, DEFAULT_SYSTEM_PROMPT } from '../../typings/constants'
import { GeneratePromptWithChatHistory } from './utils'

export class GeminiTranslator implements Translator {
  private sourceLanguage: Language
  private destinationLanguage: Language
  private APIClient: GoogleGenAI
  private model: string
  private chatHistory: ChatMessage[]

  constructor(settings: Settings, chatHistory: ChatMessage[]) {
    const geminiConfig = settings.translation.gemini
    if (!geminiConfig.apiKey || !geminiConfig.model) {
      throw new Error('LLM.Gemini.errorMissingConfig')
    }
    this.sourceLanguage = settings.translation.sourceLanguage
    this.destinationLanguage = settings.translation.destinationLanguage
    this.APIClient = new GoogleGenAI({ apiKey: geminiConfig.apiKey })
    this.model = geminiConfig.model
    this.chatHistory = chatHistory
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
    const systemPrompt = GeneratePromptWithChatHistory(DEFAULT_SYSTEM_PROMPT, this.chatHistory)
    const result = await this.APIClient.models.generateContent({
      model: this.model,
      contents: JSON.stringify(translatorMessageInput),
      config: {
        systemInstruction: systemPrompt,
        httpOptions: {
          timeout: DEFAULT_REQUEST_TIMEOUT
        }
      }
    })
    return result.text ?? ''
  }
}
