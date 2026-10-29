var e=`---
title: Vibe Coding 是什麼？三種定義、適用範圍，與企業及個人案例的閱讀路徑
description: Vibe Coding 指用自然語言要 AI 寫程式，但這個詞有三種用法。本文釐清定義、說明適合與不適合的情境，並依你的情況整理本分類各篇文章的閱讀路徑。
date: 2026-10-19
category: Vibe Coding
tags: [AI程式開發, 原型開發, 軟體工程, 人機協作, Cursor]
readingTime: 9 分鐘
image: /images/articles/hero_what-is-vibe-coding.webp
imageAlt: 筆電螢幕顯示程式碼，桌上有咖啡杯與耳機，象徵用 AI 協助寫程式的工作環境
---

Vibe Coding 是用自然語言向 AI 描述想要的結果，由 AI 寫程式，人試用成品再要求修改，過程中不逐行審查程式碼的做法。這個詞由 Andrej Karpathy 在 2025 年 2 月提出，他的說法是順著感覺走，「忘記程式碼的存在」（Martin Fowler，2026 年 5 月轉述）。同一個詞後來被用在三種不同的範圍，最嚴格的版本要求「不審查程式碼」，最寬鬆的版本只要有用 AI 寫程式就算。分不清楚是哪一種，就很容易對企業該不該用、能用到什麼程度，得到相反的結論。

這一頁先釐清定義與適用範圍，再把本分類的文章，依讀者的情況整理成閱讀路徑。每篇文章只回答一個問題，案例不重複敘述。

## Vibe Coding 是什麼？

> **Vibe Coding 是用自然語言要求 AI 寫程式、試用後請它修改，且不審查程式碼的做法，由 Andrej Karpathy 於 2025 年 2 月提出。**

Martin Fowler 把它定義為：透過提示大型語言模型來建立軟體應用，使用者試用成果、要求修改，但不審查產生的程式碼，並指出這個詞出自 Karpathy 在 2025 年 2 月於 X 上的貼文，重點是「忘記程式碼的存在」（Martin Fowler，2026 年 5 月）。

![開發典範轉移示意圖：過去的傳統方法專注於語法、函式庫與手動除錯，現在的 Vibe Coding 專注於意圖、邏輯架構與人機協作](/images/articles/vibe-1-1-paradigm-shift.webp)

上圖說明這個轉變：以前的重心是語法、函式庫與手動除錯，現在的重心移到意圖、邏輯架構與人機協作。這個概括描述的是工作重心的轉移，程式碼仍然需要審查。

## 為什麼同一個詞有三種意思？

> **Karpathy 的原始用法與 Simon Willison 的定義都要求不審查程式碼；Collins 詞典的定義最寬，用自然語言提示 AI 寫程式就算。**

| 來源 | 怎麼定義 | 是否以「不審查程式碼」為界線 |
| --- | --- | --- |
| Andrej Karpathy 的原始用法（2025 年 2 月，經 Martin Fowler 轉述） | 向 AI 描述想要的結果，順著感覺進行，忘記程式碼的存在 | 是 |
| Simon Willison（2025 年 3 月 19 日） | 「building software with an LLM without reviewing the code it writes」；若審查、徹底測試，並能向別人說明程式如何運作，就不是 Vibe Coding | 是 |
| Collins 詞典（2025 年 11 月 6 日選為年度詞彙） | 「使用自然語言提示的人工智慧，協助撰寫電腦程式碼」 | 否，範圍最廣 |
| 本分類的用法 | 區分 Vibe Coding、AI 輔助開發與代理式工程三種做法 | Vibe Coding 不看程式碼；後兩者要審查 |

Willison 的說明是，把所有 AI 輔助的寫程式都叫做 Vibe Coding，會讓人對「負責任的 AI 輔助程式開發」產生錯誤的印象；他自己的準則是，不能向別人解釋清楚的程式碼，就不提交到儲存庫（Simon Willison，2025 年 3 月）。

![三種開發方式的比較：傳統開發方法由人評估與實作，不同需求需要不同專業角色；AI 輔助開發由人評估及規劃實作方法，交由 AI 實作；Vibe Coding 由人只提出需求，交由 AI 評估、規劃以及實作](/images/articles/vibe-1-3-three-modes.webp)

上圖是三種做法的分工比較。本分類的文章採用同樣的分法，在需要講到「有審查」的做法時，會寫成 AI 輔助開發或代理式工程，詳細比較見[〈AI 時代，為什麼懂工作流程的人也能參與系統開發？〉](/post/domain-experts-ai-software-development)。

## 什麼情況適合用 Vibe Coding？什麼情況不適合？

> **Vibe Coding 適合原型、實驗與內部小工具等速度優先、出錯代價低的情境；他人依賴、涉及敏感資料或正式營運的系統，仍需要審查、測試與工程判斷。**

| 情境 | 適合程度 | 原因 |
| --- | --- | --- |
| 個人工具、一次性腳本 | 適合 | Fowler 稱最適合「受眾有限的用完即丟軟體」，出錯的影響範圍小 |
| 原型與實驗 | 適合 | 速度重要，目的是驗證想法，不是正式上線 |
| 公司內部小工具 | 視資料而定 | Cursor 官方說明列為適合情境，但前提是風險低；涉及敏感資料就要另外檢查 |
| 給客戶或大量使用者的正式產品 | 不適合只靠 Vibe Coding | 需要審查、測試與可維護性；Cursor 官方不建議把自己不理解的軟體部署到正式環境 |
| 涉及個資、金流或受規管資料 | 不適合 | Fowler 指出此類軟體可能洩漏敏感資料或憑證 |

Fowler 列出的主要風險有四項：可維護性、正確性、資安，以及不相關的程式碼被連帶改壞（Martin Fowler，2026 年 5 月）。Cursor 的官方說明則寫道，Vibe Coding 適合原型、實驗與內部工具，建議不要把自己不理解的軟體部署到正式環境（Cursor，Help 文件）。

## 本分類的文章，怎麼依你的情況閱讀？

> **本分類的文章依讀者情況可分為四條路：非工程背景者做第一個工具、卡關時的處理、團隊與企業的分工，以及一人產品的維運與制度。**

| 如果你想知道 | 先讀 | 這篇回答什麼 |
| --- | --- | --- |
| 沒有程式背景，能不能做出公司內部系統 | [法律背景者用 Lovable 做合約系統](/post/vibe-coding-legal-contract-system) | 領域知識怎麼變成系統，以及上線前要檢查什麼 |
| 工具寫好了，為什麼同事打不開 | [AI 一天寫完工具，為什麼上線卻卡了近一個月？](/post/ai-tool-one-day-build-deployment-month) | 部署的卡點、平台條款與上線前檢查表 |
| AI 一直修不好、跑版、改壞功能 | [需求分析師用 AI 做出完整網站](/post/requirements-analyst-ai-tarot-website) | 三個卡關各自怎麼處理，並對照官方文件 |
| 領域專家與 IT 怎麼分工 | [社工先做原型，再交工程師整合](/post/social-worker-prototype-it-integration) | 原型取代文件溝通，IT 保留把關 |
| 老闆自己做原型，工程師怎麼配置 | [老闆先用 AI 驗證想法，核心工程師再整合（MAXO）](/post/founder-prototype-engineer-integration-startup) | 分工前後比較，與功能變容易之後的治理 |
| 一個人做產品要怎麼管理 | [一人公司用 AI 做產品，最難的為什麼是取捨？](/post/one-person-company-ai-resume-advisor) | 上下文、規格、測試、營運紀錄與取捨 |
| 怎麼讓 AI 不再犯同樣的錯 | [mojo 創辦人 Hana 的 AI 開發工作制度](/post/mojo-app-hana-ai-development-system) | 把回顧變成 CLAUDE.md 規則與 Skill |
| 為什麼懂流程的人也能參與開發 | [AI 時代，為什麼懂工作流程的人也能參與系統開發？](/post/domain-experts-ai-software-development) | 哪一段變便宜、哪一段沒有，以及三種開發方式的比較 |
| 寫得快，專案為什麼還是慢 | [程式寫得更快，專案為什麼仍然很慢？](/post/fast-coding-slow-projects-handoff-bottleneck) | 等待、交接與審查，以及研究資料怎麼說 |
| 寫程式變便宜，開發成本為什麼沒降 | [AI 讓寫程式變便宜，系統開發的成本為什麼沒有跟著降？](/post/ai-development-capability-transfer) | 需求、分工與審查的調整，以及既有 Dashboard 怎麼評估 |
| 企業如何掌握持續修改與維運的能力 | [AI 開發陪跑結束後，如何把系統運營能力留在企業](/post/ai-development-handover-after-coaching) | 精簡核心工程團隊、文件化、能力移轉與交接驗收 |
| 做產品從構想到上線要過哪些關 | [用 AI 做產品要過哪五關？給非工程師的上線前檢查表](/post/ai-product-five-gates-checklist) | 五關各自的問題、AI 能做與人必須做的事，以及上線前檢查表 |
| 團隊要怎麼分工才不會越做越慢 | [跨職能小隊加平台團隊是什麼？](/post/cross-functional-squad-platform-team) | 溝通成本、平台團隊負責什麼，以及不適用的情況 |
| 需求、決策與除錯過程怎麼留成知識 | [AI 協作時代，怎麼把需求、決策與除錯過程留成組織知識？](/post/written-culture-ai-collaboration) | 四種紀錄、架構決策紀錄與給 AI 的專案規則 |
| 該選哪一種工具來做 | [整合式 AI 平台，還是自己搭開發環境？](/post/ai-builder-platform-vs-local-tools) | 預算、技術理解與風險的取捨 |

選工具通常發生在動手之前，所以這篇也列在表中。

Vibe Coding 放在兩項服務裡：[AI 導入陪跑](/services/)從需求訪談、PoC 原型陪到上線與交接，讓團隊把應用做出來；[1 對 1 AI 教練](/coaching/)針對個人的任務一對一練習。想先知道團隊目前的位置，可以做[AI 導入階段與準備度評估](/tools/ai-adoption-stages/)。有具體需求歡迎[預約諮詢](/contact/)。

<tool-card slug="ai-adoption-stages">
</tool-card>

## 常見問題

### Vibe Coding 是什麼意思？

Vibe Coding 是用自然語言向 AI 描述需求，由 AI 寫程式，使用者試用結果再要求修改，並且不審查程式碼的做法。這個詞由 Andrej Karpathy 在 2025 年 2 月提出。

### Vibe Coding 和 AI 輔助開發有什麼不同？

差別在人有沒有審查程式碼。Simon Willison 的說法是，若 AI 寫了所有程式碼，但你審查、測試並理解了每一行，就不算 Vibe Coding。本分類把這類做法稱為 AI 輔助開發或代理式工程。

### 不會寫程式的人，可以用 Vibe Coding 做工具嗎？

可以，尤其適合個人工具與原型。本分類有多篇案例，但案例也顯示，環境建置、部署與資料安全仍然需要額外處理。

### Vibe Coding 做出來的東西可以正式上線嗎？

不建議只靠 Vibe Coding 就上線。Cursor 官方不建議把自己不理解的軟體部署到正式環境，Fowler 也指出這類軟體常有可維護性、正確性與資安問題。正式上線前，要補上審查、測試與權限檢查。

### 企業可以讓員工用 Vibe Coding 做內部工具嗎？

可以從低風險的小工具開始，並事先決定可用的資料範圍、審查者與維護責任。涉及個資、金流或受規管資料的工具，不適合只靠員工自己做。

## 資料來源與說明

定義與風險引自下列公開來源，查閱日期為 2026 年 10 月 19 日；案例與閱讀路徑為本站整理，案例內容見各篇文章。三種開發方式的分法為本站整理。

## 參考資料

1. Martin Fowler，〈[Vibe Coding](https://martinfowler.com/bliki/VibeCoding.html)〉，2026 年 5 月 21 日，存取日期：2026 年 10 月 19 日。
2. Simon Willison，〈[Not all AI-assisted programming is vibe coding (but vibe coding rocks)](https://simonwillison.net/2025/Mar/19/vibe-coding/)〉，2025 年 3 月 19 日，存取日期：2026 年 10 月 19 日。
3. KRDO（CNN Business 報導），〈[Vibe coding named Collins Dictionary's Word of the Year](https://krdo.com/news/2025/11/06/vibe-coding-named-collins-dictionarys-word-of-the-year/)〉，2025 年 11 月 6 日，存取日期：2026 年 10 月 19 日。
4. Cursor，〈[Vibe coding](https://cursor.com/help/ai-features/vibe-coding)〉，Cursor Help，現行文件，存取日期：2026 年 10 月 19 日。

## 延伸閱讀

- [中小企業導入 AI 從哪裡開始？從工作流程找出真正值得做的專案](/post/small-business-ai-workflow)：決定第一個內部工具該做什麼的評估方法。
`;export{e as default};