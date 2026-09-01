var e=`---
title: JavaScript H.264 解碼器介紹 – Broadway
description: Broadway 是一個純 JavaScript 的 H.264 解碼器，能在瀏覽器中直接解碼 H.264 視訊，不必安裝插件。本文介紹 Broadway 的主要特點、線上 Demo，以及如何在本地 Node.js 專案用 Express 架起可實際播放的 H.264 解碼範例。
date: 2023-10-23
category: 前端開發
tags: [JavaScript, H.264, Broadway, 視訊解碼, Node.js]
readingTime: 4 分鐘
image: /images/tech/hero_javascript-h264-decoder-broadway.webp
imageAlt: 深色調的電腦螢幕上顯示著彩色的 JavaScript 程式碼
---


# JavaScript H.264 解碼器介紹 – Broadway

想在瀏覽器裡直接解碼 H.264 視訊，又不依賴任何外部播放器或插件？Broadway 是一個純 JavaScript 寫的 H.264 解碼器，讓不支援 H.264 的瀏覽器也能播放 H.264 視訊。這篇文章整理它的主要特點、官方線上 Demo，以及我在本機用 Node.js 跑起完整範例的做法。

## Broadway 是什麼？為什麼要用 JavaScript 解碼 H.264？

**Broadway** 是一個 JavaScript H.264 解碼器。H.264 是目前最廣泛使用的視訊壓縮標準，但並不是每個瀏覽器、每個平台都原生支援。Broadway 提供了一種在瀏覽器中直接解碼 H.264 視訊的能力，特別適合那些不支援該格式的瀏覽器——解碼完全發生在 JavaScript 層，不需要任何外部插件或擴展。

## Broadway 的主要特點有哪些？

1. **純 JavaScript**：Broadway 完全用 JavaScript 寫成，可以在任何支援 JavaScript 的平台上運行，不需要安裝任何外部插件或擴展。
2. **多執行緒支援**：Broadway 可以在主執行緒上運行，也可以在背景工作執行緒（Web Worker）上運行，從而提高性能和回應性。
3. **網頁整合**：使用 Broadway，開發者可以輕鬆地在網頁上整合 H.264 視訊播放功能，無需依賴外部播放器或插件。

## 有哪些線上 Demo 可以直接玩？

官方提供了三個示範頁面：

- **foxDemo**：[點擊這裡查看](http://mbebenita.github.io/Broadway/foxDemo.html)
- **storyDemo**：[點擊這裡查看](http://mbebenita.github.io/Broadway/storyDemo.html)
- **treeDemo**：[點擊這裡查看](http://mbebenita.github.io/Broadway/treeDemo.html)

首次造訪這些示範頁面時，可能會覺得視訊播放器的速度有點慢——這是因為它需要先下載整個視訊才能開始播放。請有點耐心，一旦視訊下載完畢，點擊播放器就能觀看。頁面左上角的播放器在主執行緒上運行，其餘的播放器則在背景工作執行緒上運行，正好可以用來比較兩種模式的效能差異。

## 如何在本機用 Node.js 跑 Broadway 範例？

先把 Player 資料夾內的檔案下載下來，放進本地 Node.js 專案的 Player 資料夾內。

檔案連結：<https://github.com/mbebenita/Broadway/tree/master/Player>

接著撰寫 Node.js 程式：

\`\`\`js
const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

let eApp = express();
let server = http.Server(eApp);
let io = socketio(server, { pingInterval: 3000, pingTimeout: 60000 });

// 設定靜態檔案的路徑
eApp.use(express.static(path.join(__dirname, '..', 'Player')));

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

let config = {
    port: 8080  // 依您的URL端口設定為8080
};
server.listen(config.port, '0.0.0.0', () => {
    let address = server.address();
    console.log(\`Server running at \${address.address}:\${address.port}\`);
});
\`\`\`

然後開啟電腦的 <http://127.0.0.1:8080/treeDemo.html>，就可以在本機運行可動的範例了。實際跑起來的畫面如下，播放器下方會即時顯示目前是在主執行緒還是背景執行緒解碼，以及平均解碼時間：

![Broadway.js 在瀏覽器中解碼 H.264 視訊的示範畫面，播放器下方標示 main thread 與平均解碼時間](/images/articles/javascript-h264-decoder-broadway-1.webp)

## 常見問題

### Broadway 是什麼？

Broadway 是一個純 JavaScript 寫的 H.264 視訊解碼器，可以在瀏覽器中直接解碼 H.264 視訊，不需要任何外部插件。它特別適合用在原生不支援 H.264 的瀏覽器環境。

### 為什麼首次播放 Broadway Demo 會覺得慢？

因為它需要先下載完整個視訊檔才開始播放。等檔案快取完成後，再次播放的速度就會明顯變快，點擊播放器即可觀看。

### Broadway 的主執行緒與背景執行緒模式有什麼差別？

左上角的播放器在主執行緒上解碼，其餘播放器則在背景工作執行緒（Web Worker）上解碼。在背景執行緒解碼可以避免阻塞 UI，效能與回應性通常更好。

### 如何在本機執行 Broadway 範例？

從 GitHub 下載 Broadway 的 Player 資料夾，放進 Node.js 專案後用 Express 把它設為靜檔目錄，再到 <http://127.0.0.1:8080/treeDemo.html> 即可在本機播放示範視訊。

## 參考資料

- [Broadway GitHub 專案](https://github.com/mbebenita/Broadway)
- [Broadway Player 原始碼](https://github.com/mbebenita/Broadway/tree/master/Player)

## 延伸閱讀

- [在瀏覽器內插入 Flash 的幾種設定：透明、全螢幕與 Script 存取](/post/insert-flash-in-browser-settings)：同樣聚焦 JavaScript，可接著比較不同情境的做法。
- [Angular NPM 與 package.json 設定教學](/post/angular-npm-package-json-setup)：同樣聚焦 Node.js，可接著比較不同情境的做法。
- [Jotai 如何在 React 中管理共享狀態](/post/jotai-react-state-management)：同樣聚焦 JavaScript，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2023-10-23，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};