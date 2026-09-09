var e=`---
title: 如何使用 Keras 回呼(callbacks)觸發訓練週期的結束？ModelCheckpoint 與 EarlyStopping 實戰
description: 在 TensorFlow 和 Keras 中使用 callbacks 回呼，於每個訓練週期結束時自動儲存模型權重或在驗證損失不再改善時提前停止訓練，附 ModelCheckpoint 與 EarlyStopping 完整程式碼範例。
date: 2023-01-11
category: 機器學習
tags: [Keras, TensorFlow, EarlyStopping, 模型訓練, Callbacks]
readingTime: 3 分鐘
image: /images/tech/hero_keras-callbacks-early-stopping.webp
imageAlt: 電路板上的人工智慧晶片，象徵 Keras 回呼機制自動控制模型訓練流程
---


# 如何使用 Keras 回呼(callbacks)觸發訓練週期的結束？ModelCheckpoint 與 EarlyStopping 實戰

在 TensorFlow 和 Keras 中，可以使用回呼 (callbacks) 來在訓練週期結束時觸發某些操作。回呼是一個類似於函數的物件，可以在訓練過程中的特定時間點被調用。這篇文章說明如何在 \`model.fit()\` 掛上 \`ModelCheckpoint\` 與 \`EarlyStopping\`，讓訓練自動保存權重、自動提前停止。

## 什麼是 Keras callbacks？為什麼需要它？

回呼 (callbacks) 是一個類似於函數的物件，Keras 會在訓練過程中的特定時間點（例如每個 epoch 結束時、每個 batch 之後）自動呼叫它。常見用途包括：

- **ModelCheckpoint**：在訓練的某個時間點保存模型的權重，避免訓練中斷就前功盡棄。
- **EarlyStopping**：在訓練達到一定的準確率（或驗證損失不再改善）後停止訓練，避免 overfitting、也節省時間。

要讓回呼在訓練週期結束時被觸發，只需要在調用 \`fit()\` 或 \`fit_generator()\` 時，把它們加進 \`callbacks\` 參數即可。

## ModelCheckpoint 與 EarlyStopping 完整程式碼範例

\`\`\`python
from keras.callbacks import ModelCheckpoint, EarlyStopping

callbacks = [ModelCheckpoint('model.h5'), EarlyStopping(monitor='val_loss', patience=2)]

model.fit(X_train, y_train, epochs=10, callbacks=callbacks, validation_data=(X_val, y_val))
\`\`\`

這段程式會在訓練結束後儲存權重，並在驗證損失（\`val_loss\`）連續 2 個 epoch 停止改善後提早結束訓練。

幾個常用參數整理：

| 回呼 | 關鍵參數 | 作用 |
| --- | --- | --- |
| \`ModelCheckpoint\` | 檔案路徑、\`save_best_only\` | 每個 epoch 結束時把權重寫入指定檔案 |
| \`EarlyStopping\` | \`monitor\`、\`patience\` | 監控指定指標，連續 \`patience\` 次沒有改善就停止訓練 |

## 如何自訂 callback 或組合多個回呼？

callbacks 可以根據需求進行自訂——繼承 \`keras.callbacks.Callback\` 並覆寫 \`on_epoch_end()\` 等方法，就能在訓練週期結束時執行任何自訂邏輯（例如記錄 log、動態調整 learning rate）。也可以像上面的範例一樣，把多個回呼放進同一個 list 結合使用，組合出複雜的訓練流程，例如「儲存最佳權重 + 提前停止 + 學習率衰減」同時運作。

## 常見問題

### Keras 的 callback 是什麼？

callback 是一個類似函數的物件，Keras 會在訓練過程的特定時間點（epoch 結束、batch 結束等）自動呼叫它，用來插入保存權重、提早停止訓練等操作。

### EarlyStopping 的 patience 參數是什麼意思？

patience 表示允許被監控指標（如 \`val_loss\`）連續幾個 epoch 沒有改善。上面的範例設 \`patience=2\`，代表驗證損失連續 2 次不再下降就停止訓練。

### ModelCheckpoint 一定要搭配 EarlyStopping 嗎？

不需要，兩者可以獨立使用。不過實務上常一起掛：ModelCheckpoint 負責保存權重，EarlyStopping 負責在不再進步時結束訓練，組合起來既省時又不會丟失最佳模型。

### 如何在 Keras 中寫自己的 callback？

繼承 \`keras.callbacks.Callback\` 並覆寫 \`on_epoch_end()\`、\`on_train_begin()\` 等方法，寫入想執行的邏輯，再把它加進 \`model.fit()\` 的 \`callbacks\` list 即可。

## 參考資料

- [Keras Callbacks 官方文件](https://keras.io/api/callbacks/)

## 延伸閱讀

- [Keras model.fit() 參數設定：batch_size、epochs、validation 與 callbacks 怎麼用？](/post/keras-model-fit-parameters)：同樣聚焦 Keras、TensorFlow，可接著比較不同情境的做法。
- [Keras 建立模型並預測資料：從 Sequential 到 model.predict 的完整流程](/post/keras-build-model-and-predict-data)：同樣聚焦 Keras、TensorFlow，可接著比較不同情境的做法。
- [如何使用 TensorBoard 觀察模型效能](/post/tensorboard-monitor-model-performance)：同樣聚焦 TensorFlow、模型訓練，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2023-01-11，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};