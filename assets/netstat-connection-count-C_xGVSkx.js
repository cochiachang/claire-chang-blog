var e=`---
title: 利用 netstat 查詢連線數量（connections）
description: netstat 常用參數完整整理：列出所有連接埠、只看 TCP/UDP、加速查詢的 -n、查看路由表、grep 過濾 ESTABLISHED 連線，以及用 wc -l 統計總連線數的實用指令筆記。
date: 2020-03-01
category: DevOps
tags: [Linux, netstat, 網路除錯, 伺服器管理, TCP]
readingTime: 3 分鐘
image: /images/tech/hero_netstat-connection-count.webp
imageAlt: 伺服器機房內交錯的網路線與連接埠，象徵大量的網路連線
---


# 利用 netstat 查詢連線數量（connections）

在管理 Linux 伺服器時，我常用 \`netstat\` 查詢目前系統上的網路連線狀態——從列出所有連接埠、過濾特定協定，到統計連線總數都靠它。這篇整理我最常用的幾組 netstat 參數組合，方便快速查考。

## netstat 常用參數有哪些？

\`\`\`cmd
netstat -a
\`\`\`

\`-a\` 指列出所有連接埠（Port），是最基礎的用法：

![netstat -a 列出所有連接埠的輸出結果](/images/articles/netstat-connection-count-1.webp)

如果只想看特定協定，可以再搭配參數：

\`\`\`cmd
netstat -at
\`\`\`

\`-at\` 指僅列出 TCP 的連接埠。

\`\`\`cmd
netstat -au
\`\`\`

\`-au\` 指僅列出 UDP 的連接埠。

## 如何讓 netstat 執行更快（不要解析 DNS）？

如果不想要讓 \`netstat\` 自動解析 DNS、連接埠名稱與使用者名稱，可以加上 \`-n\` 參數，這樣可以加速 netstat 的執行速度：

\`\`\`cmd
netstat -an
\`\`\`

排查大量連線時我幾乎都會加上 \`-n\`，省去反解 DNS 的等待時間。

## 如何用 netstat 查看路由表？

\`\`\`cmd
netstat -r
\`\`\`

結果如下：

![netstat -r 顯示系統路由表](/images/articles/netstat-connection-count-2.webp)

## 如何列出使用中的網路連線？

\`\`\`cmd
netstat -atnp | grep ESTA
\`\`\`

用 \`grep ESTA\` 過濾出狀態為 ESTABLISHED 的連線，就能看到目前實際在通訊中的連線清單。

## 如何查詢特定埠號（port）的連線？

\`\`\`cmd
netstat -an | grep :1111
\`\`\`

把 \`1111\` 換成想查的埠號即可，常用來確認某個服務的連線狀況。

## 如何統計連線總數量？

\`\`\`cmd
netstat -aunt | wc -l
\`\`\`

先用 \`-aunt\` 列出所有 TCP／UDP、且不做 DNS 反解的連線，再交給 \`wc -l\` 計算行數，就是目前的連線總數。做連線數監控或警示腳本時很好用。

## 常見問題

### netstat -a 和 netstat -at 差在哪裡？

\`-a\` 會列出所有連接埠，包含 TCP 與 UDP；\`-at\` 則只顯示 TCP 的連接埠。同理，\`-au\` 只顯示 UDP 的連接埠。

### 為什麼要加 -n 參數？

\`-n\` 讓 netstat 不做 DNS、埠名稱與使用者名稱的反解，直接顯示數字。連線數量多時可以明顯加快執行速度。

### 怎麼只看目前有在通訊的連線？

用 \`netstat -atnp | grep ESTA\` 過濾出狀態為 ESTABLISHED 的連線，就能看到實際正在通訊中的連線清單。

### 如何快速算出系統目前的連線總數？

執行 \`netstat -aunt | wc -l\`，先列出所有連線（不反解 DNS），再計算行數即可得到總數。

### netstat 和 ss 指令有什麼不同？

兩者都能查詢 socket 與連線狀態，\`ss\` 較新、效能更好；但 \`netstat\` 語法在多數發行版仍可用，也廣泛出現在既有維運腳本中，兩種都值得熟悉。

## 參考資料

- [使用 Netstat 指令檢測網路的技巧（G.T.Wang）](https://blog.gtwang.org/linux/linux-netstat-command-examples/)

## 延伸閱讀

- [Linux 網路功能指令介紹：ifconfig、route、ping、nslookup、traceroute](/post/linux-network-commands-intro)：同樣聚焦 Linux、網路除錯，可接著比較不同情境的做法。
- [Linux 用 pm2 來管理伺服器](/post/linux-pm2-server-management)：同樣聚焦 Linux、伺服器管理，可接著比較不同情境的做法。
- [vi 編輯器入門教學：三種模式與常用指令完整整理](/post/vi-editor-basics)：同樣聚焦 Linux、伺服器管理，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2020-03-01，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};