var e=`---
title: 用 Charles 以本地或遠端內容取代網路回應
description: 用 Charles 的 Rewrite 或 Map Local 功能，把本地檔案或改寫規則取代遠端伺服器的網路回應，不用等後端改版就能測前端。本文整理 Map Remote、Map Local 與 Rewrite 的設定步驟。
date: 2020-02-27
category: 後端開發
tags: [Charles, Map Local, Rewrite, Map Remote, API 測試]
readingTime: 5 分鐘
image: /images/tech/hero_charles-rewrite-network-response.webp
imageAlt: Charles Map Local 與 Rewrite 功能設定畫面
---


# 用 Charles 以本地或遠端內容取代網路回應

本地開發時 API 還沒好、或想固定回傳內容來測試前端畫面，該怎麼辦？這篇整理 Charles 的三個實用功能：Map Local 可以用本地檔案取代網路回應、Rewrite 可以修改回應的檔頭與內容、Map Remote 則能把請求轉導到另一個環境網址，讓開發與測試更靈活。

## 如何用本地檔案取代網路回應（Map Local）？

有時我們在本地開發網頁功能時，若以 API 的方式去讀取資料，當我們在測試時可能會希望回傳某個固定的 response。這時候就可以用 \`Map Local\` 的功能。

![Charles 的 Map Local 設定畫面](/images/articles/charles-rewrite-network-response-1.webp)

### 使用步驟

**1、Save Response**

選擇要模擬數據的接口，然後右鍵，選擇「Save Response」：

![在 Charles 中對接口右鍵選擇 Save Response](https://img-blog.csdn.net/20171108111515904?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc29waGllREpG/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

**2、修改 Response**

保存到本地的 Response 信息可以任意修改：

![修改保存到本地的 Response 內容](https://img-blog.csdn.net/20171108112252066?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc29waGllREpG/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

**3、設置 Map Local**

內容準備完成之後，可以設置當我們打 API 時會回應的內容是我們剛剛設定的本機文件。選擇要模擬數據的網址右鍵，在彈出的菜單中選擇「Map Local」，設置如下：

![選擇網址右鍵設定 Map Local](https://img-blog.csdn.net/20171108112711677?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc29waGllREpG/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

![Map Local 規則的詳細設定畫面](https://img-blog.csdn.net/20171108113513370?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc29waGllREpG/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

**4、Map Local 的禁用和啟用**

Map Local 一般用於測試，測試完成後需要禁用 \`Map Local\` 功能。在 Charles 中從菜單欄選擇「Tools → Map Local」，可以選擇啟用或是禁用此功能。

## 為什麼需要 Rewrite 功能？

在做 Map Local 時，有時會遇到因為檔頭不同而被軟體拒絕連線或產生錯誤訊息。這時候要比對兩個 request 與 response 的內容與 header 有什麼不同，然後啟用 Rewrite 功能來讓本地端檔案與伺服器端檔案有相同的檔頭。

因此我們若是需要去修改回傳 response 的檔頭或者內容時，可以使用 Charles 的 Rewrite 功能：

![Charles 的 Rewrite 功能設定畫面](/images/articles/charles-rewrite-network-response-2.webp)

### 設定方式

添加一個 Rewrite 規則，以將 JSON 回應內容更改為 \`{"foo":"bar"}\`：

![添加 Rewrite 規則修改 JSON 回應內容](https://deliveroo.engineering/)（原文參考頁面已下線，僅存檔截圖仍可從原文連結取得）

![Rewrite 規則中設定 JSON 回應為 foo bar](https://deliveroo.engineering/images/posts/how-to-use-charles-proxy-to-rewrite-https-traffic-for-web-applications/11-rewrite-json.png)

從這邊可以看出回應有沒有真正被套用到設定的修改：

![Rewrite 套用後的回應內容驗證畫面](https://deliveroo.engineering/images/posts/how-to-use-charles-proxy-to-rewrite-https-traffic-for-web-applications/12-rewrite-notes.png)

## 如何用 Map Remote 轉導網址？

常常我們開發環境會分成 dev、qat 等等。若我們 dev 的程式想要連接到 qat 去，可以使用 Map Remote 的功能，將連接到 dev 環境的網路通訊都轉到 qat 去。

這可以幫助我們在正式環境上，將 API 轉導到 DEV 環境去測試上了新的 API 對舊版網站是否有影響。

**1. 開啟 Map Remote 功能**

![開啟 Charles Map Remote 功能的畫面](/images/articles/charles-rewrite-network-response-3.webp)

**2. 把 https://google.com.tw 的 request 轉導到 http://claire-chang.com**

![設定將 google.com.tw 轉導到 claire-chang.com 的規則](/images/articles/charles-rewrite-network-response-4.webp)

這邊要注意：若是 Query 有輸入的話，則網址帶的 query 需要一模一樣才會被轉導。若是有可能會有時間戳記等每次都不同的 query，則需將 query 這欄留空。

## 常見問題

### Map Local 是什麼？

Map Local 是 Charles 的功能，可以把指定的 API 回應換成本地檔案內容。常用在本地開發時模擬固定的 response，方便測試前端畫面。

### Map Local 被拒絕連線或出現錯誤怎麼辦？

通常是本地檔案與伺服器回應的檔頭不同造成的。可比對兩者的 header 差異，並用 Rewrite 功能修改，讓本地端檔案具有相同的檔頭。

### Map Remote 適合什麼情境？

開發環境分成 dev、qat 等多套時，可以用 Map Remote 把連到 dev 的通訊轉導到 qat，或在正式環境把 API 轉導到 DEV 環境，測試新 API 對舊版網站的影響。

### 為什麼 Map Remote 的轉導沒有生效？

若 Query 欄位有輸入，網址帶的 query 必須一模一樣才會被轉導。遇到時間戳記等每次都不同的 query 時，要把 query 這欄留空。

## 參考資料

- [How to use Charles Proxy to rewrite HTTPS traffic for web applications（Deliveroo Engineering）](https://deliveroo.engineering/images/posts/how-to-use-charles-proxy-to-rewrite-https-traffic-for-web-applications/10-rewrite.png)

## 延伸閱讀

- [如何用 Charles 以本地/遠端內容取代網路回應？Map Local、Rewrite 與 Map Remote 實戰](/post/charles-map-local-remote)：同樣聚焦 Charles、Map Local，可接著比較不同情境的做法。
- [Charles 介紹 - 好用的封包抓取工具](/post/charles-proxy-packet-capture)：同樣聚焦 Charles，可接著比較不同情境的做法。
- [Charles 介紹 – 好用的封包抓取工具](/post/charles-proxy-introduction)：同樣聚焦 Charles，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2020-02-27，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};