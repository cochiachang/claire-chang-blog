var e=`---
title: 如何用 OpenCV 檢測畫面中的正方形：輪廓、分水嶺與霍夫直線
description: 整理 OpenCV 偵測正方形的三種思路：findContours 找輪廓、分水嶺處理相黏物件，以及 HoughLinesP 偵測直線。
date: 2023-03-31
category: 機器學習
tags: [OpenCV, 影像辨識, 電腦視覺]
readingTime: 8 分鐘
image: /images/tech/opencv-square-watershed-result.webp
imageAlt: OpenCV 分水嶺演算法分割正方形結果圖
---


# 如何用 OpenCV 檢測畫面中的正方形：輪廓、分水嶺與霍夫直線

OpenCV 檢測正方形可以先從輪廓開始：用 \`findContours()\` 找出邊界，再用 \`approxPolyDP()\` 近似成多邊形，篩選 4 個頂點、凸多邊形、邊長接近且角度接近 90 度的候選物。若邊界相黏或不清楚，再考慮分水嶺或霍夫直線。

## 最簡單的正方形檢測方法是什麼？

最簡單的 OpenCV 正方形檢測方法，是 Canny 邊緣偵測加上 \`findContours()\`。取得輪廓後，用 \`approxPolyDP()\` 找 4 邊形候選物。

\`\`\`py
import cv2

img = cv2.imread("square.jpg")
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
edges = cv2.Canny(gray, 50, 150)

contours, hierarchy = cv2.findContours(
    edges,
    cv2.RETR_EXTERNAL,
    cv2.CHAIN_APPROX_SIMPLE,
)

for contour in contours:
    approx = cv2.approxPolyDP(contour, 0.01 * cv2.arcLength(contour, True), True)
    if len(approx) == 4 and cv2.isContourConvex(approx):
        print("possible square:", approx)
\`\`\`

原始筆記的程式碼在 \`cv2.isContourConvex(app\` 處被截斷，這裡補成可讀版本。正式判斷正方形時，還應加入面積、邊長比例與角度條件，避免把任意四邊形都當成正方形。

## 正方形候選物應該怎麼篩選？

正方形候選物不能只看 4 個頂點。更穩的做法是同時檢查凸性、面積、四邊長差異、寬高比例與角度，降低誤判。

建議篩選條件：

| 條件 | 用途 |
| --- | --- |
| \`len(approx) == 4\` | 確認近似後是四邊形 |
| \`cv2.isContourConvex(approx)\` | 排除凹形輪廓 |
| 面積大於門檻 | 排除雜訊 |
| 四邊長接近 | 排除長方形或不規則四邊形 |
| 角度接近 90 度 | 排除菱形以外的歪斜誤判 |

如果正方形可能旋轉，不能只用 bounding rectangle 的寬高判斷。旋轉後的正方形外接矩形可能不是正方形。

## 相黏物件可以用分水嶺演算法嗎？

相黏正方形可嘗試分水嶺演算法。分水嶺適合用距離轉換找出前景核心，再把黏在一起的區域拆成不同標記。

![相黏物件分水嶺處理前](/images/tech/opencv-square-watershed-source.webp)

![相黏物件分水嶺處理後](/images/tech/opencv-square-watershed-result.webp)

分水嶺不是萬靈丹。若前景與背景差異不明顯，或兩個物件黏得太平滑，標記點很可能找不準，分割結果也會不穩。

## 邊緣不清楚時可以用霍夫直線嗎？

霍夫直線適合在正方形邊界可被視為線段時使用。\`HoughLinesP()\` 可找出候選線段，再由長度、角度與相對位置組合成正方形邊界。

\`\`\`py
import cv2
import numpy as np

img = cv2.imread("square.jpg")
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
edges = cv2.Canny(gray, 50, 150)

lines = cv2.HoughLinesP(
    edges,
    1,
    np.pi / 180,
    100,
    minLineLength=100,
    maxLineGap=10,
)
\`\`\`

霍夫直線的難點不在找線，而在「把哪些線組成同一個正方形」。實務上要加入線段角度分群、交點計算與邊長比例檢查。

## 常見問題
### OpenCV 找正方形只用 findContours 夠嗎？

簡單乾淨的圖片通常夠用。若畫面有遮擋、相黏、反光或邊界模糊，只用 \`findContours()\` 很容易漏檢或誤判。

### 為什麼四個頂點不一定代表正方形？

四個頂點只能代表近似後是四邊形。長方形、梯形、菱形與雜訊輪廓都可能有四個頂點，所以還要檢查邊長與角度。

### 分水嶺和霍夫直線應該先用哪個？

若問題是物件相黏，先試分水嶺。若問題是邊界線段不連續但直線特徵明顯，先試霍夫直線。

### Harris 角點可以用來找正方形嗎？

Harris 角點可以找候選角點，但仍需要把角點組合成四邊形並檢查邊長與角度。角點偵測通常是流程的一部分，不是完整正方形檢測答案。

## 參考資料
- OpenCV 文件，Contours，https://docs.opencv.org/4.x/d3/d05/tutorial_py_table_of_contents_contours.html，存取日期：2026-08-27。
- OpenCV 文件，Hough Line Transform，https://docs.opencv.org/4.x/d9/db0/tutorial_hough_lines.html，存取日期：2026-08-27。
- OpenCV 文件，Watershed Algorithm，https://docs.opencv.org/4.x/d3/db4/tutorial_py_watershed.html，存取日期：2026-08-27。

## 延伸閱讀

- [拆分相黏的正方形：OpenCV distanceTransform 與 watershed 流程](/post/opencv-split-touching-squares)：同樣聚焦 OpenCV，可接著比較不同情境的做法。
- [讓 OpenCV 支持 GPU](/post/opencv-gpu-support)：同樣聚焦 OpenCV、電腦視覺，可接著比較不同情境的做法。
- [OpenCV 尋找邊緣：Canny、Sobel 極座標與分水嶺](/post/opencv-canny-edge-detection-watershed)：同樣聚焦 OpenCV，可接著比較不同情境的做法。
`;export{e as default};