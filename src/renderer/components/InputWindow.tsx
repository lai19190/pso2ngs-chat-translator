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
      event.currentTarget.value += '\n'
      setInputValue(event.currentTarget.value)
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
        className="h-full w-full resize-none text-white outline-none"
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
