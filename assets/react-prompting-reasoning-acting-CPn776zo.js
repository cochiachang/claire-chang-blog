var e=`---
title: ReAct Prompting 是什麼？Reasoning/Acting 如何讓 LLM 邊推理邊行動
description: 說明 ReAct Prompting 如何結合 Reasoning/Acting、運作流程、實際範例與適合應用，補充與 AI Agent、RAG 的關係。
date: 2024-11-11
category: 生成式AI
tags: [ReAct Prompting, LLM, Reasoning, Acting, AI Agent, Prompt Engineering]
readingTime: 7 分鐘
image: /images/tech/hero_llm-function-calling.webp
imageAlt: 螢幕上顯示程式碼，象徵 LLM 透過工具呼叫完成推理與行動
---


# ReAct Prompting 是什麼？Reasoning/Acting 如何讓 LLM 邊推理邊行動

ReAct Prompting 是一種讓大型語言模型交錯產生推理軌跡與任務行動的提示方法。我的理解是：ReAct Prompting 把「先想清楚下一步」和「真的去查資料或呼叫工具」放進同一個循環，讓模型在多步問題、工具使用與 AI Agent 任務中比較不容易只靠猜測回答。

## ReAct Prompting 是什麼？

ReAct Prompting 結合 Reasoning 與 Acting，讓 LLM 在回答前先拆解問題，再依需要執行搜尋、查詢或工具呼叫。ReAct Prompting 適合需要多步推理與外部資訊的任務。

ReAct 來自論文〈ReAct: Synergizing Reasoning and Acting in Language Models〉。作者 Shunyu Yao 等人在 2022 年提出這個框架，主張大型語言模型可以交錯產生 reasoning traces 與 task-specific actions，而不是把推理和行動分成兩件事處理（Yao et al.，2022）。

我會把 ReAct Prompting 看成 AI Agent 的底層工作節奏：先判斷目前知道什麼，再決定下一步要做什麼，取得觀察結果後重新推理。這個節奏比單純要求模型「一步一步思考」更貼近真實任務，因為真實任務常常需要查資料、比對結果、修正方向。

## Reasoning/Acting 各自扮演什麼角色？

Reasoning 負責拆解問題、規劃下一步與更新判斷；Acting 負責取得外部資訊或執行工具。Reasoning/Acting 交錯後，模型才能用新觀察修正後續回答。

| 元件 | 在 ReAct Prompting 中的角色 | 常見輸出 |
|---|---|---|
| Reasoning | 分析問題、建立計畫、判斷缺少哪些資訊 | Thought、推理步驟、下一步策略 |
| Acting | 查詢外部來源、呼叫工具、執行子任務 | Search、Lookup、API call、工具結果 |
| Observation | 接收行動後得到的新資訊 | 搜尋片段、資料庫結果、工具回傳值 |
| Final Answer | 彙整推理與觀察後回答問題 | 最終答案或任務結果 |

Reasoning 不是為了讓模型暴露所有內部想法，而是讓提示結構中保留「為什麼下一步要這樣做」的可檢查軌跡。Acting 也不是讓模型任意操作外部世界，而是由系統提供受控工具，例如搜尋、資料庫查詢、文件檢索或 API 呼叫。

## ReAct Prompting 的運作流程是什麼？

ReAct Prompting 通常依照 Thought、Action、Observation 循環執行。模型先提出下一步推理，再採取一個行動，最後根據觀察結果更新方向，直到得到足夠答案。

一個典型流程可以拆成五步：

1. **問題理解與初步推理**：模型先判斷問題在問什麼，並拆出需要確認的資訊。
2. **選擇行動**：模型決定要搜尋、查資料庫、查文件，或呼叫某個工具。
3. **取得觀察結果**：外部系統回傳搜尋結果、查詢結果或工具執行結果。
4. **更新推理**：模型依照新資訊調整方向，必要時再執行下一輪行動。
5. **產生最終回答**：模型把多輪推理與觀察整理成可讀答案。

ReAct 論文指出，這種做法讓 reasoning traces 可以協助模型追蹤與更新行動計畫，而 actions 則讓模型連接知識庫或環境取得額外資訊（Yao et al.，2022）。我覺得這句話是 ReAct 的核心：推理讓行動有方向，行動讓推理不只停在模型記憶。

## ReAct Prompting 有哪些優勢？

ReAct Prompting 的優勢是讓模型在多步任務中能查證、修正與解釋行動路徑。相較於只產生答案，ReAct Prompting 更適合需要逐步取得資訊的問題。

ReAct Prompting 最常被拿來解決三種痛點。

- **增強多步推理能力**：多跳問答、邏輯推理與需要中間結論的題目，通常不能靠一次回答完成。
- **降低憑空回答的風險**：模型可以透過搜尋或檢索補充資訊，不必只靠訓練資料記憶。
- **提高任務處理彈性**：模型可以依照觀察結果改變下一步，而不是照固定腳本走到底。

Prompt Engineering Guide 對 ReAct 的整理也提到，ReAct 能讓大型語言模型和外部工具互動，以取得更可靠、較符合事實的回應；在知識密集型任務與決策任務上，ReAct 也被用來改善可解釋性與信任感（Prompt Engineering Guide，2026-08 存取）。

## ReAct Prompting 適合哪些應用場景？

ReAct Prompting 適合複雜問答、數學或邏輯推理、資料檢索、工具呼叫與 AI Agent 任務。只要答案需要邊查邊修正，ReAct Prompting 就值得考慮。

我會優先在這幾種情境想到 ReAct Prompting：

- **複雜問答**：例如多跳查詢，需要先找第一個答案，再用第一個答案查第二層資訊。
- **數學與邏輯題**：模型可以把中間步驟拆開，必要時呼叫計算工具確認結果。
- **企業知識庫問答**：模型可以先檢索文件，再根據引用內容回答。
- **AI Agent 工作流程**：模型需要判斷下一步、呼叫工具、讀取結果，最後完成任務。
- **資料驗證任務**：模型可以查多個來源，再把矛盾或缺漏整理出來。

不過 ReAct Prompting 不是每個任務都需要。若問題很單純，例如改寫一句文案或翻譯一段短文，ReAct 的 Thought/Action/Observation 結構反而會增加不必要的成本。

## ReAct Prompting 的實際範例長什麼樣？

ReAct Prompting 範例可以用「查詢光速概念歷史」來理解。模型先判斷缺少歷史背景，再查找人物與研究貢獻，最後整合成回答。

假設問題是：「找出哪位科學家首次提出光速的概念，並描述他的研究貢獻。」

\`\`\`text
Question: 找出哪位科學家首次提出光速的概念，並描述他的研究貢獻。

Thought 1: 我需要先確認光速概念的歷史背景，找出早期研究光速的科學家。
Action 1: Search[光速 概念 歷史 早期 科學家]
Observation 1: 查詢結果提到伽利略、羅默、惠更斯等人都與光速研究有關。

Thought 2: 問題問的是首次提出或量測光速概念，我需要比較這些人的貢獻差異。
Action 2: Lookup[Ole Rømer speed of light measurement]
Observation 2: 查詢結果指出 Ole Rømer 於 1676 年根據木星衛星觀測提出光速有限的證據。

Thought 3: 我已找到關鍵人物，還需要補充研究貢獻，避免只回答人名。
Action 3: Lookup[Ole Rømer contribution speed of light]
Observation 3: Rømer 透過木衛一食的時間差推論光傳播需要時間，建立光速有限的觀測證據。

Final Answer: Ole Rømer 通常被視為最早提出光速有限觀測證據的科學家之一。他在 1676 年觀察木衛一食的時間差，推論光從木星附近傳到地球需要時間，讓「光不是瞬間傳播」成為可被觀測支持的科學問題。
\`\`\`

這個範例的重點不是答案本身，而是路徑。ReAct Prompting 讓模型在每一步說明「目前缺什麼」、「下一步查什麼」、「查到後如何修正判斷」。用在 AI Agent 時，這種路徑也方便開發者檢查工具是否被錯用。

## ReAct Prompting 和 Chain-of-Thought、RAG 有什麼差別？

ReAct Prompting 不只要求模型推理，也要求模型在推理中採取行動。Chain-of-Thought 偏向內部推理；RAG 偏向先檢索再回答；ReAct 則把推理與工具使用交錯起來。

| 方法 | 核心做法 | 適合情境 | 主要限制 |
|---|---|---|---|
| Chain-of-Thought | 讓模型用步驟拆解問題 | 數學、邏輯、常識推理 | 缺少外部資訊時仍可能猜測 |
| RAG | 先檢索相關文件，再交給模型回答 | 文件問答、知識庫、引用回答 | 檢索方向通常在生成前決定 |
| ReAct Prompting | 推理、行動、觀察交錯循環 | 多跳問答、工具使用、AI Agent | 需要設計工具邊界與觀察格式 |

我的做法是：如果任務只需要把已有文件找出來回答，先用 RAG；如果任務需要根據第一輪結果決定第二輪查什麼，就考慮 ReAct；如果任務還要改資料、送通知或執行流程，就要把 ReAct 放進更嚴格的 AI Agent 權限設計裡。

## 實作 ReAct Prompting 時要注意什麼？

ReAct Prompting 的關鍵不是把提示詞寫得很長，而是定義清楚工具、觀察格式、停止條件與錯誤處理。工具權限越大，越需要人工確認與記錄。

我會用這份檢查表看一個 ReAct Prompting 設計能不能進入測試：

- **工具是否明確**：每個 Action 能做什麼、不能做什麼，都要寫清楚。
- **觀察是否可用**：Observation 要回傳模型能判斷的摘要、狀態或結構化資料。
- **停止條件是否存在**：模型要知道什麼時候回答、什麼時候放棄、什麼時候請人確認。
- **錯誤是否能處理**：查不到資料、工具失敗、資料互相矛盾時，要有固定處理方式。
- **權限是否最小化**：讀取、寫入、刪除、對外發送等動作不應放在同一層權限。

ReAct Prompting 很適合拿來設計「可觀察的 Agent 流程」。但只要 Action 會影響真實系統，例如下單、刪資料、寄信或更新 ERP，我就不會只靠提示詞保護流程；權限、審核和紀錄都要在系統層處理。

## 常見問題

### ReAct Prompting 是提示詞技巧還是 Agent 架構？
ReAct Prompting 原本是提示方法，但很適合放進 AI Agent 架構裡。提示詞負責讓模型交錯推理與行動，系統架構則負責提供工具、權限、觀察結果與執行紀錄。

### ReAct Prompting 和 Chain-of-Thought 有什麼差別？
Chain-of-Thought 主要讓模型拆解推理步驟。ReAct Prompting 會在推理中加入 Action 與 Observation，讓模型能查資料或呼叫工具，再用新資訊更新後續推理。

### ReAct Prompting 一定可以降低幻覺嗎？
ReAct Prompting 可以降低部分幻覺風險，但不能保證完全正確。若工具查到的資料品質差、檢索結果不相關，或模型誤解觀察結果，最後答案仍可能出錯。

### ReAct Prompting 適合搭配 RAG 嗎？
ReAct Prompting 適合搭配 RAG。RAG 可以提供文件檢索能力，ReAct Prompting 則讓模型決定何時檢索、下一輪要查什麼，以及如何根據檢索結果修正回答。

### ReAct Prompting 需要讓使用者看到所有 Thought 嗎？
實務上不一定需要把完整 Thought 顯示給使用者。比較好的做法是保留可稽核的執行摘要，例如模型採取了哪些 Action、查到哪些 Observation、為什麼需要人工確認。

### 什麼任務不適合用 ReAct Prompting？
短文改寫、單步翻譯、固定格式整理等簡單任務通常不需要 ReAct Prompting。ReAct Prompting 比較適合需要多輪查找、工具呼叫、路徑修正或任務執行的問題。

## 參考資料

- Yao, Shunyu et al., ReAct: Synergizing Reasoning and Acting in Language Models, arXiv:2210.03629, https://arxiv.org/abs/2210.03629，初版提交：2022-10-06，v3 更新：2023-03-10，存取日期：2026-08-28。
- Prompt Engineering Guide, ReAct Prompting, https://www.promptingguide.ai/techniques/react，存取日期：2026-08-28。

最後更新：2026-08-28

## 延伸閱讀

- [Prompt Engineering 提示工程：獲得更好 LLM 輸出的六大策略](/post/prompt-engineering-techniques)：同樣聚焦 Prompt Engineering、LLM，可接著比較不同情境的做法。
- [Prompt engineering 提示工程：獲得更好結果的六種策略](/post/prompt-engineering-six-strategies)：同樣聚焦 Prompt Engineering、LLM，可接著比較不同情境的做法。
- [提示工程框架的概念：明確提問、In-Context Learning、CoT 與 ToT](/post/prompt-engineering-frameworks)：同樣聚焦 Prompt Engineering、LLM，可接著比較不同情境的做法。
`;export{e as default};