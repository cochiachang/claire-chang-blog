var e=`---
title: "紀錄 Claude Code 曾經下過的指令：終端操作追蹤方法"
description: 用 Claude Code 的 PostToolUse Hook 搭配 jq，把每次執行過的 Bash 指令自動記錄成文字檔。
date: 2025-07-23
category: 生成式AI
tags: [Claude Code, CLI, 開發工具]
readingTime: 5 分鐘
image: /images/tech/hero_claude-code-github-issue.webp
imageAlt: 紀錄 Claude Code 曾經下過的指令：終端操作追蹤方法 技術文章封面圖
---


# 紀錄 Claude Code 曾經下過的指令：終端操作追蹤方法

Claude Code 的 Hooks 功能，可以拿來自動記錄每次執行過的指令。官方文件在這裡：

- [Hooks 教學](https://docs.anthropic.com/en/docs/claude-code/hooks-guide)
- [Hooks 參考文件](https://docs.anthropic.com/en/docs/claude-code/hooks)

## Claude Code Hooks 是什麼？

Hooks 是在 Claude Code 不同階段可以自訂執行的 shell 命令或腳本，會在特定事件觸發時自動執行。它可以讓你建立穩定而非隨機的行為，不必透過提示讓 Claude 記得執行特定動作，適合作業自動化、格式化、權限控管等用途。

Claude Code 提供以下幾種 hook 事件：

- **PreToolUse**：在 Claude 使用工具前觸發，可控制是否要阻擋或允許
- **PostToolUse**：工具使用後觸發，適合執行後續處理
- **Notification**：Claude 發出通知（如等待回應）時觸發
- **UserPromptSubmit**：使用者送出 prompt 時觸發
- **Stop**：主要互動結束時觸發（非中斷行為）
- **SubagentStop**：子任務完成後觸發

## 怎麼設定 Hook 來記錄指令？

在專案資料夾底下的 \`.claude/settings.toml\` 或 \`.claude/settings.json\` 加上 hook 配置。例如要記錄每次 Bash 指令：

\`\`\`json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '\\"\\\\(.tool_input.command) - \\\\(.tool_input.description // \\"No description\\")\\"' >> ./.claude/bash-command-log.txt"
          }
        ]
      }
    ]
  }
}
\`\`\`

這段設定的邏輯是：每次 \`PostToolUse\` 觸發、且工具是 \`Bash\` 時，就用 \`jq\` 從事件資料裡取出實際執行的指令與說明，附加寫進 \`.claude/bash-command-log.txt\`。

## 怎麼安裝 jq？

上面的 hook 指令依賴 \`jq\` 這個 JSON 處理工具，也可以直接請 Claude Code 幫忙安裝：

**Windows：**

\`\`\`bash
# 使用 Scoop
scoop install jq

# 使用 Chocolatey
choco install jq

# 使用 winget
winget install jqlang.jq
\`\`\`

**macOS：**

\`\`\`bash
# 使用 Homebrew
brew install jq

# 使用 MacPorts
sudo port install jq
\`\`\`

**Linux (Ubuntu/Debian)：**

\`\`\`bash
sudo apt update
sudo apt install jq
\`\`\`

**Linux (CentOS/RHEL)：**

\`\`\`bash
sudo yum install jq
# 或
sudo dnf install jq
\`\`\`

**Linux (Arch)：**

\`\`\`bash
sudo pacman -S jq
\`\`\`

## 設定完成後會看到什麼結果？

設定好之後，\`.claude/bash-command-log.txt\` 就會累積一份文字檔，紀錄過去 Claude Code 曾經執行過的每一條 Bash 指令與說明，方便事後回顧或除錯。

## 常見問題

### 這個記錄方式會影響 Claude Code 的執行速度嗎？

影響很小。\`PostToolUse\` hook 是在工具執行完成後才觸發的追加寫入動作，不會擋住 Claude 的下一步操作，頂多多一次 \`jq\` 處理與檔案寫入的時間。

### 只能記錄 Bash 指令嗎？

不是。範例裡的 \`"matcher": "Bash"\` 是把 hook 限定在 Bash 工具上，若把 matcher 換成其他工具名稱，或乾脆拿掉 matcher，就能記錄其他類型的工具呼叫。

### 記錄檔案要放哪裡比較好？

範例是寫進 \`.claude/bash-command-log.txt\`，建議連同 \`.claude/\` 目錄一起排除在版本控制之外（或個別把這個 log 檔加進 \`.gitignore\`），避免把本機操作紀錄誤 commit 上去。

## 參考資料

- [Claude Code Hooks 教學](https://docs.anthropic.com/en/docs/claude-code/hooks-guide)
- [Claude Code Hooks 參考文件](https://docs.anthropic.com/en/docs/claude-code/hooks)

## 延伸閱讀

- [Claude Code 終端操作技巧與 SDK 應用](/post/claude-code-cli-sdk-tips)：同樣聚焦 Claude Code、CLI，可接著比較不同情境的做法。
- [Claude Code MCP scope 如何選擇 Local、Project 與 User](/post/claude-code-mcp-scopes)：同樣聚焦 Claude Code、開發工具，可接著比較不同情境的做法。
- [Claude Code介紹和使用建議](/post/claude-code-intro-and-tips)：同樣聚焦 Claude Code，可接著比較不同情境的做法。

## 最後更新

2026-08-28

`;export{e as default};