var e=`---
title: 為每個 Python 專案建立獨立的虛擬環境
description: 說明 Python venv 虛擬環境的用途、Windows 與 macOS 建立方式、啟動與退出指令，以及如何用 requirements.txt 保存專案套件清單。
date: 2022-12-21
category: 後端開發
tags: [Python, venv, pip, requirements.txt]
readingTime: 6 分鐘
image: /images/tech/hero_generate-used-library-list.webp
imageAlt: 終端機顯示 Python API 除錯紀錄，象徵 Python 專案虛擬環境與套件管理
---


# 為每個 Python 專案建立獨立的虛擬環境

每個 Python 專案都應該建立自己的虛擬環境，讓套件安裝、版本升級與測試行為留在專案範圍內。最基本做法是用 Python 內建的 \`venv\` 建立 \`.venv\` 目錄，啟動後再用 \`pip install\` 安裝套件，最後用 \`requirements.txt\` 保存可重建的套件清單。

## 什麼是 Python 虛擬環境？

Python 虛擬環境是一個隔離的 Python 執行環境，用來讓單一專案擁有自己的直譯器路徑與套件安裝目錄。Python 官方文件將 \`venv\` 定位為建立 virtual environments 的標準函式庫工具（Python Documentation，存取日期：2026-08-28）。

虛擬環境（virtual environment）可以讓同一台電腦同時存在多組 Python 套件版本。例如 A 專案需要舊版套件，B 專案需要新版套件，兩個專案分別建立虛擬環境後，就不會因為共用全域套件而互相影響。

虛擬環境也適合測試新套件。你可以在專案環境中安裝、卸載或更新套件，不必擔心把系統 Python 或其他專案的環境弄亂。

## 為什麼每個 Python 專案都要有獨立虛擬環境？

每個 Python 專案使用獨立虛擬環境，主要是為了避免套件版本衝突與環境污染。Python Packaging User Guide 也建議使用 virtual environment 安裝第三方套件（Python Packaging Authority，存取日期：2026-08-28）。

實務上，專案環境混在一起會有三個常見問題：

| 問題 | 可能結果 | 虛擬環境的作用 |
|---|---|---|
| 不同專案需要不同套件版本 | 更新一個專案後，另一個專案突然不能跑 | 每個專案各自安裝套件 |
| 全域 Python 累積太多套件 | \`pip freeze\` 匯出大量無關依賴 | 讓套件清單更接近專案實際需求 |
| 測試套件後忘記清理 | 後續部署或協作環境難以重建 | 刪掉 \`.venv\` 後可重新建立 |

我的習慣是把虛擬環境放在專案根目錄的 \`.venv\`，再把 \`.venv/\` 加進 \`.gitignore\`。這樣路徑好找，也不會把整個本機環境提交到 Git。

## 如何在 Windows 建立 Python 虛擬環境？

Windows 建立 Python 虛擬環境時，可以在專案資料夾執行 \`py -m venv .venv\` 或 \`python -m venv .venv\`。建立完成後，用 \`.venv\\Scripts\\activate\` 啟動環境，再用 \`deactivate\` 離開。

進入專案根目錄後，先建立用來存放環境的 \`.venv\` 目錄：

\`\`\`powershell
python -m venv .venv
\`\`\`

若你確定要讓虛擬環境也能存取系統層級套件，可以加上 \`--system-site-packages\`：

\`\`\`powershell
python -m venv --system-site-packages .venv
\`\`\`

這個參數會讓虛擬環境看得到 system site-packages。一般專案我不會預設開啟，因為隔離性會變差；只有在舊環境已依賴全域套件、短期內又不方便整理依賴時，才會暫時使用。

啟動虛擬環境：

\`\`\`powershell
.\\.venv\\Scripts\\activate
\`\`\`

升級 pip 並檢查目前環境中的套件：

\`\`\`powershell
python -m pip install --upgrade pip
python -m pip list
\`\`\`

離開虛擬環境：

\`\`\`powershell
deactivate
\`\`\`

## 如何在 macOS 建立 Python 虛擬環境？

macOS 建立 Python 虛擬環境時，通常使用 \`python3 -m venv .venv\`。啟動指令會依 shell 不同而改變，zsh 與 bash 最常用的是 \`source .venv/bin/activate\`。

進入專案根目錄後，建立 \`.venv\`：

\`\`\`bash
python3 -m venv .venv
\`\`\`

若需要沿用系統 site-packages，可以加上 \`--system-site-packages\`：

\`\`\`bash
python3 -m venv --system-site-packages .venv
\`\`\`

使用 sh、bash 或 zsh 啟動虛擬環境：

\`\`\`bash
source .venv/bin/activate
\`\`\`

使用 fish：

\`\`\`bash
source .venv/bin/activate.fish
\`\`\`

使用 csh 或 tcsh：

\`\`\`bash
source .venv/bin/activate.csh
\`\`\`

虛擬環境啟用時，shell prompt 通常會出現 \`(.venv)\` 前置字元。這個前置字元是很實用的提醒：現在安裝的套件會進入專案環境，不是系統 Python。

升級 pip 並檢查套件：

\`\`\`bash
python -m pip install --upgrade pip
python -m pip list
\`\`\`

離開虛擬環境：

\`\`\`bash
deactivate
\`\`\`

## 如何啟動已經建立好的 Python 虛擬環境？

已經建立好的 Python 虛擬環境不需要重建，直接執行對應作業系統的 activate 指令即可。啟動後，\`python\` 與 \`pip\` 會優先指向該虛擬環境內的執行檔。

常用啟動指令整理如下：

| 作業系統 / Shell | 啟動指令 |
|---|---|
| Windows PowerShell / CMD | \`.\\.venv\\Scripts\\activate\` |
| macOS bash / zsh | \`source .venv/bin/activate\` |
| macOS fish | \`source .venv/bin/activate.fish\` |
| macOS csh / tcsh | \`source .venv/bin/activate.csh\` |

如果舊專案的環境資料夾叫做 \`env\`，啟動指令也要改成對應路徑：

\`\`\`bash
source ./env/bin/activate
\`\`\`

Python 官方文件提醒，虛擬環境中的 scripts 會帶有指向該環境 Python 的 shebang，因此環境通常不適合直接搬移位置；需要換路徑時，重建環境會比較可靠（Python Documentation，存取日期：2026-08-28）。

## 如何為 Python 專案建立 requirements.txt？

\`requirements.txt\` 是 pip 專案常用的套件清單，可以用來記錄目前環境安裝的套件，並在另一個虛擬環境中重新安裝。小型專案可先用 \`python -m pip freeze > requirements.txt\` 保存當下環境。

匯出目前虛擬環境中的套件：

\`\`\`bash
python -m pip freeze > requirements.txt
\`\`\`

在新環境安裝清單中的套件：

\`\`\`bash
python -m pip install -r requirements.txt
\`\`\`

資訊增益：我會把 \`requirements.txt\` 視為「重建環境的入口」，不是永遠正確的真相。若虛擬環境只服務這個專案，\`pip freeze\` 通常夠用；若環境曾經混用多個專案，建議搭配 [pipreqs 產生 requirements.txt](/post/generate-used-library-list) 重新檢查實際 import 到的套件。

## Python venv、Conda 和全域安裝要怎麼選？

Python 標準 \`venv\` 適合大多數純 Python 專案；Conda 適合同時管理 Python 版本、資料科學套件與非 Python 依賴；全域安裝只適合非常少量的系統工具。

| 方式 | 適合情境 | 不適合情境 |
|---|---|---|
| \`venv\` | Web API、CLI、一般 Python 應用、輕量專案 | 需要大量非 Python 二進位依賴的資料科學環境 |
| Conda | TensorFlow、PyTorch、NumPy、CUDA 或跨平台資料科學環境 | 只需要幾個 pip 套件的小型服務 |
| 全域安裝 | 系統級命令列工具或一次性工具 | 多專案開發、團隊協作、需要固定套件版本 |

如果只是要讓每個 Python 專案不要互相污染，先用 \`venv\` 就好。等到專案需要指定 Python 版本、GPU 套件或複雜科學運算依賴，再評估 Conda。

## 常見問題

### Python 虛擬環境一定要叫 \`.venv\` 嗎？

Python 虛擬環境不一定要叫 \`.venv\`，也可以叫 \`venv\`、\`env\` 或其他名稱。實務上我偏好 \`.venv\`，因為放在專案根目錄很清楚，也容易加進 \`.gitignore\`。

### \`venv\` 和 \`virtualenv\` 有什麼不同？

\`venv\` 是 Python 3.3 之後內建的標準函式庫工具，不需要額外安裝。\`virtualenv\` 是第三方工具，常用在需要支援更舊 Python 版本或特定環境建立行為的專案。

### 要不要在建立 venv 時加上 \`--system-site-packages\`？

多數新專案不建議加上 \`--system-site-packages\`，因為虛擬環境會看得到系統套件，隔離性會下降。只有在舊專案短期內必須依賴全域套件時，才適合把這個參數當成過渡方案。

### 為什麼要用 \`python -m pip\` 而不是直接用 \`pip\`？

\`python -m pip\` 會使用目前這個 Python 對應的 pip，比較不容易把套件裝到錯誤環境。當電腦上同時有系統 Python、Homebrew Python、Conda 或多個 \`.venv\` 時，這個寫法能減少誤裝。

### \`requirements.txt\` 可以放進 Git 嗎？

應用型 Python 專案通常應該把 \`requirements.txt\` 放進 Git，讓團隊成員、CI 與部署環境能用同一份清單安裝套件。不要把 \`.venv/\` 放進 Git，因為虛擬環境包含本機路徑與平台相關檔案。

### 刪掉 \`.venv\` 會不會刪掉專案程式碼？

只要專案程式碼沒有放進 \`.venv\` 目錄，刪掉 \`.venv\` 不會刪掉程式碼。這也是為什麼虛擬環境要放在獨立目錄，不要把原始碼混在虛擬環境資料夾裡。

## 參考資料

- Python Documentation：[venv — Creation of virtual environments](https://docs.python.org/3/library/venv.html)（存取日期：2026-08-28）
- Python Packaging User Guide：[Install packages in a virtual environment using pip and venv](https://packaging.python.org/en/latest/guides/installing-using-pip-and-virtual-environments/)（存取日期：2026-08-28）
- Python Packaging User Guide：[Installing Packages](https://packaging.python.org/en/latest/tutorials/installing-packages/)（存取日期：2026-08-28）

## 延伸閱讀

- [使用 Conda 管理 Python 版本與函式庫](/post/conda-python-environment-management)：同樣聚焦 Python，可接著比較不同情境的做法。
- [生成只包含專案使用的 Library 列表：用 pipreqs 產生 requirements.txt](/post/generate-used-library-list)：同樣聚焦 Python、requirements.txt，可接著比較不同情境的做法。
- [PyCharm 是什麼？好用的 Python 開發環境（IDE）推薦指南](/post/pycharm-python-ide)：同樣聚焦 Python，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2026-08-28。本文依 2022-12-21 的 Python 虛擬環境筆記整理，保留 Windows、macOS、啟動環境、離開環境與 \`requirements.txt\` 指令，並補上 GEO Answer Blocks、FAQ、參考資料與站內延伸閱讀。
`;export{e as default};