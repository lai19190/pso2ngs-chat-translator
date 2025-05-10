import * as readline from 'readline'
import * as fs from 'fs'
import moment from 'moment-timezone'
import { ChatGroup, ChatMessage } from '../../typings/types'
import { SanitizeChatMessage } from './chat-santizer'
import EventEmitter from 'events'
import { app } from 'electron'

export class ChatLogTailer extends EventEmitter<{ 'new-message': [chatMessage: ChatMessage] }> {
  private logFilePath?: string
  private chatRegex = /(?<datetime>.+)\t(?<id>.+)\t(?<group>.+)\t(?<playerID>.+)\t(?<playerName>.+)\t(?<message>.+)/

  startTailing(): void {
    const logFilePath = `${app.getPath('documents')}/SEGA/PHANTASYSTARONLINE2/log_ngs/ChatLog${moment().tz('Asia/Tokyo').format('YYYYMMDD')}_00.txt`
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
        currentMultiLineMessage.message += ` ${line}`

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
