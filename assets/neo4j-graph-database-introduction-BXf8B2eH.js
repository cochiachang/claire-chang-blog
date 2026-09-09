var e=`---
title: Neo4j 圖形資料庫介紹
description: 介紹 Neo4j 如何用 graph database 模型儲存節點與關係，並用 Cypher 查詢社交圖譜、企業關係與詐欺偵測場景。
date: 2024-07-24
category: 後端開發
tags: [Neo4j, graph database, Cypher, 圖形資料庫, NoSQL]
readingTime: 8 分鐘
image: /images/tech/hero_neo4j-graph-database-introduction.webp
imageAlt: Neo4j 查詢效能示意圖，呈現圖形資料庫在高度連結資料中的查詢優勢
---


# Neo4j 圖形資料庫介紹

Neo4j 是一套以 graph database 為核心的圖形資料庫，適合處理「資料之間的關係比單筆資料更重要」的問題。社交網路、企業關係、推薦系統、知識圖譜與詐欺偵測都屬於這類場景；我在整理 Neo4j 時，最想記住的不是資料庫名稱，而是它把節點（Node）與關係（Relationship）直接當成資料模型的一部分。

## Neo4j 是什麼？

Neo4j 是使用 property graph model 的圖形資料庫。Neo4j 以節點表示實體，以關係表示實體之間的連接，並讓兩者都可以帶有屬性。

圖形資料庫和關聯式資料庫最大的差異，在於「關係」不是查詢時才用 JOIN 拼出來，而是資料本身就保存了連線。Neo4j 官方文件把 property graph model 拆成節點、關係、標籤與屬性：節點描述領域裡的實體，關係連接來源節點與目標節點，屬性則用 key-value 補充節點或關係的細節（Neo4j Graph Database Concepts，存取日期：2026-08-28）。

![Neo4j property graph 節點與關係示意圖](/images/tech/neo4j-property-graph-example.webp)

我會把 Neo4j 想成一種「先承認世界是網狀的」資料庫。當資料問題本來就是「誰認識誰」「哪家公司投資哪家公司」「哪個帳號和哪支手機重複出現」時，graph database 的模型會比把所有東西硬塞進表格更自然。

## graph database 和一般 NoSQL 有什麼不同？

graph database 是 NoSQL 的一種，但 graph database 的重點不是只追求彈性 schema，而是把連接關係變成第一級資料。Neo4j 因此適合查多跳關聯。

常見 NoSQL 類型可以用這張表快速區分：

| NoSQL 類型 | 常見例子 | 適合處理的資料形狀 |
|---|---|---|
| 鍵值資料庫 | Redis | 用 key 快速取 value |
| 文件資料庫 | MongoDB | 以 JSON-like 文件保存半結構化資料 |
| 寬欄資料庫 | Apache HBase | 大量稀疏欄位與分散式寫入 |
| 圖形資料庫 | Neo4j | 節點、關係、多跳路徑與模式匹配 |

如果問題只是在查某個商品的價格，鍵值資料庫或關聯式資料庫就能處理；如果問題是「哪些商品被同一群高價值客戶一起購買，而且這些客戶又和哪些家庭成員共享地址」，圖形資料庫的查詢思路會更直覺。Neo4j 官方 use cases 也把 real-time recommendations、fraud detection、supply chain management、knowledge graphs 列為 graph technology 的常見應用方向（Neo4j Use Cases，存取日期：2026-08-28）。

## Neo4j 為什麼適合處理高度連結資料？

Neo4j 適合高度連結資料，因為 Neo4j 查詢會沿著既有關係走訪，而不是每次重新計算表格之間的連接。關係越密集，差異越明顯。

在關聯式資料庫裡，複雜關係常常被拆成多張表，再靠外鍵與 JOIN 串回來。這不是錯，只是當查詢一路跨過很多層時，SQL 會愈寫愈長，查詢計畫也更難閱讀。

Neo4j 的原生圖形架構把節點和關係存在貼近圖結構的位置。Neo4j 在知識圖譜說明中也強調 index-free adjacency 可以避免複雜 JOIN，並讓關聯走訪更快；官方頁面以「up to 1000x faster queries」描述特定圖形查詢相對於關聯式或非原生圖形資料庫的效能優勢（Neo4j Knowledge Graph，存取日期：2026-08-28）。這類數字要回到實際資料模型和查詢條件驗證，但方向很清楚：Neo4j 的強項是連線密集的問題。

![Neo4j 查詢效能示意圖](/images/tech/neo4j-query-performance.webp)

## Neo4j 可以用在哪些場景？

Neo4j 常見應用包含社交網路圖譜、企業關係圖譜、金融詐欺偵測、推薦系統與知識圖譜。這些場景共同特徵是答案藏在關係路徑裡。

我會先用三個場景判斷 Neo4j 是否值得導入：

| 場景 | Neo4j 可以回答的問題 | 為什麼 graph database 合適 |
|---|---|---|
| 社交網路圖譜 | 某個使用者和哪些人、內容或群組有直接或間接關係？ | 好友、追蹤、互動都能用節點與關係表示 |
| 企業關係圖譜 | 一家公司和股東、客戶、供應商、投資人之間如何連動？ | 企業查詢通常不是單點資料，而是多層關係網 |
| 金融詐欺偵測 | 多個帳號是否共享電話、裝置、地址或交易對手？ | 可沿著帳號、交易、IMEI、地址等節點找可疑路徑 |

Neo4j 官方的 fraud detection demo 也採用相同思路：詐欺行為常透過複雜關係隱藏，圖形資料庫能把可疑路徑、中介節點與重複身份關係攤開來分析（Neo4j Fraud Demo，存取日期：2026-08-28）。這也是我覺得 Neo4j 很適合放在「調查型查詢」的原因。

![Neo4j graph database 使用場景整理圖](/images/tech/neo4j-graph-database-use-cases.webp)

## Cypher 在 Neo4j 裡扮演什麼角色？

Cypher 是 Neo4j 的宣告式圖形查詢語言。Cypher 用括號表示節點、用箭頭表示關係，讓查詢看起來接近一張可讀的關係圖。

Neo4j 官方文件說明，Cypher 和 SQL 一樣讓使用者描述「要取回什麼」，而不是命令資料庫「如何一步步取回」。差別在於 Cypher 的語法把圖形模式直接寫進查詢，例如 \`(:Person)-[:ACTED_IN]->(:Movie)\` 這種 ASCII-art 形式（Neo4j Cypher Manual，存取日期：2026-08-28）。

下面這段查詢保留我當時筆記裡的核心例子：找出參演某部電影的人。

\`\`\`cypher
MATCH (p:Person)-[:ACTED_IN]->(m:Movie)
WHERE m.title = "雲圖"
RETURN p
\`\`\`

\`MATCH\` 負責描述要找的圖形模式，\`WHERE\` 加上篩選條件，\`RETURN\` 指定輸出。Cypher 的 \`MATCH\` clause 會在 graph structure 中尋找符合模式的節點、關係與屬性（Neo4j MATCH documentation，存取日期：2026-08-28）。對熟 SQL 的人來說，Cypher 不難上手；真正需要轉換的是建模角度。

## 什麼情況不一定要選 Neo4j？

Neo4j 不需要取代所有資料庫。資料關係簡單、主要做交易寫入或固定報表統計時，PostgreSQL 等關聯式資料庫通常更直接、更容易維運。

我會用這份檢查表做初步判斷：

| 問題 | 偏向 Neo4j | 偏向 PostgreSQL 或其他關聯式資料庫 |
|---|---|---|
| 查詢是否需要跨很多層關係？ | 是，常見 3 hops 以上 | 否，多數是一兩張表查詢 |
| 關係本身是否有屬性？ | 是，例如關係時間、角色、權重 | 否，關係只是外鍵 |
| 團隊是否需要探索未知模式？ | 是，例如可疑網絡、推薦路徑 | 否，報表欄位固定 |
| 系統是否以交易一致性和標準 SQL 報表為主？ | 不一定 | 是，關聯式資料庫更穩 |

資訊增益放在這裡：不要只因為資料很多就選 Neo4j，要因為「關係很多、路徑重要、模式需要被查出來」才選 Neo4j。資料量大但關係簡單，通常先把 PostgreSQL 索引、查詢設計與資料表結構調好，會比引入新的 graph database 更務實。

## 常見問題

### Neo4j 是什麼資料庫？
Neo4j 是一套 graph database，也就是圖形資料庫。Neo4j 用節點保存實體，用關係保存實體之間的連接，適合處理社交網路、企業關係、推薦系統、知識圖譜與詐欺偵測。

### graph database 和 relational database 差在哪裡？
graph database 直接把關係存成資料模型的一部分，relational database 則通常用外鍵和 JOIN 表示關係。當查詢需要跨很多層連接時，graph database 的建模和查詢語法會更貼近問題本身。

### Neo4j 和 MongoDB 都是 NoSQL，差異是什麼？
MongoDB 偏向文件資料庫，適合保存 JSON-like 文件和半結構化資料。Neo4j 偏向圖形資料庫，適合查節點之間的路徑、關係模式與多跳連接。

### Cypher 是 SQL 嗎？
Cypher 不是 SQL，但 Cypher 借用了不少 SQL 類似概念，例如 \`WHERE\`、\`ORDER BY\`、宣告式查詢。Cypher 的差異在於查詢對象是節點與關係，並用箭頭語法描述 graph pattern。

### Neo4j 適合拿來做 RAG 嗎？
Neo4j 可以用在 graph RAG 或 knowledge graph RAG 場景，特別適合保存實體、概念與來源文件之間的關係。向量搜尋負責語意相似度，graph database 則補上結構化脈絡與可追溯路徑。

### 什麼時候不該用 Neo4j？
如果資料主要是固定欄位、單表查詢、標準交易或傳統 BI 報表，Neo4j 不一定是第一選擇。PostgreSQL、MySQL 這類關聯式資料庫在這些場景通常更簡單，也更容易找到維運經驗。

## 參考資料

- Neo4j，〈[Graph Database Concepts](https://neo4j.com/docs/getting-started/appendix/graphdb-concepts/)〉，存取日期：2026-08-28。
- Neo4j，〈[Overview - Cypher Manual](https://neo4j.com/docs/cypher-manual/current/introduction/cypher-overview/)〉，存取日期：2026-08-28。
- Neo4j，〈[MATCH - Cypher Manual](https://neo4j.com/docs/cypher-manual/current/clauses/match/)〉，存取日期：2026-08-28。
- Neo4j，〈[Graph Database Use Cases & Solutions](https://neo4j.com/use-cases/)〉，存取日期：2026-08-28。
- Neo4j，〈[Knowledge Graph](https://neo4j.com/use-cases/knowledge-graph/)〉，存取日期：2026-08-28。
- Neo4j，〈[Neo4j Fraud Demo](https://neo4j.com/developer/demos/fraud-demo/)〉，存取日期：2026-08-28。
- GitHub，〈[neo4j/neo4j](https://github.com/neo4j/neo4j)〉，存取日期：2026-08-28。

## 延伸閱讀

- [圖形資料庫的概念入門](/post/graph-database-concepts-introduction)：同樣聚焦 圖形資料庫、NoSQL，可接著比較不同情境的做法。
- [專為連接性設計的查詢語言 – Cypher](/post/cypher-query-language-intro)：同樣聚焦 Cypher、Neo4j，可接著比較不同情境的做法。
- [Graph RAG 的 Node Embeddings 技術：把圖節點變成向量](/post/graph-rag-node-embeddings)：同樣聚焦 Neo4j，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2026-08-28。本文依 2024-07-24 初次發布的 Neo4j 學習脈絡整理，保留 Neo4j、graph database 與 Cypher 核心內容，並補上 GEO Answer Blocks、FAQ、參考資料、站內延伸閱讀與圖片 webp 路徑。
`;export{e as default};