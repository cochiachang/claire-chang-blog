var e=`---
title: OpenCV 圖像融合：使用 cv2.addWeighted 混合兩張圖片
description: 說明 OpenCV cv2.addWeighted 的參數、權重概念、程式範例與兩張圖片尺寸限制。
date: 2022-12-21
category: 機器學習
tags: [OpenCV, 影像處理, 圖像融合, addWeighted]
readingTime: 2 分鐘
image: /images/tech/2022-12-21_124040.webp
imageAlt: OpenCV addWeighted 圖像融合結果截圖
---


# OpenCV 圖像融合：使用 cv2.addWeighted 混合兩張圖片

OpenCV 的 \`cv2.addWeighted()\` 可以用權重混合兩張圖片。當兩張圖片尺寸相同時，開發者可以指定第一張圖片與第二張圖片的比例，產生透明疊加或融合效果。

## cv2.addWeighted 是什麼？

\`cv2.addWeighted()\` 是 OpenCV 用來做加權影像融合的函數。輸出結果會依照兩張圖片的權重與 gamma 偏移值計算。

常見公式可以理解為：

\`\`\`text
result = src1 * alpha + src2 * beta + gamma
\`\`\`

主要參數：

| 參數 | 說明 |
|---|---|
| \`src1\` | 第一個輸入圖像 |
| \`alpha\` | 第一個輸入圖像的權重 |
| \`src2\` | 第二個輸入圖像 |
| \`beta\` | 第二個輸入圖像的權重 |
| \`gamma\` | 加到結果上的亮度偏移 |

若想要兩張圖片各佔 50%，可以設定 \`alpha=0.5\`、\`beta=0.5\`、\`gamma=0\`。

## 如何用 OpenCV 混合兩張圖片？

OpenCV 混合兩張圖片時，要先讀取圖片，再用 \`cv2.addWeighted()\` 指定權重。兩張圖片必須尺寸相同，否則會出現錯誤。

範例：

\`\`\`python
import cv2

# 讀取第一幅圖像
img1 = cv2.imread('image1.jpg')

# 讀取第二幅圖像
img2 = cv2.imread('image2.jpg')

# 將第一幅圖像的 50% 和第二幅圖像的 50% 相加
result = cv2.addWeighted(img1, 0.5, img2, 0.5, 0)

# 顯示結果
cv2.imshow('Result', result)
cv2.waitKey(0)
cv2.destroyAllWindows()
\`\`\`

![OpenCV addWeighted 圖像融合結果](/images/tech/2022-12-21_124040.webp)

本文的實務判斷是：先確認圖片大小與通道數一致，再調整權重。若要做淡入淡出動畫，可以逐步改變 \`alpha\` 與 \`beta\`。

## cv2.addWeighted 常見錯誤怎麼避免？

\`cv2.addWeighted()\` 最常見錯誤是兩張圖片尺寸不同或通道數不同。混合前先 resize 或轉換色彩通道，可以避免多數問題。

常見檢查：

\`\`\`python
print(img1.shape)
print(img2.shape)
\`\`\`

若尺寸不同，可先調整：

\`\`\`python
img2 = cv2.resize(img2, (img1.shape[1], img1.shape[0]))
\`\`\`

若其中一張是灰階圖，另一張是彩色圖，需要先統一通道數。

## 常見問題
### cv2.addWeighted 可以混合不同大小的圖片嗎？

\`cv2.addWeighted()\` 不能直接混合不同大小的圖片。混合前要先用 \`cv2.resize()\` 或裁切方式讓兩張圖片尺寸一致。

### alpha 和 beta 一定要加起來等於 1 嗎？

alpha 和 beta 不一定要加起來等於 1，但加起來等於 1 時最容易得到直覺的透明混合效果。若總和超過 1，結果可能變亮或飽和。

### gamma 參數有什麼用途？

gamma 是加到輸出結果上的亮度偏移。一般圖像融合常設為 0，除非需要整體調亮或調暗。

### addWeighted 可以用來做浮水印嗎？

\`cv2.addWeighted()\` 可以用來做浮水印或透明疊圖。若只想混合局部區域，需要先建立 ROI 或遮罩。

### OpenCV 讀不到圖片怎麼辦？

若 \`cv2.imread()\` 回傳 \`None\`，通常是路徑錯誤、檔案不存在或格式不支援。先檢查檔案路徑與工作目錄。

## 參考資料
- OpenCV Core array operations：[https://docs.opencv.org/4.x/d2/de8/group__core__array.html](https://docs.opencv.org/4.x/d2/de8/group__core__array.html)

## 延伸閱讀

- [OpenCV 圖像金字塔教學：Gaussian Pyramid、Laplacian Pyramid 與影像融合](/post/opencv-image-pyramid)：同樣聚焦 OpenCV、影像處理，可接著比較不同情境的做法。
- [使用 OpenCV 調整圖片亮度：convertScaleAbs 範例](/post/opencv-adjust-image-brightness)：同樣聚焦 OpenCV、影像處理，可接著比較不同情境的做法。
- [使用 OpenCV 做圖片後製處理（如 Photoshop）的三個實用技巧](/post/opencv-photo-editing-like-photoshop)：同樣聚焦 OpenCV、影像處理，可接著比較不同情境的做法。

## 最後更新

Wed Dec 21 2022 08:00:00 GMT+0800 (Taiwan Standard Time)
`;export{e as default};