var e=`---
title: 取得 Linux 安裝的系統版本：uname、/proc/version 與 /etc/os-release 指令教學
description: 在 Linux 上查詢系統版本的完整筆記：用 uname -a 與 cat /proc/version 取得核心版本，用 cat /etc/os-release、/etc/*-release 與 lsb_release 查詢發行版版本，附實際終端機輸出截圖與常見問題。
date: 2019-09-27
category: DevOps
tags: [Linux, 系統版本, uname, lsb_release, DevOps]
readingTime: 3 分鐘
image: /images/tech/hero_get-linux-distribution-version.webp
imageAlt: 螢幕上顯示程式碼的終端機畫面，代表在 Linux 指令列查詢系統版本
---


# 取得 Linux 安裝的系統版本：uname、/proc/version 與 /etc/os-release 指令教學

在維護 Linux 伺服器時，第一步往往就是確認「這台機器跑的是哪個核心版本、哪個發行版」。這篇筆記整理我在實務上常用的幾個查詢指令：\`uname -a\`、\`cat /proc/version\` 查核心版本，\`/etc/*-release\` 與 \`lsb_release\` 查作業系統發行版資訊，並附上實際的終端機輸出。

## 如何查詢 Linux 的核心版本資訊？

### 1. uname -a

查看 Linux 系統核心版本及系統名稱：

![uname -a 指令輸出，顯示核心版本與系統名稱](/images/articles/get-linux-distribution-version-1.webp)

### 2. cat /proc/version

查看目錄 \`/proc\` 下 version 的資訊，也可以知道目前系統的核心版本名稱：

![cat /proc/version 指令輸出，顯示核心編譯資訊](/images/articles/get-linux-distribution-version-2.webp)

## 如何查詢 Linux 的作業系統版本資訊？

### 1. 查看 /etc/*-release

多數發行版會在 \`/etc\` 下放置 \`-release\` 結尾的版本檔案：

\`\`\`bash
ls -l /etc/*-release
cat /etc/redhat-release
\`\`\`

![ls -l /etc/*-release 與 cat /etc/redhat-release 的輸出](/images/articles/get-linux-distribution-version-3.webp)

並可以用下面的指令查看更詳細的說明：

\`\`\`bash
cat /etc/os-release
\`\`\`

![cat /etc/os-release 顯示完整的發行版資訊](/images/articles/get-linux-distribution-version-4.webp)

### 2. 使用 lsb_release 指令查詢

\`lsb_release\` 是一個用來查詢 Linux 發行版資訊的指令，但並不是每一種 Linux 發行版預設都會安裝這個指令，使用時要碰運氣——像我的版本就沒有這個指令：

![系統未安裝 lsb_release 指令的錯誤訊息](/images/articles/get-linux-distribution-version-5.webp)

## 常見問題

### uname -a 和 cat /proc/version 有什麼差別？

兩者都能查到核心版本。\`uname -a\` 一次列出核心版本、主機名稱、架構與編譯時間；\`cat /proc/version\` 則會額外顯示編譯核心所用的編譯器與使用者，資訊更詳細一些。

### 為什麼我的系統沒有 lsb_release 指令？

\`lsb_release\` 來自 LSB（Linux Standard Base）套件，不是每個發行版都預設安裝。可以改用 \`cat /etc/os-release\`，這個檔案在幾乎所有現代發行版上都存在。

### /etc/os-release 和 /etc/redhat-release 要看哪一個？

\`/etc/redhat-release\` 只存在於 RHEL／CentOS 系列，內容只有一行版本名稱。\`/etc/os-release\` 是跨發行版的標準格式，包含名稱、版號、ID 等欄位，腳本判斷時建議優先使用它。

### 如何在 shell 腳本中判斷發行版？

讀取 \`/etc/os-release\` 的欄位即可，例如 \`grep ^ID= /etc/os-release\` 取得發行版 ID，或用 \`. /etc/os-release\` 載入後使用 \`$ID\`、\`$VERSION_ID\` 變數。

## 參考資料

- 本文為 IT邦幫忙鐵人賽系列筆記（2019 年）

## 延伸閱讀

- [線上練習 Linux 指令：不用裝虛擬機的 4 個免費網站](/post/practice-linux-commands-online)：同樣聚焦 Linux、DevOps，可接著比較不同情境的做法。
- [查看某個 Linux 裡服務的狀態](/post/check-linux-service-status)：同樣聚焦 Linux、DevOps，可接著比較不同情境的做法。
- [Linux 檢查硬碟使用量：df 指令完整教學](/post/linux-check-disk-usage)：同樣聚焦 Linux、DevOps，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2019-09-27，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};