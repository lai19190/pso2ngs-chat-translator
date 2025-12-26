import { useRef, useEffect } from 'react'
import { AppUpdateInfo, ChatGroup, ChatMessage, SystemMessage } from '../../typings/types'
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
  showTimestamp?: boolean
  appUpdateInfo?: AppUpdateInfo | null
}

export default function ChatWindow({
  hovered,
  messages,
  transliterationFontClassName,
  showTransliteration,
  showTimestamp,
  appUpdateInfo
}: ChatWindowProps): JSX.Element {
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
    <div ref={chatWindowDivRef} className="w-full flex-grow overflow-y-auto bg-gray-950/50 p-1 wrap-break-word">
      <p>
        <span className="block pb-1 text-white">
          {t('Messages.welcomeMessage')}
          <br />
          {t('Messages.version')} {appUpdateInfo?.currentVersion}
          {appUpdateInfo?.updateAvailable && (
            <>
              <br />
              {t('Messages.updateAvailable')}
              <br />
              <a href="https://github.com/lai19190/pso2ngs-chat-translator/releases" rel="noreferrer" target="_blank" className="underline">
                https://github.com/lai19190/pso2ngs-chat-translator/releases
              </a>
            </>
          )}
        </span>
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
    const formattedTime = showTimestamp ? formatTimestamp(message.timestamp) : null
    return (
      <span key={message.id} style={{ color: chatColorMap.get(message.group) }} className="block pb-1">
        {formattedTime && `[${formattedTime}] `}[{t(`ChatGroup.${message.group}`)}] [{message.name}] <br />
        {message.translation}
        {showTransliteration && message.transliteration && (
          <>
            <br />
            <span className="border-b-1 border-solid">{parseTransliteration(message.transliteration)}</span>
          </>
        )}
      </span>
    )
  }

  function formatTimestamp(timestamp: string): string {
    // Parse the timestamp and format it as [HH:MM]
    const date = new Date(timestamp)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  function renderSystemMessage(systemMessage: SystemMessage): JSX.Element {
    return (
      <span key={systemMessage.id} style={{ color: '#D0F0F0' }} className="block pb-1">
        [{t('ChatGroup.SYSTEM')}] {t(systemMessage.message)} <br />
        {t(systemMessage.error?.message ?? '')}
      </span>
    )
  }

  function parseTransliteration(transliteration: string): string | JSX.Element | JSX.Element[] {
    // replace all new lines with <br /> tag
    transliteration = transliteration.replace(/\n/g, '<br />')
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
