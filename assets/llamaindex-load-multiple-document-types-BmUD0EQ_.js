var e=`---
title: "LlamaIndex 載入多種類文件教學：PDF、YouTube 字幕與圖片 Reader 完整用法"
description: "LlamaIndex 載入多種類文件完整教學：整理 PDFReader、YoutubeTranscriptReader、SimpleDirectoryReader 與 ImageCaptionReader 的用法，說明 download_loader 已棄用的新寫法、llamahub 查詢 Reader 的方式，以及圖片辨識需要 GPU 版 PyTorch 的注意事項。"
date: 2024-05-24
category: 機器學習
tags: [LlamaIndex, RAG, Python, 文件載入, LLM]
readingTime: 5 分鐘
image: /images/tech/hero_llamaindex-load-multiple-document-types.webp
imageAlt: "多種文件格式被載入 LlamaIndex 進行處理的示意圖"
---


# LlamaIndex 載入多種類文件教學：PDF、YouTube 字幕與圖片 Reader 完整用法

這篇文章整理我在使用 LlamaIndex 載入多種類文件時的筆記：怎麼用 \`SimpleDirectoryReader\` 讀取本地檔案、PDF 與 YouTube 字幕怎麼載入、\`download_loader\` 為什麼出現 DeprecationWarning，以及載入圖片時需要注意 GPU 版 PyTorch 的安裝。看完可以直接照著範例程式碼把各種格式的文件變成 LlamaIndex 的 documents。

## LlamaIndex 的教學資料在哪裡？

我在學 LlamaIndex 時主要參考這兩個資源：

- 教學課程（有許多簡單範例）：[LlamaIndex-course](https://github.com/SamurAIGPT/LlamaIndex-course)

## 怎麼用 LlamaIndex 載入 PDF？

範例程式載入 PDF 的寫法如下，透過 \`download_loader\` 取得 \`PDFReader\`：

\`\`\`python
from pathlib import Path
from llama_index.core import download_loader

PDFReader = download_loader("PDFReader")

loader = PDFReader()

pdf_document = loader.load_data(file=Path('./sample.pdf'))
\`\`\`

## 怎麼載入 YouTube 的字幕？

要讀 YouTube 影片的內容，可以用 \`YoutubeTranscriptReader\` 直接抓字幕：

\`\`\`python
from llama_index.core import download_loader

YoutubeTranscriptReader = download_loader("YoutubeTranscriptReader")

loader = YoutubeTranscriptReader()
youtube_documents = loader.load_data(ytlinks=['https://www.youtube.com/watch?v=nHcbHdgVUJg&ab_channel=WintWealth'])
\`\`\`

使用上面的寫法時，我會發現程式跳出這樣的警告：

> DeprecationWarning: Call to deprecated function (or staticmethod) download_loader. (\`download_loader()\` is deprecated. Please install tool using pip install directly instead.)
> PDFReader = download_loader("PDFReader")

也就是說 \`download_loader\` 已經被官方棄用了，接下來要改用新的檔案讀取方式。

## 新的文件讀取方式是什麼？

現在官方推薦的檔案讀取方式是 \`SimpleDirectoryReader\`，只要指定資料夾就會自動載入裡面的檔案：

\`\`\`python
from llama_index.core import SimpleDirectoryReader

documents = SimpleDirectoryReader("./files").load_data()
\`\`\`

不過，如果我們需要這個 Reader 使用特別的解析器去解析特別格式的文件（例如圖片），就要額外安裝相關的函式庫，如下面的介紹。

## 哪裡查得到各種 Reader 的清單？

當我查詢載入本地端檔案的 API 時，可以在這個頁面看到許多 Reader 的介紹：[LlamaIndex Readers API 文件](https://docs.llamaindex.ai/en/stable/api_reference/readers/file/)。

但如果直接在 \`llama_index.core\` 裡會找不到裡面許多的函數，這時候可以到 [LlamaHub](https://llamahub.ai/?tab=readers) 找，那邊有許多其他開發者開發的好用函式庫。

## 讀取各式文件的函式庫怎麼安裝與使用？

首先先安裝所需的套件：

\`\`\`bash
pip install llama-index-readers-file
\`\`\`

Reader 頁面中許多各式各樣的 Reader 則請參考此文件：[llama-index-readers-file](https://llamahub.ai/l/readers/llama-index-readers-file?from=readers)。

使用範例如下，下面這個例子我們可以用 \`doc.text\` 去取得這張圖片的文字描述：

\`\`\`python
from llama_index.core import SimpleDirectoryReader
from llama_index.readers.file import ImageCaptionReader
# Image Reader example
parser = ImageCaptionReader()
file_extractor = {
    ".jpg": parser,
    ".jpeg": parser,
    ".png": parser,
}  # Add other image formats as needed
documents = SimpleDirectoryReader(
    "./data", file_extractor=file_extractor
).load_data()
for index, doc in enumerate(documents):
    print(doc.text)
\`\`\`

## 為什麼載入圖片需要 GPU 版的 PyTorch？

要注意的是，當我們使用圖片閱讀器（\`ImageCaptionReader\`）時，事實上它會載入 [Hugging Face](https://huggingface.co/) 的一些 [transformers](https://discuss.huggingface.co/t/using-gpu-with-transformers/1827) 模型去做圖片辨識，而有一些模型只能使用 GPU。所以我們一定要記得 Pytorch 要安裝 GPU 版本的，可以參考官方文件：[PyTorch Get Started](https://pytorch.org/get-started/locally/)。

![GPU 版 PyTorch 安裝設定畫面](/images/articles/llamaindex-load-multiple-document-types-1.webp)

如果已經安裝了 CPU 版本的，記得先把 torch 反安裝後再重新安裝 GPU 版本。

## 常見問題

### LlamaIndex 的 download_loader 為什麼出現 DeprecationWarning？

因為 \`download_loader()\` 已被官方棄用，官方建議直接用 pip 安裝對應的 reader 套件（例如 \`llama-index-readers-file\`），再從 \`llama_index.readers.file\` 匯入使用。舊寫法仍可運作，但新專案建議改用新方式。

### LlamaIndex 怎麼載入本地資料夾裡的多種檔案？

用 \`SimpleDirectoryReader("./files").load_data()\`，它會自動根據副檔名選擇對應的解析器。如果某種格式需要特殊解析（如圖片產生文字描述），可以透過 \`file_extractor\` 參數指定專屬的 Reader。

### 用 LlamaIndex 讀取圖片需要注意什麼？

圖片 Reader 底層會使用 Hugging Face 的 transformers 模型做圖片辨識，部分模型只支援 GPU，因此必須安裝 GPU 版的 PyTorch。若先前裝的是 CPU 版，要先解除安裝 torch 再重裝 GPU 版。

## 參考資料

- [LlamaIndex-course（GitHub）](https://github.com/SamurAIGPT/LlamaIndex-course)
- [LlamaIndex Readers API 文件](https://docs.llamaindex.ai/en/stable/api_reference/readers/file/)
- [LlamaHub Readers](https://llamahub.ai/?tab=readers)
- [PyTorch 官方安裝文件](https://pytorch.org/get-started/locally/)

## 延伸閱讀

- [使用LlamaIndex載入多種類文件](/post/llamaindex-load-multiple-file-types)：同樣聚焦 LlamaIndex、RAG，可接著比較不同情境的做法。
- [使用 LlamaIndex 載入文檔：YouTube 字幕、PDF 與 Notion 一次搞定](/post/llamaindex-load-documents)：同樣聚焦 LlamaIndex、RAG，可接著比較不同情境的做法。
- [LlamaIndex 介紹：用 Python 建立 RAG 索引與查詢流程](/post/llamaindex-rag-introduction)：同樣聚焦 LlamaIndex、RAG，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2024-05-24，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};