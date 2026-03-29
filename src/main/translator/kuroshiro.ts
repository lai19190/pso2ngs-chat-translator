import Kuroshiro from 'kuroshiro'
import { SudachiAnalyzer } from './sudachi-analyzer'

export const kuroshiro = new Kuroshiro()
export async function SetupKuroshiro(): Promise<void> {
  const analyzer = new SudachiAnalyzer()
  await kuroshiro.init(analyzer)
}
