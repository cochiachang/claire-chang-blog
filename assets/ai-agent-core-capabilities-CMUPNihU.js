var e=`---
title: 企業導入前必懂的 MCP、Skills、Automation
description: 用數位新進員工的比喻，認識 AI Agent 的三個核心能力：Connector／MCP、Skills 與 Scheduled Tasks／Automation，並了解企業導入前應準備的資料、工作方法與權限邊界。
date: 2026-08-24
category: AI策略
tags: [AI Agent, MCP, Automation]
readingTime: 10 分鐘
image: /images/articles/hero_ai-agent-core-capabilities.webp
imageAlt: 企業 AI 團隊講者正在簡報前向同仁解說 AI Agent 核心能力與流程架構
---


# 企業導入前必懂的 MCP、Skills、Automation

AI Agent（AI 代理）不只回答問題，還能依目標規劃步驟、取得資料、使用工具、執行任務並回報結果。

企業若想讓 AI Agent 真正進入工作流程，至少要理解三個核心能力：Connector／Model Context Protocol（MCP）負責連接資料與工具，Agent Skills 負責提供工作方法，Scheduled Tasks／Automation 負責定時啟動與主動回報。

企業可以把 AI Agent 想成一位數位新進員工。新進員工即使頭腦很好，沒有帳號與資料就無法工作；只有系統權限、沒有 SOP 與判斷方法，也不知道怎麼把事情做好；如果沒有人交辦時間與回報規則，更不會主動在正確時間完成任務。

## AI Agent 是什麼？和一般生成式 AI 有何不同？

> **AI Agent 是能依目標規劃步驟、呼叫工具並採取行動的 AI 系統。**
 
一般生成式 AI 主要產生答案，AI Agent 則著重完成任務。

| 比較項目 | 一般生成式 AI | AI Agent |
| --- | --- | --- |
| 主要目的 | 回答、摘要或產生內容 | 完成一項多步驟任務 |
| 互動方式 | 通常由人逐次下指令 | 可依目標規劃下一步 |
| 外部操作 | 可能只使用對話中的資料 | 可呼叫工具、查詢系統或執行動作 |
| 企業管理 | 管理輸入資料與輸出內容 | 還要管理權限、動作、停止條件與稽核紀錄 |

SAP 將 AI Agent 說明為可在較少人工監督下制定決策並執行工作的 AI 應用，並指出 AI Agent 能使用軟體工具完成計畫（SAP，2025 年 11 月）。企業應注意，「能自主執行」不等於「完全不用人管」；真正的導入工作，是決定 AI Agent 可以自主到哪一步，以及哪一步必須停下來請人確認。

## 理解 AI Agent，可以把它想成培訓一位數位新進員工

> **AI Agent 如同數位新進員工，需要帳號權限、工作方法與執行節奏。**
三項能力分別決定 AI Agent 能接觸什麼、應該怎麼做，以及何時執行與回報。

| AI Agent 核心能力 | 新進員工比喻 | 企業要回答的問題 | 缺少時會發生什麼 |
| --- | --- | --- | --- |
| Connector／MCP | 帳號、權限與工作資料 | Agent 可以去哪裡、取得什麼、執行什麼？ | Agent 無法取得最新資料，也不能完成跨系統工作 |
| Agent Skills | SOP、範例與判斷方法 | 公司希望 Agent 依照什麼方法工作？ | Agent 即使拿到資料，也可能做出不符合企業需求的結果 |
| Scheduled Tasks／Automation | 班表、觸發條件與回報規則 | 工作何時開始？什麼情況要通知誰？ | Agent 仍要等人交辦，無法持續監控與主動回報 |

三項能力不是彼此取代的產品選項，而是一套完整工作能力。企業若只買工具、只串資料，卻沒有整理工作方法與管理邊界，就像只替新進員工申請帳號，卻期待員工立刻承接整個部門的工作。

## Connector／MCP：讓 AI Agent 連接企業資料與工具

> **Connector／MCP 讓 AI Agent 取得資料、呼叫工具及執行動作。公司不會在新進員工報到第一天就給他最高管理權限，AI Agent 也是一樣。**

Connector 泛指連接特定服務的現成功能；MCP 則是 AI 應用連接外部資料、工具與工作流程的開放標準。MCP Server 可以向 AI Agent 提供資料資源、可呼叫工具與預先定義的互動提示，使不同 AI 應用不必為每項服務重新設計一套連接方式（Model Context Protocol 官方文件，2026 年 7 月）。

雲端服務已經出現具體應用。Google Cloud 在 2026 年 4 月公布超過 50 個代管 MCP Server，涵蓋基礎設施、維運、資安、資料庫、分析與儲存；官方舉例包含依需求建立或移除雲端資源，以及根據監控事件觸發復原動作（Google Cloud，2026 年 4 月）。AWS MCP Server 也在 2026 年 5 月正式推出，讓 AI Agent 在既有 AWS Identity and Access Management（IAM）權限下存取 AWS 服務，並利用 Amazon CloudWatch 與 AWS CloudTrail 保留監控及稽核紀錄（AWS，2026 年 5 月）。

![Connector與MCP示意圖：讓 AI 擁有讀取 Gmail、Google 行事曆與本機資料夾的權限](/images/articles/mcp-connector-illustration.webp)

企業應採用最小權限原則，只開放任務真正需要的資料與動作。查詢庫存和修改庫存是兩種不同權限；產生報價建議和正式送出報價，也應設計不同的人工確認門檻。

## Agent Skills：把員工經驗整理成可重複執行的方法

> **Agent Skill 是由指令、資源、範例與選用腳本組成的可重複工作方法。Agent Skill 適合把企業作業知識整理成可維護、可分享的模組。**

OpenAI 將 Skills 定義為封裝指令、資源與選用腳本的可重複工作流程（OpenAI，存取於 2026 年 8 月）；Anthropic 則把建立 Skill 比喻為替新進員工準備工作指南，讓組織能保存並分享程序知識（Anthropic，2025 年 10 月）。兩項官方說明都顯示，Skill 的重點不是讓提示詞變長，而是讓工作方法能被一致地重複使用。

| 比較項目 | 單次提示詞 | Agent Skill |
| --- | --- | --- |
| 使用方式 | 使用者在對話中臨時輸入 | Agent 在適當情境載入既定方法 |
| 包含內容 | 通常以文字指示為主 | 可包含指令、範本、參考資料、範例與腳本 |
| 維護方式 | 容易散落在個人對話 | 可進行版本管理、測試與團隊共用 |
| 企業價值 | 提升個人單次任務效率 | 保存並複製組織的工作知識 |

企業導入 Agent Skills 時，實際執行工作的員工應該是共同設計者。技術人員能協助整理格式與測試流程，但只有領域專家知道哪些條件會改變判斷、哪些例外不能照 SOP 處理，以及什麼結果才算真正完成工作。

![Agent Skills 運作流程四步驟圖：輸入企業基本資料、AI Agent 啟動與意圖設定、自動多向深度資料採集、一鍵生成完整分析報告](/images/articles/agent-skills-workflow-illustration.webp)

## Scheduled Tasks／Automation：讓 AI Agent 定時執行並主動回報

> **Scheduled Tasks 與 Automation 依時間或條件啟動工作。AI Agent 因此能定期執行、監控狀況並主動回報，不必每次等待指令。**

以我自己的工作為例，我會讓 AI 定期蒐集企業 AI 導入相關的文章與長篇影片。這項工作不是只寫一句「幫我找資料」，而是先指定主題、來源、發布時間與影片長度等條件，再要求 AI 閱讀、篩選、按固定格式整理，最後主動回報給我判斷哪些內容值得採用。

1. **Connector／MCP：**讓 AI Agent 使用網路搜尋、檔案或其他資料來源。
2. **Agent Skills：**規定搜尋條件、篩選標準、引用要求與摘要格式。
3. **Scheduled Tasks／Automation：**每週啟動流程，完成後主動傳回結果。
4. **人工判斷：**由我決定哪些資料納入研究、課程或顧問工作。

OpenAI 的 Scheduled Tasks 文件說明，週期性工作可以在背景執行，也能與 Skills 結合處理較複雜的工作流程（OpenAI，存取於 2026 年 8 月）。這項組合讓 Automation 不再只是固定提醒，而能啟動一套具有工作規則的 AI 任務。

## 三項能力都有，AI Agent 就能放心自動工作嗎？

> **三項核心能力只提供 AI Agent 工作的基本條件，不能取代企業治理。企業仍須設定資料權限、人工確認點、停止條件、異常處理及責任歸屬。**

例如，AI Agent 即使已經連接企業資源規劃系統（Enterprise Resource Planning，ERP），也不代表 AI Agent 自然知道哪些訂單能接、交期如何承諾、價格可以折讓多少，以及哪些客戶必須由業務主管親自確認。ERP 提供資料與操作入口，真正的工作判斷仍要由企業整理成規則、範例和升級處理機制。

| 常見誤解 | 實際需要補上的管理設計 |
| --- | --- |
| 接上系統後，Agent 自然知道怎麼做 | 整理正常流程、判斷條件、例外狀況與完成標準 |
| 自動執行就是完全不用人管 | 依風險設定建議、草稿、核准後執行或全自動等不同層級 |
| 沿用員工帳號最快 | 為 Agent 建立獨立身分、最小權限與完整稽核紀錄 |
| 成功一次就可以全面推行 | 使用代表性案例與例外情境測試，並設定停止條件 |

AI Agent 的自主程度應隨任務風險調整。資訊蒐集與報表草稿可以給予較高自主性；付款、刪除資料、正式報價或對外承諾等高風險動作，則應保留人工核准。

## 企業導入 AI Agent 前，可以先回答哪三個問題？

> **企業應先確認 AI Agent 要連接哪些資料、依照誰的工作方法執行，以及何時啟動與回報。任何一題答不清楚，都代表工作流程仍需盤點。**

1. **AI Agent 需要哪些資料與系統權限？**<br>列出必要資料來源、可讀取與可修改的範圍，以及禁止接觸的敏感資料。
2. **哪位員工最了解工作規則與例外狀況？**<br>邀請實際工作者整理步驟、判斷依據、正反例、完成標準與需要升級處理的情境。
3. **哪些步驟可自動執行，哪些步驟必須由人確認？**<br>依錯誤影響決定自主程度，並指定異常通知對象、停止條件與最終負責人。

企業不必一開始就打造能承接整個部門的 AI Agent。先選擇範圍清楚、資料可取得、錯誤可由人攔截的工作，才能逐步驗證 Connector／MCP、Agent Skills 與 Automation 是否真的形成可用的工作流程。

## 企業導入 AI Agent 的實際落地順序是什麼？

> **企業應先選低風險任務，再整理工作方法，最後才串接系統與啟用自動執行。縮小範圍並保留人工確認，能降低錯誤成本並找出流程缺口。**

1. **選一項低風險、可驗證的任務：**優先選擇輸入與輸出清楚、結果能由人快速檢查的工作，例如整理每週產業資訊、彙整客戶問題或製作報表草稿。
2. **由實際工作者拆解方法：**記錄資料從哪裡來、正常步驟、判斷條件、例外狀況、完成標準，以及哪些情況一定要詢問主管。
3. **準備資料連接與最小權限：**確認要使用 API、Connector、MCP 或受控的電腦操作，並只開放完成任務必要的查詢與動作權限。
4. **把工作方法做成 Agent Skill：**將步驟、範例、輸出格式與檢查規則封裝後，使用正常案例、缺漏資料及例外案例反覆測試。
5. **最後加入 Automation：**先讓 AI Agent 產生建議或草稿，確認穩定後再逐步增加定時執行、主動通知及低風險動作。

例如企業想把 Email 訂單輸入 ERP，第一階段不應直接讓 AI Agent 自動建立正式訂單。企業可以先讓 AI Agent 辨識訂單信件、擷取客戶、品項、數量與交期，產生待確認草稿；等欄位辨識與例外處理穩定後，再開放經人工核准的寫入動作。最後才評估哪些固定客戶或標準品訂單，可以在完整稽核下提高自動化程度。

## 哪些任務適合 AI Agent，哪些任務不適合？

> **需要查找資料、動態判斷及處理例外的低至中風險任務，較適合 AI Agent。規則固定的工作適合傳統自動化；高風險決策則應由人負責。**

| 任務特徵 | 較適合的方式 | 企業案例 | 原因 |
| --- | --- | --- | --- |
| 步驟固定、規則明確、例外很少 | 傳統自動化或 RPA | 固定格式檔案搬移、排程備份、欄位完全一致的資料轉寫 | 固定流程較便宜、穩定，也容易預測結果 |
| 需要閱讀非結構化資料並產生草稿 | AI Agent＋人工確認 | 整理會議紀錄、辨識 Email 訂單、彙整客訴主題 | AI Agent 能處理文字差異，人員可攔截錯誤 |
| 需要跨來源查找、比較並依條件調整 | AI Agent | 每週產業情報、供應商初步比較、異常原因初查 | 執行路徑會隨資料與查找結果改變 |
| 需要執行動作，但錯誤可以復原 | 受限權限的 AI Agent | 建立待辦事項、更新低風險狀態、產生待核准工單 | 可設定最小權限、操作紀錄與復原方法 |
| 涉及付款、正式承諾、安全或人事決策 | AI 輔助，人員決策 | 付款放行、正式報價、解雇決策、安全控制變更 | 錯誤影響高，必須保留具名負責人與人工核准 |
| 成功標準說不清楚，專家也無法一致判斷 | 暫不自動化 | 尚未定義標準的品質判斷、責任歸屬不明的跨部門決策 | 企業應先釐清流程與責任，否則無法有效測試 Agent |

判斷重點不是「AI Agent 做不做得到」，而是「企業能不能安全驗證結果」。任務若能先產生草稿、讓人快速檢查、在出錯時停止或復原，就適合從人機協作開始；任務若會直接造成重大損失，則應限制 AI Agent 只提供分析與建議。

## 常見問題

### AI Agent 一定要使用 MCP 嗎？

AI Agent 不一定要使用 MCP，也可以透過 API、內建 Connector 或其他工具整合方式連接系統。MCP 的價值是提供較標準化的連接方式，減少不同 AI 應用與資料工具各自開發整合的負擔。

### Connector 和 MCP 有什麼不同？

Connector 通常泛指連接特定服務的現成功能；MCP 是 AI 應用連接外部資料、工具與工作流程的開放標準。部分 Connector 底層可能採用 MCP，但兩個名詞不能直接畫上等號。

### Agent Skill 是否等於 SOP？

Agent Skill 可以包含標準作業程序（Standard Operating Procedure，SOP），但通常不只是一份文字說明。Agent Skill 還能封裝範例、範本、參考資料與選用腳本，讓 AI Agent 在適當情境載入並遵循完整工作方法。

### Agent Skill 和提示詞有什麼差別？

提示詞通常處理單次對話中的指示；Agent Skill 則把可重複使用的指令、資源、範例與腳本整理成模組。Agent Skill 比單一提示詞更適合團隊共用、版本維護與知識傳承。

### Scheduled Tasks 和傳統自動化有何不同？

Scheduled Tasks 著重依時間週期啟動工作；傳統自動化也能由事件或條件觸發。兩者若結合 Agent Skills，AI Agent 就能在啟動後依工作方法搜尋、判斷、整理並回報，而不只是執行固定提醒。

### AI Agent 可以直接操作 ERP 嗎？

AI Agent 必須透過 ERP 提供的 API、MCP Server、Connector 或受控的電腦操作能力，才可能讀取或寫入 ERP。企業仍須限制帳號權限、保留操作紀錄，並為報價、付款或刪除資料等高風險動作設定人工確認。

### 中小企業也適合導入 AI Agent 嗎？

中小企業可以先從範圍小、錯誤可攔截、資料權限清楚的工作開始，例如定期蒐集資訊、整理會議紀錄或製作例行報表。導入重點不是追求全自動，而是先證明單一流程能穩定產生價值。

### AI Agent 做錯事時由誰負責？

AI Agent 不會自行承擔企業責任。企業必須事先指定流程負責人、可自動執行的範圍、人工核准點、異常處理方式與稽核紀錄，讓每項決策和動作都有清楚的管理責任。

## 參考資料

1. SAP，〈[什麼是 AI Agent：效益和企業應用](https://www.sap.com/taiwan/resources/what-are-ai-agents)〉，發布於 2025-11-21，存取於 2026-08-24。
2. Model Context Protocol，〈[What is the Model Context Protocol (MCP)?](https://docs.anthropic.com/en/docs/mcp)〉，更新於 2026-07-28，存取於 2026-08-24。
3. Google Cloud，〈[Google-managed MCP servers are available for everyone](https://cloud.google.com/blog/products/ai-machine-learning/google-managed-mcp-servers-are-available-for-everyone)〉，發布於 2026-04-28，存取於 2026-08-24。
4. AWS，〈[The AWS MCP Server is now generally available](https://aws.amazon.com/blogs/aws/the-aws-mcp-server-is-now-generally-available/)〉，發布於 2026-05-06，存取於 2026-08-24。
5. OpenAI，〈[Build skills](https://learn.chatgpt.com/docs/build-skills)〉，發布日期不明，存取於 2026-08-24。
6. Anthropic，〈[Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)〉，發布於 2025-10-16，存取於 2026-08-24。
7. OpenAI，〈[Scheduled tasks](https://learn.chatgpt.com/docs/automations)〉，發布日期不明，存取於 2026-08-24。

## 延伸閱讀

- [AI Agent 落地五層診斷](/post/ai-agent-adoption)：同樣聚焦 AI Agent，可接著比較不同情境的做法。
- [Claude Code MCP scope 如何選擇 Local、Project 與 User](/post/claude-code-mcp-scopes)：同樣聚焦 MCP、AI Agent，可接著比較不同情境的做法。
- [自己撰寫一個簡單的 MCP：Model Context Protocol 入門實作](/post/simple-mcp-server-implementation)：同樣聚焦 MCP、AI Agent，可接著比較不同情境的做法。
`;export{e as default};