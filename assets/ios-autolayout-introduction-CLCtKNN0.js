var e=`---
title: Auto Layout 介紹：iOS 7 介面排版為什麼要用約束？
description: 整理 iOS 7 Auto Layout 的基本概念，說明 frame、bounds、Autoresizing Mask 與 constraint-based layout 的差異。
date: 2014-01-09
category: 前端開發
tags: [iOS, Auto Layout, Objective-C, UI 開發]
readingTime: 5 分鐘
image: /images/tech/xcode5-autolayout-constraints.webp
imageAlt: Xcode 5 Auto Layout constraints 設定介面，顯示 iOS 介面元件的約束條件
---


# Auto Layout 介紹：iOS 7 介面排版為什麼要用約束？

Auto Layout 是 iOS 的約束式排版系統，用來描述 View 之間的位置、尺寸與對齊關係。iOS 7 開始更強調多螢幕尺寸、動態字體與扁平化介面，單靠 \`frame\`、\`bounds\` 或 Autoresizing Mask 處理畫面變化，會比使用 Auto Layout 更容易失控。

這篇筆記整理 2014 年分享的 Auto Layout 入門內容：先看過去常用的 \`frame\`、\`bounds\`、Autoresizing Mask，再比較 Auto Layout 多出的能力，最後回到 constraint-based layout 這個核心概念。

## Auto Layout 的投影片與影片在哪裡？

Auto Layout 入門可以先看投影片掌握概念，再搭配影片理解 Interface Builder 中的實際操作。投影片主題是 iOS 7 的 Auto Layout。

投影片連結：[Auto layout in i os 7](https://www.slideshare.net/claire0318/auto-layout-in-i-os-7)，分享者為 [Claire Chang](https://www.slideshare.net/claire0318)。

影片連結：[Auto Layout 影片分享](https://www.youtube.com/watch?v=wkf48YgAO18)。

這兩份素材適合先快速建立語感：Auto Layout 不是要開發者把每個座標算得更精準，而是把介面元件之間的關係說清楚，讓系統依照約束條件算出實際位置。

## 過去 iOS 介面排版通常怎麼做？

早期 iOS 介面排版常直接使用 \`frame\`、\`bounds\` 和 Autoresizing Mask。這些做法能處理固定畫面或簡單縮放，但面對多尺寸螢幕時彈性有限。

在 Auto Layout 普及前，常見做法有兩種：

1. 使用 \`frame\` 和 \`bounds\` 決定物件的位置與大小。
2. 使用 Autoresizing Mask 設定畫面大小改變時，哪些邊距要固定、哪些寬高要跟著改變。

Autoresizing Mask 裡常提到兩個概念：

| 概念 | 作用 |
|---|---|
| Struts | 設定畫面大小變動時，要固定哪些邊距或尺寸。 |
| Springs | 當 superview 的大小改變時，讓 view 的寬度或高度跟著調整。 |

這套方式在單一螢幕尺寸、少量元件的畫面裡很好理解；問題是畫面一複雜，開發者就要自己推算很多連動規則。只要元件數量增加、方向改變、字體變大，手動計算就會變成維護成本。

## Auto Layout 和 Autoresizing Mask 有什麼不同？

Autoresizing Mask 可以視為 Auto Layout 的子集。Auto Layout 能描述任意兩個 View 的相對關係，也能設定不相等約束與優先級。

兩者最大的差別，不是語法新舊，而是表達能力：

| 能力 | Autoresizing Mask | Auto Layout |
|---|---|---|
| 描述基準 | 主要依賴 superview 大小變化 | 可描述任意 View 之間的關係 |
| 相對位置 | 支援有限 | 可指定任意兩個 View 的相對位置 |
| 不相等條件 | 不適合 | 可設定大於、小於或等於 |
| 優先級 | 不支援 | 可設定 constraint priority |
| 複雜版面 | 容易需要手動補計算 | 適合用約束描述版面規則 |

例如兩個按鈕要保持固定間距、文字區塊要隨內容撐開、某個 View 最小寬度不能低於指定值，這些情境用 Auto Layout 會比較自然。Auto Layout 讓開發者描述「關係」，而不是只描述「結果座標」。

![Xcode 5 Auto Layout constraints 設定介面，顯示 iOS 介面元件的約束條件](/images/tech/xcode5-autolayout-constraints.webp)

## Auto Layout 是什麼？

Auto Layout 是一種 constraint-based、descriptive layout system。開發者用約束條件描述版面，系統再依照約束自動計算 View 的 frame。

用中文拆開來看，Auto Layout 可以理解成三件事：

- **基於約束**：用相對位置、寬高、間距、對齊等 constraint 定義畫面。
- **描述性**：用接近自然語言的方式描述版面規則，例如「這個按鈕距離父層右邊 20 點」。
- **佈局系統**：負責計算介面元素的位置與大小，讓畫面在不同條件下仍能維持合理排列。

英文說法是：Auto Layout is a constraint-based, descriptive layout system. Describe the layout with constraints, and frames are calculated automatically.

換句話說，使用 Auto Layout 時，開發者不再把重點放在「現在這個 View 的 frame 應該是多少」，而是改成描述「這個 View 應該和其他 View 保持什麼關係」。系統會根據這些 constraints 推出最後的 frame。

## 什麼情境適合開始用 Auto Layout？

需要支援多尺寸、多方向、動態字體或複雜元件關係時，Auto Layout 通常比手動計算 frame 更適合。iOS 7 之後的介面調整尤其需要這種彈性。

可以先從這幾種畫面開始導入：

1. 同一個 App 要支援 iPhone、iPad 或不同螢幕比例。
2. 畫面中的文字長度不固定，或需要支援系統動態字體。
3. 元件彼此需要固定間距、置中、等寬或依內容撐開。
4. 舊專案已經因為 iOS 7 介面變化出現跑版問題。
5. Storyboard 或 XIB 中的元件越來越多，手動調 frame 容易互相影響。

如果只是固定尺寸的小元件，直接設定 frame 仍然可以運作；但只要版面規則開始依賴另一個 View，Auto Layout 的可維護性就會明顯比較好。

## 常見問題

### Auto Layout 是不是一定要取代 frame 和 bounds？

Auto Layout 不一定要在所有情境取代 \`frame\` 和 \`bounds\`。固定尺寸、一次性計算的位置仍然可以用 \`frame\`；需要跟其他 View 保持關係、支援螢幕變化或動態字體時，Auto Layout 比較適合。

### Autoresizing Mask 還有必要學嗎？

Autoresizing Mask 還是值得理解，因為舊專案和早期 UIKit 介面常會遇到。Autoresizing Mask 能處理簡單的父層大小變化，但如果版面需要不相等約束、優先級或多個 View 的相對位置，就應該改看 Auto Layout。

### Constraint priority 是什麼？

Constraint priority 是約束的優先級。當多個 constraints 無法同時完全滿足時，Auto Layout 會依照優先級決定哪些條件比較重要，哪些條件可以被放寬。

### iOS 7 為什麼特別常提到 Auto Layout？

iOS 7 的介面風格、狀態列處理、動態字體與多尺寸支援都讓版面變化更多。Auto Layout 可以用約束描述元件關係，讓同一套介面比較容易適應不同畫面條件。

### Storyboard 裡可以直接設定 Auto Layout 嗎？

可以。Xcode 5 之後，Interface Builder 提供更完整的 Auto Layout 操作介面，可以用 Control 拖曳建立 constraints，也可以用 Pin 和 Resolve Auto Layout Issues 調整缺少或衝突的約束。

## 參考資料

- Claire Chang，[Auto layout in i os 7](https://www.slideshare.net/claire0318/auto-layout-in-i-os-7)，存取日期：2026-08-28。
- YouTube，[Auto Layout 影片分享](https://www.youtube.com/watch?v=wkf48YgAO18)，存取日期：2026-08-28。

**最後更新：** 2026-08-28

## 延伸閱讀

- [Xcode 5 新功能整理：Asset Catalogs、Auto Layout 與除錯工具](/post/xcode-5-new-features-guide)：同樣聚焦 iOS、Objective-C，可接著比較不同情境的做法。
- [iOS 7 App 轉換指南：舊 App 升級前要檢查哪些項目？](/post/ios7-app-migration-guide)：同樣聚焦 iOS、Objective-C，可接著比較不同情境的做法。
- [iOS 6 與 iOS 7 的不同處整理](/post/ios6-ios7-ui-behavior-differences)：同樣聚焦 iOS、Objective-C，可接著比較不同情境的做法。
`;export{e as default};