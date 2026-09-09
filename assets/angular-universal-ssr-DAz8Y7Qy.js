var e=`---
title: Angular Universal SSR 教學：伺服器端渲染、SEO 與 Express 設定
description: 整理 Angular Universal SSR 的用途與 Angular 5 專案設定流程，包含 SEO、第一屏載入、platform-server、AppServerModule、Express server、tsconfig.server.json 與 build:universal 指令。
date: 2018-01-14
category: 前端開發
tags: [Angular, Angular Universal, SSR, SEO, Express]
readingTime: 8 分鐘
image: /images/tech/hero_angular-universal-ssr.webp
imageAlt: 模組化建築外牆，象徵 Angular Universal 將前端應用預先渲染成可被伺服器輸出的頁面
---
# Angular Universal SSR 教學：伺服器端渲染、SEO 與 Express 設定

Angular Universal 用來讓 Angular 應用程式支援伺服器端渲染（Server-Side Rendering，SSR）。Angular Universal 會在 server side 預先處理網頁模板，把原本需要瀏覽器執行 JavaScript 才能看到的畫面，先輸出成帶有資料的 HTML 頁面，讓搜尋引擎、社群預覽與低效能裝置更容易讀到內容。

## Angular Universal 是什麼？

Angular Universal 是 Angular 的伺服器端渲染方案，可以在伺服器先產生完整 HTML，再交給瀏覽器接手。Angular Universal 適合需要 SEO、社群分享預覽與更快第一屏顯示的 Angular 網站。

Angular 是一種構建 Web 應用的強大方式，但是長期以來，開發人員都知道 Angular 在 SEO 和可訪問性方面有一些限制。Google 的爬蟲可以執行 JavaScript，但 Google 不是唯一會讀取頁面的爬蟲。

例如把連結提交給 Slack 之後，Slack 的爬蟲會抓取頁面預覽，但不一定會執行 JavaScript。若 Angular 應用只回傳尚未渲染的 HTML template，預覽內容就可能顯示不完整。Angular Universal 的目的，就是讓伺服器先完成渲染，減少這類問題。

Angular Universal 可以在使用者要求資料的當下產生 HTML，也可以事先產生靜態檔案供未來使用。

## Angular Universal 主要解決哪些問題？

Angular Universal 主要解決三件事：讓爬蟲更容易讀取內容、改善低效能裝置體驗、加快第一頁顯示。對內容型網站與公開頁面來說，SSR 通常比純前端渲染更容易被搜尋與分享。

Angular Universal 的主要目的有三個：

- 方便網路爬蟲讀取內容，也就是搜尋引擎優化（Search Engine Optimization，SEO）。
- 提高手機裝置和效能較差設備上的性能表現。
- 快速顯示第一頁內容。

Google、Bing、Facebook、Twitter 和其他社交媒體網站都依靠網路爬蟲為網站編索引，或擷取分享預覽。Angular Universal 可以生成 Angular 應用程式的靜態版本，讓每個 URL 回傳一個已經渲染好的頁面；即使不執行 JavaScript，也比較容易搜尋、連結和導覽。

## 安裝 Angular Universal 需要哪些套件？

Angular 5 專案加入 Angular Universal 時，會用到 \`@angular/platform-server\`、\`@nguniversal/express-engine\`、\`@nguniversal/module-map-ngfactory-loader\` 與 \`ts-loader\`。這些套件分別處理伺服器端 Angular、Express 渲染、lazy loading 與 TypeScript 編譯。

Angular Universal 常用套件如下：

| 套件 | 用途 |
|---|---|
| \`@angular/platform-server\` | Angular 通用伺服器端組件 |
| \`@nguniversal/module-map-ngfactory-loader\` | 在伺服器渲染環境中處理延遲載入 |
| \`@nguniversal/express-engine\` | 讓 Express 可以渲染 Angular Universal 應用 |
| \`ts-loader\` | 傳輸與編譯伺服器應用程式 |

使用下面指令安裝四個 package：

\`\`\`cmd
npm install --save @angular/platform-server @nguniversal/module-map-ngfactory-loader ts-loader @nguniversal/express-engine
\`\`\`

## AppModule 要怎麼支援 server transition？

Angular Universal 需要讓瀏覽器端 AppModule 知道應用程式曾由伺服器渲染。\`BrowserModule.withServerTransition()\` 會設定同一個 \`appId\`，讓伺服器輸出的 HTML 與瀏覽器端 Angular 接手時能對應起來。

修正預設 \`AppModule\` 中 \`BrowserModule\` 的匯入方式：

\`\`\`ts
BrowserModule.withServerTransition({ appId: 'tour-of-heroes' }),
\`\`\`

如果要根據執行環境判斷目前是在 browser 還是 server，可以注入 \`PLATFORM_ID\` 與 \`APP_ID\`：

\`\`\`ts
import { PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

constructor(
  @Inject(PLATFORM_ID) private platformId: Object,
  @Inject(APP_ID) private appId: string,
) {
  const platform = isPlatformBrowser(platformId)
    ? 'in the browser'
    : 'on the server';

  console.log(\`Running \${platform} with appId=\${appId}\`);
}
\`\`\`

判斷環境時要留意命名，\`isPlatformBrowser(platformId)\` 回傳 \`true\` 才代表程式正在瀏覽器端執行。SSR 專案常會把只存在於 browser 的 API，例如 \`window\`、\`document\`、\`localStorage\`，放在這類判斷之後再使用。

## AppServerModule 要怎麼寫？

Angular Universal 需要一個伺服器端 module，通常命名為 \`AppServerModule\`。\`AppServerModule\` 會匯入原本的 \`AppModule\`、\`ServerModule\`，以及處理 lazy loading 的 \`ModuleMapLoaderModule\`。

\`src/app/app.server.module.ts\` 的內容如下：

\`\`\`ts
import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ModuleMapLoaderModule,
  ],
  providers: [
    // Add universal-only providers here
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
\`\`\`

\`ServerModule\` 讓 Angular 可以在 Node.js 環境渲染應用程式；\`ModuleMapLoaderModule\` 則用來支援 server render 時的 lazy-loaded module。若有只在伺服器端使用的 provider，可以放在 \`providers\` 裡。

## Express server 如何輸出 Angular Universal 頁面？

Express server 會用 \`ngExpressEngine()\` 接上 Angular Universal 的 server bundle。靜態檔案從 \`dist/browser\` 提供，一般路由則交給 Universal engine 渲染 \`index.html\`。

在這邊使用 Express framework 來做 server，並利用 Universal 的 \`renderModuleFactory\` 相關能力輸出 HTML。以下是完整 server 範例：

\`\`\`ts
// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { enableProdMode } from '@angular/core';

import * as express from 'express';
import { join } from 'path';

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist');

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main.bundle');

// Express Engine
import { ngExpressEngine } from '@nguniversal/express-engine';
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP),
  ],
}));

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

// TODO: implement data requests securely
app.get('/api/*', (req, res) => {
  res.status(404).send('data requests are not supported');
});

// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser')));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render(join(DIST_FOLDER, 'browser', 'index.html'), { req });
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(\`Node server listening on http://localhost:\${PORT}\`);
});
\`\`\`

如果只看 \`server.ts\` 裡最關鍵的段落，會有三件事：

\`\`\`ts
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP),
  ],
}));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render(join(DIST_FOLDER, 'browser', 'index.html'), { req });
});

// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser')));
\`\`\`

實作時我會特別檢查路由順序：靜態檔案路由應先處理帶副檔名的資源，一般頁面路由再交給 Universal engine。這樣 CSS、JavaScript、圖片等檔案才不會被當成 Angular route 渲染。

## tsconfig.server.json 要怎麼設定？

\`tsconfig.server.json\` 是 Angular Universal 的伺服器端 TypeScript 設定。Angular 5 專案通常會把 \`module\` 設為 \`commonjs\`，並用 \`entryModule\` 指向 \`AppServerModule\`。

\`src/tsconfig.server.json\` 的內容如下：

\`\`\`json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "outDir": "../out-tsc/app",
    "baseUrl": "./",
    "module": "commonjs",
    "types": []
  },
  "exclude": [
    "test.ts",
    "**/*.spec.ts"
  ],
  "angularCompilerOptions": {
    "entryModule": "app/app.server.module#AppServerModule"
  }
}
\`\`\`

這份設定讓伺服器端程式使用自己的編譯輸出位置與 module 格式。\`entryModule\` 則告訴 Angular compiler，server render 的入口 module 是 \`AppServerModule\`。

## Angular Universal 要怎麼 build？

Angular Universal 專案通常會準備一個 \`build:universal\` script，同時產生 browser bundle 與 server bundle。完成 build 後，Express server 才能從 \`dist/browser\` 讀取靜態檔案，並載入 \`dist/server\` 的 server bundle。

BUILD 出檔案時執行：

\`\`\`cmd
npm run build:universal
\`\`\`

若 build 後啟動 server，瀏覽器會連到 Node.js server，例如 \`http://localhost:4000\`。一般 Angular route 會先由 server render 成 HTML，再由瀏覽器端 Angular 接手互動行為。

## Angular Universal 設定時要注意哪些地方？

Angular Universal 最容易出錯的地方，是 browser-only API、路由順序、lazy loading 與 API 路由。只要程式會在 Node.js 執行，就不能假設 \`window\`、\`document\`、\`localStorage\` 一定存在。

我整理 Angular Universal 設定時，會先看這幾個檢查點：

| 檢查點 | 要確認的事 |
|---|---|
| Browser API | \`window\`、\`document\`、\`localStorage\` 是否只在 browser 環境使用 |
| Server transition | \`BrowserModule.withServerTransition()\` 的 \`appId\` 是否一致 |
| Lazy loading | 是否加入 \`ModuleMapLoaderModule\` 與 \`provideModuleMap(LAZY_MODULE_MAP)\` |
| 靜態檔案 | \`app.get('*.*', express.static(...))\` 是否能正確提供 CSS、JS、圖片 |
| 一般路由 | \`app.get('*', ...)\` 是否把頁面 route 交給 Universal engine |
| API 路由 | \`/api/*\` 是否另外處理，而不是被頁面渲染吃掉 |

Angular Universal 的價值不是讓整個前端變成後端，而是先把首屏 HTML 交出來。等瀏覽器載入 bundle 後，Angular 應用還是會回到熟悉的前端互動模式。

## 常見問題

### Angular Universal 和一般 Angular SPA 差在哪裡？

一般 Angular SPA 通常先回傳空的 shell，再由瀏覽器執行 JavaScript 產生畫面。Angular Universal 會先在伺服器端產生完整 HTML，讓使用者、爬蟲與社群預覽工具更早看到內容。

### Angular Universal 一定能改善 SEO 嗎？

Angular Universal 能改善爬蟲讀取內容的機會，但 SEO 仍取決於內容品質、網站結構、內部連結、效能與可索引性。Angular Universal 解決的是「內容能不能先被讀到」這一層問題。

### Angular Universal 可以事先產生靜態頁面嗎？

Angular Universal 可以依請求在伺服器端即時渲染，也可以搭配預先渲染流程產生靜態 HTML。來源筆記提到的重點是：頁面可以在使用者要求當下產生，也可以事先產生好供未來使用。

### Angular Universal 專案為什麼需要 Express？

Express 在這個設定裡負責接收 HTTP request、提供靜態檔案，並把一般頁面路由交給 \`ngExpressEngine()\` 渲染。Angular Universal 本身處理 Angular 的 server render，Express 則負責 Node.js server 的請求流程。

### Angular Universal 裡可以直接使用 window 或 document 嗎？

Angular Universal 會在 Node.js 執行部分程式，所以不能直接假設 \`window\` 或 \`document\` 一定存在。需要使用 browser-only API 時，建議先用 \`isPlatformBrowser()\` 判斷目前是否在瀏覽器端。

## 參考資料

- [Angular Universal](https://universal.angular.io/)
- [Angular Universal 統一平台筆記](https://www.jianshu.com/p/81e8472376cc)
- [Angular Server-Side Rendering with Angular CLI 1.3.x 基本設定](https://blog.kevinyang.net/2017/08/08/angular-cli-universal/)
- [如何在 Angular CLI 建立的專案加入 Angular Universal 伺服器渲染功能](https://blog.miniasp.com/post/2017/06/18/How-to-setup-Angular-Universal-in-an-Angular-CLI-project.aspx)
- [Angular Universal 的三種開發模式](https://itw01.com/G3MBE3P.html)

## 延伸閱讀

- [Angular NPM 與 package.json 設定教學](/post/angular-npm-package-json-setup)：同樣聚焦 Angular，可接著比較不同情境的做法。
- [建立一個 Angular 5 的專案](/post/angular-cli-new-project-setup)：同樣聚焦 Angular，可接著比較不同情境的做法。
- [Angular Service 建立教學：用 CLI 產生 HeroService 並回傳 Observable](/post/angular-create-service-tutorial)：同樣聚焦 Angular，可接著比較不同情境的做法。

## 最後更新

2018-01-14（本文保留 2018-01-14 的 Angular 5 筆記內容，並補上 GEO 結構、Answer Blocks、FAQ 與站內延伸閱讀。）
`;export{e as default};