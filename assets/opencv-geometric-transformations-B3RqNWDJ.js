var e=`---
title: OpenCV 圖像幾何變換教學：縮放、平移、旋轉、仿射與透視變換
description: 整理 OpenCV 幾何變換的用途、矩陣設定、cv.resize、warpAffine 與 warpPerspective 範例。
date: 2022-12-16
category: 機器學習
tags: [OpenCV, 影像處理, 幾何變換, Python]
readingTime: 7 分鐘
image: /images/tech/hero_opencv-geometric-transformations.webp
imageAlt: OpenCV 圖像幾何變換教學：縮放、平移、旋轉、仿射與透視變換 hero image
---


# OpenCV 圖像幾何變換教學：縮放、平移、旋轉、仿射與透視變換

OpenCV 圖像幾何變換可以用來改變影像的尺寸、位置、角度與視角。實作時通常先判斷需求是縮放、平移、旋轉、仿射變換或透視變換，再選擇 \`cv.resize()\`、\`cv.warpAffine()\` 或 \`cv.warpPerspective()\`。

## OpenCV 幾何變換要解決什麼問題？

OpenCV 幾何變換的核心目標是把影像座標重新映射到新的座標系。縮放改變大小，平移改變位置，旋轉改變方向，仿射與透視變換則處理更複雜的平面形變。

幾何變換常出現在資料前處理、文件校正、物件定位與影像增強。OpenCV 官方文件把相關函數放在 Geometric Image Transformations 模組，常用 API 包含 \`resize\`、\`warpAffine\`、\`getAffineTransform\`、\`getPerspectiveTransform\` 與 \`warpPerspective\`（OpenCV，存取日期：2026-08-27）。

實務判斷表：

| 需求 | 建議函數 | 需要的矩陣 |
|---|---|---|
| 改變圖片大小 | \`cv.resize()\` | 不需要 |
| 移動圖片位置 | \`cv.warpAffine()\` | 2x3 平移矩陣 |
| 旋轉圖片 | \`cv.getRotationMatrix2D()\` + \`cv.warpAffine()\` | 2x3 旋轉矩陣 |
| 三點對三點形變 | \`cv.getAffineTransform()\` + \`cv.warpAffine()\` | 2x3 仿射矩陣 |
| 四點拉平成矩形 | \`cv.getPerspectiveTransform()\` + \`cv.warpPerspective()\` | 3x3 透視矩陣 |

## 如何用 OpenCV 縮放圖像？

OpenCV 縮放圖像最直接的做法是使用 \`cv.resize()\`。開發者可以指定目標寬高，也可以用 \`fx\`、\`fy\` 指定水平與垂直倍率。

\`\`\`python
import cv2 as cv

img = cv.imread('messi5.jpg')
res = cv.resize(img, None, fx=2, fy=2, interpolation=cv.INTER_CUBIC)

height, width = img.shape[:2]
res2 = cv.resize(img, (2 * width, 2 * height), interpolation=cv.INTER_CUBIC)
\`\`\`

放大影像常用 \`INTER_CUBIC\` 或 \`INTER_LINEAR\`，縮小影像常用 \`INTER_AREA\`。本文的原始筆記把縮放放在第一步是合理的，因為後續平移與旋轉都會受到圖片尺寸影響。

## 如何用 OpenCV 平移與旋轉圖像？

OpenCV 平移與旋轉都可以透過 \`cv.warpAffine()\` 完成。平移矩陣直接指定 x 與 y 位移，旋轉矩陣則由 \`cv.getRotationMatrix2D()\` 產生。

平移範例：

\`\`\`python
import numpy as np
import cv2 as cv

img = cv.imread('messi5.jpg', 0)
rows, cols = img.shape
matrix = np.float32([[1, 0, 100], [0, 1, 50]])
dst = cv.warpAffine(img, matrix, (cols, rows))
\`\`\`

旋轉範例：

\`\`\`python
matrix = cv.getRotationMatrix2D(((cols - 1) / 2.0, (rows - 1) / 2.0), 90, 1)
dst = cv.warpAffine(img, matrix, (cols, rows))
\`\`\`

平移後超出畫布的像素會被裁掉。旋轉後若要保留完整圖像，需要重新計算輸出畫布大小，而不是直接沿用原本的 \`(cols, rows)\`。

## 仿射變換和透視變換怎麼選？

仿射變換適合保持平行線關係的平面變形，透視變換適合處理拍攝角度造成的遠近變形。文件掃描、名片校正與斜拍矩形拉正通常要用透視變換。

仿射變換用三組對應點：

\`\`\`python
pts1 = np.float32([[50, 50], [200, 50], [50, 200]])
pts2 = np.float32([[10, 100], [200, 50], [100, 250]])
matrix = cv.getAffineTransform(pts1, pts2)
dst = cv.warpAffine(img, matrix, (cols, rows))
\`\`\`

透視變換用四組對應點：

\`\`\`python
pts1 = np.float32([[56, 65], [368, 52], [28, 387], [389, 390]])
pts2 = np.float32([[0, 0], [300, 0], [0, 300], [300, 300]])
matrix = cv.getPerspectiveTransform(pts1, pts2)
dst = cv.warpPerspective(img, matrix, (300, 300))
\`\`\`

實務資訊增益：若影像中的矩形目標不是正面拍攝，先用輪廓找到四個角點，再做透視變換，通常比直接旋轉更穩定。

## 常見問題

### OpenCV 幾何變換一定要懂矩陣嗎？

OpenCV 幾何變換不一定要先完整推導矩陣。初學者可以先記住平移用 2x3 矩陣、旋轉用 \`getRotationMatrix2D\`、透視校正用四個點產生 3x3 矩陣。

### cv.warpAffine 和 cv.warpPerspective 差在哪？

\`cv.warpAffine()\` 使用 2x3 矩陣，適合平移、旋轉、縮放與仿射變形。\`cv.warpPerspective()\` 使用 3x3 矩陣，適合把斜拍平面拉回正面。

### OpenCV 旋轉後圖片被裁掉怎麼辦？

OpenCV 旋轉後圖片被裁掉，通常是輸出畫布仍使用原圖尺寸。解法是根據旋轉角度重新計算新寬高，再調整旋轉矩陣中的平移量。

### 透視變換需要幾個點？

OpenCV 透視變換需要四組來源點與四組目標點。四個點通常對應矩形物件的左上、右上、左下、右下角。

### interpolation 參數要怎麼選？

縮小圖片常用 \`cv.INTER_AREA\`，放大圖片常用 \`cv.INTER_LINEAR\` 或 \`cv.INTER_CUBIC\`。若任務重視速度，\`INTER_LINEAR\` 通常是穩定選擇。

## 參考資料

- OpenCV，〈[Geometric Image Transformations](https://docs.opencv.org/4.x/da/d54/group__imgproc__transform.html)〉，存取日期：2026-08-27。

## 延伸閱讀

- [用 OpenCV 旋轉圖片：getRotationMatrix2D 與 warpAffine 範例](/post/opencv-rotate-image)：同樣聚焦 OpenCV、Python，可接著比較不同情境的做法。
- [使用 OpenCV 調整圖片亮度：convertScaleAbs 範例](/post/opencv-adjust-image-brightness)：同樣聚焦 OpenCV、Python，可接著比較不同情境的做法。
- [OpenCV 如何繪製穿過兩點中點的垂直線](/post/opencv-draw-perpendicular-line)：同樣聚焦 OpenCV、Python，可接著比較不同情境的做法。

## 最後更新

2026-08-28

`;export{e as default};