var e=`---
title: UIWebView 練習作業整理：載入網頁、顯示 Loading 與攔截連結
description: 整理舊版 iOS UIWebView 練習，說明載入 URL、ActivityIndicator、delegate 攔截連結與 WKWebView 遷移提醒。
date: 2013-09-04
category: 前端開發
tags: [iOS, UIWebView, Objective-C]
readingTime: 8 分鐘
image: /images/tech/hero_uiwebview-ios-practice.webp
imageAlt: iOS WebView 練習與行動網頁載入流程示意圖
---
# UIWebView 練習作業整理：載入網頁、顯示 Loading 與攔截連結

UIWebView 是舊版 iOS 用來在 App 內嵌網頁的元件，現在正式開發應改用 WKWebView。這篇保留 UIWebView 練習脈絡，重點放在載入 URL、顯示載入狀態，以及用 delegate 判斷網頁導覽事件。

## UIWebView 可以載入哪些資料？

UIWebView 可載入 HTML 字串、本機資料與遠端 URL。若是維護舊 Objective-C 專案，理解 UIWebView 的載入方式仍有價值；新專案則應直接使用 WKWebView。

UIWebView 常見資料來源：

| 資料來源 | 方法 | 用途 |
| --- | --- | --- |
| HTML 字串 | \`loadHTMLString:baseURL:\` | 顯示本機產生的 HTML |
| 本機資料 | \`loadData:MIMEType:textEncodingName:baseURL:\` | 顯示本機檔案或下載後資料 |
| 遠端 URL | \`loadRequest:\` | 顯示網站或 Web App |

Apple 已不建議新 App 使用 UIWebView；App Store 提交也曾針對 UIWebView API 有限制。維護舊專案時，應把遷移 WKWebView 排進技術債清單。

## 如何用 UINavigationController 切換到 WebView 畫面？

這個練習用 storyboard 建立頁面，再用 UINavigationController 推入 WebViewController。核心做法是把使用者輸入的網址傳給下一頁。

在 \`AppDelegate.m\` 可用程式建立導覽控制器：

\`\`\`objective-c
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    UINavigationController *navi = [UINavigationController new];
    UIStoryboard *storyboard = [UIStoryboard storyboardWithName:@"MainStoryboard" bundle:nil];
    UIViewController *controller = [storyboard instantiateViewControllerWithIdentifier:@"pink"];

    [navi pushViewController:controller animated:YES];
    self.window.rootViewController = navi;

    return YES;
}
\`\`\`

在輸入頁設定初始網址：

\`\`\`objective-c
- (void)viewDidLoad
{
    [super viewDidLoad];
    [self.inputURL setAdjustsFontSizeToFitWidth:YES];
    self.title = @"填入網址";
    self.inputURL.text = @"http://www.apple.com";
}
\`\`\`

按下按鈕後，把網址傳給 WebViewController：

\`\`\`objective-c
- (IBAction)goWeb:(id)sender
{
    UIStoryboard *storyboard = [UIStoryboard storyboardWithName:@"MainStoryboard" bundle:nil];
    WebViewController *webView = [storyboard instantiateViewControllerWithIdentifier:@"webView"];

    webView.urlString = self.inputURL.text;
    webView.delegate = self;

    [self.inputURL resignFirstResponder];
    [self.navigationController pushViewController:webView animated:YES];
}
\`\`\`

## 如何在 UIWebView 載入時顯示 Loading？

UIWebViewDelegate 的 \`webViewDidStartLoad\` 與 \`webViewDidFinishLoad\` 可以控制載入狀態。練習中用 UIActivityIndicatorView 與半透明 View 擋住畫面，避免使用者在未載完時操作。

初始化載入效果：

\`\`\`objective-c
aciv = [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleGray];
colorView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, self.view.frame.size.width, self.view.frame.size.height)];
[colorView setBackgroundColor:[UIColor colorWithRed:0.2 green:0.2 blue:0.2 alpha:0.4]];
\`\`\`

加入與移除 Loading：

\`\`\`objective-c
- (void)addLoading
{
    aciv.activityIndicatorViewStyle = UIActivityIndicatorViewStyleWhite;
    aciv.center = CGPointMake(self.view.frame.size.width / 2, self.view.frame.size.height / 2 - 10);
    [self.view addSubview:colorView];
    [aciv startAnimating];
    [self.view addSubview:aciv];
}

- (void)removeLoading
{
    [colorView removeFromSuperview];
    [aciv stopAnimating];
    [aciv removeFromSuperview];
}
\`\`\`

搭配 delegate：

\`\`\`objective-c
- (void)webViewDidStartLoad:(UIWebView *)webView
{
    [UIApplication sharedApplication].networkActivityIndicatorVisible = YES;
    [self addLoading];
}

- (void)webViewDidFinishLoad:(UIWebView *)webView
{
    [UIApplication sharedApplication].networkActivityIndicatorVisible = NO;
    [self removeLoading];
}
\`\`\`

## 如何判斷使用者點擊 WebView 內的連結？

UIWebView 的 \`shouldStartLoadWithRequest\` 會在初始載入與連結導覽時都被呼叫。若要區分使用者點擊與頁面內 JavaScript 觸發的載入，單靠一個布林值容易誤判。

原練習嘗試用手勢判斷使用者點擊：

\`\`\`objective-c
UILongPressGestureRecognizer *longPress =
    [[UILongPressGestureRecognizer alloc] initWithTarget:self action:@selector(handleTapFrom:)];

longPress.minimumPressDuration = .001;
longPress.delegate = self;
[self.web addGestureRecognizer:longPress];
\`\`\`

讓手勢與 WebView 本身手勢同時存在：

\`\`\`objective-c
- (BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer
shouldRecognizeSimultaneouslyWithGestureRecognizer:(UIGestureRecognizer *)otherGestureRecognizer
{
    return YES;
}
\`\`\`

攔截載入：

\`\`\`objective-c
-(BOOL)webView:(UIWebView *)webView
shouldStartLoadWithRequest:(NSURLRequest *)request
navigationType:(UIWebViewNavigationType)navigationType
{
    if (isClick) {
        [self.delegate userClickWebLink:request.URL.absoluteString];
        return NO;
    }
    return YES;
}
\`\`\`

這個做法能完成練習，但不夠穩。比較好的判斷依據是 \`navigationType\`，並在 WKWebView 中改用 \`decidePolicyForNavigationAction\`。

## 維護舊 UIWebView 專案時要注意什麼？

舊 UIWebView 程式碼最重要的工作不是繼續補技巧，而是規劃 WKWebView 遷移。WKWebView 在效能、程序隔離、JavaScript 橋接與導覽控制上都更適合現代 iOS App。

遷移檢查表：

| 舊 UIWebView 行為 | WKWebView 對應方向 |
| --- | --- |
| \`UIWebViewDelegate\` | \`WKNavigationDelegate\` |
| \`shouldStartLoadWithRequest\` | \`decidePolicyForNavigationAction\` |
| \`stringByEvaluatingJavaScriptFromString\` | \`evaluateJavaScript\` |
| Cookie 與登入狀態 | 檢查 \`WKWebsiteDataStore\` |
| Loading 狀態 | 使用 \`isLoading\` 或 KVO |

資訊增益：若舊程式靠手勢推測「使用者是否點擊連結」，遷移時應改成判斷 navigation action 的來源與類型。這比在 WebView 上覆蓋透明 View 或用布林值記錄點擊更可維護。

## 常見問題

### UIWebView 現在還可以用嗎？

維護舊專案時可能還會看到 UIWebView，但新開發不應再使用。現代 iOS App 應改用 WKWebView。

### UIWebView 為什麼會重複觸發 \`shouldStartLoadWithRequest\`？

初始 URL、頁面資源、重新導向與 JavaScript 觸發的導覽都可能呼叫 \`shouldStartLoadWithRequest\`。因此不能只用「有呼叫」判斷使用者點擊。

### Loading 畫面可以阻止所有誤點嗎？

Loading 畫面只能降低操作時機問題，不能精準判斷導覽來源。若頁面載完後 JavaScript 又發出請求，仍可能出現誤判。

### WKWebView 遷移最容易卡在哪裡？

常見卡點是 Cookie、JavaScript bridge、檔案上傳與自訂 URL scheme。遷移前應先列出舊 UIWebView 依賴的行為。

### iOS App 內嵌網頁適合自己寫瀏覽器嗎？

不適合把 WebView 做成完整瀏覽器。App 內嵌網頁應只處理產品需要的流程，例如登入、說明頁或特定 Web App。

## 參考資料

- Apple Developer Documentation：[WKWebView](https://developer.apple.com/documentation/webkit/wkwebview)
- Apple Developer Documentation：[WKNavigationDelegate](https://developer.apple.com/documentation/webkit/wknavigationdelegate)
- Apple Developer Documentation Archive：[UIWebView](https://developer.apple.com/documentation/uikit/uiwebview)

## 延伸閱讀

- [iOS 6 與 iOS 7 的不同處整理](/post/ios6-ios7-ui-behavior-differences)：同樣聚焦 iOS、Objective-C，可接著比較不同情境的做法。
- [iOS 7 App 轉換指南：舊 App 升級前要檢查哪些項目？](/post/ios7-app-migration-guide)：同樣聚焦 iOS、Objective-C，可接著比較不同情境的做法。
- [iOS 切換 ViewController 會用到的函數整理](/post/ios-uiviewcontroller-switch-functions)：同樣聚焦 Objective-C、iOS，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2026-08-28。原文發布於 2013-09-04，本文保留 UIWebView 練習內容，並補上 WKWebView 遷移提醒。

`;export{e as default};