var e=`---
title: Objective-C 語言入門：物件、Message Syntax 與 Selector
description: 整理 Objective-C 的物件概念、方括號訊息語法、property、id、nil 與 selector callback 寫法。
date: 2013-07-25
category: 後端開發
tags: [Objective-C, iOS, Selector, Property]
readingTime: 8 分鐘
image: /images/tech/hero_objective-c-language-message-syntax.webp
imageAlt: macOS 開發環境中撰寫 Objective-C 程式碼
---


# Objective-C 語言入門：物件、Message Syntax 與 Selector

Objective-C 的核心觀念是「向物件送出訊息」。方括號語法 \`[receiver message]\` 不是呼叫一般 C 函式，而是讓物件接收 message，再由 runtime 決定要執行哪個 method。

## Objective-C 的物件概念是什麼？

Objective-C 的物件由類別、狀態與行為組成。Class 定義物件的結構，Object 是實體，Message 是外部要求物件執行行為的方式。

基本名詞：

| 名詞 | 說明 |
|---|---|
| Class | 類別，描述物件有哪些狀態與行為 |
| Object | 物件或實體，是 Class 建立出的實際資料 |
| State | 狀態，也可稱 field、attribute、member |
| Behavior | 行為，也可稱 method、action、member function |
| Message | 傳給物件的訊息，例如呼叫 NSString 的方法 |

\`@\` 常用來表示 Objective-C 物件字面值，例如 \`@"Hello world"\` 是 \`NSString\` 物件。建立物件時常見寫法如下：

\`\`\`objc
NSString *name = [[NSString alloc] init];
\`\`\`

\`[[NSString alloc] init]\` 和 \`[NSString new]\` 都包含配置記憶體與初始化的概念。

## Objective-C 的方括號語法怎麼讀？

Objective-C 的 \`[object method]\` 表示把 message 送給 object。點語法看起來像屬性存取，但通常會轉成 getter 或 setter method。

範例：

\`\`\`objc
NSString *str = @"World";
str = [NSString stringWithFormat:@"Hello"];
NSLog(@"str is: %@", str);
\`\`\`

點語法與 message syntax 的對應：

\`\`\`objc
label.text = @"Description"; // 等於 [label setText:@"Description"];
NSString *str = label.text;  // 等於 NSString *str = [label text];
\`\`\`

這個觀念很重要：Objective-C 的屬性語法本質上仍連到 method。理解這點後，debug getter、setter 與 KVC 行為會比較直覺。

## \`@property\`、\`@synthesize\` 和公開介面怎麼分？

\`@property\` 用來宣告屬性，編譯器可自動產生 getter 和 setter。公開介面通常放在 \`.h\`，不公開的類別延伸或私有方法放在 \`.m\`。

常見宣告：

\`\`\`objc
@property int age;
@property (strong) NSString *name;
\`\`\`

早期 Objective-C 常看到 \`@synthesize\`：

\`\`\`objc
@synthesize age; // 自動產生的 ivar 名稱常見為 _age
\`\`\`

現代 Objective-C 多數情況可由編譯器自動合成屬性。閱讀舊程式碼時仍要知道 \`@synthesize\` 的意義，尤其是維護早期 iOS 專案時。

## \`id\`、\`nil\` 和 \`BOOL\` 要注意什麼？

\`id\` 是 Objective-C 的動態物件型別，可以指向任何 Objective-C 物件。\`nil\` 是物件型別空值，\`BOOL\` 則通常使用 \`YES\` 與 \`NO\` 表示真假。

範例：

\`\`\`objc
id someObject; // id 不需要再加 *
\`\`\`

\`id\` 常出現在事件處理、delegate callback 或不知道接收者實際 class 的情境。原稿也提醒：對 \`nil\` 送 message 在 Objective-C 中通常不會像一般 C 空指標那樣直接崩潰，但回傳值與後續使用仍需要小心，不應把 \`nil\` 當成正常流程控制。

## Selector 是什麼？怎麼用？

Selector 是 Objective-C 用來表示 method 名稱的型別，型別為 \`SEL\`。Selector 常用在 target-action、timer callback、delegate 或動態回呼設計。

宣告 selector：

\`\`\`objc
-(void)methodWithNoArguments;
SEL noArgumentSelector = @selector(methodWithNoArguments);

-(void)methodWithOneArgument:(id)argument;
SEL oneArgumentSelector = @selector(methodWithOneArgument:);

-(void)methodWithTwoArguments:(id)argumentOne and:(id)argumentTwo;
SEL twoArgumentSelector = @selector(methodWithTwoArguments:and:);
\`\`\`

Timer callback 範例：

\`\`\`objc
@implementation MyObject

-(void)myTimerCallback:(NSTimer *)timer
{
    if (timerShouldEnd) {
        [timer invalidate];
    }
}

@end

MyObject *obj = [[MyObject alloc] init];
SEL mySelector = @selector(myTimerCallback:);
[NSTimer scheduledTimerWithTimeInterval:30.0
                                 target:obj
                               selector:mySelector
                               userInfo:nil
                                repeats:YES];
\`\`\`

執行 callback 前可先檢查接收者是否支援該 selector：

\`\`\`objc
if (handler != nil && selector != nil && [handler respondsToSelector:selector]) {
    [handler performSelector:selector];
}
\`\`\`

## 常見問題

### Objective-C 的 \`[ ]\` 是什麼意思？

Objective-C 的 \`[ ]\` 是 message syntax，表示向某個物件或類別送出訊息。\`[NSString stringWithFormat:@"Hello"]\` 是向 \`NSString\` 類別送出 \`stringWithFormat:\` 訊息。

### Objective-C 的點語法是屬性還是方法？

Objective-C 的點語法通常會對應到 getter 或 setter method。\`label.text\` 可讀性像屬性，但底層仍是 message dispatch。

### \`id\` 和 \`NSObject *\` 有什麼不同？

\`id\` 是動態物件型別，不需要加星號，也不在編譯期指定具體類別。\`NSObject *\` 則明確表示指向 NSObject 或其子類別的指標。

### \`@selector\` 後面的冒號是什麼？

\`@selector\` 的冒號代表 method 參數位置。\`methodWithOneArgument:\` 有一個參數，\`methodWithTwoArguments:and:\` 有兩個參數。

### 現在還需要學 Objective-C 嗎？

新 iOS 專案多使用 Swift，但 Objective-C 仍常見於舊 App、Apple framework、C/C++ 混編與早期 SDK。維護既有 iOS 專案時，Objective-C 語法仍值得理解。

## 參考資料

- Apple Developer, Programming with Objective-C：<https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/Introduction/Introduction.html>
- Apple Developer, Selectors：<https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ObjectiveC/Chapters/ocSelectors.html>
- Stack Overflow, How do SEL and @selector work：<https://stackoverflow.com/questions/297680/how-do-sel-and-selector-work-in-iphone-sdk>

## 延伸閱讀

- [Objective-C 的 Operation、Delegation 與基本類別整理](/post/objective-c-operation-delegation-class-basics)：同樣聚焦 Objective-C、iOS，可接著比較不同情境的做法。
- [iOS 切換 ViewController 會用到的函數整理](/post/ios-uiviewcontroller-switch-functions)：同樣聚焦 Objective-C、iOS，可接著比較不同情境的做法。
- [Objective-C 命名規則（Naming Convention）與記憶體管理入門筆記](/post/objective-c-naming-convention-memory-management)：同樣聚焦 Objective-C、iOS，可接著比較不同情境的做法。

## 最後更新

2026-08-28

`;export{e as default};