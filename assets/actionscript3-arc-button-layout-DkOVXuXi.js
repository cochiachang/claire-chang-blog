var e=`---
title: "AS3如何把按鈕排成弧形？"
description: "用三角函數把一組物件排成圓弧狀，附ActionScript3完整類別與角度/弧度轉換公式"
date: 2011-08-19
category: 前端開發
tags: [ActionScript, 三角函數, Flash, 版面排列]
readingTime: 5 分鐘
image: /images/tech/hero_actionscript3-arc-button-layout.webp
imageAlt: 由上往下拍攝的同心弧形階梯座位，象徵物件沿弧線等距排列
---


# AS3如何把按鈕排成弧形？

最近在做一個排版需求：把12個按鈕排成弧形，而不是死板的一直線或格線。查了一些三角函數的資料後，寫了一個可以重複使用的排列類別，這篇整理一下核心邏輯與完整程式碼。

## 為什麼AS3裡的sin/cos算出來的角度不對？

因為\`Math.sin()\`和\`Math.cos()\`吃的是弧度（radian），不是角度（degree）。如果直接把角度丟進去，算出來的座標會完全錯開。轉換公式很單純：

\`\`\`
radians = degrees * Math.PI / 180
degrees = radians * 180 / Math.PI
\`\`\`

只要先把角度轉成弧度再傳進三角函數，取出來的x、y值才會是對的。這個轉換要記在骨子裡，因為漏轉一次的結果不是報錯，而是位置微妙地偏掉，很容易讓人以為是別的地方出問題。

## 排出弧形版面的整體邏輯是什麼？

把一群物件排成弧形，可以拆成三步：

1. 先用弧形的起點、終點x座標和半徑，反推出圓心座標。
2. 算出整段弧線涵蓋的角度，再依物件數量平分成等份。
3. 對每個物件，用「取樣角度」算出它在圓周上的座標，擺上去之後同時處理旋轉角度。

以下是我寫的\`ArrangeTool\`類別，做成singleton方便任何地方呼叫：

\`\`\`ActionScript
package com.demo
{
    import flash.geom.Point;

    public final class ArrangeTool
    {
        private static var instance:ArrangeTool;
        public static function getInstance():ArrangeTool{
            if (instance == null){
                instance = new ArrangeTool();
            }
            return instance;
        }
        /**
         * 將物件排成弧型
         */
        public function drawArc(startX:int,endX:int,Y:int,radius:int,items:Array):void{
            //先算出圓心座標
            var center:Point = new Point((startX+endX)/2,Y+Math.sqrt(radius*radius-Math.pow(startX-endX,2)/4));
            //將該區域的圓切成相同大小等份，先算整個弧線的角度，以角度切
            var totalAngel:int = Math.asin((endX - center.x)/radius)*360/Math.PI;
            var onePiece:int = totalAngel/(items.length-1);
            //要取出該弧形的點的座標及角度
            var angle:int;
            for(var i:int=0;i<items.length;i++){
                angle = 90-(totalAngel/2)+onePiece*i;
                var tmp:Point = getPoint(radius,angle);
                items[i].x = center.x-tmp.x-(items[i].width/2);
                items[i].y = center.y-tmp.y-(items[i].height/2);
                //以程式改變註冊點
                var A:Point=items[i].localToGlobal(new Point(items[i].width/2,items[i].height/2));
                items[i].rotation = (angle-90);
                var B:Point=items[i].localToGlobal(new Point(items[i].width/2,items[i].height/2));
                items[i].x-=B.x-A.x;
                items[i].y-=B.y-A.y;
            }
        }
        private function getPoint(radius:int,angel:int):Point{
            var y:int = Math.sin(angel*Math.PI/180)*radius;
            var x:int = Math.cos(angel*Math.PI/180)*radius;
            return new Point(x,y);
        }
    }
}
\`\`\`

呼叫方式很直接，傳入弧形的起點x、終點x、水平參考y座標、半徑，以及要排列的物件陣列：

\`\`\`ActionScript
ArrangeTool.getInstance().drawArc(100,500,100,400,canvasContent);
//弧形開端、弧形結束端、水平y座標、半徑、存放要排列的物件的陣列
\`\`\`

## 圓心座標是怎麼反推出來的？

\`drawArc\`的第一步是用畢氏定理反推圓心。已知弧形的起點x、終點x和半徑，弦長的一半是\`(startX-endX)/2\`，配合半徑就能用\`Math.sqrt(radius*radius - Math.pow(startX-endX,2)/4)\`算出圓心相對於\`Y\`的垂直距離。圓心的x座標則直接取起點和終點的中點\`(startX+endX)/2\`。

這一步算是整個排列邏輯的地基——後面所有座標都是相對這個圓心去取樣，如果圓心算錯，弧形會整個歪掉或半徑對不上。

## 為什麼旋轉角度要另外處理位移？

排列時不只是把物件擺到弧線上的座標，還要讓每個物件面向圓心方向旋轉，看起來才像是沿著弧線排開，而不是一堆方向雜亂的按鈕。麻煩的地方在於：Flash的顯示物件預設以左上角為註冊點旋轉，直接設定\`rotation\`會讓物件繞著左上角轉，导致視覺中心點跑掉。

程式裡的解法是：先記錄旋轉前物件中心點的全域座標（\`A\`），設定\`rotation\`之後再取一次旋轉後的全域座標（\`B\`），用兩者的差值把\`x\`、\`y\`修正回來，等於是用程式手動把註冊點校正到物件中心，而不用真的去改註冊點本身。

## 常見問題

### 這個方法只能用在ActionScript3嗎？

核心是純數學（圓心反推＋弧度取樣），概念可以套用到任何有sin/cos函數的語言，只是座標系統、旋轉API的細節要跟著平台調整。

### 物件數量只有1個時會出錯嗎？

會。\`onePiece = totalAngel/(items.length-1)\`在只有一個物件時會除以0，這個類別假設至少要排兩個以上的物件。

### 半徑設太小或起訖點距離超過半徑會怎樣？

\`Math.sqrt\`裡的值會變成負數導致算出\`NaN\`，因為此時起訖點的弦長已經超過該半徑能涵蓋的範圍，兩點畫不出這個圓。使用前要確保\`radius\`大於等於\`(endX-startX)/2\`。

## 參考資料
- Adobe ActionScript 3 (AS3) API Reference，Math 類別文件（\`sin\`、\`cos\`、\`atan2\` 等三角函數方法說明），存取日期：2026-08-27。[https://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/Math.html](https://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/Math.html)

## 延伸閱讀

- [在瀏覽器內插入 Flash 的幾種設定：透明、全螢幕與 Script 存取](/post/insert-flash-in-browser-settings)：同樣聚焦 Flash、ActionScript，可接著比較不同情境的做法。
- [Stage3D 運作原理：Flash 如何用 GPU 完成 3D 渲染？](/post/stage3d-rendering-principles)：同樣聚焦 ActionScript、Flash，可接著比較不同情境的做法。
- [在瀏覽器內插入 Flash 的幾種設定：透明、全螢幕與 JavaScript 存取](/post/browser-embed-flash-settings)：同樣聚焦 Flash、ActionScript，可接著比較不同情境的做法。
`;export{e as default};