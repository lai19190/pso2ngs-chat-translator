import { useRef, useEffect } from 'react'
import { ChatGroup, ChatMessage, SystemMessage } from '../../../typings/types'
import parse from 'html-react-parser'
import { DOMNode, Element, domToReact } from 'html-react-parser'
import { useTranslation } from 'react-i18next'

const chatColorMap = new Map<ChatGroup, string>([
  [ChatGroup.PUBLIC, '#FFFFFF'],
  [ChatGroup.PARTY, '#4CE4FF'],
  [ChatGroup.GUILD, '#FFA500'],
  [ChatGroup.REPLY, '#FF87CC'],
  [ChatGroup.GROUP, '#99E069']
])

export type ChatWindowProps = {
  messages?: (ChatMessage | SystemMessage)[]
  hovered: boolean
  transliterationFontClassName: string
  showTransliteration?: boolean
}

export default function ChatWindow({ hovered, messages, transliterationFontClassName, showTransliteration }: ChatWindowProps): JSX.Element {
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const chatWindowDivRef = useRef<HTMLDivElement | null>(null)
  const { t } = useTranslation()

  useEffect(() => {
    if (!hovered && chatWindowDivRef.current && messagesEndRef.current) {
      // set height to bottom to avoid long animation
      chatWindowDivRef.current.scrollTop = chatWindowDivRef.current.scrollHeight
      // scroll to bottom when there is new incoming message
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, hovered])

  return (
    <div ref={chatWindowDivRef} className="w-full flex-grow overflow-y-scroll bg-gray-950/50 p-1 wrap-break-word">
      <p>
        <span className="block pb-1 text-white">{t('Welcome to the PSO2NGS Chat Translator!')}</span>
        {messages?.map((message: ChatMessage | SystemMessage) => {
          if (isChatMessage(message)) {
            return renderChatMessage(message)
          } else {
            return renderSystemMessage(message)
          }
        })}
      </p>
      <div ref={messagesEndRef} />
    </div>
  )

  function isChatMessage(message: ChatMessage | SystemMessage): message is ChatMessage {
    return 'group' in message && message.group !== undefined
  }

  function renderChatMessage(message: ChatMessage): JSX.Element {
    return (
      <span key={message.id} style={{ color: chatColorMap.get(message.group) }} className="block pb-1">
        [{t(message.group)}] [{message.name}] <br />
        {message.translation}
        {showTransliteration && message.transliteration && (
          <>
            <br /> |{parseTransliteration(message.transliteration)}|
          </>
        )}
      </span>
    )
  }

  function renderSystemMessage(systemMessage: SystemMessage): JSX.Element {
    return (
      <span key={systemMessage.id} style={{ color: '#D0F0F0' }} className="block pb-1">
        [{t('SYSTEM')}] {t(systemMessage.message)} <br />
        {t(systemMessage.error?.message ?? '')}
      </span>
    )
  }

  function parseTransliteration(transliteration: string): string | JSX.Element | JSX.Element[] {
    return parse(transliteration, {
      replace(domNode) {
        if (domNode instanceof Element && domNode.attribs && domNode.name === 'rt') {
          // add tailwind css to rt tag
          return <rt className={`${transliterationFontClassName} pt-1`}>{domToReact(domNode.children as DOMNode[])}</rt>
        }
        return
      }
    })
  }
}
