var e=`---
title: PixiJS 復原按鈕教學：用 Stack 實作連連看 Undo 功能
description: 說明 PixiJS 連連看遊戲如何用 Stack 記錄消除歷史，並透過 RevertBtn 與 GameBoard 實作復原按鈕。
date: 2018-11-07
category: 前端開發
tags: [PixiJS, TypeScript, 遊戲開發, Stack]
readingTime: 8 分鐘
image: /images/tech/hero_pixi-link-game-board.webp
imageAlt: 彩色圖塊排列在棋盤格上，象徵 PixiJS 連連看遊戲的復原按鈕功能
---


# PixiJS 復原按鈕教學：用 Stack 實作連連看 Undo 功能

PixiJS 連連看遊戲的復原按鈕可以用 Stack 記錄每次成功消除的圖塊值與路徑，玩家按下 Undo 時再從最後一筆紀錄還原棋盤。這種做法符合「最後一步先復原」的操作直覺，也能把按鈕互動、事件通知與盤面狀態分開維護。

## 復原功能為什麼適合用 Stack？

復原功能適合用 Stack，因為 Undo 永遠從最後一次成功操作開始倒回去。Stack 的後進先出特性，正好對應連連看消除紀錄的還原順序。

堆疊（Stack）是一種加入與刪除都發生在同一端的有序串列。常見操作是 \`push\` 加入資料、\`pop\` 取出資料，資料取出的順序會是後進先出（LIFO, Last-in-First-out），也可以說是先進後出（FILO, First-in-Last-out）。

佇列（Queue）則是加入與刪除發生在不同端，常見操作是 \`enqueue\` 與 \`dequeue\`，資料取出的順序是先進先出（FIFO, First-in-First-out）。排隊買票、坐公車比較像 Queue；疊盤子、發牌、走迷宮回頭，則比較像 Stack。

| 資料結構 | 加入與取出位置 | 取出順序 | 適合例子 |
|---|---|---|---|
| Stack | 同一端 | 後進先出 | 疊盤子、發牌、走迷宮、復原操作 |
| Queue | 不同端 | 先進先出 | 排隊買票、坐公車 |

本文的資訊增益是把 2018 年 PixiJS 連連看專案裡的 Undo 實作拆成三件事：按鈕只送事件，\`GameBoard\` 只還原棋盤，歷史紀錄只保存足夠重建上一動的資料。

## RevertBtn 如何送出復原事件？

\`RevertBtn\` 應該只負責把玩家點擊轉成 \`RevertBackRequest\` 事件。復原按鈕不直接修改棋盤，可以避免 UI 元件知道太多遊戲規則。

首先建立 \`RevertBtn.ts\`，讓復原按鈕繼承前面文章整理過的 \`ButtonBase\`。建構式指定 spritesheet 裡的 \`Button\`、\`Revert\` 貼圖名稱，以及按鈕放在左側 UI 欄的位置。

\`\`\`ts
import { ButtonBase } from "./ButtonBase";
import { eventEmitter } from "../Main";
import { GameFlowEvent } from "../core/Event";

export class RevertBtn extends ButtonBase {

    constructor() {
        super('Button','Revert',50,345);
    }
    public trigger(){
        eventEmitter.emit(GameFlowEvent.RevertBackRequest);
    }
}
\`\`\`

這段程式碼延續前幾篇 PixiJS 連連看文章的架構：具體按鈕不處理棋盤資料，只發出遊戲流程事件。之後若要加上音效、按鈕停用狀態或快捷鍵，也可以沿用同一個事件入口。

## GameScene 要怎麼把復原按鈕加到畫面？

\`GameScene\` 加入復原按鈕時，只要把 \`new RevertBtn()\` 放進 stage。復原按鈕和聲音按鈕、棋盤、連線效果、角色動畫一樣，都是場景中的顯示物件。

在 \`GameScene.ts\` 的 \`draw()\` 方法中，把 \`RevertBtn\` 加到 \`application.stage\`。這裡保留原本的場景組裝順序：先放背景與按鈕，再放棋盤、連線效果與角色。

\`\`\`ts
export class GameScene {

    public static draw(){
        //加入背景
        application.stage.addChild(PIXI.Sprite.from(Loader.resources["background"].texture));
        //加入按鈕
        application.stage.addChild(new SoundBtn());
        application.stage.addChild(new RevertBtn());
        //加入連連看牌面
        application.stage.addChild(new GameBoard());
        application.stage.addChild(LinkedLine.instance);
        //角色動畫
        application.stage.addChild(new Character());
    }
}
\`\`\`

如果同一個場景已經有提示、重整、音效等按鈕，復原按鈕最好和其他 UI 控制一起集中建立。這樣做不是為了讓 \`GameScene\` 變聰明，而是讓場景一眼看得出有哪些互動入口。

## GameBoard 如何註冊復原事件？

\`GameBoard\` 應在建構時註冊 \`RevertBackRequest\`，並把事件綁到 \`revertBoard()\`。棋盤是唯一知道盤面陣列、圖塊座標與重畫流程的地方。

在 \`GameBoard.ts\` 的 constructor 中監聽事件：

\`\`\`ts
constructor() {
    super();
    this.createNewGame();
    this.x = 175;
    this.y = 20;

    eventEmitter.on(GameFlowEvent.RevertBackRequest,this.revertBoard.bind(this));
}
\`\`\`

事件名稱建議放在 \`GameFlowEvent\`，而不是散落在各個檔案中用字串硬寫。當時的專案在 \`Event.ts\` 裡新增了 \`RevertBackRequest\`：

\`\`\`ts
export class GameFlowEvent{
    public static TipsRequest: string = "TipsRequest";
    public static LinkedLineSuccess: string = "LinkedLineSuccess";
    public static RevertBackRequest:string = "RevertBackRequest";
}
\`\`\`

這個分工讓 \`RevertBtn\` 與 \`GameBoard\` 只共享事件名稱，不共享彼此的實作細節。復原流程以事件串起來，後面要接角色動畫或音效，也不需要讓按鈕直接呼叫棋盤方法。

## revertBoard 如何還原上一組消除圖塊？

\`revertBoard()\` 應從兩個 Stack 各取出一筆資料：被消除的圖塊值與該次連線路徑。只要兩筆資料都存在，就把兩個端點寫回棋盤並重畫圖塊。

當時的專案用 \`valueHistory\` 保存被消掉的符號 id，用 \`pathHistory\` 保存這次消除的兩個座標。復原時先 \`pop()\`，再把同一個 \`value\` 寫回 \`path.point1\` 與 \`path.point2\`。

\`\`\`ts
revertBoard = ()=>{
    let value = this.valueHistory.pop();
    let path = this.pathHistory.pop();
    if(value != null && path != null){
        board.board[path.point1.x][path.point1.y] = value;
        board.board[path.point2.x][path.point2.y] = value;

        this.drawBoardIcon();
        SoundMgr.play('Back');
    }
}
\`\`\`

這裡有一個實作細節很重要：連連看一次消除的是兩個相同圖塊，所以只存一個 \`value\` 就足夠還原兩格。如果遊戲後來改成特殊方塊、不同圖塊組合或道具效果，歷史紀錄就不能只存單一值，應改成保存兩格各自的完整狀態。

## 成功連線時要存哪些歷史紀錄？

成功連線時至少要存兩種歷史紀錄：連線路徑與被消除圖塊的值。紀錄必須發生在清除圖塊之前，否則被消除的資料會先從棋盤消失。

在 \`createIcon()\` 的點擊流程中，當 \`path.canLinkInLine()\` 判斷成功後，先把 \`path\` 與 \`board.getValue(this.select1)\` 存進 Stack，再畫線、清除兩個圖塊，最後發出成功事件。

\`\`\`ts
createIcon = (id, x, y)=>{
    let icon = new GameIcon(id,x,y);
    this.addChild(icon);
    let iconClickHandler = ()=>{
        if (this.selected) {
            let selectCorrect = false;
            this.select2 = new Point(x, y);
            this.iconSelected(this.select2);
            setTimeout(()=>{
                if (board.hasSameValue(this.select1, this.select2)) {
                    if (! (this.select1.x == x && this.select1.y == y) ) {
                        let path = new Path(this.select1, this.select2, board);
                        if(path.canLinkInLine()){
                            this.pathHistory.push(path);
                            this.valueHistory.push(board.getValue(this.select1));
                            LinkedLine.instance.drawPath(path);
                            this.clearIcon(this.select1);
                            this.clearIcon(this.select2);
                            eventEmitter.emit(GameFlowEvent.LinkedLineSuccess);
                            selectCorrect = true;
                            //判斷還有沒有路走
                            if(board.gameRoundEnd()){
                                alert("恭喜完成遊戲!");
                                this.createNewGame();
                            }else if(board.getFirstExistPath() == null){
                                this.reloadTimes--;
                                board.rearrangeBoard();
                            }
                        }
                    }
                }
                if(selectCorrect){
                    SoundMgr.play('Sound_select_crrect');
                }else{
                    SoundMgr.play('Sound_select_error');
                    this.iconUnSelected(this.select1);
                    this.iconUnSelected(this.select2);
                }
                this.selected = false;
            },0);

        } else {
            this.select1 = new Point(x, y);
            this.iconSelected(this.select1);
            this.selected = true;
            SoundMgr.play('Sound_select_1');

        }
    };
    icon.on("click", iconClickHandler);
    icon.on("tap", iconClickHandler);
}
\`\`\`

這段程式還保留了當時的自動重排邏輯：若成功消除後盤面沒有可連線路徑，就扣一次 \`reloadTimes\` 並呼叫 \`board.rearrangeBoard()\`。實務上要注意一件事：自動重排會改變盤面位置，若復原功能只記錄舊路徑座標，復原與重排同時存在時就需要重新設計歷史紀錄，否則 Undo 可能把圖塊還原到重排前的位置。

## 復原功能的事件流怎麼整理？

PixiJS 連連看復原功能可以整理成一條很短的事件流：按鈕送事件、棋盤取 Stack、棋盤重畫。事件流越短，越容易找出 Undo 壞掉時是哪一段出問題。

| 步驟 | 負責檔案 | 主要動作 | 資料 |
|---|---|---|---|
| 玩家按下復原 | \`RevertBtn.ts\` | 發出 \`RevertBackRequest\` | 無 |
| 棋盤接收事件 | \`GameBoard.ts\` | 呼叫 \`revertBoard()\` | \`pathHistory\`、\`valueHistory\` |
| 還原上一動 | \`GameBoard.ts\` | \`pop()\` 後寫回兩格 | \`path.point1\`、\`path.point2\`、\`value\` |
| 更新畫面 | \`GameBoard.ts\` | 呼叫 \`drawBoardIcon()\` | 最新 board data |
| 播放音效 | \`SoundMgr\` | 播放 \`Back\` | \`back.mp3\` |

我會把這個整理視為這篇筆記最實用的維護檢查表。若 Undo 按了沒反應，先看事件是否發出；若事件有發出，再看 Stack 裡是否有資料；若 Stack 有資料，最後看棋盤陣列與畫面重畫是否同步。

## 今日成果保留了哪些當時的連結？

2018 年筆記留下了線上展示與成果下載。因為當時網址是 HTTP，正式文章不把非 HTTPS 網址做成可點擊參考來源，但仍保留原始脈絡與本機匯出的壓縮檔位置。

當時記錄的今日成果如下：

- 線上展示：\`http://claire-chang.com/ironman2018/1107\`
- 今日成果下載：ironman20181107.zip（原下載連結已失效）

本次整理時，對應壓縮檔存在於 \`markdown-export/uploads/2018/11/ironman20181107.zip\`。壓縮檔內含 \`RevertBtn.ts\`、\`GameScene.ts\`、\`GameBoard.ts\`、\`Event.ts\`、\`Button.png\`、\`Button.json\` 與 \`back.mp3\`，可以對照復原按鈕、事件與音效資源。

## 常見問題

### PixiJS Undo 功能一定要用 Stack 嗎？

PixiJS Undo 功能不一定只能用 Stack，但 Stack 最符合「最後一步先復原」的操作順序。連連看每次成功消除都是一筆歷史紀錄，\`push()\` 與 \`pop()\` 就能處理基本復原需求。

### PixiJS 復原按鈕應該直接呼叫 GameBoard 方法嗎？

PixiJS 復原按鈕不建議直接呼叫 \`GameBoard\` 方法。按鈕發出 \`RevertBackRequest\` 事件，\`GameBoard\` 自己監聽並處理盤面還原，會讓 UI 與遊戲規則比較好分開維護。

### 復原紀錄要存圖塊值還是整個棋盤？

基本連連看只需要存被消除的圖塊值與兩個座標，因為一次消除的兩格值相同。若遊戲有重排、特殊方塊或連鎖效果，建議改存完整 move snapshot，甚至保存整個棋盤狀態。

### 為什麼要在清除圖塊之前 push 歷史紀錄？

歷史紀錄必須在 \`clearIcon()\` 之前保存，因為清除後棋盤上的值會變成空格。先保存 \`path\` 與 \`board.getValue(this.select1)\`，復原時才知道要把哪個圖塊放回哪兩個位置。

### 復原後需要重新檢查盤面是否有解嗎？

復原後最好重新檢查盤面是否有解，尤其是遊戲同時支援自動重排或提示功能時。本文保留 2018 年的基礎實作，重點在 Undo Stack；正式專案可以在 \`drawBoardIcon()\` 後補上盤面狀態檢查。

### \`pathHistory\` 和 \`valueHistory\` 可以合併嗎？

\`pathHistory\` 和 \`valueHistory\` 可以合併成同一個 move 物件，例如 \`{ path, value }\`。合併後可以避免兩個 Stack 長度不同步，也更容易擴充成保存分數、剩餘時間或特殊道具狀態。

## 參考資料

- 本文整理自 2018-11-07 的 PixiJS 連連看復原按鈕實作筆記與 \`markdown-export/uploads/2018/11/ironman20181107.zip\`。

## 延伸閱讀

- [PixiJS 提示與重整按鈕教學：連連看遊戲功能實作](/post/pixijs-hint-refresh-buttons-link-game)：同樣聚焦 PixiJS、TypeScript，可接著比較不同情境的做法。
- [連連看遊戲開發前言：從規則、益智遊戲定位到 PixiJS 製作規劃](/post/link-game-development-introduction)：同樣聚焦 PixiJS、TypeScript，可接著比較不同情境的做法。
- [PixiJS 如何實作連連看盤面與消除邏輯](/post/pixi-link-game-board)：同樣聚焦 PixiJS、TypeScript，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2018-11-07，依 2018 年 PixiJS 連連看復原按鈕實作整理為可發布的 GEO 技術文章。
`;export{e as default};