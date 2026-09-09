var e=`---
title: 使用 OpenCV 找出圖片中的紅色區塊
description: 用 OpenCV 找出圖片中的紅色區塊：透過 BGR 轉 HSV 色域、inRange 建立紅色遮罩，再用 findContours 輪廓找出目標位置與中心點。附完整 Python 範例程式碼與 HSV 參數調整心得。
date: 2022-12-16
category: 機器學習
tags: [OpenCV, HSV, 影像處理, Python, 遮罩]
readingTime: 4 分鐘
image: /images/tech/hero_opencv-detect-red-region.webp
imageAlt: 亮著紅燈與橙燈的路口交通號誌
---


# 使用 OpenCV 找出圖片中的紅色區塊

想在 OpenCV 裡抓出圖片中的紅色區塊，關鍵是先把圖轉到 HSV 色彩空間，再用 \`cv2.inRange\` 做雙區間遮罩（因為紅色橫跨 H 軸兩端）。這篇筆記整理線上色碼轉換工具的用法、HSV 的基本概念，以及計算紅色區域面積的完整程式碼。

## 怎麼用線上 HSV 色碼轉換器？

挑顏色範圍時，一個好用的線上工具是[色碼轉換器](https://www.peko-step.com/zhtw/tool/hsvrgb.html)，可以直接把 RGB 換算成 HSV：

![線上 HSV/RGB 色碼轉換器介面截圖，顯示 HSV 值為 (26, 90, 223)](/images/articles/opencv-detect-red-region-1.webp)

要注意的是，若要把轉換過的顏色套用到 Python 的色碼，記得：

- 將 S、V 的範圍改為 0–255
- 網站上看到的 H 值（如這邊為 26）要除以 2，也就是 13

以上圖來說，網站顯示的色碼為 HSV:(26, 90, 223)，填進 Python 裡面要使用 HSV:(13, 90, 223)。

## Python 裡面的 HSV 識別空間長怎樣？

一般對顏色空間的圖像進行有效處理都是在 HSV 空間進行的。基本色對應的 HSV 分量範圍為：

| 分量 | 範圍 |
| --- | --- |
| H（色相） | 0 — 180 |
| S（飽和度） | 0 — 255 |
| V（明度） | 0 — 255 |

## 基本的 HSV 顏色是怎麼劃分的？

下面兩張圖整理了常用顏色在 HSV 空間中的大致區間，抓顏色範圍時可以直接對照：

![HSV 基本色顏色劃分對照表截圖](/images/articles/opencv-detect-red-region-2.webp)

![HSV 各色相區間對照表截圖](/images/articles/opencv-detect-red-region-3.webp)

## HSV 和 HSL 到底差在哪？

HSB 又稱 HSV，表示一種顏色模式：在 HSB 模式中，H（hues）表示色相，S（saturation）表示飽和度，B（brightness）表示亮度。HSB 模式對應的媒介是人眼。

HSL 和 HSV 二者都把顏色描述在圓柱體內的點：圓柱的中心軸取值為自底部的黑色到頂部的白色，中間是灰色；繞這個軸的角度對應於「色相」，到這個軸的距離對應於「飽和度」，沿著這個軸的距離對應於「亮度」、「色調」或「明度」。這兩種表示在用途上類似，但在方法上有區別。

![HSV 色彩圓柱模型示意圖](/images/articles/opencv-detect-red-region-4.webp)

![HSL 色彩雙圓錐模型示意圖](/images/articles/opencv-detect-red-region-5.webp)

二者在數學上都是圓柱，但 HSV（色相、飽和度、明度）在概念上可以被認為是顏色的倒圓錐體（黑點在下頂點，白色在上底面圓心）；HSL 在概念上則表示了一個雙圓錐體和圓球體（白色在上頂點，黑色在下頂點，最大橫切面的圓心是半程灰色）。注意儘管在 HSL 和 HSV 中「色相」指稱相同的性質，它們的「飽和度」的定義是明顯不同的。

## 怎麼用程式碼抓取圖片中紅色（膚色）區塊的大小？

紅色在 H 軸上是環繞的（0 附近和 180 附近都有），所以要建立兩個遮罩再用 \`bitwise_or\` 合併：

\`\`\`python
import cv2
import numpy as np

def find_white_color_size(image, upper, lower, upper2=None, lower2=None):
    imageHSV = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    mask = cv2.inRange(imageHSV, lower, upper)
    if lower2 is not None and upper2 is not None:
        mask2 = cv2.inRange(imageHSV, lower2, upper2)
        mask = cv2.bitwise_or(mask, mask2)
    area = 0
    for i in range(len(mask)):
        filter_color = mask[i] > 0
        area += len(mask[i][filter_color])
    return area

lower_red1 = np.array([0, 70, 100], dtype=np.uint8)
upper_red1 = np.array([20, 120, 240], dtype=np.uint8)
lower_red2 = np.array([150, 70, 100], dtype=np.uint8)
upper_red2 = np.array([180, 120, 240], dtype=np.uint8)
print('color size:', find_white_color_size(card_image, upper_red1, lower_red1, upper_red2, lower_red2))
\`\`\`

這段程式碼會回傳遮罩中值大於 0 的像素數量，也就是紅色區塊的總面積。實測上也可以直接改用來抓膚色大小的估算。

## 常見問題

### 為什麼紅色需要兩個 HSV 區間？

因為 OpenCV 的 H 分量範圍是 0–180，紅色正好橫跨環的兩端（接近 0 和接近 180），單一區間會漏掉其中一側，所以要用兩個 lower/upper 分別建立遮罩，再以 \`cv2.bitwise_or\` 合併。

### 為什麼線上工具查到的 H 值要除以 2？

線上轉換器通常用 0–360 表示色相，而 OpenCV 為了塞進 uint8 使用 0–180，換算時就是把 H 除以 2。S、V 則從 0–100% 換成 0–255。

### \`cv2.inRange\` 回傳的是什麼？

回傳一張二值化遮罩：落在指定 HSV 範圍內的像素為 255，其餘為 0。統計遮罩中大於 0 的像素數，就能得到該顏色區塊的面積。

## 參考資料

- [HSV/RGB 線上色碼轉換器](https://www.peko-step.com/zhtw/tool/hsvrgb.html)

## 延伸閱讀

- [用 OpenCV 旋轉圖片：getRotationMatrix2D 與 warpAffine 範例](/post/opencv-rotate-image)：同樣聚焦 OpenCV、Python，可接著比較不同情境的做法。
- [使用 OpenCV 調整圖片亮度：convertScaleAbs 範例](/post/opencv-adjust-image-brightness)：同樣聚焦 OpenCV、Python，可接著比較不同情境的做法。
- [使用 OpenCV 做圖片後製處理（如 Photoshop）的三個實用技巧](/post/opencv-photo-editing-like-photoshop)：同樣聚焦 OpenCV、影像處理，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2022-12-16，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};