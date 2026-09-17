var e=`---
title: "向量搜尋資料庫比較：RAG 系統該如何選擇 Vector Database"
description: 比較 ChromaDB、Elasticsearch、Faiss、Redis 四種向量資料庫的技術特性、優缺點與適用場景，附 ChromaDB 完整操作範例。
date: 2024-07-24
category: 後端開發
tags: [Vector Database, RAG, 資料庫]
readingTime: 9 分鐘
image: /images/tech/hero_prometheus-exporter-target-info.webp
imageAlt: 向量搜尋資料庫比較：RAG 系統該如何選擇 Vector Database 技術文章封面圖
---


# 向量搜尋資料庫比較：RAG 系統該如何選擇 Vector Database

## ChromaDB 是什麼，適合什麼情境？

Chroma 是一個新的 AI 原生開源嵌入式資料庫，非常輕量且易用。它讓知識、事實和技能可插入，從而輕鬆建立 LLM 應用程式。可以運行在記憶體中（也可保存在磁碟中），也可做為資料庫伺服器來使用（這和傳統資料庫類似）。

- 官方文件：[Getting Started](https://docs.trychroma.com/getting-started)
- GitHub：[chroma-core/chroma](https://github.com/chroma-core/chroma)

### ChromaDB 基本使用範例

\`\`\`python
import chromadb

# 建立客戶端
# 記憶體模式
# client = chromadb.Client()

# 持久模式，資料保存在磁碟
client = chromadb.PersistentClient(path="./chromac")

# Docker客戶端模式
# chroma_client = chromadb.HttpClient(host="localhost", port=8000)

# 遍歷所有集合
collections = client.list_collections()
print("現有的集合:", collections)

# 建立新集合
collection = client.create_collection("testname")

# 取得集合
collection = client.get_collection("testname")

# 建立或取得集合
collection = client.get_or_create_collection("testname")

# 刪除集合
client.delete_collection("testname")

# 建立或取得集合（帶有嵌入函數）
def embedding_function(doc):
    # 定義你的嵌入函數
    return [0.1, 0.2, 0.3]

collection = client.get_or_create_collection(name="my_collection2", embedding_function=embedding_function)

# 取得集合中最新的5條資料
latest_documents = collection.peek()
print("最新的資料:", latest_documents)

# 新增資料
collection.add(
    documents=[
        "2022年2月2號，美國國防部宣布：將向歐洲增派部隊，應對俄烏邊境地區的緊張局勢。",
        "2月17號，烏克蘭軍方稱：東部民間武裝向政府軍控制區發動砲擊，而東部民間武裝則指責烏政府軍先動用了重型武器發動襲擊，烏東地區緊張局勢持續升級。"
    ],
    metadatas=[
        {"source": "my_source"},
        {"source": "my_source"}
    ],
    ids=["id1", "id2"]
)

# 改變資料（更新或新增）
collection.upsert(
    ids=["id1"],
    documents=["更新後的文檔內容"],
    metadatas=[{"source": "updated_source"}]
)

# 刪除資料
collection.delete(ids=["id1", "id2"])

# 查詢資料
results = collection.query(
    query_texts=["俄烏戰爭發生在哪天？"],
    n_results=2
)
print("查詢結果:", results)
\`\`\`

## Elasticsearch 拿來做向量搜尋合適嗎？

Elasticsearch 是一個非常強大和靈活的搜索和分析引擎。雖然它的主要用例圍繞全文搜索，但它的用途足夠廣泛，可以用於各種其他功能，其中一個引起許多開發人員和數據科學家注意的功能，就是把 Elasticsearch 當成向量資料庫使用。隨著 \`dense_vector\` 數據類型的出現，以及利用 \`script_score\` 函數的能力，Elasticsearch 的功能已經擴展到促進向量相似性搜索。

### Elasticsearch 相比專用向量搜索庫的優點

使用 Elasticsearch 作為向量資料庫的一大優勢，是它內建的功能可以過濾對特定數據子集的查詢——當你想縮小搜索空間範圍，或應用程式需要上下文感知向量搜索時，這個功能非常有用。相比之下，雖然其他專用的向量搜索庫（如 ChromaDB 和 Faiss）為純向量搜索提供了無可挑剔的速度和效率，但它們缺乏 Elasticsearch 那種全功能查詢能力。例如 ChromaDB 確實允許查詢元數據，但僅限於字元串的精確匹配，這個限制有時會妨礙複雜搜索方案中所需的靈活性和粒度。

將 Elasticsearch 豐富的查詢環境與向量相似度搜索相結合，意味著使用者可以兩全其美：基於向量的精確結果，並透過使用細緻入微的上下文感知篩檢程式對這些搜索進行分層的能力來增強。這種合併使 Elasticsearch 成為需要深度和廣度的開發人員的有力選擇。

### Elasticsearch 相比專用向量搜索庫的缺點

Elasticsearch 憑藉其廣泛的工具集和適應性，在搜尋引擎領域為自己開闢了一席之地。然而，當與 Faiss 和 ChromaDB 等專門的向量搜索庫相比時，它在某些領域暴露了自己的局限性。

**近似最近鄰和分層可導航小世界技術**：對於 Elasticsearch 的 OpenSearch 版本 7 來說，它缺乏對近似最近鄰（ANN）演算法和分層可導航小世界（HNSW）技術的內置支持。這些先進的方法對於提高在廣泛數據集中的搜索速度至關重要，利用它們可以大大加快搜索速度，而準確性只有很小的權衡。

**Faiss 和 ChromaDB**：把這些策略作為核心技術，展現了快速導航廣闊向量空間的天生能力，因此在圍繞廣泛數據集、需要快速結果的應用中具有優勢。

**用過濾器來緩解**：對於 Elasticsearch 愛好者來說，一切並不黯淡。該系統固有的靈活性提供了一種對策——透過熟練地將過濾器應用於查詢，可以減少 Elasticsearch 中的搜索空間，在一定程度上平衡因缺乏 ANN 和 HNSW 支持而造成的效率差距，讓 Elasticsearch 能夠專注於相關數據子集，使搜索過程更易於管理和更快速。

## Faiss 適合什麼場景？

官方網站：[faiss.ai](https://faiss.ai/index.html)

Faiss 是一個用於高效相似性搜索和密集向量聚類的庫，包含搜索任何大小向量集的演算法，即使是可能不適合放進 RAM 的向量集，還包含用於評估和參數調整的支援代碼。Faiss 基於多年研究，實現了多種先進技術，使其在大規模向量數據搜索中具有顯著優勢，能夠快速在大量數據中找到匹配項、節省存儲空間，同時保持搜索準確性，並可利用 GPU 進行加速。這些特性使 Faiss 非常適合需要快速檢索大量資料的應用。以下是 Faiss 用到的主要技術：

1. **非詳盡搜索**：基於「Video google: A text retrieval approach to object matching in videos」的倒排文件技術，使大型數據集的非詳盡搜索成為可能，避免全量掃描，提高搜索效率。
2. **產品量化（PQ）**：來自「Product quantization for nearest neighbor search」的方法，是一種高維向量的有損壓縮技術，能在壓縮域中進行相對準確的重建和距離計算，減少存儲和計算成本。
3. **三級量化（IVFADC-R）**：從「Searching in one billion vectors: re-rank with source coding」引入的三級量化方法，進一步提高搜索效率。
4. **倒排多重索引**：基於「The inverted multi-index」的技術，大大提高倒排索引的速度，適用於快速且精度要求不高的操作。
5. **優化產品量化（OPQ）**：來自「Optimized product quantization」的技術，透過向量空間的線性變換，使索引更為高效。
6. **GPU 加速**：「Billion-scale similarity search with GPUs」中描述的 GPU 實現和快速 k 選擇，使大規模相似性搜索能充分利用 GPU 的計算能力。
7. **分層可導航小世界（HNSW）**：使用「Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small World graphs」的 HNSW 索引方法，提供高效而穩健的近似最近鄰搜索。
8. **二進位多索引哈希**：基於「Fast Search in Hamming Space with Multi-Index Hashing」的方法，提高哈希空間中的搜索速度。
9. **基於圖的索引（NSG）**：從「Fast Approximate Nearest Neighbor Search With The Navigating Spreading-out Graph」引入的 NSG 方法，進一步提高近似最近鄰搜索的效率。
10. **殘差量化器**：來自「Improved Residual Vector Quantization for High-dimensional Approximate Nearest Neighbor Search」的技術，改進高維度近似最近鄰搜索的性能。

## Redis 也能做向量搜尋嗎？

官方介紹：[Redis Vectors](https://redis.io/docs/latest/develop/interact/search-and-query/advanced-concepts/vectors/)

大多數具有 Web 服務背景的開發人員可能都熟悉 Redis。從本質上講，Redis 是一個開源鍵值存儲，可以用作緩存、消息代理和資料庫，開發人員選擇它是因為速度快、擁有龐大的客戶端庫生態系統，並且已被各大企業部署多年。

RediSearch 是一個 Redis 模組，為 Redis 提供查詢、二級索引、全文搜索和向量搜索。要使用 RediSearch，首先要在 Redis 數據上聲明索引，然後就可以用 RediSearch 客戶端查詢該數據。

Redis 向量資料庫支援兩種向量索引類型：暴力搜尋的 FLAT，以及近似搜尋的 HNSW；同時提供餘弦距離、內積距離和歐幾里德距離三種距離運算；另外還支援範圍搜尋，以及可以添加組合過濾器和語義搜尋的混合搜尋，並提供 JSON 物件支援。

## 常見問題

### 這四種向量資料庫該怎麼選？

如果專案已經在用 Elasticsearch 做全文搜索，且需要向量搜索結合豐富的過濾條件，直接擴充 Elasticsearch 是省事的選擇；如果目標是輕量、快速上手的嵌入式方案，ChromaDB 很適合原型開發；如果資料規模極大、需要極致的搜索速度與 GPU 加速，Faiss 的技術深度更適合；如果專案本來就在用 Redis 做快取，且想要低延遲的向量搜索，Redis 的 HNSW 支援也是合理選項。

### ChromaDB 和 Faiss 有什麼本質差異？

ChromaDB 定位是「開箱即用的嵌入式向量資料庫」，內建集合管理、metadata 過濾等應用層功能；Faiss 則更像是一個相似性搜索的演算法庫，提供多種索引技術讓開發者自行組裝，彈性更高但也需要自己處理更多資料庫層面的工程（如持久化、多用戶存取）。

### Elasticsearch 缺乏 ANN/HNSW 支援會有什麼實際影響？

在資料集規模不大或查詢頻率不高時影響有限；但當向量資料量成長到需要極致搜索速度時，缺乏原生 ANN/HNSW 支援會讓 Elasticsearch 的搜索延遲相對其他專用向量資料庫更高，這時可以靠額外的過濾條件縮小搜索空間來緩解，或考慮換用原生支援 HNSW 的資料庫。

## 參考資料

- [ChromaDB Getting Started](https://docs.trychroma.com/getting-started)
- [chroma-core/chroma](https://github.com/chroma-core/chroma)
- [Faiss](https://faiss.ai/index.html)
- [Redis Vectors](https://redis.io/docs/latest/develop/interact/search-and-query/advanced-concepts/vectors/)

## 延伸閱讀

- [雲端相似性搜尋資料庫研究：AWS DocDB、阿里雲 OpenSearch 與 Amazon Neptune 向量搜尋比較](/post/cloud-similarity-search-databases-research)：同樣聚焦 RAG，可接著比較不同情境的做法。
- [雲端相似性搜尋資料庫研究：DocumentDB、OpenSearch Vector 與 Neptune Analytics 比較](/post/cloud-similarity-search-databases-research)：同樣聚焦 RAG，可接著比較不同情境的做法。
- [RAG 檢索資料準備指南：切分、向量化與索引設計](/post/rag-retrieval-data-preparation)：同樣聚焦 RAG，可接著比較不同情境的做法。

## 最後更新

2026-08-28

`;export{e as default};