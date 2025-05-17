import { ChatMessage } from '../../typings/types'

export function GeneratePromptWithChatHistory(systemPrompt: string, chatHistory: ChatMessage[]): string {
  if (chatHistory.length === 0) {
    return systemPrompt
  }
  const history = chatHistory.map((chat) => JSON.stringify({ name: chat.name, group: chat.group, message: chat.message })).join('\n')
  return `${systemPrompt}\nChat History:\n${history}`
}
