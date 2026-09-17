var e=`---
title: ChatTTS 開源文字轉語音套件實測：安裝、Colab 整合包與多角色對話合成
description: 我用 ChatTTS 這個開源文字轉語音（TTS）套件，把文字轉成接近真人、帶停頓與笑聲的自然語音。本文整理安裝步驟、ChatTTS_colab 整合包用法、音色抽卡、Refine Text 與多角色對話合成，附試聽資源。
date: 2024-07-24
category: 機器學習
tags: [ChatTTS, TTS, 文字轉語音, 開源專案, 語音合成]
readingTime: 5 分鐘
image: /images/tech/hero_chattts-open-source-tts.webp
imageAlt: ChatTTS 開源文字轉語音（TTS）主題插圖，呈現語音波形與聲音合成概念
---


# ChatTTS 開源文字轉語音套件實測：安裝、Colab 整合包與多角色對話合成

我想把文字內容轉換成接近人類真實聲音的語音輸出，於是實際玩了 **ChatTTS** 這個開源的文本轉語音（Text-to-Speech, TTS）專案。它在 GitHub 上迅速獲得大量關注，語音合成效果非常逼真，甚至超越一些商用 TTS 服務。ChatTTS 使用大量語音數據訓練，目前提供的模型能生成語氣、停頓和節奏都極其自然的語音，支援多種語言與音色，並可在本地或雲端（如 Colab）環境運行，也有易於使用的整合包和腳本，方便快速上手。

## ChatTTS 是什麼？它比其他開源 TTS 好在哪裡？

ChatTTS 是一個開源的文本轉語音（Text-to-Speech, TTS）專案，目標是把文字轉換為接近人類真實聲音的語音輸出。它使用大量語音數據訓練，生成的語音在語氣、停頓和節奏上都極其自然，支援多種語言與音色合成，甚至超越了一些商用 TTS 服務。

模型的主要優勢有三點：

1. **對話式 TTS**：ChatTTS 針對對話式任務進行最佳化，能實現自然且富有表現力的合成語音。
2. **精細的控制**：模型可以預測和控制精細的韻律特徵，包括笑聲、停頓和插入語。
3. **更好的韻律**：ChatTTS 在韻律方面超越了大多數開源 TTS 模型。

## ChatTTS 的官方資源在哪裡？

兩個最常用的入口：

- GitHub 專案地址：[2noise/ChatTTS](https://github.com/2noise/ChatTTS/tree/main)
- 直接可使用的易用版本 ChatTTS_colab：[6drf21e/ChatTTS_colab](https://github.com/6drf21e/ChatTTS_colab)

## 怎麼在本機安裝並啟動 ChatTTS？

安裝只要三步：Clone Repo、安裝相依套件、啟動 WebUI。

Clone Repo：

\`\`\`bash
git clone https://github.com/2noise/ChatTTS
cd ChatTTS
\`\`\`

安裝相關套件：

\`\`\`bash
pip install --upgrade -r requirements.txt
\`\`\`

啟動：

\`\`\`bash
python examples/web/webui.py
\`\`\`

## ChatTTS_colab 整合包怎麼用？

如果不想自己裝環境，ChatTTS_colab 這個整合包真的可以讓人很容易地使用 ChatTTS：從官方 GitHub 的下載連結下載、解壓縮後直接便可以使用，點選運行就會跑出網頁操作介面。

![ChatTTS_colab 下載後解壓縮即可運行，點選運行啟動網頁操作介面](/images/articles/chattts-open-source-tts-1.webp)

網頁介面長這樣，可以使用「音色抽卡」功能挑選滿意的音色，並下載該語音模型檔案：

![ChatTTS_colab 網頁介面，可透過音色抽卡挑選音色並下載模型檔案](/images/articles/chattts-open-source-tts-2.webp)

## Refine Text 功能能做什麼？

另外有 Refine Text 功能，它可以透過大語言模型自動為輸入的文字加上停頓或笑聲；我們也可以自己手動加上，使用特別的標籤 \`[uv_break]\`（停頓）或 \`[uv_laugh]\`（笑聲）：

![ChatTTS_colab 的 Refine Text 功能，可自動為文字加上停頓或笑聲標記](/images/articles/chattts-open-source-tts-3.webp)

## 怎麼用 ChatTTS 產生多人對話？

也可以透過文本產生多個人的對話，用 \`::\` 來分隔「角色」和「對話內容」，例如：

\`\`\`text
旁白::在一個風和日麗的下午，小紅帽準備去森林裡看望他的奶奶
\`\`\`

接著按下「步驟 1 提取角色」，右邊的角色種子就會根據文本的角色出現在表格當中；接著填入預選好的種子編號以及相關語速、笑聲等設定，就可以將整段對話產生為一個音檔：

![ChatTTS_colab 的多角色對話功能，提取角色後設定種子與語速即可合成整段對話](/images/articles/chattts-open-source-tts-4.webp)

此為開啟伺服器的 Python 視窗，可以看到伺服器正在產生影片：

![開啟 ChatTTS_colab 伺服器的 Python 視窗，顯示正在產生影片](/images/articles/chattts-open-source-tts-5.webp)

## 哪裡可以試聽 ChatTTS 產生的音檔？

有整理過的音色評比網站，登入後可直接線上試聽不同的音色：

[ChatTTS Speaker 音色評比（ModelScope）](https://modelscope.cn/studios/ttwwwaa/ChatTTS_Speaker)

![ModelScope 上的 ChatTTS Speaker 音色評比網站，可線上試聽不同音色](/images/articles/chattts-open-source-tts-6.webp)

## 常見問題

### ChatTTS 是免費的嗎？

是，ChatTTS 是開源專案，可在 GitHub 上自由取得，也允許在本地或雲端（如 Colab）環境中運行。不過實際使用前仍建議確認官方 repo 的授權條款與使用限制。

### 不會寫程式也能使用 ChatTTS 嗎？

可以。使用 ChatTTS_colab 整合包，下載、解壓縮後點選運行就會出現網頁操作介面，完全不需要自己安裝 Python 環境或下指令。

### ChatTTS 的音色要怎麼挑選？

在網頁介面使用「音色抽卡」功能隨機產生音色，聽到滿意的就記下該音色的種子編號，之後可以用同一個種子重現，也可以下載該語音模型檔案。另外 ModelScope 上有整理過的音色評比網站可先線上試聽。

### 怎麼讓 ChatTTS 的語音有停頓和笑聲？

有兩種方式：使用 Refine Text 功能讓大語言模型自動為文字加上韻律標記，或是手動在文本中插入特殊標籤 \`[uv_break]\`（停頓）與 \`[uv_laugh]\`（笑聲）。

### ChatTTS 可以合成多人對話嗎？

可以。在文本中用 \`::\` 分隔「角色」和「對話內容」，按下「提取角色」後系統會為每個角色分配種子，再設定語速、笑聲等參數，就能把整段對話合成為一個音檔。

## 參考資料

- [ChatTTS GitHub 專案（2noise/ChatTTS）](https://github.com/2noise/ChatTTS/tree/main)
- [ChatTTS_colab 易用整合包（6drf21e/ChatTTS_colab）](https://github.com/6drf21e/ChatTTS_colab)
- [ChatTTS Speaker 音色評比（ModelScope）](https://modelscope.cn/studios/ttwwwaa/ChatTTS_Speaker)

## 延伸閱讀

- [LM Studio 本地部署開源 LLM 完整教學：輕鬆測試和部署大型語言模型](/post/lm-studio-local-llm-testing)：同屬「機器學習」主題，可延伸理解相近問題的判斷方式。
- [EchoMimic：人物圖片轉影片的開源模型，安裝與使用教學](/post/echomimic-open-source-portrait-to-video)：同屬「機器學習」主題，可延伸理解相近問題的判斷方式。
- [Tesseract OCR 介紹：Google 開源光學文字辨識工具怎麼用](/post/tesseract-ocr-introduction)：同屬「機器學習」主題，可延伸理解相近問題的判斷方式。

## 最後更新

2026-08-28（原文發布於 2024-07-24，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};