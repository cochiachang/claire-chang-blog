var e=`---
title: 手機遠程測試教學：Android 與 iOS 遠端偵錯完整指南
description: 手機遠程測試怎麼做？本文整理 Android 使用 Chrome Remote Debugging、iOS 使用 Safari Web Inspector 的完整步驟，以及用 weinre 遠端 Debug 網頁元素的實作筆記。
date: 2018-11-14
category: 前端開發
tags: [遠端偵錯, Chrome DevTools, Safari Web Inspector, weinre, 行動裝置]
readingTime: 6 分鐘
image: /images/tech/hero_mobile-remote-testing.webp
imageAlt: 手機遠程測試示意：透過電腦瀏覽器開發者工具遠端偵錯 Android 與 iOS 裝置
---


# 手機遠程測試教學：Android 與 iOS 遠端偵錯完整指南

想做手機網頁或手機遊戲時，不同設備可能出現不同狀況，必須在實機上除錯。這篇文章整理三種手機遠程測試方式：Android 用 Chrome 開發者工具遠端偵錯、iOS 用 Safari Web Inspector，以及用 weinre 在任意瀏覽器上遠端 Debug 網頁元素。

## Android 手機怎麼用 Chrome 遠端偵錯？

電腦上的偵錯工具首推 [Chrome 開發者工具](https://developers.google.com/web/tools/chrome-devtools/?hl=zh-tw)，但手機遊戲在不同設備上可能有不同狀況，我們需要在實際手機上除錯。Android 手機只要開啟 Enable USB Debugging，用 USB 線連到電腦，就可以透過 Chrome 做遠端偵錯。

偵錯步驟如下：

1. 選擇 Settings > Developer Options > Enable USB Debugging，啟用設備上的開發者選項（如何開啟請參考官方文章：[Set up a device for development](https://developer.android.com/studio/run/device#developer-device-options)）。
2. 使用一個 Google 帳戶登入 Chrome。
3. 打開 Chrome 開發者工具（Chrome 選單中選擇「更多工具 > 開發者工具」）。
4. 在 DevTools 中點擊 Main Menu 主選單，選擇 More tools > Remote devices。

![Chrome DevTools 主選單中選擇 More tools > Remote devices 的畫面截圖](/images/articles/mobile-remote-testing-1.webp)

5. 在 DevTools 中點擊 Settings 標籤。
6. 確保已啟用 Discover USB devices。

![DevTools Settings 頁面中勾選 Discover USB devices 的畫面截圖](/images/articles/mobile-remote-testing-2.webp)

7. 使用 USB 將 Android 設備直接連接到電腦上。
8. 在左側的 Remote target 選擇要偵錯的設備。

![DevTools 左側 Remote target 清單中選擇已連線 Android 設備的畫面截圖](/images/articles/mobile-remote-testing-3.webp)

## iOS 手機怎麼用 Safari 遠端偵錯？

iOS 的偵錯要在 Mac 上透過 Safari 進行，步驟如下：

1. 把要偵錯的 iDevice 接上 Mac，進入 iOS 設定中的「Safari」選項，在「進階」選單中開啟「網頁檢閱器」，iPhone 畫面如下：

![iPhone 設定中 Safari 進階選單開啟網頁檢閱器的畫面截圖](/images/articles/mobile-remote-testing-4.webp)

2. 開啟 macOS 中的 Safari，並啟用「開發」選項：

![Mac Safari 選單列中啟用開發選單的畫面截圖](/images/articles/mobile-remote-testing-5.webp)

3. 當 iOS 設備開啟網頁後，就可以在 Mac Safari 的「開發」選單中看到連上線的 iDevice，直接選取正在開啟的頁面就可以進行 Debug：

![Safari 開發選單中列出已連線 iPhone 與其開啟頁面的畫面截圖](/images/articles/mobile-remote-testing-6.webp)

4. Debug 的畫面如下：

![Safari Web Inspector 針對 iOS 頁面進行偵錯的畫面截圖](/images/articles/mobile-remote-testing-7.webp)

## weinre 是什麼？怎麼用它遠端 Debug 網頁元素？


在技術上，weinre 是一個以 node.js 為基礎的 Http Server，利用 Web 即時通訊的技巧，把某個已經掛上 Target JavaScript 的瀏覽器，透過背景將 DOM 資訊傳遞到 Debugging Tools 中。Debugging Tools 同樣由 Web 設計，連接後雙方可以即時傳遞命令，讓我們即時看見反饋，是一個很聰明的做法。而且它沒有太多環境限制，基本上可以執行 JavaScript 的瀏覽器都可以使用。

![weinre 遠端偵錯架構示意圖](/images/articles/mobile-remote-testing-8.webp)

### 安裝方式

可以直接由網址下載安裝，也可以透過 npm 安裝：

\`\`\`bash
sudo npm -g install weinre
\`\`\`

直接透過網址安裝：

\`\`\`bash
sudo npm -g install http://example.com/path/to/apache-cordova-weinre-X.Y.Z-bin.tar.gz
\`\`\`

### 啟動服務

\`\`\`bash
weinre --boundHost 10.0.0.13
\`\`\`

接著在電腦內打開網址 \`http://10.0.0.13:8080\`，會看到如下的畫面：

![weinre 啟動後瀏覽器開啟 http://10.0.0.13:8080 的畫面截圖](/images/articles/mobile-remote-testing-9.webp)

### 設定要被觀察的程式

在程式內加入下面的 script：

\`\`\`html
<script src="http://10.0.0.13:8081/target/target-script-min.js"><\/script>
\`\`\`

重新整理後，就可以在 weinre 頁面看到手機設備上開啟的網頁資訊，點選該連結就可以偵錯該程式：

![weinre 介面中列出已連線目標裝置的畫面截圖](/images/articles/mobile-remote-testing-10.webp)

### 偵錯畫面

![weinre 遠端偵錯操作畫面截圖](/images/articles/mobile-remote-testing-11.webp)

## 常見問題

### Android 手機連上 USB 後 Chrome 看不到設備怎麼辦？

先確認手機已在開發者選項中啟用 USB Debugging，並在 DevTools 的 Settings 頁面勾選 Discover USB devices。重新插拔 USB 線或在手機上允許電腦的偵錯授權後，Remote target 清單就會出現設備。

### iOS 遠端偵錯一定要用 Mac 嗎？

是的。Safari 的 Web Inspector 是 macOS 內建功能，需要用 USB 線把 iDevice 接上 Mac，並在 iPhone 的 Safari 進階設定中開啟「網頁檢閱器」，Mac 的 Safari 才會在「開發」選單中列出裝置。

### weinre 適合什麼情境使用？

weinre 是以 node.js 為基礎的遠端網頁檢視器，不限平台，只要瀏覽器能執行 JavaScript 就能用。適合無法使用 Chrome 或 Safari 原生遠端偵錯的環境，例如舊型裝置或特定 WebView，只要在頁面掛上 target script 即可遠端檢查 DOM。

### weinre 的偵錯埠是哪一個？

服務本身預設跑在 8080 埠（用 \`weinre --boundHost\` 指定綁定位址），而目標頁面要載入的 target script 則由 8081 埠提供，兩者都在同一台主機上執行。

## 參考資料

- [遠程調試 Android 設備使用入門（Chrome DevTools 官方文件）](https://developers.google.com/web/tools/chrome-devtools/remote-debugging/)
- [A Concise Guide to Remote Debugging on iOS, Android, and Windows Phone](https://developer.telerik.com/featured/a-concise-guide-to-remote-debugging-on-ios-android-and-windows-phone/#ios)
- [利用 weinre 遠端 Debug 網頁元素](https://blog.toright.com/posts/3646/mobile-webapp-%E9%96%8B%E7%99%BC%E6%8A%80%E5%B7%A7-%E5%88%A9%E7%94%A8-weinre-%E9%81%A0%E7%AB%AF-debug-%E7%B6%B2%E9%A0%81%E5%85%83%E7%B4%A0-linux.html)
- [透過 Safari Web Inspector 遠端偵錯 iOS UIWebView](https://blog.toright.com/posts/3661/mobile-webapp-%E9%96%8B%E7%99%BC%E6%8A%80%E5%B7%A7-%E9%80%8F%E9%81%8E-safari-web-inspector-%E9%81%A0%E7%AB%AF%E5%81%B5%E9%8C%AF-ios-uiwebview.html)

## 延伸閱讀

- [手機遠端測試怎麼做？Chrome 與 Safari 遠端偵錯 Android/iOS 設備教學](/post/mobile-remote-debugging)：同樣聚焦 遠端偵錯、Chrome DevTools，可接著比較不同情境的做法。
- [PixiJS devtools：用 Chrome 擴充功能除錯 Canvas 遊戲場景與屬性](/post/pixijs-devtools-chrome-extension)：同樣聚焦 Chrome DevTools，可接著比較不同情境的做法。
- [行動裝置使用者介面設計：從使用者研究到視覺流程的讀書筆記](/post/mobile-ui-design-evolution)：同樣聚焦 行動裝置，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2018-11-14，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};