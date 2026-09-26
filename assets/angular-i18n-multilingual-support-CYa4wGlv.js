var e=`---
title: Angular i18n 多語系支援教學：Locale、XLF 翻譯檔與 AOT/JIT 合併方式
description: 整理 Angular i18n 多語系支援的實作流程，包含 LOCALE_ID、registerLocaleData、template i18n 標記、XLF 翻譯檔、HTML 屬性翻譯、plural/select 語法，以及 AOT 與 JIT 合併翻譯檔的差異。
date: 2018-01-11
category: 前端開發
tags: [Angular, i18n, 多語系, XLF, LOCALE_ID]
readingTime: 10 分鐘
image: /images/tech/hero_angular-i18n-multilingual-support.webp
imageAlt: 多語系網站與地區化設定的前端開發示意圖
---
# Angular i18n 多語系支援教學：Locale、XLF 翻譯檔與 AOT/JIT 合併方式

Angular i18n 可以處理日期、數字、百分比、貨幣格式，也能翻譯 template 文字、HTML 屬性、單複數與條件式字串。這篇整理 Angular 5 時期的官方 i18n 流程：先在 template 加上 \`i18n\` 標記，再用 CLI 產生 XLF 翻譯來源檔，最後用 AOT 或 JIT 把翻譯檔合併回應用程式。

## Angular i18n 可以支援哪些多語系需求？

Angular i18n 的核心用途是讓同一個 Angular 專案輸出不同語言版本，並讓日期、貨幣與數字格式符合目標地區。Angular i18n 適合靜態文案較明確、可在建置階段產生語言版本的網站。

Angular i18n 可以做到的事包括：

- 以本地格式顯示日期、數量、百分比和貨幣。
- 在 component template 中翻譯文字。
- 翻譯單數和複數。
- 翻譯 HTML 屬性的替代文字，例如圖片 \`title\` 或 \`alt\`。

可以透過 Angular CLI 產生 XLF 檔案，再透過 XLF 檔案設定多語系字串。產生特定語系網站時，可以使用：

\`\`\`cmd
ng serve --aot --locale zh-Hant
\`\`\`

Angular i18n 的實作方式，是讓每個語言獨立產生一個 \`index.html\` 版本。優點是網站瀏覽速度較快，缺點是修改翻譯或程式後，需要重新 build 的工程較大。

## Angular locale 與 LOCALE_ID 要怎麼設定？

Angular locale 決定日期、數字、百分比與貨幣 pipe 的顯示格式。Angular 預設使用 \`en-US\`，如果要改成 \`zh-Hant\`、\`fr\` 等語系，需要設定 \`LOCALE_ID\` 或註冊 locale data。

如果使用 JIT 方式部署網站，需要在頁面設定 [\`LOCALE_ID\`](https://angular.io/api/core/LOCALE_ID) 的值：

\`\`\`js
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from '../src/app/app.component';

@NgModule({
  imports: [ BrowserModule ],
  declarations: [ AppComponent ],
  providers: [ { provide: LOCALE_ID, useValue: 'zh-Hant' } ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
\`\`\`

Angular 5 的地區設定使用 [BCP 47](https://www.rfc-editor.org/rfc/bcp/bcp47.txt) 語言標籤。Angular 支援的 locale 可參考 [Angular repository locales](https://github.com/angular/angular/tree/master/packages/common/locales)。

| LOCALE NAME | OLD LOCALE ID | NEW LOCALE ID |
|---|---|---|
| Indonesian | \`in\` | \`id\` |
| Hebrew | \`iw\` | \`he\` |
| Romanian Moldova | \`mo\` | \`ro-MD\` |
| Norwegian Bokmal | \`no\`, \`no-NO\` | \`nb\` |
| Serbian Latin | \`sh\` | \`sr-Latn\` |
| Filipino | \`tl\` | \`fil\` |
| Portuguese Brazil | \`pt-BR\` | \`pt\` |
| Chinese Simplified | \`zh-cn\`, \`zh-Hans-CN\` | \`zh-Hans\` |
| Chinese Traditional | \`zh-tw\`, \`zh-Hant-TW\` | \`zh-Hant\` |
| Chinese Traditional Hong Kong | \`zh-hk\` | \`zh-Hant-HK\` |

## DatePipe、CurrencyPipe、DecimalPipe 與 PercentPipe 如何套用本地格式？

Angular 的 \`DatePipe\`、\`CurrencyPipe\`、\`DecimalPipe\` 和 \`PercentPipe\` 預設都使用 \`en-US\` 的語言環境資料。若專案要顯示其他地區格式，需要匯入並註冊該地區的 locale data。

Angular CLI 的 \`--locale\` 會自動處理這部分。若要手動設定，可以使用 \`registerLocaleData\`：

\`\`\`js
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

// the second parameter 'fr' is optional
registerLocaleData(localeFr, 'fr');
\`\`\`

這個設定會影響 pipe 的輸出格式。例如同一個日期或貨幣值，在 \`en-US\`、\`fr\`、\`zh-Hant\` 下會以不同符號、順序與分隔方式呈現。

## Angular template 文字要怎麼標記成可翻譯？

Angular template 的多語系流程，是先用預設語言開發畫面，再替需要翻譯的文字加上 \`i18n\` 標記。接著用 Angular CLI 匯出 \`messages.xlf\`，交給翻譯流程處理。

開發時先使用預設語言：

\`\`\`html
<h1>Hello i18n!</h1>
\`\`\`

替文字加上 \`i18n\` 標記：

\`\`\`html
<h1 i18n>Hello i18n!</h1>
\`\`\`

使用 CLI 產生 \`messages.xlf\`：

\`\`\`cmd
ng xi18n
\`\`\`

將完成的翻譯文件合併到應用程式中：

\`\`\`cmd
ng serve --aot --i18nFile=src/locale/messages.fr.xlf --i18nFormat=xlf --locale=fr
\`\`\`

為了讓翻譯者更準確理解文案用途，可以在 \`i18n\` 指令裡增加上下文說明：

\`\`\`html
<h1 i18n="An introduction header for this sample">Hello i18n!</h1>
\`\`\`

如果相同文字在不同位置需要不同翻譯，可以加上 \`meaning\`。格式是 \`meaning|description\`：

\`\`\`html
<h1 i18n="site header|An introduction header for this sample">Hello i18n!</h1>
\`\`\`

若翻譯字串相同但 \`meaning\` 不同，Angular 會產生不同翻譯。若翻譯字串相同、只有 \`description\` 不同，Angular 仍會視為相同翻譯。

## Angular i18n 的自訂 ID 要注意什麼？

Angular i18n 可以用 \`@@id\` 自訂翻譯字串 ID，讓翻譯檔中的識別碼更穩定。自訂 ID 要保持唯一，否則不同文案可能在翻譯後被套成同一個字串。

自訂翻譯 ID 的寫法如下：

\`\`\`html
<h1 i18n="@@introductionHeader">Hello i18n!</h1>
\`\`\`

如果兩個不同的翻譯字串使用相同 ID，就會造成翻譯後出現相同字串：

\`\`\`html
<h3 i18n="@@myId">Hello</h3>
<p i18n="@@myId">Good bye</p>
\`\`\`

翻譯檔案內容如下：

\`\`\`html
<trans-unit id="myId" datatype="html">
  <source>Hello</source>
  <target state="new">Bonjour</target>
</trans-unit>
\`\`\`

生成的 HTML 內容會變成：

\`\`\`html
<h3>Bonjour</h3>
<p>Bonjour</p>
\`\`\`

如果只是想翻譯文字，不想輸出額外 HTML tag，可以使用 \`ng-container\`：

\`\`\`html
<ng-container i18n>I don't output any element</ng-container>
\`\`\`

## HTML 屬性的替代文字要怎麼做 i18n？

Angular i18n 可以翻譯任何元素的屬性文字，不限於元素內文。需要翻譯圖片 \`title\`、\`alt\` 或其他屬性時，可以使用 \`i18n-title\`、\`i18n-alt\` 這類屬性標記。

假設圖片有純文字的 \`title\`：

\`\`\`html
<img [src]="logo" title="Angular logo">
\`\`\`

可以改成：

\`\`\`html
<img [src]="logo" i18n-title title="Angular logo" />
\`\`\`

這種技術適用於任何元素的任何屬性。若需要指定 meaning、description 和 ID，可以使用：

\`\`\`html
i18n-x="<meaning>|<description>@@<id>"
\`\`\`

其中 \`x\` 是要翻譯的屬性名稱，例如 \`title\` 或 \`alt\`。

## Angular i18n 如何翻譯單數、複數與條件文字？

Angular i18n 使用 ICU Message Format 處理 plural 與 select。plural 適合處理數量造成的文案差異，select 則適合依變數值顯示不同文字。

在一些語言裡，不同數量會使用不同詞彙。例如時間可以顯示 \`just now\`、\`one minute ago\` 或 \`x minutes ago\`。

\`\`\`html
<span i18n>Updated {minutes, plural, =0 {just now} =1 {one minute ago} other {{{minutes}} minutes ago}}</span>
\`\`\`

這段語法中：

| 參數 | 說明 |
|---|---|
| \`minutes\` | 要放入翻譯字串的變數 |
| \`plural\` | 翻譯類型，可參考 ICU Message Format |
| \`=0\`、\`=1\`、\`other\` | 不同數量條件對應的顯示文字 |

plural 可設定的選項包括：

- \`=0\` 或任何指定數字
- \`zero\`
- \`one\`
- \`two\`
- \`few\`
- \`many\`
- \`other\`

也可以根據變數內容顯示不同翻譯字串：

\`\`\`html
<span i18n>The author is {gender, select, m {male} f {female} o {other}}</span>
\`\`\`

## 如何用 ng xi18n 產生翻譯來源檔？

\`ng xi18n\` 會從 Angular template 中擷取 i18n 標記，產生預設格式為 XLF 的翻譯來源檔。若翻譯流程使用其他格式，可以透過 \`--i18nFormat\` 指定輸出類型。

產生預設 \`messages.xlf\`：

\`\`\`cmd
ng xi18n
\`\`\`

指定輸出格式：

\`\`\`cmd
ng xi18n --i18nFormat=xlf
ng xi18n --i18nFormat=xlf2
ng xi18n --i18nFormat=xmb
\`\`\`

接著可以把 \`messages.xlf\` 改名為 \`messages.fr.xlf\`，假設翻譯目標語言為法文 \`fr\`。

XLF 檔案內容範例如下：

\`\`\`html
<trans-unit id="introductionHeader" datatype="html">
  <source>Hello i18n!</source>
  <target>Bonjour i18n !</target>
  <note priority="1" from="description">An introduction header for this sample</note>
  <note priority="1" from="meaning">User welcome</note>
</trans-unit>
\`\`\`

\`target\` 裡面要填的，就是目標翻譯語言實際顯示的文字。

## AOT 與 JIT 要怎麼合併 Angular 翻譯檔？

Angular i18n 合併翻譯檔有 AOT 與 JIT 兩種做法。AOT 透過 CLI 參數在建置或 serve 時合併；JIT 則在程式啟動時載入翻譯檔，並提供 \`TRANSLATIONS\` 與 \`TRANSLATIONS_FORMAT\`。

AOT 方式需要三個參數：

| 參數 | 用途 |
|---|---|
| \`--i18nFile\` | 翻譯檔案的位置 |
| \`--i18nFormat\` | 翻譯檔案的格式 |
| \`--locale\` | 被翻譯的語系名稱 |

\`\`\`cmd
ng serve --aot --i18nFile=src/locale/messages.fr.xlf --i18nFormat=xlf --locale=fr
\`\`\`

JIT 方式可以在 \`src/main.ts\` 裡設定所使用的翻譯檔：

\`\`\`js
import { enableProdMode, TRANSLATIONS, TRANSLATIONS_FORMAT } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// use the require method provided by webpack
declare const require;
// we use the webpack raw-loader to return the content as a string
const translations = require(\`raw-loader!./locale/messages.fr.xlf\`);

platformBrowserDynamic().bootstrapModule(AppModule, {
  providers: [
    {provide: TRANSLATIONS, useValue: translations},
    {provide: TRANSLATIONS_FORMAT, useValue: 'xlf'}
  ]
});
\`\`\`

再於 \`src/app/app.module.ts\` 加上 \`LOCALE_ID\`：

\`\`\`js
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from '../src/app/app.component';

@NgModule({
  imports: [ BrowserModule ],
  declarations: [ AppComponent ],
  providers: [ { provide: LOCALE_ID, useValue: 'fr' } ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
\`\`\`

## 常見問題

### Angular i18n 適合用在什麼情境？

Angular i18n 適合需要在建置階段產生不同語言版本的網站，尤其是文案較固定、語系切換不需要即時改變的專案。這種做法讓各語言版本載入速度較快，但翻譯更新後通常需要重新 build。

### Angular i18n 和 ngx-translate 有什麼差別？

Angular i18n 是 Angular 官方提供的國際化流程，偏向編譯或建置階段整合翻譯檔。ngx-translate 則常用於執行期切換語言，適合需要在不重新載入頁面的情境下切換語系的應用程式。

### LOCALE_ID 會自動翻譯畫面文字嗎？

\`LOCALE_ID\` 不會自動翻譯 template 裡的文字。\`LOCALE_ID\` 主要影響日期、數字、百分比與貨幣等格式；畫面文字仍需要透過 \`i18n\` 標記與翻譯檔處理。

### 為什麼要替 i18n 字串加 description 或 meaning？

description 可以讓翻譯者理解文案出現的位置和用途，meaning 則能區分表面文字相同但語意不同的字串。當同一句英文在不同 UI 區塊需要不同翻譯時，meaning 特別重要。

### Angular i18n 的自訂 ID 可以重複嗎？

Angular i18n 的自訂 ID 不應重複使用在不同意思的文案上。若不同字串共用同一個 \`@@id\`，Angular 可能把兩處都套用成同一段翻譯，造成畫面文字錯誤。

## 參考資料

- Angular Docs：[Internationalization (i18n)](https://angular.io/guide/i18n)
- Angular API：[\`LOCALE_ID\`](https://angular.io/api/core/LOCALE_ID)
- Angular repository：[locale data](https://github.com/angular/angular/tree/master/packages/common/locales)
- RFC Editor：[BCP 47 Tags for Identifying Languages](https://www.rfc-editor.org/rfc/bcp/bcp47.txt)
- ICU Documentation：[ICU Message Format](https://userguide.icu-project.org/formatparse/messages)
- 掃文資訊：[angular2 學習筆記 translate, i18n 翻譯](https://tw.saowen.com/a/7c3ca8b189e966a53e4f4743d183347c57b6b5cca6c7b1182f57734202a45c1c)
- 簡書：[使用 Angular-CLI 发布一个 i18n 国际化应用](https://www.jianshu.com/p/ae412f2105c3)
- 點部落：[[MAN鐵人賽]Day 14:AngularJS - Localization](https://dotblogs.com.tw/blackie1019/2013/10/23/125244)
- shady-xia GitHub Pages：[Angular2 中使用 ngx-translate 进行国际化](https://shady-xia.github.io/ng2-i18n/)
- KyleAP Blog：[[Angular2] 在專案加入多國語系](https://kyleap.blogspot.tw/2016/11/angular2.html)

## 延伸閱讀

- [Angular JIT 與 AOT 佈署介紹：編譯模式、效能差異與撰寫限制](/post/angular-jit-aot-deployment)：同樣聚焦 Angular，可接著比較不同情境的做法。
- [建立一個 Angular 5 的專案](/post/angular-cli-new-project-setup)：同樣聚焦 Angular，可接著比較不同情境的做法。
- [Angular Service 建立教學：用 CLI 產生 HeroService 並回傳 Observable](/post/angular-create-service-tutorial)：同樣聚焦 Angular，可接著比較不同情境的做法。

## 最後更新

2018-01-11 首次發布；2026-08-28 依 GEO 結構整理，保留 Angular 5 時期的 i18n 筆記與範例。
`;export{e as default};