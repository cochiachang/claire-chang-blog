var e=`---
title: CSS 垂直置中：用純 CSS 解決 div vertical-align
description: 整理五種純 CSS 垂直置中方法，包含 table-cell、absolute、floater、margin auto 與 line-height。
date: 2013-01-08
category: 前端開發
tags: [CSS, vertical-align, 垂直置中, 前端排版]
readingTime: 6 分鐘
image: /images/tech/Screenshot-2024-04-23-102615.webp
imageAlt: CSS 前端版面與垂直置中排版示意圖
---


# CSS 垂直置中：用純 CSS 解決 div vertical-align

CSS 垂直置中可以用 table-cell、absolute positioning、floater、\`margin: auto\` 與 \`line-height\` 等方式完成。選哪一種方法，取決於置中內容是固定高度、動態區塊，還是單行文字。

## CSS 垂直置中為什麼比水平置中麻煩？

CSS 水平置中常用 \`margin: 0 auto\`，但垂直置中需要知道容器高度、內容高度或使用特殊 layout 模型。不同方法各有瀏覽器支援與內容高度限制。

原文整理的是純 CSS，不加 JavaScript 的五種做法。現代專案通常會優先使用 Flexbox 或 Grid，但理解這五種舊方法仍有價值，因為維護舊系統時很常遇到。

本文保留原文的五種方法，並補上使用判斷。

## 方法一：如何用 display table-cell 垂直置中？

\`display: table-cell\` 能讓 div 模擬表格儲存格，並使用 \`vertical-align: middle\`。這種方法適合內容高度不固定的區塊。

HTML：

\`\`\`html
<div id="wrap">
  <div id="cell">
    <div id="content">
      要被置中的內容
    </div>
  </div>
</div>
\`\`\`

CSS：

\`\`\`css
#wrap {
  display: table;
}

#cell {
  display: table-cell;
  vertical-align: middle;
}
\`\`\`

優點：

- CSS 2.1 標準屬性，概念清楚。
- 被置中的內容增加後，垂直置中的 block 會自動調整。

缺點：

- IE8 以上才支援 \`display: table\`。
- 需要多一層巢狀標籤，語意上比較像回到 table 排版。

## 方法二：如何用 absolute 與負 margin 垂直置中？

absolute 加 \`top: 50%\` 與負 \`margin-top\` 適合固定高度內容。內容高度必須已知，否則置中位置會不準。

HTML：

\`\`\`html
<div id="center">
  要被置中的內容
</div>
\`\`\`

CSS：

\`\`\`css
#center {
  position: absolute;
  height: 400px;
  top: 50%;
  margin-top: -200px;
}
\`\`\`

優點：

- 程式碼簡短。
- 不需要為了垂直置中增加太多巢狀標籤。
- 舊瀏覽器支援度高。

缺點：

- div 高度需固定。
- 動態內容可能超出，需要額外處理 \`overflow\`。

## 方法三：如何用 floater 技巧垂直置中？

floater 技巧會在目標 div 前放一個高度 50% 的浮動元素，再用負 margin 拉回。這是舊瀏覽器時代常見的 workaround。

HTML：

\`\`\`html
<body>
  <div id="floater"></div>
  <div id="middle">
    要被置中的 div
  </div>
</body>
\`\`\`

CSS：

\`\`\`css
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}

#floater {
  float: left;
  height: 50%;
  margin-bottom: -200px;
  width: 1px;
}

#middle {
  clear: both;
  height: 400px;
  position: relative;
}
\`\`\`

優點：

- 舊瀏覽器支援度高。
- 內容增加時，垂直置中的 div 不一定會直接被切掉。

缺點：

- 高度仍需固定。
- 排版技巧較不直覺，維護者需要知道原理。

## 方法四：如何用 absolute 與 margin auto 垂直置中？

absolute 加 \`top: 0; bottom: 0; margin: auto\` 可以同時處理水平與垂直置中。這種方法適合固定尺寸區塊。

HTML：

\`\`\`html
<div id="middle">
  我要被置中啦~
</div>
\`\`\`

CSS：

\`\`\`css
#middle {
  position: absolute;
  width: 70%;
  height: 280px;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
\`\`\`

優點：

- 寫法簡單。
- 可以同時做到水平與垂直置中。

缺點：

- 不支援 IE7 以下。
- 容器不夠裝內容時，不一定會自動出現 scrollbar。

## 方法五：如何用 line-height 讓單行文字垂直置中？

\`line-height\` 等於容器高度時，單行文字會垂直置中。這種方法只適合單行文字，不適合多行內容。

HTML：

\`\`\`html
<div id="content">
  一行文字要被置中啦
</div>
\`\`\`

CSS：

\`\`\`css
#content {
  font-size: 32px;
  text-align: center;
  height: 150px;
  line-height: 150px;
}
\`\`\`

優點：

- 寫法最簡單。
- 舊瀏覽器支援度高。
- 單行 slogan、按鈕文字、固定高度 label 很適合。

缺點：

- 只適合單行文字。
- 固定寬度下文字換行時，版面會很醜。

## 五種 CSS 垂直置中方法怎麼選？

CSS 垂直置中方法要依內容型態選擇。固定高度可用 absolute，動態內容可用 table-cell，單行文字可用 line-height。

| 情境 | 建議方法 | 注意事項 |
|---|---|---|
| 動態區塊 | \`display: table-cell\` | 需要額外結構 |
| 固定高度區塊 | \`top: 50%\` + 負 margin | 高度要已知 |
| 舊瀏覽器 workaround | floater | 維護成本較高 |
| 固定尺寸置中 | absolute + \`margin: auto\` | 容器太小時要處理 overflow |
| 單行文字 | \`line-height\` | 不適合多行 |

現代專案若沒有舊瀏覽器限制，通常可優先使用 Flexbox：

\`\`\`css
.container {
  display: flex;
  align-items: center;
  justify-content: center;
}
\`\`\`

## 常見問題
### CSS 垂直置中最推薦哪一種方法？

現代網頁最推薦 Flexbox 或 Grid。若要維護舊系統，則依內容高度與瀏覽器支援選擇 table-cell、absolute 或 line-height。

### \`vertical-align: middle\` 可以直接用在 div 嗎？

一般 block div 不能直接靠 \`vertical-align: middle\` 垂直置中。必須搭配 inline、table-cell 或其他 layout 條件才會生效。

### line-height 垂直置中可以用在多行文字嗎？

line-height 垂直置中不適合多行文字。多行文字應使用 Flexbox、Grid 或 table-cell。

### absolute 垂直置中一定要固定高度嗎？

使用負 margin 的 absolute 方法需要固定高度。若內容高度不固定，可改用 transform 或現代 layout。

### 舊瀏覽器還需要支援 table-cell 嗎？

是否支援舊瀏覽器取決於專案需求。若不需要支援 IE7 以下，table-cell 的相容性通常已足夠。

## 參考資料
- MDN display：[https://developer.mozilla.org/en-US/docs/Web/CSS/display](https://developer.mozilla.org/en-US/docs/Web/CSS/display)
- MDN vertical-align：[https://developer.mozilla.org/en-US/docs/Web/CSS/vertical-align](https://developer.mozilla.org/en-US/docs/Web/CSS/vertical-align)

## 延伸閱讀

- [RWD 響應式網頁開發：CSS Media Queries 實作心得](/post/rwd-media-queries-css)：同樣聚焦 CSS，可接著比較不同情境的做法。
- [Auto Layout 介紹：iOS 7 介面排版為什麼要用約束？](/post/ios-autolayout-introduction)：同屬「前端開發」主題，可延伸理解相近問題的判斷方式。
- [PixiJS 場景設定教學：Application、Canvas 與自動縮放](/post/pixijs-scene-setup)：同屬「前端開發」主題，可延伸理解相近問題的判斷方式。

## 最後更新

Tue Jan 08 2013 08:00:00 GMT+0800 (Taiwan Standard Time)
`;export{e as default};