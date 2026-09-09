var e=`---
title: Angular NgModule 完整解析：模組結構、依賴注入與 forRoot 用法
description: 說明 Angular NgModule 的 imports/providers/declarations/exports、CLI 產生元件、Service Provider 層級與 ModuleWithProviders。
date: 2018-01-06
category: 前端開發
tags: [Angular, NgModule, 依賴注入, 前端架構]
readingTime: 10 分鐘
image: /images/tech/hero_angular-ngmodules-explained.webp
imageAlt: 藍色模組化建築外牆，象徵 Angular 應用程式由多個功能模組組合而成
---
# Angular NgModule 完整解析：模組結構、依賴注入與 forRoot 用法

Angular 裡的 FormsModule、HttpClientModule、RouterModule，本質上都是 NgModule。NgModule 把一組功能相關的 component、directive、pipe 包在一起，讓其他地方可以直接 import 使用——Material Design、Ionic 這些第三方套件也是用同一套機制對外提供功能。這篇整理 NgModule 的 metadata 結構、bootstrap 流程、CLI 產生元件的方式，以及 service provider 該放在哪一層。

## NgModule 的 metadata 有哪些欄位？

一個 NgModule 用 \`@NgModule\` 裝饰器設定，最常見的就是根模組 \`app.module.ts\`：

\`\`\`ts
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  imports:      [ BrowserModule ],
  providers:    [ Logger ],
  declarations: [ AppComponent ],
  exports:      [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
\`\`\`

五個 metadata 各自負責不同的事：

| 欄位 | 作用 |
| --- | --- |
| \`imports\` | 這個模組需要用到的其他 Angular 或第三方模組（如 FormsModule、HttpClientModule） |
| \`providers\` | 提供給這個模組使用的 service，宣告後底下的元件都能直接注入使用 |
| \`declarations\` | 這個模組內部的 component、directive、pipe 清單 |
| \`exports\` | 決定要把哪些內部成員公開給外部模組使用 |
| \`bootstrap\` | 只有根模組需要設定，指定啟動時要載入的元件 |

## Angular 怎麼啟動根模組？

每個專案都有一個根模組（root module），啟動流程在 \`main.ts\` 裡呼叫 \`bootstrapModule\`：

\`\`\`ts
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
\`\`\`

Bootstrap 動作會建立執行環境，並把 \`app.module.ts\` 裡 \`bootstrap\` 陣列中設定的元件取出來，透過該元件的 selector 顯示到 \`index.html\`：

\`\`\`html
<body>
  <app-root></app-root>
</body>
\`\`\`

## 如何用 CLI 產生自製的 Directive？

自己寫一個 highlight directive（\`src/app/highlight.directive.ts\`）：

\`\`\`ts
import { Directive, ElementRef } from '@angular/core';

// 將這個區塊的背景顏色改為金色
@Directive({ selector: '[highlight]' })
export class HighlightDirective {
  constructor(el: ElementRef) {
    el.nativeElement.style.backgroundColor = 'gold';
  }
}
\`\`\`

要讓整個 APP 都能用這個 directive，需要在 \`app.module.ts\` 的 \`declarations\` 加上它：

\`\`\`ts
declarations: [
  AppComponent,
  HighlightDirective, // 加上去之後，<h1 highlight>{{title}}</h1> 就能生效
],
\`\`\`

手動改 \`declarations\` 容易漏掉，用 Angular CLI 產生會自動幫你補上這一步：

\`\`\`
ng generate directive highlight
\`\`\`

CLI 建立 component、directive、pipe 時都會自動把它宣告進對應模組的 \`declarations\`，\`ng generate\` 支援的常用參數包括 \`--dry-run\`（先跑一次不寫入檔案）、\`--app\`（指定要用的 app）、\`--module\`（指定要掛到哪個模組）。

## Service Provider 該放在 NgModule 還是 Component？

Service 可以注入到 \`@NgModule.providers\` 或 \`@Component.providers\`。如果同一個 class 在兩邊都各自設定一次，Angular 會產生兩個不同的實體，而該元件內會優先使用自己 providers 裡設定的服務。

判斷原則很單純：這個服務如果被很多元件共用，就放在根模組的 \`providers\`；如果只有一個元件在用，就放在該 Component 的 \`providers\`。

用 CLI 產生一個 user service 並掛到 app 模組：

\`\`\`
ng generate service user --module=app
\`\`\`

\`app.module.ts\` 的 \`providers\` 會多出一筆：

\`\`\`ts
providers: [ UserService ],
\`\`\`

元件裡只要在 constructor 宣告對應型別的參數，就能直接拿到這個服務：

\`\`\`ts
constructor(userService: UserService) {
  this.user = userService.userName;
}
\`\`\`

所有在 \`providers\` 裡宣告的物件實體都會存進 Angular 的服務列表（injector），因此不同元件注入的是同一個實體——這也是為什麼把 service 放對層級很重要，放錯層會拿到不同的實體，資料互不同步。

## NgModule 的 imports 和 re-export 怎麼運作？

要使用 \`*ngIf\` 這類指令，得先在 \`app.module.ts\` 匯入 \`BrowserModule\`：

\`\`\`ts
imports: [ BrowserModule ],
\`\`\`

\`\`\`html
<p *ngIf="user">
  <i>Welcome, {{user}}</i>
</p>
\`\`\`

有趣的是，\`*ngIf\` 其實定義在 [CommonModule](https://angular.io/api/common/CommonModule) 裡，不是 \`BrowserModule\` 本身的功能。因為 \`BrowserModule\` 在自己的 \`exports\` 裡把 import 進來的 \`CommonModule\` 再次匯出，所以只要 import \`BrowserModule\`，\`CommonModule\` 匯出的功能也一併可用——這就是 re-export：一個模組把它依賴的另一個模組的能力，轉手公開給使用它的人。

## 什麼時候該用 ModuleWithProviders？

如果希望某個子模組能在所有其他元件初始化之前優先設定好內部的值（Angular 的 Routing 就是這樣用的），可以把模組包成 \`ModuleWithProviders\`，再用 \`import\` 的方式接入 \`app.module.ts\`。

假設有這個 service：

\`\`\`ts
import { Injectable } from '@angular/core';

@Injectable()
export class UserService {
  userName = 'Sherlock Holmes';
}
\`\`\`

想在使用前先允許外部覆寫 \`userName\`，先讓 constructor 接受一個可選的設定物件：

\`\`\`ts
constructor(@Optional() config: UserServiceConfig) {
  if (config) { this._userName = config.userName; }
}
\`\`\`

接著在 \`CoreModule\` 加上 \`forRoot\` 靜態方法，它接受設定值，回傳一個 \`ModuleWithProviders\` 物件：

\`\`\`ts
static forRoot(config: UserServiceConfig): ModuleWithProviders {
  return {
    ngModule: CoreModule,
    providers: [
      { provide: UserServiceConfig, useValue: config }
    ]
  };
}
\`\`\`

最後在根模組的 \`imports\` 呼叫它：

\`\`\`ts
imports: [
  BrowserModule,
  CoreModule.forRoot({ userName: 'Miss Marple' }),
  AppRoutingModule
],
\`\`\`

這樣一來 \`userName\` 會是 "Miss Marple"，而不是 service 裡原本寫死的 "Sherlock Holmes"。

\`forRoot\` 只能在根模組 \`AppModule\` 呼叫一次。如果在其他模組（尤其是延遲載入模組）裡呼叫，會違反設計意圖並導致執行期錯誤。要防止有人不小心重複 import \`CoreModule\`，可以在 constructor 檢查父模組是否已存在：

\`\`\`ts
constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
  if (parentModule) {
    throw new Error(
      'CoreModule is already loaded. Import it in the AppModule only');
  }
}
\`\`\`

## 常見問題

### NgModule 的 declarations 和 exports 差在哪？

\`declarations\` 宣告的是這個模組內部擁有哪些 component、directive、pipe；\`exports\` 才是決定這些成員裡有哪些要公開給匯入這個模組的其他模組使用。一個成員可以只出現在 \`declarations\` 而不出現在 \`exports\`，代表它是模組內部私有、不對外開放。

### 為什麼同一個 service 在 NgModule 和 Component 都設定會變成兩個實體？

Angular 的依賴注入是分層的，每一層 injector 都可能建立自己的服務實體。當 Component 的 \`providers\` 裡也宣告了同一個 class，該元件會優先用自己這層建立的實體，等於在它和其他共用根模組服務的元件之間產生了兩份互不相干的資料。

### forRoot 為什麼不能在 lazy-loaded 模組裡呼叫？

\`forRoot\` 的設計目的是在整個應用啟動時只設定一次全域 provider。延遲載入模組會在執行期才建立自己的 injector，如果在裡面呼叫 \`forRoot\`，等於又建立了一組新的 provider 實體，容易造成狀態不一致或執行期錯誤，因此官方慣例是只在根模組 \`AppModule\` 呼叫。

## 參考資料
Angular 官方文件，NgModules Overview，說明 \`declarations\`、\`imports\`、\`exports\`、\`providers\` 等 metadata 欄位與 bootstrap 流程，存取日期：2026-08-27。[https://angular.dev/guide/ngmodules/overview](https://angular.dev/guide/ngmodules/overview)

## 延伸閱讀

- [Angular Service 依賴注入教學：providers、InjectionToken 與分層注入](/post/angular-service-dependency-injection)：同樣聚焦 Angular、依賴注入，可接著比較不同情境的做法。
- [Angular Service 建立教學：用 CLI 產生 HeroService 並回傳 Observable](/post/angular-create-service-tutorial)：同樣聚焦 Angular，可接著比較不同情境的做法。
- [建立一個 Angular 5 的專案](/post/angular-cli-new-project-setup)：同樣聚焦 Angular，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2026-08-28。原文發布於 2018-01-06，內容保留原始 NgModule 架構說明與程式碼範例，並依現行站內格式重新整理段落與 FAQ。

`;export{e as default};