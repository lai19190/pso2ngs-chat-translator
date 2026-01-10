import { ChatLogTailer } from './chat-log-tailer'

describe('Chat Log Tailer', () => {
  test('multi-line messages', async () => {
    const chatMessages = ChatLogTailer.processChatLog([
      `2025-04-25T00:39:00	189	PUBLIC	14219799	TEST1	"/a Test`,
      `Multiple Line Message1"`,
      `2025-04-25T00:41:00	191	PARTY	13182309	TEST2	"Test Message2"`,
      `2025-04-25T00:59:00	192	GUILD	11032520	TEST3	Test Message3`,
      `2025-04-25T01:00:00	193	PUBLIC	14219793	TEST4	"/a Test`,
      `Message4"`,
      `2025-04-25T01:01:00	194	PUBLIC	14219794	TEST5	"/la PRpose11 rha lsign`
    ])
    expect(chatMessages).toMatchSnapshot()
  })

  test('spaces and special characters', async () => {
    const chatMessages = ChatLogTailer.processChatLog([
      `2026-01-07T21:56:12	636	GUILD	14219853	TEST1	"/toge /ci2 /mla banzai  彡⌒ ミ `,
      `(´･ω･｀) 禿は動じない "`,
      `2026-01-07T21:56:14	637	GUILD	14219853	TEST1	"/toge /ci2 /mla banzai    ⌒ `,
      `(´;ω;｀)　毛が失くなった・・"`
    ])
    expect(chatMessages).toMatchSnapshot()
  })

  test('こんばんは', async () => {
    const chatMessages = ChatLogTailer.processChatLog([
      `2026-01-04T17:42:16	60	GUILD	15405714	Test1	"/t ━┓┃　　　┃━╋ Ⅱ┃　　　╋`,
      `　　┣┓　　┃┏╋ 　┣┓　　╋━┓`,
      `━━┃┗━  ┃┗┛ 　┃┗━  ┃　┛"`
    ])
    expect(chatMessages).toMatchSnapshot()
  })
})
