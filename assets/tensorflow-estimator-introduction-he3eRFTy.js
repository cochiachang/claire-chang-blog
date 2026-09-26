var e=`---
title: TensorFlow Estimator 介紹：用途、棄用原因與 Keras 替代寫法
description: 說明 tf.estimator.Estimator 的用途、主要功能、為何在 TensorFlow 2.x 被標註棄用，以及如何用 Keras API 改寫。
date: 2023-01-13
category: 機器學習
tags: [TensorFlow, Keras, Estimator]
readingTime: 10 分鐘
image: /images/tech/tensorflow-estimator-deprecated.webp
imageAlt: TensorFlow Estimator API 棄用標籤截圖
---


# TensorFlow Estimator 介紹：用途、棄用原因與 Keras 替代寫法

\`tf.estimator.Estimator\` 是 TensorFlow 的高階模型抽象，曾用來統一訓練、評估、預測與分散式訓練流程。TensorFlow 2.x 後，官方重心逐漸轉向 Keras API；新專案通常應優先使用 \`tf.keras.Model\`，既有 Estimator 專案則可逐步評估改寫成本。

## tf.estimator.Estimator 是什麼？

\`tf.estimator.Estimator\` 是 TensorFlow 的模型級抽象，提供訓練、評估、預測與模型匯出等統一流程。Estimator 曾適合需要分散式訓練或 TFX 整合的專案。

官方文件曾說明 Estimator 提供一些高階功能，例如：

- 基於參數伺服器的訓練。
- 與 TFX 生態系的整合。
- 預製 Estimator，例如 \`tf.estimator.DNNClassifier\`。
- 模型檢查點與恢復流程。

使用預製 Estimator 時，開發者可以在比低階 TensorFlow API 更高的概念層工作，不必手動處理計算圖與 session 的細節。這也是 Estimator 在 TensorFlow 1.x 到早期 2.x 轉換期間仍常被看到的原因。

## Estimator 的主要功能有哪些？

Estimator 的主要功能是提供統一介面，讓模型建立、訓練、評估與預測流程更一致。Estimator 對分散式訓練、檢查點與訓練評估循環特別有幫助。

| 功能 | 說明 |
| --- | --- |
| 預定義模型 | 線性分類、線性回歸、DNN 分類等 |
| 訓練與評估 | 提供 \`train()\`、\`evaluate()\`、\`predict()\` |
| 分散式計算 | 支援較傳統的分散式訓練架構 |
| 檢查點 | 保存訓練狀態，方便恢復 |
| train_and_evaluate | 管理訓練與評估流程 |

原始筆記中也提到決策樹、KNN 等常見機器學習模型。不過 TensorFlow Estimator 的核心價值仍是 TensorFlow 生態系內的訓練流程抽象，而不是取代 scikit-learn。

## 為什麼 TensorFlow Estimator 被標註為棄用？

TensorFlow Estimator 被標註棄用，主要是因為 TensorFlow 2.x 之後 Keras API 成為更一致、更直覺的模型建立方式。新模型開發通常應優先選 Keras。

![TensorFlow Estimator 棄用標籤截圖](/images/tech/tensorflow-estimator-deprecated.webp)

Keras API 更貼近 TensorFlow 2.x 的 eager execution 與現代模型開發流程，也更容易學習與維護。對多數新專案來說，\`tf.keras.Model\` 或 \`keras.Sequential\` 已能涵蓋建立、訓練、評估、儲存與部署的主要需求。

如果你維護的是既有 Estimator 專案，重點不是立刻全部重寫，而是先判斷專案是否依賴 Estimator 的分散式訓練、TFX 或既有輸入函數。

## 如何用 Keras 改寫 LinearRegressor？

Estimator 的 \`LinearRegressor\` 可以用 Keras 的單層 Dense 模型改寫。線性回歸的核心是輸入到單一輸出的線性映射，並使用均方誤差作為損失函數。

Estimator 寫法：

\`\`\`py
import tensorflow as tf

def input_fn(features, labels, batch_size):
    dataset = tf.data.Dataset.from_tensor_slices((features, labels))
    dataset = dataset.shuffle(1000).batch(batch_size)
    return dataset

feature_columns = [tf.feature_column.numeric_column("x", shape=[1])]
regressor = tf.estimator.LinearRegressor(feature_columns=feature_columns)

train_input_fn = lambda: input_fn(x_train, y_train, batch_size=batch_size)
regressor.train(input_fn=train_input_fn, steps=1000)
\`\`\`

Keras 改寫：

\`\`\`py
from tensorflow import keras

model = keras.Sequential()
model.add(keras.layers.Dense(1, input_shape=[1]))

model.compile(optimizer="sgd", loss="mean_squared_error")
model.fit(x_train, y_train, epochs=100)
\`\`\`

這段改寫保留原本線性回歸的核心假設，但省去 feature column 與 estimator input function 的額外樣板。

## tf.estimator.train_and_evaluate 做什麼？

\`tf.estimator.train_and_evaluate()\` 會把訓練與評估流程包成一個函數呼叫。Estimator 專案可用 \`TrainSpec\` 和 \`EvalSpec\` 定義訓練步數與評估輸入。

\`\`\`py
estimator = tf.estimator.LinearClassifier(feature_columns=feature_columns)

train_spec = tf.estimator.TrainSpec(input_fn=train_input_fn, max_steps=1000)
eval_spec = tf.estimator.EvalSpec(input_fn=eval_input_fn)

tf.estimator.train_and_evaluate(estimator, train_spec, eval_spec)
\`\`\`

早期 TensorFlow 也提供把 Keras 模型轉成 Estimator 的做法：

\`\`\`py
import tensorflow as tf
from tensorflow import keras

def build_model():
    model = keras.Sequential([
        keras.layers.Dense(64, activation="relu", input_shape=(784,)),
        keras.layers.Dense(64, activation="relu"),
        keras.layers.Dense(10, activation="softmax"),
    ])
    model.compile(
        optimizer=tf.keras.optimizers.Adam(),
        loss=tf.keras.losses.categorical_crossentropy,
        metrics=[tf.keras.metrics.categorical_accuracy],
    )
    return model

estimator = tf.keras.estimator.model_to_estimator(keras_model=build_model())
\`\`\`

新專案通常不需要再繞回 Estimator。除非有既有 TFX 或分散式訓練流程依賴 Estimator，否則 Keras 原生訓練流程更簡潔。

## 常見問題
### 新專案還應該學 TensorFlow Estimator 嗎？

新專案通常不需要優先學 TensorFlow Estimator。建議先學 Keras API，只有維護舊專案或特定 TFX 流程時再補 Estimator。

### Estimator 和 Keras Model 最大差異是什麼？

Estimator 偏向訓練流程抽象，Keras Model 偏向模型建立與訓練的現代主流 API。TensorFlow 2.x 後，Keras 與整體生態系整合更自然。

### Estimator 被棄用代表舊程式不能跑嗎？

Estimator 被棄用不代表舊程式立刻不能跑。棄用代表官方不建議新開發採用，未來支援與改善會降低。

### 既有 Estimator 專案要怎麼遷移？

既有 Estimator 專案可先從模型結構單純的部分改成 Keras。輸入管線、評估指標、模型匯出與部署流程要逐項驗證，避免一次改寫造成行為差異。

## 參考資料
- TensorFlow 官方文件，Estimator，https://www.tensorflow.org/guide/estimator，存取日期：2026-08-27。
- TensorFlow 官方文件，Keras，https://www.tensorflow.org/guide/keras，存取日期：2026-08-27。

## 延伸閱讀

- [TensorFlow 和 Keras 版本不相容錯誤：cannot import name 'dtensor' 解法](/post/tensorflow-keras-version-compatibility-error)：同樣聚焦 TensorFlow、Keras，可接著比較不同情境的做法。
- [Keras 介紹：用 Python 快速建立深度學習模型的高階 API](/post/keras-introduction)：同樣聚焦 Keras、TensorFlow，可接著比較不同情境的做法。
- [Keras 建立模型並預測資料：從 Sequential 到 model.predict 的完整流程](/post/keras-build-model-and-predict-data)：同樣聚焦 Keras、TensorFlow，可接著比較不同情境的做法。
`;export{e as default};