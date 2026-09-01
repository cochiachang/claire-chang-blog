var e=`---
title: Objective-C 的 Operation、Delegation 與基本類別整理
description: 整理 Objective-C 常用的 class 檢查、Delegation 概念、NSString/NSArray 等基本類別用法。
date: 2013-08-03
category: 前端開發
tags: [Objective-C, iOS, Delegation, NSString, NSArray]
readingTime: 7 分鐘
image: /images/tech/hero_objective-c-operation-delegation-class-basics.webp
imageAlt: 電腦螢幕顯示程式碼，象徵 Objective-C 開發環境
---


# Objective-C 的 Operation、Delegation 與基本類別整理

寫 Objective-C 常會遇到三種基本需求：確認物件的 class、讓某個物件把工作委派給別人處理、以及正確使用 NSString、NSArray 這類基礎類別。這篇整理當年上課時記下的重點，包含 code 範例。

## 怎麼確認一個物件的 class？

Objective-C 用 \`class\`、\`isKindOfClass:\`、\`isMemberOfClass:\` 三個方法來檢查物件的類別關係。\`isKindOfClass:\` 判斷物件是否為某個類別或其子類別，\`isMemberOfClass:\` 則要求完全相符。

\`\`\`objc
Class me = [obj class];
NSString *name = [obj className];

// 判斷是否繼承於 UIView
if ([obj isKindOfClass:[UIView class]]) {
    NSLog(@"obj 繼承於 UIView");
}

// 判斷是否剛好是這個 class 的實體
if ([obj isMemberOfClass:[NSString class]]) {
    NSLog(@"obj 的類別是 NSString");
}
\`\`\`

## 兩個物件「相同」是指記憶體位置還是內容？

Objective-C 對「相同」有兩種意思，混用會讓 bug 很難抓。\`==\` 比較的是兩個變數是否指向同一塊記憶體；\`isEqual:\` 比較的才是內容值是否相同。

\`\`\`objc
// 確認兩個變數指向同一個記憶體位置
if (obj1 == obj2) {}

// 確認兩個實體的值相同
if ([obj1 isEqual:obj2]) {
    // 開發者可在 class 裡覆寫 isEqual，決定如何判斷兩個實體相同
}
\`\`\`

想印出物件內容做 debug 時，呼叫 \`description\` 效果等同 \`NSLog(@"%@", obj)\`：

\`\`\`objc
[obj description]; // 等於 NSLog(@"%@", obj);
\`\`\`

## Delegation 是什麼、為什麼 AppDelegate 最先被呼叫？

Delegation 的概念是：一個物件要完成某件事時，把該做的工作委派給另一個事先定義好的物件去執行。iOS 專案啟動時，系統第一個呼叫的就是 Delegate 裡的這個方法：

\`\`\`objc
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
\`\`\`

真正啟動這一切的入口是 \`main.m\`：

\`\`\`objc
#import <UIKit/UIKit.h>
#import "AppDelegate.h"

int main(int argc, char *argv[])
{
    @autoreleasepool {
        // argc：argv 裡元素的個數，通常對應 main 的參數
        // argv：一串輸入值
        // 第三個參數是 UIApplication 或其子類別實體的 class name，若為 nil 則視為 UIApplication
        return UIApplicationMain(argc, argv, nil, NSStringFromClass([AppDelegate class]));
    }
}
\`\`\`

也就是說，\`UIApplicationMain\` 建立 \`UIApplication\` 之後，會通知指定的 Delegate class（通常是 \`AppDelegate\`）事情做完了，接下來換它接手。這就是為什麼整個 App 生命週期的起點會落在 \`AppDelegate\` 身上。

## NSObject 和 NSString 的常用方法有哪些？

\`NSObject\` 是 Objective-C 最基本的物件類型，\`className\`（自我檢視）和 \`isEqual:\`（物件比較）是最常用到的兩個方法。

\`NSString\` 是最常打交道的類別之一，格式化、字串拼接、比較與搜尋都有現成方法：

\`\`\`objc
[NSString stringWithFormat:@"It is %@", @"Tom"]; // 格式化字串

// 常用 method
str = [str stringByAppendingString:@"abc"];         // 在尾端加字串，回傳 str
str = [str stringByAppendingFormat:@"name %@", @"Tom"]; // 在尾端加格式化字串，回傳 str
BOOL equ = [str isEqualToString:str2];              // 字串內容是否相同

// 比較兩字串
if ([str compare:str2 options:NSLiteralSearch]) {}
if ([str isEqualToString:str2]) {}

// 字串搜尋
NSRange range = [str rangeOfString:str2];
NSLog(@"str2 位於 str1 的第 %ld 個位置，長度為 %ld", (long)range.location, (long)range.length);
\`\`\`

\`NSMutableString\` 則可以在原字串中間插入內容（\`insertString:atIndex:\`），不像一般字串只能整個替換：

\`\`\`objc
NSMutableString *str = [NSMutableString string];
[str appendString:@"test"];
[str insertString:@"hello" atIndex:1];
NSLog(str); // 印出插入後的結果
\`\`\`

## Set、Array、Dictionary 該怎麼選？

這三種集合類別的差異在「有沒有順序」和「用 key 還是用 index 取值」，選錯型別會讓後面的邏輯繞遠路。

| 類別 | 特性 | 適合場景 |
|---|---|---|
| Set（\`NSMutableSet\` / \`NSOrderedSet\`） | 無順序、資料唯一，需覆寫 \`isEqual\` 與 \`hash\` 才能正確判斷是否重複 | \`NSMutableSet\` 適合 queue 概念，例如暫存移出畫面的 cell；\`NSOrderedSet\` 需要保留加入順序時使用 |
| Array（\`NSArray\` / \`NSMutableArray\`） | 有順序性，\`NSMutableArray\` 刪除元素後 index 會自動往前補、不會跳號 | 需要依序走訪、或會頻繁增刪元素的清單 |
| Dictionary（\`NSDictionary\` / \`NSMutableDictionary\`） | key-value 結構 | 需要用有意義的 key 查值，而不是用 index |

走訪陣列元素的寫法：

\`\`\`objc
for (NSString *ele in array) {
    NSLog([ele description]);
}
\`\`\`

另外兩個容易忽略的細節：\`NSNumber\` 是把數值放進 \`NSArray\`/\`NSSet\` 的必要包裝（這兩種集合只能放物件，不能直接放 \`int\`、\`float\`）；\`NSNull\` 則是因為舊式寫法會用 \`nil\` 代表陣列尾端，所以要在陣列裡塞「空值」時必須改用 \`NSNull\`，不能直接塞 \`nil\`。

想深入了解 \`isEqual\` 與 \`hash\` 的關聯，可以參考 [Stack Overflow 上這篇討論](https://stackoverflow.com/questions/6545722/help-with-isequals-and-hash-in-iphone)。

## Scalar 語法（\`car[1]\`）背後實際呼叫了什麼？

Objective-C 支援用類似陣列的下標語法存取物件，但這其實是語法糖，背後呼叫的是 subscript 相關方法：

\`\`\`objc
Car *car = [Car new];

car[1] = @"name";        // 寫入 scalar
NSLog(@"%@", car[1]);    // 讀取 scalar

car[@"dict"] = @"value"; // 寫入 object
NSLog(@"%@", car[@"dict"]); // 讀取 object
\`\`\`

呼叫 \`car[1]\`（用整數當索引）實際上是呼叫下面兩個方法，並不代表 \`car\` 真的是陣列：

\`\`\`objc
- (id)objectAtIndexedSubscript:(NSInteger)index {
    return @"Car";
}

- (void)setObject:(id)thing atIndexedSubscript:(NSInteger)index {
    // 在此設定 index 位置的值為 thing
}
\`\`\`

呼叫 \`car[@"dict"]\`（用字串當 key）則是呼叫這兩個方法：

\`\`\`objc
- (id)objectForKeyedSubscript:(id)key {
    return @"dict";
}

- (void)setObject:(id)thing forKeyedSubscript:(id<NSCopying>)key {
    // 在此做設定
}
\`\`\`

也就是說，這組語法能不能用、行為是什麼，完全取決於 class 有沒有實作這四個方法——不是 Objective-C 內建的陣列能力。

## 常見問題

### \`isKindOfClass:\` 和 \`isMemberOfClass:\` 差在哪？

\`isKindOfClass:\` 只要物件是指定類別「或其子類別」的實體就會回傳 YES；\`isMemberOfClass:\` 則要求物件的類別完全等於指定類別，子類別也會回傳 NO。

### \`==\` 和 \`isEqual:\` 該用哪一個？

判斷兩個變數是否指向同一塊記憶體用 \`==\`；判斷兩個物件的內容值是否相同用 \`isEqual:\`。字串比較內容建議直接用 \`isEqualToString:\`，效率和語意都更明確。

### 為什麼陣列裡不能直接放 \`int\` 或 \`nil\`？

\`NSArray\`、\`NSSet\` 這類集合只能存放 Objective-C 物件，數值要先包成 \`NSNumber\` 才能放進去；而陣列本身用 \`nil\` 代表結尾，所以要存「空值」這個概念時必須改用 \`NSNull\`，否則會被誤判為陣列結束。

## 參考資料
- Apple Developer Documentation，\`NSObject\` 的 \`isEqual(_:)\` 方法文件，存取日期：2026-08-27。[https://developer.apple.com/documentation/objectivec/nsobject/1393823-isequal](https://developer.apple.com/documentation/objectivec/nsobject/1393823-isequal)

## 延伸閱讀

- [Objective-C 語言入門：物件、Message Syntax 與 Selector](/post/objective-c-language-message-syntax)：同樣聚焦 Objective-C、iOS，可接著比較不同情境的做法。
- [iOS 切換 ViewController 會用到的函數整理](/post/ios-uiviewcontroller-switch-functions)：同樣聚焦 Objective-C、iOS，可接著比較不同情境的做法。
- [iOS 6 與 iOS 7 的不同處整理](/post/ios6-ios7-ui-behavior-differences)：同樣聚焦 iOS、Objective-C，可接著比較不同情境的做法。
`;export{e as default};