var e=`---
title: 使用數據增強提高圖像辨識準確率：ImageDataGenerator 與 tf.image 範例
description: 說明數據增強如何用旋轉、平移、翻轉、亮度與對比度變化增加圖像資料多樣性，並提供 Keras 與 tf.image 範例。
date: 2023-01-06T00:00:00.000Z
category: 機器學習
tags:
  - 影像辨識
  - 資料增強
  - TensorFlow
readingTime: 7 分鐘
image: /images/tech/hero_image-data-augmentation-accuracy.webp
imageAlt: closeup photo of eyeglasses
---
# 使用數據增強提高圖像辨識準確率：ImageDataGenerator 與 tf.image 範例

數據增強（Data Augmentation）是在不額外收集真實圖片的情況下，透過旋轉、平移、裁切、翻轉、亮度與對比度變化，讓圖像辨識模型看到更多資料變化。資料量有限或模型容易過擬合時，數據增強通常是提高驗證準確率的第一批候選方法。

## 數據增強是什麼？

數據增強會把既有圖像轉換成多種合理變體，增加模型訓練時看到的樣本多樣性。數據增強不會創造新的真實標註，但能降低模型只記住原圖細節的風險。

常見圖像數據增強包含：

- 尺度變換：放大或縮小圖像。
- 旋轉：讓模型適應不同角度。
- 平移：讓物件位置不固定在同一區域。
- 剪裁：模擬物件局部可見的狀況。
- 翻轉：水平或垂直翻轉圖片。
- 亮度調整：處理不同光線條件。
- 對比度調整：處理畫面層次差異。

原文的重點很實務：數據增強不是為了讓訓練資料看起來更多，而是讓模型不要只學到「物件一定在固定位置、固定亮度、固定角度」這種脆弱規則。

## 什麼情況適合先使用數據增強？

數據增強適合用在圖像資料有限、驗證準確率低於訓練準確率、或部署環境拍攝條件變化大的場景。若標註錯誤很多，數據增強反而會放大資料問題。

建議先判斷：

| 狀況 | 是否適合數據增強 | 原因 |
| --- | --- | --- |
| 訓練準確率高、驗證準確率低 | 適合 | 可能過擬合，可增加變化 |
| 圖片角度與位置差異大 | 適合 | 旋轉、平移可模擬實際場景 |
| 類別標註錯誤多 | 不優先 | 先修正標註比增強更重要 |
| 物件方向具有語意 | 需小心 | 垂直翻轉可能改變答案 |

例如辨識撲克牌花色時，旋轉通常合理；但辨識「6」和「9」時，旋轉 180 度可能直接改變標籤語意。

## 如何用 ImageDataGenerator 做數據增強？

Keras 的 \`ImageDataGenerator\` 可用少量參數建立訓練時的圖像變化。原始範例使用旋轉、水平平移、垂直平移與水平翻轉。

\`\`\`py
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout
from tensorflow.keras.preprocessing.image import ImageDataGenerator

model = Sequential()
model.add(Conv2D(filters=32, kernel_size=(3, 3), activation="relu", input_shape=(img_height, img_width, 3)))
model.add(MaxPooling2D(pool_size=(2, 2)))
model.add(Conv2D(filters=64, kernel_size=(3, 3), activation="relu"))
model.add(MaxPooling2D(pool_size=(2, 2)))
model.add(Conv2D(filters=128, kernel_size=(3, 3), activation="relu"))
model.add(MaxPooling2D(pool_size=(2, 2)))
model.add(Flatten())
model.add(Dense(units=256, activation="relu"))
model.add(Dropout(0.5))
model.add(Dense(units=128, activation="relu"))
model.add(Dropout(0.5))
model.add(Dense(units=52, activation="softmax"))

model.compile(loss="categorical_crossentropy", optimizer="adam", metrics=["accuracy"])

datagen = ImageDataGenerator(
    rotation_range=30,
    width_shift_range=0.2,
    height_shift_range=0.2,
    horizontal_flip=True,
)

model.fit(
    datagen.flow(x_train, y_train, batch_size=32),
    steps_per_epoch=len(x_train) / 32,
    epochs=10,
    validation_data=(x_val, y_val),
)
\`\`\`

現行 Keras 建議使用 \`model.fit()\`，不再優先使用舊式 \`fit_generator()\`。如果你接手舊程式，通常可以把 \`fit_generator()\` 改成 \`fit()\`。

## 如何用 tf.image 隨機改變圖片？

\`tf.image\` 適合把增強流程放進資料管線。開發者可以在讀圖後做 resize、random_crop、random_flip、random_brightness 與 random_contrast。

\`\`\`py
import tensorflow as tf

def load_preprocess_image(path, label):
    image = tf.io.read_file(path)
    image = tf.image.decode_jpeg(image, channels=3)
    image = tf.image.resize(image, [360, 360])
    image = tf.image.random_crop(image, [256, 256, 3])
    image = tf.image.random_flip_left_right(image)
    image = tf.image.random_flip_up_down(image)
    image = tf.image.random_brightness(image, 0.5)
    image = tf.image.random_contrast(image, 0, 1)
    image = tf.cast(image, tf.float32)
    image = image / 255
    label = tf.reshape(label, [1])
    return image, label
\`\`\`

這段流程的實務提醒是：每一個隨機轉換都要符合標籤語意。若上下翻轉會讓物件變成不合理樣本，就應移除 \`random_flip_up_down()\`。

## 常見問題
### 數據增強一定會提高圖像辨識準確率嗎？

數據增強不一定提高準確率。若增強方式不符合真實場景，模型可能學到錯誤變化，驗證準確率反而下降。

### 旋轉角度應該設定多大？

旋轉角度應依拍攝情境決定。若實際圖片角度只會小幅偏移，\`rotation_range=10\` 到 \`30\` 通常比過大的旋轉更合理。

### ImageDataGenerator 還能用嗎？

ImageDataGenerator 仍可用於舊專案，但新專案可考慮 Keras preprocessing layers 或 \`tf.data\` 搭配 \`tf.image\`。選擇重點是流程是否能穩定重現與部署。

### 數據增強和增加真實資料哪個更好？

真實資料通常更有價值，因為真實資料包含實際拍攝條件與標註分布。數據增強適合補強資料多樣性，但不能完全取代真實資料。

## 參考資料
- TensorFlow API，\`ImageDataGenerator\`，https://www.tensorflow.org/api_docs/python/tf/keras/preprocessing/image/ImageDataGenerator，存取日期：2026-08-27。
- TensorFlow API，\`tf.image\`，https://www.tensorflow.org/api_docs/python/tf/image，存取日期：2026-08-27。

## 延伸閱讀

- [TensorFlow 圖像操作功能筆記：tf.image 常用前處理與資料增強](/post/tensorflow-image-operations)：同樣聚焦 TensorFlow、資料增強，可接著比較不同情境的做法。
- [Albumentations 資料增強工具教學：PyTorch 影像訓練前處理範例](/post/albumentations-image-augmentation)：同樣聚焦 資料增強，可接著比較不同情境的做法。
- [Roboflow 線上標記工具介紹：團隊協作標註、匯入資料集與 no code 建模](/post/roboflow-online-labeling-tool)：同樣聚焦 資料增強，可接著比較不同情境的做法。
`;export{e as default};