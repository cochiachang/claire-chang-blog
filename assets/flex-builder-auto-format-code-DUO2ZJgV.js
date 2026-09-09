var e=`---
title: Flex Builder 怎麼裝自動格式化外掛？
description: 原生 Flex Builder 不支援自動排版，介紹 FlexFormatter 外掛的安裝步驟與兩個格式化按鈕的差異。
date: 2009-04-15
category: 前端開發
tags: [Flex, Flex Builder, Eclipse, ActionScript, 開發工具]
readingTime: 2 分鐘
image: /images/tech/hero_flex-builder-auto-format-code.webp
imageAlt: 深色背景的程式碼編輯器畫面，螢幕上顯示多行程式碼
---


# Flex Builder 怎麼裝自動格式化外掛？

原生的 Flex 3 沒有內建自動格式化功能，寫 ActionScript 或 MXML 的時候縮排、空格都得自己手動對齊。裝一個叫 FlexFormatter 的外掛就能解決這件事，裝好之後工具列會多出兩個按鈕，一鍵排版。

## FlexFormatter 要怎麼安裝？

安裝步驟很單純，總共四步：

1. 到 [FlexFormatter 的 SourceForge 下載頁](http://sourceforge.net/project/showfiles.php?group_id=248408&package_id=303321&release_id=656626) 下載 \`.jar\` 檔。
2. 把下載下來的 \`.jar\` 丟到 Flex Builder 的 \`plugin\` 資料夾（如果用的是 Eclipse 3.4 以上版本，則是放到 \`dropins\` 資料夾）。
3. 重新啟動 Flex Builder。如果按鈕沒有跑出來，就到捷徑的「目標」欄位最後面加上 \`-clean\` 參數再開一次。
4. 安裝完成後，工具列上會多出兩個新的 formatter 按鈕。

## 兩個格式化按鈕差在哪？

裝好外掛後工具列會出現「Format Flex Code」和「Indent Flex Code」兩個按鈕，功能不一樣：

- **Format Flex Code**：全面重新排版，字元間隔、\`if\` 判斷式的格式等等都會照統一規則調整。
- **Indent Flex Code**：只調整每一行的縮排位置，不動其他格式。

想大幅整理舊程式碼就用 Format，只是行位置跑掉、其他格式都還ok的話用 Indent 比較保險，不會動到原本手動調整過的排版習慣。

## 還有其他參考資源嗎？

FlexFormatter 的官方網站是 [flexformatter.sourceforge.net](http://flexformatter.sourceforge.net/)，上面有更完整的功能說明，可以進一步參考。

## 常見問題

### 裝完外掛後工具列沒有多出按鈕怎麼辦?

先確認 \`.jar\` 檔放對資料夾——早期 Flex Builder 是丟到 \`plugin\`，Eclipse 3.4 以上版本則要放到 \`dropins\`。放對位置後重開 Flex Builder，如果按鈕還是沒出現，就在啟動捷徑的「目標」欄位最後面加上 \`-clean\` 參數，再開一次強制重新載入外掛。

### Format 跟 Indent 這兩個按鈕該用哪一個?

要大幅整理一份很久沒動過的舊程式碼,用 Format Flex Code,它會連字元間隔、\`if\` 判斷式格式都一併重新排版。如果只是行位置跑掉、其他格式都還算整齊,用 Indent Flex Code 比較保險,不會動到原本手動調整過的排版習慣。

### FlexFormatter 支援哪些檔案類型?

ActionScript 跟 MXML 都支援，這也是 Flex 3 開發最常需要手動對齊縮排的兩種檔案，裝上外掛後可以省掉大量手動排版的時間。

## 參考資料
- FlexFormatter，SourceForge 專案頁面（Eclipse/Flex Builder 的 ActionScript 與 MXML 程式碼格式化外掛），存取日期：2026-08-27。[https://sourceforge.net/projects/flexformatter/](https://sourceforge.net/projects/flexformatter/)

## 延伸閱讀

- [把 Flex SDK 4 整合進 Flex Builder 3](/post/integrate-flex-sdk-4-into-flex-builder-3)：同樣聚焦 Flex、Flex Builder，可接著比較不同情境的做法。
- [Flex 3 原生 TabNavigator 分頁太多怎麼辦？SuperTabNavigator 解法整理](/post/flex-supertabnavigator-scrollable-tabs)：同樣聚焦 Flex、ActionScript，可接著比較不同情境的做法。
- [Flex Builder 的 Profile 記憶體監控怎麼用？](/post/flex-builder-profile-memory-monitoring)：同樣聚焦 Flex、ActionScript，可接著比較不同情境的做法。
`;export{e as default};