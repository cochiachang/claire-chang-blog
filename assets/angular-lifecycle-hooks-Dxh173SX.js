var e=`---
title: Angular Lifecycle Hooks 教學：生命週期鉤子順序與使用時機
description: 整理 Angular Lifecycle Hooks 的生命週期概念、ngOnChanges、ngOnInit、ngDoCheck、AfterContent、AfterView 與 ngOnDestroy 的呼叫順序和使用場景。
date: 2017-12-29
category: 前端開發
tags: [Angular, Lifecycle Hooks, TypeScript, Component, 前端開發]
readingTime: 6 分鐘
image: /images/tech/angular-lifecycle-hooks-sequence.png
imageAlt: Angular Lifecycle Hooks 執行順序示意圖
---


# Angular Lifecycle Hooks 教學：生命週期鉤子順序與使用時機

Angular Lifecycle Hooks 是 Angular 在 component 或 directive 建立、更新、檢查、顯示內容、顯示 view、銷毀之前提供的掛點。開發者可以在 \`ngOnInit()\` 初始化資料、在 \`ngOnChanges()\` 追蹤輸入變化、在 \`ngOnDestroy()\` 清理訂閱與事件，避免把所有邏輯都塞進 constructor 或 template。

![Angular Lifecycle Hooks 執行順序示意圖](/images/tech/angular-lifecycle-hooks-sequence.png)

## Angular Lifecycle Hooks 是什麼？

Angular Lifecycle Hooks 是 component 與 directive 生命週期中的 callback method。Angular 會管理建立、資料綁定檢查、內容投影、view 初始化與銷毀流程，並在特定階段呼叫對應 hook。

一個 component 有一段由 Angular 管理的生命週期。Angular 會建立 component、產生畫面，當資料綁定屬性改變時做檢查；當 component 從 DOM 中移除之前，Angular 也會銷毀該 component。

Lifecycle Hooks 的用途，就是讓開發者在這些階段加入需要執行的程式。例如資料初始化、手動變更偵測、讀取 projected content、讀取 view children，或在離開畫面前取消訂閱 Observables 和事件處理程序。

## Angular Lifecycle Hooks 怎麼使用？

Angular Lifecycle Hooks 通常透過實作對應 TypeScript interface，再在 component class 中加入同名 method。\`OnInit\` 對應 \`ngOnInit()\`，\`OnChanges\` 對應 \`ngOnChanges()\`。

以下是一個簡化後的 \`OnInit\` 使用範例。\`PeekABoo\` component 實作 \`OnInit\`，Angular 初始化 component 後會呼叫 \`ngOnInit()\`，因此 log 會在初始化階段被寫入。

\`\`\`ts
export class PeekABoo implements OnInit {
  constructor(private logger: LoggerService) {}

  ngOnInit() {
    this.logIt('OnInit');
  }

  logIt(msg: string) {
    this.logger.log(\`#\${nextId++} \${msg}\`);
  }
}
\`\`\`

實作 interface 不是執行 hook 的必要條件；只要 class 上有符合名稱的 method，Angular 仍會呼叫。實作 interface 的好處是讓 TypeScript 幫忙檢查拼字與方法簽名，少一點看不見的錯。

## Angular Lifecycle Hooks 的呼叫順序是什麼？

Angular Lifecycle Hooks 的常見順序是 \`ngOnChanges()\`、\`ngOnInit()\`、\`ngDoCheck()\`、content hooks、view hooks，最後才是 \`ngOnDestroy()\`。其中 \`ngOnChanges()\` 只會在有 input 變化時出現。

| Hook | 目的和呼叫時機 |
| --- | --- |
| \`ngOnChanges()\` | Angular 設定資料綁定的 input property 後呼叫。這個 method 接收 [\`SimpleChanges\`](https://angular.dev/api/core/SimpleChanges)，可取得目前值與前一次的值；初始化時會在 \`ngOnInit()\` 之前呼叫。 |
| \`ngOnInit()\` | Angular 初始化 directive 或 component，並設定第一次顯示所需的 input property 後呼叫。適合放初始化資料、呼叫 service 載入資料等工作。 |
| \`ngDoCheck()\` | Angular 每次檢查 component 變化時呼叫。適合處理 Angular 無法自行偵測、但開發者需要手動追蹤的變化。 |
| \`ngAfterContentInit()\` | Angular 將外部 projected content 設定到 component 後呼叫一次。常見於使用 \`<ng-content>\` 的 component。 |
| \`ngAfterContentChecked()\` | Angular 檢查投影到 component 裡的 content 後呼叫。這個 hook 可能頻繁執行，不適合放昂貴運算。 |
| \`ngAfterViewInit()\` | Angular 初始化 component template 與 child views 後呼叫一次。常見於需要讀取 view children 或 DOM 相關狀態時。 |
| \`ngAfterViewChecked()\` | Angular 檢查 component view 與 child views 後呼叫。這個 hook 也可能頻繁執行，使用時要注意效能。 |
| \`ngOnDestroy()\` | Angular 銷毀 directive 或 component 前呼叫。適合取消 Observables 訂閱、解除事件處理程序、停止 timer，避免記憶體洩漏。 |

Angular 官方文件把 component lifecycle 定義為從建立到銷毀之間的一連串步驟；每個 hook 都對應 Angular rendering 與 change detection 流程中的一個時間點（Angular Docs，存取日期 2026-08-28）。

## ngOnChanges 和 ngOnInit 差在哪？

\`ngOnChanges()\` 用來回應 input property 的變化，\`ngOnInit()\` 用來做 component 第一次初始化。初始化階段如果 component 有 input，Angular 會先呼叫 \`ngOnChanges()\`，再呼叫 \`ngOnInit()\`。

開發時可以用這個方式判斷：

| 需求 | 適合的 hook |
| --- | --- |
| 需要比較 input 的前後值 | \`ngOnChanges()\` |
| 需要在 component 第一次準備好時載入資料 | \`ngOnInit()\` |
| 只想初始化本地狀態，不依賴 input 變化歷程 | \`ngOnInit()\` |
| input 每次改變都要重新計算畫面資料 | \`ngOnChanges()\` |

\`ngOnChanges()\` 會收到 \`SimpleChanges\` object，裡面包含每個變更屬性的 previous value、current value，以及是否為 first change。\`ngOnInit()\` 則只會在 component 初始化時執行一次，不負責追蹤後續 input 變化。

## ngDoCheck 什麼時候才需要用？

\`ngDoCheck()\` 適合用在 Angular 預設變更偵測無法完整判斷的情境。一般 component 不需要主動實作 \`ngDoCheck()\`，因為這個 hook 會很頻繁地被呼叫。

如果資料變化已經能透過 input、event、Observable 或 signal 表達，通常不需要 \`ngDoCheck()\`。\`ngDoCheck()\` 比較像最後的手動檢查點：當外部物件被原地修改、第三方程式庫改動狀態，或需要自訂差異比對時，才考慮使用。

實務上，\`ngDoCheck()\` 裡的程式要非常輕。把 API 呼叫、複雜排序、大量 DOM 操作放在這裡，容易讓每一次 change detection 都變慢。

## AfterContent 和 AfterView Hooks 差在哪？

AfterContent hooks 針對投影進 component 的外部內容，AfterView hooks 針對 component 自己的 template 與 child views。兩者差別在於 Angular 當下檢查的是 content 還是 view。

\`ngAfterContentInit()\` 與 \`ngAfterContentChecked()\` 對應 projected content，例如父層透過 \`<ng-content>\` 塞進子 component 的內容。這組 hooks 關心的是「外部放進來的內容」。

\`ngAfterViewInit()\` 與 \`ngAfterViewChecked()\` 對應 component 自己 template 裡宣告的 view，以及 template 裡的 child components。這組 hooks 關心的是「component 自己長出來的畫面」。

如果只是初始化資料，通常先從 \`ngOnInit()\` 開始。只有真的需要讀取 content children、view children 或 DOM 狀態時，再使用 AfterContent / AfterView hooks，程式意圖會更清楚。

## ngOnDestroy 為什麼重要？

\`ngOnDestroy()\` 是 component 或 directive 被銷毀前的清理點。只要 component 裡有訂閱、timer、手動事件監聽或外部資源，就應該在 \`ngOnDestroy()\` 清掉。

最常見的例子是 Observables 和事件處理程序。如果 component 已經離開畫面，訂閱卻還在背景接收資料，就可能造成記憶體洩漏，甚至讓已不存在的 view 繼續嘗試更新。

早期 Angular 教學常會直接在 \`ngOnDestroy()\` 裡取消訂閱。新版本 Angular 也提供 \`DestroyRef\` 等寫法，可以把 setup 和 cleanup 放得更近；不管使用哪一種寫法，核心目標都是在 component 離開時停止不該繼續跑的工作。

## Peek-a-boo 範例可以觀察什麼？

Peek-a-boo 範例適合用來觀察 Angular Lifecycle Hooks 的實際呼叫順序。範例會在每個 hook 被呼叫時寫入 log，讓開發者看到 component 從建立到銷毀的過程。

原本學 Lifecycle Hooks 時，最抽象的地方不是 hook 名稱，而是「Angular 到底什麼時候呼叫」。Peek-a-boo 範例把每個 callback 都印出來，因此可以直接看到初始化、檢查與銷毀的順序。

![Angular Peek-a-boo lifecycle hooks 範例執行結果](/images/tech/angular-lifecycle-hooks-peek-a-boo.png)

練習時可以先從官方 lifecycle 範例開始，再試著加入 input property、切換 component 顯示狀態、訂閱一個 Observable。這樣會更容易理解 \`ngOnChanges()\`、\`ngOnInit()\` 和 \`ngOnDestroy()\` 分別處理哪一段責任。

## 常見問題

### Angular Lifecycle Hooks 一定只能用在 component 嗎？

不是。Angular directive 也有相同的 lifecycle hooks。只要 directive 有對應生命週期需求，例如初始化、追蹤 input 變化或銷毀前清理，就可以使用對應 hook。

### constructor 和 ngOnInit 有什麼差別？

constructor 是 TypeScript class 被建立時執行，主要適合做 dependency injection 和非常單純的初始設定。\`ngOnInit()\` 是 Angular 完成 input 初始化後呼叫，比較適合放依賴 Angular 綁定結果的初始化邏輯。

### ngOnChanges 為什麼會比 ngOnInit 早執行？

初始化 component 時，Angular 需要先把 input property 設定進 component，才能讓 component 根據輸入值做初始化。因此第一次 \`ngOnChanges()\` 會在 \`ngOnInit()\` 之前執行。

### ngAfterViewInit 可以直接改畫面狀態嗎？

\`ngAfterViewInit()\` 適合讀取 view 初始化後的狀態，但不適合隨意改動會影響 template 綁定的資料。若在檢查流程中改變狀態，可能遇到 \`ExpressionChangedAfterItHasBeenCheckedError\`。

### ngOnDestroy 通常要清理哪些東西？

\`ngOnDestroy()\` 通常清理 Observable 訂閱、DOM event listener、\`setInterval\`、\`setTimeout\`、WebSocket 或第三方 library 建立的資源。判斷原則是：component 離開畫面後還會繼續執行或占用資源的東西，都要清掉。

## 參考資料

- [Angular Docs：Component Lifecycle](https://angular.dev/guide/components/lifecycle)
- [Angular API：SimpleChanges](https://angular.dev/api/core/SimpleChanges)

## 延伸閱讀

- [Angular 組件間溝通教學：Input、Output、ViewChild 與 Service](/post/angular-component-communication)：同樣聚焦 Angular、Component，可接著比較不同情境的做法。
- [Angular Service 建立教學：用 CLI 產生 HeroService 並回傳 Observable](/post/angular-create-service-tutorial)：同樣聚焦 Angular、TypeScript，可接著比較不同情境的做法。
- [建立一個 Angular 5 的專案](/post/angular-cli-new-project-setup)：同樣聚焦 Angular、TypeScript，可接著比較不同情境的做法。

## 最後更新

2026-08-28
`;export{e as default};