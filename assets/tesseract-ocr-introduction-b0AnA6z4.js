var e=`---
title: "Tesseract OCR 介紹：Google 開源光學文字辨識工具怎麼用"
description: 介紹 Tesseract OCR 的多語言辨識能力、CentOS 安裝步驟，並用 pytesseract 示範 Python 呼叫繁體中文 OCR 的程式碼。
date: 2024-06-24
category: 機器學習
tags: [OCR, Tesseract, 電腦視覺]
readingTime: 5 分鐘
image: /images/tech/hero_tensorflow-object-detection-api-overview.webp
imageAlt: Tesseract OCR 介紹：Google 開源光學文字辨識工具怎麼用 技術文章封面圖
---


# Tesseract OCR 介紹：Google 開源光學文字辨識工具怎麼用

Tesseract 是一個開源的光學字符識別（OCR）引擎，能夠將圖像中的文本轉換為可編輯的文本。它由 Google 維護和開發，支持多種語言和字符集。

GitHub 位置：[tesseract-ocr/tesseract](https://github.com/tesseract-ocr/tesseract)

## Tesseract 的核心引擎和支援格式有哪些？

Tesseract 4 添加了一個新的基於神經網路（LSTM）的 OCR 引擎，該引擎專注於行識別，但仍然支援 Tesseract 3 的傳統 OCR 引擎，該引擎透過識別字元模式來工作。使用舊版 OCR 引擎模式（\`--oem 0\`）可以啟用與 Tesseract 3 的相容性，但也需要支援舊引擎的 traineddata 檔（例如來自 tessdata 儲存庫的檔案）。

Tesseract 支援 Unicode（UTF-8），可以「開箱即用」地識別 100 多種語言。支援多種圖像格式，包括 PNG、JPEG 和 TIFF。支援各種輸出格式：純文本、hOCR（HTML）、PDF、不可見文本 PDF、TSV、ALTO 和 PAGE。

### 主要功能和特點

1. **多語言支持**：Tesseract 支持超過 100 種語言，包括繁體中文。
2. **高準確度**：Tesseract 在文本識別方面具有較高的準確度，特別是經過適當的預處理後。
3. **易於集成**：Tesseract 可以與多種編程語言和工具集成，例如 Python、C++、Java 等，方便開發者在不同的應用場景中使用。
4. **開源和免費**：Tesseract 是開源軟件，可以自由使用和修改。

## 怎麼在 CentOS 安裝 Tesseract？

需要安裝兩個部分：引擎本身和語言的 traineddata。超過 130 種語言和超過 35 種腳本的軟體包也可以直接從 Linux 發行版取得。語言 traineddata 包稱為 \`tesseract-ocr-langcode\` 和 \`tesseract-ocr-script-scriptcode\`，其中 \`langcode\` 是三個字母的語言代碼，\`scriptcode\` 是四個字母的腳本代碼。

完整安裝教學可以參考官方文件：[Installation on openSUSE](https://tesseract-ocr.github.io/tessdoc/InstallationOpenSuse.html)。

以 root 身份在 CentOS 7 運行以下命令：

\`\`\`bash
yum-config-manager --add-repo https://download.opensuse.org/repositories/home:/Alexander_Pozdnyakov/CentOS_7/
sudo rpm --import https://build.opensuse.org/projects/home:Alexander_Pozdnyakov/public_key
yum update
yum install tesseract
yum install tesseract-langpack-deu
\`\`\`

## 除了套件管理器安裝，還有其他方式嗎？

也可以直接用 AppImage 執行：

- 從發佈頁面下載 AppImage
- 開啟終端應用程式
- 瀏覽到 AppImage 的位置
- 使 AppImage 可執行：\`chmod a+x tesseract*.AppImage\`
- 執行它：\`./tesseract*.AppImage -l eng page.tif page.txt\`

## 怎麼用 Python 呼叫 Tesseract 做 OCR？

\`pytesseract\` 是一個 Python 包裝器，用於調用 Tesseract OCR 引擎。先安裝套件：

\`\`\`bash
pip install pytesseract
pip install pillow
\`\`\`

接著就可以用幾行程式碼對圖片做 OCR，這裡示範讀取繁體中文語言包：

\`\`\`python
from PIL import Image
import pytesseract

# 設定 tesseract 執行檔的路徑
pytesseract.pytesseract.tesseract_cmd = r'/usr/local/bin/tesseract'  # 替換為你的 tesseract 安裝路徑

# 打開圖像文件
image = Image.open('example.png')

# 使用 Tesseract 進行 OCR
text = pytesseract.image_to_string(image, lang='chi_tra')  # 使用繁體中文語言包
print(text)
\`\`\`

## 常見問題

### Tesseract 辨識繁體中文效果好嗎？

Tesseract 支援繁體中文（\`chi_tra\` 語言包），但辨識準確度會受圖片品質、字體、排版影響很大。對於掃描件或雜訊較多的圖片，通常需要先做二值化、去噪等前處理，才能得到比較穩定的辨識結果。

### \`--oem 0\` 和預設的 LSTM 引擎差在哪？

\`--oem 0\` 是切換回 Tesseract 3 時代、依字元模式識別的傳統引擎，需要對應的舊版 traineddata 檔；預設的 LSTM 引擎則是 Tesseract 4 之後主推的神經網路行識別引擎，多數情況下準確度會比傳統引擎好。

### pytesseract 找不到 tesseract 執行檔怎麼辦？

要先確認系統上已經裝好 Tesseract 本體（前面 CentOS 安裝步驟那個引擎），再把 \`pytesseract.pytesseract.tesseract_cmd\` 設成該執行檔的實際路徑；不同作業系統的預設安裝路徑不同，Windows 常見在 \`C:\\Program Files\\Tesseract-OCR\\tesseract.exe\`。

## 參考資料

- [tesseract-ocr/tesseract](https://github.com/tesseract-ocr/tesseract)
- [Installation on openSUSE](https://tesseract-ocr.github.io/tessdoc/InstallationOpenSuse.html)

## 延伸閱讀

- [Transformer 模型於機器視覺的應用](/post/transformer-computer-vision-applications)：同樣聚焦 電腦視覺，可接著比較不同情境的做法。
- [TensorFlow 目標檢測 API：訓練自己的資料](/post/tensorflow-object-detection-custom-training)：同樣聚焦 電腦視覺，可接著比較不同情境的做法。
- [讓 OpenCV 支持 GPU](/post/opencv-gpu-support)：同樣聚焦 電腦視覺，可接著比較不同情境的做法。

## 最後更新

2026-08-28

`;export{e as default};