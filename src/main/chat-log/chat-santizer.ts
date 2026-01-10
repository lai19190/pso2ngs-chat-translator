const regexs: Record<string, RegExp> = {
  // main commands start with /
  stampRegex: /^\/(st|stamp) \d+\s?/,
  laRegex: /^\/(la|fla|mla|cla) \S+(?: (s|ss)\d+\.\d+)?(?: (ha|lha|rha) \w+)?\s?/,
  cfRegex: /^\/cf\s?/,
  fcRegex: /^\/(face|fc)(\d+)?\s?/,
  ceRegex: /^\/ce(?:all|\d+)?\s?/,
  mnRegex: /^\/mn\d+\s?/,
  msRegex: /^\/(ms|myset)\d+\s?/,
  mfRegex: /^\/(mf|myfashion)\d+(?: all)?\s?/,
  mpalRegex: /^\/(mpal|mainpalette)\d+\s?/,
  swpRegex: /^\/swp\d+\s?/,
  spalRegex: /^\/(spal|sainpalette)\d+\s?/,
  costumeRegex: /^\/(costume|cs) \S+\s?/,
  ciRegex: /^\/ci\d+(?: (?:(?:\d+|t\d+|nw|s\d+(?:.\d+)?)\s?)*)?\s?/,
  togeRegex: /^\/toge\s?/,
  moyaRegex: /^\/moya\s?/,
  photoRoomRegex: /^\/pr \w+ \d+\s?/,
  channelRegex: /^\/(a|p|t)\s?/,
  voRegex: /^\/vo\d+\s?/,
  uioffRegex: /^\/uioff(?: \d+)?\s?/,
  camouflageRegex: /^\/(cmf|camouflage) \S+\s?/,

  // subcommands
  nwRegex: /^nw\s?/,
  secondRegex: /^s\d+(?:.\d+)?\s?/,
  directionAndAngleRegex: /^(h|v|d)-?\d+\s?/,
  brightnessRegex: /^t\d+\s?/,
  facialControlRegex: /^(on|off|sync|stop|all|rev)\s?/,

  // global commands that could be in the middle of a message
  colorTextRegex: /\{(red|bei|gre|vio|blk|ora|yel|blu|pur|gra|whi|def)\}/g
}

export function SanitizeChatMessage(chatMessage: string): string {
  const facialRegexKeys = new Set(['cfRegex', 'fcRegex', 'ceRegex'])
  let facialCommandFound = false

  let hasMatch: boolean
  do {
    hasMatch = false

    for (const [key, regex] of Object.entries(regexs)) {
      if (key === 'facialControlRegex' && !facialCommandFound) {
        continue
      }

      if (regex.test(chatMessage)) {
        chatMessage = chatMessage.replace(regex, '')
        hasMatch = true

        if (facialRegexKeys.has(key)) {
          facialCommandFound = true
        }
      }
    }
  } while (hasMatch)

  return chatMessage
}
