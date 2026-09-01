var e=`---
title: 卷積神經網路 CNN 介紹：卷積層、池化層與彩色圖片處理原理
description: 介紹卷積神經網路 CNN 的核心結構：Conv2D 卷積層如何用卷積核提取圖片特徵、padding 的 valid 與 same 差異、MaxPooling2D 池化層的下採樣原理，以及彩色 RGB 圖片的卷積計算方式。
date: 2022-12-22
category: 機器學習
tags: [CNN, 卷積神經網路, TensorFlow, Keras, 深度學習]
readingTime: 4 分鐘
image: /images/tech/hero_cnn-convolutional-neural-network-intro.webp
imageAlt: 卷積神經網路 CNN 介紹：卷積層、池化層與彩色圖片處理原理
---


# 卷積神經網路 CNN 介紹：卷積層、池化層與彩色圖片處理原理

卷積神經網路（Convolutional Neural Network，簡稱 CNN）是一種專門用於圖像處理的神經網路。它包含許多卷積層和池化層，可以捕捉圖像中的空間關係和細節。這篇文章整理我在學 CNN 時的核心筆記：卷積層與池化層各自做什麼、padding 參數怎麼選，以及彩色圖片的卷積複雜度為什麼比黑白圖片高。

## CNN 的兩大核心層是什麼？

CNN 主要由兩種層組成，各司其職：

- **卷積層**：Conv2D（\`tf.keras.layers.Conv2D\`），使用一個卷積核來提取圖片特徵
- **池化層**：MaxPooling2D（\`tf.keras.layers.MaxPooling2D\`），通過計算輸入圖像不同區域的最大值或平均值來進行池化

簡單來說，卷積層負責「找出特徵」，池化層負責「壓縮特徵」，兩者交替堆疊就構成了 CNN 的基本骨架。

## 卷積層（Conv2D）如何提取圖片特徵？

卷積層使用一個卷積核來提取圖片特徵，其參數設定的詳細介紹可以參考[TensorFlow 影像操作](/post/tensorflow-image-operations)。

卷積層中的每個神經元都有一個濾波器（也稱為卷積核），用來提取圖像的特徵。每個濾波器都有一個指定的大小和深度，並且會在輸入圖像的不同區域進行卷積運算。例如，如果濾波器的大小為 3x3，且深度為 16，則每個濾波器都會提取 3x3 的區域中深度為 16 的特徵。

以下為其計算方法的簡單範例：

![卷積層計算方法範例](/images/articles/cnn-convolutional-neural-network-intro-1.webp)

## padding 的 valid 與 same 有什麼差別？

當有部分的卷積核超出圖片範圍時，有兩種方法可以解決：

1. **忽略超出部分**：將 padding 設定為 \`valid\`，輸出特徵圖會比輸入小

   ![padding 設定為 valid 的範例](/images/articles/cnn-convolutional-neural-network-intro-2.webp)

2. **在圖像周圍填充 0**：將 padding 設定為 \`same\`，輸出特徵圖的大小會與輸入相同

   ![padding 設定為 same 的範例](/images/articles/cnn-convolutional-neural-network-intro-3.webp)

實務上，想要保留輸入圖像的空間大小就選 \`same\`；想要減少計算量、不介意邊緣資訊損失就選 \`valid\`。

## 池化層（MaxPooling2D）的功能是什麼？

池化層是將輸入圖像的大小縮小的層，它的主要功能是對圖像的特徵進行下采樣（downsampling），降低網絡的計算量並減少過擬合（overfitting）的風險。通過池化，可以將圖像中的高維度特徵轉化為低維度特徵、降低計算複雜度，同時還能保留圖像中重要的特徵。

最大值池化層和平均值池化層是兩種常用的池化方法：

| 池化方法 | 做法與適用情境 |
|---|---|
| 最大值池化（Max Pooling） | 每個子區域取出最大值，保留最重要的特徵，適用於**辨識邊緣、輪廓、細節**的圖像 |
| 平均值池化（Average Pooling） | 每個子區域取出平均值，更能**保留圖像整體特徵**，適用於辨識整體顏色、紋理、形狀 |

記得依不同情境需求評估適用的池化層種類，並且池化層種類通常與當時的訓練資料有關。

下面為一個最大池化層的實作步驟解釋：

![最大池化層實作步驟解釋](/images/articles/cnn-convolutional-neural-network-intro-4.webp)

池化層有兩個重要參數：\`pool_size\` 和 \`strides\`，分別代表池化的大小和步長。上圖的示例為步長 2 且池化大小為 (2,2) 的最大池化層範例。

## 如何對彩色圖片做卷積處理？

因為彩色圖片是一個 RGB 圖片，每個像素由三個顏色通道組成：

![彩色圖片的三個顏色通道](/images/articles/cnn-convolutional-neural-network-intro-5.webp)

若是黑白圖片的形狀為 (25,25,1)，則相同大小的彩色圖片形狀會是 (25,25,3)，因此卷積核的形狀也會從 (3,3) 變為 (3,3,3)：

![彩色圖片卷積核形狀變化](/images/articles/cnn-convolutional-neural-network-intro-6.webp)

每一個圖層都要算三次然後再加總，總共要三個圖層，因此複雜度從黑白圖片到彩色圖片會增加 9 倍以上：

![彩色圖片卷積的計算複雜度](/images/articles/cnn-convolutional-neural-network-intro-7.webp)

這也是為什麼在訓練影像模型時，輸入圖像的顏色與尺寸會直接影響訓練時間——在分類任務中，先把彩色圖片轉灰階有時是省時又有效的做法。

## 常見問題

### CNN 為什麼適合處理圖像？

CNN 透過卷積核在圖像上滑動進行局部運算，能捕捉圖像中的空間關係和細節（如邊緣、輪廓、紋理），比全連接網路更少參數且更適合影像特徵。

### Conv2D 的 padding 設定 valid 和 same 差在哪裡？

\`valid\` 表示不做填充，卷積核超出圖片範圍的部分直接忽略，輸出會變小；\`same\` 會在圖像周圍填充 0，讓輸出特徵圖大小與輸入相同。

### MaxPooling 和 AveragePooling 該怎麼選？

最大值池化保留每個子區域最強的特徵，適合辨識邊緣、輪廓、細節；平均值池化保留整體特徵，適合辨識顏色、紋理、形狀。實際選擇應依訓練資料的特性評估。

### 彩色圖片的卷積為什麼比黑白圖片貴？

黑白圖片只有一個通道（如 (25,25,1)），彩色 RGB 圖片有三個通道（(25,25,3)），卷積核深度也要變成 (3,3,3)，每層要計算三次再加總，複雜度會增加 9 倍以上。

### 池化層的 pool_size 和 strides 是什麼？

\`pool_size\` 是池化窗口的大小（如 (2,2)），\`strides\` 是窗口每次滑動的步長。兩者共同決定特徵圖被縮小的比例。

## 參考資料

- [TensorFlow 影像操作](/post/tensorflow-image-operations)
- TensorFlow，〈[tf.keras.layers.Conv2D](https://www.tensorflow.org/api_docs/python/tf/keras/layers/Conv2D)〉
- TensorFlow，〈[tf.keras.layers.MaxPooling2D](https://www.tensorflow.org/api_docs/python/tf/keras/layers/MaxPooling2D)〉

## 延伸閱讀

- [卷積層（Conv2D）參數設定教學](/post/conv2d-layer-parameters)：同樣聚焦 Keras、CNN，可接著比較不同情境的做法。
- [深度學習模型-MLP、CNN與 RNN](/post/deep-learning-models-mlp-cnn-rnn)：同樣聚焦 深度學習、CNN，可接著比較不同情境的做法。
- [ResNet 殘差網路是什麼？TensorFlow ResNet 介紹與使用範例](/post/resnet-tensorflow-introduction)：同樣聚焦 TensorFlow、深度學習，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2022-12-22，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};