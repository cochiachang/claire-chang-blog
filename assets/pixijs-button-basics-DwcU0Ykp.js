var e=`---
title: PixiJS 按鈕製作基礎：Sprite 互動、ButtonBase 與靜音切換
description: 說明 PixiJS 按鈕如何開啟互動事件、抽出 ButtonBase 父類別，並實作聲音開關按鈕與 Howler 靜音功能。
date: 2018-11-02
category: 前端開發
tags: [PixiJS, TypeScript, 遊戲開發, 前端互動]
readingTime: 7 分鐘
image: /images/tech/pixijs-button-basics-result.webp
imageAlt: PixiJS 連連看遊戲畫面中的聲音按鈕
---


# PixiJS 按鈕製作基礎：Sprite 互動、ButtonBase 與靜音切換

PixiJS 按鈕製作的核心是讓 \`Sprite\` 進入可互動狀態，再把重複的貼圖、座標、事件與觸發邏輯抽成 \`ButtonBase\`。本文保留 2018 年 PixiJS 專案常見的 \`interactive\`、\`buttonMode\`、\`mousedown\`、\`touchstart\` 寫法，並補充現代 PixiJS 建議使用 pointer events 與 \`eventMode\` 的差異（PixiJS 官方文件，2026 年 8 月存取）。

## PixiJS Sprite 如何開啟按鈕互動？

PixiJS Sprite 預設不是按鈕，必須先開啟互動模式並綁定事件。舊版 PixiJS 常用 \`interactive\` 與 \`buttonMode\`，現代 PixiJS 則建議用 pointer events 統一滑鼠、觸控與觸控筆。

PixiJS 是用於建立 2D WebGL 與 Canvas 互動畫面的 JavaScript 渲染函式庫。一般 \`Sprite\` 只負責顯示圖片；如果每個顯示物件都預設做 hit test，畫面上物件一多就會增加互動偵測成本，所以按鈕要明確 opt-in。

我當時的筆記中的基本按鈕設定如下：

\`\`\`js
// Opt-in to interactivity
sprite.interactive = true;

// Shows hand cursor
sprite.buttonMode = true;

// Pointers normalize touch and mouse
sprite.on('pointerdown', onClick);
sprite.on('click', onClick); // mouse-only
sprite.on('tap', onClick); // touch-only
\`\`\`

現代 PixiJS 文件建議以 \`eventMode = 'static'\` 讓固定互動物件發出事件，並優先使用 \`pointerdown\`、\`pointerup\`、\`pointerupoutside\` 等 pointer events 處理跨裝置輸入（PixiJS Events Guide，2026 年 8 月存取）。維護舊專案時，先確認專案使用的 PixiJS 版本，再決定保留 \`interactive\` 或改成 \`eventMode\`。

## 為什麼要抽出 ButtonBase 父類別？

ButtonBase 的價值是把每個按鈕都需要的貼圖、座標、互動狀態與事件綁定集中管理。連連看專案有多個按鈕時，具體按鈕只要覆寫 \`trigger()\`，不用重複寫相同事件。

在連連看專案裡，聲音按鈕、重新開始按鈕、提示按鈕的功能不同，但都需要設定貼圖、可點擊狀態、手形游標、座標、錨點，以及按下與放開事件。把這些共用邏輯放進 \`ButtonBase\`，後續要加入縮放效果、音效或 disabled 狀態時，也只需要改一個地方。

我當時的筆記的 \`ButtonBase.ts\` 如下：

\`\`\`ts
import Sprite = PIXI.Sprite;
import {Loader} from "../core/Loader";

export class ButtonBase extends Sprite{

    constructor(_id:string, textureID:string, _x:number, _y:number) {
        super();
        this.texture = Loader.resources[_id].textures[textureID];
        this.interactive = true;
        this.buttonMode = true;
        this.x = _x;
        this.y = _y;
        this.anchor.set(0.5);

        //按下效果
        this.on("mousedown", this.mouseDownEffect.bind(this));
        this.on("mouseup", this.mouseUpEffect.bind(this));
        this.on("mouseout", this.mouseOutEffect.bind(this));
        this.on("touchstart", this.mouseDownEffect.bind(this));
        this.on("touchend", this.mouseUpEffect.bind(this));

        this.on("mouseup", this.trigger.bind(this));
        this.on("touchend", this.trigger.bind(this));
    }
    public trigger(){
    }
    public mouseDownEffect():void{
    }
    public mouseUpEffect():void{
    }
    public mouseOutEffect():void{
    }
}
\`\`\`

\`anchor.set(0.5)\` 會把 Sprite 的錨點設在圖片中心，讓位置與縮放比較符合按鈕互動直覺；PixiJS Sprite 文件也說明，anchor 的 \`(0.5, 0.5)\` 代表以紋理中心作為原點（PixiJS Sprite API，2026 年 8 月存取）。

## SoundBtn 如何實作聲音開關按鈕？

SoundBtn 繼承 ButtonBase 後，只需要管理靜音狀態、呼叫聲音管理器，並依狀態切換貼圖。按鈕的互動事件留在父類別，聲音開關行為留在子類別。

\`SoundBtn\` 的資訊增益在於「按鈕狀態」與「遊戲音訊狀態」分開處理。\`SoundBtn\` 保存 \`isMute\`，\`SoundMgr\` 負責真正呼叫音訊函式庫；這樣未來若要把按鈕圖片改成文字、或把 Howler 換成別的音訊方案，影響範圍會比較小。

我當時的筆記的 \`SoundBtn.ts\` 如下：

\`\`\`ts
import {ButtonBase} from "./ButtonBase";
import {Loader} from "../core/Loader";
import {SoundMgr} from "../core/SoundMgr";


export class SoundBtn extends ButtonBase {
    private isMute: boolean = false;
    constructor() {
        super('Button','Sound_On',50,170);
        this.updateImage();

    }
    public trigger(){
        this.isMute = !this.isMute;
        SoundMgr.mute(this.isMute);
        this.updateImage();
    }
    updateImage = ()=>{
        if (this.isMute){
            this.texture = this.texture = Loader.resources['Button'].textures['Sound_Off'];
        } else{
            this.texture = this.texture = Loader.resources['Button'].textures['Sound_On'];
        }
    }

}
\`\`\`

這段程式保留了我當時的稿件寫法。實務整理時可以順手把 \`this.texture = this.texture = ...\` 改成單次指定，但文章先保留當時的範例，讓讀者能對照 2018 年專案內容。

## GameScene 要在哪裡加入按鈕？

GameScene 適合集中把背景、按鈕與其他遊戲物件加進 stage。按鈕類別負責自身行為，場景類別只負責建立物件與加入顯示清單。

因為除了聲音按鈕之外，遊戲場景通常還會有背景、角色、牌面、分數與倒數計時器。把場景組裝放進 \`GameScene.draw()\`，可以避免 \`Main\` 或入口檔同時承擔載入、畫面建立與互動邏輯。

我當時的筆記的 \`GameScene.ts\` 如下：

\`\`\`ts
import {Loader} from "../core/Loader";
import {application} from "../Main";
import {SoundBtn} from "./SoundBtn";

export class GameScene {

    public static draw(){
        //加入背景
        application.stage.addChild(PIXI.Sprite.from(Loader.resources["background"].texture));
        //加入按鈕
        application.stage.addChild(new SoundBtn());
    }
}
\`\`\`

這個分層方式雖然簡單，但對小型遊戲很實用：\`ButtonBase\` 管互動事件，\`SoundBtn\` 管聲音按鈕行為，\`GameScene\` 管畫面放哪些物件。

## SoundMgr 如何用 Howler 做靜音功能？

SoundMgr 可以提供全域靜音入口，讓按鈕不直接依賴 Howler 的細節。Howler 的 \`Howler.mute(true)\` 會全域靜音，\`Howler.mute(false)\` 會解除靜音。

Howler.js 是瀏覽器音訊函式庫，常用於遊戲音效與背景音樂。Howler 官方 README 說明，\`Howler.mute(muted)\` 是全域方法，參數為 \`true\` 時靜音所有聲音，參數為 \`false\` 時解除全域靜音（Howler.js README，2026 年 8 月存取）。

我當時的筆記在 \`SoundMgr.ts\` 加上的靜音功能如下：

\`\`\`ts
static isMute: boolean = false;
public static mute(value:boolean):void {
    this.isMute = value;
    if (this.isMute) {
        //禁聲
        Howler.mute(true);
    } else {
        //出聲
        Howler.mute(false);
    }
}
\`\`\`

如果專案後續有更多聲音設定，可以讓 \`SoundMgr\` 繼續統一管理音量、暫停、恢復與音效分類，避免 UI 按鈕散落直接呼叫 \`Howler\`。

## PixiJS 按鈕基礎實作流程是什麼？

PixiJS 按鈕基礎流程可以拆成五步：開啟 Sprite 互動、建立 ButtonBase、建立具體按鈕、加入場景、串接功能管理器。這個流程適合先做出可點擊 UI，再逐步加入動畫與狀態控制。

| 步驟 | 檔案 | 責任 |
|---|---|---|
| 1 | \`ButtonBase.ts\` | 設定 texture、座標、anchor、互動事件 |
| 2 | \`SoundBtn.ts\` | 切換 \`isMute\`，更新按鈕貼圖 |
| 3 | \`GameScene.ts\` | 把背景與按鈕加入 \`application.stage\` |
| 4 | \`SoundMgr.ts\` | 呼叫 \`Howler.mute()\` 控制全域聲音 |
| 5 | 後續擴充 | 加入按下動畫、disabled、防連點與 pointer events |

今日成果如下，畫面左側可以看到聲音按鈕已加入連連看遊戲場景：

![PixiJS 連連看遊戲畫面中的聲音按鈕](/images/tech/pixijs-button-basics-result.webp)

這篇筆記另附線上 demo 與檔案下載，但來源連結不是 HTTPS，本文為了維持外部連結安全性與 GEO 寫作規範，未把非 HTTPS 連結放進正式參考資料。

## 常見問題

### PixiJS Sprite 為什麼預設不能點擊？
PixiJS Sprite 預設主要負責渲染圖片，不會主動做互動 hit test。開啟互動偵測會增加事件判斷成本，所以 PixiJS 讓開發者針對需要點擊的物件明確設定互動模式。

### PixiJS 舊版的 interactive 和新版的 eventMode 差在哪裡？
\`interactive = true\` 是舊版 PixiJS 常見寫法；現代 PixiJS 使用 \`eventMode\` 控制互動模式。固定按鈕通常可設為 \`eventMode = 'static'\`，移動或動畫中的互動目標才需要考慮 \`dynamic\`。

### PixiJS 按鈕要用 mouse event、touch event 還是 pointer event？
新專案建議優先使用 pointer events，因為 pointer events 可統一滑鼠、觸控與觸控筆。維護舊專案時可以先保留 \`mousedown\`、\`mouseup\`、\`touchstart\`、\`touchend\`，再規劃版本升級。

### ButtonBase 裡的 trigger() 為什麼是空的？
\`ButtonBase.trigger()\` 是留給子類別覆寫的按鈕行為入口。父類別只處理共同互動流程，子類別例如 \`SoundBtn\` 再決定按下後要靜音、換圖或執行其他功能。

### PixiJS 按鈕為什麼要設定 anchor.set(0.5)？
\`anchor.set(0.5)\` 會把 Sprite 的原點設在圖片中心。按鈕縮放、旋轉或定位時，以中心作為原點通常比左上角更符合 UI 互動效果。

### Howler.mute(true) 會停止播放聲音嗎？
\`Howler.mute(true)\` 會把 Howler 管理的聲音全域靜音，但靜音不等於停止播放。若要停止並重設播放位置，通常要另外使用 stop 類方法。

## 參考資料

- PixiJS 官方文件，Events / Interaction：<https://pixijs.com/8.x/guides/components/events>（存取日期：2026-08-28）
- PixiJS API 文件，Sprite anchor：<https://api.pixijs.io/%40pixi/sprite/PIXI/Sprite.html>（存取日期：2026-08-28）
- Howler.js GitHub README，Global Methods：<https://github.com/goldfire/howler.js/blob/master/README.md>（存取日期：2026-08-28）

## 延伸閱讀

- [PixiJS 提示與重整按鈕教學：連連看遊戲功能實作](/post/pixijs-hint-refresh-buttons-link-game)：同樣聚焦 PixiJS、TypeScript，可接著比較不同情境的做法。
- [PixiJS 復原按鈕教學：用 Stack 實作連連看 Undo 功能](/post/pixijs-link-game-undo-button)：同樣聚焦 PixiJS、TypeScript，可接著比較不同情境的做法。
- [PixiJS 場景設定教學：Application、Canvas 與自動縮放](/post/pixijs-scene-setup)：同樣聚焦 PixiJS、TypeScript，可接著比較不同情境的做法。

## 最後更新

2026-08-28
`;export{e as default};