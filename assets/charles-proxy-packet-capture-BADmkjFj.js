var e=`---
title: Charles 介紹 - 好用的封包抓取工具
description: Charles 是好用的封包抓取工具（HTTP Proxy），可以攔截電腦與手機的網路請求，查看 Request 與 Response 內容。本文介紹 Charles 的原理、安裝設定與實際抓包用法。
date: 2019-09-27
category: 後端開發
tags: [Charles, 封包擷取, HTTP, HTTPS, 除錯工具]
readingTime: 4 分鐘
image: /images/tech/hero_charles-proxy-packet-capture.webp
imageAlt: Charles 封包抓取工具官方下載頁面
---


# Charles 介紹 - 好用的封包抓取工具

手機 APP 開發時要怎麼確認客戶端與伺服器之間到底送了什麼資料？Charles 是在電腦上常用的網路封包截取工具，透過將自己設置成系統的網路代理伺服器，讓所有網路請求都經過它，進而截取和分析封包。這篇整理 Charles 的基本介紹、主要功能與開始監聽連線的使用方式。

## Charles 是什麼？在哪裡下載？

### 軟體資訊

- 官方網站：[https://www.charlesproxy.com/](https://www.charlesproxy.com/)
- 軟體下載：[Download](https://www.charlesproxy.com/latest-release/download.do)

![Charles 官方網站的 macOS 下載頁面](https://www.charlesproxy.com/assets/sm/upload/ze/ob/56/d0/charles-macosx.png)

## Charles 能用來做什麼？

Charles 是在電腦上常用的網路封包截取工具。在做手機 APP 開發時，我們為了測試與伺服器端的網路通訊，常常需要截取網絡封包來分析。除了在做手機 APP 開發中測試端口外，Charles 也可以用於分析第三方應用的通訊協議。配合 Charles 的 SSL 功能，Charles 還可以分析 HTTPS 協議。

Charles 通過將自己設置成系統的網絡訪問代理服務器，使得所有的網絡訪問請求都通過它來完成，從而實現了網路封包的截取和分析。

> Charles 是收費軟件，可以免費試用 30 天。試用期過後，未付費的用戶仍然可以繼續使用，但是每次使用時間不能超過 30 分鐘，並且啟動時將會有 10 秒的延時。因此，該付費方案對廣大用戶還是相當友好的，即使你長期不付費，也能使用完整的軟件功能。只是當你需要長時間進行封包調試時，會因為 Charles 強制關閉而遇到影響。

### Charles 主要的功能包括

- 截取 HTTP 和 HTTPS 網絡封包。
- 支持重發網絡請求，方便後端調試。
- 支持修改網絡請求參數。
- 支持網絡請求的截獲並動態修改。
- 支持模擬慢速網絡。

## 怎麼開始監聽與觀看連線？

### 1. 開始監聽所有連線

![Charles 開始監聽所有連線的介面截圖](/images/articles/charles-proxy-packet-capture-1.webp)

### 2. 觀看連線資訊

![Charles 觀看個別連線詳細資訊的介面截圖](/images/articles/charles-proxy-packet-capture-2.webp)

## 常見問題

### Charles 是免費軟體嗎？

Charles 是收費軟體，可免費試用 30 天。試用期過後未付費仍可繼續使用，但每次使用時間不能超過 30 分鐘，啟動時會有 10 秒延時，功能本身是完整的。

### Charles 為什麼可以抓到 HTTPS 封包？

Charles 透過把自己設成系統的網路代理伺服器，讓所有請求都經過它；配合 SSL 憑證功能，它可以解密並分析 HTTPS 協議的內容。

### Charles 適合什麼開發場景？

最常見的是手機 APP 開發時測試與伺服器端的網路通訊，也可以用來分析第三方應用的通訊協議、重發請求、修改請求參數或模擬慢速網路。

## 參考資料

- [Charles 官方網站](https://www.charlesproxy.com/)
- [Charles 功能介紹和使用教程](https://codertw.com/%E7%A8%8B%E5%BC%8F%E8%AA%9E%E8%A8%80/667312/)
- [抓包神器之 Charles，常用功能都在这里了](https://www.jianshu.com/p/993bc794138d)

## 延伸閱讀

- [Charles 介紹 – 好用的封包抓取工具](/post/charles-proxy-introduction)：同樣聚焦 Charles、HTTP，可接著比較不同情境的做法。
- [使用 Charles抓取手機網路使用](/post/charles-proxy-mobile-traffic-capture)：同樣聚焦 Charles、HTTP，可接著比較不同情境的做法。
- [使用 Charles Proxy 抓取 Node.js 網路請求：Reverse Proxy 設定教學](/post/charles-proxy-nodejs-network-capture)：同樣聚焦 HTTPS，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2019-09-27，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};