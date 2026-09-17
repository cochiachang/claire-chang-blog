var e=`---
title: iOS 切換 ViewController 會用到的函數整理
description: 整理 iOS 切換 UIViewController 的常用函數：有 NavigationController 時的 pushViewController 與 presentModalViewController 兩種做法，以及取得子、父 ViewController 的 presentedViewController 與 presentingViewController 用法，附 Objective-C 範例程式碼。
date: 2013-08-18
category: 前端開發
tags: [Objective-C, iOS, UIViewController, UINavigationController]
readingTime: 3 分鐘
image: /images/tech/hero_ios-uiview-drawing-basics.webp
imageAlt: iOS UIViewController 切換函數整理示意圖
---


# iOS 切換 ViewController 會用到的函數整理

在開發 iOS App 時，切換 UIViewController 是最基礎也最常用的操作。這篇筆記整理我常用的兩種切換方式——有 NavigationController 時用 push/pop，没有時用 presentModal/dismissModal——以及如何在切換後取得子或父 ViewController 來傳遞資料，全部附上 Objective-C 範例程式碼。

## 切換 UIViewController 的兩種方式是什麼？

### 1. 有 NavigationController 時

**方法一：右側進入**

\`\`\`objc
SecondViewController* svc = [[SecondViewController alloc] init];
[self.navigationController pushViewController:svc animated:YES];
\`\`\`

返回到上一頁：

\`\`\`objc
[self.navigationController popViewControllerAnimated:YES];
\`\`\`

**方法二：下面切入**

\`\`\`objc
SecondViewController* svc = [[SecondViewController alloc] init];
[self.navigationController presentModalViewController:svc animated:YES];
\`\`\`

返回到上一個 UIViewController：

\`\`\`objc
[self.navigationController dismissModalViewControllerAnimated:YES];
\`\`\`

### 2. 没有 NavigationController 的切換方法

\`\`\`objc
SecondViewController* svc = [[SecondViewController alloc] init];
[self presentModalViewController:svc animated:YES];
\`\`\`

返回到上一個 UIViewController：

\`\`\`objc
[self dismissModalViewControllerAnimated:YES];
\`\`\`

## 如何取得子 ViewController 或父 ViewController？

假設 View A 是來源的 ViewController，而 View B 是目標 ViewController。

**1. 取得子 viewController**

\`\`\`objc
((B *)self.presentedViewController).屬性名
\`\`\`

**2. 取得父 viewController**

\`\`\`objc
((A *)self.presentingViewController).屬性名
\`\`\`

其中括號和類名是一種強制轉類型的用法，轉型後就可以直接存取目標 ViewController 的屬性來傳遞或讀取資料。

## 常見問題

### pushViewController 和 presentModalViewController 有什麼差別？

\`pushViewController\` 會從畫面右側推入新的 ViewController，並把頁面壓進 NavigationController 的堆疊，適合有階層關係的頁面導覽。\`presentModalViewController\` 則是從畫面下方切入，以 Modal 方式呈現，適合獨立的暫時性任務畫面。

### 没有 NavigationController 時要怎麼切換 ViewController？

直接對目前的 ViewController 呼叫 \`presentModalViewController:animated:\` 就可以切換過去。返回時呼叫 \`dismissModalViewControllerAnimated:\` 即可回到上一個畫面，不需要透過 navigationController。

### 切換後要怎麼取得另一個 ViewController 的屬性？

用 \`self.presentedViewController\` 可以取得自己 present 出去的子 ViewController，用 \`self.presentingViewController\` 則可以取得 present 自己的父 ViewController。兩者都透過括號強制轉型成實際類別後，就能直接存取其屬性來傳遞資料。

### dismissModalViewControllerAnimated 是誰該呼叫？

由被 present 出來的 ViewController 自己呼叫即可，它會自動回到原本的畫面；也可以由父 ViewController 呼叫 \`[self.navigationController dismissModalViewControllerAnimated:YES]\` 來關閉。兩種寫法效果相同，依程式架構選擇即可。

## 參考資料

- 本文為我開發 iOS App 時的個人筆記，整理自 Apple 官方的 UIViewController 與 UINavigationController 文件用法。

## 延伸閱讀

- [iOS 切換 View 會用到的函數整理：pushViewController 與 presentModalViewController 怎麼選？](/post/ios-uiviewcontroller-switch-functions)：同樣聚焦 iOS、Objective-C，可接著比較不同情境的做法。
- [iOS 6 以上如何控制畫面支援的旋轉方向](/post/ios-supported-interface-orientations)：同樣聚焦 iOS、Objective-C，可接著比較不同情境的做法。
- [iOS 6 與 iOS 7 的不同處整理](/post/ios6-ios7-ui-behavior-differences)：同樣聚焦 iOS、Objective-C，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2013-08-18，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};