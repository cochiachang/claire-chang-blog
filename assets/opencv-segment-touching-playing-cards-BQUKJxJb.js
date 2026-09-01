var e=`---
title: 如何分割黏在一起的撲克牌：OpenCV distanceTransform 與 watershed 範例
description: 以 OpenCV 官方 distance transform 與 watershed 範例為基礎，說明如何分割重疊或相黏的撲克牌物件。
date: 2023-04-06T00:00:00.000Z
category: 機器學習
tags:
  - OpenCV
  - 影像分割
  - 撲克牌辨識
readingTime: 9 分鐘
image: /images/tech/hero_opencv-segment-touching-playing-cards.webp
imageAlt: person holding king of spade playing card
---
# 如何分割黏在一起的撲克牌：OpenCV distanceTransform 與 watershed 範例

分割黏在一起的撲克牌，可以參考 OpenCV 官方的 distance transform 與 watershed 範例。流程是先把背景處理乾淨，再用 Laplacian sharpening 強化邊界，接著二值化、距離轉換、找 markers，最後用 \`cv.watershed()\` 產生分割結果。

## OpenCV 官方範例解決的是什麼問題？

OpenCV 官方範例示範如何分割重疊物件。範例中的撲克牌彼此接觸，單純輪廓偵測容易把多張牌當成同一個物件。

原文參考的是 OpenCV 官方教學〈Image Segmentation with Distance Transform and Watershed Algorithm〉。這篇教學的關鍵不只是 \`watershed()\`，而是前處理如何一步步建立可靠 markers。

這類流程適用於：

- 白底或背景可被清理的物件圖。
- 物件彼此接觸但仍有可辨識形狀。
- 需要把每個物件染成不同 label 的影像分割任務。

## 分割撲克牌的流程有哪些步驟？

分割撲克牌的流程包含背景處理、銳化、灰階二值化、距離轉換、markers 建立與 watershed 分割。每一步都會影響最終分割品質。

| 步驟 | OpenCV 函數 | 目的 |
| --- | --- | --- |
| 背景處理 | 像素條件替換 | 把白色背景轉成黑色 |
| 銳化 | \`filter2D()\` | 強化邊界 |
| 二值化 | \`threshold()\` | 取得前景遮罩 |
| 距離轉換 | \`distanceTransform()\` | 找物件中心高峰 |
| 找 contours | \`findContours()\` | 取得 markers |
| 分水嶺 | \`watershed()\` | 分割相黏區域 |

資訊增益在這裡很明確：watershed 的成敗高度依賴 markers，而 markers 依賴前面距離轉換後的高峰是否乾淨。

## 官方範例程式碼的核心片段是什麼？

官方範例先使用 Laplacian kernel 銳化圖片，再進行二值化與距離轉換。距離轉換後的峰值會被拿來建立 watershed markers。

\`\`\`py
from __future__ import print_function
import cv2 as cv
import numpy as np
import argparse
import random as rng

rng.seed(12345)

parser = argparse.ArgumentParser(
    description="Image Segmentation with Distance Transform and Watershed Algorithm"
)
parser.add_argument("--input", help="Path to input image.", default="cards.png")
args = parser.parse_args()

src = cv.imread(cv.samples.findFile(args.input))
if src is None:
    print("Could not open or find the image:", args.input)
    exit(0)

src[np.all(src == 255, axis=2)] = 0

kernel = np.array([[1, 1, 1], [1, -8, 1], [1, 1, 1]], dtype=np.float32)
img_laplacian = cv.filter2D(src, cv.CV_32F, kernel)
sharp = np.float32(src)
img_result = sharp - img_laplacian

img_result = np.clip(img_result, 0, 255).astype("uint8")

bw = cv.cvtColor(img_result, cv.COLOR_BGR2GRAY)
_, bw = cv.threshold(bw, 40, 255, cv.THRESH_BINARY | cv.THRESH_OTSU)

dist = cv.distanceTransform(bw, cv.DIST_L2, 3)
cv.normalize(dist, dist, 0, 1.0, cv.NORM_MINMAX)
_, dist = cv.threshold(dist, 0.4, 1.0, cv.THRESH_BINARY)
\`\`\`

原始官方範例在不同 OpenCV 版本中，\`findContours()\` 回傳值數量可能不同。OpenCV 4 通常是 \`contours, hierarchy = cv.findContours(...)\`，OpenCV 3 常見是 \`_, contours, hierarchy = cv.findContours(...)\`。

## distanceTransform 在撲克牌分割中扮演什麼角色？

\`distanceTransform()\` 會把每個前景像素到背景的距離轉成亮度資訊。物件中心會形成高峰，這些高峰可作為 watershed markers。

在撲克牌範例中，若兩張牌黏在一起，外輪廓可能只有一個，但距離轉換後可能出現兩個局部高峰。這兩個高峰就是分水嶺分割的起點。

需要注意的是，距離轉換前必須先有合理的二值圖。若背景沒清乾淨、陰影太重或物件邊界太破碎，距離圖的高峰會不穩，markers 也會跟著錯。

## watershed 結果如何上色？

watershed 會把不同區域標上不同 index。範例再為每個 contour 產生隨機顏色，將不同區域畫成不同色塊。

\`\`\`py
colors = []
for contour in contours:
    colors.append((rng.randint(0, 256), rng.randint(0, 256), rng.randint(0, 256)))

dst = np.zeros((markers.shape[0], markers.shape[1], 3), dtype=np.uint8)

for i in range(markers.shape[0]):
    for j in range(markers.shape[1]):
        index = markers[i, j]
        if index > 0 and index <= len(contours):
            dst[i, j, :] = colors[index - 1]
\`\`\`

這段上色不是分割本身，而是為了檢查分割結果。實務專案中，後續通常會把每個 label 的輪廓、面積、中心點或 bounding box 取出，交給辨識或排序流程。

## 常見問題
### 分割撲克牌一定要用 watershed 嗎？

不一定。若撲克牌沒有相黏，輪廓偵測通常就夠。watershed 適合處理相黏、重疊或單一外輪廓包含多個物件的情境。

### Laplacian sharpening 是必要步驟嗎？

Laplacian sharpening 不是永遠必要，但在官方範例中用來強化物件邊界。若原圖邊界已經很清楚，可以測試移除銳化後是否仍能得到穩定 markers。

### OpenCV 3 和 OpenCV 4 的 findContours 差在哪？

OpenCV 3 的 \`findContours()\` 常回傳三個值，OpenCV 4 通常回傳兩個值。搬移舊範例時，這是最常見的相容性錯誤之一。

### watershed 分割後可以直接辨識每張牌嗎？

watershed 只完成區域分割，不能直接辨識牌面。若要辨識花色與點數，還需要透視校正、裁切、特徵擷取或分類模型。

## 參考資料
- OpenCV 官方教學，Image Segmentation with Distance Transform and Watershed Algorithm，https://docs.opencv.org/3.4/d2/dbd/tutorial_distance_transform.html，存取日期：2026-08-27。
- OpenCV 文件，Watershed Algorithm，https://docs.opencv.org/4.x/d3/db4/tutorial_py_watershed.html，存取日期：2026-08-27。

## 延伸閱讀

- [拆分相黏的正方形：OpenCV distanceTransform 與 watershed 流程](/post/opencv-split-touching-squares)：同樣聚焦 OpenCV、影像分割，可接著比較不同情境的做法。
- [分水嶺演算法：偵測相連區域形狀](/post/watershed-algorithm-connected-shapes)：同樣聚焦 OpenCV、影像分割，可接著比較不同情境的做法。
- [OpenCV 如何用 floodFill 做魔術棒填色](/post/opencv-flood-fill-magic-wand)：同樣聚焦 OpenCV、影像分割，可接著比較不同情境的做法。
`;export{e as default};