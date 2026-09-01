var e=`---
title: "TensorFlow 和 Keras 版本不相容錯誤：cannot import name 'dtensor' 解法"
description: "整理 TensorFlow 與 Keras 版本不相容造成 dtensor 匯入失敗的原因、錯誤訊息、修復指令與 conda 環境排查順序。"
date: 2023-01-03
category: 機器學習
tags: [TensorFlow, Keras, Python, 錯誤排解]
readingTime: 7 分鐘
image: /images/tech/hero_keras-introduction.webp
imageAlt: TensorFlow 和 Keras 版本不相容錯誤：cannot import name 'dtensor' 解法 hero image
---


# TensorFlow 和 Keras 版本不相容錯誤：cannot import name 'dtensor' 解法

TensorFlow 出現 \`ImportError: cannot import name 'dtensor' from 'tensorflow.compat.v2.experimental'\` 時，最常見原因是 TensorFlow 與 Keras 版本不相容。這次我當時的筆記裡，環境最後是用降版 Keras 解掉：保留 TensorFlow 2.6.0，改安裝 \`keras==2.6\`。

## 這個 dtensor 匯入錯誤代表什麼？

\`cannot import name 'dtensor'\` 代表 Keras 嘗試載入 TensorFlow 裡不存在或版本不吻合的 \`dtensor\` API。問題通常不在模型程式碼，而在 TensorFlow 與 Keras 套件版本沒有對齊。

當時看到的錯誤訊息如下：

\`\`\`text
ImportError: cannot import name 'dtensor' from 'tensorflow.compat.v2.experimental' (C:\\Users\\user\\.conda\\envs\\py392\\lib\\site-packages\\tensorflow\\_api\\v2\\compat\\v2\\experimental\\__init__.py)
\`\`\`

這段錯誤的關鍵字有三個：

| 關鍵字 | 代表意義 |
|---|---|
| \`keras\\dtensor\` | Keras 端正在載入 dtensor 相關模組 |
| \`tensorflow.compat.v2.experimental\` | Keras 期待 TensorFlow 提供對應 experimental API |
| \`.conda\\envs\\py392\` | 目前執行的是 conda 虛擬環境，不一定是系統 Python |

Stack Overflow 上同一類錯誤曾被歸因於 \`tensorflow==2.6.0\` 搭配 \`keras==2.9.0\` 的版本落差，建議解法是升 TensorFlow 或降 Keras（Stack Overflow，2022）。

## TensorFlow 和 Keras 版本為什麼會不相容？

TensorFlow 與 Keras 雖然常一起使用，但兩者仍是不同 Python 套件。當 \`pip install keras\` 裝到比 TensorFlow 更新的 Keras 版本時，Keras 可能呼叫舊版 TensorFlow 還沒有提供的 API。

TensorFlow 2.6 開始，Keras 程式碼已拆到獨立的 Keras pip package，但 \`tf.keras\` API 入口仍保留在 TensorFlow 裡（TensorFlow 2.6 release notes，2021）。這種拆分讓套件管理更彈性，也讓「單獨升級 Keras」變成可能踩到的坑。

Keras 官方目前也特別提醒：TensorFlow 2.0 到 TensorFlow 2.15 之間，安裝 \`tensorflow\` 會安裝對應的 Keras 2 版本，例如 \`tensorflow==2.14.0\` 對應 \`keras==2.14.0\`（Keras，存取日期：2026-08-28）。這個原則放回舊環境，就是不要讓 TensorFlow 2.6 搭到 Keras 2.9。

## 遇到 dtensor 錯誤要先檢查什麼？

遇到 dtensor 匯入錯誤時，先確認目前 Python、TensorFlow、Keras 是否來自同一個虛擬環境。不要急著重裝所有套件，先把版本列出來，才知道要升級 TensorFlow 還是降版 Keras。

可以先在終端機執行：

\`\`\`bash
python --version
python -m pip show tensorflow keras
python -m pip list | grep -E "tensorflow|keras"
\`\`\`

在 Windows conda 環境裡，我也會加查目前環境名稱：

\`\`\`bash
conda info --envs
where python
where pip
\`\`\`

如果 \`python\` 指向 conda 環境，但 \`pip\` 指到別的地方，套件就可能安裝到錯誤環境。這種狀況下，請優先使用 \`python -m pip install ...\`，讓 pip 跟目前執行的 Python 綁在一起。

## 這個錯誤可以怎麼修？

TensorFlow 與 Keras 版本不相容時，有兩條修復路線：升級 TensorFlow，或降版 Keras。舊專案通常先降版 Keras，因為模型程式碼、CUDA 與 wheel 檔可能都綁在舊 TensorFlow 版本上。

常見修復方式如下：

| 修復方式 | 指令 | 適合情境 |
|---|---|---|
| 升級 TensorFlow | \`pip install tensorflow==2.8\` | 專案可以接受 TensorFlow 升版 |
| 降版 Keras | \`pip install keras==2.6\` | 專案需要保留 TensorFlow 2.6 |

Stack Overflow 回答裡給的兩個方向是：

\`\`\`bash
pip install tensorflow==2.8
\`\`\`

或：

\`\`\`bash
pip install keras==2.6
\`\`\`

我當時最後採用的是第二個方向：

\`\`\`bash
pip install keras==2.6
\`\`\`

這段範例之所以有效，是因為 TensorFlow 2.6 與 Keras 2.6 版本重新對齊。若專案已經使用較新的 TensorFlow，請改用該 TensorFlow 版本對應的 Keras，不要直接照抄舊版號。

## 重建 conda TensorFlow 環境有用嗎？

重建 conda 環境可以清掉混亂依賴，但重建環境不會自動修正 TensorFlow 與 Keras 版本搭配。新環境仍要安裝彼此相容的 TensorFlow、Keras、Python、CUDA 與 wheel 檔。

我當時也試過重建一個新的 TensorFlow 環境：

\`\`\`bash
conda create -n tf-gpu python=3.9.2
conda activate tf-gpu
pip install --upgrade pip
pip install tensorflow_gpu-2.6.0-cp39-cp39-win_amd64.whl
\`\`\`

這條路線的重點是把 GPU 專案和其他 Python 專案隔離。TensorFlow 官方 Windows build 文件列出 \`tensorflow_gpu-2.6.0\` 對應 Python 3.6-3.9、CUDA 11.2、cuDNN 8.1（TensorFlow，存取日期：2026-08-28）。但我當時只重建環境仍然不行，最後還是要把 Keras 降回相容版本。

如果要重新建立環境，我會照這個順序檢查：

1. 先確認專案必須使用的 TensorFlow 版本。
2. 再確認 TensorFlow 支援的 Python 版本。
3. 如果是 GPU 環境，再確認 CUDA 與 cuDNN 版本。
4. 最後安裝對應 Keras 版本，避免單獨裝到過新的 Keras。

## 什麼時候該升 TensorFlow，什麼時候該降 Keras？

新專案可以優先升 TensorFlow，舊專案則常先降 Keras。判斷標準不是版本號越新越好，而是模型程式碼、部署環境與 GPU 依賴能不能一起升級。

我會用這張表決定：

| 狀況 | 建議做法 | 原因 |
|---|---|---|
| 剛開始的新專案 | 升 TensorFlow | 避免留在舊版 API 與舊版 Python |
| 已部署的舊專案 | 先降 Keras | 降低模型行為改變與 CUDA 重配成本 |
| 使用 Windows 原生 GPU 舊環境 | 先查 TensorFlow 版本表 | TensorFlow 官方說明 Windows 原生 CUDA GPU 支援停在 2.10 或更早版本（TensorFlow，存取日期：2026-08-28） |
| 不確定 pip 裝到哪裡 | 先查 \`python -m pip show\` | 避免在錯誤環境裡反覆安裝 |

對我來說，這個錯誤最值得記下來的不是 \`keras==2.6\` 這個指令，而是排查順序：先確認目前環境，再確認版本搭配，最後才改套件。

## 常見問題

### cannot import name 'dtensor' from tensorflow.compat.v2.experimental 是什麼意思？
這個錯誤代表 Keras 嘗試從 TensorFlow 匯入 \`dtensor\`，但目前 TensorFlow 版本沒有提供 Keras 期待的 API。最常見原因是 TensorFlow 太舊、Keras 太新，或 pip 把套件裝進錯誤的 Python 環境。

### TensorFlow 2.6 可以搭配 Keras 2.9 嗎？
TensorFlow 2.6 不建議搭配 Keras 2.9。這組版本曾出現 \`dtensor\` 匯入失敗，較穩的做法是把 Keras 降到 2.6，或把 TensorFlow 升到能支援該 Keras API 的版本。

### 我應該用 pip install tensorflow==2.8 還是 pip install keras==2.6？
如果專案可以升級 TensorFlow，先試 \`pip install tensorflow==2.8\`。如果專案卡在 TensorFlow 2.6、Python 3.9、CUDA 或舊模型部署環境，先試 \`pip install keras==2.6\` 會比較保守。

### 重建 conda 環境可以解決 TensorFlow 和 Keras 不相容嗎？
重建 conda 環境只能清掉混亂依賴，不能保證版本相容。重建後仍要明確安裝相容的 TensorFlow 與 Keras，例如 TensorFlow 2.6 搭配 Keras 2.6。

### 為什麼要用 python -m pip install 而不是直接 pip install？
\`python -m pip install\` 會使用目前 Python 對應的 pip，較不容易裝到別的環境。多個 conda 環境或系統 Python 並存時，直接 \`pip install\` 很容易把套件安裝到非預期位置。

### Windows TensorFlow GPU 舊環境還能照舊使用嗎？
舊環境可以維持可重現版本，但不適合隨意升級單一套件。TensorFlow 官方文件說明，Windows 原生 CUDA GPU 支援只到 TensorFlow 2.10 或更早版本；新環境通常要評估 WSL2 或其他安裝方式。

## 參考資料

- Stack Overflow，〈[Cannot import name 'dtensor' from 'tensorflow.compat.v2.experimental'](https://stackoverflow.com/questions/72255562/cannot-import-name-dtensor-from-tensorflow-compat-v2-experimental/72336599)〉，2022，存取日期：2026-08-28。
- TensorFlow，〈[Build from source on Windows](https://www.tensorflow.org/install/source_windows)〉，存取日期：2026-08-28。
- TensorFlow，〈[Install TensorFlow with pip](https://www.tensorflow.org/install/pip)〉，存取日期：2026-08-28。
- Keras，〈[Getting started with Keras](https://keras.io/getting_started/)〉，存取日期：2026-08-28。

## 延伸閱讀

- [Keras 介紹：用 Python 快速建立深度學習模型的高階 API](/post/keras-introduction)：同樣聚焦 Keras、TensorFlow，可接著比較不同情境的做法。
- [TensorFlow Estimator 介紹：用途、棄用原因與 Keras 替代寫法](/post/tensorflow-estimator-introduction)：同樣聚焦 TensorFlow、Keras，可接著比較不同情境的做法。
- [TensorFlow 2 Object Detection API 安裝教學與常見錯誤排解](/post/tensorflow-object-detection-api-setup)：同樣聚焦 TensorFlow、Python，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2026-08-28。我當時的筆記發布於 2023-01-03，本文保留 TensorFlow/Keras 版本不相容的錯誤訊息、conda 環境嘗試與最後有效的降版 Keras 解法，並補上 GEO Answer Blocks、FAQ、參考資料與站內延伸閱讀。
`;export{e as default};