import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import jaTranslation from './locales/ja.json'
import zhTranslation from './locales/zh.json'

const resources = {
  ja: {
    translation: jaTranslation
  },
  zh: {
    translation: zhTranslation
  }
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  })

export default i18n
