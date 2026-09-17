var e=`---
title: OpenCV 如何計算點到多邊形的最短距離
description: 介紹 cv2.pointPolygonTest 的 measureDist 用法，判斷點在多邊形內外、邊界上或取得最短距離。
date: 2023-06-09T00:00:00.000Z
category: 機器學習
tags:
  - OpenCV
  - Python
  - 幾何計算
readingTime: 3 分鐘
image: /images/tech/hero_opencv-point-polygon-shortest-distance.webp
imageAlt: a close up of a sheet of paper with numbers on it
---
# OpenCV 如何計算點到多邊形的最短距離

OpenCV 可用 \`cv2.pointPolygonTest()\` 計算點到多邊形的最短距離，也可以只判斷點在多邊形內、外或邊界上。關鍵參數是 \`measureDist\`，設為 \`True\` 會回傳距離，設為 \`False\` 會回傳位置關係。

## \`cv2.pointPolygonTest()\` 是什麼？

\`cv2.pointPolygonTest()\` 是 OpenCV 用來測試點與輪廓關係的函數。輸入一個 contour 和一個點，就能判斷點是否落在多邊形內部、外部或邊界。

函數語法如下：

\`\`\`python
result = cv2.pointPolygonTest(contour, point, measureDist)
\`\`\`

| 參數 | 說明 |
|---|---|
| \`contour\` | 多邊形輪廓，可為 NumPy 陣列或 OpenCV contour |
| \`point\` | 要測試的點，格式通常是 \`(x, y)\` |
| \`measureDist\` | 是否計算最短距離 |

## \`measureDist\` 要設 True 還是 False？

\`measureDist=True\` 會回傳有正負號的距離值，\`measureDist=False\` 只回傳位置關係。若只需要知道點在內外，使用 \`False\` 比較直覺。

回傳值的意義如下：

| 回傳值 | 意義 |
|---|---|
| 正數 | 點在多邊形內部 |
| 負數 | 點在多邊形外部 |
| \`0\` | 點在多邊形邊界上 |

若 \`measureDist=True\`，數值大小就是點到輪廓邊界的最短距離，正負號仍表示內外關係。

\`\`\`python
distance = cv2.pointPolygonTest(rect3, tuple(line1_midpoint), measureDist=True)
position = cv2.pointPolygonTest(rect3, tuple(line1_midpoint), measureDist=False)
\`\`\`

## 如何用 \`cv2.polylines()\` 畫出多邊形？

\`cv2.polylines()\` 可用來畫多邊形輪廓。測試 \`cv2.pointPolygonTest()\` 前，先把 contour 畫出來，通常比較容易確認座標是否正確。

\`\`\`python
import cv2
import numpy as np

rect1 = np.array([[100, 100], [300, 100], [300, 200], [100, 200]])
image = np.zeros((500, 500, 3), dtype=np.uint8)

cv2.polylines(image, [rect1], True, (0, 255, 0), thickness=2)

cv2.imshow("Image", image)
cv2.waitKey(0)
cv2.destroyAllWindows()
\`\`\`

我通常會先把 contour 和測試點都畫在同一張 debug 圖上。只看距離數字時，很容易把 \`(x, y)\` 與陣列索引 \`(row, col)\` 搞反。

## 常見問題
### \`cv2.pointPolygonTest()\` 可以處理非矩形多邊形嗎？

可以。\`cv2.pointPolygonTest()\` 接受一般 contour，因此矩形、多邊形或由輪廓偵測得到的形狀都能使用。

### 點在多邊形邊界上會回傳什麼？

點在邊界上會回傳 \`0\`。若 \`measureDist=True\`，距離也會是 \`0\`。

### OpenCV 的 point 座標順序是什麼？

OpenCV 的 point 座標順序是 \`(x, y)\`。NumPy 陣列存取常用 \`(row, col)\`，兩者順序不同。

## 參考資料
- OpenCV Documentation, \`pointPolygonTest\`: <https://docs.opencv.org/4.x/d3/dc0/group__imgproc__shape.html>

## 延伸閱讀

- [OpenCV 如何計算旋轉後的輪廓角點](/post/opencv-rotate-contour-points)：同樣聚焦 OpenCV、Python，可接著比較不同情境的做法。
- [取得 OpenCV 輪廓中心點：cv2.moments 計算 centroid 範例](/post/opencv-contour-center-point)：同樣聚焦 OpenCV、Python，可接著比較不同情境的做法。
- [OpenCV 如何將歪斜圖形轉正](/post/opencv-correct-object-rotation)：同樣聚焦 OpenCV、Python，可接著比較不同情境的做法。

## 最後更新

Fri Jun 09 2023 08:00:00 GMT+0800 (Taiwan Standard Time)

`;export{e as default};