var e=`---
title: 用Chrome將本地端檔案替代伺服器檔案
description: 用 Chrome DevTools 的 Overrides 功能，把線上伺服器上的 JS、CSS 或設定檔暫時替換成本地端版本，不用改伺服器就能驗證行為，是前端除錯與研究他人網站技術的實用技巧。
date: 2024-10-22
category: 前端開發
tags: [Chrome DevTools, 前端除錯, Local Overrides, 設定檔替換]
readingTime: 3 分鐘
image: /images/tech/hero_chrome-local-file-override.webp
imageAlt: 螢幕上的程式碼特寫，代表用 Chrome DevTools 替換線上檔案的前端除錯技巧
---


# 用Chrome將本地端檔案替代伺服器檔案

很多時候我在除錯前端時，會需要把某些檔案（例如設定檔）換成別的版本（例如換成 DEV 環境的設定檔）。這時可以用 Chrome Developer Tools 內建的 Local Overrides 功能，直接指定替換掉伺服器上的某個檔案，不用動後端、不用改伺服器，非常方便。另外，想了解別人的網站用了什麼技術時，這個功能也幫得上很多忙。

## 如何用 Chrome DevTools 把線上檔案換成本地版本？

在 Chrome 中可以使用「Developer Tools > Sources > 找到要取代的檔案 > 右鍵 > Override content」把內容取代掉：

![在 Sources 面板對檔案按右鍵選擇 Override content](/images/articles/chrome-local-file-override-1.webp)

點選之後，切換到 Override 頁籤，選擇取代檔案要放置的本地資料夾，接著就可以到那個資料夾裡看到剛剛選擇要 Override 的檔案：

![Override 頁籤中選擇本地資料夾](/images/articles/chrome-local-file-override-2.webp)

然後更改資料夾裡的檔案內容，重新整理頁面後就會以本地版本取代線上檔案。我可以在裡面 \`console.log\` 出一些有興趣知道的資訊，或者修改某些設定來驗證行為。

## 檔案取代失敗時怎麼辦？

如果某些檔案不能取代而出現錯誤訊息，例如下圖：

![Override 失敗時出現的錯誤訊息](/images/articles/chrome-local-file-override-3.webp)

可以去關掉 Source Map 的功能再試一次：

1. 打開**開發者工具（DevTools）**：按 \`F12\` 或在網頁上按右鍵選擇「檢查」。
2. 點擊右上角的**設定齒輪圖示**（通常在「Console」標籤右側）。
3. 在「Preferences」設定頁中，找到「Sources」部分。
4. **取消勾選** \`Enable JavaScript source maps\`（啟用 JavaScript Source Map）和 \`Enable CSS source maps\`（啟用 CSS Source Map）這兩個選項。
5. 關閉設定視窗後重新載入頁面，再執行一次 Override。

## 常見問題

### Chrome Local Overrides 改的檔案會影響線上環境嗎？

不會。取代只發生在你自己的瀏覽器，檔案內容存在你選的本地資料夾裡，伺服器上的檔案完全不受影響，重新整理時瀏覽器會改用本地版本回應。

### Override 的內容在關閉瀏覽器後還會在嗎？

會。只要沒有在 Override 頁籤取消授權，本地資料夾裡的檔案會持續生效，之後開啟 Chrome 造訪同一網址時仍會套用本地版本。要還原時刪除本地檔案或取消勾選即可。

### 為什麼有些檔案沒辦法 Override？

最常見的原因是 Source Map 干擾，瀏覽器嘗試對映到原始檔而失敗。依照上文在 DevTools 設定中關閉 JavaScript 與 CSS Source Map 後再試一次即可解決。

### 這個功能適合用在什麼場景？

適合前端除錯（例如把設定檔換成 DEV 環境版本）、驗證某些修改是否有效，以及研究別人網站的前端技術——修改後觀察行為差異，不用真的部署任何東西。

## 參考資料

- 本篇為前端除錯技巧系列筆記，操作截圖來自 Chrome DevTools 實際畫面。

## 延伸閱讀

- [PixiJS devtools：用 Chrome 擴充功能除錯 Canvas 遊戲場景與屬性](/post/pixijs-devtools-chrome-extension)：同樣聚焦 Chrome DevTools、前端除錯，可接著比較不同情境的做法。
- [手機遠端測試怎麼做？Chrome 與 Safari 遠端偵錯 Android/iOS 設備教學](/post/mobile-remote-debugging)：同樣聚焦 Chrome DevTools，可接著比較不同情境的做法。
- [手機遠程測試教學：Android 與 iOS 遠端偵錯完整指南](/post/mobile-remote-testing)：同樣聚焦 Chrome DevTools，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2024-10-22，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};