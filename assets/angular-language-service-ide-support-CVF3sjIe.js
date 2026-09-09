var e=`---
title: 讓 IDE 支援 Angular Language Service
description: 讓 IDE 支援 Angular Language Service，獲得 Angular 模板語法自動補完、錯誤檢查與程式碼跳轉。本文整理 VSCode、WebStorm、Sublime Text 三種編輯器的完整安裝步驟。
date: 2018-01-12
category: 前端開發
tags: [Angular, angular-language-service, VS Code, IDE]
readingTime: 3 分鐘
image: /images/tech/hero_angular-language-service-ide-support.webp
imageAlt: 螢幕上顯示彩色語法標示的程式碼編輯器畫面
---


# 讓 IDE 支援 Angular Language Service

在開發 Angular 應用時，我最依賴的工具之一就是 Angular Language Service。它可以讓 IDE 直接看懂 Angular 模板語法，提供語法自動補完、錯誤檢查與程式碼跳轉，大幅減少我在模板綁定上犯的錯。這篇筆記整理它的三大功能，以及如何在 Visual Studio Code、WebStorm 與 Sublime Text 上安裝。

## Angular Language Service 能做什麼？

### 語法自動補完

自動完成可以通過在輸入時提供可能要填入的值讓我們選擇，以加速開發的速度，如下圖：

![Angular Language Service 語法自動補完示範](/images/articles/angular-language-service-ide-support-1.webp)

### 錯誤檢查

可以檢查像是模版變數是否在元件內有對應的變數供綁定，拼錯或漏定義時立刻看到紅字提示：

![Angular Language Service 錯誤檢查示範](/images/articles/angular-language-service-ide-support-2.webp)

### 跳轉到模版變數或方法所指向的程式碼位置

單擊並按下 F12，就能進入相對應的變數位置，在模板與元件類別之間來回不用再手動搜尋：

![Angular Language Service 跳轉導覽示範](/images/articles/angular-language-service-ide-support-3.webp)

## 哪些 IDE 可以使用 Angular Language Service？

### Visual Studio Code

**方法一：直接安裝擴充套件**——在 VSCode 的擴充功能裡搜尋並下載 [Angular Language Service](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template)：

![在 VSCode 擴充功能市集安裝 Angular Language Service](/images/articles/angular-language-service-ide-support-4.webp)

**方法二：自行使用 VSIX 安裝**

1. 下載附加元件：[直接按此下載 ngls.vsix](https://github.com/angular/vscode-ng-language-service/releases/download/0.1.7/ngls.vsix)（原始專案位置：[vscode-ng-language-service](https://github.com/angular/vscode-ng-language-service)）。
2. 打開 VSCode，按下 \`command+shift+P\` 打開指令列，輸入：

\`\`\`cmd
install from VSIX
\`\`\`

![在 VSCode 指令列輸入 install from VSIX 的畫面](/images/articles/angular-language-service-ide-support-6.webp)

3. 選擇剛剛下載的檔案，Reload 之後 VSCode 就可以支援 Angular Language Service 了！

![在 VSCode 中安裝 Angular Language Service 後的畫面](/images/articles/angular-language-service-ide-support-5.webp)

![VSCode 成功支援 Angular Language Service 的畫面](/images/articles/angular-language-service-ide-support-7.webp)

![在指令列輸入 install from VSIX 的畫面](/images/articles/angular-language-service-ide-support-6.webp)

### WebStorm

在 \`package.json\` 加上：

\`\`\`cmd
devDependencies {
	"@angular/language-service": "^4.0.0"
}
\`\`\`

然後執行：

\`\`\`cmd
npm install
\`\`\`

### Sublime Text

在專案下執行下面兩個指令：

\`\`\`cmd
npm install --save-dev typescript
\`\`\`

\`\`\`cmd
npm install --save-dev @angular/language-service
\`\`\`

## 常見問題

### Angular Language Service 是什麼？

它是 Angular 官方提供的語言服務，讓 IDE 能理解 Angular 模板語法。安裝後可獲得語法自動補完、模板錯誤檢查，以及從模板跳轉到元件程式碼的能力。

### 在 VSCode 上最快怎麼安裝 Angular Language Service？

最快的做法是打開擴充功能面板，搜尋「Angular Language Service」直接安裝官方套件。若無法使用市集，也可以到 GitHub 下載 .vsix 檔，用 \`install from VSIX\` 指令手動安裝。

### WebStorm 需要另外安裝外掛嗎？

WebStorm 不用裝外掛，只要在 \`package.json\` 的 devDependencies 加上 \`@angular/language-service\` 套件，執行 \`npm install\` 即可。

### Sublime Text 要怎麼支援 Angular 模板？

在專案目錄下分別執行 \`npm install --save-dev typescript\` 與 \`npm install --save-dev @angular/language-service\`，讓語言服務透過 TypeScript 一起運作。

## 參考資料

- [VS Code Plugin for the Angular Language Service](https://github.com/angular/vscode-ng-language-service)
- [Angular Language Service（Angular 官方文件）](https://angular.io/guide/language-service)
- [介紹 Visual Studio Code 的 Angular Language Service 擴充套件（YouTube）](https://www.youtube.com/watch?v=3hUAYNzgzYQ)

## 延伸閱讀

- [Angular Service 建立教學：用 CLI 產生 HeroService 並回傳 Observable](/post/angular-create-service-tutorial)：同屬「前端開發」主題，可延伸理解相近問題的判斷方式。
- [Angular 架構總覽：Component、Template、Metadata、NgModule、Directive 與 Dependency Injection 入門](/post/angular-architecture-overview)：同樣聚焦 angular，可接著比較不同情境的做法。
- [Angular NPM 與 package.json 設定教學](/post/angular-npm-package-json-setup)：同屬「前端開發」主題，可延伸理解相近問題的判斷方式。

## 最後更新

2026-08-28（原文發布於 2018-01-12，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};