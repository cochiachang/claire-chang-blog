var e=`---
title: "Conda 無法安裝套件缺少 OpenSSL：CondaSSLError 解決方案"
description: "Conda 無法安裝套件並出現 OpenSSL appears to be unavailable 時，通常是 Windows Anaconda 環境找不到 OpenSSL DLL。本文整理錯誤訊息、DLL 複製修復方式與環境檢查指令。"
date: 2023-08-23
category: 後端開發
tags: [Conda, OpenSSL, Anaconda, Python, 錯誤排解]
readingTime: 6 分鐘
image: /images/tech/2023-01-04_155944.webp
imageAlt: Windows 環境變數中設定 Anaconda 路徑的畫面
---


# Conda 無法安裝套件缺少 OpenSSL：CondaSSLError 解決方案

Conda 無法安裝套件並出現 \`OpenSSL appears to be unavailable on this machine\` 時，通常代表 Anaconda 或 Miniconda 的 Python 執行環境找不到 OpenSSL 相關 DLL，導致 Conda 不能透過 HTTPS 下載 package metadata。我的處理方式是先確認錯誤訊息，再把 \`anaconda3\\Library\\bin\` 裡的 OpenSSL DLL 複製到 \`anaconda3\\DLLs\`，最後重開終端機測試 \`conda install\`。

## Conda 缺少 OpenSSL 會出現什麼錯誤？

Conda 缺少 OpenSSL 時，常見錯誤會卡在 \`Collecting package metadata\`，接著顯示 \`CondaSSLError\`。錯誤重點不是套件不存在，而是 Conda 無法建立 HTTPS 連線。

我當時用 \`pip install\` 或 \`conda install\` 安裝套件時，看到的錯誤訊息如下：

\`\`\`text
Collecting package metadata (current_repodata.json): failed
CondaSSLError: OpenSSL appears to be unavailable on this machine.
OpenSSL is required to download and install packages.

Exception: HTTPSConnectionPool(host='conda.anaconda.org', port=443):
Max retries exceeded with url: /conda-forge/win-64/current_repodata.json
(Caused by SSLError("Can't connect to HTTPS URL because the SSL module is not available."))
\`\`\`

Conda 官方 troubleshooting 文件也把 \`Can't connect to HTTPS URL because the SSL module is not available\` 歸在 SSL connection errors，原因通常是 Conda 找不到需要的 OpenSSL libraries，特別容易出現在 Windows 環境或 shell 沒有正確啟用 Conda environment 時（conda documentation，存取日期：2026-08-28）。

## 為什麼 Conda 會因為 OpenSSL 無法安裝套件？

Conda 安裝套件前會先透過 HTTPS 下載 channel 的 metadata；如果 Python 的 SSL 模組無法載入 OpenSSL library，Conda 連 metadata 都抓不到。這時候即使 package name 正確，也會在下載前失敗。

這類錯誤常見於三種情境：

| 情境 | 可能原因 | 優先檢查 |
|---|---|---|
| 更新 Anaconda Navigator 或 Conda 後才出現 | base environment 或 PATH 被改動 | 是否從 Anaconda Prompt 啟動 |
| Windows 上突然不能 \`conda install\` | OpenSSL DLL 不在 Python 可載入位置 | \`Library\\bin\` 與 \`DLLs\` 是否有 DLL |
| GUI IDE 可以跑 Python 但不能安裝套件 | IDE 沒有正確 activate Conda environment | IDE terminal 的 Conda 啟用方式 |

Anaconda Knowledge Base 對 OpenSSL error 的處理也建議先確認 environment、PATH 與 Conda environment 是否已啟用，再檢查 Windows 系統中是否缺少 OpenSSL DLL（Anaconda，2026-04-17）。

## 如何修復 \`OpenSSL appears to be unavailable on this machine\`？

Windows Anaconda 環境可先到 \`anaconda3\\Library\\bin\` 找 OpenSSL DLL，再複製到 \`anaconda3\\DLLs\`。這個做法保留我當時成功修復 Conda 安裝套件問題的最短流程。

我的修復流程是：

1. 開啟 Anaconda 安裝目錄。
2. 進入 \`anaconda3\\Library\\bin\`。
3. 找到這兩個檔案：
   - \`libcrypto-1_1-x64.dll\`
   - \`libssl-1_1-x64.dll\`
4. 複製這兩個 DLL。
5. 貼到 \`anaconda3\\DLLs\`。
6. 關閉目前終端機，重新開啟 Anaconda Prompt 或命令列。
7. 重新執行 \`conda install\` 或 \`pip install\` 測試。

如果 Anaconda 裝在 \`C:\\ProgramData\\Anaconda3\`，也可以用 PowerShell 參考下面指令：

\`\`\`powershell
Copy-Item "C:\\ProgramData\\Anaconda3\\Library\\bin\\libcrypto-1_1-x64.dll" "C:\\ProgramData\\Anaconda3\\DLLs\\"
Copy-Item "C:\\ProgramData\\Anaconda3\\Library\\bin\\libssl-1_1-x64.dll" "C:\\ProgramData\\Anaconda3\\DLLs\\"
\`\`\`

不同版本的 Anaconda 可能使用不同 OpenSSL DLL 檔名。若 \`libcrypto-1_1-x64.dll\` 或 \`libssl-1_1-x64.dll\` 不存在，我會先在 \`Library\\bin\` 搜尋 \`libcrypto\`、\`libssl\`，再確認同一組版本的 DLL 是否都存在。

## 修復後要怎麼確認 Conda 環境正常？

修復 OpenSSL DLL 後，不要只看錯誤訊息有沒有消失，最好再檢查 Conda 是否從正確路徑啟動、Python 是否能載入 SSL 模組，以及 Conda 是否能抓到 channel metadata。

我會依序跑這幾個檢查：

\`\`\`powershell
where conda
conda info
conda activate base
python -c "import ssl; print(ssl.OPENSSL_VERSION)"
conda install -c conda-forge requests
\`\`\`

判斷重點如下：

| 檢查項目 | 正常狀態 | 異常時的方向 |
|---|---|---|
| \`where conda\` | 指向同一套 Anaconda 或 Miniconda | 移除混雜的舊 Conda 路徑 |
| \`conda info\` | active environment 與 base 路徑合理 | 確認是否啟用錯誤環境 |
| \`import ssl\` | 印出 OpenSSL 版本 | OpenSSL DLL 仍未被 Python 找到 |
| \`conda install\` | 能下載 metadata 並進入 solve | 再檢查 proxy、certificate 或 channel |

如果 \`python -c "import ssl"\` 還是失敗，代表問題還在 Python/Conda 的 DLL 載入層。這時候我會先回頭檢查 \`PATH\`、Conda 安裝目錄與是否有多套 Python 互相干擾，而不是一直重跑同一個安裝指令。

## 什麼時候應該重裝 Anaconda 或 Miniconda？

重裝 Anaconda 或 Miniconda 應該放在 DLL 修復、PATH 檢查與 environment 啟用都失敗之後。若 base environment 已經壞到 \`conda info\`、\`conda activate base\` 都不穩，乾淨重裝通常比繼續補檔更省時間。

我會用下面順序判斷：

1. 先用 Anaconda Prompt 開啟，確認不是一般 CMD 沒有 activate Conda。
2. 再補 \`libcrypto-1_1-x64.dll\`、\`libssl-1_1-x64.dll\` 到 \`DLLs\`。
3. 檢查 \`where conda\` 是否混到舊版 Anaconda、Miniconda 或其他 Python。
4. 若 Conda 還能執行，先嘗試更新 Conda。
5. 若 base environment 已經無法正常載入 SSL，備份 environments 後重裝。

Anaconda Forum 上也有使用者回報相同錯誤，討論串中的 DLL 複製方式與我這次筆記一致；同一串討論也提醒，若複製 DLL 後仍失敗，就要回到 Conda 安裝狀態、base environment 與 PATH 污染排查（Anaconda Forum，2022-12；GitHub conda issue #11982，2022-10）。

## 常見問題

### Conda 出現 OpenSSL appears to be unavailable 是套件來源壞掉嗎？
通常不是套件來源壞掉。\`OpenSSL appears to be unavailable\` 代表 Conda 本機無法載入 SSL/OpenSSL 支援，所以連 HTTPS metadata 都抓不到；套件名稱、channel 設定與版本衝突通常還沒進入真正判斷階段。

### 可以把 \`ssl_verify\` 關掉解決 Conda OpenSSL 錯誤嗎？
不建議把 \`ssl_verify\` 關掉當成主要解法。\`ssl_verify\` 影響憑證驗證，但 OpenSSL DLL 缺失是 SSL 模組載入問題；關掉驗證不一定有效，也會降低下載套件時的安全性。

### \`libcrypto-1_1-x64.dll\` 和 \`libssl-1_1-x64.dll\` 找不到怎麼辦？
新版 Anaconda 可能使用不同 OpenSSL DLL 檔名。可以先在 \`anaconda3\\Library\\bin\` 搜尋 \`libcrypto\` 與 \`libssl\`，確認是否存在同一組版本；如果 \`Library\\bin\` 本身沒有這些 DLL，安裝可能已經不完整，建議修復或重裝 Anaconda。

### 複製 DLL 後還是無法 \`conda install\` 怎麼排查？
先重開終端機，再執行 \`where conda\`、\`conda info\`、\`python -c "import ssl; print(ssl.OPENSSL_VERSION)"\`。如果 \`import ssl\` 失敗，繼續查 PATH 與 Python/Conda 混用；如果 SSL 正常但下載失敗，再看 proxy、公司憑證、channel 或網路設定。

### 這個 Conda OpenSSL 錯誤只會發生在 Windows 嗎？
這篇筆記的修復方式主要針對 Windows Anaconda。macOS 或 Linux 也可能遇到 SSL 相關問題，但處理方向通常會變成 shell activation、系統憑證、OpenSSL 套件或 Conda 安裝完整性，不一定適用複製 Windows DLL 的方式。

## 參考資料

- conda documentation：[Troubleshooting - SSL connection errors](https://docs.conda.io/docs/troubleshooting.html)（存取日期：2026-08-28）
- Anaconda Knowledge Base：[Openssl error](https://support.anaconda.com/hc/en-us/articles/18010943282067-Openssl-error)（更新日期：2026-04-17，存取日期：2026-08-28）
- GitHub conda issue：[Conda SSL Error: OpenSSL appears to be unavailable on this machine](https://github.com/conda/conda/issues/11982)（開啟日期：2022-10-17，存取日期：2026-08-28）
- Anaconda Forum：[Getting Started Conda Workflow tutorial - CondaSSLError](https://forum.anaconda.com/t/getting-started-conda-workflow-tutorial-condasslerror/47854)（討論日期：2022-12，存取日期：2026-08-28）

## 延伸閱讀

- [使用 Conda 管理 Python 版本與函式庫](/post/conda-python-environment-management)：同樣聚焦 Conda、Python，可接著比較不同情境的做法。
- [TensorFlow 和 Keras 版本不相容錯誤：cannot import name 'dtensor' 解法](/post/tensorflow-keras-version-compatibility-error)：同樣聚焦 Python、錯誤排解，可接著比較不同情境的做法。
- [PyTorch 於 Mac 系統下的安裝教學：conda、原始碼編譯與 iOS Demo](/post/install-pytorch-on-mac)：同樣聚焦 Conda，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2026-08-28。初次發布於 2023-08-23，本文保留 Conda 缺少 OpenSSL、無法安裝套件、\`libcrypto-1_1-x64.dll\`、\`libssl-1_1-x64.dll\` 與 Windows Anaconda 環境修復流程，並補上 Answer Blocks、FAQ、參考資料與延伸閱讀。
`;export{e as default};