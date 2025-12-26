import { useTranslation } from 'react-i18next'

export type InputWindowProps = {
  inputValue: string
  setInputValue: React.Dispatch<React.SetStateAction<string>>
}

export default function InputWindow({ inputValue, setInputValue }: InputWindowProps): JSX.Element {
  const { t } = useTranslation()
  const onInputKeyDown = async (event: React.KeyboardEvent<HTMLTextAreaElement>): Promise<void> => {
    if (event.key == 'Enter' && event.altKey === true) {
      event.preventDefault()
      const textarea = event.currentTarget
      const cursorPosition = textarea.selectionStart
      const textBefore = textarea.value.substring(0, cursorPosition)
      const textAfter = textarea.value.substring(cursorPosition)
      const newValue = textBefore + '\n' + textAfter
      textarea.value = newValue
      setInputValue(newValue)
      // Set cursor position after the inserted newline
      textarea.selectionStart = textarea.selectionEnd = cursorPosition + 1
      return
    }
    if (event.key == 'Enter') {
      event.preventDefault()
      const inputValue = event.currentTarget.value
      event.currentTarget.value = ''
      setInputValue('')
      setInputValue((await window.api.translateInputMessage(inputValue)).trimEnd())
      return
    }
  }

  return (
    <div className="mt-1.5 h-20 w-full bg-gray-950/50 p-1.5">
      <textarea
        className="h-full w-full resize-none text-white outline-none [word-spacing:0.15rem]"
        placeholder={t('Messages.inputPlaceholder')}
        value={inputValue}
        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>): void => {
          setInputValue(event.currentTarget.value)
        }}
        onKeyDown={onInputKeyDown}
      />
    </div>
  )
}
