var e=`---
title: 影像分割 Image Segmentation 模型整理：U-Net、Mask R-CNN、DeepLab 與 U2-Net
description: 影像分割模型介紹：從傳統方法到語意分割、實例分割與全景分割的差異，整理 FCN、U-Net、Mask R-CNN、SAM 等代表模型的原理與適用情境，建立影像分割 Image Segmentation 的模型選型觀念。
date: 2023-09-27
category: 機器學習
tags: [Image Segmentation, U-Net, Mask R-CNN, DeepLab, U2-Net]
readingTime: 5 分鐘
image: /images/tech/hero_image-segmentation-models.webp
imageAlt: 影像分割模型架構示意圖
---


# 影像分割 Image Segmentation 模型整理：U-Net、Mask R-CNN、DeepLab 與 U2-Net

想做影像分割或去背，卻分不清 U-Net、Mask R-CNN、DeepLab 和 U2-Net 的差別？這篇筆記先整理影像分割的基本目標與技術類型，再逐一說明深度學習時代常見的分割模型架構，以及 U-Net 和去背改良版 U2-Net 的設計差異。

## 影像分割是什麼？

影像分割（Image Segmentation）是電腦視覺中的一個基本任務，目的是將數字影像劃分成多個片段（或稱為「超像素」），使得具有相似性質的像素群組成同一片段。影像分割的目的是簡化或改變影像的表示形式，使其更容易被分析。

整理成幾個重點：

- **目標**
  - 將影像中具有相似特性（如顏色、強度、紋理）的像素分到同一區域。
  - 賦予影像的每一個像素一個標籤，該標籤指示該像素屬於哪一物體或區域。
- **分割技術類型**
  - **閾值分割**：根據像素值的閾值將影像分成兩個或多個部分。
  - **基於區域的分割**：從種子點開始，將相鄰的像素添加到區域中，直到符合某些條件。
  - **基於邊緣的分割**：檢測影像中的邊緣（突然的強度變化）來劃分區域。
  - **基於聚類的分割**：例如 K-means，將像素分為擁有相似特性的多個群體。
  - **神經網路和深度學習**：如 U-Net、DeepLab 等模型，用於更複雜的影像分割任務。
- **應用**
  - **醫學影像**：例如從 MRI 影像中識別出不同的器官或病變區域。
  - **遙感**：劃分地表的不同區域，如水域、森林、城市等。
  - **物體識別和跟踪**：識別影像中的特定物體。
  - **電腦視覺任務**：如場景理解、影像修復、3D 建模等。
- **評估**：可以使用像 Jaccard 系數（Intersection over Union, IoU）這樣的指標來評估分割模型的性能。

影像分割作為電腦視覺中的一個核心任務，在許多應用中都扮演著重要的角色，且隨著深度學習的發展，其效果和應用領域持續擴展。

## 怎麼用深度學習做影像分割？

深度學習和神經網路在影像去背上已取得了驚人的成果，常見的模型如下：

1. **U-Net 結構**
   - U-Net 是一種用於影像分割的卷積神經網路（CNN）結構。
   - 它具有縮小（下採樣）和擴展（上採樣）的部分，使其形狀像字母「U」。
   - U-Net 非常適合進行像素級別的分類，如分離前景和背景。
2. **Mask R-CNN**
   - Mask R-CNN 是一種用於實例分割的方法，可以同時偵測物件並生成對應的遮罩。
   - 它結合了 Faster R-CNN（用於物件偵測）和一個額外的遮罩分支。
3. **DeepLab**
   - DeepLab 是一個強大的影像分割模型，它使用了空間金字塔池化和全卷積網路。
   - 它能夠精確地捕捉物件的邊界，使其適合去背任務。

## 為什麼 U-Net 這麼受歡迎？

網路的介紹文章可以參考 [iT 邦幫忙的 U-Net 介紹](https://ithelp.ithome.com.tw/articles/10240314)。

- **起源**：U-Net 最初是為了醫學影像分割而設計的，特別是在數據集相對較小的情境下。
- **架構**：U-Net 架構具有對稱的編碼器和解碼器部分。編碼器進行下採樣，而解碼器進行上採樣。兩者之間有跳躍連接（skip connection），這意味著對應的編碼器和解碼器層之間的特徵被結合在一起，這有助於模型獲取更精確的位置信息。

![U-Net 對稱編碼器與解碼器架構圖，兩側之間有跳躍連接](/images/articles/image-segmentation-models-1.webp)

## U2-Net 和 U-Net 差在哪裡？

U2-Net 是針對去背改良的版本，網路相關教學文章可以參考 [CSDN 的 U2-Net 教學](https://blog.csdn.net/xuzz_498100208/article/details/109912302)。

![U2-Net 嵌套 U 型結構的網路架構圖](/images/articles/image-segmentation-models-2.webp)

- **起源**：U^2-Net 被設計為一個更深的網絡結構，用於進行較為複雜的影像分割和去背工作。
- **架構**：U2-Net 的名稱意味著「U-Net 的 U-Net」，這是因為它的設計理念是將多個 U-Net 結構嵌套在一起。具體來說，它利用了深層和淺層的嵌套 U-Net 架構來捕獲多尺度特徵。U2-Net 的重要組件是其嵌套的殘差結構，這有助於模型學習從各種層次獲取的資訊。U2-Net 的架構包括六個編碼器階段和五個解碼器階段，以及一個用於融合顯著地圖的模塊。它通過嵌套的 U 結構從不同階段有效提取多尺度特徵，從而實現了顯著對象檢測的優異性能。該方法對於克服現有骨幹網絡的限制和提高檢測性能具有重要意義。
- **特性**：由於其深度和複雜的架構，U^2-Net 在某些情境下可能比 U-Net 有更好的性能，特別是在需要捕獲多尺度特徵的情境下。

## 常見問題

### 影像分割和物件偵測有什麼不同？

物件偵測輸出的是物體的外接框（bounding box）與類別；影像分割則進一步為每個像素貼上標籤，能夠得到物體的精確輪廓。需要精確邊界或去背時，就要用分割模型。

### 做去背應該選哪個模型？

一般用途可以從 U-Net 或 U2-Net 系列開始，人像可考慮 u2net_human_seg，需要更高精度的多尺度表現時 U2-Net 通常是更好的選擇。實測比較可以參考延伸閱讀的 U2-Net 去背實測文章。

### 分割模型的效果要怎麼評估？

常用的指標是 IoU（Intersection over Union，又稱 Jaccard 系數），衡量預測遮罩與真實遮罩的重疊比例。IoU 越高代表分割結果越接近真實輪廓。

## 參考資料

- [iT 邦幫忙：U-Net 網路介紹](https://ithelp.ithome.com.tw/articles/10240314)
- [CSDN：U2-Net 相關教學](https://blog.csdn.net/xuzz_498100208/article/details/109912302)

## 延伸閱讀

- [影像分割模型介紹：U-Net 與去背改良版 U2-Net](/post/image-segmentation-models)：同樣聚焦 U-Net、U2-Net，可接著比較不同情境的做法。
- [OpenCV 如何用 floodFill 做魔術棒填色](/post/opencv-flood-fill-magic-wand)：同屬「機器學習」主題，可延伸理解相近問題的判斷方式。
- [Segment Anything（SAM）論文筆記：提示式分割模型、SA-1B 資料集與 Zero-Shot 實驗](/post/segment-anything-notes)：同樣聚焦 Image Segmentation，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2023-09-27，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};