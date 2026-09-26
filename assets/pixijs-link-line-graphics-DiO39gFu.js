var e=`---
title: PixiJS Graphics 連線效果教學：連連看選取框與路徑繪製
description: 說明 PixiJS 連連看遊戲如何用 Graphics 畫出選取紅框與消除連線，並整理 GameIcon、LinkedLine 與 GameBoard 的實作方式。
date: 2018-11-05
category: 前端開發
tags: [PixiJS, Graphics, TypeScript, 連連看]
readingTime: 10 分鐘
image: /images/tech/pixijs-link-line-graphics-result.webp
imageAlt: PixiJS 連連看遊戲畫面中兩個圖塊以紅色路徑連線消除
---


# PixiJS Graphics 連線效果教學：連連看選取框與路徑繪製

PixiJS 連連看遊戲可以用 \`PIXI.Graphics\` 畫出兩種即時回饋：玩家點選圖塊時的紅色選取框，以及兩個圖塊成功消除時的連線路徑。選取框適合放在每個 \`GameIcon\` 裡，連線路徑則適合抽成獨立的 \`LinkedLine\` 圖層，讓盤面邏輯和繪圖邏輯分開。

![PixiJS 連連看遊戲中成功連線消除的效果](/images/tech/pixijs-link-line-graphics-result.webp)

## PixiJS 連連看為什麼需要選取框與連線路徑？

PixiJS 連連看需要選取框與連線路徑，因為玩家必須立刻知道哪個圖塊已被選中、哪條路徑成功通過。這兩個回饋能把路徑判斷結果轉成畫面訊息。

在進行遊戲時，清楚的玩家操作說明及互動是很重要的遊戲要素。一般連連看遊戲會在玩家選擇第一個圖示後，先把該圖示加上效果，提示玩家目前已經選取某個符號。

當玩家選擇第二個符號且連線成功時，畫面應顯示經過的路徑，並畫出一條線來消除這兩個符號。本篇要實作的就是這兩個功能：選取提示與消除連線。

## PIXI.Graphics 可以畫哪些基本圖形？

\`PIXI.Graphics\` 可以在 PixiJS 場景中即時畫線、矩形、圓角矩形、多邊形等向量圖形。連連看選取框與路徑線條都屬於這類暫時性 UI 回饋。

PixiJS 官方範例中，\`Graphics\` 常用來建立不需要另外載入圖片的簡單圖形。畫線時會先設定 \`lineStyle()\`，再用 \`moveTo()\` 指定起點，接著用 \`lineTo()\` 畫出後續線段。

下面是畫線的一個簡單範例：

\`\`\`js
var app = new PIXI.Application(800, 600, { antialias: true });
document.body.appendChild(app.view);

var graphics = new PIXI.Graphics();

// set a line style
graphics.lineStyle(4, 0xffd900, 1);

// draw a shape
graphics.moveTo(50, 50);
graphics.lineTo(250, 50);
graphics.lineTo(250, 250);
graphics.endFill();

app.stage.addChild(graphics);
\`\`\`

成果如下：

![PixiJS Graphics 使用 lineStyle、moveTo、lineTo 畫出折線](/images/tech/pixijs-link-line-graphics-line-example.webp)

而這是畫矩形的一個簡單範例：

\`\`\`js
var app = new PIXI.Application(800, 600, { antialias: true });
document.body.appendChild(app.view);

var graphics = new PIXI.Graphics();

// draw a rounded rectangle
graphics.lineStyle(2, 0xFF00FF, 1);
graphics.beginFill(0xFF00BB, 0);
graphics.drawRoundedRect(150, 450, 300, 100, 1);
graphics.endFill();

app.stage.addChild(graphics);
\`\`\`

成果如下：

![PixiJS Graphics 使用 drawRoundedRect 畫出方框](/images/tech/pixijs-link-line-graphics-rect-example.webp)

## 如何用 GameIcon 為方塊加上選取效果？

\`GameIcon\` 可以繼承 \`PIXI.Sprite\`，並在 \`select()\` 裡新增一個 \`PIXI.Graphics\` 紅框。取消選取時移除子物件，就能把紅框從圖塊上清掉。

過去產生方塊時，是直接 \`new Sprite\` 並加入場景。現在方塊要能夠有被選取、取消選取的功能，因此可以將方塊拉出成為獨立類別 \`GameIcon\`。

\`GameIcon.ts\` 的內容如下：

\`\`\`ts
import Sprite = PIXI.Sprite;
import { Loader } from "../core/Loader";

export class GameIcon extends Sprite{
    constructor(id,x,y) {
        super();
        this.texture = Loader.resources['Icon'].textures['icon_' + id];
        this.name = 'icon_' + x + "_" + y;//方便可以從父層更容易的取出這個方塊
        this.width = this.height = 45;
        this.x = (this.width + 20) * x + 22.5;
        this.y = (this.width + 6) * y + 22.5;
        this.anchor.set(0.5);//縮放時可以以中間為中心點
        this.buttonMode = true;
        this.interactive = true;
    }

    //選擇時，繪製邊框，顏色為紅色
    select = ()=>{
        let gt = new PIXI.Graphics();
        gt.lineStyle(3,0xFF0000,1);
        gt.drawRect(-3-22.5,-3-22.5,51,51);
        gt.endFill();
        this.addChild(gt);
    }

    //取消選擇時，將邊框拿掉
    unSelect = ()=>{
        this.removeChildren();
    }
}
\`\`\`

\`GameIcon\` 的資訊增益在於「每個圖塊自己管理自己的選取視覺」。\`GameBoard\` 只要根據座標找到對應圖塊，再呼叫 \`select()\` 或 \`unSelect()\`，不用知道紅框的線寬、尺寸和顏色。

## GameBoard 如何切換圖塊選取狀態？

\`GameBoard\` 可以用圖塊名稱找到指定座標的 \`GameIcon\`，再呼叫選取或取消選取方法。這種做法讓點擊流程只處理狀態轉換，不直接寫繪圖細節。

接著在 \`GameBoard.ts\` 裡撰寫兩個方法：\`iconSelected()\` 與 \`iconUnSelected()\`。

\`\`\`ts
iconSelected = (point:Point)=>{
    //根據在GameIcon設定的name來取得正確位置上的方塊
    let icon = this.getChildByName('icon_'+point.x+"_"+point.y) as GameIcon;
    icon.select();
};

iconUnSelected = (point:Point)=>{
    let icon = this.getChildByName('icon_'+point.x+"_"+point.y) as GameIcon;
    icon.unSelect();
};
\`\`\`

然後改寫 \`GameBoard.ts\` 裡的 \`createIcon()\` 方法：

\`\`\`ts
createIcon = (id, x, y)=>{
    let icon = new GameIcon(id,x,y);//id為要顯示的圖片編號,x,y為位置
    this.addChild(icon);
    let iconClickHandler = ()=>{
        if (this.selected) {
            let selectCorrect = false;
            this.select2 = new Point(x, y);
            this.iconSelected(this.select2);//將方塊加上紅框
            setTimeout(()=>{//為了避免第二個方塊都還沒有繪製到邊框就被取消掉，因此在此增加setTimeout
                if (board.hasSameValue(this.select1, this.select2)) {
                    if (! (this.select1.x == x && this.select1.y == y) ) {
                        let path = new Path(this.select1, this.select2, board);
                        if(path.canLinkInLine()){
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
                    //不能消除，取消紅框
                    this.iconUnSelected(this.select1);
                    this.iconUnSelected(this.select2);
                }
                this.selected = false;
            },0);

        } else {
            this.select1 = new Point(x, y);
            this.iconSelected(this.select1);//將方塊加上紅框
            this.selected = true;
            SoundMgr.play('Sound_select_1');

        }
    };
    icon.on("click", iconClickHandler);
    icon.on("tap", iconClickHandler);
}
\`\`\`

這段程式保留了一個細節：第二個圖塊被選到後，使用 \`setTimeout(..., 0)\` 讓瀏覽器有機會先把紅框畫出來，再進入消除或取消選取流程。若沒有這一步，玩家可能看不到第二次選取回饋，錯誤時也會覺得畫面太突然。

## 如何用 LinkedLine 畫出消除連線路徑？

\`LinkedLine\` 可以繼承 \`PIXI.Container\`，專門負責把 \`Path.path_Detail\` 裡的座標轉成畫面線段。連線圖層獨立後，消除邏輯不用直接操作 \`PIXI.Graphics\`。

當成功消除兩個方塊時，應該要顯示剛剛連線的路徑，這樣使用者才能確認連線方式是正確的。前面盤面邏輯中的 \`Path\` 類別若呼叫 \`canLinkInLine()\` 回傳 \`true\`，也會把經過的路徑點放入 \`path_Detail\` 陣列。

這個類別的主要職責，是把輸入的 \`Path\` 物件中的路徑畫出來。為了讓這個圖層能更方便被各個地方取用，當時筆記使用 singleton 方法建立物件，所有類別都可以用 \`LinkedLine.instance\` 取得唯一實體。

下面是 \`LinkedLine.ts\`：

\`\`\`ts
import Container = PIXI.Container;
import Point = PIXI.Point;
import { Path } from "../core/Path";

export class LinkedLine extends Container {

    constructor() {
        super();
        this.x = 175;
        this.y = 20;
    }

    //將這個類別設定為singleton類別
    private static _instance:LinkedLine;
    public static get instance():LinkedLine{
        if(this._instance == null){
            this._instance = new LinkedLine();
        }
        return this._instance;
    }

    //輸入一個path物件，藉由paths.path_Detail來畫出連線
    public drawPath(paths:Path){
        this.removeChildren();
        let point = paths.path_Detail.pop();//取出第一個點
        let gt = new PIXI.Graphics();
        gt.lineStyle(5, 0xff0000);
        let start = this.getPositionFromPoint(point);
        gt.moveTo(start.x,start.y);//先移到第一個點的位置
        do{
            point = paths.path_Detail.pop();//取出後面的點
            let line = this.getPositionFromPoint(point);
            gt.lineTo(line.x,line.y);//繪製連線
        }while(paths.path_Detail.length > 0);

        this.addChild(gt);

        //設定連線會在500毫秒後自動消失
        setTimeout(()=>{this.removeChildren();},500);
    }
    //把遊戲盤面的x,y系統轉化為畫面上實際的坐標系統
    public getPositionFromPoint(point:Point){
        let x = (45 + 20) * point.x + 22.5;
        let y = (45 + 6) * point.y + 22.5;
        if(y < 0){
            y = -5;
        }
        if(y > 502){
            y = 510;
        }
        return new Point(x, y);
    }
}
\`\`\`

\`drawPath()\` 一開始會先 \`removeChildren()\`，避免上一條連線還留在畫面上。接著依序取出 \`path_Detail\` 中的點，用 \`moveTo()\` 移到起點，再用 \`lineTo()\` 畫出每一段路徑，最後在 500 毫秒後自動清除。

## LinkedLine 的座標換算要注意什麼？

\`LinkedLine\` 的座標換算要和 \`GameIcon\` 的圖塊位置公式一致。若圖塊間距、錨點或盤面圖層偏移不同，紅線就會偏離圖塊中心。

這篇筆記裡的圖塊大小是 45，橫向間距是 20，縱向間距是 6，因此座標換算使用同一組公式：

\`\`\`ts
let x = (45 + 20) * point.x + 22.5;
let y = (45 + 6) * point.y + 22.5;
\`\`\`

\`22.5\` 是圖塊寬高的一半，目的是讓線段落在圖塊中心。\`y < 0\` 與 \`y > 502\` 的處理，則是讓繞到盤面外側的路徑仍然能畫在可見範圍附近。

如果後續要改圖塊尺寸，最好把 \`45\`、\`20\`、\`6\`、\`22.5\` 抽成共用常數。否則 \`GameIcon\` 和 \`LinkedLine\` 任一邊改動，連線位置就可能開始錯位。

## GameScene 要在哪裡加入 LinkedLine 圖層？

\`LinkedLine\` 應加在遊戲盤面上方，讓紅色路徑不被圖塊遮住。實作時只要在連線成功後呼叫 \`drawPath()\`，並在場景建立時把 singleton 加到 stage。

在 \`GameBoard.ts\` 裡，連線成功時加上這行來繪製連線：

\`\`\`ts
LinkedLine.instance.drawPath(path);
\`\`\`

在 \`GameScene.ts\` 裡加上 \`LinkedLine\` 元件：

\`\`\`ts
application.stage.addChild(LinkedLine.instance);
\`\`\`

顯示層的順序很重要。若 \`LinkedLine.instance\` 加得太早，後加入的棋盤圖塊可能蓋住連線；若加在 UI 按鈕之上，又可能遮住按鈕互動。比較穩定的做法是把棋盤、連線效果、UI 控制分成不同容器，再按層級加入 stage。

## 今日成果保留了哪些當時的連結？

當時筆記附有線上 demo 與成果下載。這兩個連結使用 HTTP，本文保留記錄，不放進參考資料清單，也不把非 HTTPS 連結改寫成外部引用。

當時記錄的今日成果如下：

- 線上 demo：\`http://claire-chang.com/ironman2018/1105/\`
- 今日成果下載：ironman20181105.zip（原下載連結已失效）

## 常見問題

### PixiJS Graphics 適合拿來畫連連看連線嗎？

PixiJS Graphics 適合畫連連看連線。連線路徑是短時間出現的簡單線段，用 \`moveTo()\` 和 \`lineTo()\` 畫出來，比額外準備圖片素材更直接。

### PixiJS 選取框要放在 Sprite 裡還是獨立圖層？

PixiJS 選取框適合放在每個 \`GameIcon\` 裡，因為選取框跟著單一圖塊狀態走。消除路徑則適合放在獨立 \`LinkedLine\` 圖層，因為路徑跨越多個圖塊。

### LinkedLine 為什麼使用 singleton？

\`LinkedLine\` 使用 singleton 是為了讓不同類別都能取得同一個連線圖層。小型遊戲可以這樣快速共用物件；大型專案則可以改用場景管理器或依賴注入，讓生命週期更明確。

### 為什麼 drawPath 會先 removeChildren？

\`drawPath()\` 先 \`removeChildren()\` 是為了清除上一條連線。若沒有先清掉舊線段，玩家連續消除時，畫面上可能同時殘留多條紅線。

### PixiJS 連線路徑為什麼會偏移？

PixiJS 連線路徑偏移通常是因為圖塊座標公式和連線座標公式不一致。應確認圖塊大小、間距、anchor、棋盤容器偏移與 \`LinkedLine\` 容器偏移是否使用同一套設定。

## 參考資料

- PixiJS Graphics 官方文件：<https://pixijs.download/release/docs/scene.Graphics.html>
- PixiJS Graphics 範例：<https://pixijs.com/8.x/examples/graphics/simple>
- PixiJS Events / Interaction Guide：<https://pixijs.com/8.x/guides/components/events>
- PixiJS Container 官方文件：<https://pixijs.download/release/docs/scene.Container.html>

## 延伸閱讀

- [PixiJS 如何實作連連看盤面與消除邏輯](/post/pixi-link-game-board)：同樣聚焦 PixiJS、TypeScript，可接著比較不同情境的做法。
- [連連看遊戲開發前言：從規則、益智遊戲定位到 PixiJS 製作規劃](/post/link-game-development-introduction)：同樣聚焦 PixiJS、TypeScript，可接著比較不同情境的做法。
- [PixiJS 提示與重整按鈕教學：連連看遊戲功能實作](/post/pixijs-hint-refresh-buttons-link-game)：同樣聚焦 PixiJS、TypeScript，可接著比較不同情境的做法。

## 最後更新

2018-11-05；本文依 2018 年 PixiJS 連連看連線效果筆記整理，保留當時的 TypeScript 實作，並補上 GEO 結構、FAQ 與站內延伸閱讀。
`;export{e as default};