var e=`---
title: Claude Code 自動修改 GitHub Issue：用 GitHub CLI 建立修復流程
description: 說明如何用 GitHub CLI 讓 Claude Code 讀取 Issue、分析程式碼、提出修正、補測試並建立 PR。
date: 2025-07-24
category: 生成式AI
tags: [Claude Code, GitHub CLI, AI程式開發]
readingTime: 6 分鐘
image: /images/tech/hero_claude-code-github-issue.webp
imageAlt: Claude Code 與 GitHub Issue 自動化流程示意圖
---
# Claude Code 自動修改 GitHub Issue：用 GitHub CLI 建立修復流程

Claude Code 可以搭配 GitHub CLI 讀取指定 Issue，將錯誤描述轉成可執行的修復任務。實務上建議把「讀 Issue、找檔案、提出修正、補測試、建立 Pull Request」寫成固定指令，讓每次處理 bug 都有一致的安全邊界。

## Claude Code 如何連接 GitHub Issue？

Claude Code 本身不需要直接存取 GitHub API；GitHub CLI 會負責登入、讀取 Issue 與建立 Pull Request。Claude Code 只要能在專案環境中呼叫 \`gh\` 指令，就能把 Issue 內容納入修復流程。

在 Windows 可用 \`winget\` 安裝 GitHub CLI：

\`\`\`bash
winget install --id GitHub.cli --accept-source-agreements
\`\`\`

安裝後執行登入：

\`\`\`bash
gh auth login
\`\`\`

GitHub CLI 會引導使用者開啟 \`https://github.com/login/device\`，輸入裝置代碼後完成認證。認證完成後，可先用以下指令確認專案與帳號狀態：

\`\`\`bash
gh auth status
gh issue list
\`\`\`

## GitHub CLI 常用哪些指令？

GitHub CLI 的重點不是取代 Git，而是補上 Issue、Pull Request 與 GitHub 互動能力。處理 Issue 自動化時，最常用的是 \`gh issue view\`、\`gh pr create\` 與 \`gh pr list\`。

| 指令 | 用途 |
| --- | --- |
| \`gh repo clone\` | 複製 GitHub repository |
| \`gh issue view 1234\` | 查看指定 Issue 內容 |
| \`gh issue create\` | 建立新 Issue |
| \`gh pr create\` | 建立 Pull Request |
| \`gh pr list\` | 列出 Pull Request |
| \`gh auth login\` | 登入 GitHub CLI |

資訊增益：把這些指令交給 Claude Code 使用前，最好先在終端機手動跑一次。若 \`gh issue view\` 無法取得內容，Claude Code 後續分析再精準也會缺少原始需求。

## 如何建立 Claude Code 修 Issue 的自訂指令？

Claude Code 的自訂指令適合保存重複任務流程。把修 Issue 的步驟寫進 \`.claude/commands\` 後，每次只要提供 Issue 編號，就能讓 Claude Code 依同一套規則開始工作。

建立檔案：

\`\`\`bash
mkdir -p ~/.claude/commands
touch ~/.claude/commands/fix-github-issue.md
\`\`\`

可放入以下內容：

\`\`\`markdown
# Fix GitHub Issue

## 目標
修復 GitHub 上指定 issue 的 bug，並提交一個 Pull Request。

## 步驟

1. 使用 \`gh issue view {input}\` 指令讀取 Issue 編號為 \`{input}\` 的描述內容。
2. 分析問題並找出最可能相關的程式碼區段與檔案。
3. 編寫修正該 bug 的程式碼，先顯示變更建議讓我確認。
4. 編寫對應的測試案例來覆蓋此次修正。
5. 若我確認沒問題，請進行 commit，訊息為 \`fix: resolve issue #{input}\`。
6. 提交 PR，標題為 \`Fix for issue #{input}\`，描述為修正內容與測試方式。
\`\`\`

執行時輸入：

\`\`\`text
/project:fix-github-issue 1234
\`\`\`

## 自動修 Issue 時要加哪些安全限制？

Claude Code 處理 Issue 時應先提出變更方案，再進入實作與提交。這個順序能避免模型直接修改過多檔案，也能讓使用者在 commit 或 PR 之前檢查風險。

建議在指令中固定加入三個限制：

| 限制 | 原因 |
| --- | --- |
| 先讀 Issue 再搜尋檔案 | 避免憑標題猜測問題 |
| 先顯示修正建議 | 讓使用者確認方向與影響範圍 |
| commit 與 PR 前需確認 | 避免未審核變更進入遠端 |

如果團隊已經有測試指令，也可以把 \`npm test\`、\`pytest\`、\`go test ./...\` 等命令寫進流程。沒有測試的專案，至少要求 Claude Code 說明無法驗證的風險。

## 常見問題

### Claude Code 可以直接讀 GitHub Issue 嗎？

Claude Code 可以透過 GitHub CLI 讀取 GitHub Issue。前提是本機已安裝 \`gh\`，並且目前帳號對 repository 有足夠權限。

### 為什麼要把流程寫成自訂指令？

自訂指令可以讓每次修 Issue 都走同一套步驟。固定流程能減少漏看需求、忘記補測試或過早建立 Pull Request 的機率。

### \`gh issue view\` 失敗時怎麼辦？

先執行 \`gh auth status\` 確認登入狀態，再確認目前目錄是否在正確 repository。私有 repository 還需要確認 GitHub 帳號有讀取 Issue 的權限。

### Claude Code 修完後一定要自動 commit 嗎？

不一定。較安全的做法是先讓 Claude Code 完成修改與測試，再由使用者確認 diff 後才 commit。

### 這種流程適合修大型需求嗎？

大型需求應先拆成多個小 Issue。Claude Code 比較適合處理範圍清楚、驗收條件明確、可以用測試驗證的 Issue。

## 參考資料

- GitHub Docs：[GitHub CLI](https://docs.github.com/en/github-cli)
- GitHub CLI Manual：[gh issue view](https://cli.github.com/manual/gh_issue_view)
- GitHub CLI Manual：[gh pr create](https://cli.github.com/manual/gh_pr_create)

## 延伸閱讀

- [Claude Code + GitHub Actions 自動修改 Issue：讓 AI 接手你的 Issue 處理流程](/post/claude-code-github-actions-auto-fix-issue)：同樣聚焦 Claude Code，可接著比較不同情境的做法。
- [Claude Code + GitHub Actions 自動修改 Issue 實戰教學](/post/claude-code-github-actions-auto-fix-issue)：同樣聚焦 Claude Code，可接著比較不同情境的做法。
- [Claude Code 終端操作技巧與 SDK 應用](/post/claude-code-cli-sdk-tips)：同樣聚焦 Claude Code，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2026-08-28。原文重點來自 2026-08-28 的 Claude Code 與 GitHub CLI 操作筆記，本文已補上自動化流程與安全檢查。

`;export{e as default};