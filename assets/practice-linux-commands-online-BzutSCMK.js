var e=`---
title: 線上練習 Linux 指令：不用裝虛擬機的 4 個免費網站
description: 沒有 Linux 主機也能線上練習 Linux 指令。整理 JSLinux、Copy.sh、Webminal、Linux Containers 等 4 個免費線上終端機工具，附網站連結與畫面截圖。
date: 2019-09-25
category: DevOps
tags: [Linux, 線上終端機, 指令列, DevOps, 虛擬機]
readingTime: 3 分鐘
image: /images/tech/hero_practice-linux-commands-online.webp
imageAlt: 終端機畫面上顯示 Ubuntu 命令列提示符與 sudo 指令
---


# 線上練習 Linux 指令：不用裝虛擬機的 4 個免費網站

有的時候我們可能需要練習 Linux 指令，但是手上又沒有一台 Linux 主機。方法之一就是起一台虛擬機器，但如果只是想測試幾個簡單的指令，開虛擬機實在太重——線上有許多方便好用的工具，打開瀏覽器就能直接操作一個 Linux 環境。這篇文章整理我自己常用的 4 個線上練習網站。

## 為什麼需要線上練習 Linux 指令？

學 Linux 指令最重要的是「動手打」，只看筆記很容易忘。但不是每個人身邊都有一台隨時可用的 Linux 主機：

- **沒有 Linux 機器**：主力電腦是 Windows 或 macOS，不想為了練習裝雙系統。
- **不想開虛擬機**：裝 VirtualBox/VMware 加上一份 Linux 映像要花不少時間與硬碟空間，只是想跑 \`ls\`、\`cd\`、\`grep\` 這類指令並不划算。
- **想測試不同發行版**：有時想試試沒用過的發行版，線上環境隨開隨用、關掉就丟，零成本。

以下 4 個網站都能在瀏覽器裡直接操作 Linux 終端機，依需求挑一個即可。

## 各家線上 Linux 練習工具比較

| 工具 | 類型 | 需要註冊 | 適合情境 |
| --- | --- | --- | --- |
| JSLinux | 完整 x86 模擬（瀏覽器內跑 Linux） | 不用 | 快速開一台多發行版 Linux 試指令 |
| Copy.sh（v86） | x86 模擬器，可選多種 Linux | 不用 | 想體驗不同發行版、完整開機流程 |
| Webminal | 線上終端機教學平台 | 要（免費註冊） | 搭配課題逐步練習指令 |
| Linux Containers（LXD try-it） | 線上 LXD 容器沙箱 | 不用 | 接近真實容器的輕量環境 |

## JSLinux

網站連結：[JSLinux](https://bellard.org/jslinux/)

JSLinux 是 Fabrice Bellard 的作品，用 JavaScript 在瀏覽器裡模擬 x86 硬體，直接跑起一個完整的 Linux。打開網頁就是終端機，幾秒內可以開始下指令，也可選擇多種系統（Alpine Linux、Buildroot、FreeDOS 等），是最低門檻的選擇。

![JSLinux 網站截圖](/images/articles/practice-linux-commands-online-1.webp)

## Copy.sh

網站連結：[copy.sh](https://copy.sh/v86/?profile=linux26)

Copy.sh 上的 v86 同樣是瀏覽器內的 x86 模擬器，特色是可以挑選的作業系統非常多（Linux 各發行版、FreeBSD、Windows 98 等都有）。選好 profile 後會跑完整的開機流程，適合想體驗不同發行版的人。

![Copy.sh 網站截圖](/images/articles/practice-linux-commands-online-2.webp)

## Webminal

網站連結：[webminal](https://www.webminal.org/register/)

Webminal 是一個線上 Linux 教學與練習平台，免費註冊後會給你一個專屬的線上終端機，還附帶章節式的練習題，適合初學者照著課題一步一步練指令，而不是漫無目的亂打。

![Webminal 網站截圖](/images/articles/practice-linux-commands-online-3.webp)

## Linux Containers

網站連結：[Linux Containers](https://linuxcontainers.org/lxd/try-it/)

Linux Containers 官方提供的「Try it」頁面，會開一個線上 LXD 容器沙箱讓你直接操作。容器比完整模擬的虛擬機更輕量、反應更快，環境也更接近真實伺服器上跑容器的感覺。

![Linux Containers 網站截圖](/images/articles/practice-linux-commands-online-4.webp)

## 常見問題

### 沒有 Linux 主機要怎麼練習 Linux 指令？

最快的做法是用線上終端機工具，例如 JSLinux 或 Copy.sh，打開瀏覽器就能操作一個完整的 Linux 環境；想要有練習題引導則可以註冊 Webminal。

### 線上練習 Linux 指令需要安裝虛擬機嗎？

不需要。JSLinux、Copy.sh 用瀏覽器內的 x86 模擬技術，Linux Containers 則是開線上容器沙箱，都不用在本機安裝任何東西。

### 這些線上 Linux 環境是免費的嗎？

上面 4 個工具都是免費的。只有 Webminal 需要先免費註冊一個帳號，其他三個連註冊都不用，打開網頁即可使用。

### 線上環境適合跑正式的工作或測試嗎？

不適合。這些工具的定位是練習與體驗，環境在關掉網頁後通常就消失，資料不會保留；正式測試還是應該使用自己的虛擬機、實體主機或雲端伺服器。

## 參考資料

- [JSLinux](https://bellard.org/jslinux/)
- [Copy.sh v86](https://copy.sh/v86/?profile=linux26)
- [Webminal](https://www.webminal.org/register/)
- [Linux Containers LXD Try it](https://linuxcontainers.org/lxd/try-it/)

## 延伸閱讀

- [Linux 網路功能指令介紹：ifconfig、route、ping、nslookup、traceroute](/post/linux-network-commands-intro)：同樣聚焦 Linux、指令列，可接著比較不同情境的做法。
- [取得 Linux 安裝的系統版本：uname、/proc/version 與 /etc/os-release 指令教學](/post/get-linux-distribution-version)：同樣聚焦 Linux、DevOps，可接著比較不同情境的做法。
- [Linux 基本操作指令介紹](/post/linux-basic-commands-cheatsheet)：同樣聚焦 Linux、指令列，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2019-09-25，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};