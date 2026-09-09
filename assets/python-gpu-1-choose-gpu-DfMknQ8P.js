var e=`---
title: 在 Python 裡面使用 GPU（一）：選擇適合的 GPU
description: 在 Python 裡使用 GPU 前要先選對顯示卡。本篇整理 NVIDIA GPU 的 CUDA 支援查詢方式、深度學習訓練的顯示卡等級與 VRAM 記憶體需求，幫你判斷跑 TensorFlow 或 PyTorch 該準備哪張 GPU。
date: 2023-01-03
category: 機器學習
tags: [Python, GPU, cuDNN, CuPy, CUDA]
readingTime: 5 分鐘
image: /images/tech/hero_python-gpu-1-choose-gpu.webp
imageAlt: GPU 硬體與深度學習框架加速概念示意圖
---


# 在 Python 裡面使用 GPU（一）：選擇適合的 GPU

在 Python 裡要使用 GPU 做運算，必須呼叫 GPU 操作的方法來操作目標物件。因此能不能支持 GPU 運算，關鍵在於套件本身有沒有開發針對該 GPU 操作的模組版本。本篇整理目前主流的 GPU 加速方案：nVidia cuDNN、CuPy，以及 Intel 的選項，並說明 cuDNN 的軟體需求，幫助你在寫第一行程式碼之前先選對方向。

## 在 Python 使用 GPU 的前提是什麼？

在 Python 裡面要使用 GPU 做運算，需要去呼叫 GPU 操作的方法來操作目標對象。所以，能不能支持 GPU 運算，和套件本身有沒有開發針對該 GPU 操作的模組版本，是最為相關的。

對於 Python 常用的模組，最廣泛有提供 GPU 操作版本的是針對 nVidia 裡的 CUDA 深度神經網絡（cuDNN）庫的支持。

## nVidia cuDNN 是什麼？

以下為官網的介紹：

> NVIDIA CUDA® 深度神經網絡庫（\`cuDNN\`）是一個 GPU 加速的深度神經網絡原語庫。cuDNN 為標準例程提供高度調整的實現，例如前向和反向卷積、池化、歸一化和激活層。
>
> 全球的深度學習研究人員和框架開發人員都依賴 cuDNN 來實現高性能 GPU 加速。它使他們能夠專注於訓練神經網絡和開發軟件應用程序，而不是將時間花在低級 GPU 性能調整上。
>
> cuDNN 可加速廣泛使用的深度學習框架，包括 \`Caffe2\`、\`Chainer\`、\`Keras\`、\`MATLAB\`、\`MxNet\`、\`PaddlePaddle\`、\`PyTorch\` 和 \`TensorFlow\`。要訪問已將 cuDNN 集成到框架中的 NVIDIA 優化深度學習框架[容器](https://developer.nvidia.com/ai-hpc-containers)，請訪問 [NVIDIA GPU CLOUD](https://www.nvidia.com/en-us/gpu-cloud/) 以了解更多信息並開始使用。

## numpy 不支持 GPU，那 CuPy 是什麼？

因為原本的 numpy 並不支持 GPU，因此社群提供了 CuPy，其接口高度雷同於 numpy，在大多數情況下可以用作直接替代品。要做的只是在 Python 代碼中用 CuPy 換 numpy。例如：

\`\`\`py
import cupy as cp
x = cp.arange(6).reshape(2, 3).astype('f')
\`\`\`

CuPy 官網：<https://cupy.dev/>

## Intel 也有 Python GPU 方案嗎？

有少數的模組也有提供支持 Intel 的另一個 GPU 操作函式庫，如 NumPy、SciPy 和 Numba，相關資料如下：

- [Intel® Distribution for Python*](https://www.intel.com/content/www/us/en/developer/tools/oneapi/distribution-for-python.html)
- [Powerful Data Science Software Demands Powerful Hardware](https://www.anaconda.com/partners/intel)
- [可支持英特爾 GPU 的軟件列表](https://anaconda.cloud/intel-optimized-packages)

## 我該選擇適合的 GPU？

若希望能夠使用 GPU 來支持 Python，最重要的就是先確認你要使用哪些函式庫，然後去尋找該函式庫所支持的 GPU 版本。

但以一般情況來說，大多都是會選用 nVidia 的 cuDNN 來做 GPU 版本的開發，因為他所支持的函式庫最為完整，即便 numpy 並不支持，也都有其他開發者開發出相似功能的函式庫作為取代。

以下為 cuDNN 的相關介紹：<https://developer.nvidia.com/cudnn>

## cuDNN 的軟體需求有哪些？

您的系統上必須安裝下列 NVIDIA® 軟體：

- [NVIDIA® GPU 驅動程式](https://www.nvidia.com/drivers)：CUDA® 11.2 需要 450.80.02 以上版本。
- [CUDA® Toolkit](https://developer.nvidia.com/cuda-toolkit-archive)：TensorFlow 支持 CUDA® 11.2（TensorFlow 2.5.0 以上版本）。
- CUDA® Toolkit 隨附 [CUPTI](http://docs.nvidia.com/cuda/cupti/)。
- [cuDNN SDK 8.1.0](https://developer.nvidia.com/cudnn)（[cuDNN 版本](https://developer.nvidia.com/rdp/cudnn-archive)）。
- （選用）TensorRT 6.0 可改善某些模型的推論延遲情況和總處理量。

更多資訊請見：<https://www.tensorflow.org/install/gpu?hl=zh-tw#hardware_requirements>

安裝細節教學請見：<https://ithelp.ithome.com.tw/articles/10249572>

## 常見問題

### Python 使用 GPU 加速一定要用 nVidia 的顯卡嗎？

不一定要，但 nVidia 的 cuDNN 生態系最完整，TensorFlow、PyTorch、Keras 等主流框架都有針對 CUDA/cuDNN 的 GPU 版本。若使用 Intel GPU，則可考慮 Intel Distribution for Python 中的 NumPy、SciPy 與 Numba。

### numpy 本身支持 GPU 嗎？

numpy 本身並不支持 GPU。若需要 numpy 風格的 GPU 運算，可以使用 CuPy，其接口與 numpy 高度相似，大多數情況下只要把 \`import numpy\` 換成 \`import cupy\` 就能直接替代。

### 安裝 cuDNN 前需要準備什麼？

需要先安裝 NVIDIA GPU 驅動程式（CUDA 11.2 需要 450.80.02 以上版本）與 CUDA Toolkit，並搭配 cuDNN SDK 8.1.0。版本之間有相容性要求，建議先確認你要用的框架（如 TensorFlow）支援的 CUDA 版本再安裝。

### CuPy 可以完全取代 numpy 嗎？

在大多數情況下可以作為直接替代品，因為接口高度雷同。但仍需留意部分 API 的行為差異，以及資料在 CPU 與 GPU 記憶體之間的傳輸成本，小規模運算時加速效果可能不明顯。

## 參考資料

- [NVIDIA cuDNN 官網](https://developer.nvidia.com/cudnn)
- [CuPy 官網](https://cupy.dev/)
- [TensorFlow GPU 硬體需求](https://www.tensorflow.org/install/gpu?hl=zh-tw#hardware_requirements)
- [Intel® Distribution for Python*](https://www.intel.com/content/www/us/en/developer/tools/oneapi/distribution-for-python.html)

## 延伸閱讀

- [在 Python 裡面使用 GPU 3 – 開發 GPU 程式](/post/python-gpu-development)：同樣聚焦 GPU、Python，可接著比較不同情境的做法。
- [在 Python 使用 GPU：安裝正確 TensorFlow、PyTorch 與 CuPy 套件](/post/python-gpu-install-correct-packages)：同樣聚焦 Python、GPU，可接著比較不同情境的做法。
- [讓 OpenCV 支持 GPU](/post/opencv-gpu-support)：同樣聚焦 GPU、CUDA，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2023-01-03，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};