var e=`---
title: CentOS 7 + XAMPP 如何用 Certbot 申請免費 SSL/TLS 憑證與常見除錯
description: 在 CentOS 7 的 XAMPP（/opt/lampp）環境用 Certbot 申請 Let's Encrypt 免費 SSL/TLS 憑證，整理 --apache-ctl 用法、config root 與 port 80 虛擬主機除錯、PEM 憑證格式說明與 httpd-ssl.conf 設定。
date: 2023-04-18
category: DevOps
tags: [Certbot, XAMPP, SSL/TLS, CentOS, Let's Encrypt]
readingTime: 5 分鐘
image: /images/tech/hero_centos7-xampp-certbot.webp
imageAlt: Certbot 為 XAMPP Apache 伺服器申請 Let's Encrypt SSL 憑證的設定示意圖
---


# CentOS 7 + XAMPP 如何用 Certbot 申請免費 SSL/TLS 憑證與常見除錯

這篇筆記記錄我在 CentOS 7 上為 XAMPP 的 Apache 申請 Let's Encrypt 免費 SSL/TLS 憑證的完整流程，包含 Certbot 的安裝、XAMPP 環境特有的 \`--apache-ctl\` 指令寫法，以及 \`Could not find configuration root\`、\`Please add a virtual host for port 80\` 這兩個我實際踩到的錯誤訊息與解法，最後說明拿到的是 \`.pem\` 而不是 \`.crt\`/\`.key\` 的原因。

## Certbot 是什麼？為什麼要用它申請憑證？

Certbot 是一個由 EFF（Electronic Frontier Foundation）開發的免費開源工具，用於自動化在 Web 伺服器上部署 SSL/TLS 憑證。它是一個自動化的客戶端，可以輕鬆獲得免費的 SSL/TLS 憑證，保護網站通信，避免手動建立憑證的複雜過程。

Certbot 支援多種伺服器軟體，包括 Apache、Nginx、HAProxy、Amazon Web Services 等，它使用 ACME（自動化憑證管理環境）協議從 Let's Encrypt 憑證頒發機構取得 SSL/TLS 憑證。使用 Certbot，可以輕鬆為網站啟用 HTTPS 協議，提高網站的安全性和可靠性。

## 如何安裝 Certbot？

Certbot 的安裝很貼心，在官方網站就可以選擇所使用的環境，然後就會有很詳細的安裝教學。

- 官方網站：[https://certbot.eff.org/](https://certbot.eff.org/)

![Certbot 官網選擇作業系統與伺服器軟體後給出對應安裝教學的截圖](/images/articles/centos7-xampp-certbot-1.webp)

## XAMPP 環境的憑證申請指令有什麼不同？

若要認證 XAMPP 的 Apache，不能直接使用 \`--apache\`，而是要指定 \`apache-ctl\` 的路徑，如下：

\`\`\`bash
sudo certbot certonly --webroot --apache-ctl /opt/lampp/bin/apachectl
\`\`\`

## 遇到 Could not find configuration root 怎麼辦？

下面這個錯誤訊息代表 Certbot 不知道網站本地端 http files 靜態路徑的位置：

\`\`\`
packages/certbot_apache/_internal/parser.py", line 924, in _find_config_root
    raise errors.NoInstallationError("Could not find configuration root")
certbot.errors.NoInstallationError: Could not find configuration root
\`\`\`

解決方法：在執行指令的時候告知 http files 靜態路徑的位置。

\`\`\`bash
sudo certbot certonly --webroot --apache-ctl /opt/lampp/bin/apachectl
\`\`\`

或者直接用 \`-w\` 指定 webroot：

\`\`\`bash
sudo certbot renew --webroot -w /var/www/html/
\`\`\`

## 遇到 Please add a virtual host for port 80 怎麼辦？

\`\`\`bash
ERROR:certbot._internal.log:Unable to find a virtual host listening on port 80 which is currently needed for Certbot to prove to the CA that you control your domain. Please add a virtual host for port 80.
\`\`\`

這個錯誤表示 Certbot 無法在 port 80 上找到正在偵聽的虛擬主機，以便證明你控制該域名。因為 Certbot 需要在域名的 80 port 上建立一個臨時 HTTP 伺服器來進行驗證。

要解決這個問題，需要在 Apache 伺服器上為 port 80 加上虛擬主機配置。在 \`/opt/lampp/apache2/conf/httpd.conf\` 加入以下內容：

\`\`\`apache
<VirtualHost *:80>
    ServerAdmin your-email@example.com
    ServerName your-domain.com
    DocumentRoot /var/www/html
</VirtualHost>
\`\`\`

接著重啟 XAMPP：

\`\`\`bash
sudo /opt/lampp/lampp stop
sudo /opt/lampp/lampp start
\`\`\`

或者：

\`\`\`bash
sudo service apache2 restart
\`\`\`

## 驗證還是失敗時，還有哪些除錯方向？

1. **防火牆沒有開**：可以在本機中用 \`curl\` 去打 IP，再從外面打一次。若裡面可以、外面不行，代表防火牆沒有開。
2. **httpd 設定只有 localhost 可存取**：應要把權限設定為 \`Require all granted\`。可用下面的指令找出 httpd.conf 的位置，並檢查網站是不是被設定成 \`Require local\`：

\`\`\`bash
sudo find / -name httpd.conf
\`\`\`

## 為什麼拿到的憑證是 .pem 而不是 .crt 和 .key？

成功申請後會看到下面的訊息：

\`\`\`bash
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/bliss-angel.org/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/bliss-angel.org/privkey.pem
\`\`\`

或許會懷疑為什麼都是 \`.pem\`，而不是 \`.crt\` 和 \`.key\`。這是因為 SSL/TLS 憑證的格式可以有很多種，PEM 格式是其中一種常見的格式，而 \`.crt\` 和 \`.key\` 則是 PEM 格式的一種變體。

PEM 格式是一種基於 Base64 編碼的標準格式，可以將數位憑證和私鑰等敏感資訊以文字格式表示出來，同時保持資料的可讀性。PEM 格式的憑證通常以 \`.pem\` 為檔案擴展名，可以包含公鑰、私鑰、憑證鏈等資訊。

而 \`.crt\` 和 \`.key\` 則是 PEM 格式的變體：\`.crt\` 檔案包含數位憑證，\`.key\` 檔案包含私鑰。這兩種檔案格式同樣是基於 Base64 編碼的 PEM 格式，只是檔名和內容有所不同。

為什麼有時候會看到 PEM 格式的憑證而不是 \`.crt\` 和 \`.key\` 檔案？因為 PEM 格式憑證可以包含多種類型的數位憑證和私鑰，而且可以用於多種網路應用程式。例如在 OpenSSL 等工具中，PEM 格式憑證可以用於 SSL/TLS 加密、S/MIME 郵件加密、SSH 伺服器驗證等方面。

因此，拿到一個 PEM 格式的憑證時，可以透過檔案內容判斷它所包含的數位憑證或私鑰類型。如果需要將 PEM 格式憑證轉換成 \`.crt\` 和 \`.key\` 檔案，可以使用 OpenSSL 等工具進行轉換。

不過這不影響使用，直接在 \`/opt/lampp/etc/extra/httpd-ssl.conf\` 設定，重啟 Apache 後 SSL 憑證就生效了：

\`\`\`bash
SSLCertificateFile "/etc/letsencrypt/live/bliss-angel.org/fullchain.pem"
SSLCertificateKeyFile "/etc/letsencrypt/live/bliss-angel.org/privkey.pem"
\`\`\`

## 常見問題

### Certbot 是免費的嗎？

是。Certbot 是 EFF 開發的免費開源工具，搭配 Let's Encrypt 憑證頒發機構即可免費取得 SSL/TLS 憑證，憑證有效期 90 天，可用 \`certbot renew\` 自動續約。

### 為什麼 XAMPP 環境不能直接用 --apache 參數？

因為 XAMPP 的 Apache 安裝在 \`/opt/lampp\` 底下，Certbot 找不到系統預設的 Apache 設定位置。必須用 \`--apache-ctl /opt/lampp/bin/apachectl\` 明確指定 apachectl 的路徑。

### 憑證檔案應該放在哪裡設定？

Let's Encrypt 的憑證會放在 \`/etc/letsencrypt/live/<域名>/\` 底下。XAMPP 環境可在 \`/opt/lampp/etc/extra/httpd-ssl.conf\` 中以 \`SSLCertificateFile\` 和 \`SSLCertificateKeyFile\` 指向 fullchain.pem 與 privkey.pem。

### 驗證一直失敗要先檢查什麼？

先確認 port 80 有設定虛擬主機且防火牆有開。可以在本機用 curl 打自己的 IP，再從外部打一次：內通外不通就是防火牆問題；另外檢查 httpd.conf 是否設成 \`Require local\`，需改為 \`Require all granted\`。

## 參考資料

- [Certbot 官方網站（EFF）](https://certbot.eff.org/)

## 延伸閱讀

- [在AWS的EC2裡加上SSL/TSL](/post/aws-ec2-ssl-tls-certificate)：同屬「DevOps」主題，可延伸理解相近問題的判斷方式。
- [CentOS 無法連接 mirror.centos.org：改用 vault.centos.org 修復 yum repo](/post/centos-mirror-centos-org-unreachable)：同樣聚焦 CentOS，可接著比較不同情境的做法。
- [CentOS 安裝 Nginx RTMP 模組：openssl、zlib、pcre 編譯流程](/post/install-nginx-rtmp-module-centos)：同樣聚焦 CentOS，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2023-04-18，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};