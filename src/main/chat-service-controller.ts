import { franc } from 'franc'
import { ChatMessage, Settings, TranslatorType, SystemMessage } from '../typings/types'
import { ChatLogTailer } from './chat-log/chat-log-tailer'
import { BrowserWindow } from 'electron'
import { Translator } from '../typings/interface'
import { kuroshiro, SetupKuroshiro } from './translator/kuroshiro'
import { GoogleTranslator } from './translator/google-translator'
import { LangChainTranslator } from './translator/langchain-translator'
import { DeepLTranslator } from './translator/deepl-translator'
import PQueue from 'p-queue'
import { DEFAULT_REQUEST_TIMEOUT } from '../typings/constants'

export class ChatServiceController {
  private mainWindow: BrowserWindow

  private settings: Settings
  private chatLogTailer: ChatLogTailer
  private translator: Translator

  private chatHistory: ChatMessage[] = []
  private systemMessageCount = 0
  private queue = new PQueue({ concurrency: 1, timeout: DEFAULT_REQUEST_TIMEOUT })
  private isPaused = false

  constructor(mainWindow: BrowserWindow, settings: Settings) {
    this.mainWindow = mainWindow
    SetupKuroshiro()

    this.settings = settings
    const { chatLogTailer, translator } = this.start(settings)
    this.chatLogTailer = chatLogTailer
    this.translator = translator
  }

  start(settings: Settings): {
    chatLogTailer: ChatLogTailer
    translator: Translator
  } {
    try {
      const chatLogTailer = new ChatLogTailer(settings)
      chatLogTailer.on('new-message', async (chatMessage: ChatMessage) => {
        try {
          await this.queue.add(() => this.notifyNewChatMessage(chatMessage))
        } catch (error) {
          this.notifyNewSystemMessage('Messages.errorTranslating', error as Error)
        }
      })
      let translator: Translator
      switch (settings.translation.translator) {
        case TranslatorType.Gemini:
        case TranslatorType.OpenAI:
        case TranslatorType.LocalLLM:
        case TranslatorType.XAI:
          translator = new LangChainTranslator(settings, this.chatHistory)
          break
        case TranslatorType.GoogleTranslate:
          translator = new GoogleTranslator(settings)
          break
        case TranslatorType.DeepL:
          translator = new DeepLTranslator(settings)
          break
        default:
          throw new Error(`Unknown translator type: ${settings.translation.translator}`)
      }
      chatLogTailer.startTailing()
      this.notifyNewSystemMessage('Messages.systemInitialized')
      return {
        chatLogTailer: chatLogTailer,
        translator: translator
      }
    } catch (error) {
      this.notifyNewSystemMessage('Messages.errorInitializing', error as Error)
      throw new Error('Failed to start ChatServiceController' + (error instanceof Error ? ': ' + error.message : ''))
    }
  }

  stop(): void {
    this.chatLogTailer.stopTailing()
  }

  async restart(settings: Settings): Promise<void> {
    this.stop()
    this.settings = settings
    const { chatLogTailer, translator } = this.start(settings)
    this.chatLogTailer = chatLogTailer
    this.translator = translator
  }

  async notifyNewChatMessage(chatMessage: ChatMessage): Promise<void> {
    // Skip translation if paused
    if (this.isPaused) {
      return
    }
    try {
      const translatedChatMessage = await this.translator.translateToDestinationLanguage(chatMessage.name, chatMessage.message)
      chatMessage.translation = translatedChatMessage
      if (this.settings.translation.showTransliteration) {
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

  togglePause(): boolean {
    this.isPaused = !this.isPaused
    return this.isPaused
  }

  getIsPaused(): boolean {
    return this.isPaused
  }
}
