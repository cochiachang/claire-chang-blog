var e=`---
title: "U2Net 模型的去背應用：用 rembg 實作影像去背與模型比較"
description: "整理 U2Net 模型的去背應用：使用 rembg 套件在 Python 中實作 CPU 與 GPU 去背，示範攝影機即時去背程式碼，並比較 u2net、u2netp、human_seg、cloth_seg、silueta、isnet 等模型的檔案大小與處理時間。"
date: 2023-09-27
category: "機器學習"
tags: [U2-Net, rembg, 影像分割, 去背, Python]
readingTime: "6 分鐘"
image: "/images/tech/hero_u2net-background-removal.webp"
imageAlt: "黑白人像攝影，適合作為 U2Net 人像去背與影像分割的示意圖"
---


# U2Net 模型的去背應用：用 rembg 實作影像去背與模型比較

最近在研究影像去背（背景移除）的應用，發現 rembg 這個套件底層用的就是 U2Net 系列模型，安裝簡單、又有現成的多種模型可以切換，這篇就來記錄安裝方式、實際的去背程式碼，以及各模型的測試結果比較。

rembg 的官方 GitHub：https://github.com/danielgatis/rembg/tree/main

## 怎麼安裝 rembg？CPU 與 GPU 版本有什麼差別？

CPU support：

\`\`\`bash
pip install rembg # for library
pip install rembg[cli] # for library + cli
\`\`\`

GPU support 首先要去安裝 [onnxruntime-gpu](https://onnxruntime.ai/)，接著：

\`\`\`bash
pip install rembg[gpu] # for library
pip install rembg[gpu,cli] # for library + cli
\`\`\`

## 如何用 rembg 對攝影機畫面即時去背？

下面為一個讀取攝影機的簡單去背使用範例：

\`\`\`python
import VideoStream
import cv2
import numpy as np
import time
from rembg import new_session, remove

videostream = VideoStream.VideoStream((1280, 720), 30, 0).start()
cam_quit = 0
total = 0
frame = 0

while cam_quit == 0:
    imageSource = videostream.read()
    imageSource = cv2.resize(imageSource, (640,360))
    aStart = time.time()
    # u2netp為model名稱
    output = remove(imageSource, session = new_session("u2netp") )
    aEnd = time.time()
    if frame <= 60:
        total = total + (aEnd - aStart)
        frame = frame + 1
    print("detect time: " + str(aEnd - aStart ))
    cv2.imshow("output", output)
    key = cv2.waitKey(1) & 0xFF
    if key == ord("q"):
        print("avg detect time: " + str(total/frame))
        cam_quit = 1

videostream.stop()
cv2.destroyAllWindows()
\`\`\`

## Stable Diffusion WebUI 的去背功能也是 rembg 嗎？

Stable Diffusion WebUI 所使用的去背功能也是這個唷！

相關介紹文章：https://zhuanlan.zhihu.com/p/648234420

可以參考 WebUI 的參數去尋找相關程式碼可設定的部分，例如 Erode size、Foreground threshold、Background threshold。

## rembg 有哪些 U2Net 模型可以選？

- u2net（[下載](https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2net.onnx)、[原始碼](https://github.com/xuebinqin/U-2-Net)）：適用於一般用途的預訓練模型。
- u2netp（[下載](https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2netp.onnx)、[原始碼](https://github.com/xuebinqin/U-2-Net)）：u2net 模型的輕量化版本。
- u2net_human_seg（[下載](https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2net_human_seg.onnx)、[原始碼](https://github.com/xuebinqin/U-2-Net)）：用於人像分割的預訓練模型。
- u2net_cloth_seg（[下載](https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2net_cloth_seg.onnx)、[原始碼](https://github.com/levindabhi/cloth-segmentation)）：用於從人像中分析衣物的預訓練模型。這裡的衣物被解析成三個類別：上半身、下半身和全身。
- silueta（[下載](https://github.com/danielgatis/rembg/releases/download/v0.0.0/silueta.onnx)、[原始碼](https://github.com/xuebinqin/U-2-Net/issues/295)）：與 u2net 相同，但大小減少到 43Mb。
- isnet-general-use（[下載](https://github.com/danielgatis/rembg/releases/download/v0.0.0/isnet-general-use.onnx)、[原始碼](https://github.com/xuebinqin/DIS)）：新的適用於一般用途的預訓練模型。
- isnet-anime（[下載](https://github.com/danielgatis/rembg/releases/download/v0.0.0/isnet-anime.onnx)、[原始碼](https://github.com/SkyTNT/anime-segmentation)）：用於動漫角色的高精度分割模型。
- sam（[下載編碼器](https://github.com/danielgatis/rembg/releases/download/v0.0.0/vit_b-encoder-quant.onnx)、[下載解碼器](https://github.com/danielgatis/rembg/releases/download/v0.0.0/vit_b-decoder-quant.onnx)、[原始碼](https://github.com/facebookresearch/segment-anything)）：適用於任何用途的預訓練模型。

## 各模型實測：去背效果與速度差多少？

我用同一張原始影像來測試各模型的去背效果。

原始影像如下圖：

![去背測試用的原始影像](/images/articles/u2net-background-removal-1.webp)

### u2net

- 檔案大小：171,873KB
- 處理時間：1.741s

![u2net 模型去背測試結果](/images/articles/u2net-background-removal-2.webp)

### u2netp

- 檔案大小：4,468KB
- 處理時間：0.702s

![u2netp 模型去背測試結果](/images/articles/u2net-background-removal-3.webp)

### u2net_human_seg

- 檔案大小：171,873KB
- 處理時間：1.997s

![u2net_human_seg 模型去背測試結果](/images/articles/u2net-background-removal-4.webp)

### u2net_cloth_seg

- 檔案大小：172,066KB
- 處理時間：5.496s

### silueta

- 檔案大小：43,138KB
- 處理時間：5.496s

![silueta 模型去背測試結果](/images/articles/u2net-background-removal-5.webp)

### isnet-general-use

- 檔案大小：174,461KB
- 處理時間：2.629s

![isnet-general-use 模型去背測試結果](/images/articles/u2net-background-removal-6.webp)

### isnet-anime

- 檔案大小：171,944KB
- 處理時間：2.533s

![isnet-anime 模型去背測試結果](/images/articles/u2net-background-removal-7.webp)

## 常見問題

### rembg 一定要用 GPU 才跑得動嗎？

不用，\`pip install rembg\` 安裝 CPU 版本就能直接使用，只是處理速度較慢。若需要即時處理攝影機畫面這類高吞吐場景，再裝 onnxruntime-gpu 與 \`rembg[gpu]\` 會明顯加速。

### u2net 和 u2netp 該選哪一個？

u2net 是一般用途的標準模型，效果最完整但檔案約 172MB、單張處理約 1.7 秒。u2netp 是它的輕量化版本，只有約 4.5MB、處理時間 0.7 秒，適合效能受限或需要即時處理的情境，我的即時去背範例就是用 u2netp。

### 想做人像或動漫圖片的去背有專用模型嗎？

有。人像分割可以選 u2net_human_seg；衣物分析（分成上半身、下半身、全身三類）用 u2net_cloth_seg；動漫角色的高精度分割則用 isnet-anime。依素材特性選對模型，效果會比通用模型好很多。

### Stable Diffusion WebUI 的去背跟 rembg 有關係嗎？

有，WebUI 的去背功能底層就是 rembg。可以參考 WebUI 的參數（例如 Erode size、Foreground threshold、Background threshold）去對應 rembg 程式碼中可設定的部分。

## 參考資料

- rembg 官方 GitHub：https://github.com/danielgatis/rembg/tree/main
- U-2-Net 原始碼：https://github.com/xuebinqin/U-2-Net
- onnxruntime：https://onnxruntime.ai/
- Stable Diffusion WebUI rembg 介紹：https://zhuanlan.zhihu.com/p/648234420

## 延伸閱讀

- [OpenCV 如何用 floodFill 做魔術棒填色](/post/opencv-flood-fill-magic-wand)：同樣聚焦 Python、影像分割，可接著比較不同情境的做法。
- [影像分割模型介紹：U-Net 與去背改良版 U2-Net](/post/image-segmentation-models)：同樣聚焦 影像分割，可接著比較不同情境的做法。
- [使用 OpenCV GrabCut 抓取圖片前景](/post/opencv-grabcut-foreground-extraction)：同樣聚焦 Python、影像分割，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2023-09-27，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};