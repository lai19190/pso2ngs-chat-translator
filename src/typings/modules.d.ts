// to avoid mistakenly treating d.ts as js by ESLint.
/* eslint-disable */
declare class Kuroshiro {
  constructor()
  init(_analyzer: KuroshiroAnalyzer): Promise<void>
  convert(
    str: string,
    options?: {
      to?: 'hiragana' | 'katakana' | 'romaji'
      mode?: 'normal' | 'spaced' | 'okurigana' | 'furigana'
      romajiSystem?: 'nippon' | 'passport' | 'hepburn'
      delimiter_start?: string
      delimiter_end?: string
    }
  ): Promise<string>
  Util: {
    isHiragana: (ch: string) => boolean
    isKatakana: (ch: string) => boolean
    isKana: (ch: string) => boolean
    isKanji: (ch: string) => boolean
    isJapanese: (ch: string) => boolean
    hasHiragana: (str: string) => boolean
    hasKatakana: (str: string) => boolean
    hasKana: (str: string) => boolean
    hasKanji: (str: string) => boolean
    hasJapanese: (str: string) => boolean
    kanaToHiragana: (str: string) => string
    kanaToKatakana: (str: string) => string
    kanaToRomaji: (str: string, system: 'nippon' | 'passport' | 'hepburn') => string
  }
}

type KuroshiroToken = {
  surface_form: string
  pos: string
  pos_detail_1: string
  pos_detail_2: string
  pos_detail_3: string
  conjugated_type: string
  conjugated_form: string
  basic_form: string
  reading: string
  pronunciation: string
  verbose?: {
    word_id: number
    word_type: string
    word_position: number
  }
}

// to avoid mistakenly treating d.ts as js by ESLint.
/* eslint-disable */
declare class KuroshiroAnalyzer {
  constructor(dictPath?: { dictPath: string })
  init(): Promise<void>
  parse(str: string): Promise<KuroshiroToken[]>
}

declare module 'kuroshiro' {
  export = Kuroshiro
}
