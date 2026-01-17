import { ChatOpenAI } from '@langchain/openai'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { BaseChatModel } from '@langchain/core/language_models/chat_models'
import { Translator } from '../../typings/interface'
import { ChatMessage, Language, Settings, TranslatorMessageInput, TranslatorType } from '../../typings/types'
import { DEFAULT_REQUEST_TIMEOUT, DEFAULT_SYSTEM_PROMPT, TranslatorOutputSchema } from '../../typings/constants'
import { GeneratePromptWithChatHistory } from './utils'

export class LangChainTranslator implements Translator {
  private sourceLanguage: Language
  private destinationLanguage: Language
  private chatModel: BaseChatModel
  private chatHistory: ChatMessage[]

  constructor(settings: Settings, chatHistory: ChatMessage[]) {
    this.sourceLanguage = settings.translation.sourceLanguage
    this.destinationLanguage = settings.translation.destinationLanguage
    this.chatHistory = chatHistory
    this.chatModel = this.initializeChatModel(settings)
  }

  private initializeChatModel(settings: Settings): BaseChatModel {
    const translatorType = settings.translation.translator

    switch (translatorType) {
      case TranslatorType.OpenAI: {
        const openAIConfig = settings.translation.openAI
        if (!openAIConfig.apiKey || !openAIConfig.model) {
          throw new Error('Translator.OpenAI.errorMissingConfig')
        }
        return new ChatOpenAI({
          apiKey: openAIConfig.apiKey,
          model: openAIConfig.model,
          timeout: DEFAULT_REQUEST_TIMEOUT
        })
      }

      case TranslatorType.Gemini: {
        const geminiConfig = settings.translation.gemini
        if (!geminiConfig.apiKey || !geminiConfig.model) {
          throw new Error('Translator.Gemini.errorMissingConfig')
        }
        return new ChatGoogleGenerativeAI({
          apiKey: geminiConfig.apiKey,
          model: geminiConfig.model
        })
      }

      case TranslatorType.LocalLLM: {
        const localLLMConfig = settings.translation.localLLM
        if (!localLLMConfig.apiEndpoint || !localLLMConfig.model) {
          throw new Error('Translator.LocalLLM.errorMissingConfig')
        }
        return new ChatOpenAI({
          configuration: {
            baseURL: localLLMConfig.apiEndpoint
          },
          apiKey: localLLMConfig.apiKey || 'not-needed',
          model: localLLMConfig.model,
          timeout: DEFAULT_REQUEST_TIMEOUT
        })
      }

      case TranslatorType.XAI: {
        const xaiConfig = settings.translation.xai
        if (!xaiConfig.apiKey || !xaiConfig.model) {
          throw new Error('Translator.XAI.errorMissingConfig')
        }
        return new ChatOpenAI({
          configuration: {
            baseURL: 'https://api.x.ai/v1'
          },
          apiKey: xaiConfig.apiKey,
          model: xaiConfig.model,
          timeout: DEFAULT_REQUEST_TIMEOUT
        })
      }

      default:
        throw new Error(`Unsupported translator type for LangChain: ${translatorType}`)
    }
  }

  async translateToDestinationLanguage(name: string, message: string): Promise<string> {
    return await this.translate(name, message, this.destinationLanguage)
  }

  async translateToSourceLanguage(message: string): Promise<string> {
    return await this.translate('REPLY', message, this.sourceLanguage)
  }

  private async translate(speakerName: string, message: string, targetLanguage: Language): Promise<string> {
    const translatorInput: TranslatorMessageInput = {
      speakerName,
      message,
      targetLanguage
    }

    const systemPrompt = GeneratePromptWithChatHistory(DEFAULT_SYSTEM_PROMPT, this.chatHistory)

    const structuredLlm = this.chatModel.withStructuredOutput(TranslatorOutputSchema, {
      name: 'translator'
    })

    const response = await structuredLlm.invoke([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: JSON.stringify(translatorInput) }
    ])

    return response.translatedMessage
  }
}
