import { SanitizeChatMessage } from './chat-santizer'

describe('Chat Log Santizer', () => {
  test('stamp', async () => {
    expect(SanitizeChatMessage(`/stamp 9`)).toBe('')
    expect(SanitizeChatMessage(`/stamp 358 戻りました！`)).toBe('戻りました！')
  })
  test('la', async () => {
    expect(SanitizeChatMessage(`/la hopping`)).toBe('')
    expect(SanitizeChatMessage(`/moya /la hello ha 3fingerpose2 /mn6 /ci8 1 りりりりんだよぉぉ♪`)).toBe('りりりりんだよぉぉ♪')
    expect(SanitizeChatMessage(`/la knucklepose+ ha rockyou`)).toBe('')

    expect(SanitizeChatMessage(`/fla bellB`)).toBe('')
    expect(SanitizeChatMessage(`/a /mn17 /fla greet /ci2 2 よろしくね`)).toBe('よろしくね')

    expect(SanitizeChatMessage(`/mla banzai ha claw2 s1`)).toBe('')
    expect(SanitizeChatMessage(`/a /ci1 3 /mla wave ぶち殺しタイム終了～♪\nお疲れ様でした♪`)).toBe('ぶち殺しタイム終了～♪\nお疲れ様でした♪')

    expect(SanitizeChatMessage(`/cla khorshidakhtar rha chopchop /ci1 1 /toge /mn16 がおー`)).toBe('がおー')
  })
  test('cf', async () => {
    expect(SanitizeChatMessage(`/cf`)).toBe('')
    expect(SanitizeChatMessage(`/cf on`)).toBe('')
    expect(SanitizeChatMessage(`/cf sync stop`)).toBe('')
    expect(SanitizeChatMessage(`/cf on v30 h10 sync`)).toBe('')
    expect(SanitizeChatMessage(`/cf rev sync stop`)).toBe('')
    expect(SanitizeChatMessage(`/cf on v-30 sync`)).toBe('')
    expect(SanitizeChatMessage(`/cf d10 v-10 on`)).toBe('')
    expect(SanitizeChatMessage(`/cf all off sync`)).toBe('')
    expect(SanitizeChatMessage(`/a /cf all on`)).toBe('')
  })
  test('fc', async () => {
    expect(SanitizeChatMessage(`/fc`)).toBe('')
    expect(SanitizeChatMessage(`/fc5 s0 /ce on`)).toBe('')
    expect(SanitizeChatMessage(`/fc3 s1.8`)).toBe('')
    expect(SanitizeChatMessage(`/fc4 s30 /ceall /uioff 30 `)).toBe('')
    expect(SanitizeChatMessage(`/fc1 s0 /uioff 10 /ce`)).toBe('')
    expect(SanitizeChatMessage(`/p /fc1 s0.001 /ce off /cf off`)).toBe('')
  })
  test('mn', async () => {
    expect(SanitizeChatMessage(`/mn16`)).toBe('')
    expect(SanitizeChatMessage(`/a /mn16 ありがと～`)).toBe('ありがと～')
    expect(SanitizeChatMessage(`/mn3 「...なんで」`)).toBe('「...なんで」')
    expect(SanitizeChatMessage(`/a /mn22 {blu}-- parry --{def}\nキミの手持ちを、少し\n分けてくれるだけで済むんだが！`)).toBe(
      '-- parry --\nキミの手持ちを、少し\n分けてくれるだけで済むんだが！'
    )
  })
  test('ms', async () => {
    expect(SanitizeChatMessage(`/ms1`)).toBe('')
    expect(SanitizeChatMessage(`/mf6 all /la trance /ms4 /mpal2`)).toBe('')
  })
  test('mf', async () => {
    expect(SanitizeChatMessage(`/mf3`)).toBe('')
    expect(SanitizeChatMessage(`/mf9 all`)).toBe('')
    expect(SanitizeChatMessage(`/mf8 all /a /mn7 /vo21 これはアタシの気持ちよ。大丈夫、変なものじゃないからぁ～`)).toBe(
      'これはアタシの気持ちよ。大丈夫、変なものじゃないからぁ～'
    )
  })
  test('mpal', async () => {
    expect(SanitizeChatMessage(`/mpal2`)).toBe('')
    expect(SanitizeChatMessage(`/mpal1 /a 復活しました、有難う！`)).toBe('復活しました、有難う！')
  })
  test('spal', async () => {
    expect(SanitizeChatMessage(`/spal2`)).toBe('')
    expect(SanitizeChatMessage(`/spal1 /mpal1 /vo12`)).toBe('')
    expect(SanitizeChatMessage(`/mpal1 /spal7 /ms21 /mf7 all`)).toBe('')
  })
  test('ci', async () => {
    expect(SanitizeChatMessage(`/ci9`)).toBe('')
    expect(SanitizeChatMessage(`/ci3 1`)).toBe('')
    expect(SanitizeChatMessage(`/ci3 1 ｳｫｵｵｵｵｵｵｱｱｱｱｱｱｱ`)).toBe('ｳｫｵｵｵｵｵｵｱｱｱｱｱｱｱ')
    expect(SanitizeChatMessage(`/ci9 nw s60`)).toBe('')
    expect(SanitizeChatMessage(`/la cameraappeal /ci8 1 /mn38 /moya よろしくです♪`)).toBe('よろしくです♪')
    expect(SanitizeChatMessage(`/cla hello ha thumbsup /ci7 1 t5`)).toBe('')
    expect(SanitizeChatMessage(`/moya /ci1 t5 {vio}フォトンブラストするクマ`)).toBe('フォトンブラストするクマ')
  })
  test('toge', async () => {
    expect(SanitizeChatMessage(`/toge`)).toBe('')
    expect(SanitizeChatMessage(`/a /toge スゥ～ッときいて、これはありがたい`)).toBe('スゥ～ッときいて、これはありがたい')
  })
  test('moya', async () => {
    expect(SanitizeChatMessage(`/moya`)).toBe('')
    expect(SanitizeChatMessage(`/moya こんにちは～`)).toBe('こんにちは～')
  })
  test('photoRoom', async () => {
    expect(SanitizeChatMessage(`/pr Dust 24`)).toBe('')
  })
  test('channel', async () => {
    expect(SanitizeChatMessage(`/a`)).toBe('')
    expect(SanitizeChatMessage(`/p`)).toBe('')
    expect(SanitizeChatMessage(`/t`)).toBe('')

    expect(SanitizeChatMessage(`/a おっと～危ない！危ない！`)).toBe('おっと～危ない！危ない！')
    expect(SanitizeChatMessage(`/p PT参加ありがとですー`)).toBe('PT参加ありがとですー')
    expect(SanitizeChatMessage(`/t /moya おつかれさまでしたー`)).toBe('おつかれさまでしたー')
  })
  test('vo', async () => {
    expect(SanitizeChatMessage(`/vo12`)).toBe('')
    expect(SanitizeChatMessage(`/vo18 /mn37 /a ありがとう！`)).toBe('ありがとう！')
  })
  test('uioff', async () => {
    expect(SanitizeChatMessage(`/uioff`)).toBe('')
    expect(SanitizeChatMessage(`/uioff /ce7 s0.24`)).toBe('')
    expect(SanitizeChatMessage(`/uioff 600`)).toBe('')
  })
  test('cmf', async () => {
    expect(SanitizeChatMessage(`/cmf ＊ニャウ・ソード`)).toBe('')
    expect(SanitizeChatMessage(`/mpal3 /cmf ＊アークマベヨネット`)).toBe('')
    expect(SanitizeChatMessage(`/mf1 all /cmf *エヴォルイクリスアルマティ /a やーっと帰ってゆっくりできる～♪`)).toBe(
      'やーっと帰ってゆっくりできる～♪'
    )
  })

  test('nw', async () => {
    expect(SanitizeChatMessage(`nw`)).toBe('')
    expect(SanitizeChatMessage(`/ci6 s30 nw`)).toBe('')
    expect(SanitizeChatMessage(`/ci1 nw /a これに見合った活躍をしないといけませんね`)).toBe('これに見合った活躍をしないといけませんね')
  })
  test('second', async () => {
    expect(SanitizeChatMessage(`/ci4 2 s120`)).toBe('')
    expect(SanitizeChatMessage(`/ce4 s1.5`)).toBe('')
    expect(SanitizeChatMessage(`/fc8 s1.5`)).toBe('')
  })
  test('directionAndAngle', async () => {
    expect(SanitizeChatMessage(`/cf h-20 d-15 on`)).toBe('')
    expect(SanitizeChatMessage(`/cf on h-10 v-30 d10 sync`)).toBe('')
  })
  test('brightness', async () => {
    expect(SanitizeChatMessage(`/la hello ha thumbsup /ci7 1 t5`)).toBe('')
    expect(SanitizeChatMessage(`/a /ci3 3 t5 /toge ドリル☆ミルキィ☆パンチ！！！`)).toBe('ドリル☆ミルキィ☆パンチ！！！')
  })
  test('facialControl', async () => {
    // negative cases
    expect(SanitizeChatMessage(`sync with me`)).toBe('sync with me')
    expect(SanitizeChatMessage(`stop there`)).toBe('stop there')
    expect(SanitizeChatMessage(`on my way`)).toBe('on my way')
    expect(SanitizeChatMessage(`off work`)).toBe('off work')
    expect(SanitizeChatMessage(`all goes to nothing`)).toBe('all goes to nothing')
    expect(SanitizeChatMessage(`rev the gear`)).toBe('rev the gear')
  })

  test('colorText', async () => {
    expect(SanitizeChatMessage(`/mla joy /ci2 3 /toge /mn15 {red}お{ora}疲{yel}れ{gre}様{blu}で{pur}し{vio}た{def}(ﾟ∀ﾟ)ノ`)).toBe(
      'お疲れ様でした(ﾟ∀ﾟ)ノ'
    )
  })
})
