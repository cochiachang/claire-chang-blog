var e=`---
title: RAPTOR 是什麼？基於樹狀結構的 RAG 方法
description: 說明 RAPTOR 如何用遞迴摘要與樹狀索引改善 RAG，並比較 RAPTOR、Graph RAG 與 RIG 的差異。
date: 2024-11-11
category: 生成式AI
tags: [RAPTOR, RAG, 檢索增強生成, LLM, Graph RAG, RIG]
readingTime: 8 分鐘
image: /images/tech/hero_raptor-tree-structured-rag-method.webp
imageAlt: RAG 檢索增強生成流程圖，資料經索引後提供給大型語言模型回答
---


# RAPTOR 是什麼？基於樹狀結構的 RAG 方法

RAPTOR（Recursive Abstractive Processing for Tree-Organized Retrieval）是一種把文件切塊、嵌入、聚類、摘要成樹狀索引的檢索增強生成（Retrieval-Augmented Generation，RAG）方法。我的理解是：RAPTOR 想解決傳統 RAG 只抓短片段、容易漏掉整份文件脈絡的問題，讓系統在回答時可以同時拿到細節片段與上層摘要。

## RAPTOR 解決傳統 RAG 的哪個問題？

RAPTOR 解決的是傳統 RAG 過度依賴短文本片段的問題。RAPTOR 透過遞迴摘要建立不同抽象層級，讓檢索能同時看見段落細節與整體主題。

傳統 RAG 常見流程是：先把文件切成 chunk，轉成 embedding，查詢時用向量相似度找出幾段最相關內容，再把內容放進大型語言模型生成回答。這個做法很實用，但有一個明顯限制：如果問題需要整份文件的高層次理解，單靠幾段相鄰文字可能不夠。

RAPTOR 論文把這個限制講得很清楚：多數既有方法只檢索短而連續的 chunk，因此比較難掌握長文件的整體脈絡；RAPTOR 則用「遞迴嵌入、聚類、摘要」從底層 chunk 往上建立樹狀結構（Sarthi et al., 2024）。換句話說，RAPTOR 不是只把資料切小，而是把切小後的資料再組回有層次的知識結構。

## RAPTOR 的樹狀索引怎麼建立？

RAPTOR 的樹狀索引從原始文本片段開始建立。RAPTOR 會先把文本片段轉成向量，再聚類相近片段，接著摘要每個群組並往上重複同一流程。

RAPTOR 的核心流程可以拆成五步：

1. 將文件切成較小的文本片段。
2. 將每個文本片段轉成 embedding 向量。
3. 對相近向量做聚類，形成同一層的主題群組。
4. 用大型語言模型為每個群組產生摘要。
5. 將摘要再嵌入、聚類、摘要，直到形成多層樹狀索引。

這棵樹的底層保留原始細節，上層則保存較抽象的主題摘要。查詢進來時，RAPTOR 可以從不同層級取資料：細節問題可以落到葉節點附近，總結型問題可以命中較高層摘要。RAPTOR 官方實作也把專案定位為這篇論文的 implementation，並提供可引用的 ICLR 2024 citation（RAPTOR GitHub, 2026-08 存取）。

## RAPTOR 查詢時如何使用樹狀結構？

RAPTOR 查詢時會從樹狀索引中取回相關節點。RAPTOR 的重點不是只找最像查詢的原始段落，而是讓摘要節點與細節節點一起參與回答。

可以把 RAPTOR 的查詢想成兩種方向：一種是沿著樹狀結構找到相關分支，另一種是在不同層級中檢索最有用的節點。前者適合資料分類清楚、問題指向明確的情境；後者適合問題需要同時引用整體摘要與局部細節的情境。

我會特別留意「摘要品質」這件事。RAPTOR 的上層節點是由下層內容摘要而來，如果摘要太粗，答案會失去關鍵條件；如果摘要太長，樹狀索引又會失去壓縮脈絡的意義。RAPTOR 的工程價值不只在樹，而是在每一層摘要是否真的保留了可回答問題的資訊。

## RAPTOR 和 Graph RAG 有什麼差異？

RAPTOR 使用樹狀摘要組織文件內容，Graph RAG 使用知識圖譜與社群摘要組織實體關係。RAPTOR 偏向文件層次脈絡，Graph RAG 偏向跨實體關係與全局問題。

RAPTOR 和 Graph RAG 都不是單純的「向量搜尋加回答」。兩者都會在檢索前先建立結構，讓大型語言模型查詢時不只面對零散 chunk。不過結構不同，適合的問題也不同。

| 比較面向 | RAPTOR | Graph RAG |
|---|---|---|
| 索引結構 | 樹狀索引，底層是文本片段，上層是遞迴摘要 | 知識圖譜、社群階層與社群摘要 |
| 建立方式 | embedding、聚類、摘要反覆往上建立 | 從文本抽取實體與關係，再建立圖與 community summaries |
| 擅長問題 | 長文件摘要、分層主題查詢、需要整體脈絡的文件問答 | 多實體關係、跨文件主題、全局 sensemaking 問題 |
| 主要風險 | 摘要遺漏細節、樹狀分類不夠貼近查詢 | 實體抽取錯誤、關係建模成本高、索引流程較重 |

Microsoft GraphRAG 文件把 GraphRAG 描述為 structured, hierarchical 的 RAG 方法，流程包含從原始文本抽取 knowledge graph、建立 community hierarchy、產生 community summaries，再用這些結構回答問題（Microsoft GraphRAG Docs, 2026-08 存取）。Graph RAG 論文也指出，傳統 RAG 對「整個語料的主要主題是什麼」這類全局問題比較弱，GraphRAG 用實體圖與社群摘要補這個缺口（Edge et al., 2024/2025）。

## RAPTOR 和 RIG 有什麼差異？

RAPTOR 依賴預先建好的樹狀索引，RIG 則是在生成過程中動態穿插檢索。RAPTOR 把脈絡整理在查詢前，RIG 把探索動作延後到生成時。

RAPTOR、Graph RAG 和 RIG 都是在補傳統 RAG 的不足，但三者的時間點不同。RAPTOR 先整理文件摘要樹；Graph RAG 先整理實體關係圖；RIG（Retrieval Interleaved Generation）則讓模型在生成部分答案後，再根據當下需要做下一輪檢索。

我的判斷方式很簡單：如果資料集已經固定，而且常問的問題需要長文件脈絡，RAPTOR 比較值得試；如果資料關係比文件順序更重要，Graph RAG 比較自然；如果問題路徑無法預先預測，需要邊答邊查，RIG 的彈性會比較好。

## 什麼情境適合使用 RAPTOR？

RAPTOR 適合長文件、章節層次清楚、問題會同時碰到局部細節與整體摘要的資料集。RAPTOR 不一定適合高度即時或關係網路很複雜的資料。

我會優先在這些場景考慮 RAPTOR：

- 長篇研究報告、白皮書、法規文件與技術手冊。
- 章節與主題有明顯階層，但單一段落不足以回答問題的資料。
- 問題常常需要「先理解整體，再回到細節」的文件問答。
- 想比較不同檢索層級效果，而不是只調整 chunk size 的 RAG 實驗。

RAPTOR 的代價也要先想清楚。遞迴摘要需要額外模型成本，摘要錯誤會往上傳遞，索引更新也比一般 chunk indexing 更麻煩。若資料每天大量變動，或問題多半只需要查一小段明確內容，傳統 RAG 可能已經夠用。

## 我會怎麼評估 RAPTOR 是否值得導入？

RAPTOR 是否值得導入，要看查詢是否真的需要多層脈絡。若問題多是精確查找，先改善資料切分、metadata、reranking，通常比導入樹狀摘要更划算。

實作前我會先做一張小檢查表：

| 檢查問題 | 如果答案是「是」 | 如果答案是「否」 |
|---|---|---|
| 問題常需要整份文件的摘要脈絡嗎？ | RAPTOR 有測試價值 | 一般 RAG 可能足夠 |
| 文件有清楚章節或主題層次嗎？ | 樹狀摘要比較容易對齊內容 | 聚類可能產生難解釋的分支 |
| 可以接受索引前多一次摘要成本嗎？ | 可評估 RAPTOR 的回答品質提升 | 先優化 baseline RAG |
| 答案需要跨實體關係推理嗎？ | 可和 Graph RAG 比較 | RAPTOR 可能更單純 |
| 文件更新頻率高嗎？ | 要設計增量更新策略 | 批次重建索引較可行 |

我不會把 RAPTOR 當成所有 RAG 系統的預設架構。RAPTOR 比較像是在 baseline RAG 已經遇到「抓到片段但答不好整體」時，下一步可以測的結構化檢索方法。

## 常見問題

### RAPTOR 是什麼？
RAPTOR 是 Recursive Abstractive Processing for Tree-Organized Retrieval 的縮寫。RAPTOR 是一種 RAG 方法，會把文本切塊後遞迴做 embedding、聚類與摘要，建立可檢索的樹狀索引。

### RAPTOR 和一般 RAG 最大差別是什麼？
RAPTOR 和一般 RAG 最大差別在於檢索索引的層次。一般 RAG 多半檢索原始 chunk，RAPTOR 會同時保留底層文本片段與上層摘要，讓系統可以回答更需要整體脈絡的問題。

### RAPTOR 適合用在企業知識庫嗎？
RAPTOR 適合用在長文件比例高、章節層次清楚的企業知識庫。若企業知識庫主要是短 FAQ 或欄位明確的資料表，先做好 metadata、權限與基礎檢索品質通常更重要。

### RAPTOR 會取代向量資料庫嗎？
RAPTOR 不會取代向量資料庫。RAPTOR 仍然會使用 embedding 與相似度檢索，只是把可檢索節點從單純文本片段擴展到不同層級的摘要節點。

### RAPTOR 和 Graph RAG 該怎麼選？
如果主要問題是長文件摘要與分層主題查詢，我會先測 RAPTOR。如果主要問題是實體之間的關係、跨文件社群與多跳推理，Graph RAG 通常更貼近資料形狀。

### RAPTOR 的風險是什麼？
RAPTOR 的主要風險是摘要錯誤會在樹狀索引中累積。若上層摘要遺漏條件、混淆概念或壓縮過度，查詢時命中的摘要節點可能讓答案看起來合理，卻少了必要細節。

## 參考資料

- Parth Sarthi, Salman Abdullah, Aditi Tuli, Shubh Khanna, Anna Goldie, Christopher D. Manning, "RAPTOR: Recursive Abstractive Processing for Tree-Organized Retrieval," arXiv:2401.18059, 2024-01-31, https://arxiv.org/abs/2401.18059，存取日期：2026-08-28。
- parthsarthi03, RAPTOR official implementation, GitHub, https://github.com/parthsarthi03/raptor，存取日期：2026-08-28。
- Microsoft GraphRAG, Welcome to GraphRAG, https://microsoft.github.io/graphrag/，存取日期：2026-08-28。
- Darren Edge et al., "From Local to Global: A Graph RAG Approach to Query-Focused Summarization," arXiv:2404.16130, 2024-04-24，修訂：2025-02-19，https://arxiv.org/abs/2404.16130，存取日期：2026-08-28。

最後更新：2026-08-28

## 延伸閱讀

- [Retrieval Interleaved Generation（RIG）是什麼？跟 RAG 有何不同](/post/retrieval-interleaved-generation-rig)：同樣聚焦 RIG、RAG，可接著比較不同情境的做法。
- [Graph RAG：圖形式的檢索增強生成完整解析](/post/graph-rag)：同樣聚焦 Graph RAG、RAG，可接著比較不同情境的做法。
- [檢索增強生成（RAG）如何讓 LLM 回答更準確](/post/retrieval-augmented-generation)：同樣聚焦 RAG、檢索增強生成，可接著比較不同情境的做法。
`;export{e as default};