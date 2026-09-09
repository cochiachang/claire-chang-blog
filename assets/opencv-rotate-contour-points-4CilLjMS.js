var e=`---
title: OpenCV 如何計算旋轉後的輪廓角點
description: 使用 sin、cos 與矩形中心點計算旋轉後四個角點，並用 cv2.polylines 畫出旋轉矩形。
date: 2023-06-09T00:00:00.000Z
category: 機器學習
tags:
  - OpenCV
  - Python
  - 幾何計算
readingTime: 4 分鐘
image: /images/tech/hero_opencv-rotate-contour-points.webp
imageAlt: Geometric diagrams and figures on a white background
---
# OpenCV 如何計算旋轉後的輪廓角點

OpenCV 要計算旋轉後的輪廓角點，可以先取得矩形中心點，再用角度的正弦與餘弦計算每個角點相對中心的旋轉座標。算出四個點後，就能用 \`cv2.polylines()\` 畫出旋轉後的矩形輪廓。

## 旋轉矩形角點的核心公式是什麼？

旋轉矩形角點的核心是把角點改成相對中心座標，再套用二維旋轉矩陣。角度要先從 degree 轉成 radian，才能交給 \`math.sin()\` 與 \`math.cos()\`。

原文範例使用矩形左上角、寬、高與角度，先推出中心點，再計算四個角點。這種寫法適合已知矩形尺寸、要手動產生旋轉框的情境。

\`\`\`python
center_x = base_x + (width // 2)
center_y = base_y + (height // 2)

angle_rad = math.radians(angle)
cos_val = math.cos(angle_rad)
sin_val = math.sin(angle_rad)
\`\`\`

## Python 範例怎麼計算四個角點？

Python 範例會把矩形半寬與半高分別設為 \`x\` 和 \`y\`，再用旋轉矩陣公式推回四個角點。最後轉成整數座標，供 OpenCV 繪圖使用。

\`\`\`python
import cv2
import numpy as np
import math

base_x = 100
base_y = 100
width = 100
height = 50
angle = 45

center_x = base_x + (width // 2)
center_y = base_y + (height // 2)

angle_rad = math.radians(angle)
cos_val = math.cos(angle_rad)
sin_val = math.sin(angle_rad)
x = width / 2
y = height / 2

point1 = (int(center_x - x * cos_val + y * sin_val), int(center_y - x * sin_val - y * cos_val))
point2 = (int(center_x + x * cos_val + y * sin_val), int(center_y + x * sin_val - y * cos_val))
point3 = (int(center_x + x * cos_val - y * sin_val), int(center_y + x * sin_val + y * cos_val))
point4 = (int(center_x - x * cos_val - y * sin_val), int(center_y - x * sin_val + y * cos_val))

print("Point 1:", point1)
print("Point 2:", point2)
print("Point 3:", point3)
print("Point 4:", point4)
\`\`\`

## 如何把旋轉後角點畫成輪廓？

OpenCV 可用 \`cv2.polylines()\` 把四個旋轉後角點畫成封閉多邊形。角點要先轉成 \`np.int32\`，並放進陣列中。

\`\`\`python
image = np.zeros((500, 500, 3), dtype=np.uint8)
pts = np.array([point1, point2, point3, point4], dtype=np.int32)

cv2.polylines(image, [pts], True, (0, 255, 0), thickness=2)

cv2.imshow("Rectangle", image)
cv2.waitKey(0)
cv2.destroyAllWindows()
\`\`\`

原文顯示結果的截圖沒有在 \`markdown-export/uploads\` 找到，所以發布稿只保留可重現的程式碼。讀者執行後會得到一個 45 度旋轉的綠色矩形。

## 常見問題
### 為什麼角度要轉成弧度？

Python 的 \`math.sin()\` 和 \`math.cos()\` 接受弧度，不接受角度。使用 \`math.radians(angle)\` 可把 45 度轉成對應弧度。

### 旋轉角點一定要自己算嗎？

不一定。若已經有 OpenCV 的旋轉矩形資料，也可以用 \`cv2.boxPoints(rect)\` 取得四個角點。

### \`cv2.polylines()\` 的第三個參數是什麼？

第三個參數表示是否封閉線段。設定為 \`True\` 時，OpenCV 會把最後一點連回第一點，形成封閉多邊形。

## 參考資料
- OpenCV Documentation, Drawing Functions: <https://docs.opencv.org/4.x/d6/d6e/group__imgproc__draw.html>
- OpenCV Documentation, Shape Descriptors: <https://docs.opencv.org/4.x/d3/dc0/group__imgproc__shape.html>

## 延伸閱讀

- [OpenCV 如何計算點到多邊形的最短距離](/post/opencv-point-polygon-shortest-distance)：同樣聚焦 OpenCV、Python，可接著比較不同情境的做法。
- [用 OpenCV 旋轉圖片：getRotationMatrix2D 與 warpAffine 範例](/post/opencv-rotate-image)：同樣聚焦 OpenCV、Python，可接著比較不同情境的做法。
- [取得 OpenCV 輪廓中心點：cv2.moments 計算 centroid 範例](/post/opencv-contour-center-point)：同樣聚焦 OpenCV、Python，可接著比較不同情境的做法。

## 最後更新

Fri Jun 09 2023 08:00:00 GMT+0800 (Taiwan Standard Time)

`;export{e as default};