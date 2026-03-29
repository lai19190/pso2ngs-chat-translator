import { SudachiStateless, TokenizeMode } from 'sudachi-wasm333'
import { promises } from 'fs'

export class SudachiAnalyzer implements KuroshiroAnalyzer {
  private tokenizer: SudachiStateless | null = null

  async init(): Promise<void> {
    this.tokenizer = new SudachiStateless()
    await this.tokenizer.initialize_node(promises.readFile)
  }

  async parse(str: string): Promise<KuroshiroToken[]> {
    if (!this.tokenizer) {
      throw new Error('sudachi is not initialized. Call init() first.')
    }
    return this.tokenizer.tokenize_raw(str, TokenizeMode.A).map((token) => {
      const reading = token.reading_form
      // If the reading is missing or
      // shorter than the surface form (which can happen for certain symbols or unknown words),
      // use the surface form as the reading
      if (reading === '*' || reading.length < token.surface.length) {
        token.reading_form = token.surface
      }
      return {
        surface_form: token.surface,
        pos: token.poses[0],
        pos_detail_1: token.poses[1],
        pos_detail_2: token.poses[2],
        pos_detail_3: token.poses[3],
        conjugated_type: token.poses[4],
        conjugated_form: token.poses[5],
        basic_form: token.dictionary_form,
        reading: token.reading_form,
        pronunciation: token.reading_form
      }
    })
  }
}
