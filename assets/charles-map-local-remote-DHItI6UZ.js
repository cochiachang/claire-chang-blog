var e=`---
title: "如何用 Charles 以本地/遠端內容取代網路回應？Map Local、Rewrite 與 Map Remote 實戰"
description: "在本地開發網頁功能時，我想回傳固定的 API response 該怎麼做？本文整理用 Charles 的 Map Local 以本地檔案取代網路回應、搭配 Rewrite 修改檔頭，以及用 Map Remote 把 dev 環境的請求轉導到 qat 或正式環境的完整步驟與注意事項。"
date: 2020-02-27
category: 前端開發
tags: [Charles, Map Local, Map Remote, Rewrite, API 測試]
readingTime: 4 分鐘
image: /images/tech/hero_charles-map-local-remote.webp
imageAlt: 筆電螢幕上顯示網路請求與回應資料的畫面，象徵用 Charles 攔截與取代 API 回應
---


# 如何用 Charles 以本地/遠端內容取代網路回應？Map Local、Rewrite 與 Map Remote 實戰

## 為什麼測試 API 時需要用 Map Local 取代網路回應？

有時我們在本地開發網頁功能時，若以 API 的方式去讀取資料，當我們在測試時可能會希望回傳某個固定的 response。這時候就可以用 \`Map Local\` 的功能。

![Charles 的 Map Local 設定畫面](/images/articles/charles-map-local-remote-1.webp)

使用步驟：

### 1、Save Response

選擇要模擬數據的接口，然後右鍵，選擇 "Save Response"。

### 2、修改 Response

保存到本地的 Response 資訊可以任意修改，如下。

### 3、設置 Map Local

內容準備完成之後，可以設置當我們打 API 時會回應的內容是我們剛剛設定的本機的文件，選擇要模擬數據的網址右鍵，在彈出的選單中選擇 "Map Local"，設置如下。

### 4、Map Local 的禁用和啟用

Map Local 一般用於測試，測試完成後，需要禁用 \`Map Local\` 功能。Charles 選單欄選擇 "Tools -> Map Local"，可以選擇啟用或是禁用此功能。

## 遇到檔頭不同被拒絕連線時，怎麼用 Rewrite 功能解決？

在做 Map Local 時，有時會遇到因為檔頭不同而被軟體拒絕連線或是產生錯誤訊息，這時候就要比對兩個 request 與 response 的內容與 header 有什麼不同，然後啟用 Rewrite 功能來修改本地端檔案與伺服器端檔案有相同的檔頭。

因此我們若是需要去修改回傳 response 的檔頭或者內容時，可以使用 Charles 的 Rewrite 功能。

![Charles 的 Rewrite 設定畫面](/images/articles/charles-map-local-remote-2.webp)

設定方式是添加一個 Rewrite 規則，以將 JSON 回應內容更改為 \`{"foo":"bar"}\`。從這邊可以看出回應有沒有真正被套用到設定的修改。

## 如何用 Map Remote 把 dev 環境的請求轉導到其他環境？

常常我們開發環境會分成 dev、qat 等等，若我們 dev 的程式想要連接到 qat 去，可以使用 Map Remote 的功能，將連接到 dev 環境的網路通訊都轉到 qat 去。這可以幫助我們在正式環境上，可以將 API 轉導到 DEV 環境去測試上了新的 API 對舊版網站是否有影響。

以我的設定為例：

1. 開啟 Map Remote 功能

![開啟 Charles 的 Map Remote 功能](/images/articles/charles-map-local-remote-3.webp)

2. 把 https://google.com.tw 的 request 轉導到 http://claire-chang.com

![設定 Map Remote 的轉導規則](/images/articles/charles-map-local-remote-4.webp)

這邊要注意，若是 Query 有輸入的話，則網址帶的 query 需要一模一樣才會被轉導，若是有可能會有時間戳記等每次都不同的 query，則需將 query 這欄留空。

## 常見問題

### Charles 的 Map Local 和 Map Remote 有什麼差別？

Map Local 是用本機檔案的內容直接取代網路回應，適合模擬固定的 API response。Map Remote 則是把請求轉導到另一個網址，適合在 dev、qat 等不同環境之間切換測試。

### Map Local 測試完後忘記關閉會怎麼樣？

符合設定的請求會一直被本地檔案取代，導致你以為伺服器已經更新，實際上看到的卻是舊的模擬資料。建議測試完成後到 Tools -> Map Local 把功能或對應規則停用。

### 用 Map Local 出現拒絕連線或錯誤訊息怎麼辦？

通常是本地檔案與伺服器回應的檔頭不一致造成的。先比對兩邊 request 與 response 的 header 差異，再用 Rewrite 功能修改，讓本地端檔案與伺服器端檔案有相同的檔頭。

### Map Remote 的 Query 欄位該怎麼填？

若 Query 欄位有輸入值，網址帶的 query 必須一模一樣才會被轉導。如果 query 可能包含時間戳記等每次都不同的參數，則需將 query 欄位留空，才能穩定轉導。

## 參考資料

- [Charles 官方文件：Map Local](https://www.charlesproxy.com/documentation/tools/map-local/)
- [Charles 官方文件：Map Remote](https://www.charlesproxy.com/documentation/tools/map-remote/)
- [Charles 官方文件：Rewrite](https://www.charlesproxy.com/documentation/tools/rewrite/)

## 延伸閱讀

- [用 Charles 以本地或遠端內容取代網路回應](/post/charles-rewrite-network-response)：同樣聚焦 Charles、Map Local，可接著比較不同情境的做法。
- [Charles 介紹 - 好用的封包抓取工具](/post/charles-proxy-packet-capture)：同樣聚焦 Charles，可接著比較不同情境的做法。
- [Charles 介紹 – 好用的封包抓取工具](/post/charles-proxy-introduction)：同樣聚焦 Charles，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2020-02-27，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};