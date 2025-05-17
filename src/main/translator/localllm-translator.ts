import OpenAI from 'openai'
import { Translator } from '../../typings/interface'
import { ChatMessage, Language, Settings, TranslatorMessageInput } from '../../typings/types'
import { DEFAULT_REQUEST_TIMEOUT, DEFAULT_SYSTEM_PROMPT } from '../../typings/constants'
import { GeneratePromptWithChatHistory } from './utils'

type ChatCompletionMessageParam =
  | OpenAI.Chat.ChatCompletionUserMessageParam
  | OpenAI.Chat.ChatCompletionAssistantMessageParam
  | OpenAI.Chat.ChatCompletionSystemMessageParam

export class LocalLLMTranslator implements Translator {
  private sourceLanguage: Language
  private destinationLanguage: Language
  private APIClient: OpenAI
  private model: string
  private chatHistory: ChatMessage[]

  constructor(settings: Settings, chatHistory: ChatMessage[]) {
    const localLLMConfig = settings.translation.localLLM
    if (!localLLMConfig.apiEndpoint || !localLLMConfig.model) {
      throw new Error('Please set local LLM endpoint and model')
    }
    this.sourceLanguage = settings.translation.sourceLanguage
    this.destinationLanguage = settings.translation.destinationLanguage
    this.APIClient = new OpenAI({
      baseURL: localLLMConfig.apiEndpoint,
      apiKey: localLLMConfig.apiKey
    })
    this.model = localLLMConfig.model
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
    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: JSON.stringify(translatorMessageInput) }
    ]

    const response = await this.APIClient.chat.completions.create(
      {
        model: this.model,
        messages: messages
      },
      {
        timeout: DEFAULT_REQUEST_TIMEOUT
      }
    )

    return response.choices[0].message.content ?? ''
  }
}
