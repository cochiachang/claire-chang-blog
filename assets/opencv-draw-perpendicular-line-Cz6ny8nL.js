var e=`---
title: OpenCV 如何繪製穿過兩點中點的垂直線
description: 用 Python 與 OpenCV 計算兩點中點、原線斜率與垂直斜率，畫出通過中點的垂直線。
date: 2023-04-06T00:00:00.000Z
category: 機器學習
tags:
  - OpenCV
  - Python
  - 影像處理
readingTime: 4 分鐘
image: /images/tech/hero_opencv-draw-perpendicular-line.webp
imageAlt: A system of linear equations printed in black ink on white paper
---
# OpenCV 如何繪製穿過兩點中點的垂直線

要用 OpenCV 繪製穿過兩點中點的垂直線，核心做法是先算出兩點的中點，再用兩點連線的斜率推回垂直線斜率。最後把垂直線端點換成影像座標，交給 \`cv2.line()\` 畫到影像上。

## 兩點中點要怎麼計算？

兩點中點可用 x 座標平均與 y 座標平均取得。OpenCV 繪圖座標使用整數，因此範例用整數除法讓中點可以直接放進 \`cv2.circle()\` 或 \`cv2.line()\`。

以 \`(10, 20)\` 和 \`(50, 30)\` 為例，中點是 \`((10 + 50) // 2, (20 + 30) // 2)\`，也就是 \`(30, 25)\`。這個點會是垂直線必須通過的位置。

\`\`\`python
point1 = (10, 20)
point2 = (50, 30)

center_point = (
    (point1[0] + point2[0]) // 2,
    (point1[1] + point2[1]) // 2,
)
\`\`\`

## 垂直線斜率要怎麼推？

垂直線斜率是原線斜率的負倒數。若原線斜率為 \`k\`，垂直線斜率就是 \`-1 / k\`，但水平線與垂直線要另外處理，避免除以零。

原文範例只有特別處理兩點 x 座標相同的情況，也就是原線為垂直線。實務上還要注意 y 座標相同時，原線是水平線，垂直線端點就應該固定在同一個 x 座標。

| 原線狀況 | 判斷方式 | 垂直線做法 |
|---|---|---|
| 垂直線 | \`point1[0] == point2[0]\` | 垂直線會變水平線 |
| 水平線 | \`point1[1] == point2[1]\` | 垂直線會變垂直線 |
| 一般斜線 | x、y 都不同 | 使用 \`vk = -1 / k\` |

## OpenCV 完整範例怎麼寫？

OpenCV 完整範例會建立一張空白影像，標出兩個端點與中點，再依照斜率計算垂直線端點。這段程式適合用來確認幾何計算是否符合影像座標。

\`\`\`python
import cv2
import numpy as np

img = np.zeros((100, 100, 3), np.uint8)

point1 = (10, 20)
point2 = (50, 30)

center_point = (
    (point1[0] + point2[0]) // 2,
    (point1[1] + point2[1]) // 2,
)

cv2.circle(img, point1, 2, (0, 0, 255), -1)
cv2.circle(img, point2, 2, (0, 0, 255), -1)
cv2.circle(img, center_point, 2, (0, 255, 0), -1)

if point1[0] == point2[0]:
    line_point1 = (0, center_point[1])
    line_point2 = (100, center_point[1])
elif point1[1] == point2[1]:
    line_point1 = (center_point[0], 0)
    line_point2 = (center_point[0], 100)
else:
    k = (point2[1] - point1[1]) / (point2[0] - point1[0])
    vk = -1 / k
    line_point1 = (center_point[0] - 50, int(center_point[1] - vk * 50))
    line_point2 = (center_point[0] + 50, int(center_point[1] + vk * 50))

cv2.line(img, line_point1, line_point2, (255, 0, 0), 1)

cv2.imshow("image", img)
cv2.waitKey(0)
cv2.destroyAllWindows()
\`\`\`

## 常見問題
### \`cv2.line()\` 的座標順序是什麼？

\`cv2.line()\` 的端點座標順序是 \`(x, y)\`。影像陣列本身常用 \`image[y, x]\` 存取像素，這兩種寫法不要混在一起。

### 為什麼垂直線斜率是負倒數？

在平面幾何中，兩條互相垂直的非垂直直線斜率相乘會等於 \`-1\`。因此原線斜率是 \`k\` 時，垂直線斜率就是 \`-1 / k\`。

### 如果兩點重合可以畫垂直線嗎？

兩點重合時無法定義原始直線方向，因此也無法推導唯一的垂直線。程式應先檢查 \`point1 == point2\`，再決定是否使用預設方向。

## 參考資料
- OpenCV Documentation, Drawing Functions: <https://docs.opencv.org/4.x/d6/d6e/group__imgproc__draw.html>

## 延伸閱讀

- [使用 OpenCV 調整圖片亮度：convertScaleAbs 範例](/post/opencv-adjust-image-brightness)：同樣聚焦 OpenCV、Python，可接著比較不同情境的做法。
- [OpenCV 圖像金字塔教學：Gaussian Pyramid、Laplacian Pyramid 與影像融合](/post/opencv-image-pyramid)：同樣聚焦 OpenCV、影像處理，可接著比較不同情境的做法。
- [OpenCV 圖像幾何變換教學：縮放、平移、旋轉、仿射與透視變換](/post/opencv-geometric-transformations)：同樣聚焦 OpenCV、影像處理，可接著比較不同情境的做法。

## 最後更新

Thu Apr 06 2023 08:00:00 GMT+0800 (Taiwan Standard Time)

`;export{e as default};