var e=`---
title: Angular NPM 與 package.json 設定教學
description: 說明 Angular 專案為什麼需要 Node.js、npm、nvm 與 package.json，並整理 dependencies、devDependencies 與 Angular 5 常見套件用途。
date: 2018-01-16
category: 前端開發
tags: [Angular, npm, package.json, Node.js]
readingTime: 8 分鐘
image: /images/tech/hero_angular-cli-new-project-setup.webp
imageAlt: 深色背景的程式碼編輯器畫面，象徵 Angular 專案與 npm 設定
---
# Angular NPM 與 package.json 設定教學

Angular 專案需要 Node.js 與 npm，因為 Angular 應用程式和 Angular 框架本身都依賴許多第三方 package。npm 負責安裝、更新與維護這些 package，而 \`package.json\` 則記錄專案名稱、指令、相依套件與開發工具，是 Angular 專案最重要的設定檔之一。

## Angular 專案為什麼需要 Node.js 與 npm？

Angular 專案使用 npm 管理前端建置工具與第三方套件。開發者先安裝 Node.js，通常也會同時取得 npm，才能執行 Angular CLI、安裝 dependencies，並啟動 \`ng serve\` 或 \`ng build\`。

Angular 應用程序以及 Angular 本身都依賴於很多第三方包，包括 Angular 自己提供的特性和功能。這些包由 Node 包管理器 npm 負責安裝和維護，因此 Node.js 和 npm 是做 Angular 開發的基礎。

安裝入口可以參考 Node.js 官方下載頁：[Downloads](https://nodejs.org/en/download/)。

如果在同一台電腦中需要同時運行多個不同版本的 Node.js 或 npm，可以使用 nvm 管理不同版本：[nvm GitHub repository](https://github.com/nvm-sh/nvm)。

## package.json 在 Angular 專案中設定什麼？

\`package.json\` 是 npm 專案的核心設定檔，負責記錄專案 metadata、npm scripts、正式執行需要的 dependencies，以及開發階段需要的 devDependencies。Angular CLI 建立專案時會自動產生一份基本設定。

以下保留我當時的筆記的 Angular 5 時期 \`package.json\` 範例。版本號和部分工具屬於 2018 年 Angular 5 生態，閱讀時可把這段當成理解欄位用途的樣板，而不是現代新專案必須照抄的版本清單。

\`\`\`json
{
  "name": "專案名稱應為惟一",
  "version": "0.0.0",
  "license": "MIT",
  "description": "對於這個專案的說明",
  "keywords": "可幫助在npm網站上能被搜尋到",
  "homepage": "https://claire-chang.com",
  "bugs": {
    "url": "https://github.com/owner/project/issues(ISSUE要被回報的網址和MAIL)",
    "email": "project@hostname.com"
  },
  "author": "Barney Rubble <b@rubble.com> (https://barnyrubble.tumblr.com/)",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "test": "ng test",
    "lint": "ng lint",
    "e2e": "ng e2e"
  },
  "private": true,
  "dependencies": {
    "@angular/animations": "^5.0.0",
    "@angular/common": "^5.0.0",
    "@angular/compiler": "^5.0.0",
    "@angular/core": "^5.0.0",
    "@angular/forms": "^5.0.0",
    "@angular/http": "^5.0.0",
    "@angular/platform-browser": "^5.0.0",
    "@angular/platform-browser-dynamic": "^5.0.0",
    "@angular/router": "^5.0.0",
    "@angular/upgrade": "^5.0.0",
    "core-js": "^2.4.1",
    "mobx": "^3.3.1",
    "mobx-angular": "^1.9.0",
    "rxjs": "^5.5.2",
    "zone.js": "^0.8.14"
  },
  "devDependencies": {
    "@angular/cli": "1.5.0",
    "@angular/compiler-cli": "^5.0.0",
    "@angular/language-service": "^5.0.0",
    "@types/jasmine": "~2.5.53",
    "@types/jasminewd2": "~2.0.2",
    "@types/node": "~6.0.60",
    "codelyzer": "~3.2.0",
    "jasmine-core": "~2.6.2",
    "jasmine-spec-reporter": "~4.1.0",
    "karma": "~1.7.0",
    "karma-chrome-launcher": "~2.1.1",
    "karma-cli": "~1.0.1",
    "karma-coverage-istanbul-reporter": "^1.2.1",
    "karma-jasmine": "~1.1.0",
    "karma-jasmine-html-reporter": "^0.2.2",
    "protractor": "~5.1.2",
    "ts-node": "~3.2.0",
    "tslint": "~5.7.0",
    "typescript": "~2.4.2"
  }
}
\`\`\`

這幾個欄位最常需要先理解：

| 欄位 | 用途 |
|---|---|
| \`scripts\` | npm script commands 的列表，key 是指令名稱，value 是要執行的命令，例如 \`npm start\` 會執行 \`ng serve\`。 |
| \`dependencies\` | 應用程式正式執行時必要安裝的 package。 |
| \`devDependencies\` | 只在開發、測試、編譯或 lint 時需要的 package，通常不屬於瀏覽器執行階段的直接依賴。 |

## dependencies 應該放哪些 Angular packages？

Angular 專案的 \`dependencies\` 應放正式執行需要的 Angular framework packages、runtime library 與應用程式套件。Angular 5 時期常見清單包含 \`@angular/core\`、\`@angular/router\`、\`rxjs\`、\`zone.js\` 與 polyfill。

我當時的筆記列出的 Angular 5 dependencies 用途如下：

| package | 用途 |
|---|---|
| \`@angular/animations\` | 網頁切換與元件動畫效果。 |
| \`@angular/common\` | 常用 services、pipes 與 directives。 |
| \`@angular/compiler\` | Angular 模板編譯器，常見於 JIT 編譯流程。 |
| \`@angular/core\` | Angular 基本框架功能，包括 metadata decorators、Component、Directive、dependency injection 與 lifecycle hooks。 |
| \`@angular/forms\` | Template-driven forms 與 reactive forms 的表單驗證功能。 |
| \`@angular/http\` | Angular 舊版 HTTP client package。Angular 5 後續專案通常會改看 \`@angular/common/http\` 的 HttpClient。 |
| \`@angular/platform-browser\` | DOM 與瀏覽器相關功能，也包含瀏覽器平台啟動所需能力。 |
| \`@angular/platform-browser-dynamic\` | 瀏覽器中的 JIT 編譯啟動支援。 |
| \`@angular/router\` | Angular Router 路由功能。 |
| \`@angular/upgrade\` | 從 AngularJS 升級或混用時需要的 package。 |
| \`core-js\` | Polyfill packages，用來補足部分瀏覽器缺少的標準功能。 |
| \`zone.js\` | 提供 Zone 規範相關能力，協助 Angular 追蹤非同步任務。 |
| \`rxjs\` | Reactive Extensions for JavaScript，Angular 內大量用於 Observable 與非同步資料流程。 |
| \`bootstrap\` | 可快速建立 UI 樣式的視覺框架，是否需要取決於專案是否採用 Bootstrap。 |
| \`angular-in-memory-web-api\` | 可模擬遠端 Web API，適合教學、文件範例或後端尚未完成的早期開發。 |

資訊增益：整理 Angular 舊專案時，不要只看 package 名稱是否熟悉，也要看該 package 是否仍符合目前專案版本。像 \`@angular/http\` 屬於舊版 HTTP client 脈絡，若專案已經使用 HttpClient，通常應檢查是否可以移除或改寫。

## devDependencies 應該放哪些開發工具？

\`devDependencies\` 應放編譯、測試、型別檢查、lint 與開發輔助工具。這些 package 幫助開發 Angular 應用程式，但通常不需要被部署成正式執行環境中的前端相依套件。

我當時的筆記提到，列在 \`devDependencies\` 區的 package 會幫助開發者開發該應用程序。不用把它們部署到產品環境的應用程序中，雖然多裝通常不代表程式一定會壞，但會增加安裝時間、體積與維護成本。

Angular 專案的 \`devDependencies\` 常見類型包括：

- Angular CLI：例如 \`@angular/cli\`，負責產生專案、啟動開發伺服器與執行 build。
- 編譯工具：例如 \`@angular/compiler-cli\`、\`typescript\`、\`ts-node\`。
- 型別定義：例如 \`@types/node\`、\`@types/jasmine\`。
- 測試工具：例如 \`jasmine-core\`、\`karma\`、\`karma-jasmine\`、\`protractor\`。
- 程式碼風格工具：例如 \`tslint\`、\`codelyzer\`。

另外，Angular 裡列為 peer dependencies 的 package，也需要依專案版本要求確認是否已安裝。peer dependency 的重點不是「自動幫你安裝」，而是提醒使用者這個 package 需要由專案自己提供相容版本。

## Angular 專案設定 package.json 時要注意什麼？

Angular 專案設定 \`package.json\` 時，應先分清楚執行期依賴與開發期工具，再確認每個 package 版本是否彼此相容。不要把範例中的版本號直接複製到新專案，尤其是 Angular 5 這類舊版教學範例。

實務檢查可以照這個順序做：

1. 先確認 Node.js 與 npm 版本符合目前 Angular 專案要求。
2. 用 nvm 管理多版本 Node.js，避免不同專案互相污染。
3. 把瀏覽器執行會用到的套件放在 \`dependencies\`。
4. 把 build、test、lint、type checking 相關工具放在 \`devDependencies\`。
5. 檢查 \`scripts\` 是否能清楚代表團隊常用流程，例如 \`start\`、\`build\`、\`test\`。
6. 舊專案升級時，先處理已棄用 package，再調整 TypeScript、RxJS 與 Angular CLI 版本。

這篇我當時的筆記的價值，是把 Angular 5 專案裡 npm 設定檔的角色攤開來看。若要用在新專案，建議把本文當作欄位理解與舊專案維護參考，再搭配目前 Angular CLI 產生的最新 \`package.json\` 做版本比對。

## 常見問題

Angular NPM 與 \`package.json\` 常見問題集中在安裝必要性、版本管理、依賴分類與舊版套件判讀。以下答案可協助初學者快速排除設定誤解。

### Angular 開發一定要安裝 npm 嗎？
Angular 開發通常需要 npm 或相容的 package manager，因為 Angular CLI、TypeScript、RxJS 與各種建置工具都需要透過 package manager 安裝。就算最後產出的網站是靜態檔案，開發與建置階段仍需要這套工具鏈。

### nvm 是用來管理 npm 版本嗎？
nvm 主要用來管理 Node.js 版本，而 npm 通常會隨 Node.js 版本一起安裝。不同 Angular 專案若需要不同 Node.js 版本，用 nvm 切換環境會比手動重裝 Node.js 穩定。

### dependencies 和 devDependencies 差在哪？
\`dependencies\` 放應用程式執行時需要的 package，\`devDependencies\` 放開發、測試、編譯或 lint 才需要的 package。Angular 專案裡，框架 runtime 常放在 \`dependencies\`，CLI、測試框架與 TypeScript 編譯工具常放在 \`devDependencies\`。

### package.json 裡的 scripts 可以做什麼？
\`scripts\` 可以把常用命令包成固定名稱，例如 \`npm start\` 執行 \`ng serve\`、\`npm run build\` 執行 \`ng build\`。團隊合作時，把常用流程寫進 scripts 可以降低每個人記不同指令的成本。

### Angular 5 的 package.json 可以直接用在新 Angular 專案嗎？
不建議直接照抄 Angular 5 的 \`package.json\` 版本清單。Angular、Angular CLI、TypeScript 與 RxJS 版本彼此有相容性要求，新專案應以目前 Angular CLI 產生的設定為主，舊範例則適合理解欄位與維護歷史專案。

### @angular/http 和 HttpClient 是同一個東西嗎？
\`@angular/http\` 是 Angular 舊版 HTTP client package，後來 Angular 專案多改用 \`@angular/common/http\` 裡的 HttpClient。維護 Angular 5 舊專案時，看到 \`@angular/http\` 需要先確認專案版本與升級計畫。

## 參考資料

本文參考 Node.js、npm、nvm 與 Angular 官方文件，並保留當時的 Angular 5 學習筆記的設定脈絡。所有外部來源皆使用 HTTPS 連結。

- Node.js Docs：[Download Node.js](https://nodejs.org/en/download/)（存取日期：2026-08-28）
- npm Docs：[package.json](https://docs.npmjs.com/cli/v10/configuring-npm/package-json)（存取日期：2026-08-28）
- npm Docs：[Scripts](https://docs.npmjs.com/cli/v10/using-npm/scripts)（存取日期：2026-08-28）
- nvm GitHub repository：[nvm](https://github.com/nvm-sh/nvm)（存取日期：2026-08-28）
- Angular Docs：[Angular workspace configuration](https://angular.dev/reference/configs/workspace-config)（存取日期：2026-08-28）

## 延伸閱讀

- [建立一個 Angular 5 的專案](/post/angular-cli-new-project-setup)：同樣聚焦 Angular，可接著比較不同情境的做法。
- [Angular Service 建立教學：用 CLI 產生 HeroService 並回傳 Observable](/post/angular-create-service-tutorial)：同樣聚焦 Angular，可接著比較不同情境的做法。
- [Angular Universal SSR 教學：伺服器端渲染、SEO 與 Express 設定](/post/angular-universal-ssr)：同樣聚焦 Angular，可接著比較不同情境的做法。

## 最後更新

Angular NPM 與 \`package.json\` 設定教學於 2026-08-28 轉換為站內 tech 文章格式。更新重點是保留當時的程式碼，補足可搜尋的段落結構。

本文最後更新於 2026-08-28。我當時的筆記發布於 2018-01-16，本文保留 Angular 5 時期的 \`package.json\` 範例與套件脈絡，並補上 GEO 結構、FAQ、參考資料與舊版套件辨識提醒。
`;export{e as default};