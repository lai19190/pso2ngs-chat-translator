# 夢幻之星 Online 2：新世紀 聊天翻譯工具

[English](./README.md) | [日本語](./README-JA.md)

一款為日系線上遊戲 **夢幻之星 Online 2：新世紀 (PSO2NGS)** 所設計的多語言即時聊天翻譯工具。

## 介面

![介面](/docs/images/user_interface.png)
![設定](/docs/images/settings.png)

## 功能特色

- **即時翻譯**：即時翻譯聊天訊息，支援多種語言互譯。
- **翻譯選項**：

  - Google Translate
  - DeepL
  - OpenAI
  - Gemini AI
  - Grok
  - 本地 LLM
    - 需要相容 OpenAI API，例如 Ollama

- **日語羅馬字支援**：可將日文轉寫為羅馬拼音（振假名、送假名）

## 安裝方式

1. 前往 [Releases](https://github.com/lai19190/pso2ngs-chat-translator/releases) 頁面下載最新版本。
2. 解壓縮下載的 ZIP 檔案。
3. 執行 `pso2ngs-chat-translator.exe` 檔案。

## 使用說明

1. 啟動應用程式。
2. 在「設定」頁籤中進行設定：
   - 選擇你偏好的翻譯（例如：OpenAI）
   - 若有需要，設定模型與 API 金鑰
     - OpenAI：[模型](https://platform.openai.com/docs/models)、[API 金鑰](https://platform.openai.com/api-keys)
     - Gemini：[模型](https://ai.google.dev/gemini-api/docs/models)、[API 金鑰](https://ai.google.dev/gemini-api/docs/api-key)
     - Grok：[模型](https://docs.x.ai/docs/models)、[API 金鑰](https://console.x.ai/)
     - DeepL：[API 金鑰](https://www.deepl.com/pro-api)
   - 設定來源語言與目標語言。
   - 如有需要，可啟用日語羅馬字功能。
3. 翻譯後的訊息會顯示在聊天視窗中。
4. 在輸入框中輸入你想翻譯的文字，文字將被翻譯並自動複製到剪貼簿。

## 授權條款

本專案依照 [MIT 授權條款](./LICENSE) 授權。

## 致謝

本專案靈感來自 [Chat-Translation-Tool](https://github.com/BigCuteDonut/Chat-Translation-Tool/)
