var e=`---
title: Angular 架構總覽：Component、Template、Metadata、NgModule、Directive 與 Dependency Injection 入門
description: Angular 架構完整介紹：從官網架構圖拆解 Component、Template、Metadata 的關係，說明資料綁定、NgModule 模組化、Directive、Service 與 Dependency Injection 依賴注入的運作方式，幫你建立完整的 Angular 心智模型。
date: 2017-12-27
category: 前端開發
tags: [Angular, TypeScript, frontend, dependency-injection]
readingTime: 15 分鐘
image: /images/tech/hero_angular-architecture-overview.webp
imageAlt: Angular 架構示意，涵蓋元件、模組與依賴注入
---


# Angular 架構總覽：Component、Template、Metadata、NgModule、Directive 與 Dependency Injection 入門

Angular 是一個用來編寫 HTML 應用程式的框架，可以使用 JavaScript 或 TypeScript 開發。這篇文章用官網的架構圖帶你逐塊拆解 Angular 的核心概念：Component、Template、Metadata、NgModule、Directive、Service 與 Dependency Injection，讀完就能建立完整的 Angular 心智模型。

## Angular 的核心架構長什麼樣？

下圖是官網上所繪製的 Angular 架構圖：

![Angular 官網架構圖](/images/articles/angular-architecture-overview-1.webp)

首先先看最中間那一塊，是由 **template、metadata、component** 所構成的，這三個是一個 component 必備的元素。

所謂的元件可以看我之前創建 hero 那篇文章，我們可以用下面指令創一個元件：

\`\`\`bash
ng generate component selectSystem
\`\`\`

創完一個元件後，可以看見下面這些檔案：

![ng generate component 產生的檔案](/images/articles/angular-architecture-overview-2.webp)

## Templates 怎麼與 Component 溝通？

裡面的 \`component.html\` 檔就是 template，它看起來像是一個 HTML 的檔案，可以在裡面用資料綁定與事件綁定與 controller 裡的物件做繫結。

下面是一個 template 的範例：

\`\`\`html
<h2>Hero List</h2>

<p><i>Pick a hero from the list</i></p>
<ul>
  <li *ngFor="let hero of heroes" (click)="selectHero(hero)">
    {{hero.name}}
  </li>
</ul>

<app-hero-detail *ngIf="selectedHero" [hero]="selectedHero"></app-hero-detail>
\`\`\`

可以注意到上面有些地方與一般的 HTML 不相同，例如像是 \`*ngFor\`、\`{{hero.name}}\`、\`(click)="selectHero(hero)"\` 等。這就是架構圖畫面上用來連繫 Component 以及 Template 的兩個箭頭：**property binding** 以及 **event binding**。

例如 click 事件繫結是 \`(click)='functionName()'\`，物件繫結可以用 \`{{data}}\`。透過這樣的繫結可以讓 template 將使用者操作的事件傳給 component，component 也可以將資料的更動即時地反饋到 template 所顯示的資料上。

## Angular 的資料綁定（Data Binding）有哪幾種？

下圖是非常清楚的 binding 類型列表：

![Angular binding 類型列表](/images/articles/angular-architecture-overview-3.webp)

\`\`\`html
<li>{{hero.name}}</li>
<app-hero-detail [hero]="selectedHero"></app-hero-detail>
<li (click)="selectHero(hero)"></li>
\`\`\`

- \`{{hero.name}}\` 為**值繫結**，可以綁定 component 裡的值。
- \`[hero]="selectedHero"\` 為 **property binding**，可以將某個元件裡的變數塞進一個 HTML 元素的屬性裡。
- \`(click)="selectHero(hero)"\` 為 **event binding**，可以呼叫 component 裡的 function。

\`\`\`html
<input [(ngModel)]="hero.name">
\`\`\`

這個則是**雙向數據綁定**：在雙向綁定中，與屬性綁定一樣，數據屬性值將從組件輸入到輸入框中；用戶的更改也會返回到組件，將屬性重置為最新值，就像事件綁定一樣。

![雙向數據綁定示意圖](/images/articles/angular-architecture-overview-4.webp)

數據綁定在模板及其組件之間的通信中起著重要的作用。

![父子組件間的數據綁定](/images/articles/angular-architecture-overview-5.webp)

數據綁定對於父組件和子組件之間的通信也很重要。

## Component 是什麼？

而 \`component.ts\` 檔則是 component 內容，裡面會有一些屬性或方法來供 template 呼叫，下面是一個 Component 的簡單範例：

\`\`\`js
export class HeroListComponent implements OnInit {
  heroes: Hero[];
  selectedHero: Hero;

  constructor(private service: HeroService) { }

  ngOnInit() {
    this.heroes = this.service.getHeroes();
  }

  selectHero(hero: Hero) { this.selectedHero = hero; }
}
\`\`\`

當用戶在應用程序中切換畫面時，Angular 會創建、更新和銷毀組件。你的應用程序可以通過可選的 lifecycle hooks 參與這個生命週期的每個時刻，像 \`ngOnInit()\`。

## Metadata：告訴 Angular 怎麼處理一個 Class

metadata 則是在 \`component.ts\` 裡由 \`@Component\` 開頭的區塊來宣告，裡面會定義這個 Component 要如何在別的元件的 template 裡被引用；\`templateUrl\` 定義自己這個元件要顯示的 html 模版位置，\`styleUrls\` 則是 css 檔案位置。

例如下面這個 metadata 宣告：

\`\`\`typescript
@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
\`\`\`

就可以用下面的方式來顯示這個元件：

\`\`\`html
<app-heroes></app-heroes>
\`\`\`

## NgModule：Angular 的模組化系統

接著來介紹左上方的區塊：

![NgModule 區塊示意](/images/articles/angular-architecture-overview-6.webp)

Angular 應用程序是模組化的，Angular 稱自己為 NgModules 的模組化系統。NgModules 是一個很大的議題，我後面會有另一篇文章專門介紹 ngModules。

一個小的 application 至少會有一個模組，稱為 root module。雖然有些小的專案可能就只有一個模組，但大多大的專案都會有多個模組，稱為 feature modules——一個模組內會是相同工作範疇的一組元件，它們在工作流程或功能上緊密相關，彼此協同運作。

當我們執行了這樣的指令來創建一個新的專案時：

\`\`\`bash
ng new my-app
\`\`\`

可以看到 \`src/app\` 資料夾內有 \`app.module.ts\` 這個檔案，這個檔案就是 Angular 預設的根模組，其內容如下：

\`\`\`typescript
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

一個 NgModule，無論是 root module 還是 feature modules，該 class 裡一定會有 \`@NgModule\` 的宣告區域。在 Angular 裡會有許多 \`@\` 開頭的宣告，這樣的宣告稱為 **decorator**，可以在元件或模組裡設定許多 metadata。關於 ngModule 更多說明可以看 [@NgModule 的說明](https://angular.io/api/core/NgModule)；關於 decorators 更多的說明則可以看[這邊](https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841#.x5c2ndtx0)，這兩項之後我都會有專門的文章來介紹。

### NgModule 最重要的五個屬性

NgModule 是一個用來描述這個模組裡有哪些 component 的 metadata，是一個 decorator function。在 ngModule 裡最重要的屬性有下面這五點：

| 屬性 | 作用 |
| --- | --- |
| \`declarations\` | 屬於這個模組的成員。Angular 有三種成員：components、directives 以及 pipes。 |
| \`exports\` | 將 declarations 宣告的成員公開，讓其他模組引用此模組時可以存取該成員的 public function。 |
| \`imports\` | 需引用的模組，所有在這個模組內的元件要引用的模組都要在此宣告。 |
| \`providers\` | 要引用的 Service 需在此宣告。 |
| \`bootstrap\` | 只有根模組需要設定，在此設定一開始要顯示的 application view。 |

註：上面的範例中，因為有設定 \`bootstrap\` 代表其為一個根組件，而根組件是不需要 exports 出去的，因為不會有任何其他 modules 需要用到它。

而要啟動整個應用程序可以在 \`main.ts\` 中加上這段：

\`\`\`typescript
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule); // 用這個指令來啟動 root modules
\`\`\`

在 js 裡我們透過 \`export\` 一個 class 來供其他 modules 使用，並在其他 js 檔案利用 \`import\` 來將這個 class 引入：

\`\`\`js
export class AppModule { }
\`\`\`

\`\`\`js
import { NgModule }     from '@angular/core';
import { AppComponent } from './app.component';
\`\`\`


## Angular Libraries：內建的 @angular 模組

![Angular libraries 示意](/images/articles/angular-architecture-overview-7.webp)

Angular 內建了許多可供應用的模組，我們稱為 library module。所有的 library module 都以 \`@angular\` 為前綴開頭，可以使用 npm 來安裝管理它們。

例如要使用 Component 功能要引用 \`@angular/core\` 的 Component：

\`\`\`js
import { Component } from '@angular/core';
\`\`\`

或是使用 BrowserModule：

\`\`\`js
import { BrowserModule } from '@angular/platform-browser';
\`\`\`

## Directives：擴展 HTML 的能力

![Directives 示意](/images/articles/angular-architecture-overview-8.webp)

在架構圖中的 template 右邊，可以看到有一個 directive 指向 template。directive 是透過 Angular 使用內建或自訂 directive，用來自己定義 HTML 元素並簡化 DOM 操作的功能，可以讓 template 裡去使用。

一個 directive 會由 \`@Directive\` 來宣告。其實 directive 與 component 的本質是相同的，只是 component 是一個有 template 的 directive，而 directive 沒有。我們可以視 component 為 directive 的擴展，擴展了 template 的功能。不過因為 component 在 Angular 中非常重要，和 directive 有不同的意義，因此會將 component 以及 directive 在架構上分開來。

directives 分為**架構型**和**屬性型**。下面是兩個內建架構型的 directive 範例：

\`\`\`html
<li *ngFor="let hero of heroes"></li>
<app-hero-detail *ngIf="selectedHero"></app-hero-detail>
\`\`\`

- \`*ngFor\` 會讓 Angular 重覆寫許多的 \`<li>\`，將 heroes 裡的資料跑過一圈。
- \`*ngIf\` 則會讓 Angular 只有在 selectedHero 的值為 true 時才會顯示 app-hero-detail 元件。

而屬性型的 directive 則例如像是做雙向繫結的 ngModel，下面的片段程式會將 hero.name 的值塞入 input 的 value 屬性內，並且監聽使用者修改 input 的值的事件，將修改傳回至 hero.name：

\`\`\`html
<input [(ngModel)]="hero.name">
\`\`\`

## Services：目的明確的功能單位

![Services 示意](/images/articles/angular-architecture-overview-9.webp)

架構圖的左下區是很多的 Service 注入至 Component 裡。幾乎所有功能都可以是 service，但是它應該是**目的明確且狹義**的功能。例如：記錄服務、數據服務、消息服務、稅計算器、應用程序配置等。

以下是一個範例。在這個例子中可以看到我們可以利用 \`getHeroes()\` 和 service 取得 Hero 列表，而 Service 則負責與 Backend 溝通，由 API 取得資料並且回傳給 component：

\`\`\`js
export class HeroService {
  private heroes: Hero[] = [];

  constructor(
    private backend: BackendService,
    private logger: Logger) { }

  getHeroes() {
    this.backend.getAll(Hero).then( (heroes: Hero[]) => {
      this.logger.log(\`Fetched \${heroes.length} heroes.\`);
      this.heroes.push(...heroes); // fill cache
    });
    return this.heroes;
  }
}
\`\`\`

## Dependency Injection：元件怎麼取得 Service？


HeroService 依賴注入的過程看起來像這樣：

![Injector 注入 Service 的過程](/images/articles/angular-architecture-overview-10.webp)

injector 會有一個所有 Service 的集合。如果所需要的 Service 不在這個集合中，那麼 injector 將創建一個 Service 並加進 Service 集合裡。當 component 所需要的 Service 都已經取得後，只要在 constructor 設定該服務在此元件內的名稱，就可以在元件裡自由的使用服務了。

下面是一個依賴注入的範例：

\`\`\`js
constructor(private service: HeroService) { }
\`\`\`

例如上面的程式碼就會讓該 component 裡的程式碼可以使用 \`service.getHeroes()\` 來取得英雄列表。

那麼在上圖中，上面要被 injector 選擇的那些 service 是怎麼來的呢？我們可在根模組或者自己所在的模組裡去提供所有需用到的服務，這樣在這個模組內的所有元件都可以使用這個服務，如下：

\`src/app/app.module.ts\`

\`\`\`js
providers: [
  BackendService,
  HeroService,
  Logger
],
\`\`\`

或者也可以在該元件的 metadata 裡用 providers 來設定這個元件要使用這個服務，如下：

\`\`\`js
@Component({
  selector:    'app-hero-list',
  templateUrl: './hero-list.component.html',
  providers:  [ HeroService ]
})
\`\`\`

## 常見問題

### Angular 的 Component 必備元素有哪些？

一個 component 必備的三個元素是 template、metadata 與 component class 本身。template 定義畫面、metadata（\`@Component\` 宣告）定義這個元件怎麼被引用與樣式位置，class 則提供屬性與方法供 template 呼叫。

### Angular 的資料綁定有哪幾種類型？

主要有四種：插值綁定 \`{{value}}\`、property binding \`[property]="value"\`、event binding \`(event)="handler()"\`，以及雙向綁定 \`[(ngModel)]="value"\`。前三種是單向的，雙向綁定則同時結合 property 與 event binding。

### NgModule 和 JavaScript modules 有什麼不同？

NgModule 是 Angular 自己的模組化系統，用 \`@NgModule\` decorator 宣告，描述一個模組裡有哪些 components、directives、pipes 與 services；JavaScript modules 則是 ES6 語言層級的 \`import\`/\`export\` 機制。兩者是完全不同的東西，實務上會同時使用。

### 什麼是 Dependency Injection？為什麼 Angular 需要它？

依賴注入是一種設計模式，讓元件不用自己建立服務，而是由 injector 提供現成的 service 實例。只要在 constructor 參數宣告服務型別（如 \`constructor(private service: HeroService)\`），Angular 就會自動注入，並在模組或元件的 \`providers\` 中註冊。

### Component 和 Directive 有什麼關係？

本質上 component 就是一個有 template 的 directive，directive 則沒有 template，用來擴展 HTML 元素或簡化 DOM 操作。可以視 component 為 directive 的擴展，但因為 component 在 Angular 中非常重要，架構上會將兩者分開介紹。

## 參考資料

- [當個好的建築師之 Angular 2 架構](https://ithelp.ithome.com.tw/articles/10186561)
- [Architecture Overview（Angular 官網）](https://angular.io/guide/architecture)
- [Angular2 學習筆記——NgModule](https://kknews.cc/zh-tw/tech/mpybn2.html)

## 延伸閱讀

- [Angular 主從元件開發教學：用 @Input 拆出 HeroDetailComponent](/post/angular-master-detail-component)：同樣聚焦 angular、frontend，可接著比較不同情境的做法。
- [Angular Pipes 完整介紹：內建管道用法與自訂 Pipe 教學](/post/angular-pipes-guide)：同樣聚焦 angular、typescript，可接著比較不同情境的做法。
- [Angular Template Binding Syntax 教學：資料繫結的模版語法](/post/angular-template-binding-syntax)：同屬「前端開發」主題，可延伸理解相近問題的判斷方式。

## 最後更新

2026-08-28（原文發布於 2017-12-27，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};