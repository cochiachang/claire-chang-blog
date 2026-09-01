var e=`---
title: "Flex 教學：用 DataGrid 與 HTTPService 讀取 XML 製作表格"
description: "Flex DataGrid 搭配 HTTPService 讀取 XML 資料的完整範例：用 MXML 綁定 dataProvider、自訂欄位 headerText 與 dataField，快速做出書店書籍清單表格，含完整可執行程式碼。"
date: 2009-04-16
category: 前端開發
tags: [Flex, DataGrid, HTTPService, MXML, XML]
readingTime: 2 分鐘
image: /images/tech/hero_flex-datagrid-httpservice-table.webp
imageAlt: "Flex DataGrid 與 HTTPService 資料表格示意圖"
---


# Flex 教學：用 DataGrid 與 HTTPService 讀取 XML 製作表格

這篇文章解決「如何在 Flex 中把 XML 資料呈現成表格」的問題。我用 \`mx:HTTPService\` 載入一份 XML 檔，再把回傳結果直接綁定（data binding）到 \`mx:DataGrid\` 的 \`dataProvider\`，不需要寫任何 ActionScript 就能完成一個書店書籍清單表格。以下附上完整可執行的 MXML 程式碼與逐段說明。

## 怎麼用 HTTPService 載入 XML 並餵給 DataGrid？

核心流程只有三步：

1. 在 \`mx:Application\` 上設定 \`creationComplete="booksXML.send()"\`，應用程式一啟動就發出 HTTP 請求。
2. 用 \`mx:HTTPService\` 指定 \`url="data/book_store.xml"\`，Flex 會自動把 XML 解析成可綁定的物件結構。
3. 把 \`booksXML.lastResult.store.book\` 綁到 DataGrid 的 \`dataProvider\`，資料一到就自動渲染成表格。

## 完整 MXML 程式碼

\`\`\`xml
<?xml version="1.0" encoding="utf-8"?>
<mx:Application
  xmlns:mx="http://www.adobe.com/2006/mxml"
  layout="vertical"
  creationComplete="booksXML.send()" width="800" height="600">

  <mx:HTTPService
    id="booksXML"
    url="data/book_store.xml"/>

  <mx:Label color="0xFFFFFF"
    text="** {booksXML.lastResult.store.store_title} **" fontSize="18" fontWeight="bold"/>

  <mx:DataGrid width="600" height="400"
    dataProvider="{booksXML.lastResult.store.book}">
    <mx:columns>
      <mx:DataGridColumn headerText="編號" dataField="id" width="30"/>
      <mx:DataGridColumn headerText="書名" dataField="bookname"/>
      <mx:DataGridColumn headerText="分類" dataField="category" width="80"/>
      <mx:DataGridColumn headerText="售價" dataField="sprice" width="60"/>
      <mx:DataGridColumn headerText="特價" dataField="sale" width="60"/>
    </mx:columns>
  </mx:DataGrid>

  <mx:HBox>
    <mx:Label color="0xFFFFFF"
      text="書店地址：{booksXML.lastResult.store.store_address}"/>
    <mx:Spacer width="200"/>
    <mx:Label color="0xFFFFFF"
      text="聯絡電話：{booksXML.lastResult.store.store_telephone}"/>
  </mx:HBox>
</mx:Application>
\`\`\`

## 程式碼重點說明

| 元件 | 作用 |
| --- | --- |
| \`creationComplete="booksXML.send()"\` | 應用程式載入完成後立即呼叫 HTTPService |
| \`<mx:HTTPService id="booksXML">\` | 以 \`url\` 指向 XML 檔，結果存在 \`lastResult\` |
| \`dataProvider="{booksXML.lastResult.store.book}"\` | 大括號語法做資料綁定，XML 的 \`book\` 節點陣列就是表格的資料列 |
| \`headerText\` / \`dataField\` | \`headerText\` 是表格標題（可中文），\`dataField\` 對應 XML 節點名稱 |
| \`width\`（欄位） | 逐欄指定寬度，讓版面更整齊 |

除了表格本身，我還用 \`{booksXML.lastResult.store.store_title}\`、\`store_address\`、\`store_telephone\` 把書店名稱、地址、電話直接綁到 \`Label\` 上——同一份 XML 裡的非清單欄位也能這樣取出。這個範例的好處是完全不需要手寫事件處理或 \`result\` handler，靠 MXML 的資料綁定就能自動更新。

## 常見問題

### HTTPService 的 lastResult 什麼時候才有值？

在 \`send()\` 送出請求、伺服器回應之後才會填入。因為用了資料綁定（大括號語法），\`lastResult\` 一有值，DataGrid 和 Label 都會自動更新，不需要另外寫事件處理。

### XML 檔要放在哪裡？

範例中 \`url="data/book_store.xml"\` 是相對於發佈後 SWF 的路徑，把 XML 放在與 SWF 同層的 \`data/\` 資料夾即可。若要跨網域載入，目標伺服器必須提供 crossdomain.xml 政策檔。

### DataGridColumn 的 dataField 要對應什麼？

\`dataField\` 對應 XML（或物件）中每筆資料的節點名稱。例如 \`dataField="bookname"\` 就會去每個 \`book\` 節點抓 \`bookname\` 的值顯示在該欄。

### 為什麼我沒寫 ActionScript 也能載入資料？

因為 \`creationComplete\` 事件直接在 MXML 屬性裡呼叫 \`booksXML.send()\`，而資料綁定讓 UI 在結果回來時自動重繪。這是 Flex 宣告式開發的最大優點。

## 參考資料
- [Adobe Flex 官方文件：HTTPService](https://help.adobe.com/zh_TW/FlashPlatform/reference/actionscript/3/mx/rpc/http/HTTPService.html)
- [Adobe Flex 官方文件：DataGrid](https://help.adobe.com/zh_TW/FlashPlatform/reference/actionscript/3/mx/controls/DataGrid.html)

## 延伸閱讀

- [把 Flex SDK 4 整合進 Flex Builder 3](/post/integrate-flex-sdk-4-into-flex-builder-3)：同樣聚焦 Flex，可接著比較不同情境的做法。
- [Flex 元數據標籤——告訴編譯器如何編譯](/post/flex-metadata-tags)：同樣聚焦 Flex、MXML，可接著比較不同情境的做法。
- [Flex 元數據標籤（Metadata Tags）完整指南——告訴編譯器如何編譯](/post/flex-metadata-tags)：同樣聚焦 Flex、MXML，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2009-04-16，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};