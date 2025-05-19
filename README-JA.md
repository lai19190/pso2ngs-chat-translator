# ファンタシースターオンライン2 ニュージェネシス チャット翻訳ツール

[中文](./README-ZH.md) | [English](./README.md)

日本のMMOゲーム **ファンタシースターオンライン2 ニュージェネシス（PSO2NGS）** の多言語チャット翻訳ツール。

## ユーザインタフェース

![ユーザインタフェース](/docs/images/user_interface.png)
![設定](/docs/images/settings.png)

## 機能

- **リアルタイム翻訳**：チャットメッセージを複数の言語間で即時に翻訳。
- **翻訳エンジン選択**：
  - OpenAI
  - Gemini AI
  - ローカル LLM
    - OpenAI API互換性が必要（例：Ollama）
  - Google翻訳
- **ローマ字変換対応**：日本語をローマ字に変換可能（振り仮名・送り仮名）

## インストール

1. [Releases](https://github.com/lai19190/pso2ngs-chat-translator/releases) ページから最新版をダウンロード。
2. ダウンロードしたZIPファイルを解凍。
3. `pso2ngs-chat-translator.exe` を実行。

## 使い方

1. アプリケーションを起動。
2. 設定タブで設定を行う：
   - 使用したい翻訳エンジンを選択（例：OpenAI）
   - モデルやAPIキーを入力（必要に応じて）
     - OpenAI：[モデル](https://platform.openai.com/docs/models)、[APIキー](https://platform.openai.com/api-keys)
     - Gemini：[モデル](https://ai.google.dev/gemini-api/docs/models)、[APIキー](https://ai.google.dev/gemini-api/docs/api-key)
   - 翻訳元・翻訳先の言語を指定。
   - 必要に応じて、ローマ字変換を有効化。
3. 翻訳されたメッセージはチャットウィンドウに表示。
4. 入力欄に翻訳したいテキストを入力すると、自動的に翻訳＆クリップボードにコピーされる。

## ライセンス

このプロジェクトは [MITライセンス](./LICENSE) のもとで公開されています。

## 謝辞

このプロジェクトは [Chat-Translation-Tool](https://github.com/BigCuteDonut/Chat-Translation-Tool/) にインスピレーションを得た
