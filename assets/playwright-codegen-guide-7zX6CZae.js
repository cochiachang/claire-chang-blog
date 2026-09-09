var e=`---
title: Playwright Codegen 完整指南：用錄製功能快速產生 E2E 測試與爬蟲程式碼
description: 介紹 Playwright Codegen 的使用方式：透過 npx playwright codegen 互動錄製操作行為，自動產生測試骨架程式碼，並說明 getByRole、getByText 等官方推薦定位器的用法與選擇策略。
date: 2025-03-12
category: 前端開發
tags: [Playwright, E2E 測試, 自動化測試, 網頁爬蟲, 前端開發]
readingTime: 9 分鐘
image: /images/tech/hero_playwright-codegen-guide.webp
imageAlt: 筆電螢幕上顯示 HTML 與程式碼編輯器畫面
---


# Playwright Codegen 完整指南：用錄製功能快速產生 E2E 測試與爬蟲程式碼

寫 E2E（端對端）測試或爬蟲時，最花時間的往往不是測試邏輯本身，而是一個個手寫元素定位器與操作步驟。Playwright 內建的 Codegen 功能可以透過互動錄製，把你對瀏覽器的操作即時轉成測試程式碼骨架，再自行補上斷言與檢查條件，大幅縮短手動撰寫測試的時間。這篇文章記錄我使用 \`npx playwright codegen\` 的方式、官方推薦的定位器選擇策略，以及 \`getByRole()\` 等語意化定位方法的原理與範例。

## 什麼是 Playwright Codegen？怎麼用？

Codegen 的核心概念是「互動錄製」：你在瀏覽器裡點擊、輸入，Playwright 會同步把這些操作翻譯成程式碼。產生的測試骨架可以再自行補充測試斷言與檢查條件，大幅縮短手動撰寫測試的時間。產生的程式碼也可以直接套用在爬蟲腳本中，之後只要再針對抓取內容做進一步處理即可。

啟動方式只要一行指令：

\`\`\`bash
npx playwright codegen
\`\`\`

執行後會同時開啟瀏覽器視窗與錄製器（Inspector），操作畫面時程式碼即時產生：

![Playwright Codegen 錄製介面，左側瀏覽器操作、右側即時產生程式碼](/images/articles/playwright-codegen-guide-1.webp)

## 為什麼定位器要優先使用 id 或 data-* 屬性？

在撰寫 E2E 測試時，選擇好用、穩定且易維護的元素定位方式相當重要。官方推薦使用 \`id\` 或自訂的 \`data-*\` 屬性（例如 \`data-testid\`、\`data-test\`），讓測試程式更容易精準地選取元素。使用自訂屬性有以下好處：

1. **避免干擾視覺或結構調整**
   - 如果測試依賴 CSS 選擇器（如 \`.class\` 或元素階層），一旦前端 UI 樣式或結構稍作修改，就可能導致測試失效。
   - 透過自訂屬性（例如 \`data-testid="submit"\`），可以與視覺或佈局的變動解耦，減少測試被破壞的風險。
2. **可讀性佳**
   - \`data-testid="submit"\` 或 \`data-test="login-button"\` 這種命名能讓測試碼一目了然，也容易與設計稿或需求對照。
3. **維護成本低**
   - 若將來需要更改按鈕文字或新增 CSS 樣式，自訂屬性不會被影響，測試也不需要重新編寫。

### 使用 id

- 在一個頁面中，\`id\` 屬性必須唯一。若你的頁面或元件很多，必須小心確保不會重複命名。
- 有時候前端開發者可能保留 \`id\` 給特定功能，或是其他框架可能已經使用 \`id\` 作為錨點、錨點連結等等。

### 使用 data-* 屬性

- \`data-testid\` 或 \`data-test\` 是常見做法，用於標記測試所需的元素。
- 不會干擾其他既有的前端邏輯或樣式，並且易於辨識、維護。

例如網頁這樣寫：

\`\`\`html
<!-- example.html -->
<input type="text" id="username" />
<input type="submit" data-test-id="submit" value="Sign In" />
\`\`\`

測試碼就對應：

\`\`\`javascript
// example.spec.js
await page.fill('#username', 'someUser');
await page.click('[data-test-id=submit]');
\`\`\`

## Playwright 官方推薦哪些定位方法？

Playwright 提供一系列語意化的定位器，官方建議的優先順序如下：

- **getByRole()**：依據 ARIA 的角色（role）或預設語意標籤（如 \`<button>\`、\`<a>\`、\`<input>\` 等）來定位。
- **getByText()**：依據元素內的文字內容匹配，適用於一般顯示文字的元素。
- **getByLabel()**：特別適用於表單控制項，依照 \`<label>\` 文字來定位對應的 \`<input>\`、\`<textarea>\` 等。
- **getByPlaceholder()**：根據表單輸入框的 \`placeholder\` 屬性值來定位。
- **getByAltText()**：專門用於根據圖片（\`<img>\`）的 \`alt\` 屬性值來定位。
- **getByTestId()**：可在 HTML 元素上自訂 \`data-testid\` 屬性，方便自動化測試或爬蟲精準定位。

## getByRole() 的原理是什麼？為什麼推薦？

在 Playwright 裡使用 \`page.getByRole()\` 來定位元素，是根據網頁對「輔助技術（Assistive Technology）」和使用者所暴露的角色（role）資訊來做搜尋。

### 什麼是角色（Role）？

在網頁中，像是按鈕、標題、連結、清單、表格等，都有對應的 W3C ARIA 角色，或是隱含在原生 HTML 元素裡。例如 \`<button>\` 通常就對應到 ARIA 的 \`role="button"\`，\`<a>\` 則對應到 \`role="link"\`。這些角色不只對螢幕報讀軟體等輔助工具很重要，也能在自動化測試或爬蟲時，成為一個很直覺的定位方式。

### 為什麼要用 getByRole()？

- **可讀性佳**：用「角色」來描述網頁元素，比起用繁雜的 CSS 選擇器或 XPath，更能清楚表達你想要找的元素「扮演什麼功能」。
- **穩定度高**：角色屬性通常是網頁結構的語意核心，較不會因為版面調整或細微改動就被破壞。
- **符合無障礙標準**：如果網頁設計有遵循 ARIA 標準，\`getByRole()\` 能幫助你自動化測試，同時也檢查無障礙屬性的正確性。

### 使用範例

針對網頁上所有「按鈕」：

\`\`\`javascript
// 取得第一個按鈕
const button = await page.getByRole('button');
\`\`\`

若按鈕上有文字（名稱），可以用 \`name\` 選項來過濾：

\`\`\`javascript
// 取得文字內容為「送出」的按鈕
const submitButton = await page.getByRole('button', { name: '送出' });
\`\`\`

對其他角色也可以類似使用，例如 \`heading\`（標題）、\`link\`（連結）、\`list\`（清單）等。

### 隱含與自訂角色

- 大部分常見的 HTML 元素都自帶角色，比如 \`<button>\` 本身就有 \`role="button"\`。
- 如果網頁中使用自訂元素（如 \`<div>\`）去模擬按鈕，可能需要開發者在 HTML 裡加上 \`role="button"\`，讓輔助技術與 Playwright 都能正確辨識。
- 倘若有使用額外的 ARIA 屬性（如 \`aria-label\`），也能與 \`getByRole()\` 搭配使用。

## 各種定位器的完整 HTML 範例

把上面介紹的六種定位器放進同一個頁面，可以這樣對照：

\`\`\`html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <title>Playwright 定位器範例</title>
</head>
<body>

  <!-- 1. getByRole()：可透過預設語意標籤 (如 button、link) 或 ARIA role 來定位 -->
  <button>送出</button>
  <!-- Playwright 使用範例：page.getByRole('button', { name: '送出' }) -->

  <!-- 2. getByText()：根據元素的文字內容來定位 -->
  <p>這是一段測試文字</p>
  <!-- Playwright 使用範例：page.getByText('這是一段測試文字') -->

  <!-- 3. getByLabel()：根據 <label> 文字來定位對應的表單元素 -->
  <label for="username">使用者名稱</label>
  <input id="username" type="text" />
  <!-- Playwright 使用範例：page.getByLabel('使用者名稱') -->

  <!-- 4. getByPlaceholder()：根據 placeholder 屬性來定位 -->
  <input placeholder="請輸入電子郵件" />
  <!-- Playwright 使用範例：page.getByPlaceholder('請輸入電子郵件') -->

  <!-- 5. getByAltText()：根據 <img> 的 alt 屬性文字來定位 -->
  <img src="cat.jpg" alt="可愛的小貓" />
  <!-- Playwright 使用範例：page.getByAltText('可愛的小貓') -->

  <!-- 6. getByTestId()：根據 data-testid 屬性來定位 (可用於自訂屬性) -->
  <div data-testid="custom-element">這是自訂元素</div>
  <!-- Playwright 使用範例：page.getByTestId('custom-element') -->

</body>
</html>
\`\`\`

## 常見問題

### Playwright Codegen 是什麼？

Playwright 內建的程式碼錄製工具，透過 \`npx playwright codegen\` 啟動。你在瀏覽器中互動操作，它會即時把點擊、輸入等行為轉成對應的測試程式碼骨架，之後再自行補上斷言即可。

### Codegen 產生的程式碼只能用在測試嗎？

不是。產生的程式碼也可以直接套用在爬蟲腳本中，定位與操作的邏輯完全相同，之後只要再針對抓取下來的內容做進一步處理即可。

### 為什麼不建議用 CSS class 來定位元素？

因為 CSS class 通常服務於視覺樣式，一旦前端改版或調整佈局，class 名稱或元素階層就會改變，導致測試失效。使用 \`data-testid\` 等自訂屬性能與視覺變動解耦，測試更穩定。

### getByRole() 和 CSS 選擇器比起來好在哪裡？

\`getByRole()\` 用 ARIA 角色描述元素「扮演什麼功能」，可讀性佳、穩定度高，而且與無障礙標準一致——測試通過的同時也驗證了網頁的無障礙屬性正確性。

### 如果元素不是原生 button，getByRole() 還找得到嗎？

可以，但需要開發者在自訂元素（例如 \`<div>\`）上明確加上 \`role="button"\`，讓輔助技術與 Playwright 都能正確辨識；搭配 \`aria-label\` 也能提供可讀的名稱。

## 參考資料

- [Playwright 官方文件 — Codegen](https://playwright.dev/docs/codegen)
- [Playwright 官方文件 — Locators](https://playwright.dev/docs/locators)

## 延伸閱讀

- [如何用 Playwright 撰寫參數化測試：多角色網站的自動化實戰](/post/playwright-parameterized-tests)：同樣聚焦 Playwright、自動化測試，可接著比較不同情境的做法。
- [Angular Attribute Directive 屬性指令教學：自訂 appHighlight 高亮效果](/post/angular-attribute-directives)：同樣聚焦 前端開發，可接著比較不同情境的做法。
- [Angular Attribute Directives 屬性指令完整教學：從 @Directive 到 @Input 參數傳遞](/post/angular-attribute-directives)：同樣聚焦 前端開發，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2025-03-12，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};