var e=`---
title: OpenCV 尋找邊緣：Canny、Sobel 極座標與分水嶺
description: 整理 OpenCV Canny 邊緣檢測、Sobel 梯度、cartToPolar 極座標轉換與 watershed 分割流程。
date: 2022-12-17
category: 機器學習
tags: [OpenCV, Canny, Sobel, 分水嶺]
readingTime: 11 分鐘
image: /images/tech/2022-12-19_153307.webp
imageAlt: OpenCV Canny 邊緣檢測輸出結果
---


# OpenCV 尋找邊緣：Canny、Sobel 極座標與分水嶺

OpenCV 尋找邊緣常用 Canny 邊緣檢測、Sobel 梯度與分水嶺演算法。Canny 適合快速抓邊界，Sobel 與 \`cartToPolar\` 可分析梯度方向，watershed 則適合做標記式影像分割。

## Canny 邊緣檢測是什麼？

Canny 邊緣檢測是一種從圖像中提取結構邊界的方法。Canny 可以減少資料量，同時保留對物體輪廓有用的資訊。

Canny 邊緣檢測的一般標準包括：

- 錯誤率低，盡可能準確捕捉圖像中的邊緣。
- 邊緣點應準確定位在邊緣中心。
- 同一條邊緣應只標記一次，並降低雜訊造成的假邊緣。

簡單範例：

\`\`\`python
import cv2 as cv
from matplotlib import pyplot as plt

img = cv.imread('messi5.jpg', 0)
edges = cv.Canny(img, 100, 200)

plt.subplot(121), plt.imshow(img, cmap='gray')
plt.title('Original Image'), plt.xticks([]), plt.yticks([])
plt.subplot(122), plt.imshow(edges, cmap='gray')
plt.title('Edge Image'), plt.xticks([]), plt.yticks([])
plt.show()
\`\`\`

![OpenCV Canny 邊緣檢測結果](/images/tech/2022-12-19_153307.webp)

## 如何用 Sobel 與 cartToPolar 取得邊緣方向？

Sobel 可以計算水平與垂直梯度，\`cartToPolar\` 可以把梯度轉成 magnitude 與 angle。這適合需要分析邊緣方向的影像任務。

範例：

\`\`\`python
import cv2

gray = cv2.imread('./unknow/img_2022-12-15_18-47-31_1.jpg')
gray = cv2.cvtColor(gray, cv2.COLOR_BGR2GRAY)
gray = gray / 255.0

sobelx = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=1)
sobely = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=1)
magnitude, angle = cv2.cartToPolar(sobelx, sobely, angleInDegrees=True)

cv2.imshow("magnitude", magnitude)
cv2.imshow("angle", angle)
cv2.imshow("gray", gray)
\`\`\`

![OpenCV Sobel 梯度與 cartToPolar 結果](/images/tech/2022-12-19_153546.webp)

原文中特別提醒：使用 \`cv.CV_64F\` 通常能得到較好的梯度結果。若需要 \`CV_8U\`，可以先用 \`CV_64F\` 計算，再取絕對值並轉型。

\`\`\`python
sobelx64f = cv.Sobel(img, cv.CV_64F, 1, 0, ksize=5)
abs_sobel64f = np.absolute(sobelx64f)
sobel_8u = np.uint8(abs_sobel64f)
\`\`\`

## 分水嶺演算法如何做影像分割？

OpenCV watershed 是基於標記的分水嶺演算法。開發者先標記確定前景、確定背景與未知區域，再讓演算法更新物件邊界。

分水嶺流程通常包含：

1. 圖像二值化。
2. 用 morphological opening 去除雜訊。
3. dilate 找確定背景。
4. distance transform 找確定前景。
5. 背景減前景取得未知區域。
6. connected components 產生 markers。
7. \`cv2.watershed()\` 更新邊界。

範例：

\`\`\`python
import cv2
import numpy

img = cv2.imread("image/water_coins.jpg")
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
ret, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)

kernel = numpy.ones((3, 3), dtype=numpy.uint8)
opening = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel, iterations=2)
sure_bg = cv2.dilate(opening, kernel, iterations=3)

dist_transform = cv2.distanceTransform(opening, 1, 5)
ret, sure_fg = cv2.threshold(
    dist_transform, 0.5 * dist_transform.max(), 255, cv2.THRESH_BINARY
)

sure_fg = numpy.uint8(sure_fg)
unknown = cv2.subtract(sure_bg, sure_fg)

ret, markers = cv2.connectedComponents(sure_fg)
markers = markers + 1
markers[unknown == 255] = 0

markers = cv2.watershed(img, markers)
img[markers == -1] = (0, 0, 255)
\`\`\`

![OpenCV watershed 分水嶺分割結果](/images/tech/2022-12-19_181402.webp)

## 如何用顏色遮罩輔助 watershed？

顏色遮罩可以先把白色、紅色、黑色區域標記出來，再交給 watershed 做邊界分割。這種方法適合目標顏色明確的圖片。

原文保留了一段自己的嘗試：先轉 HSV，再用 \`cv.inRange()\` 建立白色、紅色與黑色遮罩，最後合成前景並套用 watershed。

\`\`\`python
import numpy as np
import cv2 as cv

img = cv.imread('./img_2022-12-15_18-47-31_1.jpg')
imageHSV = cv.cvtColor(img, cv.COLOR_BGR2HSV)

lower_white = np.array([0, 0, 220], dtype=np.uint8)
upper_white = np.array([180, 130, 255], dtype=np.uint8)
thresh = cv.inRange(imageHSV, lower_white, upper_white)

kernel = np.ones((3, 3), np.uint8)
opening = cv.morphologyEx(thresh, cv.MORPH_OPEN, kernel, iterations=2)
sure_bg = cv.dilate(opening, kernel, iterations=3)

red_lower = np.array([0, 30, 100], dtype=np.uint8)
red_upper = np.array([30, 255, 240], dtype=np.uint8)
red_lower2 = np.array([135, 30, 100], dtype=np.uint8)
red_upper2 = np.array([180, 255, 240], dtype=np.uint8)
red_mask = cv.bitwise_or(
    cv.inRange(imageHSV, red_lower, red_upper),
    cv.inRange(imageHSV, red_lower2, red_upper2)
)
red_mask = cv.dilate(red_mask, kernel, iterations=3)
sure_fg = cv.bitwise_or(thresh, red_mask)

black_lower = np.array([85, 0, 0], dtype=np.uint8)
black_upper = np.array([180, 40, 100], dtype=np.uint8)
black_lower2 = np.array([0, 0, 0], dtype=np.uint8)
black_upper2 = np.array([35, 40, 100], dtype=np.uint8)
black_mask = cv.bitwise_or(
    cv.inRange(imageHSV, black_lower, black_upper),
    cv.inRange(imageHSV, black_lower2, black_upper2)
)
black_mask = cv.dilate(black_mask, kernel, iterations=3)
sure_fg = cv.bitwise_or(sure_fg, black_mask)
sure_fg = cv.erode(sure_fg, kernel, iterations=3)

unknown = cv.subtract(sure_bg, np.uint8(sure_fg))
ret, markers = cv.connectedComponents(np.uint8(sure_fg))
markers = markers + 1
markers[unknown == 255] = 0

markers = cv.watershed(img, markers)
img[markers == -1] = (0, 0, 255)
\`\`\`

![OpenCV 顏色遮罩輔助 watershed 嘗試結果](/images/tech/2022-12-19_192456.webp)

本文的實務判斷是：如果物件顏色穩定，HSV 遮罩會比純邊緣更容易控制；如果物件顏色不穩定，Canny 與 Sobel 的梯度資訊會比較可靠。

## 常見問題
### Canny 的兩個 threshold 怎麼選？

Canny 的兩個 threshold 控制弱邊緣與強邊緣。可先用 100、200 測試，再依圖片噪聲與邊界強度調整。

### Sobel 和 Canny 有什麼差別？

Sobel 主要計算梯度，能取得方向與強度。Canny 是完整邊緣檢測流程，包含降噪、梯度、非極大值抑制與 hysteresis threshold。

### 為什麼 Sobel 建議先用 CV_64F？

梯度可能有負值，\`CV_8U\` 會截斷資訊。先用 \`CV_64F\` 計算，再取絕對值轉成 \`uint8\`，結果通常較完整。

### watershed 的 marker 是什麼？

marker 是分水嶺演算法用來判斷前景、背景與未知區域的標記圖。marker 設得好，分割結果才會穩定。

### HSV 遮罩適合所有圖片嗎？

HSV 遮罩不適合所有圖片。HSV 遮罩適合顏色範圍穩定的目標，遇到光照變化大或顏色接近背景時需要額外調整。

## 參考資料
- OpenCV Canny Edge Detection：[https://docs.opencv.org/4.x/da/d22/tutorial_py_canny.html](https://docs.opencv.org/4.x/da/d22/tutorial_py_canny.html)
- OpenCV Watershed：[https://docs.opencv.org/4.x/d3/db4/tutorial_py_watershed.html](https://docs.opencv.org/4.x/d3/db4/tutorial_py_watershed.html)
- OpenCV Sobel Derivatives：[https://docs.opencv.org/4.x/d5/d0f/tutorial_py_gradients.html](https://docs.opencv.org/4.x/d5/d0f/tutorial_py_gradients.html)

## 延伸閱讀

- [拆分相黏的正方形：OpenCV distanceTransform 與 watershed 流程](/post/opencv-split-touching-squares)：同樣聚焦 OpenCV、分水嶺，可接著比較不同情境的做法。
- [分水嶺演算法：偵測相連區域形狀](/post/watershed-algorithm-connected-shapes)：同樣聚焦 OpenCV，可接著比較不同情境的做法。
- [如何用 OpenCV 檢測畫面中的正方形：輪廓、分水嶺與霍夫直線](/post/opencv-detect-square-shapes)：同樣聚焦 OpenCV，可接著比較不同情境的做法。

## 最後更新

Sat Dec 17 2022 08:00:00 GMT+0800 (Taiwan Standard Time)
`;export{e as default};