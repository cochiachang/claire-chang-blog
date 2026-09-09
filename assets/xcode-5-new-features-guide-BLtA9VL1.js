var e=`---
title: Xcode 5 新功能整理：Asset Catalogs、Auto Layout 與除錯工具
description: 整理 Xcode 5 對 iOS 開發的重要改動：Asset Catalogs、圖片切片、Auto Layout、除錯與語言新特性。
date: 2013-11-22
category: 前端開發
tags: [Xcode, iOS, Objective-C, Auto Layout, 除錯工具]
readingTime: 6 分鐘
image: /images/tech/xcode5-asset-catalogs.webp
imageAlt: Xcode 5 Asset Catalogs 介面，顯示圖片群組設定畫面
---


# Xcode 5 新功能整理：Asset Catalogs、Auto Layout 與除錯工具

Xcode 5 帶來的改動不只是介面調整，而是重寫了圖片管理、Auto Layout 設定跟除錯這幾件開發者每天都要碰的事。以下整理幾個實際會用到的新功能，包含 Asset Catalogs、圖片九宮格切片、Auto Layout 介面改版、語言層級的新語法，以及除錯工具的變化。

## Asset Catalogs 怎麼解決多解析度圖片的問題？

Asset Catalogs 讓開發者不再需要用 \`@2x\`、\`~iphone\`、\`~ipad\`、\`-568h\` 這類檔名後綴來區分不同裝置的圖片版本。Xcode 5 提供一個介面，把同一組圖片放進同一個群組，直接在群組裡指定每張圖對應的裝置與解析度。

![Xcode 5 Asset Catalogs 介面，顯示圖片群組設定畫面](/images/tech/xcode5-asset-catalogs.webp)

用法上沒有變複雜，程式裡照樣用檔名讀取：

\`\`\`c
UIImage *myImage = [UIImage imageNamed:@"blueBG"];
\`\`\`

差別在於這個檔名現在對應的是 Asset Catalogs 裡的一個「Image Set」，而不是某個實體檔案。這樣做有兩個好處：

- 圖片檔名不再需要靠後綴代表裝置，改由開發者在介面上直接指定用途。
- 如果 Deployment Target 設成 iOS 7，Xcode 會把 Asset Catalogs 編譯成二進位格式一起打包，APP 的下載體積會跟著變小。

## Image Slicing（九宮格切片）能解決什麼問題？

Image Slicing 讓同一張圖片可以在不同尺寸、不同解析度下縮放，而不會變形。做法是設定 Stretches 或 Tiles 兩種模式，中間可延展的區域用來吸收縮放,四個角落維持原樣。

![Xcode 5 圖片切片設定畫面](/images/tech/xcode5-image-slicing.webp)

下圖是 Stretches 和 Tiles 兩種模式的差異，可以看出中間區域的延展方式不同：

![Xcode 5 Stretches 與 Tiles 模式比較](/images/tech/xcode5-image-slicing-stretch-tile.webp)

設定好 Center Mode、把素材放進專案後，這張圖就能套用到任意大小的按鈕或背景，不需要另外準備多套尺寸。

## Auto Layout 在 Xcode 5 有哪些介面改動？

iOS 7 上的 Auto Layout 設定幾乎都能直接在 Storyboard 完成，主要變化有四點：

- Interface Builder 不會在移動物件後自動改變 constraints，會讓開發者選擇維持原本設定或套用新條件。
- 按住 Control 拖曳就能快速建立兩個 UIView 之間的 constraints。
- 新增了 Pin 和 Resolve Auto Layout Issues 按鈕，可以清除 constraints、重設為建議值、補上缺少的 constraints、更新 constraints 或 frame。
- Constraints 設定介面變得更直觀，能直接看到目前套用的間距與對齊條件。

![Xcode 5 Auto Layout constraints 設定介面](/images/tech/xcode5-autolayout-constraints.webp)

## 如何用 Preview 視窗比較 iOS 6 與 iOS 7 的顯示差異？

Xcode 5 可以在同一個畫面預覽 APP 在 iOS 6 與 iOS 7 上的顯示差異，步驟是先點選右上角的 Assistant Editor：

![Xcode 5 Assistant Editor 按鈕位置](/images/tech/xcode5-preview-assistant-editor.webp)

接著點下圖紅圈標示的按鈕：

![Xcode 5 Preview 開關按鈕](/images/tech/xcode5-preview-button.webp)

再從右下角的控制項選擇要預覽的系統版本：

![Xcode 5 Preview 版本選擇控制項](/images/tech/xcode5-preview-select.webp)

## Objective-C 語言在 Xcode 5 新增了哪些寫法？

Xcode 5 對應的 Objective-C 語言層級也加了兩個實用寫法：

\`@import\` 允許單獨匯入某個類別，不用整個 Framework 一起 import：

\`\`\`c
#import "ViewController.h"
#import "MyScene.h"
@import AddressBookUI.ABNewPersonViewController;

@implementation ViewController
- (void)viewDidLoad
{
}
\`\`\`

\`instancetype\` 功能跟 \`id\` 類似，但只能用在方法的回傳型別上，代表回傳自己的類別或其子類別。如果 \`alloc init\` 沒有回傳正確的類別，編譯器會直接提示錯誤：

\`\`\`c
@interface Car : NSObject
+(instancetype) car;
@end
\`\`\`

此時若寫成：

\`\`\`c
NSString *car = [Car car];
\`\`\`

編譯器會提示：\`Incompatible pointer types initializing 'NSString *' with an expression of type 'Car *'\` 的警告訊息，比用 \`id\` 更早抓到型別錯誤。

## Xcode 5 的文件與除錯工具改善了什麼?

文件方面，右邊頁籤新增了 Quick Help，也可以用 Option + 點擊直接跳出說明視窗：

![Xcode 5 Quick Help 面板](/images/tech/xcode5-quick-help.webp)

在自訂函數上方用 \`//\` 加註解，或用 \`/*! --- */\` 寫更完整的文件註解，Quick Help 會直接讀取並顯示：

\`\`\`c
/*! 函數說明
* \\param 第一個參數
* \\param 第二個參數
* \\returns 返回值
*/
\`\`\`

除錯工具的改動更直接影響日常開發：

- **Data Tips**：下中斷點後，游標移到變數上就能直接看到當下的值，不用再開 Console 打印。

![Xcode 5 Data Tips 顯示變數內容](/images/tech/xcode5-debugging-data-tips.webp)

- **Quick Look**：把變數內容用圖形化方式呈現，方便檢查物件或圖片型別的資料。

![Xcode 5 Quick Look 顯示變數內容](/images/tech/xcode5-quicklook-1.webp)

- Debug 介面新增了 CPU 與記憶體使用量，也能自行加入要監控的項目，例如電量消耗、iCloud 活躍度、OpenGL 的 frame rate。
- 選單路徑 Product > Perform Action > Analyze File 可以針對單一檔案做效能分析。

## 常見問題

### Asset Catalogs 一定要用在所有專案嗎?

不是必要,但對支援多裝置、多解析度的專案幫助很大,可以省去手動管理 \`@2x\`、\`~ipad\` 等檔名後綴的麻煩,也讓打包後的 APP 體積在 iOS 7 上更小。

### instancetype 和 id 可以互相取代嗎?

不能完全取代。\`instancetype\` 只能用在方法回傳型別,用意是讓編譯器在編譯期就檢查回傳型別是否正確;\`id\` 則沒有這層檢查,錯誤要到執行期才會顯現。

### Image Slicing 跟傳統的九宮格圖片工具有什麼不同?

差別在於 Image Slicing 直接整合進 Xcode 介面,設定好 Stretches 或 Tiles 之後就能在 Interface Builder 即時看到效果,不需要額外的美術工具或匯出流程。

## 參考資料

Apple Developer Documentation，〈New Features in Xcode 5〉（Xcode Release Notes 封存），說明 Asset Catalogs、Image Slicing 與 Auto Layout 編輯器等變動，存取日期：2026-08-27。[https://developer.apple.com/library/archive/documentation/Xcode/Conceptual/WhatsNewXcode-Archive/Articles/xcode_5_0.html](https://developer.apple.com/library/archive/documentation/Xcode/Conceptual/WhatsNewXcode-Archive/Articles/xcode_5_0.html)

## 延伸閱讀

- [Auto Layout 介紹：iOS 7 介面排版為什麼要用約束？](/post/ios-autolayout-introduction)：同樣聚焦 iOS、Auto Layout，可接著比較不同情境的做法。
- [iOS 7 App 轉換指南：舊 App 升級前要檢查哪些項目？](/post/ios7-app-migration-guide)：同樣聚焦 iOS、Objective-C，可接著比較不同情境的做法。
- [iOS 6 與 iOS 7 的不同處整理](/post/ios6-ios7-ui-behavior-differences)：同樣聚焦 iOS、Objective-C，可接著比較不同情境的做法。
`;export{e as default};