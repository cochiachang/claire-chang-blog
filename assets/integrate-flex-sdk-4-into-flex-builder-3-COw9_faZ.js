var e=`---
title: "把 Flex SDK 4 整合進 Flex Builder 3"
description: "Flex Builder 4 還沒推出前，用這個方法把 Flex SDK 4 掛進 Flex Builder 3，照樣能視覺化開發。"
date: 2009-07-22
category: "前端開發"
tags: ["Flex", "Flex Builder", "ActionScript", "Flash Player"]
readingTime: "5 分鐘"
image: /images/tech/hero_integrate-flex-sdk-4-into-flex-builder-3.webp
imageAlt: "深色背景的程式碼編輯器畫面，螢幕上顯示多行語法上色的程式碼"
---


# 把 Flex SDK 4 整合進 Flex Builder 3

Flex SDK 4 已經釋出，但對應的 IDE——Flex Builder 4——還沒上市。好消息是，不用乾等，把 Flex SDK 4 手動掛進現有的 Flex Builder 3，一樣可以用原本熟悉的視覺化開發環境繼續做事。以下是完整的整合步驟。

## 開始之前要準備什麼？

整合前需要準備兩樣東西：Flex SDK 4 的安裝檔，以及一台裝有 Flash Player 10 以上版本的電腦。

到 Adobe 開源社群下載 Flex SDK 4 的 ZIP 檔（約 82MB）：
Flex SDK 4 下載頁（原 opensource.adobe.com Wiki 已關閉）

接著確認本機 Flash Player 版本。多數電腦預設裝的是 9，而 Flex 4 不吃這個版本，一定要升級到 10 以上。到 adobe.com/products/flash/about（Flash 已於 2020 年終止支援，該版本檢測頁已下線） 就能看到目前安裝的版本號，記下類似「You have version 10,0,12,36 installed」這一行，確認數字開頭是 10。

## 怎麼把 Flex SDK 4 裝進 Flex Builder 3？

下載完成後解壓縮，資料夾依版本序號重新命名為 \`4.0.0\`，然後整個搬到：

\`\`\`
C:\\Program Files\\Adobe\\Flex Builder 3\\sdks
\`\`\`

這個資料夾裡原本就會有 \`2.0.1\`、\`3.2.0\` 兩個版本，\`4.0.0\` 是新加進去的第三個。

## 怎麼讓 Flex Builder 3 認得這個新 SDK？

搬完檔案還不夠，Flex Builder 3 要手動告訴它去哪裡找這個 SDK：

1. 打開選單 \`Project > Properties > Flex Compiler\`。
2. 點右上角的「Configure Flex SDKs」，這裡可以看到已經有的 Flex 2.0.1 Hotfix 3 和 Flex 3.2。
3. 按下 Add，Flex SDK location 指向剛剛搬過去的路徑：\`C:\\Program Files\\Adobe\\Flex Builder 3\\sdks\\4.0.0\`。
4. Flex SDK name 通常會自動帶出「Flex 4.0」，沒有的話手動輸入即可。
5. 加入完成後，記得在 Flex 4.0 前面打勾，確認它是目前生效的 SDK。

## 專案要怎麼指定用 Flash Player 10 執行？

這一步很容易漏掉，卻是整合能不能跑起來的關鍵。Flex Builder 3 的專案通常放在「我的文件 > Flex Builder 3」底下，進入要用 Flex SDK 4 開發的專案資料夾，用記事本打開 \`.actionScriptProperties\` 檔案，找到 \`htmlPlayerVersion\` 這個欄位，把版本號從 \`9.x.x\` 改成 \`10.0.12\`。

這裡原本應該可以直接在 Builder 介面裡改，但實測下來改完存檔會失敗，只能退回用記事本手動編輯。

**每次開新專案，或是舊專案要切換成 Flex SDK 4 建構，都得重新做一次這個步驟。** 漏掉的話，Flex Builder 3 還是會呼叫預設的 Flash Player 9，跑出來的結果通常是 \`Error #1046: Type Not Found: Matrix3d\` 這類錯誤，可以參考 ShortFusion 這篇除錯紀錄（原文已下架） 對照。

## 整合完成後，語法上有哪些地方要跟著改？

Flex 4（開發代號 Gumbo）跟 Flex 3 的 XML 命名空間不一樣，既有的 MXML 檔案搬到新 SDK 下不會原封不動能跑，語法上要跟著調整：

- \`xmlns\` 宣告要換成 Flex 4 的版本。
- 原本標籤前面的 \`mx:\` 前綴，在 Flex 4 的新元件裡大多不見了。

實際對照可以參考 FlexExamples 這篇 FXTextArea 文字對齊的範例（原文已下架），能看出新舊語法的差異。

## 還有哪些細節容易踩坑？

- **輸出的 SWF 檔案可以再瘦身**：在 \`Project > Properties > Flex Compiler\` 裡，把編譯參數從 \`-locale en_US\` 改成 \`-locale en_US -debug=false\`，每個 SWF 大概能減少 100KB。代價是除錯訊息會被整個隱藏，正式上線前確認沒問題再改。
- **切到 Design Mode 會跳出警告**：這是已知問題，當時 Flex 開發團隊還在處理，官方論壇上有對應討論串可以追蹤進度：Adobe 官方論壇討論（討論串已隨 Adobe 論壇關閉）。

## 常見問題

### 一定要用記事本改 \`.actionScriptProperties\` 嗎？

目前是的。在 Flex Builder 3 的專案設定介面裡直接改 Flash Player 版本號，實測會發生存不了檔的狀況，用文字編輯器直接改這個 XML 檔反而穩定。

### 忘記做 Flash Player 版本切換會怎樣？

專案還是會用預設的 Flash Player 9 去跑，Flex 4 的元件（例如 3D 相關 API）會直接丟出 \`Error #1046: Type Not Found\` 之類的錯誤，這是最常見的整合失敗原因。

## 參考資料
- Adobe Flex SDK Wiki（SourceForge 存檔版），〈Download Flex 4〉，列出 Flex SDK 4 各里程碑版本的下載連結，存取日期：2026-08-27。[https://sourceforge.net/adobe/flexsdk/wiki/Download%20Flex%204/?version=1](https://sourceforge.net/adobe/flexsdk/wiki/Download%20Flex%204/?version=1)

## 延伸閱讀

- [Flex Builder 怎麼裝自動格式化外掛？](/post/flex-builder-auto-format-code)：同樣聚焦 Flex、Flex Builder，可接著比較不同情境的做法。
- [Flex Builder 的 Profile 記憶體監控怎麼用？](/post/flex-builder-profile-memory-monitoring)：同樣聚焦 Flex、ActionScript，可接著比較不同情境的做法。
- [Flex ResourceManager 動態載入多國語系的實作方式](/post/flex-resourcemanager-multilingual-locale)：同樣聚焦 Flex、ActionScript，可接著比較不同情境的做法。
`;export{e as default};