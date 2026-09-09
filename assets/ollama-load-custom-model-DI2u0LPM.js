var e=`---
title: "在 Ollama 載入自己建立的模型：Modelfile 與本地模型管理流程"
description: 用 Modelfile 把自己微調的 LoRA 權重或 GGUF 模型載入 Ollama，涵蓋 Safetensors 轉換與量化設定。
date: 2024-10-02
category: 生成式AI
tags: [Ollama, LLM, 本地模型]
readingTime: 5 分鐘
image: /images/tech/hero_ollama-load-custom-model.webp
imageAlt: 在 Ollama 載入自己建立的模型：Modelfile 與本地模型管理流程 技術文章封面圖
---


# 在 Ollama 載入自己建立的模型：Modelfile 與本地模型管理流程

參考資料：

- [官方教學](https://github.com/ollama/ollama/blob/main/docs/import.md)
- [網路教學影片](https://www.youtube.com/watch?v=fnvZJU5Fj3Q)

## 怎麼基於已有的模型導入 Safetensors 權重？

第一步是建立一個 \`Modelfile.txt\`。

例如假如我是用 [markliou/breeze-7b](https://ollama.com/markliou/breeze-7b) 這個模型作為基礎模型，然後自己建立的 LoRA 微調檔案放在 \`data\` 資料夾底下，\`Modelfile.txt\` 的內容就會是：

\`\`\`bash
FROM mistral:v0.1
ADAPTER ./data/
\`\`\`

從創建 \`Modelfile\` 的目錄運行 \`ollama create\`，可以用 \`-f\` 指定 Modelfile 路徑，如果不指定就會在當前目錄尋找：

\`\`\`bash
ollama create my-breeze -f ./Modelfile.txt
\`\`\`

## 怎麼用量化級別控制模型大小？

可以用 \`--quantize\` 參數運行不同的量化級別：

\`\`\`bash
$ ollama create --quantize q4_K_M my-breeze
transferring model data
quantizing F16 model to Q4_K_M
creating new layer sha256:735e246cc1abfd06e9cdcf95504d6789a6cd1ad7577108a70d9902fef503c1bd
creating new layer sha256:0853f0ad24e5865173bbf9ffcc7b0f5d56b66fd690ab1009867e45e7d2c4db0f
writing manifest
success
\`\`\`

如果是下載別人的 LoRA，而對方用的是 \`.bin\` 檔案，可以用 \`transformers\` 庫做轉換，轉成 \`.safetensors\`：

\`\`\`python
from transformers import AutoModel, AutoTokenizer

# 載入模型和標記器
model = AutoModel.from_pretrained("./")
tokenizer = AutoTokenizer.from_pretrained("./")
# 儲存為 GGUF 格式
model.save_pretrained("./")
tokenizer.save_pretrained("./")
\`\`\`

## 怎麼直接導入 GGUF 格式的模型？

Ollama 的 \`FROM\` 所導入的模型應為 GGUF 格式，可以透過像 \`llama.cpp\` 這樣的工具來將模型轉換為 ggml 或 gguf 格式。

安裝 \`llama.cpp\`：

\`\`\`bash
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp
make
\`\`\`

接著將下載的 \`.safetensors\` 模型放置於適當位置，然後開始轉換：

\`\`\`bash
# 假設模型放置於 models/Breeze-7B-FC-v1_0 目錄下
./llama.cpp -m models/Breeze-7B-FC-v1_0/model.safetensors -t models/Breeze-7B-FC-v1_0/tokenizer.json -w models/Breeze-7B-FC-v1_0/ggml-model-f16.bin --quant 4
\`\`\`

注意：不同模型的結構和參數可能有所差異，並非所有模型都能順利轉換為 GGUF。我在轉換 Breeze 模型時就踩過雷，可以參考這個 [Ollama 的 GitHub Issue](https://github.com/ollama/ollama/issues/5195)。

要導入 GGUF 模型，創建一個 \`Modelfile\`，包含：

\`\`\`bash
FROM /path/to/file.gguf
\`\`\`

接著就可以創建了，指令要指向 \`Modelfile.txt\` 所在的位置：

\`\`\`bash
ollama create my-model -f ./Modelfile.txt
\`\`\`

## 常見問題

### Safetensors 導入和 GGUF 導入該選哪一種？

如果你手上是 LoRA 微調權重（Safetensors 或 \`.bin\`），走「基於已有模型 + ADAPTER」的路線比較直接；如果模型本體已經是 GGUF 格式，或已經用 \`llama.cpp\` 轉好，就直接用 \`FROM /path/to/file.gguf\` 導入即可。

### \`--quantize\` 一定要設定嗎？

不是必要，但建議設定。量化可以明顯縮小模型檔案大小、降低記憶體需求，代價是精度會有一定程度的損失，\`q4_K_M\` 是常見的折衷選擇。

### GGUF 轉換失敗怎麼辦？

不是所有模型結構都能順利轉換成 GGUF，這跟模型架構、tokenizer 設定等因素有關。遇到轉換失敗，可以先查一下該模型是否有已知的相容性問題（例如上面連結的 GitHub Issue），不要預設任何模型都能無痛轉換。

## 參考資料

- [Ollama 官方 import 文件](https://github.com/ollama/ollama/blob/main/docs/import.md)
- [markliou/breeze-7b](https://ollama.com/markliou/breeze-7b)
- [Ollama GitHub Issue #5195](https://github.com/ollama/ollama/issues/5195)

## 延伸閱讀

- [Ollama 本地端運行 LLM 服務教學](/post/ollama-local-llm-service)：同樣聚焦 Ollama、LLM，可接著比較不同情境的做法。
- [用 Docker 運行 Ollama：本地 LLM 容器化部署完整指南](/post/docker-run-ollama)：同樣聚焦 Ollama、LLM，可接著比較不同情境的做法。
- [本機執行 Breeze-7B-Instruct-v1_0 教學](/post/run-breeze-7b-instruct-locally)：同樣聚焦 Ollama，可接著比較不同情境的做法。

## 最後更新

2026-08-28

`;export{e as default};