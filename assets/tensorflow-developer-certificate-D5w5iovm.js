var e=`---
title: TensorFlow 開發者認證計劃介紹
description: TensorFlow 開發者認證計劃（TensorFlow Developer Certificate）介紹：考試內容、報名方式、測驗環境與開發技能清單整理，評估這張深度學習證照是否值得考取。
date: 2023-01-11
category: 機器學習
tags: [TensorFlow, 認證, 深度學習, 機器學習, PyCharm]
readingTime: 7 分鐘
image: /images/tech/hero_tensorflow-developer-certificate.webp
imageAlt: TensorFlow 開發者認證與深度學習學習概念示意圖
---


# TensorFlow 開發者認證計劃介紹

TensorFlow 官方提供開發者認證計劃（TensorFlow Developer Certificate），即使不打算考取認證，考試範圍也很適合作為學習 TensorFlow 的路線圖。本篇整理官方推薦課程、應試必備知識、考試使用的工具，以及完整的考試內容重點。

## TensorFlow 認證計劃有哪些推薦課程？

介紹網頁：<https://www.tensorflow.org/certificate>

在這個網頁當中，官方推薦了幾個課程：

- Udacity 的《[TensorFlow 在深度學習中的應用簡介](https://www.udacity.com/course/intro-to-tensorflow-for-deep-learning--ud187)》課程。
- Coursera 的《[DeepLearning.AI TensorFlow Developer 專業證書](https://www.coursera.org/professional-certificates/tensorflow-in-practice)》。

我選擇了 Udacity 的課程（因為免費），而且可以有中文字幕：

![Udacity TensorFlow 深度學習課程頁面截圖](/images/articles/tensorflow-developer-certificate-1.webp)

## 應試者必備哪些知識？

為了順利完成考試，應試者應該了解以下知識：

- 機器學習和深度學習的基本原則。
- 在 TensorFlow 2.x 中構建機器學習模型。
- 使用深度神經網絡和卷積神經網絡構建圖像識別算法、對象檢測算法、文本識別算法。
- 使用不同形狀和大小的真實圖像可視化圖像的捲積過程，了解計算機如何「觀察」信息、繪製損失和準確率圖。
- 探索防止過擬合的策略，包括增強和丟棄策略。
- 在 TensorFlow 中使用神經網絡解決自然語言處理問題。

## 認證考試使用什麼工具？

考試使用 **PyCharm**，因此應熟悉在 PyCharm 中撰寫 Python 程式、Debug 及 Compiler。

- 社區版連結：<https://www.jetbrains.com/pycharm/download/#section=windows>
- 若仍有學生的 email 信箱，則可以免費申請專業版：<https://www.jetbrains.com/community/education/#students>

## 認證考試的內容範圍在哪裡找？

雖然不一定要去獲得認證，但是從認證考試範圍可以了解，學習 TensorFlow 有哪些東西是官方認為必備的知識。以下為官方的認證說明文件：


### TensorFlow 開發技能

- 在 PyCharm 中寫 Python 程式的知識，解決 Python 問題，並編譯和執行 Python 程式。
- 了解如何查找有關 TensorFlow API 的信息，包括如何查找指南和 API（tensorflow.org 上的參考資料）。
- 知道如何從 TensorFlow API 中除錯、調查和解決錯誤訊息。
- 知道如何在 tensorflow.org 之外搜尋必要知識來解決在 TensorFlow 遇到的問題。
- 知道如何使用 TensorFlow 建立 ML 模型，其中模型大小對正在解決的問題來說是合理的。
- 知道如何儲存 ML 模型並檢查模型。
- 了解不同版本的 TensorFlow 的相容性差異。

### 使用 TensorFlow 2.x 構建和訓練神經網路模型

- 使用 TensorFlow 2.x。
- 使用 TensorFlow 構建、編譯和訓練機器學習（ML）模型。
- 預處理資料，使其準備好在模型中使用。
- 使用模型來預測結果。
- 為二元分類（binary classification）構建和訓練模型。
- 為多元分類器建構和訓練模型。
- 繪製經過訓練的模型的損失和準確性。
- 了解如何防止過度擬合，包括資料增強（augmentation）和 dropout。
- 使用預先訓練的模型（轉移學習）。
- 從預先訓練的模型中提取特徵。
- 確保模型的輸入處於正確的形狀。
- 確保可以將測試資料與神經網路的輸入形狀匹配。
- 確保可以將神經網絡的輸出數據與測試數據的指定輸入形狀相匹配。
- 瞭解資料的批次載入。
- 使用回撥（callback）來觸發訓練週期的結束。
- 使用不同來源的資料集。
- 使用不同格式的資料集，包括 CSV 和 JSON。
- 使用 tf.data.datasets 裡的資料集。

### 影像分類

了解如何使用 TensorFlow 2.x 以深度神經網路和卷積神經網路構建影像識別和物件檢測模型。需要知道如何：

- 使用 Conv2D 和池化層定義卷積神經網絡。
- 構建和訓練模型來處理真實世界的圖像數據集。
- 了解如何使用卷積來改進神經網絡。
- 使用不同形狀和大小的真實世界圖像。
- 使用圖像增強來防止過度擬合。
- 使用 ImageDataGenerator。
- 了解 ImageDataGenerator 如何根據目錄結構標記圖像。

### 自然語言處理（NLP）

需要了解如何使用神經網絡解決自然語言處理問題，包括：

- 使用 TensorFlow 構建自然語言處理系統。
- 準備要在 TensorFlow 模型中使用的文本。
- 構建使用二元分類識別一段文本類別的模型。
- 構建使用多類分類識別一段文本類別的模型。
- 在 TensorFlow 模型中使用詞嵌入。
- 在模型中使用 LSTM 對文本進行分類以進行二分類或多分類。
- 將 RNN 和 GRU 層添加到模型中。
- 在處理文本的模型中使用 RNN、LSTM、GRU 和 CNN。
- 在現有文本上訓練 LSTM 以生成文本（例如歌曲和詩歌）。

### 時間序列、序列和預測

需要了解如何在 TensorFlow 中解決時間序列和預測問題，包括：

- 訓練、調整和使用時間序列、序列和預測模型。
- 訓練模型來預測單變數和多變數時間序列的值。
- 為時間序列學習準備資料。
- 瞭解平均絕對誤差（MAE）以及如何將其用於評估序列模型的準確性。
- 使用 RNN 和 CNN 進行時間序列、序列和預測模型。
- 確定何時使用尾隨視窗與居中視窗。
- 使用 TensorFlow 進行預測。
- 準備功能和標籤。
- 識別和補償序列偏差。
- 動態調整時間序列、序列和預測模型的學習率。

## 常見問題

### TensorFlow 開發者認證考試要用什麼工具？

考試在 PyCharm 中進行，應試者需熟悉在 PyCharm 中撰寫 Python 程式、除錯與編譯。PyCharm 社區版可免費下載，有學生信箱的話還可以免費申請專業版。

### 考 TensorFlow 認證前應該上什麼課程？

官方推薦 Udacity 的《TensorFlow 在深度學習中的應用簡介》（免費、有中文字幕）與 Coursera 的 DeepLearning.AI TensorFlow Developer 專業證書課程，兩者皆可作為準備教材。

### 考試範圍包含哪些主題？

主要分四大塊：使用 TensorFlow 2.x 構建和訓練神經網路模型、影像分類（CNN 與 ImageDataGenerator）、自然語言處理（詞嵌入、LSTM、GRU、RNN），以及時間序列與預測（MAE、視窗策略、學習率調整）。

### 不打算考證照，看考試範圍還有價值嗎？

有。認證考試範圍代表官方認為學習 TensorFlow 必備的知識清單，可以當作完整的學習路線圖，逐項檢查自己是否已掌握構建、訓練、除錯與儲存模型的能力。

## 參考資料

- [TensorFlow 官方認證計劃網頁](https://www.tensorflow.org/certificate)
- [Udacity：Intro to TensorFlow for Deep Learning](https://www.udacity.com/course/intro-to-tensorflow-for-deep-learning--ud187)
- [Coursera：DeepLearning.AI TensorFlow Developer Professional Certificate](https://www.coursera.org/professional-certificates/tensorflow-in-practice)

## 延伸閱讀

- [Keras 介紹：用 Python 快速建立深度學習模型的高階 API](/post/keras-introduction)：同樣聚焦 TensorFlow、深度學習，可接著比較不同情境的做法。
- [如何縮小 TensorFlow 模型記憶體：剪枝、正則化與卷積設計](/post/reduce-tensorflow-model-memory)：同樣聚焦 TensorFlow、深度學習，可接著比較不同情境的做法。
- [ResNet 殘差網路是什麼？TensorFlow ResNet 介紹與使用範例](/post/resnet-tensorflow-introduction)：同樣聚焦 TensorFlow、深度學習，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2023-01-11，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};