var e=`---
title: Framelink Figma MCP 完整教學：讓 AI 直接讀取 Figma 設計稿生成程式碼
description: Framelink Figma MCP 伺服器能讓 Cursor 等 AI 程式碼工具直接存取 Figma 設計檔，把設計元數據轉譯成程式碼。本文整理功能介紹、Figma Access Token 申請、MCP 設定範例（macOS/Linux 與 Windows）、實際操作流程，以及設計檔命名與提示詞的最佳實踐。
date: 2025-07-24
category: 生成式AI
tags: [Figma MCP, MCP, Cursor, AI 程式設計, Figma]
readingTime: 6 分鐘
image: /images/tech/hero_framelink-figma-mcp.webp
imageAlt: 筆電螢幕上的 UI 按鈕樣式設計特寫，象徵從 Figma 設計稿生成程式碼
---


# Framelink Figma MCP 完整教學：讓 AI 直接讀取 Figma 設計稿生成程式碼

Framelink Figma MCP 伺服器是一個專為 AI 程式碼工具（例如 Cursor）設計的橋接工具，它讓代理（agent）能夠直接存取 Figma 設計檔案，並將其轉譯為程式碼。比起單純貼上螢幕截圖給 AI 看，這條路徑更準確、更高效。這篇筆記整理我在設定與實際使用 Framelink Figma MCP 時的完整流程與最佳實踐。

## 什麼是 Framelink Figma MCP？為什麼比貼截圖更好？

透過 MCP（Model Context Protocol）伺服器，Cursor 能從 Figma 取得簡化後的設計元數據，例如版面配置與樣式，並生成對應的程式碼。這不僅大幅提升 AI 模型的準確度，也提升了回應的關聯性與品質——截圖會丟失圖層結構、間距數值與元件命名，而 MCP 拿到的是結構化的設計資料。

它的主要特色包括：

- **一次性完成設計實作**：可直接在任意框架中生成可用 UI 元件。
- **無需手動轉譯設計**：省去工程師對設計稿「讀圖寫碼」的時間。
- **多語言支援**：支援 English、韓文、日文、簡體中文等語系。
- **MIT 授權**：自由使用與修改。
- **社群支援**：可加入 Discord 討論、追蹤 Twitter。

## 如何取得 Figma 存取權杖（Access Token）？

在開始使用 MCP 前，需要先產生一組 Figma API 權杖：

1. 開啟 [Figma 首頁](https://www.figma.com/)，點選左上角個人頭像，選擇「Settings」。
2. 點選「Security」分頁。
3. 捲動到「Personal access tokens」區塊，點選「Generate new token」。
4. 為此權杖命名，**並確保啟用「File content」與「Dev resources」的讀取權限**。
5. 點選「Generate token」，將出現的 token 儲存下來。

詳細教學可參考 [Figma Access Token 說明](https://www.figma.com/developers/api#access-tokens)。

## 如何在 IDE 中設定 Framelink Figma MCP？

大多數現代 IDE 都支援以 JSON 格式設定 MCP 伺服器。以下提供適用於 macOS/Linux 與 Windows 的設定範例。

macOS / Linux：

\`\`\`json
{
  "mcpServers": {
    "Framelink Figma MCP": {
      "command": "npx",
      "args": [
        "-y",
        "figma-developer-mcp",
        "--figma-api-key=YOUR-KEY",
        "--stdio"
      ]
    }
  }
}
\`\`\`

Windows：

\`\`\`json
{
  "mcpServers": {
    "Framelink Figma MCP": {
      "command": "cmd",
      "args": [
        "/c",
        "npx",
        "-y",
        "figma-developer-mcp",
        "--figma-api-key=YOUR-KEY",
        "--stdio"
      ]
    }
  }
}
\`\`\`

記得將 \`"YOUR-KEY"\` 替換為剛才產生的 Figma API token。

## 如何用 Figma 連結實作第一個設計？

### 複製 Figma 框架或群組的連結

由於 Figma 設計檔案的資料量龐大，MCP 伺服器會自動壓縮資料，減少約 90%。即便如此，建議一次實作「一個區塊」，確保輸出品質最佳。

在 Figma 中：

1. 右鍵點選要實作的 Frame 或 Group。
2. 選擇「Copy/Paste as → Copy link to selection」。

### 在 IDE 中貼上連結並發送請求

將上述連結貼到 IDE 的對話介面中（如 Cursor 的 Agent 模式），輸入簡單請求：

\`\`\`text
實作這個 Figma frame。
\`\`\`

系統會呼叫 MCP 的 \`get_figma_data\` 函式，取得設計資料並自動產出對應的程式碼。

> 補充上下文說明（如：使用目的、期望技術堆疊等）有助於提升輸出品質。

## Figma 設計檔要怎麼整理，AI 才看得懂？

雖然 MCP 伺服器能大幅簡化從設計到程式碼的轉換流程，但 Figma 的檔案結構與命名方式仍會直接影響 AI 的理解效果。建議遵循以下設計原則：

- **使用 Auto Layout（自動排版）**：MCP 尚未完全支援浮動（floating）或絕對定位（absolute positioning）元素，使用 Auto Layout 可讓排版更清楚易讀。
- **為 Frame 與 Group 命名**：有意義的命名可幫助 AI 建立語意上的對應，避免出現一堆 \`div-123\` 或 \`group-456\` 的結構。
- **專業小技巧**：Figma 內建 AI 命名工具可快速為元件自動命名，請善加利用！

## 提示詞要怎麼寫，生成品質才會好？

即使 MCP 幫你處理了設計資料的轉換，仍需提供足夠的上下文，才能讓 AI 模型生成最符合需求的程式碼。編輯器端的提示最佳化方式：

- **說明你在使用什麼技術堆疊**：讓 AI 知道是否要使用 Tailwind CSS、React、Vue 等。
- **引用程式碼中的關鍵檔案**：例如「請依照 \`Button.tsx\` 的風格來實作這個 UI」，有助於維持一致性。
- **除了貼 Figma 連結，也加上文字描述**：描述這個區塊的功能、使用者互動方式、期望行為等，可提升準確性。
- **管理上下文大小**：與其貼整份 Figma 檔案，**建議只貼 Frame 或 Group 的連結**，避免 AI 過載無關資訊。

## 最佳實踐總結

| 類別 | 建議做法 | 原因 |
| --- | --- | --- |
| Figma 設計 | 使用 Auto Layout | 讓排版結構有邏輯、便於解析 |
| Figma 元件命名 | 命名清楚，語意明確 | 提升生成程式碼的可讀性與一致性 |
| AI 提示語境 | 指定技術環境 | 讓 AI 採用正確框架與語法 |
| 程式碼參考 | 引用現有元件 | 保持風格一致 |
| 資訊控制 | 精簡設計範圍 | 避免模型被多餘細節干擾 |

## 常見問題

### Framelink Figma MCP 是什麼？

它是一個開源（MIT 授權）的 MCP 伺服器，專為 Cursor 等 AI 程式碼工具設計，讓 AI 代理直接透過 Figma API 讀取設計檔的簡化元數據，而不是靠截圖猜測版面，藉此生成更準確的程式碼。

### 為什麼用 MCP 讀 Figma 比貼截圖更準？

截圖會丟失圖層結構、間距與元件命名等語意資訊；MCP 取得的是結構化的設計元數據（並自動壓縮約 90%），AI 能直接對應到版面配置與樣式，生成結果的準確度與關聯性都更好。

### Figma Access Token 需要開哪些權限？

至少要啟用「File content」與「Dev resources」的讀取權限，MCP 伺服器才有辦法透過 Figma API 讀取設計檔內容。權杖產生後請妥善保存。

### 一次該實作多大的設計範圍？

建議一次只貼一個 Frame 或 Group 的連結，而不是整份 Figma 檔案。即使 MCP 已自動壓縮約 90% 的資料量，範圍越小，AI 越不容易被無關細節干擾，輸出品質越穩定。

### 設計檔要怎麼準備才能讓 AI 生成更好的程式碼？

優先使用 Auto Layout 排版（MCP 對浮動與絕對定位支援有限），並為 Frame 與 Group 取有意義的名稱，避免 \`group-456\` 這類預設命名。Figma 內建的 AI 命名工具可以加速這件事。

### 提示詞有哪些提升品質的技巧？

明確說明技術堆疊（React、Vue、Tailwind CSS 等）、引用既有元件檔案作為風格參考，並在 Figma 連結之外補上功能與互動的文字描述。上下文越具體，生成結果越貼近需求。

## 參考資料

- [Framelink Figma MCP Server（GitHub）](https://github.com/GLips/Figma-Context-MCP)
- [Figma Access Token 官方說明](https://www.figma.com/developers/api#access-tokens)

## 延伸閱讀

- [Claude Code 使用 MCP 功能設定教學](/post/claude-code-mcp-setup)：同樣聚焦 MCP，可接著比較不同情境的做法。
- [Claude Code MCP scope 如何選擇 Local、Project 與 User](/post/claude-code-mcp-scopes)：同樣聚焦 MCP，可接著比較不同情境的做法。
- [自己撰寫一個簡單的 MCP：Model Context Protocol 入門實作](/post/simple-mcp-server-implementation)：同樣聚焦 MCP，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2025-07-24，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};