var e=`---
title: Angular Service 依賴注入教學：providers、InjectionToken 與分層注入
description: 介紹 Angular Service 的依賴注入用法，包含 providers、useClass、useExisting、useValue、useFactory、InjectionToken、Optional 與 component 層級服務。
date: 2018-01-07
category: 前端開發
tags: [Angular, Service, 依賴注入, TypeScript]
readingTime: 10 分鐘
image: /images/tech/hero_angular-ngmodules-explained.webp
imageAlt: 模組化建築外牆，象徵 Angular Service 透過依賴注入組裝應用程式功能
---
# Angular Service 依賴注入教學：providers、InjectionToken 與分層注入

Angular Service 依賴注入（Dependency Injection，DI）的核心是：先把服務註冊到某一層 injector，再讓 component、service 或 directive 透過 constructor 或 \`inject()\` 取得該服務。服務註冊在哪一層，會決定注入時拿到的是全站共用實體、某個 component 專用實體，還是由 factory/token 產生的特殊實體。

## Angular Service 的依賴注入是什麼？

Angular Service 依賴注入讓 class 不必自己 \`new\` 出相依物件，而是向 Angular injector 要服務實體。這樣可以集中管理建立方式、生命週期與替換規則。

依賴注入的好處，是把「使用服務」和「建立服務」拆開。component 只需要宣告自己需要 \`HeroService\`，不用知道 \`HeroService\` 要不要 logger、設定檔，或是否要依登入狀態切換行為。

一個最基本的 service 會用 \`@Injectable()\` 標記：

\`\`\`ts
import { Injectable } from '@angular/core';

@Injectable()
export class HeroService {
  constructor() {}
}
\`\`\`

\`@Injectable()\` 是 Angular 用來標記可注入 class 的 decorator。新版 Angular 常見寫法會搭配 \`providedIn: 'root'\`，而 Angular 5 時期的範例則常把 service 放進 \`providers\` 陣列。

## providers 放在 NgModule 會發生什麼事？

Service 放在 NgModule 的 \`providers\` 時，該 module injector 會建立並保存服務實體。多個元件注入同一個 token 時，通常會拿到同一個共享物件。

在 NgModule 註冊 service：

\`\`\`ts
providers: [
  UserService
],
\`\`\`

接著就能在 component constructor 裡直接宣告需要的 service：

\`\`\`ts
export class HeroListComponent {
  heroes: Hero[];

  constructor(heroService: HeroService) {
    this.heroes = heroService.getHeroes();
  }
}
\`\`\`

這種寫法很適合放共用狀態、API client、跨頁功能服務。要注意的是，同一個 service 若被放在更靠近 component 的 \`providers\`，Angular 會優先使用較近那一層的 provider，而不是外層 module 的共享實體。

## providers 放在 Component 會有什麼差異？

Service 放在 \`@Component.providers\` 時，每個 component instance 都會有自己的服務實體。component 被銷毀時，該層 injector 與服務實體也會一起被銷毀。

在 \`NgModule.providers\` 註冊的服務，可以在該模組下任一元件透過 constructor 取得，不需要每個元件再宣告一次。可是如果某個服務只屬於單一元件，例如編輯表單的暫存狀態，就可以放進該元件的 \`providers\`。

\`\`\`ts
@Component({
  selector: 'app-hero-tax-return',
  templateUrl: './hero-tax-return.component.html',
  styleUrls: ['./hero-tax-return.component.css'],
  providers: [HeroTaxReturnService],
})
export class HeroTaxReturnComponent {
  constructor(private heroTaxReturnService: HeroTaxReturnService) {}
}
\`\`\`

資訊增益：判斷 provider 層級時，我會先問一個問題：這份 service state 能不能被兄弟元件共用？如果答案是否定的，就放 component；如果答案是肯定的，就放 module、root 或 application config。

## useClass 如何讓 token 與實際類別不同？

\`useClass\` 可以讓 Angular 用某個 token 注入服務時，實際建立另一個 class。這常用在替換實作、測試替身，或用進階版本取代基本服務。

最簡單的 provider 寫法：

\`\`\`ts
providers: [Logger]
\`\`\`

等同於完整 provider 物件：

\`\`\`ts
providers: [{ provide: Logger, useClass: Logger }]
\`\`\`

在 constructor 裡，\`Logger\` 就是 Angular 做依賴注入時使用的 token：

\`\`\`ts
constructor(private logger: Logger) {}
\`\`\`

如果現有 component 需要注入 \`Logger\`，但專案裡有一個繼承 \`Logger\` 並覆寫部分功能的 \`BetterLogger\`，可以保留注入端不變，只替換 provider：

\`\`\`ts
providers: [{ provide: Logger, useClass: BetterLogger }]
\`\`\`

這樣 component 仍然寫 \`constructor(private logger: Logger)\`，實際拿到的會是 \`BetterLogger\` 建立出的物件。

## useExisting 和 useClass 差在哪裡？

\`useExisting\` 是替既有 provider 建立別名，兩個 token 會指向同一個實體。\`useClass\` 會建立新的 class 實體，因此不適合拿來做 alias。

以下寫法看起來像是把 \`OldLogger\` 指到 \`NewLogger\`，實際上會建立兩個不同的 \`NewLogger\` 實體：

\`\`\`ts
[
  NewLogger,
  { provide: OldLogger, useClass: NewLogger },
]
\`\`\`

正確的 alias provider 要用 \`useExisting\`：

\`\`\`ts
[
  NewLogger,
  { provide: OldLogger, useExisting: NewLogger },
]
\`\`\`

這種情境常出現在改名或重構服務時：新程式碼注入 \`NewLogger\`，舊程式碼暫時還注入 \`OldLogger\`，但兩邊必須共用同一份 logger 狀態。

## useValue 適合注入什麼？

\`useValue\` 適合注入已經建立好的物件、常數設定、測試資料或 feature flags。Angular 不會替 \`useValue\` 建立 class，而是直接回傳指定的值。

例如先準備一個安靜版 logger：

\`\`\`ts
export function SilentLoggerFn() {}

const silentLogger = {
  logs: ['Silent logger says "Shhhhh!". Provided via "useValue"'],
  log: SilentLoggerFn,
};
\`\`\`

再用 \`Logger\` token 提供這個現成物件：

\`\`\`ts
[{ provide: Logger, useValue: silentLogger }]
\`\`\`

這樣 component 還是注入 \`Logger\`，但 Angular 回傳的是 \`silentLogger\`。單元測試常用這招把真正會打 API、寫 log 或存資料的服務換成固定假資料。

## useFactory 什麼時候該用？

\`useFactory\` 適合在服務建立時需要依條件決定參數或實作的情境。factory function 可以接收其他已注入服務，再回傳真正要使用的物件。

假設 \`HeroService\` 需要根據使用者權限決定是否回傳秘密英雄，可以讓 constructor 接收 \`Logger\` 和授權狀態：

\`\`\`ts
constructor(
  private logger: Logger,
  private isAuthorized: boolean,
) {}

getHeroes() {
  const auth = this.isAuthorized ? 'authorized ' : 'unauthorized';
  this.logger.log(\`Getting heroes for \${auth} user.\`);
  return HEROES.filter(hero => this.isAuthorized || !hero.isSecret);
}
\`\`\`

再把建立邏輯包成 factory：

\`\`\`ts
const heroServiceFactory = (logger: Logger, userService: UserService) => {
  return new HeroService(logger, userService.user.isAuthorized);
};
\`\`\`

provider 宣告如下：

\`\`\`ts
export const heroServiceProvider = {
  provide: HeroService,
  useFactory: heroServiceFactory,
  deps: [Logger, UserService],
};
\`\`\`

\`useFactory\` 告訴 Angular 這個 provider 由 factory function 產生；\`deps\` 則列出 factory 需要的依賴。Angular 會依 \`deps\` 順序把 \`Logger\` 和 \`UserService\` 注入到 \`heroServiceFactory\` 參數。

## InjectionToken 為什麼適合注入設定值？

\`InjectionToken\` 適合注入 interface、字串、布林值、設定物件等非 class 依賴。TypeScript 型別在編譯後會消失，因此不能直接拿 interface 當 DI token。

例如要注入一份 application config：

\`\`\`ts
export const HERO_DI_CONFIG: AppConfig = {
  apiEndpoint: 'api.heroes.com',
  title: 'Dependency Injection',
};
\`\`\`

不能直接用 \`AppConfig\` 這個 interface 當 token：

\`\`\`ts
[{ provide: AppConfig, useValue: HERO_DI_CONFIG }]
\`\`\`

原因是 TypeScript interface 只存在於編譯期，轉成 JavaScript 後沒有可供 Angular injector 查找的 runtime token。比較穩定的寫法是建立 \`InjectionToken\`：

\`\`\`ts
import { InjectionToken } from '@angular/core';

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');
\`\`\`

註冊 provider：

\`\`\`ts
providers: [{ provide: APP_CONFIG, useValue: HERO_DI_CONFIG }]
\`\`\`

注入設定值：

\`\`\`ts
constructor(@Inject(APP_CONFIG) config: AppConfig) {
  this.title = config.title;
}
\`\`\`

## @Optional() 可以解決什麼問題？

\`@Optional()\` 讓某個依賴找不到 provider 時不拋錯，而是回傳 \`null\`。這適合可有可無的 logger、外掛功能或只在特定環境註冊的服務。

先從 Angular core 匯入 \`Optional\`：

\`\`\`ts
import { Optional } from '@angular/core';
\`\`\`

在 constructor 裡標記可選依賴：

\`\`\`ts
constructor(@Optional() private logger: Logger) {
  if (this.logger) {
    this.logger.log(someMessage);
  }
}
\`\`\`

沒有 \`@Optional()\` 時，如果 Angular 找不到 \`Logger\` provider，應用程式會在建立 class 時出錯。加上 \`@Optional()\` 後，程式可以自行判斷是否有 logger，再決定要不要執行相關行為。

## Angular 分層注入系統怎麼隔離服務狀態？

Angular injector 是分層的，同一個 service 在不同層級註冊會產生不同實體。利用 component-level provider，可以讓每個 component instance 擁有互不干擾的狀態。

下面這張圖是來源筆記中的階層例子：\`HeroesListComponent\` 底下有三個 \`HeroTaxReturnComponent\`，每個子元件都需要自己的 \`HeroTaxReturnService\` 保存稅單資料。

![HeroesListComponent 與 HeroTaxReturnComponent 的 component 階層](/images/tech/angular-service-di-component-hierarchy.png)

如果 \`HeroTaxReturnService\` 是 application-wide singleton，三個 \`HeroTaxReturnComponent\` 會共用同一份 tax return state，任何一個元件修改資料都可能覆蓋其他英雄的稅單。把 \`HeroTaxReturnService\` 放進 \`HeroTaxReturnComponent.providers\`，每個 component instance 就會拿到自己的服務實體：

\`\`\`ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HeroTaxReturn } from './hero';
import { HeroTaxReturnService } from './hero-tax-return.service';

@Component({
  selector: 'app-hero-tax-return',
  templateUrl: './hero-tax-return.component.html',
  styleUrls: ['./hero-tax-return.component.css'],
  providers: [HeroTaxReturnService],
})
export class HeroTaxReturnComponent {
  message = '';
  @Output() close = new EventEmitter<void>();

  get taxReturn(): HeroTaxReturn {
    return this.heroTaxReturnService.taxReturn;
  }

  @Input()
  set taxReturn(htr: HeroTaxReturn) {
    this.heroTaxReturnService.taxReturn = htr;
  }

  constructor(private heroTaxReturnService: HeroTaxReturnService) {}

  onCanceled() {
    this.flashMessage('Canceled');
    this.heroTaxReturnService.restoreTaxReturn();
  }

  onClose() {
    this.close.emit();
  }

  onSaved() {
    this.flashMessage('Saved');
    this.heroTaxReturnService.saveTaxReturn();
  }

  flashMessage(msg: string) {
    this.message = msg;
    setTimeout(() => (this.message = ''), 500);
  }
}
\`\`\`

這段範例的重點不是稅單功能，而是 service state 的隔離：資料如果跟某個 component instance 綁在一起，就把 provider 放在該 component；資料如果需要跨頁共享，就放在更外層。

## Angular DI provider 寫法怎麼選？

Angular DI provider 可以用「要提供的是 class、既有實體、固定值，還是動態建立邏輯」來判斷。選錯 provider 類型，最常見問題是多出不預期的 service instance。

| 需求 | 建議寫法 | 重點 |
| --- | --- | --- |
| 注入一般 class service | \`providers: [Logger]\` | 等同 \`{ provide: Logger, useClass: Logger }\` |
| 用新實作取代舊 token | \`{ provide: Logger, useClass: BetterLogger }\` | 會建立 \`BetterLogger\` 實體 |
| 讓舊 token 指向新 token | \`{ provide: OldLogger, useExisting: NewLogger }\` | 兩個 token 共用同一個實體 |
| 注入固定物件或設定 | \`{ provide: APP_CONFIG, useValue: config }\` | 適合常數、mock、feature flags |
| 依條件建立服務 | \`{ provide: HeroService, useFactory, deps }\` | 適合需要其他服務協助建立的物件 |
| 注入 interface 或非 class 依賴 | \`new InjectionToken<T>()\` | interface 不存在於 JavaScript runtime |

我自己在讀 Angular 舊專案時，會先搜尋 \`providers:\`，再檢查同一個 token 是否出現在 root、module、component 多個層級。這比單看 constructor 更快找出「為什麼這裡拿到的 service state 跟別處不一樣」。

## 常見問題

Angular Service 依賴注入常見問題通常不是語法，而是 provider 層級與 token 對應關係。以下整理實作時最容易混淆的幾個點。

### Angular Service 一定要加 \`@Injectable()\` 嗎？

Service class 若需要被 Angular 建立或本身還要注入其他依賴，建議加上 \`@Injectable()\`。新版 Angular 常搭配 \`@Injectable({ providedIn: 'root' })\`，舊版 NgModule 專案則常在 \`providers\` 陣列中註冊。

### \`providers: [Logger]\` 和 \`{ provide: Logger, useClass: Logger }\` 有差嗎？

沒有本質差異。\`providers: [Logger]\` 是簡寫，Angular 會把它視為 \`{ provide: Logger, useClass: Logger }\`，也就是用 \`Logger\` token 建立 \`Logger\` class 實體。

### 什麼時候要把 Service 放在 Component providers？

當 service 的狀態只屬於某個 component instance，而且不該被兄弟元件共享時，就適合放在 \`@Component.providers\`。表單暫存、局部編輯狀態、每個列表項目自己的操作狀態，都是常見例子。

### \`useClass\` 和 \`useExisting\` 最容易踩到什麼坑？

\`useClass\` 會建立指定 class 的新實體，\`useExisting\` 會回傳已存在 provider 的同一個實體。若只是要替 token 取別名，卻誤用 \`useClass\`，應用程式可能會多出兩份不同狀態的 service。

### 為什麼 interface 不能直接當 Angular DI token？

TypeScript interface 在編譯成 JavaScript 後會消失，Angular runtime 找不到可辨識的 token。要注入設定物件、字串或 interface 型別資料，應建立 \`InjectionToken<T>\` 再搭配 \`useValue\` 或 factory 使用。

### \`@Optional()\` 找不到服務時會回傳什麼？

\`@Optional()\` 找不到對應 provider 時會讓注入值變成 \`null\`，而不是直接拋出錯誤。使用可選服務時，constructor 或後續方法都應檢查該值是否存在。

## 參考資料

- Angular Docs：[Defining dependency providers](https://angular.dev/guide/di/defining-dependency-providers)（存取日期：2026-08-28）
- Angular Docs：[Hierarchical injectors](https://angular.dev/guide/di/hierarchical-dependency-injection)（存取日期：2026-08-28）
- Angular Docs：[Creating and using services](https://angular.dev/guide/di/creating-and-using-services)（存取日期：2026-08-28）
- Jace Ju：[理解 Dependency Injection 實作原理](https://jaceju.net/2014-07-27-php-di-container/)（存取日期：2026-08-28）

## 延伸閱讀

- [Angular NgModule 完整解析：模組結構、依賴注入與 forRoot 用法](/post/angular-ngmodules-explained)：同樣聚焦 Angular、依賴注入，可接著比較不同情境的做法。
- [Angular Service 建立教學：用 CLI 產生 HeroService 並回傳 Observable](/post/angular-create-service-tutorial)：同樣聚焦 Angular、Service，可接著比較不同情境的做法。
- [建立一個 Angular 5 的專案](/post/angular-cli-new-project-setup)：同樣聚焦 Angular、TypeScript，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2026-08-28。2018-01-07 的 Angular 5 學習筆記保留 service DI、provider token、factory provider 與 component-level service 的範例，並補上 GEO 結構、FAQ、參考資料與新版 Angular 文件脈絡。
`;export{e as default};