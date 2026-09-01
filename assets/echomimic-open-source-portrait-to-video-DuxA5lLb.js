var e=`---
title: EchoMimic – 人物圖片轉影片的開源模型
description: EchoMimic 是一款將人物圖片轉換為逼真說話影片的開源 AI 模型。本文介紹它的肖像動畫原理、音頻驅動面部關鍵點的工作流程，並附上 CUDA、PyTorch、Conda 與 FFmpeg 的完整安裝教學，幫助你在本機 GPU 環境快速跑出第一支人物說話影片。
date: 2024-07-24
category: 生成式AI
tags: [EchoMimic, 生成式AI, 肖像動畫, 影片生成, GPU]
readingTime: 3 分鐘
image: /images/tech/hero_echomimic-open-source-portrait-to-video.webp
imageAlt: 人物照片透過 AI 轉換為說話影片的視覺化示意
---


# EchoMimic – 人物圖片轉影片的開源模型

EchoMimic 是一款開源 AI 工具，可以將人物圖片轉換為逼真的說話影片。它採用創新的肖像圖像動畫技術，能夠透過組合音頻訊號和面部關鍵點來生成生動自然的影片。這篇筆記記錄我在 Windows GPU 環境從零安裝到成功產出影片的完整流程。

## EchoMimic 是怎麼把圖片變成說話影片的？

EchoMimic 的核心是音頻驅動的肖像動畫（Audio-driven Portrait Animation）。整個流程可以拆成四個步驟：

1. 首先，需要將人物圖片和音頻輸入到模型中。
2. 模型會提取音頻中的音素（phoneme）和人物圖片中的面部關鍵點。
3. 然後，模型會利用這些資訊生成相應的面部動畫。
4. 最後，將生成的面部動畫與原來的圖片合成，得到最終的說話影片。

## 實際輸入與輸出長什麼樣？

我實測的例子是：給一張靜態人物圖片

![EchoMimic 輸入的人物圖片範例](/images/articles/echomimic-1.webp)

再加上一段這樣的英文語音檔（\`echomimic_en.wav\`），就可以合成出對應嘴型的說話影片（原始檔為 MP4 格式）：

模型的輸出是完整的 MP4 影片，嘴型會跟隨音檔內容變化，最終產出的檔案會位於 \`output\` 資料夾下。

## 安裝 EchoMimic 前需要準備什麼？

事前作業有兩項，重點都圍繞在 GPU 環境：

1. 先安裝 CUDA 和 CUDNN（<https://developer.nvidia.com/cuda/toolkit>）。
2. 接著安裝可支援 GPU 的 PyTorch。要注意的是，PyTorch 所支援的 CUDA 版本有可能無法支援最新的，我們可以在官網看現在最新支援到哪個版本的 CUDA。以下圖為例，我所安裝的 CUDA 版本就不可以高於 CUDA 12.1。

![PyTorch 官網顯示支援的 CUDA 版本](/images/articles/echomimic-2.webp)

## 如何安裝並執行 EchoMimic？

接著下載 EchoMimic 專案，並創建新的 Conda 環境，安裝所需函式庫：

\`\`\`bash
git clone https://github.com/BadToBest/EchoMimic
cd EchoMimic
conda create -n echomimic python=3.8
conda activate echomimic
pip install -r requirements.txt
\`\`\`

然後到這邊下載 FFmpeg：<https://www.gyan.dev/ffmpeg/builds/>

此為一個範例的下載網址：<https://www.gyan.dev/ffmpeg/builds/ffmpeg-git-full.7z>

接著將 ffmpeg 的 exe 的路徑加入環境變數的 path 當中，如果能夠在 CMD 裡面輸入 \`ffmpeg\` 看到版本回覆，代表安裝成功。

接著下載預訓練權重：

![EchoMimic 預訓練權重下載說明](/images/articles/echomimic-3.webp)

\`\`\`bash
git lfs install
git clone https://huggingface.co/BadToBest/EchoMimic pretrained_weights
\`\`\`

然後修改 \`configs/prompts\` 裡面的 yaml 檔案，接著執行 Python 推論腳本：

\`\`\`bash
python -u infer_audio2vid.py
python -u infer_audio2vid_pose.py
\`\`\`

就可以看見執行的狀態，最終產生的檔案會位於 \`output\` 資料夾下。

## 常見問題

### EchoMimic 需要什麼樣的硬體環境？

EchoMimic 依賴 GPU 推論，需要先安裝 NVIDIA 的 CUDA 與 CUDNN，並安裝支援 GPU 的 PyTorch 版本。安裝 PyTorch 時要留意它支援的 CUDA 版本上限，CUDA 不能裝得比它支援的版本還新。

### 為什麼安裝 EchoMimic 還需要 FFmpeg？

EchoMimic 在合成影片時會使用 FFmpeg 處理音訊與影片的編碼、合成工作。安裝後要把 ffmpeg 的執行檔路徑加入環境變數 PATH，才能在命令列直接呼叫。

### 預訓練權重要怎麼下載？

權重放在 Hugging Face 的 BadToBest/EchoMimic 儲存庫，需要先用 \`git lfs install\` 啟用 Git LFS，再用 \`git clone\` 把整個儲存庫下載為專案內的 \`pretrained_weights\` 資料夾。

### 執行後的影片輸出到哪裡？

執行 \`infer_audio2vid.py\` 或 \`infer_audio2vid_pose.py\` 之後，最終產生的說話影片會位於專案的 \`output\` 資料夾下。

## 參考資料

- [EchoMimic GitHub 專案](https://github.com/BadToBest/EchoMimic)
- [NVIDIA CUDA Toolkit](https://developer.nvidia.com/cuda/toolkit)
- [FFmpeg Windows builds](https://www.gyan.dev/ffmpeg/builds/)
- [Hugging Face 預訓練權重](https://huggingface.co/BadToBest/EchoMimic)

## 延伸閱讀

- [EchoMimic：人物圖片轉影片的開源模型，安裝與使用教學](/post/echomimic-open-source-portrait-to-video)：同樣聚焦 EchoMimic、肖像動畫，可接著比較不同情境的做法。
- [Animate Anyone: 圖片+骨架動畫產生動態影片](/post/animate-anyone-image-skeleton-animation)：同樣聚焦 生成式AI、影片生成，可接著比較不同情境的做法。
- [Animate Anyone: 用一張圖片加骨架動畫生成動態影片的 AI 模型](/post/animate-anyone-image-skeleton-animation)：同樣聚焦 生成式AI，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2024-07-24，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};