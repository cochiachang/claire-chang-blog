var e=`---
title: Objective-C 命名規則（Naming Convention）與記憶體管理入門筆記
description: 整理 Objective-C 的命名規則（Naming Convention）與記憶體管理重點：類別與變數命名原則、ARC 與 MRC 常見問題、@autoreleasepool 用法，以及 strong 與 weak 的差別與陷阱。
date: 2013-08-06
category: 前端開發
tags: [Objective-C, Naming Convention, 記憶體管理, ARC, iOS]
readingTime: 4 分鐘
image: /images/tech/hero_objective-c-naming-convention-memory-management.webp
imageAlt: Objective-C 命名規則與記憶體管理概念示意圖
---


# Objective-C 命名規則（Naming Convention）與記憶體管理入門筆記

這篇筆記解決兩個 Objective-C 初學者最容易踩坑的問題：程式碼該怎麼命名才清楚易讀，以及 iOS 沒有 GC（垃圾回收）時該如何管理記憶體。內容涵蓋類別、變數、方法的命名原則，ARC 與非 ARC 各自容易發生的記憶體問題、\`@autoreleasepool\` 的用法，還有 \`strong\` 與 \`weak\` 的差別。

## 為什麼命名規則（Naming Convention）這麼重要？

好的命名要符合三個原則：

1. **具解釋性**：看名字就知道它在做什麼
2. **清楚**：不模稜兩可
3. **不會混淆**：不會跟其他東西搞混

## 類別、變數、方法分別該怎麼命名？

- **類別名稱**：
  - 第一個字大寫
  - 前置 namespace（在 Xcode 新增專案時會有 Class Prefix 欄位，就是在設定這個）
  - 駝峰式的寫法（Camel Case）
- **方法名稱**：可以清楚表明意思
- **參數名稱**：避免和 ivar（實體變數）同名

## 變數名稱要表明型別嗎？

變數類型不需特別表明，但可以用名稱去讓人聯想型別，例如：

\`\`\`objc
BOOL isEditable;
NSString *accountName;
NSMutableArray *mailBoxes;
UIImage *previewPaneImage;
NSDictionary *messageDict;
\`\`\`

可以看到慣例：\`BOOL\` 用 \`is\` 開頭、集合變數用複數、型別資訊（\`Image\`、\`Dict\`）直接放進名稱結尾，讀起來一目了然。

## iOS 沒有 GC，記憶體要怎麼管理？

iOS 沒有 GC，記憶體管理的基本概念是：

1. 配置記憶體：\`alloc\`；清除記憶體：\`dealloc\`
2. 兩種常見的記憶體問題：
   - **Zombie（殭屍物件）**：不該用到卻用到（值為 \`nil\` 的物件被存取）
   - **Memory leak（記憶體洩漏）**：已經沒辦法存取，卻沒把記憶體清掉
3. 使用 **ARC** 比較容易發生 zombie；不用 ARC（MRC）則容易發生 memory leak
4. 若某段程式碼會用到大量記憶體，可以用 \`@autoreleasepool { ... }\` 包起來：
   - 缺點：速度會慢一些
   - 優點：記憶體狀況較好（在 iOS 上，記憶體比速度更重要的場景很多）

\`\`\`objc
@autoreleasepool {
    // 大量配置物件的程式碼
}
\`\`\`

## strong 與 weak 有什麼差別？

- 變數宣告為 **\`strong\`**：這個變數會增加物件 retain 的值
- 宣告為 **\`weak\`**：不會增加 retain 值，比較像「依賴」的關係——當主要 \`strong\` 的變數被刪除了，\`weak\` 裡的值也會變為空值（\`nil\`）
- \`strong\` 會增加 retain 值，所以主要變數被刪除後，因為 retain 還是大於 1，物件的記憶體並不會被釋放——**要小心 memory leak**（典型例子就是 delegate 或兩個物件互相 \`strong\` 參考造成的循環保留）

## 常見問題

### Objective-C 的類別名稱一定要加前綴嗎？

建議加上。在 Xcode 新增專案時設定的 Class Prefix 就是 namespace 前綴，可以避免自己的類別和第三方套件或系統框架的類別撞名，也讓程式碼一眼就能辨認來源。

### ARC 是什麼？用了 ARC 就不用管記憶體嗎？

ARC（Automatic Reference Counting）會在編譯期自動插入 retain/release 呼叫，大幅減少手動管理的心力。但它不是 GC，循環參考或誤用 \`weak\`/\`strong\` 仍會造成 memory leak 或 zombie 問題，基本觀念還是要懂。

### 什麼時候該用 @autoreleasepool？

當某段程式碼會在迴圈中或一次建立大量臨時物件時，用 \`@autoreleasepool { ... }\` 包起來可以讓臨時物件盡早釋放，避免記憶體峰值過高。代價是速度略慢，但在 iOS 上記憶體通常比速度更珍貴。

### weak 指標指向的物件被釋放後會怎樣？

\`weak\` 只是依賴關係，不會增加 retain 值。當被指向的物件釋放後，\`weak\` 變數會自動變成 \`nil\`，不會產生懸掛指標——這也是它適合用在 delegate 的原因。

## 參考資料
- 本文為個人上課筆記（iOS 應用程式開發入門課程），無外部連結。

## 延伸閱讀

- [Objective-C 的 Operation、Delegation 與基本類別整理](/post/objective-c-operation-delegation-class-basics)：同樣聚焦 Objective-C、iOS，可接著比較不同情境的做法。
- [限制 TensorFlow 跑模型時使用的 GPU 記憶體上限？](/post/tensorflow-gpu-memory-limit)：同樣聚焦 記憶體管理，可接著比較不同情境的做法。
- [iOS 切換 View 會用到的函數整理：pushViewController 與 presentModalViewController 怎麼選？](/post/ios-uiviewcontroller-switch-functions)：同樣聚焦 iOS、Objective-C，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2013-08-06，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};