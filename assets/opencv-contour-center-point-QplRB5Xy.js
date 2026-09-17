var e=`---
title: 取得 OpenCV 輪廓中心點：cv2.moments 計算 centroid 範例
description: 說明如何用 OpenCV findContours 找輪廓，再用 cv2.moments 的 m10、m01、m00 計算最大輪廓中心點。
date: 2023-04-06T00:00:00.000Z
category: 機器學習
tags:
  - OpenCV
  - 輪廓偵測
  - Python
readingTime: 4 分鐘
image: /images/tech/hero_opencv-contour-center-point.webp
imageAlt: A laptop and a wide monitor displaying lines of code on a desk
---
# 取得 OpenCV 輪廓中心點：cv2.moments 計算 centroid 範例

OpenCV 取得輪廓中心點的常見方法，是先用 \`cv2.findContours()\` 找出輪廓，再用 \`cv2.moments()\` 計算影像矩。中心點座標可由 \`center_x = M["m10"] / M["m00"]\` 與 \`center_y = M["m01"] / M["m00"]\` 得到。

## OpenCV 輪廓中心點怎麼算？

OpenCV 輪廓中心點可用影像矩計算。\`m00\` 代表輪廓面積，\`m10\` 與 \`m01\` 分別包含 x、y 方向的一階矩。

公式如下：

\`\`\`text
center_x = M["m10"] / M["m00"]
center_y = M["m01"] / M["m00"]
\`\`\`

這個中心點也常稱為 centroid。若輪廓面積為 0，\`M["m00"]\` 會是 0，直接相除會出錯，所以正式程式要先檢查分母。

## 完整 Python 範例怎麼寫？

完整流程是讀圖、轉灰階、二值化、找輪廓、取最大輪廓、計算 moments，最後在圖片上畫出中心點。

\`\`\`py
import cv2

img = cv2.imread("image.jpg")
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

ret, thresh = cv2.threshold(gray, 127, 255, 0)

contours, hierarchy = cv2.findContours(
    thresh,
    cv2.RETR_TREE,
    cv2.CHAIN_APPROX_SIMPLE,
)

cv2.drawContours(img, contours, -1, (0, 255, 0), 3)

if len(contours) > 0:
    contour = max(contours, key=cv2.contourArea)
    moments = cv2.moments(contour)

    if moments["m00"] != 0:
        center_x = int(moments["m10"] / moments["m00"])
        center_y = int(moments["m01"] / moments["m00"])
        cv2.circle(img, (center_x, center_y), 5, (255, 0, 0), -1)

cv2.imshow("image", img)
cv2.waitKey(0)
cv2.destroyAllWindows()
\`\`\`

這段程式碼比原始筆記多了一個 \`moments["m00"] != 0\` 判斷，避免空輪廓或面積為零的輪廓造成除以零錯誤。

## 為什麼範例取最大輪廓？

取最大輪廓適合畫面中主要物件只有一個的情境。若畫面有多個物件，應該逐一計算每個輪廓的中心點，而不是只取最大輪廓。

逐一處理輪廓可以這樣寫：

\`\`\`py
for contour in contours:
    moments = cv2.moments(contour)
    if moments["m00"] == 0:
        continue

    center_x = int(moments["m10"] / moments["m00"])
    center_y = int(moments["m01"] / moments["m00"])
    cv2.circle(img, (center_x, center_y), 5, (255, 0, 0), -1)
\`\`\`

在物件追蹤、零件定位或卡片排序任務中，多輪廓中心點通常比單一最大輪廓更有用。

## threshold 對中心點有什麼影響？

threshold 會決定哪些像素被視為前景，也會影響輪廓形狀與中心點位置。閾值不合理時，中心點會偏移或找不到正確輪廓。

原文使用固定閾值 \`127\`，適合亮度穩定的簡單圖片。若拍攝環境光線變化大，可以改用 Otsu threshold 或 adaptive threshold。

\`\`\`py
ret, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)
\`\`\`

中心點計算本身很短，但前處理品質決定了中心點是否可信。

## 常見問題
### \`cv2.moments()\` 的 \`m00\` 是什麼？

\`m00\` 可視為輪廓面積或零階矩。計算中心點時，\`m10\` 和 \`m01\` 都要除以 \`m00\`。

### 為什麼要檢查 \`m00 != 0\`？

\`m00\` 為 0 時代表輪廓面積為零或無法計算有效面積。若直接相除，Python 會發生除以零錯誤。

### OpenCV 中心點座標是 x, y 還是 row, column？

OpenCV 畫圖函數通常使用 \`(x, y)\` 座標，也就是 \`(column, row)\`。NumPy 陣列索引則是 \`[row, column]\`，兩者不要混用。

### 多個輪廓都要中心點怎麼辦？

多個輪廓都要中心點時，應用 for loop 逐一計算 moments。可以加上面積門檻，排除太小的雜訊輪廓。

## 參考資料
- OpenCV 文件，Image Moments，https://docs.opencv.org/4.x/dd/d49/tutorial_py_contour_features.html，存取日期：2026-08-27。
- OpenCV 文件，Contours，https://docs.opencv.org/4.x/d4/d73/tutorial_py_contours_begin.html，存取日期：2026-08-27。

## 延伸閱讀

- [OpenCV 輪廓形狀擬合有哪些常用方法](/post/opencv-shape-fitting-methods)：同樣聚焦 OpenCV、Python，可接著比較不同情境的做法。
- [OpenCV 如何計算旋轉後的輪廓角點](/post/opencv-rotate-contour-points)：同樣聚焦 OpenCV、Python，可接著比較不同情境的做法。
- [用兩張圖片偵測畫面是否靜止：OpenCV absdiff、threshold 與輪廓判斷](/post/opencv-detect-static-image-two-frames)：同樣聚焦 OpenCV、Python，可接著比較不同情境的做法。
`;export{e as default};