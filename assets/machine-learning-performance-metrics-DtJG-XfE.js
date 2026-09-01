var e=`---
title: 機器學習的效能衡量指標
description: 完整解析機器學習分類模型的效能衡量指標：混淆矩陣、Accuracy、Precision、Recall、F1-score、Precision-Recall 曲線與 ISO-F1 曲線的定義、公式與適用情境，幫你選對評估指標、正確解讀模型表現。
date: 2024-05-16
category: 機器學習
tags: [機器學習, 混淆矩陣, Precision, Recall, F1-score]
readingTime: 4 分鐘
image: /images/tech/hero_machine-learning-performance-metrics.webp
imageAlt: 筆記型電腦螢幕上顯示的資料分析圖表與指標儀表板
---


# 機器學習的效能衡量指標

訓練完分類模型之後，該用哪個指標判斷模型好不好？這篇文章整理我在評估機器學習分類模型時最常用的效能衡量指標：從混淆矩陣出發，依序說明 Accuracy、Precision、Recall、F1-score 的定義與公式，以及 Precision-Recall 曲線和 ISO-F1 曲線的用途與判讀方式。

## 什麼是混淆矩陣？

混淆矩陣（Confusion Matrix）是一種評估分類模型性能的工具，特別適用於監督學習中的分類問題。它能夠幫助你了解模型在不同類別上的預測結果，並提供更多信息來評估模型的準確性。

混淆矩陣是一個方陣，其中每一行代表實際的類別，每一列代表模型預測的類別。以下是一個二元分類問題的混淆矩陣範例：

| | 預測為正類 (Positive) | 預測為負類 (Negative) |
| --- | --- | --- |
| 實際為正類 (Positive) | 真正類 (TP) | 偽負類 (FN) |
| 實際為負類 (Negative) | 偽正類 (FP) | 真負類 (TN) |

四個格子的意義：

- **TP（True Positive）**：模型將正例正確預測為正例的樣本數量。
- **TN（True Negative）**：模型將負例正確預測為負例的樣本數量。
- **FP（False Positive）**：模型將負例錯誤預測為正例的樣本數量。
- **FN（False Negative）**：模型將正例錯誤預測為負例的樣本數量。

## 準確率（Accuracy）是什麼？

準確率是預測正確的樣本數量與總樣本數量之比：

\`\`\`text
Accuracy = (tp + tn) / (tp + fp + fn + tn)
\`\`\`

Accuracy 直觀易懂，但在類別不平衡的資料集上容易失真——例如正例只占 1% 時，全部預測為負類就能拿到 99% 的準確率，卻完全沒有抓到正例。

## 精確率（Precision）和召回率（Recall）有什麼不同？

**Precision（精確率）** 指的是在所有被模型預測為正類的樣本中，實際上是正類的比例。換句話說，它衡量了模型正確預測正例的能力，並且**避免錯誤地將負例分類為正例**：

\`\`\`text
Precision = tp / (tp + fp)
\`\`\`

**Recall（召回率）** 則是實際上被**正確預測為正例**的樣本數量除以所有**實際正類樣本**的數量：

\`\`\`text
Recall = tp / (tp + fn)
\`\`\`

簡單來說：Precision 回答「模型說是正類的，有多少真的是正類？」；Recall 回答「所有真正的正類，模型抓到了多少？」兩者關注的錯誤類型不同，必須依業務需求取捨。

## F1-score 怎麼計算？

F1-score 是一個綜合了精確率（Precision）和召回率（Recall）的指標，使用精確度和召回率的值計算 F1-score：

![F1-score 公式](/images/articles/machine-learning-performance-metrics-1.webp)

F1-score 是 Precision 和 Recall 的調和平均數，只有當兩者都高時 F1-score 才會高，因此適合作為單一數字的綜合評估指標，特別是在類別不平衡的情境下比 Accuracy 更可靠。

## 如何用 Precision-Recall 曲線評估模型？

Precision-Recall 曲線是用於評估二元分類器性能的一種圖表。它描述了在不同閾值下模型的精確度（Precision）和召回率（Recall）之間的折衷關係。

在 Precision-Recall 曲線上，x 軸通常表示召回率，y 軸表示精確度。理想情況下，我們希望模型能夠同時實現高精確度和高召回率，即圖表右上角的位置。但是，通常情況下，提高精確度可能會降低召回率，反之亦然。這種權衡關係取決於分類器的閾值設置，可以通過調整閾值來改變精確度和召回率之間的平衡。

## ISO-F1 曲線是什麼？

ISO-F1 曲線是一種評估多類別分類器性能的方法，特別用於**不平衡類別數據集**。ISO-F1 曲線通過在 F1-score 和類別別不平衡程度之間繪製關係圖來評估分類器的性能。

ISO-F1 曲線以不同的 F1-score 為橫軸，以類別別不平衡程度（通常以每個類別的正例數量比例或類別的預測概率分佈）為縱軸。它通過改變分類器的閾值或類別別的權重來繪製曲線，從而呈現出不同 F1-score 和類別別不平衡程度之間的平衡關係。

ISO-F1 曲線的一個常見應用是用於調整分類器的閾值，從而使得在不同類別別的不平衡情況下都能達到相對均衡的性能。透過該曲線，可以找到一個合適的閾值，以平衡不同類別別之間的性能，從而提高整體的分類器性能。

![Precision-Recall 曲線與 ISO-F1 曲線範例](/images/articles/machine-learning-performance-metrics-2.webp)

## 常見問題

### 機器學習分類模型最常用的效能指標有哪些？

最常用的是混淆矩陣衍生出的四個指標：Accuracy（準確率）、Precision（精確率）、Recall（召回率）與 F1-score。進一步還可以畫 Precision-Recall 曲線觀察不同閾值下的權衡關係。

### 類別不平衡時應該用 Accuracy 還是 F1-score？

建議用 F1-score。在類別不平衡的資料集上，Accuracy 會被多數類主導而失真；F1-score 同時考慮 Precision 與 Recall，能更真實反映模型對少數類的辨識能力。

### Precision 和 Recall 該優先顧哪一個？

取決於業務成本：誤殺成本高（如垃圾郵件誤判、疾病篩檯誤報造成困擾）時優先提升 Precision；漏掉正例的代價高（如詐欺偵測、癌症篩檢）時優先提升 Recall。也可以透過調整分類閾值在兩者之間取得平衡。

### F1-score 為什麼用調和平均而不是算術平均？

調和平均會被較小的那個值拉低，只有 Precision 和 Recall 兩者都高時 F1-score 才高。若用算術平均，一個極端偏向單一指標的模型仍可能得到不錯的分數，失去綜合評估的意義。

## 參考資料

- 本文為機器學習基礎系列筆記，搭配〈使用 K-Fold Cross Validation 交叉驗證〉與〈提升機器學習模型準確率〉一起閱讀效果更好。
- 指標定義可進一步參考 scikit-learn 官方文件的 [Classification metrics](https://scikit-learn.org/stable/modules/model_evaluation.html#classification-metrics) 章節。

## 延伸閱讀

- [二元分類器 (binary classification) 介紹](/post/binary-classifier-introduction)：同樣聚焦 機器學習，可接著比較不同情境的做法。
- [如何判讀機器學習訓練結果：loss、accuracy、val_loss、val_accuracy 完整解讀](/post/how-to-read-training-results)：同樣聚焦 機器學習，可接著比較不同情境的做法。
- [機器學習所需的前置知識：數學、程式、算法與心理學基礎一次盤點](/post/machine-learning-prerequisites)：同樣聚焦 機器學習，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2024-05-16，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};