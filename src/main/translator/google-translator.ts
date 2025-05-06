import { Translator } from '../../typings/interface'
import { Language, Settings } from '../../typings/types'

export class GoogleTranslator implements Translator {
  private sourceLanguage: Language
  private destinationLanguage: Language
  private translationEndpoint = `https://translate.googleapis.com/translate_a/single`

  constructor(settings: Settings) {
    this.sourceLanguage = settings.translation.sourceLanguage
    this.destinationLanguage = settings.translation.destinationLanguage
  }

  async translateToDestinationLanguage(_name: string, message: string): Promise<string> {
    const translateURL = `${this.translationEndpoint}?client=gtx&dt=t&sl=${this.sourceLanguage}&tl=${this.destinationLanguage}&q=${encodeURIComponent(message)}`
    const translationResponse = await fetch(translateURL)
    const translationJson = JSON.parse(await translationResponse.text())
    return translationJson[0][0][0]
  }

  async translateToSourceLanguage(message: string): Promise<string> {
    const translateURL = `${this.translationEndpoint}?client=gtx&dt=t&sl=${this.destinationLanguage}&tl=${this.sourceLanguage}&q=${encodeURIComponent(message)}`
    const translationResponse = await fetch(translateURL)
    const translationJson = JSON.parse(await translationResponse.text())
    return translationJson[0][0][0]
  }
}
