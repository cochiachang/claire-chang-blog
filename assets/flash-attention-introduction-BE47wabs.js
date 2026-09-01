var e=`---
title: FlashAttention 介紹：IO 感知的精確注意力機制，讓 Transformer 更快更省記憶體
description: 我整理了 FlashAttention 與 FlashAttention-2 的重點筆記：IO 感知的精確注意力算法如何加速 Transformer 訓練、降低記憶體用量，並附上安裝需求與 pip install flash-attn 使用範例。
date: 2024-07-24
category: 機器學習
tags: [FlashAttention, Transformer, 注意力機制, GPU 加速, PyTorch]
readingTime: 8 分鐘
image: /images/tech/hero_flash-attention-introduction.webp
imageAlt: 晶片與電路板的 3D 示意圖，代表 GPU 運算與 FlashAttention 加速
---


# FlashAttention 介紹：IO 感知的精確注意力機制，讓 Transformer 更快更省記憶體

這篇文章整理我對 FlashAttention 的學習筆記：它是一種 IO 感知的精確注意力算法，能在不改變計算結果的前提下，讓 Transformer 模型訓練更快、記憶體用量更低，進而處理更長的序列。內容涵蓋它的四大關鍵特性、實作原理，以及安裝與使用方式。

## 官方資訊在哪裡找到 FlashAttention？

- Github: [https://github.com/Dao-AILab/flash-attention](https://github.com/Dao-AILab/flash-attention)
- 論文文檔: [https://arxiv.org/abs/2205.14135](https://arxiv.org/abs/2205.14135)

此存儲庫提供了論文中 FlashAttention 和 FlashAttention-2 的官方實現，可讓我們在建模時有**更快的注意力、更好的並行度和工作分區**。下面為一張概念示意圖：

![FlashAttention 概念示意圖](/images/articles/flash-attention-introduction-1.webp)

官方所做的效能提升試驗結果如下：

![FlashAttention 效能提升試驗結果](/images/articles/flash-attention-introduction-2.webp)

## 甚麼是 Flash Attention？

Flash Attention 是一種注意力算法，旨在提高基於 Transformer 的模型的效率，使其能夠處理更長的序列長度並更快地進行訓練和推理。它通過減少計算量和內存使用來實現這一點。Flash Attention 是一種快速且內存高效的精確注意力機制，其設計考慮了 IO（輸入輸出）的特性。

## 這項技術的關鍵點有哪些？

| 關鍵點 | 說明 |
| --- | --- |
| 快速（Fast） | 訓練 BERT-large（序列長度 512）比 MLPerf 1.1 的訓練速度記錄快 15%；訓練 GPT-2（序列長度 1K）比 HuggingFace 和 Megatron-LM 的基準實現快 3 倍；在 long-range arena（序列長度 1K–4K）中比基準速度快 2.4 倍 |
| 高效內存使用（Memory-efficient） | 傳統注意力機制的內存訪問量是 O(N²)，而 Flash Attention 的內存訪問量是亞二次方/線性的 |
| 精確（Exact） | 這不是近似算法（例如稀疏或低秩矩陣方法），其結果與原始方法完全相同 |
| IO 感知（IO-aware） | 與原始的注意力計算方法相比，Flash Attention 考慮了硬件（特別是 GPU）的特性，而不是將其當作黑盒來處理 |

## Flash Attention 是怎麼做到的？

可以通過以下兩種方式來實現：

- **切片和重新計算**：Flash Attention 將序列分成較小的塊，並在每個塊上計算注意力。這可以減少計算量，因為每個塊的注意力矩陣都小得多。此外，Flash Attention 還會重新利用中間計算結果，以進一步減少計算量。
- **稀疏表示**：Flash Attention 使用稀疏表示來表示注意力矩陣。這意味著只存儲非零元素，從而減少內存使用量。

## 如何安裝與使用 Flash Attention？

系統要求：

- CUDA 11.6 及更高版本
- PyTorch 1.12 及更高版本
- Linux 系統。此功能有可能於 v2.3.2 版本之後開始支持 Windows，但 Windows 編譯仍然需要更多的測試

我推薦使用 Nvidia 的 PyTorch 容器，它具有安裝 FlashAttention 所需的所有工具。

在使用 Flash Attention 之前要先安裝：

1. PyTorch
2. \`pip install packaging\`
3. 確保已安裝並且 \`ninja\` 工作正常（例如，\`ninja --version\` 然後 \`echo $?\` 應返回退出代碼 0）。如果不是（有時 \`ninja --version\` 然後 \`echo $?\` 返回非零退出代碼），請卸載然後重新安裝 \`ninja\`（\`pip uninstall -y ninja && pip install ninja\`）。如果沒有 \`ninja\`，編譯可能需要很長時間（2 小時），因為它不使用多個 CPU 內核；\`ninja\` 在 3 核機器上編譯需要 5–64 分鐘
4. 然後執行：

\`\`\`bash
pip install flash-attn --no-build-isolation
\`\`\`

如果你的電腦的 RAM 小於 96GB 且 CPU 內核眾多，\`ninja\` 則可能會運行過多的並行編譯作業，從而耗盡 RAM。要限制並行編譯作業的數量，可以設置環境變數 \`MAX_JOBS\`：

\`\`\`bash
MAX_JOBS=4 pip install flash-attn --no-build-isolation
\`\`\`

### 使用範例

\`\`\`python
from flash_attn import flash_attn_qkvpacked_func, flash_attn_func

flash_attn_qkvpacked_func(qkv, dropout_p=0.0, softmax_scale=None, causal=False,
                          window_size=(-1, -1), alibi_slopes=None, deterministic=False):
"""dropout_p should be set to 0.0 during evaluation
If Q, K, V are already stacked into 1 tensor, this function will be faster than
calling flash_attn_func on Q, K, V since the backward pass avoids explicit concatenation
of the gradients of Q, K, V.
If window_size != (-1, -1), implements sliding window local attention. Query at position i
will only attend to keys between [i - window_size[0], i + window_size[1]] inclusive.
Arguments:
    qkv: (batch_size, seqlen, 3, nheads, headdim)
    dropout_p: float. Dropout probability.
    softmax_scale: float. The scaling of QK^T before applying softmax.
        Default to 1 / sqrt(headdim).
    causal: bool. Whether to apply causal attention mask (e.g., for auto-regressive modeling).
    window_size: (left, right). If not (-1, -1), implements sliding window local attention.
    alibi_slopes: (nheads,) or (batch_size, nheads), fp32. A bias of (-alibi_slope * |i - j|) is added to
        the attention score of query i and key j.
    deterministic: bool. Whether to use the deterministic implementation of the backward pass,
        which is slightly slower and uses more memory. The forward pass is always deterministic.
Return:
    out: (batch_size, seqlen, nheads, headdim).
"""
\`\`\`

## 常見問題

### Flash Attention 是近似算法嗎？

不是。Flash Attention 是精確（exact）注意力，計算結果與原始注意力方法完全相同。它只是透過 IO 感知的分塊計算方式，減少 HBM 存取與記憶體用量，而不是像稀疏或低秩方法那樣做近似。

### Flash Attention 為什麼比傳統注意力快？

傳統注意力需要把 N×N 的注意力矩陣寫入再讀出 GPU 高速顯存（HBM），內存訪問量是 O(N²)。Flash Attention 將序列切成小塊、在片上計算並重新利用中間結果，把內存訪問量降到亞二次方/線性，因此訓練與推理都更快。

### 安裝 flash-attn 編譯太久怎麼辦？

先確認 \`ninja\` 已正確安裝（\`ninja --version\` 後 \`echo $?\` 要返回 0），沒有多核編譯時可能要花 2 小時。若 RAM 小於 96GB，用 \`MAX_JOBS=4 pip install flash-attn --no-build-isolation\` 限制並行編譯作業數量，避免記憶體耗盡。

### Flash Attention 支援哪些環境？

需要 CUDA 11.6 以上、PyTorch 1.12 以上，官方主要支援 Linux。Windows 支援預計在 v2.3.2 之後逐步提供，但編譯仍需更多測試，建議使用 Nvidia 官方 PyTorch 容器最省事。

## 參考資料

- [FlashAttention GitHub（Dao-AILab/flash-attention）](https://github.com/Dao-AILab/flash-attention)
- [FlashAttention 論文（arXiv:2205.14135）](https://arxiv.org/abs/2205.14135)

## 延伸閱讀

- [FlashAttention 介紹：更快的注意力機制如何省記憶體又加速 Transformer 訓練](/post/flash-attention-introduction)：同樣聚焦 FlashAttention、Transformer，可接著比較不同情境的做法。
- [Transformer：自然語言處理的里程碑](/post/transformer-nlp-milestone)：同樣聚焦 Transformer、注意力機制，可接著比較不同情境的做法。
- [機器學習所需的前置知識：數學、程式、算法與心理學基礎一次盤點](/post/machine-learning-prerequisites)：同樣聚焦 注意力機制，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2024-07-24，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};