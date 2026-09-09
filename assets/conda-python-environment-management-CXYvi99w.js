var e=`---
title: 使用 Conda 管理 Python 版本與函式庫
description: 整理 Conda 在 Windows CMD 的設定、建立虛擬環境、environment.yml、spec 匯出與環境移除。
date: 2023-01-03
category: 後端開發
tags: [Conda, Python, 虛擬環境, Anaconda]
readingTime: 8 分鐘
image: /images/tech/2023-01-04_155944.webp
imageAlt: Windows 環境變數中設定 Anaconda 路徑的畫面
---


# 使用 Conda 管理 Python 版本與函式庫

Conda 可以同時管理 Python 版本、套件與虛擬環境。當不同專案需要不同 Python 版本或函式庫組合時，Conda 能避免套件互相污染，也方便把環境設定交給其他人重建。

## Windows CMD 找不到 conda 怎麼辦？

Windows CMD 找不到 \`conda\` 通常是因為 Anaconda 或 Miniconda 未安裝，或安裝路徑沒有加入系統環境變數。先檢查安裝，再檢查 PATH。

![Windows 環境變數設定 Anaconda 路徑](/images/tech/2023-01-04_155944.webp)

如果系統尚未安裝 Anaconda 或 Miniconda，可先到 Anaconda 官方網站下載安裝：

<https://www.anaconda.com/products/individual>

安裝後若 PowerShell 或 CMD 出現以下訊息：

\`\`\`text
conda : The term 'conda' is not recognized as the name of a cmdlet,
function, script file, or operable program. Check the spelling of the name,
or if a path was included, verify that the path is correct and try again.
\`\`\`

可以打開 Anaconda Prompt 或命令提示字元執行：

\`\`\`bash
conda init
\`\`\`

重新開啟終端機後，再執行 \`conda --version\` 驗證。

## 如何用 Conda 建立虛擬環境？

Conda 建立虛擬環境時，可以只指定環境名稱，也可以同時指定 Python 版本與套件。建議每個專案使用獨立環境。

建立環境：

\`\`\`bash
conda create --name myenv
\`\`\`

使用特定 Python 版本：

\`\`\`bash
conda create -n myenv python=3.9
\`\`\`

使用特定 Python 版本與多個套件：

\`\`\`bash
conda create -n myenv python=3.9 scipy=0.17.3 astroid babel
\`\`\`

啟動環境：

\`\`\`bash
conda activate myenv
\`\`\`

查看環境：

\`\`\`bash
conda env list
conda info --envs
\`\`\`

## 如何從 environment.yml 建立環境？

\`environment.yml\` 是 Conda 專案常用的環境描述檔。\`environment.yml\` 比單純 \`pip freeze\` 更能描述 Conda channel、Python 版本與 pip 套件。

簡單範例：

\`\`\`yaml
name: stats
dependencies:
  - numpy
  - pandas
\`\`\`

較完整範例：

\`\`\`yaml
name: stats2
channels:
  - javascript
dependencies:
  - python=3.9
  - bokeh=2.4.2
  - numpy=1.21.*
  - nodejs=16.13.*
  - flask
  - pip
  - pip:
    - Flask-Testing
\`\`\`

從 \`environment.yml\` 建立 Conda 環境：

\`\`\`bash
conda env create -f environment.yml
\`\`\`

原文中用 \`pip freeze > environment.yml\` 與 \`pip install -r environment.yml\`，這比較接近 pip requirements 工作流。若要使用 Conda，建議改用 \`conda env export\` 與 \`conda env create\`。

## 如何指定 Conda 環境的位置？

Conda 可以用 \`--prefix\` 把環境建立在專案目錄內。這種方式適合希望環境位置跟專案綁定的情境。

\`\`\`bash
conda create --prefix ./envs jupyterlab=3.2 matplotlib=3.5 numpy=1.21
\`\`\`

這個指令會在目前工作目錄建立 \`./envs\` 環境，並預先安裝 \`jupyterlab\`、\`matplotlib\` 與 \`numpy\`。

啟動 prefix 環境時，通常要使用路徑：

\`\`\`bash
conda activate ./envs
\`\`\`

## 如何匯出與重建 Conda 環境？

Conda 可用 \`environment.yml\` 匯出跨平台環境，也可用 explicit spec 匯出完全鎖定的套件 URL。前者適合協作，後者適合同平台精準重建。

匯出一般環境：

\`\`\`bash
conda env export > environment.yml
\`\`\`

匯出 explicit spec：

\`\`\`bash
conda list --explicit > spec-file.txt
\`\`\`

用 spec 建立相同環境：

\`\`\`bash
conda create --name myenv --file spec-file.txt
\`\`\`

把 spec 安裝到現有環境：

\`\`\`bash
conda install --name myenv --file spec-file.txt
\`\`\`

本文的實務判斷是：團隊協作優先用 \`environment.yml\`；需要在同一平台重現完全一致環境時，再使用 \`spec-file.txt\`。

## 如何移除 Conda 環境？

移除 Conda 環境時要先確認環境名稱，避免刪錯專案環境。移除後可用 \`conda env list\` 再檢查一次。

\`\`\`bash
conda env remove -n ENV_NAME
\`\`\`

若是用 \`--prefix\` 建立的環境，可以用路徑移除：

\`\`\`bash
conda env remove --prefix ./envs
\`\`\`

## 常見問題
### Conda 和 pip 有什麼差別？

Conda 同時管理 Python 版本、非 Python 依賴與套件環境。pip 主要管理 Python 套件，通常搭配 venv 或其他環境工具使用。

### Anaconda 和 Miniconda 要選哪一個？

Anaconda 預裝套件較多，適合想快速開始資料科學工具的人。Miniconda 較輕量，適合希望自己控制安裝內容的開發者。

### \`conda init\` 做了什麼？

\`conda init\` 會修改 shell 初始化設定，讓終端機能辨識 \`conda activate\` 等指令。執行後通常需要重新開啟終端機。

### \`environment.yml\` 可以放進 Git 嗎？

\`environment.yml\` 適合放進 Git，因為它能描述專案需要的 Python 版本與套件。不要把本機絕對路徑或私有 token 寫進檔案。

### Conda 環境可以刪掉重建嗎？

Conda 環境可以刪掉重建。只要 \`environment.yml\` 或 spec 檔完整，就能重新建立相近或相同的環境。

## 參考資料
- Conda 官方文件：[https://docs.conda.io](https://docs.conda.io)
- Anaconda 產品頁：[https://www.anaconda.com/products/individual](https://www.anaconda.com/products/individual)

## 延伸閱讀

- [Conda 無法安裝套件缺少 OpenSSL：CondaSSLError 解決方案](/post/conda-openssl-package-install-error)：同樣聚焦 Conda、Anaconda，可接著比較不同情境的做法。
- [為每個 Python 專案建立獨立的虛擬環境](/post/python-virtual-environment-per-project)：同樣聚焦 Python，可接著比較不同情境的做法。
- [PyTorch 於 Mac 系統下的安裝教學：conda、原始碼編譯與 iOS Demo](/post/install-pytorch-on-mac)：同樣聚焦 Conda，可接著比較不同情境的做法。

## 最後更新

Tue Jan 03 2023 08:00:00 GMT+0800 (Taiwan Standard Time)
`;export{e as default};