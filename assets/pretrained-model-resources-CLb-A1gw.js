var e=`---
title: Pretrained Model 資源哪裡找？用 Papers with Code 查 SOTA 模型
description: 尋找 pretrain model 的好地方整理：Hugging Face、TensorFlow Hub、PyTorch Hub、Model Zoo 等預訓練模型資源站，幫你快速找到影像辨識、NLP 等任務可直接使用的模型。
date: 2023-08-28
category: 機器學習
tags: [Pretrained Model, SOTA, Papers with Code, 深度學習]
readingTime: 2 分鐘
image: /images/tech/hero_pretrained-model-resources.webp
imageAlt: Papers with Code 網站上的 SOTA 模型排行榜截圖
---


# Pretrained Model 資源哪裡找？用 Papers with Code 查 SOTA 模型

做專案想直接套用最好的預訓練模型，卻不知道去哪找各任務的排行榜？我的做法是直接查 [Papers with Code 的 SOTA 專頁](https://paperswithcode.com/sota)，它把各種任務的模型依效能排名，可以快速找到當前最先進的模型與對應論文。

![Papers with Code 網站上的 SOTA 模型排行榜截圖](/images/articles/pretrained-model-resources-1.webp)

## SOTA 是什麼意思？

"SOTA" 是 "State-of-the-Art" 的縮寫，意為「最先進技術」。在計算機科學和人工智能領域，SOTA 模型指的是當前被認為是在某個特定任務或領域內表現最優秀的模型或方法。

這些模型通常代表了當前領域內的最高水平，並在諸如自然語言處理、計算機視覺、語音識別等各種任務中發揮著重要作用。

## 怎麼用 Papers with Code 找模型？

Papers with Code 把任務（task）、資料集（dataset）與模型排名整理在一起：

- 進入 [SOTA 頁面](https://paperswithcode.com/sota)後，可以用任務分類（例如 Object Detection、Image Segmentation）篩選。
- 每個排行榜會列出模型名稱、使用的資料集與評估指標，並附上論文與程式碼連結。
- 想快速驗證效果時，可以直接挑排名靠前、且有開源程式碼的模型來試。

## 常見問題

### SOTA 模型一定適合我的專案嗎？

不一定。SOTA 指的是在特定資料集與指標上的最佳表現，實際選型還要考量推論速度、模型大小與部署環境。有時排名稍後但輕量的模型反而更實用。

### Papers with Code 是免費的嗎？

是。網站免費使用，內容為論文、程式碼與排行榜的整理，可以直接瀏覽各任務的 SOTA 排名。

### 除了 Papers with Code 還有其他找模型的地方嗎？

可以再搭配 Hugging Face Hub、TensorFlow Hub 等模型庫。Papers with Code 的優勢是能看到各模型在同一資料集上的客觀比較。

## 參考資料

- [Papers with Code SOTA](https://paperswithcode.com/sota)

## 延伸閱讀

- [如何從預先訓練的模型中提取特徵](/post/extract-features-from-pretrained-model)：同樣聚焦 深度學習，可接著比較不同情境的做法。
- [Keras 介紹：用 Python 快速建立深度學習模型的高階 API](/post/keras-introduction)：同樣聚焦 深度學習，可接著比較不同情境的做法。
- [如何縮小 TensorFlow 模型記憶體：剪枝、正則化與卷積設計](/post/reduce-tensorflow-model-memory)：同樣聚焦 深度學習，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2023-08-28，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};