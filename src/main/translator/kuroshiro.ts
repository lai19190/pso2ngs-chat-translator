import Kuroshiro from 'kuroshiro'
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji'

export const kuroshiro = new Kuroshiro()
export async function SetupKuroshiro(): Promise<void> {
  await kuroshiro.init(new KuromojiAnalyzer())
}
