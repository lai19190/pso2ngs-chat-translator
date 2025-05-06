const regexMap = new Map<string, RegExp>()
regexMap.set('symbolRegex', /^\/symbol\d+/)
regexMap.set('stampRegex', /^\/(st|stamp) \d+/)
regexMap.set('laRegex', /^\/(la|fla|mla|cla) \S+(?: s\d+\.\d+)?(?: (ha|lha|rha) \w+)?/)
regexMap.set('cfRegex', /^\/cf (?:on|off|sync|stop)?/)
regexMap.set('fcRegex', /^\/(face|fc)\d?(?: (?:stop|off))?/)
regexMap.set('ceRegex', /^\/ce(?:all|\d)?(?: (?:stop|on|off))?/)
regexMap.set('mnRegex', /^\/mn\d+/)
regexMap.set('msRegex', /^\/(ms|myset)\d+/)
regexMap.set('mfRegex', /^\/(mf|myfashion)\d+(?: all)?/)
regexMap.set('mpalRegex', /^\/(mpal|mainpalette)\d+/)
regexMap.set('spalRegex', /^\/(spal|sainpalette)\d+/)
regexMap.set('ciRegex', /^\/ci\d \d/)
regexMap.set('togeRegex', /^\/toge/)
regexMap.set('moyaRegex', /^\/moya/)
regexMap.set('prRegex', /^\/pr \w \d+/)
regexMap.set('channelRegex', /^\/(a|p|t)/)
regexMap.set('voRegex', /^\/vo\d+/)
regexMap.set('uioffRegex', /^\/uioff(?: \d+)?/)
regexMap.set('cmfRegex', /^\/cmf \S+/)
regexMap.set('nwRegex', /^nw/)
regexMap.set('secondRegex', /^s\d+.\d+/)
regexMap.set('directionAndAngleRegex', /^(h|v|d)-?\d+/)

export function SanitizeChatMessage(chatMessage: string): string {
  let match: boolean
  do {
    match = false
    regexMap.forEach((regex) => {
      if (chatMessage.match(regex)) {
        chatMessage = chatMessage.replace(regex, '')
        chatMessage = chatMessage.trim()
        match = true
      }
    })
  } while (match)
  return chatMessage
}
