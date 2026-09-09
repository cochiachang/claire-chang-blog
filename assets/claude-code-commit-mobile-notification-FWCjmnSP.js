var e=`---
title: 如何讓 Claude Code 在 Git Commit 時傳送手機通知？
description: 用開源推播服務 ntfy 搭配 CLAUDE.md，讓 Claude Code 修完 bug 並執行 git commit 後自動傳送手機通知。本文介紹 ntfy 安裝、指令用法與完整設定範例。
date: 2025-07-23
category: 生成式AI
tags: [Claude Code, ntfy, Git, AI程式工具, 推播通知]
readingTime: 3 分鐘
image: /images/tech/hero_claude-code-commit-mobile-notification.webp
imageAlt: 開發者一邊操作終端機、一邊查看手機推播通知的畫面
---


# 如何讓 Claude Code 在 Git Commit 時傳送手機通知？

我讓 Claude Code 修 bug 時，常常不知道它什麼時候做完、有沒有順利提交。這篇文章用開源的即時推播服務 ntfy，只要在 CLAUDE.md 加一段 Git 提交流程規則，就能讓 Claude Code 在每次 \`git commit\` 之後自動傳通知到我的手機，整個設定不到五分鐘。

## 什麼是 ntfy？為什麼適合用來做腳本推播？

ntfy（讀作 notify）是一個開源又輕巧的即時推播通知服務。透過 HTTP PUT/POST，你可以輕鬆從腳本、命令列或應用程式發送通知到手機或桌面，不需要自己架伺服器或申請推播憑證。

發送通知只要一行指令：

\`\`\`bash
ntfy publish claire-topic "任務完成！"
\`\`\`

或用 curl：

\`\`\`bash
curl -d "備份成功！" ntfy.sh/claire-topic
\`\`\`

\`claire-topic\` 是自訂的主題名稱，手機 App 訂閱同一個主題就能收到訊息。

## 怎麼安裝 ntfy？

手機先安裝 ntfy App（iOS 版）：

[https://apps.apple.com/tw/app/ntfy/id1625396347](https://apps.apple.com/tw/app/ntfy/id1625396347)

![ntfy iOS App 下載頁面](/images/articles/claude-code-commit-mobile-notification-1.webp)

然後在電腦安裝 ntfy CLI，官網有各種作業系統的版本，把解壓縮後的路徑加入環境變數的 \`PATH\` 即可：

[https://github.com/binwiederhier/ntfy/releases](https://github.com/binwiederhier/ntfy/releases)

![ntfy GitHub Releases 下載頁面](/images/articles/claude-code-commit-mobile-notification-2.webp)

## 如何設定 Claude Code 在 Git Commit 時傳送手機通知？

可以利用 ntfy，設定 Claude Code 在修完 bug 並提交修改之後傳送手機通知。

我們可以在專案的 \`CLAUDE.md\` 加入這段規則：

\`\`\`markdown
**Git 提交流程**
- 每次執行 \`git commit\` 後，必須執行 \`ntfy publish claire-topic "git commit: {commit message}"\`
- AI 應動態使用該次 commit 的實際訊息內容，而非固定文字 {commit message}
- 這將發送提交通知到指定的 ntfy 主題
\`\`\`

設定完成後，Claude Code 每次完成工作並提交，我的手機就會收到推播：

![手機收到 ntfy 推播通知的畫面](/images/articles/claude-code-commit-mobile-notification-3.webp)

## 常見問題

### ntfy 是免費的嗎？

ntfy 是開源軟體，公開的 ntfy.sh 伺服器可以免費使用，也可以自己架設私有伺服器。一般用來做腳本或 AI 工具的任務通知，免費方案就夠用。

### 為什麼要把 ntfy 指令寫在 CLAUDE.md 而不是 Git hook？

寫在 CLAUDE.md 是讓 Claude Code 自己遵守提交流程，設定最簡單，還能動態帶入 commit message。如果想要保證「任何 commit 都會通知」（包括手動 commit），改用 \`post-commit\` Git hook 會更可靠，兩者也可以並用。

### ntfy 的主題（topic）名稱要注意什麼？

topic 名稱就是訂閱頻道，任何知道名稱的人都能發送或接收該主題的訊息。公開伺服器上建議使用難以猜測的名稱，或改用自架伺服器並開啟認證。

## 參考資料

- [ntfy 官方文件](https://docs.ntfy.sh/)
- [ntfy GitHub Releases](https://github.com/binwiederhier/ntfy/releases)
- [ntfy iOS App](https://apps.apple.com/tw/app/ntfy/id1625396347)

## 延伸閱讀

- [Claude Code 的記憶機制：CLAUDE.md 怎麼寫才有用？](/post/claude-code-memory)：同樣聚焦 Claude Code、AI程式工具，可接著比較不同情境的做法。
- [Claude Code介紹和使用建議](/post/claude-code-intro-and-tips)：同樣聚焦 Claude Code，可接著比較不同情境的做法。
- [Claude Code 終端操作技巧與 SDK 應用](/post/claude-code-cli-sdk-tips)：同樣聚焦 Claude Code，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2025-07-23，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};