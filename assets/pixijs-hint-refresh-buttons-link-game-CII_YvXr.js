var e=`---
title: PixiJS 提示與重整按鈕教學：連連看遊戲功能實作
description: 說明 PixiJS 連連看遊戲如何實作提示按鈕、重整按鈕、事件通知與盤面重新排列。
date: 2018-11-08
category: 前端開發
tags: [PixiJS, TypeScript, 遊戲開發, 連連看]
readingTime: 8 分鐘
image: /images/tech/hero_pixi-link-game-board.webp
imageAlt: 彩色圖塊排列在棋盤格上，象徵 PixiJS 連連看遊戲的提示與重整功能
---


# PixiJS 提示與重整按鈕教學：連連看遊戲功能實作

PixiJS 連連看遊戲的提示按鈕可以透過事件通知 \`GameBoard\` 找出第一組可消除路徑，重整按鈕則應在盤面無解或玩家需要重新排列時呼叫 \`rearrangeBoard()\`，並確保重整後至少存在一組可連線圖塊。本文保留當時的 2018 年 TypeScript 程式碼，並補上事件流、狀態清理與重整檢查的實作脈絡。

## PixiJS 提示按鈕要怎麼實作？

PixiJS 提示按鈕應只負責發出提示事件，不直接操作棋盤。棋盤提示邏輯集中在 \`GameBoard\`，可以讓按鈕、角色動畫與音效維持低耦合。

我當時的筆記新增 \`TipBtn.ts\`，讓提示按鈕繼承前一篇建立的 \`ButtonBase\`。按鈕被點擊時，\`trigger()\` 只發出 \`GameFlowEvent.TipsRequest\`。

\`\`\`ts
import { ButtonBase } from "./ButtonBase";
import { eventEmitter } from "../Main";
import { GameFlowEvent } from "../core/Event";

export class TipBtn extends ButtonBase {
    constructor() {
        super('Button','Tip',50,287);
    }

    public trigger(){
        eventEmitter.emit(GameFlowEvent.TipsRequest);
    }
}
\`\`\`

這段程式的重點是分工。\`TipBtn\` 不知道盤面資料，也不直接尋找路徑；\`TipBtn\` 只把使用者操作轉成遊戲事件。現代 PixiJS 仍建議讓互動物件透過事件處理點擊，固定按鈕可使用 \`eventMode = 'static'\` 與 \`pointerdown\` 類事件；舊專案若仍使用 \`interactive\` 與 \`buttonMode\`，應先確認 PixiJS major version 再升級（PixiJS Events / Interaction，2026-08 存取）。

## GameBoard 如何接收提示事件？

GameBoard 接收提示事件後，應呼叫盤面邏輯找出可消除路徑，再把兩個圖塊標成選取狀態。這樣提示功能會沿用既有連線判斷，不需要另寫一套規則。

我當時的筆記在 \`GameBoard.ts\` 的 constructor 監聽 \`TipsRequest\` 事件。

\`\`\`ts
eventEmitter.on(GameFlowEvent.TipsRequest,this.showTips.bind(this));
\`\`\`

接著新增 \`tipsPath\` 與 \`showTips()\`。\`board.getFirstExistPath()\` 會回傳第一組可連線路徑，畫面層再用圖塊座標找到對應的 \`GameIcon\`。

\`\`\`ts
private tipsPath:Path;
showTips = ()=>{
    this.tipsPath = board.getFirstExistPath();
    let icon1 = this.getChildByName('icon_'+this.tipsPath.point1.x+"_"+this.tipsPath.point1.y) as GameIcon;
    icon1.select();//為可連線的方塊增加紅框提示玩家

    let icon2 = this.getChildByName('icon_'+this.tipsPath.point2.x+"_"+this.tipsPath.point2.y) as GameIcon;
    icon2.select();
    SoundMgr.play('Tips');
}
\`\`\`

這裡保留當時的程式碼。實務上可以加一道防護：若 \`board.getFirstExistPath()\` 回傳 \`null\`，就不要存取 \`point1\` 與 \`point2\`，而是提示玩家盤面需要重整。前一篇盤面文章已經使用 \`getFirstExistPath()\` 判斷盤面是否有解，本篇延續同一個 Board / Path 設計。

## 為什麼玩家點其他方塊時要取消提示？

提示紅框必須在玩家下一次操作前清掉，否則畫面會同時存在提示狀態與玩家選取狀態。提示清理放在圖塊點擊流程開頭，可以避免玩家誤判目前選的是哪一組。

我當時的筆記在建立每個 \`GameIcon\` 的 click handler 時，先呼叫 \`cancelTips()\`。這個位置很適合，因為無論玩家接著選對或選錯，舊提示都不該繼續留在畫面上。

\`\`\`ts
createIcon = (id, x, y)=>{
    let icon = new GameIcon(id,x,y);
    this.addChild(icon);
    let iconClickHandler = ()=>{
        this.cancelTips();//在這時將提示的框消除
        if (this.selected) {
            //...
        }
    }
}
\`\`\`

取消提示的做法是檢查 \`tipsPath\` 是否存在，再分別取出兩個被提示的 \`GameIcon\`，呼叫 \`unSelect()\` 移除紅框。

\`\`\`ts
cancelTips=()=>{
    if(this.tipsPath == null){
        return;
    }
    let icon1 = this.getChildByName('icon_'+this.tipsPath.point1.x+"_"+this.tipsPath.point1.y) as GameIcon;
    if(icon1) icon1.unSelect();

    let icon2 = this.getChildByName('icon_'+this.tipsPath.point2.x+"_"+this.tipsPath.point2.y) as GameIcon;
    if(icon2) icon2.unSelect();
}
\`\`\`

這段實作的資訊增益在於「提示狀態不是選取狀態」。提示只是暫時 UI 回饋，玩家真正點擊圖塊後，畫面應回到玩家操作流程，否則提示功能會讓核心消除流程變得不清楚。

## PixiJS 重整按鈕要怎麼實作？

PixiJS 重整按鈕應控制使用次數，並透過事件請求棋盤重新排列。按鈕類別只處理可用狀態，盤面資料變更則交給 \`GameBoard.reloadBoard()\`。

我當時的筆記新增 \`ReloadBtn.ts\`，同樣繼承 \`ButtonBase\`。這個按鈕使用 \`reloadTimes\` 控制剩餘次數，並在每一輪開始時重新啟用。

\`\`\`ts
import { ButtonBase } from "./ButtonBase";
import { eventEmitter } from "../Main";
import { GameFlowEvent } from "../core/Event";
import { reloadTimes } from "./GameBoard";

export class ReloadBtn extends ButtonBase {
    constructor() {
        super('Button','Reflash',50,230);
        eventEmitter.on(GameFlowEvent.GameRoundStart,(()=>{
            this.enable = true;
        }).bind(this))
    }
    public trigger(){
        if(reloadTimes > 0){
            eventEmitter.emit(GameFlowEvent.ReloadBoardRequest);
        }
        if(reloadTimes == 0){
            this.enable = false;
        }
    }
}
\`\`\`

當時的貼圖名稱是 \`Reflash\`，本文保留專案中的 asset key，不改成 \`Refresh\` 或 \`Reload\`。維護舊 PixiJS 專案時，程式碼命名可以逐步整理，但 asset key 若和 spritesheet JSON 綁定，任意改名可能導致貼圖取不到。

## GameBoard 重整盤面時要檢查什麼？

GameBoard 重整盤面時要扣除重整次數、重新排列資料、重畫圖塊，並確認新盤面仍有可消除路徑。若重整後沒有任何解，玩家會立刻卡住。

我當時的筆記在 constructor 監聽 \`ReloadBoardRequest\` 事件。

\`\`\`ts
eventEmitter.on(GameFlowEvent.ReloadBoardRequest, this.reloadBoard.bind(this));
\`\`\`

重整方法會先扣掉一次可用次數，接著反覆呼叫 \`board.rearrangeBoard()\`，直到 \`board.getFirstExistPath()\` 找得到至少一組路徑。確認有解後，再重新繪製盤面並播放音效。

\`\`\`ts
reloadBoard = ()=>{
    this.reloadTimes--;
    do{
        board.rearrangeBoard();
    }while(board.getFirstExistPath() == null)
    this.drawBoardIcon();
    SoundMgr.play('ReloadBoard');
}
\`\`\`

這段程式把「重整」視為盤面資料操作，而不是單純重畫畫面。PixiJS Assets 文件也提醒素材載入有快取概念，畫面重畫時應重用已載入的 texture，不需要每次重整都重新下載或載入素材（PixiJS Assets Guide，2026-08 存取）。

## 提示與重整功能的事件流怎麼整理？

提示與重整功能可以整理成兩條事件流：按鈕發事件，GameBoard 改畫面或改資料。事件邊界清楚時，後續加入角色動畫、音效或 disabled 狀態都比較容易。

| 功能 | 按鈕事件 | GameBoard 方法 | 主要資料 | UI 結果 |
|---|---|---|---|---|
| 提示 | \`TipsRequest\` | \`showTips()\` | \`tipsPath\` | 兩個可消除圖塊出現紅框 |
| 取消提示 | 圖塊點擊流程 | \`cancelTips()\` | \`tipsPath\` | 清除舊提示紅框 |
| 重整 | \`ReloadBoardRequest\` | \`reloadBoard()\` | \`reloadTimes\`、board data | 盤面重新排列且至少有一組可消除路徑 |
| 回合開始 | \`GameRoundStart\` | 按鈕監聽事件 | \`enable\` | 重整按鈕恢復可點擊 |

這個整理方式延續前幾篇 PixiJS 連連看文章的架構：\`ButtonBase\` 管互動，具體按鈕管觸發事件，\`GameBoard\` 管棋盤狀態，\`Board\` 與 \`Path\` 管消除規則。功能愈多，這條邊界愈重要。

## 今日成果保留了哪些當時的連結？

我當時的筆記附有線上 demo 與成果下載，但當時的連結使用 HTTP。正式文章為了維持 HTTPS 外部連結與 GEO 參考資料規範，保留文字脈絡，不把非 HTTPS 連結列入參考資料。

我當時的筆記記錄的今日成果如下：

- 線上 demo：\`http://claire-chang.com/ironman2018/1108/\`
- 今日成果下載：ironman20181108.zip（原下載連結已失效）

本次整理時，\`markdown-export/uploads/2018/11/ironman20181108.zip\` 仍存在，壓縮檔內含 \`TipBtn.ts\`、\`ReloadBtn.ts\`、\`GameBoard.ts\`、\`Button.png\`、\`Button.json\` 與相關音效素材。我當時的稿件沒有內嵌成果截圖，因此本文使用既有 PixiJS 連連看 hero 圖作為文章圖片。

## 常見問題

### PixiJS 提示按鈕應該直接操作 GameBoard 嗎？
PixiJS 提示按鈕不建議直接操作 \`GameBoard\`。按鈕只要發出 \`TipsRequest\` 事件，由 \`GameBoard\` 統一處理棋盤狀態與畫面更新，日後要加入動畫或音效會比較好維護。

### \`board.getFirstExistPath()\` 回傳 null 時怎麼辦？
\`board.getFirstExistPath()\` 回傳 \`null\` 代表目前盤面找不到可消除路徑。正式遊戲應阻止 \`showTips()\` 繼續取用 \`point1\` 與 \`point2\`，並引導玩家重整盤面或由系統自動重排。

### 重整盤面為什麼要用 do while？
\`do while\` 可以保證至少重整一次，並持續檢查新盤面是否有解。連連看盤面如果隨機排列後仍無解，就需要再重整，直到 \`getFirstExistPath()\` 找到可消除路徑。

### \`reloadTimes\` 應該放在按鈕還是 GameBoard？
\`reloadTimes\` 更適合由 \`GameBoard\` 或遊戲狀態管理器持有，因為重整次數屬於遊戲規則，不是單純 UI 狀態。按鈕可以讀取剩餘次數來決定是否停用，但不應成為規則來源。

### 提示紅框為什麼要在玩家點擊圖塊時清除？
提示紅框如果不清除，玩家可能分不清楚目前畫面上的紅框是系統提示還是自己的選取狀態。把 \`cancelTips()\` 放在圖塊點擊流程開頭，可以讓每次玩家操作都從乾淨狀態開始。

### PixiJS v8 還能用 interactive 和 buttonMode 嗎？
舊版 PixiJS 常見 \`interactive\` 與 \`buttonMode\` 寫法；新專案應優先查 PixiJS v8 的 \`eventMode\` 與 pointer events。固定按鈕常用 \`eventMode = 'static'\`，移動中的互動物件才需要評估 \`dynamic\`。

## 參考資料

- PixiJS 官方文件，Events / Interaction：<https://pixijs.com/8.x/guides/components/events>（存取日期：2026-08-28）
- PixiJS API 文件，Events：<https://pixijs.download/v8.17.1/docs/events.html>（存取日期：2026-08-28）
- PixiJS 官方文件，Assets：<https://pixijs.com/8.x/guides/components/assets>（存取日期：2026-08-28）
- PixiJS API 文件，Sprite anchor：<https://pixijs.download/v6.4.2/docs/PIXI.Sprite.html>（存取日期：2026-08-28）

## 延伸閱讀

- [PixiJS 連連看完整功能實作：倒數計時、生命值與 FB 按鈕](/post/pixijs-link-game-complete-implementation)：同樣聚焦 PixiJS、TypeScript，可接著比較不同情境的做法。
- [連連看遊戲開發前言：從規則、益智遊戲定位到 PixiJS 製作規劃](/post/link-game-development-introduction)：同樣聚焦 PixiJS、TypeScript，可接著比較不同情境的做法。
- [PixiJS 復原按鈕教學：用 Stack 實作連連看 Undo 功能](/post/pixijs-link-game-undo-button)：同樣聚焦 PixiJS、TypeScript，可接著比較不同情境的做法。

## 最後更新

2026-08-28
`;export{e as default};