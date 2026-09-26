var e=`---
title: RWD 響應式網頁開發：CSS Media Queries 實作心得
description: 整理 RWD 開發時的 CSS 選擇器、HTML 結構與 media queries 寫法，附常見裝置判斷條件範例。
date: 2013-12-30
category: 前端開發
tags: [RWD, CSS, media queries, 響應式設計, 前端開發]
readingTime: 8 分鐘
image: /images/tech/hero_rwd-media-queries-css.webp
imageAlt: 桌上並排的多支手機，各自顯示不同畫面比例的網頁內容
---


# RWD 響應式網頁開發：CSS Media Queries 實作心得

RWD（Responsive Web Design）的核心其實只是準備多組 CSS，再依瀏覽環境切換要套用哪一組，讓同一份 HTML 在手機和電腦上呈現不同版面。最常見的做法是用 media queries，依螢幕寬度、方向等條件決定套用哪些樣式。

這篇整理的是我幫部落格改版成 RWD 時記下的實作重點，包含 JS 與 CSS 該怎麼分工、選擇器優先順序要注意什麼，以及 media queries 幾種常見寫法。

## RWD 開發時 JavaScript 該注意什麼？

JavaScript 不應該直接控制版面樣式，所有和顯示有關的邏輯都交給 CSS 決定，JS 只負責切換 class。這樣不同螢幕尺寸切換樣式時才不會互相干擾。

以前我會這樣寫，直接在 JS 裡改 CSS：

\`\`\`javascript
$(".content").css("display", "none"); // js
\`\`\`

這種寫法要避免。應該改成只切換 class，把顯示邏輯留給 CSS：

\`\`\`javascript
$(".content").addClass("display-none"); // js
\`\`\`

\`\`\`css
.display-none {
  display: none;
} /*CSS*/
\`\`\`

JS 一定要避免掉所有和版面有關的設定——理由很直接：一旦某個 media query 底下也要改這個元素的顯示狀態，JS 寫死的 inline style 會蓋過 CSS，兩邊互相打架，除錯會很痛苦。

## CSS 選擇器優先順序為什麼在 RWD 特別重要？

RWD 專案裡通常同時存在共通樣式和特定解析度才生效的樣式，選擇器優先順序沒搞懂，就會出現「明明寫了 CSS 卻沒生效」的狀況。

假設一個網站要支援四種不同裝置的版面，其中一種裝置還要再套一組專屬字體設定，就必須清楚知道各種選擇器的優先順序，才能正確用更精確的選擇器覆蓋掉原本的設定。這部分可以參考〈[如何撰寫有效率的CSS選擇器(CSS Selector)](http://www.mrmu.com.tw/2011/10/11/writing-efficient-css-selectors/)〉。

## HTML 結構要怎麼設計才不會拖累 RWD？

HTML 要能清楚表達各元素之間的從屬關係，並符合 W3C 規範，才能在切換 CSS 時，不用動到 HTML 就能改變顯示方式。

RWD 要應付多套 CSS 輪流套用，HTML 結構如果本身就邏輯混亂、巢狀關係不清楚，之後想針對某個裝置微調樣式，常常得回頭改 HTML，等於多一套版面就多一次結構修正，維護成本會一直往上疊。

## Media Queries 有哪兩種設定方式？

Media queries 可以用兩種方式指定套用對象：在 HTML 用 \`<link>\` 直接指定，或在 CSS 檔內用 \`@media\`／\`@import\` 包起來。

第一種，在 HTML 載入時宣告這個 CSS 檔要套用在哪種情境：

\`\`\`html
<link
  href="/style.css"
  rel="stylesheet"
  media="all and (color)"
  type="text/css"
/>
\`\`\`

第二種，直接在 CSS 檔案內部設定作用對象：

\`\`\`css
@import url(/style.css) all and (color);

@media all and (color) {
  ⋮ one or more rule sets…
}
\`\`\`

兩種寫法效果相同,差別在於前者是多個獨立的 CSS 檔案依條件載入，後者是同一份 CSS 內用 \`@media\` 區塊分隔規則，專案規模小的話用後者比較好維護。

## Media Queries 的條件語法怎麼寫？

Media queries 的條件語法固定是 \`@media [media type] and [(media feature)]\`，可以組合寬度、方向、色彩等多個條件。

幾個實際會用到的例子：

視窗最小寬度為 500px 時套用：

\`\`\`css
@media screen and (min-width: 500px) {
  ...;
}
\`\`\`

視窗為直立方向時套用：

\`\`\`css
@media screen and (orientation: portrait) {
  ...;
}
\`\`\`

視窗寬度介於 400px 到 700px 之間（兩個條件要同時成立）：

\`\`\`css
@media screen and (min-width: 400px) and (max-width: 700px) {
  ...;
}
\`\`\`

彩色螢幕或彩色投影機，符合其中一種即可：

\`\`\`css
@media screen and (color), projection and (color) {
  ...;
}
\`\`\`

## media type 和 media feature 有哪些常見屬性？

media type 常見的有 all、screen、print、handheld 等，media feature 則是 width、height、orientation、color 這類判斷條件，其他 media type 完整列表如下：

| Media Type | 說明 |
|---|---|
| all | 適用於所有裝置 |
| aural | 適用於語音合成裝置 |
| braille | 適用於點字觸覺回饋裝置 |
| embossed | 適用於凸字點字印表機 |
| handheld | 適用於小型手持裝置 |
| print | 適用於印表機 |
| projection | 適用於投影簡報 |
| screen | 適用於電腦螢幕 |
| tty | 適用於固定間距字元網格裝置，如電傳打字機 |
| tv | 適用於電視類裝置 |

要特別注意的是，\`handheld\` 這個值其實沒辦法有效判別是否為手持設備。目前會讀 \`handheld\` 的瀏覽器包括 OpenWave、Nokia lite-web browsers、Netfront、Digia、BlackBerry browser、Opera Mini（v4 之前）、Opera Mobile（v9 之前）、Palm's Blazer、Nokia S40 browser、IEMobile 6.x 和 8.x，涵蓋範圍其實很有限。

如果要判別的是 iPhone 或 Android 這類現代手機，應該改用裝置寬度或像素密度來判斷：

\`\`\`css
/* target mobile devices */
@media only screen and (max-device-width: 480px) {
  body {
    max-width: 100%;
  }
}

/* recent Webkit-specific media query to target the iPhone 4's high-resolution Retina display */
@media only screen and (-webkit-min-device-pixel-ratio: 2) {
  /* CSS goes here */
}

/* should technically achieve a similar result to the above query,
targeting based on screen resolution (the iPhone 4 has 326 ppi/dpi) */
@media only screen and (min-resolution: 300dpi) {
  /* CSS goes here */
}
\`\`\`

常見的 media feature 還包括：

- \`(max-\` 或 \`min-)width\`：數字
- \`(max-\` 或 \`min-)height\`：數字
- \`(max-\` 或 \`min-)device-width\`：數字
- \`(max-\` 或 \`min-)device-height\`：數字
- \`orientation\`：portrait 或 landscape
- \`aspect-ratio\`：比值
- \`(max-\` 或 \`min-)device-aspect-ratio\`：比值
- \`color\`
- \`color-index\`
- \`monochrome\`
- \`(max-\` 或 \`min-)resolution\`：數字 dpi
- \`scan\`（只對 tv）
- \`grid\`

## 如何在 JavaScript 裡取得螢幕的真實寬度？

不同瀏覽器對視窗寬度的支援程度不一樣，寫法上需要做多層 fallback，依序檢查 \`window.innerWidth\`、\`document.documentElement.clientWidth\`、\`document.body.clientWidth\`：

\`\`\`javascript
function getWindowWidth() {
  var windowWidth = 0;
  if (typeof window.innerWidth == "number") {
    windowWidth = window.innerWidth;
  } else {
    if (document.documentElement && document.documentElement.clientWidth) {
      windowWidth = document.documentElement.clientWidth;
    } else {
      if (document.body && document.body.clientWidth) {
        windowWidth = document.body.clientWidth;
      }
    }
  }
  return windowWidth;
}
\`\`\`

這種寫法在現代主流瀏覽器其實用第一個條件就會成立，但舊專案或需要兼顧極舊瀏覽器時，這個 fallback 鏈還是實用。

## 常見問題

### RWD 一定要用 media queries 嗎？

目前最普遍的做法確實是 media queries，透過條件判斷螢幕寬度、方向等資訊切換 CSS。也可以搭配 Flexbox、Grid 等現代版面技術，但判斷「何時套用哪組樣式」仍然需要 media queries 或等效的容器查詢機制。

### JS 控制版面和用 class 切換有什麼差別？

JS 直接寫 inline style 的優先權高於一般 CSS 選擇器，容易和 media query 裡的樣式互相覆蓋，難以除錯。用 class 切換則能把顯示邏輯統一交給 CSS 管理，各種螢幕條件下的樣式表現都可預期。

### handheld 這個 media type 現在還能用嗎？

\`handheld\` 能辨識的裝置範圍有限，多半是舊型手機瀏覽器，無法可靠對應到 iPhone、Android 等主流裝置。判斷手機環境建議改用 \`max-device-width\` 或 \`-webkit-min-device-pixel-ratio\` 這類寬度與像素密度條件。

## 參考資料

- [Mobile Web 前端技術筆記(二)](http://hsinyu00.wordpress.com/2011/04/05/mobile-web-media-queries/)
- [如何撰寫有效率的CSS選擇器(CSS Selector)](http://www.mrmu.com.tw/2011/10/11/writing-efficient-css-selectors/)


## 延伸閱讀

- [CSS 垂直置中：用純 CSS 解決 div vertical-align](/post/css-vertical-align-div-center)：同樣聚焦 CSS，可接著比較不同情境的做法。
- [在瀏覽器內插入 Flash 的幾種設定：透明、全螢幕與 Script 存取](/post/insert-flash-in-browser-settings)：同樣聚焦 前端開發，可接著比較不同情境的做法。
- [在瀏覽器內插入 Flash 的幾種設定：透明、全螢幕與 JavaScript 存取](/post/browser-embed-flash-settings)：同樣聚焦 前端開發，可接著比較不同情境的做法。
`;export{e as default};