var e=`---
title: 使用 OpenCV 做圖片後製處理（如 Photoshop）的三個實用技巧
description: 不用買 Photoshop，用 OpenCV Python 就能做圖片後製。分享黑強化、白平衡校正、雙邊濾波三個實用影像處理技巧與完整程式碼。
date: 2022-12-16
category: 機器學習
tags: [OpenCV, 影像處理, 後製, Python]
readingTime: 3 分鐘
image: /images/tech/hero_opencv-photo-editing-like-photoshop.webp
imageAlt: 使用 OpenCV 進行影像後製處理的程式碼概念示意圖
---


# 使用 OpenCV 做圖片後製處理（如 Photoshop）的三個實用技巧

不買 Photoshop 也能修圖。我的 OpenCV 系列文「【錢不夠買 PS 的我，只好用 OpenCV 來修圖了!】」（12th 鐵人賽）分享了非常多好用的圖片後製方法，這邊整理幾個我覺得最實用的：黑強化、白平衡校正、雙邊濾波，每個都附上可以直接複製的 Python 程式碼。

## 為什麼用 OpenCV 就能取代 Photoshop 做後製？

OpenCV 是開源的影像處理函式庫，透過 NumPy 陣列操作就能對像素做各種數學運算——強化對比、校正色溫、去除雜訊，這些 Photoshop 裡的曲線、色階、模糊功能，用幾行程式碼就能自動化批次處理，特別適合需要大量重複修圖的情境。

## 黑強化：強化有顏色區域的深度

黑強化（black strengthen）會讓有顏色的區域顏色更深、對比更強。我用 degree 參數控制強化程度，數字越大強化越明顯，常用在 OCR 前處理讓文字與背景對比更清楚：

\`\`\`python
# do pre-process (black strengthen) in OCR
def image_filter(img, degree=3):
    # degree is from 0 to Unlimited, bigger number => bigger strengthen
    decrease_img = (255.0/1)*(img/(255.0/1))**degree
    decrease_img = np.array(decrease_img, dtype=np.uint8)
    return decrease_img
\`\`\`

原理是把每個像素值除以 255 後做指數運算：degree 大於 1 時，亮部幾乎不變、暗部被壓得更暗，整體對比因此被拉開。

## 白平衡：圖像光照校正處理

照片偏黃、偏藍時，可以用「均值白平衡」校正：分別計算 B、G、R 三個通道的平均值，再以三通道平均為基準縮放各通道，讓整體色調回到中性：

\`\`\`python
def mean_white_balance(img):
    b, g, r = cv2.split(img)
    r_avg = cv2.mean(r)[0]
    g_avg = cv2.mean(g)[0]
    b_avg = cv2.mean(b)[0]
    k = (r_avg + g_avg + b_avg) / 3
    kr = k / r_avg
    kg = k / g_avg
    kb = k / b_avg
    r = cv2.addWeighted(src1=r, alpha=kr, src2=0, beta=0, gamma=0)
    g = cv2.addWeighted(src1=g, alpha=kg, src2=0, beta=0, gamma=0)
    b = cv2.addWeighted(src1=b, alpha=kb, src2=0, beta=0, gamma=0)
    balance_img = cv2.merge([b, g, r])
    return balance_img
\`\`\`

這個方法簡單快速，對整張照片色溫偏移的情境效果很好，搭配 \`cv2.addWeighted\` 做通道縮放也順便複習了影像加權的概念。

## 雙邊濾波：保邊去噪

雙邊濾波（Bilateral filter）是一種非線性濾波方法，結合圖像的空間鄰近度與像素值相似度的折衷處理，同時考慮空域資訊和灰度相似性，達到「保邊去噪」的目的。它具有簡單、非迭代、局部的特點——跟一般高斯模糊不同，磨皮去噪的同時不會把輪廓糊掉：

\`\`\`python
image = cv2.bilateralFilter(image, 5, 30, 30)
\`\`\`

四個參數分別是：輸入影像、直徑（d）、顏色空間標準差（sigmaColor）、座標空間標準差（sigmaSpace）。數值越大去噪越強，但也會開始影響細節，建議從小值調起。

## 常見問題

### OpenCV 真的能取代 Photoshop 修圖嗎？

可以處理大部分「規則明確」的後製需求，例如對比強化、白平衡、去噪、裁切縮放、混合疊圖。它的優勢是能用程式自動化批次處理，缺點是缺乏圖形化介面，適合開發者與大量影像的場景。

### 黑強化裡的 degree 參數要怎麼設？

degree 從 0 開始，數字越大暗部壓得越深、對比越強。一般從 2 或 3 開始試，OCR 前處理常用 3 左右就能讓文字明顯變深。

### 雙邊濾波和高斯模糊差在哪裡？

高斯模糊只考慮空間距離，會連邊緣一起糊掉；雙邊濾波同時考慮像素值相似度，亮度差異大的邊緣會被保留，因此能「保邊去噪」，適合磨皮、去雜訊但想保留輪廓的場合。

### 白平衡函數中的 cv2.addWeighted 是做什麼用的？

這裡用 \`cv2.addWeighted\` 對單一通道乘上縮放係數（alpha=kr 等），等同把該通道整體調亮或調暗。雖然只是單通道縮放，但用這個 API 寫起來簡潔，也是影像融合的基礎函數。

## 參考資料

- [12th 鐵人賽系列：錢不夠買 PS 的我，只好用 OpenCV 來修圖了!](https://opencv.org/)

## 延伸閱讀

- [使用 OpenCV 調整圖片亮度：convertScaleAbs 範例](/post/opencv-adjust-image-brightness)：同樣聚焦 OpenCV、Python，可接著比較不同情境的做法。
- [用 OpenCV 旋轉圖片：getRotationMatrix2D 與 warpAffine 範例](/post/opencv-rotate-image)：同樣聚焦 OpenCV、Python，可接著比較不同情境的做法。
- [OpenCV 圖像幾何變換教學：縮放、平移、旋轉、仿射與透視變換](/post/opencv-geometric-transformations)：同樣聚焦 OpenCV、影像處理，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2022-12-16，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};