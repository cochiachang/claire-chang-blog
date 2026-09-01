var e=`---
title: Flex 3 原生 TabNavigator 分頁太多怎麼辦？SuperTabNavigator 解法整理
description: 原生 TabNavigator 分頁過多不會自動產生捲動列，也沒有跳頁選單，介紹 SuperTabNavigator 這個開源元件的解法。
date: 2009-10-20
category: 前端開發
tags: [Flex, ActionScript, TabNavigator, UI元件]
readingTime: 3 分鐘
image: /images/tech/hero_flex-supertabnavigator-scrollable-tabs.webp
imageAlt: 一排色彩繽紛的分頁按鈕排列在介面上，示意多分頁導覽元件
---


# Flex 3 原生 TabNavigator 分頁太多怎麼辦？SuperTabNavigator 解法整理

Flex 3 內建的 \`TabNavigator\` 好用，但分頁一多就露餡：分頁總寬度超過容器設定的寬度時，原生元件不會自動長出左右捲動箭頭，使用者只能眼睜睜看著分頁被截斷,也點不到。很多其他常見的編輯介面（像瀏覽器分頁列）右側都會提供一個下拉選單,可以直接跳到任何一頁,原生 \`TabNavigator\` 同樣沒有這個功能。

## 原生 TabNavigator 到底缺了什麼？

原生 \`TabNavigator\` 在分頁數量超出可視寬度時,不會自動產生捲動列。分頁列只會被裁掉,使用者拿不到後面的分頁,除非自己動手擴充元件或改用其他做法。第二個常見缺口是快速跳頁:很多分頁式介面右上角會放一個下拉選單,列出全部分頁名稱,點一下就直接切過去,不用一路點箭頭捲過去。這兩件事原生元件都沒做。

## SuperTabNavigator 怎麼解決這個問題？

SuperTabNavigator 是 Doug McCune 寫的開源元件,直接針對上面兩個缺口補齊:分頁超出寬度時會自動出現左右捲動箭頭,同時提供一個下拉選單可以直接選擇要跳到哪一個分頁。用法上是原生 \`TabNavigator\` 的替代品,拿來換掉專案裡容易分頁爆版的地方最直接。

- 展示頁面(含說明與範例):[dougmccune.com/blog 的 Quest for the Perfect TabNavigator Part 3](http://dougmccune.com/blog/2007/02/07/quest-for-the-perfect-tabnavigator-part-3-with-source/)
- 原始碼下載:[dougmccune.com/flex/supertabnavigator/srcview](http://dougmccune.com/flex/supertabnavigator/srcview/)

## 什麼時候該換成 SuperTabNavigator？

分頁數量固定且數量少的介面,原生 \`TabNavigator\` 通常夠用,沒必要多引入一個第三方元件。但只要分頁數量是動態產生的、或使用情境下分頁數容易超過設計寬度(例如多文件編輯器、多工作區切換這類介面),原生元件捲不動、跳不了頁的問題遲早會被使用者踩到,這時候直接換成 SuperTabNavigator 會比自己重寫一套捲動邏輯省事。

## 常見問題

### SuperTabNavigator 是官方元件嗎？

不是,它是 Doug McCune 個人開發並開源釋出的元件,不屬於 Flex SDK 內建的一部分,需要另外下載原始碼加入專案。

### 換成 SuperTabNavigator 需要大幅修改既有程式嗎？

它的定位是取代原生 \`TabNavigator\`,介面用法相近,但實際搬遷幅度還是取決於專案裡怎麼綁定分頁內容與事件,建議先在展示頁面確認行為符合需求,再評估搬遷成本。


## 參考資料
Doug McCune，Quest for the Perfect TabNavigator Part 3（SuperTabNavigator 元件說明與原始碼），存取日期：2026-08-27。[http://dougmccune.com/blog/2007/02/07/quest-for-the-perfect-tabnavigator-part-3-with-source/](http://dougmccune.com/blog/2007/02/07/quest-for-the-perfect-tabnavigator-part-3-with-source/)

## 延伸閱讀

- [Flex Label 為什麼結尾出現「…」？用 truncateToFit 解決](/post/flex-label-truncatetofit-remove-ellipsis)：同樣聚焦 Flex、ActionScript，可接著比較不同情境的做法。
- [Flex Builder 怎麼裝自動格式化外掛？](/post/flex-builder-auto-format-code)：同樣聚焦 Flex、ActionScript，可接著比較不同情境的做法。
- [Flex Label 文字被截斷成「...」怎麼辦？用 truncateToFit=false 關閉自動截斷](/post/flex-label-truncatetofit)：同樣聚焦 Flex、ActionScript，可接著比較不同情境的做法。
`;export{e as default};