var e=`---
title: Hard Link 與 Symbolic Link 的比較
description: 一篇搞懂 Linux 硬連結（Hard Link）與軟連結（Symbolic Link）的差異：i-node 原理、能否跨檔案系統、能否連結目錄、刪除原始檔後的行為，以及 ln 與 ln -s 指令的實際用法範例。
date: 2019-10-03
category: DevOps
tags: [Linux, 檔案系統, Hard Link, Symbolic Link, ln 指令]
readingTime: 3 分鐘
image: /images/tech/hero_hard-link-vs-symbolic-link.webp
imageAlt: 螢幕上顯示程式碼的特寫，象徵 Linux 檔案系統與 ln 連結指令的操作
---


# Hard Link 與 Symbolic Link 的比較

在 Linux 檔案系統裡，\`ln\` 指令可以建立兩種連結：**硬連結（Hard Link）**與**軟連結（Symbolic Link，又稱符號連結）**。這篇文章用最短的篇幅比較兩者的特性差異——i-node 的指向方式、能否跨檔案系統、能否連結目錄、刪除原始檔之後會發生什麼事，並附上實際操作範例，幫你選對場景用對連結。

## 什麼是硬連結（Hard Link）？

硬連結的特性如下：

- 以**相同的 i-node** 指向相同的檔案。
- 主要用於**備份**。
- 只能在**同一個磁區（Partition）**中建立。
- 只能連結檔案，**不能連結目錄**。
- 指令為 \`ln (原始檔案) (目的檔案)\`。

如果我們對某個檔案做了硬連結，那麼就算刪掉了其中一個，另一個仍然可以正常讀取——因為兩個連結共用同一個 i-node，資料本身並不會跟著消失。

不過 hard link 是有限制的：

- 不能跨 Filesystem（檔案系統）。
- 不能 link 目錄。

**使用範例：**

![硬連結（Hard Link）的 ln 指令操作範例](/images/articles/hard-link-vs-symbolic-link-1.webp)

## 什麼是軟連結（Symbolic Link）？

軟連結的特性如下：

- 以**絕對路徑或相對路徑**指向原始的檔案。
- 主要用於**簡化路徑**。
- 類似 MS-Windows 下「建立捷徑」的功能。
- 指令為 \`ln -fsv (原始檔案) (目的檔案)\`。

這個概念就像 Windows 裡的捷徑：當來源檔被刪除之後，symbolic link 的檔案就會開不了（變成斷連的 dead link）。但相對地，它可以**跨 Filesystem**、也可以 **link 目錄**，在使用上比 hard link 彈性許多。

**使用範例：**

![軟連結（Symbolic Link）的 ln -fsv 指令操作範例](/images/articles/hard-link-vs-symbolic-link-2.webp)

## Hard Link 與 Symbolic Link 差異比較表

| 比較項目 | Hard Link（硬連結） | Symbolic Link（軟連結） |
| --- | --- | --- |
| 指向方式 | 相同的 i-node 指向同一份資料 | 以路徑（絕對或相對）指向原始檔案 |
| 跨 Filesystem | ❌ 不行 | ✅ 可以 |
| 連結目錄 | ❌ 不行 | ✅ 可以 |
| 刪除原始檔後 | 資料仍在，另一個連結可正常讀取 | 變成斷連（dead link），檔案開不了 |
| 常用指令 | \`ln (原始檔案) (目的檔案)\` | \`ln -fsv (原始檔案) (目的檔案)\` |
| 適用場景 | 備份、防止誤刪 | 簡化路徑、版本切換（類似 Windows 捷徑） |

## 常見問題

### Hard Link 和 Symbolic Link 最核心的差別是什麼？

Hard link 用相同的 i-node 直接指向檔案資料，symbolic link 則是存放指向原始檔案的路徑。因此刪掉原始檔時，hard link 仍可讀取資料，symbolic link 會變成失效的斷連。

### 為什麼 Hard Link 不能連結目錄？

目錄的 i-node 結構牽涉到 \`.\` 與 \`..\` 的指向，若允許硬連結目錄可能形成迴圈，破壞檔案系統的樹狀一致性，因此 Linux 不允許（僅超級使用者在極少數情況可用，一般不建議）。要連結目錄請使用 symbolic link。

### Symbolic Link 可以跨磁區或跨檔案系統嗎？

可以。因為 symbolic link 只記錄路徑字串，不依賴 i-node，所以可以跨 Filesystem 連結，也能連結目錄，使用上比 hard link 有彈性。

### 建立 Hard Link 與 Symbolic Link 的指令是什麼？

Hard link 用 \`ln 來源檔 目的檔\`；symbolic link 常用 \`ln -fsv 來源檔 目的檔\`，其中 \`-s\` 建立軟連結、\`-f\` 遇到已存在的目的檔先刪除、\`-v\` 顯示執行過程。

### 刪除原始檔案後，Hard Link 還能存取資料嗎？

可以。硬連結與原始檔共用同一個 i-node，只要還有任何一個硬連結存在，檔案資料就不會被釋放，剩下的連結仍可正常讀寫。

## 參考資料

- [Linux man page：ln(1)](https://man7.org/linux/man-pages/man1/ln.1.html)

## 延伸閱讀

- [Linux 基本操作指令介紹](/post/linux-basic-commands-cheatsheet)：同樣聚焦 Linux、檔案系統，可接著比較不同情境的做法。
- [Linux 目錄刪除教學：rm 與 rmdir 指令用法整理](/post/rm-directory-delete-commands)：同樣聚焦 Linux，可接著比較不同情境的做法。
- [在 Linux 與 Windows 間傳送檔案：PSCP 指令教學](/post/transfer-files-between-linux-and-windows)：同樣聚焦 Linux，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2019-10-03，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};