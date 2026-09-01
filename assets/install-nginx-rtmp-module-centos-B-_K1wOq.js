var e=`---
title: CentOS 安裝 Nginx RTMP 模組：openssl、zlib、pcre 編譯流程
description: 整理在 CentOS 為 Nginx 編譯 RTMP 模組的必要套件、下載步驟、configure 指令與常見版本注意事項。
date: 2020-12-04
category: DevOps
tags: [Nginx, RTMP, CentOS]
readingTime: 5 分鐘
image: /images/tech/hero_install-nginx-rtmp-module-centos.webp
imageAlt: 資料中心機櫃與網路線材，象徵 CentOS 上部署 Nginx RTMP 串流服務
---
# CentOS 安裝 Nginx RTMP 模組：openssl、zlib、pcre 編譯流程

在 CentOS 為 Nginx 安裝 RTMP 模組時，核心流程是先準備 openssl、zlib、pcre，再重新編譯 Nginx 並透過 \`--add-module\` 加入 nginx-rtmp-module。這篇整理我實際操作過的手動編譯流程，並把步驟寫成較容易檢查的 DevOps 筆記。

## Nginx RTMP 模組需要哪些依賴？

Nginx RTMP 模組手動編譯時，通常需要先準備 openssl、zlib 與 pcre。這三個套件分別支援加密、壓縮與正規表示式功能。

必備模組是：

- openssl
- zlib
- pcre

Nginx 本身可用套件管理器安裝，但要加入第三方 RTMP 模組時，常見做法是下載 Nginx 原始碼並重新編譯。這種方式要特別注意版本一致性——我當初的操作紀錄中同時出現 \`pcre-8.42.zip\` 與 \`pcre-8.41.tar.gz\`、\`nginx-1.14.0\` 與 \`nginx-1.12.2\`，實作時應統一版本，避免混用。

## 如何安裝 pcre、zlib 與 openssl？

依賴套件可以先在 \`/tmp\` 下載、解壓縮、configure、make install。正式環境建議記錄版本號，避免日後重建時抓到不同來源。

我整理的安裝流程如下，實際執行前請先修正版本檔名一致性：

\`\`\`bash
cd /tmp

# 下載並安裝 pcre
wget https://sourceforge.net/projects/pcre/files/pcre/8.42/pcre-8.42.zip/download
unzip pcre-8.42.zip
cd pcre-8.42
./configure
make && make install

# 下載並安裝 zlib
cd /tmp
wget https://zlib.net/fossils/zlib-1.2.11.tar.gz
tar -xzvf zlib-1.2.11.tar.gz
cd zlib-1.2.11
./configure
make && make install

# 下載並安裝 openssl
cd /tmp
wget https://www.openssl.org/source/openssl-1.1.0h.tar.gz
tar -xzvf openssl-1.1.0h.tar.gz
cd openssl-1.1.0h
./config -fPIC --prefix=/usr
make && make install
\`\`\`

這段資訊的重點不是鼓勵照抄舊版本，而是記住編譯 Nginx RTMP 前要先確認三個依賴可以被 configure 找到。

## 如何下載 nginx-rtmp-module？

nginx-rtmp-module 是加入 RTMP 串流能力的第三方 Nginx 模組。編譯時要讓 Nginx 的 configure 指令指向模組目錄。

我使用的模組來源是 Sergey Dryabzhinsky 維護的 fork：

\`\`\`bash
cd /tmp
git clone https://github.com/sergey-dryabzhinsky/nginx-rtmp-module.git
\`\`\`

如果團隊已經有固定使用的 RTMP module fork，建議在部署文件中寫清楚 Git commit 或 release tag。串流伺服器通常是長期運作服務，版本漂移會讓問題難以重現。

## 如何重新編譯 Nginx 並加入 RTMP 模組？

Nginx 加入 RTMP 模組的關鍵是 configure 階段使用 \`--add-module=nginx-rtmp-module\`。編譯完成後再用 make install 安裝。

整理後的指令如下：

\`\`\`bash
cd /tmp
wget https://nginx.org/download/nginx-1.14.0.tar.gz
tar -xzvf nginx-1.14.0.tar.gz
useradd nginx
cd nginx-1.14.0
./configure --user=nginx --add-module=../nginx-rtmp-module
make && make install
\`\`\`

最後可以清理壓縮檔：

\`\`\`bash
cd /tmp
rm -f *.tar.gz *.zip
\`\`\`

清理前建議先確認 Nginx 已能啟動，且 \`nginx -V\` 能看到編譯參數。若服務跑在正式環境，還要補上 systemd service、Nginx 設定檔檢查與防火牆設定。

## 安裝流程有哪些注意事項？

CentOS 手動編譯 Nginx RTMP 時，最容易出錯的是版本檔名不一致、模組路徑錯誤與缺少編譯工具。先把版本固定，比事後除錯省時間。

實作前可用這份檢查表：

| 檢查項目 | 為什麼重要 |
| --- | --- |
| 版本一致 | 下載、解壓縮、cd 目錄必須是同一版 |
| 模組路徑 | \`--add-module\` 要指向正確資料夾 |
| 編譯工具 | 系統需有 gcc、make 等工具 |
| Nginx 使用者 | \`--user=nginx\` 前要先建立使用者 |
| 啟動驗證 | 編譯成功不等於服務設定可用 |

這份筆記的價值在於把實作時用到的完整手動編譯命令留下來。整理成文章後，我保留這條線索，但補上版本一致性提醒，避免讀者直接複製到一半卡住。

## 常見問題
### CentOS 可以用 yum 安裝 Nginx RTMP 模組嗎？

部分環境可以找到打包好的模組，但第三方 RTMP 模組常見做法仍是從 Nginx 原始碼重新編譯。若使用套件管理器，請確認模組版本和 Nginx 版本相容。

### \`--add-module\` 後面要填什麼？

\`--add-module\` 後面要填 nginx-rtmp-module 的本機路徑。若目前在 Nginx 原始碼目錄中，常見寫法是 \`--add-module=../nginx-rtmp-module\`。

### 為什麼安裝指令裡出現不同版本號？

我的原始筆記同時出現不同版本檔名，是編譯過程中留下的舊指令。實際執行時應統一版本，避免 \`cd\` 到不存在的資料夾。

### 安裝完成後怎麼確認 RTMP 模組存在？

可以先執行 \`nginx -V\` 查看 configure arguments，確認有 \`--add-module\` 相關紀錄。接著用 \`nginx -t\` 檢查設定檔。

### Nginx RTMP 模組適合正式串流服務嗎？

Nginx RTMP 模組可用於 RTMP 串流場景，但正式服務還需要監控、重啟策略、安全設定與頻寬規劃。手動編譯只是第一步。

## 參考資料
- Alibaba Cloud，〈[How to Install Nginx with RTMP Module on CentOS 7](https://alibaba-cloud.medium.com/how-to-install-nginx-with-rtmp-module-on-centos-7-f5bccabc8a3)〉。
- HowtoForge，〈[How to Install Nginx with RTMP Module on CentOS 7](https://www.howtoforge.com/tutorial/how-to-install-nginx-with-rtmp-module-on-centos/)〉。
- nginx，〈[nginx download](https://nginx.org/en/download.html)〉。
- GitHub，〈[sergey-dryabzhinsky/nginx-rtmp-module](https://github.com/sergey-dryabzhinsky/nginx-rtmp-module)〉。

## 延伸閱讀

- [Nginx 基礎設定教學：安裝、設定檔檢查與反向代理入門](/post/nginx-basic-configuration)：同樣聚焦 Nginx，可接著比較不同情境的做法。
- [OBS 推送 HEVC 直播串流到 SRS：Enhanced RTMP 設定教學](/post/obs-hevc-rtmp-srs-streaming)：同樣聚焦 RTMP，可接著比較不同情境的做法。
- [CentOS 無法連接 mirror.centos.org：改用 vault.centos.org 修復 yum repo](/post/centos-mirror-centos-org-unreachable)：同樣聚焦 CentOS，可接著比較不同情境的做法。

## 最後更新

2026-08-28

`;export{e as default};