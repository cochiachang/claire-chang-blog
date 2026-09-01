var e=`---
title: "Starling Framework簡介"
description: "Starling是基於Stage3D的2D渲染框架，用GPU三角形繪圖模擬2D畫面，本文說明其運作原理與基本範例"
date: 2014-02-01
category: 前端開發
tags: [ActionScript, Starling, Stage3D, AIR, 遊戲開發]
readingTime: 7 分鐘
image: /images/tech/hero_starling-framework-intro.webp
imageAlt: GPU顯示卡特寫，象徵Starling底層依賴的GPU繪圖運算
---


# Starling Framework簡介

## Starling是什麼，跟Stage3D是什麼關係？

Starling是一套建立在Stage3D之上的2D渲染框架，讓Flash/AIR開發者可以用接近原生Flash的寫法，享受GPU加速帶來的效能。要弄懂Starling，得先搞懂它下面那一層——Stage3D。Stage3D是Adobe提供的底層3D繪圖API，直接對接裝置的GPU，運作方式和OpenGL、DirectX這類傳統3D API類似，關於它的細節可以看[Stage3D運作原理](http://claire-chang.com/1814-stage3d%E9%81%8B%E4%BD%9C%E5%8E%9F%E7%90%86)這篇。

Stage3D在不同平台上會接到不同的底層引擎：Mac上是OpenGL，Windows則依硬體去挑合適的技術。就算遇到完全不支援的顯示卡，Stage3D也能退回軟體模式硬撐下去，只是速度會慢得很明顯。想知道差多少，可以參考這篇[Stage3D vs WebGL性能較量](http://www.hiwebgl.com/?p=535)的測試。

技術堆疊由上到下大致長這樣：

![Starling layer on top of Stage3D](/images/tech/starling-stage3d-layers.webp)

GPU在最底層，往上是OpenGL/DirectX，再往上是Stage3D（也叫Molehill），Starling則蓋在最頂端，把這些底層細節包裝成開發者熟悉的顯示物件API。

## Starling怎麼用3D引擎畫出2D畫面？

早期很多人一看到Stage3D這個名字，就以為它只能拿來做3D，其實不然。3D渲染的基本單位是三角形，畫面由大量三角形堆出來；2D向量圖形則是由頂點組成的多邊形。差異看起來很大，但Starling找到了橋接兩者的做法。

作法很直接：把圖片存成png或jpg，再把每張圖當成兩個三角形拼出的矩形，貼上材質貼圖畫上去。GPU本來就最擅長畫三角形和貼材質，Starling等於是借GPU的長處來做2D渲染，換來比純CPU運算快得多的效能。

![drawTriangles加上材質貼圖等於2D畫面](/images/tech/starling-drawtriangles-quad.webp)

一次\`drawTriangles()\`呼叫配上一張材質貼圖，就能畫出一整排角色，這也是Starling能同時渲染大量物件還能維持流暢畫面的原因。

## 一個最簡單的Starling範例長什麼樣子？

下面是最基本的Starling程式骨架，取自官方範例 StarlingTest（原下載連結已失效）。入口類別只需要建立一個\`Starling\`實例並啟動：

\`\`\`java
package
{
	import flash.display.Sprite;

	import starling.core.Starling;

	[SWF(frameRate="60",Width="800",Height="600")]
	public class StarlingTest extends Sprite
	{
		public function StarlingTest()
		{
			var star:Starling = new Starling(Main, stage);
			star.start();
		}
	}
}
\`\`\`

實際的畫面邏輯則寫在傳進去的\`Main\`類別裡，這裡示範讀取材質圖集（texture atlas）並播放一段動畫序列：

\`\`\`java
package
{
	import starling.core.Starling;
	import starling.display.MovieClip;
	import starling.display.Sprite;
	import starling.textures.Texture;
	import starling.textures.TextureAtlas;

	public class Main extends Sprite
	{
		[Embed(source = 'test.xml', mimeType = 'application/octet-stream')]
		private var AtlasXML:Class;

		[Embed(source = 'test.png')]
		private var AtlasTexture:Class;

		public function Main()
		{
			var texture:Texture = Texture.fromBitmap(new AtlasTexture());
			var xml:XML = XML(new AtlasXML());
			var atlas:TextureAtlas = new TextureAtlas(texture, xml);

			var mc:MovieClip = new MovieClip(atlas.getTextures("run"),30);
			addChild(mc);

			Starling.juggler.add(mc);
		}
	}
}
\`\`\`

\`atlas.getTextures("run")\`把圖集裡所有以"run"開頭的貼圖抓出來，組成一個\`MovieClip\`的影格序列，再丟進\`Starling.juggler\`讓它自己跑動畫——juggler就是Starling管理所有動畫、計時器的排程器。

## starling.display.MovieClip跟flash.display.MovieClip是同一回事嗎？

不是,而且差異相當根本。雖然Starling故意讓API長得很像原生Flash，方便開發者無痛上手，但骨子裡完全是兩套不同的東西：影格運作方式、圖形渲染方式、碰撞偵測、事件傳遞，全部都不一樣。原因很簡單——Starling是用3D去模擬2D，原生Flash則是純粹用CPU算圖。

所以\`starling.display.MovieClip\`跟\`flash.display.MovieClip\`只是撞名，用法和底層行為完全不同,不能拿原生Flash的經驗直接套用。建議把Starling當一套全新的framework重新學,而不是「看起來很像原生Flash」就照本能去寫。

兩者在畫面圖層上也各自獨立，分層大致如下：

![Display List、Stage3D、StageVideo三層圖層關係](/images/tech/starling-displaylist-layering.webp)

用\`flash.display.*\`產生的畫面永遠疊在最上層的Display List；Stage3D物件（也就是Starling內容）在它下面；StageVideo這種能用GPU播放影片的內容則墊在最底層。

## Starling能跟原生Flash的DisplayObject混用嗎？

不太行，這是實務上最容易踩的坑之一。由於原生flash畫面永遠蓋在Starling內容之上,兩者沒辦法自然地混合疊加使用。另外用Starling嵌入swf到網頁時,一定要把\`wmode\`設成\`direct\`——Starling不支援透明嵌入,設錯的話畫面會直接跳錯誤訊息：

![wmode設定錯誤時出現的錯誤畫面](/images/tech/starling-wmode-error.webp)

如果真的需要在Starling場景裡放原生Flash物件（例如一個可以打字的文字輸入框，Starling自己的TextField並不支援輸入），可以透過\`nativeOverlay\`把原生物件疊上去：

\`\`\`java
var textInput:flash.text.TextField = new flash.text.TextField();
textInput.type = TextFieldType.INPUT;
Starling.current.nativeOverlay.addChild(textInput);
\`\`\`

官方文件對\`nativeOverlay\`的說明是這樣：它會回傳一個直接蓋在Starling內容上方的Flash Sprite，可以把一般的Flash物件加進這個overlay。但要注意，3D內容上方疊原生Flash內容在部分（尤其行動）裝置上可能拖累效能，所以用完記得把子物件都移除——Starling會在overlay清空時自動把它從顯示清單移掉。

透過\`nativeOverlay\`加進場景的物件，同樣永遠會顯示在最上層，這點跟原生Flash疊加的限制是一致的。想要更完整的文字輸入實作方式，可以參考[Text Input with Starling framework](http://in4ray.blogspot.tw/2012/05/text-input-with-starling-framework.html)這篇教學。

## 常見問題

### Starling支援哪些平台？

Starling基於Stage3D，因此凡是Stage3D能跑的平台（桌面Flash Player、AIR桌面應用、iOS/Android上的AIR）理論上都能用，實際效能則取決於裝置GPU是否支援硬體加速。

### 沒有GPU或驅動不支援時Starling還能用嗎？

可以，Stage3D會退回軟體渲染模式繼續運作,但速度會明顯變慢,不適合正式上線環境依賴這個模式。

### 該去哪裡查Starling的API細節？

官方的[Starling Framework Reference](http://doc.starling-framework.org/core/)是最直接的參考來源，很多類別名稱雖然跟原生Flash相似，用法細節仍需要對照文件確認。

## 參考資料

- [一起來玩鳥 Starling Framework](http://grayliao.blogspot.tw/2011/11/starling-framework0.html)
- [Introducing the Starling Framework](http://gotoandlearn.com/play.php?id=147)
- [Hungry Hero Game](http://www.hungryherogame.com/)
- [Starling的Display Objects介紹（一）](http://claire-chang.com/1881-starling%E7%9A%84display-objects%E4%BB%8B%E7%B4%B9%EF%BC%88%E4%B8%80%EF%BC%89)


## 延伸閱讀

- [Starling簡報分享：基於Stage3D的GPU加速2D渲染框架入門](/post/starling-stage3d-presentation)：同樣聚焦 Starling、Stage3D，可接著比較不同情境的做法。
- [Starling Display Objects 介紹：Starling 啟動、物件樹與 Stage](/post/starling-display-objects-introduction)：同樣聚焦 Starling、ActionScript，可接著比較不同情境的做法。
- [Starling Display Objects：Button 與 Sprite 實作重點](/post/starling-display-objects-button-sprite)：同樣聚焦 Starling、ActionScript，可接著比較不同情境的做法。
`;export{e as default};