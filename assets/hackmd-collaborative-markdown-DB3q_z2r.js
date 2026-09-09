var e=`---
title: HackMD 是什麼？跨平台 Markdown 線上共筆工具介紹與功能筆記
description: HackMD 是好用的 Markdown 線上共筆工具，支援即時多人協作編輯、筆記分享連結與權限設定。本文整理 HackMD 的核心功能、介面操作與適用情境，讓團隊快速上手 Markdown 線上共筆與會議記錄。
date: 2019-10-11
category: 前端開發
tags: [Markdown, HackMD, 共筆, 協作, 線上筆記]
readingTime: 5 分鐘
image: /images/tech/hero_hackmd-collaborative-markdown.webp
imageAlt: HackMD 線上共筆工具的網站介面截圖
---


# HackMD 是什麼？跨平台 Markdown 線上共筆工具介紹與功能筆記

如果你需要和多人一起用 Markdown 即時寫筆記，HackMD 是我最常用的選擇。這篇整理 HackMD 的基本介紹、權限與簡報功能，以及它支援的特殊語法（數學式、UML 圖、五線譜）資源。

## HackMD 是什麼？跟 StackEdit 有什麼不同？

HackMD 網站位置：<https://hackmd.io/recent>

![HackMD 首頁截圖，顯示近期共筆文件列表](/images/articles/hackmd-collaborative-markdown-1.webp)

HackMD 是個跨平台的 Markdown 即時協作筆記，可以在電腦、平板甚至是手機與其他人一起做筆記，同時也可以透過 Facebook、Twitter、GitHub、Dropbox 登入。

和 StackEdit 相比，HackMD 增加了上傳圖片的功能——圖片會自動上傳至 imgur，我們不用煩惱 MD 文章的圖片要如何處理。它也非常適合用來做為大型研討會的線上共筆，Agile Summit 及 JSDC 等大型研討會都是使用這個網站來做為線上共筆平台。

## HackMD 有哪些協作功能？

官方功能介紹：[功能介紹](https://hackmd.io/s/features-tw)

線上協作時可以設定不同使用者有不同的讀寫權限：

![HackMD 共筆權限設定截圖，可為不同使用者指定讀寫權限](/images/articles/hackmd-collaborative-markdown-2.webp)

也支援讓所編輯出的文件以投影片的方式做展示，例如 [slide-example](https://hackmd.io/slide-example?view#Slide-example)。按下右上角分享裡的「簡報模式」，便可以投影片方式展示：

![HackMD 簡報模式分享選單截圖](/images/articles/hackmd-collaborative-markdown-3.webp)

## HackMD 支援哪些特殊語法？

這裡有 HackMD 支援的[語法介紹](https://hackmd.io/features-tw?both)，按下編輯可以看到成果與語法的比較圖。

同樣支援 \`MathJax\` 數學符號功能、UML 圖表，還支援五線譜語法，功能非常強大：

![HackMD 語法示範截圖，包含數學式與圖表語法的成果比較](/images/articles/hackmd-collaborative-markdown-4.webp)

各種圖表語法的更多細節：

- 更多關於 **循序圖** 語法：[js-sequence-diagrams](http://bramp.github.io/js-sequence-diagrams/)
- 更多關於 **流程圖** 語法：[flowchart.js](http://adrai.github.io/flowchart.js/)
- 更多關於 **mermaid** 語法：[mermaid]([Mermaid 官方網站](https://mermaid.js.org/))
- 更多關於 **abc**（五線譜）語法：[abc notation](http://abcnotation.com/learn)

## 常見問題

### HackMD 可以免費使用嗎？

可以，在 hackmd.io 上註冊即可免費使用，支援 Facebook、Twitter、GitHub、Dropbox 等帳號登入。

### HackMD 和 StackEdit 有什麼差別？

兩者都是線上 Markdown 編輯器，但 HackMD 主打即時多人協作，並支援圖片上傳（自動傳到 imgur）、權限控制與簡報模式，更適合共筆場景。

### HackMD 能把筆記變成投影片嗎？

可以，文件中用 \`---\` 分頁後，按下右上角分享選單裡的「簡報模式」，就能以投影片方式展示整份筆記。

### HackMD 支援畫圖表嗎？

支援，內建 MathJax 數學式、UML 循序圖、flowchart.js 流程圖、graphviz、mermaid 圖表，甚至還有 abc 五線譜語法。

## 參考資料

- [HackMD 功能介紹（官方）](https://hackmd.io/s/features-tw)
- [HackMD 支援的語法介紹](https://hackmd.io/features-tw?both)
- [HackMD 簡報模式範例](https://hackmd.io/slide-example?view#Slide-example)

## 延伸閱讀

- [StackEdit Markdown 線上編輯工具教學：語法、同步與匯出](/post/stackedit-markdown-online-editor)：同樣聚焦 Markdown，可接著比較不同情境的做法。
- [讓 IDE 支援 Angular Language Service](/post/angular-language-service-ide-support)：同屬「前端開發」主題，可延伸理解相近問題的判斷方式。
- [[GGJ-2014] 活動參與心得](/post/ggj-2014-participation-reflection)：同屬「前端開發」主題，可延伸理解相近問題的判斷方式。

## 最後更新

2026-08-28（原文發布於 2019-10-11，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};