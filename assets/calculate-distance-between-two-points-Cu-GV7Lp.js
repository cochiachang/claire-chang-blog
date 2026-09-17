var e=`---
title: 計算兩個點之間的直線距離
description: 想知道兩個座標點之間的直線距離怎麼算？我用 Python 內建的 math.hypot 與 NumPy 的 np.sqrt 兩種方法，示範如何用歐幾里得距離公式計算二維平面上兩點的直線距離，附完整程式碼範例與常見問題整理。
date: 2023-06-09
category: 機器學習
tags: [Python, NumPy, 歐幾里得距離, 數學, 座標計算]
readingTime: 3 分鐘
image: /images/tech/hero_calculate-distance-between-two-points.webp
imageAlt: 紙上印著的線性聯立方程式特寫
---


# 計算兩個點之間的直線距離

在影像處理或機器學習的應用裡，經常需要知道兩個座標點之間的直線距離（歐幾里得距離）。這篇筆記整理我在 Python 中最常用的兩種寫法：標準庫的 \`math.hypot\`，以及 NumPy 的 \`np.sqrt\`，兩者都能一行算出結果。

## 如何用 math.hypot 計算兩點的直線距離？

\`math.hypot\` 是 Python 內建數學模組 \`math\` 中的函數。它接受兩個參數，分別代表兩點的 x 和 y 座標差值，然後直接返回它們的歐幾里得距離（即直線距離），不需要自己寫平方根公式：

\`\`\`python
import math

x1, y1 = 1, 2
x2, y2 = 3, 4

distance = math.hypot(x2 - x1, y2 - y1)
print(distance)
\`\`\`

執行結果為 \`2.8284271247461903\`，也就是 √8。這種寫法最簡潔，也是我處理單一兩點距離時的首選。

## 如何用 np.sqrt 計算兩點的直線距離？

\`np.sqrt\` 是 NumPy 庫中的函數，用於計算給定數值的平方根。要使用 \`np.sqrt\` 計算兩點之間的距離，需要先計算兩點在 x 和 y 座標軸上的差值的平方和，再對結果開平方根：

\`\`\`python
import numpy as np

x1, y1 = 1, 2
x2, y2 = 3, 4

distance = np.sqrt((x2 - x1)**2 + (y2 - y1)**2)
print(distance)
\`\`\`

這種寫法就是直接實作歐幾里得距離公式 √((x₂−x₁)² + (y₂−y₁)²)。它的優勢在於可以輕鬆推廣到向量或整批點位的計算——例如點陣列之間的距離，搭配 \`np.linalg.norm\` 或廣播運算一起用會非常方便。

## math.hypot 與 np.sqrt 該怎麼選？

| 方法 | 適用情境 | 特點 |
| --- | --- | --- |
| \`math.hypot\` | 單一兩點距離、純 Python 環境 | 語法最短，不需額外依賴，內部處理溢位較穩 |
| \`np.sqrt\` + 平方和 | 陣列、多點批次運算、已在用 NumPy | 公式直觀，容易推廣到高維與向量化計算 |

如果只是算兩個點的距離，我用 \`math.hypot\` 就夠了；若資料已經是 NumPy 陣列，或要一次算大量點對，就用 NumPy 的寫法。

## 常見問題

### 什麼是歐幾里得距離？

歐幾里得距離就是兩點在空間中的直線距離，等於兩點座標差的平方和再開平方根，也就是我們熟悉的畢氏定理應用。在二維平面上公式為 √((x₂−x₁)² + (y₂−y₁)²)。

### math.hypot 和自己寫平方根有什麼差別？

\`math.hypot\` 內部直接實作斜邊計算，語法更簡潔，且在極大或極小數值下比手寫 \`sqrt(dx**2 + dy**2)\` 更不容易發生溢位問題。一般情況下兩者結果相同，但建議優先使用 \`math.hypot\`。

### np.sqrt 可以計算三維或更高維度的距離嗎？

可以。NumPy 的寫法本質上就是歐幾里得距離公式，只要把各個維度的座標差平方累加後再開根號即可。更常見的做法是直接使用 \`np.linalg.norm(p2 - p1)\`，一行就能算出任意維度的向量長度。

### 這兩種方法可以用在機器學習的距離計算嗎？

可以。KNN、K-means 等演算法的核心就是計算樣本之間的歐幾里得距離。實務上會用 NumPy 的向量化寫法一次算出大量樣本與目標點之間的距離，效率遠高於 Python 迴圈逐一計算。

## 參考資料

- [math.hypot — Python 官方文件](https://docs.python.org/zh-tw/3/library/math.html#math.hypot)
- [numpy.sqrt — NumPy 官方文件](https://numpy.org/doc/stable/reference/generated/numpy.sqrt.html)

## 延伸閱讀

- [使用 OpenCV 調整圖片亮度：convertScaleAbs 範例](/post/opencv-adjust-image-brightness)：同樣聚焦 Python、NumPy，可接著比較不同情境的做法。
- [OpenCV 如何繪製穿過兩點中點的垂直線](/post/opencv-draw-perpendicular-line)：同樣聚焦 Python，可接著比較不同情境的做法。
- [OpenCV 如何計算點到多邊形的最短距離](/post/opencv-point-polygon-shortest-distance)：同樣聚焦 Python，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2023-06-09，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};