var e=`---
title: Phi-2 vs Phi-3 大語言模型初探：小型語言模型摘要實測
description: 比較 Microsoft Phi-2 與 Phi-3 Mini 在文章摘要任務中的表現，整理模型規格、實測提示詞、輸出差異與選用建議。
date: 2024-05-01
category: 生成式AI
tags: [Phi-2, Phi-3, 小型語言模型]
readingTime: 8 分鐘
image: /images/tech/Screenshot-2024-04-23-102615.webp
imageAlt: Phi-3 Mini 模型介紹截圖
---
# Phi-2 vs Phi-3 大語言模型初探：小型語言模型摘要實測

Phi-2 與 Phi-3 都是 Microsoft 推出的 Small Language Model（SLM，小型語言模型），但在實際摘要任務中，Phi-3 Mini 明顯比 Phi-2 穩定。這次測試使用同一段無障礙科技新聞摘要需求，觀察不同 GGUF 模型是否能抓住主題、保留多個段落重點，並避免產生與輸入內容無關的內容。

## Phi-2 是什麼模型？

Phi-2 是 Microsoft 發表的 27 億參數 Transformer 模型。Phi-2 的重點不是把參數量做大，而是用較高品質的訓練資料提升推理與語言理解能力。

Microsoft Research 介紹 Phi-2 時，將 Phi-2 定位為小型語言模型研究的一個里程碑。Phi-2 使用與 Phi-1.5 相同的資料來源，並加入由 NLP 合成文字與過濾網站內容組成的新資料來源，強化安全性與教育價值（Microsoft Research，2023 年 12 月）。

![Phi-2 模型比較圖](/images/tech/1_o_G4aq694zbLs4y6gEf1jQ.webp)

這次測試使用 GGUF 版本的 Phi-2。GGUF 常被用在本機推論工具中，適合在有限硬體上快速試模型，但量化版本、模型來源與推論設定都會影響輸出品質。

## Phi-3 Mini 是什麼模型？

Phi-3 Mini 是 Microsoft 發表的 38 億參數小型語言模型。Phi-3 Mini 的優勢是指令跟隨、長上下文與摘要任務表現比 Phi-2 更穩定。

Microsoft Azure Blog 介紹 Phi-3 時，指出 Phi-3-Mini-128K-Instruct 使用 Phi-3 資料集訓練，資料包含合成資料與經過篩選的公開網站資料，重點放在高品質與推理密集內容。模型訓練後也經過監督微調與直接偏好最佳化，以提升指令遵循與安全性（Microsoft Azure，2024 年 4 月）。

![Phi-3 Mini 模型介紹截圖](/images/tech/Screenshot-2024-04-23-102615.webp)

我測試的心得是「Phi-3 試滿多次不同的輸入，成果真的還不錯，而且 token 長度可以到 128k」。這點也符合 Phi-3 Mini 128K 版本在長文本處理上的定位。

## 這次摘要任務如何測試 Phi-2 與 Phi-3？

測試提示詞要求模型扮演資料整理者，將輸入文章摘要。輸入內容混合 Amtrak、Apple、Aira、AWS、Google Docs 與 Starbucks 的無障礙科技新聞。

原始角色設定是：

\`\`\`text
You are a data organizer and will summarize the entered articles.
\`\`\`

輸入文字不是單一主題文章，而是多則資訊拼在一起。這種素材很適合測試小型語言模型的三個能力：

| 測試點 | 觀察重點 |
| --- | --- |
| 主題對齊 | 模型是否知道輸入在談無障礙與科技應用 |
| 多項資訊保留 | 模型是否保留 Amtrak、Apple、Aira、AWS、Google、Starbucks 等重點 |
| 幻覺控制 | 模型是否產生與輸入內容無關的內容 |

這不是正式 benchmark，而是實務工作中常見的「丟一段雜訊很多的資料，請模型幫忙整理」。

## Phi-2 的摘要表現如何？

Phi-2 的表現很吃模型檔與量化版本。有些 Phi-2 輸出完全偏離輸入主題，有些版本至少能抓到部分新聞重點。

我測試 TheBloke/phi-2-GGUF 的 \`phi-2.Q2_K.gguf\` 時，模型回應開始談「移除樹樁」，幾乎和無障礙科技新聞沒有關聯。當時的直接心得是：「看不出關聯性，這根本不相關吧？」

同樣是 Phi-2，\`phi-2.Q8_0.gguf\` 的結果比較接近原始素材。輸出列出了 Amtrak 車站升級、Aira 免費視覺協助、Starbucks 杯蓋設計、Apple Shortcuts、AWS ACRs 與 Google Docs 快捷鍵。不過另一個 Phi-2 GGUF 版本只剩下 Starbucks 一項，資訊保留仍不穩。

## Phi-3 Mini 的摘要表現如何？

Phi-3 Mini 在這次測試中能把多則新聞分成獨立段落。Phi-3 Mini 沒有只抓單一事件，也沒有大幅偏離無障礙科技主題。

Phi-3 Mini 的輸出把 Amtrak、Apple Shortcuts、Aira、AWS Accessibility Conformance Reports、Google Docs shortcuts 與 Starbucks cold cups 分別整理成小標與摘要。雖然有些措辭偏正式，但資訊方向和原始素材一致。

這對本機小模型很重要。摘要任務不是只要句子通順，而是要保留足夠多的原始事實。以這次測試來看，Phi-3 Mini 比 Phi-2 更適合用在文章整理、資料摘要與初步分類。

## Phi-2 與 Phi-3 該怎麼選？

如果目標是本機摘要、文件整理與指令式任務，Phi-3 Mini 會比 Phi-2 更值得優先測試。Phi-2 可以作為小模型入門觀察，但需要更仔細挑選版本與提示詞。

| 情境 | 建議模型 | 理由 |
| --- | --- | --- |
| 快速理解小型語言模型 | Phi-2 | 參數小，適合觀察小模型限制 |
| 摘要多段文章 | Phi-3 Mini | 較能保留多個主題 |
| 長上下文整理 | Phi-3 Mini 128K | 上下文長度更適合長文本 |
| 本機低成本實驗 | 兩者都可測 | 需比較量化版本與硬體速度 |

這次實測的資訊增益很簡單：同一段輸入下，Phi-2 可能會嚴重離題，Phi-3 Mini 則比較能完成「資料整理者」的角色。若要把模型放進自動化流程，穩定性比單次漂亮輸出更重要。

## 常見問題
### Phi-2 和 Phi-3 最大差異是什麼？

Phi-2 是 27 億參數模型，Phi-3 Mini 是 38 億參數模型。以這次摘要測試來看，Phi-3 Mini 的指令跟隨和多段資訊保留比較穩定。

### Phi-3 Mini 可以取代大型語言模型嗎？

Phi-3 Mini 適合成本、速度與本機部署敏感的任務。需要高可靠推理、複雜規劃或高風險決策時，仍應測試更大的模型或加入人工審核。

### GGUF 版本會影響模型表現嗎？

GGUF 版本、量化方式與模型來源都會影響輸出品質。這次 Phi-2 不同版本的差異很明顯，因此不能只看模型名稱就判斷能力。

### 小型語言模型適合做摘要嗎？

小型語言模型可以做摘要，但需要用真實文本測試穩定性。摘要任務要同時看主題對齊、資訊保留與幻覺控制。

### Phi-3 Mini 128K 的長上下文有什麼用？

Phi-3 Mini 128K 適合處理較長的文章、報告或多段資料整理。長上下文不代表一定準確，但能降低文本被截斷的機率。

## 參考資料
- Microsoft Research，〈[Phi-2: The surprising power of small language models](https://www.microsoft.com/en-us/research/blog/phi-2-the-surprising-power-of-small-language-models/)〉，2023 年 12 月。
- Microsoft Azure，〈[Introducing Phi-3: Redefining what's possible with SLMs](https://azure.microsoft.com/en-us/blog/introducing-phi-3-redefining-whats-possible-with-slms/)〉，2024 年 4 月。
- Hugging Face，〈[TheBloke/phi-2-GGUF](https://huggingface.co/TheBloke/phi-2-GGUF)〉。
- Hugging Face，〈[microsoft/Phi-3-mini-4k-instruct-gguf](https://huggingface.co/microsoft/Phi-3-mini-4k-instruct-gguf)〉。

## 延伸閱讀

- [Ollama 本地端運行 LLM 服務教學](/post/ollama-local-llm-service)：同屬「生成式AI」主題，可延伸理解相近問題的判斷方式。
- [LangChain 基礎鏈介紹：LLMChain、SequentialChain 與 TransformChain 怎麼用？](/post/langchain-chains-introduction)：同屬「生成式AI」主題，可延伸理解相近問題的判斷方式。
- [RAGFlow 開源 RAG 引擎介紹：功能、架構與本機部署觀察](/post/ragflow-open-source-rag-engine)：同屬「生成式AI」主題，可延伸理解相近問題的判斷方式。

## 最後更新

2026-08-28

`;export{e as default};