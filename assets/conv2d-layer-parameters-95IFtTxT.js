var e=`---
title: 卷積層（Conv2D）參數設定教學
description: Keras Conv2D 卷積層參數怎麼設定？整理 filters、kernel_size、strides、padding、activation 等參數的意義，以及輸出特徵圖尺寸與參數量的計算方式，搭配範例說明。
date: 2022-12-22
category: 機器學習
tags: [Keras, Conv2D, CNN, 深度學習, 參數設定]
readingTime: 3 分鐘
image: /images/tech/hero_conv2d-layer-parameters.webp
imageAlt: 由點與線構成的球體抽象圖
---


# 卷積層（Conv2D）參數設定教學

Keras 的 \`Conv2D\` 是建立 CNN 時最核心的層，但 filters、kernel_size、strides、padding 這些參數該怎麼設，常常讓人拿捏不定。這篇筆記整理 Conv2D 的官方參數定義，並說明四個最常用參數的作用與調整思路。

## Conv2D 卷積層是什麼？

以下為 Keras 官方的 Conv2D 介紹連結：<https://keras.io/api/layers/convolution_layers/convolution2d/>

![Keras 官方文件中 Conv2D 卷積層的介紹截圖](/images/articles/conv2d-layer-parameters-1.webp)

## Conv2D 有哪些參數？

完整參數定義可以直接對照官方文件：

![Keras Conv2D 完整參數定義的官方文件截圖](/images/articles/conv2d-layer-parameters-2.webp)

## 最常用的四個參數怎麼設？

- **filters**：指定層中濾波器（也稱為卷積核）的數量。通常增加濾波器的數量可以提高模型的表現，但也會增加計算複雜度。
- **kernel_size**：指定濾波器的大小。濾波器越大，模型可以捕捉到的特徵就越大，但同樣會增加計算複雜度。
- **strides**：指定濾波器在輸入數據集上的步長。步長越大，模型就會捕捉到越少的特徵，但也會減少計算複雜度。
- **padding**：指定是否對輸入數據集進行 padding。如果選擇 padding，則會在輸入數據集的周圍填充一圈 0，以便濾波器可以捕捉到輸入數據集的邊界特徵。

## 實際設定時該怎麼取捨？

在設定這些參數時，需要考慮模型的複雜度和需要的特徵：

- 如果輸入數據集很大，且需要捕捉較大的特徵，那麼可能需要使用較大的濾波器（kernel_size）和較大的步長（strides）。
- 如果輸入數據集較小，且需要捕捉較多的細節，那麼可能需要使用較小的濾波器和較小的步長。

還可以嘗試使用不同的 padding 方式來控制輸出的大小：如果使用 \`same\` padding，輸出數據集的大小將與輸入相同；如果使用 \`valid\` padding，輸出數據集的大小會比輸入小。

## 常見問題

### filters 設越大越好嗎？

不一定。增加 filters 通常能提升模型表現，但計算量與參數量也會等比上升，容易過擬合或拖慢訓練速度。一般做法是靠近輸入的層用較少 filters，越深的層逐漸增加。

### padding 選 same 還是 valid？

\`same\` 會在輸入周圍補 0，讓輸出尺寸與輸入相同，適合想保留空間尺寸、捕捉邊界特徵的場景；\`valid\` 不補 0，輸出會縮小，適合想自然降低特徵圖尺寸的場景。

### strides 調大會發生什麼事？

步長越大，濾波器滑動時覆蓋的取樣點越少，捕捉到的特徵會變少、輸出特徵圖也變小，但計算複雜度隨之下降。它常被用來替代池化層以降低維度。

## 參考資料

- [Keras Conv2D 官方文件](https://keras.io/api/layers/convolution_layers/convolution2d/)

## 延伸閱讀

- [卷積神經網路 CNN 介紹：卷積層、池化層與彩色圖片處理原理](/post/cnn-convolutional-neural-network-intro)：同樣聚焦 CNN、Keras，可接著比較不同情境的做法。
- [Keras model.fit() 參數設定：batch_size、epochs、validation 與 callbacks 怎麼用？](/post/keras-model-fit-parameters)：同樣聚焦 Keras、深度學習，可接著比較不同情境的做法。
- [Keras model.summary 參數量怎麼算？Dense、Conv2D 與 BatchNormalization Param 計算](/post/keras-model-summary-param-calculation)：同樣聚焦 Keras、深度學習，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2022-12-22，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};