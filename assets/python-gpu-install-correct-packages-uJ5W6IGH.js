var e=`---
title: 在 Python 使用 GPU：安裝正確 TensorFlow、PyTorch 與 CuPy 套件
description: 說明 Python 使用 GPU 的前置條件、TensorFlow GPU 套件安裝檢查，以及如何確認 TensorFlow、PyTorch、CuPy 是否能使用 GPU。
date: 2023-01-03
category: 機器學習
tags: [Python, GPU, TensorFlow]
readingTime: 6 分鐘
image: /images/tech/python-gpu-tensorflow-package-list.webp
imageAlt: TensorFlow 官方套件版本列表截圖
---


# 在 Python 使用 GPU：安裝正確 TensorFlow、PyTorch 與 CuPy 套件

Python 要使用 GPU 加速，除了電腦有 GPU 與驅動程式之外，還必須安裝支援 GPU 的 Python 套件。TensorFlow、PyTorch 或 CuPy 若安裝到 CPU 版本，即使硬體與驅動都正確，程式仍可能偵測不到可用 GPU。

## Python 使用 GPU 前要確認哪些條件？

Python 使用 GPU 前要確認三件事：硬體有支援的 GPU、系統已安裝正確驅動、Python 環境安裝的是支援 GPU 的函式庫。三項缺一項都可能導致 GPU 不可用。

前置作業可以整理成這張檢查表：

| 檢查項目 | 要確認的內容 | 常見問題 |
| --- | --- | --- |
| GPU 硬體 | 電腦是否有支援的 NVIDIA GPU 或其他加速硬體 | 筆電可能使用內顯執行 |
| 驅動程式 | 驅動與 CUDA/cuDNN 版本是否符合套件需求 | 驅動太舊或版本不相容 |
| Python 套件 | TensorFlow、PyTorch、CuPy 是否安裝 GPU 版本 | 裝到 CPU 版本 |
| 虛擬環境 | GPU 專案是否和舊 CPU 專案分開 | 依賴版本互相污染 |

如果電腦以前已安裝 CPU 版本 TensorFlow，建議新增一個虛擬環境，讓 GPU 專案的套件與舊環境分開。

## TensorFlow GPU 套件應該怎麼安裝？

TensorFlow GPU 套件應依官方 pip 安裝文件確認版本。安裝前應核對作業系統、Python 版本、CUDA 需求與套件名稱，避免下載不相容的 wheel 檔。

原文提到可參考 TensorFlow 官方 pip 安裝流程與 package location 列表。若想直接安裝特定 wheel 檔，可以使用類似下列指令：

\`\`\`bash
pip install tensorflow-*.whl
\`\`\`

![TensorFlow 官方套件版本列表](/images/tech/python-gpu-tensorflow-package-list.webp)

原始筆記中的範例檔名 \`tensorflow-apu-0.0.1-cp36-cp36m-linux_x86_64.whl\` 看起來像示意名稱，實作時應以官方頁面列出的實際 wheel 檔名為準。

## 如何檢查 TensorFlow 有沒有可用 GPU？

TensorFlow 可以用 \`tf.config.list_physical_devices("GPU")\` 檢查可見 GPU。若回傳空列表，通常代表驅動、CUDA 或安裝套件版本其中一項不正確。

\`\`\`py
import tensorflow as tf

print("TensorFlow version:", tf.__version__)
print("Available GPUs:", tf.config.list_physical_devices("GPU"))
\`\`\`

若要指定 TensorFlow 使用第一張 GPU，可以先檢查列表，再設定可見裝置：

\`\`\`py
import tensorflow as tf

gpus = tf.config.list_physical_devices("GPU")
print(gpus)

if gpus:
    tf.config.set_visible_devices(gpus[0], "GPU")
\`\`\`

實務上不要直接取 \`tf.config.list_physical_devices("GPU")[0]\`，因為沒有 GPU 時會出現 index error。先判斷 \`gpus\` 是否為空，會讓檢查流程更穩。

## PyTorch 和 CuPy 怎麼確認 GPU 可用？

PyTorch 使用 \`torch.cuda.is_available()\` 檢查 CUDA 是否可用。CuPy 則可透過 CUDA device 資訊確認目前可用的 GPU 裝置。

PyTorch 範例：

\`\`\`py
import torch

print(torch.cuda.is_available())

if torch.cuda.is_available():
    x = torch.ones((2, 2), device="cuda")
    print(x)
\`\`\`

CuPy 範例：

\`\`\`py
import cupy as cp

print(cp.cuda.Device().id)

x = cp.ones((2, 2))
print(x)
\`\`\`

不同套件的 GPU 支援方式不同，但排查順序類似：先看硬體與驅動，再看套件版本，最後看程式是否把張量或陣列放到 GPU 上。

## 常見問題
### TensorFlow 偵測不到 GPU 一定是顯卡壞掉嗎？

TensorFlow 偵測不到 GPU 不一定是硬體問題。更常見的原因是安裝了 CPU 版本套件、CUDA 版本不相容，或目前 Python 虛擬環境不是預期環境。

### Python GPU 專案需要建立新的虛擬環境嗎？

Python GPU 專案建議建立新的虛擬環境。GPU 套件通常對 Python、CUDA 與相依套件版本較敏感，和舊 CPU 環境混用容易出現衝突。

### PyTorch 可以只用 \`.to("cuda")\` 就啟用 GPU 嗎？

PyTorch 要先確認 \`torch.cuda.is_available()\` 回傳 True，再把張量或模型移到 CUDA 裝置。若 CUDA 不可用，\`.to("cuda")\` 會直接報錯。

### CuPy 和 NumPy 的差別是什麼？

CuPy 的 API 設計接近 NumPy，但陣列運算主要在 GPU 上執行。若程式已大量使用 NumPy，CuPy 常被用來降低 GPU 改寫成本。

## 參考資料
- TensorFlow 官方 pip 安裝文件，https://www.tensorflow.org/install/pip，存取日期：2026-08-27。
- PyTorch 官方安裝文件，https://pytorch.org/get-started/locally/，存取日期：2026-08-27。
- CuPy 官方安裝文件，https://docs.cupy.dev/en/stable/install.html，存取日期：2026-08-27。

## 延伸閱讀

- [在 Python 裡面使用 GPU 3 – 開發 GPU 程式](/post/python-gpu-development)：同樣聚焦 GPU、TensorFlow，可接著比較不同情境的做法。
- [在 Python 裡面使用 GPU（一）：選擇適合的 GPU](/post/python-gpu-1-choose-gpu)：同樣聚焦 Python、GPU，可接著比較不同情境的做法。
- [限制 TensorFlow 跑模型時使用的 GPU 記憶體上限？](/post/tensorflow-gpu-memory-limit)：同樣聚焦 TensorFlow、GPU，可接著比較不同情境的做法。
`;export{e as default};