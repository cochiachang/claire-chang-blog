var e=`---
title: 連連看遊戲開發環境設定：VS Code、npm、TypeScript、Gulp 與 GitHub
description: 連連看遊戲開發環境設定教學，整理 VS Code、Node.js/npm、TypeScript、Gulp 與 GitHub 的用途、安裝指令、package.json、tsconfig.json、gulpfile.js 基本配置，適合準備 PixiJS 或 H5 遊戲專案前閱讀。
date: 2018-10-18
category: 前端開發
tags: [VS Code, npm, TypeScript, Gulp, 遊戲開發]
readingTime: 10 分鐘
image: /images/tech/hero_link-game-development-environment.webp
imageAlt: VS Code 官網畫面截圖，象徵連連看遊戲開發環境設定
---


# 連連看遊戲開發環境設定：VS Code、npm、TypeScript、Gulp 與 GitHub

連連看遊戲開發環境可以先準備五個工具：VS Code 負責寫程式，Node.js 與 npm 負責套件管理，TypeScript 負責型別與編譯，Gulp 負責自動化建置，GitHub 則負責保存程式碼。這篇保留 2018 年用 TypeScript 製作 H5 連連看遊戲時的環境設定筆記，適合在進入 PixiJS 或遊戲邏輯之前，先把本機開發工具整理好。

## 連連看遊戲開發環境需要先準備哪些工具？

連連看遊戲開發環境的核心工具是 VS Code、Node.js/npm、TypeScript、Gulp 與 GitHub。這五個工具分別處理編輯、套件、語言、建置與版本管理。

我會先把工具分工拆清楚，因為環境設定最容易卡在「我到底是在裝編輯器、執行環境，還是建置工具」。下面這張表是這篇筆記的主線：

| 工具 | 負責的工作 | 在連連看專案中的用途 |
|---|---|---|
| VS Code | 程式編輯器與開發介面 | 寫 TypeScript、看提示、開終端機、管理 Git |
| Node.js / npm | JavaScript 執行環境與套件管理 | 安裝 Gulp、browser-sync、gulp-typescript 等套件 |
| TypeScript | JavaScript 的型別化語言 | 讓遊戲類別、資料結構與邏輯更容易維護 |
| Gulp | 自動化建置工具 | 編譯 TypeScript、複製資源、產生 bundle、啟動開發伺服器 |
| GitHub | 程式碼儲存庫 | 保存連連看系列的範例程式碼與版本紀錄 |

## VS Code 適合用來開發 TypeScript 遊戲嗎？

VS Code 很適合用來開發 TypeScript 遊戲，因為 VS Code 內建 Git 支援、偵錯能力與良好的自動提示。對 H5 遊戲專案來說，VS Code 的輕量與擴充性也很夠用。

[Visual Studio Code](https://code.visualstudio.com/)（簡稱 VS Code）是一個由微軟開發的 IDE。VS Code 最大的優點是免費、開源，也支援偵錯、內建 Git 版本控制，還能搭配終端機與擴充套件處理前端開發流程。

我自己覺得 VS Code 滿方便好用，自動提示、自動補完和顏色選擇功能都很強。對這種 TypeScript 遊戲專案來說，程式碼會分成場景、素材、盤面、演算法與 UI 類別；編輯器如果能快速跳轉與提示型別，後面拆類別會省很多時間。

![VS Code 官網與下載頁面](/images/tech/link-game-development-environment-vscode.webp)

下載連結可以從 [Download Visual Studio Code](https://code.visualstudio.com/Download) 進入。

## npm 在前端遊戲專案中解決什麼問題？

npm 解決的是前端套件管理問題。前端遊戲專案會用到建置、編譯、同步更新與第三方函式庫，npm 可以把這些相依套件寫進 \`package.json\`。

npm 是 Node Package Manager 的簡稱，也是一個線上套件庫，可以下載各式各樣的 JavaScript 套件來使用。

過去如果想使用 jQuery，通常會下載一個 jQuery library 檔案放進專案目錄裡。但是當 library 越來越大、越來越多，就會很難管理；svn 或 git 等版本管理系統也會多管一些其實不屬於專案本體的程式碼。library 之間的版本管理也會變得困難。

另外，很多元件庫只會在開發時期用到，部署時不一定需要。這些情況都會增加套件管理的複雜度。因此多數前端工程師會用 npm 管理套件，讓專案需要什麼、開發時需要什麼，都清楚寫在同一份設定檔裡。

## 如何安裝 npm 並初始化 package.json？

安裝 npm 通常先安裝 Node.js，因為 Node.js 0.6.3 之後已內建 npm。建立專案時執行 \`npm init\`，就能產生記錄專案資訊與套件相依性的 \`package.json\`。

安裝 npm 前要先去 [Node.js 官網](https://nodejs.org/en/) 安裝 Node.js。Node.js 從 0.6.3 版本開始內建 npm；如果安裝的是此版本或更新版本，就可以略過額外安裝 npm 的步驟。

若要檢查 npm 是否正確安裝，可以使用以下指令：

\`\`\`cmd
npm -v
\`\`\`

要初始化一個 npm 專案，使用下列指令，接著依序填寫專案名稱、版本、描述、進入點、測試指令、Git repository、關鍵字、作者與授權等資訊。

\`\`\`cmd
npm init
\`\`\`

![npm init 產生 package.json 的終端機畫面](/images/tech/link-game-development-environment-npm-init.webp)

按下 Enter 完成後，資料夾裡會增加一個名為 \`package.json\` 的檔案。這個檔案會記錄專案資訊、可執行指令與套件相依性。

下面是一個簡單的 \`package.json\` 範例：

\`\`\`jsonc
{
  "name": "lianliankan",
  "version": "0.0.1",
  "scripts": {
    "launch": "gulp launch-web"
  },
  "license": "ISC",
  "dependencies": {
    "browser-sync": "^2.24.7",
    "gulp": "^3.9.1",
    "gulp-typescript": "^5.0.0-alpha.3"
  }
}
\`\`\`

在這個例子裡，\`name\` 是專案名稱，\`version\` 是版本號，\`scripts\` 可以放啟動專案時要跑的指令，\`dependencies\` 則記錄專案需要的套件。

## TypeScript 為什麼適合用在連連看遊戲開發？

TypeScript 適合連連看遊戲開發，因為 TypeScript 在 JavaScript 之上加入型別與類別語法。當遊戲開始拆成 Board、Path、Scene、Sprite 等類別時，型別檢查可以提早抓出基本錯誤。

[TypeScript](https://www.typescriptlang.org/) 是一種由微軟開發的自由且開源的程式語言。TypeScript 是 JavaScript 的嚴格超集，加入靜態型別與類別基礎的物件導向特性。TypeScript 的開發也有 Anders Hejlsberg 參與；他是 C# 的首席架構師，也是 Delphi 和 Turbo Pascal 的創始人。

TypeScript 的設計目標是開發大型應用，然後轉譯成 JavaScript。由於 TypeScript 是 JavaScript 的嚴格超集，任何現有 JavaScript 程式都是合法的 TypeScript 程式。

TypeScript 的物件導向特性，讓我在寫 TypeScript 時，有一點像是在寫強型別語言；IDE 也可以幫忙檢查基本錯誤。將 TypeScript 編譯成 JavaScript 時，也可以設定要轉成哪一種版本，例如 ES5、ES6，避免寫程式時還要一直注意不同 JavaScript 版本的兼容性。

安裝 TypeScript 命令列工具的方法如下：

\`\`\`cmd
npm install -g typescript
\`\`\`

編譯 \`.ts\` 檔案的方法如下：

\`\`\`cmd
tsc hello.ts
\`\`\`

## tsconfig.json 應該設定哪些編譯選項？

\`tsconfig.json\` 是 TypeScript 專案的編譯設定檔。大型專案不會一個檔案一個檔案手動編譯，而是透過 \`files\` 與 \`compilerOptions\` 統一管理輸入、輸出與 JavaScript 版本。

當開發一個比較大型的專案時，通常不會一個一個檔案用 \`tsc hello.ts\` 去 compile。這時候會設定 TypeScript 的 config 檔案：\`tsconfig.json\`。

下面是一個 \`tsconfig.json\` 的簡單範例，\`compilerOptions\` 用來設定如何編譯 TypeScript 檔案：

\`\`\`jsonc
{
  "files": [
    "src/*.ts"
  ],
  "compilerOptions": {
    "target": "es5",
    "module": "system",
    "moduleResolution": "node",
    "sourceMap": false,
    "removeComments": true,
    "noImplicitAny": false,
    "rootDir": "src/",
    "lib": ["es6", "dom"],
    "allowSyntheticDefaultImports": true
  }
}
\`\`\`

幾個常看的設定如下：

| 設定 | 意義 |
|---|---|
| \`files\` | 指定要 compile 哪些 TypeScript 檔案 |
| \`target\` | 指定要輸出成哪個 JavaScript 版本，例如 \`es5\` |
| \`module\` | 指定模組生成規則，可用 \`commonjs\`、\`amd\`、\`umd\`、\`system\`、\`es6\`、\`es2015\`、\`none\` |
| \`sourceMap\` | 開發環境可開啟，讓 Chrome DevTools 錯誤位置連回 TypeScript 檔 |
| \`removeComments\` | 設為 \`true\` 時不輸出註解 |
| \`noImplicitAny\` | 型別為 \`any\` 時是否發出警告 |
| \`rootDir\` | 指定 TypeScript 來源根目錄 |

\`module\` 選擇 \`commonjs\` 會生成符合 CommonJS 規範的檔案；使用 \`amd\` 會生成 AMD 規範的檔案；使用 \`system\` 會生成使用 ES6 \`System.import\` 的程式碼。更詳細的設定可以看 [TypeScript tsconfig 官方說明](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)。

## Gulp 在 TypeScript 專案中負責什麼？

Gulp 在 TypeScript 專案中負責自動化工作，例如編譯 TypeScript、複製 HTML 與資源、打包 bundle、啟動本機伺服器與監看檔案變更。對遊戲開發來說，Gulp 可以縮短改檔到看結果的時間。

安裝完 Node.js 後，可以使用 Windows 的 cmd 或 Mac 的 Terminal 安裝 Gulp。首先把 Gulp 安裝到全域，這樣才能在命令列呼叫 \`gulp\` 執行工作；Mac 環境如果遇到權限問題，可能需要在指令前面加 \`sudo\`。

\`\`\`cmd
npm install -g gulp
\`\`\`

接著在專案裡安裝 Gulp 模組。\`--save-dev\` 代表把這個模組加到 \`package.json\` 的 \`devDependencies\` 裡；如果寫 \`--save\`，則會加到 \`dependencies\`。這兩個欄位的差異，是讓接手專案的人知道某個模組是開發時使用，還是執行專案時需要。

\`\`\`cmd
npm install gulp --save-dev
\`\`\`

因為這個專案使用 TypeScript，因此也要安裝 \`gulp-typescript\`。

\`\`\`cmd
npm install gulp-typescript --save-dev
\`\`\`

![安裝 gulp 與 gulp-typescript 的終端機畫面](/images/tech/link-game-development-environment-gulp.webp)

## gulpfile.js 可以怎麼設定建置流程？

\`gulpfile.js\` 可以把多個開發步驟串成一個指令。連連看遊戲專案可以在 \`gulp default\` 時編譯 TypeScript、複製資源、產生 bundle，並用 BrowserSync 開啟本機網頁。

下面是當時設定的 \`gulpfile.js\`。這個檔案主要設定部署或開發時要做的動作，例如在呼叫 \`gulp default\` 時自動做幾個步驟：

- 編譯 TypeScript 檔案。
- 複製 HTML 與相關資源。
- 產生 bundle。
- 使用 BrowserSync 開啟並同步更新網頁。

\`\`\`js
var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var tsify = require("tsify");
var browserSync = require("browser-sync");

gulp.task("copy-html", function () {
  return gulp.src(["src/*.html", "src/libs/*"])
    .pipe(gulp.dest("build"));
});

gulp.task("build", ["copy-html"], function () {
  browserify({
    basedir: ".",
    debug: true,
    entries: ["src/main.ts"],
    cache: {},
    packageCache: {}
  })
    .plugin(tsify)
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(gulp.dest("build"));
});

gulp.task("default", ["server"], function() {
  gulp.watch(["src/**/*"], ["build"]);
});

gulp.task("server", ["build"], function () {
  browserSync({
    open: true,
    port: 8001,
    files: ["build/**/*.{html,htm,css,js,json}"],
    server: {
      "baseDir": "./build"
    }
  });
});
\`\`\`

這段範例保留的是 2018 年筆記中的 Gulp 3 寫法；如果用新版 Gulp 建立新專案，需要依目前版本改成新版 task 寫法。對這篇連連看系列來說，重點是理解建置流程：來源碼放在 \`src/\`，編譯與打包後輸出到 \`build/\`，本機伺服器再讀取 \`build/\` 顯示結果。

## GitHub 在這個連連看系列中扮演什麼角色？

GitHub 負責保存連連看專案的程式碼與版本紀錄。環境設定完成後，把程式碼放進 GitHub repository，可以讓每一天的遊戲開發進度更容易追蹤。

這個連連看專案的所有程式碼會放在 GitHub 儲存庫：[cochiachang/ironman2018](https://github.com/cochiachang/ironman2018)。

Git 本身的主題很大，這篇不展開版本控制教學。如果還不熟悉 Git，可以參考 Will 保哥整理的 [30 天精通 Git 版本控管](https://github.com/doggy8088/Learn-Git-in-30-days)。

## 常見問題

### 開發連連看遊戲一定要用 VS Code 嗎？

開發連連看遊戲不一定要用 VS Code，也可以使用 WebStorm、Sublime Text 或其他編輯器。這篇使用 VS Code，是因為 VS Code 免費、支援 TypeScript、內建 Git，也方便在同一個視窗中操作終端機。

### npm init 產生的 package.json 有什麼用？

\`package.json\` 會記錄專案名稱、版本、啟動指令與套件相依性。對前端遊戲專案來說，\`package.json\` 可以讓建置工具、開發工具與第三方 library 的版本集中管理。

### TypeScript 和 JavaScript 的差別是什麼？

TypeScript 是 JavaScript 的嚴格超集，會在 JavaScript 之上加入靜態型別與類別語法。TypeScript 最後仍會編譯成 JavaScript，因此適合用來管理較大型的前端專案結構。

### Gulp 的 --save-dev 和 --save 有什麼不同？

\`--save-dev\` 會把套件寫進 \`devDependencies\`，代表套件主要用在開發或建置階段。\`--save\` 會把套件寫進 \`dependencies\`，代表執行專案時也需要這個套件。

### 新專案還適合照這篇使用 Gulp 3 寫法嗎？

新專案不建議直接照搬 Gulp 3 寫法，因為 Gulp 後續版本的 task API 已經改變。這篇比較適合用來理解 2018 年 TypeScript 遊戲專案的建置分工；實作新專案時，要依目前工具版本調整設定。

### GitHub 對個人遊戲開發有什麼幫助？

GitHub 可以保存每次修改的版本紀錄，讓遊戲功能拆開開發、回溯與分享都更容易。對連連看這種連續教學專案來說，GitHub 也能讓讀者對照不同日期的程式進度。

## 參考資料

- Visual Studio Code：[https://code.visualstudio.com/](https://code.visualstudio.com/)
- Download Visual Studio Code：[https://code.visualstudio.com/Download](https://code.visualstudio.com/Download)
- Node.js：[https://nodejs.org/en/](https://nodejs.org/en/)
- TypeScript：[https://www.typescriptlang.org/](https://www.typescriptlang.org/)
- TypeScript tsconfig 官方說明：[https://www.typescriptlang.org/docs/handbook/tsconfig-json.html](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
- TypeScript 配置文件 tsconfig 简析：[https://github.com/hstarorg/HstarDoc/blob/master/%E5%89%8D%E7%AB%AF%E7%9B%B8%E5%85%B3/TypeScript%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6tsconfig%E7%AE%80%E6%9E%90.md](https://github.com/hstarorg/HstarDoc/blob/master/%E5%89%8D%E7%AB%AF%E7%9B%B8%E5%85%B3/TypeScript%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6tsconfig%E7%AE%80%E6%9E%90.md)
- Gulp 學習 1 - 安裝與執行：[https://www.oxxostudio.tw/articles/201503/gulp-install-webserver.html](https://www.oxxostudio.tw/articles/201503/gulp-install-webserver.html)
- cochiachang/ironman2018：[https://github.com/cochiachang/ironman2018](https://github.com/cochiachang/ironman2018)
- 30 天精通 Git 版本控管：[https://github.com/doggy8088/Learn-Git-in-30-days](https://github.com/doggy8088/Learn-Git-in-30-days)

## 延伸閱讀

- [用 NPM 模組打造網頁遊戲開發環境：我的套件選擇清單](/post/game-dev-modules-introduction)：同樣聚焦 TypeScript、遊戲開發，可接著比較不同情境的做法。
- [連連看遊戲開發前言：從規則、益智遊戲定位到 PixiJS 製作規劃](/post/link-game-development-introduction)：同樣聚焦 TypeScript、遊戲開發，可接著比較不同情境的做法。
- [PixiJS 連連看遊戲開始、結束與過關畫面教學](/post/pixijs-link-game-start-end-clear-screens)：同樣聚焦 TypeScript、遊戲開發，可接著比較不同情境的做法。

## 最後更新

2018-10-18 發布；2026-08-28 依現行技術文章結構整理。
`;export{e as default};