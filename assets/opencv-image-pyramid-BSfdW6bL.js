var e=`---
title: OpenCV 圖像金字塔教學：Gaussian Pyramid、Laplacian Pyramid 與影像融合
description: 說明 OpenCV 圖像金字塔的 pyrDown、pyrUp、Laplacian Pyramid 與多尺度影像融合用途。
date: 2022-12-19
category: 機器學習
tags: [OpenCV, 影像處理, 圖像金字塔, Python]
readingTime: 6 分鐘
image: /images/tech/hero_opencv-image-pyramid.webp
imageAlt: OpenCV 圖像金字塔教學：Gaussian Pyramid、Laplacian Pyramid 與影像融合 hero image
---


# OpenCV 圖像金字塔教學：Gaussian Pyramid、Laplacian Pyramid 與影像融合

OpenCV 圖像金字塔是多尺度影像處理方法，可以把同一張圖片轉成不同解析度版本。Gaussian Pyramid 用於降採樣與平滑，Laplacian Pyramid 則保留相鄰尺度之間的細節差異，常用於影像融合與重建。

## 圖像金字塔是什麼？

圖像金字塔是一組由高解析度到低解析度排列的影像。金字塔越往上，影像越小，細節越少，但保留較粗略的結構資訊。

OpenCV 的 \`pyrDown()\` 會先平滑再降採樣，\`pyrUp()\` 會把影像放大到更高解析度。OpenCV 官方教學把圖像金字塔分成 Gaussian Pyramid 與 Laplacian Pyramid，兩者用途不同（OpenCV，存取日期：2026-08-27）。

| 金字塔類型 | 主要用途 | OpenCV 操作 |
|---|---|---|
| Gaussian Pyramid | 建立低解析度版本 | \`cv.pyrDown()\`、\`cv.pyrUp()\` |
| Laplacian Pyramid | 儲存尺度差異與邊緣細節 | 原圖減去上採樣後的圖 |

## 如何用 pyrDown 建立 Gaussian Pyramid？

Gaussian Pyramid 適合用來做多尺度分析。每執行一次 \`pyrDown()\`，影像寬高大約變成原本的一半。

\`\`\`python
import cv2 as cv

img = cv.imread('messi.jpg')
lower = cv.pyrDown(img)
lower2 = cv.pyrDown(lower)
\`\`\`

降採樣不是單純刪掉像素。OpenCV 會先做 Gaussian 平滑，再取樣成較小尺寸，這能降低混疊。若模型或演算法需要同時觀察大輪廓與小細節，Gaussian Pyramid 是常見前處理。

## Laplacian Pyramid 為什麼能保留細節？

Laplacian Pyramid 儲存的是相鄰尺度之間的差值。差值影像通常包含邊緣、紋理與細節，因此適合做影像重建與融合。

典型流程如下：

\`\`\`python
gaussian = cv.pyrDown(img)
expanded = cv.pyrUp(gaussian)
laplacian = cv.subtract(img, expanded)
\`\`\`

實務上要確認 \`expanded\` 與原圖尺寸一致。若影像寬高不是 2 的倍數，上採樣後可能差 1 個像素，需要先裁切或 resize 才能相減。

## 圖像金字塔如何用在影像融合？

圖像金字塔融合會在不同尺度混合影像。低解析度層處理大範圍亮度與色彩，高解析度層處理邊緣細節，因此接縫通常比直接拼接自然。

原始筆記提到的 Orapple 範例，就是把橘子與蘋果透過金字塔分層混合。實務資訊增益是：若兩張圖只用直線遮罩混合，接縫容易明顯；若用 Laplacian Pyramid 分層混合，接縫會被分散到多個尺度。

基本檢查：

- 兩張輸入圖片尺寸要一致。
- 金字塔層數不要過多，避免高層影像太小而失去語意。
- 每一層融合後要能逐層重建回原始尺寸。

## 常見問題

### pyrDown 和 resize 有什麼不同？

\`pyrDown()\` 會先做 Gaussian 平滑再降採樣，目標是建立多尺度影像。\`resize()\` 是一般尺寸調整工具，是否平滑取決於 interpolation 設定。

### Laplacian Pyramid 可以還原原圖嗎？

Laplian Pyramid 在保存每一層差值與最小 Gaussian 層時，可以逐層重建近似原圖。實作時要特別注意每層尺寸一致。

### 圖像金字塔適合物體偵測嗎？

圖像金字塔可以協助傳統電腦視覺方法在不同尺度找物件。現代深度學習模型常在網路內部使用特徵金字塔概念處理多尺度目標。

### pyrUp 會讓圖片變清楚嗎？

\`pyrUp()\` 會放大圖片，但不會創造原本不存在的細節。放大後的影像通常比原始高解析度影像模糊。

### 圖像融合一定要用金字塔嗎？

簡單透明疊加不一定需要圖像金字塔。若兩張圖有明顯接縫、亮度差或尺度差，金字塔融合通常更自然。

## 參考資料

- OpenCV，〈[Image Pyramids](https://docs.opencv.org/4.x/dc/dff/tutorial_py_pyramids.html)〉，存取日期：2026-08-27。

## 延伸閱讀

- [OpenCV 圖像融合：使用 cv2.addWeighted 混合兩張圖片](/post/opencv-image-blending-addweighted)：同樣聚焦 OpenCV、影像處理，可接著比較不同情境的做法。
- [OpenCV 如何繪製穿過兩點中點的垂直線](/post/opencv-draw-perpendicular-line)：同樣聚焦 OpenCV、Python，可接著比較不同情境的做法。
- [使用 OpenCV 調整圖片亮度：convertScaleAbs 範例](/post/opencv-adjust-image-brightness)：同樣聚焦 OpenCV、Python，可接著比較不同情境的做法。

## 最後更新

2026-08-28

`;export{e as default};