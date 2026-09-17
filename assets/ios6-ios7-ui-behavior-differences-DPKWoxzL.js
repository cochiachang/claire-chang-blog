var e=`---
title: iOS 6 與 iOS 7 的不同處整理
description: 整理 iOS 6 升級到 iOS 7 後，狀態列、導覽列、tab bar、tintColor 與生命週期的實際差異。
date: 2013-10-06
category: 前端開發
tags: [iOS, Objective-C, UIKit]
readingTime: 7 分鐘
image: /images/tech/ios6-ios7-statusbar-navbar-diff.webp
imageAlt: iOS 6 與 iOS 7 同一畫面在狀態列、按鈕與 tab bar 上的視覺差異對照
---


# iOS 6 與 iOS 7 的不同處整理

iOS 7 上市後，很多在 iOS 6 上寫好的畫面直接跑起來會走樣：View 疊到狀態列下面、按鈕邊框不見了、tab bar 變透明。這篇整理實際踩過的差異點，照舊分項條列，方便對照著改代碼。

## 畫面外觀上有哪些明顯差異？

iOS 7 把整體視覺風格改成扁平化，直接影響到 View 排版與元件外觀，以下幾點在升級後最常讓畫面跑版：

1. **View 會和狀態列重疊**：iOS 7 之後 View 預設蓋在狀態列底下（iOS 6 是 View 排在狀態列下方，兩者不重疊）。
2. **按鈕沒有邊框**：iOS 6 的按鈕預設有圓角矩形邊框，iOS 7 拿掉了邊框，看起來只剩文字。
3. **Tab bar 變為半透明**：iOS 6 的 tab bar 是不透明的純色，iOS 7 預設半透明，底下內容會透出來。
4. **狀態列的顏色不會與導覽列分開**：iOS 6 狀態列和導覽列是獨立的兩塊顏色，iOS 7 之後狀態列會直接融進導覽列。
5. **文字樣式明顯不同**：即使程式碼裡的字型設定完全沒改，iOS 7 呈現出來的字重、字距觀感也和 iOS 6 不一樣。
6. **預設會是全螢幕畫面**，且**狀態列的高度不再影響整體畫面高度**——整個畫面的排版基準點會落在狀態列下方，不會再幫你扣掉狀態列的空間。

下圖是同一個 tab bar 畫面在 iOS 6（左）與 iOS 7（右）的實際對照，可以看到 View 位置、按鈕邊框、tab bar 透明度三處差異：

![iOS 6 與 iOS 7 同一畫面在狀態列、按鈕與 tab bar 上的視覺差異對照](/images/tech/ios6-ios7-statusbar-navbar-diff.webp)

## tintColor 的影響範圍為什麼變了？

iOS 7 之後，\`tintColor\` 的作用範圍縮小了：導覽列與 tab bar 的顏色不再受 tint color 影響，要分別設定才會變色。

實際測試發現一個更細節的坑：對 Segmented Control 使用 Global tint 時，一開始畫面上的框線顏色不會馬上跟著變，要等點過一次之後顏色才會改變。如果要讓它一開始就是對的顏色，必須直接對該元件個別設定 tint color，不能只靠 Global tint。

## tab bar 圖示的按下狀態要注意什麼？

iOS 7 的 tab bar 圖示明確分成按下狀態與非按下狀態兩種樣式，而且兩者的呈現方式也和 iOS 6 不一樣——iOS 6 的選中狀態圖示比較細緻，iOS 7 則簡化成單純的顏色變化。下圖是同一組 tab bar 圖示在兩個版本下的差異：

![iOS 6 與 iOS 7 tab bar 圖示選中狀態的呈現差異](/images/tech/ios6-ios7-tabbar-icon-state.webp)

## NSBundle 的 pathForResource 路徑規則怎麼改了？

\`pathForResource:\` 方法在 iOS 7 對路徑參數的解讀方式跟以前不一樣，同一組檔案路徑（例如 \`Local/iphone/page/01/01.jpg\`）需要拆成不同的 \`folder\`/\`fileName\` 才找得到檔案：

iOS 7 之前可以這樣傳：

\`\`\`objc
folder = Local
fileName = iphone/page/01/01.jpg
\`\`\`

到了 iOS 7 要改成：

\`\`\`objc
folder = Local/iphone/page/01
fileName = 01.jpg
\`\`\`

如果升級後圖片、資源檔忽然讀不到，先檢查是不是踩到這個路徑拆法的改變。

## UITextField 在 iOS 6 與 iOS 7 的預設值行為有什麼不同?

iOS 7 的 \`UITextField\` 會有預先給值的行為，iOS 6 則不會。這代表原本用來判斷「使用者有沒有輸入文字」的判斷式，在 iOS 7 上可能會失效：

\`\`\`objc
if (![username.text isKindOfClass:[NSString class]]) {
    NSLog(@"你沒有輸入帳號");
}
\`\`\`

這段在 iOS 6 可以正確攔到「使用者沒輸入任何文字」的情況，但在 iOS 7，即使使用者什麼都沒打，\`username.text\` 依然是合法的 \`NSString\`，判斷式不會成立，等於這個檢查失效了。

## viewDidLoad 的執行順序改變會造成什麼問題？

在 iOS 6，push 一個 ViewController 之後，會先執行它的 \`viewDidLoad\`，才輪到外部呼叫的方法：

\`\`\`objc
ViewController *view1;
[[self navigationController] pushViewController:view1 animated:TRUE];
[view1 method];
\`\`\`

iOS 6 的順序：\`view1\` 被 push 出來後，先跑完 \`viewDidLoad\`，才執行 \`[view1 method]\`。

到了 iOS 7，順序反過來：\`[view1 method]\` 會先執行，之後才跑 \`viewDidLoad\`。如果 \`method\` 裡面用到了要等 \`viewDidLoad\` 才會初始化的東西，就會出錯。

實務上先用 \`viewController.view.hidden = NO;\` 在 push 前加一行可以暫時解決卡住的問題，但這只是繞過症狀。當時請教 Michael 老師,他給的建議更根本：**不該在 push 那段程式碼裡去判斷 view 的狀態，而是應該在 ViewController 內部處理**。他的原話是——

> 本來就是在 View Controller 裡面，去判斷的，不是在你寫的 pushViewController 那段程式碼。你寫的這段的地方，view controller 的 view 還沒呈現，所以 view 也沒有值。之前會有值，只是剛好。我們不能決定什麼時候 ViewController 產生 view 的值，我們只知道，在 viewDidLoad 會有 view 的物件，在 viewDidAppear，view 的 frame 會被決定（如果是 storyboard 上的 view 的話）。

換句話說，\`viewDidLoad\` 之前能拿到 view 的值本來就是巧合，不是保證行為。比較穩妥的作法是用 \`@property\` 把值帶進去，再到 \`viewWillAppear\` 裡執行需要 view 已經就緒的動作，而不是依賴外部呼叫順序。

## 狀態列相關的四個常見需求怎麼處理？

升級到 iOS 7 之後，狀態列相關的排版需求最常見有四種，整理對應寫法如下：

**（一）讓上方留出狀態列的位置**

\`\`\`objc
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    if ([[[UIDevice currentDevice] systemVersion] floatValue] >= 7) {
        [application setStatusBarStyle:UIStatusBarStyleLightContent];
        self.window.clipsToBounds = YES;
        self.window.frame = CGRectMake(0, 20, self.window.frame.size.width, self.window.frame.size.height - 20);
        self.window.bounds = CGRectMake(0, 20, self.window.frame.size.width, self.window.frame.size.height);
    }
    return YES;
}
\`\`\`

**（二）座標計算不將狀態列的高度算入**

\`\`\`objc
if ([[[UIDevice currentDevice] systemVersion] floatValue] >= 7.0) {
    self.edgesForExtendedLayout = UIRectEdgeNone;
    self.extendedLayoutIncludesOpaqueBars = NO;
    self.modalPresentationCapturesStatusBarAppearance = NO;

    self.navigationController.navigationBar.translucent = NO;
    self.tabBarController.tabBar.translucent = NO;

    self.navigationController.navigationBar.barTintColor = [UIColor grayColor];
    self.tabBarController.tabBar.barTintColor = [UIColor grayColor];
}
\`\`\`

**（三）完全不顯示狀態列**

1. 到 project setting → General → Deployment Info，勾選 Hide during application launch。
2. 在 ViewController 加上：

\`\`\`objc
- (BOOL)prefersStatusBarHidden {
    return YES;
}
\`\`\`

**（四）改變狀態列樣式（例如改成白字）**

\`\`\`objc
- (UIStatusBarStyle)preferredStatusBarStyle {
    return UIStatusBarStyleLightContent;
}
\`\`\`

## 常見問題

### iOS 7 升級後畫面跑版，第一件事該檢查什麼？

先檢查 View 是否被狀態列蓋住、導覽列與 tab bar 是否變成半透明。這三項是 iOS 7 最先讓畫面觀感不同的地方，多數跑版問題都是從這裡開始的。

### 為什麼 tintColor 設定了顏色卻沒生效？

因為 iOS 7 之後 tintColor 不再自動套用到導覽列與 tab bar，需要另外針對這兩個元件設定顏色；Segmented Control 用 Global tint 時，也要記得一開始的框線顏色可能不會立即反映。

### viewDidLoad 的執行順序改變，開發上該怎麼因應？

不要依賴「push 之後、外部方法呼叫之前 viewDidLoad 一定先跑完」這個假設。改用 \`@property\` 把資料傳進 ViewController，需要 view 已經就緒才能做的動作放進 \`viewWillAppear\` 執行。

### 舊的 pathForResource 路徑寫法為什麼在 iOS 7 讀不到檔案？

因為 iOS 7 對 \`folder\`/\`fileName\` 兩個參數的路徑拆分規則變了，原本可以把整段子路徑塞進 \`fileName\`，iOS 7 需要把除了檔名以外的路徑都移到 \`folder\` 參數。

## 參考資料

- iOS 7 UI Transition，Porting View Controller Layouts from iOS 6（原文已下架）
- Stack Overflow，iOS 7 status bar back to iOS 6 style：<https://stackoverflow.com/questions/18294872/ios-7-status-bar-back-to-ios-6-style>

## 延伸閱讀

- [iOS 7 App 轉換指南：舊 App 升級前要檢查哪些項目？](/post/ios7-app-migration-guide)：同樣聚焦 iOS、Objective-C，可接著比較不同情境的做法。
- [iOS 元件介紹：欄、視圖與控制元件完整整理](/post/iphone-ui-components-introduction)：同樣聚焦 iOS、UIKit，可接著比較不同情境的做法。
- [iOS 切換 ViewController 會用到的函數整理](/post/ios-uiviewcontroller-switch-functions)：同樣聚焦 Objective-C、iOS，可接著比較不同情境的做法。

## 最後更新

2026-08-28

`;export{e as default};