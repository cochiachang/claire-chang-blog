var e=`---
title: "Angular 主從元件開發教學：用 @Input 拆出 HeroDetailComponent"
description: "Angular 主從元件開發完整教學：用 ng generate 建立 hero-detail 子元件，透過 @Input 裝飾器接收外部傳入的 selectedHero，把主列表與詳細資訊拆成兩個元件，讓 Angular 元件架構更清晰、更好維護。"
date: 2017-12-23
category: 前端開發
tags: [Angular, Component, input, frontend, tutorial]
readingTime: 4 分鐘
image: /images/tech/hero_angular-master-detail-component.webp
imageAlt: "Angular 主從元件開發示意圖"
---


# Angular 主從元件開發教學：用 @Input 拆出 HeroDetailComponent

這篇文章要解決的問題是：當主列表與詳細資訊都寫在同一個頁面時，程式會越來越難維護。我會示範如何在 Angular 中用 \`ng generate component\` 建立獨立的 hero-detail 子元件，並透過 \`@Input\` 裝飾器把外層的 \`selectedHero\` 傳進去，完成標準的主從（Master-Detail）元件架構。

## 為什麼要把詳細資訊拆成獨立元件？

在[前一篇新手教程：使用 Angular 的迴圈及判斷式等功能](http://claire-chang.com/2017/12/03/%E6%96%B0%E6%89%8B%E6%95%99%E7%A8%8B3-%E4%BD%BF%E7%94%A8angular%E7%9A%84%E8%BF%B4%E5%9C%88%E5%8F%8A%E5%88%A4%E6%96%B7%E5%BC%8F%E7%AD%89%E5%8A%9F%E8%83%BD/)裡，我在顯示 \`selectedHero\` 的資訊時是與列表寫在同一個頁面。

但如果顯示詳細資訊的地方需要額外拆分出來（例如之後要在其他頁面重用，或讓模板更單純），就可以再創立一個元件，並將 \`selectedHero\` 傳入元件。這就是 Angular 主從元件開發的基本模式：

| 角色 | 元件 | 職責 |
| --- | --- | --- |
| 主（Master） | HeroesComponent | 顯示英雄列表、處理點擊選取 |
| 從（Detail） | HeroDetailComponent | 顯示並編輯被選取英雄的詳細資訊 |

## 如何建立 hero-detail 元件？

用 Angular CLI 一行指令就能產生子元件的檔案骨架：

\`\`\`bash
ng generate component hero-detail
\`\`\`

## hero-detail 的模板要怎麼寫？

開啟 \`src/app/hero-detail/hero-detail.component.html\`，這邊會將 \`selectedHero\` 的名稱改為 \`hero\`：

\`\`\`html
<div *ngIf="hero">

<h2>{{ hero.name | uppercase }} Details</h2>


<div><span>id: </span>{{hero.id}}</div>


<div>
    <label>name:
      <input [(ngModel)]="hero.name" placeholder="name"/>
    </label>
  </div>

</div>
\`\`\`

用 \`*ngIf="hero"\` 可以在尚未選取任何英雄時整塊隱藏，避免顯示 undefined 的錯誤。

## 如何讓元件接受外部傳入的物件？

開啟 \`src/app/hero-detail/hero-detail.component.ts\`，先匯入 Hero 型別：

\`\`\`js
import { Hero } from '../hero';
\`\`\`

在 hero-detail.component.ts 裡面，hero 一定要以 \`@Input\` 來宣告這個物件：

\`\`\`js
@Input() hero: Hero;
\`\`\`

\`@Input\` 的意思是：這個屬性開放給父元件綁定，外部傳值進來時就會寫到 \`hero\` 上。

## 父元件如何把值傳入子元件？

而在 HeroesComponent 裡，則會以下面的宣告來將 hero 的值傳入：

\`\`\`html
<app-hero-detail [hero]="selectedHero"></app-hero-detail>
\`\`\`

方括號 \`[hero]\` 是屬性綁定語法，把父元件的 \`selectedHero\` 綁到子元件的 \`hero\` 輸入屬性上。

現在我打開 heroes.component.html，修改後的網頁內容會如下：

\`\`\`html
<h2>My Heroes</h2>



<ul class="heroes">

<li *ngFor="let hero of heroes" [class.selected]="hero === selectedHero" (click)="onSelect(hero)">
    <span class="badge">{{hero.id}}</span> {{hero.name}}
  </li>

</ul>


<app-hero-detail [hero]="selectedHero"></app-hero-detail>
\`\`\`

今日練習的範例連結：[live example](https://angular.io/generated/live-examples/toh-pt3/eplnkr.html) / [download example](https://angular.io/generated/zips/toh-pt3/toh-pt3.zip)

## 常見問題

### 為什麼子元件的屬性一定要加 @Input？

因為 Angular 的元件預設是封裝的，父元件無法直接存取子元件內部狀態。加上 \`@Input()\` 裝飾器後，這個屬性才會被登記為資料輸入埠，父元件才能用 \`[hero]="selectedHero"\` 屬性綁定傳值進來。

### 子元件模板中的 *ngIf="hero" 有什麼作用？

一開始還沒點選任何英雄時，\`selectedHero\` 是 undefined，若不擋掉會在綁定時出錯或顯示空白欄位。\`*ngIf="hero"\` 確保只有真的有傳入資料時才渲染詳細資訊區塊。

### 把詳細資訊拆成子元件有什麼好處？

主列表模板變得更單純，詳細資訊的 HTML 和邏輯集中在一個元件裡，之後要在其他頁面重用或獨立修改都不會影響到列表元件，是 Angular 元件化設計的基本功。

### [hero]="selectedHero" 的方括號是什麼意思？

方括號是 Angular 的屬性綁定（property binding）語法，等號右邊會被當成元件類別裡的運算式來求值，而不是單純字串，所以父元件的 \`selectedHero\` 值更新時，子元件會自動收到最新狀態。

## 參考資料

- [Angular 官方教學：Tour of Heroes pt.3（live example）](https://angular.io/generated/live-examples/toh-pt3/eplnkr.html)
- [Tour of Heroes pt.3 範例下載](https://angular.io/generated/zips/toh-pt3/toh-pt3.zip)
- [新手教程3-使用 Angular 的迴圈及判斷式等功能](http://claire-chang.com/2017/12/03/%E6%96%B0%E6%89%8B%E6%95%99%E7%A8%8B3-%E4%BD%BF%E7%94%A8angular%E7%9A%84%E8%BF%B4%E5%9C%88%E5%8F%8A%E5%88%A4%E6%96%B7%E5%BC%8F%E7%AD%89%E5%8A%9F%E8%83%BD/)

## 延伸閱讀

- [Angular 元件建立教學：用 CLI 產生元件、綁定資料與雙向繫結](/post/angular-create-component)：同樣聚焦 angular、component，可接著比較不同情境的做法。
- [Angular 架構總覽：Component、Template、Metadata、NgModule、Directive 與 Dependency Injection 入門](/post/angular-architecture-overview)：同樣聚焦 angular、frontend，可接著比較不同情境的做法。
- [Angular 組件間溝通教學：Input、Output、ViewChild 與 Service](/post/angular-component-communication)：同屬「前端開發」主題，可延伸理解相近問題的判斷方式。

## 最後更新

2026-08-28（原文發布於 2017-12-23，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};