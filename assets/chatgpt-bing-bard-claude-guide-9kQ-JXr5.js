var e=`---
title: ChatGPT / Bing / Bard / Claude指南
description: 整理 ChatGPT、Bing、Bard、Claude 四大生成式 AI 的入門指南：從人工智慧演進、基礎模型革命、文本到程式碼生成的應用，到五款模型的多模態能力與費用比較表。
date: 2024-02-06
category: 生成式AI
tags: [ChatGPT, Bard, Claude, Bing Chat, 生成式AI]
readingTime: 5 分鐘
image: /images/tech/hero_chatgpt-bing-bard-claude-guide.webp
imageAlt: 機器手與人類手指向 AI 字樣的科技概念圖
---


# ChatGPT / Bing / Bard / Claude指南

這篇文章整理我入門生成式 AI 的完整筆記：從人工智慧的演進過程談起，說明基礎模型（如 ChatGPT）為什麼掀起全民 AI 風潮，盤點文本、圖像、音樂、程式碼四類生成式 AI 應用，最後用一張比較表整理 ChatGPT、Bing、Bard、Claude 的上下文長度、推理能力、多模態與費用差異，幫助你快速選對工具。

## 人工智慧是怎麼演進到今天？

人工智慧的概念最早是在 1950 年時，由圖靈所提出，定義為一個人透過鍵盤和另一個對象溝通，如果施測者無法分辨與之對話的對象是人還是機器的話，這個機器就被認為擁有「智慧」。

![圖靈測試與人工智慧演進示意圖](/images/articles/chatgpt-bing-bard-claude-guide-1.webp)

但這個時候人工智慧的實作方式還比較以符號邏輯（類似統計學這樣以符號代表抽象的概念）為主，但很難清楚的釐清人類的思考邏輯。後來專家系統時代，人類會嘗試針對每個領域的知識去化作一條條的規則。

但是，人類所能表達的，遠比人類所知道的少（[博藍尼悖論](https://www.brain.com.tw/news/articlecontent?ID=23040)），因此我們很難很完整的把我們所知道的化作規則或思考邏輯來打造人工智慧。

從 2010 年至今，我們進入的資料至上的時代，也就是我們開始直接丟資料給電腦，由電腦去歸納、找出電腦自己看得懂的規則，這也是為什麼 ChatGPT 等生成式 AI 的結果帶有部分的不可控、不可預測性。

![人工智慧演進：符號邏輯、專家系統到機器學習](/images/articles/chatgpt-bing-bard-claude-guide-2.webp)

了解 AI 的演進過程可以讓我們了解當我們要選擇 AI 技術時，可能可使用的選擇。雖然 2010 年後的機器學習技術能夠做到最廣泛的通用人工智能，但是若我們的需求範圍較為侷限，或者需要非常高的可解釋性、準確性時，仍然可以考慮符號邏輯或專家系統的方式來實做。

這些演進的歷程都是現在生成式 AI 能夠出現的重要基礎，每一代之間的關係不是淘汰，而是一層層的進化。

## 基礎模型為什麼帶來 AI 再一次的革命？

在 ChatGPT 出現之前的 AI 應用，大多都用在中、大型企業內部或智能相關產品的應用。但是 ChatGPT 出現之後，AI 從產業研發進入全民有感，並且掀起了非常大的 AI 風潮。

這是因為基礎模型的出現，所謂基礎模型就是類似 ChatGPT 這樣用途可以非常廣泛，並且可以透過詞嵌入的方式，以非常快速簡單的 prompt 方式，打造不同的產品。

例如下圖中的 GitHub Copilot、智慧錄音卡、Notion AI、AI 心理諮商，其實**都是使用 ChatGPT 的模型**，卻可以使用在多種非常不同的應用場景上（心理安慰、生活便利、程式開發等不同用途）。

![基於 ChatGPT 模型的多種應用場景](/images/articles/chatgpt-bing-bard-claude-guide-3.webp)

這樣的一個基礎模型的出現，帶來開發 AI 應用的革命性變革，過去，有些 AI 應用程式可能需要我花上六個月、甚至一年的時間來建立，現在許多團隊可能一週就能完成。

![AI 應用開發時間大幅縮短](/images/articles/chatgpt-bing-bard-claude-guide-4.webp)

以 ChatGPT 的自製一個聊天機器人為例，現在只需要上傳一些機器人需要知道的文件資料、並且使用對話的方式指導機器人該如何正確回應，就可以擁有一個專屬的客製對話機器人。

![用 ChatGPT 打造客製聊天機器人](/images/articles/chatgpt-bing-bard-claude-guide-5.webp)

## 生成式 AI 有哪些應用可以研究？

有興趣的可以自行去研究、了解現在 AI 可以做到那些事情。

### 文本生成（LLM）

- [OpenAI 的 ChatGPT](https://chat.openai.com/)
- [Google 的 Bard](https://bard.google.com/chat)
- [微軟的 Bing Chat](https://www.bing.com/)
- [claude.ai](https://claude.ai/)

### 圖像生成（text-to-image）

- [Midjourney](https://www.midjourney.com/home?callbackUrl=%2Fexplore)
- [Stable diffusion](https://stability.ai/stable-diffusion)
- [OpenAI 的 DALL-E](https://openai.com/dall-e-3)

### 音樂 / 聲音生成

- [Steve AI](https://www.steve.ai/)
- [Meta 的 AudioCraft](https://audiocraft.metademolab.com/)
- [Stability AI 的 Stable Audio](https://stability.ai/stable-audio)
- [Azure AI 的 Speech Studio](https://azure.microsoft.com/zh-tw/products/ai-services/ai-speech)

### 程式碼生成

- [Amazon 的 CodeWhisperer](https://aws.amazon.com/tw/codewhisperer/)
- [Meta 的 Code Llama](https://codellama.dev/about)
- [Github 的 Copilot](https://github.com/features/copilot)
- [Hugging Face](https://huggingface.co/)

## 多模態應用是什麼？為什麼重要？

基礎模型另一個強大之處，在於可以結合視覺、聽覺、文字的輸入，以及對不同型態輸入資料的交叉理解，能夠讓 AI 朝【通用型人工智慧】更加靠近。

![多模態輸入與交叉理解示意](/images/articles/chatgpt-bing-bard-claude-guide-6.webp)

## 我該選 ChatGPT、Bing、Bard 還是 Claude？

| 特點/模型 | Bard (Google) | ChatGPT (OpenAI) | ChatGPT Plus (OpenAI) | Bing (Microsoft) | Claude (Anthropic) |
| --- | --- | --- | --- | --- | --- |
| 上下文窗口長度 (Token) | 32K | 4K | 8K | 8K | **100K** |
| 推理能力 | 不錯 | 最佳 | 最佳 | 不明 | 不錯 |
| 網路連接功能 | 原生支持網路搜尋 | 無法讀取網頁 | 需連至 Bing 取得網頁內容 | 所有用戶可用的連接功能 | 無法讀取網頁 |
| 多模態能力 | 支持文字、圖像、語音輸入 | 無 | 支持圖像、語音及文字輸入，以及圖像、文字、檔案輸出 | 支持文字輸入，圖像、文字輸出 | 支持 PDF 等檔案的文字讀取 |
| 建議用途 | 圖像辨識 | 初次接觸者 | 皆可 | 資訊搜尋 | 長文 PDF 摘要 |
| 費用 | 免費 | 免費 | 每月 $20 美金 | 免費 | 免費 |
| 主要用途 | 研究、資料分析、聊天 | 程式碼開發、聊天 | 多模態及與其他服務的串接應用 | 網路搜尋、聊天 | 研究、分析 |

想直接試用的話：

- ChatGPT：https://chat.openai.com/
- Bing：https://www.bing.com/
- Bard：https://bard.google.com/chat
- Claude：https://claude.ai/

AI 成為生產力的新動能，用戶在人工智慧輔助下完成工作的效率要高得多。

![AI 輔助下工作效能顯著提升](/images/articles/chatgpt-bing-bard-claude-guide-7.webp)

## 常見問題

### ChatGPT、Bing、Bard、Claude 都是免費的嗎？

ChatGPT 免費版、Bing、Bard 與 Claude 都是免費使用。若需要較長上下文、多模態輸入輸出與更廣的串接應用，可以考慮每月 20 美金的 ChatGPT Plus。

### 哪一款模型適合處理長文件？

Claude 的上下文窗口長達 100K tokens，遠高於其他工具，最適合長文 PDF 的閱讀與摘要。Bard 的 32K 也比 ChatGPT 免費版的 4K 更適合長內容。

### 什麼是基礎模型（Foundation Model）？

基礎模型是像 ChatGPT 這樣用途廣泛的 AI 模型，只要用簡單的 prompt 就能打造不同的產品。過去要六個月到一年才能建好的 AI 應用，現在許多團隊一週就能完成。

### 為什麼生成式 AI 的回答有時不可控、不可預測？

因為 2010 年之後的機器學習方式是直接把資料丟給電腦，由電腦自己歸納規則。這些規則不是人類一一寫下的，所以生成結果帶有部分不可控與不可預測性。

### 生成式 AI 除了寫文章還能做什麼？

文本生成之外，還有圖像生成（Midjourney、Stable Diffusion、DALL-E）、音樂與聲音生成（AudioCraft、Stable Audio）、程式碼生成（Copilot、CodeWhisperer、Code Llama）等多類應用。

## 參考資料

- [博藍尼悖論](https://www.brain.com.tw/news/articlecontent?ID=23040)
- [OpenAI ChatGPT](https://chat.openai.com/)
- [Google Bard](https://bard.google.com/chat)
- [Microsoft Bing](https://www.bing.com/)
- [Claude](https://claude.ai/)

## 延伸閱讀

- [AIGC 文字與圖片生成：ChatGPT、Bing、Bard、Claude 工具入門觀察](/post/aigc-text-image-generation)：同樣聚焦 生成式AI、ChatGPT，可接著比較不同情境的做法。
- [讓 ChatGPT 分析 PDF：Chrome File Uploader 外掛設定教學](/post/chatgpt-pdf-analysis-file-uploader)：同樣聚焦 ChatGPT，可接著比較不同情境的做法。
- [微軟如何看待人工智慧浪潮：從 Bing、ChatGPT 到 Microsoft 365 Copilot](/post/microsoft-artificial-intelligence-perspective)：同樣聚焦 ChatGPT，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2024-02-06，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};