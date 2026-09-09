var e=`---
title: Charles 介紹 – 好用的封包抓取工具
description: Charles 是在電腦上常用的網路封包截取工具，本文介紹 Charles 的收費方式、截取 HTTP/HTTPS 封包、重發網路請求、修改請求參數與模擬慢速網路等核心功能，是做手機 App 開發與網路除錯時必備的 Proxy 抓包工具入門筆記。
date: 2019-09-27
category: 後端開發
tags: [Charles, Proxy, 封包分析, 網路除錯, HTTP]
readingTime: 3 分鐘
image: /images/tech/hero_charles-proxy-introduction.webp
imageAlt: 筆電螢幕上顯示網路流量與封包分析畫面，象徵 Charles 封包抓取工具
---


# Charles 介紹 – 好用的封包抓取工具

## Charles 是什麼？為什麼開發時需要封包抓取工具？

Charles 是在電腦上常用的網路封包截取工具，在做手機 App 開發時，我為了測試與伺服器端的網路通訊，常常需要截取網絡封包來分析。除了在做手機 App 開發中測試端口外，Charles 也可以用於分析第三方應用的通訊協議。配合 Charles 的 SSL 功能，Charles 還可以分析 HTTPS 協議。

## Charles 的運作原理是什麼？

Charles 通過將自己設置成系統的網絡訪問代理服務器（Proxy），使得所有的網絡訪問請求都通過它來完成，從而實現了網路封包的截取和分析。

> Charles 是收費軟件，可以免費試用 30 天。試用期過後，未付費的用戶仍然可以繼續使用，但是每次使用時間不能超過 30 分鐘，並且啟動時將會有 10 秒的延時。因此，該付費方案對廣大用戶還是相當友好的，即使你長期不付費，也能使用完整的軟件功能。只是當你需要長時間進行封包調試時，會因為 Charles 強制關閉而遇到影響。

## Charles 主要有哪些功能？

- 截取 HTTP 和 HTTPS 網絡封包。
- 支持重發網絡請求，方便後端調試。
- 支持修改網絡請求參數。
- 支持網絡請求的截獲並動態修改。
- 支持模擬慢速網絡。

## 軟體資訊

- 官方網站：[https://www.charlesproxy.com/](https://www.charlesproxy.com/)
- 軟體下載：[Download](https://www.charlesproxy.com/latest-release/download.do)

## 軟體使用

### 如何開始監聽所有連線？

打開 Charles 後它就會自動開始監聽系統的網路連線，介面上會即時列出每一筆請求：

![Charles 開始監聽所有連線的畫面](/images/articles/charles-proxy-introduction-1.webp)

### 如何觀看單一連線的資訊？

在左側列表點選某筆請求，就能看到該連線的完整內容：

![Charles 觀看連線資訊的畫面](/images/articles/charles-proxy-introduction-2.webp)

## 常見問題

### Charles 是免費軟體嗎？

Charles 是收費軟體，但可以免費試用 30 天。試用期過後仍可繼續使用完整功能，只是每次使用不能超過 30 分鐘，啟動時會有 10 秒延時。

### Charles 可以抓 HTTPS 的封包嗎？

可以。只要在手機或電腦上安裝並信任 Charles 的 Root Certificate，並對目標網域開啟 SSL Proxying，就能解密檢視 HTTPS 的請求與回應內容。

### Charles 的運作原理是什麼？

Charles 把自己設成系統的網路代理伺服器，讓所有網路請求都先經過它，因此能攔截、檢視並修改每一筆 HTTP/HTTPS 流量。

### Charles 可以模擬慢速網路嗎？

可以，Throttling 功能能模擬慢速網路環境，方便測試 App 在弱網下的表現。

## 參考資料

- [Charles 官方網站](https://www.charlesproxy.com/)
- [Charles 功能介紹和使用教程](https://codertw.com/%E7%A8%8B%E5%BC%8F%E8%AA%9E%E8%A8%80/667312/)
- [抓包神器之 Charles，常用功能都在这里了](https://www.jianshu.com/p/993bc794138d)

## 延伸閱讀

- [Charles 介紹 - 好用的封包抓取工具](/post/charles-proxy-packet-capture)：同樣聚焦 Charles、HTTP，可接著比較不同情境的做法。
- [使用 Charles抓取手機網路使用](/post/charles-proxy-mobile-traffic-capture)：同樣聚焦 Charles、Proxy，可接著比較不同情境的做法。
- [使用 Charles Proxy 抓取 Node.js 網路請求：Reverse Proxy 設定教學](/post/charles-proxy-nodejs-network-capture)：同樣聚焦 網路除錯，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2019-09-27，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};