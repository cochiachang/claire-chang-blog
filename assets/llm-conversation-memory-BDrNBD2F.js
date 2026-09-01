var e=`---
title: 讓 LLM 記憶對話的實現方式
description: 比較 LangChain 常見對話記憶模式，說明 Buffer、Summary、Window、Entity Memory 適合的場景。
date: 2024-11-11
category: 生成式AI
tags: [LLM, LangChain, 對話記憶, Chatbot]
readingTime: 9 分鐘
image: /images/tech/ab6cd8ea8067fecb668cd6a017eff60f7a320d8b-3079x1427-1-scaled-1.webp
imageAlt: ConversationBufferWindowMemory token 使用量比較圖
---


# 讓 LLM 記憶對話的實現方式

LLM 要能進行連貫對話，通常需要在 prompt 外另外設計「對話記憶」。以 LangChain 的常見記憶類型來看，短對話可以直接保留歷史訊息，長對話則需要摘要、視窗或實體記憶，才能在 token 成本、回答品質與上下文穩定度之間取得平衡。

## LLM 對話記憶要解決什麼問題？

LLM 對話記憶的核心任務，是把使用者前面提供過的資訊帶入下一次回答。對聊天機器人來說，對話記憶能避免模型每輪都像第一次見到使用者。

如果沒有對話記憶，LLM 只會根據當下輸入與系統提示回答。實作聊天機器人、客服助理、任務型 Agent 時，使用者常會用「剛剛那個」「改成另一種」等方式延續上下文，因此系統必須決定哪些過去訊息要留下。

對話記憶常見的取捨有三個：

| 取捨項目 | 說明 |
|---|---|
| token 成本 | 保留越多原始對話，prompt 越長，費用與延遲越高。 |
| 記憶完整度 | 摘要越濃縮，越可能遺失細節或保留錯誤重點。 |
| 話題穩定度 | 過多舊話題可能干擾新問題，使回答偏離使用者最新意圖。 |

## ConversationBufferMemory 適合什麼情境？

ConversationBufferMemory 適合短對話與測試階段，因為 ConversationBufferMemory 會傳送完整歷史訊息。ConversationBufferMemory 的缺點是對話一長就會快速消耗 token。

ConversationBufferMemory 是最直覺的做法：把所有過去對話都放進下一次 prompt。這種方式不需要摘要、不需要判斷哪一句重要，也最容易 debug。

不過 ConversationBufferMemory 很快會遇到模型上下文長度限制。當使用者來回對話增加，系統會把越來越多無關內容送給 LLM，導致成本上升、延遲變長，也可能讓新問題被舊內容干擾。

## ConversationSummaryMemory 有什麼風險？

ConversationSummaryMemory 適合長對話摘要，但 ConversationSummaryMemory 會額外呼叫 LLM 產生摘要。摘要品質如果不穩，模型可能記住不該記的資訊。

ConversationSummaryMemory 的做法是把歷史對話壓縮成摘要，再把摘要放回下一輪 prompt。這種方式能處理更長的對話，特別適合使用者長時間累積背景資訊的場景。

我實測這種方式時，最常遇到的問題是摘要不一定保留我想保留的重點。有時候 LLM 會把已經切換掉的舊話題放進摘要，反而讓新回應偏離最新問題。使用 ConversationSummaryMemory 時，摘要提示詞與摘要更新時機會直接影響結果。

## ConversationBufferWindowMemory 為什麼常是實用選擇？

ConversationBufferWindowMemory 只保留最近固定輪數的對話，因此 token 使用量容易控制。ConversationBufferWindowMemory 適合只需要近期上下文、不需要長期記憶的聊天情境。

ConversationBufferWindowMemory 會設定一個視窗大小，例如只保留最近 6 輪或 12 輪對話。對於大部分任務型聊天機器人，使用者的最新需求通常比很久以前的內容更重要。

我在實作對話記憶時，覺得 ConversationBufferWindowMemory 是簡單又效果不錯的方法。這種方式不會嘗試理解所有歷史內容，因此可控性高；缺點是無法回答很久之前提到的細節。

![ConversationBufferWindowMemory token 使用量比較](/images/tech/ab6cd8ea8067fecb668cd6a017eff60f7a320d8b-3079x1427-1-scaled-1.webp)

## ConversationSummaryBufferMemory 如何結合摘要與近期對話？

ConversationSummaryBufferMemory 會摘要較早的互動，並完整保留最新對話。ConversationSummaryBufferMemory 適合同時需要長期背景與近期細節的應用。

ConversationSummaryBufferMemory 結合了摘要與緩衝視窗。系統會把較早的互動壓成摘要，再用原始形式保留最近的對話，讓模型既能知道遠期背景，又能看到最新訊息的完整語氣與細節。

這種方法比單純摘要更有彈性，也是常見記憶模式中比較能兼顧「遙遠互動」與「近期原文」的方式。不過它仍需要調整：哪些內容要摘要、摘要多長、近期視窗多大，都會影響品質。

![ConversationSummaryBufferMemory token 使用量比較](/images/tech/839a4c11b780250f5ae3adeb1d7873c7002ae21b-3627x1427-1-scaled-1.webp)

## Entity Memory 和 Knowledge Graph Memory 解決什麼問題？

Entity Memory 與 Knowledge Graph Memory 用來記住對話中的人物、組織、地點與關係。Entity Memory 適合需要追蹤特定實體資訊的長期互動。

ConversationEntityMemory 會使用 LLM 從對話中抽取實體，並逐步建立實體知識。例如使用者提到 Abi、Andy、Lucas、Harpreet 正在建立 LLMOps 社群，Entity Memory 會把這些人名與社群關係記錄下來。

當後續對話補充「Abi 住在 India」「Andy 住在 Scotland」「Lucas 在 Microsoft 工作」時，記憶內容會持續更新。之後使用者問「What do you know about Abi?」，系統就能根據實體記憶回答 Abi 的角色、工作與地點。

這種方式的價值在於讓模型了解特定實體與相關資訊，但風險也很明顯：如果抽取錯誤、保留不當描述，錯誤資訊會被長期帶入後續回答。

## 對話記憶該怎麼選？

對話記憶選型應先看對話長度、成本限制與是否需要長期實體資訊。多數產品可以先用 ConversationBufferWindowMemory，再視需求加入摘要或實體記憶。

| 需求 | 建議記憶模式 | 原因 |
|---|---|---|
| 短對話或原型測試 | ConversationBufferMemory | 實作簡單，方便觀察完整上下文。 |
| 長對話但只要大意 | ConversationSummaryMemory | 可壓縮歷史內容，但要注意摘要品質。 |
| 只需要近期上下文 | ConversationBufferWindowMemory | token 可控，行為穩定。 |
| 同時要長期背景與近期細節 | ConversationSummaryBufferMemory | 摘要舊內容，保留新內容原文。 |
| 需要追蹤人物、地點、組織 | ConversationEntityMemory | 可保存對話中的關鍵實體與關係。 |

我的實作建議是先不要追求最複雜的記憶架構。先用近期視窗驗證產品流程，再針對真正需要長期記憶的欄位加入摘要或實體資料庫，通常比一開始就把所有對話都丟進記憶系統更容易維護。

## 常見問題
### LLM 一定需要對話記憶嗎？

LLM 不一定需要對話記憶。單輪問答、分類、摘要等任務通常不需要保存歷史；聊天機器人、客服助理、個人助理與多輪任務流程才需要對話記憶。

### ConversationBufferMemory 最大的問題是什麼？

ConversationBufferMemory 最大的問題是 token 成本會隨對話長度增加。當歷史訊息越來越長，模型延遲、費用與上下文限制都會變成實務瓶頸。

### ConversationSummaryMemory 為什麼可能讓回答偏掉？

ConversationSummaryMemory 依賴 LLM 產生摘要。摘要如果保留了無關舊話題，或漏掉使用者真正想延續的細節，後續回答就可能被錯誤上下文帶偏。

### ConversationBufferWindowMemory 的 k 要設多少？

ConversationBufferWindowMemory 的 k 應該依任務調整。客服與工具操作通常可以從 4 到 8 輪開始測試；需要追蹤較長推理鏈的任務可提高視窗，但要同步觀察 token 成本。

### Entity Memory 適合所有聊天機器人嗎？

Entity Memory 不適合所有聊天機器人。只有當產品需要長期記住人物、公司、專案、地點或偏好時，Entity Memory 才值得加入。

## 參考資料
- Pinecone, LangChain Conversational Memory, https://www.pinecone.io/learn/series/langchain/langchain-conversational-memory/，存取日期：2026-08-27。
- Comet, Advanced Memory in LangChain, https://www.comet.com/site/blog/advanced-memory-in-langchain/，存取日期：2026-08-27。

## 延伸閱讀

- [LangChain 基礎鏈介紹：LLMChain、SequentialChain 與 TransformChain 入門](/post/langchain-chains-introduction)：同樣聚焦 LangChain、LLM，可接著比較不同情境的做法。
- [LangChain 基礎鏈介紹：LLMChain、SequentialChain 與 TransformChain 怎麼用？](/post/langchain-chains-introduction)：同樣聚焦 LangChain、LLM，可接著比較不同情境的做法。
- [了解 LLM 的函數調用 Function Calling](/post/llm-function-calling-guide)：同樣聚焦 LLM，可接著比較不同情境的做法。

## 最後更新

Mon Nov 11 2024 08:00:00 GMT+0800 (Taiwan Standard Time)
`;export{e as default};