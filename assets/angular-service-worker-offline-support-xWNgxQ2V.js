var e=`---
title: Angular Service Worker 離線支援教學：PWA 快取、更新檢查與 ngsw 除錯
description: 介紹 Angular Service Worker 如何支援 PWA 離線運作，包含 Angular 5 與 CLI 環境需求、新專案與既有專案設定、ngsw-config.json 快取配置、Chrome 離線測試、SwUpdate 更新流程與 ngsw/state 除錯方式。
date: 2018-01-13
category: 前端開發
tags: [Angular, Service Worker, PWA, 離線支援, Angular CLI]
readingTime: 11 分鐘
image: /images/tech/hero_angular-service-worker-offline-support.webp
imageAlt: Can I Use 顯示 Service Worker 瀏覽器支援狀態的畫面
---


# Angular Service Worker 離線支援教學：PWA 快取、更新檢查與 ngsw 除錯

Angular Service Worker 可以讓 Angular 應用程式更接近 Progressive Web App（PWA）的使用體驗：即使網路暫時中斷，前端資源仍可從瀏覽器快取載入，等網路恢復後再同步資料或載入新版檔案。這篇整理 Angular 5 時期導入 Service Worker 的方式，包含新專案、既有專案、\`ngsw-config.json\`、Chrome 離線測試、\`SwUpdate\` 更新檢查與 \`ngsw/state\` 除錯。

## Angular Service Worker 解決什麼離線問題？

Angular Service Worker 的核心價值，是讓 Angular 應用程式在網路不穩時仍能載入前端資源。Service Worker 會在瀏覽器端攔截請求、回應快取，讓 PWA 具備離線可用的基礎。

Angular 在第 5 版加入 Service Worker 支援，主要是讓 Angular 更符合 PWA 的概念。

PWA（Progressive Web App）希望 Web application 在不同環境下都能順暢運作，包含網路環境不穩、手機作業系統限制，或使用者短暫離線的情境。以收信 App 為例，使用者收信、寫信、刪除信件時，結果最後都需要回到伺服器儲存；但如果當下沒有網路，就需要一套機制先保留操作，等網路正常連線後再把剛才執行的動作反映回伺服器。

Service Worker 就是 Web application 處理這類離線體驗的重要基礎。

## 使用 Angular Service Worker 需要哪些環境？

Angular Service Worker 在 Angular 5 專案中需要 Angular 5.0.0 以上與 Angular CLI 1.6.0 以上。Web application 也必須執行在支援 Service Worker 的瀏覽器中。

基本需求如下：

| 項目 | 最低需求 |
|---|---|
| Angular | 5.0.0 或更高版本 |
| Angular CLI | 1.6.0 或更高版本 |
| 瀏覽器 | 支援 Service Worker 的 Chrome、Firefox 或其他現代瀏覽器 |

瀏覽器支援狀態可以參考 [Can I Use 的 Service Workers 頁面](https://caniuse.com/serviceworkers)。下圖是當時查詢支援狀態的截圖。

![Can I Use 顯示 Service Worker 瀏覽器支援狀態](/images/tech/angular-service-worker-offline-support-01.webp)

## Service Worker 的生命週期怎麼理解？

Service Worker 生命週期包含安裝、啟用、等待與控制頁面等階段。理解生命週期有助於判斷新版快取何時生效，以及為什麼使用者有時需要重新載入頁面才會看到更新。

Service Worker 不是普通的 JavaScript 檔案載入後立刻取代所有頁面。Service Worker 會先被註冊，接著進入 install、activate 等階段；若瀏覽器裡還有舊頁面正在使用舊版本，新的 Service Worker 可能會先等待，直到既有 client 釋放後才正式控制頁面。

![Service Worker 生命週期示意圖](/images/tech/angular-service-worker-offline-support-02.webp)

圖片來源：[Browser push notifications using JavaScript](https://www.cronj.com/blog/browser-push-notifications-using-javascript/)

## 新的 Angular 專案如何啟用 Service Worker？

新的 Angular 專案可以在 \`ng new\` 時加上 \`--service-worker\` 旗標。Angular CLI 會協助產生與 Service Worker 相關的設定，減少後續手動補檔案的步驟。

建立新專案時，在 \`ng new\` 命令加入 \`--service-worker\`：

\`\`\`cmd
ng new my-project --service-worker
\`\`\`

這個做法適合一開始就決定要做 PWA 離線支援的專案。若專案已經建立完成，則需要另外安裝 package、啟用 CLI 設定、註冊 Service Worker，並建立 \`ngsw-config.json\`。

## 既有 Angular 專案如何加入 Service Worker？

既有 Angular 專案要加入 Service Worker，需要安裝 \`@angular/service-worker\`、啟用 CLI 設定、在 \`AppModule\` 註冊 \`ngsw-worker.js\`，最後建立 \`ngsw-config.json\` 快取設定。

步驟 1：添加 service worker package。

\`\`\`cmd
yarn add @angular/service-worker
\`\`\`

步驟 2：在 Angular CLI 中啟用 service worker。

\`\`\`cmd
ng set apps.0.serviceWorker=true
\`\`\`

步驟 3：在 \`src/app/app.module.ts\` 導入並註冊 Service Worker。

\`\`\`js
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
\`\`\`

在 \`app.module.ts\` 的 \`imports\` 中加入 \`ServiceWorkerModule.register()\`：

\`\`\`js
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    CheckForUpdateService,
    LogUpdateService,
    PromptUpdateService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
\`\`\`

步驟 4：建立 \`src/ngsw-config.json\`。大多數 Angular 5 專案可以先用以下合理預設值：

\`\`\`json
{
  "index": "/index.html",
  "assetGroups": [{
    "name": "app",
    "installMode": "prefetch",
    "resources": {
      "files": [
        "/favicon.ico",
        "/index.html"
      ],
      "versionedFiles": [
        "/*.bundle.css",
        "/*.bundle.js",
        "/*.chunk.js"
      ]
    }
  }, {
    "name": "assets",
    "installMode": "lazy",
    "updateMode": "prefetch",
    "resources": {
      "files": [
        "/assets/**"
      ]
    }
  }]
}
\`\`\`

步驟 5：構建專案。

\`\`\`cmd
ng build --prod
\`\`\`

## 如何觀察 Angular Service Worker 是否真的運作？

Angular Service Worker 是否生效，可以用 Chrome DevTools 切換離線狀態，再檢查 Network 面板的請求來源。如果 HTTP 資料來源顯示來自 Service Worker，代表快取回應已介入。

在 Chrome DevTools 中，可以把瀏覽器狀態設為離線：

![Chrome DevTools 中的離線狀態勾選選項](/images/tech/angular-service-worker-offline-support-03.webp)

接著觀察 Network 面板。若資料來源顯示為 \`service worker\`，代表目前 HTTP 資料是由 Service Worker 回應。

![Chrome DevTools Network 面板顯示資料來源來自 Service Worker](/images/tech/angular-service-worker-offline-support-04.webp)

也可以從 Application 面板觀察 Service Worker 的運行狀態。

![Chrome DevTools Application 面板中的 Service Worker 運行狀態](/images/tech/angular-service-worker-offline-support-05.webp)

## SwUpdate service 可以做哪些更新檢查？

Angular 的 \`SwUpdate\` service 可以監聽可用版本、啟用版本，也可以定期檢查更新。這些事件適合用來記錄版本狀態，或提示使用者重新整理以套用新版。

下面是利用 \`SwUpdate\` 取得目前可用版本與已啟用版本通知的方式：

\`\`\`js
@Injectable()
export class LogUpdateService {

  constructor(updates: SwUpdate) {
    updates.available.subscribe(event => {
      console.log('current version is', event.current);
      console.log('available version is', event.available);
    });
    updates.activated.subscribe(event => {
      console.log('old version was', event.previous);
      console.log('new version is', event.current);
    });
  }
}
\`\`\`

檢查更新的方式：

\`\`\`js
import { interval } from 'rxjs/observable/interval';

@Injectable()
export class CheckForUpdateService {

  constructor(updates: SwUpdate) {
    interval(6 * 60 * 60).subscribe(() => updates.checkForUpdate());
  }
}
\`\`\`

強制更新資料的方式：

\`\`\`js
@Injectable()
export class PromptUpdateService {

  constructor(updates: SwUpdate) {
    updates.available.subscribe(event => {
      if (promptUser(event)) {
        updates.activateUpdate().then(() => document.location.reload());
      }
    });
  }
}
\`\`\`

## Angular Service Worker 如何處理快取版本一致性？

Angular Service Worker 的快取不能只看單一檔案是否存在，還要維持同一版本的 HTML、JavaScript 與 CSS 一致。版本不一致時，舊 HTML 可能呼叫新版 JavaScript 已改名的方法，造成離線載入錯誤。

可以把 Service Worker 想像成瀏覽器快取或 CDN edge，差別是 Service Worker 將資料存在使用者的瀏覽器端。

透過 \`src/ngsw-config.json\` 可以設定版本資訊。被分組到同一個版本的文件通常包含 HTML、JavaScript 和 CSS，這些文件的完整性非常重要，因為 JavaScript 和 CSS 常常會互相引用並彼此依賴。

例如 \`index.html\` 可能引用 \`bundle.js\` 並呼叫 \`startApp()\`。如果某次改版把 \`startApp()\` 改名為 \`runApp()\`，但是使用者手上的 \`index.html\` 還是舊版本，仍然呼叫 \`startApp()\`，就會造成執行錯誤。

因此快取設定資料的完整性和版本一致性非常重要，可以確保 Angular 在離線執行時仍然正常。每次使用者打開或更新網頁時，Angular Service Worker 都會透過 \`ngsw.json\` 檢查應用程式更新；如果發現新版頁面，會自動下載並緩存，在下次載入網頁時提供。

## 如何 Debug Angular Service Worker？

Angular Service Worker 的 debug 資訊位於 \`ngsw/\` 底下，公開網址是 \`ngsw/state\`。這個頁面可以檢查 Driver 狀態、manifest hash、client、idle task queue 與 debug log。

下面是一個 \`ngsw/state\` 範例：

\`\`\`js
NGSW Debug Info:
// 這邊是指 service worker 的 Driver 狀態，有三種值：
// NORMAL（正常）
// EXISTING_CLIENTS_ONLY（舊的快取可安全使用）
// SAFE_MODE（快取資料失效，所有資料都會由網路提供）
Driver state: NORMAL ((nominal))

// 最新清單的 SHA hash
Latest manifest hash: eea7f5f464f90789b621170af5a569d6be077e5c

// 上次更新檢查
Last update check: never

// 版本資訊
=== Version eea7f5f464f90789b621170af5a569d6be077e5c ===

Clients: 7b79a015-69af-4d3d-9ae6-95ba90c79486, 5bc08295-aaf2-42f3-a4cc-9e4ef9100f65

// 空閒任務隊列
=== Idle Task Queue ===
Last update tick: 1s496u
Last update run: never
Task queue:
 * init post-load (update, cleanup)

// 調試日誌
Debug log:
\`\`\`

若要查配置文件格式，可以參考 Angular 官方的 [Service Worker Configuration](https://angular.io/guide/service-worker-config)。

## 常見問題

### Angular Service Worker 是什麼？

Angular Service Worker 是 Angular 提供的 PWA 支援機制，負責在瀏覽器端快取應用程式資源、檢查版本更新，並在離線或網路不穩時提供已快取的檔案。

### Angular 5 可以使用 Service Worker 嗎？

Angular 5 可以使用 Service Worker，但專案需要 Angular 5.0.0 以上與 Angular CLI 1.6.0 以上。既有專案還需要安裝 \`@angular/service-worker\` 並設定 \`ngsw-config.json\`。

### Angular Service Worker 一定只能在 production 啟用嗎？

範例中用 \`environment.production\` 控制啟用狀態，代表 production build 才註冊 \`ngsw-worker.js\`。這樣可以避免開發時被快取干擾，因為 Service Worker 會攔截請求並回應快取內容。

### ngsw-config.json 主要設定什麼？

\`ngsw-config.json\` 主要設定 Angular Service Worker 要快取哪些資源、如何安裝快取，以及資源更新時如何預先抓取。常見分類包含 \`app\` 這類核心檔案與 \`assets\` 這類靜態資源。

### 如何確認 Angular Service Worker 已經接管請求？

可以在 Chrome DevTools 把 Network 設為 Offline，再重新整理頁面並觀察請求來源。若 Network 面板顯示資源來自 \`service worker\`，代表 Service Worker 已經接管並回應快取。

### ngsw/state 可以看什麼？

\`ngsw/state\` 可以查看 Angular Service Worker 的 Driver 狀態、最新 manifest hash、clients、idle task queue 與 debug log。除錯離線快取或版本更新問題時，這個頁面很實用。

## 參考資料

- [Can I Use：Service Workers](https://caniuse.com/serviceworkers)
- [Google Developers：服務工作線程簡介](https://developers.google.com/web/fundamentals/primers/service-workers/?hl=zh-cn)
- [既期待又怕受傷害：@angular/service-worker](https://jonny-huang.github.io/angular/training/22_angular_pwa/)
- [如何让 Angular 支持 Service Worker](https://segmentfault.com/a/1190000009782718)
- [[Angular] 利用 Angular CLI 1.6 建立 PWA 網站](https://blog.kevinyang.net/2017/11/25/angular-pwa/)
- [Angular：Introduction to Angular service workers](https://angular.io/guide/service-worker-intro)
- [Service Worker](https://cythilya.github.io/2017/07/16/service-worker/)
- [Browser push notifications using JavaScript](https://www.cronj.com/blog/browser-push-notifications-using-javascript/)

## 延伸閱讀

- [Angular Service 建立教學：用 CLI 產生 HeroService 並回傳 Observable](/post/angular-create-service-tutorial)：同樣聚焦 Angular、Angular CLI，可接著比較不同情境的做法。
- [建立一個 Angular 5 的專案](/post/angular-cli-new-project-setup)：同樣聚焦 Angular、Angular CLI，可接著比較不同情境的做法。
- [如何用 Angular CLI 建立元件（Component）並完成資料綁定](/post/angular-create-component)：同樣聚焦 Angular、Angular CLI，可接著比較不同情境的做法。

## 最後更新

2018-01-13（初次發布於 2018-01-13；本文保留當時 Angular 5 筆記內容，並補上 GEO 結構、Answer Blocks、FAQ 與站內延伸閱讀。）
`;export{e as default};