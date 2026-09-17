var e=`---
title: Ollama 本地端運行 LLM 服務教學
description: 介紹 Ollama 如何在本機運行大型語言模型、建立自訂模型、使用 API 與選擇常見模型。
date: 2024-07-24
category: 生成式AI
tags: [Ollama, LLM, 本地模型, API]
readingTime: 8 分鐘
image: /images/tech/hero_ollama-local-llm-service.webp
imageAlt: 筆電螢幕顯示程式碼，象徵在本機環境部署與串接 Ollama LLM 服務
---


# Ollama 本地端運行 LLM 服務教學

Ollama 是一個能在本機運行大型語言模型（Large Language Model，LLM）的開源工具。開發者可以用 Ollama 下載模型、建立自訂角色、啟動本地 API，讓敏感資料留在自己的硬體環境中處理。

## Ollama 適合解決什麼問題？

Ollama 適合需要本地執行、快速測試、多模型切換與 API 串接的 LLM 工作流。Ollama 對開發者特別友善，因為主要操作都能用命令列完成。

Ollama 的主要優點包括：

| 優點 | 說明 |
|---|---|
| 本地端運行 | 模型在自己的電腦或伺服器上執行，可降低資料外送風險 |
| 易於使用 | 提供命令列介面與 API，安裝後即可拉取模型 |
| 彈性部署 | 支援 Llama、Mistral、Gemma、Phi 等不同模型 |
| 易於整合 | 可以用 HTTP API 串接自有應用、後端服務或自動化流程 |

Ollama 可用於文字生成、摘要、問答、情感分析、程式碼生成與內部知識庫原型。若目標是快速比較多個模型，Ollama 比手動部署模型伺服器更省時間。

## Ollama 與 LM Studio 差在哪裡？

Ollama 偏向命令列、API 與服務整合，LM Studio 偏向桌面介面與互動測試。若要把本地模型接進後端系統，Ollama 通常更直接。

| 功能 | Ollama | LM Studio |
|---|---|---|
| 原生功能集 | 基本但夠用 | 桌面功能較豐富 |
| 使用介面 | Command line 與 API | 視窗介面 |
| 開源性 | 是 | 是 |
| 支援系統 | Windows、macOS、Linux | Windows、macOS |
| 擴展方式 | 適合 API 呼叫與伺服器整合 | 較偏本地端應用程式 |

Ollama 本身可以當成一個本地 API 服務。這個特性讓線上服務、內部工具或自動化腳本能用 HTTP 呼叫本地模型。

\`\`\`bash
curl http://localhost:11434/api/chat -d '{
  "model": "llama3",
  "messages": [
    { "role": "user", "content": "why is the sky blue?" }
  ]
}'
\`\`\`

## 如何安裝 Ollama？

Ollama 可在 macOS、Windows 與 Linux 安裝。開發者先確認作業系統與硬體記憶體，再選擇適合的模型大小。

常見安裝入口：

- macOS：使用 Ollama 官方下載檔。
- Windows：使用 Ollama Windows 安裝程式。
- Linux：使用官方安裝指令。

\`\`\`bash
curl -fsSL https://ollama.com/install.sh | sh
\`\`\`

安裝後可以用 \`ollama run llama3\` 測試是否能成功下載並啟動模型。

## 如何使用 Ollama 建立自訂模型？

Ollama 使用 \`Modelfile\` 設定基礎模型、temperature 與 system message。這種方式適合建立固定角色、固定語氣或固定任務的本地模型。

先拉取模型：

\`\`\`bash
ollama pull llama3
\`\`\`

建立 \`Modelfile\`：

\`\`\`bash
FROM llama3

PARAMETER temperature 1

SYSTEM """
You are Mario from Super Mario Bros. Answer as Mario, the assistant, only.
"""
\`\`\`

接著建立並執行模型：

\`\`\`bash
ollama create mario -f ./Modelfile
ollama run mario
\`\`\`

常用模型管理指令：

\`\`\`bash
ollama create mymodel -f ./Modelfile
ollama rm llama3
ollama cp llama3 my-model
ollama serve
sudo systemctl restart ollama
\`\`\`

## Ollama API 怎麼呼叫？

Ollama API 預設在 \`localhost:11434\` 提供服務。應用程式可以呼叫 \`/api/chat\` 或 \`/api/generate\`，取得串流或非串流回應。

使用 \`/api/generate\` 的範例：

\`\`\`bash
curl http://localhost:11434/api/generate -d '{
  "model": "llama3",
  "prompt": "Why is the sky blue?"
}'
\`\`\`

回應會以 JSON 物件流返回：

\`\`\`json
{
  "model": "llama3",
  "created_at": "2023-08-04T08:52:19.385406455-07:00",
  "response": "The",
  "done": false
}
\`\`\`

實作時可以先用 curl 驗證模型，再把同一個端點接到後端服務。這是本文保留的實務判斷：先把本地模型視為一個可替換的 API，而不是直接綁死在應用邏輯裡。

## Ollama 可用模型怎麼選？

Ollama 模型選擇要同時看參數量、檔案大小與硬體記憶體。小模型適合快速測試，大模型適合品質要求較高的任務。

| Model | Parameters | Size | Download |
|---|---:|---:|---|
| Llama 3 | 8B | 4.7GB | \`ollama run llama3\` |
| Llama 3 | 70B | 40GB | \`ollama run llama3:70b\` |
| Phi 3 Mini | 3.8B | 2.3GB | \`ollama run phi3\` |
| Phi 3 Medium | 14B | 7.9GB | \`ollama run phi3:medium\` |
| Gemma 2 | 9B | 5.5GB | \`ollama run gemma2\` |
| Gemma 2 | 27B | 16GB | \`ollama run gemma2:27b\` |
| Mistral | 7B | 4.1GB | \`ollama run mistral\` |
| Code Llama | 7B | 3.8GB | \`ollama run codellama\` |
| LLaVA | 7B | 4.5GB | \`ollama run llava\` |

若只是測試本地 API 串接，可先從 7B 到 9B 級模型開始。若要做程式碼或推理任務，再依硬體資源往更大的模型調整。

## 常見問題
### Ollama 一定要 GPU 才能使用嗎？

Ollama 不一定要 GPU 才能啟動，但 GPU 會明顯改善推理速度。若只是在本機測試 API 或小模型，CPU 也可以先跑原型。

### Ollama 適合放在伺服器上嗎？

Ollama 適合放在內部伺服器上，作為本地 LLM API。正式使用時要另外處理存取控制、資源監控與模型版本管理。

### Ollama 和 LM Studio 要選哪一個？

需要視窗介面測模型時可以選 LM Studio。需要命令列、自動化、後端 API 串接時，Ollama 更適合。

### Ollama 可以建立自己的模型角色嗎？

Ollama 可以用 \`Modelfile\` 設定 system message、temperature 與基礎模型。這種方式適合建立固定語氣或固定任務的模型變體。

### Ollama 的 API 可以接到網頁服務嗎？

Ollama 的 API 可以接到網頁服務，但建議不要把本機端點直接暴露到公網。較安全的做法是由後端服務代理呼叫，並加上權限控管。

## 參考資料
- Ollama 官方網站：[https://ollama.com](https://ollama.com)
- Ollama GitHub：[https://github.com/ollama/ollama](https://github.com/ollama/ollama)

## 延伸閱讀

- [用 Docker 運行 Ollama：本地 LLM 容器化部署完整指南](/post/docker-run-ollama)：同樣聚焦 Ollama、LLM，可接著比較不同情境的做法。
- [在 Ollama 載入自己建立的模型：Modelfile 與本地模型管理流程](/post/ollama-load-custom-model)：同樣聚焦 Ollama、LLM，可接著比較不同情境的做法。
- [使用Docker來運行Ollama](/post/run-ollama-with-docker)：同樣聚焦 Ollama，可接著比較不同情境的做法。

## 最後更新

Wed Jul 24 2024 08:00:00 GMT+0800 (Taiwan Standard Time)
`;export{e as default};