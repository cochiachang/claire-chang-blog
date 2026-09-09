var e=`---
title: 物體偵測技術介紹：Bounding Box、類別分類與常見模型架構
description: 介紹物體偵測的任務定義、Bounding Box、one-stage 與 two-stage 模型差異，以及應用流程。
date: 2023-01-12
category: 機器學習
tags: [物件偵測, 電腦視覺, YOLO, TensorFlow]
readingTime: 7 分鐘
image: /images/tech/hero_object-detection-technology-introduction.webp
imageAlt: 物體偵測技術介紹：Bounding Box、類別分類與常見模型架構 hero image
---


# 物體偵測技術介紹：Bounding Box、類別分類與常見模型架構

物體偵測是電腦視覺任務，目標是在影像中找出物件位置並判斷物件類別。和影像分類只回答「圖片裡有什麼」不同，物體偵測還要回答「物件在哪裡」。

## 物體偵測和影像分類差在哪？

影像分類輸出整張圖片的類別，物體偵測輸出多個 bounding box、類別與信心分數。物體偵測能處理同一張圖中多個物件的位置與類型。

例如一張街景圖片中同時有行人、車輛與交通號誌。影像分類可能只說「街景」，物體偵測則會標出每個物件框。TensorFlow Object Detection API 的模型庫也以 detection 任務與資料集作為主要整理方式（TensorFlow，存取日期：2026-08-27）。

## Bounding Box 是什麼？

Bounding Box 是包住目標物件的矩形框。物體偵測模型通常輸出框座標、類別標籤與 confidence score。

常見座標格式：

| 格式 | 說明 |
|---|---|
| \`xmin, ymin, xmax, ymax\` | 左上角與右下角座標 |
| \`x_center, y_center, width, height\` | 中心點與寬高，YOLO 標註常用 |
| normalized coordinates | 座標除以影像寬高，數值落在 0 到 1 |

實務資訊增益：資料標註格式轉換是物體偵測專案的高風險點。模型訓練前應抽樣把標註框畫回圖片確認，而不是只檢查檔案能否讀取。

## one-stage 和 two-stage 偵測器怎麼選？

one-stage 偵測器通常速度較快，two-stage 偵測器通常流程較細緻。即時應用常選 YOLO 類模型，精度優先或研究場景可評估 Faster R-CNN 類模型。

| 類型 | 代表模型 | 特點 |
|---|---|---|
| one-stage | YOLO、SSD | 直接預測位置與類別，速度快 |
| two-stage | Faster R-CNN | 先產生候選區域，再分類與修正框 |

模型選擇不只看 mAP，也要看推論延遲、部署硬體、目標大小與錯誤成本。

## 物體偵測專案流程有哪些步驟？

物體偵測專案通常包含資料收集、標註、格式轉換、訓練、驗證、部署與監控。每一步都會影響最終模型品質。

建議流程：

1. 定義類別與標註規則。
2. 收集涵蓋真實場景的圖片。
3. 抽樣檢查 bounding box。
4. 切分 train、validation、test。
5. 訓練模型並監控 precision、recall、mAP。
6. 部署後收集錯誤案例再回訓。

## 常見問題

### 物體偵測需要多少資料？

物體偵測需要的資料量取決於類別數、場景變化與目標大小。小型專案可用預訓練模型微調，但仍要準備足夠多樣的驗證資料。

### YOLO 適合即時偵測嗎？

YOLO 類模型常用於即時偵測，因為 one-stage 架構推論速度快。實際速度仍取決於模型大小、圖片解析度與硬體。

### confidence score 是準確率嗎？

confidence score 不是整體準確率。confidence score 是單次預測的信心分數，模型整體表現仍要看 precision、recall 與 mAP。

### bounding box 標註錯會怎樣？

bounding box 標註錯會讓模型學到錯誤位置。常見後果是定位不準、召回率下降或對背景產生誤判。

### 物體偵測和語意分割差在哪？

物體偵測輸出矩形框，語意分割輸出像素級區域。若任務需要精準輪廓，語意分割會比 bounding box 更適合。

## 參考資料

- TensorFlow，〈[TensorFlow 2 Detection Model Zoo](https://github.com/tensorflow/models/blob/master/research/object_detection/g3doc/tf2_detection_zoo.md)〉，存取日期：2026-08-27。

## 延伸閱讀

- [TensorFlow 目標檢測 API：訓練自己的資料](/post/tensorflow-object-detection-custom-training)：同樣聚焦 TensorFlow、物體偵測，可接著比較不同情境的做法。
- [TensorFlow Object Detection API 程式使用範例：即時攝影機偵測流程](/post/tensorflow-object-detection-api-code-example)：同樣聚焦 TensorFlow、物體偵測，可接著比較不同情境的做法。
- [TensorFlow Object Detection API 功能介紹與模型選擇](/post/tensorflow-object-detection-api-overview)：同樣聚焦 TensorFlow、物體偵測，可接著比較不同情境的做法。

## 最後更新

2026-08-28

`;export{e as default};