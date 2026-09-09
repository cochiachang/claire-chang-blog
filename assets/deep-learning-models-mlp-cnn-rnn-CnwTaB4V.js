var e=`---
title: 深度學習模型-MLP、CNN與 RNN
description: 一次搞懂三大深度學習模型：MLP 多層感知器、CNN 卷積神經網路與 RNN 循環神經網路的差異、輸入資料維度、Keras Dense 層與 relu 觸發函數、dropout 正規化，以及輸出層觸發函數的選擇。
date: 2022-12-24
category: 機器學習
tags: [深度學習, MLP, CNN, RNN, Keras]
readingTime: 5 分鐘
image: /images/tech/hero_deep-learning-models-mlp-cnn-rnn.webp
imageAlt: 深度學習神經網路示意圖：電路板紋理構成的大腦
---


# 深度學習模型-MLP、CNN與 RNN

這篇文章整理三種最常見的深度學習模型——MLP（多層感知器）、CNN（卷積神經網路）與 RNN（循環神經網路）——的差異與適用場景，並說明在 Keras 中如何依模型類型調整輸入資料維度、選擇觸發函數，以及用 dropout 做正規化。適合剛入門深度學習、想搞清楚「什麼資料該餵給什麼模型」的讀者。

## 常見的深度學習模型有哪些？

三種深度學習模型，包含：

- MLP：多層感知器（Multilayer Perceptron）
- CNN：卷積神經網路（Convolutional Neural Network）
- RNN：循環神經網路（Recurrent Neural Network）

## MLP、CNN與RNN的差異是什麼？

多層感知器（簡稱 MLP）就是一個全連接網路。在某些文獻裡，它被稱為深度前饋（feedforward）網路或前饋神經網路。從目標應用來認識這些網路，有助於我們理解這些進階深度學習模型的設計原理。MLP 常用於簡易的算術與線性迴歸問題。不過，MLP 在處理順序型與多維度資料樣式上的效能不是太好——它在先天設計上很難記住順序型資料的樣式，並且需要相當大量的參數才能處理多維度資料。

RNN 很常用於順序型的輸入資料，因為其內部設計能讓網路去發掘歷史資料的相依性，這對於預測來說相當有用。

而對於圖片或影片這類多維度資料，CNN 在擷取用於分類、分割、生成或其他目的的特徵圖都相當不錯。在某些狀況下，型態為 1D 卷積的 CNN 也可用於能接受順序型輸入資料的網路。然而在多數深度學習模型中，會把 MLP、RNN 與 CNN 結合起來，讓它們發揮各自所長。

## MLP、CNN與RNN 輸入的資料維度有什麼不同？

在將資料傳入模型前，需要根據模型類型來調整形狀：

![MLP、CNN 與 RNN 的輸入資料維度](/images/articles/deep-learning-models-mlp-cnn-rnn-1.webp)

## Keras 中怎麼用 Dense 層組出 MLP？

Keras 把 MLP 層稱為 Dense，代表密集連接層。第一與第二 MLP 層完全相同，各有 256 個單元，接著是 relu 觸發與 dropout。之所以選用 256 單元，是因為 128、512 與 1,024 單元的效能較差：網路在 128 單元時會很快收斂，但測試準確度也較低；而把單元數拉高到 512 或 1,024 並不會大幅提升測試準確度。

單元數量稱為超參數（hyperparameter），它控制了網路的容量（capacity）。容量是指網路可模擬出的函數複雜度——例如對多項式來說，超參數就是其次方數，只要次方數增加，函數容量也會增加。

如以下模型，在此使用 Keras 的 Sequential Model API 來實作一個分類器模型。當模型只需要一個輸入、一個輸出，且只需要由順序排列的層來處理時，這樣已經很足夠。

## 為什麼 Dense 層之間要加 relu 觸發函數？

由於 Dense 層屬於線性操作，就算有一連串的 Dense 層，也只能模擬線性函數。問題在於 MNIST 數字分類在本質上就是非線性過程。在 Dense 層之間插入 relu 觸發，可讓 MLP 得以針對非線性應對來建模。

relu（或稱為修正線性單元，Rectified Linear Unit）是一種簡易的非線性函數，它很像個過濾器：只讓正值輸入通過且保持不變，其他則全部變為零。數學上來說，relu 可用以下方程式來表示：

![relu 修正線性單元的數學定義](/images/articles/deep-learning-models-mlp-cnn-rnn-2.webp)

## 為什麼需要 dropout 正規化？

神經網路傾向於記住自身的訓練資料，尤其是當容量充足的時候。在這樣的狀況下，網路碰到測試資料時就會一塌糊塗——這就是網路無法一般化（generalize）的典型症狀。模型會運用正規化層或正規化函數來避免這個傾向，常見的正規化層也稱為 dropout。

dropout 的概念很簡單：指定 dropout 率（在此設定 dropout=0.45），Dropout 層就會隨機移除這個比例的單元數，不讓它們參與下一層。例如第一層有 256 個單元，隨後應用 dropout=0.45，這樣一來層 1 就只會有 (1 − 0.45) × 256 = 140 個單元會參與層 2。

## 神經網路的觸發函數該怎麼選？

常見給神經網路選擇的觸發函數整理如下：

![常見的神經網路觸發函數](/images/articles/deep-learning-models-mlp-cnn-rnn-3.webp)

### 輸出層的觸發函數選擇

常見選項有 linear、sigmoid 與 tanh：

- **linear** 觸發的是 identity 函數，就是把輸入複製到輸出而已。
- **sigmoid** 也稱為 logistic sigmoid，可用於預測 tensor 的元素須獨立映射到 0.0 與 1.0 之間的情形。預測 tensor 所有元素的總和不需要為 1.0，這是與 softmax 最大的不同。例如 sigmoid 可用於情緒預測（0.0 為差、1.0 為優）的最後一層，或影像產生（0.0 為 0、1.0 則為 255 像素值）。
- **tanh** 函數可將其輸入映射到 −1.0 到 1.0 之間，這個性質在輸出值需要有正負值時尤其重要。tanh 常用於循環神經網路的內部層，但也可用於輸出層觸發。如果用 tanh 來取代輸出觸發中的 sigmoid，那麼資料就需要先適當縮放才行。

## 常見問題

### MLP、CNN、RNN 各適合什麼樣的資料？

MLP 適合簡易的算術與線性迴歸問題；RNN 適合文字、時間序列等順序型輸入，因為它能發掘歷史資料的相依性；CNN 則擅長圖片、影片等多維度資料的特徵擷取，用於分類、分割與生成。

### 為什麼要在 Dense 層之間插入 relu？

Dense 層是線性操作，串再多層也只能模擬線性函數。relu 是簡單的非線性函數，只讓正值通過、其餘歸零，插入後 MLP 才能建模非線性問題。

### dropout 是怎麼防止過擬合的？

dropout 會隨機移除一定比例（如 0.45）的單元，不讓它們參與下一層的計算。這讓網路無法只依賴特定神經元記住訓練資料，進而提升對測試資料的一般化能力。

### sigmoid 與 softmax 有什麼不同？

sigmoid 把每個元素獨立映射到 0.0–1.0 之間，元素的總和不需為 1.0；softmax 則讓所有輸出的總和為 1.0。因此多分類互斥問題用 softmax，元素各自獨立的預測（如情緒強度、像素值）用 sigmoid。

### 什麼時候該用 tanh 而不是 sigmoid？

當輸出值需要包含正負值時，tanh（映射到 −1.0–1.0）比 sigmoid 更合適。tanh 也常用於 RNN 的內部層，但若取代輸出層的 sigmoid，資料要先適當縮放。

## 參考資料

- 本文為我深度學習系列筆記之一，延伸實作可參考上方的 Keras 與 TensorFlow Dense 層文章。

## 延伸閱讀

- [卷積神經網路 CNN 介紹：卷積層、池化層與彩色圖片處理原理](/post/cnn-convolutional-neural-network-intro)：同樣聚焦 CNN、Keras，可接著比較不同情境的做法。
- [Keras 介紹：用 Python 快速建立深度學習模型的高階 API](/post/keras-introduction)：同樣聚焦 Keras、深度學習，可接著比較不同情境的做法。
- [卷積層（Conv2D）參數設定教學](/post/conv2d-layer-parameters)：同樣聚焦 Keras、CNN，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2022-12-24，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};