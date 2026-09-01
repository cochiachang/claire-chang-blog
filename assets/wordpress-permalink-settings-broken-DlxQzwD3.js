var e=`---
title: WordPress 永久連結設定失效怎麼辦？排查原因與 Apache2 mod_rewrite 設定完整教學
description: WordPress 永久連結失效、頁面 404 時該怎麼辦？我整理了 .htaccess 重新生成、網址設定檢查、主題衝突排查，以及 Apache2 啟用 mod_rewrite 模組的完整步驟，讓伺服器正確支援永久連結。
date: 2023-05-11
category: DevOps
tags: [WordPress, 永久連結, Apache2, mod_rewrite, .htaccess]
readingTime: 4 分鐘
image: /images/tech/hero_wordpress-permalink-settings-broken.webp
imageAlt: 螢幕顯示 WordPress logo 的藍色筆電
---


# WordPress 永久連結設定失效怎麼辦？排查原因與 Apache2 mod_rewrite 設定完整教學

WordPress 的永久連結（Permalink）設定失效時，文章網址會出現 404 錯誤。這篇文章整理我在自架伺服器上排查永久連結失效的四大原因，以及如何在 Apache2 上啟用 \`mod_rewrite\` 模組，讓永久連結正常運作。

## WordPress 永久連結失效的可能原因有哪些？

遇到永久連結失效時，我會依照以下順序逐一排查：

1. **\`.htaccess\` 檔案不正常**：進入 WordPress 的管理後台，點擊「設定」→「連結」，然後按下「儲存變更」。這樣 WordPress 會重新生成 \`.htaccess\` 檔案。如果這個步驟沒有解決問題，可以手動在 WordPress 安裝目錄中找到 \`.htaccess\` 檔案，並且檢查它是否存在。
2. **確認 WordPress 是否在正確的網址上運行**：如果 WordPress 安裝在子目錄或子網域下，請確認永久連結設定正確對應到子目錄這一點。
3. **伺服器是否支援永久連結**：如果伺服器不支援永久連結（例如 Apache2 未啟用 \`mod_rewrite\`），WordPress 將無法使用它們。
4. **確認主題是否有問題**：某些 WordPress 主題可能會干擾永久連結的正常運作。嘗試暫時更換到 WordPress 預設主題，並再次測試永久連結。

其中最常見的根因就是第 3 點——伺服器沒有啟用 rewrite 功能，接下來說明如何在 Apache2 上處理。

## 如何在 Apache2 啟用 mod_rewrite 支援永久連結？

要啟用 Apache2 的 \`mod_rewrite\` 模組，需要將以下內容加入 Apache2 的設定檔案中：

\`\`\`bash
LoadModule rewrite_module modules/mod_rewrite.so
\`\`\`

這個設定通常會加入到 \`mods-enabled\` 目錄中的一個設定檔案裡。例如可以建立一個名為 \`rewrite.load\` 的檔案，並將上面的設定加進去。步驟如下：

1. 進入 \`mods-available\` 目錄：

   \`\`\`bash
   cd /etc/apache2/mods-available
   \`\`\`

2. 建立一個名為 \`rewrite.load\` 的檔案：

   \`\`\`bash
   sudo touch rewrite.load
   \`\`\`

3. 打開這個檔案並加入以下內容：

   \`\`\`bash
   LoadModule rewrite_module modules/mod_rewrite.so
   \`\`\`

4. 儲存並關閉檔案。
5. 重新啟動 Apache2 伺服器，讓更改生效：

   \`\`\`bash
   sudo service apache2 restart
   \`\`\`

## mods-available 已有 rewrite.load 時，如何用符號連結啟用 rewrite？

如果 \`/etc/apache2/mods-available\` 目錄下已經有 \`rewrite.load\` 設定檔案，可以透過建立符號連結的方式來啟用 \`mod_rewrite\` 模組。步驟如下：

1. 進入 \`/etc/apache2/mods-enabled\` 目錄：

   \`\`\`bash
   cd /etc/apache2/mods-enabled
   \`\`\`

2. 建立 \`rewrite.load\` 的符號連結：

   \`\`\`bash
   sudo ln -s /etc/apache2/mods-available/rewrite.load
   \`\`\`

3. 重新啟動 Apache2 伺服器，讓更改生效：

   \`\`\`bash
   sudo service apache2 restart
   \`\`\`

執行完上述步驟後，Apache2 的 \`mod_rewrite\` 模組即會啟用。可以再次檢查 \`/etc/apache2/mods-enabled\` 目錄，確保 \`rewrite.load\` 的符號連結已經建立。若之後需要停用 \`mod_rewrite\`，刪除這個符號連結即可。

## 更快的做法：a2enmod 與 AllowOverride 設定

其實在 Debian/Ubuntu 的 Apache2 上，有更簡潔的官方指令可以一鍵啟用模組，不需要自己建符號連結：

\`\`\`bash
sudo a2enmod rewrite
sudo systemctl restart apache2
\`\`\`

另一個我很後來才踩到的坑：就算 \`mod_rewrite\` 啟用了，若 Apache 設定中網站目錄的 \`AllowOverride\` 不是 \`All\`（或至少包含 \`FileInfo\`），WordPress 寫在 \`.htaccess\` 裡的 rewrite 規則會直接被忽略，永久連結一樣 404。要確認 \`/etc/apache2/sites-available/\` 裡對應站點（或 \`apache2.conf\` 的 \`<Directory /var/www/>\` 區段）設成：

\`\`\`apache
<Directory /var/www/html>
    AllowOverride All
</Directory>
\`\`\`

改完記得 \`sudo systemctl restart apache2\`。最後再到 WordPress 後台「設定」→「連結」按一次「儲存變更」，讓 \`.htaccess\` 重新生成，這樣永久連結就會正常了。

## 常見問題

### WordPress 永久連結變 404 的最常見原因是什麼？

最常見是伺服器沒有啟用 rewrite 功能。以 Apache2 為例，需要啟用 \`mod_rewrite\` 模組並重新啟動伺服器，永久連結才會正常運作。

### 重新生成 .htaccess 的最快方法是什麼？

進入 WordPress 管理後台的「設定」→「連結」，直接按下「儲存變更」，WordPress 就會重新生成 \`.htaccess\` 檔案。若無效，再手動檢查安裝目錄中的 \`.htaccess\` 是否存在。

### 如何確認 Apache2 的 mod_rewrite 已成功啟用？

檢查 \`/etc/apache2/mods-enabled\` 目錄中是否有 \`rewrite.load\` 的符號連結。有連結且 Apache2 已重新啟動，就代表模組已啟用。

### 如何停用 mod_rewrite 模組？

刪除 \`/etc/apache2/mods-enabled/rewrite.load\` 這個符號連結，再執行 \`sudo service apache2 restart\` 重新啟動 Apache2 即可。

### WordPress 裝在子目錄時，永久連結要注意什麼？

要確認永久連結設定正確對應到子目錄路徑，否則產生的網址會指向錯誤位置而回傳 404。同時 \`.htaccess\` 也必須位在正確的安裝目錄中。

## 參考資料

- 本篇為 WordPress 自架站系列筆記，搭配 [Nginx 基礎設定教學](/post/nginx-basic-configuration) 與 [AWS EC2 SSL/TLS 憑證設定](/post/aws-ec2-ssl-tls-certificate) 閱讀。

## 延伸閱讀

- [WordPress Plugins 開發入門：佈景檔案、頁面層級與外掛架構解析](/post/wordpress-plugin-development-share)：同樣聚焦 WordPress，可接著比較不同情境的做法。
- [WordPress Plugin 開發入門：做出你的第一個 WordPress 外掛](/post/wordpress-first-plugin-development)：同樣聚焦 WordPress，可接著比較不同情境的做法。
- [WordPress Plugins開發怎麼入門？我的佈景結構與外掛架構分享](/post/wordpress-plugins-development-overview)：同樣聚焦 WordPress，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2023-05-11，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};