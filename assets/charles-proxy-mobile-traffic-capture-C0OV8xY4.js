var e=`---
title: 使用 Charles抓取手機網路使用
description: 學習如何用 Charles Proxy 抓取手機的網路流量：將電腦與手機連上同一個 Wi-Fi、取得電腦內網 IP、設定 Charles 的 Proxy settings 與手機 Wi-Fi 代理，即可在電腦上即時檢視手機的 HTTP/HTTPS 請求，是 App 與前端除錯的必備網路除錯技巧。
date: 2019-10-14
category: 後端開發
tags: [Charles, Proxy, 網路除錯, HTTP, Mobile]
readingTime: 3 分鐘
image: /images/tech/hero_charles-proxy-mobile-traffic-capture.webp
imageAlt: 藍色網路線連接到雲端路由器交換器的特寫，象徵網路流量監控
---


# 使用 Charles抓取手機網路使用

想在一台電腦上看到手機正在發出哪些網路請求嗎？這篇文章記錄我用 Charles Proxy 抓取手機網路使用資訊的完整步驟：只要把電腦和手機連上同一個 Wi-Fi，設定電腦端的 Charles 與手機端的 Wi-Fi 代理，就能即時在電腦上檢視手機的所有網路連線，非常適合用來除錯 App 或行動版網頁的 API 請求。

## 為什麼需要用 Charles 抓手機的網路流量？

開發 App 或行動網頁時，很多請求發生在手機上，瀏覽器的開發者工具看不到。透過 Charles 把手機的流量導到電腦，我就能在電腦上直接看到每個請求的 URL、header、回應內容與耗時，等於把手機的網路行為完整攤開來檢查。

## 使用 Charles 抓取手機網路使用資訊的步驟

1. 將電腦和手機連上同一個 Wi-Fi 網路
2. 輸入 \`ifconfig\`（Mac 電腦）取得電腦的內網 IP，如下圖可得知內網 IP 為 \`192.168.1.104\`

![用 ifconfig 查詢 Mac 電腦的內網 IP](/images/articles/charles-proxy-mobile-traffic-capture-1.webp)

3. 設置 Charles 上的 Proxy settings

![Charles 的 Proxy Settings 選單](/images/articles/charles-proxy-mobile-traffic-capture-2.webp)

![Charles Proxy Settings 的 HTTP Proxy 設定視窗](/images/articles/charles-proxy-mobile-traffic-capture-3.webp)

4. 設置手機上的 Wi-Fi 的 Proxy（手動代理指向電腦的內網 IP 與 Charles 的 port）

![手機 Wi-Fi 設定 HTTP Proxy](/images/articles/charles-proxy-mobile-traffic-capture-4.webp)

5. 此時即可在電腦上看到手機的網路使用狀況

![在 Charles 上檢視手機的網路請求](/images/articles/charles-proxy-mobile-traffic-capture-5.webp)

## 設定時的幾個小提醒

- 手機與電腦必須在**同一個網段**，否則手機連不到電腦上的 Charles。
- 首次連線時 Charles 會跳出確認對話框，記得按 Allow 允許該裝置。
- 若要檢視 HTTPS 內容，需另外安裝並信任 Charles 的 Root Certificate，並開啟 SSL Proxying。
- 不使用時記得把手機的 Proxy 關掉，否則電腦關機後手機會無法上網。

## 常見問題

### 手機一定要和電腦連同一個 Wi-Fi 嗎？

是的。Charles 的原理是讓手機把 Wi-Fi 的 HTTP 代理指向電腦，兩者必須在同一個區網內，手機才連得到電腦上的 Charles（例如電腦內網 IP 為 \`192.168.1.104\`）。

### 怎麼查電腦的內網 IP？

Mac 上在終端機輸入 \`ifconfig\`，找到 Wi-Fi 介面（通常是 \`en0\`）的 \`inet\` 位址即可；Windows 可用 \`ipconfig\` 查詢。

### 可以看到 HTTPS 請求的內容嗎？

可以，但需要在手機上安裝並信任 Charles 的 Root Certificate，並在 Charles 中對目標網域開啟 SSL Proxying，之後就能解密檢視 HTTPS 的請求與回應內容。

### 為什麼設定完 Proxy 手機就不能上網了？

最常見的原因是 Charles 已關閉或兩台裝置不在同一個網段，手機的流量導不到代理。不使用 Charles 時，記得把手機 Wi-Fi 設定裡的 HTTP Proxy 改回「關閉」。

## 參考資料

- [Charles Proxy 官方網站](https://www.charlesproxy.com/)
- 本篇為 2019 鐵人賽系列筆記，搭配 [使用 Charles Proxy 擷取 Node.js 網路流量](/post/charles-proxy-nodejs-network-capture) 閱讀更完整。

## 延伸閱讀

- [Charles 介紹 – 好用的封包抓取工具](/post/charles-proxy-introduction)：同樣聚焦 Charles、Proxy，可接著比較不同情境的做法。
- [使用 Charles Proxy 抓取 Node.js 網路請求：Reverse Proxy 設定教學](/post/charles-proxy-nodejs-network-capture)：同樣聚焦 網路除錯，可接著比較不同情境的做法。
- [Charles 介紹 - 好用的封包抓取工具](/post/charles-proxy-packet-capture)：同樣聚焦 Charles、HTTP，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2019-10-14，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};