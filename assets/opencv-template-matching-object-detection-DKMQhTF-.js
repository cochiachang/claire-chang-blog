var e=`---
title: OpenCV Template Matching 教學：在圖像中查找物件與縮放旋轉限制
description: 說明 OpenCV template matching 如何用 cv.matchTemplate 找物件，並判斷何時改用特徵匹配與 Homography。
date: 2022-12-19
category: 機器學習
tags: [OpenCV, Template Matching, 物件偵測, 電腦視覺, Python]
readingTime: 8 分鐘
image: /images/tech/hero_opencv-image-pyramid.webp
imageAlt: OpenCV 多尺度影像處理示意圖，代表 template matching 與圖像物件查找
---


# OpenCV Template Matching 教學：在圖像中查找物件與縮放旋轉限制

OpenCV Template Matching 適合在一張大圖中尋找「形狀、尺度、角度都接近固定」的小圖樣板。做法是用 \`cv.matchTemplate()\` 逐格比對模板與影像區塊，再用 \`cv.minMaxLoc()\` 找出最佳匹配位置；但只要物件被明顯縮放、旋轉或透視變形，傳統模板匹配就容易失準。

## OpenCV Template Matching 是什麼？

OpenCV Template Matching 是以模板圖片在輸入影像中滑動比對的傳統電腦視覺方法。OpenCV 官方文件說明，\`cv.matchTemplate()\` 會回傳一張灰階結果圖，每個位置代表該區塊與模板的相似程度（OpenCV，存取日期：2026-08-28）。

Template Matching 的核心概念很直覺：準備一張 \`template.jpg\`，再到較大的 \`messi5.jpg\` 裡逐一比對可能位置。若輸入影像大小為 \`W x H\`，模板大小為 \`w x h\`，結果圖大小會是 \`W-w+1 x H-h+1\`；接著用 \`cv.minMaxLoc()\` 找出最高分或最低分的位置，再畫出矩形框。

我當時的筆記重點是先把六種 OpenCV 比對方法跑過一次，而不是一開始就相信某一種方法。不同相似度函式對亮度、背景與紋理的敏感度不同，先看結果圖通常比只看最後框線更容易除錯。

## 如何用 cv.matchTemplate 在圖像中查找物件？

\`cv.matchTemplate()\` 的基本流程是讀取灰階影像、讀取灰階模板、逐一套用比對方法，最後用 \`cv.minMaxLoc()\` 取得最佳位置。若方法是 \`TM_SQDIFF\` 或 \`TM_SQDIFF_NORMED\`，最低值才是最佳匹配。

這段範例保留我當時整理的 OpenCV 官方教學程式碼。程式會把每一種 matching method 的結果圖與偵測框一起顯示，方便比較不同方法的差異。

\`\`\`python
import cv2 as cv
import numpy as np
from matplotlib import pyplot as plt
img = cv.imread('messi5.jpg',0)
img2 = img.copy()
template = cv.imread('template.jpg',0)
w, h = template.shape[::-1]
# All the 6 methods for comparison in a list
methods = ['cv.TM_CCOEFF', 'cv.TM_CCOEFF_NORMED', 'cv.TM_CCORR',
            'cv.TM_CCORR_NORMED', 'cv.TM_SQDIFF', 'cv.TM_SQDIFF_NORMED']
for meth in methods:
    img = img2.copy()
    method = eval(meth)
    # Apply template Matching
    res = cv.matchTemplate(img,template,method)
    min_val, max_val, min_loc, max_loc = cv.minMaxLoc(res)
    # If the method is TM_SQDIFF or TM_SQDIFF_NORMED, take minimum
    if method in [cv.TM_SQDIFF, cv.TM_SQDIFF_NORMED]:
        top_left = min_loc
    else:
        top_left = max_loc
    bottom_right = (top_left[0] + w, top_left[1] + h)
    cv.rectangle(img,top_left, bottom_right, 255, 2)
    plt.subplot(121),plt.imshow(res,cmap = 'gray')
    plt.title('Matching Result'), plt.xticks([]), plt.yticks([])
    plt.subplot(122),plt.imshow(img,cmap = 'gray')
    plt.title('Detected Point'), plt.xticks([]), plt.yticks([])
    plt.suptitle(meth)
    plt.show()
\`\`\`

實務上我會先確認三件事：影像和模板是否真的讀到、模板尺寸是否小於輸入影像、結果圖的高分或低分是否集中在合理位置。若結果圖到處都有高分，通常代表模板太普通，或背景紋理太像模板。

## Template Matching 遇到縮放或旋轉為什麼會失準？

Template Matching 對尺度與角度很敏感，因為模板會以固定大小、固定方向去比對影像區塊。物件只要被縮放、旋轉或透視變形，模板像素排列就不再對齊，匹配分數會明顯下降。

OpenCV 官方教學把 Template Matching 定位為在大圖中尋找模板位置的方法，而不是完整的尺度不變或旋轉不變物件偵測器（OpenCV，存取日期：2026-08-28）。Stack Overflow 上同一類問題也指出，\`matchTemplate\` 在物件旋轉或縮放後通常不適合直接使用，常見替代方向是 Features2D、SIFT/SURF 描述符、FLANN matcher 與 \`findHomography()\`（Stack Overflow，2012，存取日期：2026-08-28）。

這也是這篇筆記真正想補上的判斷：Template Matching 不是不能用，而是要先確認場景假設。如果攝影機固定、產品角度固定、物件大小穩定，Template Matching 很輕巧；如果物件會在 3D 空間裡移動，直接套模板通常會把問題簡化過頭。

## 物件會縮放旋轉時應該改用什麼方法？

物件會縮放或旋轉時，建議改用特徵點偵測、描述符匹配與 Homography。流程是找出目標圖和場景圖的 keypoints，計算 descriptors，用 matcher 配對，再用 \`findHomography()\` 推估物件在場景中的位置。

OpenCV 的 Feature Matching + Homography 教學示範了這個方向：先用 SIFT 找兩張圖的特徵與描述符，再用 FLANN 做 KNN matching，通過 ratio test 篩選好的 matches，最後把匹配點交給 \`cv.findHomography()\` 估出透視轉換（OpenCV，存取日期：2026-08-28）。

整體流程可以拆成六步：

1. 尋找目標圖像的關鍵點（Keypoints）。
2. 從目標圖像關鍵點提取描述符（Descriptors）。
3. 尋找場景圖像的關鍵點。
4. 從場景圖像關鍵點提取描述符。
5. 透過 matcher 匹配兩組描述符。
6. 分析匹配結果，推估目標圖像在場景中的位置。

有不同類別的 Feature Detectors、Descriptor Extractors 和 Descriptor Matchers，選擇時要回到任務條件：物件有沒有足夠角點與紋理、是否需要即時、是否允許誤判、影像解析度多大。

## 如何用 SIFT 提取 OpenCV 關鍵點？

SIFT 可以在影像中找出較穩定的局部特徵點，並計算描述符供後續匹配使用。這段範例只示範 keypoints 與 descriptors 的取得，尚未包含 FLANN matching 或 Homography。

以下為我當時筆記中提取關鍵點的一個範例：

\`\`\`python
from __future__ import print_function
import cv2
import numpy as np
import argparse
print(cv2.__version__)
img = cv2.imread('./D10.jpg', cv2.IMREAD_COLOR)
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

sift = cv2.SIFT_create()

kp = sift.detect(gray, None)


ret = cv2.drawKeypoints(gray, kp, img)
cv2.imshow('ret', ret)
cv2.waitKey(0)
cv2.destroyAllWindows()

kp, des = sift.compute(gray, kp)

print(np.shape(kp))
print(np.shape(des))

print(des[0])
\`\`\`

這段範例的檢查點很單純：\`kp\` 是偵測到的關鍵點集合，\`des\` 是描述符矩陣。若 \`des\` 是 \`None\` 或 keypoints 很少，後續 matcher 再漂亮也救不回來；這時要先回頭看影像是否過於平坦、模糊、曝光不足，或目標物本身缺少可辨識紋理。

## Template Matching 和特徵匹配怎麼選？

Template Matching 適合固定角度、固定尺度、低成本的圖樣查找；特徵匹配適合尺度、旋轉或透視可能變動的物件查找。選擇方法前，先問物件在場景中是否仍像同一張模板。

| 判斷條件 | 適合 Template Matching | 適合特徵匹配與 Homography |
|---|---|---|
| 物件尺度 | 幾乎固定 | 可能變大或變小 |
| 物件角度 | 幾乎固定 | 可能旋轉 |
| 場景透視 | 幾乎沒有變形 | 有斜拍或透視變形 |
| 物件外觀 | 模板紋理清楚且固定 | 有足夠角點、邊緣與局部特徵 |
| 實作成本 | 較低 | 較高，需要調 matcher 與篩選條件 |

我的實務判斷是：先用 Template Matching 做最小可行驗證，能過就不必急著換重方法；只要測試圖片一加入縮放、旋轉、不同拍攝角度就開始飄，再改用 SIFT/ORB、FLANN/BFMatcher 與 Homography。這樣比較不會一開始就把簡單問題做重，也不會讓錯誤方法卡住整個專案。

## 常見問題

OpenCV Template Matching 的常見問題多半不是語法，而是場景假設。模板、輸入圖、尺度、角度與光線條件只要沒有對齊，結果就會很快失準。

### OpenCV Template Matching 可以用來做物件偵測嗎？
OpenCV Template Matching 可以用來做簡單物件查找，但不等於完整的通用物件偵測。固定攝影機、固定角度、固定尺寸的圖樣最適合使用 Template Matching。

### cv.matchTemplate 找不到正確位置時先檢查什麼？
\`cv.matchTemplate()\` 找不到正確位置時，先檢查圖片是否成功讀取、模板是否小於輸入圖、模板是否過於普通，以及 matching method 是否適合。也可以先看結果圖，不要只看最後畫出的框。

### TM_SQDIFF 和其他 matching method 差在哪？
\`TM_SQDIFF\` 與 \`TM_SQDIFF_NORMED\` 是分數越低越像，其他常見方法通常是分數越高越像。因此使用 \`cv.minMaxLoc()\` 後，這兩種方法要取 \`min_loc\`，不是 \`max_loc\`。

### Template Matching 能處理縮放嗎？
單次固定模板的 Template Matching 不能自然處理縮放。若只是小範圍尺度變化，可以用 image pyramid 或多個尺度模板嘗試；若場景變化大，通常應改用特徵匹配或物件偵測模型。

### Template Matching 能處理旋轉嗎？
單次固定模板的 Template Matching 不能自然處理旋轉。可以準備多個旋轉角度模板做粗略比對，但角度很多時成本會上升；有足夠特徵點的物件更適合用 SIFT、ORB 與 Homography。

### SIFT、SURF、ORB 要怎麼選？
SIFT 與 SURF 對尺度與旋轉較有代表性，但計算成本通常比 ORB 高；ORB 常用於較快的二進位描述符流程。實務上要用自己的圖片測 keypoints 數量、匹配品質與速度。

### Homography 一定找得到物件嗎？
Homography 不一定找得到物件。\`cv.findHomography()\` 至少需要足夠且正確的匹配點；若物件太平滑、遮擋嚴重、特徵點不足或錯誤匹配太多，推估出來的框就會不穩。

## 參考資料

本文主要參考 OpenCV 官方文件，並補充我當時查到的縮放旋轉討論。外部連結都使用 HTTPS，方便讀者回查原始技術說明。

- OpenCV，〈[Template Matching](https://docs.opencv.org/4.x/d4/dc6/tutorial_py_template_matching.html)〉，存取日期：2026-08-28。
- OpenCV，〈[Feature Matching + Homography to find Objects](https://docs.opencv.org/4.x/d1/de0/tutorial_py_feature_homography.html)〉，存取日期：2026-08-28。
- OpenCV，〈[Feature Matching](https://docs.opencv.org/4.x/dc/dc3/tutorial_py_matcher.html)〉，存取日期：2026-08-28。
- Stack Overflow，〈[scale and rotation Template matching](https://stackoverflow.com/questions/10666436/scale-and-rotation-template-matching)〉，2012-05-19，存取日期：2026-08-28。

## 延伸閱讀

- [YOLOv8 使用範例：Roboflow 資料集訓練與 best.pt 即時偵測](/post/yolov8-usage-example)：同樣聚焦 物件偵測、OpenCV，可接著比較不同情境的做法。
- [讓 OpenCV 支持 GPU](/post/opencv-gpu-support)：同樣聚焦 OpenCV、電腦視覺，可接著比較不同情境的做法。
- [用 OpenCV 旋轉圖片：getRotationMatrix2D 與 warpAffine 範例](/post/opencv-rotate-image)：同樣聚焦 OpenCV、Python，可接著比較不同情境的做法。

## 最後更新

本文最後更新日期是 2026-08-28。此次更新補齊 GEO Answer Blocks、FAQ、站內延伸閱讀、參考資料與作者資訊。

2026-08-28
`;export{e as default};