import { SanitizeChatMessage } from './chat-santizer'

test('Chat Log Santizer', async () => {
  expect(SanitizeChatMessage(`/mn17 /ci1 1 /la bow TestMessage`)).toBe('TestMessage')
})
