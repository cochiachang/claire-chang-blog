var e=`---
title: 了解 Python 載入模組的位置與搜尋路徑
description: 查出 Python import 實際從哪些路徑載入模組：python -m site、sys.path、site.getsitepackages()，以及用 PYTHONPATH、.pth 檔與 python39._pth 自行增加模組搜尋路徑的三種方法。
date: 2023-01-03
category: 後端開發
tags: [Python, import, sys.path, PYTHONPATH, site-packages]
readingTime: 4 分鐘
image: /images/tech/hero_python-module-load-location.webp
imageAlt: 螢幕上顯示滿滿程式碼的畫面
---


# 了解 Python 載入模組的位置與搜尋路徑

當 \`import cv2\` 載入的版本不如預期，或者想安裝自己的模組路徑時，就得搞清楚 Python 到底從哪些地方載入模組。這篇筆記整理在 command line 與程式碼內查詢模組搜尋路徑的方法，以及三種自行增加載入路徑的方式。

## Python 是怎麼載入模組的？

一般來說，我們在專案裡面會使用 \`import\` 來載入現有模組：

\`\`\`python
import cv2
\`\`\`

## 怎麼在 command line 查詢會從哪些路徑載入？

1. 取得 global 的 site-packages 路徑：

\`\`\`bash
python -m site
\`\`\`

2. 取得該使用者的 library 路徑（per-user）：

\`\`\`bash
python -m site --user-site
\`\`\`

## 怎麼在 Python 程式碼內查詢載入路徑？

那麼，這個 cv2 的預設位置在哪邊呢？會從哪裡載入呢？想要了解這個問題，可以在 py 檔案裡面使用下列程式碼，印出會載入的 library 位置：

\`\`\`python
import sys
from os.path import dirname
print(sys.path)
\`\`\`

![執行 print(sys.path) 後在終端機印出的一串模組搜尋路徑截圖](/images/articles/python-module-load-location-1.webp)

也可以使用 \`site.getsitepackages()\` 或 \`site.getusersitepackages()\` 來了解現在會載入的函式庫位置：

\`\`\`python
import sys, site
site.getsitepackages()
site.getusersitepackages()
\`\`\`

## 怎麼自行增加載入模組的路徑？

若想要自行增加模組的位置，則使用：

\`\`\`python
sys.path.append(dirname(__file__))
\`\`\`

上面程式碼代表會增加搜尋位於 \`dirname(__file__)\` 的檔案。

## 設定載入函式庫路徑的方法有哪些？

有以下三種方法：

1. 添加環境變數 \`PYTHONPATH\`，Python 會添加此路徑下的模組。在 \`.bash_profile\` 文件中添加如下類似行：\`export PYTHONPATH=$PYTHONPATH:/usr/local/lib/python2.7/site-packages\`
2. 在 \`site-packages\` 路徑下添加一個路徑配置文件，文件的擴展名為 \`.pth\`，內容為要添加的路徑即可
3. 用 \`sys.path.append()\` 函數添加搜索路徑，參數值即為要添加的路徑


![site-packages 資料夾內容截圖，可看到 .pth 路徑設定檔](/images/articles/python-module-load-location-2.webp)

可以先用上面的語法來尋找可能的函式庫搜尋路徑位置設定檔案的地方，看看在 site-packages 資料夾裡面是否有任何的 \`.pth\` 檔案。一般來說，這個檔案會位於 site-packages 裡面，如：\`C:\\Python39\\Lib\\site-packages\`。

## 什麼是 python39._pth？怎麼用它設定載入路徑？

或者可以直接在 Python 的根目錄下增加 \`python39._pth\` 這個檔案，然後直接在檔案裡面增加要載入的路徑即可，內容直接填上路徑。以下為一個簡單的 \`python39._pth\` 內容範例：

![python39._pth 檔案內容範例截圖](/images/articles/python-module-load-location-3.webp)

把檔案放在與 python.exe 同一目錄：

![python39._pth 與 python.exe 放在同一目錄的檔案總管截圖](/images/articles/python-module-load-location-4.webp)

## 常見問題

### Python import 一個模組時的搜尋順序是什麼？

Python 會依 \`sys.path\` 列表中的順序搜尋：先是目前腳本所在目錄，再來是 \`PYTHONPATH\` 環境變數中的路徑，最後是標準庫與 site-packages。先被找到的同名模組會先被載入。

### .pth 檔案要放在哪裡才會生效？

要放在 site-packages 目錄下（例如 \`C:\\Python39\\Lib\\site-packages\`），內容每行寫一個要加入 \`sys.path\` 的路徑。Python 啟動時會由 site 模組自動讀取。

### python39._pth 和 .pth 有什麼不同？

\`python39._pth\` 要放在與 python.exe 同一目錄，它會完全接管 Python 的路徑設定（啟用後 site-packages 需要自己列進去）；\`.pth\` 則是放在 site-packages 裡做增量補充，兩者作用層級不同。

## 參考資料


## 延伸閱讀

- [為每個 Python 專案建立獨立的虛擬環境](/post/python-virtual-environment-per-project)：同樣聚焦 Python，可接著比較不同情境的做法。
- [使用 Conda 管理 Python 版本與函式庫](/post/conda-python-environment-management)：同樣聚焦 Python，可接著比較不同情境的做法。
- [生成只包含專案使用的 Library 列表：用 pipreqs 產生 requirements.txt](/post/generate-used-library-list)：同樣聚焦 Python，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2023-01-03，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};