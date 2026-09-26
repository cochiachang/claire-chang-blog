var e=`---
title: "老舊 ERP 沒有資料庫文件怎麼辦？用 AI 反推資料表關係與查詢 SQL"
description: "說明企業如何利用 SQL dump、部分資料、ERP 畫面與既有 Stored Procedure，讓 AI 協助還原老舊 ERP 的資料表語意、報表 SQL，並建立可控的查詢介面。"
entity: Claire Chang-張可佳
date: 2026-08-31
category: 智慧營運
tags: [老舊 ERP, 資料庫逆向工程, Text-to-SQL, Stored Procedure, ERP 系統整合]
readingTime: 10 分鐘
image: /images/articles/hero_legacy-erp-ai-sql-discovery.webp
imageAlt: 工程師比對多個螢幕上的老舊系統程式碼與資料，逐步還原資料表關係
about: [老舊 ERP, 資料庫逆向工程, Text-to-SQL, Stored Procedure, ERP 系統整合]
---

老舊地端 ERP 即使沒有 DB schema 文件，只要能取得資料庫結構、部分去識別化資料、ERP 畫面與正確報表結果，AI 就有機會協助推測欄位意義、資料表關係與查詢 SQL。不過，AI 找到的是需要驗證的候選答案；比較務實的做法，是先處理唯讀的特定報表，再由熟悉 ERP 的人員確認，最後把固定 SQL、View 或 Stored Procedure 封裝成 API，供 AI 在受控範圍內呼叫。

這條路的價值，不在於讓 AI 一次看懂整套 ERP，而是降低理解老系統的起始成本。企業可以先挑一張每天都要查、人工又能核對的報表，逐步還原它背後的資料來源與商業規則。

> **重要警告：AI 推導出的欄位意義、資料表關係與 SQL 都只是候選答案。即使多個 Agent 得到相同結論，也不代表結論一定正確；正式採用前，仍需由 ERP 資深使用者、工程師或 DBA，以及既有報表結果多方交叉覆核。涉及帳務、庫存、法規或營運決策的查詢，更不能只靠單一人員或單次測試確認。**

## 沒有 DB schema 文件，AI 還能理解老舊 ERP 嗎？

<div class="answer"><p>AI 可以根據資料表結構、樣本值、ERP 畫面、既有報表、Stored Procedure 與 SQL 執行紀錄，提出欄位語意及資料表關係的假設；但企業仍需安排熟悉流程的人員驗證，不能把推測直接當成系統事實。</p></div>

這裡所說的「沒有 DB schema 文件」，通常不是資料庫完全沒有結構，而是缺少可以讓人理解的資料字典、實體關係圖（ER Diagram）、欄位說明與商業規則。資料庫裡可能仍有表格、欄位型態、索引或少數外鍵，只是名稱簡短、縮寫不明，甚至同一個概念在不同年代使用不同代碼。

AI 能利用的線索包括：

| 可提供的材料 | AI 可以協助判斷什麼 | 主要限制 |
|---|---|---|
| DDL 或含結構的 SQL dump | 資料表、欄位型態、索引、主鍵候選 | 看得見結構，不一定看得懂商業意義 |
| 少量去識別化資料 | 日期、狀態碼、單號格式、欄位分布 | 樣本太少可能漏掉例外情況 |
| ERP 操作畫面 | 畫面欄位與使用者用語 | 畫面名稱未必等於資料庫欄位名稱 |
| 正確的報表結果 | 驗證合計、筆數、篩選條件與 JOIN | 需要相同條件與期間才能比對 |
| View、Stored Procedure | 既有 JOIN、計算及商業規則 | 舊邏輯本身也可能有錯或已過時 |
| SQL log、稽核紀錄 | ERP 畫面操作實際觸發哪些查詢 | 系統未開啟紀錄時可能無法取得 |
| 資深使用者訪談 | 狀態、例外與真正的作業流程 | 記憶可能與目前程式行為不同 |

2025 年的 ERP Text-to-SQL 研究顯示，系統除了自動擷取的資料表、欄位、型態與樣本值，仍加入專家撰寫的語意描述及隱含資料表關係。研究團隊也指出，人工補充企業領域語意仍是必要的設定工作，並非把資料庫直接交給模型就能自動完成。[Chatting with your ERP: A Recipe](https://arxiv.org/html/2507.23429v1)

## AI 如何從 ERP 畫面反推出查詢 SQL？

<div class="answer"><p>AI 會比對畫面欄位、樣本值、資料型態、單號規則與正確報表結果，逐步縮小可能使用的資料表、JOIN、篩選及彙總方式；每一輪都需要用已知結果驗證，而不是只確認 SQL 能不能執行。</p></div>

以「某月份、某客戶的出貨金額報表」為例，實際流程可以拆成六步：

1. **固定一組可重現的查詢條件。** 記錄客戶、日期區間、廠別、狀態等條件，並從 ERP 匯出正確結果。
2. **建立畫面欄位對照表。** 列出單號、客戶名稱、出貨日、品項、數量、單價、金額等欄位及幾筆實際值。
3. **從資料庫搜尋候選欄位。** 依樣本值、資料型態、欄位名稱與索引，找出可能的主檔、明細檔和代碼表。
4. **提出關係假設。** 比對單號、客戶代碼與品號的重複情形，推測一對一、一對多及可能的 JOIN key。
5. **產生候選 SELECT。** 限制日期與資料量，分開測試基本查詢、JOIN、狀態排除及金額計算。
6. **逐欄驗證語意。** 對照筆數、合計、抽樣明細與例外單據；不一致時回頭修正關係或商業規則。

關鍵是「語意驗證」。一段 SQL 可以順利執行，也可能因一對多 JOIN 造成金額重複，或把取消單、測試單、跨期調整一起算進去。真正的驗收標準應該是它是否重現 ERP 在相同條件下的正確結果。

## 多個 Agent 為什麼適合分析缺乏文件的 ERP？

<div class="answer"><p>多個 AI Agent 可以用不同證據獨立提出資料表關係與商業規則，再以一致結果提高信心、以矛盾結果標示待人工確認之處，降低單一 Agent 過早相信錯誤假設的風險。</p></div>

[EZQ Labs 的老舊 ERP 案例](https://ezqlabs.com/work/legacy-erp-discovery/)使用六個獨立的 AI 分析者檢查多種系統材料，再整合各自的發現。案例中的資料庫有數百張表、沒有外鍵約束，最後產出資料字典、重建的資料表關係及計算公式等文件。

這個案例取得了原始碼，但一般企業使用的是外購 ERP，客戶通常不會持有原始碼。因此，這篇文章引用該案例，是為了說明多 Agent 獨立分析、交叉覆核與標示矛盾點的方法；實際執行仍以客戶能取得的 SQL dump、部分資料、ERP 畫面、報表結果、SQL log 與既有 Stored Procedure 為主。

實務上可以把任務分成以下角色：

| Agent 角色 | 主要工作 | 產出 |
|---|---|---|
| Schema 分析 | 盤點資料表、欄位、索引與既有關係 | 結構清單 |
| 資料剖析 | 觀察樣本值、唯一性、空值與代碼分布 | 欄位語意候選 |
| 畫面對照 | 比對 ERP 欄位名稱與實際顯示值 | 畫面與資料欄位對照 |
| SQL 生成 | 建立可驗證的小型 SELECT | 候選 SQL |
| SQL 審查 | 檢查 JOIN、重複計算、效能與權限 | 風險與修正建議 |
| 商業規則驗證 | 比對正確報表及使用者說明 | 已確認規則與待確認項目 |

多 Agent 不是「多問幾次就會變正確」。如果所有 Agent 都看到相同的不完整資料，也可能得到相同的錯誤結論。因此，仍要保留證據來源、信心等級、矛盾點和人工簽核結果。

比較合理的判定方式，是把每項發現分成「多個 Agent 一致」「Agent 之間有矛盾」「缺少足夠證據」三類，再交由不同角色覆核。ERP 資深使用者確認商業意義，工程師或 DBA 檢查資料關係、權限與效能，財會、倉管或其他報表負責人則核對實際數字。只有三方證據能互相對得起來，才適合將查詢列為已確認版本。

![多 Agent 反推 ERP 查詢流程圖：資料與畫面、多 Agent 探索、交叉驗證、標示模糊區、人工確認、固化查詢六個步驟](/images/articles/multi-agent-erp-query-reverse-workflow.webp)

## 為什麼查詢比讓 AI 寫入 ERP 更適合先做？

<div class="answer"><p>唯讀查詢錯誤通常造成報表不正確，寫入錯誤卻可能改壞庫存、帳務與流程狀態；因此老舊 ERP 的 AI 導入應先從隔離環境及受限 SELECT 開始，不宜直接開放新增、修改或刪除資料。</p></div>

讀取也不是零風險。錯誤 SQL 可能洩漏敏感資料、拖慢正式資料庫，或因缺少篩選而掃描大量資料。只是相較於寫入，讀取的影響比較容易隔離、核對與復原。

| 控制項目 | 唯讀探索的建議做法 | 未來若需寫入 |
|---|---|---|
| 環境 | 優先使用備份還原、Replica 或測試資料庫 | 先在測試環境完整演練 |
| 帳號 | 專用唯讀帳號，只開放必要 View 或資料表 | 不讓模型直接持有廣泛寫入權限 |
| SQL 類型 | 僅允許 SELECT，阻擋 DDL、DML 與多重敘述 | 改呼叫已核准的命令或工作流程 |
| 資料範圍 | 遮罩個資、限制欄位、期間與筆數 | 對每個欄位及對象做授權檢查 |
| 資源保護 | 設定逾時、列數上限與查詢成本限制 | 加入交易、冪等性與復原機制 |
| 人工確認 | SQL 執行前審查，結果再與 ERP 比對 | 高風險動作逐次核准或雙人覆核 |
| 稽核 | 保存提問、SQL、參數、執行者與時間 | 另記錄變更前後內容與核准者 |

Microsoft 的 SQL Server 安全建議也把最小權限與角色式安全列為重要原則。真正的權限邊界應由資料庫帳號、View、Stored Procedure 和政策檢查落實，不能只在提示詞裡要求 AI「不要修改資料」。[SQL Server security best practices](https://learn.microsoft.com/en-us/sql/relational-databases/security/sql-server-security-best-practices)

## 為什麼既有 Stored Procedure 更適合提供給 AI？

<div class="answer"><p>Stored Procedure 已把參數、查詢欄位、篩選條件與部分商業規則封裝成固定介面，AI 只需選擇程序並填入參數，比每次自由產生 SQL 更容易控制權限、資料範圍與稽核。</p></div>

很多老 ERP 雖然缺乏文件，資料庫裡卻累積了大量 Stored Procedure。這些程序可能就是最接近「可執行文件」的資產：它們記錄實際使用的 JOIN、狀態判斷、計算順序和例外處理。分析 Stored Procedure 不只可以找出報表 SQL，也可能比單看資料表更快理解真正的商業規則。

| 方式 | AI 的自由度 | 適合情境 | 主要風險 |
|---|---:|---|---|
| 即時產生任意 SQL | 高 | 探索未知結構、建立候選查詢 | 語意錯誤、資料外洩、效能不可預期 |
| 固定 SQL／View API | 中 | 已確認的報表與指標 | 版本與參數需要管理 |
| Stored Procedure API／MCP | 低 | 既有程序完整、需要權限與稽核 | 舊程序可能包含過時或錯誤規則 |

[DreamFactory 的教學](https://academy.dreamfactory.com/modules/docs/module-04-full)示範將既有 Stored Procedure 透過 REST endpoint 或 MCP 工具提供給 AI。AI 可以先取得允許使用的程序，再傳入季度、年度等參數呼叫；查詢欄位、遮罩、過濾和稽核邏輯留在資料庫端。DreamFactory 的一般文件也說明，Stored Procedure 支援主要是探索與呼叫資料庫裡已經存在的程序，不是替企業自動建立正確的程序。[Generate a REST API from Any Database](https://guide.dreamfactory.com/docs/generating-a-database-backed-api/)

封裝以前仍要先盤點哪些程序可以安全開放。有些舊程序可能會寫入暫存表、更新狀態，或依執行者身分產生不同結果；不能只因名稱以 \`Get\` 或 \`Query\` 開頭，就把它當成純讀取程序。

## 企業可以怎麼開始一個小規模驗證？

<div class="answer"><p>第一個 PoC 應選擇定義清楚、使用頻率高，而且能由現有 ERP 畫面或匯出報表人工核對的單一查詢；先證明一張報表可以穩定重現，再擴大資料範圍與功能。</p></div>

我會建議從「一張報表、固定期間、少數欄位」開始，而不是下達「幫我看懂整個 ERP」這種無法驗收的任務。適合的第一個案例通常具備以下條件：

- 已有固定的 ERP 畫面或匯出報表。
- 使用者能說明每個欄位及篩選條件。
- 能準備一組已知正確的測試結果。
- 查詢具有實際價值，但錯誤時不會直接改動營運資料。
- 涉及的資料表數量有限，例外規則可以列舉。

### 提供給 AI 的材料檢查表

- [ ] DDL、SQL dump 或資料表／欄位清單
- [ ] Primary Key、Index、Constraint 與已知關係
- [ ] 去識別化的代表性資料與例外資料
- [ ] ERP 畫面截圖、欄位名稱和操作條件
- [ ] 同一組條件下的正確報表結果
- [ ] 相關 View、Stored Procedure、SQL log 或稽核紀錄
- [ ] 狀態碼、單位、日期與金額的定義
- [ ] 取消、退貨、補單、跨期與作廢等例外規則
- [ ] 可以回答問題的 ERP 資深使用者或工程師

### SQL 驗證檢查表

- [ ] 查詢筆數與原報表一致
- [ ] 合計、平均值及小計一致
- [ ] 隨機抽查多筆明細一致
- [ ] 日期包含與排除的邊界正確
- [ ] 取消、作廢、退貨與測試資料處理正確
- [ ] JOIN 沒有造成重複列或金額膨脹
- [ ] 空值、零值、負值與異常代碼已測試
- [ ] 不會讀取未授權的欄位或其他部門資料
- [ ] 執行時間與資料庫負載在可接受範圍
- [ ] SQL、參數、驗證資料與核准結果已版本化

## 從一次性 SQL 走向可維護的 AI 查詢工具

<div class="answer"><p>驗證完成的 SQL 不應永遠留在對話紀錄裡，而要版本化並封裝成 View、Stored Procedure、REST API 或 MCP 工具，同時保存參數規格、權限、測試案例、負責人與變更紀錄。</p></div>

比較穩健的演進路線如下：

1. **人工監督的探索。** AI 分析結構、資料與畫面，產生候選關係及 SQL。
2. **結果驗證。** ERP 使用者、工程師或 DBA 逐欄比對正確報表，記錄已確認與未確認的規則。
3. **固定查詢。** 把已通過驗證的邏輯整理成 View、Stored Procedure 或具名 SQL。
4. **受控介面。** 透過 REST API 或 MCP 提供明確工具名稱、參數、回傳欄位與權限。
5. **持續監控。** 追蹤呼叫紀錄、錯誤、效能與 ERP 版本變化，定期重跑回歸測試。

其中「結果驗證」不應只由一個人完成。至少要同時包含懂作業流程的人、懂資料庫的人，以及能對最終數字負責的報表使用者；若查詢結果將影響帳務、庫存或法規申報，還要依企業內控制度增加核准層級。

這個架構把 AI 擅長的語意理解與探索，和資料庫擅長的權限、確定性及稽核分開。AI 可以理解「我要查上個月各門市的退貨率」，但實際取數應優先呼叫已核准的 \`GetStoreReturnRate\`，而不是每次重新組合一段無法預測的 SQL。

老舊 ERP 的現代化不一定要先換掉整套系統。先把一個重要查詢理解清楚、驗證清楚並封裝清楚，就能建立第一個可重複使用的資料能力，也能逐步累積原本不存在的資料字典與系統文件。

## 老舊 ERP 與 AI 查詢常見問題

### 只有 SQL dump、部分資料與 ERP 畫面也能反推嗎？

可以。準確度取決於 SQL dump 是否包含 DDL、索引、Constraint 及代表性資料，也取決於能否取得相同條件下的 ERP 畫面與正確報表結果。若還有既有 View、Stored Procedure 或 SQL log，就能增加判斷 JOIN 與商業規則的線索；最後仍需由資深使用者逐欄驗證。

### 客戶資料不能交給雲端 AI，還有辦法做嗎？

可以先移除姓名、電話、地址、身分證字號等敏感欄位，只提供結構與去識別化樣本；也可以在客戶環境內部署適合的模型與分析工具。無論使用雲端或地端模型，都應限制權限並保存稽核紀錄。

### 樣本資料需要提供多少才夠？

沒有適用所有 ERP 的固定筆數。比起只取最後幾列，更重要的是涵蓋正常單、取消單、退貨、空值、跨期與特殊狀態等代表性情況，並保留一組可以從 ERP 畫面核對的正確結果。

### 沒有 Foreign Key，AI 如何判斷資料表關係？

AI 可以從相似欄位名稱、資料型態、唯一性、值的包含關係、單號格式、既有 SQL 與程式呼叫推測候選關係。但候選關係仍要透過 JOIN 後的筆數、未匹配比例、重複情形及業務人員說明驗證。

### AI 產生的 SQL 可以直接在正式資料庫執行嗎？

不建議一開始直接在正式資料庫執行。應優先使用備份、Replica 或測試環境；若確實只能查正式環境，也要使用專用唯讀帳號、限制資料範圍、筆數、執行時間及查詢成本，並在執行前審查 SQL。

### Stored Procedure 可以直接轉成 API 嗎？

DreamFactory 等工具可以把資料庫中既有的 Stored Procedure 暴露為 REST endpoint，部分平台也能提供成 MCP 工具。不過，上線前仍要確認程序是否真的唯讀、參數是否合法、回傳資料是否需要遮罩，以及呼叫者應具備什麼權限。

### DreamFactory 會自動替企業建立 Stored Procedure 嗎？

DreamFactory 的資料庫 API 功能主要負責探索及呼叫已存在的 Stored Procedure。企業仍需由工程師或 DBA 建立、檢查與維護程序中的查詢和商業規則，不能把 API 自動產生誤解成商業邏輯也會自動正確產生。

### 多 Agent 一定比單一 Agent 準確嗎？

不一定。多 Agent 的優勢是能獨立檢查、暴露矛盾及分工處理大量材料；如果輸入資料錯誤、不完整，或所有 Agent 使用相同假設，仍可能得到一致但錯誤的答案。最終仍需要實際資料、正確報表與人工驗證。

## 參考資料

- [Legacy ERP Discovery & AI Reporting Agent｜EZQ Labs](https://ezqlabs.com/work/legacy-erp-discovery/)
- [Chatting with your ERP: A Recipe](https://arxiv.org/html/2507.23429v1)
- [Module 04：Deterministic Queries & Stored Procedures｜DreamFactory AI Academy](https://academy.dreamfactory.com/modules/docs/module-04-full)
- [Generate a REST API from Any Database｜DreamFactory](https://guide.dreamfactory.com/docs/generating-a-database-backed-api/)
- [SQL Server security best practices｜Microsoft Learn](https://learn.microsoft.com/en-us/sql/relational-databases/security/sql-server-security-best-practices)

## 延伸閱讀

- [ERP 沒有開放 API，企業要怎麼導入 AI？三種不用等廠商開放的整合解法](/post/architect-to-ai-consultant)：同樣聚焦 ERP、企業資料整合，可接著比較不同情境的做法。
- [如何串接 Email、ERP 與企業資料，自動執行完整工作流程？](/post/ai-agent-permission)：同屬「智慧營運」主題，可延伸理解相近問題的判斷方式。
- [企業導入前必懂的 MCP、Skills、Automation](/post/ai-agent-core-capabilities)：同樣聚焦 MCP，可接著比較不同情境的做法。

## 作者

Claire Chang（張可佳），企業 AI 導入與流程轉型顧問，擁有 19 年軟體工程經驗，協助企業把 AI 應用導入日常營運流程。

**最後更新：** 2026-08-31
`;export{e as default};