var e=`---
title: Starling Display Objects：Quad 與 Image 物件解析
description: 說明 Starling 的 Quad、Image 顯示物件與 VertexData 頂點資料運作方式及實作範例。
date: 2014-02-11
category: 前端開發
tags: [Starling, ActionScript, AIR, DisplayObject]
readingTime: 7 分鐘
image: /images/tech/hero_starling-quad-image-display-objects.webp
imageAlt: Starling 顯示物件類別繼承關係圖，Quad 與 Image 位於右側分支
---


# Starling Display Objects：Quad 與 Image 物件解析

這篇是「Starling 的 Display Objects 介紹」系列的第四篇，接續前面對 Button、Sprite 的討論，這次要看 \`starling.display.Quad\` 和 \`starling.display.Image\`——兩個負責畫面上「畫出東西」的基礎物件。從類別繼承關係來看，Quad 是 Image 的父類別，搞懂 Quad 在做什麼，Image 自然就清楚了。

## Quad 是什麼，它跟顏色有什麼關係？

Quad 代表一個可以填滿單一顏色或線性漸層色的四邊形。四個頂點各自可以設定顏色，如果只想要單色就四個頂點都給同一個色值；想要漸層的話，把一個顏色設給頂點 0 和頂點 1，另一個顏色設給頂點 2 和頂點 3 即可。

頂點的排列位置官方文件是這樣畫的：

\`\`\`
0 - 1
| / |
2 - 3
\`\`\`

官方 API 文件在這裡：[starling.display.Quad](http://doc.starling-framework.org/core/starling/display/Quad.html)。

## Quad 裡的 mVertexData 是什麼,跟 3D 渲染有關係嗎?

打開 Quad 的原始碼會看到一個叫 \`mVertexData\` 的屬性，這跟 Starling 底層是建立在 Stage3D 之上有關。Stage3D 本質上是一組 3 維座標，透過矩陣運算投影到 2D 螢幕，算出對應的 2D 畫面座標——這是所有 3D 渲染引擎的共同套路，可以參考 3D 渲染基礎原理（原文已刪除） 和 [VertexData 官方說明](https://doc.starling-framework.org/v2.7/starling/utils/VertexData.html)。

Starling 做的是 2D 遊戲，所以用的是正交投影（orthographic projection），直接捨棄 z 軸的值，把頂點座標從 3 維降到 2 維。原理沒變，只是這裡輸入的頂點資料剛好就是一個四邊形的四個角。

## 怎麼用 Quad 畫一個純色方塊?

下面這段範例會產生一個 200×200、顏色是綠色的方塊，並置中顯示在畫面上：

\`\`\`actionscript
package {
    import starling.display.Quad;
    import starling.display.Sprite;
    import starling.events.Event;
    public class Game extends Sprite {
        private var q:Quad;
        public function Game() {
            addEventListener(Event.ADDED_TO_STAGE, onAdded);
        }
        private function onAdded ( e:Event ):void {
            q = new Quad(200, 200);
            q.color = 0x00FF00;
            q.x = stage.stageWidth - q.width >> 1;
            q.y = stage.stageHeight - q.height >> 1;
            addChild ( q );
        }
    }
}
\`\`\`

\`q.color\` 直接指定四個頂點同一個顏色；\`x\`、\`y\` 的計算用了位移運算子 \`>> 1\` 取代除以 2，效果是把方塊置中在畫面上。

## Image 跟 Quad 是什麼關係?

Image 繼承自 Quad,可以想成是「貼了材質（Texture）的四邊形」。一張圖片說到底就是一個四邊形，上面貼了一張 [Texture](http://doc.starling-framework.org/core/starling/textures/Texture.html)。Image 相當於 Flash 的 Bitmap 在 Starling 世界的對應版本,差別是 Starling 用 Texture 取代 BitmapData 來提供像素資料。要顯示一張 Texture,就得先把它映射到一個四邊形上,而這正是 Image 這個類別的工作。

官方 API 文件:[starling.display.Image](http://doc.starling-framework.org/core/starling/display/Image.html)。

![一個貼了娃娃圖案材質的 Image 物件範例](/images/tech/starling-image-texture-example.webp)

## 為什麼 Image 也能設定顏色?

因為 Image 繼承自 Quad,所以 Quad 能做的事(設定顏色)Image 一樣能做。實際顯示出來的每個像素顏色,是材質本身的顏色乘上四邊形設定的顏色算出來的結果。這個特性有兩個實用之處:

- 不換材質,直接改 Quad 的顏色值就能改變貼圖的色調
- 不動四邊形的頂點座標,也能在圖片內部移動材質——用這招可以很有效率地做出矩形遮罩效果

## Image 的基本使用範例是什麼樣子?

下面範例示範怎麼把一張內嵌的 PNG 轉成 Texture,再建立 400 個 Image 物件、隨機設定位置、透明度和旋轉角度後加到畫面上:

\`\`\`actionscript
package {
    import flash.display.Bitmap;
    import starling.display.Image;
    import starling.display.Sprite;
    import starling.events.Event;
    import starling.textures.Texture;
    import starling.utils.deg2rad;
    public class Game2 extends Sprite {
        private var sausagesVector:Vector.<Image> = new Vector.<Image>(NUM_SAUSAGES, true);
        private const NUM_SAUSAGES:uint = 400;

        [Embed(source = "boy.png")]
        private static const Sausage:Class;

        public function Game2() {
            addEventListener(Event.ADDED_TO_STAGE, onAdded);
        }

        private function onAdded (e:Event):void {
            // 把內嵌圖片轉成 Bitmap 物件
            var sausageBitmap:Bitmap = new Sausage();
            // 用 Bitmap 建立 Texture,提供給 Image 使用
            var texture:Texture = Texture.fromBitmap(sausageBitmap);
            for (var i:int = 0; i < NUM_SAUSAGES; i++) {
                // 用同一個 texture 建立 Image 物件
                var image:Image = new Image(texture);
                // 隨機設定透明度、位置、旋轉角度
                image.alpha = Math.random();
                image.x = Math.random()*stage.stageWidth;
                image.y = Math.random()*stage.stageHeight;
                image.rotation = deg2rad(Math.random()*360);
                addChild(image);
                // 保留參考,方便之後操作
                sausagesVector[i] = image;
            }
        }
    }
}
\`\`\`

這裡值得注意的是同一張 Texture 被 400 個 Image 物件共用——材質資料只存一份,重複利用來畫很多個實例,這也是遊戲引擎常見的省記憶體做法。

## 常見問題

### Quad 跟 Sprite 有什麼不同?

Sprite 是容器,本身不畫任何東西,用來裝其他顯示物件;Quad 則是實際會畫出色塊的物件,兩者在繼承關係上是平行的,都直接繼承自 DisplayObjectContainer 分支下的不同節點。

### 一定要用 Image 才能顯示圖片嗎?

在 Starling 裡,凡是要顯示材質(Texture)畫面內容,幾乎都會用到 Image 或它的子類別(例如 MovieClip)。Quad 本身不能貼材質,只能填色。

### 為什麼範例裡用 \`>> 1\` 而不是 \`/ 2\`?

這是 ActionScript 常見的效能寫法,位移運算子在早期 Flash/AIR 環境下比除法運算快,效果等同除以 2 再取整數。

## 參考資料

Gamua，Starling Framework 官方網站，介紹以 ActionScript 3 實作、模仿 Flash display list 架構的 2D 跨平台遊戲引擎，存取日期：2026-08-27。[https://gamua.com/starling/](https://gamua.com/starling/)

## 延伸閱讀

- [Starling Display Objects 介紹：Starling 啟動、物件樹與 Stage](/post/starling-display-objects-introduction)：同樣聚焦 Starling、ActionScript，可接著比較不同情境的做法。
- [Starling Display Objects：Button 與 Sprite 實作重點](/post/starling-display-objects-button-sprite)：同樣聚焦 Starling、ActionScript，可接著比較不同情境的做法。
- [Starling Framework簡介](/post/starling-framework-intro)：同樣聚焦 ActionScript、Starling，可接著比較不同情境的做法。
`;export{e as default};