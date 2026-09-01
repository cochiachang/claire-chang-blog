var e=`---
title: 用 OpenCV 旋轉圖片：getRotationMatrix2D 與 warpAffine 範例
description: 說明如何用 OpenCV 的 getRotationMatrix2D 建立旋轉矩陣，再用 warpAffine 旋轉圖片並設定白色邊界。
date: 2022-12-21
category: 機器學習
tags: [OpenCV, Python, 影像處理]
readingTime: 5 分鐘
image: /images/tech/opencv-rotate-image-result.webp
imageAlt: OpenCV 圖片旋轉前後結果截圖
---


# 用 OpenCV 旋轉圖片：getRotationMatrix2D 與 warpAffine 範例

OpenCV 旋轉圖片的基本做法，是先用 \`cv2.getRotationMatrix2D()\` 產生仿射旋轉矩陣，再用 \`cv2.warpAffine()\` 套用到原圖。角度以逆時針為正值，例如 90 代表逆時針旋轉 90 度；如果旋轉後邊界要補白，可以在 \`warpAffine()\` 加上 \`borderValue=(255, 255, 255)\`。

## OpenCV 旋轉圖片要用哪兩個函數？

OpenCV 旋轉圖片主要使用 \`cv2.getRotationMatrix2D()\` 和 \`cv2.warpAffine()\`。前者決定旋轉中心、角度與縮放比例，後者把矩陣實際套用到圖片像素。

\`cv2.getRotationMatrix2D(center, angle, scale)\` 會回傳 2x3 的仿射矩陣。\`center\` 通常設為圖片中心點，\`angle\` 是旋轉角度，\`scale\` 是縮放倍率。

\`cv2.warpAffine(image, M, (w, h))\` 會用矩陣 \`M\` 重新映射圖片。第三個參數 \`(w, h)\` 是輸出圖片尺寸，如果仍使用原圖寬高，旋轉後超出邊界的部分會被裁掉。

## 如何用 Python 寫一個 rotate_image 函數？

\`rotate_image()\` 可以把讀圖、取得中心點、產生旋轉矩陣與套用仿射轉換整理成同一個流程。這樣在測試不同角度時，只需要改變 angle 參數。

\`\`\`py
import cv2
import numpy as np

image = cv2.imread("image1.jpg")

def rotate_image(image, angle):
    (h, w) = image.shape[:2]
    center = (w // 2, h // 2)
    matrix = cv2.getRotationMatrix2D(center, angle, 1.0)
    rotated_image = cv2.warpAffine(image, matrix, (w, h))
    return rotated_image

rotated_image = rotate_image(image, 90)

cv2.imshow("image", image)
cv2.imshow("rotated_image", rotated_image)
cv2.waitKey(0)
cv2.destroyAllWindows()
\`\`\`

![OpenCV 旋轉圖片前後結果](/images/tech/opencv-rotate-image-result.webp)

這段程式碼保留了原文最核心的做法：先取得圖片高度與寬度，再把中心點設為 \`(w // 2, h // 2)\`。如果圖片是 623x242，旋轉中心就會落在圖片中央附近。

## 旋轉角度的正負方向怎麼判斷？

OpenCV 的 \`getRotationMatrix2D()\` 以逆時針方向為正角度。若要讓圖片逆時針旋轉 90 度，angle 應設定為 90；若要順時針旋轉 90 度，angle 應設定為 -90。

這一點在調整影像資料集時很容易弄反。建議先用一張有明確方向的測試圖，例如含文字、箭頭或不對稱物件的圖片，確認正負角度符合預期後，再批次套用到資料夾。

## 如何讓旋轉後的邊界填成白色？

\`cv2.warpAffine()\` 可以透過 \`borderValue\` 設定旋轉後的空白邊界顏色。若資料背景是白色，設定 \`borderValue=(255, 255, 255)\` 可以讓旋轉結果更自然。

\`\`\`py
import cv2
import numpy as np

image = cv2.imread("image1.jpg")

def rotate_image(image, angle):
    (h, w) = image.shape[:2]
    center = (w // 2, h // 2)
    matrix = cv2.getRotationMatrix2D(center, angle, 1.0)
    rotated_image = cv2.warpAffine(
        image,
        matrix,
        (w, h),
        borderValue=(255, 255, 255),
    )
    return rotated_image

rotated_image = rotate_image(image, 90)
\`\`\`

如果圖片背景不是白色，\`borderValue\` 應改成與背景一致的 BGR 顏色。OpenCV 使用 BGR 色彩順序，不是常見的 RGB 順序。

## 常見問題
### OpenCV 旋轉圖片會改變圖片大小嗎？

上述範例不會改變輸出圖片大小，因為 \`warpAffine()\` 的輸出尺寸仍設定為原圖寬高 \`(w, h)\`。若旋轉角度不是 90、180、270 度，邊角可能會被裁切。

### \`getRotationMatrix2D()\` 的第三個參數是什麼？

第三個參數是縮放比例。設定為 \`1.0\` 代表只旋轉不縮放，設定為 \`0.5\` 代表旋轉後縮小為一半。

### OpenCV 的邊界顏色為什麼用 \`(255, 255, 255)\`？

OpenCV 以 BGR 儲存彩色像素，但白色在 BGR 和 RGB 都是 \`(255, 255, 255)\`。若要填黑色，可以使用 \`(0, 0, 0)\`。

## 參考資料
- OpenCV 文件，\`getRotationMatrix2D\` 與 \`warpAffine\` API，https://docs.opencv.org/4.x/da/d54/group__imgproc__transform.html，存取日期：2026-08-27。

## 延伸閱讀

- [OpenCV 圖像幾何變換教學：縮放、平移、旋轉、仿射與透視變換](/post/opencv-geometric-transformations)：同樣聚焦 OpenCV、影像處理，可接著比較不同情境的做法。
- [使用 OpenCV 調整圖片亮度：convertScaleAbs 範例](/post/opencv-adjust-image-brightness)：同樣聚焦 OpenCV、Python，可接著比較不同情境的做法。
- [使用 OpenCV 做圖片後製處理（如 Photoshop）的三個實用技巧](/post/opencv-photo-editing-like-photoshop)：同樣聚焦 OpenCV、影像處理，可接著比較不同情境的做法。
`;export{e as default};