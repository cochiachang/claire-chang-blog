var e=`---
title: TensorFlow 圖像操作功能筆記：tf.image 常用前處理與資料增強
description: 整理 TensorFlow tf.image 的解碼、resize、裁切、翻轉、亮度調整與模型前處理注意事項。
date: 2023-01-04
category: 機器學習
tags: [TensorFlow, tf.image, 影像處理, 資料增強]
readingTime: 7 分鐘
image: /images/tech/hero_tensorflow-image-operations.webp
imageAlt: TensorFlow 圖像操作功能筆記：tf.image 常用前處理與資料增強 hero image
---


# TensorFlow 圖像操作功能筆記：tf.image 常用前處理與資料增強

TensorFlow 的 \`tf.image\` 提供影像解碼、尺寸調整、裁切、翻轉、亮度與對比調整等功能。影像模型訓練前，\`tf.image\` 常用來把原始圖片轉成固定尺寸、固定通道與合理的資料增強版本。

## tf.image 是什麼？

\`tf.image\` 是 TensorFlow 的影像處理模組，負責把圖片轉成模型可用張量。常見任務包含 decode、resize、crop、flip、normalize 與色彩調整。

TensorFlow 官方 API 文件列出 \`tf.image\` 的影像解碼、幾何調整與顏色調整函數（TensorFlow，存取日期：2026-08-27）。對模型訓練而言，\`tf.image\` 的重點不是修圖，而是建立可重複、可批次化的前處理流程。

## TensorFlow 如何讀取與調整圖片尺寸？

TensorFlow 讀取圖片通常先用 \`tf.io.read_file()\` 取得位元資料，再用 \`tf.image.decode_image()\` 或指定格式解碼。模型輸入需要固定寬高時，使用 \`tf.image.resize()\`。

\`\`\`python
import tensorflow as tf

raw = tf.io.read_file('image.jpg')
image = tf.image.decode_jpeg(raw, channels=3)
image = tf.image.resize(image, [224, 224])
image = tf.cast(image, tf.float32) / 255.0
\`\`\`

實務資訊增益：影像分類通常可以直接 resize，物件偵測則要同步調整 bounding box。若只 resize 圖片但沒有更新標註，模型會學到錯誤位置。

## tf.image 可以做哪些資料增強？

\`tf.image\` 可以做隨機翻轉、亮度調整、對比調整、裁切與色相調整。資料增強應符合真實影像會出現的變化，而不是把所有操作都打開。

常見操作：

| 操作 | 函數 |
|---|---|
| 隨機水平翻轉 | \`tf.image.random_flip_left_right\` |
| 隨機亮度 | \`tf.image.random_brightness\` |
| 隨機對比 | \`tf.image.random_contrast\` |
| 中心裁切 | \`tf.image.central_crop\` |
| 調整尺寸 | \`tf.image.resize\` |

\`\`\`python
image = tf.image.random_flip_left_right(image)
image = tf.image.random_brightness(image, max_delta=0.1)
image = tf.image.random_contrast(image, lower=0.8, upper=1.2)
\`\`\`

## tf.image 前處理最常見的錯誤是什麼？

\`tf.image\` 前處理最常見錯誤是 dtype、通道數與數值範圍不一致。模型可能需要 \`float32\` 且數值落在 0 到 1，或依預訓練模型要求做特定正規化。

檢查表：

- 圖片是否固定為 3 通道。
- 張量 shape 是否符合模型輸入。
- 數值範圍是否符合模型預期。
- 訓練與推論是否使用同一套前處理。
- 隨機增強是否只套用在訓練集。

## 常見問題

### tf.image.resize 會改變標註框嗎？

\`tf.image.resize()\` 只會改變圖片張量，不會自動更新 bounding box。物件偵測資料需要另外依寬高比例換算標註座標。

### TensorFlow 圖像資料要除以 255 嗎？

TensorFlow 圖像資料是否除以 255 取決於模型需求。自建模型常用 0 到 1；預訓練模型則要依官方 preprocess_input 規則處理。

### tf.image 可以取代 OpenCV 嗎？

\`tf.image\` 適合 TensorFlow 訓練管線內的前處理。OpenCV 適合更廣泛的影像分析、幾何處理與傳統電腦視覺操作。

### 資料增強要放在 tf.data 裡嗎？

資料增強常放在 \`tf.data\` pipeline 中，方便批次化與並行處理。模型內部 augmentation layer 也是常見選擇。

### 推論時可以使用 random augmentation 嗎？

一般推論不使用 random augmentation。推論階段應使用穩定的 resize、normalize 與格式轉換，避免輸出不一致。

## 參考資料

- TensorFlow，〈[tf.image](https://www.tensorflow.org/api_docs/python/tf/image)〉，存取日期：2026-08-27。

## 延伸閱讀

- [使用數據增強提高圖像辨識準確率：ImageDataGenerator 與 tf.image 範例](/post/image-data-augmentation-accuracy)：同樣聚焦 資料增強、TensorFlow，可接著比較不同情境的做法。
- [Albumentations 資料增強工具教學：PyTorch 影像訓練前處理範例](/post/albumentations-image-augmentation)：同樣聚焦 資料增強，可接著比較不同情境的做法。
- [Roboflow 線上標記工具介紹：團隊協作標註、匯入資料集與 no code 建模](/post/roboflow-online-labeling-tool)：同樣聚焦 資料增強，可接著比較不同情境的做法。

## 最後更新

2026-08-28

`;export{e as default};