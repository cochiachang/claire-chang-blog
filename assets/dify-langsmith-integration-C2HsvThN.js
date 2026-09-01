var e=`---
title: 在 Dify 內整合 LangSmith
description: 在 Dify 內整合 LangSmith 與 Langfuse，為 LLM 應用加上完整的可觀察性。本文說明 LangSmith 的追蹤、監控、評估等主要功能，以及如何在 Dify 概覽頁一鍵配置串接，自動把使用數據傳輸到平台進行性能與成本分析。
date: 2024-11-11
category: 生成式AI
tags: [Dify, LangSmith, Langfuse, LLM, 可觀察性]
readingTime: 3 分鐘
image: /images/tech/hero_dify-langsmith-integration.webp
imageAlt: 在 Dify 內整合 LangSmith 進行 LLM 應用追蹤與監控的示意圖
---


# 在 Dify 內整合 LangSmith

在 Dify 上開發 LLM 應用時，如何追蹤每一次呼叫的輸入輸出、監控性能與成本，是持續優化的關鍵。這篇文章記錄我如何在 Dify 內整合 LangSmith 與 Langfuse 這兩款可觀察性工具，讓模型選擇、提示設計、性能監控與成本優化變得更簡單。

## 為什麼 Dify 需要可觀察性工具？

Dify 現在支持使用 LangSmith 和 Langfuse 這兩款工具來詳細追蹤和分析 LLM 應用的數據。這些工具使得選擇合適的模型、創建有效的提示、監控應用性能、持續改進應用以及成本優化變得更加容易。

參考文章：[Dify integrates LangSmith & Langfuse](https://dify.ai/blog/dify-integrates-langsmith-langfuse)

## LangSmith 是什麼？

官方網站：[https://www.langchain.com/langsmith](https://www.langchain.com/langsmith)

LangSmith 的主要目的是提升 LLM 應用的可觀察性和性能，適合需要深入監控和評估模型表現的開發者。LangSmith 是由 LangChain 開發的一款工具，專門用於協助開發者在生產環境中更有效地管理和監控大型語言模型 (LLM) 應用程式。它提供了一套完整的工具，涵蓋了從模型開發、測試到部署的整個生命週期。

![LangSmith 的 trace 介面，可檢視 retriever 等執行步驟](/images/articles/dify-langsmith-integration-1.webp)

## LangSmith 的主要功能有哪些？

| 功能 | 說明 |
| --- | --- |
| 追蹤 (Tracing) | 詳細記錄 LLM 應用程式在執行過程中的每個步驟，包括輸入、輸出、模型參數等，方便開發者回溯問題、分析模型行為。 |
| 監控 (Monitoring) | 實時監控 LLM 應用程式的性能指標，如回應時間、錯誤率等，及早發現異常，確保系統穩定運行。 |
| 部署 (Deployment) | 提供簡便的部署方式，將 LLM 應用程式快速部署到生產環境，支持雲端、本地等多種部署方式。 |
| 提示工程 (Prompt Engineering) | 提供管理和優化提示的工具，幫助開發者撰寫更有效、更精準的提示。 |
| 評估 (Evaluation) | 提供多種評估方式，評估模型的性能，幫助開發者優化模型。 |

## 如何與 Dify 串接 LangSmith？

在 Dify 中使用 LangSmith 和 Langfuse 非常簡單。在創建應用程序後，可以在概覽頁面上透過一鍵配置啟用這些工具。

![Dify 應用概覽頁面上的一鍵配置入口](/images/articles/dify-langsmith-integration-2.webp)

一旦配置完成，在 Dify 創建的應用程序中的使用數據將自動傳輸到這些平台。在 LangSmith 和 Langfuse 的項目管理界面中，可以查看詳細的性能指標、成本數據和使用信息，以優化 Dify 上的應用程序。

## 常見問題

### Dify 可以串接哪些可觀察性工具？

Dify 目前支持 LangSmith 和 Langfuse 兩款工具。在創建應用程序後，於概覽頁面透過一鍵配置即可啟用，不需要修改程式碼。

### LangSmith 的主要功能是什麼？

LangSmith 提供追蹤、監控、部署、提示工程與評估五大功能。它能詳細記錄 LLM 應用執行過程中的每個步驟，並實時監控性能指標，涵蓋模型從開發、測試到部署的整個生命週期。

### 整合 LangSmith 後資料會怎麼傳輸？

配置完成後，Dify 應用程序的使用數據會自動傳輸到 LangSmith 或 Langfuse 平台。在平台的項目管理界面中，可以查看性能指標、成本數據和使用信息。

### 為什麼 LLM 應用需要可觀察性？

LLM 應用的輸出品質受模型、提示與檢索內容多重影響，沒有追蹤就很難回溯問題。可觀察性工具讓你能分析每次呼叫的輸入輸出、監控回應時間與錯誤率，並根據成本數據持續優化應用。

## 參考資料

- [Dify integrates LangSmith & Langfuse](https://dify.ai/blog/dify-integrates-langsmith-langfuse)
- [LangSmith 官方網站](https://www.langchain.com/langsmith)

## 延伸閱讀

- [Dify 開源大語言模型應用開發平台完整介紹](/post/dify-open-source-llm-app-platform)：同樣聚焦 Dify，可接著比較不同情境的做法。
- [使用 Dify 開發 Agent 聊天機器人：工具串接、OpenAPI YAML 與實作觀察](/post/dify-agent-chatbot-development)：同樣聚焦 Dify，可接著比較不同情境的做法。
- [LLM 繁體中文能力比較：用台灣社福申請情境測試模型](/post/llm-traditional-chinese-comparison)：同樣聚焦 LLM、Dify，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2024-11-11，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};