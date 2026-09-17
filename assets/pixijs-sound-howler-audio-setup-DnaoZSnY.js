var e=`---
title: PixiJS 音樂音效設定：PixiJS Sound 與 Howler.js 怎麼選？
description: 說明 PixiJS 專案中使用 PixiJS Sound 或 Howler.js 管理音樂音效，並整理 TypeScript 封裝方式。
date: 2018-11-01
category: 前端開發
tags: [PixiJS, Howler.js, PixiJS Sound, Audio]
readingTime: 7 分鐘
image: /images/tech/hero_pixijs-sound-howler-audio-setup.webp
imageAlt: 網頁遊戲音效波形與程式碼編輯器
---


# PixiJS 音樂音效設定：PixiJS Sound 與 Howler.js 怎麼選？

PixiJS 專案可以用 PixiJS Sound 或 Howler.js 管理音樂音效。若希望和 PixiJS loader 整合，可評估 PixiJS Sound；若重視跨瀏覽器音訊 API 與 TypeScript 專案彈性，Howler.js 也很常見。

## PixiJS Sound 適合什麼情境？

PixiJS Sound 是 PixiJS 生態系的音訊套件，適合想讓音檔與 PixiJS 素材載入流程整合的專案。PixiJS Sound 支援常見音訊格式，也能處理音效 sprite。

PixiJS Sound 的優點：

- 可與 PixiJS 專案思維整合。
- 適合遊戲音效與背景音樂。
- 支援多音訊格式與音效片段。
- 官方 examples 可快速查用法。

原稿的判斷是：一般 PixiJS 專案若沒有特殊 TypeScript 限制，PixiJS Sound 可以作為首選音樂函式庫。

## Howler.js 適合什麼情境？

Howler.js 是通用 JavaScript 音訊函式庫，適合需要穩定跨瀏覽器音效控制的專案。Howler.js 不依賴 PixiJS，因此也能用在非 PixiJS 的網頁互動或遊戲架構。

Howler.js 基本範例：

\`\`\`js
var sound = new Howl({
  src: ['sound.webm', 'sound.mp3']
});

sound.once('load', function() {
  sound.play();
});

sound.on('end', function() {
  console.log('Finished!');
});
\`\`\`

背景音樂範例：

\`\`\`js
var sound = new Howl({
  src: ['sound.webm', 'sound.mp3', 'sound.wav'],
  autoplay: true,
  loop: true,
  volume: 0.5,
  onend: function() {
    console.log('Finished!');
  }
});
\`\`\`

Howler.js 的代價是它有自己的載入流程。若圖片走 PixiJS loader、音效走 Howler.js，就要另外處理「音效是否已載入完成」這個條件。

## 如何在 TypeScript 專案定義音效清單？

音效清單應該和圖片清單一樣集中管理。集中管理可以避免音效 id 散落在各個按鈕、關卡與角色類別裡。

範例：

\`\`\`ts
public static sound: Array<Resources> = [
  new Resources('Sound_bg', 'assets/bg.mp3'),
  new Resources('Sound_level_pass', 'assets/level_pass.mp3'),
  new Resources('Sound_select_1', 'assets/select_1.mp3'),
  new Resources('Sound_select_correct', 'assets/select_correct.mp3'),
  new Resources('Sound_select_error', 'assets/select_error.mp3'),
];
\`\`\`

音效 id 建議使用一致命名規則，例如 \`Bgm_\`、\`Sfx_\` 或依功能區分。這樣未來替換素材或做音量分類時比較容易。

## 如何封裝 SoundMgr？

SoundMgr 可以把音效載入與播放封裝起來，讓遊戲其他模組只呼叫 \`SoundMgr.play(id)\`。這樣音訊函式庫更換時，影響範圍會比較小。

原稿範例整理如下：

\`\`\`ts
import { ResourcesList } from "./ResourcesList";

export class SoundMgr {
  private static soundList: Array<SoundInfo> = [];

  public static load() {
    ResourcesList.sound.forEach(element => {
      let info = new SoundInfo(element.id, element.path);
      this.soundList.push(info);
    });
  }

  public static play(id: string, loop = false) {
    this.soundList.forEach(element => {
      if (element.soundID === id) {
        element.sound.loop(loop);
        element.sound.play();
      }
    });
  }
}

class SoundInfo {
  public soundID: string;
  public path: string;
  public sound: Howl;

  constructor(id: string, url: string) {
    this.soundID = id;
    this.path = url;
    this.load();
  }

  public load() {
    this.sound = new Howl({ src: this.path });
  }
}
\`\`\`

在 \`Main.ts\` 中可先載入，再播放背景音樂：

\`\`\`ts
SoundMgr.load();
SoundMgr.play('Sound_bg', true);
\`\`\`

## 音效載入和遊戲進場要怎麼同步？

音效載入應該被納入 loading gate。若 Howler.js 和 PixiJS 使用不同 loader，只檢查圖片完成會導致遊戲進場時音效尚未可播放。

建議做法：

1. 圖片與音效各自回報載入狀態。
2. loading page 等必要圖片與必要音效都完成。
3. 音效失敗時提供靜音降級，而不是讓遊戲卡死。
4. 背景音樂播放要考慮瀏覽器 autoplay 限制，通常需要使用者互動後播放。

資訊增益提醒：瀏覽器音訊政策會影響背景音樂。即使音檔已載入，沒有使用者點擊或觸控時，背景音樂也可能被瀏覽器阻擋。

## 常見問題

### PixiJS 一定要用 PixiJS Sound 嗎？

PixiJS 不一定要用 PixiJS Sound。PixiJS Sound 和 Howler.js 都可以使用，選擇取決於 loader 整合、TypeScript 支援與專案架構。

### Howler.js 可以播放背景音樂嗎？

Howler.js 可以播放背景音樂並設定 loop、volume 與事件監聽。實務上仍要注意瀏覽器 autoplay 限制。

### 為什麼遊戲一開始沒有聲音？

常見原因是音效尚未載入完成，或瀏覽器阻擋自動播放。應把音效載入狀態納入 loading gate，並在使用者互動後啟動背景音樂。

### 音效 id 應該怎麼命名？

音效 id 建議用功能與類型命名，例如 \`Bgm_main\`、\`Sfx_select\`、\`Sfx_error\`。一致命名能降低大型專案維護成本。

### 音效載入失敗要讓遊戲停止嗎？

關鍵語音或節奏遊戲音效可能需要停止。一般背景音樂或按鈕音效可降級成靜音，並記錄錯誤供後續排查。

## 參考資料

- PixiJS Sound GitHub：<https://github.com/pixijs/sound>
- PixiJS Sound Examples：<https://pixijs.io/sound/examples/>
- Howler.js 官方網站：<https://howlerjs.com/>
- Howler.js GitHub：<https://github.com/goldfire/howler.js>

## 延伸閱讀

- [PixiJS 介紹：2D WebGL 遊戲引擎適合做什麼？](/post/pixijs-introduction-2d-webgl-game-engine)：同樣聚焦 PixiJS，可接著比較不同情境的做法。
- [PixiJS 場景設定教學：Application、Canvas 與自動縮放](/post/pixijs-scene-setup)：同樣聚焦 PixiJS，可接著比較不同情境的做法。
- [PixiJS 載入素材教學：Loader、Spritesheet 與進度事件](/post/pixijs-load-assets-loader)：同樣聚焦 PixiJS，可接著比較不同情境的做法。

## 最後更新

2026-08-28

`;export{e as default};