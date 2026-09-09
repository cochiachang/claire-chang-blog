var e=`---
title: UITableView 放進 UIView 後 Static Cells 顯示空白怎麼解？
description: UITableView 塞進 UIView 時 static cells 在 storyboard 正常、執行卻空白，原因與 Container View 解法。
date: 2013-12-11
category: 前端開發
tags: [Objective-C, UITableView, iOS, Storyboard]
readingTime: 3 分鐘
image: /images/tech/hero_uitableview-static-cells-in-uiview.webp
imageAlt: iOS 開發者在筆電上瀏覽程式教學網站
---


# UITableView 放進 UIView 後 Static Cells 顯示空白怎麼解？

在 UIView 裡放一個設定了 static cells 的 UITableView，storyboard 裡看起來完全正常，一執行卻是一片空白——這是因為 static cells 只能配合 \`UITableViewController\`，不能直接放進普通的 \`UIView\`。解法是改用 Container View，把這個 UITableView 獨立成另一個 \`UITableViewController\` 場景，再用 Container 接回原本的畫面。

## 為什麼 storyboard 看起來正常、執行卻是空白？

當時的情境是這樣：畫面上除了一個 static cells 的 UITableView，還想擺一些自己的元件，所以把 UITableView 直接拖進一個 UIView 裡管理。在 storyboard 編輯畫面上，static cells 該有的樣子都看得到：

![UITableView 在 storyboard 中正常顯示 static cells](/images/tech/uitableview-static-cells-storyboard.webp)

但實際跑起來，畫面卻是空的，什麼都沒有：

![UITableView 執行後顯示空白畫面](/images/tech/uitableview-static-cells-blank.webp)

一開始懷疑是自己不小心實作了 \`numberOfSectionsInTableView:\`、\`tableView:numberOfRowsInSection:\`、\`tableView:cellForRowAtIndexPath:\` 這三個 data source 方法，因為在 [Stack Overflow 上有一篇討論](https://stackoverflow.com/questions/8639780/uitableview-with-static-cells-does-not-appear)提到，只要實作了這三者，static cells 就會被蓋掉、改成動態產生 row。檢查過後發現自己根本沒寫這幾個方法，問題還是沒解。

## Static cells 為什麼一定要配合 UITableViewController？

真正的原因是：static cells 是 \`UITableViewController\` 的功能，不能直接用在塞進 \`UIView\` 裡的 UITableView 上。這點在 [How do I put a UITableView into a UIView](https://stackoverflow.com/questions/16319058/how-do-i-put-a-uitableview-into-a-uiview) 這篇裡有講清楚——如果需要在有 static cells 的畫面裡，還放其他自訂元件，就不能把 UITableView 直接丟進普通 UIView，得改用 Container View 的作法。

## 用 Container View 接回 UITableViewController 該怎麼做？

做法是在原本的畫面上，需要放 UITableView 的位置改放一個 Container View，然後把這個 Container 連接到另一個獨立的 \`UITableViewController\` 場景（那個場景裡才是設定 static cells 的地方）：

![Container View 連接到 UITableViewController 的設定畫面](/images/tech/uitableview-container-view-setup.webp)

這樣一來，UIView 負責原本畫面上的其他元件，Container 再把 static cells 的 UITableViewController 嵌進來，兩邊互不干擾。設定完成後重新執行，畫面正常顯示出 storyboard 裡設計好的 static cells 樣式：

![UITableView 執行後正常顯示 static cells](/images/tech/uitableview-static-cells-working.webp)

Container View 與母畫面之間的互動，可以參考 [Container View Controllers - Parent-Child View Controller Relationships](http://sketchytech.blogspot.tw/2012/09/container-view-controllers-parent-view.html) 這篇的範例。

## 常見問題

### 為什麼 static cells 的 UITableView 不能直接放進 UIView？

因為 static cells 是綁在 \`UITableViewController\` 這個角色上的功能，一般的 \`UIView\` 沒有對應的機制去驅動它，所以 storyboard 裡編輯得出來，執行時卻不會被正確載入。

### 沒有實作 data source 方法，static cells 為什麼還是不顯示？

如果原因不是 data source 方法蓋掉 static cells，那多半就是本文這種情況：UITableView 被放進了普通 UIView，而不是透過 Container View 連接到 UITableViewController。

### 一定要放棄自訂的 UIView 元件才能用 static cells 嗎？

不用。用 Container View 把 static cells 的 UITableViewController 嵌進原本的畫面即可，UIView 裡原有的其他元件可以照舊保留，兩者是分開管理、互不影響的。

## 參考資料

Apple Developer Documentation，〈Creating and Configuring a Table View〉，說明 static table view 的內容型態與 \`UITableViewController\` 的搭配要求，存取日期：2026-08-27。[https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/TableView_iPhone/CreateConfigureTableView/CreateConfigureTableView.html](https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/TableView_iPhone/CreateConfigureTableView/CreateConfigureTableView.html)

## 延伸閱讀

- [iOS UIView 操作與 Core Graphics 繪圖入門](/post/ios-uiview-drawing-basics)：同樣聚焦 iOS、Objective-C，可接著比較不同情境的做法。
- [iOS 切換 View 會用到的函數整理：pushViewController 與 presentModalViewController 怎麼選？](/post/ios-uiviewcontroller-switch-functions)：同樣聚焦 iOS、Objective-C，可接著比較不同情境的做法。
- [iOS 6 與 iOS 7 的不同處整理](/post/ios6-ios7-ui-behavior-differences)：同樣聚焦 iOS、Objective-C，可接著比較不同情境的做法。

## 最後更新

2026-08-28

`;export{e as default};