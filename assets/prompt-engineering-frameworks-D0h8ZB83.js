var e=`---
title: 提示工程框架的概念：明確提問、In-Context Learning、CoT 與 ToT
description: 提示工程（Prompt Engineering）怎麼做？我整理了明確提問的六個要素，並比較 In-Context Learning、Chain-of-Thought（CoT）與 Tree-of-Thoughts（ToT）等提示框架，幫你寫出更穩定的 LLM 提示詞。
date: 2024-05-01
category: 生成式AI
tags: [提示工程, Prompt Engineering, LLM, Chain-of-Thought, Tree-of-Thoughts]
readingTime: 3 分鐘
image: /images/tech/hero_prompt-engineering-frameworks.webp
imageAlt: 提示工程框架概念示意圖：文字提示經過結構化框架轉換成語言模型輸出
---


# 提示工程框架的概念：明確提問、In-Context Learning、CoT 與 ToT

這篇文章整理我在使用大型語言模型（LLM）時常用到的提示工程（Prompt Engineering）框架概念：從「明確具體的提問」六個要素，到 In-Context Learning、Chain-of-Thought（CoT）與 Tree-of-Thoughts（ToT）三種推理框架。如果你正在想怎麼讓模型的輸出更穩定、更有邏輯，這份筆記可以直接當檢查清單用。

## 怎麼寫出明確具體的提問？

一個好的提示詞，通常會包含以下幾個要素：

- 請求模型採用一個人物角色
- 使用分隔符清楚地指示輸入的不同部分
- 指定完成任務所需的步驟
- 提供示例
- 指定輸出的期望長度

以下為一個範例，把角色、輸入資料、步驟與輸出長度都寫清楚：

![提示工程明確提問範例](/images/articles/prompt-engineering-frameworks-1.webp)

## 什麼是 In-Context Learning 和 Chain-of-Thought？

- **In-Context Learning（上下文學習）**：這是指模型在學習和處理文字時能夠考慮上下文資訊的能力。在上下文學習中，模型不僅僅關注單字或短語的訊息，而是根據前後文的內容來理解當前文本的含義。這種能力使得模型能夠更好地理解文本的語境，從而產生更準確和連貫的輸出。
- **Chain-of-Thought（思維鏈）**：這指的是模型在生成文本時能夠保持連貫性和邏輯性的能力。在思維鏈中，模型可以根據前面產生的內容來決定後續產生的內容，並保持文字的一致性和邏輯性。這種能力使得模型能夠產生更連貫和有意義的文字輸出。

![In-Context Learning 與 Chain-of-Thought 示意圖](/images/articles/prompt-engineering-frameworks-2.webp)

*圖片來源：[https://arxiv.org/pdf/2205.11916.pdf](https://arxiv.org/pdf/2205.11916.pdf)*

## Tree-of-Thoughts（思維樹）是什麼？

**思考樹（ToT）**是一種透過將複雜問題分解為更易於解決的小問題，為 LLM 推理提供了更結構化的提示框架。

與在鏈中推理的 CoT 不同，ToT 以樹的形式組織其解決問題的策略。每個節點都被稱為「思維」，是一個連貫的語言序列，是通往最終答案的一步。

透過將問題劃分為離散的「思想」單元——從填字遊戲中的一系列簡短單字到數學方程式的一個組成部分——ToT 確保問題的每個階段都得到系統的解決。

![Tree-of-Thoughts 框架示意圖](/images/articles/prompt-engineering-frameworks-3.webp)

*圖片來源：[https://arxiv.org/pdf/2305.10601.pdf](https://arxiv.org/pdf/2305.10601.pdf)*

## ToT 的實際效果比 CoT 好嗎？

在「oracle 模式」下，ToT 的表現比 CoT 還要好。從論文的實驗結果可以看到，當問題可以被系統性地拆解成多個思考步驟並探索不同分支時，ToT 這種樹狀的推理結構能明顯提升解題的正確率。

![ToT 與 CoT 效果比較實驗結果](/images/articles/prompt-engineering-frameworks-4.webp)

## 常見問題

### 提示工程一定要寫角色設定嗎？

不是必須，但指定人物角色能讓模型的語氣、專業度與回答方向更貼近需求。搭配分隔符與步驟說明，輸出會更穩定。

### Chain-of-Thought 和 Tree-of-Thoughts 差在哪裡？

CoT 讓模型沿著一條線性思路逐步推理；ToT 則把問題拆成多個「思維」節點，以樹狀結構探索並比較不同分支。對需要系統性拆解的複雜問題，ToT 的表現通常更好。

### 什麼是 In-Context Learning？需要重新訓練模型嗎？

In-Context Learning 是模型根據提示詞中的上下文（含示例）直接理解並完成任務的能力，完全不需要重新訓練或微調模型，只要在提示詞裡給足範例與說明即可。

### 提示詞要指定輸出長度嗎？

建議指定。明確說明期望的長度或格式（例如「用三句話總結」），可以避免模型輸出過長或過短，也讓結果更容易被後續流程使用。

## 參考資料

- Large Language Models are Zero-Shot Reasoners（CoT）：https://arxiv.org/pdf/2205.11916.pdf
- Tree of Thoughts: Deliberate Problem Solving with Large Language Models：https://arxiv.org/pdf/2305.10601.pdf

## 延伸閱讀

- [Prompt Engineering 提示工程：獲得更好 LLM 輸出的六大策略](/post/prompt-engineering-techniques)：同樣聚焦 Prompt Engineering、LLM，可接著比較不同情境的做法。
- [Prompt engineering 提示工程：獲得更好結果的六種策略](/post/prompt-engineering-six-strategies)：同樣聚焦 Prompt Engineering、LLM，可接著比較不同情境的做法。
- [LangChain 基礎鏈介紹：LLMChain、SequentialChain 與 TransformChain 入門](/post/langchain-chains-introduction)：同樣聚焦 LLM、提示工程，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2024-05-01，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};