var e=`---
title: 二元分類器 (binary classification) 介紹
description: 二元分類器是機器學習最常見的分類任務之一。本文介紹二元分類的定義、與多元分類在損失函數與激活函數上的差異、Keras 實作方式，以及優缺點比較，幫助你選對分類模型。
date: 2023-01-11
category: 機器學習
tags: [機器學習, 分類器, binary classification, Keras, 深度學習]
readingTime: 4 分鐘
image: /images/tech/hero_binary-classifier-introduction.webp
imageAlt: 二元分類器 (binary classification) 概念示意圖
---


# 二元分類器 (binary classification) 介紹

二元分類 (binary classification) 是機器學習中最常見的分類任務：把每筆資料歸類到兩個類別之一。這篇文章整理二元分類的基本概念、在 TensorFlow/Keras 中與多元分類的實作差異，以及各自的優缺點，幫助你在實際專案中選對做法。

## 甚麼是二元分類器？

二元分類 (binary classification) 是一種機器學習中常見的任務，其目的是從兩個不同類別中將每個數據樣本歸類為其中之一。這種分類方式只有兩個類別，因此其結果是二元的。例如，對於圖像分類問題，二元分類可以用來識別貓和狗的圖像，或用來識別垃圾郵件和非垃圾郵件的電子郵件。

在二元分類中，我通常會用一些演算法來建立模型，例如 logistic regression、decision tree、SVM、Random forest、neural network 等，來預測每個輸入數據樣本屬於哪個類別。當我們對新數據進行預測時，模型會輸出預測類別（0 或 1）。

在訓練階段，需要提供已經標註好類別的數據來訓練模型；並在測試階段使用該模型來預測新數據的類別，再使用常見的度量指標來評估模型的效果，例如精確度 (accuracy)、AUC-ROC、F1 score 等。

如果需要分類的類別超過兩個，則要改用多元分類 (multiclass classification)。

## 二元分類和多元分類器有什麼不同？

在 TensorFlow 中，實現二元分類和多元分類器主要有兩個不同之處：

- **損失函數**：二元分類器通常使用二元交叉熵 (binary cross-entropy) 作為損失函數；而多元分類器則常使用交叉熵 (cross-entropy) 作為損失函數。
- **輸出層的激活函數**：二元分類器的輸出層通常使用 sigmoid 激活函數；而多元分類器的輸出層則通常使用 softmax 激活函數。

除了上述兩點之外，實現二元分類器和多元分類器在 TensorFlow 中沒有太大差別。如果使用 Keras，可以直接使用其封裝好的 model——例如 \`keras.models.Sequential()\` 中，\`binary_crossentropy\` 適用於二元分類問題：

\`\`\`py
model.compile(loss='binary_crossentropy',
              optimizer='adam',
              metrics=['accuracy'])
\`\`\`

而 \`categorical_crossentropy\` 則適用於多元分類問題：

\`\`\`py
model.compile(loss='categorical_crossentropy',
              optimizer='adam',
              metrics=['accuracy'])
\`\`\`

但要注意：在訓練和測試階段，多元分類需要對每個類別進行單熱編碼 (one-hot encoding)。在 TensorFlow 中，可以使用 \`tf.keras.utils.to_categorical()\` 函數將標籤轉換為 one-hot 編碼。

## 二元分類器的優缺點

使用二元分類器，和使用多元分類器並將其限制為兩個類別的方式，之間有以下優缺點：

### 優點

- 使用二元分類器可以較為簡單地對兩個類別進行分類，而無需考慮額外的類別。
- 如果模型使用二元交叉熵作為損失函數，可以較容易地解釋分類結果，因為輸出層輸出的值是概率值，可以直接表示某一類別的可能性。

### 缺點

- 如果類別數量超過兩個，則無法使用二元分類器。
- 將多元分類器限制為兩個類別，可能會使模型的複雜度增加，因為必須考慮額外的類別，即使這些類別不需要分類。
- 如果將多元分類器限制為兩個類別，則無法充分利用模型的能力，可能無法在更大範圍內解決問題。
- 在某些情況下，使用二元分類器可能無法提供足夠的資訊來解釋分類結果，因為它只提供了兩個類別之間的資訊。

總之，如果只有兩個類別並且需要將數據標記為其中之一，使用二元分類器通常是最佳選擇；如果類別數量超過兩個、或需要更多資訊來解釋分類結果，則使用多元分類器可能是更好的選擇。

## 常見問題

### 什麼是二元分類 (binary classification)？

二元分類是機器學習中的一種分類任務，目的是把每筆資料歸類到兩個類別之一，例如垃圾郵件與非垃圾郵件。模型最終會輸出 0 或 1 的預測類別。

### 二元分類常用哪些演算法？

常見的演算法包括 logistic regression、decision tree、SVM、Random forest 和 neural network 等。評估時常用精確度、AUC-ROC、F1 score 等指標。

### 二元分類和多元分類在 Keras 中最大的差別是什麼？

主要差別有兩處：損失函數（二元用 \`binary_crossentropy\`，多元用 \`categorical_crossentropy\`）以及輸出層激活函數（二元用 sigmoid，多元用 softmax）。多元分類還需要先用 \`tf.keras.utils.to_categorical()\` 做 one-hot 編碼。

### 什麼時候應該用多元分類而不是二元分類？

當類別數量超過兩個，或需要更多資訊來解釋分類結果時，應該使用多元分類。如果只有兩個類別，二元分類器會更簡單、結果也更容易解釋。

## 參考資料

- [Keras Sequential model 官方文件](https://keras.io/api/models/sequential/)
- [tf.keras.utils.to_categorical 官方文件](https://www.tensorflow.org/api_docs/python/tf/keras/utils/to_categorical)

## 延伸閱讀

- [交叉熵相關損失函數的比較：categorical 與 sparse_categorical 差異](/post/cross-entropy-loss-functions-comparison)：同樣聚焦 Keras、深度學習，可接著比較不同情境的做法。
- [如何判讀機器學習訓練結果：loss、accuracy、val_loss、val_accuracy 完整解讀](/post/how-to-read-training-results)：同樣聚焦 機器學習、深度學習，可接著比較不同情境的做法。
- [Keras 介紹：用 Python 快速建立深度學習模型的高階 API](/post/keras-introduction)：同樣聚焦 Keras、深度學習，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2023-01-11，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};