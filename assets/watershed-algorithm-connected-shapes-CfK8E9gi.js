var e=`---
title: 分水嶺演算法：偵測相連區域形狀
description: 用 OpenCV 的距離變換（distanceTransform）加上分水嶺演算法（watershed），分割影像中黏在一起的長方形區域，並用擬合橢圓判斷每個連通元件是否為矩形。完整 Python 範例程式碼與步驟解說。
date: 2023-03-30
category: 機器學習
tags: [OpenCV, 影像分割, 分水嶺演算法, 距離變換, Python]
readingTime: 7 分鐘
image: /images/tech/hero_watershed-algorithm-connected-shapes.webp
imageAlt: 黑色背景上多個彩色區塊拼接而成的抽象影像分割示意圖
---


# 分水嶺演算法：偵測相連區域形狀

當影像裡有一群黏在一起、邊緣相接的形狀（例如疊在一起的長方形），單純的輪廓偵測會把它們誤判成一個大區塊。這篇文章示範我如何用 OpenCV 的距離變換（distanceTransform）產生分水嶺的標記，再用 watershed 演算法把黏在一起的長方形一個個切割開，最後用擬合橢圓判斷每個區域是不是矩形。

## 分水嶺演算法怎麼解決「黏在一起」的問題？

[OpenCV 官方教學 Image Segmentation with Watershed Algorithm](https://docs.opencv.org/4.x/d3/db4/tutorial_py_watershed.html) 用的範例是一群黏在一起的硬幣：

![黏在一起的一群硬幣，是分水嶺演算法的經典範例](/images/articles/watershed-algorithm-connected-shapes-1.webp)

而我這篇文章要處理的目標更明確：**分割出一群黏在一起的長方形**：

![一群黏在一起的長方形，要切割開並偵測形狀](/images/articles/watershed-algorithm-connected-shapes-2.webp)

整體思路是：給定一個二值圖像，先應用距離變換（Distance Transform, DT），再從 DT 的結果中取得分水嶺的標記（markers）。理想情況下會有現成函數可以直接找區域的最小值／最大值，但它不存在，所以我對 DT 的閾值做一個合理的猜測。有了標記之後，套上 Watershed 進行分割，問題就解決了。剩下要擔心的，只是怎麼區分矩形組件和非矩形組件。

## distanceTransform 是什麼？

OpenCV 的 \`distanceTransform\` 是一個圖像處理功能，可以計算圖像中每個像素到最近的零值像素之間的歐幾里德距離。它常被用在圖像分割、形狀檢測、物體識別等應用中。

在 OpenCV 中，\`distanceTransform\` 有三種不同的距離度量實現方式：

| 類型 | 距離度量 | 說明 |
| --- | --- | --- |
| \`cv2.DIST_L1\` | 曼哈頓距離（L1） | 水平與垂直距離的總和，也稱城市區塊距離 |
| \`cv2.DIST_L2\` | 歐幾里德距離（L2） | 兩點之間的直線距離 |
| \`cv2.DIST_C\` | 切比雪夫距離 | 各方向上的最大距離 |

三種距離的公式（p1、p2 為二維坐標點）：

曼哈頓距離：

\`\`\`
d(p1, p2) = |p1.x - p2.x| + |p1.y - p2.y|
\`\`\`

歐幾里德距離：

\`\`\`
d(p1, p2) = sqrt((p1.x - p2.x)^2 + (p1.y - p2.y)^2)
\`\`\`

切比雪夫距離：

\`\`\`
d(p1, p2) = max(|p1.x - p2.x|, |p1.y - p2.y|)
\`\`\`

## 用距離變換產生標記，再跑 watershed

以下是完整的分割程式：先做 Otsu 二值化，接著用 L2 距離（mask 3×3）算 DT，把 DT 正規化後閾值化，再用 \`scipy.ndimage.label\` 找出連通區域當作標記，最後交給 \`cv2.watershed\`：

\`\`\`py
import sys
import cv2
import numpy
import random
from scipy.ndimage import label

def segment_on_dt(img):
    dt = cv2.distanceTransform(img, 2, 3) # L2 norm, 3x3 mask
    dt = ((dt - dt.min()) / (dt.max() - dt.min()) * 255).astype(numpy.uint8)
    dt = cv2.threshold(dt, 100, 255, cv2.THRESH_BINARY)[1]
    lbl, ncc = label(dt)

    lbl[img == 0] = lbl.max() + 1
    lbl = lbl.astype(numpy.int32)
    cv2.watershed(cv2.cvtColor(img, cv2.COLOR_GRAY2BGR), lbl)
    lbl[lbl == -1] = 0
    return lbl


img = cv2.cvtColor(cv2.imread(sys.argv[1]), cv2.COLOR_BGR2GRAY)
img = cv2.threshold(img, 0, 255, cv2.THRESH_OTSU)[1]
img = 255 - img # White: objects; Black: background

ws_result = segment_on_dt(img)
# Colorize
height, width = ws_result.shape
ws_color = numpy.zeros((height, width, 3), dtype=numpy.uint8)
lbl, ncc = label(ws_result)
for l in xrange(1, ncc + 1):
    a, b = numpy.nonzero(lbl == l)
    if img[a[0], b[0]] == 0: # Do not color background.
        continue
    rgb = [random.randint(0, 255) for _ in xrange(3)]
    ws_color[lbl == l] = tuple(rgb)

cv2.imwrite(sys.argv[2], ws_color)
\`\`\`

## 用擬合橢圓判斷哪個區域是矩形

分割完成後，可以在每個組件中擬合橢圓來確定矩形：如果擬合橢圓的面積和組件面積相差在 10% 以內，就認定這個組件是矩形。這種方法對完全可見的矩形效果很好，但對部分被遮住、只露出一部分的矩形可能產生不良結果。下圖是這一步的輸出結果：

![用擬合橢圓與面積比判斷後，框出被判定為矩形的區域](/images/articles/watershed-algorithm-connected-shapes-3.webp)

對應的程式碼如下：把 watershed 上色結果轉回二值圖，對每個連通元件用 \`cv2.fitEllipse\` 擬合橢圓，檢查 \`rect_area / len(xy)\` 是否落在 0.9 到 1.1 之間：

\`\`\`py
# Fit ellipse to determine the rectangles.
wsbin = numpy.zeros((height, width), dtype=numpy.uint8)
wsbin[cv2.cvtColor(ws_color, cv2.COLOR_BGR2GRAY) != 0] = 255

ws_bincolor = cv2.cvtColor(255 - wsbin, cv2.COLOR_GRAY2BGR)
lbl, ncc = label(wsbin)
for l in xrange(1, ncc + 1):
    yx = numpy.dstack(numpy.nonzero(lbl == l)).astype(numpy.int64)
    xy = numpy.roll(numpy.swapaxes(yx, 0, 1), 1, 2)
    if len(xy) < 100: # Too small.
        continue

    ellipse = cv2.fitEllipse(xy)
    center, axes, angle = ellipse
    rect_area = axes[0] * axes[1]
    if 0.9 < rect_area / float(len(xy)) < 1.1:
        rect = numpy.round(numpy.float64(
                cv2.cv.BoxPoints(ellipse))).astype(numpy.int64)
        color = [random.randint(60, 255) for _ in xrange(3)]
        cv2.drawContours(ws_bincolor, [rect], 0, color, 2)

cv2.imwrite(sys.argv[3], ws_bincolor)
\`\`\`

補充一下版本差異：這段程式碼最初是 Python 2 時期寫的，在 Python 3 與 OpenCV 4.x 下要改兩個地方——\`xrange\` 已被移除，直接換成 \`range\`；\`cv2.cv.BoxPoints\` 也已不存在，改用 \`cv2.boxPoints(ellipse)\`（回傳旋轉矩形的四個角點，再 \`numpy.int0\` 或 \`astype(numpy.int64)\` 轉整數）。改完之後整段流程在新版環境可以照跑。

## 常見問題

### 為什麼黏在一起的形狀需要分水嶺演算法？

一般的輪廓偵測會把相接的形狀視為同一個連通元件，無法分開。分水嶺演算法搭配距離變換產生的標記，可以在每個形狀的「核心」之間畫出分界線，把黏在一起的物件一個個切割開。

### distanceTransform 在這個流程中扮演什麼角色？

距離變換會算出每個前景像素到背景的距離，物件的中心距離最大。把 DT 正規化後閾值化，就能得到每個物件的核心區域（peak），這些核心就是 watershed 需要的種子標記。

### 用什麼條件判斷一個區域是矩形？

對每個連通元件用 \`cv2.fitEllipse\` 擬合橢圓，計算橢圓面積與元件實際像素面積的比值。比值落在 0.9 到 1.1 之間就判定為矩形，最後用 \`drawContours\` 把框畫出來。

### 這個方法有什麼限制？

對完全可見的矩形效果很好，但如果矩形只露出一部分（部分遮擋），橢圓擬合的面積比會失真，判定就可能出錯。另外 DT 的閾值（範例中是 100）需要依影像特性調整。

## 參考資料

- [OpenCV 官方教學：Image Segmentation with Watershed Algorithm](https://docs.opencv.org/4.x/d3/db4/tutorial_py_watershed.html)
- [Stack Overflow：Advanced square detection (with connected region)](https://stackoverflow.com/questions/14997733/advanced-square-detection-with-connected-region)

## 延伸閱讀

- [拆分相黏的正方形：OpenCV distanceTransform 與 watershed 流程](/post/opencv-split-touching-squares)：同樣聚焦 OpenCV、影像分割，可接著比較不同情境的做法。
- [OpenCV 如何用 floodFill 做魔術棒填色](/post/opencv-flood-fill-magic-wand)：同樣聚焦 OpenCV、Python，可接著比較不同情境的做法。
- [使用 OpenCV GrabCut 抓取圖片前景](/post/opencv-grabcut-foreground-extraction)：同樣聚焦 OpenCV、Python，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2023-03-30，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};