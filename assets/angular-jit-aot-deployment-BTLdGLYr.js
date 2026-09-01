var e=`---
title: Angular JIT 與 AOT 佈署介紹：編譯模式、效能差異與撰寫限制
description: 介紹 Angular JIT 與 AOT 兩種佈署編譯模式的差異，整理編譯時機、bundle size、啟動效能、AOT 優點、ng build --aot 用法，以及 metadata 撰寫限制，幫助判斷正式部署該選哪一種編譯方式。
date: 2018-01-15
category: 前端開發
tags: [Angular, AOT, JIT, Angular CLI, 前端部署]
readingTime: 8 分鐘
image: /images/tech/hero_angular-jit-aot-deployment.webp
imageAlt: 模組化建築外牆，象徵 Angular JIT 與 AOT 編譯模式的部署差異
---


# Angular JIT 與 AOT 佈署介紹：編譯模式、效能差異與撰寫限制

Angular JIT 與 AOT 的差異在於編譯發生的時間點。JIT（Just-in-Time）是在瀏覽器下載 JavaScript 後，於使用者端即時編譯 Angular 程式碼；AOT（Ahead-of-Time）是在發佈前透過 Angular Compiler 先編譯完成，瀏覽器下載後可以直接執行並渲染畫面。

## Angular JIT 與 AOT 編譯模式差在哪裡？

Angular JIT 把編譯工作留到 runtime，Angular AOT 則把編譯工作移到 build 階段。AOT 通常能減少使用者端負擔，讓啟動時間和檔案大小更好控制。

在 Angular 2 之後，Angular 應用程式有兩種常見編譯模式：

| 編譯模式 | 完整名稱 | 編譯時機 | 說明 |
|---|---|---|---|
| JIT | Just-in-Time | 瀏覽器 runtime | Angular 預設使用即時編譯。瀏覽器下載完 \`*.js\` 檔案後，會在使用者端瀏覽器編譯 Angular 的 JavaScript 程式碼，接著才渲染畫面。 |
| AOT | Ahead-of-Time | 發佈前 build 階段 | 程式發佈之前先透過 Angular Compiler 編譯。瀏覽器下載完 \`*.js\` 檔案後，可以直接執行並渲染畫面。 |

JIT 適合開發時期的快速迭代；AOT 則更接近正式環境部署需求，因為編譯器不必跟著應用程式一起送到使用者端。

## JIT 與 AOT 在佈署結果上有哪些差異？

Angular AOT 的重點是把編譯從運行時移動到構建過程。使用者不需要載入完整編譯器，也不需要在用戶端等待編譯完成。

下表是 JIT 與 AOT 佈署方式的簡單比較：

| Characteristic | JIT | AOT |
|---|---|---|
| Compilation target | Browser | Server |
| Compilation context | Runtime | Build |
| Bundle size | Huge（約 1.2 MB） | Smaller（約 400 KB） |
| Execution Performance | - | Better |
| Startup time | - | Shorter |

AOT 可以讓效能以及檔案大小都變得更好。預先編譯也能在編譯期發現一些 template 錯誤，不必等到實際在客戶端執行才看到問題。使用 AOT 時，編譯器只在構建期間運行一次；使用 JIT 時，編譯器會在每個使用者的每次運行期間執行。

## AOT 編譯有哪些優點？

Angular AOT 的主要優點是啟動更快、請求更少、檔案更小，並且能提前檢測 template 錯誤。正式部署 Angular 應用時，AOT 通常比 JIT 更適合。

AOT 編譯常見優點如下：

| 優點 | 說明 |
|---|---|
| 更快 | 瀏覽器直接載入可運行的程式碼，可以立即使用，不用等待編譯完成。 |
| 減少 HTTP 非同步請求 | 編譯器把外部 HTML template 和 CSS 樣式表內聯到應用程式的 JavaScript 中，消除下載這些來源檔案的 Ajax 請求。 |
| 檔案更小 | 客戶端不用載入完整 Angular 編譯器。 |
| 提早檢測 template 錯誤 | 編譯時會跳出 template 綁定錯誤警告，讓問題更早被發現。 |
| 更安全 | AOT 編譯會在 HTML template 和 component 被送到客戶端之前，先將內容編譯成 JavaScript 檔案。沒有 template 可以閱讀，高風險客戶端 HTML 或 JavaScript 可被利用的機會也較少。 |

資訊增益：我會把 AOT 視為正式部署的預設選項，把 JIT 留給開發時的快速編譯與除錯。若遇到只有 JIT 能跑、AOT build 失敗的狀況，通常表示 metadata、template binding 或可靜態分析性需要先修正。

## 如何在 Angular CLI 使用 AOT 編譯？

Angular 5 已經大幅簡化 AOT 流程。產生檔案或啟動開發伺服器時加上 \`--aot\`，就可以要求 Angular CLI 使用 AOT 編譯。

使用 AOT build：

\`\`\`cmd
ng build --aot
\`\`\`

使用 AOT serve：

\`\`\`cmd
ng serve --aot
\`\`\`

如果使用 \`--prod\`，Angular CLI 預設也會以 AOT 方式輸出。正式部署前可以先跑一次 AOT build，確認 template 與 metadata 不會在編譯期出錯。

## AOT 編譯對 Angular metadata 有哪些限制？

Angular AOT 需要在 build 階段靜態分析 metadata，所以 metadata 不適合放無法靜態解析的 JavaScript 寫法。Factory、template 與 decorator 都要寫成編譯器能讀懂的形式。

如果使用 AOT 預編譯，在撰寫 Angular metadata 時要注意幾個限制。

### 不支援 function expression

以下 function expression 不適合放進 AOT 需要分析的 metadata：

\`\`\`js
var myFunction = function name(param1, param2) {
  statements;
};
\`\`\`

### 不支援 arrow functions

Arrow function 寫法如下：

\`\`\`js
(param1, param2) => {
  statements;
};
\`\`\`

像下面這種 providers 設定方法，在 AOT 中不被支援：

\`\`\`ts
@Component({
  // ...
  providers: [{ provide: server, useFactory: () => new Server() }]
})
export class AppComponent {}
\`\`\`

需要改成可匯出的 factory function：

\`\`\`ts
export function serverFactory() {
  return new Server();
}

@Component({
  // ...
  providers: [{ provide: server, useFactory: serverFactory }]
})
export class AppComponent {}
\`\`\`

### 避免在 metadata 內單獨使用常數

因為常數是在編譯時就編譯進 JavaScript 裡，下面寫法可能造成 AOT 在編譯時遺失 \`template\` 常數的值：

\`\`\`ts
const template = '<div>{{hero.name}}</div>';

@Component({
  selector: 'app-hero',
  template: template
})
export class HeroComponent {
  @Input() hero: Hero;
}
\`\`\`

可以改用 inline template：

\`\`\`ts
@Component({
  selector: 'app-hero',
  template: '<div>{{hero.name}}</div>'
})
export class HeroComponent {
  @Input() hero: Hero;
}
\`\`\`

也可以將常數放到一個運算表達式內：

\`\`\`ts
const template = '<div>{{hero.name}}</div>';

@Component({
  selector: 'app-hero',
  template: template + '<div>{{hero.title}}</div>'
})
export class HeroComponent {
  @Input() hero: Hero;
}
\`\`\`

### 裝飾和資料綁定的 class 成員必須公開

Angular AOT 的 metadata 只支援 Angular compiler 能辨識的 decorator。若表達式使用不支援的語法，collector 會把錯誤項目寫入 \`.metadata.json\`；如果編譯器需要這段 metadata 來生成應用程式代碼，編譯器稍後會報告該錯誤。

常見可用的 Angular decorator 包含：

| Decorator | Module |
|---|---|
| \`Attribute\` | \`@angular/core\` |
| \`Component\` | \`@angular/core\` |
| \`ContentChild\` | \`@angular/core\` |
| \`ContentChildren\` | \`@angular/core\` |
| \`Directive\` | \`@angular/core\` |
| \`Host\` | \`@angular/core\` |
| \`HostBinding\` | \`@angular/core\` |
| \`HostListener\` | \`@angular/core\` |
| \`Inject\` | \`@angular/core\` |
| \`Injectable\` | \`@angular/core\` |
| \`Input\` | \`@angular/core\` |
| \`NgModule\` | \`@angular/core\` |
| \`Optional\` | \`@angular/core\` |
| \`Output\` | \`@angular/core\` |
| \`Pipe\` | \`@angular/core\` |
| \`Self\` | \`@angular/core\` |
| \`SkipSelf\` | \`@angular/core\` |
| \`ViewChild\` | \`@angular/core\` |

若希望立即顯示 metadata 錯誤，可以將 \`tsconfig\` 的 \`strictMetadataEmit\` 設為 \`true\`：

\`\`\`json
{
  "angularCompilerOptions": {
    "strictMetadataEmit": true
  }
}
\`\`\`

## 常見問題

### Angular JIT 是什麼？

Angular JIT（Just-in-Time）是在瀏覽器 runtime 編譯 Angular 程式碼的模式。瀏覽器下載 JavaScript 後，還需要先完成編譯才會渲染畫面。

### Angular AOT 是什麼？

Angular AOT（Ahead-of-Time）是在發佈前先透過 Angular Compiler 編譯應用程式的模式。瀏覽器下載到的是已可執行的 JavaScript，因此不需要在使用者端再跑一次 Angular 編譯器。

### Angular 正式部署應該用 JIT 還是 AOT？

Angular 正式部署通常建議使用 AOT。AOT 能減少 bundle size、縮短啟動時間，也能在 build 階段提前發現 template 或 metadata 錯誤。

### \`ng build --prod\` 會自動使用 AOT 嗎？

在 Angular 5 的 Angular CLI 中，\`ng build --prod\` 預設會使用 AOT 輸出。若想明確測試 AOT，也可以直接執行 \`ng build --aot\`。

### AOT build 失敗通常要先檢查什麼？

AOT build 失敗時，可以先檢查 metadata 是否使用 arrow function、function expression、無法靜態分析的常數，或 template binding 是否引用 private 成員。這些問題在 JIT 開發模式下可能較晚才被發現。

## 參考資料

- John Wu's Blog：[Angular 4 教學 - Webpack 預先編譯 Ahead-of-Time (AOT)](https://blog.johnwu.cc/article/angular-4-webpack-ahead-of-time.html)
- iT 邦幫忙：[[Day 25] Angular 2 事先編譯 Ahead-of-Time (AoT)](https://ithelp.ithome.com.tw/articles/10188737)
- GitBook：[Angular 2 的 AoT](https://zhangchen915.gitbooks.io/angular2-training/content/content/Advanced-angular/aot.html)
- SegmentFault：[Angular 2 JIT vs AOT](https://segmentfault.com/a/1190000008739157)
- Angular Docs：[The Ahead-of-Time (AOT) Compiler](https://v5.angular.io/guide/aot-compiler)

## 延伸閱讀

- [建立一個 Angular 5 的專案](/post/angular-cli-new-project-setup)：同樣聚焦 Angular、Angular CLI，可接著比較不同情境的做法。
- [Angular Service 建立教學：用 CLI 產生 HeroService 並回傳 Observable](/post/angular-create-service-tutorial)：同樣聚焦 Angular、Angular CLI，可接著比較不同情境的做法。
- [如何用 Angular CLI 建立元件（Component）並完成資料綁定](/post/angular-create-component)：同樣聚焦 Angular、Angular CLI，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2026-08-28。2018-01-15 初次發布，這次保留 Angular 5 時期的 JIT/AOT 佈署筆記，並補上 GEO 結構、FAQ 與站內延伸閱讀。
`;export{e as default};