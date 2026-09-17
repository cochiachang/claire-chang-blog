var e=`---
title: 用兩張圖片偵測畫面是否靜止：OpenCV absdiff、threshold 與輪廓判斷
description: 說明如何用 OpenCV 比較兩張圖片差異，透過 absdiff、灰階、二值化與輪廓面積判斷畫面是否靜止。
date: 2023-01-13
category: 機器學習
tags: [OpenCV, 影像差異, 靜止偵測, Python]
readingTime: 6 分鐘
image: /images/tech/hero_opencv-detect-static-image-two-frames.webp
imageAlt: 用兩張圖片偵測畫面是否靜止：OpenCV absdiff、threshold 與輪廓判斷 hero image
---


# 用兩張圖片偵測畫面是否靜止：OpenCV absdiff、threshold 與輪廓判斷

用兩張圖片偵測畫面是否靜止，可以先計算兩張圖的像素差異，再把差異圖二值化並統計變動區域。若差異面積低於門檻，就可判定畫面接近靜止。

## 兩張圖片如何判斷是否靜止？

兩張圖片靜止判斷的核心是 frame difference。OpenCV 可用 \`cv2.absdiff()\` 計算逐像素差，再用 threshold 找出明顯變動區域。

基本流程：

1. 讀取前後兩張圖片。
2. 調整成相同尺寸。
3. 轉灰階並做 \`absdiff\`。
4. 對差異圖做 threshold。
5. 計算非零像素或輪廓面積。

## OpenCV absdiff 範例怎麼寫？

\`cv2.absdiff()\` 會計算兩張圖片每個像素的絕對差。差異越大，代表兩張圖在該位置變化越明顯。

\`\`\`python
import cv2

prev = cv2.imread('frame_1.jpg')
curr = cv2.imread('frame_2.jpg')
curr = cv2.resize(curr, (prev.shape[1], prev.shape[0]))

prev_gray = cv2.cvtColor(prev, cv2.COLOR_BGR2GRAY)
curr_gray = cv2.cvtColor(curr, cv2.COLOR_BGR2GRAY)

diff = cv2.absdiff(prev_gray, curr_gray)
_, mask = cv2.threshold(diff, 25, 255, cv2.THRESH_BINARY)
changed_pixels = cv2.countNonZero(mask)
\`\`\`

OpenCV 的陣列操作支援逐像素差異計算，\`absdiff\` 適合這類前後畫面比較（OpenCV，存取日期：2026-08-27）。

## 門檻值要怎麼設定？

靜止偵測門檻值要同時考慮像素差異強度與變動面積。光線閃爍、壓縮雜訊與攝影機自動曝光都可能造成小幅差異。

實務資訊增益：不要只用單一像素最大差異判斷。更穩定的方式是使用「變動像素比例」或「輪廓面積總和」。

\`\`\`python
ratio = changed_pixels / mask.size
is_static = ratio < 0.01
\`\`\`

若場景有固定閃爍光源，可以先做 Gaussian blur，降低雜訊對 threshold 的影響。

## 什麼情況不適合只比較兩張圖片？

只比較兩張圖片不適合處理週期性閃爍、慢速移動或攝影機晃動。這些情況需要連續影格、背景建模或光流方法。

兩張圖片法適合簡單監控、截圖比對與低成本狀態偵測。若任務需要穩定判斷「人是否進入畫面」，建議改用背景減除或物體偵測模型。

## 常見問題

### absdiff 可以比較彩色圖片嗎？

\`cv2.absdiff()\` 可以比較彩色圖片，但靜止偵測常先轉灰階。灰階比較可以降低通道差異造成的複雜度。

### threshold 值 25 是固定答案嗎？

threshold 值 25 不是固定答案。不同攝影機、光線與壓縮品質都會影響差異強度，需要用實際樣本調整。

### 兩張圖片大小不同可以比較嗎？

兩張圖片大小不同不能直接逐像素比較。比較前要先 resize 或裁切成相同寬高。

### 光線變化會造成誤判嗎？

光線變化會造成誤判。可以加入 blur、提高面積門檻、使用連續多張圖片，或改用背景減除降低影響。

### 靜止偵測需要深度學習嗎？

簡單靜止偵測不一定需要深度學習。若要判斷特定物件、行為或複雜場景，深度學習模型才更有價值。

## 參考資料

- OpenCV，〈[Geometric Image Transformations](https://docs.opencv.org/4.x/da/d54/group__imgproc__transform.html)〉，存取日期：2026-08-27。

## 延伸閱讀

- [取得 OpenCV 輪廓中心點：cv2.moments 計算 centroid 範例](/post/opencv-contour-center-point)：同樣聚焦 OpenCV、Python，可接著比較不同情境的做法。
- [OpenCV 圖像融合：使用 cv2.addWeighted 混合兩張圖片](/post/opencv-image-blending-addweighted)：同樣聚焦 OpenCV，可接著比較不同情境的做法。
- [使用 OpenCV 調整圖片亮度：convertScaleAbs 範例](/post/opencv-adjust-image-brightness)：同樣聚焦 OpenCV、Python，可接著比較不同情境的做法。

## 最後更新

2026-08-28

`;export{e as default};