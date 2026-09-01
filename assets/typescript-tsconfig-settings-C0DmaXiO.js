var e=`---
title: TypeScript 設定全攻略：看懂 tsconfig.json 的核心編譯選項
description: 深入解析 TypeScript 的 tsconfig.json 設定檔，說明 tsc 編譯器配置、noImplicitAny 與 suppressImplicitAnyIndexErrors 的關係，以及 lib.d.ts 環境聲明與 lib 編譯選項的用法，幫助你正確配置 Angular 專案。
date: 2018-01-17
category: 前端開發
tags: [TypeScript, tsconfig, Angular, 編譯器設定, 前端開發]
readingTime: 3 分鐘
image: /images/tech/hero_typescript-tsconfig-settings.webp
imageAlt: 螢幕上顯示彩色語法高亮的程式碼
---


# TypeScript 設定全攻略：看懂 tsconfig.json 的核心編譯選項

TypeScript 是 Angular 應用開發中使用的主語言，但瀏覽器不能直接執行 TypeScript，得先用 tsc 編譯器轉譯（transpile）成 JavaScript，而編譯器需要進行一些配置——配置的檔案名稱就是 \`tsconfig.json\`。這篇文章整理 tsconfig.json 的範例、\`noImplicitAny\` 等關鍵編譯選項，以及 \`lib.d.ts\` 環境聲明的運作方式。

## 什麼是 tsconfig.json？為什麼 TypeScript 專案一定要有它？

TypeScript 是 Angular 應用開發中使用的主語言。瀏覽器不能直接執行 TypeScript，得先用 tsc 編譯器轉譯（transpile）成 JavaScript，而且編譯器需要進行一些配置，配置的檔案名稱就是 \`tsconfig.json\`。

這邊是官方關於此配置文件的詳細說明：[tsconfig.json](http://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

## tsconfig.json 範例長什麼樣？

下面為一個 \`tsconfig.json\` 的範例：

\`\`\`json
{
  "compileOnSave": false,
  "compilerOptions": {
    "outDir": "./dist/out-tsc",
    "sourceMap": true,
    "declaration": false,
    "moduleResolution": "node",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "target": "es5",
    "typeRoots": [
      "node_modules/@types"
    ],
    "lib": [
      "es2017",
      "dom"
    ],
    "noImplicitAny": true,
    "suppressImplicitAnyIndexErrors": true
  }
}
\`\`\`

其中幾個重點欄位：

| 欄位 | 作用 |
| --- | --- |
| \`compilerOptions\` | tsc 編譯器的主要設定區塊 |
| \`outDir\` | 編譯後 JavaScript 的輸出目錄 |
| \`target\` | 編譯目標的 JavaScript 版本（如 \`es5\`） |
| \`typeRoots\` | 型別宣告套件（@types）的搜尋路徑 |
| \`lib\` | 編譯時要納入的環境聲明（如 \`es2017\`、\`dom\`） |

## noImplicitAny 設定為 true 時要注意什麼？

設定檔裡的 \`noImplicitAny\` 意思是是否不允許 TypeScript 編譯時隱性將沒有設定類型的變數設定為 \`any\`。如果設定為 \`true\` 的話，TypeScript 裡面有沒有設定類型的變數則會產生錯誤訊息。

當這個值設定為 \`true\` 時，記得要將 \`suppressImplicitAnyIndexErrors\` 也設定為 \`true\`，不然會發生隱式報錯。

## lib.d.ts 是什麼？target 會如何影響環境聲明？

TypeScript 有一個特殊的聲明文件 \`lib.d.ts\`，包含了 JavaScript 運行庫和 DOM 的各種常用 JavaScript 環境聲明。

基於 \`--target\`，TypeScript 會添加額外的環境聲明，例如如果目標為 es6 時將添加 \`Promise\`。也可以透過 \`lib\` 編譯選項手動指定要納入的環境聲明：

\`\`\`json
"lib": ["es2017", "dom"]
\`\`\`

## 常見問題

### 瀏覽器可以直接執行 TypeScript 嗎？

不行。瀏覽器只能執行 JavaScript，TypeScript 必須先用 tsc 編譯器轉譯（transpile）成 JavaScript。tsconfig.json 就是用來配置這個編譯過程的檔案。

### tsconfig.json 一定要放在專案根目錄嗎？

慣例上放在專案根目錄，tsc 執行時會從當前目錄向上尋找這個檔案。放在根目錄可以讓編輯器與建置工具自動套用同一份設定。

### noImplicitAny 設為 true 有什麼好處？

它可以強迫我為每個變數明確標註類型，避免程式碼到處都是隱性的 \`any\` 而失去型別檢查的保護。開啟後若有未標註類型的變數，編譯時就會產生錯誤訊息，及早抓出潛在問題。

### 什麼是 lib.d.ts？

它是 TypeScript 內建的特殊聲明文件，包含 JavaScript 運行庫與 DOM 的常用環境聲明。TypeScript 會依據 \`--target\` 自動添加額外聲明（例如目標為 es6 時添加 \`Promise\`），也能用 \`lib\` 選項手動指定。

## 參考資料

- [TypeScript 官方文件：tsconfig.json](http://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

## 延伸閱讀

- [Angular Pipes 完整介紹：內建管道用法與自訂 Pipe 教學](/post/angular-pipes-guide)：同樣聚焦 angular、前端開發，可接著比較不同情境的做法。
- [Angular 架構總覽：Component、Template、Metadata、NgModule、Directive 與 Dependency Injection 入門](/post/angular-architecture-overview)：同樣聚焦 angular、typescript，可接著比較不同情境的做法。
- [Angular Attribute Directives 屬性指令完整教學：從 @Directive 到 @Input 參數傳遞](/post/angular-attribute-directives)：同樣聚焦 angular、前端開發，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2018-01-17，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};