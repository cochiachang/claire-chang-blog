var e=`---
title: LlamaIndex 的基礎元件：Node、Index、Retriever 與 Query Engine
description: 說明 LlamaIndex 五大基礎元件的角色與串接方式，附載入、切分、索引、檢索到查詢的完整程式範例。
date: 2024-05-17
category: 生成式AI
tags: [LlamaIndex, RAG, Python, 向量索引]
readingTime: 6 分鐘
image: /images/tech/hero_llamaindex-basic-components.webp
imageAlt: 藍綠色積木堆疊，象徵可組合的基礎元件
---


# LlamaIndex 的基礎元件：Node、Index、Retriever 與 Query Engine

LlamaIndex 的基礎元件包含 Node、Document Loader、Index、Retriever 與 Query Engine 五種。這五個元件各自負責資料流程中的一個階段，從讀取原始文件到回傳查詢結果，串起來就是一個完整的 RAG 流程。這篇文章把每個元件的角色講清楚，再用最小可執行的程式碼把它們接起來。

## LlamaIndex 的五大基礎元件各自做什麼？

Node（節點）是 LlamaIndex 最小的資料單位，一份文件會被切成多個 Node，每個 Node 裝著一段文字。Document Loader（文檔加載器）負責從網頁、PDF、YouTube 影片等來源把資料讀進來，交給後續流程處理。Index（索引）建立在一堆 Node 之上，把它們組織成方便搜尋的結構。Retriever（檢索器）依照使用者的問題，從 Index 裡撈出最相關的幾個 Node。Query Engine（查詢引擎）則接手 Retriever 找到的內容，加上使用者的問題一起送給 LLM，產生最終回答。

| 元件 | 角色 | 輸入 | 輸出 |
|---|---|---|---|
| Document Loader | 讀取原始資料 | 檔案 / 網頁 / API | Document 物件 |
| Node | 儲存文字片段 | Document | 多個 Node |
| Index | 組織與存放 Node | Node 集合 | 可查詢的索引結構 |
| Retriever | 依問題找相關內容 | 使用者問題 + Index | 相關 Node 清單 |
| Query Engine | 產生最終回答 | 問題 + 檢索到的 Node | LLM 回答 |

這五個元件是依序串接的關係：Document Loader 讀資料、切成 Node、建成 Index，之後每次查詢都是 Retriever 先找、Query Engine 再答。

## 如何用 SimpleDirectoryReader 載入本地資料？

\`SimpleDirectoryReader\` 是 LlamaIndex 內建的 Document Loader，指定資料夾路徑就能把裡面的檔案讀成 Document 物件：

\`\`\`python
from llama_index import SimpleDirectoryReader

documents = SimpleDirectoryReader('./data').load_data()
\`\`\`

\`load_data()\` 回傳的是一個 Document 物件的清單，這時候資料還沒有被切分，也還沒建立索引，只是把原始檔案內容讀進記憶體。

## 如何把 Document 切分成 Node？

Document 讀進來之後,要先切成 Node 才能建立索引。\`SimpleNodeParser\` 是最基本的切分工具：

\`\`\`python
from llama_index.node_parser import SimpleNodeParser
parser = SimpleNodeParser()
nodes = parser.get_nodes_from_documents(documents)
\`\`\`

切分的目的是把長文件拆成大小適中的片段，讓後面的向量索引和檢索能在段落層級運作,而不是整份文件一起比對。

## 如何用 VectorStoreIndex 建立索引？

有了 Node 之後，\`VectorStoreIndex\` 會把每個 Node 的文字轉成向量嵌入（embedding），存進向量資料庫裡：

\`\`\`python
from llama_index import LLMPredictor, VectorStoreIndex
from langchain import OpenAI
import os

os.environ["OPENAI_API_KEY"] = "api-key"

index = VectorStoreIndex(nodes)
\`\`\`

這一步會實際呼叫嵌入模型的 API（預設是 OpenAI），所以執行時需要有效的 API key，也會產生對應的 API 用量費用。索引建好之後，同一批資料不需要重複做嵌入運算。

## Retriever 和 Query Engine 怎麼分工？

Retriever 只負責「找資料」，Query Engine 負責「找資料 + 問 LLM」。\`VectorIndexRetriever\` 會根據語意相似度，從索引裡取出前 k 筆最相關的 Node：

\`\`\`python
from llama_index.retrievers import VectorIndexRetriever

retriever = VectorIndexRetriever(
    index=index,
    similarity_top_k=2,
)
\`\`\`

上面把 \`similarity_top_k\` 設為 2，代表每次查詢只取最相關的兩個 Node。接著把 Retriever 包進 \`RetrieverQueryEngine\`，就能把檢索到的內容連同問題一起送給 LLM：

\`\`\`python
from llama_index.query_engine import RetrieverQueryEngine

query_engine = RetrieverQueryEngine(
    retriever=retriever
)
\`\`\`

## 完整查詢範例長什麼樣子？

Query Engine 準備好之後，呼叫 \`.query()\` 傳入問題字串，就能拿到 LLM 根據檢索內容產生的回答：

\`\`\`python
response = query_engine.query("What did the author do growing up?")
print(response)
\`\`\`

把前面幾步串起來，完整流程是：\`SimpleDirectoryReader\` 讀資料 → \`SimpleNodeParser\` 切成 Node → \`VectorStoreIndex\` 建索引 → \`VectorIndexRetriever\` 找相關 Node → \`RetrieverQueryEngine\` 產生回答。這五步也對應到 LlamaIndex 官方 GitHub 上的 Fundamentals 教學範例（原範例 repo 已下架），可以下載成 Jupyter Notebook 直接跑一遍。

## 常見問題

### Node 和 Document 有什麼差別？

Document 是 Document Loader 讀進來的原始內容，通常對應一整份檔案。Node 是 Document 被切分後的片段，是 LlamaIndex 實際拿去建索引與檢索的最小單位。一份 Document 通常會拆成多個 Node。

### 一定要用 VectorStoreIndex 嗎？

不一定。VectorStoreIndex 是最常用的索引類型，適合語意相似度檢索；LlamaIndex 也提供其他索引類型（例如 List Index、Tree Index），適合不同的資料結構與查詢情境，可依實際使用場景挑選。

### similarity_top_k 設多少比較好？

沒有固定答案，\`similarity_top_k\` 越大，Retriever 拿到的候選 Node 越多，回答可能更完整，但送進 LLM 的內容也越多，會增加 token 成本與雜訊。一般會從 2 到 5 開始測試，再依實際回答品質調整。

### Retriever 和 Query Engine 可以分開用嗎？

可以。Retriever 單獨使用時只回傳相關的 Node 清單，不會呼叫 LLM，適合只需要檢索結果、自己另外處理回答邏輯的情境。Query Engine 則是把 Retriever 包裝起來，直接產生完整回答，是多數應用會用到的介面。

## 參考資料

LlamaIndex，官方 Component Guides 文件，涵蓋 Loading、Indexing、Storing、Querying 等核心元件說明，存取日期：2026-08-27。[https://developers.llamaindex.ai/python/framework/module_guides/](https://developers.llamaindex.ai/python/framework/module_guides/)

## 延伸閱讀

- [LlamaIndex 查詢流程解析：Retriever、Router 與 Response Synthesizer 怎麼分工](/post/llamaindex-query-flow)：同樣聚焦 LlamaIndex、RAG，可接著比較不同情境的做法。
- [LlamaIndex 介紹：用 Python 建立 RAG 索引與查詢流程](/post/llamaindex-rag-introduction)：同樣聚焦 LlamaIndex、RAG，可接著比較不同情境的做法。
- [使用LlamaIndex載入多種類文件](/post/llamaindex-load-multiple-file-types)：同樣聚焦 LlamaIndex、RAG，可接著比較不同情境的做法。
`;export{e as default};