var e=`---
title: TensorFlow Object Detection API 功能介紹與模型選擇
description: 介紹 TensorFlow Object Detection API 內建模型、YOLO 支援狀況、SSD MobileNet V2 FPNLite 選擇理由與預訓練模型檔案結構。
date: 2023-07-27T00:00:00.000Z
category: 機器學習
tags:
  - TensorFlow
  - 物件偵測
  - SSD
readingTime: 10 分鐘
image: /images/tech/hero_tensorflow-object-detection-api-overview.webp
imageAlt: white security camera on post
---
# TensorFlow Object Detection API 功能介紹與模型選擇

TensorFlow Object Detection API 提供多種在 COCO 2017 資料集上預訓練的目標檢測模型，例如 CenterNet、EfficientDet、SSD、Faster R-CNN 與 Mask R-CNN。我的需求是即時串流物件偵測，最後選擇 \`SSD MobileNet V2 FPNLite 640x640\`。

## TensorFlow Object Detection API 有包含 YOLO 嗎？

TensorFlow Object Detection API 的 TF2 model zoo 不把 YOLO 放在主要內建模型列表中。官方模型集合主要提供 CenterNet、EfficientDet、SSD、Faster R-CNN 與 Mask R-CNN。

YOLO（You Only Look Once）是常見的即時目標檢測系統，但在我寫這篇時，TensorFlow 2 對 YOLO 的支援不像 PyTorch 生態系那麼快。若要在 TensorFlow 2 使用 YOLO，通常要另外找轉換版或社群實作，例如 YOLOv5 in TF2/Keras。

## Object Detection API 常見模型差在哪？

Object Detection API 常見模型差異在速度、精度與輸出類型。SSD 偏向即時速度，Faster R-CNN 偏向精度，Mask R-CNN 可輸出實例分割 mask。

| 模型 | 特點 | 適合情境 |
|---|---|---|
| CenterNet | 以物體中心點等關鍵點做檢測 | 需要關鍵點或姿態資訊 |
| EfficientDet | 以 EfficientNet 與 BiFPN 設計 | 需要精度與效率平衡 |
| SSD | Single Shot MultiBox Detector | 需要即時推論速度 |
| Faster R-CNN | 使用區域提議網路 | 追求較高精度 |
| Mask R-CNN | Faster R-CNN 延伸，可輸出 mask | 需要實例分割 |

## Model Zoo 表格要怎麼讀？

Model Zoo 表格通常會列出模型名稱、Speed、COCO mAP 與 Outputs。Speed 數值越低代表推論越快，COCO mAP 越高通常代表檢測精度越好。

下表整理官方模型列表中幾個代表模型，取代整頁下載連結，方便快速比較；實際模型清單應以 TensorFlow 2 Detection Model Zoo 官方頁面為準。

| 模型系列 | Speed 特色 | Outputs |
|---|---|---|
| CenterNet MobileNetV2 FPN 512x512 | 速度可到 6 ms 等級 | Boxes 或 Keypoints |
| SSD MobileNet V2 320x320 | 約 19 ms | Boxes |
| SSD MobileNet V2 FPNLite 640x640 | 約 39 ms | Boxes |
| Faster R-CNN ResNet50 V1 640x640 | 約 53 ms | Boxes |
| Mask R-CNN Inception ResNet V2 1024x1024 | 約 301 ms | Boxes/Masks |

## 為什麼選 \`SSD MobileNet V2 FPNLite 640x640\`？

\`SSD MobileNet V2 FPNLite 640x640\` 適合需要即時串流偵測的情境。SSD 架構偏快，MobileNet 較輕量，FPNLite 則讓模型保留處理不同尺度物件的能力。

我的需求是偵測即時串流內的物件，因此速度比最高精度更重要。相比 ResNet，MobileNet 參數量與計算量較小；相比完整 FPN，FPNLite 又更輕。這也是我最後選擇 SSD MobileNet V2 FPNLite 的主要理由。

## 預訓練模型下載後有哪些檔案？

TensorFlow Object Detection API 預訓練模型通常包含 \`pipeline.config\`、\`checkpoint\` 與 \`saved_model\`。這些檔案分別對應訓練設定、權重與可載入模型。

我實際使用的模型是 \`ssd_mobilenet_v2_fpnlite_640x640_coco17_tpu-8\`，下載連結如下（以 HTTPS 表示同一個官方檔案位置）：

<https://download.tensorflow.org/models/object_detection/tf2/20200711/ssd_mobilenet_v2_fpnlite_640x640_coco17_tpu-8.tar.gz>

檔案用途如下：

- \`pipeline.config\`：包含模型類型、輸入尺寸、learning rate、batch size 等訓練參數。
- \`checkpoint\`：保存模型權重，可用於恢復訓練或微調。
- \`saved_model/saved_model.pb\`：包含可載入的模型結構與參數。

## 如何從 SavedModel 建立 checkpoint？

TensorFlow 可用 \`tf.train.Checkpoint\` 包裝已載入的 SavedModel，再呼叫 \`save()\` 產生 checkpoint。這適合需要把推論模型轉成可接續使用的權重檔時測試。

\`\`\`python
import tensorflow as tf

loaded = tf.saved_model.load(PATH_TO_SAVED_MODEL)

ckpt = tf.train.Checkpoint(model=loaded)
ckpt.save(PATH_TO_CKPT)
\`\`\`

實作時要注意 TensorFlow 版本與 Object Detection API 版本是否相容。若後續要微調模型，通常還需要檢查 label map、pipeline config 路徑與 checkpoint restore 設定。

## 常見問題
### TensorFlow Object Detection API 適合初學者嗎？

TensorFlow Object Detection API 適合已經熟悉 TensorFlow 與基本訓練流程的人。若只是快速試推論，可以先使用預訓練模型；若要自訂資料集訓練，設定檔與環境相依性會比較多。

### YOLO 可以用 TensorFlow 2 做嗎？

可以，但通常不是直接使用 TensorFlow Object Detection API 內建模型。需要找 TensorFlow 2/Keras 版本的 YOLO 實作或自行轉換模型。

### SSD 和 Faster R-CNN 要怎麼選？

需要即時速度時優先測 SSD。需要較高精度且可以接受較慢推論時，再測 Faster R-CNN。

### COCO mAP 是什麼？

COCO mAP 是模型在 COCO 資料集上的平均精度指標。COCO mAP 可用來粗略比較模型，但實際專案仍要用自己的資料集驗證。

### 預訓練模型一定可以直接用在自己的場景嗎？

不一定。預訓練模型的類別與資料分佈來自原始訓練資料，若你的物件類別或拍攝環境差異很大，就需要微調或重新訓練。

## 參考資料
- TensorFlow 2 Detection Model Zoo: <https://github.com/tensorflow/models/blob/master/research/object_detection/g3doc/tf2_detection_zoo.md>
- TensorFlow Object Detection API: <https://github.com/tensorflow/models/tree/master/research/object_detection>
- COCO Dataset: <https://cocodataset.org/>
- YOLOv5 in TensorFlow 2 Keras（社群實作參考）: <https://github.com/yyccR/yolov5_in_tf2_keras>

## 延伸閱讀

- [TensorFlow Object Detection API 程式使用範例：即時攝影機偵測流程](/post/tensorflow-object-detection-api-code-example)：同樣聚焦 TensorFlow、物體偵測，可接著比較不同情境的做法。
- [物體偵測技術介紹：Bounding Box、類別分類與常見模型架構](/post/object-detection-technology-introduction)：同樣聚焦 物體偵測、TensorFlow，可接著比較不同情境的做法。
- [TensorFlow 目標檢測 API：訓練自己的資料](/post/tensorflow-object-detection-custom-training)：同樣聚焦 TensorFlow、物體偵測，可接著比較不同情境的做法。

## 最後更新

Thu Jul 27 2023 08:00:00 GMT+0800 (Taiwan Standard Time)

`;export{e as default};