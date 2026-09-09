var e=`---
title: 在AWS的EC2裡加上SSL/TSL
description: 在 AWS EC2 自架 Linux 伺服器時如何加上 SSL/TLS 憑證？本文說明 SSL/TLS 原理、為什麼需要 ACM 免費憑證、Route 53 託管網域與 Elastic Load Balancing 的設定要點。
date: 2023-04-19
category: DevOps
tags: [AWS, EC2, SSL, TLS, Route 53]
readingTime: 3 分鐘
image: /images/tech/hero_aws-ec2-ssl-tls-certificate.webp
imageAlt: 機房伺服器與網路線的特寫照片，代表在 AWS EC2 上設定 SSL/TLS 加密連線
---


# 在AWS的EC2裡加上SSL/TSL

在 AWS EC2 自架 Linux 伺服器時，HTTPS 加密連線要自己動手設定。這篇文章記錄我在 EC2 上加上 SSL/TLS 的過程：SSL/TLS 是什麼、為什麼選擇 AWS ACM 的免費憑證，以及需要搭配 Route 53 與 Elastic Load Balancing 的原因。

## SSL/TSL 是甚麼？

SSL/TLS 是一種網絡協議，用於在客戶端和服務器之間提供安全的數據傳輸。SSL 代表「安全套接字層」（Secure Sockets Layer），TLS 代表「傳輸層安全性」（Transport Layer Security），兩者是相似的協議，TLS 是 SSL 的升級版。

SSL/TLS 通過加密數據流來保護通信的隱私和完整性，以防止數據在傳輸過程中被竊聽或篡改。它使用數字證書來驗證服務器身份，以確保連接到的服務器是預期的服務器，而不是惡意者偽裝的服務器。

SSL/TLS 廣泛用於保護網站、電子郵件、即時通訊、虛擬專用網絡（VPN）等應用程序中的數據傳輸。通過使用 SSL/TLS，這些應用程序能夠提供更安全的通信，確保用戶的數據受到保護。

## 甚麼情況需要自行設定 SSL/TLS？

這邊所說的是自架的 Linux 服務器的狀況。一般若是在網域託管的服務商買網站空間，使用 cPanel 等管理網站的狀況下，通常會在空間購買裡面附設免費的 SSL/TLS 證書，除非我們的網站需要額外的附加資訊才需要自行購買。

這篇文章所講的主要是當我們要在 Linux 裡面自行設定 SSL/TLS，或使用 AWS、Azure 等服務的虛擬機器架設網站時，會需要自行於 Linux 中建立 SSL/TLS 並匯入所需的 SSL/TLS 認證。

## 在 AWS 中使用免費的 ACM 憑證

AWS 官方有很詳細的指導文件：[教學課程：在 Amazon Linux 2 上設定 SSL/TLS](https://docs.aws.amazon.com/zh_tw/AWSEC2/latest/UserGuide/SSL-on-amazon-linux-2.html)。

但這份教學在後面匯入 SSL 證書的部分，是要我們自己去購買自己網域專屬的證書，那個很貴而且不太能夠免費。一般免費的 SSL/TLS 憑證，其組織等資訊並不會附在上面，如下圖為 AWS 所提供的免費憑證：

![AWS ACM 提供的免費 SSL/TLS 憑證資訊](/images/articles/aws-ec2-ssl-tls-certificate-1.webp)

要使用免費憑證，一個重要的前提是要將我們所購買的網域交給 AWS 的 Route 53 來託管，這個動作會產生微量的費用，一個月為 0.51 美金。

![將網域交給 Route 53 託管](/images/articles/aws-ec2-ssl-tls-certificate-2.webp)

在 AWS 裡面，有一些服務本身就可以直接和 Route 53 整合；若是沒辦法，則要另外建立 Elastic Load Balancing，這個是免費的，它可以用來連結我們的 EC2 和 Route 53，這樣就可以利用 ACM 來設定憑證了。

![透過 Elastic Load Balancing 連結 EC2 與 Route 53，並以 ACM 設定憑證](/images/articles/aws-ec2-ssl-tls-certificate-3.webp)

## ACM 憑證可以直接裝在 EC2 上嗎？

後來我才注意到一件事：ACM 發的免費公開憑證**不能匯出或下載**，所以無法像傳統憑證那樣把 \`.crt\` 檔案直接裝在 EC2 的 Nginx 或 Apache 上，它只能在有支援的 AWS 服務上直接掛載，常見的組合是 ALB（Application Load Balancer）或 CloudFront。實務上我會在 ALB 的 listener 上掛 ACM 憑證監聽 443，再把 80 埠的 HTTP 請求重導到 HTTPS。

如果一定要讓憑證直接裝在 EC2 上（例如不想多一層 ALB 的成本），可以改用 [Let's Encrypt](https://letsencrypt.org/zh-tw/) 搭配 certbot 簽發免費憑證，以 \`sudo certbot --nginx\` 之類的指令自動設定，憑證 90 天到期但 certbot 會自動排程續約，同樣能達到免費加密的效果。兩種做法的取捨：ALB + ACM 管理簡單、自動續約，但 ALB 本身有每小時費用；certbot 直接裝在主機上最省錢，但續約與設定要自己顧。

## 常見問題

### SSL 和 TLS 有什麼差別？

TLS 是 SSL 的升級版，兩者是相似的協議。現在說的「SSL 憑證」實際上幾乎都是使用 TLS，但因為 SSL 這個名字比較廣為人知，所以習慣上仍合稱 SSL/TLS。

### 為什麼在 EC2 上建議使用 AWS ACM 的免費憑證？

自行購買網域專屬的憑證費用很高，而 ACM 提供的免費憑證可以自動續約、部署。缺點是免費憑證上不會附組織等詳細資訊，且必須搭配 Route 53 等 AWS 服務使用。

### 使用 ACM 免費憑證的前提是什麼？

必須把購買的網域交給 AWS Route 53 託管，這會產生每月約 0.51 美金的少量費用。若服務無法直接與 Route 53 整合，則需另外建立免費的 Elastic Load Balancing 來連結 EC2 與 Route 53。

### 在虛擬主機代管服務上也需要自己設定 SSL/TLS 嗎？

通常不需要。使用 cPanel 等管理介面的虛擬主機方案，大多會附贈免費的 SSL/TLS 憑證，只有在網站需要額外的憑證資訊（如組織驗證）時才需要自行購買。

## 參考資料

- [教學課程：在 Amazon Linux 2 上設定 SSL/TLS（AWS 官方文件）](https://docs.aws.amazon.com/zh_tw/AWSEC2/latest/UserGuide/SSL-on-amazon-linux-2.html)

## 延伸閱讀

- [CentOS 7 + XAMPP 如何用 Certbot 申請免費 SSL/TLS 憑證與常見除錯](/post/centos7-xampp-certbot)：同屬「DevOps」主題，可延伸理解相近問題的判斷方式。
- [現代資料架構 on AWS：從資料湖到 Lake House 的設計思考](/post/modern-data-architecture-on-aws)：同樣聚焦 AWS，可接著比較不同情境的做法。
- [雲端相似性搜尋資料庫研究：AWS DocDB、阿里雲 OpenSearch 與 Amazon Neptune 向量搜尋比較](/post/cloud-similarity-search-databases-research)：同樣聚焦 AWS，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2023-04-19，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};