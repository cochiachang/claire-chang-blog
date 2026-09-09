var e=`---
title: 建立一個 Angular 5 的專案
description: 用 Angular CLI 建立第一個 Angular 5 專案，並認識 src 與根目錄的檔案結構
date: 2017-12-20
category: 前端開發
tags: [Angular, Angular CLI, TypeScript, 前端框架, 新手教學]
readingTime: 6 分鐘
image: /images/tech/hero_angular-cli-new-project-setup.webp
imageAlt: 深色背景的程式碼編輯器畫面，顯示 HTML 與 CSS class 標籤
---


# 建立一個 Angular 5 的專案

用 Angular CLI 建立一個新專案，只需要一行指令：\`ng new my-app\`。這篇記錄從安裝條件、建立專案、修改第一個頁面，到搞懂 \`src\` 資料夾和根目錄每個檔案是做什麼用的完整過程，是我讀 Angular 官方文件時做的學習筆記，也是「新手教程」系列的第一篇。

## 建立 Angular 5 專案前要先裝什麼？

建立 Angular 5 專案前，電腦需要先裝好 Node.js（6.9.x 以上版本）和 npm（3.x.x 以上版本），這是 Angular CLI 能正常運作的前提。版本太舊的話，\`ng new\` 這類指令可能會直接失敗或裝出有問題的相依套件，所以動手前先確認版本沒錯,能省下不少除錯時間。

## 怎麼用 Angular CLI 建立新專案？

確認好 Node.js 和 npm 版本之後，建立專案只要一行指令：

\`\`\`js
ng new my-app
\`\`\`

Angular CLI 會自動產生完整的專案骨架,包含 TypeScript 設定、測試環境、開發用的 web server 設定,不用自己從零手刻。

建好之後,進到專案資料夾並啟動開發伺服器:

\`\`\`js
cd my-app
ng serve --open
\`\`\`

\`--open\` 參數會直接開啟瀏覽器並導到本機開發網址,省去手動輸入的步驟。

## 如何修改第一個自己的頁面？

Angular CLI 產生的預設頁面套著官方的歡迎畫面,實際開發時第一步通常是把它換成自己的內容。打開 \`src/app/app.component.ts\`,把 class 內容改成:

\`\`\`js
import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = '我的第一個網頁';
}
\`\`\`

再打開 \`src/app/app.component.html\`,把內容整個換成:

\`\`\`html
這是 {{title}}!
\`\`\`

存檔後瀏覽器會自動重新整理,畫面上就會顯示「這是 我的第一個網頁!」——這就是 Angular 的資料綁定(data binding)在起作用,\`title\` 這個屬性的值直接反映到畫面上。

## src 資料夾內每個檔案是做什麼的?

Angular CLI 產生的 \`src\` 資料夾結構固定,每個檔案各司其職。搞懂這張表,之後看任何 Angular 專案的原始碼都不會迷路。

![Angular 5 專案 src 資料夾檔案結構](/images/tech/angular5-src-folder-structure.webp)

| 檔案 | 目的 |
|---|---|
| \`app/app.component.{ts,html,css,spec.ts}\` | 所有的 Component、Service、Pipe、Unit test 等程式碼都放在這個資料夾,\`app.component\` 是 Angular CLI 預設建立的 root component |
| \`app/app.module.ts\` | 預設的 root module,告訴 Angular 有哪些 Component、Module、Service,讓 Angular 知道如何組裝(assemble)這個應用程式 |
| \`assets/*\` | 放圖片或建立應用程式需要用到的素材 |
| \`environments/*\` | 設定 Angular 程式碼會用到的參數,概念類似 \`Web.config\`。預設是 \`environment.ts\`,要產生不同環境的話,命名規則是 \`environment.xxx.ts\`,執行或 build 時加上 \`xxx\` 參數即可指定該環境,例如 \`ng build -xxx\`、\`ng serve -xxx\` |
| \`favicon.ico\` | 網頁頁籤的 icon |
| \`index.html\` | 網頁進入點,使用者拜訪網站時執行的就是這一頁。大部分情況不需要手動編輯,Angular CLI build 時會自動注入需要的 js 和 css |
| \`main.ts\` | 若使用 JIT,這是 JIT compiler 和 bootstrap root module 的地方,也就是編譯的起始點。也可以改用 \`ng serve --aot\` 切換成 AOT 編譯,不用改任何程式碼 |
| \`polyfills.ts\` | 不同瀏覽器支援的 web standards 不一樣,polyfills 用來補足瀏覽器沒支援的部分 |
| \`styles.css\` | 放置 global styles 的 CSS |
| \`test.ts\` | unit test 的進入點,部分 unit test 設定也寫在這裡 |
| \`tsconfig.{app\\|spec}.json\` | TypeScript 編譯設定檔,分別對應一般程式碼和 unit test |

## 根目錄的檔案分別代表什麼?

除了 \`src\` 資料夾,專案根目錄還有一批設定檔,大多是給 CLI、測試框架、程式碼風格工具用的。

![Angular 5 專案根目錄檔案列表](/images/tech/angular5-root-folder-structure.webp)

| 檔案 | 目的 |
|---|---|
| \`e2e/\` | 負責放 End-to-End 測試程式碼的資料夾 |
| \`node_modules/\` | Node.js 建立的資料夾,放第三方模組(third party modules),清單則記錄在 \`package.json\` |
| \`.angular-cli.json\` | Angular CLI 的設定檔 |
| \`.editorconfig\` | 幫助開發者在不同 IDE 間保持檔案格式一致的設定檔 |
| \`.gitignore\` | Git 的設定檔,讓指定檔案不會被 commit 到版本控制 |
| \`karma.conf.js\` | Karma 測試框架的 unit test 設定 |
| \`package.json\` | npm 設定檔,記錄第三方套件清單與版本資訊 |
| \`protractor.conf.js\` | Angular end-to-end 測試框架 Protractor 的設定檔 |
| \`README.md\` | 專案基本說明文件 |
| \`tsconfig.json\` | TypeScript 編譯器設定檔 |
| \`tslint.json\` | Codelyzer(維持 code style 一致性)和 TSLint 的設定檔 |

## 常見問題

### 為什麼 \`ng serve --open\` 打不開瀏覽器?

通常是防火牆或 port 被其他程式佔用導致的。可以先確認 4200 port 沒有被佔用,或改用 \`ng serve --port 4300\` 換一個 port 試試。

### \`.angular-cli.json\` 和後來的 \`angular.json\` 是同一個東西嗎?

是同一個角色的設定檔,只是命名不同。Angular 5 這個時期用的是 \`.angular-cli.json\`,後續版本的 Angular CLI 改名為 \`angular.json\` 並調整了格式,但功能上都是專案層級的 CLI 設定。

### 一定要用 Angular CLI 建專案嗎?

不是必要,但強烈建議。CLI 幫你處理好 webpack 設定、TypeScript 編譯、測試環境整合這些繁瑣工作,手動搭一套等效環境要花的時間遠比直接用 \`ng new\` 多。

這系列筆記接下來會依照新手教程、功能介紹、技術支援三個部分繼續整理,原始教學內容都能在 <a href="https://angular.io/docs">Angular 官方文件</a>找到。

## 參考資料

Angular 官方文件，〈Setting up the local environment and workspace〉，說明安裝 Angular CLI 與使用 \`ng new\` 建立專案的流程，存取日期：2026-08-27。[https://angular.dev/tools/cli/setup-local](https://angular.dev/tools/cli/setup-local)

## 延伸閱讀

- [Angular Service 建立教學：用 CLI 產生 HeroService 並回傳 Observable](/post/angular-create-service-tutorial)：同樣聚焦 Angular、Angular CLI，可接著比較不同情境的做法。
- [如何用 Angular CLI 建立元件（Component）並完成資料綁定](/post/angular-create-component)：同樣聚焦 Angular、Angular CLI，可接著比較不同情境的做法。
- [Angular Service Worker 離線支援教學：PWA 快取、更新檢查與 ngsw 除錯](/post/angular-service-worker-offline-support)：同樣聚焦 Angular、Angular CLI，可接著比較不同情境的做法。
`;export{e as default};