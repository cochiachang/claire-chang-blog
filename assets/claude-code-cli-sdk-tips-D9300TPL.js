var e=`---
title: Claude Code 終端操作技巧與 SDK 應用
description: 整理 Claude Code CLI 快捷鍵、bash 模式、SDK 應用、多 session 工作流與安全設定。
date: 2025-07-24
category: 生成式AI
tags: [Claude Code, CLI, SDK, AI開發]
readingTime: 5 分鐘
image: /images/tech/1_o_G4aq694zbLs4y6gEf1jQ.webp
imageAlt: Claude Code 終端操作與 AI 開發工作流示意圖
---


# Claude Code 終端操作技巧與 SDK 應用

Claude Code 的 CLI 設計讓 AI 開發流程可以留在終端機內完成。開發者可以用快捷鍵、bash 模式、記憶標記、SDK 與多 session，把測試、修正、報告與自動化流程串在一起。

## 為什麼 Claude Code 選擇 CLI 而不是 IDE Plugin？

Claude Code 選擇 CLI 是為了跨工具、跨環境與自動化流程。CLI 可以同時服務 VSCode、JetBrains、Vim、Emacs、SSH 與 CI/CD 場景。

Anthropic 選擇打造 CLI 而非只做 IDE Plugin，背後有幾個原因：

- 使用者偏好多樣，CLI 可跨 VSCode、JetBrains、Vim、Emacs 與終端機。
- AI 模型會根據上下文自動驅動流程，IDE 的 GUI 操作權重會下降。
- CLI 可串接 CI/CD、bash 與 SDK 工具，適合組成 AI-driven pipeline。

這也是 Claude Code 和一般程式碼補全工具不同的地方：Claude Code 更像能理解專案上下文的終端協作者。

## Claude Code 有哪些鍵盤操作快捷指令？

Claude Code 的快捷鍵讓開發者不用離開終端機就能接受建議、中斷任務、執行指令與寫入記憶。熟悉快捷鍵會明顯降低上下文切換成本。

| 鍵位操作 | 功能說明 |
|---|---|
| \`Shift + Tab\` | 接受 Claude 回傳的編輯建議，尤其適合程式碼區塊 |
| \`ESC\` | 中斷當前任務，不破壞 session 或遺失進度 |
| \`!\` + 指令 | 進入 bash 模式，執行指令並納入上下文 |
| \`#\` + 記憶內容 | 標記要 Claude 記住的專案設定或操作規則 |

日常開發可以養成 \`#\` 標記習慣，例如：

\`\`\`text
# 我們的 staging deploy 用的是 deploy-stg.sh，不要混用 prod
\`\`\`

這類筆記會讓 Claude Code 在後續 decision making 中避開錯誤環境。

## Bash 模式如何整合 CLI 操作？

Claude Code 的 bash 模式可以直接執行終端指令，並把 stdout 結果納入對話。這讓修 lint、跑測試與分析錯誤輸出更連續。

直接輸入：

\`\`\`bash
!npm run lint
\`\`\`

Claude Code 會執行指令、顯示輸出，並根據結果提供後續建議。也可以在 \`CLAUDE.md\` 宣告常用別名：

\`\`\`bash
## Custom Commands
!test-api: curl http://localhost:3000/test
\`\`\`

本文保留的實務判斷是：把只讀檢查、測試、格式化做成固定命令，讓 Claude Code 能重複執行；部署、刪除、資料庫遷移則維持人工確認。

## Claude Code SDK 可以做什麼？

Claude Code SDK 適合把 prompt、工具使用與輸出格式接進自動化流程。SDK 可以把 Claude Code 從互動工具延伸成 CI 或內部平台的一部分。

Claude Code SDK 常見能力包括：

- 傳入 prompt 並指定工具，例如 \`bash\`、\`format\`、\`test\`。
- 輸出 JSON、Markdown 或純文字。
- 指定 context 限制，控制 Claude 的記憶範圍。

| 用途 | 操作方式 |
|---|---|
| CI 自動產生 PR 說明 | Pipe git diff → Claude → 輸出 summary |
| ML 模型監控報告 | 將 inference logs 餵給 Claude，整理異常報告 |
| 雲端資源管理 | 將 GCP 或 AWS CLI 結果交給 Claude 分析 |
| Incident 回報格式化 | 將 Zabbix 或 Grafana alert log 轉成報告或修復提議 |

## 多重 Session 如何提升效率？

多重 Claude Code session 適合平行處理開發、測試、log 分析與文件整理。每個 session 有不同上下文，可以降低任務互相污染的風險。

熟練使用者常見搭配方式：

- 在 SSH session 中同時開啟多個 Claude Code。
- 用 \`tmux\`、\`byobu\` 或 \`screen\` 分割畫面。
- 一個 session 做 API 實作，另一個 session 跑測試或分析 log。
- 每個 session 維持不同 prompt log 與 context。

若任務彼此高度相關，建議保留同一個 session。若任務目標不同，例如前端 UI 與後端部署排查，拆 session 會比較乾淨。

## Claude Code 執行 bash 指令時要注意什麼？

Claude Code 可以執行 bash 指令，因此需要分層權限與高風險指令審核。安全設定的目標是讓例行操作自動化，讓破壞性操作保留人工確認。

建議安全機制包括：

- 預設只允許只讀類指令，例如 \`cat\`、\`ls\`、\`git status\`。
- 寫入類或系統操作指令需要人工確認或提前白名單。
- 複合高風險指令，例如 \`curl | bash\`，應視為需要暫停審核的行為。
- 透過 \`CLAUDE.md\` 定義哪些指令可自動執行、哪些需要人工審核。

原文提到的 \`Cloude.md\` 應修正為 \`CLAUDE.md\`，避免團隊文件命名不一致。

## Claude Code 支援哪些多模態輸入？

Claude Code CLI 不只處理文字 prompt，也能處理圖片、檔案路徑與 log 檔。多模態輸入適合 UI 檢查、OCR、測試輸出與錯誤診斷。

常見用法包括：

- 拖曳圖片進 CLI，讓 Claude Code 做 OCR 或 UI 檢查。
- 貼上 \`/tmp/screenshot.png\` 這類路徑，讓 Claude Code 載入檔案分析。
- 上傳 log、test output、build summary，讓 Claude Code 找出可疑錯誤。

例如拖入 \`error.png\`，Claude Code 可以判斷是否有 layout shift bug；拖入 \`test-results.json\`，Claude Code 可以根據失敗測試追錯。

## 常見問題
### Claude Code CLI 適合新手嗎？

Claude Code CLI 適合願意使用終端機的新手。若完全不熟 CLI，建議先從讀檔、跑測試、整理錯誤輸出這些低風險任務開始。

### Claude Code 的 \`#\` 記憶標記適合放什麼？

\`#\` 記憶標記適合放專案慣例、部署規則、禁止事項與常用命令。不要放密碼、token 或私人資料。

### Claude Code 可以直接跑部署指令嗎？

Claude Code 技術上可以跑部署指令，但正式環境部署應保留人工確認。建議把部署指令列入需要 approval 的高風險操作。

### Claude Code SDK 適合用在哪些自動化場景？

Claude Code SDK 適合 CI 摘要、log 分析、PR 說明、例行報告與雲端資源巡檢。這些任務的共同點是輸入格式固定、輸出格式可規範。

### Claude Code 多 session 會不會互相影響？

不同 Claude Code session 通常有各自的上下文。若同時修改同一批檔案，仍要靠 Git 狀態與人工協調避免衝突。

## 參考資料
- Anthropic Claude Code 文件：[https://docs.anthropic.com/en/docs/claude-code](https://docs.anthropic.com/en/docs/claude-code)

## 延伸閱讀

- [紀錄 Claude Code 曾經下過的指令：終端操作追蹤方法](/post/claude-code-command-history)：同樣聚焦 Claude Code、CLI，可接著比較不同情境的做法。
- [Claude Code介紹和使用建議](/post/claude-code-intro-and-tips)：同樣聚焦 Claude Code，可接著比較不同情境的做法。
- [Claude Code 自動修改 GitHub Issue：用 GitHub CLI 建立修復流程](/post/claude-code-github-issue)：同樣聚焦 Claude Code，可接著比較不同情境的做法。

## 最後更新

Thu Jul 24 2025 08:00:00 GMT+0800 (Taiwan Standard Time)
`;export{e as default};