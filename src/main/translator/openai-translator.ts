import OpenAI from 'openai'
import { Translator } from '../../typings/interface'
import { Language, Settings, TranslatorMessageInput } from '../../typings/types'
import { DEFAULT_REQUEST_TIMEOUT, DEFAULT_SYSTEM_PROMPT } from '../../typings/constants'

export class OpenAITranslator implements Translator {
  private sourceLanguage: Language
  private destinationLanguage: Language
  private APIClient: OpenAI
  private model: string
  private systemPrompt: string
  private previousResponseID?: string

  constructor(settings: Settings) {
    const openAIConfig = settings.translation.openAI
    if (!openAIConfig.apiKey || !openAIConfig.model) {
      throw new Error('Please set OpenAI model or api key')
    }
    this.sourceLanguage = settings.translation.sourceLanguage
    this.destinationLanguage = settings.translation.destinationLanguage
    this.APIClient = new OpenAI({
      apiKey: openAIConfig.apiKey
    })
    this.model = openAIConfig.model
    this.systemPrompt = DEFAULT_SYSTEM_PROMPT
  }

  async translateToDestinationLanguage(name: string, message: string): Promise<string> {
    return await this.translate(name, message, this.destinationLanguage)
  }

  async translateToSourceLanguage(message: string): Promise<string> {
    return await this.translate('REPLY', message, this.sourceLanguage)
  }

  private async translate(name: string, message: string, targetLanguage: Language): Promise<string> {
    const input: OpenAI.Responses.ResponseInput = []
    if (!this.previousResponseID) {
      input.push({ role: 'developer', content: this.systemPrompt })
    }

    const translatorMessageInput: TranslatorMessageInput = {
      name,
      message,
      targetLanguage
    }
    input.push({ role: 'user', content: JSON.stringify(translatorMessageInput) })

    const response = await this.APIClient.responses.create(
      {
        model: this.model,
        input: input,
        previous_response_id: this.previousResponseID ?? undefined
      },
      { timeout: DEFAULT_REQUEST_TIMEOUT }
    )
    this.previousResponseID = response.id

    return response.output_text
  }
}
