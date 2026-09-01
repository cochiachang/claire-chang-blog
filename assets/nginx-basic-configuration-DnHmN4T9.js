var e=`---
title: Nginx 基礎設定教學：安裝、設定檔檢查與反向代理入門
description: 說明 Nginx 的安裝、啟動、reload、設定檔位置、靜態資源快取與反向代理基本概念。
date: 2019-10-07
category: DevOps
tags: [Nginx, Reverse Proxy, Web Server]
readingTime: 6 分鐘
image: /images/tech/hero_nginx-basic-configuration.webp
imageAlt: Nginx 反向代理與伺服器設定示意圖
---
# Nginx 基礎設定教學：安裝、設定檔檢查與反向代理入門

Nginx 常用於靜態檔案服務、反向代理、快取與簡單負載平衡。入門時先掌握安裝、啟動、\`nginx -t\` 檢查設定、\`nginx -s reload\` 重新載入，再開始調整 server block 與 proxy 設定。

## 如何安裝與啟動 Nginx？

macOS 可用 Homebrew 安裝 Nginx。Linux 伺服器則通常用發行版套件管理工具，例如 \`apt\`、\`dnf\` 或 \`yum\`。

macOS 安裝：

\`\`\`bash
brew install nginx
\`\`\`

常用控制指令：

\`\`\`bash
# 啟動 nginx
nginx

# 停止 nginx
nginx -s stop

# 重新讀取設定檔
nginx -s reload
\`\`\`

在 Linux production 環境，通常會交給 systemd 管理：

\`\`\`bash
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl reload nginx
\`\`\`

## Nginx 設定檔在哪裡？

Nginx 設定檔位置會因安裝方式而不同。最可靠的方式是執行 \`nginx -t\`，它會顯示設定檔路徑並檢查語法。

\`\`\`bash
nginx -t
\`\`\`

常見位置：

| 環境 | 常見設定檔 |
| --- | --- |
| Homebrew macOS | \`/opt/homebrew/etc/nginx/nginx.conf\` |
| Ubuntu/Debian | \`/etc/nginx/nginx.conf\` |
| CentOS/RHEL | \`/etc/nginx/nginx.conf\` |

注意：原文提到 \`ngix.conf\`，正確檔名通常是 \`nginx.conf\`。修改設定前先備份，修改後一定要跑 \`nginx -t\`。

## Nginx 主要可以做什麼？

Nginx 最常見用途是提供靜態資源與反向代理。靜態資源由 Nginx 直接回應，動態 API 則轉發給後端應用程式。

| 功能 | 說明 |
| --- | --- |
| 靜態檔案服務 | 回應 HTML、CSS、JavaScript、圖片 |
| 反向代理 | 把外部請求轉給內部應用程式 |
| 快取 | 快取靜態資源或 upstream response |
| 負載平衡 | 把流量分配到多台後端 |
| TLS 終止 | 集中處理 HTTPS 憑證 |

資訊增益：把 Nginx 放在 Node.js、Python 或 Java 應用程式前面，通常不是為了「讓程式變快」而已，更重要的是把 TLS、靜態檔案、壓縮、proxy header 與 timeout 集中管理。

## 反向代理是什麼？

反向代理是由 Nginx 代表後端伺服器接收使用者請求，再把請求轉給內部服務。使用者只看到 Nginx 的網址，不需要知道後面有幾台 application server。

最小反向代理範例：

\`\`\`nginx
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
\`\`\`

如果後端需要 WebSocket，還要補上 upgrade header：

\`\`\`nginx
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
\`\`\`

## 修改 Nginx 設定後怎麼安全套用？

修改 Nginx 設定後，不要直接重啟。先用 \`nginx -t\` 檢查語法，確認成功後再 reload，避免服務因設定錯誤中斷。

安全流程：

\`\`\`bash
sudo nginx -t
sudo systemctl reload nginx
\`\`\`

若不是 systemd 環境：

\`\`\`bash
sudo nginx -s reload
\`\`\`

reload 會讓 Nginx 重新讀取設定，通常比 stop/start 更適合線上服務。

## 常見問題

### Nginx 和 Apache 有什麼不同？

Nginx 常被用在高併發靜態檔案與反向代理場景。Apache 模組生態成熟，兩者都能做 Web Server，選擇通常取決於團隊經驗與部署架構。

### Nginx 修改設定後一定要重啟嗎？

不一定。多數設定可用 reload 套用，建議先 \`nginx -t\`，再執行 reload。

### Nginx 可以代理 Node.js API 嗎？

可以。常見做法是讓 Node.js 監聽 localhost port，再由 Nginx 對外提供網域、HTTPS 與反向代理。

### Nginx 設定檔錯了怎麼辦？

若尚未 reload，修正設定後重新 \`nginx -t\`。若已造成服務異常，回復備份設定並 reload。

### Nginx 反向代理需要設定 header 嗎？

通常需要。\`Host\`、\`X-Real-IP\`、\`X-Forwarded-For\` 與 \`X-Forwarded-Proto\` 可讓後端知道原始請求資訊。

## 參考資料

- Nginx Documentation：[Beginner's Guide](https://nginx.org/en/docs/beginners_guide.html)
- Nginx Documentation：[Reverse Proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)
- Nginx Documentation：[Command-line parameters](https://nginx.org/en/docs/switches.html)

## 延伸閱讀

- [CentOS 安裝 Nginx RTMP 模組：openssl、zlib、pcre 編譯流程](/post/install-nginx-rtmp-module-centos)：同樣聚焦 Nginx，可接著比較不同情境的做法。
- [使用 PM2 管理 Node.js 伺服器教學](/post/pm2-node-server-management)：同樣聚焦 Nginx，可接著比較不同情境的做法。
- [Chunked Encoding 分塊編碼介紹與 Nginx 設定教學](/post/chunked-encoding-introduction)：同樣聚焦 Nginx，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2026-08-28。原文發布於 2019-10-07，本文補上 systemd、設定檔檢查與 WebSocket proxy 注意事項。

`;export{e as default};