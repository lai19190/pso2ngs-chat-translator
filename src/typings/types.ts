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
    locale: Locale
    gameVersion: GameVersion
    gamePlatform: GamePlatform
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

export enum GameVersion {
  PSO2NGS = 'PSO2NGS',
  PSO2 = 'PSO2'
}

export enum GamePlatform {
  JP = 'JP',
  GLOBAL_STEAM = 'Steam',
  GLOBAL_EPIC = 'Epic Games Store',
  GLOBAL_MICROSOFT = 'Microsoft Store'
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

export enum Locale {
  English = 'en',
  Japanese = 'ja',
  Chinese = 'zh-TW'
}

export enum Language {
  English = 'en',
  Japanese = 'ja',
  TraditionalChinese = 'zh-TW',
  SimplifiedChinese = 'zh-CN',
  Spanish = 'es',
  Portuguese = 'pt',
  Korean = 'ko',
  French = 'fr',
  German = 'de',
  Italian = 'it',
  Russian = 'ru',
  Indonesian = 'id',
  Tagalog = 'tl'
}

export enum TranslatorType {
  OpenAI = 'OpenAI',
  Gemini = 'Gemini',
  GoogleTranslate = 'GoogleTranslate',
  LocalLLM = 'LocalLLM'
}

export type TranslatorMessageInput = {
  name: string
  targetLanguage: Language
  message: string
}

export type AppUpdateInfo = {
  currentVersion: string
  updateAvailable: boolean
}
