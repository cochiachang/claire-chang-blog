var e=`---
title: Angular 產品發佈設定教學：ng build 上線部署與效能優化完整指南
description: 完整整理 Angular 專案發佈到正式環境的流程：ng build 與 --prod、--build-optimizer 參數差異、AOT 編譯與惰性加載注意事項、source-map-explorer 分析 bundle 大小，以及 Apache、Nginx、IIS、GitHub Pages、Firebase Hosting 的 Router 重寫規則設定。
date: 2018-01-18
category: 前端開發
tags: [Angular, 部署, 效能優化, production-build, Web Server]
readingTime: 6 分鐘
image: /images/tech/hero_angular-production-build-deployment.webp
imageAlt: Angular 專案建置與部署上線的概念示意圖
---


# Angular 產品發佈設定教學：ng build 上線部署與效能優化完整指南

這篇文章解決「Angular 專案開發完之後要怎麼上線」的問題：從最基本的 \`ng build\` 指令、用 \`--prod\` 做各種優化、用工具分析 bundle 大小，到各種伺服器（Apache、Nginx、IIS、GitHub Pages、Firebase Hosting）上啟用 Router 時的重寫規則設定，一次整理完整流程。

## 如何把 Angular 產品發佈到正式環境？

最簡單的方法是：

\`\`\`cmd
ng build
\`\`\`

然後將所有 \`dist/\` 資料夾底下的文件複製一份到伺服器上。

如果想順帶設置 \`base href\` 至 \`<base href="/my/app/">\`，則可加下面參數：

\`\`\`cmd
ng build --base-href=/my/app/
\`\`\`

若有使用 Router 功能，要將所有找不到的頁面都導向 \`index.html\`（下面會有詳細介紹）。

## ng build --prod 會做哪些優化？

加上 \`--prod\` 參數，可以輸出優化過的檔案：

\`\`\`cmd
ng build --prod
\`\`\`

這個參數會為專案做這些事情：

| 優化項目 | 說明 |
| --- | --- |
| AOT 編譯 | 預先編譯，而不是用 JIT 的方式 |
| Production mode | 讓網站執行更快，等同於下 \`--environment=prod\` 參數 |
| Bundling | 將所有使用的 library 和許多應用綁在一起 |
| 縮小檔案 | 刪除多餘的空白、註釋和可選的令牌 |
| Uglification | 將變數名稱做混淆的動作 |
| 消除死代碼 | 刪除未引用的模塊和很多未使用的代碼 |

添加 \`--build-optimizer\` 可進一步減少檔案的大小：

\`\`\`cmd
ng build --prod --build-optimizer
\`\`\`

### 惰性加載的注意事項

如果要使用惰性加載（lazy loading）去載入部分的 JS 檔案，記得不要在需要被首先加載的模組裡面 import 要被惰性加載的元件，否則會在一開始就被載入。AOT 預設在編譯時會對 ngModules 做識別並且做惰性加載的設定。

## 如何用 source-map-explorer 分析 bundle 大小？

[source-map-explorer](https://github.com/danvk/source-map-explorer/blob/master/README.md) 是一個很棒的 bundles 分析工具。首先先安裝：

\`\`\`cmd
npm install source-map-explorer --save-dev
\`\`\`

然後建構應用程式，在 dist 生成綑綁包：

\`\`\`cmd
ng build --prod --sourcemaps
ls dist/*.bundle.js
\`\`\`

運行管理器來生成這個被綑綁的檔案的分析圖：

\`\`\`cmd
node_modules/.bin/source-map-explorer dist/main.*.bundle.js
\`\`\`

產生的圖如下：

![source-map-explorer 分析 bundle 組成的視覺化圖表](/images/articles/angular-production-build-deployment-1.webp)

## 有哪些推薦的網頁效能觀察工具？

首推的當然就是 Google Chrome 囉！這邊有相關的教學系列文：[認識 Chrome 開發者工具](https://ithelp.ithome.com.tw/users/20103325/ironman/1299)。官網也有推薦使用 [WebPageTest](https://www.webpagetest.org/) 來衡量自己網頁的速度。

## 各種伺服器啟用 Router 功能的配置方法？

### Apache 設定方式

添加一個重寫規則 \`.htaccess\`：

\`\`\`apache
RewriteEngine On
    # If an existing asset or directory is requested go to it as it is
    RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -f [OR]
    RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -d
    RewriteRule ^ - [L]
    # If the requested resource doesn't exist, use index.html
RewriteRule ^ /index.html
\`\`\`

### Nginx

使用前端控制器模式 Web 應用程序中 \`try_files\` 描述的方法，修改為 \`index.html\`：

\`\`\`nginx
try_files $uri $uri/ /index.html;
\`\`\`

### IIS

添加一個重寫規則 \`web.config\`：

\`\`\`xml
<system.webServer>
  <rewrite>
    <rules>
      <rule name="Angular Routes" stopProcessing="true">
        <match url=".*" />
        <conditions logicalGrouping="MatchAll">
          <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
          <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
        </conditions>
        <action type="Rewrite" url="/src/" />
      </rule>
    </rules>
  </rewrite>
</system.webServer>
\`\`\`

### GitHub Pages

我們無法直接配置 GitHub Pages 伺服器，但是可以添加一個 404 頁面。複製 \`index.html\` 到 \`404.html\`，它仍將作為 404 響應，但瀏覽器將處理該頁面並正確加載應用程序。並在服務 \`docs/\` 上建立一個 \`.nojekyll\` 文件。

### Firebase Hosting

添加一個重寫規則：

\`\`\`json
"rewrites": [ {
  "source": "**",
  "destination": "/index.html"
} ]
\`\`\`

## 常見問題

### ng build 和 ng build --prod 有什麼差別？

\`ng build\` 是開發用建置，不做壓縮與優化；\`ng build --prod\` 會改用 AOT 編譯、開啟 production mode、進行 bundling、縮小檔案、Uglification 與消除死代碼，輸出適合正式環境的優化檔案。

### 為什麼部署後重新整理頁面會出現 404？

因為 Angular Router 使用前端路由，伺服器收到不存在的路徑時找不到檔案。解法是在伺服器加上重寫規則，把所有找不到的請求都導向 \`index.html\`，例如 Nginx 的 \`try_files $uri $uri/ /index.html;\`。

### 為什麼惰性加載的模組還是在一開始就被載入？

通常是因為在主要載入的模組（如 AppModule）中直接 import 了要惰性加載的元件，導致打包時被一起放進主 bundle。只要改成透過路由的 \`loadChildren\` 載入，AOT 會自動做惰性加載設定。

### 如何知道 bundle 裡面裝了什麼、為什麼這麼大？

可以用 \`ng build --prod --sourcemaps\` 產生 source map，再用 \`source-map-explorer dist/main.*.bundle.js\` 生成視覺化分析圖，就能看到每個 library 佔用的體積，進而決定要移除或改用惰性加載。

## 參考資料
- [source-map-explorer（GitHub）](https://github.com/danvk/source-map-explorer/blob/master/README.md)
- [認識 Chrome 開發者工具（IT邦幫忙系列文）](https://ithelp.ithome.com.tw/users/20103325/ironman/1299)
- [WebPageTest](https://www.webpagetest.org/)

## 延伸閱讀

- [Flash 時間軸運作注意點：遮罩、關鍵影格與效能優化筆記](/post/flash-timeline-notes)：同樣聚焦 效能優化，可接著比較不同情境的做法。
- [Flash 時間軸運作注意點：遮罩、關鍵影格與效能陷阱解析](/post/flash-timeline-keyframe-pitfalls)：同樣聚焦 效能優化，可接著比較不同情境的做法。
- [讓 IDE 支援 Angular Language Service](/post/angular-language-service-ide-support)：同樣聚焦 angular，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2018-01-18，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};