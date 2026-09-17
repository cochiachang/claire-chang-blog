var e=`---
title: Linux 刪除檔案後空間未釋放？用 lsof 找出 unlinked 檔案並釋放磁碟空間
description: 在 Linux 刪除檔案後 df 卻看不到磁碟空間釋放？原因通常是檔案仍被運行中的程序佔用（unlinked 檔案）。本文教你用 df 查硬碟用量、用 lsof +L1 找出 deleted 但仍被打開的檔案，並提供重啟程序與線上清空檔案兩種解法，避免服務中斷。
date: 2020-03-18
category: DevOps
tags: [Linux, lsof, df, 磁碟空間, 疑難排解]
readingTime: 3 分鐘
image: /images/tech/hero_linux-deleted-file-space-not-released.webp
imageAlt: Linux 磁碟空間未釋放問題排查示意圖
---


# Linux 刪除檔案後空間未釋放？用 lsof 找出 unlinked 檔案並釋放磁碟空間

這篇文章解決「檔案明明刪除了，\`df\` 卻顯示磁碟空間沒有釋放」的問題。我會先說明查詢硬碟使用狀況的方法，再教你在刪除檔案後，如何用 \`lsof\` 找出正在被程序使用而無法釋放空間的檔案，最後提供兩種解決方法。

## 如何查詢硬碟使用狀況？

\`\`\`bash
df
\`\`\`

使用 \`df\` 可以查看硬碟的使用狀況。

## 為什麼檔案刪除了空間卻沒釋放？

\`lsof\`（list open files）可以用來查看正在運行中的進程打開了哪些文件、目錄和套接字，是系統監測工具之一。（參見：[好用的網管指令 - lsof](https://idobest.pixnet.net/blog/post/22040642)）

關鍵在於 **unlinked 文件**：一個進程打開一個文件，然後將其設為 unlinked 狀態，則此文件資源仍能被進程使用，但是其訪問路徑已經被刪除了。因此，使用 \`ls\` 不能將其列出，只有當進程結束時，才能釋放文件佔用的資源。

## 如何找出 unlinked 檔案？

查找 unlinked 文件，選項 \`+L\`，作用是列出打開文件的連接數：

\`\`\`cmd
lsof +L
\`\`\`

指定連接數的上限，例如只列連接數為 0 以下的（即已被刪除但仍被打開的檔案）：

\`\`\`cmd
lsof +L1
\`\`\`

![lsof +L1 列出 deleted 檔案的執行結果截圖](/images/articles/linux-deleted-file-space-not-released-1.webp)

## 問題發生的原因是什麼？

該被 deleted 的檔案雖然被刪除了，卻因為正在被某個程序使用著，因此被刪除的檔案沒有辦法釋放所使用的空間。

## 解決方法有哪些？

- 最簡單的方法是關閉或者重啟使用該檔案的程序（例如 httpd），當然也可以重啟作業系統。
- 若不想中斷服務，可以**線上清空這個檔案**：

\`\`\`cmd
echo " " >/tmp/acess.log
\`\`\`

## 常見問題

### 為什麼刪除檔案後 df 顯示的磁碟空間沒有變化？

因為該檔案雖然從目錄結構中被刪除，但仍被某個運行中的程序打開（unlinked 狀態），資源要等到程序結束才會釋放。

### 用什麼指令可以找出這些被刪除但仍被佔用的檔案？

使用 \`lsof +L1\`，它會列出連接數為 0、也就是「已刪除但仍被打開」的檔案，並顯示佔用它的程序。

### 不重啟服務有辦法釋放空間嗎？

有。可以在線上直接清空該檔案，例如 \`echo " " >/tmp/acess.log\`，把檔案內容清空即可釋放空間，服務不必中斷。

## 參考資料

- [好用的網管指令 - lsof](https://idobest.pixnet.net/blog/post/22040642)

## 延伸閱讀

- [Linux 檢查硬碟使用量：df 指令完整教學](/post/linux-check-disk-usage)：同樣聚焦 Linux、df，可接著比較不同情境的做法。
- [Linux 基本操作指令介紹](/post/linux-basic-commands-cheatsheet)：同樣聚焦 Linux，可接著比較不同情境的做法。
- [Linux 目錄刪除教學：rm 與 rmdir 指令用法整理](/post/rm-directory-delete-commands)：同樣聚焦 Linux，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2020-03-18，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};