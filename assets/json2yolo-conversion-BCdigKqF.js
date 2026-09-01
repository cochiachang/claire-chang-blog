var e=`---
title: JSON2YOLO 轉換工具教學：把 JSON 標註格式轉成 YOLO 訓練格式
description: 把 JSON 標記轉成 YOLO 格式：介紹 JSON2YOLO 轉換工具的使用方式，將通用 JSON 標註轉為 YOLO 訓練需要的 txt 座標格式與 classes.txt，順利銜接 YOLO 模型訓練流程。
date: 2023-08-21
category: 機器學習
tags: [JSON2YOLO, YOLO, 資料標註, 目標檢測, Roboflow]
readingTime: 3 分鐘
image: /images/tech/hero_json2yolo-conversion.webp
imageAlt: JSON2YOLO 格式轉換工具的執行過程與輸出資料夾截圖
---


# JSON2YOLO 轉換工具教學：把 JSON 標註格式轉成 YOLO 訓練格式

拿到別人提供的資料集時，標註格式往往不是 YOLO 格式，想用 YOLO 訓練就得先轉換。這篇文章介紹 Ultralytics 開源的 JSON2YOLO 工具，說明什麼時候需要做格式轉換，以及一行指令完成轉換的實際步驟。

## JSON2YOLO 是什麼？

官方網站：[https://github.com/ultralytics/JSON2YOLO](https://github.com/ultralytics/JSON2YOLO)

JSON2YOLO 是一個用於將 JSON 格式標註數據轉換為 YOLO 格式標註數據的工具。YOLO（You Only Look Once）是一種流行的目標檢測算法，它能夠在單次前向傳遞中同時預測圖像中的多個目標邊界框和類別。

在計算機視覺中，標註數據用於告知模型在圖像中的哪些位置存在目標以及目標的類別。JSON 和 YOLO 是兩種常用的標註數據格式：JSON 通常用於描述目標的邊界框和類別（例如 COCO 格式），而 YOLO 格式則將目標的邊界框和類別信息結合在一起，以便更有效地訓練目標檢測模型。

JSON2YOLO 的主要目的是簡化將 JSON 格式標註數據轉換為 YOLO 格式標註數據的過程。這種轉換通常涉及將目標的邊界框坐標映射到 YOLO 格式，並將類別信息進行編碼，使標註數據能夠更好地適應 YOLO 模型的訓練和預測需求。

## 什麼時候會需要做格式轉換？

當我們使用別人的資料集，很有可能別人並不是使用 YOLO 格式去輸出資料集的。如果我們想要使用 YOLO 做訓練，勢必就得做標註資料的轉換。針對 YOLO 的狀況，就會需要使用這個轉換工具來將其他格式轉為 YOLO 標記格式。

另外一個常見情境：Roboflow 支持的輸出格式並不包含 YOLO segment（分割格式），所以也會需要先下載一般 JSON 格式的標記，再使用這個工具來做轉換。

![Roboflow 支持的輸出格式截圖](/images/articles/json2yolo-conversion-1.webp)

## 如何使用 JSON2YOLO 轉換？

先從 GitHub 下載 JSON2YOLO 專案並進入專案目錄：

![JSON2YOLO 專案目錄結構截圖](/images/articles/json2yolo-conversion-2.webp)

接著在專案目錄下執行：

\`\`\`bash
JSON2YOLO-master> python general_json2yolo.py
\`\`\`

轉換好的資料就會出現在 \`new_dir\` 資料夾中。

![轉換完成後輸出的 new_dir 資料夾截圖](/images/articles/json2yolo-conversion-3.webp)

## 常見問題

### YOLO 標註格式長什麼樣？

YOLO 格式每張圖對應一個同名 txt 檔，每一行代表一個物件：\`class x_center y_center width height\`，座標都是相對於圖片寬高的正規化數值（0～1）。

### JSON 標註格式通常指什麼？

最常見的是 COCO JSON 格式，一個 JSON 檔內包含所有圖片的檔名、尺寸、類別與邊界框（x, y, width, height，以像素為單位）等資訊。

### JSON2YOLO 支援哪些輸入格式？

工具支援 COCO JSON 等多種常見 JSON 標註格式的轉換，詳細支援清單可參考 GitHub 專案的說明與腳本內容。

## 參考資料

- [ultralytics/JSON2YOLO GitHub 專案](https://github.com/ultralytics/JSON2YOLO)

## 延伸閱讀

- [Roboflow 線上標記工具介紹：團隊協作標註、匯入資料集與 no code 建模](/post/roboflow-online-labeling-tool)：同樣聚焦 Roboflow，可接著比較不同情境的做法。
- [物體偵測技術介紹：Bounding Box、類別分類與常見模型架構](/post/object-detection-technology-introduction)：同樣聚焦 YOLO，可接著比較不同情境的做法。
- [計算機視覺四大任務介紹：分類、語義分割、目標檢測與實例分割](/post/computer-vision-tasks)：同樣聚焦 目標檢測，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2023-08-21，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};