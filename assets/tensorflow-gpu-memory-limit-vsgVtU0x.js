var e=`---
title: 限制 TensorFlow 跑模型時使用的 GPU 記憶體上限？
description: TensorFlow GPU 版一啟動就吃光顯示卡記憶體？本篇說明原因與改善方向，並提供 set_memory_growth 與 set_virtual_device_configuration 兩種限制 GPU 記憶體的做法。
date: 2023-01-04
category: 機器學習
tags: [TensorFlow, GPU, 記憶體管理, 深度學習, Python]
readingTime: 5 分鐘
image: /images/tech/hero_tensorflow-gpu-memory-limit.webp
imageAlt: GPU 記憶體容量與深度學習模型運算示意圖
---


# 限制 TensorFlow 跑模型時使用的 GPU 記憶體上限？

使用 TensorFlow GPU 版本跑模型時，常常一啟動就佔掉大半顯示卡記憶體。本篇說明為什麼會這樣、有哪些改善方向，以及如何用 \`set_memory_growth\` 或 \`set_virtual_device_configuration\` 限制 GPU 記憶體用量，最後介紹用 Task Manager 檢查 GPU 使用狀況的方法。

## 使用 tensorflow-gpu 結果耗一大堆 MEMORY 是為什麼？

使用 TensorFlow GPU 版本會耗費較多的記憶體，這是正常的。因為 GPU 設備有自己的內存，我們可以使用 GPU 設備加速計算。但是，這意味著 GPU 設備的內存也必須足夠大，以便容納計算所需的資料。

如果 GPU 的記憶體不夠大，則 TensorFlow 會改將原本要放在 GPU 記憶體內的資料放到 CPU 的記憶體裡面；若是 CPU 的記憶體也不足夠大，則很有可能會導致程式死掉（因為記憶體不足）。

## 有哪些改善方案？

可考慮的改善方向有以下三點：

- 模型太大，超出了 GPU 設備的內存限制：可以考慮使用更大的 GPU 設備或對模型進行優化，以減少模型的大小。（請參見：[如何縮小 TensorFlow 運算模型時使用的記憶體大小](/post/reduce-tensorflow-model-memory)）
- 程式碼中存在記憶體泄漏：請檢查程式碼，確保正確釋放不再使用的記憶體。
- GPU 設備的驅動程序版本過舊或損壞。

## 怎麼在程式碼裡限制 GPU 記憶體？

請參考這篇文章：<https://starriet.medium.com/tensorflow-2-0-wanna-limit-gpu-memory-10ad474e2528>

### 第一個選項：設置 set_memory_growth 為真

讓 TensorFlow 依需求逐步增加 GPU 記憶體用量，而不是一開始就吃滿：

\`\`\`py
import tensorflow as tf
gpus = tf.config.experimental.list_physical_devices('GPU')
if gpus:
  try:
    for gpu in gpus:
      tf.config.experimental.set_memory_growth(gpu, True)
  except RuntimeError as e:
    print(e)
\`\`\`

### 第二個選項：直接設定記憶體上限

將第一個 GPU 的內存使用量限制為 1024MB，\`gpus\` 與 \`memory_limit\` 只需根據需要更改索引和數值即可：

\`\`\`py
import tensorflow as tf
gpus = tf.config.experimental.list_physical_devices('GPU')
if gpus:
  try:
    tf.config.experimental.set_virtual_device_configuration(gpus[0],
        [tf.config.experimental.VirtualDeviceConfiguration(memory_limit=1024)])
  except RuntimeError as e:
    print(e)
\`\`\`

我使用了第二個方法成功解決佔用太大記憶體的問題。

## 怎麼用 Task Manager 查看 GPU 使用狀況？

使用 Windows 任務管理器可以檢查 GPU 設備的內存使用情況，步驟如下：

1. 在 Windows 任務欄中，右鍵單擊「資源監視器」圖示。
2. 在「資源監視器」窗口中，展開「性能」窗格。
3. 在「性能」窗格中，展開「視覺效果」窗格。
4. 在「視覺效果」窗格中，展開「DirectX 內存使用量」窗格。

下圖為任務管理器中的 GPU 記憶體使用狀況：

![Windows 任務管理器顯示 GPU 記憶體使用量的截圖](/images/articles/tensorflow-gpu-memory-limit-1.webp)

「DirectX 內存使用量」只包含 GPU 設備上運行的應用程序所使用的內存，不包含 GPU 設備本身的內存。如果需要更詳細的信息，可以使用 NVIDIA System Monitor 或其他第三方軟件工具檢查 GPU 設備的內存使用情況。

## 常見問題

### 為什麼 TensorFlow 一啟動就佔用大量 GPU 記憶體？

TensorFlow 預設會盡量把 GPU 記憶體配置給自己，以容納模型與計算所需的資料，這是正常行為。若想避免一開始就吃滿顯存，可以開啟 \`set_memory_growth\`，或用 \`set_virtual_device_configuration\` 設定上限。

### set_memory_growth 和 set_virtual_device_configuration 有什麼差別？

\`set_memory_growth\` 是讓 TensorFlow 依實際需求逐步增加記憶體用量，不設上限；\`set_virtual_device_configuration\` 則是直接指定一個固定的記憶體上限（例如 1024MB），超過就可能出現 OOM 錯誤。需要與其他程式共用顯卡時，後者更可控。

### GPU 記憶體不足時會發生什麼事？

TensorFlow 會把原本要放在 GPU 記憶體的資料改放到 CPU 的記憶體，速度會明顯下降；若 CPU 記憶體也不夠，程式可能直接因記憶體不足而中斷。

### 怎麼確認 GPU 記憶體真的被限制了？

可以在 Windows 任務管理器的「性能」窗格中查看「DirectX 內存使用量」，或使用 NVIDIA System Monitor 等第三方工具觀察實際用量變化。注意「DirectX 內存使用量」只顯示應用程式使用的部分，不含 GPU 設備本身的內存。

## 參考資料

- [TensorFlow 2.0: Wanna limit GPU memory?（Medium）](https://starriet.medium.com/tensorflow-2-0-wanna-limit-gpu-memory-10ad474e2528)
- [如何縮小 TensorFlow 運算模型時使用的記憶體大小](/post/reduce-tensorflow-model-memory)

## 延伸閱讀

- [在 Python 裡面使用 GPU 3 – 開發 GPU 程式](/post/python-gpu-development)：同樣聚焦 GPU、TensorFlow，可接著比較不同情境的做法。
- [在 Python 使用 GPU：安裝正確 TensorFlow、PyTorch 與 CuPy 套件](/post/python-gpu-install-correct-packages)：同樣聚焦 Python、GPU，可接著比較不同情境的做法。
- [在 Python 裡面使用 GPU（一）：選擇適合的 GPU](/post/python-gpu-1-choose-gpu)：同樣聚焦 Python、GPU，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2023-01-04，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};