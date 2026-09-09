var e=`---
title: Claude Code介紹和使用建議
description: Claude Code 是 Anthropic 推出的終端機 AI 程式助理。這篇完整介紹 Claude Code 能做什麼、安裝設定步驟、CLAUDE.md 上下文管理與 MCP 團隊協作建議，幫你把 AI 助理變成開發最佳拍檔。
date: 2025-07-23
category: 生成式AI
tags: [Claude Code, 生成式AI, AI程式助理, CLAUDE.md, MCP]
readingTime: 7 分鐘
image: /images/tech/hero_claude-code-intro-and-tips.webp
imageAlt: 終端機視窗中顯示程式碼的開發環境，象徵 Claude Code AI 程式助理
---


# Claude Code介紹和使用建議

Claude Code 是 Anthropic 推出的終端機 AI 程式助理，不僅能幫你寫程式、查文件、修 bug，甚至還能幫你整理 Git 記錄、整合團隊工具。這篇文章整理了 Claude Code 的核心能力、有效使用流程、安裝設定步驟，以及用 CLAUDE.md 和 MCP 管理上下文的實務建議。

## Claude Code 可以做什麼？

**分析 Git 歷史**

- 自動分析 commit 記錄，幫你查出參數是誰加的、為什麼改、相關背景脈絡。
- 無需額外提示，它會自己「幫你總結」。

**整合 GitHub Issue**

- Claude 可以自動拉取 GitHub Issue 資訊，並讀出脈絡，協助你釐清問題或任務內容。

**參與 Weekly Standup**

- 你可以問它：「我這週交付了什麼？」
- Claude 會自動從你的 Git 日誌中整理出成果摘要。

## 有效使用流程：從 Q&A 到整合工具

- **新手建議先從 Codebase Q&A 開始**：比起直接改程式碼，先問問題（像「這個變數在哪裡定義？」）更容易上手，快速熟悉程式邏輯與架構。
- **逐步導入工具**：等你熟悉後，就可以進一步請 Claude 幫你「編輯程式碼」，並使用其內建工具，例如 bash、測試指令等。
- **不必一個個指定工具**：只要下目標，Claude 會自己判斷該用哪些工具，幫你串成完整流程。
- **寫功能前先規劃設計**：Claude 最強的能力在於「思考」，你可以先請它幫你規劃實作策略，再確認後由它代碼實作。
- **告訴 Claude 你的 CLI 工具**：你只要講「我們團隊有一個叫 build-image 的自定義指令」，它之後就能幫你正確下命令。
- **一次設定全部工具（建議）**：在進入一個新專案時，建議一次告訴 Claude 這個專案會用到哪些工具，這樣它在處理任務時會更有效率。

## 如何安裝 Claude Code？

請先確認你的系統符合以下條件：

- **作業系統**：macOS 10.15+、Ubuntu 20.04+/Debian 10+ 或 Windows 10+（需搭配 WSL 或 Git for Windows）
- **Node.js**：版本 18 以上（檢查 \`node -v\`）
- **硬體需求**：建議至少 4GB RAM，有網路連線
- **Shell 環境**：建議使用 Bash、Zsh 或 Fish

### 步驟 1：安裝 Claude Code CLI

開啟 Terminal（Mac/Linux）或 WSL 的 Ubuntu 終端機，執行：

\`\`\`bash
npm install -g @anthropic-ai/claude-code
\`\`\`

安裝完成後，輸入以下指令確認版本：

\`\`\`bash
claude --version
\`\`\`

### 步驟 2：設定 API 金鑰驗證

安裝好後，必須連結你的 Anthropic 帳號：

\`\`\`bash
claude auth login
\`\`\`

或是將 API 金鑰寫入環境變數（適合自動化流程）：

\`\`\`bash
export ANTHROPIC_API_KEY="你的-api-金鑰"
\`\`\`

第一次執行 \`claude auth login\` 時，系統會開啟瀏覽器讓你登入並授權。

### 步驟 3：開始第一個專案

1. 建立新的專案資料夾並切換進去：

   \`\`\`bash
   mkdir my-claude-project
   cd my-claude-project
   \`\`\`

2. 啟動 Claude：

   \`\`\`bash
   claude
   \`\`\`

![Claude Code 啟動畫面](/images/articles/claude-code-intro-and-tips-1.webp)

## 如何善用 CLAUDE.md 建立上下文？

在 Claude Code 的運作中，CLAUDE.md 是建立上下文（context）最核心的元素之一。良好的 CLAUDE.md 結構設計，能顯著提升 Claude 的理解力與團隊間的協同效率。

建議開發者各自維護 \`.claude.local.md\`，記錄自己常用的 workflow、debug 技巧或指令，不簽入 Git，但可被 Claude 使用。

撰寫原則如下：

- **保持簡潔明確**：寫入常用指令、關鍵檔案與系統架構說明。避免冗長、過度複製 Readme 或歷史資訊，否則會稀釋 Claude 的關注焦點。
- **依目錄嵌套設計**：每個子模組（如 \`/api\`、\`/frontend\`、\`/infra\`）都可以放一份 CLAUDE.md，Claude 會在該區域操作時自動讀取該目錄的說明。
- **保留個人版**：建議開發者各自維護 \`.claude.local.md\`，記錄自己常用的 workflow、debug 技巧或指令，不簽入 Git，但可被 Claude 使用。

## 有哪些高階上下文管理技巧？

### 組織層級的共享 CLAUDE.md

- 公司可建立統一的 \`enterprise.CLAUDE.md\`（如專案政策、資安規範、CI/CD 標準），並在每個 repo 中引用。
- 有助於新進工程師快速了解開發規範。

### 結合 Slash 指令與情境切換

- Claude 支援 \`/commands\` 格式，例如 \`/deploy\`、\`/check-access\`，這些可事先存於專案或個人記憶中，讓 prompt 更精準。

### 階層式配置架構建議

\`\`\`text
├── CLAUDE.md（全域策略）
├── .claude.local.md（個人筆記）
├── frontend/
│   └── CLAUDE.md（UI 工具說明）
├── backend/
│   └── CLAUDE.md（API 路由與框架設定）
└── infra/
    └── CLAUDE.md（Terraform、MCP 配置）
\`\`\`

## 如何用 MCP 做團隊資源共享？

**集中配置一次，團隊共享**：MCP 伺服器（如 puppeteer、PostgreSQL 查詢機器人等）可部署在某一個共用專案中，設定好後所有開發者即可使用。

**可用資源範例**

- \`puppeteer-mcp\`：自動產生截圖／PDF 報告。
- \`llm-lint-mcp\`：代碼風格與品質審查。
- \`qa-mcp\`：單元測試結果解析與修復建議。

**建議導入流程**

| 階段 | 重點行動 |
| --- | --- |
| 團隊導入初期 | 建立統一的 CLAUDE.md 與 MCP server，並教育每位成員撰寫 \`.claude.local.md\` |
| 日常工作中 | 透過 Claude 自動解析 commit、Issue、CI/CD log，提升團隊溝通效率 |
| 每週協作 | 在 weekly stand-up 前，使用 Claude 整理每人當週交付與貢獻，快速對齊進度 |
| 長期優化 | 定期檢視 CLAUDE.md 內容，清理無效資訊、合併重複區段、補充新工具配置 |

善用 CLAUDE.md 與其延伸機制，就像是幫你的 AI 工程夥伴安裝了「專案經驗記憶體」。不僅可以快速上手大型專案、減少重複溝通，還能真正讓 Claude 成為團隊知識管理與效率最佳化的幫手。

## 常見問題

### Claude Code 是什麼？

Claude Code 是 Anthropic 推出的終端機 AI 程式助理，能直接在命令列中讀取專案、寫程式、查文件、修 bug，還能自動整理 Git 記錄與整合團隊工具。它用自然語言溝通，開發者只需下目標，它會自己判斷該用哪些工具。

### 安裝 Claude Code 需要什麼環境？

需要 macOS 10.15+、Ubuntu 20.04+/Debian 10+ 或 Windows 10+（搭配 WSL），Node.js 18 以上，建議至少 4GB RAM 與網路連線。安裝只要一行 \`npm install -g @anthropic-ai/claude-code\`。

### CLAUDE.md 該放哪些內容？

寫入常用指令、關鍵檔案與系統架構說明，保持簡潔明確即可。避免冗長或複製整份 Readme，否則會稀釋 Claude 的關注焦點；各子模組可各自放一份 CLAUDE.md，Claude 會自動讀取所在目錄的說明。

### 新手該怎麼開始使用 Claude Code？

建議先從 Codebase Q&A 開始，像問「這個變數在哪裡定義？」來熟悉程式邏輯，再逐步讓它編輯程式碼。寫功能前先請它規劃設計、確認後再實作，效果最好。

### 什麼是 MCP？團隊該怎麼導入？

MCP（Model Context Protocol）讓 Claude 串接外部工具與資源，例如 puppeteer 截圖、PostgreSQL 查詢機器人。團隊可把 MCP 伺服器集中部署在一個共用專案中，設定一次全體即可使用。

## 參考資料

- [Claude Code 官方安裝文件（Anthropic Docs）](https://docs.anthropic.com/en/docs/claude-code/setup)
- [Claude Code Quickstart（Anthropic Docs）](https://docs.anthropic.com/en/docs/claude-code/quickstart)

## 延伸閱讀

- [Claude Code 使用 MCP 功能設定教學](/post/claude-code-mcp-setup)：同樣聚焦 Claude Code、MCP，可接著比較不同情境的做法。
- [Claude Code 的記憶機制：CLAUDE.md 怎麼寫才有用？](/post/claude-code-memory)：同樣聚焦 Claude Code、CLAUDE.md，可接著比較不同情境的做法。
- [Claude Code MCP scope 如何選擇 Local、Project 與 User](/post/claude-code-mcp-scopes)：同樣聚焦 Claude Code、MCP，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2025-07-23，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};