var e=`---
title: LlamaIndex 查詢流程解析：Retriever、Router 與 Response Synthesizer 怎麼分工
description: 說明 LlamaIndex 查詢流程如何從 Retriever 檢索節點、經 Node Postprocessor 處理，再由 Response Synthesizer 生成 RAG 回答。
date: 2024-05-17
category: 生成式AI
tags: [LlamaIndex, RAG, Retriever, Query Engine, Response Synthesizer, Python]
readingTime: 8 分鐘
image: /images/tech/hero_llamaindex-basic-components.webp
imageAlt: 藍綠色積木堆疊，象徵 LlamaIndex 查詢流程中的可組合元件
---


# LlamaIndex 查詢流程解析：Retriever、Router 與 Response Synthesizer 怎麼分工

LlamaIndex 查詢流程的核心是先用 Retriever 從索引中找出相關節點，再用 Response Synthesizer 把節點、問題與大型語言模型串成回答。我的理解是：Query Engine 是對外最方便的入口，但真正影響 RAG 品質的地方，常常藏在 Retriever、Node Postprocessor 與 Response Synthesizer 的分工裡。

## LlamaIndex 查詢流程包含哪些階段？

LlamaIndex 查詢流程通常包含檢索、節點後處理與回應合成三個階段。Query Engine 只是把這三段包成一個可呼叫介面。

LlamaIndex 官方文件把 querying 拆成 retrieval、postprocessing、response synthesis 三個主要階段：Retriever 從 Index 找資料，Node Postprocessor 過濾或重新排序資料，Response Synthesizer 則把資料交給大型語言模型生成答案（LlamaIndex Docs，2026-08 存取）。

我會把流程記成這樣：

1. 使用者提出 query。
2. Retriever 根據 query 從 Index 取回相關 Node。
3. Node Postprocessor 對 Node 做過濾、排序或轉換。
4. Response Synthesizer 讀取 query 與 Node，呼叫大型語言模型產生回答。
5. Query Engine 回傳 Response 物件或文字結果。

這也是 RAG（Retrieval-Augmented Generation，檢索增強生成）的基本形狀：先檢索外部資料，再讓模型根據檢索內容回答，而不是只靠模型訓練記憶。

## Retriever 在 LlamaIndex 中負責什麼？

Retriever 在 LlamaIndex 中負責從索引取回相關 Node。Retriever 不負責產生自然語言答案，只決定哪些內容應該交給後續生成流程。

LlamaIndex 的 Retriever 可以理解成「資料查找器」。Index 已經把文件整理成可搜尋的結構，Retriever 則依照查詢策略從 Index 裡取出候選節點。官方舊版 API 文件也把 Retriever 定義為依 query 從 index 取回一組 Node 的元件（LlamaIndex Docs，2026-08 存取）。

這個分工很重要。若 Retriever 找到的 Node 不相關，後面的 Response Synthesizer 再會寫，也只能把錯誤或鬆散的脈絡包裝成看似合理的回答。RAG 的品質常常不是「模型會不會回答」，而是「模型拿到的內容是不是對的」。

## Router Retriever 什麼時候會用到？

Router Retriever 適合多個檢索器並存的情境。Router Retriever 會根據查詢與候選檢索器的 metadata，選擇一個或多個檢索器執行查詢。

如果知識庫只有一種資料和一種索引，單一 Retriever 通常就夠。可是實務上常會有不同資料來源，例如產品文件走向量檢索，FAQ 走關鍵字檢索，資料庫說明走結構化查詢。這時候 Router Retriever 可以讓系統先判斷「這個問題應該交給誰找資料」。

LlamaIndex 的 RouterRetriever 官方 API 說明提到，RouterRetriever 會在多個 candidate retrievers 中選擇一個或多個來執行 query，選擇依據包含每個 candidate 的 metadata 與 query（LlamaIndex Docs，2026-08 存取）。所以 Router 的重點不是回答，而是把查詢導到合適的檢索路徑。

## Node Postprocessor 如何影響查詢品質？

Node Postprocessor 會在檢索後處理節點。Node Postprocessor 可以過濾低分節點、重新排序候選內容，或移除不該進入回答的資料片段。

Retriever 取回的 Node 通常還不是最終要丟進大型語言模型的內容。Node Postprocessor 會接手這些候選節點，依規則進一步整理。例如相似度低於門檻的節點可以被移除，含特定關鍵字的節點可以被保留或排除，也可以接 reranker 重新排序。

我會把 Node Postprocessor 當成查詢流程中的品質閘門。Retriever 負責「找可能相關的內容」，Node Postprocessor 負責「把不夠好的候選內容擋掉」。這一層若沒處理好，模型 prompt 會塞進太多雜訊，回答就容易變得模糊。

## Response Synthesizer 在 RAG 裡做什麼？

Response Synthesizer 負責把使用者問題與檢索到的文本片段合成回答。Response Synthesizer 是 Retriever 之後、Query Engine 回應之前的生成層。

LlamaIndex 官方 Response Synthesizer 文件把它定義為使用大型語言模型、使用者 query 與一組 text chunks 產生 response 的元件；在 Query Engine 中，Response Synthesizer 會在 Retriever 取回 nodes、Node Postprocessor 執行之後才運作（LlamaIndex Docs，2026-08 存取）。

Response Synthesizer 的模式會影響成本與答案形狀。例如 \`refine\` 會逐段讀取節點並更新答案，通常比較細但 LLM 呼叫次數較多；\`compact\` 會先壓縮與串接內容，再用較少呼叫產生回答。若資料片段很多，我會先測 \`compact\`，再用代表性問題比較 \`refine\` 是否真的帶來更好的答案。

## 常見 Retriever 類型怎麼選？

LlamaIndex Retriever 的選擇要看資料形狀與查詢目的。向量檢索適合語意相似問題，關鍵字檢索適合明確詞彙，樹狀或列表檢索適合特定索引結構。

我通常先用資料形狀來選 Retriever，而不是一開始就追最複雜的策略。

| Retriever 類型 | 適合資料 | 查詢特性 | 我會注意的風險 |
|---|---|---|---|
| Vector Index Retriever | 文字文件、知識庫、語意相近內容 | 問法和文件文字不完全相同也要找得到 | embedding 品質與 \`similarity_top_k\` 會影響命中 |
| List Retriever | 文件量小、想掃過多數節點 | 需要完整讀取或依 embedding 取前 k 筆 | 資料一多就容易增加成本 |
| Tree Retriever | 有階層或摘要結構的資料 | 問題需要從樹狀節點挑內容 | 樹狀摘要或選擇策略錯誤會漏掉細節 |
| Keyword Table Retriever | 專有名詞、代碼、錯誤訊息 | 查詢詞和文件詞彙高度重疊 | 同義詞與語意變體不一定抓得到 |
| Knowledge Graph Retriever | 實體與關係清楚的資料 | 需要查概念、關係或三元組 | 建圖品質會直接影響回答 |
| Router Retriever | 多資料源、多索引並存 | 不同問題要走不同檢索器 | metadata 描述不清時容易選錯路 |

如果只是建立第一版 RAG，我會先用 Vector Index Retriever 做 baseline。等 baseline 出現「問得到但答不好」或「某類問題特別差」時，再加入 keyword、reranker、router 或更進階的索引設計。

## 如何用 ListIndex 建立 Retriever 範例？

ListIndex 可以用 \`as_retriever()\` 建立 Retriever，再直接呼叫 \`retrieve()\` 查看取回的 Node。這種寫法適合先觀察檢索結果，不急著生成回答。

下面範例的重點是：先讀取 YouTube transcript，建立 ListIndex，再用 embedding 模式取回相關內容。實際套件路徑會依 LlamaIndex 版本不同而調整，若使用新版專案，我會先對照目前安裝版本的 import 寫法。

\`\`\`python
from llama_index import ListIndex
from llama_index import download_loader

YoutubeTranscriptReader = download_loader("YoutubeTranscriptReader")

loader = YoutubeTranscriptReader()
docs = loader.load_data(
    ytlinks=["https://www.youtube.com/watch?v=nHcbHdgVUJg"]
)

list_index = ListIndex(docs)
retriever = list_index.as_retriever(
    retriever_mode="embedding",
)
\`\`\`

建立 Retriever 之後，可以直接查詢：

\`\`\`python
nodes = retriever.retrieve("What is the difference between a stock and a bond?")
print(nodes)
\`\`\`

回傳結果通常會是 \`NodeWithScore\` 清單，裡面包含節點文字、metadata、分數與節點關係。這時候我會先看兩件事：第一，最高分節點是否真的回答了問題；第二，metadata 是否足夠讓後續答案標示來源。

## Retriever 和 Query Engine 該怎麼分開測？

Retriever 和 Query Engine 最好分開測。Retriever 測資料是否找對，Query Engine 測檢索內容是否能被合成為可靠答案。

我在調 RAG 流程時，會先把 \`.retrieve()\` 的結果印出來，而不是直接看 \`.query()\` 的自然語言回答。因為 \`.query()\` 會把檢索與生成混在一起，答案不好時很難判斷問題出在檢索、prompt、模型，還是 response mode。

一個簡單的檢查順序是：

1. 先用 Retriever 單獨取回 Node。
2. 檢查 Node 文字是否真的包含答案依據。
3. 調整 \`similarity_top_k\`、metadata filter 或檢索模式。
4. 加入 Node Postprocessor 過濾雜訊。
5. 最後再交給 Query Engine 與 Response Synthesizer 生成回答。

這樣做比較慢一點，但除錯會清楚很多。RAG 系統最怕的不是「沒有回答」，而是「回答很順但來源其實不對」。

## 常見問題

### LlamaIndex 查詢流程和 RAG 是同一件事嗎？
LlamaIndex 查詢流程可以實作 RAG，但兩者不是完全同一件事。RAG 是「先檢索、再生成」的架構概念；LlamaIndex 則提供 Retriever、Query Engine、Response Synthesizer 等元件來實作這條流程。

### Retriever 和 Response Synthesizer 最大差別是什麼？
Retriever 負責找資料，Response Synthesizer 負責寫答案。Retriever 回傳的是相關 Node 或 NodeWithScore；Response Synthesizer 會把這些內容和使用者問題交給大型語言模型，產生可讀的回答。

### Router Retriever 一定要使用嗎？
Router Retriever 不一定要使用。當資料來源單純、索引類型單一時，普通 Retriever 就夠；當不同問題需要走不同檢索器或不同資料庫時，Router Retriever 才比較有價值。

### Node Postprocessor 可以解決檢索不準嗎？
Node Postprocessor 可以改善檢索結果，但不能完全補救錯誤索引或錯誤 embedding。Node Postprocessor 比較適合做過濾、重排與門檻控制；如果 Retriever 一開始完全找錯資料，仍要回頭調整切分、索引或檢索策略。

### Response Synthesizer 的 response mode 要怎麼選？
Response Synthesizer 的 response mode 要看答案需要多細、節點數量有多少、成本是否敏感。\`compact\` 通常適合先做 baseline；\`refine\` 適合需要逐段整合的回答，但 LLM 呼叫次數和成本可能更高。

### 為什麼要先單獨測 Retriever？
先單獨測 Retriever 可以把「資料找錯」和「模型寫不好」分開。若檢索到的 Node 沒有答案依據，Query Engine 生成出來的文字再流暢也不可靠。

## 參考資料

- LlamaIndex, Querying, https://docs.llamaindex.ai/en/v0.10.19/understanding/querying/querying.html，存取日期：2026-08-28。
- LlamaIndex, RouterRetriever API Reference, https://docs.llamaindex.ai/en/stable/api_reference/retrievers/router/，存取日期：2026-08-28。
- LlamaIndex, Response Synthesizer, https://docs.llamaindex.ai/en/v0.10.20/module_guides/querying/response_synthesizers/root.html，存取日期：2026-08-28。
- LlamaIndex, Defining a Custom Query Engine, https://docs.llamaindex.ai/en/v0.10.19/examples/query_engine/custom_query_engine.html，存取日期：2026-08-28。

最後更新：2026-08-28

## 延伸閱讀

- [LlamaIndex 介紹：用 Python 建立 RAG 索引與查詢流程](/post/llamaindex-rag-introduction)：同樣聚焦 LlamaIndex、RAG，可接著比較不同情境的做法。
- [LlamaIndex 的基礎元件：Node、Index、Retriever 與 Query Engine](/post/llamaindex-basic-components)：同樣聚焦 LlamaIndex、RAG，可接著比較不同情境的做法。
- [使用LlamaIndex載入多種類文件](/post/llamaindex-load-multiple-file-types)：同樣聚焦 LlamaIndex、RAG，可接著比較不同情境的做法。
`;export{e as default};