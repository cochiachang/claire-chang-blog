var e=`---
title: 本機執行 Breeze-7B-Instruct-v1_0 教學
description: 說明 Breeze-7B-Instruct-v1_0 的模型來源、Ollama 匯入限制、繁體中文回覆差異與 Transformers 推理方式。
date: 2024-10-03
category: 生成式AI
tags: [Breeze, Ollama, Hugging Face, Transformers]
readingTime: 9 分鐘
image: /images/tech/hero_run-breeze-7b-instruct-locally.webp
imageAlt: 筆電上執行本機大型語言模型的開發環境
---


# 本機執行 Breeze-7B-Instruct-v1_0 教學

Breeze-7B-Instruct-v1_0 可以在本機用 Hugging Face Transformers 載入，也可以嘗試轉進 Ollama，但 Ollama 匯入時必須確認基礎模型、adapter 與量化格式是否相容。若目標是繁體中文應答，測試 prompt 與模型微調資料會直接影響輸出語言。

## Breeze-7B-Instruct-v1_0 是什麼？

Breeze-7B-Instruct-v1_0 是 MediaTek Research 發布的 7B 級指令微調模型。Breeze-7B-Instruct-v1_0 來自 Breeze-7B-Base-v1_0，適合測試繁體中文問答、摘要與一般對話任務。

Breeze 系列的微調順序很重要：

| 模型 | 來源關係 | 用途 |
|---|---|---|
| Mistral-7B-v0.1 | 原始基礎模型 | 通用 7B 語言模型基底 |
| Breeze-7B-Base-v1_0 | 由 Mistral-7B-v0.1 延伸 | MediaTek Breeze 系列基礎模型 |
| Breeze-7B-Instruct-v1_0 | 由 Breeze-7B-Base-v1_0 延伸 | 指令微調後可直接對話 |

本機測試時不要只看模型名稱相似，也要看模型卡上的 base model 與 adapter 關係。模型來源不匹配時，轉換工具可能在載入權重時失敗。

## 為什麼 Ollama 上的 Breeze 模型可能回簡體中文？

Ollama 社群模型是否穩定回繁體中文，取決於模型版本、量化方式與 prompt 內容。Breeze 系列雖然對繁體中文友善，但未被微調覆蓋的問題仍可能受基礎模型語料影響。

原稿測試過 \`markliou/breeze-7b\`、\`ycchen/breeze-7b-instruct-v1_0\`、\`jcai/breeze-7b-32k-instruct-v1_0\`。其中有些模型會回繁體中文，有些模型在一般問題上偏向簡體中文。

一個實務判斷是：如果問題本身具有台灣語境，例如「台北有哪些地方好玩」，模型較容易回繁體中文；如果問題是一般知識問答，模型可能回到訓練語料中較常見的簡體中文。要穩定控制語言，建議在 system prompt 明確要求「全程使用台灣繁體中文」。

## 如何把 Hugging Face 的 Breeze 匯入 Ollama？

把 Hugging Face 模型匯入 Ollama 時，\`Modelfile\` 的 \`FROM\` 必須對應正確基礎模型。若直接把 Breeze-7B-Instruct-v1_0 adapter 接到 \`mistral:v0.1\`，很容易遇到權重不相容錯誤。

原稿曾嘗試使用以下 \`Modelfile\`：

\`\`\`bash
FROM mistral:v0.1
ADAPTER ./
\`\`\`

建立模型：

\`\`\`bash
ollama create my-breeze
\`\`\`

若出現 \`panic: runtime error: index out of range [1] with length 1\`，常見原因是 \`.safetensors\` 檔案格式、adapter 層級或基礎模型不符合 Ollama 轉換需求。Breeze-7B-Instruct-v1_0 的上一層是 Breeze-7B-Base-v1_0，不是直接接在 Mistral-7B-v0.1 上。

## 為什麼 24GB VRAM 還可能轉換失敗？

7B 模型不代表任何操作都能輕鬆放進 24GB VRAM。未量化權重、轉換暫存、GPU overhead 與 Ollama 建模流程，都可能讓實際記憶體需求高於推理時的直覺估計。

原稿的測試環境偵測到 NVIDIA GeForce RTX 3090，總 VRAM 24GB、可用約 22.8GB，但轉換過程仍在進度超過 100% 附近失敗。這也是 Ollama library 常見模型通常會先提供量化版本的原因：量化後檔案較小，部署與載入成本都比較低。

實務上可以先採用已量化的 GGUF 或 Ollama 社群模型做 API 原型，再評估是否需要自行轉換完整權重。

## 如何用 Transformers 直接呼叫 Breeze-7B-Instruct-v1_0？

Transformers 是最直接的 Hugging Face 本機推理方式。Transformers 不需要先把模型轉進 Ollama，但第一次載入會下載權重，推理速度也取決於 GPU、記憶體與量化設定。

基本載入方式如下：

\`\`\`python
from transformers import AutoTokenizer, AutoModelForCausalLM

tokenizer = AutoTokenizer.from_pretrained("MediaTek-Research/Breeze-7B-Instruct-v1_0")
model = AutoModelForCausalLM.from_pretrained("MediaTek-Research/Breeze-7B-Instruct-v1_0")
\`\`\`

使用 chat template 產生輸入：

\`\`\`python
chat = [
  {"role": "user", "content": "你好，請問你可以完成什麼任務？"},
  {"role": "assistant", "content": "你好，我可以幫助您解決各種問題、提供資訊和協助您完成許多不同的任務。"},
  {"role": "user", "content": "太棒了！"},
]

prompt = tokenizer.apply_chat_template(chat, tokenize=False)
\`\`\`

推理範例：

\`\`\`python
outputs = model.generate(
    tokenizer.apply_chat_template(chat, return_tensors="pt"),
    max_new_tokens=128,
    top_p=0.01,
    top_k=85,
    repetition_penalty=1.1,
    temperature=0.01,
)

print(tokenizer.decode(outputs[0]))
\`\`\`

原稿測試得到的回覆是「很高興能為您服務！如果有任何需要，歡迎隨時詢問。」這種方式適合確認模型原始行為，但若沒有量化與 GPU 最佳化，互動速度可能偏慢。

## 本機 Breeze 測試建議流程

Breeze-7B-Instruct-v1_0 本機測試可以先分成三層：先測社群量化模型，再測 Transformers 原始模型，最後才處理 Ollama 自行匯入。這樣比較容易判斷錯誤來自模型、轉換流程或硬體限制。

建議流程：

1. 先用 Ollama 社群模型測 prompt 與繁體中文表現。
2. 用 Hugging Face Transformers 驗證官方模型原始輸出。
3. 確認 base model 與 adapter 關係後，再嘗試 Ollama 自行匯入。
4. 記錄 GPU 型號、可用 VRAM、模型檔案格式與錯誤訊息。
5. 若正式部署需要速度，優先找穩定量化版本。

## 常見問題

### Breeze-7B-Instruct-v1_0 可以直接用 Ollama 執行嗎？

Breeze-7B-Instruct-v1_0 不一定能直接用原始 Hugging Face 權重匯入 Ollama。比較穩定的方式是使用已整理好的 Ollama 模型，或確認 GGUF、adapter 與 base model 完全相容後再轉換。

### Breeze 模型為什麼有時候不用繁體中文回答？

Breeze 模型的輸出語言會受 prompt、微調資料與基礎模型語料影響。若要固定繁體中文，建議在 system prompt 明確指定「使用台灣繁體中文，不使用簡體中文」。

### RTX 3090 能跑 Breeze-7B-Instruct-v1_0 嗎？

RTX 3090 的 24GB VRAM 通常足以測試 7B 級模型推理，但自行轉換未量化權重仍可能失敗。正式使用前應確認量化格式、載入方式與 batch 設定。

### Transformers 和 Ollama 要選哪一個？

需要驗證官方模型原始行為時選 Transformers。需要本地 API、命令列管理與應用整合時，Ollama 比較方便。

### \`panic: runtime error: index out of range\` 代表什麼？

這個錯誤常見於權重檔或 adapter 格式不符合轉換工具預期。排查時應先確認 \`FROM\` 的基礎模型是否真的是該 adapter 的上一層模型。

## 參考資料

- MediaTek Research, Breeze-7B-Instruct-v1_0：<https://huggingface.co/MediaTek-Research/Breeze-7B-Instruct-v1_0>
- MediaTek Research, Breeze-7B-Base-v1_0：<https://huggingface.co/MediaTek-Research/Breeze-7B-Base-v1_0>
- Mistral AI, Mistral-7B-v0.1：<https://huggingface.co/mistralai/Mistral-7B-v0.1>
- Ollama Breeze 搜尋結果：<https://ollama.com/search?q=breeze>
- Hugging Face Transformers 文件：<https://huggingface.co/docs/transformers/index>

## 延伸閱讀

- [LLM 繁體中文能力比較：用台灣社福申請情境測試模型](/post/llm-traditional-chinese-comparison)：同樣聚焦 Ollama，可接著比較不同情境的做法。
- [Ollama 本地端運行 LLM 服務教學](/post/ollama-local-llm-service)：同樣聚焦 Ollama，可接著比較不同情境的做法。
- [在 Ollama 載入自己建立的模型：Modelfile 與本地模型管理流程](/post/ollama-load-custom-model)：同樣聚焦 Ollama，可接著比較不同情境的做法。

## 最後更新

2026-08-28

`;export{e as default};