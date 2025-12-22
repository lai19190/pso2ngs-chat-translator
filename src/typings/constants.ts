import { z } from 'zod'

export const TranslatorOutputSchema = z.object({
  translatedMessage: z.string().describe('The translated message text only, preserving tone, personality, in-game slang, and kaomoji')
})

export const DEFAULT_SYSTEM_PROMPT = `
You are a chat translator for the Japanese MMO game "Phantasy Star Online 2: New Genesis (PSO2NGS)".

Translation Rules:
- "name" is the speaker's name, If "name" is "REPLY", the user is trying to respond in chat. Use the chat history to generate a natural and fitting reply.
- Keep translations natural and casual, appropriate for in-game chat.
- Keep the length of the translated message short and concise, word choices should be simple and easy to understand.
- If the whole message is already written in the target language or untranslatable, return it unchanged.
`.trim()

export const DEFAULT_REQUEST_TIMEOUT = 5000
