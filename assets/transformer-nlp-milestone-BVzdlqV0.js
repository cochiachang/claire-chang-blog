var e=`---
title: Transformer：自然語言處理的里程碑
description: 說明 Transformer 模型是什麼、注意力機制如何運作，以及它如何成為 BERT、GPT 與基礎模型的重要架構。
date: 2023-09-26
category: 機器學習
tags: [Transformer, NLP, 注意力機制, BERT, GPT, 基礎模型]
readingTime: 9 分鐘
image: /images/tech/transformer-foundation-models-evolution.jpg
imageAlt: 從機器學習、深度學習到基礎模型的技術標準化演進示意圖
---


# Transformer：自然語言處理的里程碑

Transformer 是一種以注意力機制為核心的深度學習架構，讓模型能在處理文字序列時，同時判斷不同詞語之間的關係。Transformer 最早由 Vaswani 等人在 2017 年論文《Attention Is All You Need》中提出，原本用於機器翻譯等序列到序列任務，後來成為 BERT、GPT 等自然語言處理模型的重要基礎（Vaswani et al., 2017）。

## Transformer 模型是什麼？

Transformer 模型是處理序列資料的神經網路架構。Transformer 透過注意力機制追蹤文字中每個詞與其他詞的關係，進而學習上下文脈絡。

在自然語言處理（Natural Language Processing，NLP）中，句子不是單字的靜態排列，而是一組互相影響的語意關係。Transformer 的重點，就是讓模型在同一個句子裡判斷哪些詞應該互相參照。

NVIDIA 對 Transformer 的介紹中提到，Transformer 模型會使用注意力（attention）或自注意力（self-attention）這類數學技術，偵測序列中資料元素之間的依賴關係。這也是 Transformer 能支撐後續 BERT、GPT 等模型的原因之一（NVIDIA，2022）。

## 注意力機制為什麼是 Transformer 的核心？

注意力機制讓 Transformer 不必只照固定順序讀取文字。注意力機制會動態計算序列中不同位置的重要性，因此更適合捕捉長距離語意關係。

Transformer 的核心創新在於自注意力（Self-Attention）。自注意力會讓模型比較同一段輸入裡不同位置之間的關聯，並依照關聯強弱重新組合表示。

自注意力的基本流程可以拆成五步：

1. 將輸入序列轉成向量表示。
2. 為每個位置建立查詢（Query）、鍵（Key）和值（Value）。
3. 計算 Query 與 Key 的相似度，得到注意力分數。
4. 使用 softmax 將分數轉成權重。
5. 依權重加總 Value，產生帶有上下文的新表示。

多頭注意力（Multi-Head Attention）則是同時執行多組自注意力，讓模型從不同角度理解同一段輸入。例如一個注意力頭可能偏向語法關係，另一個注意力頭可能偏向語意依賴；來源內容沒有提供更細的實驗例子，因此這裡只保留概念層級。

## Transformer 的主要組件有哪些？

Transformer 由注意力、位置編碼、前饋神經網路、Layer Normalization 與殘差連接組成。這些組件共同處理語意、順序與訓練穩定性。

| 組件 | 功能 |
|---|---|
| Self-Attention | 權衡輸入序列中不同位置的重要性，捕捉詞與詞之間的依賴關係。 |
| Multi-Head Attention | 同時使用多組注意力頭，讓模型從多個角度取得資訊。 |
| Positional Encoding | 補上詞語在序列中的位置資訊，彌補 Transformer 本身沒有內建順序感知的問題。 |
| Feed-Forward Neural Networks | 在每個 Transformer block 內進行非線性轉換，強化表示能力。 |
| Layer Normalization | 穩定 Self-Attention 與 Feed-Forward 子層的訓練。 |
| Residual Connections | 讓深層模型較容易訓練，並降低梯度消失問題。 |

這些組件讓 Transformer 可以平行處理序列資料，不像傳統循環式模型必須逐步讀取。這種平行化能力，是 Transformer 在大規模訓練中變得重要的原因之一。

## 編碼器與解碼器如何分工？

Transformer 的編碼器負責理解輸入序列，解碼器負責生成輸出序列。機器翻譯常使用完整編碼器－解碼器架構，語言模型則可能只使用解碼器。

編碼器（Encoder）會將輸入文字轉成特徵表示。每一層編碼器通常包含多頭自注意力機制與前饋神經網路，前者負責找出輸入內部的關聯，後者負責進一步轉換表示。

解碼器（Decoder）則負責產生輸出文字。解碼器除了有類似編碼器的元件，還會加入關注編碼器輸出的注意力層，讓模型在生成時能參照輸入內容。這種設計特別適合機器翻譯：編碼器先理解來源語句，解碼器再生成目標語句。

## Transformer 與基礎模型有什麼關係？

Transformer 是許多基礎模型的重要架構來源。基礎模型通常在大量資料上自監督訓練，再適應問答、摘要、分類、生成等下游任務。

Stanford 研究團隊在《On the Opportunities and Risks of Foundation Models》中將大規模預訓練模型稱為基礎模型，並指出這類模型透過大規模資料訓練後，可以被調整到許多下游任務（Bommasani et al., 2021）。

基礎模型的重要特點有兩個：

- **Emergence（新興特性）**：模型能力不一定是工程師明確設計出來的，而可能在規模、資料與訓練方式結合後出現，因此行為較難完整預測。
- **Homogenization（同質化）**：不同應用越來越依賴少數通用模型，能提高開發效率，但也可能讓同一個模型缺陷擴散到多個下游系統。

![從機器學習、深度學習到基礎模型的技術標準化演進示意圖](/images/tech/transformer-foundation-models-evolution.jpg)

圖中呈現從機器學習、深度學習到基礎模型的標準化路徑：機器學習讓學習演算法標準化，深度學習讓模型架構標準化，基礎模型則進一步讓整個模型本身成為可重複適應的底座。

## 基礎模型可以用在哪些任務？

基礎模型可以從文字、圖片、語音、結構化資料與 3D 訊號中學習，再適應問答、情緒分析、資訊抽取、圖片描述與物件辨識等任務。

![基礎模型從多模態資料訓練後適應多種下游任務的示意圖](/images/tech/transformer-foundation-model-applications.jpg)

來源內容提到，基礎模型生態系統包含資料建立、整理、訓練、適應與部署等階段。這也提醒我們，模型能力不是只來自架構本身，資料品質、資料來源、使用情境與部署後監測都會影響結果。

若把 Transformer 放回這個脈絡看，Transformer 是一種重要架構；基礎模型則是更大的系統概念，包含模型、資料、訓練方式、下游適應與社會影響。

## 基礎模型帶來哪些風險？

基礎模型的風險來自規模、同質化與不可預測性。當同一個模型被廣泛用在下游任務時，偏誤、錯誤或安全缺陷也可能一起被放大。

Stanford 的基礎模型報告將風險放在社會不平等、濫用、經濟與環境影響、法律與倫理考量等面向。來源內容也特別提醒，基礎模型的缺陷可能傳遞給所有適應後的下游模型。

因此，討論 Transformer 或基礎模型時，不能只看模型在 NLP 任務上的能力。資料從哪裡來、模型如何被調整、部署後如何監測、失敗時誰負責，都是技術落地時需要一起回答的問題。

![基礎模型報告的能力、應用、技術與社會議題路線圖](/images/tech/transformer-foundation-model-paper-roadmap.jpg)

## 常見問題

### Transformer 是什麼？

Transformer 是以注意力機制為核心的神經網路架構，最早用於機器翻譯等序列到序列任務。Transformer 會計算輸入序列中不同位置之間的關係，讓模型理解上下文。

### Transformer 和 RNN 有什麼不同？

來源內容沒有詳細比較 RNN 與 Transformer 的數學差異，因此這裡只保留可確認的重點：Transformer 可以平行處理序列資料，而傳統循環式模型通常依序處理。這讓 Transformer 更適合大規模訓練。

### Self-Attention 和 Multi-Head Attention 差在哪裡？

Self-Attention 是讓模型計算同一段輸入中不同位置的關聯。Multi-Head Attention 則是同時執行多組 Self-Attention，讓模型從多個角度取得資訊。

### Transformer 為什麼會影響 BERT 和 GPT？

BERT 和 GPT 都建立在 Transformer 架構的脈絡上。來源內容指出，Transformer 後來被用於多種 NLP 任務，並成為 BERT、GPT 等模型的重要基礎。

### Transformer 只用在自然語言處理嗎？

來源內容主要討論自然語言處理與基礎模型，因此不延伸列舉其他領域。就來源內容可確認的範圍，Transformer 與其後續模型已被用於機器翻譯、文字生成、文字分類等 NLP 任務。

### 基礎模型和 Transformer 是同一件事嗎？

基礎模型和 Transformer 不是同一件事。Transformer 是模型架構；基礎模型是大規模訓練後可適應多種下游任務的模型類型，Transformer 常是基礎模型背後的重要架構之一。

## 參考資料

- Vaswani, Ashish et al., [Attention Is All You Need](https://arxiv.org/abs/1706.03762), arXiv, submitted 2017-06-12, accessed 2026-08-28.
- Bommasani, Rishi et al., [On the Opportunities and Risks of Foundation Models](https://arxiv.org/abs/2108.07258), arXiv, submitted 2021-08-16, accessed 2026-08-28.
- NVIDIA, [何謂 Transformer 模型？](https://blogs.nvidia.com.tw/2022/06/21/what-is-a-transformer-model/), 2022-06-21, accessed 2026-08-28.

## 延伸閱讀

- [FlashAttention 介紹：更快的注意力機制如何省記憶體又加速 Transformer 訓練](/post/flash-attention-introduction)：同樣聚焦 Transformer、注意力機制，可接著比較不同情境的做法。
- [FlashAttention 介紹：IO 感知的精確注意力機制，讓 Transformer 更快更省記憶體](/post/flash-attention-introduction)：同樣聚焦 Transformer、注意力機制，可接著比較不同情境的做法。
- [Transformer 模型於機器視覺的應用](/post/transformer-computer-vision-applications)：同樣聚焦 Transformer、基礎模型，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2026-08-28。此次更新將 WordPress 匯出內容整理為 Markdown，補上 GEO Answer Blocks、FAQ、參考資料與站內延伸閱讀，並保留來源文章中已出現的 Transformer 與基礎模型脈絡。
`;export{e as default};