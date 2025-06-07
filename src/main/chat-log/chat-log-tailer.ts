import * as readline from 'readline'
import * as fs from 'fs'
import { ChatGroup, ChatMessage } from '../../typings/types'
import { SanitizeChatMessage } from './chat-santizer'
import EventEmitter from 'events'
import { app } from 'electron'
import { CronJob } from 'cron'
import moment from 'moment'

export class ChatLogTailer extends EventEmitter<{ 'new-message': [chatMessage: ChatMessage] }> {
  private logFilePath?: string
  private chatRegex = /(?<datetime>.+)\t(?<id>.+)\t(?<group>.+)\t(?<playerID>.+)\t(?<playerName>.+)\t(?<message>.+)/
  // restart the tailing job every day at 00:00 UTC
  private restartCronJob = new CronJob(
    '0 0 0 * * *', // every 00:00 UTC
    () => {
      this.stopTailing()
      this.startTailing()
    },
    null,
    true,
    'UTC'
  )

  startTailing(): void {
    const documentsPath = app.getPath('documents')
    const gamePlatformFolder = this.getGamePlatformFolder(this.settings)
    const gameVersionFolder = this.getGameVersionFolder(this.settings)
    const chatLogName = `ChatLog${moment().utc().format('YYYYMMDD')}_00.txt`
    const logFilePath = `${documentsPath}/SEGA/${gamePlatformFolder}/${gameVersionFolder}/${chatLogName}`
    this.logFilePath = logFilePath
    // watch the file for changes
    fs.watchFile(logFilePath, { interval: 500 }, async (curr, prev) => {
      if (curr.size > prev.size) {
        const stream = fs.createReadStream(logFilePath, { encoding: 'utf16le', start: prev.size, end: curr.size })
        const rl = readline.createInterface({
          input: stream,
          crlfDelay: Infinity
        })
        const lines: string[] = []
        for await (const line of rl) {
          lines.push(line)
        }
        const chatMessages = await this.processChatLog(lines)
        for (const chatMessage of chatMessages) {
          this.emit('new-message', chatMessage)
        }
      }
    })
  }

  processChatLog(lines: string[]): ChatMessage[] {
    let chatMessages: ChatMessage[] = []
    let currentMultiLineMessage: ChatMessage | undefined

    for (const line of lines) {
      const match = line.match(this.chatRegex)

      if (match?.groups) {
        const { id, group, playerName, message } = match.groups

        if (currentMultiLineMessage) {
          // Previous line wasn't actually a multi-line start, push it now
          chatMessages.push(currentMultiLineMessage)
          currentMultiLineMessage = undefined
        }

        const chatMessage: ChatMessage = {
          id: `chat-message-${id}`,
          group: ChatGroup[group as keyof typeof ChatGroup],
          name: playerName,
          message: message
        }

        if (message.startsWith('"')) {
          currentMultiLineMessage = chatMessage
        } else {
          chatMessages.push(chatMessage)
        }
      } else if (currentMultiLineMessage) {
        // This is a continuation of a multi-line message
        currentMultiLineMessage.message += `\n${line}`

        if (line.endsWith('"')) {
          // End of multi-line message; strip outer quotes
          currentMultiLineMessage.message = currentMultiLineMessage.message.slice(1, -1)
          chatMessages.push(currentMultiLineMessage)
          currentMultiLineMessage = undefined
        }
      }
    }

    // Sanitize all messages
    for (const chatMessage of chatMessages) {
      chatMessage.message = SanitizeChatMessage(chatMessage.message)
    }
    chatMessages = chatMessages.filter((chatMessage) => chatMessage.message !== '')

    return chatMessages
  }

  // Stop tailing the log file
  stopTailing(): void {
    if (this.logFilePath) {
      fs.unwatchFile(this.logFilePath)
    }
  }
}
