import type { Config } from 'jest'
import { createDefaultPreset } from 'ts-jest'

const config: Config = {
  ...createDefaultPreset({
    tsconfig: 'tsconfig.node.json'
  }),
  testTimeout: 30 * 1000
}

export default config
