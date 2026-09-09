var e=`---
title: iOS 7 App 轉換指南：舊 App 升級前要檢查哪些項目？
description: 整理 App 升級到 iOS 7 前的必做與應做項目，包含 Icon 尺寸、AutoLayout、動態字體與半透明列。
date: 2013-10-07
category: 前端開發
tags: [iOS, Objective-C, UX, Auto Layout]
readingTime: 6 分鐘
image: /images/tech/hero_ios7-migration-guide.webp
imageAlt: iOS 7 內建日曆 App 的簡化介面，展示去除擬物化裝飾後的乾淨版面
---


# iOS 7 App 轉換指南：舊 App 升級前要檢查哪些項目？

舊 App 要升到 iOS 7，不是換個圖示就能上架。iOS 7 把整套視覺語言換掉了——擬物化按鈕、陰影、皮革紋理全部退場，換成依從（Deference）、清晰（Clarity）、深度（Depth）三個設計主題。這篇整理實際要做的檢查項目：從 Icon 尺寸、AutoLayout，到動態字體跟半透明列，照著做一輪，App 送審前該補的東西大致就補齊了。

參考資料：<a href="https://developer.apple.com/library/ios/documentation/userexperience/conceptual/TransitionGuide/index.html#//apple_ref/doc/uid/TP40013174-CH6-SW1" target="_blank" rel="noopener">iOS 7 UI Transition Guide</a>、關於 iOS 7，設計師需要瞭解的十件事（原文已下架）

## iOS 7 的三個設計主題是什麼？

依從、清晰、深度是 Apple 在 iOS 7 UI Transition Guide 裡定的三個核心原則，往後每個改版細節都是從這三點推導出來的：

- **依從**：介面要幫助使用者理解怎麼操作、怎麼跟內容互動,但不能搶走內容的鋒頭。設計是用來襯托內容,不是拿來壓過內容的。
- **清晰**：文字在各種尺寸下都要清晰易讀,圖示和裝飾要用得節制,只在真正需要強調的地方出現。
- **深度**：透過手勢和視覺階層,讓使用者更快理解畫面上發生了什麼事。

iOS 7 內建的日曆 App 就是「依從」的示範——介面被大幅簡化,拿掉了不必要的裝飾元素,用乾淨的白色背景把畫面焦點完全讓給內容。

![iOS 7 內建日曆 App 的簡化介面，展示去除擬物化裝飾後的乾淨版面](/images/tech/hero_ios7-migration-guide.webp)

依照「依從」原則，Apple 建議開發者不要做擬真設計——3D 質感按鈕、漸層、光暈、陰影這類擬物化元素都應該盡量避免，因為這些效果會把使用者的注意力從內容上拉走。不過圖示可以變輕量，44px 的最小可點擊區域規則沒有變，這條線還是得守住。

想看拿掉擬物化風格的實例，可以參考 iOS 7 內建的 Game Center、日曆、Podcast 這幾個 App。

深度這個主題則展現在系統界面由加速計驅動的 3D 效果上：設備在空間中移動時，圖示跟背景圖片會出現視差,讓層次感透過動畫傳達出來,而不是只靠平面的視覺提示。Apple 希望第三方 App 也採用同樣做法——用半透明和動畫效果去表現介面元素之間的層級關係。

## 升級前該怎麼檢視現有的 App？

在動手改版之前，先確認三件事，這三件事決定了後面要花多少工。

**第一，AutoLayout 有沒有開。** iOS 7 允許使用者自行調整系統字體大小，這正是導入 AutoLayout 的好時機——它能讓開發者不用手動計算，就讓物件依相對位置自動排版，同時也更容易讓同一份 App 兼顧 iOS 6 和 iOS 7 兩種畫面規則。

**第二，是不是還要顧 iOS 6。** 使用者通常會很快更新到最新系統版本,但如果商業上還有非升級不可的理由要同時支援 iOS 6,那排版跟元件行為都得多做一層判斷跟調校,工作量會明顯增加。

**第三，自己的 UI 屬於哪一種類型。** 這決定了改版範圍會落在哪個量級：

1. **完全使用內建 UI 元件**：檢查新版視覺效果是不是你要呈現給使用者的樣子,並確認手勢等操作能正常運作。
2. **完全自訂 UI**：檢查原本的設計能不能滿足 iOS 7 的介面要求——如果可以,改動範圍就小;如果不行,得整個重新思考架構,讓它適應新規則。
3. **混合使用**：改動幅度取決於自訂元素過去是怎麼跟系統元件搭配的,重點是確保功能和外觀都保持良好,並且能跟新版內建介面無縫接軌。

## 升級 iOS 7 有哪些必做項目？

以下三項是官方文件列為「必做」的基本門檻,少了任何一項都過不了審核或會讓 App 看起來明顯過時。

1. **更新 Icon 尺寸**：iPhone 和 iPod touch 需要 120×120,iPad 需要 152×152。新版 Icon 設計上不應再使用光圈跟陰影裝飾。完整的尺寸需求如下表：

   ![各裝置解析度下 App Icon、啟動畫面、Tab bar 等圖示尺寸對照表](/images/tech/ios7-icon-size-table.webp)

2. **讓 App 背景延伸到狀態列**：iOS 7 的畫面預期是全螢幕呈現,背景不該在狀態列位置留一條斷層。

3. **支援 Retina 並調整版面符合 iPhone 5 規格**：確保畫面在長版螢幕上不會出現留白或裁切錯誤。

## 升級 iOS 7 應該做的項目有哪些？

「必做」是及格線,「應做」則是讓 App 真正貼合 iOS 7 設計語言的部分。這幾項花的力氣比較多,但也是使用者最容易感受到差異的地方。

- **確認半透明元素**：iOS 7 的畫面設計要是全螢幕的,狀態列、導覽列這類元素應該做成半透明。
- **重新檢查 Icon 風格**：新規範要求圖示更簡單,且風格要跟舊版有明顯區別,順便檢查 bar button 的圖示是否符合新規範。
- **拿掉不必要的按鈕邊框**：盡量靠版面佈局讓使用者知道這是個按鈕,而不是靠邊框線。
- **改用相對位置排版**：iOS 7 建議用 AutoLayout 取代直接寫死座標的方式,部分舊版佈局需要重新評估跟調整。
- **檢查系統元件外觀的變化**：許多內建元件的預設樣式改了,switches 變窄、Progress View 變細、grouped tables 的分界方式也不同,這些都會連帶影響整體外觀。

  ![iOS 7 與 iOS 6 的 switch 元件與日期選擇器樣式對照](/images/tech/ios7-switches-narrower.webp)

  完整的元件改版清單可以參考:iOS 6 to iOS 7 UI changes（原文已下架）。

- **支援動態字體大小【重要】**：iOS 7 使用者可以自行設定系統顯示字體大小,App 應該要能因應使用者選的字級去調整版型,而不是讓文字被截斷或版面跑掉。

  ![同一畫面在最小字級與最大非輔助字級下的排版差異](/images/tech/ios7-dynamic-type-font-size.webp)

- **避開系統手勢熱區**：iOS 7 的通知中心和控制中心分別是從畫面上方和下方邊緣往內滑出來的,App 裡要盡量避免在同樣區域設計 swipe up、top down 這類操作,不然會跟系統手勢打架。
- **重新考量陰影與漸層的使用**：iOS 7 重視乾淨介面(smooth)以及用深度去強調內容(layered),擬真式設計已經不是主流做法,這部分要重新盤點。
- **視需要把專案更新到 iOS 6 版本以上的 Base SDK**：這樣才能使用 AutoLayout 和 storyboard 這兩項工具。

## 怎麼讓 App 同時支援 iOS 6 和 iOS 7？

如果商業上必須兩版並存，Xcode 的 Assistant Editor 可以同時預覽不同 iOS 版本的畫面，讓你在同一份 XIB 或 storyboard 上檢查兩邊的呈現效果：

1. 開啟 Assistant Editor。
2. 打開 Assistant Editor 上方的選單列。
3. 在選單裡選擇要檢視的 XIB 或 storyboard。
4. 選擇要預覽的系統版本。

透過這個流程，同一份介面檔案在不同 iOS 版本下的呈現差異可以直接在編輯器裡比對，不用切換模擬器來回測試，省下不少排版微調的時間。

## 常見問題

### iOS 7 改版一定要全部項目都做嗎？

不用。官方文件本身就分「必做」跟「應做」——Icon 尺寸、背景延伸到狀態列、Retina/iPhone 5 適配這三項是上架門檻,其餘項目可以依照 App 的商業優先順序分批處理。

### 只支援 iOS 7、不管 iOS 6 可以省掉哪些工作？

可以省掉 Assistant Editor 裡的雙版本預覽跟排版分支判斷,直接用 AutoLayout 走單一套版面邏輯即可,改版工作量會明顯降低。

### 動態字體支援為什麼被列為重要項目？

因為這是使用者主動設定、隨時可能改變的系統層級選項,如果版面沒有跟著調整,文字被截斷或跑版的機率很高,直接影響到 App 的可用性評價。


## 參考資料
Apple Inc.，iOS 7 UI Transition Guide（封存版），存取日期：2026-08-27。[https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/TransitionGuide/index.html](https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/TransitionGuide/index.html)

## 延伸閱讀

- [Auto Layout 介紹：iOS 7 介面排版為什麼要用約束？](/post/ios-autolayout-introduction)：同樣聚焦 iOS、Auto Layout，可接著比較不同情境的做法。
- [iOS 6 與 iOS 7 的不同處整理](/post/ios6-ios7-ui-behavior-differences)：同樣聚焦 iOS、Objective-C，可接著比較不同情境的做法。
- [Xcode 5 新功能整理：Asset Catalogs、Auto Layout 與除錯工具](/post/xcode-5-new-features-guide)：同樣聚焦 iOS、Objective-C，可接著比較不同情境的做法。
`;export{e as default};