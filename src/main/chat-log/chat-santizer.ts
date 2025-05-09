const regexs: Record<string, RegExp> = {
  symbolRegex: /^\/symbol\d+/,
  stampRegex: /^\/(st|stamp) \d+/,
  laRegex: /^\/(la|fla|mla|cla) \S+(?: s\d+\.\d+)?(?: (ha|lha|rha) \w+)?/,
  cfRegex: /^\/cf (?:on|off|sync|stop)?/,
  fcRegex: /^\/(face|fc)\d?(?: (?:stop|off))?/,
  ceRegex: /^\/ce(?:all|\d)?(?: (?:stop|on|off))?/,
  mnRegex: /^\/mn\d+/,
  msRegex: /^\/(ms|myset)\d+/,
  mfRegex: /^\/(mf|myfashion)\d+(?: all)?/,
  mpalRegex: /^\/(mpal|mainpalette)\d+/,
  spalRegex: /^\/(spal|sainpalette)\d+/,
  ciRegex: /^\/ci\d(?: (?:\w)?(?:\d)?)?/,
  togeRegex: /^\/toge/,
  moyaRegex: /^\/moya/,
  prRegex: /^\/pr \w \d+/,
  channelRegex: /^\/(a|p|t)/,
  voRegex: /^\/vo\d+/,
  uioffRegex: /^\/uioff(?: \d+)?/,
  cmfRegex: /^\/cmf \S+/,
  nwRegex: /^nw/,
  secondRegex: /^s\d+.\d+/,
  directionAndAngleRegex: /^(h|v|d)-?\d+/,
  colorTextRegex: /\{(red|bei|gre|vio|blk|ora|yel|blu|pur|gra|whi|def)\}/g
}

export function SanitizeChatMessage(chatMessage: string): string {
  let match: boolean
  do {
    match = false
    for (const [_key, regex] of Object.entries(regexs)) {
      if (chatMessage.match(regex)) {
        chatMessage = chatMessage.replace(regex, '')
        chatMessage = chatMessage.trim()
        match = true
      }
    }
  } while (match)
  return chatMessage
}
