var e=`---
title: WordPress Plugins 開發入門：佈景檔案、頁面層級與外掛架構解析
description: 整理 WordPress 外掛與佈景主題開發的基礎知識：WordPress 簡介、文章與頁面的差異、12 個佈景檔案的作用，以及頁面層級結構的遞補規則，適合剛入門的 WordPress 開發者。
date: 2013-04-12
category: 後端開發
tags: [WordPress, PHP, 佈景主題, 外掛開發, CMS]
readingTime: 4 分鐘
image: /images/tech/hero_wordpress-plugin-development-share.webp
imageAlt: WordPress 開發主題圖：程式碼與網頁開發工作環境
---


# WordPress Plugins 開發入門：佈景檔案、頁面層級與外掛架構解析

這篇文章整理我分享 WordPress 套版開發時的簡報重點：從 WordPress 是什麼、文章與頁面的差異，到佈景主題必備的檔案結構與頁面層級遞補規則。如果你想入門 WordPress 佈景或外掛開發，這份筆記可以幫你快速建立整體架構觀念。完整簡報也提供下載。

## 什麼是 WordPress？為什麼它這麼流行？

WordPress 是一個以 PHP 和 MySQL 為平台的自由開源部落格軟體和內容管理系統（CMS）。它流行的原因主要有兩個：

- **主題（佈景主題）機制**：使用者可以安裝和切換主題，在不改變部落格內容和結構的情況下，更改介面外觀與 WordPress 站點的功能。
- **豐富的外掛架構**：外掛模組能讓使用者和開發者擴充 WordPress 程式的功能。當時 WordPress 外掛資料庫中已有超過 18,000 個外掛，涵蓋 SEO、控制項等各種需求——如今更是數以萬計。

## WordPress 的文章與頁面有什麼不同？

在 WordPress 裡，網頁內容分成「文章」與「頁面」兩種類型：

| 類型 | 用途 | 特性 | 範例 |
|------|------|------|------|
| 頁面（Page） | 網頁中的固定頁面 | 不經常更新 | 關於我們、聯絡資訊 |
| 文章（Post） | 經常性變更的內容 | 常更新 | 最新資訊、我的作品 |

- 每一篇文章及頁面都可以設定是否開啟「迴響」——迴響類似留言版，會顯示在網頁的下方。
- 外掛及佈景主題皆可以在官網下載或找到免費支援。許多免費外掛或主題也提供功能更完整的付費版本，這是 WordPress 生態系的主要營收來源。

## WordPress 佈景主題有哪些檔案？

一個佈景主題通常由以下 PHP 檔案組成，各自負責頁面的不同區塊：

| 檔案 | 用途 |
|------|------|
| style.css | 佈景 CSS 樣式 |
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

## WordPress 的頁面層級結構如何運作？

WordPress 的頁面有層級結構存在：當這 12 個 PHP 檔案並沒有全部都存在時，WordPress 會自動尋找前一層級的檔案來替代。例如 \`single.php\` 不存在時，就會退回使用 \`index.php\` 來渲染。

實務上要注意的是：**一個佈景主題裡至少要有 \`style.css\` 及 \`index.php\`**，這是 WordPress 能正常套用佈景的最低門檻。

WordPress 官方將這套遞補規則稱為 Template Hierarchy（模板層級），下圖是我當時整理的層級對照：

![WordPress 頁面層級結構圖](/images/articles/wordpress-plugin-development-share-1.webp)

## 常見問題

### WordPress 佈景主題最少需要哪些檔案？

至少要有 \`style.css\` 與 \`index.php\` 兩個檔案。\`style.css\` 負責佈景樣式與主題資訊，\`index.php\` 是最基礎的渲染入口；缺少其他檔案時 WordPress 會依頁面層級結構自動遞補。

### 文章和頁面該怎麼選擇？

經常更新、有時序性的內容用文章，例如最新消息或作品集；固定不常變動的內容用頁面，例如關於我們或聯絡資訊。兩者都可以個別設定是否開啟迴響（留言）。

### WordPress 外掛和佈景主題有什麼差別？

佈景主題負責網站的外觀與版面呈現，外掛則負責擴充功能，例如 SEO、表單或電商。兩者都可以在官網找到免費版本，也常有功能更完整的付費版本。

### 開發 WordPress 佈景需要會哪些技術？

主要是 PHP、HTML、CSS，以及 WordPress 的模板函式（Template Tags）。了解頁面層級結構的遞補規則，就能用最少的檔案組出完整的佈景。

## 參考資料

- WordPress Plugins 開發分享簡報下載（.pptx）（原下載連結已失效）

## 延伸閱讀

- [WordPress Plugins開發怎麼入門？我的佈景結構與外掛架構分享](/post/wordpress-plugins-development-overview)：同樣聚焦 WordPress、PHP，可接著比較不同情境的做法。
- [WordPress Plugin 開發入門：做出你的第一個 WordPress 外掛](/post/wordpress-first-plugin-development)：同樣聚焦 WordPress、PHP，可接著比較不同情境的做法。
- [PHP 讀取檔案的幾種方式比較](/post/php-file-reading-methods-comparison)：同樣聚焦 PHP，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2013-04-12，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};