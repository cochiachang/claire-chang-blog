var e=`---
title: Claude Code 的記憶機制：CLAUDE.md 怎麼寫才有用？
description: 整理 Claude Code 記憶檔案層級、CLAUDE.md 匯入語法、撰寫原則與專案記憶範例，讓 AI 編碼工具更貼近團隊流程。
date: 2025-07-23
category: 生成式AI
tags: [Claude Code, CLAUDE.md, AI程式工具]
readingTime: 7 分鐘
image: /images/tech/hero_claude-code-memory.webp
imageAlt: 筆電螢幕顯示程式碼，象徵 Claude Code 讀取專案記憶與開發規則
---
# Claude Code 的記憶機制：CLAUDE.md 怎麼寫才有用？

Claude Code 的記憶機制可以把專案架構、開發規範、常用指令與個人偏好寫進固定檔案，讓 AI 編碼工具在每次工作時先讀到上下文。最常用的是專案根目錄的 \`CLAUDE.md\`，團隊可以把這個檔案放進版本控制，讓 Claude Code 依照同一份專案規則協助開發。

## Claude Code 支援哪些記憶檔案？

Claude Code 的記憶檔案分成專案記憶、使用者記憶與專案本地記憶。不同層級的記憶適合放不同範圍的資訊。

| 記憶檔案 | 位置 | 用途 |
| --- | --- | --- |
| 專案記憶 | \`./CLAUDE.md\` | 全團隊共享，記錄架構、標準、常用工作流程 |
| 使用者記憶 | \`~/.claude/CLAUDE.md\` | 個人偏好與搜尋條件，例如 code style 或工具快捷指令 |
| 專案本地記憶 | \`./CLAUDE.local.md\` | 不推到遠端的個人專案設定；這個方式即將淘汰 |

專案記憶最適合放團隊共識。使用者記憶則適合放個人習慣，例如偏好的測試方式、commit message 格式或常用工具。

## CLAUDE.md 應該寫哪些內容？

好的 CLAUDE.md 要結構化、具體、長久適用。Claude Code 需要的是可重複使用的工作規則，不是一次性任務備忘錄。

可以優先放入這幾類內容：

| 類型 | 適合內容 |
| --- | --- |
| 專案架構 | 專案目標、邏輯分層、資料流程、第三方服務 |
| 開發規範 | 測試指令、branch 流程、commit message 格式 |
| 典型指令集 | \`npm run build\`、\`@scripts/test.sh\`、部署前檢查 |
| 個人偏好 | tabs 或 spaces、回覆風格、搜尋條件 |

我的重點是「結構化、具體、長久適用」。例如「請寫好程式」太抽象；「改動資料層後先跑 \`npm run test:data\`」就比較有幫助。

## CLAUDE.md 可以匯入其他檔案嗎？

CLAUDE.md 可以使用 \`@path/to/import\` 語法匯入其他檔案。這能避免把所有規則塞在單一檔案裡。

範例：

\`\`\`text
See @README for project overview and @package.json for available npm commands for this project.

# Additional Instructions
- git workflow @docs/git-instructions.md
\`\`\`

Claude Code 允許相對路徑與絕對路徑。匯入的檔案也可以再匯入其他檔案，我記錄的最大深度為 5。使用者可以透過 \`/memory\` 命令查看目前載入了哪些記憶檔案。

使用者記憶也可以引用個人檔案：

\`\`\`text
# Individual Preferences
- @~/.claude/my-project-instructions.md
\`\`\`

## 一份實用的 CLAUDE.md 可以長什麼樣子？

CLAUDE.md 範例應先交代專案，再交代工作方式。AI 編碼工具讀到的第一批資訊，應該足以判斷專案技術棧與常用流程。

以下是我整理過的 Next.js 專案記憶架構：

\`\`\`markdown
# 專案指南

## 專案概述

這是一個使用 create-next-app 建立的 Next.js 15 應用程式，採用 React 19、TypeScript、Tailwind CSS 和 App Router。

## 架構與結構

- \`src/app/\`：App Router 目錄
- \`src/app/layout.tsx\`：根佈局
- \`src/app/page.tsx\`：首頁
- \`public/\`：靜態資源

## 開發命令

- \`npm run dev\`：啟動開發伺服器
- \`npm run build\`：建立生產版本
- \`npm run lint\`：執行 ESLint

## Claude Code 最佳實踐

1. 遵循 App Router 模式。
2. 新檔案優先使用 TypeScript。
3. 主要使用 Tailwind 實用類別。
4. 提交前執行 lint 與測試。
\`\`\`

這類文件不需要華麗，但要讓 Claude Code 知道「這個 repo 怎麼工作」。

## CLAUDE.md 要避免寫什麼？

CLAUDE.md 不適合放短期任務、過期決策或沒有判斷標準的偏好。記憶檔案越雜，Claude Code 越難分辨真正重要的規則。

建議避免：

- 已經完成的一次性 TODO。
- 沒有上下文的片段指令。
- 和現有程式碼不一致的舊架構說明。
- 只有口號、沒有操作方式的開發原則。
- 不應分享給團隊的個人資料或密鑰。

一份好記憶文件的資訊增益，在於把團隊平常口耳相傳的規則變成可讀、可維護、可被 AI 引用的文字。

## 常見問題
### CLAUDE.md 和 README 有什麼差別？

README 通常寫給人讀，介紹專案用途、安裝方式與基本操作。CLAUDE.md 更像寫給 Claude Code 的工作規則，重點是讓 AI 在改程式時遵守專案慣例。

### CLAUDE.md 要不要放進 Git？

團隊共用的 \`./CLAUDE.md\` 建議放進 Git。個人偏好或私有設定應放在使用者記憶，例如 \`~/.claude/CLAUDE.md\`。

### Claude Code 記憶檔案可以引用 package.json 嗎？

可以。CLAUDE.md 可用 \`@package.json\` 引用檔案，讓 Claude Code 讀取可用 scripts 與依賴資訊。

### CLAUDE.md 寫越多越好嗎？

CLAUDE.md 不是越長越好。最有用的內容是穩定、具體、可執行的專案規則；雜訊太多會降低記憶品質。

### 如何確認 Claude Code 載入了哪些記憶？

可以使用 \`/memory\` 命令查看已載入的記憶檔案。若 Claude Code 的行為和預期不同，先檢查記憶檔案是否過期或互相衝突。

## 參考資料
- Anthropic，〈[Claude Code documentation](https://docs.anthropic.com/en/docs/claude-code)〉。

## 延伸閱讀

- [Claude Code介紹和使用建議](/post/claude-code-intro-and-tips)：同樣聚焦 Claude Code、CLAUDE.md，可接著比較不同情境的做法。
- [如何讓 Claude Code 在 Git Commit 時傳送手機通知？](/post/claude-code-commit-mobile-notification)：同樣聚焦 Claude Code、AI程式工具，可接著比較不同情境的做法。
- [Claude Code 終端操作技巧與 SDK 應用](/post/claude-code-cli-sdk-tips)：同樣聚焦 Claude Code，可接著比較不同情境的做法。

## 最後更新

2026-08-28

`;export{e as default};