var e=`---
title: 專為連接性設計的查詢語言 – Cypher
description: Cypher 是 Neo4j 圖形資料庫的查詢語言，用節點與關係取代表格，語法比 SQL 直覺
date: 2024-07-24
category: 後端開發
tags: [Cypher, Neo4j, 圖形資料庫, 查詢語言, NoSQL]
readingTime: 6 分鐘
image: /images/tech/hero_cypher-query-language-intro.webp
imageAlt: 抽象的節點與連線網絡圖，象徵圖形資料庫的節點與關係結構
---


# 專為連接性設計的查詢語言 – Cypher

Cypher 是 Neo4j 圖形資料庫的查詢語言，設計靈感來自 SQL，但操作對象從表格換成了節點（Node）和關係（Relationship）。同樣是要問「誰的主管是誰」這種問題，SQL 需要靠好幾層 JOIN 才能拼出答案，Cypher 直接把關係寫進查詢語法裡，讀起來更接近你腦中原本的那張關係圖。

## Cypher 跟 SQL 有什麼不一樣？

SQL 針對的是表格資料，關聯要靠外鍵和 JOIN 一層層串起來；Cypher 針對的是圖形資料，關係本身就是查詢的一部分，用箭頭符號直接畫出節點之間怎麼連。查一個組織的主管鏈就是最直接的例子，兩種語言的差異一比就懂：

\`\`\`sql
SELECT *
FROM employees e
JOIN departments d ON e.department_id = d.department_id
JOIN locations l ON d.location_id = l.location_id
WHERE e.manager_id IS NULL;
\`\`\`

換成 Cypher，同樣的查詢意圖寫成這樣：

\`\`\`cypher
MATCH (e:Employee)-[:MANAGES*0..]->(m:Employee)
WHERE m.manager_id IS NULL
RETURN e
\`\`\`

\`-[:MANAGES*0..]->\` 這段語法直接表達「沿著 MANAGES 關係走任意層」，不需要額外的 JOIN 去拼表格。資料本身如果就是高度連結的（社交網路、組織架構、推薦系統），這種寫法會比 SQL 省事很多。

## Cypher 查詢的基本組成有哪些？

Cypher 把圖形資料的操作拆成幾個關鍵字，各自負責一件事：

- **CREATE**：建立節點和關係。
- **MATCH**：尋找符合特定模式的節點和關係。
- **WHERE**：對 \`MATCH\` 或其他操作的結果加上篩選條件。
- **RETURN**：指定要回傳的資料。
- **SET**：更新節點或關係的屬性。
- **DELETE**：刪除節點或關係。

這幾個關鍵字組合起來，就能涵蓋從建模到查詢的完整流程。

## 如何用 Cypher 建立節點和關係？

先建立兩個節點，一個是人、一個是學校：

\`\`\`cypher
CREATE (p:Person {name: "John", age: 25})
CREATE (s:School {name: "Stanford University", location: "California"})
\`\`\`

\`Person\` 和 \`School\` 是節點標籤，用來標示節點的類型；花括號裡的是這個節點的屬性。接著把兩者連起來：

\`\`\`cypher
MATCH (p:Person {name: "John"}), (s:School {name: "Stanford University"})
CREATE (p)-[:STUDIED_AT]->(s)
\`\`\`

\`MATCH\` 先找出名字是 John 的人和名字是 Stanford University 的學校，\`CREATE\` 再建立一條叫 \`STUDIED_AT\` 的關係，方向是從人指向學校。這個「先找節點、再建關係」的順序，是 Cypher 建模時最常見的寫法。

## 怎麼從既有的 CSV 資料批次匯入？

手動一筆一筆 \`CREATE\` 只適合示範，實際資料通常是現成的 CSV。Cypher 提供 \`LOAD CSV\` 直接讀檔匯入：

\`\`\`cypher
LOAD CSV WITH HEADERS FROM 'file:///path_to_your_file.csv' AS line
CREATE (:Person {name: line.name, age: toInteger(line.age)})
\`\`\`

這行會依照 CSV 每一列的資料建立一個 \`Person\` 節點，\`line.name\`、\`line.age\` 對應到 CSV 的欄位名稱，\`toInteger()\` 則負責把字串型態的年齡欄位轉成數字。資料量大的時候通常會搭配 \`USING PERIODIC COMMIT\` 分批提交，避免單一交易吃掉太多記憶體。

匯入完成後可以用查詢驗證資料是否正確落地，例如列出所有學生和他們就讀的學校：

\`\`\`cypher
MATCH (p:Person)-[:STUDIED_AT]->(s:School)
RETURN p.name, s.name
\`\`\`

## 如何更新節點屬性和篩選查詢結果？

更新一個已存在節點的屬性，用 \`MATCH\` 找到目標，再用 \`SET\` 賦值：

\`\`\`cypher
MATCH (n:Person {name: 'Ann'})
SET n.age = 26
\`\`\`

篩選條件則交給 \`WHERE\`，例如找出所有 2000 年後上映的電影：

\`\`\`cypher
MATCH (movie:Movie)
WHERE movie.releaseDate >= 2000
RETURN movie
\`\`\`

\`WHERE\` 可以疊加多個條件，處理起來跟 SQL 的邏輯運算子（\`AND\`、\`OR\`、\`NOT\`）用法一致，差別只在於篩選對象是圖上的節點或關係，而不是表格的欄位。

## Cypher 的聚合函數跟 SQL 有什麼不同?

SQL 做聚合查詢必須明確寫 \`GROUP BY\` 指定分組欄位，Cypher 不用——查詢裡沒被聚合函數包住的欄位會自動變成分組依據。例如統計每個演員參演了幾部電影：

\`\`\`cypher
MATCH (actor:Person)-[:ACTED_IN]->(movie:Movie)
RETURN actor.name, COUNT(movie)
\`\`\`

\`actor.name\` 沒有被聚合函數包住，Cypher 就自動拿它當分組鍵；\`COUNT(movie)\` 算出每個分組裡電影節點的數量。少了一行 \`GROUP BY\`，查詢讀起來更精簡，但也代表你得清楚自己 \`RETURN\` 了哪些欄位，才不會不小心分出多餘的組。

## 常見問題

### Cypher 只能用在 Neo4j 嗎?

Cypher 最初是 Neo4j 開發的查詢語言，目前也透過 openCypher 專案被其他圖形資料庫採用，但主流使用場景仍然集中在 Neo4j。

### 學過 SQL 之後學 Cypher 會很難嗎?

不會。兩者的關鍵字概念（\`MATCH\` 對應 \`SELECT\`、\`WHERE\` 篩選、\`RETURN\` 對應輸出欄位）高度相似，主要差異在於 Cypher 用箭頭符號直接表達關係方向，不必靠 JOIN 拼接。

### 什麼情況該選圖形資料庫而不是關聯式資料庫?

當資料本身的重點是「關係」而不是「屬性」——例如社交網路的好友鏈、推薦系統的關聯路徑、組織架構的層級查詢——圖形資料庫和 Cypher 通常比關聯式資料庫加多層 JOIN 更直接、也更容易維護。


## 參考資料
Neo4j, Inc.，Cypher Manual：Introduction，存取日期：2026-08-27。[https://neo4j.com/docs/cypher-manual/current/introduction/](https://neo4j.com/docs/cypher-manual/current/introduction/)

## 延伸閱讀

- [Neo4j 圖形資料庫介紹](/post/neo4j-graph-database-introduction)：同樣聚焦 Neo4j、Cypher，可接著比較不同情境的做法。
- [圖形資料庫的概念入門](/post/graph-database-concepts-introduction)：同樣聚焦 圖形資料庫、NoSQL，可接著比較不同情境的做法。
- [Graph RAG 的 Node Embeddings 技術：把圖節點變成向量](/post/graph-rag-node-embeddings)：同樣聚焦 Neo4j，可接著比較不同情境的做法。
`;export{e as default};