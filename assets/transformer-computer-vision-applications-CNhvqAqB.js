var e=`---
title: Transformer 模型於機器視覺的應用
description: 整理 Transformer 在電腦視覺中的應用，包括視覺基礎模型、影像分類、物件偵測、語意分割、多模態感知與計算效率挑戰。
date: 2023-09-26
category: 機器學習
tags: [Transformer, 電腦視覺, 基礎模型, Vision Transformer]
readingTime: 8 分鐘
image: /images/tech/transformer-foundation-model-applications.jpg
imageAlt: Transformer 視覺基礎模型應用示意圖
---


# Transformer 模型於機器視覺的應用

Transformer 模型在機器視覺中的應用，核心是把影像、影片與感測器資料轉成可被注意力機制處理的序列表示，再透過大規模預訓練學到可遷移的視覺知識。這條路線讓影像分類、物件偵測、語意分割、視覺問答、機器人感知與醫療影像分析，都能從同一類基礎模型能力延伸出來。

## Transformer 為什麼會進入機器視覺？

Transformer 進入機器視覺，是因為自注意力機制適合處理長距離關係，而視覺任務也需要理解物件、場景與時間脈絡。大型預訓練讓模型能把不同任務共用的視覺表示先學起來。

Transformer 最早因《Attention Is All You Need》在自然語言處理中受到重視，該論文提出只使用注意力機制、捨棄循環與卷積的序列轉換架構（Vaswani 等人，2017）。這個想法後來被移植到影像：把圖片切成 patch，讓模型像處理文字 token 一樣處理影像片段。

Google Research 的 Vision Transformer（ViT）論文進一步指出，純 Transformer 可直接套用在影像 patch 序列上；在大量資料預訓練後，ViT 可以在影像分類任務上達到很好的效果（Dosovitskiy 等人，2021）。這不是說卷積神經網路（Convolutional Neural Network，CNN）失效，而是電腦視覺多了一條能隨資料與模型規模擴張的路。

## 視覺基礎模型帶來哪些突破？

視覺基礎模型的突破，是讓模型先從大規模、多來源資料中學到通用視覺表示，再遷移到不同任務。影像分類、物件偵測與分割不必完全從零開始訓練。

Stanford Center for Research on Foundation Models 在《On the Opportunities and Risks of Foundation Models》中，把 foundation model 定義為在廣泛資料上訓練、可適配到多種下游任務的模型（Bommasani 等人，2021）。放到電腦視覺時，這代表模型不只看單張圖片，也可能接收影片、深度資訊、語音、文字或互動式感測資料。

![Transformer 模型把多模態感測資料轉成視覺知識](/images/tech/transformer-foundation-model-applications.jpg)

*通過大規模自我監督學習，Transformer 模型可以把多模態原始感官資料轉化為視覺知識。這種能力有助於傳統感知任務，也可能支援時間理解與常識推理。*

這篇筆記最值得保留的觀察是：Transformer 模型不是只替換 CNN 的某一層，而是把「先學通用表示，再轉移到下游任務」的想法帶進更廣泛的視覺場景。醫療、居家照護、互動式感知環境與機器人都可能受益，但前提是模型要能理解影像以外的脈絡。

## 過去機器視覺主要處理哪些任務？

傳統機器視覺任務集中在看見、定位、分割與理解動作。ImageNet 與監督式預訓練推動了深度學習模型在這些任務上的普及。

過去十多年，電腦視覺常見任務大致可以分成以下幾類：

| 任務 | 目標 | 常見輸出 |
|---|---|---|
| 影像分類 | 判斷整張圖片屬於哪個類別 | 類別標籤與信心分數 |
| 物件偵測 | 找出圖片中的特定物體與位置 | bounding box、類別、分數 |
| 語意分割 | 把每個像素分到對應類別 | 像素級 mask |
| 動作辨識 | 判斷影片或影像序列中的動作 | 動作類別 |
| 場景圖產生 | 描述物件與物件之間的關係 | 物件節點與關係邊 |
| 幾何、運動與 3D 任務 | 推估深度、姿態、表面方向與關鍵點 | 深度圖、法向量、關鍵點 |

ImageNet 的出現讓監督式預訓練成為電腦視覺的重要路線。常見流程是先在大型分類資料集上訓練模型，再依任務微調到自動駕駛、影像編輯、機器人或醫學影像分析。

## Transformer 和 CNN 在視覺任務中差在哪？

Transformer 擅長建模全域關係，CNN 擅長利用局部空間結構。視覺任務不一定只能二選一，實務上常依資料量、延遲需求與硬體限制選擇架構。

CNN 的歸納偏置來自局部卷積、權重共享與階層式特徵，對中小型資料集很有效。Transformer 的優勢在於自注意力可以直接連接遠距影像 patch，對大型資料預訓練和多模態任務更有擴張空間。

| 比較面向 | CNN | Transformer / ViT |
|---|---|---|
| 影像處理方式 | 以卷積核掃描局部區域 | 將影像切成 patch 序列 |
| 強項 | 局部紋理、邊緣、空間結構 | 全域關係、多模態連接、可擴張預訓練 |
| 資料需求 | 中小型資料也常能訓練出可用結果 | 通常更依賴大規模預訓練 |
| 計算瓶頸 | 深層卷積與特徵圖運算 | patch 數量、注意力計算與記憶體 |
| 常見用法 | 分類、偵測、分割基礎骨幹 | ViT、混合式 backbone、多模態基礎模型 |

我的理解是，Transformer 在視覺任務的價值不是「CNN 被淘汰」，而是當資料來源變多、任務之間需要共享表示時，Transformer 架構比較容易把影像、文字與時間資訊接在一起。

## 視覺合成與自我監督學習如何擴展應用？

視覺合成與自我監督學習降低了對人工標籤的依賴。模型可以透過重建、對比、生成或跨模態對齊，從未標註資料中學習視覺表示。

除了分類、偵測與分割，電腦視覺也延伸到生成與無監督學習。生成對抗網路（Generative Adversarial Network，GAN）透過生成器與判別器互相競爭來產生影像；變分自編碼器（Variational Autoencoder，VAE）以機率式潛在表示生成資料；對比學習則透過樣本相似度與差異學習特徵。

這些方法都在回應同一個問題：人工標籤昂貴，視覺世界又太大。自我監督學習讓模型從原始資料中學到上下文，視覺合成則讓模型練習建立或修補視覺內容。DALL-E 這類文字生成影像模型，也讓「文字描述」和「影像生成」之間的連接變得更明顯。

但電腦視覺基礎模型仍比自然語言基礎模型更難。影像包含物理場景、幾何關係、時間事件與社會脈絡；視覺問答若需要外部常識，模型不能只靠單張圖片完成可靠推理。

## Transformer 在機器視覺有哪些可能應用？

Transformer 在機器視覺的應用包括醫療照護、智慧家居、行動裝置、計算攝影、內容編輯與機器人互動。多模態能力越強，應用越容易跨出單一影像任務。

![基礎模型的五個關鍵屬性](/images/tech/transformer-foundation-models-evolution.jpg)

*基礎模型常被期待具備表達能力、可擴充性、多模態連接、記憶能力與組合能力。*

比較具體的應用方向有三類：

1. **醫療保健與家居環境智慧**：Transformer 模型可結合影像、動作與環境感測訊號，協助觀察活動狀態、照護情境或醫療影像線索。
2. **行動與消費者應用**：多模態 Transformer 可把相機、語音與文字指令接在一起，支援計算攝影、內容編輯、相簿搜尋與互動式創作。
3. **機器人互動**：機器人需要同時理解場景、物件、動作和任務指令。若模型能從真實或模擬的第一視角資料中學習，機器人就更有機會在新環境中泛化。

這些應用的共同點是「視覺不是孤立輸入」。醫療影像要接病歷與檢查脈絡，機器人視覺要接動作與環境回饋，行動應用要接使用者意圖。Transformer 的多模態連接能力，剛好對上這個需求。

## Transformer 用在機器視覺會遇到哪些挑戰？

Transformer 用在機器視覺的主要挑戰，是泛化、物理理解、計算成本與細節保留。高解析度影像和長影片會讓注意力計算快速變重。

第一個挑戰是圖像理解與泛化。人可以從不完整的圖形中推斷物體、場景、深度和物理關係；模型即使能生成逼真影像，也不代表真正掌握幾何與物理常識。簡單形狀、顏色組合或罕見場景，仍可能讓模型出錯。

第二個挑戰是計算效率。1080p 影像超過 200 萬個像素；影片還多了時間維度。若模型逐像素處理，注意力計算和記憶體成本都會很高。視覺 Transformer 常用 patch、多幀嵌入或階層式表示降低成本，但這些做法也可能遺失小物件、邊界或細節。

第三個挑戰是資料和評估。基礎模型可以遷移到很多任務，但每個場景仍要檢查偏差、錯誤代價與輸出品質。醫療、照護與自動駕駛尤其不能只看 benchmark 分數。

## 實務導入時應該先問哪些問題？

實務導入 Transformer 視覺模型前，應先確認任務、資料、延遲、錯誤代價與驗證方式。模型架構只是選項之一，問題定義才決定是否值得使用。

我會先用這張檢查表判斷是否適合導入 Transformer 視覺模型：

| 檢查問題 | 為什麼重要 |
|---|---|
| 任務是分類、偵測、分割、生成，還是多模態理解？ | 不同任務需要不同輸出格式與評估指標 |
| 是否有足夠資料，或可使用可靠的預訓練模型？ | Transformer 視覺模型通常更依賴大規模預訓練 |
| 是否需要即時推論？ | 高解析度影像與影片會放大延遲與成本 |
| 錯誤代價有多高？ | 醫療、照護與安全場景需要更嚴格驗證 |
| 模型是否需要解釋或人工覆核？ | 高風險決策不能只看輸出結果 |
| 是否能建立場景內測試集？ | 通用 benchmark 不能取代現場資料驗證 |

如果只是固定場景中的簡單分類或偵測，CNN 或現成 YOLO 系列模型可能比較直接。若任務涉及影像加文字、跨場景泛化、影片脈絡或互動式感知，Transformer 視覺模型才更值得列入評估。

## 常見問題

### Transformer 可以完全取代 CNN 嗎？

Transformer 不一定會完全取代 CNN。CNN 對局部影像結構仍然有效，而且在資料量、硬體與延遲受限的場景中很實用。Transformer 的優勢比較明顯地出現在大規模預訓練、多模態任務與需要全域關係建模的情境。

### Vision Transformer 是什麼？

Vision Transformer（ViT）是把圖片切成固定大小 patch，再把 patch 當成序列 token 輸入 Transformer encoder 的影像模型。Google Research 的 ViT 論文顯示，當模型先用大量資料預訓練，再遷移到影像分類基準時，可以取得很好的效果（Dosovitskiy 等人，2021）。

### Transformer 用在物件偵測和影像分類有什麼不同？

影像分類通常輸出整張圖的類別，物件偵測則要輸出物件位置、類別與信心分數。Transformer 用在分類時可直接處理影像 patch 表示；用在偵測時，還需要能預測位置與多個物件的架構設計。

### 為什麼自我監督學習對視覺模型重要？

自我監督學習能降低人工標註成本，讓模型從大量未標註影像、影片或多模態資料中學習表示。電腦視覺資料取得容易，但高品質標註昂貴，所以自我監督是擴大訓練資料的重要方法。

### Transformer 視覺模型適合醫療影像嗎？

Transformer 視覺模型可以用於醫療影像研究與輔助分析，但正式醫療場景需要更嚴格的資料驗證、偏差檢查、臨床流程設計與人工覆核。醫療影像不能只因模型在公開資料集上表現好，就直接放進高風險決策。

### 高解析度影像為什麼會讓 Transformer 變慢？

高解析度影像會產生更多像素或更多 patch，而注意力計算會隨 token 數增加而變重。視覺 Transformer 常用 patch、降採樣或階層式表示減少計算量，但這些方法可能犧牲細節。

## 參考資料

- Vaswani, Ashish 等人，[Attention Is All You Need](https://proceedings.neurips.cc/paper_files/paper/2017/hash/3f5ee243547dee91fbd053c1c4a845aa-Abstract.html)，NeurIPS 2017，存取日期：2026-08-28。
- Dosovitskiy, Alexey 等人，[An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale](https://research.google/pubs/an-image-is-worth-16x16-words-transformers-for-image-recognition-at-scale/)，ICLR 2021，存取日期：2026-08-28。
- Bommasani, Rishi 等人，[On the Opportunities and Risks of Foundation Models](https://crfm.stanford.edu/report.html)，Stanford CRFM，2021，存取日期：2026-08-28。
- Ramesh, Aditya 等人，[Zero-Shot Text-to-Image Generation](https://arxiv.org/abs/2102.12092)，arXiv，2021，存取日期：2026-08-28。

## 延伸閱讀

- [Transformer：自然語言處理的里程碑](/post/transformer-nlp-milestone)：同樣聚焦 Transformer、基礎模型，可接著比較不同情境的做法。
- [影像分割模型介紹：U-Net 與去背改良版 U2-Net](/post/image-segmentation-models)：同樣聚焦 電腦視覺，可接著比較不同情境的做法。
- [TensorFlow 目標檢測 API：訓練自己的資料](/post/tensorflow-object-detection-custom-training)：同樣聚焦 電腦視覺，可接著比較不同情境的做法。

## 最後更新

2026-08-28。這次整理保留 2023-09-26 的 Transformer 與機器視覺應用筆記，補上 GEO Answer Blocks、FAQ、站內延伸閱讀、本機圖片路徑，以及 Transformer、Vision Transformer 與 foundation model 的可信來源。
`;export{e as default};