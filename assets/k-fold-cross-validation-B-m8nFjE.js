var e=`---
title: k-Fold 交叉驗證教學：Holdout 與 StratifiedKFold 比較
description: 說明 Holdout、k-Fold 與 StratifiedKFold 的差異，並用 TensorFlow 與 scikit-learn 範例切分圖片資料。
date: 2023-06-21
category: 機器學習
tags: [機器學習, k-Fold, TensorFlow, scikit-learn]
readingTime: 10 分鐘
image: /images/tech/5-fold-cv.webp
imageAlt: 5-fold cross-validation 資料切分示意圖
---


# k-Fold Cross-Validation 交叉驗證教學：Holdout 與 StratifiedKFold 比較

k-Fold Cross-Validation 是用來評估機器學習模型穩定度的資料切分方法。相比只切一次訓練集與測試集的 Holdout method，k-Fold 會讓每個子集輪流當測試集，因此特別適合資料量有限、又想降低切分偶然性的模型評估。

## Holdout method 是什麼？

Holdout method 是最基本的資料切分方法。Holdout method 會把資料集切成訓練資料與測試資料，通常使用 70:30 或 80:20。

在 Holdout method 中，模型只在訓練資料上學習，最後用測試資料評估。這種方式簡單、快速，很適合第一次建立 baseline。

但 Holdout method 的結果容易受到資料切分方式影響。資料在切分前通常會隨機洗牌，每次切到的訓練資料不同，模型分數也可能不同。當資料集不大時，測試資料可能包含重要資訊，卻完全沒有參與訓練。

\`\`\`python
import tensorflow as tf

dataset = tf.keras.utils.image_dataset_from_directory(
    "image_directory",
    labels="inferred",
    class_names=None,
    label_mode="int",
)

dataset_size = tf.data.experimental.cardinality(dataset).numpy()
test_size = int(0.2 * dataset_size)
train_size = dataset_size - test_size

train_dataset = dataset.take(train_size)
test_dataset = dataset.skip(train_size)
\`\`\`

## k-Fold Cross-Validation 如何改善 Holdout？

k-Fold Cross-Validation 會把資料切成 k 份，讓每一份輪流當測試集。k-Fold Cross-Validation 的平均分數比單次 Holdout 更能代表模型穩定度。

k-Fold 的流程如下：

1. 將整個資料集隨機切成 k 個子集。
2. 每次取 k-1 個子集訓練模型，剩下 1 個子集測試模型。
3. 重複 k 次，直到每個子集都當過測試集。
4. 將 k 次準確率平均，作為交叉驗證準確率。

![5-fold cross-validation 示意圖](/images/tech/5-fold-cv.webp)

k-Fold 的優點是每筆資料都有機會進入訓練與測試，因此偏差通常比單次 Holdout 小。缺點是訓練演算法必須從頭執行 k 次，評估成本約為 k 倍。

## StratifiedKFold 適合什麼資料？

StratifiedKFold 適合分類問題，特別是類別分布不平均或資料量有限時。StratifiedKFold 會讓每個 fold 保持接近整體的類別比例。

一般 KFold 在分類問題上可能產生不平衡 fold。例如二元分類資料原本正負類各 50%，但隨機切分後，某個 fold 可能正類過多、負類過少，導致訓練或評估偏差。

分層的目標是重新排列資料，讓每個 fold 都能代表整體資料分布。原文使用三種資料、每種 70 張、共 210 張圖片測試；每次訓練 168 張、測試 42 張。

![一般 KFold 類別分布不均示意](/images/tech/2023-06-21_115922.webp)

改用 StratifiedKFold 後，訓練過程更順利，因為每次資料切分都保留各類別比例。

![StratifiedKFold 類別分布較穩定示意](/images/tech/2023-06-21_120255.webp)

## TensorFlow 圖片資料如何做 KFold？

TensorFlow 圖片資料要做 KFold，可先把 dataset 轉成 NumPy 陣列，再交給 scikit-learn 的 KFold 或 StratifiedKFold 切分。

\`\`\`python
import numpy as np
import pathlib
import tensorflow as tf
from sklearn.model_selection import KFold
from sklearn.preprocessing import LabelEncoder

img_path = "dice3"
train_ds = tf.keras.utils.image_dataset_from_directory(
    img_path,
    seed=7,
    batch_size=32,
)

X = []
y = []

for images, labels in train_ds:
    X.append(images.numpy())
    y.append(labels.numpy())

X = np.concatenate(X, axis=0)
y = np.concatenate(y, axis=0)
y = LabelEncoder().fit_transform(y)
\`\`\`

資料準備完成後，就可以用 \`KFold(n_splits)\` 產生訓練與測試 index。每個 fold 都重新建立模型，避免前一次訓練權重污染下一次結果。

## StratifiedKFold 範例怎麼改？

將 KFold 改成 StratifiedKFold 時，需要在 \`split(X_data, y_data)\` 同時傳入特徵與標籤。StratifiedKFold 會根據標籤維持類別比例。

\`\`\`python
from sklearn.model_selection import StratifiedKFold

def make_dataset(X_data, y_data, n_splits):
    def gen():
        kfold = StratifiedKFold(n_splits=5, shuffle=True, random_state=123)
        for train_index, test_index in kfold.split(X_data, y_data):
            X_train, X_test = X_data[train_index], X_data[test_index]
            y_train, y_test = y_data[train_index], y_data[test_index]
            yield X_train, y_train, X_test, y_test

    return tf.data.Dataset.from_generator(
        gen,
        (tf.float64, tf.float64, tf.float64, tf.float64),
    )
\`\`\`

![圖片資料集資料夾示意](/images/tech/2023-06-21_122024.webp)

## 常見問題
### k-Fold Cross-Validation 的 k 要設多少？

常見設定是 5 或 10。資料量小時可以提高 k，但訓練成本也會增加；圖片模型通常先從 5-fold 開始比較實際。

### Holdout method 什麼時候夠用？

資料量大、類別分布穩定、只需要快速 baseline 時，Holdout method 通常夠用。若模型分數對切分很敏感，就應考慮 k-Fold。

### StratifiedKFold 和 KFold 差在哪裡？

KFold 只負責切成 k 份，不保證類別比例。StratifiedKFold 會讓每份資料的類別比例接近整體資料集。

### k-Fold 可以避免 overfitting 嗎？

k-Fold 不能直接避免 overfitting，但能幫助觀察模型在不同資料切分下是否穩定。如果訓練分數高、驗證分數低，仍需要正則化、資料增強或調整模型。

### 圖片資料一定要轉 NumPy 才能用 StratifiedKFold 嗎？

scikit-learn 的 StratifiedKFold 主要回傳 index，因此通常會先把圖片與標籤整理成可索引的陣列。也可以用檔案路徑與標籤陣列切分，再建立 TensorFlow dataset。

## 參考資料
- scikit-learn, KFold, https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.KFold.html，存取日期：2026-08-27。
- scikit-learn, StratifiedKFold, https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.StratifiedKFold.html，存取日期：2026-08-27。
- TensorFlow, image_dataset_from_directory, https://www.tensorflow.org/api_docs/python/tf/keras/utils/image_dataset_from_directory，存取日期：2026-08-27。

## 延伸閱讀

- [如何切分訓練、驗證與測試資料：train_test_split 與 K-Fold 範例](/post/train-validation-test-data-split)：同樣聚焦 機器學習、TensorFlow，可接著比較不同情境的做法。
- [TensorFlow 目標檢測 API：訓練自己的資料](/post/tensorflow-object-detection-custom-training)：同樣聚焦 TensorFlow、機器學習，可接著比較不同情境的做法。
- [TensorFlow 開發者認證計劃介紹](/post/tensorflow-developer-certificate)：同樣聚焦 TensorFlow、機器學習，可接著比較不同情境的做法。

## 最後更新

Wed Jun 21 2023 08:00:00 GMT+0800 (Taiwan Standard Time)
`;export{e as default};