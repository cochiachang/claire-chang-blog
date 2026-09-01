var e=`---
title: iOS UI 元件介紹：iPhone App 的欄、視圖與控制元件完整筆記
description: 整理 iPhone iOS UI 元件筆記：狀態欄、導覽欄、工具欄、標籤欄四大欄，表格視圖、文字視圖、Web 視圖三種視圖，以及活動指示器、日期時間選擇器、滑塊等應用程式控制元件的用途與對應 UIKit 類別。
date: 2013-08-26
category: 前端開發
tags: [iOS, UI 設計, UIKit, App開發, UX]
readingTime: 6 分鐘
image: /images/tech/hero_iphone-hig-human-interface-guidelines.webp
imageAlt: 桌面上擺放著一支顯示 App 圖示列表的 iPhone 手機
---


# iOS UI 元件介紹：iPhone App 的欄、視圖與控制元件完整筆記

開發 iPhone App 時，介面要怎麼組，Apple 其實已經準備好一整套標準元件。這篇文章把我整理的 iOS UI 元件筆記分成三部分：畫面上下與底部的四大欄（狀態欄、導覽欄、工具欄、標籤欄）、三種常用的視圖（表格視圖、文字視圖、Web 視圖），以及活動指示器、日期時間選擇器、滑塊等應用程式控制元件，並附上每個元件對應的 UIKit 類別，方便開發時直接對照。

## iPhone 畫面上的四大欄：狀態欄、導覽欄、工具欄、標籤欄有什麼不同？

iPhone 螢幕的四個位置各有一種「欄」，用途完全不同：

| 欄 | 位置 | 用途 |
|---|---|---|
| 狀態欄 | 螢幕最上方 | 顯示與使用者裝置相關的重要資訊，包括電話信號強度、當前網路連接和電量資訊 |
| 導覽欄 | 螢幕上邊緣、狀態欄之下 | 顯示當前視圖的標題，包含導覽控制元件，並在適當情況下包含作用於視圖內容的控制元件 |
| 工具欄 | 螢幕底部 | 提供一系列可在當前上下文中執行的動作 |
| 標籤欄 | 螢幕底部 | 讓使用者在應用程式的不同模式或不同視圖之間轉換，且使用者應能從應用程式的任何地方進入這些模式 |

![iOS 狀態欄顯示電話信號、網路連接與電量資訊](/images/articles/iphone-ui-components-01.webp)

![導覽欄位於螢幕上緣，顯示當前視圖標題與導覽控制元件](/images/articles/iphone-ui-components-02.webp)

工具欄的使用有兩個外觀上的原則要記住：

![工具欄提供當前上下文中可執行的動作](/images/articles/iphone-ui-components-03.webp)

- 工具欄的外觀要力爭與應用程式中其它欄目的外觀保持一致。例如使用了半透明的工具欄，就不要將它與不透明的導覽欄一起使用。
- 避免在同一方向的不同螢幕中改變工具欄的顏色或半透明效果。

![標籤欄讓使用者在不同模式或視圖之間轉換](/images/articles/iphone-ui-components-04.webp)

![在應用程式螢幕中使用視圖和控制元件的整體配置](/images/articles/iphone-ui-components-05.webp)

## 表格視圖、文字視圖和 Web 視圖分別適合什麼內容？

### 表格視圖（UITableView）

表格視圖裡面包含許多元素，並可以使用表格視圖實現常用的使用者操作，例如：

- 選項列表
- 導覽層次資訊
- 查看按概念分組的資訊

![表格視圖可實現選項列表與導覽層次資訊](/images/articles/iphone-ui-components-06.webp)

表格視圖有幾個常見的操作元素：

| 元素 | 用途 |
|---|---|
| 展開指示符 | 出現時，使用者知道可以點選該行任意位置查看下一級資訊，或與當前列表項相關的選項 |
| 詳細資訊展開按鈕 | 點選後查看某個列表項的詳細資訊，動作可獨立於行的選擇動作 |
| 刪除按鈕 | 點選後刪除對應的列表項 |
| 刪除控制按鈕 | 顯示或隱藏每個列表項的「刪除」按鈕 |
| 行插入按鈕 | 向列表中新增一行 |
| 行排序控制元件 | 出現時，使用者可以拖動一行到列表中的另一位置 |
| 選定符號 | 出現在列表項右側，表明該項當前被選中 |

展開指示符和詳細資訊展開按鈕很容易混淆，使用時要注意區分：

- 當選中一行後會顯示「另一個列表」時，應使用展開指示符。
- 不要用展開指示符來顯示某個列表項的詳細資訊——這種情況應使用詳細資訊展開按鈕。

### 文字視圖（UITextView）

文字視圖用來顯示多行、可捲動的文字內容。

![文字視圖顯示多行文字內容](/images/articles/iphone-ui-components-07.webp)

### Web 視圖（UIWebView）

Web 視圖是應用程式螢幕上可以顯示豐富 HTML 內容的一片區域。除了顯示 web 內容之外，Web 視圖還提供了一些元素來支援使用者瀏覽開放的網頁。雖然可以選擇向使用者提供網頁瀏覽功能，但最好避免讓自己建立的應用程式看起來像是一個小型 web 瀏覽器。

## 應用程式控制元件有哪些？各對應哪個 UIKit 類別？

iOS 提供的標準控制元件整理如下，並附上開發時要參考的 UIKit 類別：

| 控制元件 | 用途 | 對應類別 |
|---|---|---|
| 活動指示器 | 表示有一項持續時間未知的任務或過程正在進行 | UIActivityIndicatorView |
| 日期時間選擇器 | 提供簡單的方式選擇特定日期或時間 | UIDatePicker |
| 詳細資訊展開按鈕 | 提供關於某一項的額外資訊或更詳細的資訊 | UIButton |
| 資訊按鈕 | 顯示應用程式的相關資訊 | UIButton |
| 標籤 | 大小可變的靜態文字 | UILabel |
| 頁面指示符號 | 顯示目前頁面在多頁中的位置 | UIPageControl |
| 選擇器 | 日期時間選擇器的通用版本 | UIPickerView |
| 進度視圖 | 顯示具有確定持續時間的任務或過程的進度 | UIProgressView |
| 圓角矩形按鈕 | 多功能的按鈕，在視圖中執行一個動作 | UIButton |
| 搜尋欄 | 接收使用者輸入的文字，作為搜尋的輸入 | UISearchBar |
| 分段控制元件 | 一條直線上各段的集合，每一段相當於一個按鈕，可顯示不同的視圖 | UISegmentedControl |
| 滑塊 | 在允許的值的範圍內對一個值或過程進行調整 | UISlider |
| 文字框 | 接收使用者輸入的圓角矩形區域 | UITextField |

![活動指示器表示持續時間未知的任務正在進行](/images/articles/iphone-ui-components-08.webp)

![日期時間選擇器讓使用者選擇特定日期或時間](/images/articles/iphone-ui-components-09.webp)

![詳細資訊展開按鈕提供某一項的額外資訊](/images/articles/iphone-ui-components-10.webp)

![資訊按鈕](/images/articles/iphone-ui-components-11.webp)

![標籤是大小可變的靜態文字](/images/articles/iphone-ui-components-12.webp)

![頁面指示符號顯示目前頁面位置](/images/articles/iphone-ui-components-13.webp)

![選擇器是日期時間選擇器的通用版本](/images/articles/iphone-ui-components-14.webp)

![進度視圖顯示確定持續時間任務的進度](/images/articles/iphone-ui-components-15.webp)

![搜尋欄接收使用者輸入的文字](/images/articles/iphone-ui-components-16.webp)

![分段控制元件的每一段相當於一個按鈕](/images/articles/iphone-ui-components-17.webp)

![滑塊允許在範圍內調整一個值](/images/articles/iphone-ui-components-18.webp)

![文字框接收使用者輸入，點選時出現鍵盤](/images/articles/iphone-ui-components-19.webp)

幾個容易搞混的搭配再補充說明：

- **選擇器 vs 表格視圖**：如果需要顯示特別多數量的值，應該用表格視圖將這些值列出，而不是用選擇器，因為表格視圖具有更高的高度，能夠更快速地進行滾動。
- **進度視圖 vs 活動指示器**：進度視圖顯示具有「確定持續時間」的任務進度；如果需要顯示未知持續時間任務的進度，請使用活動指示器。
- **文字框**：當使用者點選文字框時會出現鍵盤；點選鍵盤上的 Return 鍵時，文字框會以應用程式指定的方式處理使用者的輸入資訊。

## 用於工具欄和導覽欄的標準按鈕要去哪裡查？

Apple 為工具欄和導覽欄提供了一組標準按鈕（如返回、完成、動作等圖示），不需要自己畫圖。有關這些按鈕的符號名稱和可用性的資訊，請參考 \`UIBarButtonSystemItem\` 的官方文件，開發時直接以 system item 的方式指定即可。

## 常見問題

### 狀態欄和導覽欄有什麼差別？

狀態欄位於螢幕最上方，顯示的是裝置層級的資訊，例如電話信號強度、網路連接和電量。導覽欄則位於狀態欄之下，屬於應用程式自己的介面，用來顯示當前視圖的標題與導覽控制元件。

### 展開指示符和詳細資訊展開按鈕該用哪一個？

如果點選某一行後會進入「另一個列表」，應使用展開指示符。如果是要查看某個列表項的詳細資訊，則應使用詳細資訊展開按鈕，因為它的動作可以獨立於行的選擇。

### 值很多的時候該用選擇器還是表格視圖？

應該用表格視圖。表格視圖具有更高的高度，能夠更快速地進行滾動，比選擇器更適合展示特別多數量的值。

### 進度視圖和活動指示器怎麼選？

進度視圖適合「持續時間確定」的任務，可以顯示具體進度。如果任務的持續時間未知，就使用活動指示器，讓使用者知道任務正在進行中。

### Web 視圖適合拿來做完整的瀏覽器嗎？

不建議。Web 視圖雖然可以顯示豐富的 HTML 內容並支援瀏覽開放網頁，但最好避免讓自己的應用程式看起來像一個小型 web 瀏覽器，應把它用在應用內容的呈現上。

## 參考資料

- Apple 官方文件：UIBarButtonSystemItem（工具欄與導覽欄標準按鈕的符號名稱與可用性）
- Apple UIKit 類別參考：UIActivityIndicatorView、UIDatePicker、UIPickerView、UIProgressView、UISearchBar、UISegmentedControl、UISlider、UITextField、UILabel、UIPageControl、UIButton

## 延伸閱讀

- [iOS 元件介紹：欄、視圖與控制元件完整整理](/post/iphone-ui-components-introduction)：同樣聚焦 iOS、UIKit，可接著比較不同情境的做法。
- [iPhone 人機界面指南（HIG）重點筆記：應用程式類型、開發限制與介面準則](/post/iphone-hig-human-interface-guidelines)：同樣聚焦 iOS、UI設計，可接著比較不同情境的做法。
- [iOS 6 與 iOS 7 的不同處整理](/post/ios6-ios7-ui-behavior-differences)：同樣聚焦 iOS、UIKit，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2013-08-26，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};