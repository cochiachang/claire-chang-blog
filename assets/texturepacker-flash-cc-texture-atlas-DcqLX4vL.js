var e=`---
title: 產生TextureAtlas素材的方式
description: 介紹用 TexturePacker 或 Flash CC 兩種方式產生 Starling/Sprite Sheet 用的 TextureAtlas 素材。
date: 2014-02-12
category: 前端開發
tags: [ActionScript, Starling, AIR, TexturePacker, App開發]
readingTime: 4 分鐘
image: /images/tech/texturepacker-settings.webp
imageAlt: TexturePacker 匯出設定視窗畫面
---


# 產生TextureAtlas素材的方式

做 Starling 動畫時，圖檔一張一張載入太慢，也很難做逐格動畫，這時候就需要把多張 png 打包成一張 TextureAtlas（貼圖集）。這裡整理兩種常用的產生方式：用 TexturePacker 軟體，或直接用 Flash CC 內建的匯出功能。

## TexturePacker 怎麼用來產生 TextureAtlas？

TexturePacker（[官網](http://www.codeandweb.com/texturepacker)）是專門把多張 png 打包成一張 Sprite Sheet 的工具，也是做 Starling 動畫最常用的方式。使用前要先把素材準備好：

- 如果是連續動畫的圖檔，檔名尾端要加上四位數字，例如 \`woman0001.png\`～\`woman0028.png\`。
- 如果只是單一張圖，不需要加數字後綴。

準備好之後，在 TexturePacker 裡把這批圖丟進去打包，操作時最重要的一步是把 **Data Format 選成 Sparrow/Starling**，這樣輸出的 xml 才能被 Starling 的 TextureAtlas 正確讀取。

打包完成後，取圖時只要用檔名的共同前置詞就能一次取出整組動畫幀，例如本範例用 \`woman\` 當前置詞：

\`\`\`java
var woman:MovieClip = new MovieClip(atlas.getTextures("woman"), 30);
\`\`\`

\`getTextures("woman")\` 會把所有以 woman 開頭的貼圖依檔名排序抓出來，直接組成一個 MovieClip，第二個參數 30 是影格速率（fps）。

## 如何免費申請 TexturePacker 序號？

到 [免費序號申請單](http://www.codeandweb.com/request-free-license) 填表，如果自己有經營部落格，可以申請免費的開發者授權。這是我自己申請時的實際經驗：填完表之後，TexturePacker 開發團隊寄了序號給我，而且是真人回信，不是罐頭自動信：

> Hi Claire,
>
> Here's your license key for TexturePacker: TP-xxxxxxxxxxxxxxxx
> I've added a license for PhysicsEditor (see file attached) in case you might want to try it too ;-)
> Nice blog! I would be happy to get a (short) blog post in return.
> In case you do a tutorial post about my tools I can link back to your blog from the tutorials section on my page. That might give you some more visitors on your page!
>
> Kind regards, Kerstin on behalf of Andreas

後來因為我先寫了 Starling 系列教程，遲遲沒空生 TexturePacker 的介紹文，過一陣子他們還主動寄信來關心使用狀況：

> Dear Claire,
>
> I sent you a blogger license for TexturePacker some time ago, and I am curious how you like the program. Did you get it running successfully? Or do you need some assistance? I would be happy to get a (short) blog post in return.
>
> Kind regards, Kerstin on behalf of Andreas

一套工具的開發團隊願意人工回信、還記得回頭關心使用者，這在小型獨立軟體裡不算常見，也是我後來一直推薦 TexturePacker 的原因之一。

![TexturePacker 匯出設定視窗，Data Format 需選擇 Sparrow/Starling](/images/tech/texturepacker-settings.webp)

## Flash CC 可以直接匯出 TextureAtlas 嗎？

可以。Flash CC 跟之前版本最大的差異，就是終於能把元件庫（Library）裡的元件直接匯出成貼圖素材，不用再另外靠外部工具轉檔。

作法是在元件庫裡對元件按右鍵，選擇匯出方式：

- 匯出成一連串的 png（每格動畫各一張圖）
- 直接匯出成一張 Sprite Sheet

而且可以同時勾選多個元件，一次打包進同一張 Sprite Sheet 裡，不用像早期那樣一個一個手動處理。詳細操作步驟可以參考 Adobe 官方教學：Sprite Sheets in Flash Professional CS6（原文已下架）。

![Flash CC 元件庫右鍵選單，可選擇匯出成 png 序列或 Sprite Sheet](/images/tech/flashcc-export-menu.webp)

![Flash CC 匯出 Sprite Sheet 的設定視窗](/images/tech/flashcc-spritesheet-export.webp)

## TexturePacker 跟 Flash CC 匯出，該選哪一種？

兩種方式解決的是同一個問題，但適合的情境不太一樣：

| 比較項目 | TexturePacker | Flash CC 內建匯出 |
|---|---|---|
| 素材來源 | 外部準備好的 png 序列 | Flash 元件庫裡的元件 |
| 額外費用 | 需序號（可申請免費開發者授權） | 已含在 Flash CC 授權內 |
| 排版最佳化 | 有專門的自動排版演算法，圖集空間利用率高 | 陽春，元件多時排版效率較差 |
| 適合情境 | 素材由美術獨立產出、跨專案共用 | 動畫元件本來就在 Flash 專案裡製作 |

如果動畫本來就是在 Flash 裡刻的，用 Flash CC 直接匯出最省事；如果素材是外部美術給的一批 png，或需要更緊密的貼圖排版，TexturePacker 仍然是比較穩的選擇。

## 常見問題

### TexturePacker 的免費序號怎麼申請？

到官方的 [免費序號申請單](http://www.codeandweb.com/request-free-license) 填寫部落格資訊送出即可，審核後會用真人 email 回覆序號。

### Data Format 一定要選 Sparrow/Starling 嗎？

如果目標是給 Starling 引擎讀取貼圖集，就一定要選 Sparrow/Starling 格式，這樣輸出的 xml 描述檔才符合 Starling 的 TextureAtlas 讀取規則；其他遊戲引擎則要選對應的格式。

### 連續動畫圖檔的檔名規則是什麼？

檔名尾端加四位數字，例如 \`woman0001.png\`～\`woman0028.png\`，之後用共同前置詞（如 \`woman\`）就能一次取出整組動畫幀。


## 參考資料

CodeAndWeb GmbH，TexturePacker 官方文件，說明 Sparrow/Starling 等資料格式與 texture atlas 產生流程，存取日期：2026-08-27。[https://www.codeandweb.com/texturepacker/documentation](https://www.codeandweb.com/texturepacker/documentation)

## 延伸閱讀

- [Starling Display Objects：Button 與 Sprite 實作重點](/post/starling-display-objects-button-sprite)：同樣聚焦 Starling、ActionScript，可接著比較不同情境的做法。
- [Starling Display Objects 介紹：Starling 啟動、物件樹與 Stage](/post/starling-display-objects-introduction)：同樣聚焦 Starling、ActionScript，可接著比較不同情境的做法。
- [Starling MovieClip 動畫：用 Juggler 驅動影格播放](/post/starling-movieclip-juggler-animation)：同樣聚焦 Starling、ActionScript，可接著比較不同情境的做法。
`;export{e as default};