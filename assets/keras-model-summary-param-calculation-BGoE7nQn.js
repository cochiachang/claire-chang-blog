var e=`---
title: Keras model.summary 參數量怎麼算？Dense 與 Conv2D 範例
description: 說明 Keras model.summary() 的 Param 欄位如何計算，包含 Dense、Conv2D、BatchNormalization 範例。
date: 2023-01-04
category: 機器學習
tags: [Keras, TensorFlow, model.summary, 深度學習]
readingTime: 7 分鐘
image: /images/tech/hero_keras-model-summary-param-calculation.webp
imageAlt: Keras model.summary 參數量計算示意圖
---


# Keras model.summary 參數量怎麼算？Dense、Conv2D 與 BatchNormalization Param 計算

Keras \`model.summary()\` 的 Param 欄位代表每一層可訓練或不可訓練參數數量。Dense 層通常是「輸入特徵數 x 輸出神經元數 + bias」，Conv2D 則是「kernel 高 x kernel 寬 x 輸入通道 x filter 數 + bias」。

## model.summary() 的 Param 是什麼？

\`model.summary()\` 的 Param 是模型層參數數量摘要。Param 可以幫助開發者判斷模型容量、記憶體需求與過擬合風險。

TensorFlow 的 \`tf.keras.Model\` 文件說明 Model 提供訓練、評估、推論與摘要等方法（TensorFlow，存取日期：2026-08-27）。Param 數量越高，模型通常需要更多資料與運算資源，但不代表準確率一定更高。

## Dense 層參數量怎麼算？

Dense 層參數量等於輸入特徵數乘以輸出神經元數，再加上每個輸出神經元的 bias。公式是 \`input_dim * units + units\`。

範例：

\`\`\`python
from tensorflow.keras import layers, Sequential

model = Sequential([
    layers.Dense(64, input_shape=(100,)),
])
model.summary()
\`\`\`

Dense 層 Param 計算：

\`\`\`text
100 * 64 + 64 = 6464
\`\`\`

實務資訊增益：若 Dense 層接在 Flatten 後面，參數量常會暴增。影像模型中過早 Flatten，通常比多加一層卷積更容易造成記憶體與過擬合問題。

## Conv2D 層參數量怎麼算？

Conv2D 層參數量等於 kernel 面積乘以輸入通道數乘以 filter 數，再加上 bias。公式是 \`kernel_h * kernel_w * input_channels * filters + filters\`。

範例：輸入通道 3、kernel 3x3、filter 32。

\`\`\`text
3 * 3 * 3 * 32 + 32 = 896
\`\`\`

Conv2D 的輸出影像尺寸會影響下一層輸入 shape，但不直接影響該 Conv2D 層自己的權重數量。Conv2D 權重由 kernel、通道與 filter 決定。

## BatchNormalization 的參數為什麼常看起來比較多？

BatchNormalization 通常包含 gamma、beta、moving mean 與 moving variance。gamma 與 beta 可訓練，moving mean 與 moving variance 不可訓練。

若某層有 64 個 channel，BatchNormalization 可能顯示 256 個參數，其中 128 個可訓練、128 個不可訓練。這也是檢查 \`Trainable params\` 與 \`Non-trainable params\` 時容易忽略的地方。

## 常見問題

### model.summary 的 Param 越少越好嗎？

Param 越少不一定越好。較少參數可能降低過擬合與記憶體成本，但模型容量不足時會欠擬合。

### Conv2D 的輸出圖片大小會影響 Param 嗎？

Conv2D 的輸出圖片大小不影響該層 Param。Conv2D Param 由 kernel 尺寸、輸入通道、filter 數與 bias 決定。

### bias 可以不要算嗎？

若 layer 設定 \`use_bias=False\`，bias 就不會計入參數量。BatchNormalization 後面的卷積層有時會關閉 bias。

### Non-trainable params 是什麼？

Non-trainable params 是訓練時不由梯度更新的參數。BatchNormalization 的 moving statistics 與凍結模型層的權重都可能出現在這裡。

### 為什麼 Flatten 後 Dense 參數量很大？

Flatten 會把影像特徵圖攤平成長向量。若特徵圖尺寸仍很大，接 Dense 層會讓 \`input_dim * units\` 快速變成巨大數字。

## 參考資料

- TensorFlow，〈[tf.keras.Model](https://www.tensorflow.org/api_docs/python/tf/keras/Model)〉，存取日期：2026-08-27。
- TensorFlow，〈[tf.keras.layers.Layer](https://www.tensorflow.org/api_docs/python/tf/keras/layers/Layer)〉，存取日期：2026-08-27。

## 延伸閱讀

- [Keras 介紹：用 Python 快速建立深度學習模型的高階 API](/post/keras-introduction)：同樣聚焦 Keras、TensorFlow，可接著比較不同情境的做法。
- [Keras model.fit() 參數設定：batch_size、epochs、validation 與 callbacks 怎麼用？](/post/keras-model-fit-parameters)：同樣聚焦 Keras、TensorFlow，可接著比較不同情境的做法。
- [卷積層（Conv2D）參數設定教學](/post/conv2d-layer-parameters)：同樣聚焦 Keras、深度學習，可接著比較不同情境的做法。

## 最後更新

2026-08-28

`;export{e as default};