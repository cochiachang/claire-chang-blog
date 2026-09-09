var e=`---
title: RAGFlow深度文檔理解的新境界
description: 深入介紹開源 RAG 引擎 RAGFlow：深度文檔理解、layout recognize 解析設定、知識庫管理與多路召回查詢。分享實際安裝設定經驗，包含 Ollama 本地模型串接注意事項，幫助你打造更準確的 AI 問答系統。
date: 2024-07-24
category: 生成式AI
tags: [RAGFlow, 檢索增強生成, 深度文檔理解, 知識庫管理, 大型語言模型]
readingTime: 4 分鐘
image: /images/tech/hero_ragflow-deep-doc-understanding.webp
imageAlt: 藍色 AI 立體字樣與數據線條構成的科技感背景
---


# RAGFlow深度文檔理解的新境界

RAGFlow 是一款開源的檢索增強生成（RAG）引擎，核心優勢在於強大的深度文檔理解能力。透過結合大型語言模型，RAGFlow 能夠深入解析各種複雜格式的文檔，包括 PDF、Word 和 PowerPoint 等。這種深度理解讓 AI 系統能夠更準確地回答用戶查詢，大幅提升問答系統的性能。這篇文章整理我實際使用 RAGFlow 的功能筆記與設定心得。

## RAGFlow 有哪些核心特性？

基於深度文檔理解，RAGFlow 能夠從各類複雜格式的非結構化資料中提取真知灼見，並在無限上下文的場景下快速完成大海撈針測試。幾個我認為的重點：

- **模板化的文字切片技術**：不僅智能，而且可控、可解釋，提供多種範本選擇並可視化調整。
- **支援多種文件類型**：Word、PPT、Excel、TXT、圖片、PDF、影印件等。
- **全面優化的 RAG 工作流程**：從個人應用到超大型企業的需求都能滿足。
- **易用的 API**：方便整合各類企業系統。
- **降低幻覺風險**：確保答案有理有據，回答可附註引用來源。

## RAGFlow 的系統架構長什麼樣？

以下為 RAGFlow 的系統架構圖，可以看到它把文檔解析、檢索與生成回答的流程完整串起來：

![RAGFlow 系統架構圖](/images/articles/ragflow-deep-doc-understanding-1.webp)

## 登入畫面

安裝完成後，以下為 RAGFlow 的登入畫面：

![RAGFlow 登入畫面](/images/articles/ragflow-deep-doc-understanding-2.webp)

## 模型設定要注意什麼？

在模型設定頁可以設定要使用的模型的 API Token，或者連線至本地端的 Ollama。這邊有一個很容易踩的坑：

> 如果你的 RAGFlow 是用 Docker 起的，那麼 Ollama 也一定要起在 Docker 裡面，彼此才連線得到；不然就是要透過公開網址讓雙方互通。

![RAGFlow 模型設定畫面](/images/articles/ragflow-deep-doc-understanding-3.webp)

## 知識庫解析方式怎麼設定才正確？

接著可以新增知識庫。設定知識庫的解析方式時，選對選項非常重要：

- 如果上傳的是**純文字 PDF**，記得把 **layout recognize 關掉**。
- 如果要解析的是**圖檔、PowerPoint** 這種需要先解析版面的檔案，則應該**打開 layout recognize**——它會用 OCR 去判斷圖像上的文字。

![RAGFlow 知識庫設定畫面](/images/articles/ragflow-deep-doc-understanding-4.webp)

以下為純文字檔案卻打開 layout recognize 的解析狀況，可以看到內容被切得亂七八糟：

![純文字 PDF 誤開 layout recognize 的解析結果](/images/articles/ragflow-deep-doc-understanding-5.webp)

關閉之後就能正常解析全部的純文字內容。下圖則是需要打開 layout recognize 的範例——這個 PDF 的內容皆為圖像，靠 OCR 判讀文字：

![圖像型 PDF 開啟 layout recognize 的解析結果](/images/articles/ragflow-deep-doc-understanding-6.webp)

## 聊天功能可以做什麼？

這邊有點類似 GPT Plus 的體驗：可以建立很多不同的聊天助理，每個助理能針對個別設定要搜尋的知識庫，回答時還可以附註搜尋到的檔案文本，方便驗證答案來源。

## 圖（Graph）功能介紹

我們可以在這邊客製化聊天流程，做更進一步的機器人進階設定，預設內建多種流程範本。可設定的元件包括：

- 知識檢索
- 生成回答
- 人機交互
- 問題分類
- 靜態訊息
- 是否相關
- 問題最佳化

每一個元件都可以設定使用的模型與相關提示。要特別注意的是，在知識檢索裡面若沒有設定相關的文件檔，流程會陷入無限迴圈 😄。

## 文件管理介紹

從文件管理頁可以看到我們上傳的所有文件檔案，統一管理知識庫的原始資料。

## 常見問題

### RAGFlow 是什麼？

RAGFlow 是一款開源的檢索增強生成（RAG）引擎，主打深度文檔理解。它能解析 PDF、Word、PPT、Excel、圖片等複雜格式，結合大型語言模型打造有據可查的 AI 問答系統。

### RAGFlow 連不上本地 Ollama 怎麼辦？

最常見的原因是網路環境不同：如果 RAGFlow 是用 Docker 啟動的，Ollama 也必須跑在 Docker 裡（同一網路），或者透過公開網址互通，否則容器內的 RAGFlow 連不到 host 上的 Ollama。

### 純文字 PDF 解析結果很亂該怎麼調整？

把知識庫解析設定中的 layout recognize 關閉即可。layout recognize 是為圖像型、有版面設計的文件設計的，純文字文件誤開會讓內容被錯誤切割。

### layout recognize 什麼時候需要打開？

當文件內容主要為圖像、需要 OCR 判讀時，例如掃描的影印件、圖片型 PDF 或 PowerPoint。它會先解析版面再用 OCR 擷取文字。

### RAGFlow 如何降低 AI 幻覺？

RAGFlow 的回答可以附註檢索到的檔案文本與引用來源，搭配模板化、可解釋的切片技術，讓答案有理有據而非模型自由發揮。

## 參考資料

- [RAGFlow 官方 GitHub](https://github.com/infiniflow/ragflow)
- 相關筆記：[Ollama 本地 LLM 服務建置](/post/ollama-local-llm-service)

## 延伸閱讀

- [RAGFlow 開源 RAG 引擎介紹：功能、架構與本機部署觀察](/post/ragflow-open-source-rag-engine)：同樣聚焦 RAGFlow、檢索增強生成，可接著比較不同情境的做法。
- [檢索增強生成（RAG）如何讓 LLM 回答更準確](/post/retrieval-augmented-generation)：同樣聚焦 檢索增強生成，可接著比較不同情境的做法。
- [Retrieval Interleaved Generation（RIG）是什麼？跟 RAG 有何不同](/post/retrieval-interleaved-generation-rig)：同樣聚焦 檢索增強生成，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2024-07-24，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};