import { ChatOpenAI } from '@langchain/openai'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { HarmCategory, HarmBlockThreshold } from '@google/generative-ai'
import { BaseChatModel } from '@langchain/core/language_models/chat_models'
import { Translator } from '../../typings/interface'
import {
  ChatMessage,
  Language,
  Settings,
  TranslatorUserReplyMessageInput,
  TranslatorType,
  TranslatorUserMessageInput,
  LanguageNames
} from '../../typings/types'
import { DEFAULT_REQUEST_TIMEOUT, SYSTEM_PROMPT, SYSTEM_PROMPT_REPLY, TranslatorOutputSchema } from '../../typings/constants'
import { GeneratePromptWithChatHistory } from './utils'
import { ChatXAI } from '@langchain/xai'

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
          model: openAIConfig.model
        })
      }

      case TranslatorType.Gemini: {
        const geminiConfig = settings.translation.gemini
        if (!geminiConfig.apiKey || !geminiConfig.model) {
          throw new Error('Translator.Gemini.errorMissingConfig')
        }
        const geminiModel = new ChatGoogleGenerativeAI({
          apiKey: geminiConfig.apiKey,
          model: geminiConfig.model,
          safetySettings: [
            {
              category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
              threshold: HarmBlockThreshold.BLOCK_NONE
            },
            {
              category: HarmCategory.HARM_CATEGORY_HARASSMENT,
              threshold: HarmBlockThreshold.BLOCK_NONE
            }
          ]
        })
        return geminiModel
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
          model: localLLMConfig.model
        })
      }

      case TranslatorType.XAI: {
        const xaiConfig = settings.translation.xai
        if (!xaiConfig.apiKey || !xaiConfig.model) {
          throw new Error('Translator.XAI.errorMissingConfig')
        }
        const xaiModel = new ChatXAI({
          apiKey: xaiConfig.apiKey,
          model: xaiConfig.model
        })
        return xaiModel
      }

      default:
        throw new Error(`Unsupported translator type for LangChain: ${translatorType}`)
    }
  }

  async translateToDestinationLanguage(chatMessage: ChatMessage): Promise<string> {
    const translatorInput: TranslatorUserMessageInput = {
      speakerName: chatMessage.name,
      message: chatMessage.message,
      group: chatMessage.group,
      targetLanguage: `${LanguageNames[this.destinationLanguage]}(${this.destinationLanguage})`
    }

    const systemPrompt = GeneratePromptWithChatHistory(SYSTEM_PROMPT, this.chatHistory)

    const structuredLlm = this.chatModel.withStructuredOutput(TranslatorOutputSchema, {
      name: 'translator'
    })

    const response = await structuredLlm.invoke(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: JSON.stringify(translatorInput) }
      ],
      { timeout: DEFAULT_REQUEST_TIMEOUT }
    )

    return response.translatedMessage
  }

  async translateToSourceLanguage(message: string): Promise<string> {
    const translatorInput: TranslatorUserReplyMessageInput = {
      message,
      targetLanguage: `${LanguageNames[this.sourceLanguage]}(${this.sourceLanguage})`
    }

    const systemPrompt = GeneratePromptWithChatHistory(SYSTEM_PROMPT_REPLY, this.chatHistory)

    const structuredLlm = this.chatModel.withStructuredOutput(TranslatorOutputSchema, {
      name: 'translator'
    })

    const response = await structuredLlm.invoke(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: JSON.stringify(translatorInput) }
      ],
      { timeout: DEFAULT_REQUEST_TIMEOUT }
    )

    return response.translatedMessage
  }
}
