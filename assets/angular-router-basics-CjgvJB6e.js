var e=`---
title: Angular Router 基礎教學：Routes、RouterLink、RouterOutlet 與路由事件
description: 介紹 Angular Router 基礎用法，包含 base href、Routes 設定、RouterOutlet、RouterLink、RouterLinkActive、ActivatedRoute 與路由事件。
date: 2018-01-09
category: 前端開發
tags: [Angular, Router, 前端路由]
readingTime: 10 分鐘
image: /images/tech/hero_angular-cli-new-project-setup.webp
imageAlt: Angular 專案結構與前端路由開發示意圖
---
# Angular Router 基礎教學：Routes、RouterLink、RouterOutlet 與路由事件

Angular Router 是 Angular 官方提供的前端路由工具，用來在單頁應用程式（Single Page Application，SPA）裡依照 URL 顯示不同 component。建立 Angular Router 基礎設定時，通常會先設定 \`base href\`，再定義 \`Routes\`、載入 \`RouterModule\` 或 \`provideRouter()\`，最後用 \`RouterOutlet\`、\`RouterLink\` 與 \`RouterLinkActive\` 完成畫面切換。

## Angular Routing 是什麼？

Angular Routing 是 Angular 單頁應用程式用 URL 決定畫面內容的機制。Angular Router 會比對目前 URL 與路由表，找到對應 component，再把 component 顯示到指定 outlet。

Routing 意指路由，也就是由 router 決定現在要顯示哪一個頁面。在套用 Routing 時，會有下列實作流程：

1. 套用轉址設定，讓伺服器不要真的到該網址位置讀檔，而是交給 Angular Router 決定畫面。
2. 由 URL 分析要顯示的狀態。
3. 由狀態取得真正需要的資訊。
4. 從這些資訊組成頁面實體。
5. 套用導覽動作，從目前畫面切換到另一個畫面。

![Angular Router Routing 流程示意圖](/images/tech/angular-router-basics-routing-flow.webp)

Angular Router 產生的是虛擬 URL，不是真的存在於檔案系統裡。因此正式部署時，伺服器需要把找不到的路徑導回 \`index.html\`，否則重新整理深層 URL 時可能出現 404。

## Angular Router 為什麼需要設定 base href？

Angular Router 使用瀏覽器 History API 更新網址，\`base href\` 會告訴瀏覽器相對路徑從哪裡開始解析。缺少 \`base href\` 時，CSS、JavaScript 與前端路由都可能指向錯誤位置。

Router 使用 \`history.pushState()\` 進行導航。靠著 \`pushState()\`，瀏覽器網址可以看起來像換到另一個真實頁面，但畫面實際上仍由前端應用程式接管（MDN，2025 年更新；Angular Docs，2026 年存取）。

在 \`src/index.html\` 裡增加：

\`\`\`html
<base href="/">
\`\`\`

\`<base>\` 應放在 \`<head>\` 標籤內。不論 Angular 應用程式是不是部署在根目錄，都需要設定這個項目。

像 Plunker 這類沒有固定網站基準位置的環境，可以用動態方式設定 base path：

\`\`\`html
<script>document.write('<base href="' + document.location + '" />');<\/script>
\`\`\`

## Angular Router 要怎麼設定 Routes？

Angular Router 的 \`Routes\` 是 URL 與 component 的對照表。舊版 NgModule 專案常用 \`RouterModule.forRoot(routes)\`，新版 standalone 專案也可以用 \`provideRouter(routes)\`。

在 \`src/app/app.module.ts\` 導入 \`RouterModule\` 及 \`Routes\`：

\`\`\`ts
import { RouterModule, Routes } from '@angular/router';
\`\`\`

在一個 Angular 應用程式中，全站通常只建立一個根 Router。當瀏覽器 URL 更改時，router 會尋找 \`Routes\` 裡符合的設定，確認要顯示哪一個 component。

以下為 \`src/app/app.module.ts\` 的部分內容：

\`\`\`ts
const appRoutes: Routes = [
  { path: 'crisis-center', component: CrisisListComponent },
  { path: 'hero/:id', component: HeroDetailComponent },
  {
    path: 'heroes',
    component: HeroListComponent,
    data: { title: 'Heroes List' },
  },
  {
    path: '',
    redirectTo: '/heroes',
    pathMatch: 'full',
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // debugging purposes only
    ),
    // other imports here
  ],
})
export class AppModule {}
\`\`\`

\`enableTracing: true\` 適合用在除錯，因為 Angular Router 會輸出 navigation event；正式環境通常不會開啟。

## RouterModule.forRoot 是做什麼的？

\`RouterModule.forRoot()\` 會在根模組註冊全站 Router service 與根路由設定。這個方法應只在應用程式根層使用，功能模組的路由應交給 \`RouterModule.forChild()\`。

在 NgModule 架構裡，如果希望某個 module 像核心元件一樣比其他子元件更早載入，或希望在所有元件初始化之前先設定值，可以透過 \`forRoot()\` 回傳 \`ModuleWithProviders\`：

\`\`\`ts
static forRoot(config: UserServiceConfig): ModuleWithProviders {
  return {
    ngModule: CoreModule,
    providers: [
      { provide: UserServiceConfig, useValue: config },
    ],
  };
}
\`\`\`

Angular Router 使用同樣概念，讓根路由設定能在應用程式啟動時先被註冊，決定目前 URL 對應的頁面。

## RouterOutlet 要放在哪裡？

\`RouterOutlet\` 是 Angular Router 插入目前路由 component 的位置。Angular 會保留 \`<router-outlet>\` 元素，再把符合 URL 的 component 顯示在 outlet 附近。

Router 會根據網址決定要顯示哪個 component 的 view，所以需要設定一個區塊來顯示要被插入的 view：

\`\`\`html
<router-outlet></router-outlet>
<!-- Routed views go here -->
\`\`\`

在典型版面裡，\`RouterOutlet\` 會放在導覽列下方或主要內容區：

\`\`\`html
<h1>Angular Router</h1>
<nav>
  <a routerLink="/crisis-center" routerLinkActive="active">Crisis Center</a>
  <a routerLink="/heroes" routerLinkActive="active">Heroes</a>
</nav>
<router-outlet></router-outlet>
\`\`\`

![Angular RouterLink 切換畫面示意動畫](/images/tech/angular-router-basics-routerlink-demo.webp)

## Angular Routes 有哪些常見設定？

Angular Routes 可以處理子路由、多 outlet、萬用路由、重新導向、空路徑、\`pathMatch\` 與延遲載入。路由設定的順序很重要，越具體的規則應放越前面。

更多 Router 設定方式可看 Angular 官方 Routes API（Angular Docs，2026 年存取）。

![Angular Routes API 文件截圖](/images/tech/angular-router-basics-routes-api.webp)

常見設定如下。

### 設定子連結

\`\`\`ts
[{
  path: 'team/:id',
  component: Team,
  children: [{
    path: 'user/:name',
    component: User,
  }],
}]
\`\`\`

當 URL 為 \`/team/11/user/bob\` 時，Router 會顯示 \`Team\` component，並在裡面產生一個 \`User\` component。

### Multiple Outlets

\`\`\`ts
[{
  path: 'team/:id',
  component: Team,
}, {
  path: 'chat/:user',
  component: Chat,
  outlet: 'aux',
}]
\`\`\`

當 URL 為 \`/team/11(aux:chat/jim)\` 時，Router 會先建立 \`Team\` component，再建立 \`Chat\` component，接著將 \`Chat\` component 放到 \`Team\` component 內名為 \`aux\` 的 outlet。

### 萬用路由

\`\`\`ts
[{
  path: '**',
  component: Sink,
}]
\`\`\`

\`path: '**'\` 會符合所有未被前面路由命中的 URL，常用來顯示 404 頁面。因為 Angular Router 採用 first-match wins，萬用路由應放在路由表最後。

### 重新導向

\`\`\`ts
[{
  path: 'team/:id',
  component: Team,
  children: [{
    path: 'legacy/user/:name',
    redirectTo: 'user/:name',
  }, {
    path: 'user/:name',
    component: User,
  }],
}]
\`\`\`

當 URL 為 \`/team/11/legacy/user/jim\` 時，Router 會自動導轉到 \`/team/11/user/jim\`，然後產生 \`Team\` component，並在裡面產生 \`User\` component。

### 於 path 設定空字串

\`\`\`ts
[{
  path: 'team/:id',
  component: Team,
  children: [{
    path: '',
    component: AllUsers,
  }, {
    path: 'user/:name',
    component: User,
  }],
}]
\`\`\`

當導覽至 \`/team/11\`，Router 會產生 \`AllUsers\` component 實體。

空路徑也可以設定子項目：

\`\`\`ts
[{
  path: 'team/:id',
  component: Team,
  children: [{
    path: '',
    component: WrapperCmp,
    children: [{
      path: 'user/:name',
      component: User,
    }],
  }],
}]
\`\`\`

當 URL 為 \`/team/11/user/jim\` 時，Router 會產生一個 \`WrapperCmp\` 實體，並在裡面產生 \`User\`。

### 設定 pathMatch

\`\`\`ts
[{
  path: '',
  pathMatch: 'prefix', // default
  redirectTo: 'main',
}, {
  path: 'main',
  component: Main,
}]
\`\`\`

上面這種寫法，即使導覽至 \`/main\`，因為前綴字元符合 \`path: ''\`，Router 還是會執行轉址至 \`main\` 的動作。

因此根路徑 redirect 通常要改成下面這樣：

\`\`\`ts
[{
  path: '',
  pathMatch: 'full',
  redirectTo: 'main',
}, {
  path: 'main',
  component: Main,
}]
\`\`\`

### 延遲載入

\`\`\`ts
[{
  path: 'team/:id',
  component: Team,
  loadChildren: 'team',
}]
\`\`\`

這是 Angular 早期的字串式 lazy loading 範例。現行 Angular 專案通常改用動態 \`import()\` 載入 module 或 route，例如 \`loadChildren: () => import('./team/team.routes').then(m => m.TEAM_ROUTES)\`。

## RouterLink 怎麼建立導航連結？

\`RouterLink\` 是 Angular Router 的宣告式導航指令。開發者可以把 \`routerLink\` 放在 \`<a>\` 元素上，讓連結切換前端路由，而不是觸發整頁重新載入。

\`routerLink\` 要填的值需與 \`Routes\` 裡設定的 \`path\` 對應。這邊有 \`RouterLink\` 的詳細說明：Angular 官方 RouterLink API（Angular Docs，2026 年存取）。

![Angular RouterLink API 文件截圖](/images/tech/angular-router-basics-routerlink-api.webp)

傳入 \`queryParams\` 與 \`fragment\` 的範例如下：

\`\`\`html
<a [routerLink]="['/user/bob']" [queryParams]="{debug: true}" fragment="education">
  link to user component
</a>
\`\`\`

這會產生帶有 fragment 與 query parameter 的連結，例如 \`/user/bob?debug=true#education\`。我當時的筆記範例中的順序寫成 \`/user/bob#education?debug=true\`，但瀏覽器 URL 的標準順序通常是 query string 在前、fragment 在後。

如果設定 \`queryParams\`，可以決定使用者原本從網址列帶入 GET 參數時要如何處理：

| 選項 | 說明 |
|---|---|
| \`merge\` | 將新的 \`queryParams\` 合併到目前的 query parameters |
| \`preserve\` | 保留目前的 query parameters |
| \`default\` 或 \`''\` | 只使用此次指定的 \`queryParams\` |

使用範例：

\`\`\`html
<a [routerLink]="['/user/bob']" [queryParams]="{debug: true}" queryParamsHandling="merge">
  link to user component
</a>
\`\`\`

Angular 4 以前曾使用 \`preserveQueryParams\`，後來改為 \`queryParamsHandling\`。維護舊專案時，如果看到 \`preserveQueryParams\`，建議改成現行寫法。

## RouterLinkActive 怎麼標示目前頁面？

\`RouterLinkActive\` 會在目前 URL 與連結相符時，把指定 CSS class 加到元素上。這個指令常用來標示目前選單、目前分頁或目前所在導覽項目。

\`RouterLinkActive\` 的詳細說明可看 Angular 官方 RouterLinkActive API（Angular Docs，2026 年存取）。

![Angular RouterLinkActive API 文件截圖](/images/tech/angular-router-basics-routerlinkactive-api.webp)

可以傳入 \`exact: true\`，設定是否需要 URL 完全符合才顯示該 class：

\`\`\`html
<a
  routerLink="/user/bob"
  routerLinkActive="active-link"
  [routerLinkActiveOptions]="{ exact: true }"
>
  Bob
</a>
\`\`\`

如果希望連結符合時能顯示額外文字，可以把 \`RouterLinkActive\` 存入 template variable：

\`\`\`html
<a routerLink="/user/bob" routerLinkActive #rla="routerLinkActive">
  Bob {{ rla.isActive ? '(already open)' : '' }}
</a>
\`\`\`

現行 Angular 也支援 \`ariaCurrentWhenActive\`，可在 active link 上加上 \`aria-current\`，讓輔助工具更容易辨識目前頁面。

## ActivatedRoute 可以取得哪些路由狀態？

\`ActivatedRoute\` 是目前 route 的狀態物件。Angular Router 完成導航生命週期後，開發者可以透過 \`ActivatedRoute\` 取得 URL 片段、route data、參數、query parameters、fragment 與父子路由關係。

在每個 Router 完成生命週期後，Router 會產生當前導航頁面的 \`ActivatedRoute\` 及 \`RouterState\`。下面是一個舊版 RxJS 寫法範例：

\`\`\`ts
@Component({ templateUrl: 'template.html' })
class MyComponent {
  constructor(router: Router) {
    const state: RouterState = router.routerState;
    const root: ActivatedRoute = state.root;
    const child = root.firstChild;
    const id: Observable<string> = child.params.map(p => p.id);
    // ...
  }
}
\`\`\`

維護新版 Angular 專案時，建議優先使用 \`paramMap\` 搭配 RxJS \`pipe()\`：

\`\`\`ts
@Component({ templateUrl: 'template.html' })
class MyComponent {
  constructor(private route: ActivatedRoute) {
    const id$ = this.route.paramMap.pipe(
      map(params => params.get('id'))
    );
  }
}
\`\`\`

\`ActivatedRoute\` 常用資訊如下：

| 屬性 | 描述 |
|---|---|
| \`url\` | 在 router 裡設定的 path 值，型別為 Observable |
| \`data\` | route 裡設定的 data，也可能包含 resolve guard 回傳的值 |
| \`paramMap\` | route 必要參數與可選參數的列表，可取代舊版 \`params\` |
| \`queryParamMap\` | 所有 route 可取得的 query parameters，可取代舊版 \`queryParams\` |
| \`fragment\` | 所有 route 可取得的 HTML 錨點 |
| \`outlet\` | 顯示這個 route 的 RouterOutlet 名稱 |
| \`routeConfig\` | 包含當時的 path 的 route configuration |
| \`parent\` | 目前頁面在 Router 設定中的父層 \`ActivatedRoute\` |
| \`firstChild\` | 目前頁面下面第一個子 route 的 \`ActivatedRoute\` |
| \`children\` | 目前路徑下的所有子 route |

## Router events 可以監聽哪些導航狀態？

Router events 可用來監聽 Angular Router 的導航生命週期。常見用途包含顯示 loading、記錄頁面瀏覽、追蹤導頁錯誤，或在導航完成後執行畫面狀態更新。

可以藉由 \`Router\` 物件監聽所有 Router 相關事件：

\`\`\`ts
constructor(private router: Router) {
  router.events.subscribe((event: Event) => {
    if (event instanceof NavigationStart) {
      // Show loading indicator
    }

    if (event instanceof NavigationEnd) {
      // Hide loading indicator
    }
  });
}
\`\`\`

常見 Router event 如下：

| Router Event | Description |
|---|---|
| \`NavigationStart\` | 導航開始時觸發 |
| \`RoutesRecognized\` | Router 正在解析 URL 及 Routes 時觸發 |
| \`RouteConfigLoadStart\` | lazy loaded router 配置載入之前觸發 |
| \`RouteConfigLoadEnd\` | lazy loaded router 載入後觸發 |
| \`NavigationEnd\` | 導航成功完成後觸發 |
| \`NavigationCancel\` | 導航取消時觸發 |
| \`NavigationError\` | 導航因意外錯誤失敗時觸發 |

## Angular Router 基礎設定檢查表

Angular Router 基礎設定可以用六個項目檢查：\`base href\`、根路由設定、outlet、導覽連結、active 狀態與伺服器 fallback。這份檢查表適合用在新專案與舊專案除錯。

| 檢查項目 | 為什麼重要 |
|---|---|
| \`index.html\` 有正確 \`base href\` | 讓相對路徑與 History API 導航能正確解析 |
| 根層只註冊一次 Router | 避免重複建立 Router service 或路由行為混亂 |
| 每個主要版面有 \`RouterOutlet\` | Router 需要 outlet 才能顯示目前 URL 對應的 component |
| 導覽使用 \`routerLink\` | 避免 SPA 導航變成整頁重新載入 |
| 目前頁面使用 \`routerLinkActive\` | 讓使用者知道目前所在頁面 |
| 伺服器將深層 URL fallback 到 \`index.html\` | 避免重新整理 \`/heroes/1\` 這類 URL 時出現 404 |

資訊增益：我在維護舊版 Angular 專案時，會先檢查「能不能直接重新整理深層 URL」和「萬用路由是否放最後」。這兩個問題最常讓 Router 看起來像壞掉，但根因其實不是 component，而是部署 fallback 或 route order。

## 常見問題

### Angular Router 是什麼？
Angular Router 是 Angular 官方的前端路由套件，用來在單頁應用程式中依照 URL 顯示不同 component。Angular Router 會比對 \`Routes\`，再把符合的 component 顯示到 \`RouterOutlet\`。

### Angular Router 一定要設定 \`<base href="/">\` 嗎？
Angular Router 使用 History API 時需要正確的 \`base href\`。如果應用程式部署在根目錄，通常設定 \`<base href="/">\`；如果部署在子目錄，就要改成對應的子路徑。

### RouterModule.forRoot 和 provideRouter 差在哪？
\`RouterModule.forRoot()\` 是 NgModule 架構常見的根路由註冊方式。\`provideRouter()\` 是 standalone Angular 專案常見的路由註冊方式，兩者目的都是把根路由設定交給 Angular Router。

### RouterOutlet 沒有顯示 component 時要先查什麼？
先確認 template 裡有放 \`<router-outlet>\`，再確認目前 URL 是否命中 \`Routes\` 裡的某條規則。也要檢查萬用路由 \`**\` 是否過早放在具體路由前面。

### routerLink 和 href 有什麼不同？
\`routerLink\` 會交給 Angular Router 在前端切換畫面，不會觸發整頁重新載入。一般 \`href\` 會讓瀏覽器重新向伺服器請求頁面，比較不適合 SPA 內部導航。

### RouterLinkActive 可以只在完全符合 URL 時生效嗎？
可以。把 \`[routerLinkActiveOptions]="{ exact: true }"\` 加到連結上，就能要求目前 URL 與 \`routerLink\` 完全符合時才套用 active class。

### ActivatedRoute 的 params 和 paramMap 應該用哪個？
維護新版 Angular 專案時，建議優先使用 \`paramMap\`。\`paramMap\` 比舊版 \`params\` 更清楚地處理必要參數與可選參數，也與官方文件目前的方向一致。

### Router events 適合拿來做什麼？
Router events 適合用來處理 loading 狀態、頁面瀏覽追蹤與導航錯誤記錄。例如 \`NavigationStart\` 可以顯示 loading，\`NavigationEnd\` 可以關閉 loading 或送出 page view。

## 參考資料

- Angular Docs：[Angular Routing](https://angular.dev/guide/routing)
- Angular Docs：[Show routes with outlets](https://angular.dev/guide/routing/show-routes-with-outlets)
- Angular Docs：[Navigate to routes](https://angular.dev/guide/routing/navigate-to-routes)
- Angular API：[RouterLink](https://angular.dev/api/router/RouterLink)
- Angular API：[RouterLinkActive](https://angular.dev/api/router/RouterLinkActive)
- Angular Docs：[Customizing route behavior](https://angular.dev/guide/routing/customizing-route-behavior)
- MDN Web Docs：[History: pushState() method](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState)

## 延伸閱讀

- [Angular Routing 切換頁面教學：AppRoutingModule、Routes 與 routerLink](/post/angular-routing-page-switching-tutorial)：同樣聚焦 Angular、Router，可接著比較不同情境的做法。
- [Angular Router 進階教學：RouterModule、子路由、參數與 CanActivate](/post/angular-router-advanced-guide)：同樣聚焦 Angular、Router，可接著比較不同情境的做法。
- [建立一個 Angular 5 的專案](/post/angular-cli-new-project-setup)：同樣聚焦 Angular，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2026-08-28。我當時的筆記發布於 2018-01-09，本文保留 Angular Router 基礎範例與當時的程式碼脈絡，並補上現行站內格式、GEO 結構、FAQ、圖片路徑與官方參考資料。
`;export{e as default};