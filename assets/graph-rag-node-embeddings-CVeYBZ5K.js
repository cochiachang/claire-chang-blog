var e=`---
title: Graph RAG 的 Node Embeddings 技術：把圖節點變成向量
description: 介紹 Node Embeddings 節點嵌入技術：如何把圖（Graph）中的節點轉成向量，用餘弦相似度計算節點相似性，並整理 Neo4j Graph Data Science 提供的 FastRP、Node2Vec、GraphSAGE、HashGNN 四種演算法與 Graph RAG 的關係。
date: 2024-11-11
category: 機器學習
tags: [Graph RAG, Node Embeddings, Neo4j, 知識圖譜, 機器學習]
readingTime: 7 分鐘
image: /images/tech/hero_graph-rag-node-embeddings.webp
imageAlt: 圖形資料科學中的節點嵌入與 Graph RAG 概念示意圖
---


# Graph RAG 的 Node Embeddings 技術：把圖節點變成向量

Node Embeddings（節點嵌入）能把圖（Graph）中的每個節點轉換成 N 維空間中的向量，讓「哪些節點相似」可以用向量計算來衡量，而不必在原始圖結構上跑昂貴的計算。本文先解釋節點嵌入的基本概念與相似度定義，再整理 Neo4j Graph Data Science 提供的四種節點嵌入演算法——FastRP、Node2Vec、GraphSAGE、HashGNN——以及它們在 Graph RAG 架構中的角色。

## 什麼是 Node Embeddings？為什麼圖需要嵌入？

參考資料：[Introduction to Node Embedding（Memgraph）](https://memgraph.com/blog/introduction-to-node-embedding)

圖（graphs）的基本組成是節點（nodes）和邊（edges），以社交網絡為例，就能說明它們在現實世界中的應用。而節點嵌入就是把圖中的每個節點轉換成一個向量，這些向量位於 N 維空間中（例如 2 維、3 維，或更高維度），這樣每個節點在空間中都有一個特定的位置。

將節點嵌入空間後，圖中的結構關係會變得更容易理解：

- **人類視角**：如果把節點嵌入到 2 維空間，圖中的「群體」或「社群」結構會以集群的形式顯現出來，人類可以在 2 維圖像中直觀地看出哪些節點是相似的。
- **電腦視角**：節點嵌入轉化為數字向量，節點之間的距離和相似性就可以通過向量計算來衡量。例如使用「餘弦相似度」比較兩個節點的相似性，比直接在原始圖結構上做複雜計算（如最短路徑）簡單得多。

![節點嵌入示意圖](/images/articles/graph-rag-node-embeddings-1.webp)

節點嵌入算法是一種將圖中節點映射到低維空間的技術，生成的低維向量（稱為嵌入）保留了節點在圖中的結構信息和屬性。這些向量可以作為機器學習模型的輸入，用於各種任務：

| 任務 | 說明 |
| --- | --- |
| 節點分類 | 用嵌入向量預測節點的類別 |
| 鏈接預測 | 預測兩個節點之間是否可能存在邊 |
| kNN 相似性圖 | 用 k-最近鄰居建立相似性圖 |

嵌入向量捕捉了節點的特性，使得即使在圖中沒有直接連接的節點也能進行有效的比較和分析。我們可以用嵌入向量來計算節點之間的距離或相似度，並根據這些距離來衡量兩個節點的「接近程度」。隨著節點數量增多（例如 1000 個節點），僅通過圖結構來判斷節點關係會變得更加困難，但嵌入能在高維空間中有效地表示圖的結構，讓電腦能夠更輕鬆地處理大規模圖資料。

至於要如何定義 node similarity 呢？以下幾種都可以當成判斷相似程度的指標：

- 有連結的 nodes
- 有共同的鄰居
- 有類似的結構

## Graph RAG 與 Node Embeddings 的關係是什麼？

參考資料：[Neo4j Graph Data Science — Node Embeddings](https://neo4j.com/docs/graph-data-science/current/machine-learning/node-embeddings/)

Neo4j Graph Data Science 庫提供了多種節點嵌入算法，包括生產級別的 FastRP，以及處於 Beta 階段的 GraphSAGE、Node2Vec 和 HashGNN。這些算法能夠將圖中的節點轉換為向量形式，以便用於後續的機器學習任務，比如節點分類、社群檢測和關聯預測。

**Graph RAG（Retrieval-Augmented Generation with Graphs）** 是一種使用圖形結構來增強檢索和生成的技術。它的核心思想是將資料結構化為圖形（例如實體和它們之間的關係形成的網狀結構），然後基於圖形進行檢索和資訊整合。Graph RAG 利用圖形索引來提升對問題的回答品質，尤其是在處理複雜多跳查詢時，圖形結構能夠幫助模型更好地理解資料的關聯性。

而 **Node Embeddings** 則是把圖形中的每個節點（例如實體）轉換為向量表示，使它可以在向量空間中進行計算。這種表示法保留了節點的結構和語義資訊，並且使得圖形資料可以被用於機器學習模型。

## FastRP（Fast Random Projection）怎麼運作？

介紹頁面：[FastRP — Neo4j GDS](https://neo4j.com/docs/graph-data-science/current/machine-learning/node-embeddings/fastrp/)

Fast Random Projection（FastRP）是一種基於隨機投影的節點嵌入算法。它根據約翰遜-林德斯特拉姆引理，通過將節點映射到 O(log(n)) 維度的空間，來近似保留點間的夾角距離。FastRP 算法在圖中運作，特別是在無向圖、有向圖、異質節點和關係以及加權關係的圖中表現出色。

此外，FastRP 支持節點屬性的使用，並且可以通過 \`propertyRatio\` 參數來控制屬性嵌入的比例。算法的實現擴展了原始 FastRP 算法，引入了 \`nodeSelfInfluence\` 參數，並支持有向圖和加權圖。FastRP 的使用案例包括機器學習流水線中的節點屬性步驟，以及在執行模式（如 stream、stats、mutate 和 write）之間的選擇。算法還提供了記憶體估算功能，幫助了解在特定圖上運行所需的記憶體。

## Node2Vec 有什麼特色？

介紹頁面：[Node2Vec — Neo4j GDS](https://neo4j.com/docs/graph-data-science/current/machine-learning/node-embeddings/node2vec/)

Node2Vec 通過在圖中進行隨機遊走（random walk）來計算節點的向量表示。該算法支持有向圖、無向圖、異構節點和關係型、以及加權關係的處理。隨機遊走的概念是 Node2Vec 的核心：它通過二階隨機遊走來建模節點之間的過渡概率，並受到 \`returnFactor\` 和 \`inOutFactor\` 參數的影響。

## GraphSAGE 為什麼適合未見過的節點？

介紹頁面：[GraphSAGE — Neo4j GDS](https://neo4j.com/docs/graph-data-science/current/machine-learning/node-embeddings/graph-sage/)

GraphSAGE 通過學習一個函數來生成未見節點或圖的節點嵌入——該函數從節點的局部鄰居中抽樣並聚合特徵。這種方法不是為每個節點獨立訓練一個嵌入，而是學習一個函數來生成嵌入，因此能泛化到訓練時沒見過的節點。

## HashGNN 為什麼不用訓練？

介紹頁面：[HashGNN — Neo4j GDS](https://neo4j.com/docs/graph-data-science/current/machine-learning/node-embeddings/hashgnn/)

HashGNN 通過隨機哈希函數來模擬圖神經網絡的功能，無需進行昂貴的訓練過程。該算法支持有向圖和無向圖，並且能夠處理異質節點和關係，這使得它能夠應用於複雜的圖結構中。

## 四種演算法怎麼選？

| 演算法 | 階段 | 核心方法 | 適用場景 |
| --- | --- | --- | --- |
| FastRP | 生產級 | 隨機投影，近似保留夾角距離 | 快速、大規模圖，支援節點屬性 |
| Node2Vec | Beta | 二階隨機遊走 | 捕捉鄰里結構的連續特徵 |
| GraphSAGE | Beta | 鄰居抽樣與特徵聚合的歸納式函數 | 需要為未見節點生成嵌入 |
| HashGNN | Beta | 隨機哈希模擬 GNN | 不想訓練、要快速處理異質圖 |

## 常見問題

### Node Embeddings 是什麼？

Node Embeddings（節點嵌入）是把圖中每個節點轉換成 N 維空間中的向量的技術，向量保留了節點在圖中的結構資訊和屬性。轉成向量後，節點之間的相似度就能用餘弦相似度等向量計算來衡量。

### 為什麼 Graph RAG 需要 Node Embeddings？

Graph RAG 把資料結構化為實體與關係組成的圖，再基於圖做檢索與生成。Node Embeddings 讓這些節點可以在向量空間中計算，使相似實體的比對、社群檢測與關聯預測等機器學習任務變得可行，進而提升複雜多跳查詢的回答品質。

### Neo4j GDS 提供哪些節點嵌入演算法？

FastRP 是生產級別的演算法，基於隨機投影、計算速度快；GraphSAGE、Node2Vec 和 HashGNN 則處於 Beta 階段，分別採用鄰居特徵聚合、二階隨機遊走和隨機哈希模擬 GNN 的方式。

### FastRP 和 Node2Vec 有什麼差別？

FastRP 基於隨機投影，依約翰遜-林德斯特拉姆引理把節點映射到 O(log(n)) 維空間，速度快且支援節點屬性與加權圖；Node2Vec 則透過二階隨機遊走建模節點間的過渡概率，用 \`returnFactor\` 和 \`inOutFactor\` 控制遊走行為。

### GraphSAGE 和其他嵌入演算法最大的不同是什麼？

GraphSAGE 不是為每個節點獨立訓練一個嵌入，而是學習一個「從局部鄰居抽樣並聚合特徵」的函數來生成嵌入。這種歸納式做法讓它能為訓練時未見過的節點或新圖產生嵌入。

## 參考資料

- [Introduction to Node Embedding（Memgraph）](https://memgraph.com/blog/introduction-to-node-embedding)
- [Neo4j GDS — Node Embeddings](https://neo4j.com/docs/graph-data-science/current/machine-learning/node-embeddings/)
- [Neo4j GDS — FastRP](https://neo4j.com/docs/graph-data-science/current/machine-learning/node-embeddings/fastrp/)
- [Neo4j GDS — Node2Vec](https://neo4j.com/docs/graph-data-science/current/machine-learning/node-embeddings/node2vec/)
- [Neo4j GDS — GraphSAGE](https://neo4j.com/docs/graph-data-science/current/machine-learning/node-embeddings/graph-sage/)
- [Neo4j GDS — HashGNN](https://neo4j.com/docs/graph-data-science/current/machine-learning/node-embeddings/hashgnn/)

## 延伸閱讀

- [Graph RAG：圖形式的檢索增強生成完整解析](/post/graph-rag)：同樣聚焦 Graph RAG、知識圖譜，可接著比較不同情境的做法。
- [Graph RAG：圖形式的檢索增強生成，讓 LLM 回答全局性問題](/post/graph-rag)：同樣聚焦 Graph RAG、知識圖譜，可接著比較不同情境的做法。
- [Neo4j 圖形資料庫介紹](/post/neo4j-graph-database-introduction)：同樣聚焦 Neo4j，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2024-11-11，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};