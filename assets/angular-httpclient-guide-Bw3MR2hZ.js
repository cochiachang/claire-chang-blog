var e=`---
title: Angular HttpClient 教學：GET、POST、Header、Params 與錯誤處理
description: 介紹 Angular HttpClient 的基本用法，包含型別化回應、完整 Response、錯誤處理、重試、非 JSON 資料與 request header。
date: 2018-01-08
category: 前端開發
tags: [Angular, HttpClient, RxJS]
readingTime: 8 分鐘
image: /images/tech/hero_angular-httpclient-guide.webp
imageAlt: Angular HttpClient 與 API 請求流程示意圖
---
# Angular HttpClient 教學：GET、POST、Header、Params 與錯誤處理

Angular HttpClient 是 Angular 與後端 API 溝通的標準工具，可處理 GET、POST、Header、URL Params、錯誤回應與不同 response type。HttpClient 回傳 Observable，請求會在 \`subscribe\` 或被轉成 Promise 後才真正送出。

## 如何在 Angular 使用 HttpClient？

Angular HttpClient 需要先匯入 HTTP 模組，再透過 dependency injection 注入 component 或 service。舊版 Angular 使用 \`HttpClientModule\`，新版 standalone 專案常用 \`provideHttpClient()\`。

舊版 NgModule 寫法：

\`\`\`ts
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [HttpClientModule],
})
export class AppModule {}
\`\`\`

在 component 或 service 注入：

\`\`\`ts
import { HttpClient } from '@angular/common/http';

@Component(...)
export class MyComponent implements OnInit {
  results: string[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('/api/items').subscribe(data => {
      this.results = data['results'];
    });
  }
}
\`\`\`

## 如何定義 HttpClient 回傳格式？

HttpClient 可以用 TypeScript generic 指定回傳型別。指定型別後，程式碼可直接讀取已知欄位，減少用字串索引造成的錯誤。

假設 API 回傳：

\`\`\`json
{
  "results": ["Item 1", "Item 2"]
}
\`\`\`

先建立介面：

\`\`\`ts
interface ItemsResponse {
  results: string[];
}
\`\`\`

再設定 \`get\` 的回傳型別：

\`\`\`ts
this.http.get<ItemsResponse>('/api/items').subscribe(data => {
  this.results = data.results;
});
\`\`\`

資訊增益：HttpClient 的 generic 只提供 TypeScript 編譯期協助，不會在 runtime 驗證 API 真的符合格式。重要資料仍應在邊界做 schema 驗證。

## 如何取得完整 HTTP Response 與 Header？

HttpClient 預設只回傳 body。若需要讀取 response header、status code 或完整 HttpResponse，可把 \`observe\` 設成 \`response\`。

範例：

\`\`\`ts
this.http
  .get<MyJsonData>('/data.json', { observe: 'response' })
  .subscribe(resp => {
    console.log(resp.status);
    console.log(resp.headers.get('X-Custom-Header'));
    console.log(resp.body?.someField);
  });
\`\`\`

這種寫法常用在分頁 API，因為後端可能把總筆數放在 \`X-Total-Count\` 或 \`Link\` header，而不是 body。

## 如何處理 HttpClient 錯誤與重試？

HttpClient 錯誤應集中處理 \`HttpErrorResponse\`，並區分網路錯誤與後端狀態碼。重試可以用 RxJS \`retry\`，但不要對非冪等 POST 無條件重試。

錯誤處理範例：

\`\`\`ts
import { HttpErrorResponse } from '@angular/common/http';

this.http.get<ItemsResponse>('/api/items').subscribe({
  next: data => {
    this.results = data.results;
  },
  error: (err: HttpErrorResponse) => {
    if (err.error instanceof ErrorEvent) {
      console.log('Client or network error:', err.error.message);
    } else {
      console.log(\`Backend returned \${err.status}\`, err.error);
    }
  },
});
\`\`\`

重試範例：

\`\`\`ts
import { retry } from 'rxjs/operators';

this.http
  .get<ItemsResponse>('/api/items')
  .pipe(retry(3))
  .subscribe(...);
\`\`\`

## 如何接收非 JSON 資料？

HttpClient 預設把回應當成 JSON。若 API 回傳純文字、Blob 或 ArrayBuffer，需要設定 \`responseType\`。

純文字範例：

\`\`\`ts
this.http
  .get('/textfile.txt', { responseType: 'text' })
  .subscribe(data => console.log(data));
\`\`\`

常見 response type：

| responseType | 回傳型別 | 常見用途 |
| --- | --- | --- |
| \`json\` | 物件 | API 資料 |
| \`text\` | 字串 | 純文字、HTML |
| \`blob\` | Blob | 檔案下載 |
| \`arraybuffer\` | ArrayBuffer | 二進位資料 |

## 如何設定 POST、Header 與 URL Params？

POST 會把 body 傳給後端，Header 與 Params 則透過 options 設定。\`HttpHeaders\` 與 \`HttpParams\` 是 immutable，每次 \`set()\` 都會回傳新實例。

POST 範例：

\`\`\`ts
const body = { name: 'Brad' };

this.http.post('/api/developers/add', body).subscribe(...);
\`\`\`

設定 header：

\`\`\`ts
import { HttpHeaders } from '@angular/common/http';

this.http
  .post('/api/items/add', body, {
    headers: new HttpHeaders().set('Authorization', 'Bearer token'),
  })
  .subscribe();
\`\`\`

設定 URL params：

\`\`\`ts
import { HttpParams } from '@angular/common/http';

this.http
  .post('/api/items/add', body, {
    params: new HttpParams().set('id', '3'),
  })
  .subscribe();
\`\`\`

## 常見問題

### Angular HttpClient 為什麼沒有送出 request？

HttpClient 回傳的是 Observable。若沒有 \`subscribe\`、\`async pipe\` 或轉成 Promise 後等待結果，請求不會真正執行。

### HttpClient generic 會驗證 API 格式嗎？

不會。\`http.get<MyType>()\` 只讓 TypeScript 在編譯期知道預期型別，runtime 仍需要自行驗證重要欄位。

### Angular 下載檔案要用什麼 responseType？

下載檔案通常使用 \`responseType: 'blob'\`。如果還要讀取檔名 header，需搭配 \`observe: 'response'\`。

### \`HttpHeaders.set()\` 為什麼看起來沒生效？

\`HttpHeaders\` 是 immutable。呼叫 \`set()\` 會回傳新的物件，因此要把回傳值傳入 request options。

### 可以對所有錯誤都使用 \`retry(3)\` 嗎？

不建議。GET 查詢通常較安全，POST、付款、建立訂單等操作可能造成重複提交，應由後端冪等設計配合。

## 參考資料

- Angular Docs：[HttpClient](https://angular.dev/guide/http)
- Angular API：[HttpErrorResponse](https://angular.dev/api/common/http/HttpErrorResponse)
- RxJS Docs：[retry](https://rxjs.dev/api/operators/retry)

## 延伸閱讀

- [Angular HTTP API 溝通教學：HttpClient、Observable 與 CRUD 範例](/post/angular-http-api-communication-tutorial)：同樣聚焦 Angular、HttpClient，可接著比較不同情境的做法。
- [Angular Service 建立教學：用 CLI 產生 HeroService 並回傳 Observable](/post/angular-create-service-tutorial)：同樣聚焦 Angular、RxJS，可接著比較不同情境的做法。
- [Angular 組件間溝通教學：Input、Output、ViewChild 與 Service](/post/angular-component-communication)：同樣聚焦 Angular、RxJS，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2026-08-28。原文發布於 2018-01-08，本文保留 Angular HttpClient 基礎範例，並補上新版 RxJS 寫法提醒。

`;export{e as default};