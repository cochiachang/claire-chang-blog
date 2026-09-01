var e=`---
title: Keras 建立模型並預測資料：從 Sequential 到 model.predict 的完整流程
description: 用 Keras 範例說明建立模型、compile、fit、evaluate 與 predict 的基本流程與常見檢查點。
date: 2023-01-19
category: 機器學習
tags: [Keras, TensorFlow, 模型訓練, 預測]
readingTime: 7 分鐘
image: /images/tech/hero_keras-build-model-and-predict-data.webp
imageAlt: Keras 建立模型並預測資料：從 Sequential 到 model.predict 的完整流程 hero image
---


# Keras 建立模型並預測資料：從 Sequential 到 model.predict 的完整流程

Keras 建立模型並預測資料的流程通常是定義模型、compile、fit、evaluate，最後使用 \`model.predict()\` 對新資料推論。最重要的檢查點是輸入 shape、標籤格式與訓練推論前處理一致。

## Keras 建立模型的基本流程是什麼？

Keras 模型建立流程可以拆成資料準備、模型定義、編譯、訓練、評估與預測。每一步都對應 Keras Model API 的常用方法。

\`\`\`python
from tensorflow import keras
from tensorflow.keras import layers

model = keras.Sequential([
    layers.Dense(16, activation='relu', input_shape=(4,)),
    layers.Dense(3, activation='softmax'),
])
\`\`\`

TensorFlow \`tf.keras.Model\` 文件提供 \`fit\`、\`evaluate\`、\`predict\` 等方法，是 Keras 訓練流程的主要介面（TensorFlow，存取日期：2026-08-27）。

## compile 要設定哪些項目？

\`compile()\` 主要設定 optimizer、loss 與 metrics。optimizer 決定參數更新方式，loss 決定模型要最小化的錯誤，metrics 則用於觀察訓練表現。

\`\`\`python
model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy'],
)
\`\`\`

選擇 loss 時要看標籤格式。整數類別常用 \`sparse_categorical_crossentropy\`，one-hot 類別常用 \`categorical_crossentropy\`，二元分類常用 \`binary_crossentropy\`。

## fit、evaluate 和 predict 差在哪？

\`fit()\` 用於訓練模型，\`evaluate()\` 用於評估已知標籤資料，\`predict()\` 用於對新資料輸出模型預測。

\`\`\`python
model.fit(x_train, y_train, epochs=20, validation_split=0.2)
test_loss, test_acc = model.evaluate(x_test, y_test)
predictions = model.predict(x_new)
\`\`\`

實務資訊增益：\`predict()\` 不會告訴你答案是否正確，只會輸出模型分數或數值。若要知道準確率，必須準備有標籤的測試集並使用 \`evaluate()\`。

## model.predict 輸出要怎麼解讀？

\`model.predict()\` 的輸出形狀取決於最後一層。softmax 分類輸出每個類別的機率分布，回歸模型通常輸出連續數值。

分類範例：

\`\`\`python
import numpy as np

proba = model.predict(x_new)
class_id = np.argmax(proba, axis=1)
\`\`\`

推論前要使用與訓練相同的正規化、resize、欄位順序與資料型別。訓練推論前處理不一致，是模型上線後表現落差的常見原因。

## 常見問題

### Keras 一定要用 Sequential 建模型嗎？

Keras 不一定要用 Sequential 建模型。簡單線性模型適合 Sequential，複雜多輸入或多輸出模型適合 Functional API。

### model.predict 會更新模型權重嗎？

\`model.predict()\` 不會更新模型權重。predict 只做前向推論，不會執行反向傳播。

### validation_split 是測試集嗎？

\`validation_split\` 不是最終測試集。validation 資料用於訓練期間觀察模型，test 資料應保留到最後評估。

### loss 選錯會怎樣？

loss 選錯可能讓模型無法收斂或指標失真。分類任務要先確認標籤是整數、one-hot 還是二元格式。

### predict 前需要 reshape 嗎？

predict 前是否需要 reshape 取決於模型輸入 shape。單筆資料也要保留 batch 維度，例如 \`x.reshape(1, 4)\`。

## 參考資料

- TensorFlow，〈[tf.keras.Model](https://www.tensorflow.org/api_docs/python/tf/keras/Model)〉，存取日期：2026-08-27。

## 延伸閱讀

- [Keras model.fit() 參數設定：batch_size、epochs、validation 與 callbacks 怎麼用？](/post/keras-model-fit-parameters)：同樣聚焦 Keras、TensorFlow，可接著比較不同情境的做法。
- [Keras 介紹：用 Python 快速建立深度學習模型的高階 API](/post/keras-introduction)：同樣聚焦 Keras、TensorFlow，可接著比較不同情境的做法。
- [如何使用 Keras 回呼(callbacks)觸發訓練週期的結束？ModelCheckpoint 與 EarlyStopping 實戰](/post/keras-callbacks-early-stopping)：同樣聚焦 Keras、TensorFlow，可接著比較不同情境的做法。

## 最後更新

2026-08-28

`;export{e as default};