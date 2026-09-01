var e=`---
title: 使用 OpenCV 判別圖像清晰度：Laplacian 變異數實作模糊偵測
description: 用 OpenCV 的 Laplacian、Tenengrad 與變異數三種方法判別圖像清晰度，附完整 Python 範例程式碼與實測分數，教你快速實作圖像模糊偵測與自動篩選清晰圖片。
date: 2023-02-14
category: 機器學習
tags: [OpenCV, 影像處理, 模糊偵測, Python, Laplacian]
readingTime: 4 分鐘
image: /images/tech/hero_opencv-detect-image-blur-sharpness.webp
imageAlt: 使用 OpenCV Laplacian 算子判別圖像清晰度的影像處理示意
---


在影像處理與電腦視覺的自動化流程中，我經常需要判斷一張圖像「清不清楚」——例如批次篩選拍攝失敗的模糊照片，或在影片串流中偵測失焦畫面。這篇文章整理我實測過的 3 種圖像清晰度評價方法（Tenengrad 梯度、Laplacian 梯度、變異數），並附上可直接執行的 OpenCV Python 範例與實測分數。


# 使用 OpenCV 判別圖像清晰度：Laplacian 變異數實作模糊偵測

## 圖像清晰度有哪些評價方法？

圖像的清晰程度可以被表示為圖像的邊緣和顏色變化的強度：清晰度越強，邊緣和顏色變化的強度就越高。因此，透過評估圖像的清晰度，就可以偵測圖像是否模糊。我實際用過的 3 種清晰度評價方法如下：

| 方法 | 原理 | 衡量指標 |
| --- | --- | --- |
| Tenengrad 梯度方法 | 利用 Sobel 算子分別計算水平和垂直方向的梯度，同一場景下梯度值越高，圖像越清晰 | 經 Sobel 算子處理後的圖像平均灰度值，值越大代表越清晰 |
| Laplacian 梯度方法 | \`cv2.Laplacian()\` 變換不需區分圖像的 x 和 y 方向計算梯度，其 kernel 在 x、y 方向是對稱的 | 對 Laplacian 結果取變異數 |
| 變異數方法 | 方差考察一組離散數據和其期望（均值）之間的偏離程度：方差較大表示組內數據偏差大、分佈不均衡；方差較小表示組內數據分佈平均、大小相近 | 數據分佈的離散程度 |

## 為什麼 Laplacian 算子適合做模糊偵測？

Laplace 算子是一種各向同性的二階微分算子，在**只關心邊緣的位置而不考慮其周圍的像素灰度差值時比較合適**。它對孤立像素的響應比對邊緣或線的響應更強烈，因此只適用於無噪聲圖像——存在噪聲的情況下，使用 Laplacian 算子檢測邊緣之前需要先進行低通濾波。所以通常的分割算法都會把 Laplacian 算子和平滑算子結合起來生成一個新的模板。

![Laplacian 算子的 kernel 模板](/images/articles/opencv-detect-image-blur-sharpness-1.webp)

從模板形式容易看出：如果在圖像中一個較暗的區域出現了一個亮點，用拉普拉斯運算就會使這個亮點變得更亮。因為圖像中的邊緣就是灰度發生跳變的區域，所以拉普拉斯銳化模板在邊緣檢測中很有用。一般增強技術對於陡峭的邊緣和緩慢變化的邊緣很難確定其邊緣線的位置，但此算子可以用二次微分正峰和負峰之間的過零點來確定，對孤立點或端點更為敏感，特別適用於以突出圖像中的孤立點、孤立線或線端點為目的的場合。

## 怎麼用 Python 實作清晰度評分？

實作上我把圖像統一縮放到固定尺寸、轉成灰階後，計算 Laplacian 並取變異數當作清晰度分數：

\`\`\`python
import numpy as np
import cv2
from os import listdir
import re

files = [f for f in listdir('./wrong2/') if re.match(r'.*\\.jpg', f)]
for i in range(len(files)):
    image = cv2.imread("./wrong2/" + files[i])
    image = cv2.resize(image, (100, 120))
    image = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
    # Calculate the Laplacian of the image
    laplacian = cv2.Laplacian(image, cv2.CV_64F)
    score = np.var(laplacian)
    print(files[i], score)
cv2.waitKey(0)
\`\`\`

## 實測結果：分數如何反映清晰度？

下面這張圖片的分數為 **1099.52**：

![清晰度分數 1099.52 的模糊圖像範例](/images/articles/opencv-detect-image-blur-sharpness-2.webp)

而這張為 **2966.93**：

![清晰度分數 2966.93 的清晰圖像範例](/images/articles/opencv-detect-image-blur-sharpness-3.webp)

可以知道，由於拉普拉斯是在求邊緣，模糊偵測會是一種比較級的狀況——也就是說，如果一段動態影片，前一幀的邊緣多、後一幀突然變少，有可能就是因為正在移動而造成的模糊導致邊緣變少。實務上我會設定一個相對門檻，或對同一場景的連續幀做前後比較，而不是用一個絕對分數判斷所有圖像。

## 常見問題

### 為什麼用 Laplacian 的變異數而不是平均值來評分？

變異數反映 Laplacian 響應的分佈離散程度：清晰的圖像邊緣響應強且集中，變異數大；模糊的圖像邊緣被抹平，響應趨近零且分佈平均，變異數小。平均值會被大面積的零響應稀釋，區分度較差。

### 清晰度分數有絕對門檻嗎？

沒有通用的絕門檻。分數會受圖像內容、對比度和縮放尺寸影響，實務上建議使用相對比較（同一場景的候選圖之間比大小）或依資料集調校門檻。

### 影片中的運動模糊要怎麼偵測？

可以做前後幀比較：前一幀的 Laplacian 變異數高、後一幀突然大幅下降，就代表畫面可能因移動而失焦或模糊，這正是「比較級」思路的應用。

### 使用 Laplacian 算子前需要先做什麼處理？

Laplacian 對噪聲敏感，建議先做低通濾波（如高斯模糊）去噪，並把圖像統一 resize 到相同尺寸、轉灰階，分數才有可比性。

### Tenengrad 和 Laplacian 方法該選哪一個？

Tenengrad 用 Sobel 算子分別計算水平與垂直梯度，對方向性紋理較敏感；Laplacian 的 kernel 在 x、y 方向對稱，實作最簡單且運算量低，是我做快速模糊偵測時的預設選擇。

## 參考資料

- OpenCV 官方文件：[Laplacian](https://docs.opencv.org/4.x/d5/db5/tutorial_laplace_operator.html)

## 延伸閱讀

- [OpenCV 圖像金字塔教學：Gaussian Pyramid、Laplacian Pyramid 與影像融合](/post/opencv-image-pyramid)：同樣聚焦 OpenCV、影像處理，可接著比較不同情境的做法。
- [使用 OpenCV 做圖片後製處理（如 Photoshop）的三個實用技巧](/post/opencv-photo-editing-like-photoshop)：同樣聚焦 OpenCV、影像處理，可接著比較不同情境的做法。
- [使用 OpenCV 調整圖片亮度：convertScaleAbs 範例](/post/opencv-adjust-image-brightness)：同樣聚焦 OpenCV、Python，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2023-02-14，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};