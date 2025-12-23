import { GeneratePromptWithChatHistory } from './utils'
import { ChatGroup, ChatMessage } from '../../typings/types'

describe('GeneratePromptWithChatHistory', () => {
  const systemPrompt = 'You are a helpful translator.'

  test('returns only system prompt when chat history is empty', () => {
    const chatHistory: ChatMessage[] = []
    const result = GeneratePromptWithChatHistory(systemPrompt, chatHistory)
    expect(result).toBe(systemPrompt)
  })

  test('generates prompt with single chat message', () => {
    const chatHistory: ChatMessage[] = [
      {
        id: '1',
        group: ChatGroup.PUBLIC,
        name: 'Player1',
        message: 'Hello world',
        timestamp: '2025-12-23T10:00:00Z'
      }
    ]
    const result = GeneratePromptWithChatHistory(systemPrompt, chatHistory)
    expect(result).toBe(`${systemPrompt}\nChat History:\n[PUBLIC]Player1:Hello world`)
  })

  test('generates prompt with multiple chat messages', () => {
    const chatHistory: ChatMessage[] = [
      {
        id: '1',
        group: ChatGroup.PUBLIC,
        name: 'Player1',
        message: 'Hello world',
        timestamp: '2025-12-23T10:00:00Z'
      },
      {
        id: '2',
        group: ChatGroup.PARTY,
        name: 'Player2',
        message: 'How are you?',
        timestamp: '2025-12-23T10:01:00Z'
      },
      {
        id: '3',
        group: ChatGroup.GUILD,
        name: 'Player3',
        message: 'Good morning!',
        timestamp: '2025-12-23T10:02:00Z'
      }
    ]
    const result = GeneratePromptWithChatHistory(systemPrompt, chatHistory)
    expect(result).toBe(
      `${systemPrompt}\nChat History:\n` + `[PUBLIC]Player1:Hello world\n` + `[PARTY]Player2:How are you?\n` + `[GUILD]Player3:Good morning!`
    )
  })

  test('handles different chat groups correctly', () => {
    const chatHistory: ChatMessage[] = [
      {
        id: '1',
        group: ChatGroup.REPLY,
        name: 'Player1',
        message: 'Reply message',
        timestamp: '2025-12-23T10:00:00Z'
      },
      {
        id: '2',
        group: ChatGroup.GROUP,
        name: 'Player2',
        message: 'Group message',
        timestamp: '2025-12-23T10:01:00Z'
      }
    ]
    const result = GeneratePromptWithChatHistory(systemPrompt, chatHistory)
    expect(result).toBe(`${systemPrompt}\nChat History:\n` + `[REPLY]Player1:Reply message\n` + `[GROUP]Player2:Group message`)
  })

  test('handles messages with special characters', () => {
    const chatHistory: ChatMessage[] = [
      {
        id: '1',
        group: ChatGroup.PUBLIC,
        name: 'Player1',
        message: 'こんにちは！',
        timestamp: '2025-12-23T10:00:00Z'
      },
      {
        id: '2',
        group: ChatGroup.PUBLIC,
        name: 'Player2',
        message: '你好世界',
        timestamp: '2025-12-23T10:01:00Z'
      }
    ]
    const result = GeneratePromptWithChatHistory(systemPrompt, chatHistory)
    expect(result).toBe(`${systemPrompt}\nChat History:\n` + `[PUBLIC]Player1:こんにちは！\n` + `[PUBLIC]Player2:你好世界`)
  })

  test('handles empty system prompt', () => {
    const chatHistory: ChatMessage[] = [
      {
        id: '1',
        group: ChatGroup.PUBLIC,
        name: 'Player1',
        message: 'Hello',
        timestamp: '2025-12-23T10:00:00Z'
      }
    ]
    const result = GeneratePromptWithChatHistory('', chatHistory)
    expect(result).toBe(`\nChat History:\n[PUBLIC]Player1:Hello`)
  })

  test('ignores optional fields in chat messages', () => {
    const chatHistory: ChatMessage[] = [
      {
        id: '1',
        group: ChatGroup.PUBLIC,
        name: 'Player1',
        message: 'Original message',
        timestamp: '2025-12-23T10:00:00Z',
        translation: 'Translated message',
        transliteration: 'Transliterated message'
      }
    ]
    const result = GeneratePromptWithChatHistory(systemPrompt, chatHistory)
    expect(result).toBe(`${systemPrompt}\nChat History:\n[PUBLIC]Player1:Original message`)
  })
})
