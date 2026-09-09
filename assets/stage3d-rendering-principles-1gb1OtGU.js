var e=`---
title: Stage3D 運作原理：Flash 如何用 GPU 完成 3D 渲染？
description: 說明 Stage3D 如何把 Flash 3D 渲染從 CPU 軟體模式轉到 GPU 硬體加速，並整理 rendering pipeline、shader、Stage3D 與 Display List 的層級關係。
date: 2014-01-30
category: 前端開發
tags: [Stage3D, ActionScript, Flash, GPU, 3D渲染]
readingTime: 10 分鐘
image: /images/tech/stage3d-programmable-pipeline.webp
imageAlt: Stage3D 可編程圖形渲染管線流程圖
---


# Stage3D 運作原理：Flash 如何用 GPU 完成 3D 渲染？

Stage3D 是 Flash Player 11 與 AIR 3 之後提供的底層 3D 繪圖 API，核心價值是讓 Flash 應用把 3D 場景資料交給 GPU 渲染，而不是讓 CPU 用軟體模式逐一計算三角形。對 Flash 遊戲與互動應用來說，Stage3D 讓即時 3D、複雜模型、著色器效果與 2D 介面疊加變得可行。

這篇整理自 Adobe 的 How Stage3D works，並保留原先對 Flash 3D、GPU、rendering pipeline 與舞台層級的說明脈絡。

## Stage3D 為什麼是 Flash 3D 技術的突破？

Stage3D 的突破在於 Flash 可以直接使用 GPU 做 3D 硬體加速。Flash Player 11 以前的 3D 引擎多半靠 CPU 軟體渲染，效能與畫面精細度都受到明顯限制。

在 Stage3D 出現以前，Flash 開發者已經用 Papervision3D、Away3D、Alternativa3D 等工具做出不少 3D 應用。這些引擎證明 Flash 社群對即時 3D 有強烈需求，但渲染能力仍受限於當時的 Flash Player。

早期 Flash 3D 多半不使用 3D 硬體加速，而是依靠 CPU 完成渲染，也就是常說的 software mode。software mode 可以做出基礎 3D 效果，但速度慢，不適合呈現細緻場景，也難以支撐 3D 遊戲常見的高階圖形效果。

Flash Player 11 發布後，Stage3D API 讓開發者可以把 3D 渲染交給圖形處理單元（Graphics Processing Unit，GPU）。GPU 是專門為圖形渲染設計的硬體，能快速處理頂點、三角形、紋理與像素運算，因此 Stage3D 對 Flash 開發者是一次很大的技術分界。

## 3D 硬體加速和 CPU 軟體模式差在哪裡？

3D 硬體加速把幾何資料與渲染參數上傳到 GPU，由 GPU 完成主要繪製工作。CPU 軟體模式則由處理器逐步計算三角形位置與填色，三角形數量一多就容易卡住。

一般 3D 場景可以被定義為一組 3D 幾何形狀，也就是 mesh。每個 mesh 由許多三角形組成，每個三角形再由 3 個頂點組成。換句話說，一個 3D 場景需要描述頂點集合、三角形索引、紋理、頂點著色與其他渲染資訊。

在 Flash Player 10 以前的 software mode 裡，Away3D 這類 3D 引擎會接收頂點流，計算三角形在螢幕上的位置，再透過 \`drawTriangles()\`、\`fill()\` 等操作讓 Flash Player 把三角形畫到舞台上。即使 3D 引擎寫得很好，這個過程仍然很慢。

software mode 還有一個問題：3D 內容通常以三角形為最小呈現單位，而不是以像素為單位處理深度。這容易造成 depth sorting error，讓三角形出現在錯誤位置或錯誤深度上。來源內容提到，在可接受的腳本幀率下，Flash Player 10 software mode 通常只能呈現約 4,000 個三角形。

使用 Stage3D 後，開發者只需要定義幾何形狀，將資料上傳到 GPU 的顯示記憶體，由 GPU 處理頂點流並渲染三角形。應用程式仍然需要指定攝影機位置、燈光位置與其他渲染細節，但大量重複的圖形計算會在顯卡硬體內完成。

| 比較項目 | CPU 軟體模式 | Stage3D GPU 硬體加速 |
|---|---|---|
| 主要運算位置 | CPU | GPU |
| 常見繪製方式 | \`drawTriangles()\`、\`fill()\` 等 Flash 繪圖操作 | 上傳頂點、索引、紋理與 shader 資料到 GPU |
| 深度處理 | 容易受三角形排序限制 | 可使用 GPU 管線中的深度緩衝測試 |
| 適合場景 | 少量 3D、簡單效果 | 即時 3D、遊戲場景、大量三角形 |
| 來源內容提到的規模 | 約 4,000 個三角形 | 幾百萬個三角形並不少見 |

## 3D rendering pipeline 在 Stage3D 裡扮演什麼角色？

3D rendering pipeline 負責把場景資料轉成螢幕上的像素。Stage3D 背後的 GPU 會依序處理頂點轉換、裁切、光柵化、貼圖、混合與深度測試等工作。

3D rendering pipeline 可以想成一條資料處理流水線。GPU 在邏輯上由多個功能區塊組成，每個區塊負責一種基本資料操作；上一個區塊的輸出會變成下一個區塊的輸入。

最早期的 3D 圖形渲染管線被稱為 fixed-function pipeline，也就是固定功能管線。固定功能管線不可由開發者自由編寫，只會把輸入的形狀資料依照預先設計好的流程處理成最終圖像。

![固定功能圖形渲染管線流程圖](/images/tech/stage3d-fixed-function-pipeline.webp)

固定功能管線的輸入通常包含頂點集合、三角形、紋理資料、3D 場景的位置與方向、攝影機的位置與方向、光線的顏色、位置、強度，以及其他控制渲染方式的參數。

固定功能管線會先透過 transform and lighting 區塊，把頂點集合從模型本地座標轉換成螢幕舞台座標，並處理頂點照明。接著 viewport clipping 會裁切不在可見範圍內的場景資料。處理完的資料再進入 rasterizer，進行 texture mapping、霧化、alpha blending 與 depth buffer test。

固定功能管線使用多年，但缺點也很明顯：光照和材質效果容易受限於預設模型，例如 Gouraud shading 和 Phong shading。當所有開發者都只能使用相似的預設渲染流程，畫面風格也容易變得相似。

## 可編程管線和 shader 改變了什麼？

可編程圖形渲染管線讓開發者能用 shader 影響頂點與像素呈現。Vertex Shader 控制頂點轉換，Fragment Shader 控制每個像素的顏色與效果。

隨著 GPU 技術發展，programmable graphics pipeline 取代了僵硬的固定功能管線。Stage3D 使用的概念也朝這個方向靠攏：開發者可以撰寫 shader 程式碼，讓渲染流程不再只能依賴預設模型。

![可編程圖形渲染管線流程圖](/images/tech/stage3d-programmable-pipeline.webp)

Vertex Shader 會影響頂點轉換與變形，例如模型位置、骨骼動畫與座標投影。Fragment Shader 則會影響三角形內每個像素的顏色、貼圖、光照與特殊效果。

shader 帶來的改變很大。開發者可以用自訂光照取代預設管線照明模型，也能做出陰影、骨骼加速、特殊材質、後製效果等過去 Flash 3D 很難自然達成的畫面。

## 使用 Stage3D 有哪些優勢？

Stage3D 的優勢是把 GPU 加速、多平台部署與 Flash 2D 製作能力放在同一個開發模型裡。開發者可以做 3D 背景，也可以把 3D 內容嵌入傳統 2D 介面。

直接用 DirectX 或 OpenGL 開發 3D 應用並不簡單。畫出一個三角形很容易，但用 C++ 建立完整 3D 應用，需要理解顯示卡差異、硬體特性、平台限制與大量細節調校。

原生 3D API 通常更接近硬體。這代表開發者能壓榨特定 GPU 的能力，也代表專案必須針對不同顯示卡與驅動程式做測試與調整。遊戲開發商常需要同時考慮 NVIDIA、ATI/AMD 等不同顯示卡行為，這正是原生 3D 開發的現實成本。

Stage3D 採取不同路線。開發者面向 \`Context3D\`、\`Program3D\` 等 Stage3D 物件編程，讓同一套 Flash/AIR 應用可以運行在支援 Flash Player 或 AIR 的平台上。這種抽象層讓 Stage3D 比 DirectX、OpenGL 更容易使用，也讓 Flash 既有的 2D UI 製作能力能繼續保留。

實務上，Stage3D 可以讓 3D 場景成為背景，也可以把 3D 物件嵌入既有 2D 內容。傳統 2D 顯示物件能繼續負責按鈕、文字、介面與遊戲 UI，Stage3D 則專心負責高效能 3D 畫面。

Stage3D 也能用在 AIR 應用裡。這表示開發者可以用 Stage3D 建立桌面 3D 應用，也可以把相同概念帶到 iOS 和 Android 上的 AIR 專案。

## Stage3D 有哪些限制？

Stage3D 的限制來自跨平台抽象層。為了讓同一套 API 跑在多種硬體與平台上，Stage3D 只能使用各裝置共有的 GPU 能力，無法完整開放最新硬體特性。

Stage3D 的多平台能力是優勢，也是限制來源。為了讓應用能在不同平台運作，Stage3D 必須抽象出一個共通的 3D 硬體設備，而這個抽象層只能包含多數硬體都能支援的功能。

來源內容提到，當時現代 GPU 已經支援 Shader Model 4.0，但 Stage3D 主要對應 Shader Model 2.0 等級的能力。這代表 Stage3D 開發者會遇到 shader 暫存器數量、opcode 長度、迴圈與條件語義等限制。

例如 Stage3D 使用的 Adobe Graphics Assembly Language（AGAL）可用暫存器相當有限，shader 程式長度也不能像 Shader Model 4.0 那樣寫到很複雜。Stage3D 適合撰寫相對簡單、跨平台穩定的 shader，不適合直接移植 AAA 遊戲裡依賴高階 shader model 的效果。

另外，Stage3D 也可能受特定晶片、驅動程式或平台支援狀態影響。這類限制在 Flash Player 11 與 AIR 3 年代尤其需要測試，不能只靠開發機順跑就假設所有使用者裝置都能正常運作。

## Stage3D 和 Flash Display List 的層級關係是什麼？

Stage3D 位於主 Flash 舞台後方，傳統 2D Display List 會顯示在 Stage3D 內容上方。這種層級設計讓 3D 場景可以當背景，2D UI 則保留在最上層。

Stage3D 可以被理解成舞台背後的舞台。每個 Stage3D 都會在自己的矩形視野中渲染 3D 內容，而一般 Flash 2D 顯示物件會顯示在 Stage3D 內容之上。

![Stage3D、Display List 與 StageVideo 的層級關係](/images/tech/stage3d-stage-layers.webp)

開發者可以使用多個 Stage3D。每個 Stage3D 都有自己的矩形 viewport，也就是 \`width\`、\`height\`、\`x\`、\`y\`。因此畫面上可以有多個不同區域各自渲染 3D 內容，再讓傳統 2D Display List 疊在最上層。

Stage3D 和 StageVideo 層可以部分重疊，甚至完全重疊。不過早期 Stage3D 版本不支援層與層之間的混合模式，因此上層 Stage3D 會覆蓋下層 Stage3D，只能看到頂層內容，以及底下沒有被遮住的部分。

這個層級模型對 Flash 遊戲很實用：3D 場景使用硬體加速渲染，分數、按鈕、選單、對話框等 UI 仍然可以用 Flash 熟悉的 2D 工具製作。

## 常見問題

### Stage3D 是什麼？

Stage3D 是 Adobe 在 Flash Player 11 和 AIR 3 後提供的底層 3D 繪圖 API。Stage3D 讓 Flash/AIR 應用可以把頂點、三角形、紋理與 shader 資料交給 GPU 處理。

### Stage3D 一定只能做 3D 嗎？

Stage3D 不只用於 3D 場景，也常被 2D 渲染框架拿來加速 2D 畫面。Starling Framework 就是建立在 Stage3D 上的 2D 框架，透過 GPU 繪製三角形與材質來呈現 2D 遊戲物件。

### Stage3D 和 WebGL 有什麼相似之處？

Stage3D 和 WebGL 都讓開發者透過瀏覽器或執行環境使用 GPU 加速渲染。兩者都需要理解頂點、紋理、shader 與 rendering pipeline，但 Stage3D 屬於 Flash/AIR 生態，WebGL 則屬於現代瀏覽器標準。

### 為什麼 Stage3D 比 Flash Player 10 的軟體渲染快？

Stage3D 把大量頂點、三角形與像素運算交給 GPU。GPU 專門為圖形渲染設計，能平行處理許多重複圖形計算；Flash Player 10 的軟體渲染則主要依賴 CPU，CPU 是通用處理器，沒有針對 3D 三角形渲染最佳化。

### Stage3D 的 shader 有什麼限制？

Stage3D 的 shader 能力受跨平台抽象層限制，通常不能直接使用高階 shader model 的全部特性。AGAL 程式較適合寫短小、穩定、跨平台的頂點與片段著色邏輯。

### Stage3D 能和傳統 Flash DisplayObject 混用嗎？

Stage3D 可以和傳統 Flash DisplayObject 共存在同一個應用裡，但兩者不是任意混合。Stage3D 內容位於主舞台後方，Flash Display List 會疊在 Stage3D 上方，這適合做「3D 場景加 2D UI」的結構。

## 參考資料

- Adobe, How Stage3D works：<https://www.adobe.com/devnet/flashplayer/articles/how-stage3d-works.html>
- Adobe HelpX, Stage3D unsupported chipsets and drivers：<https://helpx.adobe.com/x-productkb/multi/stage3d-unsupported-chipsets-drivers-flash.html>
- 初探 Stage3D（一）3D 渲染基礎原理：<https://www.cnblogs.com/eran/archive/2012/12/14/Stage3D_1.html>

## 延伸閱讀

- [Starling 簡報分享：Stage3D 與 GPU 加速的 Flash 3D 渲染入門](/post/starling-presentation-share)：同樣聚焦 Stage3D、Flash，可接著比較不同情境的做法。
- [Starling簡報分享：基於Stage3D的GPU加速2D渲染框架入門](/post/starling-stage3d-presentation)：同樣聚焦 Stage3D、ActionScript，可接著比較不同情境的做法。
- [Starling Framework簡介](/post/starling-framework-intro)：同樣聚焦 ActionScript、Stage3D，可接著比較不同情境的做法。

## 最後更新

2026-08-28
`;export{e as default};