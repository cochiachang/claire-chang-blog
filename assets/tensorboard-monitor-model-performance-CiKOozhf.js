var e=`---
title: 如何使用 TensorBoard 觀察模型效能
description: 用 TensorFlow Keras callback 寫入 TensorBoard log，觀察 loss、accuracy、Graphs、Distributions 與 Histograms。
date: 2023-06-26T00:00:00.000Z
category: 機器學習
tags:
  - TensorBoard
  - TensorFlow
  - 模型訓練
readingTime: 7 分鐘
image: /images/tech/hero_tensorboard-monitor-model-performance.webp
imageAlt: graphs of performance analytics on a laptop screen
---
# 如何使用 TensorBoard 觀察模型效能

TensorBoard 可以用來觀察 TensorFlow 模型訓練期間的 loss、accuracy、計算圖、權重分佈與時間序列變化。最常見做法是在 Keras 訓練時加入 \`tf.keras.callbacks.TensorBoard\`，再用 \`tensorboard --logdir\` 開啟本機視覺化介面。

## TensorBoard 是什麼？

TensorBoard 是 TensorFlow 的視覺化工具，用來呈現機器學習實驗中的指標與模型結構。TensorBoard 可協助開發者追蹤損失、準確率、權重分佈與 embedding。

在模型訓練時，只看 terminal 的數字常常不夠。TensorBoard 讓訓練過程變成可比較的曲線與圖形，尤其適合調整 learning rate、batch size、模型結構或資料前處理後，比較不同實驗的結果。

## TensorBoard 可以看哪些面板？

TensorBoard 常用面板包含 Scalars、Graphs、Distributions、Histograms 與 Time Series。不同面板分別用來看指標曲線、模型結構、張量分佈與每次訓練迭代的變化。

| 面板 | 用途 |
|---|---|
| Scalars | 顯示 loss、accuracy、learning rate 等標量 |
| Graphs | 顯示模型計算圖與網路結構 |
| Distributions | 顯示張量隨時間的分佈 |
| Histograms | 用 ridgeline plot 顯示權重與偏差分佈 |
| Time Series | 觀察每次訓練迭代中的指標變化 |

原文中的截圖沒有在本地匯出資料找到，所以這篇保留每個面板的用途說明。實際畫面可在啟動 TensorBoard 後從左側面板切換。

## 如何在 Keras 訓練中寫入 TensorBoard log？

Keras 可用 \`tf.keras.callbacks.TensorBoard\` 寫入 TensorBoard log。訓練時把 callback 放進 \`model.fit()\`，TensorFlow 會把訓練資訊寫到指定資料夾。

\`\`\`python
import datetime
import tensorflow as tf

mnist = tf.keras.datasets.mnist
(x_train, y_train), (x_test, y_test) = mnist.load_data()
x_train, x_test = x_train / 255.0, x_test / 255.0

def create_model():
    return tf.keras.models.Sequential([
        tf.keras.layers.Flatten(input_shape=(28, 28)),
        tf.keras.layers.Dense(512, activation="relu"),
        tf.keras.layers.Dropout(0.2),
        tf.keras.layers.Dense(10, activation="softmax"),
    ])

model = create_model()
model.compile(
    optimizer="adam",
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"],
)

log_dir = "logs/fit/" + datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
tensorboard_callback = tf.keras.callbacks.TensorBoard(
    log_dir=log_dir,
    histogram_freq=1,
)

model.fit(
    x=x_train,
    y=y_train,
    epochs=5,
    validation_data=(x_test, y_test),
    callbacks=[tensorboard_callback],
)
\`\`\`

## 如何啟動 TensorBoard 介面？

TensorBoard 可用 \`tensorboard --logdir logs/fit\` 從命令列啟動。啟動後開啟 \`http://localhost:6006\`，就能看到訓練實驗的視覺化結果。

\`\`\`bash
tensorboard --logdir logs/fit
\`\`\`

如果頁面沒有資料，我會先檢查三件事：\`log_dir\` 是否真的有 event file、\`model.fit()\` 是否有掛上 callback、命令列的 \`--logdir\` 是否指到正確資料夾。

## 常見問題
### TensorBoard 預設網址是什麼？

TensorBoard 預設網址通常是 \`http://localhost:6006\`。如果 6006 port 被占用，可以用 \`--port\` 指定其他 port。

### TensorBoard 看不到曲線怎麼辦？

先確認 log 資料夾是否有 event file。若資料夾是空的，通常代表 callback 沒有掛上、訓練沒有執行，或 \`--logdir\` 指錯位置。

### \`histogram_freq=1\` 是什麼意思？

\`histogram_freq=1\` 表示每個 epoch 都記錄 histogram 資料。這會讓 TensorBoard 顯示權重分佈，但也可能增加 log 檔大小。

### TensorBoard 只能用在 TensorFlow 嗎？

TensorBoard 原生屬於 TensorFlow 生態系，但也可透過其他框架寫入相容 log。本文範例聚焦 TensorFlow Keras。

## 參考資料
- TensorFlow Documentation, Get started with TensorBoard: <https://www.tensorflow.org/tensorboard/get_started>
- TensorFlow API, \`tf.keras.callbacks.TensorBoard\`: <https://www.tensorflow.org/api_docs/python/tf/keras/callbacks/TensorBoard>

## 延伸閱讀

- [Keras 建立模型並預測資料：從 Sequential 到 model.predict 的完整流程](/post/keras-build-model-and-predict-data)：同樣聚焦 TensorFlow、模型訓練，可接著比較不同情境的做法。
- [Keras model.fit() 參數設定：batch_size、epochs、validation 與 callbacks 怎麼用？](/post/keras-model-fit-parameters)：同樣聚焦 TensorFlow、模型訓練，可接著比較不同情境的做法。
- [如何使用 Keras 回呼(callbacks)觸發訓練週期的結束？ModelCheckpoint 與 EarlyStopping 實戰](/post/keras-callbacks-early-stopping)：同樣聚焦 TensorFlow、模型訓練，可接著比較不同情境的做法。

## 最後更新

Mon Jun 26 2023 08:00:00 GMT+0800 (Taiwan Standard Time)

`;export{e as default};