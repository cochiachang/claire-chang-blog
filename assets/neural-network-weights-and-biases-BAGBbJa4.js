var e=`---
title: 模型的權重與偏差值是什麼？神經網路 Weight、Bias 與訓練更新概念
description: 說明機器學習模型中的權重與偏差值意義，整理神經網路如何透過訓練更新參數。
date: 2023-01-04
category: 機器學習
tags: [神經網路, 權重, 偏差值, 深度學習]
readingTime: 6 分鐘
image: /images/tech/hero_neural-network-weights-and-biases.webp
imageAlt: 模型的權重與偏差值是什麼？神經網路 Weight、Bias 與訓練更新概念 hero image
---


# 模型的權重與偏差值是什麼？神經網路 Weight、Bias 與訓練更新概念

模型的權重與偏差值是神經網路最核心的可學習參數。權重決定輸入特徵的重要程度，偏差值讓模型輸出可以整體平移，兩者會在訓練過程中透過損失函數與反向傳播更新。

## 權重與偏差值分別代表什麼？

權重代表輸入特徵對輸出的影響強度，偏差值代表不依賴輸入的基準位移。神經網路每一層通常都會保存權重矩陣與偏差向量。

以線性層來看，模型會計算：

\`\`\`text
y = xW + b
\`\`\`

\`W\` 是權重，\`b\` 是偏差值。若沒有偏差值，模型輸出會被限制在必須通過原點的形式；加入偏差值後，模型可以表示更多函數形狀。

## 權重如何在訓練中被更新？

權重會根據損失函數對參數的梯度逐步更新。反向傳播計算每個參數造成錯誤的方向，最佳化器再決定每次要調整多少。

典型訓練迴圈：

1. 用目前權重做預測。
2. 用損失函數比較預測與標籤。
3. 透過反向傳播計算梯度。
4. 用 Adam 或 SGD 更新權重與偏差值。

TensorFlow layer 文件把 layer 的 weights 分為 trainable 與 non-trainable 狀態（TensorFlow，存取日期：2026-08-27）。這表示不是所有 layer 狀態都一定會被梯度更新。

## 偏差值為什麼不是可有可無？

偏差值可以讓模型在所有輸入都為零時仍有可調整輸出。對分類或回歸模型來說，偏差值常能讓決策邊界更有彈性。

實務資訊增益：若某個 Dense 或 Conv2D 後面接 BatchNormalization，開發者有時會設定 \`use_bias=False\`。原因是 BatchNormalization 已經有可學習的位移參數 beta，重複 bias 的必要性降低。

## 如何在 Keras 查看權重與偏差值？

Keras 可以透過 layer 的 \`get_weights()\` 查看權重與偏差值。回傳清單通常依 layer 參數順序包含 kernel 與 bias。

\`\`\`python
weights = model.layers[0].get_weights()
kernel = weights[0]
bias = weights[1]

print(kernel.shape)
print(bias.shape)
\`\`\`

查看權重時重點不是人工修改每個數值，而是確認 shape 是否符合模型設計。shape 錯誤通常代表輸入維度或 layer 設定不如預期。

## 常見問題

### 權重和參數是同一個意思嗎？

權重是參數的一種。深度學習模型的參數通常包含權重、偏差值，以及部分 layer 的可學習縮放或位移參數。

### 偏差值一定會存在嗎？

偏差值不一定存在。Keras layer 可以透過 \`use_bias=False\` 關閉 bias，常見於後面接 BatchNormalization 的結構。

### 權重初始值重要嗎？

權重初始值很重要。合適初始化能讓梯度更穩定，不合適初始化可能造成訓練很慢或無法收斂。

### 權重越大代表特徵越重要嗎？

單看權重大小不能直接判定特徵重要性。輸入尺度、正規化方式、模型結構與非線性層都會影響解讀。

### 可以手動設定模型權重嗎？

Keras 可以用 \`set_weights()\` 手動設定權重。實務上通常只在載入預訓練權重、測試或模型遷移時這樣做。

## 參考資料

- TensorFlow，〈[tf.keras.layers.Layer](https://www.tensorflow.org/api_docs/python/tf/keras/layers/Layer)〉，存取日期：2026-08-27。

## 延伸閱讀

- [深度學習模型-MLP、CNN與 RNN](/post/deep-learning-models-mlp-cnn-rnn)：同樣聚焦 深度學習，可接著比較不同情境的做法。
- [Keras 介紹：用 Python 快速建立深度學習模型的高階 API](/post/keras-introduction)：同樣聚焦 深度學習，可接著比較不同情境的做法。
- [Keras model.summary 參數量怎麼算？Dense、Conv2D 與 BatchNormalization Param 計算](/post/keras-model-summary-param-calculation)：同樣聚焦 深度學習，可接著比較不同情境的做法。

## 最後更新

2026-08-28

`;export{e as default};