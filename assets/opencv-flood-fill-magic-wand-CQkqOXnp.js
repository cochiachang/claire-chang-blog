var e=`---
title: OpenCV 如何用 floodFill 做魔術棒填色
description: 介紹 OpenCV cv2.floodFill 的用途、參數、mask 規則與基本範例，用於影像分割、去噪與區域填色。
date: 2023-05-08T00:00:00.000Z
category: 機器學習
tags:
  - OpenCV
  - Python
  - 影像分割
readingTime: 5 分鐘
image: /images/tech/hero_opencv-flood-fill-magic-wand.webp
imageAlt: black lenovo laptop computer turned on displaying man in red shirt
---
# OpenCV 如何用 floodFill 做魔術棒填色

OpenCV 的 \`cv2.floodFill()\` 可以從指定種子點開始，把相連且符合條件的像素填成新顏色。這個函數很像影像編輯工具裡的魔術棒，常用在影像分割、背景處理、二值圖去噪與區域標記。

## \`cv2.floodFill()\` 是什麼？

\`cv2.floodFill()\` 是 OpenCV 的泛洪填充函數。泛洪填充會從種子點往外擴張，把相鄰且落在容許差異範圍內的像素改成指定顏色。

常見用途包括圖像分割、圖像去噪、圖像修復與圖像標記。若種子點選在背景，\`cv2.floodFill()\` 可以快速把同一片背景標出來；若種子點選在物件內部，也可以用來取得物件區域。

## \`cv2.floodFill()\` 參數怎麼看？

\`cv2.floodFill()\` 的重點參數是 image、mask、seedPoint、newVal、loDiff、upDiff 與 flags。mask 必須比原圖上下左右各多 1 像素，也就是寬高各多 2。

\`\`\`python
cv2.floodFill(
    image,
    mask,
    seedPoint,
    newVal,
    rect=None,
    loDiff=None,
    upDiff=None,
    flags=None,
)
\`\`\`

| 參數 | 說明 |
|---|---|
| \`image\` | 要填充的影像，可為 8 位單通道或三通道影像 |
| \`mask\` | 控制可填充區域的遮罩，尺寸需比 \`image\` 多 2 個像素 |
| \`seedPoint\` | 起始種子點，格式是 \`(x, y)\` |
| \`newVal\` | 填入的新顏色，例如 BGR \`(0, 0, 255)\` |
| \`rect\` | 回傳填充區域的最小矩形 |
| \`loDiff\` | 當前像素與參考像素允許的低差值 |
| \`upDiff\` | 當前像素與參考像素允許的高差值 |
| \`flags\` | 填充模式與連通性設定 |

## floodFill 的 flags 要注意什麼？

\`cv2.floodFill()\` 的 flags 會影響比較方式與是否只改 mask。常用的是 4 或 8 連通、\`cv2.FLOODFILL_FIXED_RANGE\`、\`cv2.FLOODFILL_MASK_ONLY\`。

原文列出幾個常見旗標：\`cv2.FLOODFILL_FIXED_RANGE\` 會用種子點作固定範圍比較；\`cv2.FLOODFILL_MASK_ONLY\` 只修改 mask，不改原圖。實作時我會先從基本填色跑起，再逐步加入 tolerance 與 mask-only 模式，這樣比較容易確認是哪個參數造成結果變化。

## OpenCV 魔術棒填色範例怎麼寫？

OpenCV 魔術棒填色的基本範例需要讀圖、選種子點、建立 mask，再呼叫 \`cv2.floodFill()\`。mask 的 shape 要用灰階影像高寬各加 2。

\`\`\`python
import cv2
import numpy as np

img = cv2.imread("image.jpg")
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

seed_point = (100, 100)
fill_color = (0, 0, 255)
fill_mask = np.zeros((gray.shape[0] + 2, gray.shape[1] + 2), dtype=np.uint8)

cv2.floodFill(img, fill_mask, seed_point, fill_color)

cv2.imshow("image", img)
cv2.waitKey(0)
cv2.destroyAllWindows()
\`\`\`

若結果填太多，通常是容許差異太大或種子點選錯區域。若結果填太少，則可能需要調整 \`loDiff\`、\`upDiff\`，或先做平滑、二值化降低雜訊。

## 常見問題
### \`cv2.floodFill()\` 的 mask 為什麼要多 2 像素？

OpenCV floodFill 的 mask 需要保留影像外圍邊界，因此尺寸必須是 \`(height + 2, width + 2)\`。如果 mask 尺寸不對，函數會直接報錯。

### \`seedPoint\` 是 \`(x, y)\` 還是 \`(row, col)\`？

\`seedPoint\` 使用 OpenCV 繪圖座標 \`(x, y)\`。這和 NumPy 用 \`image[row, col]\` 存取像素的順序不同。

### floodFill 可以只取得區域不改原圖嗎？

可以，使用 \`cv2.FLOODFILL_MASK_ONLY\` 可以只改 mask。這在你只想取得分割區域、不想改掉原始影像時很有用。

### 魔術棒填色適合所有影像分割嗎？

不適合。\`cv2.floodFill()\` 很依賴種子點與顏色差異，若背景和物件顏色接近，可能需要先做前處理或改用輪廓、語意分割模型。

## 參考資料
- OpenCV Documentation, Miscellaneous Image Transformations: <https://docs.opencv.org/4.x/d7/d1b/group__imgproc__misc.html>

## 延伸閱讀

- [使用 OpenCV GrabCut 抓取圖片前景](/post/opencv-grabcut-foreground-extraction)：同樣聚焦 OpenCV、Python，可接著比較不同情境的做法。
- [分水嶺演算法：偵測相連區域形狀](/post/watershed-algorithm-connected-shapes)：同樣聚焦 OpenCV、影像分割，可接著比較不同情境的做法。
- [影像分割模型介紹：U-Net 與去背改良版 U2-Net](/post/image-segmentation-models)：同樣聚焦 影像分割，可接著比較不同情境的做法。

## 最後更新

Mon May 08 2023 08:00:00 GMT+0800 (Taiwan Standard Time)

`;export{e as default};