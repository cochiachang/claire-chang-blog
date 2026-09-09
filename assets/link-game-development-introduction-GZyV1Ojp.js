var e=`---
title: 連連看遊戲開發前言：從規則、益智遊戲定位到 PixiJS 製作規劃
description: 連連看遊戲開發前言，整理連連看規則起源、益智消除遊戲特色、PixiJS 與 TypeScript 製作 H5 遊戲的工具選型，以及 30 天教學規劃。
date: 2018-10-16
category: 前端開發
tags: [PixiJS, TypeScript, 遊戲開發, 連連看]
readingTime: 9 分鐘
image: /images/tech/hero_link-game-development-introduction.webp
imageAlt: 連連看遊戲開發規劃圖，呈現益智遊戲元素與 H5 遊戲製作方向
---


# 連連看遊戲開發前言：從規則、益智遊戲定位到 PixiJS 製作規劃

連連看遊戲開發的核心不是先畫出漂亮畫面，而是先把「兩張圖能不能在最多兩次轉折內連線消除」這件事拆成資料結構、路徑判斷與互動流程。本篇整理連連看遊戲的來源、益智消除遊戲的定位，以及用 PixiJS、TypeScript、npm、gulp、GSAP、howler 做 H5 遊戲的 30 天開發規劃。

## 連連看遊戲的基本規則是什麼？

連連看是一種配對消除型益智遊戲。玩家要找出可成對的圖案或內容，若兩個目標能依規則連線，就可以把該組目標從盤面上消除。

遊戲《連連看》顧名思義，就是找出相關聯的東西連起來，做關聯配對的一種益智遊戲。連連看最早使用在幼兒教育教具上，因為玩法簡單，常用作兒童啟蒙教育遊戲，建立兒童對物品之間的關聯性。

有一種字圖連連看，專供幼童識字認圖。字圖連連看與一般連連看不同，不是用兩張相同圖案配對，而是用文字與圖片成對。相關內容連連看則以兩張內容相關的卡片配成對，卡片可以是字，也可以是圖。

![服裝名詞連連看教具](/images/tech/link-game-development-introduction-01.webp)

## 連連看從桌面遊戲到電腦遊戲如何演變？

連連看從實體卡片配對遊戲，逐步演變成電腦小遊戲與線上社交遊戲。電腦版連連看加入路徑判斷，讓消除規則比單純翻牌更像演算法問題。

桌面遊戲形式的連連看，早期常見玩法是一副卡片中每種圖案有相同的兩張。玩家先洗牌、排好卡片，背面朝上，輪流揭開卡片。每次揭兩張，兩張圖案不同就蓋回去；兩張圖案相同就取走。桌上所有卡片都取走時，手上最多卡片者獲勝。

![桌面卡片配對遊戲](/images/tech/link-game-development-introduction-02.webp)

隨著電腦普及，連連看遊戲也成為經典電腦小遊戲。電腦遊戲中的常見規則是：找到兩幅相同圖案後，若能用三條以內的直線將兩幅圖案連接起來，分別點一下兩幅圖案即可消除。這條規則會把畫面操作轉成路徑搜尋問題，也就是後續開發時最重要的遊戲邏輯。

連連看電腦版最初由台灣的陳一進和簡誠志，從街機裡的 [四川省（四川麻將）](https://zh.wikipedia.org/wiki/%E5%9B%9B%E5%B7%9D%E7%9C%81_(%E9%81%8A%E6%88%B2)) 與 [中國龍](https://zh.wikipedia.org/wiki/%E4%B8%AD%E5%9B%BD%E9%BE%99) 改進、移植到 PC 上，後來出現各種不同版本。

![四川省遊戲畫面](/images/tech/link-game-development-introduction-03.webp)

台灣的連連看流入大陸後風靡一時，也吸引許多程式師開發不同版本，其中 kawai 開發的《寵物連連看》受到很大歡迎。隨著 Flash 應用流行，網路上也出現水晶連連看、果蔬連連看、阿達連連看等線上 Flash 版本。2008 年，連連看被引入社交網站，與個人空間結合，快速傳播成熱門社交遊戲。

## 連連看屬於哪一種益智遊戲？

連連看屬於消除型益智遊戲。消除型益智遊戲要求玩家找出盤面規則，透過配對、排列或連線消除目標，達成過關條件。

益智遊戲可以是一人玩家，也可以是多人對戰。益智遊戲要求玩家用自己的智慧解決遊戲中的難題，達到過關目的。新的商業遊戲通常會加上動作要素，讓玩家手腦並用，訓練協調性；經典代表包含俄羅斯方塊、泡泡龍系列、憤怒鳥、Candy Crush，以及曾經很紅的 2048。

傳統益智遊戲以動腦為主，例如數獨、推箱子。這類遊戲對玩家而言較難過關，也容易讓大量玩家中途放棄。

俄羅斯方塊是落下型遊戲始祖，由阿列克謝·帕基特諾夫在蘇聯設計和編寫。俄羅斯方塊除了成為熱門家用電腦與街機遊戲，也成為 Game Boy 史上最受歡迎的遊戲之一。

![俄羅斯方塊遊戲畫面](/images/tech/link-game-development-introduction-04.webp)

## 消除型遊戲為什麼適合手機與社交平台？

消除型遊戲適合手機與社交平台，原因在於規則容易理解、單局時間短、操作負擔低。手機版面有限時，配對與消除比複雜 RPG 或動作操作更容易上手。

許多後來的益智遊戲結合消除型與落下型遊戲特色，利用落下隨機元素增加變化，並加入特殊道具提高趣味性。Candy Crush 就是一個典型例子。Candy Crush 與連連看同樣屬於消除遊戲，三個相同顏色方塊可以互相消除，並隨機落下新的不同顏色方塊；特殊消除模式還能產生特殊道具。

![Candy Crush 消除遊戲畫面](/images/tech/link-game-development-introduction-05.webp)

後來的神魔之塔、Dragon Puzzle 結合角色扮演、卡牌遊戲與線上對戰，讓益智型遊戲的樣貌更多元。植物大戰殭屍則加入即時戰略遊戲與卡牌遊戲特色，讓益智型遊戲的面向繼續擴張。

不同遊戲中包含的遊戲性元素，可以整理成下圖這樣的比較：

![不同遊戲包含的遊戲性元素](/images/tech/link-game-development-introduction-06.webp)

因為手機版面限制與操作便利性，益智遊戲比傳統 RPG 或動作遊戲更容易在手機市場取得優勢。後期益智遊戲也越來越常加入卡牌元素、即時戰略元素、操作手感設計與線上多人模式，讓遊戲趣味性與玩家黏著度提高。

## 設計有趣的益智遊戲時，演算法為什麼重要？

益智遊戲的演算法決定玩家是否覺得規則直覺。連連看尤其依賴路徑判斷、盤面生成、提示功能與關卡條件，邏輯錯誤會直接破壞遊戲體驗。

設計一款有趣的益智遊戲，演算法設計很重要。例如物理遊戲的物理公式、相消遊戲的消除條件、每個關卡的過關條件、道具設計、遊戲競爭性，都會影響玩家是否覺得好玩。

我的判斷是，這些設計越符合玩家對自然規則的直覺，玩起來越順。開發大型遊戲時，美術、音效、程式、企劃缺一不可；對程式開發者來說，學習適合的語言與工具也同樣重要。

| 遊戲設計項目 | 對連連看開發的影響 |
|---|---|
| 消除條件 | 決定兩張圖是否能配對並移除 |
| 路徑判斷 | 判斷兩點之間是否能用最多兩次轉折連線 |
| 盤面生成 | 影響每一局是否有解、是否公平 |
| 道具設計 | 可延伸提示、洗牌、復原等功能 |
| 美術與音效 | 讓消除、連線與過關回饋更明確 |

## 這個連連看系列會怎麼規劃開發主線？

連連看系列的主線是遊戲邏輯分析與程式碼撰寫。開發目標是用陣列儲存盤面，並正確判斷兩個圖形之間是否存在最多兩次轉折的連線。

這次鐵人賽主題主要分為兩條教學線。主線是連連看遊戲邏輯分析與程式碼撰寫，目標是寫出正確邏輯：能判別兩個圖形間是否存在小於兩個轉彎處的連線，也能隨機產生遊戲牌面，並以陣列儲存目前盤面資料。

副線是使用 [PixiJS](https://pixijs.com/) 實際開發一款有畫面、效果與音效，真正具有遊戲性的 H5 網頁遊戲。PixiJS 是一款 2D HTML5 遊戲渲染引擎，可以利用 WebGL 做 2D 圖像處理，因此在網頁上有不錯的效能表現。

在語言選擇上，我採用 PixiJS 的 TypeScript 開發方式，考量是開發容易度、順暢度，以及不同 JavaScript 版本的相容性。套件管理使用 [npm](https://www.npmjs.com/)，自動化管理工具使用 [gulp](https://gulpjs.com/)。

## PixiJS H5 遊戲製作需要哪些工具？

PixiJS H5 遊戲製作除了渲染引擎，還需要素材、動畫、音效、套件管理與除錯工具。這些工具各自處理一塊工作，合起來才會形成完整遊戲開發流程。

美術素材來源上，我到 [Unity Asset Store](https://assetstore.unity.com/) 尋找並下載免費素材。遊戲畫面設計與圖片動畫處理，則使用 [Adobe Animate](https://www.adobe.com/products/animate.html) 繪圖並產生連續圖檔，功能類似 [TexturePacker](https://www.codeandweb.com/texturepacker)。動態效果使用 [GSAP](https://gsap.com/) 的 Tween 工具實作。

音效部分，我使用免費音效素材庫尋找適合的效果音；程式上的音效載入與播放管理，則使用 [howler.js](https://howlerjs.com/)。背景音樂部分，使用 [YouTube Audio Library](https://www.youtube.com/audiolibrary/) 尋找並下載適合的音樂。

IDE 部分，我使用 VS Code 開發，搭配 PixiJS devtools 與 Chrome DevTools 做除錯、測試和畫面檢查。

## 30 天連連看開發教學會涵蓋哪些項目？

30 天教學規劃分成演算法、環境設定、遊戲邏輯、PixiJS 製作、效果與效能工具。這樣安排能先讓規則跑對，再逐步補上畫面、音效與手機測試。

連連看邏輯教學項目規劃如下：

![連連看邏輯教學項目](/images/tech/link-game-development-introduction-07.webp)

H5 遊戲製作教學項目規劃如下：

![H5 遊戲製作教學項目](/images/tech/link-game-development-introduction-08.webp)

預計 30 天內容如下，實作時可能隨實際情況調整：

\`\`\`text
[1 - 前言] 連連看遊戲開發
[2 - 演算法] 演算法介紹
[3 - 環境設定] 開發環境介紹
[4 - 遊戲邏輯] 產生初始盤面
[5 - 遊戲邏輯] 圖形連線消除邏輯發想
[6 - 遊戲邏輯] 連線消除程式撰寫
[7 - 遊戲邏輯] 電腦搜尋路徑
[8 - 遊戲介紹] 遊戲歷史簡介
[9 - 遊戲介紹] 遊戲開發技術介紹
[10 - 遊戲製作] PixiJS 介紹
[11 - 遊戲製作] 使用模組介紹
[12 - 遊戲製作] 介面設計
[13 - 遊戲製作] 素材處理
[14 - Pixi 教學] PIXI 場景設定
[15 - Pixi 教學] 載入素材
[16 - Pixi 教學] 與網頁互動：控制 loading page
[17 - Pixi 教學] 音樂音效設定
[18 - Pixi 教學] 按鈕製作
[19 - Pixi 教學] 連連看盤面實作
[20 - Pixi 教學] 連連看公仔實作
[21 - Pixi 教學] 連線效果實作：Graphics
[22 - Pixi 教學] 按鈕動態：Tween
[23 - Pixi 教學] 復原按鈕功能實作
[24 - Pixi 教學] 提示按鈕功能實作
[25 - Pixi 教學] 遊戲開始、結束與過關設定
[26 - Pixi 教學] 遊戲功能完成
[27 - Pixi 教學] 連線消除效果：Particles
[28 - 相關工具] PixiJS devtools
[29 - 相關工具] 效能評估工具
[30 - 相關工具] 手機遠程測試
\`\`\`

## 常見問題

### 連連看遊戲開發最重要的邏輯是什麼？

連連看遊戲開發最重要的邏輯是路徑判斷。程式需要判斷兩個相同圖形之間是否能用最多兩次轉折連線，並確認路徑中間沒有其他圖形阻擋。

### 連連看適合用 PixiJS 開發嗎？

連連看適合用 PixiJS 開發，因為連連看主要是 2D 圖塊、動畫、點擊互動與消除效果。PixiJS 負責高效能渲染，遊戲規則則可以用 TypeScript 類別另外管理。

### 為什麼連連看需要用陣列儲存盤面？

連連看需要用陣列儲存盤面，因為每一格圖形的位置、是否已消除、是否可連線，都要能被程式快速查詢。二維陣列也很適合對應棋盤式畫面。

### 開發 H5 連連看遊戲需要哪些前端工具？

開發 H5 連連看遊戲可以使用 PixiJS 處理 2D 渲染、TypeScript 撰寫遊戲邏輯、npm 管理套件、gulp 做自動化流程、GSAP 處理 Tween 動畫、howler.js 管理音效。

### 消除型益智遊戲為什麼容易流行？

消除型益智遊戲規則直覺、操作簡單、單局時間短，很適合手機與社交平台。玩家不需要長時間學習複雜操作，就能快速得到消除、過關與分數回饋。

## 參考資料

- Wikipedia：四川省（遊戲）：<https://zh.wikipedia.org/wiki/%E5%9B%9B%E5%B7%9D%E7%9C%81_(%E9%81%8A%E6%88%B2)>
- Wikipedia：中國龍：<https://zh.wikipedia.org/wiki/%E4%B8%AD%E5%9B%BD%E9%BE%99>
- Wikipedia：植物大戰殭屍：<https://zh.wikipedia.org/wiki/%E6%A4%8D%E7%89%A9%E5%A4%A7%E6%88%98%E5%83%B5%E5%B0%B8>
- Wikipedia：即時戰略遊戲：<https://zh.wikipedia.org/wiki/%E5%8D%B3%E6%97%B6%E6%88%98%E7%95%A5%E6%B8%B8%E6%88%8F>
- Wikipedia：益智遊戲：<https://zh.wikipedia.org/wiki/%E7%9B%8A%E6%99%BA%E6%B8%B8%E6%88%8F>
- Wikipedia：Candy Crush Saga：<https://zh.wikipedia.org/wiki/Candy_Crush_Saga>
- Wikipedia：俄羅斯方塊：<https://zh.wikipedia.org/wiki/%E4%BF%84%E7%BE%85%E6%96%AF%E6%96%B9%E5%A1%8A>
- PixiJS 官方網站：<https://pixijs.com/>
- npm 官方網站：<https://www.npmjs.com/>
- gulp 官方網站：<https://gulpjs.com/>
- Unity Asset Store：<https://assetstore.unity.com/>
- Adobe Animate：<https://www.adobe.com/products/animate.html>
- TexturePacker：<https://www.codeandweb.com/texturepacker>
- GSAP：<https://gsap.com/>
- howler.js：<https://howlerjs.com/>
- YouTube Audio Library：<https://www.youtube.com/audiolibrary/>

## 延伸閱讀

- [PixiJS 連連看遊戲開始、結束與過關畫面教學](/post/pixijs-link-game-start-end-clear-screens)：同樣聚焦 PixiJS、TypeScript，可接著比較不同情境的做法。
- [PixiJS 提示與重整按鈕教學：連連看遊戲功能實作](/post/pixijs-hint-refresh-buttons-link-game)：同樣聚焦 PixiJS、TypeScript，可接著比較不同情境的做法。
- [PixiJS 連連看完整功能實作：倒數計時、生命值與 FB 按鈕](/post/pixijs-link-game-complete-implementation)：同樣聚焦 PixiJS、TypeScript，可接著比較不同情境的做法。

## 最後更新

2018-10-16；本篇依 2018 年連連看開發系列前言整理，保留當時的遊戲開發規劃並補上 GEO 結構。
`;export{e as default};