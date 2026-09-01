var e=`---
title: iOS UIView 操作與 Core Graphics 繪圖入門
description: 整理 UIView 的 subview 管理、frame 與 bounds 差異，以及用 Core Graphics 畫三角形、圓形的基本寫法。
date: 2013-08-20
category: 前端開發
tags: [UIView, Core Graphics, iOS, Objective-C]
readingTime: 7 分鐘
image: /images/tech/hero_ios-uiview-drawing-basics.webp
imageAlt: iOS 開發者在筆電上撰寫 UIView 介面程式碼
---


# iOS UIView 操作與 Core Graphics 繪圖入門

UIWindow 在 Xcode 專案一開始就會被建立好，裡面掛著整棵 view 樹。學 iOS 介面開發，第一關就是搞懂怎麼操作這些 subview，第二關才是自己動手畫圖。這篇整理 UIView 的常用操作、frame 與 bounds 的差異，以及用 Core Graphics 畫三角形和圓形的基本寫法。

## 怎麼新增、插入、移除 subview？

Superview 用一個 MutableArray 的 index 管理底下的 subview，這個 index 就是 tag，tag 為 0 代表 subview 自己。常見操作如下：

\`\`\`objc
[self addSubView:view];                              // 新增 view
[self insertSubView:view atIndex:0];                 // 新增 view 在 layer 0
[self insertSubView:view belowSubview:upView];       // 新增 view 在 upView 之下
[self insertSubView:view aboveSubview:upView];       // 新增 view 在 upView 之上
[self exchangeSubviewAtIndex:0 withSubviewAtIndex:1]; // 將第 0 層和第 1 層的物件對調
UIView *view = [self viewWithTag:1];                 // 取出 storyboard 中 tag 為 1 的物件
\`\`\`

要把 view 從畫面上拿掉，呼叫 \`[view removeFromSuperview];\`；只是暫時不顯示、之後還要用，用 \`[view setHidden:YES];\` 就好，不必整個移除再重建。

## CGRect、CGSize、CGPoint 要怎麼存進 NSArray？

CGRect、CGSize、CGPoint 這類 C struct 不能直接塞進 NSArray，得先包成 NSValue：

\`\`\`objc
// 將 CGRect 放入 NSMutableArray 中
NSMutableArray *array = [[NSMutableArray alloc] init];
NSValue *value;
CGRect rect = CGRectMake(0, 0, 320, 480);
value = [NSValue valueWithBytes:&rect objCType:@encode(CGRect)];
[array addObject:value];
NSLog(@"array:%@", array);

// 從 array 中取回
value = [array objectAtIndex:0];
[value getValue:&rect];
NSLog(@"value:%@", value);
\`\`\`

## frame 和 bounds 差在哪？

frame 描述 view 相對於「父 view 座標系」的位置與大小，用在把一個新產生的 view 加進畫面時；bounds 描述 view 相對於「自己座標系」的位置與大小，起點通常是 (0, 0)，處理內部事件或畫內部元件時會用到它。兩者的定位點也不同：bounds 的原點在畫面正中央，frame 的原點在左上角。

| 屬性 | 座標基準 | 常見用途 |
|---|---|---|
| frame | 相對父 view | 決定 view 在畫面上的位置與大小 |
| bounds | 相對自己 | 處理內部事件、繪製內部元件 |
| center | view 的中心點 | 等同於 frame 的中心 |

有個容易踩的坑：\`viewDidLoad\` 裡拿到的 frame，跟 \`viewWillAppear\` 裡的不一樣——要到 \`viewWillAppear\` 執行時，x、y 座標才會真正移到最終位置。如果在 \`viewDidLoad\` 就依賴 frame 做版面計算，位置很可能是錯的。

元件要跟著父層縮放，可以設 autoresizing mask：

\`\`\`objc
imageView.autoresizingMask = UIViewAutoresizingFlexibleHeight;
\`\`\`

## UIView 的哪些方法值得先記住？

UIView 的生命週期方法很多（完整列表看 [Apple 官方 UIView 文件](https://developer.apple.com/documentation/uikit/uiview)），實際開發中比較常用到的：

- \`setNeedsDisplay\`：讓 UIView 重新執行 \`drawRect\`
- \`setNeedsLayout\`：重新計算 view layout 的大小
- \`layoutSubviews\`：需要調整 subview 大小時呼叫（[延伸解說](http://www.cnblogs.com/artstyle/archive/2012/08/24/2653945.html)）
- 其他 view 相關事件：\`didAddSubview:\`、\`willRemoveSubview:\`、\`willMoveToSuperview:\`、\`didMoveToSuperview\`、\`willMoveToWindow:\`、\`didMoveToWindow\`
- 動畫相關：\`animateWithDuration:delay:options:animations:completion:\`、\`animateWithDuration:animations:completion:\`、\`animateWithDuration:animations:\`、\`transitionWithView:duration:options:animations:completion:\`、\`transitionFromView:toView:duration:options:completion:\`

## 怎麼用 Core Graphics 畫三角形？

每次繪圖前，都要先取出繪圖物件：

\`\`\`objc
CGContextRef ctx = UIGraphicsGetCurrentContext();
\`\`\`

畫三角形的做法是先填滿背景色，再用路徑描出三個頂點：

\`\`\`objc
- (void)drawRect:(CGRect)rect
{
    CGContextRef context = UIGraphicsGetCurrentContext();
    [[UIColor whiteColor] set];
    UIRectFill([self bounds]);
    CGContextBeginPath(context);
    CGContextMoveToPoint(context, 50, 50);
    CGContextAddLineToPoint(context, 50, 150);
    CGContextAddLineToPoint(context, 150, 50);
    CGContextClosePath(context);

    [[UIColor blueColor] setFill];
    [[UIColor blackColor] setStroke];
    CGContextDrawPath(context, kCGPathEOFillStroke);
}
\`\`\`

\`CGContextMoveToPoint\` 和 \`CGContextAddLineToPoint\` 依序描出三個點，\`CGContextClosePath\` 把路徑封起來，\`kCGPathEOFillStroke\` 則同時做填色與描邊。

## 怎麼用 Core Graphics 畫圓形？

圓形用 \`CGContextAddEllipseInRect\` 就能畫出來，比手動描三角形路徑簡單很多：

\`\`\`objc
- (void)drawRect:(CGRect)rect
{
    CGContextRef ctx = UIGraphicsGetCurrentContext();
    CGContextAddEllipseInRect(ctx, rect);
    CGContextSetFillColor(ctx, CGColorGetComponents([[UIColor blueColor] CGColor]));
    CGContextFillPath(ctx);
}
\`\`\`

矩形是正方形時畫出來就是正圓，是長方形時則是橢圓。

## 常見問題

### frame 和 bounds 該用哪一個？

要決定 view 在父層畫面上的位置與大小，用 frame；要處理 view 內部的事件座標或畫內部元件，用 bounds。兩者的座標系不同，不能互相取代。

### 為什麼在 viewDidLoad 裡拿到的 frame 不對？

因為 \`viewDidLoad\` 執行時 view 還沒完成 layout，x、y 座標要到 \`viewWillAppear\` 才會被移到正確位置。需要精確版面數值時，應該在 \`viewWillAppear\` 或 \`viewDidLayoutSubviews\` 之後再讀取。

### drawRect 裡一定要呼叫 UIGraphicsGetCurrentContext 嗎？

是的，每次進到 \`drawRect:\` 要繪圖，都得先取出當下的繪圖 context，後續的路徑、填色、描邊操作都是對這個 context 下指令。

## 參考資料
Apple 官方文件，UIView \`draw(_:)\`（即 \`drawRect:\`）方法說明，介紹自訂繪圖時如何取得與使用 graphics context，存取日期：2026-08-27。[https://developer.apple.com/documentation/uikit/uiview/draw(_:)](https://developer.apple.com/documentation/uikit/uiview/draw(_:))

## 延伸閱讀

- [iOS 切換 View 會用到的函數整理：pushViewController 與 presentModalViewController 怎麼選？](/post/ios-uiviewcontroller-switch-functions)：同樣聚焦 iOS、Objective-C，可接著比較不同情境的做法。
- [UITableView 放進 UIView 後 Static Cells 顯示空白怎麼解？](/post/uitableview-static-cells-in-uiview)：同樣聚焦 Objective-C、iOS，可接著比較不同情境的做法。
- [iOS 6 與 iOS 7 的不同處整理](/post/ios6-ios7-ui-behavior-differences)：同樣聚焦 iOS、Objective-C，可接著比較不同情境的做法。

## 最後更新

2026-08-28

`;export{e as default};