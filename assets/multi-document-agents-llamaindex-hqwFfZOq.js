var e=`---
title: Multi-Document Agents：用 LlamaIndex 打造多文件問答代理
description: 多文件代理（Multi-Document Agent）能整合分散在多份文件中的資訊，跨文件比對與推理後回答問題。本文介紹 LlamaIndex 的實作架構、Query Engine 與 Tool 的組合方式。
date: 2024-11-11
category: 生成式AI
tags: [LlamaIndex, Multi-Document Agents, AI Agent, RAG, LLM]
readingTime: 6 分鐘
image: /images/tech/hero_multi-document-agents-llamaindex.webp
imageAlt: 堆疊的大量文件資料夾，象徵多文件代理需要整合的多份文件
---


# Multi-Document Agents：用 LlamaIndex 打造多文件問答代理

多文件代理（Multi-Document Agent）是一種能夠處理和理解多個文件內容的人工智慧代理。它透過自然語言處理（NLP）技術，將分散在不同文件中的資訊整合起來，並能根據使用者提出的問題，提供精準、全面的答案。當我的知識來源不再是一份文件，而是數十份報告、合約或手冊時，單純的 RAG 流程往往力有未逮——這正是 Multi-Document Agents 發揮價值的地方。

## 什麼是多文件代理？為什麼需要它？

**多文件代理** 是一種能夠處理和理解多個文件內容的人工智慧代理。它透過自然語言處理（NLP）技術，將分散在不同文件中的資訊整合起來，並能根據使用者提出的問題，提供精準、全面的答案。

傳統的 RAG 流程通常針對單一索引查詢：把文件切塊、建立向量索引，然後檢索最相關的片段交給 LLM 回答。但實務上常見的問題是跨文件的，例如：

- 「比較 A 報告與 B 報告中對同一指標的說法有何差異？」
- 「這三份合約中，哪一份的違約條款最嚴格？」
- 「整合所有季度財報，整理出全年營收趨勢。」

這類問題需要先決定「該查哪份文件」，再於文件內檢索，最後把多份文件的結果彙整、比對、推理——單一 Query Engine 做不到，這就是需要 Agent 的原因。

## Multi-Document Agents 的核心架構

在 LlamaIndex 中，一個典型的多文件代理架構由三層組成：

1. **每份文件一個 Query Engine**：為每份文件建立獨立的索引與 Query Engine，讓代理可以「針對某份文件」提問。
2. **把 Query Engine 包裝成 Tool**：每個 Query Engine 透過 \`QueryEngineTool\` 包裝成工具，並附上清楚的描述（這份文件是什麼、適合回答什麼問題），供代理判斷何時使用。
3. **Agent 負責路由與彙整**：代理接收使用者的問題，利用 LLM 的推理（或 Function Calling）能力決定要呼叫哪些工具、呼叫幾次，最後把各工具的回應整合成最終答案。

這種設計讓代理具備兩種關鍵能力：**文件間路由（routing）** 與 **跨文件比對（reasoning across documents）**。

## 用 LlamaIndex 實作的基本流程

以 Python 搭配 LlamaIndex，實作步驟大致如下：

\`\`\`python
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.core.tools import QueryEngineTool
from llama_index.core.agent import ReActAgent

# 1. 讀取並為每份文件建立獨立的 Query Engine
docs = SimpleDirectoryReader("./data").load_data()
# 實務上會依文件分開建立 index，這裡以兩份文件為例
index_a = VectorStoreIndex.from_documents(documents_a)
index_b = VectorStoreIndex.from_documents(documents_b)

engine_a = index_a.as_query_engine(similarity_top_k=3)
engine_b = index_b.as_query_engine(similarity_top_k=3)

# 2. 把 Query Engine 包裝成 Tool，描述要寫清楚讓代理會選對工具
tool_a = QueryEngineTool.from_defaults(
    query_engine=engine_a,
    name="report_2023",
    description="2023 年度報告，適合回答 2023 年營運與財務相關問題",
)
tool_b = QueryEngineTool.from_defaults(
    query_engine=engine_b,
    name="report_2024",
    description="2024 年度報告，適合回答 2024 年營運與財務相關問題",
)

# 3. 建立 Agent，讓它自行決定呼叫哪些工具並彙整答案
agent = ReActAgent.from_tools([tool_a, tool_b], verbose=True)
response = agent.chat("比較 2023 與 2024 年報中營收成長的差異")
\`\`\`

關鍵在於每個 Tool 的 \`description\`：代理完全依賴這段描述決定要不要使用該工具，描述寫得越精準，路由就越可靠。

## Top-K 檢索在多文件場景的陷阱

我在實作時遇到一個常見問題：若把所有文件放進同一個向量索引，\`similarity_top_k\` 的檢索結果容易被「文件數量」稀釋。文件越多，每份文件能擠進 top-k 的片段就越少，跨文件比較時代理反而拿不到足夠的資訊。

解法就是前述架構：**每份文件獨立索引、獨立 Query Engine**，讓代理明確地對每份文件各查一次，再自行彙整。這樣 top-k 是在單一文件內競爭，檢索品質不會因為文件總數增加而下降。

## 代理 vs. 傳統 RAG：什麼時候該用 Multi-Document Agents？

| 面向 | 傳統 RAG | Multi-Document Agents |
| --- | --- | --- |
| 適用問題 | 單一文件、事實型問題 | 跨文件比較、彙整、多步推理 |
| 查詢次數 | 一次檢索 | 代理決定呼叫多個工具、多次檢索 |
| 架構複雜度 | 低，容易維護 | 較高，需設計工具描述與路由 |
| 回答延遲 | 快 | 較慢（多次 LLM 呼叫） |
| 成本 | 較低 | 較高 |

簡單說：如果一個 Query Engine 就能答對，就不需要代理；一旦問題需要「先選文件、再比對、再彙整」，代理架構就值得投入。

## 常見問題

### 什麼是多文件代理（Multi-Document Agent）？

多文件代理是一種能處理和理解多個文件內容的 AI 代理。它將分散在不同文件中的資訊整合起來，依據使用者的問題進行路由、檢索與跨文件推理，提供精準、全面的答案。

### 為什麼不把所有文件放進同一個向量索引就好？

文件一多，top-k 檢索結果會被稀釋，跨文件比較時各文件能取得的片段不足。每份文件獨立索引、由代理分別查詢再彙整，能維持單一文件內的檢索品質。

### LlamaIndex 的 Agent 如何決定要查詢哪份文件？

代理依賴每個 \`QueryEngineTool\` 的 \`description\` 來判斷。LLM 閱讀工具描述與使用者的問題後，透過推理或 Function Calling 決定呼叫哪些工具，因此描述寫得精準與否直接決定路由品質。

### Multi-Document Agents 適合哪些應用場景？

適合需要跨文件比較、彙整或多步推理的場景，例如多份年度報告的財務比較、多份合約的條款審閱、跨部門文件的資訊整合等。

## 參考資料

- [LlamaIndex 官方文件 — Multi-Document Agents](https://docs.llamaindex.ai/en/stable/use_cases/agents/)
- [LlamaIndex 官方文件 — Tools / QueryEngineTool](https://docs.llamaindex.ai/en/stable/module_guides/deploying/agents/tools/)

## 延伸閱讀

- [LlamaIndex 介紹：用 Python 建立 RAG 索引與查詢流程](/post/llamaindex-rag-introduction)：同樣聚焦 LlamaIndex、RAG，可接著比較不同情境的做法。
- [LlamaIndex 的基礎元件：Node、Index、Retriever 與 Query Engine](/post/llamaindex-basic-components)：同樣聚焦 LlamaIndex、RAG，可接著比較不同情境的做法。
- [LlamaIndex 查詢流程解析：Retriever、Router 與 Response Synthesizer 怎麼分工](/post/llamaindex-query-flow)：同樣聚焦 LlamaIndex、RAG，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2024-11-11，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};