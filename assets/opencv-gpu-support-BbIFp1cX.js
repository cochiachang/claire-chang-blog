var e=`---
title: 讓 OpenCV 支持 GPU
description: OpenCV 支援 GPU 加速嗎？本文整理 OpenCV CUDA 模組的官方說明與設計目標，說明 pip 安裝版本為什麼不含 CUDA、cv2.UMat 怎麼把影像載入 GPU，以及自行用 CMake 編譯 WITH_CUDA 的 OpenCV GPU 版本需要哪些套件與安裝步驟。
date: 2023-01-03
category: 機器學習
tags: [OpenCV, GPU, CUDA, 電腦視覺, 影像處理]
readingTime: 5 分鐘
image: /images/tech/hero_opencv-gpu-support.webp
imageAlt: 顯示卡與影像處理晶片運算概念示意圖
---


# 讓 OpenCV 支持 GPU

一般 pip 安裝的 OpenCV 並不包含 GPU 加速功能，需要使用 OpenCV CUDA 模組才能在顯示卡上加速影像處理。本篇整理 OpenCV CUDA 的官方說明、設計目標、效能比較，以及自行編譯 GPU 版本所需的套件清單。

## 什麼是 OpenCV CUDA？

官方網址：<https://opencv.org/platforms/cuda/>

官方說明如下：

> 現代 GPU 加速器已經變得強大且功能強大，足以執行通用計算（GPGPU）。這是一個發展非常迅速的領域，引起了開發計算密集型應用程序的科學家、研究人員和工程師的極大興趣。儘管在 GPU 上重新實現算法存在困難，但許多人這樣做是為了檢查它們的速度。為了支持這些努力，許多高級語言和工具已經可用，例如 CUDA、OpenCL、C++ AMP、調試器、分析器等。
>
> 計算機視覺的重要組成部分是圖像處理，這是圖形加速器最初設計的領域。其他部分也假定大規模並行計算並且通常自然映射到 GPU 架構。因此，實現所有這些優勢並在圖形處理器上加速 OpenCV 具有挑戰性，但非常有益。

## OpenCV CUDA 的目標是什麼？

- 在 GPU 上為開發者提供方便的計算機視覺框架，與當前 CPU 功能保持概念上的一致性。
- 使用 GPU 實現最佳性能（針對現代架構調整的高效內核、優化的數據流，如異步執行、複製重疊、零複製）。
- 完整性（盡可能多地實施，即使加速不是很好；這樣可以完全在 GPU 上運行算法並節省應對開銷）。

## GPU 版的實際表現如何？

下圖為 CPU 版與 GPU 版的效能比較：

![OpenCV CUDA 與 CPU 版本的效能比較截圖](/images/articles/opencv-gpu-support-1.webp)

## 程式碼上要怎麼把圖片載入 GPU？

這兩個都是載入圖片的方法，上面的是載至 CPU，而下方則是載至 GPU：

\`\`\`py
img_Mat = cv2.imread('test.jpg')  # 16-bit float, <class 'numpy.ndarray'>
img_UMat = cv2.UMat(img_Mat)      # 16-bit float, <class 'cv2.UMat'>
\`\`\`

## OpenCV GPU 版本要怎麼安裝？


所需套件如下：

1. nVidia 驅動程式和 cuDNN。
2. CMake：cmake-3.20.0-rc3-windows-x86_64.msi（用來重新編譯支持 GPU 的 OpenCV）。
3. OpenCV 4.5.1：opencv-4.5.1.tar.gz。
4. OpenCV_contrib 4.5.1：opencv_contrib-4.5.1.tar.gz。

## 常見問題

### pip 安裝的 OpenCV 支援 GPU 嗎？

不支援。預設安裝的 OpenCV 不含 CUDA 模組，要使用 GPU 加速必須自行用 CMake 重新編譯 OpenCV 與 OpenCV_contrib，並搭配 nVidia 驅動程式與 cuDNN。

### 使用 GPU 版 OpenCV 程式碼要改很多嗎？

改動不大。關鍵是把影像資料包成 \`cv2.UMat\` 物件，OpenCV 就會把對應運算派送到 GPU 上執行；影像載入從 \`cv2.imread\` 得到的 numpy 陣列可以用 \`cv2.UMat(img)\` 轉換。

### 編譯 OpenCV GPU 版需要哪些套件？

需要 nVidia 驅動程式與 cuDNN、CMake（用來重新編譯）、OpenCV 原始碼（本篇以 4.5.1 為例），以及 OpenCV_contrib 同版本原始碼。編譯流程可參考文中連結的教學文章。

## 參考資料

- [OpenCV CUDA 官方說明頁](https://opencv.org/platforms/cuda/)

## 延伸閱讀

- [在 Python 裡面使用 GPU（一）：選擇適合的 GPU](/post/python-gpu-1-choose-gpu)：同樣聚焦 GPU、CUDA，可接著比較不同情境的做法。
- [使用 GPU 跑 TensorFlow 的除錯流程：版本、CUDA 與 zlibwapi.dll](/post/tensorflow-gpu-debugging)：同樣聚焦 GPU、CUDA，可接著比較不同情境的做法。
- [在 Python 裡面使用 GPU 3 – 開發 GPU 程式](/post/python-gpu-development)：同樣聚焦 GPU，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2023-01-03，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};