var e=`---
title: 使用 OpenCV 調整圖片亮度：convertScaleAbs 範例
description: 用 OpenCV cv2.convertScaleAbs 調整圖片亮度，說明 alpha、beta 與像素值範圍處理。
date: 2022-12-21
category: 機器學習
tags: [OpenCV, Python, 影像處理, NumPy]
readingTime: 4 分鐘
image: /images/tech/1_o_G4aq694zbLs4y6gEf1jQ.webp
imageAlt: OpenCV 圖片亮度調整教學技術封面圖
---


# 使用 OpenCV 調整圖片亮度：convertScaleAbs 範例

使用 OpenCV 調整圖片亮度，可以用 \`cv2.convertScaleAbs()\` 將每個像素乘上比例因子，再加上一個常數。若只是要讓圖片整體變亮或變暗，調整 \`beta\` 是最簡單的做法。

## OpenCV 如何調整圖片亮度？

OpenCV 調整亮度常用 \`cv2.convertScaleAbs(image, alpha, beta)\`。\`alpha\` 控制對比比例，\`beta\` 控制整體亮度偏移。

\`cv2.convertScaleAbs()\` 會對影像像素做線性轉換：

\`\`\`text
new_pixel = image_pixel * alpha + beta
\`\`\`

當 \`beta\` 是正數，圖片會變亮；當 \`beta\` 是負數，圖片會變暗。原文範例使用 \`alpha=1\`，代表不改變對比，只移動亮度。

## 為什麼要注意像素範圍？

影像像素值通常需要落在 0 到 255。亮度調整後如果超出範圍，畫面可能出現過曝、截斷或型別轉換造成的非預期結果。

OpenCV 的 \`convertScaleAbs()\` 會進行絕對值與飽和轉換，但在不同寫法中仍應有像素範圍意識。原文提醒可用 NumPy 將超過 255 的值限制在合法範圍：

\`\`\`python
new_image = np.where(new_image > 255, 255, new_image)
\`\`\`

若你同時處理浮點陣列或自訂轉換流程，也可以使用 \`np.clip(new_image, 0, 255)\`。

## Python 範例怎麼寫？

Python 範例的核心是讀取圖片後包成 \`increase_brightness()\` 函式。函式用 \`value\` 控制圖片變亮或變暗。

\`\`\`python
import cv2
import numpy as np

image = cv2.imread("image1.jpg")

def increase_brightness(image, value):
    new_image = cv2.convertScaleAbs(image, alpha=1, beta=value)
    new_image = np.where(new_image > 255, 255, new_image)
    return new_image

bright_image = increase_brightness(image, 50)
dark_image = increase_brightness(image, -50)

cv2.imshow("image", image)
cv2.imshow("bright_image", bright_image)
cv2.imshow("dark_image", dark_image)
cv2.waitKey(0)
cv2.destroyAllWindows()
\`\`\`

\`value=50\` 會讓圖片更亮，\`value=-50\` 會讓圖片更暗。這個函式適合做快速前處理，例如讓過暗的輸入圖比較容易被後續電腦視覺流程辨識。

## 什麼時候應該調 alpha 而不是 beta？

\`beta\` 適合調整整體亮度，\`alpha\` 適合調整對比。若圖片看起來灰灰的，可能需要調整 \`alpha\`，而不只是加亮。

| 需求 | 建議參數 |
|---|---|
| 整張圖片變亮 | 增加 \`beta\` |
| 整張圖片變暗 | 降低 \`beta\` |
| 提高明暗差 | 增加 \`alpha\` |
| 降低明暗差 | 降低 \`alpha\` |

實務上可以先固定 \`alpha=1\`，只調 \`beta\`。如果亮度夠了但畫面仍不清楚，再調整 \`alpha\`。

## 常見問題
### cv2.convertScaleAbs 可以用來調暗圖片嗎？

可以。把 \`beta\` 設為負數就能讓圖片變暗，例如 \`beta=-50\`。

### 調整亮度會改變原始圖片檔案嗎？

不會。\`cv2.convertScaleAbs()\` 會回傳新的影像陣列，不會直接覆蓋原始檔案。除非你另外使用 \`cv2.imwrite()\` 儲存結果。

### alpha 和 beta 有什麼差別？

\`alpha\` 是像素乘上的比例，主要影響對比。\`beta\` 是加到像素上的常數，主要影響亮度。

### OpenCV 讀不到圖片時會怎樣？

\`cv2.imread()\` 讀不到圖片時通常會回傳 \`None\`。正式程式應該先檢查 \`image is None\`，再進行亮度調整。

### np.where 和 np.clip 哪個比較適合限制像素？

若只限制上限，\`np.where\` 可以使用。若要同時限制 0 到 255，\`np.clip(new_image, 0, 255)\` 更直覺。

## 參考資料
- OpenCV, Operations on arrays, https://docs.opencv.org/4.x/d2/de8/group__core__array.html，存取日期：2026-08-27。
- NumPy, clip, https://numpy.org/doc/stable/reference/generated/numpy.clip.html，存取日期：2026-08-27。

## 延伸閱讀

- [用 OpenCV 旋轉圖片：getRotationMatrix2D 與 warpAffine 範例](/post/opencv-rotate-image)：同樣聚焦 OpenCV、Python，可接著比較不同情境的做法。
- [OpenCV 如何繪製穿過兩點中點的垂直線](/post/opencv-draw-perpendicular-line)：同樣聚焦 OpenCV、Python，可接著比較不同情境的做法。
- [OpenCV 圖像幾何變換教學：縮放、平移、旋轉、仿射與透視變換](/post/opencv-geometric-transformations)：同樣聚焦 OpenCV、影像處理，可接著比較不同情境的做法。

## 最後更新

Wed Dec 21 2022 08:00:00 GMT+0800 (Taiwan Standard Time)
`;export{e as default};