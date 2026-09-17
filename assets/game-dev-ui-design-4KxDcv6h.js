var e=`---
title: 遊戲 UI 介面設計怎麼做？從需求清單、免費素材到完成遊戲畫面的實作流程
description: 我如何為連連看遊戲規劃 UI 介面設計：列出功能需求、用 Unity Asset Store 找免費美術素材、以 Adobe Animate 繪製遊戲畫面，一步步完成遊戲介面 mockup 與實作。
date: 2018-10-27
category: 前端開發
tags: [遊戲開發, UI 設計, 連連看, Adobe Animate, Unity Asset Store]
readingTime: 4 分鐘
image: /images/tech/hero_game-dev-ui-design.webp
imageAlt: 色彩繽紛的方塊與圓形遊戲元素排版，象徵遊戲介面設計
---


# 遊戲 UI 介面設計怎麼做？從需求清單、免費素材到完成遊戲畫面的實作流程

做遊戲時，程式邏輯之外最容易被低估的就是介面設計。這篇文章記錄我為連連看遊戲做 UI 介面設計的完整流程：先列功能需求與版面配置，再替不會美術的自己找免費素材，最後用 Adobe Animate 把遊戲畫面畫出來。

## 連連看遊戲需要哪些介面功能？

動手畫 mockup 之前，我先把自己規劃的連連看應有的功能列成一份需求清單：

- **時間限制**：需要在 8 分鐘內完成遊戲，否則就算是沒有過關。
- **重整牌面的限制**：最多只能重整牌面 3 次，每次耗 1 點生命，生命值耗光遊戲就結束了。
- **音樂、音效**需能開或關。
- **重新整理牌面**：可以手動洗牌。
- **提示**：提示可連線的路徑。
- **復原**：還原已消除的圖案。
- **可連到我的 FB**。

把規則數字（8 分鐘、3 次重整、1 點生命）先定下來很重要——這些數字會直接決定 UI 上要放哪些資訊元件：計時器、生命值、重整次數。

依照這份需求，我畫出了整個遊戲的版面配置 mockup：

![連連看遊戲版面配置 mockup，包含牌面區、計時器、生命值與功能按鈕](/images/articles/game-dev-ui-design-1.webp)

## 不會美術的程式設計師去哪找免費遊戲素材？

有了 mockup 之後，身為一個不會美術的程式設計師，鐵人賽又沒有美術可以幫忙，最重要的就是去尋找免費素材。這時候就要大推 [Unity Asset Store](https://assetstore.unity.com/)——它不只有 Unity 用的 3D 模型，也有大量可以直接拿來改用的 2D 免費素材包。

![Unity Asset Store 網站首頁](/images/articles/game-dev-ui-design-2.webp)

很快地我選擇了 **Free Platform Game Assets** 這款免費素材來做我連連看的基本素材。下載流程是這樣：

1. 先登入網站，然後在素材頁按下取得按鈕：

![Unity Asset Store 素材頁的取得按鈕](/images/articles/game-dev-ui-design-3.webp)

2. 接著要在電腦裡安裝 Unity，安裝好之後，再按「Open in Unity」：

![Unity Asset Store 的 Open in Unity 按鈕](/images/articles/game-dev-ui-design-4.webp)

3. 接著就會在 Unity 內開啟這個素材的網頁畫面：

![在 Unity 內開啟的 Asset Store 素材頁面](/images/articles/game-dev-ui-design-5.webp)

4. 按下 Import 後，這包素材就會被下載至你剛剛所建的 Unity 專案下的資料夾裡，按右鍵就可以在一般的資料夾找到所下載的素材：

![Unity 專案中 Import 後的素材資料夾](/images/articles/game-dev-ui-design-6.webp)

就算最後遊戲不是用 Unity 開發（我後來是用 PixiJS 做），Asset Store 的素材仍然是通用的圖檔，取出 PNG 直接放進自己的專案就能用。

## 如何用 Adobe Animate 繪製遊戲介面？

畫面的繪製我是使用 Adobe Animate。Adobe Animate（前稱 Adobe Flash Professional、Macromedia Flash、FutureSplash Animator）是由 Adobe Systems 開發的多媒體創作和電腦動畫程式，可用於設計向量圖形和動畫，並發布到網站、網路應用程式和電子遊戲中。對習慣 Flash 時代工作流的人來說，它的圖層、元件與時間軸概念非常適合拿來切遊戲 UI。

這是我製作完成的遊戲畫面：

![以 Adobe Animate 繪製完成的連連看遊戲介面](/images/articles/game-dev-ui-design-7.webp)

介面繪製完成後，把各個 UI 元件（按鈕、牌面、計時器）匯出成圖檔，就能進到程式端接上 PixiJS 的場景與互動邏輯。

## 常見問題

### 做遊戲 UI 前，為什麼要先列功能需求清單？

因為 UI 上每一個元件都對應一個功能：有時間限制才需要計時器、有生命值機制才需要血量顯示。先定好規則數字，版面配置才有依據，不會畫到一半發現少了元件要重排版。

### 不會美術的程式設計師要去哪裡找免費遊戲素材？

Unity Asset Store 是很方便的來源，裡面有大量免費的 2D/3D 素材包。即使你的遊戲不用 Unity 開發，也可以透過 Unity 把素材包下載下來，直接取出裡面的 PNG 圖檔使用。

### 找到的素材如何下載到本機？

在 Asset Store 登入後對素材按下取得，安裝 Unity 後用「Open in Unity」在 Unity 內開啟素材頁，按下 Import 就會下載到 Unity 專案的資料夾，再從資料夾取出圖檔即可。

### 現在從 Unity Asset Store 拿素材還需要安裝 Unity 嗎？

不一定了。Asset Store 改版後，大多數素材可以直接在網頁上按「Add to My Assets」再加入帳號，並透過官網下載素材包；就算走 Unity 流程，現在開 Unity 時也會在 Package Manager 的「My Assets」裡直接下載匯入。只有少數舊素材才一定得開 Unity 匯入。反正最後要的只是裡面的 PNG 圖檔，哪種方式拿得到檔案都行。

### Adobe Animate 適合用來做遊戲介面嗎？

適合，尤其是向量圖形與動畫需求高的 2D 遊戲 UI。它延續 Flash 時代的圖層、元件與時間軸操作，畫按鈕、排場景都很順手，完成的介面還能進一步做動態效果。

### 這篇的連連看後來用什麼技術實作？

介面繪製完成後，我以 PixiJS 這套 2D WebGL 引擎實作遊戲邏輯，包含盤面生成、連線消除判斷，以及提示、重整、復原等按鈕功能，可參考延伸閱讀的系列文章。

## 參考資料

- [Unity Asset Store](https://assetstore.unity.com/)
- [Free Platform Game Assets 素材原始檔（ui.fla）](（原始 .fla 素材檔已隨舊站下線，改用 Unity Asset Store 免費素材）)

## 延伸閱讀

- [PixiJS 遊戲素材處理：Adobe Animate 匯出 SpriteSheet 與圖片集](/post/link-game-asset-processing)：同樣聚焦 Adobe Animate、遊戲開發，可接著比較不同情境的做法。
- [連連看遊戲開發前言：從規則、益智遊戲定位到 PixiJS 製作規劃](/post/link-game-development-introduction)：同樣聚焦 遊戲開發、連連看，可接著比較不同情境的做法。
- [PixiJS 提示與重整按鈕教學：連連看遊戲功能實作](/post/pixijs-hint-refresh-buttons-link-game)：同樣聚焦 遊戲開發、連連看，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2018-10-27，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};