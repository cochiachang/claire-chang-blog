var e=`---
title: "WordPress Plugins開發怎麼入門？我的佈景結構與外掛架構分享"
description: "整理我當年分享的WordPress開發簡報重點：WordPress與PHP、MySQL的基本架構、文章與頁面的差異、佈景主題必備檔案清單，以及頁面層級結構的自動遞補機制，適合想入門WordPress外掛與佈景開發的人參考。"
date: 2013-04-12
category: 後端開發
tags: [WordPress, PHP, 佈景主題, 外掛開發, MySQL]
readingTime: 3 分鐘
image: /images/tech/hero_wordpress-plugins-development-overview.webp
imageAlt: 藍色筆記型電腦螢幕上顯示WordPress標誌，象徵WordPress開發
---


# WordPress Plugins開發怎麼入門？我的佈景結構與外掛架構分享

這篇整理我早年分享的一場WordPress套版開發簡報重點。內容涵蓋WordPress的基本架構、文章與頁面的差異、佈景主題的必備檔案，以及頁面層級結構的遞補規則，是想入門WordPress外掛（Plugins）與佈景開發時很好的先修觀念。是當時的PowerPoint，其內容截錄如下。

## WordPress是什麼？開發前要先知道的基本架構

WordPress是一個以PHP和MySQL為平台的自由開源部落格軟體和內容管理系統（CMS）。它的幾個核心特性，正好對應到外掛開發的切入點：

- **主題（佈景）**：使用者可以安裝和切換主題。主題可讓使用者不改變部落格內容和結構的情況下，更改介面和WordPress站點的功能。
- **外掛模組架構**：WordPress非常流行的一個特性是它豐富的外掛模組架構，外掛模組能使使用者和開發者擴充WordPress程式的功能。當時的WordPress外掛模組資料庫中已有超過18,000個外掛模組，包括SEO、控制項等等。

## 文章與頁面有什麼不同？

在WordPress裡，網頁分成「文章」及「頁面」兩種類型：

| 類型 | 特性 | 例子 |
| --- | --- | --- |
| 頁面（Page） | 網頁中的固定頁面，不經常更新 | 關於我們、聯絡資訊 |
| 文章（Post） | 網頁中的經常性變更頁面，常更新 | 最新資訊、我的作品 |

另外還有幾個實務上會碰到的重點：

- 每一篇文章及頁面都可以設定是否開啟迴響。迴響是類似留言版的地方，會顯示在網頁的下方。
- 外掛及佈景主題皆可以在官網下載或尋找免費支援，許多免費外掛或主題也有提供功能較完整的付費版本，此為WordPress的主要營收來源。

## 佈景主題裡有哪些檔案？

一個佈景主題通常由以下這些檔案組成，各自負責網站的一部分：

| 檔案 | 用途 |
| --- | --- |
| style.css | 佈景CSS樣式 |
| header.php | 各頁共用的網頁頭部 |
| footer.php | 各頁共用的網頁底部 |
| sidebar.php | 邊欄模組 |
| index.php | 首頁 |
| single.php | 單頁文章 |
| page.php | 網誌分頁 |
| comments.php | 迴響模版 |
| functions.php | 佈景設定 |
| archive.php | 文章彙整 |
| 404.php | 找不到頁面 |
| search.php | 站內搜尋結果 |

## 頁面層級結構是怎麼運作的？

WordPress的頁面有層級的結構存在：當上述12個php檔案並沒有全部都存在時，系統會自動尋找前一層級的檔案來替代。也就是說，就算佈景只寫了\`index.php\`，其他缺漏的頁面還是能夠正常顯示，只是客製化程度較低。

一個佈景主題裡**至少要有\`style.css\`及\`index.php\`**這兩個檔案，其餘檔案都可以依需求逐步補上。下圖是我整理的頁面層級結構：

![WordPress頁面層級結構：index.php底下可接single.php、page.php、archive.php、search.php、404.php](/images/articles/wordpress-plugins-development-overview-1.webp)

理解這套遞補機制後，開發外掛或佈景時就能知道該把模板檔案放在哪一層，也能用最精簡的檔案數量把網站架起來。

## 常見問題

### 開發WordPress佈景主題最少需要哪些檔案？

至少需要\`style.css\`與\`index.php\`兩個檔案。\`style.css\`除了樣式外也承載佈景的後設資訊，\`index.php\`則是所有頁面最後的遞補底線，有這兩個檔案網站就能運作。

### WordPress外掛和佈景主題有什麼差別？

佈景主題負責網站的外觀與版面，更換主題不會改變內容與結構；外掛則是擴充WordPress程式功能用的模組，例如SEO、表單、控制項等，兩者可以獨立開發與安裝。

### 頁面層級結構找不到對應檔案時會怎樣？

WordPress會自動往上找前一層級的檔案來替代。例如缺少\`single.php\`時會使用\`index.php\`來顯示單篇文章，因此佈景不會因為缺檔案而壞掉。

### WordPress是用什麼技術打造的？

WordPress是以PHP和MySQL為平台打造的自由開源軟體，同時兼具部落格與內容管理系統（CMS）的用途，主機端只需要支援PHP與MySQL即可安裝。

## 參考資料


## 延伸閱讀

- [WordPress Plugins 開發入門：佈景檔案、頁面層級與外掛架構解析](/post/wordpress-plugin-development-share)：同樣聚焦 WordPress、PHP，可接著比較不同情境的做法。
- [WordPress Plugin 開發入門：做出你的第一個 WordPress 外掛](/post/wordpress-first-plugin-development)：同樣聚焦 WordPress、PHP，可接著比較不同情境的做法。
- [PHP 使用 SOAP：SoapServer 與 SoapClient 基本架設](/post/php-soap-server-client)：同樣聚焦 PHP，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2013-04-12，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};