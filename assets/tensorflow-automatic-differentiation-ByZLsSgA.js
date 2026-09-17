var e=`---
title: TensorFlow 自動求導機制：用 GradientTape 計算梯度
description: 什麼是 TensorFlow 的自動求導機制？本文介紹梯度張量與 GradientTape 的使用方法，包含 watch、gradient 等步驟，並用 y=x² 在 x=3 的導數示範如何計算模型梯度。
date: 2023-01-04
category: 機器學習
tags: [TensorFlow, 自動微分, GradientTape, 機器學習, 梯度]
readingTime: 3 分鐘
image: /images/tech/hero_tensorflow-automatic-differentiation.webp
imageAlt: 黑底上的數學公式與幾何圖形，象徵自動求導背後的微積分原理
---


# TensorFlow 自動求導機制：用 GradientTape 計算梯度

在 TensorFlow 中，有一種特殊的張量類型叫做梯度張量，可以用來計算模型的梯度。這篇文章說明 TensorFlow 自動求導（自動微分）機制的原理、\`GradientTape\` 的標準使用流程，並用一個最小範例示範如何求出函數在特定點的導數——這正是訓練神經網路時反向傳播的基礎。

## 什麼是 TensorFlow 的自動求導機制？

TensorFlow 的梯度張量是一種特殊的張量，其中包含了模型中每個變量的梯度資訊。梯度張量是 TensorFlow 自動微分機制的基礎，可以透過 TensorFlow 的自動求導機制來計算模型的梯度。

簡單來說：只要把前向計算寫出來，TensorFlow 會自動沿著計算路徑算出每個變量的偏導數，不需要手動推導微分公式。

## GradientTape 的使用方法

使用 \`tf.GradientTape\` 類計算梯度的標準流程是：

1. 在計算圖的上下文中建立一個 \`GradientTape\` 物件。
2. 使用 \`GradientTape\` 物件的 \`watch\` 方法監視計算圖中的變量（\`tf.Variable\` 預設會被自動監視）。
3. 執行計算圖，在 tape 的上下文中用 TensorFlow 的運算子操作張量。
4. 呼叫 \`GradientTape\` 物件的 \`gradient\` 方法計算模型的梯度。

## 使用範例：計算 y = x² 在 x = 3 的導數

在機器學習中，我們經常需要計算函數的導數。TensorFlow 提供了強大的自動求導機制來計算導數。以下程式示範如何使用 \`tf.GradientTape()\` 計算函數 y(x) = x² 在 x = 3 時的導數：

\`\`\`python
import tensorflow as tf

x = tf.Variable(initial_value=3.)
with tf.GradientTape() as tape:
    # 所有計算步驟都會被記錄以用於求導
    y = tf.square(x)
y_grad = tape.gradient(y, x)  # 計算 y 關於 x 的導數
print([y, y_grad])
\`\`\`

輸出如下：

\`\`\`python
[array([9.], dtype=float32), array([6.], dtype=float32)]
\`\`\`

結果符合手算：y = 3² = 9，而 dy/dx = 2x = 2 × 3 = 6。這個「前向記錄、反向求導」的模式就是 TensorFlow 訓練模型時每一步更新權重所做的事情。

## 常見問題

### 什麼是 TensorFlow 的梯度張量？

梯度張量是一種特殊的張量，包含模型中每個變量的梯度資訊。它是 TensorFlow 自動微分機制的基礎，透過它可以取得模型各變量相對於目標函數的導數。

### GradientTape 為什麼叫 tape（磁帶）？

因為它像磁帶一樣「錄下」上下文中執行的每一個運算。之後呼叫 \`gradient()\` 時，TensorFlow 就沿著這份記錄反向推導，算出目標張量對監視變量的梯度。

### 哪些變量會被 GradientTape 自動追蹤？

\`tf.Variable\` 會被自動監視；一般的 \`tf.Tensor\` 則需要呼叫 \`tape.watch(tensor)\` 明確監視才會被求導。\`tf.constant\` 之類不可訓練的張量若不 watch，梯度會是 \`None\`。

### tape.gradient() 可以重複呼叫嗎？

不行。\`GradientTape\` 預設是一次性的，呼叫一次 \`gradient()\` 後資源就會釋放。若需要多次求導，建立 tape 時要加上 \`persistent=True\`，並用完後手動 \`del tape\` 釋放資源。

## 參考資料

- [TensorFlow 官方文件：tf.GradientTape](https://www.tensorflow.org/api_docs/python/tf/GradientTape)
- [TensorFlow 官方指南：自動微分](https://www.tensorflow.org/guide/autodiff)

## 延伸閱讀

- [TensorFlow 開發者認證計劃介紹](/post/tensorflow-developer-certificate)：同樣聚焦 TensorFlow、機器學習，可接著比較不同情境的做法。
- [TensorFlow 目標檢測 API：訓練自己的資料](/post/tensorflow-object-detection-custom-training)：同樣聚焦 TensorFlow、機器學習，可接著比較不同情境的做法。
- [k-Fold Cross-Validation 交叉驗證教學：Holdout 與 StratifiedKFold 比較](/post/k-fold-cross-validation)：同樣聚焦 機器學習、TensorFlow，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2023-01-04，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};