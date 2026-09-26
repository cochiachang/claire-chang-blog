var e=`---
title: OpenCV 如何將歪斜圖形轉正
description: 說明 OpenCV rotate、flip、fitEllipse、warpAffine 與 getRotationMatrix2D 的差異，並示範如何依輪廓角度轉正物件。
date: 2023-06-09T00:00:00.000Z
category: 機器學習
tags:
  - OpenCV
  - Python
  - 影像校正
readingTime: 8 分鐘
image: /images/tech/hero_opencv-correct-object-rotation.webp
imageAlt: grayscale photo of concrete building
---
# OpenCV 如何將歪斜圖形轉正

OpenCV 要將歪斜圖形轉正，通常不是只用 \`cv2.rotate()\`。比較完整的做法是先用輪廓擬合取得物件角度，再用 \`cv2.getRotationMatrix2D()\` 建立旋轉矩陣，最後用 \`cv2.warpAffine()\` 把影像轉回正向並裁切。

## \`cv2.rotate()\` 適合什麼旋轉？

\`cv2.rotate()\` 適合固定角度旋轉，例如 90 度、180 度或 270 度。若影像只是方向放錯，\`cv2.rotate()\` 是最簡單的選擇。

\`\`\`python
import cv2

image = cv2.imread("your_image.jpg")
rotated_image = cv2.rotate(image, cv2.ROTATE_90_CLOCKWISE)

cv2.imshow("Rotated Image", rotated_image)
cv2.waitKey(0)
cv2.destroyAllWindows()
\`\`\`

\`cv2.rotate()\` 不適合處理任意角度歪斜，因為函數本身只處理幾種固定旋轉模式。若物件角度來自輪廓偵測，就要改用仿射轉換。

## \`cv2.flip()\` 和 \`cv2.rotate()\` 差在哪？

\`cv2.flip()\` 是軸對稱翻轉，\`cv2.rotate()\` 是旋轉變換。兩者在 180 度時可能看起來相似，但幾何意義與可控制的方向不同。

\`\`\`python
dst = cv2.flip(src, flipCode)
\`\`\`

| \`flipCode\` | 效果 |
|---|---|
| \`0\` | 沿水平軸上下翻轉 |
| \`1\` | 沿垂直軸左右翻轉 |
| \`-1\` | 同時上下與左右翻轉 |

如果任務是修正鏡像問題，用 \`cv2.flip()\`。如果任務是修正拍攝角度或物件歪斜，用輪廓角度搭配 \`cv2.warpAffine()\`。

## 為什麼我偏好用橢圓擬合取得角度？

橢圓擬合適合左右或上下對稱、長寬不同的物件。\`cv2.minAreaRect()\` 雖然能取得最小旋轉矩形，但輪廓有小缺口時，矩形角度可能跳動。

原文的經驗是：最小擬合矩形很容易受到輪廓細微變化影響，同一個形狀可能出現不同外框方向。對稱但非正方的物件，我會優先試 \`cv2.fitEllipse()\`，因為橢圓軸向通常比較符合物件本身的主方向。

\`\`\`python
import cv2

image = cv2.imread("./333_2023-06-08_19-57-30.jpg")
canny = cv2.Canny(image, 50, 250)
cnts, hier = cv2.findContours(canny, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

ellipse = cv2.fitEllipse(cnts[0])
(center, axes, angle) = ellipse
cv2.ellipse(image, ellipse, (0, 255, 0), 2)
\`\`\`

## 如何用 \`warpAffine()\` 將物件轉正並裁切？

\`cv2.warpAffine()\` 可以依旋轉矩陣重新取樣影像。先用 \`cv2.getRotationMatrix2D()\` 取得矩陣，再旋轉原圖與輪廓 mask，最後用 bounding box 裁出轉正後的物件。

\`\`\`python
def rotatedDice(image, cnt):
    ellipse = cv2.fitEllipse(cnt)
    (center, axes, angle) = ellipse
    angle = angle + 90

    rotation_matrix = cv2.getRotationMatrix2D(tuple(center), angle, 1)
    image = cv2.warpAffine(image, rotation_matrix, (image.shape[1], image.shape[0]))

    mark = np.zeros_like(image)
    cv2.drawContours(mark, [cnt], 0, (255, 255, 255), -1)
    mark = cv2.warpAffine(mark, rotation_matrix, (mark.shape[1], mark.shape[0]))
    mark = cv2.cvtColor(mark, cv2.COLOR_RGB2GRAY)

    cnts, hier = cv2.findContours(mark, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    x, y, w, h = cv2.boundingRect(cnts[0])
    matting_result = image[y:y + h, x:x + w, :]
    return matting_result
\`\`\`

這段做法的重點是同步旋轉影像與 mask。只旋轉影像會失去原本輪廓位置；同步旋轉 mask，才能在新座標中重新找到物件裁切範圍。

## 什麼時候需要 \`cv2.getAffineTransform()\`？

\`cv2.getAffineTransform()\` 適合已知三組對應點的仿射校正。若真實世界拍攝角度包含透視或深度變化，只用單一中心點與角度旋轉會不夠。

原文提到，大部分 3D 場景的角度轉換會帶有深度變化。這時可以用三個點建立仿射矩陣，或在透視變形更明顯時改用 perspective transform。

\`\`\`python
import cv2
import numpy as np

point1 = (106, 92)
point2 = (28, 91)
point3 = (154, 33)

rotation_angle = -45
image = np.zeros((500, 500), dtype=np.uint8)
cv2.drawContours(image, [np.array([point1, point2, point3])], 0, 255, thickness=2)

center = np.mean([point1, point2, point3], axis=0)
rotation_matrix = cv2.getRotationMatrix2D(tuple(center), rotation_angle, 1)
rotated_image = cv2.warpAffine(image, rotation_matrix, (image.shape[1], image.shape[0]))
\`\`\`

## 常見問題
### OpenCV 圖形轉正可以只用 \`cv2.rotate()\` 嗎？

只有固定 90 度倍數旋轉時適合只用 \`cv2.rotate()\`。若物件歪斜角度不是固定值，應先估角度再用 \`cv2.warpAffine()\`。

### \`cv2.minAreaRect()\` 為什麼角度會不穩？

\`cv2.minAreaRect()\` 會找最小面積旋轉矩形，輪廓上的小凹洞或邊緣雜訊可能改變最小矩形方向。物件近似橢圓或對稱時，\`cv2.fitEllipse()\` 有時更穩。

### \`angle + 90\` 一定正確嗎？

不一定。\`angle + 90\` 是原文案例中的修正方式，實務上要依物件長軸方向、OpenCV 回傳角度定義與你想要的正向結果調整。

### 轉正後為什麼還要重新裁切？

旋轉後物件位置與外框都會改變。用同步旋轉後的 mask 重新找 \`cv2.boundingRect()\`，可以裁出比較乾淨的物件區域。

## 參考資料
- OpenCV Documentation, Geometric Image Transformations: <https://docs.opencv.org/4.x/da/d54/group__imgproc__transform.html>
- OpenCV Documentation, Affine Transform Tutorial: <https://docs.opencv.org/4.x/d4/d61/tutorial_warp_affine.html>

## 延伸閱讀

- [用 OpenCV 旋轉圖片：getRotationMatrix2D 與 warpAffine 範例](/post/opencv-rotate-image)：同樣聚焦 OpenCV、Python，可接著比較不同情境的做法。
- [OpenCV 輪廓形狀擬合有哪些常用方法](/post/opencv-shape-fitting-methods)：同樣聚焦 OpenCV、Python，可接著比較不同情境的做法。
- [OpenCV 如何計算旋轉後的輪廓角點](/post/opencv-rotate-contour-points)：同樣聚焦 OpenCV、Python，可接著比較不同情境的做法。

## 最後更新

Fri Jun 09 2023 08:00:00 GMT+0800 (Taiwan Standard Time)

`;export{e as default};