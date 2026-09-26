var e=`---
title: 如何用 Playwright 撰寫參數化測試：多角色網站的自動化實戰
description: 當網站有管理員、一般使用者、訪客等多種角色時，如何用 Playwright 撰寫參數化測試：分析角色需求、建立共用登入與 Page Object Model、用測試資料陣列讓同一份腳本覆蓋多個角色，並用 try/catch 處理 TimeoutError，讓測試穩定且可重複執行。
date: 2025-03-12
category: 前端開發
tags: [Playwright, 自動化測試, E2E 測試, 參數化, Page Object Model]
readingTime: 5 分鐘
image: /images/tech/hero_playwright-codegen-guide.webp
imageAlt: Playwright 自動化測試示意圖
---


# 如何用 Playwright 撰寫參數化測試：多角色網站的自動化實戰

當網站有許多不同的角色（例如管理員、一般使用者、訪客等）時，撰寫測試可以依照各角色的權限與流程，採用一些共用與參數化的技巧，讓測試能夠穩定且重複執行。這篇文章整理我在實務上做法：如何規劃角色需求、建立共用的登入流程與 Page Object Model、用參數化讓一份腳本覆蓋多個角色，以及用 \`try/catch\` 處理找不到元素時的 \`TimeoutError\`。

## 網站有多種角色時，為什麼要參數化測試？

不同角色能執行的功能不同，如果每個角色都複製一份測試腳本，之後頁面一改就要改 N 份。參數化的核心想法是：**測試流程寫一份，角色差異用資料傳入**。這樣測試案例會隨角色資料自動展開，維護成本大幅降低。

我的做法分成三步：分析角色需求 → 建立共用流程與元件 → 參數化測試資料。

## 步驟一：分析與規劃角色需求

- **定義各角色的權限與流程**：先明確每個角色所能執行的功能，列出對應的使用情境。
- **撰寫需求文件**：將各角色的操作流程、期望結果記錄下來，方便後續撰寫測試案例。

這一步做到位，後面寫測試時就不會邊寫邊猜「管理員到底看得到什麼」。

## 步驟二：建立共用的流程與元件

- **共用登入與登出**：針對不同角色，撰寫一個共用的登入模組，再根據傳入的角色參數選擇不同的帳號與密碼。
- **使用 Page Object Model (POM)**：把不同頁面的操作封裝成物件，依角色狀況調用不同的方法，減少重複程式碼。

## 步驟三：參數化測試

利用測試資料陣列：將各角色的測試資料（例如帳號、密碼、預期結果）存成陣列，再透過迴圈或參數化的方式，讓同一份測試腳本覆蓋多個角色：

\`\`\`js
import { test, expect } from '@playwright/test';

const users = [
  { role: 'admin', username: 'adminUser', password: 'adminPass' },
  { role: 'user', username: 'normalUser', password: 'userPass' },
  // 可再加入其他角色
];

users.forEach(({ role, username, password }) => {
  test(\`測試 \${role} 角色的功能\`, async ({ page }) => {
    // 執行共用的登入流程
    await page.goto('https://example.com/login');
    await page.fill('#username', username);
    await page.fill('#password', password);
    await page.click('button[type="submit"]');

    // 根據角色執行不同操作與驗證
    if (role === 'admin') {
      // 驗證管理員專屬的功能
      await page.goto('https://example.com/admin');
      await expect(page.locator('text=管理後台')).toBeVisible();
    } else if (role === 'user') {
      // 驗證一般使用者的功能
      await page.goto('https://example.com/dashboard');
      await expect(page.locator('text=使用者儀錶板')).toBeVisible();
    }
    // 登出或清除測試狀態
  });
});
\`\`\`

同一份腳本會為每個角色各產生一個 test case，角色一多也不用重複貼程式碼。

## 如何避免爬蟲式流程卡在某個狀況？

運用 \`try/catch\` 來處理找不到指定元素時所產生的 \`TimeoutError\`。實務上有些帳號介面不完全一致，需要設計備案流程。流程大致如下：

1. **嘗試執行主要操作**：在 \`try\` 區塊中，先使用 \`await page.getByText('移除成員').click({ timeout: 1000 })\`。這表示 Playwright 會嘗試在 1 秒內尋找並點擊文字為「移除成員」的元素；如果 1 秒內沒有找到，就會拋出 \`TimeoutError\`。
2. **捕捉錯誤並執行備案操作**：一旦進入 \`catch\` 區塊，就代表指定時間內沒有找到「移除成員」這個元素，程式碼會檢查錯誤類型：

\`\`\`js
try {
  await page.getByText('移除成員').click({ timeout: 1000 });
} catch (e) {
  if (e.name === 'TimeoutError') {
    await page.getByText('封鎖', { exact: true }).click({ timeout: 1000 });
  }
}
\`\`\`

3. 如果確實是 \`TimeoutError\`，就改用「封鎖」這個文字作為元素定位並點擊。也就是說，如果「移除成員」按鈕不在網頁上（或是頁面載入流程不同），就退而求其次去點擊「封鎖」按鈕。

### 應用場景

- 有些帳號沒有「移除成員」的選項，而需要改用「封鎖」。
- 前端顯示的按鈕文字在不同情況下會變化，需要有個備案流程。

## 小結

多角色網站的 E2E 測試，關鍵在於「流程共用、資料參數化」：角色需求先文件化，登入與頁面操作封裝成共用模組（POM），再用測試資料陣列驅動同一份腳本；遇到介面不一致的狀況，用 \`try/catch\` 捕捉 \`TimeoutError\` 走備案流程，測試就能穩定且重複執行。

## 常見問題

### 什麼是 Playwright 的參數化測試？

把不同角色的測試資料（帳號、密碼、預期結果）存成陣列，再用 \`forEach\` 或 Playwright 內建的資料驅動方式，讓同一份測試腳本對每組資料各執行一次。這樣一份腳本就能覆蓋管理員、一般使用者等多個角色，維護成本大幅降低。

### Page Object Model (POM) 為什麼適合多角色測試？

POM 把每個頁面的操作封裝成物件，角色之間共用的流程（如登入、登出）只需要寫一次，差異部分用參數傳入。這讓測試程式碼不會因為角色多而重複膨脹，頁面改版時也只要改一處。

### Playwright 測試中遇到 TimeoutError 該怎麼處理？

用 \`try/catch\` 包住可能找不到元素的操作，並設定較短的 \`timeout\`（例如 1000ms）。在 \`catch\` 中判斷 \`e.name === 'TimeoutError'\` 後執行備案流程，例如改點另一個按鈕，讓測試不因為介面差異而中斷。

### 測試資料裡的帳號密碼應該放哪裡？

不要把真實帳號密碼寫死在測試腳本裡，建議放在環境變數或測試專用的設定檔（如 \`.env\`、Playwright 的 \`config\`），測試資料陣列只保留角色的結構與預期結果，實際憑證由環境注入。

## 參考資料

- [Playwright 官方文件](https://playwright.dev/docs/intro)

## 延伸閱讀

- [Playwright Codegen 完整指南：用錄製功能快速產生 E2E 測試與爬蟲程式碼](/post/playwright-codegen-guide)：同樣聚焦 Playwright、E2E 測試，可接著比較不同情境的做法。
- [單元測試基礎入門：工作單元、AAA 三步驟與優秀測試的特質](/post/unit-testing-basics)：同樣聚焦 自動化測試，可接著比較不同情境的做法。
- [PixiJS 如何控制 loading page 與載入進度](/post/pixi-loading-page-control)：同屬「前端開發」主題，可延伸理解相近問題的判斷方式。

## 最後更新

2026-08-28（原文發布於 2025-03-12，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};