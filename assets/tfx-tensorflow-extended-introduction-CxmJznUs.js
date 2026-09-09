var e=`---
title: TensorFlow Extended (TFX) 介紹：用開源框架打造端到端機器學習管道
description: 整理 TensorFlow Extended (TFX) 功能筆記，說明 TFX 管道組件、Apache Airflow 與 Kubeflow Pipelines 自動化工作流、TFDV 資料驗證與 Facets 視覺化，以及安裝 TFX 的方式。
date: 2023-01-13
category: 機器學習
tags: [TFX, TensorFlow, 機器學習管道, TFDV, MLOps]
readingTime: 3 分鐘
image: /images/tech/hero_tfx-tensorflow-extended-introduction.webp
imageAlt: 機器學習管道各組件串接成自動化工作流的示意圖，象徵 TFX 的端到端流程
---


# TensorFlow Extended (TFX) 介紹：用開源框架打造端到端機器學習管道

TensorFlow Extended (TFX) 是 Google 開發的一個開源框架，用於在 TensorFlow 中構建機器學習管道。TFX 的目標是簡化機器學習管道的構建過程，使其能夠更容易地部署和維護。

其中 TFX 管道是 TFX 中的一個重要部分，它是一種用於組織和管理機器學習工作流的方式。TFX 管道由多個組件組成，每個組件負責執行特定的任務，如數據預處理、訓練、評估等。TFX 管道中的組件可以使用 TFX 提供的組件，也可以使用自定義組件。

TFX 管道通過使用 Apache Airflow 或 Kubeflow Pipelines 在組件之間傳遞數據來實現自動化的機器學習工作流。這樣可以在一個可視化的界面上監控和管理管道執行過程，並且在管道中的每個步驟之間自動傳遞數據。

![TFX 功能介紹示意圖](/images/articles/tfx-tensorflow-extended-introduction-1.webp)

## TFDV 為什麼能幫你抓出資料集的問題？

TFDV 結合開源的 Facets，是可以幫助理解和分析機器學習數據集的開源可視化工具，在 Google AI Blog 中展示了透過 Facets 視覺化抓出 CIFAR-10 資料集中一個錯誤分為貓咪的青蛙的圖片。

TFDV 容許兩個資料集之間的分布對照，例如訓練資料與測試資料，迅速抓出資料飄移與偏斜情形，而 TFDV 更進一步可以做到修正與納入新特徵，以及整合在筆記本及 TFX 之中。

PS: 以上資料來自於 [Day 14：資料驗證 TensorFlow Data Validation (TFDV)](https://ithelp.ithome.com.tw/articles/10263091)

## 如何安裝 TFX？

安裝 TFX 可以直接用 pip：

\`\`\`py
pip install tfx
\`\`\`

上文命令會安裝 TFX 的主要依賴項的軟件包，例如 TensorFlow 模型分析 (TFMA)、TensorFlow 數據驗證 (TFDV)、TensorFlow 轉換 (TFT)、TFX 基本共享庫 (TFX-BSL)、ML 元數據 (MLMD)。

## TFX 這些組件之間的數據流是怎麼運作的？

下圖說明了 TFX 組件之間的數據流：

![TFX 組件之間的數據流](/images/articles/tfx-tensorflow-extended-introduction-2.webp)

下圖說明了 TFX 庫與流水線組件之間的關係：

![TFX 庫與流水線組件的關係](/images/articles/tfx-tensorflow-extended-introduction-3.webp)

## 研究 TFX 之後的感想是什麼？

這個工具組裡面的 TFDV 非常的吸引我，但是後來發現若要使用 TFDV 去驗證資料，前面還是需要把資料集先經過前面 TFX 的流水線處理過後，才有辦法使用 Facets 去可視化已經經過驗證後的資料結果。Facets 並沒有辦法直接讀入未經 TFX 流水線處理過的原始資料集，而 TFX 對現在的我還有一點複雜，所以先大概知道有這個工具，然後以後再來慢慢摸索。

## 常見問題

### TFX 是什麼？

TFX（TensorFlow Extended）是 Google 開發的開源框架，用於在 TensorFlow 中構建端到端的機器學習管道。它的目標是簡化管道的構建過程，讓模型更容易部署與維護。

### TFX 管道通常搭配哪些編排工具？

TFX 管道常透過 Apache Airflow 或 Kubeflow Pipelines 在組件之間傳遞數據，實現自動化的機器學習工作流。這樣可以在可視化界面上監控管道執行過程，並在每個步驟之間自動傳遞數據。

### TFDV 和 Facets 有什麼關係？

TFDV 結合開源的 Facets，可以視覺化地理解和分析機器學習數據集。TFDV 支援兩個資料集之間的分布對照，例如訓練資料與測試資料，能迅速抓出資料飄移與偏斜情形。

### Facets 可以直接讀入未處理的原始資料集嗎？

根據我的研究，Facets 沒有辦法直接讀入未經 TFX 流水線處理過的原始資料集。若要使用 TFDV 驗證資料並用 Facets 可視化結果，資料集需要先經過 TFX 流水線的處理。

### 安裝 TFX 會一併安裝哪些依賴？

安裝 TFX 會一併安裝主要依賴項，包括 TensorFlow Model Analysis (TFMA)、TensorFlow Data Validation (TFDV)、TensorFlow Transform (TFT)、TFX Basic Shared Libraries (TFX-BSL) 與 ML Metadata (MLMD)。

## 參考資料

- [Day 14：資料驗證 TensorFlow Data Validation (TFDV)](https://ithelp.ithome.com.tw/articles/10263091)，來源筆記引用。
- [TensorFlow Extended 官方文件](https://www.tensorflow.org/tfx)

## 延伸閱讀

- [如何切分訓練、驗證與測試資料：train_test_split 與 K-Fold 範例](/post/train-validation-test-data-split)：同樣聚焦 TensorFlow，可接著比較不同情境的做法。
- [TensorFlow 開發者認證計劃介紹](/post/tensorflow-developer-certificate)：同樣聚焦 TensorFlow，可接著比較不同情境的做法。
- [TensorFlow 目標檢測 API：訓練自己的資料](/post/tensorflow-object-detection-custom-training)：同樣聚焦 TensorFlow，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2023-01-13，本文保留原始筆記內容並補上 GEO 結構。
`;export{e as default};