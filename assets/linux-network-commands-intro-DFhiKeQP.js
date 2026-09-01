var e=`---
title: Linux 網路功能指令介紹：ifconfig、route、ping、nslookup、traceroute
description: 整理 Linux 常用的網路功能指令：ifconfig 查網路卡狀態、route 看路由表、ping 測網路連通、nslookup 查詢 DNS、traceroute 追蹤通訊包傳送路徑，附實際執行畫面與使用時機說明。
date: 2019-09-26
category: DevOps
tags: [Linux, 網路, 網路除錯, 指令列, DevOps]
readingTime: 4 分鐘
image: /images/tech/hero_linux-network-commands-intro.webp
imageAlt: 機房內伺服器機架與網路線，象徵 Linux 網路功能指令的日常應用
---


# Linux 網路功能指令介紹：ifconfig、route、ping、nslookup、traceroute

這篇整理我在管理 Linux 系統時最常用的五個網路功能指令：\`ifconfig\`、\`route\`、\`ping\`、\`nslookup\` 與 \`traceroute\`。從確認網路卡狀態、檢查路由表，到測試連線、查 DNS、追蹤封包路徑，這幾個指令幾乎涵蓋了日常網路除錯的基本盤，適合剛接觸 Linux 網路管理的讀者建立整體概念。

## Linux 網路除錯有哪些常用指令？

我的習慣是按照「網路卡 → 路由 → 連通性 → DNS → 路徑」的順序排查問題：

| 指令 | 用途 |
| --- | --- |
| \`ifconfig\` | 查詢系統的網路卡狀態 |
| \`route\` | 查看網路通訊包傳送的路由情況 |
| \`ping\` | 察看對方網路是否有通 |
| \`nslookup\` | 查詢或反查詢 DNS |
| \`traceroute\` | 追查通訊包傳送的路徑 |

底下依序說明每個指令的實際用法與執行結果。

## ifconfig：查詢網路卡狀態

\`ifconfig\` 用來查詢系統的網路卡狀態，可以看到每張介面的 IP 位址、MAC 位址、子網路遮罩，以及收送的封包數與錯誤統計。網路不通時我會先看這裡，確認介面有沒有正確拿到 IP、有沒有跑出 RX/TX error：

![ifconfig 查詢網路卡狀態的執行結果](/images/articles/linux-network-commands-intro-1.webp)

## route：查看路由表

\`route\` 用來看網路通訊包傳送的路由情況。加上 \`-n\` 參數可以直接以 IP 顯示（不做名稱反查，速度較快），重點看 default gateway 指向哪裡——封包出不了外網，多半是這一行的問題：

![route 查看路由表的執行結果](/images/articles/linux-network-commands-intro-2.webp)

## ping：測試對方網路是否有通

\`ping\` 用來察看對方網路是否有通。它送出 ICMP echo request 並等待回應，從輸出可以看到每個封包的來回時間（time）與 TTL；\`ctrl + c\` 結束後會統計丟包率。目標主機 ping 不到時，先確認對方有沒有擋 ICMP，再往下查 DNS 或路由：

![ping 測試網路連通的執行結果](/images/articles/linux-network-commands-intro-3.webp)

## nslookup：查詢或反查詢 DNS

\`nslookup\` 用來查詢或反查詢 DNS。直接給網域名稱，它會回傳對應的 IP 位址：

![nslookup 以網域名稱查詢 IP 的執行結果](/images/articles/linux-network-commands-intro-4.webp)

也可以反過來用 IP 查詢網址（PTR 反查），排查郵件退信、log 來源 IP 之類的問題時很好用：

![nslookup 以 IP 反查網址的執行結果](/images/articles/linux-network-commands-intro-5.webp)

## traceroute：追查封包傳送路徑

\`traceroute\` 用來追查通訊包傳送的情況，會列出封包沿途經過的每一個路由器節點。例如我要從 SeedNet 的網路上查詢到成大代理伺服器的通訊狀況，就能看到封包在哪些節點之間轉送、每一跳花費多少時間——延遲突然飆高或出現 \`* * *\` 的那一跳，往往就是問題所在：

![traceroute 追查到成大代理伺服器的傳送路徑](/images/articles/linux-network-commands-intro-6.webp)

## 這五個指令的排查順序怎麼安排？

遇到「網路不通」時，我會這樣依序排查：

1. \`ifconfig\`：網路卡有沒有拿到 IP、有沒有錯誤統計？
2. \`route\`：default gateway 有沒有設對？
3. \`ping\`：閘道通嗎？外部 IP（例如 \`8.8.8.8\`）通嗎？
4. \`nslookup\`：IP 通但網址不通，那就是 DNS 的問題。
5. \`traceroute\`：對方有通但很慢，看封包卡在哪一跳。

照這個順序走一輪，大部分的連線問題都能定位出是本機、區網、DNS 還是對端的責任。

## 常見問題

### 為什麼我的系統沒有 ifconfig 指令？

新版發行版多改用 \`iproute2\` 套件，可用 \`ip addr\` 取代 \`ifconfig\`、\`ip route\` 取代 \`route\`。若仍想使用舊指令，安裝 \`net-tools\` 套件即可。

### ping 得到 IP 卻連不上網址，是什麼問題？

代表網路層連通正常，問題多半出在 DNS。用 \`nslookup\` 查詢該網址，確認是否能正確解析出 IP、以及回應的 DNS 伺服器是哪一台。

### nslookup 與 dig 有什麼差別？

兩者都是 DNS 查詢工具，\`dig\` 的輸出資訊更完整（含 TTL、授權紀錄等），適合深入除錯；\`nslookup\` 輸出簡潔，適合快速查詢與反查。

### traceroute 出現星號（* * *）代表斷線了嗎？

不一定。有些路由器會刻意不回應 ICMP/TTL exceeded 訊息，該跳就會顯示星號。只要後面的節點與目的地仍有回應，連線通常沒問題。

## 參考資料

- 本系列文章：IT邦幫忙鐵人賽 Linux 筆記系列

## 延伸閱讀

- [線上練習 Linux 指令：不用裝虛擬機的 4 個免費網站](/post/practice-linux-commands-online)：同樣聚焦 Linux、指令列，可接著比較不同情境的做法。
- [利用 netstat 查詢連線數量（connections）](/post/netstat-connection-count)：同樣聚焦 Linux、網路除錯，可接著比較不同情境的做法。
- [Linux 基本操作指令介紹](/post/linux-basic-commands-cheatsheet)：同樣聚焦 Linux、指令列，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2019-09-26，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};