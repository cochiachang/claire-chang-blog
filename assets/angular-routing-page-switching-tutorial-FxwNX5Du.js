var e=`---
title: Angular Routing 切換頁面教學：AppRoutingModule、Routes 與 routerLink
description: 這篇 Angular Routing 教學整理新手建立前端路由的完整流程，從新增 AppRoutingModule、設定 Routes 與 base href，到使用 RouterOutlet 顯示頁面、用 routerLink 在 Angular component 之間切換畫面。
date: 2017-12-25
category: 前端開發
tags: [Angular, Routing, Router, 前端路由, Angular 5]
readingTime: 9 分鐘
image: /images/tech/hero_angular-routing-page-switching-tutorial.webp
imageAlt: Angular Routing 流程圖，說明 URL 如何對應到頁面狀態與畫面切換
---


# Angular Routing 切換頁面教學：AppRoutingModule、Routes 與 routerLink

Angular Routing 用來讓 Angular 單頁應用程式（Single Page Application，SPA）依照網址切換畫面。新手要完成最基本的頁面切換，通常需要建立 \`AppRoutingModule\`、設定 \`Routes\`、在畫面放入 \`<router-outlet>\`，再用 \`routerLink\` 建立導覽連結。

這篇保留 Angular 5 時期 Tour of Heroes 範例的學習脈絡，重點放在「怎麼從沒有路由的專案，做到可以依 URL 顯示不同 component」。如果是在維護新版 Angular 專案，語法可能會改用 standalone route 或 \`provideRouter()\`，但 \`Routes\`、\`RouterOutlet\`、\`routerLink\` 這幾個核心觀念仍然相同。

## Angular Routing 是什麼？

Angular Routing 是用 URL 決定目前畫面內容的前端路由機制。Angular Router 會依照路由設定比對網址，再把符合的 component 顯示到 \`RouterOutlet\` 裡。

Routing 意指路由，也就是由一個 router 決定現在要顯示的頁面是什麼。在套用 Routing 時，通常會有下列實踐流程：

1. 套用轉址設定，讓伺服器不要真的到網址所在的位置讀取檔案，而是改由 Angular Routing 決定現在要顯示什麼畫面。
2. 由 URL 分析要顯示的狀態是什麼。
3. 由狀態取得真正需要的資訊。
4. 從這些資訊組成實體。
5. 套用導覽動作，由目前畫面切換至另一個畫面。

![Angular Routing 由 URL 切換頁面的流程圖](/images/tech/angular-routing-page-switching-tutorial-routing-flow.webp)

Angular Routing 產生的虛擬 URL 並不是真的存在於檔案系統裡，因此正式部署時需要伺服器支援 fallback。否則使用者重新整理 \`/heroes\`、\`/detail/1\` 這類深層網址時，伺服器可能會直接回傳 404 not found。

## AppRoutingModule 要怎麼新增？

\`AppRoutingModule\` 適合放在 \`src/app\`，集中管理根層路由設定。Angular CLI 可以自動建立這個 module，並把 module 註冊到 \`AppModule\` 的 imports 裡。

透過下列 CLI 指令新增 Routing module：

\`\`\`bash
ng generate module app-routing --flat --module=app
\`\`\`

\`--flat\` 的意思是將產出文件放在 \`src/app\` 裡，而不是另外建立一個資料夾。\`--module=app\` 則是告知 Angular CLI，把這個 routing module 註冊到 \`AppModule\` 的 \`imports\`。

新產生的 \`src/app/app-routing.module.ts\` 檔案內容如下：

\`\`\`ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class AppRoutingModule { }
\`\`\`

一般不會在 routing module 裡宣告 component，因此可以刪除 \`@NgModule.declarations\` 與 \`CommonModule\`。通常會使用 \`Routes\` 與 \`RouterModule\` 來實作 Angular Routing，修改後的檔案如下：

\`\`\`ts
import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

@NgModule({
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
\`\`\`

## Routes 要怎麼設定頁面對應？

\`Routes\` 是 Angular Routing 的 URL 對照表。每一筆 route 會描述一個 path 對應哪個 component，或描述空路徑要轉址到哪一個預設頁面。

先設定不同路徑要導向的位置：

\`\`\`ts
import { HeroesComponent } from './heroes/heroes.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'heroes', component: HeroesComponent },
  { path: 'detail/:id', component: HeroDetailComponent }
];
\`\`\`

上面的程式碼代表網址為 \`http://localhost/heroes\` 時，Angular Router 會在 \`<router-outlet>\` 標籤內顯示 \`HeroesComponent\` 的內容。另外也要設定當伺服器剛運行時，也就是 \`http://localhost/\`，預設要顯示哪個頁面。

設定完 router map 後，把 \`routes\` 傳進 \`RouterModule.forRoot()\`，再將整個 Router 功能 export。之後 \`app.module.ts\` 只要 import \`AppRoutingModule\`，就能使用這些路由設定。

\`\`\`ts
import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent }   from './dashboard/dashboard.component';
import { HeroesComponent }      from './heroes/heroes.component';
import { HeroDetailComponent }  from './hero-detail/hero-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'detail/:id', component: HeroDetailComponent },
  { path: 'heroes', component: HeroesComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
\`\`\`

資訊增益：新手設定首頁 redirect 時，最容易漏掉 \`pathMatch: 'full'\`。如果空字串 path 使用預設的 prefix 比對，很多網址都可能被當成符合空路徑，導致畫面一直被重新導向。

## Angular Routing 參數要怎麼讀取？

Angular Routing 參數可以透過 \`ActivatedRoute\` 讀取。像 \`detail/:id\` 這種 path 裡的 \`:id\`，進入 \`HeroDetailComponent\` 後就能用 \`paramMap.get('id')\` 取得。

\`detail/:id\` 裡的 \`:id\` 可以在 \`HeroDetailComponent\` 裡取得，再用這個 id 讀取更詳細的資料：

\`\`\`ts
ngOnInit(): void {
  this.getHero();
}

getHero(): void {
  const id = +this.route.snapshot.paramMap.get('id'); // 用 route.snapshot.paramMap.get 取得 Routing 時傳入的變數
  this.heroService.getHero(id)
    .subscribe(hero => this.hero = hero);
}
\`\`\`

這個範例使用 \`snapshot\`，適合 component 第一次載入時讀取參數。若同一個 component 會在不同參數之間重複切換，例如從 \`/detail/1\` 直接切到 \`/detail/2\`，維護新版 Angular 專案時通常會改成訂閱 \`paramMap\`，才能接住參數變化。

\`Routes\` 介面可傳入的常見參數如下：

\`\`\`ts
interface Route {
  path?: string; // 瀏覽器上方網址列的字串
  pathMatch?: string; // path 比對策略
  matcher?: UrlMatcher; // 網址列過濾器
  component?: Type<any>;
  redirectTo?: string; // 要轉址到哪裡
  outlet?: string;
  canActivate?: any[];
  canActivateChild?: any[];
  canDeactivate?: any[];
  canLoad?: any[];
  data?: Data; // 要傳入元件裡的資料
  resolve?: ResolveData;
  children?: Routes;
  loadChildren?: LoadChildren;
  runGuardsAndResolvers?: RunGuardsAndResolvers;
}
\`\`\`

不同 \`path\` 可以代表不同資料狀態，也可以透過參數、子路由、guard 或 lazy loading 組出更完整的 Angular Routing 功能。

## base href 錯誤要怎麼解？

\`base href\` 會告訴瀏覽器 Angular 應用程式的基準路徑。Angular Routing 使用虛擬 URL 時，如果沒有設定 base path，router 可能無法正確解析路徑並出現錯誤。

可以先看 \`APP_BASE_HREF\` 的設定方式。如果沒有設定，Angular 可能會出現類似下面的錯誤訊息：

![Angular Routing 缺少 base href 時的錯誤訊息截圖](/images/tech/angular-routing-page-switching-tutorial-base-href-error.webp)

另一個簡單方式是在 \`index.html\` 增加下面這行，也可以解決這個錯誤：

\`\`\`html
<base href="/">
\`\`\`

如果 Angular 應用程式部署在網域根目錄，\`<base href="/">\` 通常就夠用。如果部署在子目錄，例如 \`/my-app/\`，base href 就需要改成對應的子路徑，否則重新整理、載入資源或前端導頁都可能指向錯誤位置。

## RouterOutlet 要放在哪裡？

\`RouterOutlet\` 是 Angular Router 插入頁面 component 的位置。沒有 \`<router-outlet>\`，Angular Routing 即使成功比對 URL，也沒有地方顯示對應的 component。

在 \`src/app/app.component.html\` 中增加頁面顯示區：

\`\`\`html
<h1>{{title}}</h1>

<router-outlet></router-outlet>
\`\`\`

\`RouterOutlet\` 通常放在主要內容區，導覽列可以放在它上方。Angular Router 會依照目前網址，把符合的 component 顯示到這個 outlet 裡。

## routerLink 要怎麼建立導覽超連結？

\`routerLink\` 是 Angular Routing 的前端導覽指令。使用 \`routerLink\` 切換頁面時，Angular 會在前端更新 URL 與畫面，不會像一般 \`href\` 一樣整頁重新載入。

修改 \`src/app/app.component.html\` 如下：

\`\`\`html
<h1>{{title}}</h1>

<nav>
  <a routerLink="/heroes">Heroes</a>
</nav>

<router-outlet></router-outlet>
\`\`\`

如果要回上一頁，可以透過 \`Location\` service 呼叫 \`back()\`：

\`\`\`ts
goBack(): void {
  this.location.back();
}
\`\`\`

這篇筆記的範例檔案可參考 Angular Tour of Heroes 的 live example 與 download example。維護舊版 Angular 5 專案時，這些範例仍適合理解基本概念；建立新專案時，建議再對照現行 Angular Router 文件確認最新寫法。

## Angular Routing 新手設定檢查表

Angular Routing 新手除錯可以先檢查六個位置：routing module、Routes、RouterModule.forRoot、RouterOutlet、routerLink 與 base href。多數「頁面沒有切換」問題都會落在這幾個設定裡。

| 檢查項目 | 要確認什麼 |
| --- | --- |
| \`AppRoutingModule\` | 是否已建立並被 \`AppModule\` import |
| \`Routes\` | 是否有設定首頁 redirect、列表頁與詳細頁 path |
| \`RouterModule.forRoot(routes)\` | 根層 routing 是否正確註冊 |
| \`<router-outlet>\` | template 是否提供 component 顯示位置 |
| \`routerLink\` | 導覽連結是否對應到 \`Routes\` 裡的 path |
| \`<base href="/">\` | \`index.html\` 是否設定正確 base path |

我自己整理 Angular Routing 時，會先用這張表由外到內查：先看 URL 能不能被伺服器交回 Angular，再看 route 是否命中，最後才查 component 裡的資料讀取。這樣比較不會一開始就把問題都歸到 component 身上。

## 常見問題

### Angular Routing 是什麼？

Angular Routing 是 Angular 單頁應用程式用 URL 切換畫面的機制。Angular Router 會比對 \`Routes\` 設定，再把符合的 component 顯示到 \`RouterOutlet\`。

### AppRoutingModule 一定要另外建立嗎？

\`AppRoutingModule\` 不是語法上的硬性要求，但把 routing 拆到獨立 module 會比較容易維護。Angular 5 的 NgModule 專案常用這個做法集中管理根層 route。

### \`RouterModule.forRoot(routes)\` 是做什麼的？

\`RouterModule.forRoot(routes)\` 會註冊根層 Angular Router 設定，讓整個應用程式知道 URL 與 component 的對應關係。功能模組若要加自己的路由，通常會使用 \`RouterModule.forChild()\`。

### 為什麼重新整理 Angular 路由頁面會出現 404？

Angular Routing 的 URL 是前端產生的虛擬路徑，伺服器檔案系統裡不一定真的有那個頁面。部署時需要設定 fallback 到 \`index.html\`，讓 Angular Router 接手判斷要顯示哪個 component。

### \`routerLink\` 和 \`href\` 有什麼不同？

\`routerLink\` 會交給 Angular Router 在前端切換頁面，不會觸發整頁重新載入。\`href\` 則會讓瀏覽器重新向伺服器請求頁面，比較不適合 SPA 內部頁面切換。

### Angular Routing 參數可以怎麼取得？

Angular Routing 參數可以透過 \`ActivatedRoute\` 取得。簡單情境可用 \`this.route.snapshot.paramMap.get('id')\`，如果同一個 component 會在不同參數間切換，建議訂閱 \`paramMap\`。

## 參考資料

- Angular Docs：[Routing](https://angular.dev/guide/routing)
- Angular API：[Route](https://angular.dev/api/router/Route)
- Angular API：[APP_BASE_HREF](https://angular.dev/api/common/APP_BASE_HREF)
- Angular Docs：[Tour of Heroes: Routing](https://angular.io/tutorial/toh-pt5)
- SlideShare：[使用 Angular 2 Router 快速建構 SPA 網站](https://www.slideshare.net/WillHuangTW/build-spa-website-with-angular-2-router)
- John Wu's Blog：[ASP.NET Core + Angular 4 教學 - Routing](https://blog.johnwu.cc/article/asp-net-core-angular-4-%E6%95%99%E5%AD%B8-routing.html)

## 延伸閱讀

- [Angular Router 基礎教學：Routes、RouterLink、RouterOutlet 與路由事件](/post/angular-router-basics)：同樣聚焦 Angular、Router，可接著比較不同情境的做法。
- [Angular Router 進階教學：RouterModule、子路由、參數與 CanActivate](/post/angular-router-advanced-guide)：同樣聚焦 Angular、Router，可接著比較不同情境的做法。
- [建立一個 Angular 5 的專案](/post/angular-cli-new-project-setup)：同樣聚焦 Angular，可接著比較不同情境的做法。

## 最後更新

本文整理於 2026-08-28；最初發布於 2017-12-25。內容保留 Angular 5 新手教程筆記脈絡，並補上 GEO 結構、站內圖片路徑、FAQ 與延伸閱讀。
`;export{e as default};