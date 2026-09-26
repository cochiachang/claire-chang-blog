var e=`---
title: "YOLOv8 物件偵測模型介紹：安裝、預測、訓練與輸出流程"
description: 介紹 YOLOv8 的安裝、指令列與 Python 兩種預測方式、訓練指標怎麼看，以及攝影機畫面尺寸與模型不一致時的四種處理手法。
date: 2023-08-16
category: 機器學習
tags: [YOLOv8, 物件偵測, 電腦視覺]
readingTime: 8 分鐘
image: /images/tech/hero_yolov8-object-detection-model.webp
imageAlt: YOLOv8 物件偵測模型介紹：安裝、預測、訓練與輸出流程 技術文章封面圖
---


# YOLOv8 物件偵測模型介紹：安裝、預測、訓練與輸出流程

- GitHub 位置：[ultralytics/ultralytics](https://github.com/ultralytics/ultralytics)
- 官方網站：[ultralytics.com](https://ultralytics.com/)

YOLOv8 最初由 Ultralytics 公司的開發人員開發和發布，旨在目標檢測任務中提供高性能和高效率的解決方案。它基於深度學習和電腦視覺領域的前沿進步而構建，在速度和準確性方面提供無與倫比的性能，流線型設計使其適用於各種應用程序，並可輕鬆適應從邊緣設備到雲端 API 的不同硬體平台。

與之前的 YOLO 版本相比，YOLOv8 引入了一些新的設計思想和技術，以提高模型的精度和速度，在模型結構、數據增強、網絡設計等方面進行了優化，使得在目標檢測任務中取得了出色的結果。YOLOv8 不僅可以在通用的目標檢測任務中表現良好，還可以應用於各種應用領域，如自動駕駛、工業檢測、物體識別等。

## YOLOv8 要怎麼安裝？

官方教學提供了非常明確的指導：[Quickstart](https://docs.ultralytics.com/quickstart/)。

用 pip 安裝最簡單，只需要一行：

\`\`\`bash
pip install ultralytics
\`\`\`

## 怎麼用指令列快速跑一次預測？

\`\`\`bash
yolo predict model=yolov8n.pt source='https://ultralytics.com/images/bus.jpg'
\`\`\`

## 怎麼用 Python 執行偵測？

\`\`\`python
from ultralytics import YOLO

# Load a model
model = YOLO("yolov8n.yaml")  # build a new model from scratch
model = YOLO("yolov8n.pt")  # load a pretrained model (recommended for training)

# Use the model
model.train(data="coco128.yaml", epochs=3)  # train the model
metrics = model.val()  # evaluate model performance on the validation set
results = model("https://ultralytics.com/images/bus.jpg")  # predict on an image
path = model.export(format="onnx")  # export the model to ONNX format
\`\`\`

## YOLO 官方推薦哪些相關工具？

建立一個物件偵測模型，需要做標註、影像增強、修改、訓練、佈署，以及將模型整合至使用端的程式。對於這些流程，YOLO 提供了很完整的生態鏈去實現這些步驟，涵蓋標註工具（如 Roboflow）、訓練追蹤（如 Comet、ClearML）與各種部署格式的匯出。

## 怎麼自己建立、訓練並輸出模型？

下面是官方網站內一個包含建模、預測、輸出模型的程式碼範例：

\`\`\`python
from ultralytics import YOLO

# Create a new YOLO model from scratch
model = YOLO('yolov8n.yaml')

# Load a pretrained YOLO model (recommended for training)
model = YOLO('yolov8n.pt')

# Train the model using the 'coco128.yaml' dataset for 3 epochs
results = model.train(data='coco128.yaml', epochs=3)

# Evaluate the model's performance on the validation set
results = model.val()

# Perform object detection on an image using the model
results = model('https://ultralytics.com/images/bus.jpg')

# Export the model to ONNX format
success = model.export(format='onnx')
\`\`\`

## 訓練過程中印出來的那些數值代表什麼？

用既有模型訓練新的資料時，訓練過程會印出一行行像這樣的訓練訊息，各欄位意義如下：

- **Epoch（迭代輪數）**：訓練過程中的迭代次數，每次迭代會處理數據集中的一批樣本。
- **GPU_mem（顯存佔用）**：圖形處理單元（GPU）上的記憶體，該數字顯示當前迭代中 GPU 使用了多少顯存。
- **box_loss（框回歸損失）**：目標檢測模型訓練中的損失項之一，用於優化檢測框的位置。
- **cls_loss（分類損失）**：目標檢測模型訓練中的損失項之一，用於優化目標的分類預測。
- **dfl_loss（變換損失）**：針對目標檢測中檢測框位置變換的損失。
- **Instances（實例數）**：每次迭代中，訓練過程處理的目標實例數量。
- **Size（尺寸）**：輸入圖像的尺寸。
- **Class（類別）**：不同的目標類別。
- **Images（圖像數）**：評估模型性能時所用圖像的數量。
- **Box (P)、R**：分別是精確率（Precision）與召回率（Recall），用於評估目標檢測模型性能——精確率衡量模型預測為正類時有多少是正確的，召回率衡量模型在所有正類樣本中有多少被正確檢測出來。
- **mAP50、mAP50-95（平均精確率）**：在不同 IoU 閾值下計算的平均精確率，\`mAP50\` 表示在 50% IoU 閾值下的平均精確率，\`mAP50-95\` 表示在 50% 到 95% IoU 閾值範圍內的平均精確率。

以我自己實際訓練的結果來看，第 23 輪訓練的精度是 48.4%，召回率是 59%。

## 攝影機畫面尺寸和模型不一致時該怎麼處理？

YOLO 原本建模時使用的是 COCO 資料集，圖片長寬皆為 640px，但實際應用中攝影機拍到的圖片很可能不是 640×640 的尺寸，這時候就要先對圖片做處理。

如果只是要做預測，可以直接用 [\`resize_with_pad\`](https://www.tensorflow.org/versions/r2.0/api_docs/python/tf/image/resize_with_pad) 對圖片做縮放——這個函數可以保持長寬比不變且不失真，把圖像大小調整為目標寬度和高度；如果目標尺寸與圖像尺寸不匹配，會先調整圖像大小，再用零填充來符合請求的尺寸。

但如果是要訓練模型，還需要相應地調整邊界框的大小和填充邊界框，這並非易事，可以參考這個 [Bounding Box 資料增強的範例筆記本](https://nbviewer.jupyter.org/github/aleju/imgaug-doc/blob/master/notebooks/B02%20-%20Augment%20Bounding%20Boxes.ipynb)。

以下是幾個主要處理手法：

- **調整輸入尺寸**：把攝影機圖像調整為與 YOLO 模型訓練時使用的正方形尺寸相匹配，這可能導致圖像在寬度或高度上出現一些留白，但能與模型兼容。
- **圖像裁剪**：把攝影機圖像裁剪成 YOLO 模型所需的正方形尺寸，可以從圖像中心或其他感興趣的區域裁剪，確保包含重要的目標信息。
- **填充**：如果圖像長寬比與模型所需的正方形尺寸不匹配，可以在圖像較短邊或較長邊加上填充，使其達到正方形尺寸，填充可以用背景顏色或內容來保持圖像比例。
- **訓練新模型**：如果攝影機圖像尺寸與標準 YOLO 輸入尺寸差異較大，且上述方法都不適用，可能需要考慮訓練一個新的 YOLO 模型，以適應自己的攝影機圖像尺寸，確保模型在不同尺寸圖像上都有良好性能。

無論選擇哪種方法，都需要注意調整輸入尺寸可能會對模型性能產生影響，特別是在目標檢測任務中，實務上仍需要在實際場景中測試和調整，找到最適合自己應用的方法。

## 常見問題

### 一定要用 pip 安裝 YOLOv8 嗎？

pip 是最簡單的方式，官方 Quickstart 文件也提供 conda、Docker 等其他安裝方式，可以依開發環境選擇。

### \`yolov8n.yaml\` 和 \`yolov8n.pt\` 差在哪？

\`.yaml\` 是模型架構設定檔，用來從零建立一個全新、未訓練的模型；\`.pt\` 則是已經訓練好的預訓練權重檔，訓練時通常建議用 \`.pt\` 做微調（fine-tune），會比從零訓練更快收斂。

### mAP50 和 mAP50-95 該看哪一個？

\`mAP50\` 只看 IoU 閾值為 50% 時的平均精確率，門檻比較寬鬆；\`mAP50-95\` 是在 50%-95% 這個更嚴格的 IoU 範圍區間取平均，更能反映模型在高精確度定位上的表現。兩個指標適合一起看，只看單一數字容易誤判模型實際品質。

### 攝影機圖片一定要裁成正方形嗎？

不一定要用裁切，「調整輸入尺寸（含留白）」和「填充」都是不需要裁切、但仍能符合模型輸入尺寸的替代方案。實際選擇要看應用場景能不能接受圖像留白，以及目標物件是否可能因裁切而被切掉。

## 參考資料

- [ultralytics/ultralytics](https://github.com/ultralytics/ultralytics)
- [Ultralytics 官方網站](https://ultralytics.com/)
- [Ultralytics Quickstart](https://docs.ultralytics.com/quickstart/)
- [tf.image.resize_with_pad](https://www.tensorflow.org/versions/r2.0/api_docs/python/tf/image/resize_with_pad)
- [Augment Bounding Boxes（imgaug 範例筆記本）](https://nbviewer.jupyter.org/github/aleju/imgaug-doc/blob/master/notebooks/B02%20-%20Augment%20Bounding%20Boxes.ipynb)

## 延伸閱讀

- [物體偵測技術介紹：Bounding Box、類別分類與常見模型架構](/post/object-detection-technology-introduction)：同樣聚焦 物體偵測、電腦視覺，可接著比較不同情境的做法。
- [TensorFlow 目標檢測 API：訓練自己的資料](/post/tensorflow-object-detection-custom-training)：同樣聚焦 物體偵測、電腦視覺，可接著比較不同情境的做法。
- [YOLOv8 模型訓練指標解析：IoU、mAP、Precision、Recall 與優化策略](/post/yolov8-training-metrics-optimization)：同樣聚焦 YOLOv8、物體偵測，可接著比較不同情境的做法。

## 最後更新

2026-08-28
`;export{e as default};