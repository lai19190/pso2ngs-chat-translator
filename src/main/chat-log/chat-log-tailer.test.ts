import { ChatLogTailer } from './chat-log-tailer'

test('Chat Log Tailer', async () => {
  const chatLogTailer = new ChatLogTailer()
  const chatMessages = chatLogTailer.processChatLog([
    `2025-04-25T00:39:00	189	PUBLIC	14219799	TEST1	"/a Test`,
    `Multiple Line Message1"`,
    `2025-04-25T00:41:00	191	PARTY	13182309	TEST2	"Test Message2"`,
    `2025-04-25T00:59:00	192	GUILD	11032520	TEST3	Test Message3`,
    `2025-04-25T00:40:00	193	PUBLIC	14219793	TEST4	"/a Test`,
    `Message4"`,
    `2025-04-25T00:41:00	194	PUBLIC	14219794	TEST5	"/la PRpose11 rha lsign`
  ])
  expect(chatMessages).toMatchSnapshot()
})
