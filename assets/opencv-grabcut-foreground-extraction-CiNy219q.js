var e=`---
title: 使用 OpenCV GrabCut 抓取圖片前景
description: 介紹 GrabCut 前景提取原理、cv.grabCut 參數與 Python 範例，示範用矩形與 mask 修正分割結果。
date: 2022-12-23
category: 機器學習
tags: [OpenCV, GrabCut, Python, 影像分割]
readingTime: 6 分鐘
image: /images/tech/hero_opencv-grabcut-foreground-extraction.webp
imageAlt: 白色背景上的鞋子主體輪廓清楚，象徵 OpenCV GrabCut 前景提取與背景分割
---


# 使用 OpenCV GrabCut 抓取圖片前景

GrabCut 是 OpenCV 常用的互動式前景提取方法。使用者先用矩形框住主要物件，演算法再透過迭代圖切割分離前景與背景；如果結果不準，也可以用 mask 標記前景與背景後重新修正。

## GrabCut 是什麼？

GrabCut 是一種互動式影像分割演算法。GrabCut 由 Carsten Rother、Vladimir Kolmogorov 與 Andrew Blake 提出，用較少人工操作完成前景提取。

從使用者角度來看，GrabCut 的操作很直覺：先在前景物件周圍畫一個矩形，讓前景完整落在矩形內。演算法會根據矩形推估哪些像素屬於前景、哪些像素屬於背景。

如果第一次分割效果不好，例如前景被切到背景，或背景被誤認為前景，使用者可以再畫筆觸修正。白色筆觸可表示確定前景，黑色筆觸可表示確定背景。

## cv.grabCut 需要哪些參數？

\`cv.grabCut()\` 需要輸入圖像、mask、矩形、背景模型、前景模型、迭代次數與初始化模式。這些參數決定演算法從矩形或 mask 開始分割。

常用參數如下：

| 參數 | 說明 |
|---|---|
| \`img\` | 輸入圖像。 |
| \`mask\` | 指定背景、前景、可能背景、可能前景的遮罩。 |
| \`rect\` | 包含前景物件的矩形座標，格式為 \`(x, y, w, h)\`。 |
| \`bgdModel\` | 演算法內部使用的背景模型陣列。 |
| \`fgdModel\` | 演算法內部使用的前景模型陣列。 |
| \`iterCount\` | 演算法迭代次數。 |
| \`mode\` | 使用 \`cv.GC_INIT_WITH_RECT\` 或 \`cv.GC_INIT_WITH_MASK\` 初始化。 |

mask 常見值包含 \`cv.GC_BGD\`、\`cv.GC_FGD\`、\`cv.GC_PR_BGD\`、\`cv.GC_PR_FGD\`，也可以用 0、1、2、3 表示。

## 如何用矩形初始化 GrabCut？

用矩形初始化 GrabCut 時，前景物件必須完整位於矩形內。矩形外通常會被視為背景，矩形內再由演算法推估前景與可能前景。

\`\`\`python
import numpy as np
import cv2 as cv
from matplotlib import pyplot as plt

img = cv.imread("image.jpg")
mask = np.zeros(img.shape[:2], np.uint8)

bgdModel = np.zeros((1, 65), np.float64)
fgdModel = np.zeros((1, 65), np.float64)

rect = (50, 50, 450, 290)
cv.grabCut(img, mask, rect, bgdModel, fgdModel, 5, cv.GC_INIT_WITH_RECT)

mask2 = np.where((mask == 2) | (mask == 0), 0, 1).astype("uint8")
img = img * mask2[:, :, np.newaxis]

plt.imshow(img)
plt.colorbar()
plt.show()
\`\`\`

這段程式會把確定背景與可能背景設為 0，把前景保留下來。\`mask2[:, :, np.newaxis]\` 讓二維 mask 可以套到彩色圖片的三個通道。

## 如何用手動 mask 修正 GrabCut 結果？

用手動 mask 修正 GrabCut 時，白色區域可標記為前景，黑色區域可標記為背景。修正後再用 \`cv.GC_INIT_WITH_MASK\` 重新迭代。

\`\`\`python
newmask = cv.imread("newmask.png", 0)

mask[newmask == 0] = 0
mask[newmask == 255] = 1

mask, bgdModel, fgdModel = cv.grabCut(
    img,
    mask,
    None,
    bgdModel,
    fgdModel,
    5,
    cv.GC_INIT_WITH_MASK,
)

mask = np.where((mask == 2) | (mask == 0), 0, 1).astype("uint8")
img = img * mask[:, :, np.newaxis]

cv.imshow("img", img)
plt.imshow(img)
plt.colorbar()
plt.show()
\`\`\`

這種做法適合第一次矩形分割不夠準的圖片。人工只需要補少量筆觸，不必逐像素切割整張圖。

## GrabCut 適合哪些影像處理任務？

GrabCut 適合前景與背景差異明顯、且主要物件可以被矩形框住的影像。商品去背、人物前景提取與資料標註前處理都可使用。

GrabCut 不一定適合背景非常複雜、前景邊緣透明、毛髮細節很多的圖片。這些情境可能需要深度學習分割模型，或搭配更多人工標註。

原文的實作心得是：先用矩形快速得到初始結果，再針對錯誤位置補 mask，是比手動去背更省力的流程。

## 常見問題
### GrabCut 需要先訓練模型嗎？

OpenCV GrabCut 不需要先訓練深度學習模型。GrabCut 會根據輸入圖片、矩形與 mask 在當下影像上迭代分割。

### GrabCut 的 rect 怎麼設定？

\`rect\` 格式是 \`(x, y, w, h)\`。矩形應該完整包住前景物件，並盡量不要包含太多無關背景。

### GrabCut 的 mask 值 0、1、2、3 代表什麼？

0 代表確定背景，1 代表確定前景，2 代表可能背景，3 代表可能前景。OpenCV 也提供對應常數名稱。

### GrabCut 分割不準怎麼辦？

可以用手動 mask 標記確定前景與確定背景，再用 \`cv.GC_INIT_WITH_MASK\` 重新執行。這通常能修正局部錯誤。

### GrabCut 可以處理影片嗎？

GrabCut 可以逐幀處理影片，但逐幀使用會比較慢，也可能產生閃爍。影片前景分割通常需要額外的追蹤或時序穩定處理。

## 參考資料
- OpenCV, Interactive Foreground Extraction using GrabCut Algorithm, https://docs.opencv.org/4.x/d8/d83/tutorial_py_grabcut.html，存取日期：2026-08-27。
- Microsoft Research, GrabCut, https://www.microsoft.com/en-us/research/publication/grabcut-interactive-foreground-extraction-using-iterated-graph-cuts/，存取日期：2026-08-27。

## 延伸閱讀

- [OpenCV 如何用 floodFill 做魔術棒填色](/post/opencv-flood-fill-magic-wand)：同樣聚焦 OpenCV、Python，可接著比較不同情境的做法。
- [分水嶺演算法：偵測相連區域形狀](/post/watershed-algorithm-connected-shapes)：同樣聚焦 OpenCV、影像分割，可接著比較不同情境的做法。
- [如何分割黏在一起的撲克牌：OpenCV distanceTransform 與 watershed 範例](/post/opencv-segment-touching-playing-cards)：同樣聚焦 OpenCV、影像分割，可接著比較不同情境的做法。

## 最後更新

Fri Dec 23 2022 08:00:00 GMT+0800 (Taiwan Standard Time)
`;export{e as default};