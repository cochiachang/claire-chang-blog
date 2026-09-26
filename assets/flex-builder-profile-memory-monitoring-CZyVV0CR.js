var e=`---
title: Flex Builder 的 Profile 記憶體監控怎麼用？
description: 說明 Flash Builder Profile 工具的啟用設定、外部 SWF 監控方式，以及常見連線失敗的排除方法。
date: 2013-08-28
category: 前端開發
tags: [Flex, Flash Builder, Profile, 記憶體監控, ActionScript]
readingTime: 4 分鐘
image: /images/tech/flex-profile-memory-usage.webp
imageAlt: Flash Builder Profile 工具的 Memory Usage 面板畫面
---


# Flex Builder 的 Profile 記憶體監控怎麼用？

Flash Builder 裡最常拿來監控記憶體使用狀況的工具就是 Profile，位置在執行鈕的右邊。它能看到程式跑起來後物件怎麼被建立、記憶體怎麼被吃掉，對抓 Flex/AS3 專案的記憶體洩漏特別有用。

## Profile 按下去沒反應，要先檢查什麼？

Profile 常見的失敗原因不是工具壞了，而是環境設定沒對齊。照下面順序排查，通常都能找到問題：

1. 更改 Profile 使用的 port 號碼，避免跟其他程序衝突。
2. 確認 SWF 本身沒有錯誤，且 PreloadSwf 是放在本地端。
3. 換一個瀏覽器。我自己就遇過用 Firefox 打不開的狀況，換成 IE 就解決了。
4. 確認指定的瀏覽器有安裝 debug 版本的 Flash Player。
5. 檢查 \`mm.cfg\` 檔案的設定值。

Stack Overflow 上也有一串類似的除錯討論，可以對照參考：[Flex Builder - Profiler - Can't run profiler](http://stackoverflow.com/questions/5447695/flex-builder-profiler-cant-run-profiler-unable-to-connect-to-the-applicati)。

## 瀏覽器和 Profile 選項要去哪裡設定？

開啟瀏覽器的設定在 \`Window > Preference > General > Web Browser\`，可以在這裡切換要用哪個瀏覽器執行 Profile。

![Flash Builder 開啟瀏覽器設定畫面](/images/tech/flex-profile-browser-preference.webp)

Profile 本身的設定則在另一個頁面，port 號碼要改也是在這裡改。**兩個 enable 選項一定要記得勾選**，沒勾選是 Profile 連不上的常見原因之一。

![Flash Builder Profile 設定畫面，兩個 enable 選項](/images/tech/flex-profile-settings-enable.webp)

設定完之後，接下來要選擇工作區（workspace）：

![選擇 Flash Builder 工作區畫面](/images/tech/flex-profile-select-workspace.webp)

## 怎麼監控外部 SWF 的記憶體？

切到 Profile 模式後，如果要觀察的不是目前專案、而是外部已經打包好的 SWF，可以走 \`Profile > Profile External Application\`，一樣會進入監控模式。

![Profile External Application 選單位置](/images/tech/flex-profile-external-application.webp)

![選擇要監控的外部 SWF 檔案](/images/tech/flex-profile-external-app-select.webp)

## Profile 視窗裡可以看到哪些資訊？

進入 Profile 執行畫面後，左上角的欄位可以選擇要觀察的物件，同時可以在這裡設定中斷點，再用右上角的按鈕控制繼續執行、暫停等操作。

![Profile 視窗工具列與物件選擇欄位](/images/tech/flex-profile-toolbar-controls.webp)

實際監控時，主要會看兩個面板：

- **Memory Usage**：顯示目前程式耗用的記憶體總量與變化趨勢，是抓記憶體洩漏最直接的入口。
- **Live Objects**：列出目前記憶體內存活的物件，包含各個 class 的累計實例數（Cumulative Instances）與累計記憶體（Cumulative Memory），可以直接看出哪個類別佔用最多。

![Memory Usage 面板顯示記憶體耗用狀況](/images/tech/flex-profile-memory-usage.webp)

![Live Objects 面板列出記憶體內的物件與數值](/images/tech/flex-profile-live-objects.webp)

## 還有其他觀察視窗嗎？

如果預設面板不夠用，可以從 \`Window > Show View > Other > Flash Profile\` 叫出其他觀察視窗，補齊需要的分析角度。

![從 Show View 開啟其他 Flash Profile 視窗](/images/tech/flex-profile-show-view-other.webp)

## 常見問題

### Profile 按下去完全沒反應，是哪裡設定錯了？

最常見的原因是兩個 enable 選項沒勾選，或是瀏覽器沒裝 debug 版 Flash Player。先照上面第一節列的五個項目逐一排查即可。

### 要監控已經打包好、不在專案裡開發的 SWF 可以嗎？

可以，用 \`Profile > Profile External Application\` 選擇外部 SWF 檔案即可進入監控，不需要把它加進當前專案。


## 參考資料
Adobe Systems，\`flash.sampler\` Package（Flash Builder Profile 工具底層採樣機制所使用的 API），存取日期：2026-08-27。[https://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/sampler/package.html](https://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/sampler/package.html)

## 延伸閱讀

- [把 Flex SDK 4 整合進 Flex Builder 3](/post/integrate-flex-sdk-4-into-flex-builder-3)：同樣聚焦 Flex、ActionScript，可接著比較不同情境的做法。
- [Flex Builder 怎麼裝自動格式化外掛？](/post/flex-builder-auto-format-code)：同樣聚焦 Flex、ActionScript，可接著比較不同情境的做法。
- [Flex 3 原生 TabNavigator 分頁太多怎麼辦？SuperTabNavigator 解法整理](/post/flex-supertabnavigator-scrollable-tabs)：同樣聚焦 Flex、ActionScript，可接著比較不同情境的做法。
`;export{e as default};