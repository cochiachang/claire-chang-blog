var e=`---
title: RAGFlow 開源 RAG 引擎介紹：功能、架構與本機部署觀察
description: 介紹 RAGFlow 的文件解析、知識庫管理、LLM 整合、Docker 架構與本機使用觀察，協助評估是否適合用來建立 RAG 應用。
date: 2024-07-24
category: 生成式AI
tags: [RAGFlow, RAG, 檢索增強生成, 大型語言模型, 文件解析, 知識庫管理]
readingTime: 8 分鐘
image: /images/tech/hero_ragflow-open-source-rag-engine.webp
imageAlt: RAGFlow 知識庫管理畫面截圖
---


# RAGFlow 開源 RAG 引擎介紹：功能、架構與本機部署觀察

RAGFlow 是一套開源的檢索增強生成（Retrieval-Augmented Generation，RAG）引擎，適合想把 PDF、Word、表格、掃描檔與內部文件整理成可問答知識庫的人。我的觀察是：RAGFlow 的重點不只在「接上大型語言模型」，而是把文件解析、切分、檢索、引用與管理介面包成一條比較完整的工作流。

## RAGFlow 是什麼？

RAGFlow 是基於深度文件理解的開源 RAG 引擎。RAGFlow 會先解析複雜文件，再把可檢索內容交給大型語言模型回答，目標是讓答案能回到資料來源。

RAGFlow 官方把它定位為「open-source Retrieval-Augmented Generation engine」，並強調 deep document understanding、可追溯引用與可介入的文件切分流程（RAGFlow GitHub，2026-08 存取）。這點很適合企業知識庫，因為企業資料常常不是乾淨的純文字，而是 PDF、表格、掃描頁、簡報與多種格式混在一起。

我會把 RAGFlow 看成一個「RAG 產品化雛形」：它不是只提供一個 Python library，而是附上知識庫管理、文件上傳、聊天介面、模型設定與 Docker 部署方式。若要快速驗證內部文件問答，RAGFlow 比自己從零串 loader、chunker、vector store 和 UI 更快進入可測試狀態。

![RAGFlow 知識庫管理畫面](/images/tech/ragflow-knowledge-base.webp)

## RAGFlow 的核心功能有哪些？

RAGFlow 的核心功能包含深度文件解析、知識庫管理、範本化切分、可追溯引用與多模型整合。RAGFlow 特別適合先把文件品質處理好，再進入問答與檢索測試。

RAGFlow 官方列出的功能重點，幾乎都圍繞「品質進、品質出」這件事：先把非結構化與複雜格式資料抽取成可用內容，再讓檢索結果支撐回答（RAGFlow GitHub，2026-08 存取）。這也是我覺得 RAGFlow 值得看的原因。多數 RAG 專案失敗，不是模型太弱，而是文件切壞、表格漏掉、引用對不上。

| 功能 | RAGFlow 解決的問題 | 使用時要觀察的地方 |
|---|---|---|
| 深度文件理解 | 解析 PDF、Word、圖片、掃描檔與表格等複雜格式 | 表格欄位、章節標題與掃描文字是否被正確抽取 |
| 知識庫管理 | 把文件依 dataset 管理，支援上傳、解析與查詢 | 資料集命名、文件版本與權限要先規劃 |
| 範本化切分 | 用不同 chunk method 處理不同文件 | 同一問題在不同切分方式下的命中率差異 |
| 引用與檢索測試 | 讓回答能追到來源片段 | 回答是否真的根據引用內容，而不是只引用相似段落 |
| LLM 與 embedding 設定 | 可依環境接不同模型與嵌入服務 | 成本、速度、語言品質與資料隱私要一起評估 |

## RAGFlow 的架構怎麼運作？

RAGFlow 的 Docker 部署由應用服務與多個基礎服務組成。常見依賴包含 Elasticsearch 或 Infinity、MySQL、MinIO 與 Redis，分別負責檢索、資料、檔案與任務佇列。

從官方 Docker 說明來看，RAGFlow 的 \`docker-compose.yml\` 會啟動 RAGFlow 與依賴服務；\`docker-compose-base.yml\` 則負責 Elasticsearch 或 Infinity、MySQL、MinIO 和 Redis（RAGFlow Docker README，2026-08 存取）。這個架構很接近一般生產型 RAG 系統需要的骨架。

RAGFlow 的資料流可以這樣理解：

1. 使用者上傳文件，原始檔案進入 MinIO。
2. 文件 metadata、知識庫設定與使用者資料存在 MySQL。
3. Redis 負責排程解析、切分、embedding 與索引任務。
4. Elasticsearch 或 Infinity 儲存文字與向量檢索資料。
5. RAGFlow server 把檢索結果、引用片段與 LLM 回答串起來。

這種設計的好處是責任切得清楚。代價也很明顯：RAGFlow 不是一個「下載單一執行檔就能跑」的小工具，本機測試最好先準備足夠的 CPU、記憶體、磁碟與 Docker 環境。

## 本機部署 RAGFlow 要注意什麼？

RAGFlow 本機部署最需要先確認 Docker、記憶體、磁碟空間與 \`vm.max_map_count\`。官方 quickstart 建議 x86 CPU 至少 4 核、RAM 至少 16 GB、磁碟至少 50 GB。

官方 quickstart 提到，RAGFlow Docker 部署需要 Docker 24.0.0 以上、Docker Compose v2.26.1 以上，並要求 \`vm.max_map_count\` 至少為 \`262144\`，因為 Elasticsearch 或 Infinity 會用於多路召回（RAGFlow Quickstart，2026-08 存取）。如果這個值太低，Elasticsearch 可能連不起來。

我本機測試時的基本順序是先檢查系統參數，再下載程式，最後啟動 Docker Compose：

\`\`\`bash
sysctl vm.max_map_count
sudo sysctl -w vm.max_map_count=262144
git clone https://github.com/infiniflow/ragflow.git
cd ragflow/docker
docker compose -f docker-compose.yml up -d
\`\`\`

如果使用 macOS 或 ARM 平台，要特別留意官方映像檔支援情況。官方文件明確說明主要維護 x86 平台的 Docker 部署，ARM 平台需要依照文件自行建置相容映像檔（RAGFlow Quickstart，2026-08 存取）。所以我不會把 RAGFlow 當成「任何筆電都能無痛跑起來」的工具；RAGFlow 比較像一套可以本機驗證、也能往伺服器部署推進的 RAG 系統。

![RAGFlow Docker 容器啟動狀態](/images/tech/ragflow-docker-containers.webp)

## RAGFlow 使用起來適合哪些場景？

RAGFlow 適合文件格式複雜、需要引用來源、又希望非工程成員能管理知識庫的 RAG 場景。若只是寫一段簡單檢索程式，RAGFlow 可能比需求本身更重。

我會優先把 RAGFlow 放在這幾種情境：

- **企業內部知識庫**：例如 SOP、產品文件、客服問答與制度文件，需要回答時附上來源。
- **研究與法規文件查詢**：PDF 多、篇幅長、表格多，單靠純文字切分容易失真。
- **RAG PoC 驗證**：想先測「文件能不能被正確解析與引用」，再決定是否自建架構。
- **需要管理介面的團隊**：上傳文件、建立資料集、檢索測試與聊天都希望在 UI 裡完成。

RAGFlow 比較不適合極小型實驗，例如只想學 embedding 或向量資料庫基本概念。那種情境用 LlamaIndex、LangChain 或直接寫一段 Python 會更輕。RAGFlow 的優勢在於把一堆工程零件先裝成可操作介面，適合從「能跑」往「能讓團隊測」前進。

![RAGFlow dataset 文件管理畫面](/images/tech/ragflow-dataset-page.webp)

## RAGFlow 和 LlamaIndex 該怎麼選？

RAGFlow 偏向完整 RAG 應用與知識庫平台，LlamaIndex 偏向可組合的資料框架。選擇時先看需求是要管理介面，還是要在程式裡細緻控制管線。

| 評估點 | RAGFlow | LlamaIndex |
|---|---|---|
| 主要型態 | 開源 RAG 引擎與管理介面 | RAG 資料框架與 Python/TypeScript library |
| 上手方式 | Docker 啟動服務，透過 UI 建資料集 | 寫程式載入、切分、索引與查詢 |
| 適合對象 | 想快速建立可操作知識庫的團隊 | 想客製 RAG 流程的開發者 |
| 文件解析 | 強調複雜格式與深度文件理解 | 依 loader、parser 與外部工具組合 |
| 系統重量 | 需要多個服務與資源 | 可從小型程式開始 |

我的選法很直接：如果目標是讓同事上傳文件、測問答、看引用，RAGFlow 比較貼近成品；如果目標是研究 chunk strategy、retriever、reranker 或 agentic pipeline，LlamaIndex 比較方便改底層。

## 常見問題

### RAGFlow 是免費開源的嗎？
RAGFlow 是開源專案，官方 GitHub repository 採 Apache-2.0 license。實際部署時仍要計算伺服器、儲存、embedding 模型與 LLM API 的成本。

### RAGFlow 可以完全避免大型語言模型幻覺嗎？
RAGFlow 不能完全避免大型語言模型幻覺。RAGFlow 能透過檢索內容與引用來源降低幻覺風險，但答案品質仍取決於文件解析、切分、檢索命中、提示詞與模型能力。

### RAGFlow 一定要使用 OpenAI 模型嗎？
RAGFlow 不一定要使用 OpenAI 模型。RAGFlow 支援設定不同的大型語言模型與 embedding 服務，實際選擇要看語言品質、部署方式、成本與資料隱私要求。

### RAGFlow 可以在 Mac 上跑嗎？
RAGFlow 可以在 macOS 上測試，但官方 Docker 部署主要支援 x86 CPU 與 Nvidia GPU 平台。若使用 Apple Silicon 或 ARM64 環境，要先確認映像檔與文件中的替代建置方式。

### RAGFlow 適合拿來做企業知識庫嗎？
RAGFlow 適合用來做企業知識庫 PoC，尤其是文件格式複雜、需要引用來源、又希望透過 UI 管理 dataset 的情境。正式上線前仍要補權限控管、備份、監控、資料更新流程與模型成本控管。

### RAGFlow 和向量資料庫是同一種東西嗎？
RAGFlow 不是單純的向量資料庫。RAGFlow 是 RAG 引擎，會整合文件解析、切分、索引、檢索、引用與聊天介面；向量資料庫只是 RAGFlow 架構中的其中一層。

## 參考資料

- INFINIFLOW, RAGFlow GitHub repository, https://github.com/infiniflow/ragflow，存取日期：2026-08-28。
- RAGFlow, Quickstart, https://ragflow.net/docs，存取日期：2026-08-28。
- INFINIFLOW, RAGFlow Docker README, https://github.com/infiniflow/ragflow/blob/main/docker/README.md，存取日期：2026-08-28。

最後更新：2026-08-28

## 延伸閱讀

- [RAGFlow深度文檔理解的新境界](/post/ragflow-deep-doc-understanding)：同樣聚焦 RAGFlow、檢索增強生成，可接著比較不同情境的做法。
- [檢索增強生成（RAG）如何讓 LLM 回答更準確](/post/retrieval-augmented-generation)：同樣聚焦 RAG、檢索增強生成，可接著比較不同情境的做法。
- [RAPTOR 是什麼？基於樹狀結構的 RAG 方法](/post/raptor-tree-structured-rag-method)：同樣聚焦 RAG、檢索增強生成，可接著比較不同情境的做法。
`;export{e as default};