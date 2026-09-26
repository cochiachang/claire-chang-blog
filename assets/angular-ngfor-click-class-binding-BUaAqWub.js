var e=`---
title: "Angular 新手教程：用 *ngFor 迴圈、(click) 事件與條件 class 建立可點選的英雄列表"
description: "Angular 新手教程：用 *ngFor 迴圈顯示完整列表、用 (click) 綁定點擊事件、用 [class.selected] 條件式加上類別，一步步做出可點選並突顯選取項目的英雄列表。"
date: 2017-12-22
category: 前端開發
tags: [Angular, ngFor, event-binding, class-binding, 新手教學]
readingTime: 3 分鐘
image: /images/tech/hero_angular-ngfor-click-class-binding.webp
imageAlt: "Angular 模板語法：ngFor 迴圈與事件綁定的示意圖"
---


# Angular 新手教程：用 *ngFor 迴圈、(click) 事件與條件 class 建立可點選的英雄列表

這篇是我照著 Angular 官方 Tour of Heroes 教程做的第三篇新手筆記，要解決的問題很具體：怎麼把一個寫死的陣列用 \`*ngFor\` 迴圈顯示成列表、怎麼用 \`(click)\` 讓每個項目可以點選，以及怎麼用條件式 class 把「目前選中的那一筆」突顯出來。三個步驟做完，就會有一個最基本但完整可互動的選擇列表。

## 如何用 *ngFor 迴圈顯示完整列表？

延續上一篇的範例（可到 [Angular 官方提供的 toh-pt1.zip](https://angular.io/generated/zips/toh-pt1/toh-pt1.zip) 下載）。

首先開啟 \`src/app/heroes/heroes.component.ts\`，設定一個變數 \`heroes\`：

\`\`\`js
heroes: Hero[] = [
  { id: 11, name: 'Mr. Nice' },
  { id: 12, name: 'Narco' },
  { id: 13, name: 'Bombasto' },
  { id: 14, name: 'Celeritas' },
  { id: 15, name: 'Magneta' },
  { id: 16, name: 'RubberMan' },
  { id: 17, name: 'Dynama' },
  { id: 18, name: 'Dr IQ' },
  { id: 19, name: 'Magma' },
  { id: 20, name: 'Tornado' }
];
\`\`\`

接著開啟 \`app.component.html\`，利用 \`*ngFor\` 來迴圈式的顯示列表內容：

\`\`\`html
<ul class="heroes">
  <li *ngFor="let hero of heroes">
    <span class="badge">{{hero.id}}</span> {{hero.name}}
  </li>
</ul>
\`\`\`

這時網頁上就可以看到成果如下圖：

![用 *ngFor 迴圈顯示英雄列表的成果](/images/articles/angular-ngfor-click-class-binding-1.webp)

更多資訊可參考 [Angular 官方關於 ngFor 的說明](https://angular.io/guide/template-syntax#ngFor)。

## 如何用 (click) 綁定點擊事件？

開啟 \`src/app/heroes/heroes.component.html\`（模板），在 \`li\` 裡面增加 click 的事件：

\`\`\`html
<li *ngFor="let hero of heroes" (click)="onSelect(hero)">
\`\`\`

再到 \`src/app/heroes/heroes.component.ts\` 增加處理的函數：

\`\`\`js
selectedHero: Hero;

onSelect(hero: Hero): void {
  this.selectedHero = hero;
}
\`\`\`

這樣使用者每點一個項目，\`selectedHero\` 就會被更新成被點到的那個 hero，之後的條件式樣式與詳情顯示都是建立在這個基礎上。

更多資訊可參考 [Angular 官方關於 event binding 的說明](https://angular.io/guide/template-syntax#event-binding)。

## 如何用條件式為元件增加類別？

打開 \`heroes.component.html\`，在 \`li\` 內增加 \`[class.要增加的類別名稱]="條件式為 true 時增加"\`：

\`\`\`html
<li *ngFor="let hero of heroes"
  [class.selected]="hero === selectedHero"
  (click)="onSelect(hero)">
  <span class="badge">{{hero.id}}</span> {{hero.name}}
</li>
\`\`\`

這樣當 \`hero === selectedHero\` 為真時，這個 \`li\` 就會被加上 \`selected\` 這個類別。接下來再到 \`src/app/heroes/heroes.component.css\` 設定該類別的 CSS，就能突顯現在所選據的是哪一個了：

\`\`\`css
.selected {
  color: red;
}
\`\`\`

成果如下圖，被點選的項目會變成紅色：

![被選取的英雄項目以 selected 類別突顯](/images/articles/angular-ngfor-click-class-binding-2.webp)

## 常見問題

### *ngFor 是做什麼用的？

\`*ngFor\` 是 Angular 的結構型指令，用來對陣列做迴圈，為每個元素產生一份對應的模板（例如 \`<li>\`）。寫法是 \`*ngFor="let hero of heroes"\`，在迴圈內就能直接使用 \`hero\` 這個變數。

### (click)="onSelect(hero)" 的運作原理是什麼？

\`(click)\` 是 Angular 的事件綁定語法，把 DOM 的 click 事件連到元件裡的 \`onSelect\` 方法，並把被點到的 \`hero\` 當參數傳進去。每次點擊都會執行該方法，這裡就是把 \`selectedHero\` 更新為被點選的項目。

### [class.selected] 和直接寫 class 有什麼不同？

\`[class.selected]="條件式"\` 是條件式類別綁定：只有當條件為 true 時，才會把 \`selected\` 這個 class 加到元素上。寫死的 \`class="..."\` 則是固定不變的，無法隨資料狀態切換樣式。

### 這個範例的完整原始碼在哪裡下載？

本篇延續 Angular 官方 Tour of Heroes 教程，第一階段的範例可從官方提供的 [toh-pt1.zip](https://angular.io/generated/zips/toh-pt1/toh-pt1.zip) 下載，再照著本文的步驟修改即可。

## 參考資料

- [Angular 官方文件：Template Syntax — ngFor](https://angular.io/guide/template-syntax#ngFor)
- [Angular 官方文件：Template Syntax — Event binding](https://angular.io/guide/template-syntax#event-binding)
- [Tour of Heroes 第一階段範例下載（toh-pt1.zip）](https://angular.io/generated/zips/toh-pt1/toh-pt1.zip)

## 延伸閱讀

- [Angular 元件建立教學：用 CLI 產生元件、綁定資料與雙向繫結](/post/angular-create-component)：同樣聚焦 angular，可接著比較不同情境的做法。
- [建立一個 Angular 5 的專案](/post/angular-cli-new-project-setup)：同屬「前端開發」主題，可延伸理解相近問題的判斷方式。
- [Angular 主從元件開發教學：用 @Input 拆出 HeroDetailComponent](/post/angular-master-detail-component)：同樣聚焦 angular，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2017-12-22，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};