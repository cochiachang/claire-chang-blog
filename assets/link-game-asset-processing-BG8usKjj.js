var e=`---
title: PixiJS 遊戲素材處理：Adobe Animate 匯出 SpriteSheet 與圖片集
description: 整理 PixiJS 遊戲素材處理流程，包含單張圖片、SpriteSheet、JSON frame 資料、4096 貼圖尺寸限制、Adobe Animate 匯出動畫與圖片集。
date: 2018-10-28
category: 前端開發
tags: [PixiJS, SpriteSheet, Adobe Animate, 遊戲開發, 連連看]
readingTime: 6 分鐘
image: /images/tech/link-game-asset-processing-character-laugh.png
imageAlt: Adobe Animate 匯出的角色笑聲動畫 SpriteSheet 圖片
---


# PixiJS 遊戲素材處理：Adobe Animate 匯出 SpriteSheet 與圖片集

PixiJS 遊戲素材處理的重點，是把 Adobe Animate 裡排好的 FLA 介面與動畫，轉成 PixiJS 可以載入的圖片、SpriteSheet 與 JSON 描述檔。連連看這類 H5 遊戲如果只用一張張圖片載入，request 數量會變多；把角色動畫與 UI 圖示整理成 SpriteSheet，會比較適合後續的 PixiJS Loader 與遊戲場景管理。

## PixiJS 可以使用哪些遊戲素材？

PixiJS 可以使用單張圖片、SpriteSheet 與 Spine 動畫素材。連連看小作品最適合先用單張圖片和 SpriteSheet，因為 Adobe Animate 可以直接輸出 JSON 與 PNG。

承上一篇介面設計，排好的 UI 介面最後會產出一個 FLA 檔案，但 FLA 檔案不能直接給 PixiJS 使用。PixiJS 需要的是瀏覽器能載入的素材，例如 PNG、JPG、GIF，或是由一張大圖搭配 JSON 描述檔組成的 SpriteSheet。

最基本的做法是使用單張圖檔。可是 HTTP/1.1 載入每個檔案時，都會額外處理 request 與 response header，檔案數量一多，下載速度就容易被拖慢。遊戲素材通常會偏好 SpriteSheet，也就是把很多張小圖合併成一張大圖，再由程式依座標切出需要的畫面。

PixiJS 也能搭配 [Spine 動畫範例](https://pixijs.io/examples/#/spine/dragon.js)，但 Spine 編輯軟體成本較高；這個連連看作品先用 Adobe Animate 匯出的 SpriteSheet 完成動畫素材。

## SpriteSheet 在 PixiJS 遊戲裡解決什麼問題？

SpriteSheet 把多張圖集中成一張貼圖，讓 PixiJS 用 JSON 的 frame 資料切出每一格。這種格式適合角色逐格動畫、按鈕狀態與 UI 圖示。

下面這個動畫由 10 張圖構成：

![角色笑聲動畫 GIF](/images/tech/link-game-asset-processing-animation.gif)

SpriteSheet 會把 10 張圖打包成一個 PNG 檔案：

![角色笑聲動畫 SpriteSheet](/images/tech/link-game-asset-processing-character-laugh.png)

同時，匯出工具會產生一個 JSON 檔案，記錄每一格動畫要從 PNG 的哪個位置裁切。簡化後的資料長得像這樣：

\`\`\`json
{
  "frames": {
    "0": {
      "frame": { "x": 0, "y": 0, "w": 109, "h": 74 },
      "rotated": false,
      "trimmed": true,
      "spriteSourceSize": { "x": 1, "y": 0, "w": 110, "h": 74 },
      "sourceSize": { "w": 110, "h": 74 }
    }
  },
  "meta": {
    "app": "Adobe Animate",
    "version": "15.1.1.13",
    "image": "Character_Laugh.png",
    "format": "RGBA8888",
    "size": { "w": 256, "h": 512 },
    "scale": "1"
  }
}
\`\`\`

JSON 裡的 \`"0"\` 是圖片 frame 的 id。之後在 PixiJS 裡要取得某個 SpriteSheet 的某一張圖，就會用這個 id 來辨識要取哪一格。Adobe Animate 匯出動畫時，會自動用 \`0\` 到 \`N\` 的流水號幫動畫影格編號。

## SpriteSheet 尺寸需要注意什麼？

SpriteSheet 尺寸不能只追求少檔案，還要考慮裝置能處理的最大貼圖尺寸。部分設備沒辦法處理超過 4096 的圖片，包圖時要保留安全範圍。

PixiJS 透過 WebGL 處理圖像時，GPU 很擅長矩陣運算；從同一張大圖裁切指定範圍，也能吃到 GPU 處理貼圖的優勢。不過大圖不是越大越好，因為瀏覽器與裝置支援的 \`MAX_TEXTURE_SIZE\` 不完全相同。

整理素材時，我參考過 [WebGL Stats 的 MAX_TEXTURE_SIZE 統計](https://webglstats.com/webgl2/parameter/MAX_TEXTURE_SIZE)。截圖裡可以看到，當時仍有不少設備無法支援 4096 以上尺寸的圖檔；即使現在裝置規格提升，行動裝置相容性仍然值得保守處理。

![WebGL Stats 的 MAX_TEXTURE_SIZE 支援狀況截圖](/images/tech/link-game-asset-processing-webgl-stats.png)

實作上，我會把 SpriteSheet 控制在 4096 以內，並依素材類型拆包：角色動畫一包、按鈕與 UI 圖示一包、關卡圖塊一包。這樣載入、除錯與替換素材都比較乾淨。

## Adobe Animate 如何匯出動畫連續圖？

Adobe Animate 匯出動畫 SpriteSheet 的流程，是在元件庫選取動畫元件，使用 Generate Sprite Sheet，並把資料格式設定成 JSON。

操作步驟很短：

1. 打開 Adobe Animate 的元件庫。
2. 點選要匯出的動畫元件。
3. 在元件上按右鍵。
4. 選擇最下方的 \`Generate Sprite Sheet\`。

![Adobe Animate 元件庫中的 Generate Sprite Sheet 選單](/images/tech/link-game-asset-processing-generate-sprite-sheet-menu.png)

接著會跳出設定頁面。這次的設定是 \`Algorithm\` 選 \`Basic\`，\`Data format\` 選 \`JSON\`，確認輸出位置後按下 \`Export\`，就會得到 PixiJS 可以搭配載入的 PNG 與 JSON。

![Adobe Animate 匯出動畫 SpriteSheet 設定頁面](/images/tech/link-game-asset-processing-animation-export-settings.png)

## Adobe Animate 如何匯出圖片集？

Adobe Animate 也可以一次把多個圖檔匯出成同一張圖片集。匯出圖片集前，先整理元件庫名稱，因為元件名稱會成為 JSON 裡的識別 id。

如果要把多個圖檔匯出到同一個圖片集，先在元件庫整理好每個元件的名稱。Adobe Animate 預設會用元件庫名稱作為 JSON 內的 id；名稱太隨便，之後在 PixiJS 程式裡取圖就會很難讀。

接著一次選擇多個要匯出的圖檔，按右鍵，選擇 \`Generate Sprite Sheet\`。

![Adobe Animate 選取多個元件匯出圖片集](/images/tech/link-game-asset-processing-multiple-assets-menu.png)

設定畫面左邊會列出即將輸出的 SpriteSheet 裡有哪些圖檔，以及每個圖檔的 id。右邊選項與動畫匯出相同，維持 \`Algorithm: Basic\`、\`Data format: JSON\` 即可。

![Adobe Animate 多圖匯出 SpriteSheet 設定頁面](/images/tech/link-game-asset-processing-multiple-assets-settings.png)

這一步最容易出錯的是 id 命名。我的習慣是用實際用途命名，例如 \`Button_Start\`、\`Icon_Hint\`、\`Character_Laugh\`，不要只留下 \`symbol1\`、\`bitmap2\` 這種匯入時的暫名。

## PixiJS 遊戲音效素材可以去哪裡找？

PixiJS 遊戲音效素材可以先從免費音效網站開始找，再交給 howler.js 載入與播放。素材處理階段要先把點擊、消除、錯誤與過關音效整理出來。

這個連連看作品的音效，我是在 [小森平的免費下載音效](https://taira-komori.jpn.org/freesoundtw.html) 找適合的聲音。音效不只是裝飾，按鈕點擊、消除成功、不能連線、時間到與過關，都需要不同聲音讓玩家知道發生了什麼事。

音效檔命名也要跟圖片素材一樣清楚。比起 \`sound01.mp3\`，\`button-click.mp3\`、\`match-success.mp3\`、\`match-failed.mp3\` 更容易在程式裡管理。後續載入 PixiJS 圖片素材時，可以搭配 howler.js 處理聲音；圖片和音效雖然用不同工具載入，但最好放在同一份素材清單裡追蹤。

## 連連看素材包最後應該包含哪些檔案？

連連看素材包至少要包含圖片 SpriteSheet、JSON frame 描述檔、單張背景或 UI 圖、音效檔與素材命名清單。素材整理清楚，後續 Loader 才不會到處補路徑。

最後打包好的素材集可以從這裡下載：[assets.zip](/uploads/2018/10/assets.zip)。

整理素材包時，我會檢查這幾件事：

| 檔案類型 | 範例 | 檢查重點 |
|---|---|---|
| 動畫 SpriteSheet | \`Character_Laugh.png\` | 尺寸不要超過目標裝置可承受範圍 |
| Frame JSON | \`Character_Laugh.json\` | \`frames\` id 是否能對應程式中的素材名稱 |
| UI 圖片集 | \`Icon.json\`、\`Button.json\` | 元件名稱是否可讀，避免暫名 |
| 單張圖片 | 背景、Logo、Loading 圖 | 是否需要獨立載入，或能併入圖片集 |
| 音效檔 | 點擊、消除、錯誤、過關 | 檔名是否能直接看出用途 |

這篇的資訊增益是素材包檢查表：先從 PixiJS 能否載入、裝置貼圖尺寸、JSON id 命名、音效用途四個角度檢查，再進到下一篇 Loader 實作，會比邊寫程式邊猜素材路徑穩很多。

## 常見問題

### PixiJS 一定要用 SpriteSheet 嗎？

PixiJS 不一定要用 SpriteSheet，單張圖片也可以建立 Sprite。只是遊戲素材一多，SpriteSheet 更容易減少 request 數量，也比較適合管理角色動畫與 UI 圖示。

### Adobe Animate 匯出的 JSON 裡 frame id 是什麼？

Adobe Animate 匯出的 JSON frame id 是 PixiJS 取用單一影格時的識別名稱。動畫影格通常會用 \`0\` 到 \`N\` 自動編號，多圖圖片集則常用元件庫名稱作為 id。

### SpriteSheet 為什麼要注意 4096 尺寸？

SpriteSheet 要注意 4096 尺寸，是因為部分裝置或瀏覽器無法處理更大的 WebGL 貼圖。包圖時把單張貼圖控制在 4096 以內，對行動裝置相容性比較保守。

### Adobe Animate 匯出 SpriteSheet 時 Data format 要選什麼？

Adobe Animate 匯出給 PixiJS 使用的 SpriteSheet 時，Data format 可以選 JSON。PixiJS 之後會依 JSON 裡的 frame 座標，從同一張 PNG 裡切出指定圖片。

### PixiJS 遊戲素材檔案應該怎麼命名？

PixiJS 遊戲素材檔案最好用用途命名，例如 \`Button_Start\`、\`Icon_Hint\`、\`Character_Laugh\`。清楚命名能讓 JSON id、Loader 清單與程式碼保持一致。

## 延伸閱讀

- [遊戲 UI 介面設計怎麼做？從需求清單、免費素材到完成遊戲畫面的實作流程](/post/game-dev-ui-design)：同樣聚焦 遊戲開發、連連看，可接著比較不同情境的做法。
- [連連看遊戲開發前言：從規則、益智遊戲定位到 PixiJS 製作規劃](/post/link-game-development-introduction)：同樣聚焦 PixiJS、遊戲開發，可接著比較不同情境的做法。
- [PixiJS 如何實作連連看盤面與消除邏輯](/post/pixi-link-game-board)：同樣聚焦 PixiJS、遊戲開發，可接著比較不同情境的做法。
`;export{e as default};