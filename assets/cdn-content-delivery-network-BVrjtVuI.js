var e=`---
title: CDN（內容傳遞網路）是什麼？運作原理與導入時機一次搞懂
description: 說明 CDN 如何讓使用者就近取得檔案、DNS 導流機制，以及為何能提升效能、可靠度並降低成本。
date: 2013-01-10
category: DevOps
tags: [CDN, DNS, 反向代理, 網路架構]
readingTime: 4 分鐘
image: /images/tech/hero_cdn-content-delivery-network.webp
imageAlt: 機房內的網路交換設備與纜線配置
---
# CDN（內容傳遞網路）是什麼？運作原理與導入時機一次搞懂

CDN（Content Delivery Network，內容傳遞網路）是一種把內容快取到全球多個節點、讓使用者從最近節點取得檔案的網路架構。網站常把 jQuery 這類共用函式庫、圖片等靜態資源放到 CDN 上，讀取速度會明顯變快，也能降低被 DDoS 打垮的風險。

## CDN 如何讓網頁載入變快？

CDN 的核心做法是「就近取得檔案」：內容提供者事先把檔案推送到全球各地的 CDN 節點，台灣的使用者盡量從台灣的節點下載，日本或香港的使用者則從當地節點下載。因為使用者是透過 CDN 讀取靜態資源，原始伺服器的負載也會跟著降低。

決定使用者該連到哪個節點，常見有三種做法：

- **GeoDNS**：DNS 伺服器依使用者來源 IP 判斷地理位置，回傳最近節點的 IP。
- **Anycast**：多個節點共用同一組 IP，路由層自動導向網路拓樸上最近的節點。
- **HTTP Redirect**：先連到預設節點，再用 302 導向實際該用的節點，多一次往返，效果比前兩者差。

## 沒有 CDN 和有 CDN，DNS 解析流程差在哪？

沒有 CDN 時，瀏覽器的路徑很直接：先向 DNS 伺服器查詢網址對應的 IP，拿到 IP 後直接連上那台網頁伺服器讀取內容。全部流量都打在同一台（或同一組）伺服器上。

接上 CDN 之後，多了一層判斷：使用者查詢網址時，CDN 的 DNS 伺服器會依使用者的來源資訊，算出離他最近的 CDN 節點，再把對應節點的 IP 回傳給使用者，使用者接著才向該節點要檔案。這個設計帶來一個附帶好處——某個節點壞掉時，DNS 可以把後續請求導到其他節點，網站不會因為單一節點故障就整個打不開。

## CDN 有哪些具體優點？

| 優點 | 說明 |
| --- | --- |
| 高效能 | 使用者就近讀取檔案，原始伺服器負載降低，靜態資源載入更快 |
| 高可靠度 | 主站當機時可從備援節點讀取內容，也能分散 DDoS 流量、降低單點被打爆的機率 |
| 低成本 | 流量分散到多個資料中心後，單一機房不必建置能扛下全部流量的頻寬。例如總流量 100Gbps 若分散到 20 個節點，每個節點只需扛 5Gbps，而小頻寬線路的建置成本效益通常優於單一大頻寬線路 |

## 有哪些常見的 CDN 服務商？

市面上較知名的 CDN 服務商包括 Akamai、Amazon CloudFront，以及提供免費方案的 CloudFlare。選擇時通常會考慮節點覆蓋範圍（尤其是否涵蓋自己主要使用者所在地區）、計價方式（依流量或依請求數），以及是否需要額外的安全防護（如 DDoS 防禦、WAF）。

## 常見問題

### CDN 只能拿來加速圖片和影片嗎？

不是。除了靜態資源（圖片、影片、CSS/JS），CDN 也常用來加速 API 回應（透過邊緣快取）、分散軟體套件下載（如 jQuery、字型檔），甚至協助抵禦 DDoS 攻擊，因為攻擊流量會先被節點吸收而非直接打到原始伺服器。

### 小型網站有必要用 CDN 嗎？

如果網站訪客集中在單一地區、流量不大，效益有限；但如果訪客分布全球、或站點需要抵禦流量攻擊，即使規模不大，導入免費方案（例如 CloudFlare 的基礎方案）通常仍值得一試。

## 參考資料
- MDN Web Docs，〈CDN〉詞彙表條目，說明內容傳遞網路的運作原理與優缺點，存取日期：2026-08-27。[https://developer.mozilla.org/en-US/docs/Glossary/CDN](https://developer.mozilla.org/en-US/docs/Glossary/CDN)

## 延伸閱讀

- [Nginx 基礎設定教學：安裝、設定檔檢查與反向代理入門](/post/nginx-basic-configuration)：同屬「DevOps」主題，可延伸理解相近問題的判斷方式。
- [Linux 網路功能指令介紹：ifconfig、route、ping、nslookup、traceroute](/post/linux-network-commands-intro)：同屬「DevOps」主題，可延伸理解相近問題的判斷方式。
- [K8S NodePort 高流量導致 ksoftirqd 佔滿 CPU 的原因與解法](/post/k8s-ksoftirqd-high-cpu)：同屬「DevOps」主題，可延伸理解相近問題的判斷方式。
`;export{e as default};