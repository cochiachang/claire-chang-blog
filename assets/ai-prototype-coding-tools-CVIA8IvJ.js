var e=`---
title: AI 原型程式開發工具怎麼選？v0、Bolt、Replit、21st.dev、shadcn/ui、Lovable 介紹
description: 比較 v0、Bolt、Replit、21st.dev、shadcn/ui、Lovable 在 AI 原型程式開發中的適用情境與選型判斷。
date: 2025-02-01
category: 生成式AI
tags: [AI程式開發, 原型開發, v0, Bolt, Replit, Lovable, shadcn/ui]
readingTime: 8 分鐘
image: /images/tech/hero_generative-ai-workplace-applications.webp
imageAlt: 生成式 AI 協助軟體開發與原型設計的工作情境
---


# AI 原型程式開發工具怎麼選？v0、Bolt、Replit、21st.dev、shadcn/ui、Lovable 介紹

AI 原型程式開發工具可以依「想先做 UI、想做全端 App、想找元件素材、想協作部署」四種需求來選。v0 by Vercel 適合快速產生 UI 與 Vercel 專案，Bolt 適合瀏覽器內完成全端原型，Replit 適合協作與部署，21st.dev 與 shadcn/ui 適合補 UI 元件，Lovable 則適合用對話建立 Web App 並串接 Supabase。

## AI 原型程式開發工具適合解決什麼問題？

AI 原型程式開發工具最適合把模糊需求快速變成可點、可測、可討論的版本。這類工具不能取代工程設計，但能縮短從想法到第一版畫面的時間。

我會把 AI 原型程式開發工具當成「把需求具象化」的工具，而不是直接當成正式產品的最後版本。對產品經理、設計師、創業者或工程師來說，AI 工具最有價值的地方，是先產出一個能讓團隊討論的雛型，再用真實回饋決定要不要往正式架構走。

比較實用的使用情境包括：

- 做一個可以展示流程的 MVP。
- 快速產生 landing page、dashboard、表單或後台畫面。
- 把 Figma、截圖或文字需求轉成前端元件。
- 測試某個功能概念是否值得繼續開發。
- 讓非工程背景的人先把想法做成可互動版本。

## v0 by Vercel 適合哪一類原型開發？

v0 by Vercel 適合快速產生 UI、頁面與 Vercel 生態系內的 Web App。開發者可以用自然語言描述需求，讓 v0 生成程式碼並部署到 Vercel。

[v0 by Vercel](https://v0.dev/) 是 Vercel 推出的 AI 開發工具。Vercel 官方文件把 v0 定位成 pair programmer，使用者可以用自然語言描述想法，v0 產生專案所需的程式碼與 UI；由 v0 建立的內容也可以部署到 Vercel（Vercel Docs，2026-08 存取）。

v0 特別適合需要靈感或快速 UI 原型的開發者。平台裡常見的範例包含 AI SDK 聊天機器人、加密貨幣儀表板、3D 登陸頁面、動態背景、卡片生成器、音樂播放器等。每個範例都可以 Fork，再依自己的需求修改。

我會在下面情況優先考慮 v0：

- 專案本來就要部署在 Vercel。
- 想先把 UI 架構、互動狀態或頁面排版做出來。
- 團隊使用 React、Next.js、Tailwind CSS 或 Vercel AI SDK。
- 需要用生成結果當作工程師後續調整的起點。

## Bolt 適合從零建立全端 App 嗎？

Bolt 適合在瀏覽器中快速建立、執行、編輯與部署全端 Web App。Bolt 的重點不是只產生程式碼，而是把終端機、檔案、預覽與部署放進同一個工作環境。

[Bolt](https://bolt.new/) 的首頁標語是「Prompt, run, edit, and deploy full-stack web apps」。StackBlitz 的 bolt.new GitHub 專案也說明，Bolt 是 AI-powered full-stack web development in the browser，並透過 WebContainers 讓使用者在瀏覽器內安裝套件、執行 Node.js server、操作檔案系統與預覽結果（StackBlitz GitHub，2026-08 存取）。

Bolt 的使用流程很直覺：先用 prompt 描述想做的 App，再看生成結果，接著用提示詞或直接改 code 的方式繼續調整。對需要快速迭代和測試的人來說，這種「產生、執行、修改、部署」放在同一個畫面的設計很方便。

不過 Bolt 仍然比較適合原型或早期 MVP。需要複雜權限、長期維運、嚴格測試或多環境部署的專案，後面仍然要進入正常工程流程。

## Replit 適合協作與部署型原型嗎？

Replit 適合需要多人協作、雲端 IDE、快速展示與部署的原型開發。Replit Agent 可以透過對話建立 App，Project Editor 則提供預覽、管理與後續調整的工作區。

[Replit](https://replit.com/) 是線上整合開發環境（Integrated Development Environment，IDE），支援多種程式語言，也具備協作、部署與社群功能。Replit 官方文件說明，Project Editor 是使用者描述 App 想法、看見 App 成形並管理專案的工作區；Replit Agent 會根據描述寫程式、設定專案並顯示即時預覽（Replit Docs，2026-08 存取）。

Replit 比較像一個完整的雲端工作桌。使用者不用先在自己的電腦安裝開發環境，就可以開始寫程式、分享作品，甚至邀請其他人一起編輯。對學習程式、教學、黑客松、小型工具與快速展示來說，Replit 的門檻很低。

Replit 的限制也很清楚：如果專案需要大量本機資源、特殊系統相依或非常細的部署控管，瀏覽器式環境可能不如本地開發環境順手。

## 21st.dev 和 shadcn/ui 在 AI 原型中扮演什麼角色？

21st.dev 和 shadcn/ui 比較像 UI 元件與設計素材來源，不是完整 App 生成器。兩者適合在 AI 生成 App 後，補上更成熟的介面元件與可維護的前端結構。

[21st.dev](https://21st.dev/) 是 React 與 Tailwind CSS 元件、模板、shadcn themes 的社群平台。21st.dev 官方頁面提到，元件可以用 prompt 的形式複製到 Cursor、Claude Code、v0、Lovable 等 AI coding agent，讓 AI 把元件接進專案（21st.dev，2026-08 存取）。

[shadcn/ui](https://ui.shadcn.com/) 則是開源 React 元件集合，採用「把元件程式碼放進自己的專案」的方式使用。這種做法和傳統元件庫不同，開發者不是單純 import 一個套件，而是把元件原始碼納入專案後再客製化。

我會這樣分工：

| 工具 | 主要用途 | 適合情境 |
|---|---|---|
| 21st.dev | 找 UI 靈感、模板、元件 prompt | 想讓 AI coding agent 產生更像成品的介面 |
| shadcn/ui | 建立可維護的 React UI 基礎元件 | 專案需要表單、對話框、選單、表格等常用元件 |

如果 AI 生成的畫面看起來太粗糙，我通常不會一直叫 AI「變漂亮」。更有效的做法，是先指定 shadcn/ui 的元件結構，或從 21st.dev 找到接近的元件，再請 AI 依既有設計 token 接進專案。

## Lovable 適合非工程背景的人做 Web App 嗎？

Lovable 適合用自然語言快速建立 Web App，尤其適合需要前端畫面、後端資料庫、登入與 GitHub 同步的早期產品。Lovable 可以降低起步門檻，但仍需要規劃資料結構與功能邊界。

[Lovable](https://lovable.dev/) 是以對話方式建立網站與 Web App 的 AI 工具。Lovable 文件提到，使用者可以連接 GitHub、加入全端能力，並透過 Lovable Cloud 或 Supabase 建立後端功能；Lovable 的 Supabase integration 可處理 database、auth、storage、real-time 與 serverless functions（Lovable Docs，2026-08 存取）。

Lovable 對非工程背景使用者友善，因為使用者可以先用自然語言描述想要的功能，例如登入頁、資料表單、管理後台或公開頁面。需要資料庫或身份驗證時，Lovable 也能透過 Supabase 把後端接起來。

但 Lovable 不是魔法。當需求開始涉及資料權限、付款、通知、稽核、複雜商業邏輯或大量使用者時，仍然需要工程師檢查資料模型、API 邊界、安全性與部署策略。

## 這些 AI 原型程式開發工具該怎麼選？

AI 原型程式開發工具的選擇可以先看交付物：只要 UI 選 v0 或 21st.dev；要全端原型選 Bolt、Replit 或 Lovable；要可維護元件基礎選 shadcn/ui。

下面是我整理給自己用的選型表：

| 需求 | 優先工具 | 判斷理由 |
|---|---|---|
| 快速做出 React / Next.js UI | v0 by Vercel | 自然語言產生 UI，且可銜接 Vercel 部署 |
| 在瀏覽器內做全端 MVP | Bolt | 同時處理 prompt、執行、編輯與部署 |
| 教學、協作、小型作品展示 | Replit | 雲端 IDE、多人協作與部署體驗完整 |
| 找漂亮元件或設計靈感 | 21st.dev | 可把元件 prompt 帶進 AI coding agent |
| 建立可客製的 UI 元件系統 | shadcn/ui | 元件程式碼進專案，方便長期調整 |
| 非工程背景快速做 Web App | Lovable | 以對話產生 App，並可連接 Supabase、GitHub |

我的實務判斷是：早期原型不要只追求「一次生成完整 App」。比較穩的流程是先用 AI 工具做出可討論版本，再把需求拆成 UI、資料、權限、部署與測試幾個區塊。AI 可以讓第一版快很多，但正式產品仍然需要工程判斷。

## AI 原型開發要注意哪些限制？

AI 原型開發最常見的限制是程式碼品質、資料安全、需求邊界與長期維護。工具可以加快第一版，但不能保證架構正確、權限安全或商業邏輯完整。

使用 AI 原型工具時，我會特別檢查五件事：

1. **需求是否太模糊**：如果 prompt 只寫「做一個好看的後台」，生成結果通常會很表面。
2. **資料模型是否合理**：登入、角色、資料表關聯、權限規則不能只看畫面。
3. **生成程式碼是否能維護**：檔案是否過大、命名是否混亂、狀態管理是否散落。
4. **外部服務是否安全**：API key、資料庫連線、金流與個資處理都要人工檢查。
5. **部署是否只是展示版**：展示版能跑不代表正式環境能承受真實使用者。

對我來說，AI 原型開發的價值是讓團隊更早看到問題，而不是讓問題消失。越早把畫面、流程與資料關係做出來，越容易發現「我們其實沒有講清楚」的地方。

## 常見問題

### AI 原型程式開發工具可以取代工程師嗎？

AI 原型程式開發工具不能完整取代工程師。這類工具很適合做第一版畫面、展示流程與簡單功能，但正式產品仍需要工程師處理架構、安全性、測試、效能與維運。

### v0 和 Bolt 最大差異是什麼？

v0 比較偏向用自然語言產生 UI 與 Vercel 專案，Bolt 比較偏向在瀏覽器內完成全端 App 的產生、執行、編輯與部署。若需求是畫面原型，我會先看 v0；若需求是可跑的全端 MVP，我會先看 Bolt。

### Replit 適合初學者做 AI 原型嗎？

Replit 適合初學者做 AI 原型，因為開發環境在瀏覽器內，不需要先安裝複雜工具。Replit 也支援協作與部署，所以很適合教學、黑客松與小型作品展示。

### 21st.dev 和 shadcn/ui 要一起用嗎？

21st.dev 和 shadcn/ui 可以一起用，但角色不同。21st.dev 比較像元件靈感與 AI-ready prompt 來源，shadcn/ui 則比較像專案內可長期維護的 UI 元件基礎。

### Lovable 做出來的 App 可以正式上線嗎？

Lovable 可以協助建立並發布 Web App，也能串接 Supabase、GitHub 等服務。不過正式上線前，仍然要檢查資料權限、API key、錯誤處理、SEO、效能與測試，尤其是會處理使用者資料或金流的產品。

### 沒有程式背景的人應該先用哪一個 AI 開發工具？

沒有程式背景的人可以先從 Lovable、Replit 或 Bolt 開始，因為這幾個工具把產生、預覽與部署放在同一個流程中。若只是想做漂亮畫面或 landing page，v0 也很適合。

### AI 原型開發前要先準備什麼？

AI 原型開發前最好先準備使用者角色、核心流程、資料欄位、頁面清單與成功條件。準備越具體，AI 生成的結果越接近可測試版本，也越容易讓工程師接手。

## 參考資料

- Vercel Docs, [v0](https://vercel.com/docs/v0)，存取日期：2026-08-28。
- StackBlitz GitHub, [bolt.new](https://github.com/stackblitz/bolt.new)，存取日期：2026-08-28。
- Bolt, [AI App Builder](https://bolt.new/use-cases/ai-app-builder)，存取日期：2026-08-28。
- Replit Docs, [Project Editor](https://docs.replit.com/learn/projects-and-artifacts/project-editor)，存取日期：2026-08-28。
- Replit, [AI Coding Agent: Build Apps Through Chat](https://replit.com/products/agent)，存取日期：2026-08-28。
- 21st.dev, [The living library of interfaces](https://21st.dev/)，存取日期：2026-08-28。
- 21st.dev, [UI Components for React & Tailwind](https://21st.dev/community/components/s/ui)，存取日期：2026-08-28。
- shadcn/ui, [Components](https://ui.shadcn.com/docs/components)，存取日期：2026-08-28。
- Lovable Docs, [Getting started](https://docs.lovable.dev/introduction/getting-started)，存取日期：2026-08-28。
- Lovable Docs, [Integrate a backend with Supabase](https://docs.lovable.dev/integrations/supabase)，存取日期：2026-08-28。

最後更新：2026-08-28

## 延伸閱讀

- [Codeium Windsurf AI 編輯器使用紀錄：功能、適合情境與選型判斷](/post/codeium-windsurf-ai-editor)：同樣聚焦 AI程式開發，可接著比較不同情境的做法。
- [Claude Code 自動修改 GitHub Issue：用 GitHub CLI 建立修復流程](/post/claude-code-github-issue)：同樣聚焦 AI程式開發，可接著比較不同情境的做法。
- [論文研讀：AI 工具對軟體開發與架構的影響](/post/ai-tools-software-development-architecture-paper)：同樣聚焦 AI程式開發，可接著比較不同情境的做法。
`;export{e as default};