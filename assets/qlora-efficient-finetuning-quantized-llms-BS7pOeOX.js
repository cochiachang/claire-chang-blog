var e=`---
title: QLoRA 量化微調完整解析：用 4-bit 顯存高效微調大型語言模型
description: QLoRA 透過 4-bit 量化、雙量化與分頁優化器，大幅降低 LLM 微調的 GPU 記憶體需求。本文解析 QLoRA 原理、三大關鍵技術，以及 Guanaco 研究帶來的資料品質洞察。
date: 2024-05-06
category: 機器學習
tags: [QLoRA, LoRA, LLM, 微調, 量化]
readingTime: 5 分鐘
image: /images/tech/hero_qlora-efficient-finetuning-quantized-llms.webp
imageAlt: GPU 顯示卡與神經網路量化的概念示意圖
---


# QLoRA 量化微調完整解析：用 4-bit 顯存高效微調大型語言模型

QLoRA 擴展了 LoRA，透過量化原始網路的權重值來提高效率，從高解析度資料類型（如 Float32）到較低解析度資料類型（如 int4）。這會減少記憶體需求並加快計算速度，讓一般 GPU 也能微調大型語言模型。

## 什麼是 QLoRA？為什麼微調 LLM 需要它？

QLoRA（Quantized LoRA）方法是一種用於大型語言模型（LLMs）的微調新方法。傳統上，微調大型模型需要龐大的計算資源，而 QLoRA 則提出了一種可以在 GPU 上進行低成本微調的方法。QLoRA 的關鍵創新在於使用了 4 位量化技術，並引入了可訓練的低秩適配器權重，從而大幅降低了微調過程中所需的記憶體，並且在不影響模型性能的情況下，實現了相當於 16 位完全微調基準的預測性能。

## QLoRA 技術做了哪三個面向的改進？

QLoRA 的效率來自三項關鍵技術：

| 技術 | 做法 | 效益 |
| --- | --- | --- |
| 4-bit 常態浮點（NormalFloat） | 資訊理論上最優的量化資料類型，適用於服從常態分佈的資料 | 與 4-bit 整數和 4-bit 浮點相比，實踐中能取得更好的效果 |
| 雙量化（Double Quantization） | 對量化常數本身再做一次量化 | 每個參數節省約 0.37 位元（65B 模型約可節省 3GB 記憶體） |
| 分頁優化器（Paged Optimizers） | 利用 NVIDIA 統一記憶體功能 | 避免處理長序列迷你批次時，梯度檢查點（gradient checkpointing）造成的記憶體激增 |

量化是指用更少的位數來表示數據，從而降低記憶體佔用；梯度檢查點則是一種訓練技巧，可以節省記憶體，但可能會降低精度。

![QLoRA 利用 NVIDIA 統一記憶體進行 GPU 與 CPU 之間的分頁傳輸](/images/articles/qlora-efficient-finetuning-quantized-llms-1.webp)

如上圖所示，QLoRA 利用了 NVIDIA 統一記憶體功能，當 GPU 記憶體不足時，該功能允許 GPU→CPU 無縫頁面傳輸，從而管理 GPU 中突然出現的記憶體峰值，並協助解決記憶體溢出/超限（OOM）問題。

## 利用 QLoRA 做了哪些研究？發現了什麼？

由於 QLoRA 的高效性，可以進行深入的指令微調和聊天機器人效能研究，所涉及的模型規模是常規微調因記憶體開銷而無法企及的。因此，提出論文的團隊針對多個指令微調資料集、模型架構以及參數規模介於 80M 到 65B 的模型，訓練了超過 1000 個模型。除了證明 QLoRA 能恢復 16 位元精度效能，以及訓練出最先進的聊天機器人 Guanaco 之外，還分析了訓練模型的趨勢。

首先，他們發現**資料品質比資料集大小重要得多**。例如，一個包含 9k 個樣本的資料集（OASST1）在聊天機器人效能方面優於一個包含 45 萬個樣本的資料集（子集化的 FLAN v2），即使兩者都旨在支持遵循指令泛化。

其次，他們展示了強大的大規模多任務語言理解（MMLU）基準測試性能，並不意味著強大的 Vicuna 聊天機器人基準測試性能，反之亦然——換句話說，對於給定任務而言，**數據集的適用性比大小更重要**。

## 常見問題

### QLoRA 和 LoRA 有什麼差別？

LoRA 是在凍結的原始權重上訓練低秩適配器（LoRA）來減少可訓練參數量；QLoRA 則更進一步，把被凍結的基座模型權重量化成 4-bit 儲存，只在反傳時暫時反量化。這讓微調 65B 級別的模型也只需要一張消費級 GPU。

### QLoRA 量化到 4-bit 會不會損失模型效能？

QLoRA 論文以 NormalFloat（NF4）資料類型與雙量化設計，證明可以恢復相當於 16-bit 完全微調的效能基準。關鍵在於 NF4 是針對常態分佈權重的資訊理論最優編碼，比一般的 int4 或 FP4 更能保留精度。

### 什麼是分頁優化器（Paged Optimizers）？

分頁優化器利用 NVIDIA 統一記憶體（Unified Memory），在 GPU 顯存不足時，把優化器狀態自動分頁（page）到 CPU 記憶體，之後再搬回來。這避免了訓練長序列批次時顯存峰值造成的 OOM 中斷。

### 微調 LLM 時，資料集越大越好嗎？

不一定。QLoRA 相關研究發現，9k 樣本的高品質資料集（OASST1）在聊天機器人表現上勝過 45 萬樣本的 FLAN v2 子集。資料品質與任務適配性，遠比資料量重要。

### QLoRA 適合什麼情境使用？

適合想在有限顯存下微調大型語言模型的情境，例如在自己的 GPU 上客製化 7B～65B 的模型、訓練領域專用聊天機器人，或是在成本受限下做指令微調實驗。若是推論階段的部署優化，則可搭配其他量化方法。

## 參考資料

- [LoRA 論文](https://ar5iv.labs.arxiv.org/html/2106.09685)
- [QLoRA 論文](https://ar5iv.labs.arxiv.org/html/2305.14314)
- [QDyLoRA 論文](https://arxiv.org/html/2402.10462v1)
- [LoRA 和 QLoRA 的比較（Medium）](https://medium.com/@hayagriva99999/lora-and-qlora-an-efficient-approach-to-fine-tuning-large-models-under-the-hood-948468424cd6)

## 延伸閱讀

- [QLoRA 量化微調完全指南：4-bit NormalFloat、雙量化與分頁優化器如何省下大量 GPU 記憶體](/post/qlora-efficient-finetuning-quantized-llms)：同樣聚焦 QLoRA、LoRA，可接著比較不同情境的做法。
- [LoRA（Low-Rank Adaptation）是什麼？低參數微調 LLM 的原理與優點解析](/post/lora-low-rank-adaptation)：同樣聚焦 LoRA、LLM，可接著比較不同情境的做法。
- [OpenAI 模型微調（Fine-tuning）完整流程：資料準備到上線實戰](/post/openai-model-fine-tuning-process)：同樣聚焦 微調、LLM，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2024-05-06，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};