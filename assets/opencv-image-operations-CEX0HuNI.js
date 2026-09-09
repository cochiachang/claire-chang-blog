var e=`---
title: OpenCV 影像運算：侵蝕、膨脹與形態學操作
description: OpenCV 形態學操作完整筆記： cv2.erode 侵蝕、cv2.dilate 膨脹、MORPH_OPEN 開運算去噪、MORPH_CLOSE 閉運算補洞，以及形態梯度、Top Hat 與 Black Hat 的原理、Python 範例程式碼與效果對照圖一次整理。
date: 2022-12-16
category: 機器學習
tags: [OpenCV, 形態學, 侵蝕, 膨脹, 影像處理]
readingTime: 5 分鐘
image: /images/tech/hero_opencv-image-operations.webp
imageAlt: 螢幕上顯示影像處理程式碼的 iMac
---


# OpenCV 影像運算：侵蝕、膨脹與形態學操作

OpenCV 的形態變換（Morphological Transformations）是基於圖像形狀的簡單操作，通常在二值化圖像上執行。這篇筆記整理侵蝕、膨脹、開運算、閉運算、形態梯度、Top Hat 與 Black Hat 的原理、程式碼與效果對照圖。

## 形態變換的理論基礎是什麼？

形態變換是一些基於圖像形狀的簡單操作。它通常在二進製圖像上執行，需要兩個輸入：一個是原始圖像，第二個稱為結構元素或內核（kernel），它決定了操作的性質。兩個基本的形態學算子是侵蝕和膨脹，然後它們的變體形式如開、閉、梯度等也開始發揮作用。

以下用一張原始二值化圖像來對照各種操作的效果：

![原始二值化字母 j 影像，作為形態學操作範例](/images/articles/opencv-image-operations-1.webp)

## cv2.erode 侵蝕是怎麼運作的？

侵蝕的基本思想就像土壤侵蝕一樣，它侵蝕掉前景物體的邊界（總是盡量讓前景保持白色）。內核在圖像中滑動（如在 2D 卷積中），只有當內核下的所有像素都為 1 時，原始圖像中的像素（1 或 0）才會被認為是 1，否則它會被腐蝕（變為零）。

所以發生的事情是，根據內核的大小，邊界附近的所有像素都將被丟棄，因此前景對象的厚度或大小會減少，或者圖像中的白色區域會減少。它對於去除小的白噪聲、分離兩個連接的對象等很有用。

以下使用 5x5 的內核做一次侵蝕：

\`\`\`python
import cv2
import numpy as np

img = cv2.imread('j.png', 0)
kernel = np.ones((5, 5), np.uint8)
erosion = cv2.erode(img, kernel, iterations=1)
\`\`\`

![j 影像經過 5x5 內核侵蝕後的效果，白色區域明顯變細](/images/articles/opencv-image-operations-2.webp)

## 膨脹 Dilation 跟侵蝕有什麼相反？

它與侵蝕正好相反：如果內核下的至少一個像素為「1」，則像素元素為「1」，因此它增加了圖像中的白色區域或前景對象的大小。

通常，在去除噪聲等情況下，腐蝕之後是膨脹——因為腐蝕去除了白噪聲，但它也縮小了我們的對象，所以要再擴大回來。由於噪音已經消失了，它們不會回來，但對象區域會增加。膨脹也可用於連接對象的損壞部分。

\`\`\`python
dilation = cv2.dilate(img, kernel, iterations=1)
\`\`\`

## 怎麼用開運算（cv2.MORPH_OPEN）去噪？

開運算在去除噪聲方面很有用，透過 \`cv2.morphologyEx()\` 函數執行：

\`\`\`python
opening = cv2.morphologyEx(img, cv2.MORPH_OPEN, kernel)
\`\`\`

![j 影像經過開運算後的效果，周圍白色噪點被去除而主體保持原狀](/images/articles/opencv-image-operations-3.webp)

## 閉運算怎麼把斷掉的線條關起來？

閉運算對關閉前景對象內的小孔或對象上的小黑點很有用。我也有使用它來把 Canny 所找到的邊緣關起來：

\`\`\`python
closing = cv2.morphologyEx(img, cv2.MORPH_CLOSE, kernel)
\`\`\`

![j 影像經過閉運算後的效果，內部小孔與黑色斷點被填補](/images/articles/opencv-image-operations-4.webp)

## 形態梯度可以拿來做什麼？

形態梯度是圖像膨脹和腐蝕之間的差異，結果將看起來像對象的輪廓：

\`\`\`python
gradient = cv2.morphologyEx(img, cv2.MORPH_GRADIENT, kernel)
\`\`\`

![j 影像經過形態梯度後的效果，呈現物體輪廓](/images/articles/opencv-image-operations-5.webp)

## Top Hat 和 Black Hat 各是什麼？

Top Hat 使用 \`cv2.MORPH_TOPHAT\`，得到的是原圖與開運算結果的差：

\`\`\`python
tophat = cv2.morphologyEx(img, cv2.MORPH_TOPHAT, kernel)
\`\`\`

![j 影像經過 Top Hat 後的效果，凸顯出被開運算移除的小亮點](/images/articles/opencv-image-operations-6.webp)

Black Hat 則是閉運算與原圖的差，用來凸顯小黑點：

\`\`\`python
blackhat = cv2.morphologyEx(img, cv2.MORPH_BLACKHAT, kernel)
\`\`\`

![j 影像經過 Black Hat 後的效果，凸顯出被閉運算填補的小黑點](/images/articles/opencv-image-operations-7.webp)

## 常見問題

### 侵蝕和膨脹的差別是什麼？

侵蝕在內核下所有像素都為 1 時才保留，會縮小白色前景並去除白噪聲；膨脹只要內核下有一個像素為 1 就擴張，會放大白色區域、連接斷裂的部分。兩者常常先後搭配使用。

### 開運算和閉運算分別適合什麼場景？

開運算（先侵蝕再膨脹）適合去除白色小噪點；閉運算（先膨脹再侵蝕）適合填補前景內的小孔、小黑點，例如把 Canny 找到的斷開邊緣封閉起來。

### 為什麼形態學操作要在二值化影像上進行？

因為形態變換的定義是針對「前景（白）/背景（黑）」的形狀操作，二值化影像只有 0 和 1 兩種像素值，內核滑動時的判斷規則才會明確有效。

## 參考資料

- [更多形態學操作介紹（Edinburgh HIPR2）](https://homepages.inf.ed.ac.uk/rbf/HIPR2/morops.htm)

## 延伸閱讀

- [使用 OpenCV 找出圖片中的紅色區塊](/post/opencv-detect-red-region)：同樣聚焦 OpenCV、影像處理，可接著比較不同情境的做法。
- [讓 OpenCV 支持 GPU](/post/opencv-gpu-support)：同樣聚焦 OpenCV、影像處理，可接著比較不同情境的做法。
- [OpenCV 圖片降維：彩色轉灰階再轉黑白](/post/opencv-image-threshold-grayscale-binary)：同樣聚焦 OpenCV、影像處理，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2022-12-16，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};