var e=`---
title: PixiParticles 教學：用 PixiJS 製作粒子特效
description: 說明 PixiParticles 如何用 Emitter 與 config 製作火焰、煙霧、爆炸等 PixiJS 粒子特效，並整理粒子編輯器與版本注意事項。
date: 2018-11-11
category: 前端開發
tags: [PixiJS, PixiParticles, 粒子系統, 遊戲開發]
readingTime: 8 分鐘
image: /images/tech/hero_pixijs-introduction-2d-webgl-game-engine.webp
imageAlt: 使用 PixiJS 製作 2D 網頁遊戲與粒子特效的開發畫面
---


# PixiParticles 教學：用 PixiJS 製作粒子特效

PixiParticles 可以在 PixiJS 專案中用 \`Emitter\` 與 config 製作火焰、煙霧、下雨、沙塵、爆炸等粒子特效。我當時的筆記使用 2018 年常見的 \`new PIXI.particles.Emitter(particleParent, particleImages, config)\` 寫法；維護舊專案時可保留這個結構，新專案則要先確認目前使用的是 PixiParticles 舊版 API，還是新版 \`@pixi/particle-emitter\` API。

## 粒子系統是什麼？

粒子系統是用大量短生命週期的小圖像模擬特效的技術。火焰、煙霧、雨滴、沙塵與爆炸通常不適合逐格手畫，改用發射器參數控制會更有效率。

遊戲經常透過粒子系統製作各種視覺效果，例如火焰、煙霧、下雨、沙塵、爆炸等效果，並不容易使用一般的動畫工具製作。

通常粒子系統在三維空間中的位置與運動是由發射器控制的，發射器可以設定粒子生成速度，也就是單位時間粒子生成的數目；也可以設定粒子初始速度向量、粒子壽命、粒子顏色，以及粒子在生命週期中的變化。經由這些參數，粒子系統就能產生不同的特效效果。

我當時的筆記附了一張火焰粒子特效範例圖，但匯出資料夾沒有找到對應圖片檔。這裡先保留文字脈絡，不把原 WordPress HTTP 圖片直接放進正式文章。

## PixiParticles 在 PixiJS 裡扮演什麼角色？

PixiParticles 是 PixiJS 生態系的粒子系統函式庫，核心工作是建立 particle emitter。粒子素材放在 PixiJS 容器中，特效外觀則由 config 控制。

PixiParticles 官網對這個工具的定位是 PixiJS 的 particle system library，並提供互動式粒子編輯器，用來設計與預覽自訂 particle emitters（PixiParticles 文件，2026 年 8 月存取）。

我當時的筆記使用的官方網址如下：

- PixiParticles 文件：<https://pixijs.io/pixi-particles/docs/index.html>
- PixiParticles Editor：<https://pixijs.io/pixi-particles-editor/#pixieDust>

維護舊 PixiJS 專案時，這篇文章最值得保留的是「用 Emitter 接收容器、粒子圖片與設定檔」的思路。新版 \`@pixi/particle-emitter\` 的 \`Emitter\` constructor 已改成接收 \`Container\` 與 \`EmitterConfigV3\`，舊版 config 可用 \`upgradeConfig()\` 升級（\`@pixi/particle-emitter\` 文件，2026 年 8 月存取）。

## PixiParticles Emitter 要怎麼建立？

PixiParticles 舊版建立方式是把粒子容器、粒子貼圖與 config 傳入 \`Emitter\`。發射器建立後，需要在每一幀呼叫 \`emitter.update(deltaSeconds)\` 才會推進粒子狀態。

我當時的筆記中的基本方法如下：

\`\`\`js
new PIXI.particles.Emitter(particleParent, particleImages, config)
\`\`\`

簡單的使用範例如下：

\`\`\`js
// Create a new emitter
var emitter = new PIXI.particles.Emitter(

    // The PIXI.Container to put the emitter in
    // if using blend modes, it's important to put this
    // on top of a bitmap, and not use the root stage Container
    container,

    // The collection of particle images to use
    [PIXI.Texture.fromImage('image.jpg')],

    // Emitter configuration, edit this to change the look
    // of the emitter
    {
        alpha: {
            list: [
                {
                    value: 0.8,
                    time: 0
                },
                {
                    value: 0.1,
                    time: 1
                }
            ],
            isStepped: false
        },
        scale: {
            list: [
                {
                    value: 1,
                    time: 0
                },
                {
                    value: 0.3,
                    time: 1
                }
            ],
            isStepped: false
        },
        color: {
            list: [
                {
                    value: "fb1010",
                    time: 0
                },
                {
                    value: "f5b830",
                    time: 1
                }
            ],
            isStepped: false
        },
        speed: {
            list: [
                {
                    value: 200,
                    time: 0
                },
                {
                    value: 100,
                    time: 1
                }
            ],
            isStepped: false
        },
        startRotation: {
            min: 0,
            max: 360
        },
        rotationSpeed: {
            min: 0,
            max: 0
        },
        lifetime: {
            min: 0.5,
            max: 0.5
        },
        frequency: 0.008,
        spawnChance: 1,
        particlesPerWave: 1,
        emitterLifetime: 0.31,
        maxParticles: 1000,
        pos: {
            x: 0,
            y: 0
        },
        addAtBack: false,
        spawnType: "circle",
        spawnCircle: {
            x: 0,
            y: 0,
            r: 10
        }
    }
);

// Calculate the current time
var elapsed = Date.now();

// Update function every frame
var update = function(){

    // Update the next frame
    requestAnimationFrame(update);

    var now = Date.now();

    // The emitter requires the elapsed
    // number of seconds since the last update
    emitter.update((now - elapsed) * 0.001);
    elapsed = now;

    // Should re-render the PIXI Stage
    // renderer.render(stage);
};

// Start emitting
emitter.emit = true;

// Start the update
update();
\`\`\`

這段範例有一個很重要的細節：\`emitter.update()\` 需要的是秒數，而不是毫秒。我當時的筆記用 \`(now - elapsed) * 0.001\` 把 \`Date.now()\` 的毫秒差轉成秒，這個轉換不能省。

## PixiParticles config 的主要參數怎麼看？

PixiParticles config 可以分成外觀、速度、生命週期、生成頻率與生成位置五類。讀 config 時先看 \`alpha\`、\`scale\`、\`color\`、\`speed\`、\`lifetime\`、\`frequency\` 與 \`maxParticles\`。

我當時的筆記範例的 config 很長，但實務上可以先抓住幾個會直接影響畫面的欄位。

| 參數 | 我當時的筆記範例 | 作用 |
|---|---:|---|
| \`alpha\` | \`0.8\` 到 \`0.1\` | 控制粒子從明顯到淡出的透明度變化 |
| \`scale\` | \`1\` 到 \`0.3\` | 控制粒子生命週期中的縮放 |
| \`color\` | \`fb1010\` 到 \`f5b830\` | 控制粒子顏色漸變 |
| \`speed\` | \`200\` 到 \`100\` | 控制粒子移動速度 |
| \`lifetime\` | \`0.5\` 秒 | 控制單一粒子的存活時間 |
| \`frequency\` | \`0.008\` 秒 | 控制每次生成粒子的間隔 |
| \`particlesPerWave\` | \`1\` | 控制每次生成幾個粒子 |
| \`emitterLifetime\` | \`0.31\` 秒 | 控制發射器持續產生新粒子的時間 |
| \`maxParticles\` | \`1000\` | 控制同時存活的粒子上限 |

新版 \`EmitterConfigV3\` 文件仍保留 \`frequency\`、\`lifetime\`、\`maxParticles\`、\`particlesPerWave\`、\`pos\`、\`spawnChance\`、\`emitterLifetime\` 等概念；其中 \`frequency\` 以秒為單位，\`maxParticles\` 表示同一個 emitter 允許同時存在的最大粒子數（\`@pixi/particle-emitter\` EmitterConfigV3，2026 年 8 月存取）。

## Pixi Particles Editor 可以解決什麼問題？

Pixi Particles Editor 適合讓美術或開發者調整粒子 config，再把設定交給程式播放。粒子特效靠數值微調，很難只靠手寫 config 一次到位。

粒子特效的 config 通常需要一個編輯軟體讓美術來調整相關數值。PixiParticles 的編輯器在官網有提供，其網址為：<https://pixijs.io/pixi-particles-editor/#pixieDust>。

![Pixi 粒子系統編輯器畫面，右側可調整粒子參數](/images/tech/pixijs-frame-animation-particle-editor.webp)

資訊增益：我會把 particle editor 當成「效果設計工具」，而不是「程式替代品」。美術調出合適效果後，工程端仍要確認三件事：粒子圖片是否已正確載入、config 版本是否符合目前使用的套件、\`update()\` 是否接到正確的遊戲迴圈。

## PixiJS 粒子特效有哪些效能注意事項？

PixiJS 粒子特效效能要先控管同時存在的粒子數、貼圖尺寸與更新頻率。粒子很好用，但大量粒子每幀更新位置、顏色、縮放與透明度，仍會吃掉 CPU 與 GPU 預算。

我當時的筆記範例把 \`maxParticles\` 設成 \`1000\`，這不是每個專案都適用的魔法數字。手機瀏覽器、低階顯示晶片、較大的粒子貼圖、多個 emitter 同時播放，都可能讓同樣的數量變得太重。

實作時可以用這份檢查表：

1. 先用少量粒子調出方向，再逐步提高 \`maxParticles\`。
2. 粒子貼圖盡量小，避免用大圖只顯示很小的火花。
3. 不需要持續噴發時，把 \`emitter.emit\` 設成 \`false\`。
4. 場景切換或特效結束後，清掉不再使用的 emitter。
5. 若只需要大量簡單粒子，可評估 PixiJS 的 \`ParticleContainer\`；\`ParticleContainer\` 是針對大量粒子最佳化的容器，但粒子只能保留基本屬性，例如位置、縮放、旋轉與顏色（PixiJS ParticleContainer API，2026 年 8 月存取）。

PixiJS v8 對 \`ParticleContainer\` 做過重構，官方 migration guide 也提醒新版粒子容器不再直接把 sprite 當 child，而是使用較輕量的 \`Particle\` 或符合 \`IParticle\` 介面的物件（PixiJS v8 Migration Guide，2026 年 8 月存取）。這代表舊專案升級時，粒子系統不是只改 import 就結束，要先確認目前依賴的是 PixiParticles 的 emitter，還是 PixiJS 內建的粒子容器。

## 常見問題

### PixiParticles 和 PixiJS ParticleContainer 一樣嗎？
PixiParticles 和 PixiJS ParticleContainer 不一樣。PixiParticles 偏向用 emitter 與 config 生成火焰、煙霧、爆炸等特效；PixiJS ParticleContainer 則是用來高效渲染大量簡單粒子的容器。

### PixiParticles 的 \`emitter.update()\` 要傳什麼單位？
PixiParticles 舊版範例中的 \`emitter.update()\` 要傳入秒數。若時間來源是 \`Date.now()\`，毫秒差需要乘上 \`0.001\`，否則粒子生命週期與速度會嚴重失真。

### \`frequency\` 和 \`particlesPerWave\` 差在哪裡？
\`frequency\` 控制多久生成一次粒子，單位是秒。\`particlesPerWave\` 控制每次生成時產生幾個粒子，兩者一起決定粒子密度。

### \`maxParticles\` 設越大越好嗎？
\`maxParticles\` 不是越大越好。數值越大，同時需要更新與渲染的粒子越多，手機或低階裝置更容易掉 FPS；建議從效果能接受的低值開始測。

### Pixi Particles Editor 產生的 config 可以直接用嗎？
Pixi Particles Editor 產生的 config 通常可以作為起點，但仍要確認套件版本。舊版 PixiParticles 與新版 \`@pixi/particle-emitter\` 的 config 結構不完全相同，升級時可能需要轉換。

### 新 PixiJS 專案還應該用 PixiParticles 嗎？
新 PixiJS 專案可以先評估 \`@pixi/particle-emitter\` 與 PixiJS 版本相容性。若專案只需要大量簡單粒子，PixiJS 內建的 \`ParticleContainer\` 也可能更合適。

## 參考資料

- PixiParticles 文件：<https://pixijs.io/pixi-particles/docs/index.html>（存取日期：2026-08-28）
- Pixi Particles Editor：<https://pixijs.io/pixi-particles-editor/#pixieDust>（存取日期：2026-08-28）
- \`@pixi/particle-emitter\` API，Emitter：<https://particle-emitter.pixijs.io/docs/classes/Emitter.html>（存取日期：2026-08-28）
- \`@pixi/particle-emitter\` API，EmitterConfigV3：<https://particle-emitter.pixijs.io/docs/interfaces/EmitterConfigV3.html>（存取日期：2026-08-28）
- PixiJS API，ParticleContainer：<https://pixijs.download/release/docs/scene.ParticleContainer.html>（存取日期：2026-08-28）
- PixiJS v8 Migration Guide：<https://pixijs.com/8.x/guides/migrations/v8>（存取日期：2026-08-28）

## 延伸閱讀

- [PixiJS 按鈕製作基礎：Sprite 互動、ButtonBase 與靜音切換](/post/pixijs-button-basics)：同樣聚焦 PixiJS、遊戲開發，可接著比較不同情境的做法。
- [PixiJS 場景設定教學：Application、Canvas 與自動縮放](/post/pixijs-scene-setup)：同樣聚焦 PixiJS、遊戲開發，可接著比較不同情境的做法。
- [遊戲開發技術介紹：Graphics Library、遊戲平台與遊戲引擎怎麼選？](/post/game-dev-tech-introduction)：同樣聚焦 遊戲開發、PixiJS，可接著比較不同情境的做法。

## 最後更新

2026-08-28
`;export{e as default};