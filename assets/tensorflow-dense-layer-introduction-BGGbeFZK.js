var e=`---
title: TensorFlow Dense 全連接層介紹：公式、用途與 Fashion MNIST 範例
description: 介紹 tf.keras.layers.Dense 的全連接層概念、權重矩陣、偏差項、激活函數，以及使用 Dense 建立 Fashion MNIST 分類器。
date: 2023-01-11
category: 機器學習
tags: [TensorFlow, Keras, Dense]
readingTime: 7 分鐘
image: /images/tech/hero_tensorflow-dense-layer-introduction.webp
imageAlt: 發光節點與連線構成的神經網路，象徵 TensorFlow Dense 全連接層的特徵組合
---
# TensorFlow Dense 全連接層介紹：公式、用途與 Fashion MNIST 範例

TensorFlow 的 Dense 層就是全連接層，對應的類別是 \`tf.keras.layers.Dense\`。Dense 層會讓每個輸入特徵都參與每個輸出神經元的計算，透過權重矩陣、偏差項與激活函數，把輸入轉成分類、迴歸或下一層需要的特徵表示。

## TensorFlow 的 Dense 層是什麼？

TensorFlow 中的全連接層使用 \`tf.keras.layers.Dense\` 建立。Dense 層是 Keras 裡最常見的基礎層之一，常出現在分類模型的最後幾層。

官方 API 文件定義 Dense 層會對輸入做矩陣運算，並可套用 activation function（TensorFlow API）。最常見的寫法如下：

\`\`\`python
tf.keras.layers.Dense(128, activation='relu')
\`\`\`

這行代表建立 128 個輸出單元，並使用 ReLU 作為激活函數。若放在分類輸出層，常見寫法會是：

\`\`\`python
tf.keras.layers.Dense(10, activation='softmax')
\`\`\`

其中 10 通常代表 10 個分類類別。

## 全連接層如何運作？

全連接層會讓前一層的每個輸入都連到每個輸出。Dense 層透過權重矩陣和偏差項計算輸出，再交給激活函數轉換。

Dense 層的基本公式是：

\`\`\`text
y = W * x + b
\`\`\`

在這個公式中：

| 符號 | 意義 |
| --- | --- |
| \`x\` | 輸入向量 |
| \`W\` | Dense 層學到的權重矩陣 |
| \`b\` | 偏差項 |
| \`y\` | Dense 層輸出 |

原文用線性代數的方式解釋：如果 \`W\` 是 \`m x n\` 矩陣，\`x\` 是 \`n x 1\` 向量，\`y\` 就會是 \`m x 1\` 向量。這種運算方式可以把輸入特徵重新組合成高維度且有用的表示。

## Dense 層為什麼常用在輸出層？

Dense 層常用在輸出層，因為 Dense 層能學習特徵組合，並透過激活函數轉成任務需要的輸出格式。

原文整理 Dense 層的優點有三個：

1. Dense 層可以實現非線性轉換，分類模型的輸出通常需要這種能力。
2. Dense 層的矩陣運算效率高，適合處理大量輸出計算。
3. Dense 層可以透過訓練自動調整權重與偏差，把輸入特徵組合成有用輸出。

Dense 層不是只能放在輸出層。多層感知器（Multilayer Perceptron，MLP）會連續堆疊 Dense 層；卷積神經網路也常在特徵抽取後接 Dense 層做分類。

## 如何用 Dense 建立 Fashion MNIST 分類器？

Fashion MNIST 是練習 Dense 層的好範例。模型可先用 Flatten 攤平 28x28 圖片，再接 Dense 隱藏層和 Dense 輸出層。

以下保留原文核心程式碼，整理成較乾淨的 Keras 範例：

\`\`\`python
import tensorflow as tf
import tensorflow_datasets as tfds
import math

tfds.disable_progress_bar()

dataset, metadata = tfds.load('fashion_mnist', as_supervised=True, with_info=True)
train_dataset, test_dataset = dataset['train'], dataset['test']
num_train_examples = metadata.splits['train'].num_examples
num_test_examples = metadata.splits['test'].num_examples

def normalize(images, labels):
    images = tf.cast(images, tf.float32)
    images /= 255
    return images, labels

train_dataset = train_dataset.map(normalize).cache()
test_dataset = test_dataset.map(normalize).cache()

model = tf.keras.Sequential([
    tf.keras.layers.Flatten(input_shape=(28, 28, 1)),
    tf.keras.layers.Dense(128, activation=tf.nn.relu),
    tf.keras.layers.Dense(10, activation=tf.nn.softmax)
])

model.compile(
    optimizer='adam',
    loss=tf.keras.losses.SparseCategoricalCrossentropy(),
    metrics=['accuracy']
)

BATCH_SIZE = 32
train_dataset = train_dataset.repeat().shuffle(num_train_examples).batch(BATCH_SIZE)
test_dataset = test_dataset.batch(BATCH_SIZE)

model.fit(
    train_dataset,
    epochs=5,
    steps_per_epoch=math.ceil(num_train_examples / BATCH_SIZE)
)

test_loss, test_accuracy = model.evaluate(
    test_dataset,
    steps=math.ceil(num_test_examples / BATCH_SIZE)
)
print('Accuracy on test dataset:', test_accuracy)
\`\`\`

這個模型的重點不是追求最高準確率，而是看懂 Dense 層如何把圖片像素轉成分類結果。

## Dense 層有哪些實作注意事項？

Dense 層參數量會隨輸入維度和輸出單元數增加。輸入攤平後維度越大，Dense 層越容易變成模型中的主要參數來源。

以 Fashion MNIST 為例，28x28 圖片攤平成 784 維。如果第一個 Dense 層有 128 個單元，單這層就有 \`784 * 128 + 128\` 個參數。資料量不大時，參數太多可能增加過擬合風險。

實作時可以注意：

- 分類輸出層單元數要等於類別數。
- 多分類常搭配 softmax。
- 隱藏層常搭配 ReLU。
- 輸入圖片進 Dense 前通常要先 Flatten。
- 資料要正規化，例如把像素縮放到 0 到 1。

Dense 層看起來簡單，但它是理解神經網路矩陣運算最好的入口。

## 常見問題
### Dense 層和全連接層是一樣的嗎？

在 Keras 與 TensorFlow 的語境中，Dense 層通常就是全連接層。Dense 層會讓每個輸入特徵連接到每個輸出單元。

### Dense 層一定要加 activation 嗎？

Dense 層不一定要加 activation。隱藏層通常會加 ReLU 等非線性函數，輸出層則依任務選擇 softmax、sigmoid 或不加 activation。

### Flatten 和 Dense 有什麼關係？

Flatten 會把多維輸入攤平成一維向量，讓 Dense 層可以接收。圖片分類模型常先 Flatten，再接 Dense 層。

### Dense 層參數量怎麼算？

Dense 層參數量是輸入維度乘以輸出單元數，再加上偏差項數量。例如 784 維輸入接 128 單元，參數量是 \`784 * 128 + 128\`。

### Dense 層適合處理圖片嗎？

Dense 層可以處理圖片攤平後的資料，但卷積層更擅長保留空間特徵。初學範例可用 Dense，較複雜的影像任務通常會加入 CNN。

## 參考資料
- TensorFlow，〈[tf.keras.layers.Dense](https://www.tensorflow.org/api_docs/python/tf/keras/layers/Dense)〉。
- TensorFlow，〈[Basic classification: Classify images of clothing](https://www.tensorflow.org/tutorials/keras/classification)〉。

## 延伸閱讀

- [Keras model.summary 參數量怎麼算？Dense、Conv2D 與 BatchNormalization Param 計算](/post/keras-model-summary-param-calculation)：同樣聚焦 Keras、TensorFlow，可接著比較不同情境的做法。
- [TensorFlow 和 Keras 版本不相容錯誤：cannot import name 'dtensor' 解法](/post/tensorflow-keras-version-compatibility-error)：同樣聚焦 TensorFlow、Keras，可接著比較不同情境的做法。
- [Keras 建立模型並預測資料：從 Sequential 到 model.predict 的完整流程](/post/keras-build-model-and-predict-data)：同樣聚焦 Keras、TensorFlow，可接著比較不同情境的做法。

## 最後更新

2026-08-28

`;export{e as default};