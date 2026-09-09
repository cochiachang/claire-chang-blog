var e=`---
title: OpenCV 輪廓形狀擬合有哪些常用方法
description: 整理 OpenCV 輪廓擬合常用函數，包含 boundingRect、minAreaRect、fitEllipse、minEnclosingCircle 與 fitLine。
date: 2023-05-08T00:00:00.000Z
category: 機器學習
tags:
  - OpenCV
  - Python
  - 輪廓偵測
readingTime: 11 分鐘
image: /images/tech/hero_opencv-shape-fitting-methods.webp
imageAlt: A computer generated image of a red object on a tiled floor
---
# OpenCV 輪廓形狀擬合有哪些常用方法

OpenCV 輪廓形狀擬合常用方法包括 \`cv2.boundingRect()\`、\`cv2.minAreaRect()\`、\`cv2.fitEllipse()\`、\`cv2.minEnclosingCircle()\` 與 \`cv2.fitLine()\`。選擇函數時，要先判斷需要的是外接範圍、旋轉角度、橢圓軸向、圓形範圍，還是點集趨勢線。

## \`cv2.boundingRect()\` 適合做什麼？

\`cv2.boundingRect()\` 適合取得不旋轉的矩形邊界框。函數會回傳 \`(x, y, w, h)\`，其中 \`(x, y)\` 是左上角座標，\`w\` 與 \`h\` 是矩形寬高。

這個方法速度快，也很適合做裁切 ROI。限制是矩形邊界框永遠與影像座標軸平行，所以物件旋轉時，框出的區域會包含較多背景。

\`\`\`python
import cv2

img = cv2.imread("image.jpg")
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

_, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)

x, y, w, h = cv2.boundingRect(contours[0])
cv2.rectangle(img, (x, y), (x + w, y + h), (0, 0, 255), 2)
\`\`\`

## \`cv2.minAreaRect()\` 適合做什麼？

\`cv2.minAreaRect()\` 適合取得能包住輪廓的最小旋轉矩形。函數會回傳中心點、寬高與角度，常用在需要知道物件方向的情境。

原文特別提醒，\`rect\` 本身不是可以任意修改的物件。若要自己產生旋轉矩形，可以建立 \`((center_x, center_y), (width, height), angle)\` 這種結構，再用 \`cv2.boxPoints()\` 取四個角點。

\`\`\`python
import cv2
import numpy as np

rect = cv2.minAreaRect(contours[0])
box = cv2.boxPoints(rect)
box = np.int0(box)
cv2.drawContours(img, [box], 0, (0, 0, 255), 2)
\`\`\`

\`\`\`python
center = (250, 250)
width = 200
height = 100
angle = 45

rect = (center, (width, height), angle)
box = cv2.boxPoints(rect)
box = np.int0(box)
\`\`\`

## \`cv2.fitEllipse()\` 和最小包圍橢圓差在哪？

\`cv2.fitEllipse()\` 找的是最能擬合點集的橢圓，不保證包住所有點。最小包圍橢圓的概念是包住所有點，但 OpenCV Python 常見實作多用 \`fitEllipse()\` 取得中心、軸長與角度。

使用 \`cv2.fitEllipse()\` 時，輪廓點數至少要足夠形成橢圓擬合。若點數太少或輪廓品質不穩，橢圓角度也會跟著不穩。

\`\`\`python
import cv2

ellipse = cv2.fitEllipse(contours[0])
cv2.ellipse(img, ellipse, (0, 0, 255), 2)
\`\`\`

## \`cv2.minEnclosingCircle()\` 適合做什麼？

\`cv2.minEnclosingCircle()\` 適合取得能包住點集的最小外接圓。函數會回傳圓心與半徑，適合近似圓形物件或需要快速估算物件尺寸的場景。

最小外接圓不會描述物件方向，因此不適合拿來轉正影像。若任務需要方向角，應改用 \`cv2.minAreaRect()\`、\`cv2.fitEllipse()\` 或 \`cv2.fitLine()\`。

\`\`\`python
(x, y), radius = cv2.minEnclosingCircle(contours[0])
center = (int(x), int(y))
radius = int(radius)

cv2.circle(img, center, radius, (0, 0, 255), 2)
\`\`\`

## \`cv2.fitLine()\` 適合做什麼？

\`cv2.fitLine()\` 適合從一組輪廓點擬合出趨勢直線。函數回傳 \`(vx, vy, x0, y0)\`，其中 \`(vx, vy)\` 是方向向量，\`(x0, y0)\` 是線上的一點。

這個方法常用於判斷長條形物件、邊緣方向或點集主要方向。若要把直線畫滿整張影像，可以用方向向量推算左右邊界交點。

\`\`\`python
rows, cols = img.shape[:2]
[vx, vy, x, y] = cv2.fitLine(contours[0], cv2.DIST_L2, 0, 0.01, 0.01)
lefty = int((-x * vy / vx) + y)
righty = int(((cols - x) * vy / vx) + y)

cv2.line(img, (cols - 1, righty), (0, lefty), (0, 0, 255), 2)
\`\`\`

## OpenCV 形狀擬合該怎麼選？

OpenCV 形狀擬合要依輸出需求選函數。只要裁切用 \`boundingRect()\`，要旋轉矩形用 \`minAreaRect()\`，要橢圓軸向用 \`fitEllipse()\`，要外接圓用 \`minEnclosingCircle()\`。

| 需求 | 建議函數 | 主要輸出 |
|---|---|---|
| 快速裁切輪廓 | \`cv2.boundingRect()\` | x、y、寬、高 |
| 找旋轉外框 | \`cv2.minAreaRect()\` | 中心、寬高、角度 |
| 找橢圓方向 | \`cv2.fitEllipse()\` | 中心、軸長、角度 |
| 找最小外接圓 | \`cv2.minEnclosingCircle()\` | 圓心、半徑 |
| 找點集趨勢線 | \`cv2.fitLine()\` | 方向向量、線上一點 |

我自己的習慣是先用 \`boundingRect()\` 做最穩的裁切，再看任務是否需要角度。如果物件邊界容易因為小缺口改變，橢圓擬合有時比最小矩形更穩。

## 常見問題
### \`cv2.boundingRect()\` 和 \`cv2.minAreaRect()\` 差在哪？

\`cv2.boundingRect()\` 回傳不旋轉矩形，速度快且適合裁切。\`cv2.minAreaRect()\` 回傳旋轉矩形，適合取得物件角度與更貼合的外框。

### \`cv2.fitEllipse()\` 一定能包住所有輪廓點嗎？

\`cv2.fitEllipse()\` 不保證包住所有輪廓點。\`cv2.fitEllipse()\` 是擬合橢圓，重點是符合點集趨勢，不是最小外接邊界。

### 哪個 OpenCV 函數適合做物件轉正？

若物件是近似長條或橢圓形，我會優先測 \`cv2.fitEllipse()\` 的角度。若物件是明確矩形，\`cv2.minAreaRect()\` 也可以取得旋轉角度。

### 輪廓點太少會影響擬合嗎？

輪廓點太少會影響擬合結果，尤其是橢圓擬合。實作前應先確認 \`contours[0]\` 的點數與輪廓品質。

## 參考資料
- OpenCV Documentation, Structural Analysis and Shape Descriptors: <https://docs.opencv.org/4.x/d3/dc0/group__imgproc__shape.html>

## 延伸閱讀

- [取得 OpenCV 輪廓中心點：cv2.moments 計算 centroid 範例](/post/opencv-contour-center-point)：同樣聚焦 OpenCV、輪廓偵測，可接著比較不同情境的做法。
- [OpenCV 如何將歪斜圖形轉正](/post/opencv-correct-object-rotation)：同樣聚焦 OpenCV、Python，可接著比較不同情境的做法。
- [OpenCV 如何計算旋轉後的輪廓角點](/post/opencv-rotate-contour-points)：同樣聚焦 OpenCV、Python，可接著比較不同情境的做法。

## 最後更新

Mon May 08 2023 08:00:00 GMT+0800 (Taiwan Standard Time)

`;export{e as default};