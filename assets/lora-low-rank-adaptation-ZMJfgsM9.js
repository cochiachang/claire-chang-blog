var e=`---
title: "LoRA（Low-Rank Adaptation）是什麼？低參數微調 LLM 的原理與優點解析"
description: "LoRA（Low-Rank Adaptation）是一種參數高效微調技術，透過低秩矩陣分解凍結大部分 LLM 權重，只訓練少量參數，就能在特定任務上接近 Full Fine-tuning 的表現，同時大幅降低運算與儲存成本。本文解析 LoRA 的運作原理、流程與主要優點。"
date: 2024-05-03
category: 機器學習
tags: [LoRA, LLM, Fine-tuning, 機器學習, 參數高效微調]
readingTime: 4 分鐘
image: /images/tech/hero_lora-low-rank-adaptation.webp
imageAlt: "LoRA 低秩適應微調大型語言模型的概念示意圖"
---


# LoRA（Low-Rank Adaptation）是什麼？低參數微調 LLM 的原理與優點解析

LoRA（Low-Rank Adaptation）是一種參數高效的微調技術，能改善大型語言模型（LLM）在特定任務上的表現，同時具有較低的運算與儲存成本。它透過降低模型參數的秩（rank）來減少模型複雜度，讓我在資源有限的情況下也能客製化自己的 LLM。這篇文章整理 LoRA 的運作原理、微調流程與主要優點。

## 為什麼微調 LLM 需要用 LoRA？

傳統的參數微調（Full Fine-tuning）常常會遇到過擬合的問題，特別是當訓練資料較少、或訓練資料與目標任務不符時。LoRA 透過引入一個低秩的參數矩陣，將原始的高維參數矩陣分解成兩個低秩矩陣的乘積，從而降低模型的複雜度。這種降維的方式可以有效減少模型的參數量，減緩過度擬合的情況，並提高模型的泛化能力。

## LoRA 的主要優點有哪些？

- **更快的訓練速度**：將原始的高維度參數矩陣分解成低秩矩陣，可以大幅減少模型的參數數量。
- **更低的計算成本**：分解低秩矩陣能降低模型的計算與儲存成本。它不是添加層，而是為參數添加值，因此不會導致推理延遲。
- **更少的泛化損失**：LoRA 能提高模型的泛化能力，使模型更能適應不同的任務和領域。

## LoRA 的微調流程是怎麼進行的？

![LoRA 微調流程示意圖](/images/articles/lora-low-rank-adaptation-1.webp)

整個流程可以拆成四個步驟：

1. 使用預訓練的 LLM 權重初始化 A 和 B 矩陣。
2. 將 LLM 應用於特定任務的訓練資料集。
3. 在訓練過程中，只有 A 矩陣會針對訓練資料集（輸入資料 X）進行微調。
4. 訓練完成後，獲得針對特定任務適應的 LLM，也就是 H（輸出）。

## LoRA 的運作原理是什麼？

在 LoRA 中，一組新參數同時加入了網路 W_A 和 W_B。這些網路利用低秩權重向量，其向量維度表示為 d×r 和 r×d。在這裡，「d」代表原始凍結網路參數向量的維度，而「r」表示所選的低秩或更低維度。

值得注意的是，「r」的值越小，模型訓練過程就越加速、越簡化。確定適當的「r」值是 LoRA 中的關鍵決策：選擇較低的值會讓訓練更快、更具成本效益，但可能不會產生最佳結果；相反地，選擇較高的「r」值會增加訓練時間和成本，但能增強模型處理更複雜任務的能力。

LoRA 的運作方式是：首先需要一個預先訓練的 LLM，並凍結其大部分參數；然後將這些凍結的預訓練模型權重與可訓練的秩分解矩陣一起注入到 Transformer 的每一層中。這樣做有助於精細化模型，特別適合在低資源硬體上調整模型。

![LoRA 與微調方法的效能比較](/images/articles/lora-low-rank-adaptation-2.webp)

從上表可以看出，LoRA 方法的結果與經典的微調方法相當，可以用更少的時間和資源獲得或多或少相同的結果，並且有更快的執行時間和更短的訓練時間。

## LoRA 與 Fine-tuning 比較，結論是什麼？

- LoRA 是一種模型適應技術，可減少 LLM 中的參數數量，同時保持其效能。
- 它透過將 LLM 的權重分解為低秩矩陣（共同特徵）和隨機矩陣（特定於任務的變體）來實現這一點。
- 低秩矩陣和隨機矩陣相結合，產生一個特定於任務的適配器（adapter），可以根據特定任務自訂 LLM。
- LoRA 在訓練速度、運算效率和模型大小方面具有優勢，使其適合資源受限的環境。
- LoRA 多數的成果比 Fine-tuning 還要好，並且訓練的參數量遠小於 Fine-tuning。

## 常見問題

### LoRA 是什麼？

LoRA（Low-Rank Adaptation）是一種參數高效微調技術，透過低秩矩陣分解，只訓練少量新增參數、凍結原本 LLM 的大部分權重。它能在特定任務上達到接近完整微調的效果，同時大幅降低運算與儲存成本。

### LoRA 為什麼不會增加推理延遲？

因為 LoRA 不添加新的網路層，而是為既有參數加入低秩矩陣的值。訓練完成後可以將低秩矩陣合併回原權重，因此推理時的計算路徑不變，不會產生額外延遲。

### LoRA 的秩（r）該怎麼選？

r 值越小，訓練越快、成本越低，但表現可能受限；r 值越大，越能處理複雜任務，但訓練時間與成本也隨之增加。實務上建議從較小的 r 值開始實驗，再依任務複雜度逐步調高。

### LoRA 的效果比傳統 Fine-tuning 好嗎？

就我整理的比較結果來看，LoRA 多數的成果比 Fine-tuning 更好或相當，但訓練參數量遠小於 Fine-tuning。加上訓練速度快、適合低資源硬體，LoRA 通常是資源受限環境下的首選。

## 參考資料

- 論文 LoRA: Low-Rank Adaptation of Large Language Models：<https://arxiv.org/abs/2106.09685>
- GitHub（Microsoft LoRA）：<https://github.com/microsoft/LoRA>
- HuggingFace Parameter-Efficient Fine-Tuning (PEFT)：<https://github.com/huggingface/peft>

## 延伸閱讀

- [OpenAI 模型微調（Fine-tuning）完整流程：資料準備到上線實戰](/post/openai-model-fine-tuning-process)：同樣聚焦 Fine-tuning、LLM，可接著比較不同情境的做法。
- [QLoRA 量化微調完整解析：用 4-bit 顯存高效微調大型語言模型](/post/qlora-efficient-finetuning-quantized-llms)：同樣聚焦 LoRA、LLM，可接著比較不同情境的做法。
- [QLoRA 量化微調完全指南：4-bit NormalFloat、雙量化與分頁優化器如何省下大量 GPU 記憶體](/post/qlora-efficient-finetuning-quantized-llms)：同樣聚焦 LoRA、LLM，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2024-05-03，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};