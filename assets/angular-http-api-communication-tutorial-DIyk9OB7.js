var e=`---
title: Angular HTTP API 溝通教學：HttpClient、Observable 與 CRUD 範例
description: 以 Angular Tour of Heroes 範例說明 HttpClient 如何取得、新增、修改、刪除 API 資料，並整理 Observable、subscribe、async pipe 與搜尋功能的用法。
date: 2017-12-26
category: 前端開發
tags: [Angular, HttpClient, RxJS, API]
readingTime: 13 分鐘
image: /images/tech/hero_angular-httpclient-guide.webp
imageAlt: Angular HttpClient 與 API 請求流程示意圖
---
# Angular HTTP API 溝通教學：HttpClient、Observable 與 CRUD 範例

Angular 與 API 溝通時，可以把讀取、更新、新增、刪除資料集中放在 service 裡，再透過 \`HttpClient\` 回傳 \`Observable\` 給 component 使用。\`HttpClient\` 的請求不會在建立時立刻送出，而是在 \`subscribe\` 或 \`async pipe\` 訂閱後才真正執行，這是新手最容易漏掉的一點。

這篇沿用 Angular Tour of Heroes 的 \`HeroService\` 範例，整理 \`GET\`、\`PUT\`、\`POST\`、\`DELETE\`、錯誤處理與搜尋功能。閱讀前如果先理解 Reactive Programming 與 RxJS，會更容易看懂 \`Observable\`、\`Subject\`、\`pipe\` 與 \`switchMap\` 的角色。

## Angular 如何用 HttpClient 取得 API 資料？

Angular \`HttpClient.get()\` 適合放在 service 裡，讓 component 不直接碰 API 位址。\`HttpClient.get()\` 會回傳 \`Observable\`，訂閱之後才送出 HTTP request。

先把 \`src/app/hero.service.ts\` 從讀取假資料，改成呼叫 API。這裡的 \`heroesUrl\` 指向 \`api/heroes\`，也就是 Tour of Heroes 範例中的英雄資料端點。

\`\`\`ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';

@Injectable()
export class HeroService {
  private heroesUrl = 'api/heroes';

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
  ) {}

  /** 舊寫法：從 mock data 取得資料
  getHeroes(): Observable<Hero[]> {
    this.messageService.add('HeroService: fetched heroes');
    return of(HEROES);
  }
  */

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl);
  }

  getHero(id: number): Observable<Hero> {
    const url = \`\${this.heroesUrl}/\${id}\`;
    return this.http.get<Hero>(url);
  }
}
\`\`\`

所有 \`HttpClient\` 方法都會回傳 \`Observable\`。一般 \`Observable\` 可以持續送出多次資料，但 \`http.get()\` 通常只會送出一次 API 回應，收到資料後就完成。\`http.get()\` 預設會把回應當成 JSON，並依照 TypeScript generic 提供開發時的型別提示。

## Angular HttpClient 發生錯誤時要怎麼處理？

Angular \`HttpClient\` 錯誤處理通常會放在 RxJS \`pipe()\` 裡。用 \`catchError()\` 回傳預設值，可以避免 API 失敗時整個畫面直接中斷。

先導入需要的 RxJS operators：

\`\`\`ts
import { catchError, map, tap } from 'rxjs/operators';
\`\`\`

接著用 \`pipe()\` 擴展 \`Observable\`，並在裡面接上 \`catchError()\`：

\`\`\`ts
getHeroes(): Observable<Hero[]> {
  return this.http.get<Hero[]>(this.heroesUrl).pipe(
    catchError(this.handleError('getHeroes', [])),
  );
}
\`\`\`

錯誤處理函式可以寫成通用 helper。\`operation\` 用來標記是哪一個操作失敗，\`result\` 則是 API 失敗時要回傳的預設資料。

\`\`\`ts
/**
 * 處理 HTTP 錯誤，讓應用程式可以繼續運作而不直接丟出 exception。
 * @param operation - 失敗的操作，例如 getHeroes
 * @param result - API 失敗時要回傳的 Observable 內容
 */
private handleError<T>(operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {
    return of(result as T);
  };
}
\`\`\`

在這個例子中，\`T\` 代表類型參數。當 \`getHeroes()\` 呼叫 \`handleError('getHeroes', [])\` 時，\`T\` 會對應到 \`Hero[]\`，所以 API 失敗仍能回傳 component 預期的資料型態。

## Angular 如何用 PUT 修改伺服器資料？

Angular 修改伺服器資料時常用 \`HttpClient.put()\`。\`put()\` 主要接收三個參數：API 網址、要更新的資料，以及 headers 等 request options。

![Angular HttpClient put 方法參數截圖](/images/tech/angular-http-api-communication-tutorial-put-options.png)

在 \`HeroService\` 裡新增更新英雄資料的方法：

\`\`\`ts
/** 更新伺服器上的資料 */
updateHero(hero: Hero): Observable<any> {
  return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
    tap(_ => this.log(\`updated hero id=\${hero.id}\`)),
    catchError(this.handleError<any>('updateHero')),
  );
}
\`\`\`

\`httpOptions\` 常見用途是設定 headers。傳送 JSON 給 API 時，可以明確宣告 \`Content-Type\`：

\`\`\`ts
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
\`\`\`

component 呼叫 \`updateHero()\` 時，也要訂閱 \`Observable\`。以下範例是在儲存完成後回到上一頁：

\`\`\`ts
save(): void {
  this.heroService.updateHero(this.hero)
    .subscribe(() => this.goBack());
}
\`\`\`

RxJS 裡常見的兩個角色是 \`Observable\` 和 \`Subscription\`。\`Observable\` 負責產生資料，但建立後不會馬上啟動；\`Subscription\` 則代表某個訂閱動作，訂閱後才開始執行資料流。

## Angular 如何用 POST 新增伺服器資料？

Angular 新增資料時常用 \`HttpClient.post()\`。\`post()\` 會把新物件送到 API，伺服器通常會回傳新增後的完整資料，例如補上 \`id\` 的英雄物件。

在 \`HeroService\` 新增 \`addHero()\`：

\`\`\`ts
addHero(hero: Hero): Observable<Hero> {
  return this.http.post<Hero>(this.heroesUrl, hero, httpOptions).pipe(
    catchError(this.handleError<Hero>('addHero')),
  );
}
\`\`\`

component 使用 \`addHero()\` 時，可以先整理輸入值，再把 API 回傳的新英雄塞回列表：

\`\`\`ts
add(name: string): void {
  name = name.trim();
  if (!name) {
    return;
  }

  this.heroService.addHero({ name } as Hero)
    .subscribe(hero => {
      this.heroes.push(hero);
    });
}
\`\`\`

\`{ name } as Hero\` 代表建立一個只有 \`name\` 的 \`Hero\` 物件。這個物件送到 API 後，伺服器會負責建立完整資料，回傳後再更新畫面上的 \`heroes\` 陣列。

## Angular 如何用 DELETE 刪除伺服器資料？

Angular 刪除資料時常用 \`HttpClient.delete()\`。即使刪除成功後不需要處理回傳值，也仍然要訂閱 \`Observable\`，否則 HTTP delete request 不會送出。

在 \`HeroService\` 新增 \`deleteHero()\`：

\`\`\`ts
deleteHero(hero: Hero | number): Observable<Hero> {
  const id = typeof hero === 'number' ? hero : hero.id;
  const url = \`\${this.heroesUrl}/\${id}\`;

  return this.http.delete<Hero>(url, httpOptions);
}
\`\`\`

component 呼叫刪除時，可以先從畫面列表移除，再呼叫 API：

\`\`\`ts
delete(hero: Hero): void {
  this.heroes = this.heroes.filter(h => h !== hero);
  this.heroService.deleteHero(hero).subscribe();
}
\`\`\`

這段程式碼的重點是最後的 \`subscribe()\`。\`HttpClient.delete()\` 回傳的 \`Observable\` 需要被訂閱才會執行，所以不能因為「刪除完成後沒有下一步」就省略訂閱。

## Angular 搜尋功能如何搭配 Subject、async pipe 與 switchMap？

Angular 搜尋功能可以用 \`Subject\` 收集鍵盤輸入，再用 \`debounceTime()\`、\`distinctUntilChanged()\` 與 \`switchMap()\` 控制 API 查詢節奏。\`async pipe\` 會自動訂閱畫面上的 \`Observable\`。

先在 \`src/app/hero.service.ts\` 增加搜尋方法。若搜尋字串是空白，就直接回傳空陣列，避免送出沒有意義的 API request。

\`\`\`ts
searchHeroes(term: string): Observable<Hero[]> {
  if (!term.trim()) {
    return of([]);
  }

  return this.http.get<Hero[]>(\`api/heroes/?name=\${term}\`).pipe(
    tap(_ => this.log(\`found heroes matching "\${term}"\`)),
    catchError(this.handleError<Hero[]>('searchHeroes', [])),
  );
}
\`\`\`

建立 \`HeroSearchComponent\`：

\`\`\`bash
ng generate component hero-search
\`\`\`

修改 \`src/app/hero-search/hero-search.component.html\`：

\`\`\`html
<div id="search-component">
  <h4>Hero Search</h4>

  <input #searchBox id="search-box" (keyup)="search(searchBox.value)" />

  <ul class="search-result">
    <li *ngFor="let hero of heroes$ | async">
      <a routerLink="/detail/{{hero.id}}">
        {{hero.name}}
      </a>
    </li>
  </ul>
</div>
\`\`\`

\`heroes$ | async\` 這一段很關鍵。\`heroes$\` 是 \`Observable<Hero[]>\`，不能直接當一般陣列使用；\`async pipe\` 會替 template 自動訂閱資料流，資料更新時也會更新畫面。

接著修改 \`src/app/hero-search/hero-search.component.ts\`：

\`\`\`ts
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';

import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css'],
})
export class HeroSearchComponent implements OnInit {
  heroes$: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) {}

  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.heroService.searchHeroes(term)),
    );
  }
}
\`\`\`

\`Subject\` 本身也是一種 \`Observable\`，可以用 \`next(value)\` 把新值推進資料流。這裡的 \`search()\` 與 \`keyup\` 事件綁定，所以每次使用者輸入文字時，\`searchTerms\` 都會收到新的搜尋字串。

\`\`\`html
<input #searchBox id="search-box" (keyup)="search(searchBox.value)" />
\`\`\`

搜尋資料流的三個 operator 分工如下：

| Operator | 作用 | 為什麼搜尋功能需要 |
|---|---|---|
| \`debounceTime(300)\` | 每次輸入後等待 300 毫秒 | 避免每打一個字就立刻查 API |
| \`distinctUntilChanged()\` | 搜尋字串與上次相同就忽略 | 避免重複查同一個關鍵字 |
| \`switchMap()\` | 新查詢進來時只保留最新結果 | 避免較晚回來的舊 request 蓋掉新結果 |

\`switchMap()\` 可以處理多個 HTTP request 回傳順序不固定的問題。即使前一個 HTTP request 還在進行，\`switchMap()\` 也只會把最新搜尋字串對應的結果交給畫面使用；舊結果抵達應用程式前會被丟棄。

完成後，搜尋元件畫面會像下面這樣：

![Angular Tour of Heroes 搜尋結果範例](/images/tech/angular-http-api-communication-tutorial-hero-search.png)

## Angular HttpClient 新手最容易漏掉哪些細節？

Angular HttpClient 新手最容易漏掉三件事：沒有訂閱就不會送出請求、TypeScript generic 不等於 runtime 驗證，以及搜尋時要避免舊結果覆蓋新結果。

把這篇的重點整理成檢查表：

| 檢查項目 | 判斷方式 |
|---|---|
| 是否真的送出 request | 確認有 \`subscribe()\`、\`async pipe\`，或其他訂閱方式 |
| 回傳型別是否符合畫面需要 | \`http.get<Hero[]>()\` 只能提供編譯期提示，API 邊界仍要小心資料格式 |
| API 失敗時畫面是否能繼續運作 | 用 \`catchError()\` 回傳預設值，避免 component 收到非預期資料 |
| 修改資料是否有設定 headers | 傳送 JSON 時設定 \`Content-Type: application/json\` |
| 搜尋是否造成過多 request | 用 \`debounceTime()\` 與 \`distinctUntilChanged()\` 控制查詢頻率 |
| 搜尋結果是否可能被舊 request 覆蓋 | 用 \`switchMap()\` 只保留最新搜尋結果 |

實作 CRUD 時，我會先把 API 呼叫都集中在 service，再讓 component 只處理畫面事件與狀態更新。這樣後續要加錯誤訊息、loading 狀態、token header 或測試替身，都不需要到每個 component 裡翻找 API 邏輯。

## 常見問題

### Angular HttpClient 為什麼一定要 subscribe？

Angular \`HttpClient\` 回傳的 \`Observable\` 是 lazy 的資料流。沒有 \`subscribe()\`、\`async pipe\` 或其他訂閱方式時，HTTP request 不會真正送到伺服器。

### Angular HttpClient GET 會回傳幾次資料？

Angular \`HttpClient.get()\` 通常只會回傳一次 API response，接著就完成。一般 \`Observable\` 可以持續送出多次資料，但 HTTP request 的生命週期通常是「送出一次、收到一次、結束」。

### Angular HttpClient 的 generic 會檢查 JSON 格式嗎？

Angular \`http.get<Hero[]>()\` 的 generic 只提供 TypeScript 編譯期型別提示，不會在 runtime 檢查 API 回傳是否真的符合 \`Hero[]\`。重要 API 建議在資料進入應用程式邊界時再做驗證或防呆。

### Angular 搜尋功能為什麼常用 async pipe？

Angular \`async pipe\` 可以在 template 自動訂閱 \`Observable\`，資料更新時刷新畫面，component 銷毀時也會取消訂閱。搜尋結果這種畫面資料流很適合交給 \`async pipe\` 處理。

### Angular 搜尋功能為什麼要用 switchMap？

Angular 搜尋功能會隨著鍵盤輸入送出多次 request，舊 request 可能比新 request 晚回來。\`switchMap()\` 會只保留最新搜尋字串對應的結果，避免畫面被過期資料覆蓋。

## 參考資料

- TechBridge：[Reactive Programming 簡介與教學（以 RxJS 為例）](https://blog.techbridge.cc/2016/05/28/reactive-programming-intro-by-rxjs/)
- ReactiveX：[ReactiveX 官方網站](https://reactivex.io/)
- iT 邦幫忙：[30 天精通 RxJS](https://ithelp.ithome.com.tw/users/20103367/ironman/1199)
- Angular：[Tour of Heroes Part 6 live example](https://angular.io/generated/live-examples/toh-pt6/eplnkr.html)
- Angular：[Tour of Heroes Part 6 download example](https://angular.io/generated/zips/toh-pt6/toh-pt6.zip)

## 延伸閱讀

- [Angular HttpClient 教學：GET、POST、Header、Params 與錯誤處理](/post/angular-httpclient-guide)：同樣聚焦 Angular、HttpClient，可接著比較不同情境的做法。
- [Angular Service 建立教學：用 CLI 產生 HeroService 並回傳 Observable](/post/angular-create-service-tutorial)：同樣聚焦 Angular、RxJS，可接著比較不同情境的做法。
- [Angular 組件間溝通教學：Input、Output、ViewChild 與 Service](/post/angular-component-communication)：同樣聚焦 Angular、RxJS，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2026-08-28。
`;export{e as default};