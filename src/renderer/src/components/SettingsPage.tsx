import { useForm } from 'react-hook-form'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import { fontSize, Language, Settings, TranslatorType, TransliterationType } from '../../../typings/types'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export type SettingsPageProps = {
  settings: Settings | undefined
  setSettings: React.Dispatch<React.SetStateAction<Settings | undefined>>
}

export default function SettingsPage({ settings, setSettings }: SettingsPageProps): JSX.Element {
  const {
    register,
    reset,
    watch,
    formState: { isDirty }
  } = useForm<Settings>({ defaultValues: settings })
  const { t } = useTranslation()

  // save settings for each change
  useEffect(() => {
    if (isDirty) {
      const settings = watch()
      setSettings(settings)
      reset(settings)
    }
  }, [setSettings, watch, isDirty, reset])

  const tabPanelStyle = {
    className: 'm-1'
  }

  const tabColStyle = {
    className: 'm-1 p-1'
  }

  const tabRowStyle = {
    className: 'flex m-1 p-1'
  }

  const tabRowSubtitleStyle = {
    className: 'border-b'
  }

  return (
    <form className="w-full flex-grow overflow-y-scroll bg-gray-950/50 p-1 text-white">
      <Tabs selectedTabClassName="border border-white rounded-md">
        <TabList className="m-1 cursor-pointer columns-2 border-b py-2 text-center">
          <Tab>{t('General')}</Tab>
          <Tab>{t('Translation')}</Tab>
        </TabList>
        <TabPanel {...tabPanelStyle}>
          <div {...tabRowStyle}>
            <label>{t('Language')}</label>
            <div className="flex-grow"></div>
            <select {...register('general.locale', { required: true })}>
              {(Object.keys(Language) as Array<keyof typeof Language>).map((key) => {
                return (
                  <option key={key} value={Language[key]}>
                    {t(key)}
                  </option>
                )
              })}
            </select>
          </div>
          <div {...tabRowStyle}>
            <label>{t('Font Size')}</label>
            <div className="flex-grow"></div>
            <select {...register('general.fontSize', { required: true })}>
              {(Object.keys(fontSize) as Array<keyof typeof fontSize>).map((key) => {
                return (
                  <option key={key} value={fontSize[key]}>
                    {t(key)}
                  </option>
                )
              })}
            </select>
          </div>
          <div {...tabRowStyle}>
            <label>{t('Show Chat Window Only')}</label>
            <div className="flex-grow"></div>
            <label className="inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                defaultChecked={settings?.general.showChatWindowOnly}
                {...register('general.showChatWindowOnly')}
              />
              <div className="peer relative h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 peer-focus:outline-none after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-checked:bg-blue-600 dark:peer-focus:ring-blue-800"></div>
            </label>
          </div>
        </TabPanel>
        <TabPanel {...tabPanelStyle}>
          <div {...tabRowStyle}>
            <label>{t('Translator')}</label>
            <div className="flex-grow"></div>
            <select {...register('translation.translator', { required: true })}>
              {(Object.keys(TranslatorType) as Array<keyof typeof TranslatorType>).map((key) => {
                return (
                  <option key={key} value={TranslatorType[key]}>
                    {t(TranslatorType[key])}
                  </option>
                )
              })}
            </select>
          </div>
          <div {...tabRowStyle}>
            <label>{t('Source Language')}</label>
            <div className="flex-grow"></div>
            <select {...register('translation.sourceLanguage', { required: true })}>
              {(Object.keys(Language) as Array<keyof typeof Language>).map((key) => {
                return (
                  <option key={key} value={Language[key]}>
                    {t(key)}
                  </option>
                )
              })}
            </select>
          </div>
          <div {...tabRowStyle}>
            <label>{t('Destination Language')}</label>
            <div className="flex-grow"></div>
            <select {...register('translation.destinationLanguage', { required: true })}>
              {(Object.keys(Language) as Array<keyof typeof Language>).map((key) => {
                return (
                  <option key={key} value={Language[key]}>
                    {t(key)}
                  </option>
                )
              })}
            </select>
          </div>
          <div {...tabRowStyle}>
            <label>{t('Show Transliteration')}</label>
            <div className="flex-grow"></div>
            <label className="inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                defaultChecked={settings?.translation.showTransliteration}
                {...register('translation.showTransliteration')}
              />
              <div className="peer relative h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 peer-focus:outline-none after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-checked:bg-blue-600 dark:peer-focus:ring-blue-800"></div>
            </label>
          </div>
          {settings?.translation.showTransliteration && (
            <div {...tabRowStyle}>
              <label>{t('Transliteration Type')}</label>
              <div className="flex-grow"></div>
              <select {...register('translation.transliterationType', { required: true })}>
                {(Object.keys(TransliterationType) as Array<keyof typeof TransliterationType>).map((key) => {
                  return (
                    <option key={key} value={TransliterationType[key]}>
                      {t(key)}
                    </option>
                  )
                })}
              </select>
            </div>
          )}
          {settings?.translation.translator === TranslatorType.OpenAI && (
            <>
              <div {...tabRowSubtitleStyle}>{t('OpenAI')}</div>
              <div {...tabColStyle}>
                <label>{t('Model')}</label>
                <input className="w-full rounded border px-1" list="openAI-model" {...register('translation.openAI.model')} />
                <datalist id="openAI-model">
                  <option value="gpt-4.1">gpt-4.1</option>
                  <option value="gpt-4o-mini">gpt-4o-mini</option>
                  <option value="o4-mini">o4-mini</option>
                  <option value="o3">o3</option>
                </datalist>
              </div>
              <div {...tabColStyle}>
                <label>{t('API Key')}</label>
                <input className="w-full rounded border px-1" {...register('translation.openAI.apiKey')} />
              </div>
            </>
          )}
          {settings?.translation.translator === TranslatorType.Gemini && (
            <>
              <div {...tabRowSubtitleStyle}>{t('Gemini')}</div>
              <div {...tabColStyle}>
                <label>{t('Model')}</label>
                <input className="w-full rounded border px-1" list="gemini-model" {...register('translation.gemini.model')} />
                <datalist id="gemini-model">
                  <option value="gemini-2.0-flash">gemini-2.0-flash</option>
                  <option value="gemini-2.0-flash-lite">gemini-2.0-flash-lite</option>
                  <option value="gemini-1.5-pro">gemini-1.5-pro</option>
                  <option value="gemini-1.5-flash">gemini-1.5-flash</option>
                </datalist>
              </div>
              <div {...tabColStyle}>
                <label>{t('API Key')}</label>
                <input className="w-full rounded border px-1" {...register('translation.gemini.apiKey')} />
              </div>
            </>
          )}
        </TabPanel>
      </Tabs>
    </form>
  )
}
