var e=`---
title: Claude Code + GitHub Actions 自動修改 Issue 實戰教學
description: 用 Claude Code 搭配 GitHub Actions，在 issue 或 PR 留言 @claude 就能自動產生 PR、修 bug、審查程式碼。本文分享完整安裝步驟、workflow YAML 設定與實際 issue 自動修正範例，讓 AI 直接加入你的 CI 流程。
date: 2025-07-23
category: DevOps
tags: [Claude Code, GitHub Actions, CI/CD, AI程式工具, 自動化]
readingTime: 4 分鐘
image: /images/tech/hero_claude-code-github-actions-auto-fix-issue.webp
imageAlt: Claude Code 與 GitHub Actions 整合安裝畫面截圖
---


# Claude Code + GitHub Actions 自動修改 Issue 實戰教學

我把 Claude Code 接上 GitHub Actions 之後，只要在 issue 或 PR 留言 \`@claude\`，Claude 就會自動讀程式碼、修正問題並提交 PR。這篇筆記整理它的核心功能、安裝步驟、workflow 設定，以及我實際跑的一個 issue 自動修正範例。

## Claude Code + GitHub Actions 能做到哪些事？

- **立即產生 PR、補 bug 或實作功能**：只要在 issue 或 PR 留言 \`@claude implement ...\`，Claude 就會自動完成工作，並提交 PR。
- **自動代碼審查**：PR 中問一句 \`@claude review code level\`，由 AI 幫忙分析與修正錯誤。
- **符合既有專案標準**：Claude 會自動參考專案裡的 \`CLAUDE.md\` 內容，比照程式風格與工程規範。
- **簡易設定，立刻上手**：可以透過 CLI \`/install-github-app\` 快速部署，也可手動安裝 workflow。

## GitHub Actions 要怎麼安裝 Claude Code？

安裝非常簡單，在終端機輸入：

\`\`\`bash
claude
/install-github-app
\`\`\`

接著會出現 GitHub 授權與安裝畫面：

![Claude Code 安裝 GitHub App 的指令畫面](/images/articles/claude-code-github-actions-auto-fix-issue-1.webp)

接著輸入要連接的 repository，這邊我選擇我的開源專案：

[https://github.com/cochiachang/walkassure](https://github.com/cochiachang/walkassure)

![選擇要連接的 repository](/images/articles/claude-code-github-actions-auto-fix-issue-2.webp)

![GitHub App 安裝確認畫面](/images/articles/claude-code-github-actions-auto-fix-issue-3.webp)

![安裝完成的 repository 清單](/images/articles/claude-code-github-actions-auto-fix-issue-4.webp)

接著在 GitHub 設定 Claude 的 API Key：

![在 GitHub 設定 Anthropic API Key](/images/articles/claude-code-github-actions-auto-fix-issue-5.webp)

## workflow 檔案該怎麼設定？

在專案內增加 \`.github/workflows/claude.yml\`。請參考我在 walkassure 專案的設定：[https://github.com/cochiachang/walkassure/tree/main/.github/workflows](https://github.com/cochiachang/walkassure/tree/main/.github/workflows)

\`\`\`yaml
name: Claude AI Workflow

on:
  issues:
    types: [opened, edited, labeled]
  issue_comment:
    types: [created]

jobs:
  claude-analysis:
      runs-on: ubuntu-latest
      if: contains(github.event.issue.body, '@claude') || contains(github.event.comment.body, '@claude')

      steps:
        - name: Checkout code
          uses: actions/checkout@v4

        - name: Claude AI 回應
          uses: anthropics/claude-code-action@beta
          with:
            anthropic_api_key: \${{ secrets.ANTHROPIC_API_KEY }}

        - name: Claude AI 呼叫成功通知
          if: always()
          run: echo "✅ Claude 回應觸發成功！"
  notify:
    runs-on: ubuntu-latest
    needs: [claude-analysis]
    if: always()

    steps:
    - name: Send notification
      run: |
        echo "Workflow completed"
        echo "Claude analysis status: \${{ needs.claude-analysis.result }}"
        echo "Build and test status: \${{ needs.build-and-test.result }}"
\`\`\`

這個 workflow 的重點：只在 issue 內容或留言包含 \`@claude\` 時觸發，呼叫 \`anthropics/claude-code-action\` 讓 Claude 分析並回應，最後再用一個 notify job 回報執行結果。

## 實際跑一個 issue 會發生什麼事？

我在 walkassure 開了一個測試 issue：[https://github.com/cochiachang/walkassure/issues/1](https://github.com/cochiachang/walkassure/issues/1)

![測試用的 issue 內容](/images/articles/claude-code-github-actions-auto-fix-issue-6.webp)

接著就可以看到 Claude 已經回應了一個修正，自動分析問題並提出對應的程式碼修改：

![Claude 自動回應並提出修正](/images/articles/claude-code-github-actions-auto-fix-issue-7.webp)

整個流程從留言到 Claude 回應，完全不需要離開 GitHub，等於把一個隨叫隨到的 AI 工程師放進了 code review 與 issue 處理流程裡。

## 常見問題

### Claude Code + GitHub Actions 的觸發條件是什麼？

在這個設定裡，只有當 issue 內容或 issue 留言包含 \`@claude\` 時，workflow 才會透過 \`contains()\` 條件觸發，避免每個事件都呼叫 API 浪費額度。

### API Key 要放在哪裡？

先在 GitHub repository 的 Settings → Secrets and variables → Actions 新增 \`ANTHROPIC_API_KEY\`，workflow 裡再用 \`\${{ secrets.ANTHROPIC_API_KEY }}\` 引用，不要把 Key 直接寫進 YAML。

### Claude 會不會不遵守專案的程式風格？

不會，Claude 會自動讀取專案內的 \`CLAUDE.md\`，比照既有的程式風格與工程規範來產生修改，所以建議先把專案慣例寫進 \`CLAUDE.md\`。

### 一定要用 /install-github-app 安裝嗎？

不一定，\`/install-github-app\` 只是最快的方式；也可以手動把 workflow YAML 放進 \`.github/workflows/\` 並設定好 Secrets，效果相同。

## 參考資料

- [walkassure 專案](https://github.com/cochiachang/walkassure)
- [walkassure 的 GitHub workflows 設定](https://github.com/cochiachang/walkassure/tree/main/.github/workflows)
- [範例 issue #1](https://github.com/cochiachang/walkassure/issues/1)

## 延伸閱讀

- [Claude Code + GitHub Actions 自動修改 Issue：讓 AI 接手你的 Issue 處理流程](/post/claude-code-github-actions-auto-fix-issue)：同樣聚焦 Claude Code、GitHub Actions，可接著比較不同情境的做法。
- [Claude Code 自動修改 GitHub Issue：用 GitHub CLI 建立修復流程](/post/claude-code-github-issue)：同樣聚焦 Claude Code，可接著比較不同情境的做法。
- [Claude Code 終端操作技巧與 SDK 應用](/post/claude-code-cli-sdk-tips)：同樣聚焦 Claude Code，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2025-07-23，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};