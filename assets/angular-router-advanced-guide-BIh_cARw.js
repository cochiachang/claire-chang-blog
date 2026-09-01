var e=`---
title: Angular Router 進階教學：RouterModule、子路由、參數與 CanActivate
description: 整理 Angular Router 進階用法，包含 RouterModule 拆分、forRoot 與 forChild、路由順序、程式導頁、參數讀取、路由動畫、子路由與 CanActivate。
date: 2018-01-10
category: 前端開發
tags: [Angular, Router, 前端路由, CanActivate]
readingTime: 9 分鐘
image: /images/tech/hero_angular-ngmodules-explained.webp
imageAlt: 模組化建築外牆，象徵 Angular Router 由根路由與功能模組路由組合而成
---
# Angular Router 進階教學：RouterModule、子路由、參數與 CanActivate

Angular Router 進階用法的重點，是把根路由、功能模組路由、參數讀取、導頁邏輯與網址權限分層管理。當 Angular 應用程式路由變多，建議用 \`AppRoutingModule\` 管理全站入口，用 feature routing module 管理各功能自己的 URL，並注意萬用路由 \`**\` 的載入順序。

## Angular Router Module 應該怎麼拆？

Angular Router Module 適合在路由設定開始變複雜時拆出來。根路由使用 \`RouterModule.forRoot()\`，功能模組路由使用 \`RouterModule.forChild()\`，兩者合併後形成完整路由表。

首先，建立一個路由模組 \`app-routing.module.ts\`：

\`\`\`ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CrisisListComponent } from './crisis-list.component';
import { HeroListComponent } from './hero-list.component';
import { PageNotFoundComponent } from './not-found.component';

const appRoutes: Routes = [
  { path: 'crisis-center', component: CrisisListComponent },
  { path: 'heroes', component: HeroListComponent },
  { path: '', redirectTo: '/heroes', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // debugging purposes only
    ),
  ],
  exports: [
    RouterModule,
  ],
})
export class AppRoutingModule {}
\`\`\`

接著，更新 \`app.module.ts\`：

\`\`\`ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { CrisisListComponent } from './crisis-list.component';
import { HeroListComponent } from './hero-list.component';
import { PageNotFoundComponent } from './not-found.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
  ],
  declarations: [
    AppComponent,
    HeroListComponent,
    CrisisListComponent,
    PageNotFoundComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
\`\`\`

\`enableTracing: true\` 只適合除錯，因為 Angular Router 會把每個 navigation event 印到 console。正式環境通常會關掉這個設定（Angular Docs，2026 年存取）。

## 多層 Router Module 怎麼設計？

多層 Router Module 的核心做法，是讓每個功能模組維護自己的路由。這樣 \`HeroesModule\` 可以同時管理英雄列表與英雄詳細頁，不必把所有 URL 都塞進根路由。

先建立功能模組 \`heroes.module.ts\`：

\`\`\`ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HeroListComponent } from './hero-list.component';
import { HeroDetailComponent } from './hero-detail.component';

import { HeroService } from './hero.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [
    HeroListComponent,
    HeroDetailComponent,
  ],
  providers: [HeroService],
})
export class HeroesModule {}
\`\`\`

再新增 \`heroes-routing.module.ts\`：

\`\`\`ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HeroListComponent } from './hero-list.component';
import { HeroDetailComponent } from './hero-detail.component';

const heroesRoutes: Routes = [
  { path: 'heroes', component: HeroListComponent },
  { path: 'hero/:id', component: HeroDetailComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(heroesRoutes),
  ],
  exports: [
    RouterModule,
  ],
})
export class HeroRoutingModule {}
\`\`\`

建議把 routing module 放在伴隨的 feature module 旁邊。\`heroes-routing.module.ts\` 與 \`heroes.module.ts\` 都放在 \`src/app/heroes\`，之後路由變多時比較容易維護。

最後在 \`heroes.module.ts\` 匯入 \`HeroRoutingModule\`：

\`\`\`ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HeroListComponent } from './hero-list.component';
import { HeroDetailComponent } from './hero-detail.component';
import { HeroService } from './hero.service';
import { HeroRoutingModule } from './heroes-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HeroRoutingModule,
  ],
  declarations: [
    HeroListComponent,
    HeroDetailComponent,
  ],
  providers: [HeroService],
})
export class HeroesModule {}
\`\`\`

## 路由設定重複時要怎麼整理？

Angular Router 會合併根模組與功能模組匯入的路由設定。若 \`path: 'heroes'\` 已經移到 \`HeroesRoutingModule\`，根路由就應移除同一條設定，避免同一個 URL 分散在兩個地方。

整理後的 \`app-routing.module.ts\` 可以留下全站層級路由：

\`\`\`ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CrisisListComponent } from './crisis-list.component';
import { PageNotFoundComponent } from './not-found.component';

const appRoutes: Routes = [
  { path: 'crisis-center', component: CrisisListComponent },
  { path: '', redirectTo: '/heroes', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // debugging purposes only
    ),
  ],
  exports: [
    RouterModule,
  ],
})
export class AppRoutingModule {}
\`\`\`

\`app.module.ts\` 則先匯入 \`HeroesModule\`，再匯入 \`AppRoutingModule\`：

\`\`\`ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HeroesModule } from './heroes/heroes.module';

import { CrisisListComponent } from './crisis-list.component';
import { PageNotFoundComponent } from './not-found.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HeroesModule,
    AppRoutingModule,
  ],
  declarations: [
    AppComponent,
    CrisisListComponent,
    PageNotFoundComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
\`\`\`

這裡的資訊增益是實務判斷：把 feature route 放在 feature module，根路由只保留首頁 redirect、跨功能頁面與 \`PageNotFoundComponent\`。路由責任邊界清楚後，日後新增 lazy loading 或權限保護會比較好改。

## Angular Router 的載入順序為什麼重要？

Angular Router 會依照路由表順序比對 URL，萬用路由 \`**\` 必須放在最後。若 \`AppRoutingModule\` 先被載入，而且 \`**\` 早於 feature route，合法的功能頁面也可能被導到 \`PageNotFoundComponent\`。

當所有路由都在 \`AppRoutingModule\` 時，\`path: '**'\` 要放在 \`/heroes\` 後面：

\`\`\`ts
{ path: '**', component: PageNotFoundComponent }
\`\`\`

如果 routing 分散在兩個模組內，也要先載入 \`HeroesModule\`，再載入 \`AppRoutingModule\`。這樣 Angular Router 會先看見 \`HeroesModule\` 裡的路由設定，不會讓 \`AppRoutingModule\` 的萬用路由先攔截成功。

| 情境 | 建議順序 | 原因 |
| --- | --- | --- |
| 根路由含 \`**\`，功能模組含 \`/heroes\` | \`HeroesModule\` 在前，\`AppRoutingModule\` 在後 | 先註冊功能路由，再讓 \`**\` 處理找不到的頁面 |
| 所有路由都在同一個陣列 | 具體路由在前，\`**\` 在最後 | Angular Router 依序比對，先命中的路由會被使用 |
| 路由需要除錯 | 暫時開 \`enableTracing\` | 可觀察 navigation events，但不適合長期留在正式環境 |

## 如何在程式裡操作 Angular Router 導頁？

Angular Router 可以用 \`router.navigate()\` 在 TypeScript 程式內導頁。陣列裡的每個項目會組成 URL 片段，也能傳入 route parameter 或 matrix parameter。

導到英雄列表：

\`\`\`ts
gotoHeroes() {
  this.router.navigate(['/heroes']);
}
\`\`\`

帶一個 route parameter：

\`\`\`ts
gotoHeroes(hero: Hero) {
  this.router.navigate(['/hero', hero.id]);
}
\`\`\`

帶 matrix parameter：

\`\`\`ts
gotoHeroes(hero: Hero) {
  this.router.navigate(['/hero', { id: hero.id, foo: 'foo' }]);
}
\`\`\`

點擊後可能出現這樣的連結：

\`\`\`console
localhost:3000/heroes;id=15;foo=foo
\`\`\`

Matrix URL 使用分號 \`;\` 分隔參數，不是查詢字串常見的 \`&\`。如果資料代表某個路由片段的狀態，matrix parameter 會比 query string 更貼近 Angular Router 的語意。

## 如何取得 Angular Router 的參數？

Angular Router 參數通常透過 \`ActivatedRoute\` 讀取。\`paramMap\` 是 Observable，因此同一個元件被重用時，參數變動仍可被接住，不必只依賴 \`ngOnInit\` 的第一次執行。

我當時的筆記範例使用 \`paramMap\` 取得 \`id\` 後讀取資料：

\`\`\`ts
export class HeroListComponent implements OnInit {
  heroes$: Observable<Hero[]>;

  private selectedId: number;

  constructor(
    private service: HeroService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.heroes$ = this.route.paramMap
      .switchMap((params: ParamMap) => {
        // (+) before \`params.get()\` turns the string into a number
        this.selectedId = +params.get('id');
        return this.service.getHeroes();
      });
  }
}
\`\`\`

若使用較新的 RxJS 寫法，通常會把 \`switchMap\` 放進 \`pipe()\`：

\`\`\`ts
import { switchMap } from 'rxjs/operators';

ngOnInit() {
  this.heroes$ = this.route.paramMap.pipe(
    switchMap((params: ParamMap) => {
      this.selectedId = Number(params.get('id'));
      return this.service.getHeroes();
    })
  );
}
\`\`\`

## Angular Router 怎麼加入換頁動畫？

Angular Router 換頁動畫需要先載入 \`BrowserAnimationsModule\`，再用 Angular animations 定義 route transition。常見做法是在路由目標 component 上用 \`@HostBinding\` 綁定動畫 trigger。

先在根模組載入動畫模組：

\`\`\`ts
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    BrowserAnimationsModule,
  ],
})
export class AppModule {}
\`\`\`

在根目錄 \`src/app/\` 建立 \`animations.ts\`：

\`\`\`ts
import { animate, AnimationEntryMetadata, state, style, transition, trigger } from '@angular/core';

// Component transition animations
export const slideInDownAnimation: AnimationEntryMetadata =
  trigger('routeAnimation', [
    state('*',
      style({
        opacity: 1,
        transform: 'translateX(0)',
      })
    ),
    transition(':enter', [
      style({
        opacity: 0,
        transform: 'translateX(-100%)',
      }),
      animate('0.2s ease-in'),
    ]),
    transition(':leave', [
      animate('0.5s ease-out', style({
        opacity: 0,
        transform: 'translateY(100%)',
      })),
    ]),
  ]);
\`\`\`

然後在 \`src/app/heroes/hero-detail.component.ts\` 增加動畫綁定：

\`\`\`ts
@HostBinding('@routeAnimation') routeAnimation = true;
@HostBinding('style.display') display = 'block';
@HostBinding('style.position') position = 'absolute';
\`\`\`

## Child routing component 適合解決什麼問題？

Child routing component 適合用來保留父層畫面狀態。Angular Router 預設會重用同一個 component instance，但若導頁流程讓詳細頁被銷毀，再進入下一筆資料時仍會重新建立 component。

原本的 heroes routes 是列表頁與詳細頁並列：

\`\`\`ts
const heroesRoutes: Routes = [
  { path: 'heroes', component: HeroListComponent },
  { path: 'hero/:id', component: HeroDetailComponent },
];
\`\`\`

這種設計下，從 \`HeroDetailComponent\` 回到 \`HeroListComponent\` 時，詳細頁元件會被刪除。下一次選擇不同英雄時，Angular 會重新建立新的 \`HeroDetailComponent\`。

若想保留父層頁面狀態，可以改用子路由：

\`\`\`ts
const crisisCenterRoutes: Routes = [
  {
    path: 'crisis-center',
    component: CrisisCenterComponent,
    children: [
      {
        path: '',
        component: CrisisListComponent,
        children: [
          {
            path: ':id',
            component: CrisisDetailComponent,
          },
          {
            path: '',
            component: CrisisCenterHomeComponent,
          },
        ],
      },
    ],
  },
];
\`\`\`

\`CrisisDetailComponent\` 與 \`CrisisCenterHomeComponent\` 都是 \`CrisisListComponent\` 的子組件，因此使用者瀏覽不同 detail 時，父層列表狀態可以被保留。直到頁面切換離開 \`CrisisCenterComponent\`，Angular Router 才會銷毀這一層元件。

## Angular Router 相對路徑怎麼寫？

Angular Router 的相對路徑用 \`./\` 表示目前位置，用 \`../\` 表示上一層。程式導頁時搭配 \`relativeTo: this.route\`，可以避免在巢狀路由裡硬寫完整絕對路徑。

回到上一層 crises 路由的範例：

\`\`\`ts
// Relative navigation back to the crises
this.router.navigate(['../', { id: crisisId, foo: 'foo' }], { relativeTo: this.route });
\`\`\`

巢狀路由越深，相對路徑越有價值。只要父層 path 調整，使用 \`relativeTo\` 的局部導頁通常不需要全部跟著改。

## CanActivate 如何做網址認證？

Angular Router 的 \`CanActivate\` guard 可以在進入某個 URL 前先做判斷。常見用途是登入檢查、角色權限檢查，或避免未授權使用者進入管理頁。

\`src/app/auth-guard.service.ts\` 範例：

\`\`\`ts
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate() {
    console.log('AuthGuard#canActivate called');
    return true;
  }
}
\`\`\`

\`src/app/admin/admin-routing.module.ts\` 範例：

\`\`\`ts
import { AuthGuard } from '../auth-guard.service';

const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        children: [
          { path: 'crises', component: ManageCrisesComponent },
          { path: 'heroes', component: ManageHeroesComponent },
          { path: '', component: AdminDashboardComponent },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(adminRoutes),
  ],
  exports: [
    RouterModule,
  ],
})
export class AdminRoutingModule {}
\`\`\`

上面的 \`canActivate()\` 回傳 \`true\` 只是教學範例。實務上通常會檢查登入狀態，必要時回傳 \`UrlTree\` 導到登入頁，或回傳 Observable / Promise 等待權限資料完成。

## 常見問題

### Angular Router forRoot 和 forChild 差在哪？
\`RouterModule.forRoot()\` 用在根模組，負責建立全站 Router service 與根路由設定。\`RouterModule.forChild()\` 用在功能模組，只提供該功能自己的路由設定，不應重複建立 Router service。

### Angular Router 的 \`path: ''\` 為什麼要放最後？
\`path: '**'\` 是萬用路由，會吃掉所有尚未匹配的 URL。若萬用路由放太前面，後面的正常路由沒有機會被比對，使用者會被錯誤導到 404 頁。

### Angular Router 可以在程式碼裡導頁嗎？
可以。注入 \`Router\` 後呼叫 \`this.router.navigate(['/heroes'])\`，即可在 TypeScript 程式碼中切換頁面；若要依目前路由導向上一層，可搭配 \`relativeTo: this.route\`。

### Angular Router 怎麼取得 URL 裡的 id？
常見做法是注入 \`ActivatedRoute\`，再訂閱 \`paramMap\` 或 \`params\`。使用 \`paramMap\` 的好處是同一個 component 被重用時，URL 參數變化仍會觸發資料更新。

### Angular Router 的 Matrix URL 是什麼？
Matrix URL 是把參數放在路由片段上的寫法，例如 \`/heroes;id=15;foo=foo\`。這種參數用分號分隔，語意上比較像某段 route 的狀態，不同於整個 URL 共用的 query string。

### Angular Router 可以用來做登入權限嗎？
可以。\`CanActivate\` guard 能在進入路由前判斷使用者是否登入或具備權限；若條件不符合，可以拒絕導航或導向登入頁。

## 參考資料

- Angular Docs：[Routing overview](https://angular.dev/guide/routing)
- Angular API：[Router](https://angular.dev/api/router/Router)
- Angular API：[RouterModule](https://angular.dev/api/router/RouterModule)
- Angular API：[CanActivate](https://angular.dev/api/router/CanActivate)
- Angular Archive：[Routing & Navigation live example](https://angular.io/generated/live-examples/router/eplnkr.html)
- Angular Archive：[Routing & Navigation download example](https://angular.io/generated/zips/router/router.zip)

## 延伸閱讀

- [Angular Router 基礎教學：Routes、RouterLink、RouterOutlet 與路由事件](/post/angular-router-basics)：同樣聚焦 Angular、Router，可接著比較不同情境的做法。
- [Angular Routing 切換頁面教學：AppRoutingModule、Routes 與 routerLink](/post/angular-routing-page-switching-tutorial)：同樣聚焦 Angular、Router，可接著比較不同情境的做法。
- [Angular Service 建立教學：用 CLI 產生 HeroService 並回傳 Observable](/post/angular-create-service-tutorial)：同樣聚焦 Angular，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2026-08-28。我當時的筆記發布於 2018-01-10，本文保留 Angular Router 進階範例與當時的程式碼脈絡，並補上現行站內格式、GEO 結構、FAQ 與官方參考資料。
`;export{e as default};