var e=`---
title: iOS 元件介紹：欄、視圖與控制元件完整整理
description: 整理 iOS 應用程式常用的介面元件，包括狀態欄、導覽欄、工具欄、標籤欄、表格視圖、文字視圖、Web 視圖，以及活動指示器、日期時間選擇器、滑塊等控制元件的用途與使用時機。
date: 2013-08-26
category: 前端開發
tags: [iOS, UIKit, Objective-C, UI 設計, UX]
readingTime: 6 分鐘
image: /images/tech/hero_iphone-ui-components-introduction.webp
imageAlt: iPhone 螢幕上顯示滿滿的 App 圖示，呈現 iOS 介面元件
---


# iOS 元件介紹：欄、視圖與控制元件完整整理

開發 iOS 應用程式時，UIKit 提供了一整套標準介面元件，搞懂每個元件的用途與使用時機，介面就成功了一半。這篇我把表格視圖、文字視圖、Web 視圖這幾種視類型，加上狀態欄、導覽欄、工具欄、標籤欄等欄類元件，以及常用的應用程式控制元件，一次整理成筆記。

## iOS 畫面上有哪些常見的「欄」類元件？

- **狀態欄**：顯示與使用者裝置相關的重要資訊，包括電話信號強度、當前網路連接和電量資訊。

![iOS 狀態欄](/images/articles/iphone-ui-components-introduction-1.webp)

- **導覽欄**：位於應用程式螢幕的上邊緣，在狀態欄之下。導覽欄通常會顯示當前視圖的標題，包含導覽控制元件，並在適當的情況下也可以包含作用於視圖內容的控制元件。

![iOS 導覽欄](/images/articles/iphone-ui-components-introduction-2.webp)

- **工具欄**：如果應用程式為使用者提供了一系列可在當前上下文中執行的動作，那麼可以提供一個工具欄。工具欄的外觀要力爭與應用程式中的其它欄目的外觀保持一致。例如，如果使用半透明的工具欄，就不要將它與不透明的導覽欄一起使用。此外，請避免在同一方向的不同螢幕中改變工具欄的顏色或半透明效果。

![iOS 工具欄](/images/articles/iphone-ui-components-introduction-3.webp)

- **標籤欄**：標籤欄使使用者能夠在應用程式的不同模式或不同視圖之間進行轉換，並且使用者應該能夠從應用程式的任何地方進入這些模式。

![iOS 標籤欄](/images/articles/iphone-ui-components-introduction-4.webp)

## 表格視圖可以拿來做什麼？

表格視圖裡面包含許多元素，可以使用表格視圖實現常用的使用者操作，例如：選項列表、導覽層次資訊、查看按概念分組的資訊。

![iOS 表格視圖](/images/articles/iphone-ui-components-introduction-5.webp)

### 表格視圖有哪些操作元素？

| 元素 | 用途 |
|---|---|
| 展開指示符 | 出現時，使用者知道可以點選該行任意位置查看下一級資訊，或與當前列表項相關的選項 |
| 詳細資訊展開按鈕 | 點選後可查看某個列表項的詳細資訊，動作可獨立於行的選擇動作 |
| 刪除按鈕 | 點選後刪除對應的列表項 |
| 刪除控制按鈕 | 點選後顯示或隱藏每個列表項的「刪除」按鈕 |
| 行插入按鈕 | 點選後向列表中新增一行 |
| 行排序控制元件 | 出現時，使用者可以拖動一行到列表中的另一位置 |
| 選定符號 | 出現在列表項右側，表明該項當前被選中 |

關於展開指示符要多注意一件事：當選中一行後會顯示另一個列表時，才應使用展開指示符。不要使用展開指示符來顯示某個列表項的詳細資訊——這種情況應改用詳細資訊展開按鈕。

## 文字視圖和 Web 視圖有什麼不同？

**文字視圖**用來顯示多行文字內容：

![iOS 文字視圖](/images/articles/iphone-ui-components-introduction-7.webp)

**Web 視圖**是應用程式螢幕上可以顯示豐富 HTML 內容的一片區域。除了顯示 web 內容之外，Web 視圖還提供了一些元素來支援使用者瀏覽開放的網頁。雖然可以選擇向使用者提供網頁瀏覽功能，但最好避免讓應用程式看起來像是一個小型 web 瀏覽器。

## 常用的應用程式控制元件有哪些？

- **活動指示器**：表示有一項持續時間未知的任務或過程正在進行當中。（請參考 \`UIActivityIndicatorView\` 類）

![活動指示器](/images/articles/iphone-ui-components-introduction-8.webp)

- **日期時間選擇器**：為使用者提供一種簡單的選擇特定日期或時間的方式。（請參考 \`UIDatePicker\` 類）

![日期時間選擇器](/images/articles/iphone-ui-components-introduction-9.webp)

- **詳細資訊展開按鈕**：提供關於某一項的額外資訊或更詳細的資訊。（參考 \`UIButton\` 類）

![詳細資訊展開按鈕](/images/articles/iphone-ui-components-introduction-10.webp)

- **資訊按鈕**：（參考 \`UIButton\` 類）

![資訊按鈕](/images/articles/iphone-ui-components-introduction-11.webp)

- **標籤**：一種大小可變的靜態文字。（參考 \`UILabel\` 類）

![標籤 UILabel](/images/articles/iphone-ui-components-introduction-12.webp)

- **頁面指示符號**：（參考 \`UIPageControl\` 類）

![頁面指示符號](/images/articles/iphone-ui-components-introduction-13.webp)

- **選擇器**：選擇器是日期時間選擇器的通用版本。如果需要顯示特別多數量的值，應該用表格視圖將這些值列出，而不是用選擇器，因為表格視圖具有更高的高度，能夠更快速地進行滾動。（參考 \`UIPickerView\` 類）

![選擇器 UIPickerView](/images/articles/iphone-ui-components-introduction-14.webp)

- **進度視圖**：顯示具有確定持續時間的任務或過程的進度。如果需要顯示未知持續時間任務的進度，請改用活動指示器。（參考 \`UIProgressView\` 類）

![進度視圖](/images/articles/iphone-ui-components-introduction-15.webp)

- **圓角矩形按鈕**：一種多功能的按鈕，可以在視圖中使用它來執行一個動作。（參考 \`UIButton\` 類）
- **搜尋欄**：一片接收使用者輸入文字的區域，應用程式可以以搜尋欄中的文字為輸入進行搜尋。（參考 \`UISearchBar\` 類）

![搜尋欄](/images/articles/iphone-ui-components-introduction-16.webp)

- **分段控制元件**：處在一條直線上的各段的集合，其中每一段都相當於一個按鈕，可以顯示不同的視圖。（參考 \`UISegmentedControl\` 類）

![分段控制元件](/images/articles/iphone-ui-components-introduction-17.webp)

- **滑塊**：允許使用者在允許的值的範圍內對一個值或一個過程進行調整。當使用者拖拉滑塊時，相應的值或過程也不斷被更新。（參考 \`UISlider\` 類）

![滑塊 UISlider](/images/articles/iphone-ui-components-introduction-18.webp)

- **文字框**：一個接收使用者輸入的圓角矩形區域。當使用者點選文字框時，會出現一個鍵盤；當使用者點選鍵盤上的 Return 鍵時，文字框會以應用程式指定的方式處理使用者的輸入資訊。（參考 \`UITextField\` 類）

![文字框 UITextField](/images/articles/iphone-ui-components-introduction-19.webp)

另外，工具欄和導覽欄也有一組標準按鈕可用，有關這些按鈕的符號名稱和可用性的資訊，請參考 \`UIBarButtonSystemItem\` 的文件。

## 常見問題

### 展開指示符和詳細資訊展開按鈕該用哪一個？

點選後要進入「另一個列表」時用展開指示符；要顯示某個列表項的詳細資訊時用詳細資訊展開按鈕。兩者語意不同，詳細資訊展開按鈕的動作還可以獨立於行的選擇。

### 任務進度持續時間未知時該用什麼元件？

用活動指示器（\`UIActivityIndicatorView\`）。進度視圖（\`UIProgressView\`）只適合持續時間確定的任務，持續時間未知時應改用活動指示器。

### 選項很多的時候該用選擇器還是表格視圖？

用表格視圖。選擇器適合數量不多的值，當需要顯示特別多的值時，表格視圖高度更高、滾動更快，操作效率比較好。

### 工具欄的外觀有什麼要注意的？

工具欄外觀要與應用程式其他欄目保持一致，例如半透明工具欄不要與不透明導覽欄一起使用，也要避免在同一方向的不同螢幕間改變工具欄的顏色或半透明效果。

### Web 視圖適合做什麼？

適合在應用程式內顯示豐富的 HTML 內容，也提供瀏覽開放網頁的元素。但不建議把整個應用程式做成像小型 web 瀏覽器一樣。

## 延伸閱讀

- [iOS UI 元件介紹：iPhone App 的欄、視圖與控制元件完整筆記](/post/iphone-ui-components)：同樣聚焦 iOS、UI設計，可接著比較不同情境的做法。
- [iPhone 人機界面指南（HIG）重點筆記：應用程式類型、開發限制與介面準則](/post/iphone-hig-human-interface-guidelines)：同樣聚焦 iOS、UI設計，可接著比較不同情境的做法。
- [iOS 6 與 iOS 7 的不同處整理](/post/ios6-ios7-ui-behavior-differences)：同樣聚焦 iOS、Objective-C，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2013-08-26，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};