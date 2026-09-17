var e=`---
title: Starling Display Objects：Button 與 Sprite 實作重點
description: 整理 Starling Button、Sprite、Event.TRIGGERED、hitTest 與 flatten 的使用方式與注意事項。
date: 2014-02-08
category: 前端開發
tags: [Starling, ActionScript, AIR, DisplayObject]
readingTime: 8 分鐘
image: /images/tech/hero_starling-display-objects-button-sprite.webp
imageAlt: 2D 遊戲介面中的按鈕與顯示物件層級
---


# Starling Display Objects：Button 與 Sprite 實作重點

Starling 的 Display Objects 架構延續 Flash 顯示清單概念，\`starling.display.Button\` 適合建立可觸發事件的按鈕，\`starling.display.Sprite\` 則是用來承載多個顯示物件的容器。

## Starling Button 和 Flash SimpleButton 差在哪裡？

Starling Button 主要使用 upState 與 downState 兩個材質狀態。Flash SimpleButton 常見的 over 狀態在 Starling Button 中不是同樣設計，disabled 外觀可透過 \`alphaWhenDisabled\` 控制。

監聽 Button 點擊時，Starling 常用 \`Event.TRIGGERED\`：

\`\`\`actionscript
menuContainer.addEventListener(Event.TRIGGERED, onTriggered);

private function onTriggered(e:Event):void {
    trace(e.currentTarget, e.target);
    trace("triggered!");
}
\`\`\`

\`currentTarget\` 是掛監聽器的物件，\`target\` 是實際觸發事件的物件。這在容器裡有多個按鈕時特別重要。

## 如何建立 Starling Button？

Starling Button 需要把圖片轉成 Texture，再用 Texture 建立按鈕。按鈕通常會被放進 Sprite 容器，方便一起定位與管理。

基本範例：

\`\`\`actionscript
package {
    import flash.display.Bitmap;
    import starling.display.Button;
    import starling.display.Sprite;
    import starling.events.Event;
    import starling.textures.Texture;

    public class Game extends Sprite {
        [Embed(source = "../media/textures/button_up.png")]
        private static const Button_UP:Class;

        [Embed(source = "../media/textures/button_down.png")]
        private static const Button_DOWN:Class;

        public function Game() {
            addEventListener(Event.ADDED_TO_STAGE, onAdded);
        }

        private function onAdded(e:Event):void {
            var buttonSkinUp:Bitmap = new Button_UP();
            var buttonSkinDown:Bitmap = new Button_DOWN();

            var myButton:Button = new Button(
                Texture.fromBitmap(buttonSkinUp),
                "這是按鈕",
                Texture.fromBitmap(buttonSkinDown)
            );

            var menuContainer:Sprite = new Sprite();
            menuContainer.addChild(myButton);
            menuContainer.x = stage.stageWidth - menuContainer.width >> 1;
            menuContainer.y = stage.stageHeight - menuContainer.height >> 1;
            addChild(menuContainer);
        }
    }
}
\`\`\`

原稿的實務提醒是：按鈕素材不只要看視覺大小，也要確認互動範圍是否符合玩家直覺。

## Starling 如何處理 hitTest？

Starling 沒有直接沿用 Flash hit area 的操作方式。若需要自訂點擊範圍，可以覆寫 \`hitTest\`，用 Rectangle 或其他邏輯判斷是否命中。

範例：

\`\`\`actionscript
public override function hitTest(localPoint:Point, forTouch:Boolean=false):DisplayObject
{
    if (forTouch && (!visible || !touchable)) {
        return null;
    }

    var result:DisplayObject = null;
    if (_hitArea.containsPoint(localPoint)) {
        result = this;
    }

    return result;
}
\`\`\`

若需要偵測透明區域是否被點擊，可以回到原生 \`BitmapData.hitTest\` 思路。遊戲 UI 最好避免讓可點擊範圍和視覺範圍差太多，否則玩家會覺得操作不穩。

## Starling Sprite 適合做什麼？

Starling Sprite 是標準顯示容器，適合放置多個 DisplayObject 並一起移動、顯示或移除。Sprite 繼承 DisplayObjectContainer，因此可用來組合 UI、角色部件與遊戲場景元素。

常見事件：

- \`Event.ADDED\`：物件被加入 parent。
- \`Event.ADDED_TO_STAGE\`：物件被加入連到 stage 的 parent。
- \`Event.REMOVED\`：物件從 parent 移除。
- \`Event.REMOVED_FROM_STAGE\`：物件離開 stage。
- \`KeyboardEvent.KEY_DOWN\`：按鍵按下。
- \`KeyboardEvent.KEY_UP\`：按鍵放開。
- \`EnterFrameEvent.ENTER_FRAME\`：影格更新。
- \`Event.FLATTEN\`：flatten 狀態改變。

Sprite 很適合當作功能單位。例如主選單、角色容器、粒子容器都可以各自是一個 Sprite。

## flatten 屬性要注意什麼？

Starling Sprite 的 flatten 可提升靜態內容渲染效率，但 flatten 後的 alpha、rotation、位置變化不一定會如預期更新。flatten 適合靜態或少變動的顯示群組，不適合持續動畫中的物件。

使用判斷：

| 場景 | 是否適合 flatten |
|---|---|
| 靜態背景元素 | 適合 |
| 不會逐幀改變的 UI 群組 | 可評估 |
| 角色動畫 | 不適合 |
| 按鈕縮放與互動效果 | 不適合 |

資訊增益建議：若畫面效能不佳，先用 profiling 確認瓶頸，再針對靜態顯示群組測試 flatten。不要把 flatten 當成通用效能開關。

## 常見問題

### Starling Button 點擊事件要聽哪一個？

Starling Button 常用 \`Event.TRIGGERED\` 監聽按下事件。若監聽器掛在容器上，要用 \`target\` 分辨實際觸發的按鈕。

### Starling Button 有 hover 狀態嗎？

Starling Button 的常見設計是 upState 與 downState。若要 hover 或更細緻狀態，通常需要自行擴充互動事件與材質切換。

### Starling Sprite 和 DisplayObjectContainer 差在哪裡？

Starling Sprite 是 DisplayObjectContainer 的常用子類別，適合直接作為容器使用。Sprite 額外提供 flatten 等功能，方便管理顯示群組效能。

### Starling 要怎麼做不規則點擊範圍？

可以覆寫 \`hitTest\` 或使用像素層級判斷。實作前要確認互動需求，因為像素級 hit test 可能增加計算成本。

### flatten 可以提升所有動畫效能嗎？

flatten 不適合所有動畫。flatten 比較適合靜態內容，若物件位置、旋轉、透明度持續改變，flatten 可能造成畫面更新問題。

## 參考資料

- Starling Framework, Button API：<https://doc.starling-framework.org/core/starling/display/Button.html>
- Starling Framework, Sprite API：<https://doc.starling-framework.org/core/starling/display/Sprite.html>
- Starling Framework, DisplayObjectContainer API：<https://doc.starling-framework.org/core/starling/display/DisplayObjectContainer.html>
- Adobe, BitmapData hitTest：<https://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/display/BitmapData.html#hitTest()>

## 延伸閱讀

- [Starling Display Objects 介紹：Starling 啟動、物件樹與 Stage](/post/starling-display-objects-introduction)：同樣聚焦 Starling、ActionScript，可接著比較不同情境的做法。
- [Starling Display Objects：Quad 與 Image 物件解析](/post/starling-quad-image-display-objects)：同樣聚焦 Starling、ActionScript，可接著比較不同情境的做法。
- [Starling Framework簡介](/post/starling-framework-intro)：同樣聚焦 ActionScript、Starling，可接著比較不同情境的做法。

## 最後更新

2026-08-28

`;export{e as default};