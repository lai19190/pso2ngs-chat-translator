import { franc } from 'franc'
import { ChatMessage, Settings, TranslatorType, SystemMessage } from '../typings/types'
import { ChatLogTailer } from './chat-log/chat-log-tailer'
import { BrowserWindow } from 'electron'
import { GeminiTranslator } from './translator/gemini-translator'
import { Translator } from '../typings/interface'
import { kuroshiro, SetupKuroshiro } from './translator/kuroshiro'
import { GoogleTranslator } from './translator/google-translator'
import { OpenAITranslator } from './translator/openai-translator'
import pLimit from 'p-limit'

export class ChatServiceController {
  private mainWindow: BrowserWindow
  private chatLogTailer: ChatLogTailer

  private settings?: Settings
  private translator?: Translator

  private systemMessageCount = 0
  private queue = pLimit(1)

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow
    SetupKuroshiro()
    this.chatLogTailer = new ChatLogTailer()
    this.chatLogTailer.on('new-message', async (chatMessage: ChatMessage) => {
      await this.queue(() => this.notifyNewChatMessage(chatMessage))
    })
  }

  async start(settings: Settings): Promise<void> {
    try {
      this.settings = settings
      switch (settings.translation.translator) {
        case TranslatorType.Gemini:
          this.translator = new GeminiTranslator(settings)
          break
        case TranslatorType.OpenAI:
          this.translator = new OpenAITranslator(settings)
          break
        case TranslatorType.GoogleTranslate:
          this.translator = new GoogleTranslator(settings)
          break
      }
      this.chatLogTailer.startTailing()
      this.notifyNewSystemMessage(`System Initialized`)
    } catch (error) {
      this.notifyNewSystemMessage(`Error when initializing`, error as Error)
    }
  }

  stop(): void {
    this.chatLogTailer.stopTailing()
  }

  async restart(settings: Settings): Promise<void> {
    this.stop()
    await this.start(settings)
  }

  async notifyNewChatMessage(chatMessage: ChatMessage): Promise<void> {
    try {
      const translatedChatMessage = await this.translator!.translateToDestinationLanguage(chatMessage.name, chatMessage.message)
      chatMessage.translation = translatedChatMessage
      if (this.settings?.translation.showTransliteration) {
        const detectedLanguage = franc(chatMessage.message, { minLength: 1 })
        if (detectedLanguage === 'jpn') {
          const transliteration = await kuroshiro.convert(chatMessage.message, {
            mode: this.settings.translation.transliterationType,
            to: 'hiragana'
          })
          chatMessage.transliteration = transliteration
        }
      }
      this.mainWindow.webContents.send('new-message', chatMessage)
    } catch (error) {
      this.notifyNewSystemMessage(`Error when translating chat message`, error as Error)
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
    return this.translator!.translateToSourceLanguage(message)
  }
}
