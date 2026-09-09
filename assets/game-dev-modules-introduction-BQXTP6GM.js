var e=`---
title: 用 NPM 模組打造網頁遊戲開發環境：我的套件選擇清單
description: 網頁遊戲開發如何用 NPM 挑選與管理模組？本文整理挑選套件的評估指標，以及我用 gulp、TypeScript、pixi.js、GSAP 等模組打造的遊戲開發環境。
date: 2018-10-26
category: 前端開發
tags: [npm, TypeScript, PixiJS, 前端開發, 遊戲開發]
readingTime: 7 分鐘
image: /images/tech/hero_game-dev-modules-introduction.webp
imageAlt: 深色螢幕上顯示彩色語法高亮的 JavaScript 程式碼
---


# 用 NPM 模組打造網頁遊戲開發環境：我的套件選擇清單

要用 TypeScript 開發網頁遊戲，第一步就是建立一套順手的開發環境，而這個環境幾乎完全建立在 NPM 模組之上。這篇文章會先說明我在挑選 NPM 套件時觀察哪些指標，再分享我在遊戲開發環境中實際選用的套件：環境與部署相關的 gulp、run-sequence、del、gulp-typescript、gulp-sourcemaps、browser-sync，以及開發用的 systemjs、pixi.js、jquery、typescript、gsap。

## 什麼是 NPM？為什麼網頁遊戲開發離不開它？

NPM 官網對自己的說明是：

> Use npm to install, share, and distribute code; manage dependencies in your projects; and share & receive feedback with others.

簡而言之，NPM 是一個套件管理的工具，我可以使用 npm 來建立、分享、發佈模組，並於其平台上分享、接收其他人對模組的反饋。

NPM 創造了 node 的生態圈，我可以在其官網上搜尋、下載、安裝、使用，並管理我所需要的模組。

## 怎麼挑選可信賴的 NPM 模組？

一般而言，在選擇 npm 模組時，要注意這個模組的開發者是否有持續在更新、維護模組內容，並從單週下載量來評估這個套件的普及度——一般很多人在用的套件會較可信賴。

由於 node 的生態圈現在還算是個戰國時代，有許多在上面分享的模組，很可能過了一陣子發現了 bug，套件的開發者卻已經沒在維護了，我們還得自己去研究套件本身是否有某些程式碼會造成這 bug，這會讓開發成本大大增加。

![NPM 官網上顯示套件的 weekly download 與 last publish 資訊](/images/articles/game-dev-modules-introduction-1.webp)

![NPM 頁面上的 Dependents 欄位顯示有多少專案使用這個模組](/images/articles/game-dev-modules-introduction-2.webp)

上圖中的 weekly download、last publish，以及下圖中的 Dependents（有多少專案使用這個模組）都是觀察一個套件的重要指標。

另外，網路上相關教學、使用手冊的完整度、網路論壇的討論度、是否適合我們的專案，也是選擇模組時可納入的考量點。

## 環境與部署：我選了哪些套件來建置工作流程？

### run-sequence：讓 gulp 的 task 循序執行

[run-sequence](https://www.npmjs.com/package/run-sequence) 可以讓 gulp 的 task 依序被執行：

\`\`\`js
var gulp = require('gulp');
var runSequence = require("run-sequence");
gulp.task("build-web", function () {
    runSequence(
        'firstJob',
        'secondJob',
        ['otherJob1', 'otherJob2'],
        function (error) {
            if (error) {
                console.log(error.message);
            } else {
                console.log('success');
            }
        }
    );
});
\`\`\`

### del：刪除本機檔案

[del](https://www.npmjs.com/package/del) 可以刪除本機的檔案，常用於清掉上一次的建置輸出：

\`\`\`js
var gulp = require('gulp');
const del = require("del");
gulp.task('clean', (cb) => {
    return del(["build"], cb);
});
\`\`\`

### gulp：編寫編譯流程腳本

[gulp](https://www.npmjs.com/package/gulp) 可以編寫 compiler 時要做的動作的腳本：

\`\`\`js
var gulp = require('gulp');
const del = require("del");
gulp.task('job1', () => {
    //some task write here
});
\`\`\`

### gulp-typescript：用 gulp 呼叫 TypeScript 編譯

[gulp-typescript](https://www.npmjs.com/package/gulp-typescript) 可以使用 gulp 來呼叫 TypeScript 的 API，將 TypeScript 轉為 js：

\`\`\`js
var ts = require('gulp-typescript');
var gulp = require('gulp');
var tsProject = ts.createProject('tsconfig.json');
gulp.task('build', function() {
    return tsResult.js.pipe(gulp.dest('build'));
});
\`\`\`

### gulp-sourcemaps：保留原始 TS 檔的偵錯能力

[gulp-sourcemaps](https://www.npmjs.com/package/gulp-sourcemaps) 可以產生一份 \`xxx.ts.map\` 的檔案，讓我在 debug 時可以連回原始的 ts 檔案去做偵錯。

### browser-sync：檔案更新時自動重新整理瀏覽器

[browser-sync](https://www.npmjs.com/package/browser-sync) 可以同步瀏覽器，當有檔案被更新時，瀏覽器會自動重新整理：

\`\`\`js
var gulp = require('gulp');
const browserSync = require('browser-sync');
gulp.task('launch-web', ['build-web'], function () {
    browserSync({
        open: true,
        port: 8001,
        files: ["./build/**/*.{html,htm,css,js,json}"],
        server: {
            "baseDir": "./build"
        }
    });
});
\`\`\`

## 開發用 Library：遊戲本體靠哪些套件組起來？

### systemjs：模組化加載檔案

[systemjs](https://www.npmjs.com/package/systemjs) 能夠用模組化的方式來加載檔案。只需要在開頭寫上下面的程式碼，SystemJS 就會自動去下載相對路徑的 js 檔案：

\`\`\`js
import {Loader} from "../core/Loader";
\`\`\`

不過若要使用 SystemJS，則必需在 html 裡面輸入下面的程式碼，設定要載入的路徑以及載入檔案的附檔名：

\`\`\`js
var game;
$(function () {
    SystemJS.config({
        baseURL: "",
        packages: {
            "/": { defaultExtension: "js" }
        }
    });
    //載入第一個要執行的檔案
    SystemJS.import('Main').then(function (m) {
        m.Main.prototype.initGame();
    });
});
\`\`\`

### pixi.js：本系列的 2D 遊戲引擎主力

[pixi.js](https://www.npmjs.com/package/pixi.js) 是這個系列文章最主要使用的 2D 遊戲引擎。

### jquery：canvas 與 HTML DOM 的最佳搭檔

[jquery](https://www.npmjs.com/package/jquery) 大家應該都很熟悉，可以更方便地與 html 的 DOM 元件互動。開發網頁遊戲時，常常會有某些 GUI 元件用 html 來做會更加容易，例如線上使用者列表、聊天視窗等。這時我們通常會在網頁上重疊兩個 div 元件：下面那一層放 canvas，上面則疊上一層 html div 元件，loading page 時常是用這樣的方式來製作。妥善利用 canvas 與 html 各自的優勢，會讓遊戲開發更加容易。

![canvas 上層疊 html div 元件的開發者工具畫面](/images/articles/game-dev-modules-introduction-3.webp)

### typescript：強型別帶來的開發安心感

[typescript](https://www.npmjs.com/package/typescript) 物件導向的特性讓我寫起來像強型別語言一樣輕鬆自在，IDE 也可以幫忙檢查基本的錯誤。

### gsap：手冊清楚的 tween 工具

[gsap](https://www.npmjs.com/package/gsap) 是一個很好用的 tween 工具，官網 [GreenSock](https://greensock.com/gsap) 裡有非常詳細的使用說明，手冊的範例非常清楚，在 [Easing 頁面](https://gsap.com/docs/v3/) 也能直接預覽特效的樣子。

![GreenSock 官網的 GSAP 說明文件畫面](/images/articles/game-dev-modules-introduction-4.webp)

## 常見問題

### NPM 是什麼？

NPM 是 Node.js 的套件管理工具，可以用來搜尋、安裝、分享與發佈程式模組，並管理專案的相依性，是建立 node／前端生態圈的核心平台。

### 挑選 NPM 套件時要看哪些指標？

主要看 weekly downloads（單週下載量）、last publish（最後發佈時間）與 Dependents（有多少專案相依於它），再搭配教學文件完整度與社群討論度來判斷套件是否活躍、可信賴。

### gulp-sourcemaps 的作用是什麼？

它會在編譯 TypeScript 時產生 \`.ts.map\` 檔案，讓瀏覽器偵錯時能對應回原始的 TypeScript 檔案，而不是只能對著編譯後的 js 除錯。

### 為什麼網頁遊戲要同時用 canvas 和 html 元件？

遊戲畫面用 canvas 繪製效能較好，但使用者列表、聊天視窗、loading 畫面等 GUI 用 html DOM 實作更簡單。常見做法是在 canvas 上疊一層 html div，各取所長。

### run-sequence 和 del 現在還能用嗎？有什麼替代方案？

這兩個套件是 2018 年 gulp 3 時代的產物，現在已經有更好的選擇。run-sequence 已停止維護，gulp 4 內建了 \`gulp.series()\` 與 \`gulp.parallel()\`，直接取代它的循序／平行執行功能；del 則建議改用新版的 \`del\`（6.x 以上）或 \`del-cli\`，回呼函數的寫法也改為 Promise。若現在要新建立環境，我會直接用 gulp 4 的原生 API，不再額外裝這些套件。

### SystemJS 現在還是首選嗎？

不是了。現在瀏覽器已原生支援 ES Module（\`<script type="module">\` 與 \`import\`／\`export\` 語法），加上 Vite、esbuild 等現代打包工具盛行，大多數新專案已不需要 SystemJS 這種執行時期的模組載入器。SystemJS 目前主要用在需要動態載入舊格式模組（如舊的 UMD 套件）的特定場景。我後來的專案也改用原生 ES Module 或打包工具來管理模組了。

### pixi.js 和 GSAP 各自負責什麼？

pixi.js 是 2D WebGL 遊戲引擎，負責畫面渲染；GSAP 是 tween 動畫工具，負責補間動畫與特效，兩者搭配是常見的網頁遊戲組合。

## 參考資料

- [NPM 官網](https://www.npmjs.com/)
- [GreenSock GSAP](https://greensock.com/gsap)
- [GSAP Easing 文件](https://gsap.com/docs/v3/)

## 延伸閱讀

- [連連看遊戲開發環境設定：VS Code、npm、TypeScript、Gulp 與 GitHub](/post/link-game-development-environment)：同樣聚焦 TypeScript、遊戲開發，可接著比較不同情境的做法。
- [Pixi.js 網頁遊戲開發實戰：從介紹到連連看遊戲的完整開發流程](/post/pixijs-web-game-development-practice)：同樣聚焦 前端開發，可接著比較不同情境的做法。
- [連連看遊戲開發前言：從規則、益智遊戲定位到 PixiJS 製作規劃](/post/link-game-development-introduction)：同樣聚焦 TypeScript、遊戲開發，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2018-10-26，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};