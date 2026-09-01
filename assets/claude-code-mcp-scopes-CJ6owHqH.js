var e=`---
title: Claude Code MCP scope 如何選擇 Local、Project 與 User
description: 說明 Claude Code MCP 三種 scope 的儲存位置、共享範圍、優先順序與安全使用情境。
date: 2025-07-23
category: 生成式AI
tags: [Claude Code, MCP, AI Agent, 開發工具]
readingTime: 7 分鐘
image: /images/articles/hero_claude-code-mcp-scopes.webp
imageAlt: 筆電螢幕顯示程式碼的開發工作桌
---


# Claude Code MCP scope 如何選擇 Local、Project 與 User

Claude Code MCP scope 決定 MCP server 設定存在哪裡、會在哪些專案載入、以及是否會被團隊共享。一般原則是：敏感金鑰用 Local，團隊共用工具用 Project，個人跨專案常用工具用 User。

## Claude Code MCP scope 是什麼？

Claude Code MCP scope 是 MCP server 設定的作用範圍。Claude Code 目前支援 Local、Project、User 三種主要 scope，並依優先順序處理同名 server。

MCP 是 Model Context Protocol，用來讓 Claude Code 連接外部工具、資料庫、API 或本機程式。Claude Code 官方文件說明，MCP server 可讓 Claude Code 直接讀取與操作工具，而不是靠使用者複製貼上資料。

三種 scope 的差異如下：

| Scope | 載入範圍 | 是否團隊共享 | 適合情境 |
|---|---|---|---|
| Local | 目前專案 | 否 | 個人實驗、敏感金鑰、本機私人工具 |
| Project | 目前專案 | 是，透過 \`.mcp.json\` | 團隊共用 server、CI 工具、共用資料源 |
| User | 所有專案 | 否 | 個人跨專案常用工具 |

## Local scope 適合什麼？

Local scope 適合只想在目前專案自己使用的 MCP server。Local scope 不適合放入版本控制，尤其適合含有個人 token 或本機路徑的設定。

新增 local server 可以使用預設 scope，或明確指定 \`--scope local\`：

\`\`\`bash
claude mcp add my-private-server /path/to/server
claude mcp add my-private-server --scope local /path/to/server
\`\`\`

Local scope 的優點是安全與彈性。開發者可以測試新的 MCP server、連接私人工具，或暫時覆蓋 Project scope 的同名 server，而不影響團隊其他人。

## Project scope 適合什麼？

Project scope 適合整個團隊都需要的 MCP server。Project scope 會寫入專案根目錄的 \`.mcp.json\`，因此可以被版本控制與 code review。

新增 project server：

\`\`\`bash
claude mcp add shared-server --scope project /path/to/server
\`\`\`

\`.mcp.json\` 常見格式如下：

\`\`\`json
{
  "mcpServers": {
    "shared-server": {
      "command": "/path/to/server",
      "args": [],
      "env": {}
    }
  }
}
\`\`\`

Project scope 要特別注意安全。Claude Code 啟用 \`.mcp.json\` 內容前會要求使用者批准，因為 project server 可能執行本機 command 或連接外部服務。

## User scope 適合什麼？

User scope 適合個人跨專案都會使用的 MCP server。User scope 不會跟團隊共享，但會在同一個使用者的所有專案中可用。

新增 user server：

\`\`\`bash
claude mcp add my-user-server --scope user /path/to/server
\`\`\`

User scope 常見用途包括個人筆記工具、常用 API connector、跨專案搜尋工具或本機開發輔助 server。若工具只屬於某個 repo，通常不要放在 User scope，否則容易在不相關專案中載入。

## 同名 MCP server 的優先順序怎麼判斷？

Claude Code 遇到同名 MCP server 時，會依 Local、Project、User 的順序選擇最高優先設定。Local scope 可以暫時覆蓋團隊設定。

官方文件列出的優先順序包含：

1. Local scope
2. Project scope
3. User scope
4. Plugin-provided servers
5. claude.ai connectors

這個規則對排錯很重要。如果 \`.mcp.json\` 看起來正確，但 Claude Code 連到另一個 endpoint，應先檢查 Local 或 User scope 是否有同名 server。

## \`.mcp.json\` 可以怎麼處理環境變數？

\`.mcp.json\` 支援環境變數展開，適合讓團隊共享結構但保留個別環境差異。敏感值應放在環境變數，不應直接提交到 repo。

常見語法：

| 語法 | 說明 |
|---|---|
| \`\${VAR}\` | 插入環境變數 \`VAR\` 的值 |
| \`\${VAR:-default}\` | 沒有 \`VAR\` 時使用 \`default\` |

範例：

\`\`\`json
{
  "mcpServers": {
    "api-server": {
      "type": "http",
      "url": "\${API_BASE_URL:-https://api.example.com}/mcp",
      "headers": {
        "Authorization": "Bearer \${API_KEY}"
      }
    }
  }
}
\`\`\`

如果必要環境變數沒有設定，也沒有 default，Claude Code 啟動時會解析失敗。

## 常見問題

### Claude Code MCP 的 Local scope 會被 commit 嗎？

Local scope 不應被 commit。Local scope 適合個人設定、測試 server 與敏感金鑰。

### 團隊共用 MCP server 應該用哪個 scope？

團隊共用 MCP server 應該用 Project scope，並把 \`.mcp.json\` 放入版本控制。敏感 token 仍應使用環境變數。

### User scope 和 Local scope 差在哪裡？

User scope 會在個人所有專案中載入，Local scope 只在目前專案載入。跨專案常用工具用 User，專案專用或敏感設定用 Local。

### 同名 server 為什麼沒有使用 \`.mcp.json\` 的設定？

最常見原因是 Local scope 或 User scope 有同名 server。Claude Code 會優先採用 Local，再採用 Project，最後才是 User。

### \`.mcp.json\` 可以放 API key 嗎？

\`.mcp.json\` 不建議直接放 API key。比較好的做法是使用 \`\${API_KEY}\` 環境變數展開，並在每位開發者本機或 secret manager 中設定值。

## 參考資料

- Claude Code Docs, Connect Claude Code to tools via MCP: <https://code.claude.com/docs/en/mcp>
- Model Context Protocol: <https://modelcontextprotocol.io/>

## 延伸閱讀

- [Claude Code 使用 MCP 功能設定教學](/post/claude-code-mcp-setup)：同樣聚焦 Claude Code、MCP，可接著比較不同情境的做法。
- [自己撰寫一個簡單的 MCP：Model Context Protocol 入門實作](/post/simple-mcp-server-implementation)：同樣聚焦 MCP、Claude Code，可接著比較不同情境的做法。
- [Claude Code介紹和使用建議](/post/claude-code-intro-and-tips)：同樣聚焦 Claude Code、MCP，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2026-08-28，內容依 Claude Code MCP 官方文件校對 scope 名稱與優先順序。

`;export{e as default};