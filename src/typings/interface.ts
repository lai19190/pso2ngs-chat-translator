export interface Translator {
  translateToDestinationLanguage(name: string, message: string): Promise<string>
  translateToSourceLanguage(message: string): Promise<string>
}
