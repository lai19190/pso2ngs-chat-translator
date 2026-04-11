import { ChatMessage } from './types'

export interface Translator {
  translateToDestinationLanguage(chatMessage: ChatMessage): Promise<string>
  translateToSourceLanguage(message: string): Promise<string>
}
