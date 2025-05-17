import OpenAI from 'openai'
import { Translator } from '../../typings/interface'
import { ChatMessage, Language, Settings, TranslatorMessageInput } from '../../typings/types'
import { DEFAULT_REQUEST_TIMEOUT, DEFAULT_SYSTEM_PROMPT } from '../../typings/constants'
import { GeneratePromptWithChatHistory } from './utils'

export class OpenAITranslator implements Translator {
  private sourceLanguage: Language
  private destinationLanguage: Language
  private APIClient: OpenAI
  private model: string
  private chatHistory: ChatMessage[]

  constructor(settings: Settings, chatHistory: ChatMessage[]) {
    const openAIConfig = settings.translation.openAI
    if (!openAIConfig.apiKey || !openAIConfig.model) {
      throw new Error('Please set OpenAI model or api key')
    }
    this.sourceLanguage = settings.translation.sourceLanguage
    this.destinationLanguage = settings.translation.destinationLanguage
    this.APIClient = new OpenAI({
      apiKey: openAIConfig.apiKey
    })
    this.model = openAIConfig.model
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
    const input: OpenAI.Responses.ResponseInput = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: JSON.stringify(translatorMessageInput) }
    ]

    const response = await this.APIClient.responses.create(
      {
        model: this.model,
        input: input
      },
      { timeout: DEFAULT_REQUEST_TIMEOUT }
    )

    return response.output_text
  }
}
