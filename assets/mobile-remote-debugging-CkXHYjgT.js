var e=`---
title: "手機遠端測試怎麼做？Chrome 與 Safari 遠端偵錯 Android/iOS 設備教學"
description: "做手機網頁或遊戲開發時，如何用 Chrome DevTools 遠端偵錯 Android 設備、用 Safari Web Inspector 偵錯 iOS，以及透過 weinre 遠端 Debug 網頁元素的完整筆記。"
date: 2018-11-14
category: "前端開發"
tags: [遠端偵錯, Chrome DevTools, Safari Web Inspector, weinre, 手機測試]
readingTime: 4 分鐘
image: /images/tech/hero_mobile-remote-debugging.webp
imageAlt: "手機連接電腦進行遠端偵錯的示意畫面"
---


# 手機遠端測試怎麼做？Chrome 與 Safari 遠端偵錯 Android/iOS 設備教學

在電腦上做網頁偵錯，首推的工具就是 Chrome 開發者工具，但如果要做手機遊戲或手機網頁，不同設備可能會有不同的狀況，我們會需要在實機上除錯。這篇整理我用過的幾種手機遠端偵錯方式：Android 用 Chrome DevTools、iOS 用 Safari Web Inspector，另外再補上以 weinre 遠端 Debug 網頁元素的做法。

## Android 設備怎麼用 Chrome 遠端偵錯？

如果是 Android 系統的手機，開啟 Enable USB Debugging 之後，用 USB 線連至電腦，就可以藉著 Chrome 做遠端偵錯。偵錯步驟如下：

1. 選擇 Settings > Developer Options > Enable USB Debugging，啟用設備上的開發者選項（要如何開啟請參考這篇文章：[Set up a device for development](https://developer.android.com/studio/run/device#developer-device-options)）
2. 使用一個 Google 帳戶登錄到 Chrome
3. 打開 Chrome 開發者工具（在 Chrome 選單中選擇 更多工具 > 開發者工具）
4. 在 DevTools 中，點擊 Main Menu 主選單，然後選擇 More tools > Remote devices

![Chrome DevTools 的 Remote devices 入口](/images/articles/mobile-remote-debugging-1.webp)

5. 在 DevTools 中，點擊 Settings 標籤
6. 確保已啟用 Discover USB devices

![啟用 Discover USB devices 選項](/images/articles/mobile-remote-debugging-2.webp)

7. 使用 USB 將 Android 設備直接連接到電腦上
8. 在左側的 remote target 選擇要偵錯的設備

![從 remote target 清單選擇要偵錯的設備](/images/articles/mobile-remote-debugging-3.webp)

## iOS 設備怎麼用 Safari 遠端偵錯？

首先針對要偵錯的 iDevice 接上 Mac，並且進入 iOS 設定中的「Safari」選項，在「進階」選單中開啟「網頁檢閱器」，iPhone 畫面如下：

![iPhone 設定中開啟網頁檢閱器](/images/articles/mobile-remote-debugging-4.webp)

接著我開啟 MacOS 中的 Safari，並且啟用「開發」選項，如下圖：

![Mac Safari 啟用開發選單](/images/articles/mobile-remote-debugging-5.webp)

當 iOS 設備開啟網頁時，就可以在 Mac 的 Safari「開發」功能表中看到連上線的 iDevice，直接選取正在開啟的頁面就可以進行 Debug，畫面如下：

![Safari 開發選單列出連線的 iDevice 與頁面](/images/articles/mobile-remote-debugging-6.webp)

Debug 的畫面如下：

![Safari Web Inspector 的偵錯畫面](/images/articles/mobile-remote-debugging-7.webp)

## weinre 是什麼？怎麼用它遠端 Debug 網頁元素？

官網位置：<https://people.apache.org/~pmuellr/weinre/docs/latest/Home.html>

weinre 的全名是 WEb INspector REmote，顧名思義是一個遠端的網頁檢視器。在技術上 weinre 其實是一個以 node.js 為基礎的 Http Server，利用了 Web 即時通訊的技巧，將某個已經掛上 Target JavaScript 的 Browser，透過背景將 DOM 資訊傳遞到 Debugging Tools 中。Debugging Tools 也是由 Web 進行設計，連接後雙方可以即時傳遞一些命令讓我們即時看見反饋，是一個很聰明的做法。而且沒有太多的環境限制，基本上可以執行 JavaScript 的瀏覽器都可以使用。

![weinre 運作架構示意圖](/images/articles/mobile-remote-debugging-8.webp)

### weinre 怎麼安裝？

可以直接由網址下載安裝，也可以透過 npm 來安裝。

透過 npm：

\`\`\`cmd
sudo npm -g install weinre
\`\`\`

直接透過網址安裝：

\`\`\`cmd
sudo npm -g install http://example.com/path/to/apache-cordova-weinre-X.Y.Z-bin.tar.gz
\`\`\`

### weinre 怎麼啟動服務？

\`\`\`cmd
weinre --boundHost 10.0.0.13
\`\`\`

接著在電腦內打開網址 <http://10.0.0.13:8080>，會看到如下的畫面：

![weinre 伺服器首頁畫面](/images/articles/mobile-remote-debugging-9.webp)

### 怎麼設定要被觀察的程式？

在程式內加入下面的 script：

\`\`\`html
<script src="http://10.0.0.13:8081/target/target-script-min.js"><\/script>
\`\`\`

接著重新整理就可以看到我們在手機設備上開啟的網頁的資訊，點選該連結就可以偵錯該程式：

![weinre 列出目標裝置的頁面](/images/articles/mobile-remote-debugging-10.webp)

4. 偵錯畫面如下：

![weinre 的偵錯畫面](/images/articles/mobile-remote-debugging-11.webp)

## 常見問題

### Android 手機要遠端偵錯需要先做什麼設定？

先到手機的 Settings > Developer Options 開啟 Enable USB Debugging，再用 USB 線把手機連到電腦。之後在 Chrome DevTools 的 More tools > Remote devices 裡啟用 Discover USB devices，就能從 remote target 清單選到該設備開始偵錯。

### iOS 設備要怎麼讓 Mac 的 Safari 看得到？

在 iPhone 的設定中進入 Safari > 進階，開啟「網頁檢閱器」，再把設備接上 Mac。接著在 Mac Safari 啟用「開發」選單，設備開啟網頁後就會出現在開發選單中，點選該頁面即可開始 Debug。

### weinre 的運作原理是什麼？

weinre（WEb INspector REmote）是一個以 node.js 為基礎的 Http Server。被觀察的頁面掛上 Target JavaScript 後，會透過背景把 DOM 資訊即時傳遞到 Web 版的 Debugging Tools，雙方連接後即可即時傳遞命令與檢視反饋。

### weinre 需要什麼環境限制嗎？

基本上沒有太多環境限制，只要瀏覽器可以執行 JavaScript 就可以使用。安裝上透過 npm 一行指令即可完成，啟動時用 \`weinre --boundHost <IP>\` 指定綁定的位址。

## 參考資料

- [遠程調試 Android 設備使用入門（Chrome DevTools 官方文件）](https://developers.google.com/web/tools/chrome-devtools/remote-debugging/)
- [A Concise Guide to Remote Debugging on iOS, Android, and Windows Phone](https://developer.telerik.com/featured/a-concise-guide-to-remote-debugging-on-ios-android-and-windows-phone/#ios)
- [利用 weinre 遠端 Debug 網頁元素](https://blog.toright.com/posts/3646/mobile-webapp-%E9%96%8B%E7%99%BC%E6%8A%80%E5%B7%A7-%E5%88%A9%E7%94%A8-weinre-%E9%81%A0%E7%AB%AF-debug-%E7%B6%B2%E9%A0%81%E5%85%83%E7%B4%A0-linux.html)
- [透過 Safari Web Inspector 遠端偵錯 iOS UIWebView](https://blog.toright.com/posts/3661/mobile-webapp-%E9%96%8B%E7%99%BC%E6%8A%80%E5%B7%A7-%E9%80%8F%E9%81%8E-safari-web-inspector-%E9%81%A0%E7%AB%AF%E5%81%B5%E9%8C%AF-ios-uiwebview.html)
- [Set up a device for development（Android Developers）](https://developer.android.com/studio/run/device#developer-device-options)

## 延伸閱讀

- [手機遠程測試教學：Android 與 iOS 遠端偵錯完整指南](/post/mobile-remote-testing)：同樣聚焦 遠端偵錯、Chrome DevTools，可接著比較不同情境的做法。
- [PixiJS devtools：用 Chrome 擴充功能除錯 Canvas 遊戲場景與屬性](/post/pixijs-devtools-chrome-extension)：同樣聚焦 Chrome DevTools，可接著比較不同情境的做法。
- [用Chrome將本地端檔案替代伺服器檔案](/post/chrome-local-file-override)：同樣聚焦 Chrome DevTools，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2018-11-14，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};