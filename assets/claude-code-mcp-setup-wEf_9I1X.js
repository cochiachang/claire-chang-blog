var e=`---
title: Claude Code 使用 MCP 功能設定教學
description: 說明 MCP 的架構、Claude Code 新增 MCP Server 的方式，以及 Firecrawl MCP 的實作步驟。
date: 2025-07-23
category: 生成式AI
tags: [Claude Code, MCP, Firecrawl, AI工具]
readingTime: 6 分鐘
image: /images/tech/image-12.webp
imageAlt: MCP 架構中 Host、Client 與 Server 的關係示意圖
---


# Claude Code 使用 MCP 功能設定教學

Claude Code 可以透過 Model Context Protocol（MCP）連接外部工具、資料庫與 API。MCP 的價值在於把工具整合變成標準協議，讓 AI 不必為每個服務重寫客製 glue code。

## MCP 為什麼重要？

MCP 解決大型語言模型無法直接使用外部工具與即時資料的問題。MCP Server 將功能公開成標準工具，Claude Code 這類 Host 就能安全呼叫。

現有 LLM 模型很強，但常見限制包括：

- 無法即時查資料，容易受知識截止限制。
- 無法直接串接 ERP、CI/CD、CRM 或內部 API。
- 每個整合都要 hardcode，缺少共通標準。

| 問題 | MCP 解法 |
|---|---|
| AI 不能接 CRM 或 API | MCP Server 公開標準工具讓 AI 使用 |
| 每個模型都要客製整合 | MCP 提供共通協議 |
| 整合效率低 | 用標準協議連接，減少重寫 glue code |
| 缺乏即時專業資料 | MCP Server 可串接資料庫或第三方 API |

## MCP 架構有哪些角色？

MCP 架構主要由 Host、Client 與 Server 組成。Host 是使用者操作的 AI 工具，Client 負責溝通，Server 提供可被呼叫的工具。

![MCP 架構示意圖](/images/tech/image-12.webp)

| 元件 | 說明 |
|---|---|
| Host | AI 模型平台，例如 Claude Code 或 GitHub Copilot |
| Client | 負責與 MCP Server 溝通的代理程式 |
| Server | 提供工具功能的 MCP Server，例如 Firecrawl 或 Notion MCP |

MCP 常見通訊方式包括：

- \`stdio\`：用於本地執行程式。
- \`http + SSE\`：用於網路 API 或第三方系統。
- \`streamable HTTP\`：用於較新的 HTTP 型 MCP Server。

## 哪些 MCP Server 適合入門？

入門 MCP Server 應選擇用途明確、驗證容易、風險可控的服務。Firecrawl、Time MCP 與 Playwright MCP 都適合做第一批測試。

| 名稱 | 功能 | 備註 |
|---|---|---|
| Firecrawl | 網站爬蟲 | 支援 JSON、Markdown 回傳 |
| Notion MCP | 讀寫 Notion database | 適合知識庫整合 |
| Perplexity Ask | 接入 Sonar API 問答與研究 | 需要 API 金鑰 |
| Time MCP | 查詢世界時間 | 適合簡單 demo |
| Playwright MCP | 操控瀏覽器、截圖、擷取資料 | 適合自動化測試 |

本文的實務建議是先用查詢型或讀取型 Server 做測試，再接寫入型工具。這樣比較容易觀察權限、輸出格式與錯誤處理。

## Claude Code 如何新增 MCP Server？

Claude Code 可以用 \`claude mcp add\` 新增 stdio、SSE 或 HTTP MCP Server。新增後用 \`claude mcp list\` 確認連線狀態。

新增 stdio 伺服器：

\`\`\`bash
claude mcp add <name> <command> [args...]
claude mcp add my-server -e API_KEY=123 -- /path/to/server arg1 arg2
\`\`\`

新增 SSE 伺服器：

\`\`\`bash
claude mcp add --transport sse <name> <url>
claude mcp add --transport sse sse-server https://example.com/sse-endpoint
claude mcp add --transport sse api-server https://api.example.com/mcp --header "X-API-Key: your-key"
\`\`\`

新增 HTTP 伺服器：

\`\`\`bash
claude mcp add --transport http <name> <url>
claude mcp add --transport http http-server https://example.com/mcp
claude mcp add --transport http secure-server https://api.example.com/mcp --header "Authorization: Bearer your-token"
\`\`\`

管理 MCP Server：

\`\`\`bash
claude mcp list
claude mcp get my-server
claude mcp remove my-server
\`\`\`

## 如何在 Claude Code 新增 Firecrawl MCP？

Firecrawl MCP 適合示範 Claude Code 如何抓取網頁並回傳可處理資料。Windows 本機使用 \`npx\` 時，通常需要 \`cmd /c\` 包裝器。

![Firecrawl MCP 安裝說明截圖](/images/tech/image-13-1024x182.webp)

安裝流程：

1. 到 Firecrawl 申請 API Key。
2. 設定環境變數 \`FIRECRAWL_API_KEY\`。
3. 安裝 \`firecrawl-mcp\`。

\`\`\`bash
npm install -g firecrawl-mcp
\`\`\`

4. 在 Claude Code 設定 MCP。

\`\`\`bash
claude mcp add firecrawl-mcp -- cmd /c npx -y firecrawl-mcp
\`\`\`

5. 確認連線狀態。

\`\`\`bash
claude mcp list
\`\`\`

![Claude Code MCP Connected 狀態截圖](/images/tech/image-15.webp)

出現 \`Connected\` 代表 Claude Code 已經能使用 Firecrawl MCP。接著就可以在 Claude Code 裡要求 Firecrawl 抓取網頁。

![Claude Code 使用 Firecrawl MCP 抓取網頁截圖](/images/tech/image-16.webp)

## 常見問題
### MCP 是什麼？

MCP 是 Model Context Protocol，用來讓 AI 工具用標準方式連接外部工具與資料來源。MCP 可以降低每個工具都要重寫整合邏輯的成本。

### Claude Code 一定要用 MCP 嗎？

Claude Code 不一定要用 MCP。若只處理本地檔案與程式碼，內建能力通常已足夠；若要連接第三方 API、資料庫或瀏覽器工具，MCP 會更有彈性。

### stdio MCP 和 HTTP MCP 有什麼差別？

stdio MCP 通常在本機執行，適合命令列工具。HTTP MCP 透過網路呼叫，適合遠端 API 或第三方服務。

### Firecrawl MCP 需要 API Key 嗎？

Firecrawl MCP 通常需要 Firecrawl API Key。實作時不要把 API Key 寫進文章、Git repo 或共享設定檔。

### Claude Code MCP 連不上怎麼排查？

先用 \`claude mcp list\` 看狀態，再確認 command、環境變數、API Key 與網路連線。Windows 環境下也要檢查是否需要 \`cmd /c\` 包裝。

## 參考資料
- Model Context Protocol 官方文件：[https://modelcontextprotocol.io](https://modelcontextprotocol.io)
- Firecrawl MCP Server：[https://github.com/mendableai/firecrawl-mcp-server](https://github.com/mendableai/firecrawl-mcp-server)

## 延伸閱讀

- [Claude Code MCP scope 如何選擇 Local、Project 與 User](/post/claude-code-mcp-scopes)：同樣聚焦 Claude Code、MCP，可接著比較不同情境的做法。
- [Claude Code介紹和使用建議](/post/claude-code-intro-and-tips)：同樣聚焦 Claude Code、MCP，可接著比較不同情境的做法。
- [自己撰寫一個簡單的 MCP：Model Context Protocol 入門實作](/post/simple-mcp-server-implementation)：同樣聚焦 MCP、Claude Code，可接著比較不同情境的做法。

## 最後更新

Wed Jul 23 2025 08:00:00 GMT+0800 (Taiwan Standard Time)
`;export{e as default};