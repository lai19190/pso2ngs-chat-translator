import { Rectangle } from 'electron'
import OpenAI from 'openai'

export enum MainWindowContent {
  TRANSLATION = 'TRANSLATION',
  SETTINGS = 'SETTINGS'
}

export type ChatMessage = {
  id: string
  group: ChatGroup
  name: string
  message: string
  translation?: string
  transliteration?: string
}

export type SystemMessage = {
  id: string
  message: string
  error?: Error
}

export enum ChatGroup {
  PUBLIC = 'PUBLIC',
  PARTY = 'PARTY',
  GUILD = 'GUILD',
  REPLY = 'REPLY',
  GROUP = 'GROUP'
}

export type Settings = {
  general: {
    locale: Language
    fontSize: fontSize
    showChatWindowOnly: boolean
  }
  translation: {
    translator: TranslatorType
    sourceLanguage: Language
    destinationLanguage: Language
    showTransliteration: boolean
    transliterationType: TransliterationType
    openAI: {
      model?: OpenAI.ChatModel
      apiKey?: string
    }
    gemini: {
      model?: string
      apiKey?: string
    }
    localLLM: {
      apiEndpoint?: string
      model?: string
      apiKey?: string
    }
  }
  window: Partial<Rectangle>
}

export enum TransliterationType {
  Okurigana = 'okurigana',
  Furigana = 'furigana'
}

export enum fontSize {
  Small = 'Small',
  Medium = 'Medium',
  Large = 'Large'
}

export enum Language {
  English = 'en',
  Japanese = 'ja',
  Chinese = 'zh-TW'
}

export enum TranslatorType {
  OpenAI = 'OpenAI',
  Gemini = 'Gemini',
  GoogleTranslate = 'Google Translate',
  LocalLLM = 'Local LLM'
}

export type TranslatorMessageInput = {
  name: string
  targetLanguage: Language
  message: string
}
