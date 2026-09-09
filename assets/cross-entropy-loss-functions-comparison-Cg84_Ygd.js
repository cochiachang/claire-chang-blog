var e=`---
title: 交叉熵相關損失函數的比較：categorical 與 sparse_categorical 差異
description: 交叉熵（cross-entropy）是分類模型最常用的損失函數。本文比較 Keras 的 categorical_crossentropy 與 sparse_categorical_crossentropy 差異，並說明 one-hot encoding 原理與選用時機。
date: 2023-01-07
category: 機器學習
tags: [交叉熵, 損失函數, Keras, One-Hot Encoding, 深度學習]
readingTime: 3 分鐘
image: /images/tech/hero_cross-entropy-loss-functions-comparison.webp
imageAlt: 由 X、Y 標記節點與連線組成的神經網路抽象圖，象徵分類模型的預測與標籤
---


# 交叉熵相關損失函數的比較：categorical 與 sparse_categorical 差異

交叉熵（cross-entropy）是訓練分類模型時最常用的損失函數，用來衡量預測概率分布與真實標籤之間的差距。這篇文章整理交叉熵的基本概念、Keras 中 \`categorical_crossentropy\` 與 \`sparse_categorical_crossentropy\` 兩種損失函數的差異，以及 one-hot encoding 的原理，幫助你在訓練模型時正確選擇損失函數。

## 交叉熵是什麼？為什麼分類問題都用它？

交叉熵是一種常用的測量兩個概率分布差異的度量。它可以用來衡量預測模型的輸出結果與真實標籤之間的差異，從而作為訓練模型的損失函數。

交叉熵的計算公式如下：

\`\`\`text
H(y, y_pred) = - ∑ y log(y_pred)
\`\`\`

其中 \`y\` 和 \`y_pred\` 分別表示真實標籤的概率分布和預測模型的輸出概率分布。

交叉熵有幾個特性，使它特別適合用來衡量分類問題中模型的預測結果與真實標籤之間的差異：

- 交叉熵越小，預測模型的輸出結果就越接近真實標籤，模型的預測能力就越強。
- 當預測模型的輸出結果完全符合真實標籤時，交叉熵等於零。
- 交叉熵是一個非負數，且在模型預測結果與真實標籤完全不同時，交叉熵最大。

## categorical_crossentropy 和 sparse_categorical_crossentropy 有什麼不同？

Keras 中常用的交叉熵損失函數有以下兩種：

- \`categorical_crossentropy\`
- \`sparse_categorical_crossentropy\`

兩者都是用於計算分類問題中模型預測結果與真實標籤之間的交叉熵的損失函數，但它們有一些重要的區別：

1. 在 \`categorical_crossentropy\` 中，標籤必須是一個 one-hot 編碼，即對每個類別都指定一個二元（0/1）標籤。
2. 在 \`sparse_categorical_crossentropy\` 中，標籤可以是一個整數，表示每個類別的索引。在計算交叉熵損失時，會對這些整數標籤進行單熱編碼。

簡單來說：

| 標籤格式 | 適用的損失函數 |
| --- | --- |
| one-hot 編碼，如 \`[0, 1, 0]\` | \`categorical_crossentropy\` |
| 整數類別索引，如 \`1\` | \`sparse_categorical_crossentropy\` |

通常情況下，使用 \`sparse_categorical_crossentropy\` 會比較方便，因為標籤可以直接表示為整數，而不需要先對它們進行 one-hot 編碼。但是，使用 \`categorical_crossentropy\` 也是可以的，只需要將標籤進行 one-hot 編碼即可。

## 單熱編碼（one-hot encoding）是什麼？

單熱編碼（one-hot encoding）是一種將類別特徵轉化為向量的方法。

假設有一個有 N 個不同類別的特徵，那麼我們就可以將每個類別都表示為一個 N 維的二元向量，其中只有一個元素為 1，其餘元素都為 0。例如，如果類別有 A、B、C 三個可能的取值，那麼我們就可以將它們分別表示為：

\`\`\`text
A: [1, 0, 0]
B: [0, 1, 0]
C: [0, 0, 1]
\`\`\`

通常情況下，單熱編碼用於處理分類問題，並且可以用於訓練深度學習模型。它的主要作用是將類別特徵轉化為可以被訓練模型理解的數值型特徵，以便訓練模型。

## 常見問題

### 交叉熵損失函數的值代表什麼？

交叉熵衡量預測概率分布與真實標籤分布的差異。值越小代表預測越接近真實標籤；當預測完全符合標籤時，交叉熵為零，而預測與標籤完全不同時達到最大。

### 標籤是整數時該用哪個交叉熵損失函數？

使用 \`sparse_categorical_crossentropy\`。它接受整數類別索引作為標籤，並在計算損失時自動進行單熱編碼，不需要事先轉換標籤格式。

### 什麼時候需要用 categorical_crossentropy？

當你的標籤已經是 one-hot 編碼格式（例如每個類別是一個 0/1 向量）時，使用 \`categorical_crossentropy\`。若標籤是整數，則要先做 one-hot 編碼才能使用它。

### one-hot encoding 的作用是什麼？

one-hot encoding 把類別特徵轉換成只有一個元素為 1、其餘為 0 的 N 維向量，讓模型能以數值方式理解類別資訊，是處理分類問題常見的前處理步驟。

## 參考資料

- [Keras Losses 官方文件](https://keras.io/api/losses/)

## 延伸閱讀

- [二元分類器 (binary classification) 介紹](/post/binary-classifier-introduction)：同樣聚焦 Keras、深度學習，可接著比較不同情境的做法。
- [Keras 介紹：用 Python 快速建立深度學習模型的高階 API](/post/keras-introduction)：同樣聚焦 Keras、深度學習，可接著比較不同情境的做法。
- [深度學習模型-MLP、CNN與 RNN](/post/deep-learning-models-mlp-cnn-rnn)：同樣聚焦 深度學習、Keras，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2023-01-07，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};