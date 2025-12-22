import { franc } from 'franc'
import { ChatMessage, Settings, TranslatorType, SystemMessage } from '../typings/types'
import { ChatLogTailer } from './chat-log/chat-log-tailer'
import { BrowserWindow } from 'electron'
import { Translator } from '../typings/interface'
import { kuroshiro, SetupKuroshiro } from './translator/kuroshiro'
import { GoogleTranslator } from './translator/google-translator'
import { LangChainTranslator } from './translator/langchain-translator'
import pLimit from 'p-limit'

export class ChatServiceController {
  private mainWindow: BrowserWindow

  private settings?: Settings
  private chatLogTailer?: ChatLogTailer
  private translator?: Translator

  private chatHistory: ChatMessage[] = []
  private systemMessageCount = 0
  private queue = pLimit(1)

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow
    SetupKuroshiro()
  }

  async start(settings: Settings): Promise<void> {
    try {
      this.settings = settings
      this.chatLogTailer = new ChatLogTailer(settings)
      this.chatLogTailer.on('new-message', async (chatMessage: ChatMessage) => {
        await this.queue(() => this.notifyNewChatMessage(chatMessage))
      })
      switch (settings.translation.translator) {
        case TranslatorType.Gemini:
        case TranslatorType.OpenAI:
        case TranslatorType.LocalLLM:
          this.translator = new LangChainTranslator(settings, this.chatHistory)
          break
        case TranslatorType.GoogleTranslate:
          this.translator = new GoogleTranslator(settings)
          break
        default:
          throw new Error(`Unknown translator type: ${settings.translation.translator}`)
      }
      this.chatLogTailer.startTailing()
      this.notifyNewSystemMessage('Messages.systemInitialized')
    } catch (error) {
      this.notifyNewSystemMessage('Messages.errorInitializing', error as Error)
    }
  }

  stop(): void {
    this.chatLogTailer?.stopTailing()
  }

  async restart(settings: Settings): Promise<void> {
    this.stop()
    await this.start(settings)
  }

  async notifyNewChatMessage(chatMessage: ChatMessage): Promise<void> {
    try {
      if (!this.translator) {
        throw new Error(`Translator not initialized`)
      }
      const translatedChatMessage = await this.translator.translateToDestinationLanguage(chatMessage.name, chatMessage.message)
      chatMessage.translation = translatedChatMessage
      if (this.settings?.translation.showTransliteration) {
        const detectedLanguage = franc(chatMessage.message, { minLength: 1 })
        if (detectedLanguage === 'jpn') {
          // add transliteration to the message
          const transliteration = await kuroshiro.convert(chatMessage.message, {
            mode: this.settings.translation.transliterationType,
            to: 'hiragana'
          })
          chatMessage.transliteration = transliteration
        } else {
          // display the original message
          chatMessage.transliteration = chatMessage.message
        }
      }
      this.mainWindow.webContents.send('new-message', chatMessage)

      // store the chat message in history, limit to 10 messages
      this.chatHistory.push(chatMessage)
      if (this.chatHistory.length > 10) {
        this.chatHistory.shift()
      }
    } catch (error) {
      this.notifyNewSystemMessage('Messages.errorTranslating', error as Error)
    }
  }

  async notifyNewSystemMessage(message: string, error?: Error): Promise<void> {
    const systemMessage: SystemMessage = {
      id: `system-message-${this.systemMessageCount}`,
      message,
      error
    }
    this.mainWindow.webContents.send('new-message', systemMessage)
    this.systemMessageCount++
  }

  async translateInputMessage(message: string): Promise<string> {
    if (!this.translator) {
      throw new Error(`Translator not initialized`)
    }
    return this.translator.translateToSourceLanguage(message)
  }
}
