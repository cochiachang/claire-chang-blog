var e=`---
title: LangChain 基礎鏈介紹：LLMChain、SequentialChain 與 TransformChain 怎麼用？
description: LangChain 是用大型語言模型（LLM）打造應用程式的框架，基礎鏈（Chains）是它的模組化構建塊。本文整理 LangChain 的核心概念，比較 LLMChain 單鏈、SequentialChain 循序鏈與 TransformChain 轉換鏈的用途、運作方式與實際應用場景，並附官方文件與教學資源連結。
date: 2024-05-06
category: 生成式AI
tags: [LangChain, LLM, Chains, 生成式AI, Python]
readingTime: 5 分鐘
image: /images/tech/hero_langchain-chains-introduction.webp
imageAlt: 以鏈環連接象徵 LangChain 基礎鏈把 LLM 模組串接成應用程式的概念圖
---


# LangChain 基礎鏈介紹：LLMChain、SequentialChain 與 TransformChain 怎麼用？

LangChain 是根據大型語言模型（LLM）打造應用程式的框架，而基礎鏈（Chains）就是它的模組化構建塊：把一系列組件以特定方式組合起來，在應用程式中執行特定任務。這篇文章整理我在學 LangChain 時記錄的基礎鏈概念，涵蓋 LLMChain、SequentialChain 與 TransformChain 三種常用鏈的運作方式與應用場景。

## 甚麼是 LangChain？

LangChain 是**根據大型語言模型（LLM）打造應用程式**的框架。它使用基礎鏈來建立由 LLM 支援的應用程式，這些基本鏈是模組化構建塊，用於在應用程式中執行特定任務。

LangChain 是用於開發由語言模型驅動的應用程式的框架，主要有兩個核心能力：

- **具有上下文採集能力**：將語言模型連接到上下文來源（提示指令、少量的範例、需要回應的內容等）
- **具有推理能力**：依賴語言模型進行推理（根據提供的上下文如何回答、採取什麼行動等）

## 學 LangChain 有哪些教學資源？

我當時主要參考這幾份文件與課程筆記：

- LangChain 中文文档 v0.1.7: [https://python.langchain.com.cn/docs/](https://python.langchain.com.cn/docs/)
- LangChain中文網 Concepts: [https://docs.langchain.com.cn/docs/](https://docs.langchain.com.cn/docs/)
- **[LangChain for LLM Application Development] 課程筆記**: [https://hackmd.io/@YungHuiHsu/SJJvZ-ya2](https://hackmd.io/@YungHuiHsu/SJJvZ-ya2?utm_source=preview-mode&utm_medium=rec)

## 甚麼是鏈（Chains）結構？

鏈（Chains）是一個非常通用的概念，它指的是**將一系列模組化組件（或其他鏈）以特定方式組合起來，以實現共同的用例**。下面依序整理三種常見的基礎鏈。

### LLMChain（單鏈）

類別說明: [LLMChain API 文件](https://api.python.langchain.com/en/latest/chains/langchain.chains.llm.LLMChain.html)

LLMChain 是最常用的鏈類型，它結合了 PromptTemplate（input）、Model（LLM）和 Guardrails（output）來接收用戶輸入，進行相應的格式化，將其傳遞給模型並獲取回應，然後驗證和修正（如果需要）模型的輸出。

![LLMChain 單鏈結構示意：PromptTemplate、Model 與 Guardrails 的組合](/images/articles/langchain-chains-introduction-1.webp)

### SequentialChain（循序鏈）

類別說明: [SequentialChain API 文件](https://api.python.langchain.com/en/latest/chains/langchain.chains.sequential.SequentialChain.html)

同一次的詢問，至少兩次與 LLM 交互，把複雜的問題拆解成小的問題，然後再輸出回應。這邊有一篇說明文章：[CSDN：LangChain SequentialChain](https://blog.csdn.net/wangjiansui/article/details/137509565)。

總之就是讓**輸入到輸出之間串聯多個 LLM 系統並依序執行**。

以下是如何使用 SequentialChain 的一些範例：

- **機器翻譯**：可用於透過使用專門針對不同語言對的 LLM 呼叫鏈，將文字從一種語言翻譯為另一種語言。
- **文字摘要**：可用於透過一系列 LLM 呼叫來摘要文本，這些呼叫從文本中提取關鍵訊息，然後產生摘要。
- **Q&A**：可用於透過一系列 LLM 調用來回答問題，這些調用從文本文檔中提取信息，然後生成問題的答案。

### TransformChain（轉換鏈）

類別說明: [TransformChain API 文件](https://api.python.langchain.com/en/latest/chains/langchain.chains.transform.TransformChain.html)

TransformChain 的轉換可以是簡單的文字操作（例如文字清理），或更複雜的模型。它的工作原理分三步：

1. **輸入**：接收 LLM 的輸出作為輸入，可以是文字、程式碼或任何其他資料格式。
2. **轉換**：對輸入資料套用一系列轉換，這些轉換由使用者提供的函數或預先定義的 LangChain 轉換定義。
3. **輸出**：最終輸出是將所有轉換應用於輸入資料的結果，可以用作另一個鏈的輸入，或作為應用程式的最終輸出。

以下是如何使用 TransformChain 的一些範例：

- **文字清理**：透過刪除標點符號、將文字轉換為小寫以及刪除停用詞來清理文字。
- **特徵提取**：從文本中提取特徵，例如詞頻或情緒分數。
- **數據標準化**：標準化數據，例如縮放數值數據或將分類數據轉換為數值表示。

## 常見問題

### LangChain 的鏈（Chains）是什麼？

鏈是 LangChain 的模組化構建塊，指將一系列組件（或其他鏈）以特定方式組合起來，實現共同的用例。開發者可以像堆積木一樣，把提示模板、LLM、輸出驗證等組件串成一條處理流程。

### LLMChain 和 SequentialChain 有什麼差別？

LLMChain 是最基本的單鏈，一次使用者輸入對應一次 LLM 呼叫，負責格式化提示、呼叫模型並驗證輸出。SequentialChain 則在同一次詢問中至少與 LLM 交互兩次，把複雜問題拆解成多個小問題，依序串聯多個 LLM 系統後才輸出結果。

### TransformChain 通常用在什麼場景？

TransformChain 適合在鏈與鏈之間做資料加工，例如文字清理（刪標點、轉小寫、去停用詞）、特徵提取（詞頻、情緒分數）或數據標準化。它的轉換由使用者自訂函數或 LangChain 預先定義的轉換來執行。

### LangChain 適合開發什麼樣的應用程式？

LangChain 適合開發由大型語言模型驅動的應用程式，例如問答系統、文字摘要、機器翻譯與 Agent 應用。它的核心能力是把上下文來源接入語言模型，並依賴模型進行推理，決定如何回答或採取什麼行動。

## 參考資料
- [LangChain 中文文档 v0.1.7](https://python.langchain.com.cn/docs/)
- [LangChain中文網 Concepts](https://docs.langchain.com.cn/docs/)
- [LLMChain API 文件](https://api.python.langchain.com/en/latest/chains/langchain.chains.llm.LLMChain.html)
- [SequentialChain API 文件](https://api.python.langchain.com/en/latest/chains/langchain.chains.sequential.SequentialChain.html)
- [TransformChain API 文件](https://api.python.langchain.com/en/latest/chains/langchain.chains.transform.TransformChain.html)
- [LangChain for LLM Application Development 課程筆記](https://hackmd.io/@YungHuiHsu/SJJvZ-ya2?utm_source=preview-mode&utm_medium=rec)

## 延伸閱讀

- [LangChain 基礎鏈介紹：LLMChain、SequentialChain 與 TransformChain 入門](/post/langchain-chains-introduction)：同樣聚焦 LangChain、LLM，可接著比較不同情境的做法。
- [讓 LLM 記憶對話的實現方式](/post/llm-conversation-memory)：同樣聚焦 LLM、LangChain，可接著比較不同情境的做法。
- [Ollama 本地端運行 LLM 服務教學](/post/ollama-local-llm-service)：同樣聚焦 LLM，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2024-05-06，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};