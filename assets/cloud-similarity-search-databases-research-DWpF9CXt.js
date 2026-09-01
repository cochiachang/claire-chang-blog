var e=`---
title: 雲端相似性搜尋資料庫研究：AWS DocDB、阿里雲 OpenSearch 與 Amazon Neptune 向量搜尋比較
description: 整理雲端相似性搜尋資料庫的研究筆記，比較 Amazon DocumentDB、阿里雲 OpenSearch Vector Search 與 Amazon Neptune Analytics 向量搜尋的特性、適用場景與選型考量，協助你為 RAG 與生成式 AI 應用挑對向量資料庫。
date: 2024-07-24
category: 機器學習
tags: [向量資料庫, 相似性搜尋, AWS, RAG, 雲端服務]
readingTime: 6 分鐘
image: /images/tech/hero_cloud-similarity-search-databases-research.webp
imageAlt: 雲端運算概念的 3D 示意圖，中央平台連結周圍的資料節點
---


# 雲端相似性搜尋資料庫研究：AWS DocDB、阿里雲 OpenSearch 與 Amazon Neptune 向量搜尋比較

在為 RAG（檢索增強生成）與生成式 AI 應用挑選向量資料庫時，我整理了三家雲端供應商的相似性搜尋方案研究筆記，涵蓋 AWS DocumentDB、阿里雲 OpenSearch Vector Search Edition 與 Amazon Neptune Analytics。這篇筆記記錄各家服務的核心特性、優勢與適用場景，幫助你快速比較選型。

## 哪些雲端服務提供相似性搜尋資料庫？

我研究的三個方案分別是 AWS DocumentDB、阿里雲 OpenSearch Vector Search Edition，以及 Amazon Neptune 的 Neptune Analytics vector store。它們各自代表不同的定位：文件資料庫加上向量能力、大規模分散式搜尋引擎，以及圖資料庫的向量搜尋擴充。

## AWS DocDB 適合什麼場景？

官方網頁: [https://aws.amazon.com/tw/documentdb/](https://aws.amazon.com/tw/documentdb/)

Amazon DocumentDB (with MongoDB compatibility) 是一種完全托管的 NoSQL 資料庫服務，可讓開發人員輕鬆地設置、操作和擴展 MongoDB 兼容的資料庫。它提供以下功能：

- **MongoDB 兼容性**：Amazon DocumentDB 與 MongoDB 兼容，因此您可以使用相同的工具、驅動程序和應用程序來管理和查詢您的數據。
- **完全託管**：Amazon DocumentDB 是一種完全託管的服務，因此您無需管理基礎架構。
- **可擴展性**：Amazon DocumentDB 可根據需要進行擴展，因此您可以隨著數據增長而擴展資料庫。
- **高可用性**：Amazon DocumentDB 提供高可用性，因此您的數據始終可用。
- **安全性**：Amazon DocumentDB 提供多種安全功能，可幫助保護您的數據。

Amazon DocumentDB 適用於各種應用，包括：

- **內容管理**：Amazon DocumentDB 可用於存儲和管理內容管理系統 (CMS) 的內容。
- **移動應用**：Amazon DocumentDB 可用於存儲和管理移動應用程序的數據。
- **實時大數據分析**：Amazon DocumentDB 可用於實時分析大數據。

## 阿里雲 OpenSearch Vector Store 有哪些優勢？

官方介紹: [https://www.alibabacloud.com/help/en/open-search/vector-search-edition/introduction-to-vector-search-edition](https://www.alibabacloud.com/help/en/open-search/vector-search-edition/introduction-to-vector-search-edition)

OpenSearch Vector Search Edition 是阿里巴巴集團開發的一款大規模分散式搜尋引擎。它為整個阿里巴巴集團提供搜索服務，包括淘寶、天貓、菜鳥、優酷以及為中國大陸以外地區的客戶提供的其他電子商務平臺。OpenSearch Vector Search Edition 也是阿裡雲 OpenSearch 的基礎引擎。經過多年的發展，它已經滿足了高可用、高時效、性價比等業務需求，還提供自動化運維系統，您可以根據業務特性構建自定義搜索服務。

OpenSearch Vector Search Edition 的優勢：

- **Stability 穩定性**：底層使用 C++ 程式設計語言開發。經過十餘年的發展，為各類核心業務系統提供了穩定的搜索服務，適用於對穩定性要求高的核心搜索場景。
- **Efficiency 效率**：作為分散式搜尋引擎，允許您檢索大量數據，並支援實時數據更新——數據更新秒級即可生效，因此適用於時間敏感的查詢和搜索場景。
- **Cost-effectiveness 成本效益**：支持多種策略進行索引壓縮和多值索引載入測試，能夠經濟高效地滿足查詢需求。

## Amazon Neptune Analytics 的向量搜尋能做什麼？

Neptune Analytics vector store 的官方介紹影片：

https://www.youtube.com/watch?v=2I2YWrook2o

影片文字節錄：

> 您可以通過將數據形狀轉換為嵌入（即向量）來回答有關數據的複雜問題。使用向量搜索索引可以回答有關數據的上下文及其與其他數據的相似性和連接的問題。
>
> 借助 Neptune Analytics 中的向量相似性搜索，您可以輕鬆構建機器學習（ML）增強搜尋體驗和生成式人工智慧（GenAI）應用程式。它還為您提供了更低的總體擁有成本和更簡單的管理開銷，因為您不再需要管理單獨的數據存儲、構建管道或擔心保持數據存儲同步。您可以在 Neptune Analytics 中使用向量相似性搜索，通過將針對特定域上下文的圖形查詢與從 Amazon Bedrock 託管的 LLMs、GraphStorm 中的圖形神經網路（GNN）或其他來源導入的嵌入的低延遲、最近鄰相似性搜尋結果整合，來增強您的 LLMs 功能。
>
> 例如，生物資訊學研究人員對將現有的血壓藥物重新用於其他可治療疾病感興趣，他們希望在內部知識圖譜上使用向量相似性搜索來找到蛋白質相互作用網路中的模式。或者一家大型在線圖書零售商可能需要使用已知的盜版材料來快速識別類似的媒體，並結合知識圖譜來識別欺騙性清單行為的模式並找到惡意賣家。
>
> 在這兩種情況下，在構建解決方案時，對知識圖譜進行向量搜索可以提高準確性和速度。它使用當今可用的工具減少了運營開銷和複雜性。

更多 API 參考: [https://docs.aws.amazon.com/neptune-analytics/latest/apiref/Welcome.html](https://docs.aws.amazon.com/neptune-analytics/latest/apiref/Welcome.html)

## 三種雲端向量搜尋方案該怎麼選？

| 服務 | 定位 | 最適合的場景 |
| --- | --- | --- |
| Amazon DocumentDB | MongoDB 兼容的完全托管 NoSQL 文件資料庫 | 已使用 MongoDB 生態、想順便獲得向量能力的文件型應用 |
| 阿里雲 OpenSearch Vector Search Edition | 大規模分散式搜尋引擎 | 高穩定性、秒級時效、大數據量與成本敏感的核心搜索業務 |
| Amazon Neptune Analytics | 圖資料庫的向量搜尋擴充 | 需要結合知識圖譜與向量相似性搜尋的 GenAI 應用 |

簡單來說：文件資料生態選 DocumentDB；超大規模、講究時效與成本的搜索場景看 OpenSearch Vector Search Edition；知識圖譜與向量檢索要同時用，就是 Neptune Analytics 的強項。

## 常見問題

### Amazon DocumentDB 真的兼容 MongoDB 嗎？

Amazon DocumentDB (with MongoDB compatibility) 設計上與 MongoDB 兼容，可以使用相同的工具、驅動程序和應用程序來管理和查詢數據。它同時是完全托管的服務，不用自己管理基礎架構。

### 阿里雲 OpenSearch Vector Search Edition 的最大特色是什麼？

它是一個用 C++ 開發的大規模分散式搜尋引擎，支撐淘寶、天貓等核心業務十餘年。特色是穩定性高、數據更新秒級生效，並透過索引壓縮策略兼顧成本效益。

### 為什麼要在知識圖譜上做向量相似性搜尋？

圖譜查詢擅長處理實體之間的關係，向量搜尋則捕捉語義相似性，兩者結合可以提高答案的準確性和速度。Neptune Analytics 讓你不必另外管理單獨的向量數據存儲和同步管道，降低總體擁有成本。

### Neptune Analytics 的向量來源有哪些？

嵌入向量可以從 Amazon Bedrock 託管的 LLMs、GraphStorm 中的圖形神經網路（GNN）或其他來源導入。導入後即可在圖形查詢中整合低延遲的最近鄰相似性搜尋結果。

### 這些服務和 RAG 應用有什麼關係？

RAG 需要低延遲的向量相似性搜尋來檢索與問題相關的上下文。這些雲端托管服務都提供向量索引能力，可作為 RAG 的檢索後端，並省去自己維運向量資料庫的功夫。

## 參考資料

- [Amazon DocumentDB 官方網頁](https://aws.amazon.com/tw/documentdb/)
- [阿里雲 OpenSearch Vector Search Edition 官方介紹](https://www.alibabacloud.com/help/en/open-search/vector-search-edition/introduction-to-vector-search-edition)
- [Amazon Neptune Analytics 介紹影片](https://www.youtube.com/watch?v=2I2YWrook2o)
- [Amazon Neptune Analytics API 參考](https://docs.aws.amazon.com/neptune-analytics/latest/apiref/Welcome.html)

## 延伸閱讀

- [雲端相似性搜尋資料庫研究：DocumentDB、OpenSearch Vector 與 Neptune Analytics 比較](/post/cloud-similarity-search-databases-research)：同樣聚焦 向量資料庫、相似性搜尋，可接著比較不同情境的做法。
- [向量搜尋資料庫比較：RAG 系統該如何選擇 Vector Database](/post/vector-database-comparison)：同樣聚焦 RAG，可接著比較不同情境的做法。
- [檢索增強生成（RAG）與 RETA-LLM 框架完整解析](/post/retrieval-augmented-llm)：同樣聚焦 RAG、向量資料庫，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2024-07-24，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};