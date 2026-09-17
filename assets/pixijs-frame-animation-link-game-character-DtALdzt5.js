var e=`---
title: PixiJS 逐格動畫教學：連連看公仔角色動畫實作
description: 說明 PixiJS 如何用 AnimatedSprite 製作連連看公仔的待機、成功與提示逐格動畫。
date: 2018-11-04
category: 前端開發
tags: [PixiJS, AnimatedSprite, 逐格動畫, TypeScript]
readingTime: 9 分鐘
image: /images/tech/hero_pixi-link-game-board.webp
imageAlt: PixiJS 連連看遊戲棋盤與角色動畫場景
---


# PixiJS 逐格動畫教學：連連看公仔角色動畫實作

PixiJS 逐格動畫可以用 \`PIXI.extras.AnimatedSprite\` 播放多張連續貼圖，適合製作連連看公仔的待機、成功消除與提示反應。本文保留當時的 PixiJS 教學中的角色動畫程式碼，並把播放狀態、素材格式與 \`visible\` 效能觀察整理成可直接對照的實作筆記。

## 2D 遊戲常見動畫類型有哪些？

2D 遊戲動畫常見做法包含骨骼動畫、粒子系統、Tween 與逐格動畫。連連看公仔若需要可愛、明確的角色反應，逐格動畫最直覺，但圖片素材量也最大。

在一般 2D 遊戲中，動畫可以用 2D 骨骼動畫製作，例如 Spine；也可以用粒子系統、Tween 動畫，或逐格動畫來做。四種做法各自適合不同情境。

| 動畫類型 | 適合用途 | 我當時的筆記重點 |
|---|---|---|
| 骨骼動畫 | 行走、跳躍、角色動作 | 針對角色動畫的骨架做設定，再改變骨骼元件方向與變形，圖像空間通常比逐格動畫省 |
| 粒子系統 | 爆炸、煙霧、光點、特效 | 可用粒子編輯器產生設定檔，再交給粒子系統程式播放 |
| Tween | 位移、縮放、旋轉、跑分 | 在一段時間內把某個屬性從 A 數值補間到 B 數值，例如 x、y、scale 或 rotate |
| 逐格動畫 | 角色表情、細緻動作 | 由多張動態圖組合成動畫，效果精緻但繪圖成本與檔案大小較高 |

![骨骼動畫示意圖，角色骨架被拆成多個可控制節點](/images/tech/pixijs-frame-animation-bones.webp)

![粒子系統編輯器畫面，右側有大量粒子參數可調整](/images/tech/pixijs-frame-animation-particle-editor.webp)

我當時的筆記提到的 GSAP Tween 範例來自 GreenSock CodePen。正式文章改放安全連結：<https://codepen.io/GreenSock/pen/Kajpu>。

## PixiJS 逐格動畫要用哪個類別？

PixiJS 舊版專案可用 \`PIXI.extras.AnimatedSprite\` 播放逐格動畫。\`AnimatedSprite\` 接收一組 texture，依序顯示每張貼圖，形成類似 GIF 或電影影格的效果。

\`PIXI.extras.AnimatedSprite\` 是 PixiJS 裡處理動畫的類別。PixiJS 官方 API 對這個類別的說明是：AnimatedSprite 是用 texture 清單顯示動畫的簡單方式（PixiJS API，2026 年 8 月存取）。

換成實作語言，就是先把連續圖檔打包成 spritesheet，再從 loader resources 取得 textures，最後建立 \`AnimatedSprite\` 播放。前一篇素材處理已經處理過打包流程，這一篇把重點放在遊戲裡如何使用連續圖檔。

維護舊 PixiJS 專案時要注意版本名稱。我當時的筆記使用的是 \`PIXI.extras.AnimatedSprite\`；較新的 PixiJS 版本仍有 \`AnimatedSprite\` 概念，但命名空間與資源載入方式可能不同，升級時要先對照專案使用的 PixiJS major version。

## 連連看公仔需要哪些角色動畫？

連連看公仔動畫需要三種狀態：待機、消除成功與提示請求。每個狀態對應一份 spritesheet JSON，事件發生時只更新下一個要播放的動畫名稱。

在遊戲中，角色動畫如果只停在待機畫面，玩家很難感覺到角色與遊戲流程有互動。我當時的筆記設計了三個播放時機：

| 播放時機 | 動畫檔案 | 用途 |
|---|---|---|
| 待機動畫 | \`Character_Idle.json\` | 沒有特殊事件時持續回到待機狀態 |
| 消除成功時 | \`Character_Laugh.json\` | 玩家成功連線消除後，播放笑的反應 |
| 按下提示時 | \`Character_Jump.json\` | 玩家要求提示時，播放跳起來的反應 |

這裡的資訊增益是「下一段動畫」用狀態保存，而不是事件一來就直接切動畫。角色動畫若播到一半被中斷，視覺上會很突兀；先記錄 \`shouldPlayTarget\`，等目前動畫播完再切換，會比較穩。

## 如何建立 AnimatedSprite 動畫元件？

建立 AnimatedSprite 的流程是取得 loader 裡的 textures、整理成陣列、建立動畫物件，再設定播放速度、循環與完成回呼。角色動畫最後加進容器中統一管理。

我當時的筆記第一段程式碼負責產生動畫元件。呼叫時傳入動畫名稱，並設定動畫完成後要呼叫的動作。

\`\`\`ts
createAnim(id:string, onComplete:any){
    let anim = Loader.resources[id].textures;
    let textures = [];
    for(var index in anim) {
        textures.push(anim[index]);
    }
    var character = new PIXI.extras.AnimatedSprite(textures);
    character.play();
    character.animationSpeed = 0.25;
    character.loop = false;
    character.onComplete = onComplete;
    this.addChild(character);
    return character;
}
\`\`\`

這段程式的重點有三個。第一，\`Loader.resources[id].textures\` 代表 spritesheet 中的所有貼圖。第二，\`animationSpeed = 0.25\` 讓播放速度慢下來，避免影格太快閃過。第三，\`loop = false\` 讓每段反應動畫播完後交給 \`onComplete\` 決定下一步。

如果素材影格順序很重要，實務上要確認 \`textures.push(anim[index])\` 取得的順序是否符合 spritesheet 產生器輸出的命名規則。影格名稱若沒有補零，例如 \`run1\`、\`run2\`、\`run10\`，排序可能不是預期的 1、2、10。

## 如何避免角色動畫被事件中斷？

角色動畫可以用 \`shouldPlayTarget\` 保存下一段要播放的動畫。事件發生時只改狀態，等目前動畫完成後再隱藏其他動畫、顯示目標動畫並從第 0 格播放。

我當時的筆記第二段程式碼同時建立三個動畫，並用 event emitter 接收遊戲事件。因為動畫若播到一半被中斷會很突兀，這裡一律等動畫播完後，才依狀態判斷下一個要播的動畫。

\`\`\`ts
private shouldPlayTarget:string = 'idle';
constructor(){
    super();
    //每次動畫完成之後，都要判斷下一個要播放的動畫為何
    this.idle = this.createAnim('Character_Idle', this.playAnim.bind(this));
    this.jump = this.createAnim('Character_Jump', this.playAnim.bind(this));
    this.laugh = this.createAnim('Character_Laugh', this.playAnim.bind(this));

    eventEmitter.on(GameFlowEvent.LinkedLineSuccess, ()=>{
        this.shouldPlayTarget = 'laugh';//設定下一個要播的動畫
    });
    eventEmitter.on(GameFlowEvent.TipsRequest, ()=>{
        this.shouldPlayTarget = 'jump';
    });
}
//依據shouldPlayTarget的值來判斷現在要播的動畫
//如果沒有特殊要播的動畫的話，則一律播放待機動畫
playAnim(){
    this.idle.visible = false;
    this.laugh.visible = false;
    this.jump.visible = false;
    this[this.shouldPlayTarget].visible = true;
    this[this.shouldPlayTarget].gotoAndPlay(0);
    this.shouldPlayTarget = 'idle';
}
\`\`\`

這個做法把「收到事件」和「切換動畫」拆開。\`LinkedLineSuccess\` 發生時，程式只把下一段動畫設成 \`laugh\`；\`TipsRequest\` 發生時，程式只把下一段動畫設成 \`jump\`。真正播放則集中在 \`playAnim()\`。

我當時的筆記的寫法很適合小型遊戲：三個 \`AnimatedSprite\` 先全部建立好，需要哪個就切 \`visible\`。若角色動畫數量變多，可以再改成動畫池或只建立目前需要的動畫，避免一次載入與持有太多貼圖。

## Container 的 visible=false 會影響 PixiJS 效能嗎？

PixiJS Container 的 \`visible = false\` 可以避免不可見物件進入 render 流程。我當時的筆記實測發現，把畫面上不會被看到的元件設為不可見，能提升遊戲 FPS。

我當時的筆記研究了 \`Container.js\` 當時的碼後，觀察到當元件的 \`visible\` 為 \`false\` 時，PixiJS 不會 render 這個物件，也不會處理其相關子元件的畫面變更。這對連連看角色動畫很有用，因為同一時間只需要顯示 \`idle\`、\`laugh\`、\`jump\` 其中一個。

![PixiJS Container.js 中 visible 為 false 時跳過 render 的程式碼截圖](/images/tech/pixijs-frame-animation-container-visible.webp)

Source: [PixiJS Container.js](https://github.com/pixijs/pixijs/blob/dev/src/core/display/Container.js)

我當時的筆記的效能觀察是：把畫面上不會被看到的元件設為 \`visible = false\` 後，FPS 的確能提升。這個技巧可以多加利用，但也要知道它不是萬能的效能解法。

另外，filter 會花費較多效能，需要謹慎使用。mask 下的物件即便被遮住，仍可能持續 render；因此已經在可視範圍外、或被 mask 擋住的元件，仍建議主動設為 \`visible = false\`，降低不必要的渲染成本。

## PixiJS 逐格動畫實作流程是什麼？

PixiJS 逐格動畫實作可以拆成四步：先載入 spritesheet，再建立 AnimatedSprite，接著用遊戲事件更新播放狀態，最後用 visible 控制目前顯示的動畫。

整理成實作順序會更清楚：

1. 將角色連續圖檔打包成 \`Character_Idle.json\`、\`Character_Laugh.json\`、\`Character_Jump.json\`。
2. 透過 PixiJS loader 載入每一份 spritesheet。
3. 用 \`createAnim()\` 從 \`Loader.resources[id].textures\` 建立 \`AnimatedSprite\`。
4. 設定 \`loop = false\` 與 \`onComplete\`，讓每段動畫播完後回到統一的 \`playAnim()\`。
5. 用 \`shouldPlayTarget\` 記錄下一段動畫，避免事件直接中斷正在播放的動作。
6. 在 \`playAnim()\` 內關閉所有動畫的 \`visible\`，再顯示並播放目標動畫。

今日成果如下，連連看遊戲畫面中已經加入公仔角色動畫：

![PixiJS 連連看遊戲中的公仔角色動畫成果畫面](/images/tech/pixijs-frame-animation-result.webp)

這篇筆記另附線上 demo 與今日成果下載，但來源連結是 HTTP。為了維持外部連結安全性與 GEO 寫作規範，本文未把非 HTTPS demo 與 zip 下載連結放入正式參考資料。

## 常見問題

### PixiJS 逐格動畫適合做角色動畫嗎？
PixiJS 逐格動畫適合做小型角色動畫、表情反應與短循環動作。逐格動畫的優點是視覺結果可控，缺點是每個動作都需要多張圖片，素材量與檔案大小會增加。

### \`PIXI.extras.AnimatedSprite\` 和 \`AnimatedSprite\` 是同一個概念嗎？
\`PIXI.extras.AnimatedSprite\` 是舊版 PixiJS 常見命名。新版 PixiJS 仍有 AnimatedSprite 類別概念，但匯入方式、命名空間與資源載入 API 可能不同，維護舊專案時要先確認版本。

### 為什麼角色動畫不要被事件直接中斷？
角色動畫若在播放到一半時直接切換，玩家會看到不連續的跳格。比較自然的做法是先記錄下一段動畫，等目前動畫的 \`onComplete\` 觸發後再切換。

### \`animationSpeed = 0.25\` 代表什麼？
\`animationSpeed = 0.25\` 代表 AnimatedSprite 播放速度比預設慢。實際體感要搭配素材影格數與遊戲 FPS 調整，角色反應太快會看不清楚，太慢則會讓互動回饋延遲。

### \`visible = false\` 和 \`alpha = 0\` 哪個比較適合隱藏動畫？
隱藏不需要 render 的 PixiJS 物件時，\`visible = false\` 通常比 \`alpha = 0\` 更適合。\`alpha = 0\` 只是透明，物件仍可能參與渲染流程；\`visible = false\` 則能跳過不可見物件。

### PixiJS 的 mask 可以取代 visible 效能優化嗎？
PixiJS mask 主要用來限制顯示範圍，不等於停用物件渲染。我當時的筆記提醒，被 mask 擋住的物件仍建議在可視範圍外時設為 \`visible = false\`，避免浪費渲染成本。

### 逐格動畫素材要怎麼避免播放順序錯亂？
逐格動畫素材最好使用固定長度的檔名編號，例如 \`idle_0001\`、\`idle_0002\`、\`idle_0010\`。如果檔名沒有補零，從物件 key 轉成陣列時可能出現非預期排序。

## 參考資料

- PixiJS API，AnimatedSprite：<https://pixijs.download/v4.8.9/docs/PIXI.extras.AnimatedSprite.html>（存取日期：2026-08-28）
- PixiJS 官方文件，Spritesheets：<https://pixijs.com/8.x/guides/components/assets/spritesheet>（存取日期：2026-08-28）
- PixiJS GitHub，Container.js：<https://github.com/pixijs/pixijs/blob/dev/src/core/display/Container.js>（存取日期：2026-08-28）
- GreenSock GSAP 官方網站：<https://gsap.com/>（存取日期：2026-08-28）
- Spine PixiJS 範例：<https://pixijs.io/examples/#/spine/dragon.js>（存取日期：2026-08-28）
- Phaser 粒子系統範例：<https://phaser.io/examples/v2/particles/click-burst>（存取日期：2026-08-28）

## 延伸閱讀

- [PixiJS 如何實作連連看盤面與消除邏輯](/post/pixi-link-game-board)：同樣聚焦 PixiJS、TypeScript，可接著比較不同情境的做法。
- [PixiJS 提示與重整按鈕教學：連連看遊戲功能實作](/post/pixijs-hint-refresh-buttons-link-game)：同樣聚焦 PixiJS、TypeScript，可接著比較不同情境的做法。
- [連連看遊戲開發前言：從規則、益智遊戲定位到 PixiJS 製作規劃](/post/link-game-development-introduction)：同樣聚焦 PixiJS、TypeScript，可接著比較不同情境的做法。

## 最後更新

2026-08-28
`;export{e as default};