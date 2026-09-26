var e=`---
title: Angular 動態載入元件教學：用 ComponentFactoryResolver 實作廣告輪播
description: 用 Angular ComponentFactoryResolver 搭配 ViewContainerRef 與 ng-template 動態載入元件，實作同一區塊循環播放不同廣告橫幅的完整教學與程式碼解析。
date: 2017-12-31
category: 前端開發
tags: [Angular, 動態載入, ComponentFactoryResolver, ViewContainerRef, ng-template]
readingTime: 6 分鐘
image: /images/tech/hero_angular-dynamic-component-loader.webp
imageAlt: Angular 動態載入元件示意圖，程式碼與元件積木在同一畫面上動態組裝
---


# Angular 動態載入元件教學：用 ComponentFactoryResolver 實作廣告輪播

模板組件有的時候會需要能夠動態被載入，這篇文章要講如何利用 [ComponentFactoryResolver](https://angular.io/api/core/ComponentFactoryResolver) 來動態加入組件。本篇的例子是需要動態載入廣告橫幅：因為廣告內容會由幾個不同的團隊來打造，要在同一個區塊循環播放不同的廣告，因此較難把不同的廣告放在同一個 component，這時候就會需要用到動態載入的功能。完整範例請見 [live example](https://angular.io/generated/live-examples/dynamic-component-loader/eplnkr.html) / [download example](https://angular.io/generated/zips/dynamic-component-loader/dynamic-component-loader.zip)。

## 為什麼需要用 anchor directive 來標記載入位置？

在架構介紹的地方有介紹到，directive 是一個沒有 view 的 component，可以直接使用在 HTML 裡。因為需要動態載入元件，會需要先建立一個 directive，讓 Angular 知道要把動態載入的元件放在那邊。

\`ad.directive.ts\` 這個檔案的內容如下：

\`\`\`js
import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[ad-host]',//這個directive的名字
})
export class AdDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }//在directive裡去取得View元件以方便做操作
}
\`\`\`

首先我們將這個 directive 命名為 \`[ad-host]\`，然後注入 \`ViewContainerRef\`。\`ViewContainerRef\` 可以讓我們得知目前所在的 HTML 元素中包含的 View 內容，也可以透過它來改變 View 的結果（例如：動態產生 Component、移除某個 Component 等等）。

## 如何用 ng-template 準備元件的掛載點？

使用上面 directive 的 HTML 碼如下：

\`\`\`html
<div class="ad-banner">
   <h3>Advertisements</h3>
   <ng-template ad-host></ng-template>
</div>
\`\`\`

這邊可以看到我們使用 [ng-template](https://blog.angular-university.io/angular-ng-template-ng-container-ngtemplateoutlet/) 來應用剛剛所創建的 directive。\`ng-template\` 指令表示一個 Angular 模板，這個標籤的內容將包含 template 的一部分，然後可以與其他 template 一起組成最終的組件模板。使用 \`ng-template\` 標籤只是定義一個 template，但是我們還沒有使用它。

## 動態載入的核心程式碼怎麼寫？

下面是 \`src/app/ad-banner.component.ts\` 的內容：

\`\`\`js
export class AdBannerComponent implements AfterViewInit, OnDestroy {
  @Input() ads: AdItem[];//要輪播顯示的廣告
  currentAddIndex: number = -1;
  @ViewChild(AdDirective) adHost: AdDirective;//宣告剛剛建立的Directive，並藉由<ng-template ad-host>取得傳入的adHost
  subscription: any;
  interval: any;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  ngAfterViewInit() {
    this.loadComponent();
    this.getAds();
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }
  //最重要動態載入廣告的程式碼都在這個function裡
  loadComponent() {
    //決定要顯示那則廣告
    this.currentAddIndex = (this.currentAddIndex + 1) % this.ads.length;
    let adItem = this.ads[this.currentAddIndex];

    //透過ComponentFactoryResolver來解析component組件
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(adItem.component);
    //透過剛剛從AdDirective傳來的資訊取得要載入ad的template
    let viewContainerRef = this.adHost.viewContainerRef;
    //將template內容清掉
    viewContainerRef.clear();
    //動態建立template並顯示在畫面上
    let componentRef = viewContainerRef.createComponent(componentFactory);
    (<adComponent>componentRef.instance).data = adItem.data;
  }

  //通過這個方法，每三秒會動態載入不同的廣告元件
  getAds() {
    this.interval = setInterval(() => {
      this.loadComponent();
    }, 3000);
  }
}
\`\`\`

\`loadComponent\` 是動態載入元件最關鍵的程式碼片段，整個流程可以拆成四步：

1. 用索引取模的方式決定這次要顯示哪一則廣告。
2. 透過 \`ComponentFactoryResolver\` 的 \`resolveComponentFactory()\` 把元件類別解析成 factory。
3. 從 \`AdDirective\` 傳來的 \`viewContainerRef\` 取得掛載點，先 \`clear()\` 清掉舊內容。
4. 用 \`createComponent()\` 動態建立元件並顯示在畫面上，再把資料塞進元件實例。

搭配 \`setInterval\`，每三秒就會重複這個流程，動態載入不同的廣告元件。最終出來的成果如下圖：

![Angular 廣告輪播動態載入元件的執行成果](/images/articles/angular-dynamic-component-loader-1.webp)

## 常見問題

### 為什麼不能用 *ngIf 或 *ngFor 切換元件就好，一定要動態載入？

\`*ngIf\`、\`*ngFor\` 需要事先在模板中寫死所有可能的元件。當元件由不同團隊開發、無法預先全部 import 到同一個模板時，用 \`ComponentFactoryResolver\` 搭配 \`ViewContainerRef\` 就能在執行期才決定要建立哪個元件。

### ViewContainerRef 在動態載入中扮演什麼角色？

\`ViewContainerRef\` 代表容器視圖，可以管理其中包含的多個視圖。透過它在 directive 中被注入並用 \`@ViewChild(AdDirective)\` 取得，我們就能在指定的 HTML 位置上 \`clear()\` 與 \`createComponent()\`，精準控制動態元件插入的位置。

### 動態載入的元件要怎麼傳入資料？

\`createComponent()\` 會回傳一個 \`ComponentRef\`，其 \`instance\` 屬性就是新建立元件的實例。直接對 instance 指派屬性（例如 \`componentRef.instance.data = adItem.data\`）即可把資料傳進動態建立的元件。

### 動態載入的元件需要記得清理嗎？

需要。切換前先呼叫 \`viewContainerRef.clear()\` 移除前一個動態建立的元件，避免殘留；另外本例用 \`setInterval\` 排程輪播，要在 \`ngOnDestroy\` 中 \`clearInterval\`，否則元件銷毀後 timer 仍會執行造成錯誤。

## 參考資料
- [[Angular進階議題]使用ComponentFactoryResolver動態產生Component](https://dotblogs.com.tw/wellwind/2017/06/21/dynamic-component-with-component-factory-resolver)
- [Dynamic Component Loader](https://angular.io/guide/dynamic-component-loader)
- [使用 ViewContainerRef 探索Angular DOM操作](http://blog.giscafer.com/2017/10/21/exploring-angular-dom-abstractions/)
- [Angular ng-template, ng-container and ngTemplateOutlet - The Complete Guide To Angular Templates](https://blog.angular-university.io/angular-ng-template-ng-container-ngtemplateoutlet/)

## 延伸閱讀

- [Angular Structural Directives 教學：*ngIf、*ngFor、ng-template 與 ng-container](/post/angular-structural-directives)：同樣聚焦 ng-template，可接著比較不同情境的做法。
- [Angular Attribute Directives 屬性指令完整教學：從 @Directive 到 @Input 參數傳遞](/post/angular-attribute-directives)：同樣聚焦 angular，可接著比較不同情境的做法。
- [Angular 架構總覽：Component、Template、Metadata、NgModule、Directive 與 Dependency Injection 入門](/post/angular-architecture-overview)：同樣聚焦 angular，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2017-12-31，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};