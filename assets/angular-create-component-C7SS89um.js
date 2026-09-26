var e=`---
title: 如何用 Angular CLI 建立元件（Component）並完成資料綁定
description: 用 Angular CLI 的 ng generate component 指令建立第一個 Angular 元件，認識 @Component 的 selector、templateUrl、styleUrls 三個 metadata，再學會顯示變數、使用物件、Pipes 格式化與 [(ngModel)] 雙向繫結，完成主從元件的基礎開發。
date: 2017-12-21
category: 前端開發
tags: [Angular, Component, Angular CLI, Data Binding, 新手教學]
readingTime: 6 分鐘
image: /images/tech/hero_angular-create-component.webp
imageAlt: 螢幕上顯示程式碼編輯器的 TypeScript 類別內容
---


# 如何用 Angular CLI 建立元件（Component）並完成資料綁定

Angular 的核心開發模式就是「元件（Component）」：把畫面切成一個個可重複使用的元件，再組裝成完整應用程式。這篇記錄我用 \`ng generate component\` 建立第一個 heroes 元件的過程，包含 \`@Component\` 的三個 metadata、顯示變數與物件、用 Pipes 格式化輸出，以及 \`[(ngModel)]\` 雙向繫結的設定，是「新手教程」系列的第二篇筆記。

## 怎麼用 CLI 為專案建立一個元件？

在專案根目錄下執行這行指令：

\`\`\`bash
ng generate component heroes
\`\`\`

CLI 就會為我們初始化一個新的元件樣版，自動產生 \`.ts\`、\`.html\`、\`.css\` 等檔案。

![ng generate component heroes 指令執行結果](/images/articles/angular-create-component-1.webp)

這時我們開啟 \`app/heroes/heroes.component.ts\`：

\`\`\`ts
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
\`\`\`

只要創建元件，都必需從 Angular 去 import Component。而 \`@Component\` 則是用來定義這一個元件的相關資訊，有三個 metadata：

| metadata | 用途 |
|---|---|
| \`selector\` | the components CSS element selector，以及在 HTML 裡要宣告的 TAG 名稱 |
| \`templateUrl\` | 要使用的 HTML 樣版位置 |
| \`styleUrls\` | 專為這個元件設定的 CSS |

要注意的是，我們通常會使用 \`export class\`，以方便在其他的模組裡可以 import 來使用。

## 如何修改元件的內容？

打開 \`heroes.component.ts\`，加上 \`encapsulation\` 設定與一個新的變數：

\`\`\`ts
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HeroesComponent implements OnInit {
  hero = 'heroes works!'; // 增加一個變數
  constructor() { }

  ngOnInit() {
  }

}
\`\`\`

接著修改 \`heroes.component.html\`，使用 \`{{ hero }}\` 來顯示剛剛在 TS 檔裡定義的變數：

\`\`\`html
<h1>{{hero}}</h1>
\`\`\`

## 怎麼把元件放進頁面裡？

打開 \`src/app/app.component.html\`，加上元件的 selector 標籤：

\`\`\`html
<app-heroes></app-heroes>
\`\`\`

這時候就可以在頁面中看到剛剛我們所增加的內容了——這就是元件化開發的好處：只要在頁面上宣告 selector 標籤，整個元件就會被掛載進來。

## 如何在元件裡使用物件？

先創建一個 Hero 物件，新增 \`src/app/hero.ts\`：

\`\`\`ts
export class Hero {
   id: number;
   name: string;
}
\`\`\`

打開 \`src/app/heroes/heroes.component.ts\`，import 這個物件並給予正確的值：

\`\`\`ts
import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  // 在這邊設定物件內容
  hero: Hero = {
    id: 1,
    name: 'Windstorm'
  };

  constructor() { }

  ngOnInit() {
  }

}
\`\`\`

再顯示在 heroes.component 裡所設定的值：

\`\`\`html
<h2>{{ hero.name }} Details</h2>
<div><span>id: </span>{{hero.id}}</div>
<div><span>name: </span>{{hero.name}}</div>
\`\`\`

如果希望將變數格式化（例如全部轉大寫），則可以使用：

\`\`\`html
<h2>{{ hero.name | uppercase }} Details</h2>
\`\`\`

這個格式化的功能叫做 Pipes，更多的說明請見官方的 [Pipes 說明](https://angular.io/guide/pipes)。

## Angular 的雙向繫結怎麼做？

Angular 一個很方便的功能就是可以支持雙向繫結，使用 **\`[(ngModel)]\`** 能做到當欄位的值改變時，TS 裡變數的值也同時被更改。這個功能在做表單驗證時非常方便，詳細使用說明請見官方的 [NgModules](https://angular.io/guide/ngmodule) 文件。

使用方法：在 \`src/app/heroes/heroes.component.html\` 加上下面這段：

\`\`\`html
<div>
    <label>name:
      <input [(ngModel)]="hero.name" placeholder="name">
    </label>
</div>
\`\`\`

接著要去 \`app.module.ts\` 加上 import 資訊，讓專案能夠使用 ngModel 標籤——**要注意是要在 app.module.ts 裡喔！**先 import 並且將 FormsModule 加進 \`@NgModule\` 的 imports 列表內，讓下面所有的元件都可以使用 FormsModule 的功能：

\`\`\`ts
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
\`\`\`

\`\`\`ts
imports: [
  BrowserModule,
  FormsModule
],
\`\`\`

接著，要把剛剛我們所建立的元件 HeroesComponent 放進 \`@NgModule.declarations\` 裡：

\`\`\`ts
import { HeroesComponent } from './heroes/heroes.component';
\`\`\`

在 \`app.module.ts\` 的 \`@NgModule\` 增加：

\`\`\`ts
declarations: [
  AppComponent,
  HeroesComponent
],
\`\`\`

這時，我們會發現我們更動 input 裡的文字時，model 的值也會被更改，雙向繫結就完成了。

## 常見問題

### \`ng generate component\` 有更短的寫法嗎？

有，可以用 \`ng g c heroes\` 這個縮寫，效果完全一樣。CLI 會自動產生 \`.ts\`、\`.html\`、\`.css\`、\`.spec.ts\` 四個檔案。

### \`@Component\` 的 selector 是做什麼用的？

selector 是這個元件在 HTML 裡的標籤名稱，例如 \`app-heroes\`。只要在其他元件的模板裡寫上 \`<app-heroes></app-heroes>\`，這個元件就會被掛載進來。

### 為什麼 \`[(ngModel)]\` 會報錯說不是 Angular 的已知屬性？

因為專案還沒引入 FormsModule。要到 \`app.module.ts\` import \`FormsModule\`，並把它加進 \`@NgModule\` 的 imports 列表裡，ngModel 才會生效。

### {{ }} 這種寫法是什麼？

這是 Angular 的插值（interpolation）語法，會把 TS 元件裡變數的值顯示到模板上。加上 \`| uppercase\` 這類 Pipe 還能順便做格式化。

### 什麼是雙向繫結？

雙向繫結是指畫面欄位與元件變數兩邊同步：使用者改了 input 的值，TS 裡的變數會跟著更新；反之變數改了，畫面也會即時反映。在 Angular 裡用 \`[(ngModel)]\` 一行就能做到。

## 參考資料

- [Angular 官方文件：Pipes](https://angular.io/guide/pipes)
- [Angular 官方文件：NgModules](https://angular.io/guide/ngmodule)
- 今日練習成果：[live example](https://angular.io/generated/live-examples/toh-pt1/eplnkr.html) / [download example](https://angular.io/generated/zips/toh-pt1/toh-pt1.zip)

## 延伸閱讀

- [建立一個 Angular 5 的專案](/post/angular-cli-new-project-setup)：同樣聚焦 Angular、Angular CLI，可接著比較不同情境的做法。
- [Angular 元件建立教學：用 CLI 產生元件、綁定資料與雙向繫結](/post/angular-create-component)：同樣聚焦 新手教學，可接著比較不同情境的做法。
- [Angular Service 建立教學：用 CLI 產生 HeroService 並回傳 Observable](/post/angular-create-service-tutorial)：同樣聚焦 Angular、Angular CLI，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2017-12-21，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};