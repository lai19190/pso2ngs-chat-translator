const regexs: Record<string, RegExp> = {
  // main commands start with /
  stampRegex: /^\/(st|stamp) \d+/,
  laRegex: /^\/(la|fla|mla|cla) \S+(?: (s|ss)\d+\.\d+)?(?: (ha|lha|rha) \w+)?/,
  cfRegex: /^\/cf/,
  fcRegex: /^\/(face|fc)\d?/,
  ceRegex: /^\/ce(?:all|\d)?/,
  mnRegex: /^\/mn\d+/,
  msRegex: /^\/(ms|myset)\d+/,
  mfRegex: /^\/(mf|myfashion)\d+(?: all)?/,
  mpalRegex: /^\/(mpal|mainpalette)\d+/,
  swpRegex: /^\/swp\d+/,
  spalRegex: /^\/(spal|sainpalette)\d+/,
  ciRegex: /^\/ci\d{1,2}(?: (?:\d)?)?/,
  togeRegex: /^\/toge/,
  moyaRegex: /^\/moya/,
  photoRoomRegex: /^\/pr \w+ \d+/,
  channelRegex: /^\/(a|p|t)/,
  voRegex: /^\/vo\d+/,
  uioffRegex: /^\/uioff(?: \d+)?/,
  cmfRegex: /^\/cmf \S+/,

  // subcommands
  nwRegex: /^nw/,
  secondRegex: /^s\d+(?:.\d+)?/,
  directionAndAngleRegex: /^(h|v|d)-?\d+/,
  brightnessRegex: /^t\d/,
  facialControlRegex: /^(on|off|sync|stop|all|rev)/,

  // global commands that could be in the middle of a message
  colorTextRegex: /\{(red|bei|gre|vio|blk|ora|yel|blu|pur|gra|whi|def)\}/g
}

export function SanitizeChatMessage(chatMessage: string): string {
  const facialKeys = new Set(['cfRegex', 'fcRegex', 'ceRegex'])
  let facialCommandFound = false

  let hasMatch: boolean
  do {
    hasMatch = false

    for (const [key, regex] of Object.entries(regexs)) {
      if (key === 'facialControlRegex' && !facialCommandFound) {
        continue
      }

      if (regex.test(chatMessage)) {
        chatMessage = chatMessage.replace(regex, '').trim()
        hasMatch = true

        if (facialKeys.has(key)) {
          facialCommandFound = true
        }
      }
    }
  } while (hasMatch)

  return chatMessage
}
