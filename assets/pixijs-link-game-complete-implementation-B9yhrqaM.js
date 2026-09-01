var e=`---
title: PixiJS 連連看完整功能實作：倒數計時、生命值與 FB 按鈕
description: 說明 PixiJS 連連看遊戲如何補上倒數計時、重整生命值、FB 按鈕，並把 Clock、Stars、FBBtn 掛進 GameScene。
date: 2018-11-10
category: 前端開發
tags: [PixiJS, TypeScript, 遊戲開發, 連連看]
readingTime: 7 分鐘
image: /images/tech/pixijs-link-game-complete-implementation-result.png
imageAlt: PixiJS 連連看遊戲完成倒數計時、生命值與 FB 按鈕後的畫面
---


# PixiJS 連連看完整功能實作：倒數計時、生命值與 FB 按鈕

PixiJS 連連看遊戲要從可玩原型變成完整畫面，至少要補上倒數計時、重整次數限制與外部連結按鈕。這篇延續前面的連連看實作，把 \`Clock\`、\`Stars\`、\`FBBtn\` 三個 UI 元件分別拆成 TypeScript 類別，最後掛到 \`GameScene\` 的 stage。

## 完整遊戲畫面還缺哪些功能？

PixiJS 連連看遊戲在盤面、消除、提示與重整完成後，還需要時間、生命值與社群按鈕。這三個元件都屬於遊戲 UI，適合獨立成類別再放進場景。

前一版成果和 mockup 相比，主要缺口是左上角的時間倒數、重整可用次數，以及左下角的 FB 按鈕。

![PixiJS 連連看 mockup 中尚未完成的時間、生命值與 FB 按鈕](/images/tech/pixijs-link-game-mockup-before-complete.png)

拆成元件後，\`GameScene\` 不必知道每個 UI 的內部狀態。\`Clock\` 負責時間，\`Stars\` 負責重整次數，\`FBBtn\` 負責外部連結與音效；場景只處理「把元件放進遊戲」。

## Clock 如何實作 PixiJS 倒數計時？

PixiJS 倒數計時可以用 \`setInterval\` 每秒更新 \`PIXI.Text\`，時間歸零時送出遊戲結束事件。重新開局時，\`Clock\` 需要把秒數與畫面文字重設。

新增 \`Clock.ts\`，內容如下：

\`\`\`ts
import Container = PIXI.Container;
import { Loader } from "../core/Loader";
import { reloadTimes } from "./GameBoard";
import { eventEmitter } from "../Main";
import { GameFlowEvent } from "../core/Event";

export class Clock extends Container {
    private starList = [];
    private remainTimes:number = 480;
    private remainText:PIXI.Text;
    private clockInterval:any;
    constructor() {
        super();
        this.x = 18;
        this.y = 17;

        this.addChild(PIXI.Sprite.from(Loader.resources['Button'].textures['Clock']));

        eventEmitter.on(GameFlowEvent.CreateNewGameRequest, ()=>{
            this.remainTimes = 480;
            this.remainText.text = "8:00";
        });
        this.remainText = new PIXI.Text("8:00", {
            fontWeight: 'bold',
            fontSize: 20,
            fontFamily: 'Arial',
            fill: '#75C6ED',
            align: 'center',
            stroke: '#FFFFFF',
            strokeThickness: 6
        });
        this.remainText.x = 36;
        this.addChild(this.remainText);
        this.clockInterval = setInterval(this.updateTime.bind(this), 1000);
    }

    public updateTime(){
        this.remainTimes --;
        if(this.remainTimes == 0){
            clearInterval(this.clockInterval);
            eventEmitter.emit(GameFlowEvent.GameEndWithTimeout);
        }
        this.remainText.text = Math.floor(this.remainTimes/60)+':'+((this.remainTimes%60 < 10) ? "0":"")+this.remainTimes%60;
    }
}
\`\`\`

這段實作把初始時間設為 480 秒，也就是 8 分鐘。\`remainText\` 用 \`PIXI.Text\` 顯示在時鐘圖片旁邊，\`updateTime()\` 每秒扣一秒，並用 \`Math.floor(this.remainTimes / 60)\` 與 \`this.remainTimes % 60\` 組出 \`分:秒\`。

實作時有一個小地方可以補強：\`Clock.ts\` 匯入了 \`reloadTimes\`，但倒數計時沒有使用這個變數。整理程式碼時可以刪掉這個 import，避免之後誤以為時間元件和重整次數有耦合。

## Stars 如何顯示重整次數限制？

PixiJS 重整次數限制可以用星星圖示呈現。\`Stars\` 讀取 \`reloadTimes\`，依剩餘次數顯示 \`Star_Full\` 或 \`Star_Empty\`，並在重整或重新開局事件後更新畫面。

新增 \`Stars.ts\`，內容如下：

\`\`\`ts
import Container = PIXI.Container;
import { Loader } from "../core/Loader";
import { reloadTimes } from "./GameBoard";
import { eventEmitter } from "../Main";
import { GameFlowEvent } from "../core/Event";

export class Stars extends Container {
    private starList = [];
    constructor() {
        super();
        this.x = 20;
        this.y = 78;
        this.updateStarStatus();
        eventEmitter.on(GameFlowEvent.ReloadBoardRequest, this.updateStarStatus.bind(this));
        eventEmitter.on(GameFlowEvent.BoardNeedReload, this.updateStarStatus.bind(this));
        eventEmitter.on(GameFlowEvent.CreateNewGameRequest, this.updateStarStatus.bind(this));
    }

    updateStarStatus = ()=>{
        this.removeChildren();
        for(var i =0;i<3;i++){
            let star:any;
            if(i<reloadTimes){
                star = PIXI.Sprite.from(Loader.resources['Button'].textures['Star_Full']);
            }else{
                star = PIXI.Sprite.from(Loader.resources['Button'].textures['Star_Empty']);
            }
            star.x = i*33;
            this.starList.push(star);
            this.addChild(star);
        }
    }
}
\`\`\`

\`Stars\` 的畫面邏輯很單純：先 \`removeChildren()\` 清空舊星星，再依固定 3 顆星重新畫一次。當 \`reloadTimes\` 變少，前面的星星維持滿星，後面的星星改成空星。

事件設計上，\`ReloadBoardRequest\`、\`BoardNeedReload\`、\`CreateNewGameRequest\` 都會觸發 \`updateStarStatus()\`。這代表玩家手動重整、系統判斷盤面需要重整、玩家重新開局時，生命值顯示都能跟著同步。

## FBBtn 如何做成可點擊按鈕？

PixiJS FB 按鈕可以繼承既有 \`ButtonBase\`，把貼圖、座標與點擊行為集中在 \`FBBtn\`。按鈕被觸發時開啟外部連結，並播放一段音效。

新增 \`FBBtn.ts\`，內容如下：

\`\`\`ts
import { ButtonBase } from "./ButtonBase";
import { SoundMgr } from "../core/SoundMgr";

export class FBBtn extends ButtonBase {
    constructor() {
        super('Button','FB',50,410);
    }
    public trigger(){
        window.open(' https://www.facebook.com/claire0318 ', 'Claire Chang');
        SoundMgr.play("About");
    }
}
\`\`\`

\`FBBtn\` 只需要覆寫 \`trigger()\`，互動事件與按鈕動畫都沿用 \`ButtonBase\`。這種繼承方式適合連連看 UI，因為靜音、提示、重整、復原與 FB 按鈕都可以共用同一套點擊回饋。

實務上，\`window.open()\` 裡的網址前後空白建議移除，避免瀏覽器或靜態檢查工具判定為不乾淨的 URL。若要防止新視窗取得來源頁面的控制權，也可以改用明確的 \`noopener\` 開啟策略。

## GameScene 要怎麼掛上三個新元件？

PixiJS 場景只需要把 \`FBBtn\`、\`Stars\`、\`Clock\` 加到 \`application.stage\`。當 UI 元件自己監聽事件並更新狀態，\`GameScene\` 可以維持乾淨。

在 \`GameScene.ts\` 新增下面程式碼：

\`\`\`ts
application.stage.addChild(new FBBtn());
application.stage.addChild(new Stars());
application.stage.addChild(new Clock());
\`\`\`

這三行放進場景後，遊戲畫面就會出現左下角 FB 按鈕、左側星星生命值與左上角倒數計時。元件順序也會影響顯示層級：後加入的 \`Clock\` 會在前兩個元件之上，若 UI 有重疊，應用程式需要確認 z-order 是否符合設計。

## 完成後的 PixiJS 連連看畫面是什麼樣子？

完成後的 PixiJS 連連看畫面會同時包含盤面、倒數計時、重整生命值與 FB 按鈕。這代表核心遊戲流程與基本 UI 已能串成一個完整可玩的版本。

最終遊戲畫面如下：

![PixiJS 連連看遊戲完成所有基本 UI 後的畫面](/images/tech/pixijs-link-game-complete-implementation-result.png)

完整 commit 紀錄可以參考 GitHub 專案：[cochiachang/ironman2018](https://github.com/cochiachang/ironman2018)。這篇對應的重點不是新增複雜演算法，而是把遊戲體驗缺少的最後幾個 UI 元件接起來。

## 這次實作的元件分工怎麼看？

PixiJS 連連看完整功能實作可以用「場景負責組裝，元件負責狀態」來整理。這個分工讓 UI 行為集中在各自類別裡，後續維護比較不容易把遊戲流程寫散。

| 元件 | 負責功能 | 主要狀態 | 觸發事件 |
|---|---|---|---|
| \`Clock\` | 倒數計時 | \`remainTimes\`、\`remainText\` | \`CreateNewGameRequest\`、\`GameEndWithTimeout\` |
| \`Stars\` | 重整次數顯示 | \`reloadTimes\` 對應的星星貼圖 | \`ReloadBoardRequest\`、\`BoardNeedReload\`、\`CreateNewGameRequest\` |
| \`FBBtn\` | 外部連結按鈕 | 按鈕貼圖與座標 | \`trigger()\` |
| \`GameScene\` | 場景組裝 | stage children | \`addChild()\` |

這個版本最值得保留的設計是事件驅動。\`Clock\` 和 \`Stars\` 不必被 \`GameScene\` 每一秒或每一次重整主動呼叫，而是自己訂閱遊戲流程事件，畫面狀態就能跟著流程變動。

## 常見問題

### PixiJS 倒數計時一定要用 ticker 嗎？

PixiJS 倒數計時不一定要用 ticker。這份實作用 \`setInterval\` 每秒更新一次文字，對單純倒數很直覺；如果遊戲暫停、速度調整或背景切換要更精準，才建議改用 \`PIXI.Ticker\` 搭配 delta time。

### \`Clock\` 歸零後要怎麼通知遊戲結束？

\`Clock\` 歸零後會發出 \`GameFlowEvent.GameEndWithTimeout\`。遊戲流程管理器或其他場景元件只要監聽這個事件，就可以切換到失敗畫面或停止玩家操作。

### \`Stars\` 為什麼要在每次更新時重畫星星？

\`Stars\` 重畫星星可以讓 UI 狀態和 \`reloadTimes\` 保持一致。因為只有 3 顆星，清空後重建的成本很低，程式也比逐一追蹤每顆星目前貼圖更容易讀。

### \`FBBtn\` 可以改成其他社群或外部連結嗎？

\`FBBtn\` 可以改成任何外部連結按鈕。只要繼承 \`ButtonBase\`，替換 texture id、座標、\`window.open()\` 網址與音效名稱，就能沿用相同按鈕互動。

### 這篇適合接在哪些 PixiJS 連連看功能後面？

這篇適合接在盤面消除、按鈕基底、提示重整與復原功能之後。當核心玩法已經可以運作，倒數計時與生命值才有足夠的遊戲流程可以連動。

## 參考資料

- PixiJS 官方網站：<https://pixijs.com/>
- PixiJS Events 文件：<https://pixijs.download/release/docs/events.html>
- PixiJS Container 文件：<https://pixijs.download/release/docs/scene.Container.html>
- GitHub 專案 cochiachang/ironman2018：<https://github.com/cochiachang/ironman2018>

## 延伸閱讀

- [PixiJS 提示與重整按鈕教學：連連看遊戲功能實作](/post/pixijs-hint-refresh-buttons-link-game)：同樣聚焦 PixiJS、TypeScript，可接著比較不同情境的做法。
- [連連看遊戲開發前言：從規則、益智遊戲定位到 PixiJS 製作規劃](/post/link-game-development-introduction)：同樣聚焦 PixiJS、TypeScript，可接著比較不同情境的做法。
- [PixiJS 連連看遊戲開始、結束與過關畫面教學](/post/pixijs-link-game-start-end-clear-screens)：同樣聚焦 PixiJS、TypeScript，可接著比較不同情境的做法。

## 最後更新

2026-08-28
`;export{e as default};