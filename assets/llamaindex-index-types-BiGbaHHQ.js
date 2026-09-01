var e=`---
title: 在 LlamaIndex 中使用索引（Index）：五種索引類型與使用時機
description: 在 LlamaIndex 中，索引（Index）是組織與儲存文件節點（Node）的資料結構。本文介紹 List Index、Vector Store Index、Tree Index、Keyword Table Index 與 Knowledge Graph Index 五種索引類型的原理、查詢方式與使用時機，幫助你在 RAG 專案中選對索引。
date: 2024-05-17
category: 機器學習
tags: [LlamaIndex, RAG, Index, Knowledge Graph, Vector Database]
readingTime: 5 分鐘
image: /images/tech/hero_llamaindex-index-types.webp
imageAlt: LlamaIndex 索引與 RAG 資料結構示意圖
---


# 在 LlamaIndex 中使用索引（Index）：五種索引類型與使用時機

在 LlamaIndex 中，索引（Index）是一種組織與儲存文件內容的資料結構，決定了 RAG 系統在查詢時「怎麼找出相關片段」。本文整理五種常見索引類型——List、Vector Store、Tree、Keyword Table 與 Knowledge Graph——的運作原理、查詢方式，以及各自適合的使用時機。

## 甚麼是索引（Index）？

在 LlamaIndex 中，索引是一種資料結構，用於組織和存儲來自各種數據來源的信息，使搜索變得更加容易。索引是建立在一組節點（Node）之上的。節點（Node）是 LlamaIndex 的基本單位，一種包含一段文本的資料結構。每當提供一個文件時，可以將其分割成多個片段並存儲在節點中。

## 索引類型有哪些？

LlamaIndex 提供不同類型的索引，以下是我整理要學習的五種類型：

### List Index

將節點存儲為像鏈表結構那樣的順序鏈。默認情況下，它會從所有節點中獲取數據並作為響應的一部分發送。

可以使用基於嵌入（embedding）的查詢來獲取前 k 個節點，或者添加關鍵字過濾器進行查詢。

![LlamaIndex List Index 結構示意圖](/images/articles/llamaindex-index-types-1.webp)

### Vector Store Index

向量存儲索引將每個節點及其對應的嵌入存儲在一個向量存儲中。在查詢向量索引時，它總是提供與查詢最相關的前 k 個最相似的節點。

![LlamaIndex Vector Store Index 結構示意圖](/images/articles/llamaindex-index-types-2.webp)

### Tree Index

樹形索引從一組節點建立一個分層的樹狀結構。

在內部，樹是通過摘要提示形成的。它以一系列文本文件作為輸入，然後以自下而上的方式建立樹形索引，其中每個父節點是其下方節點的摘要。

![LlamaIndex Tree Index 樹狀結構示意圖](/images/articles/llamaindex-index-types-3.webp)

查詢樹形索引涉及從根節點向下到葉節點的過程。默認情況下（child_branch_factor=1），查詢在給定父節點的情況下選擇一個子節點。如果 child_branch_factor=2，則查詢在每一層選擇兩個子節點。

![LlamaIndex Tree Index 查詢流程示意圖](/images/articles/llamaindex-index-types-4.webp)

### Keyword Table Index

GPTKeywordTableIndex 實現從索引的節點中提取關鍵字，並使用這些關鍵字來查找相關的文檔。當我們提出問題時，這個實現首先會從問題中生成關鍵字。接著，索引會搜尋相關的文檔並將它們發送給大語言模型（LLM）。

![LlamaIndex Keyword Table Index 結構示意圖](/images/articles/llamaindex-index-types-5.webp)

### Knowledge Graph Index


**KnowledgeGraphIndex** 類別透過自動從文本中提取實體和關係識別來簡化 RAG 知識圖構建，消除複雜的手動解析。它還提供了客製化的靈活性，可讓你根據特定需求定製圖形結構和推理規則。**知識圖**捕捉了實體之間豐富的關係，使得 RAG 中的查詢和推理比向量資料庫更加精確、多樣化和複雜。

從技術上講，KG 提供比 Vector DB 更多的 precise 輸出，KG 還支援比 Vector DB 更多的 diverse 和 complex 查詢。此外，KG 比 Vector DB 具有更好的 reasoning 和推理功能……但通常情況下，KGs 與 Vector DBs 的比較是蘋果與柳丁的遊戲。

知識圖譜最適合具有清晰 relationships 的文檔，而向量資料庫則與基於 similarity 的上下文更相關。因此，在 KG 和 Vector DB 之間進行選擇取決於 RAG 專案的具體要求和目標。

## 何時使用特定的索引？

| 索引類型 | 適用情境 |
| --- | --- |
| List Index | 文檔數量不多時的理想選擇；全部送給 LLM，文本太長則分割後請 LLM 精煉答案 |
| Vector Index | 想取得通過匹配分數門檻的前 K 個相關文檔 |
| Tree Index | 處理基於摘要的任務時非常有用 |
| Keyword Table Index | 每個節點都要送 LLM 生成關鍵字，更慢且更貴，除非效果顯著更好否則不建議 |
| Knowledge Graph Index | 文檔有清晰實體關係、需要多跳推理時 |

補充幾點細節：

- **列表索引**：當文檔數量不多時，List Index 是理想的選擇。與其嘗試找到相關數據，索引會將所有片段連接起來並全部發送給大語言模型（LLM）。如果結果文本太長，索引會分割文本並請 LLM 精煉答案。
- 當使用 "embedding" 參數時，它與 VectorStoreIndex 非常相似，區別在於列表索引會發送所有匹配的節點而無需任何門檻，而 VectorStoreIndex 只有在節點達到某個匹配分數門檻時才會發送。
- **向量索引**：當我們希望獲取通過一定匹配分數門檻的前 K 個相關文檔時，可以使用 Vector Index。
- **樹形索引**：當處理基於摘要的任務時，樹形索引（Tree Index）非常有用。
- **關鍵字表索引**：在 Keyword Table Index 中，每個節點都會被發送到 LLM 以生成關鍵字。將每個文檔發送給 LLM 會大幅增加索引成本。這比其他索引更慢且更昂貴。因此，除非使用此索引所提供的結果遠好於其他索引，否則不建議使用。

## 常見問題

### LlamaIndex 的索引（Index）和節點（Node）是什麼關係？

索引是建立在節點之上的資料結構。節點是 LlamaIndex 的基本單位，包含一段文本；文件會被分割成多個片段存進節點，再由索引負責組織與檢索這些節點。

### RAG 查詢時該選 Vector Store Index 還是 Knowledge Graph Index？

文檔之間有清晰的實體關係、需要多跳推理時，Knowledge Graph Index 能提供更精確、更多樣的查詢；若上下文相關性主要靠語意相似度，Vector Store Index 更合適。兩者本質上是不同取向的比較，取決於專案需求。

### 為什麼 Keyword Table Index 不建議常用？

因為建立索引時每個節點都要送給 LLM 生成關鍵字，索引成本大幅增加，速度也比其他索引慢且更貴。除非它的查詢效果明顯優於其他索引，否則不建議使用。

### List Index 開啟 embedding 參數後跟 Vector Store Index 有什麼差別？

兩者都會用嵌入來排序節點，但 List Index 會發送所有匹配的節點而沒有門檻限制；Vector Store Index 則只有在節點的匹配分數達到門檻時才會發送。

## 參考資料


## 延伸閱讀

- [LlamaIndex 的基礎元件：Node、Index、Retriever 與 Query Engine](/post/llamaindex-basic-components)：同樣聚焦 LlamaIndex、RAG，可接著比較不同情境的做法。
- [LlamaIndex 介紹：用 Python 建立 RAG 索引與查詢流程](/post/llamaindex-rag-introduction)：同樣聚焦 LlamaIndex、RAG，可接著比較不同情境的做法。
- [使用 LlamaIndex 載入文檔：YouTube 字幕、PDF 與 Notion 一次搞定](/post/llamaindex-load-documents)：同樣聚焦 LlamaIndex、RAG，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2024-05-17，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};