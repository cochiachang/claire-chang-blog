var e=`---
title: 如何切分訓練、驗證與測試資料：train_test_split 與 K-Fold 範例
description: 說明訓練資料、驗證資料與測試資料的用途，並用 scikit-learn 與 TensorFlow 示範模型評估流程。
date: 2023-06-21
category: 機器學習
tags: [機器學習, train_test_split, TensorFlow, 模型評估]
readingTime: 9 分鐘
image: /images/tech/2023-06-21_122024.webp
imageAlt: 圖片資料集資料夾結構示意圖
---


# 如何切分訓練、驗證與測試資料：train_test_split 與 K-Fold 範例

訓練資料、驗證資料與測試資料分別負責建模、調參與最終評估。機器學習模型如果只訓練不測試，很容易產生看似準確、實際泛化能力不足的結果；因此資料切分是模型評估的基本工作。

## 為什麼要切分訓練資料與測試資料？

切分訓練資料與測試資料，是為了檢查模型能不能處理沒看過的資料。訓練分數高不代表模型泛化能力好，測試資料才是最後評估基準。

在資料科學中，訓練資料與測試資料扮演不同角色：

| 資料類型 | 用途 |
|---|---|
| 訓練資料 | 用於建立模型，通常占較大比例。 |
| 測試資料 | 用於評估模型，通常占較小比例。 |
| 驗證資料 | 從訓練資料中再切出來，用於訓練過程調參。 |

未經測試的模型可能對訓練資料記得很好，卻在新資料上預測錯誤。這就是資料切分的核心目的：把「學習」與「評估」分開。

## 驗證資料是什麼？

驗證資料是從訓練資料中分離出來的子資料集。驗證資料用於訓練過程中的模型選擇、參數調整與 early stopping。

測試資料應該留到最後使用，不能在調參過程中反覆偷看。若每次改模型都看測試資料分數，測試資料就會逐漸變成調參依據，最終評估會過度樂觀。

驗證資料的用途包含：

1. 比較不同模型架構。
2. 調整 learning rate、batch size、epoch 等超參數。
3. 判斷是否 overfitting。
4. 選擇最佳 checkpoint。

## 如何使用 train_test_split 切驗證資料？

\`train_test_split\` 可以把訓練資料再切成訓練與驗證兩份。常見做法是從訓練 fold 中切出 10% 作為 validation data。

\`\`\`python
from sklearn.model_selection import train_test_split

# 載入資料集
# ...

X_train, X_val, y_train, y_val = train_test_split(
    train_images_fold,
    train_labels_fold,
    test_size=0.1,
    random_state=42,
)

model = create_model()
keras_classifier.fit(X_train, y_train, validation_data=(X_val, y_val))
\`\`\`

\`random_state\` 可以讓切分結果可重現。若是分類問題，也可以加上 \`stratify=y\`，讓切出的資料維持類別比例。

## 如何用測試資料計算準確率？

測試資料應在模型訓練完成後使用。模型先對 \`X_test\` 產生預測，再用 \`accuracy_score\` 與 \`y_test\` 比較。

\`\`\`python
predictions = keras_classifier.predict(X_test)
accuracy = accuracy_score(y_test, predictions)
accuracy_scores.append(accuracy)
\`\`\`

如果想保留模型預測錯誤的圖片，可以用 \`np.where\` 找出預測與標籤不一致的位置：

\`\`\`python
incorrect_indices = np.where(predictions != y_test)[0]
incorrect_images = X_test[incorrect_indices]
incorrect_labels = y_test[incorrect_indices]
incorrect_prediction = predictions[incorrect_indices]

for i in range(len(incorrect_indices)):
    incorrect.append({
        "image": incorrect_images[i],
        "label": incorrect_labels[i],
        "pred": incorrect_prediction[i],
        "idx": fold_index,
    })
\`\`\`

這種做法很適合圖片分類專案，因為只看 accuracy 不知道錯在哪裡；把錯誤圖片畫出來，才能觀察模型混淆的類別。

## 如何結合 StratifiedKFold 做完整評估？

StratifiedKFold 可以讓每個 fold 保持類別比例，再從訓練 fold 中切出驗證資料。這個流程能同時觀察 fold 穩定度與錯誤樣本。

原文完整範例的流程是：把圖片資料切成 5 份，每次取 4 份訓練、1 份測試，再從訓練資料中切出 10% 當驗證集。每次訓練後記錄 accuracy，並把錯誤圖片保存到 \`incorrect\` 陣列。

\`\`\`python
from sklearn.model_selection import StratifiedKFold, train_test_split
from sklearn.metrics import accuracy_score

kfold = StratifiedKFold(n_splits=5, shuffle=True, random_state=123)

fold_index = 1
accuracy_scores = []
incorrect = []

for train_indices, val_indices in kfold.split(train_images, train_labels_encoded):
    train_images_fold = train_images[train_indices]
    train_labels_fold = train_labels_encoded[train_indices]

    X_test = train_images[val_indices]
    y_test = train_labels_encoded[val_indices]

    X_train, X_val, y_train, y_val = train_test_split(
        train_images_fold,
        train_labels_fold,
        test_size=0.1,
        random_state=42,
    )

    model = create_model()
    keras_classifier.fit(X_train, y_train, validation_data=(X_val, y_val))

    predictions = keras_classifier.predict(X_test)
    accuracy = accuracy_score(y_test, predictions)
    accuracy_scores.append(accuracy)

    incorrect_indices = np.where(predictions != y_test)[0]
    fold_index += 1
\`\`\`

最後可以用 \`matplotlib.pyplot\` 把錯誤圖片顯示出來，觀察模型是否固定把某些類別搞混。

## 常見問題
### 訓練資料和驗證資料差在哪裡？

訓練資料用來更新模型權重。驗證資料不直接更新權重，而是用來調整模型設計與訓練策略。

### 測試資料可以拿來調參嗎？

不建議。測試資料應該留到最後評估，如果反覆用測試資料調參，模型結果會對測試集過度適配。

### train_test_split 的 test_size 要設多少？

常見設定是 0.1 到 0.3。資料量大時可保留較小比例作測試；資料量小時要小心測試集太少造成評估不穩。

### 為什麼圖片分類要看錯誤圖片？

錯誤圖片能指出模型真正混淆的視覺特徵。只看準確率無法知道是資料標註錯誤、類別太像，還是模型架構不足。

### K-Fold 和 train_test_split 可以一起用嗎？

可以。K-Fold 可負責外層訓練與測試切分，\`train_test_split\` 可在每個訓練 fold 中再切出驗證資料。

## 參考資料
- scikit-learn, train_test_split, https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.train_test_split.html，存取日期：2026-08-27。
- scikit-learn, accuracy_score, https://scikit-learn.org/stable/modules/generated/sklearn.metrics.accuracy_score.html，存取日期：2026-08-27。
- TensorFlow, Keras training with built-in methods, https://www.tensorflow.org/guide/keras/training_with_built_in_methods，存取日期：2026-08-27。

## 延伸閱讀

- [k-Fold Cross-Validation 交叉驗證教學：Holdout 與 StratifiedKFold 比較](/post/k-fold-cross-validation)：同樣聚焦 機器學習、TensorFlow，可接著比較不同情境的做法。
- [TensorFlow 目標檢測 API：訓練自己的資料](/post/tensorflow-object-detection-custom-training)：同樣聚焦 TensorFlow、機器學習，可接著比較不同情境的做法。
- [TensorFlow 開發者認證計劃介紹](/post/tensorflow-developer-certificate)：同樣聚焦 TensorFlow、機器學習，可接著比較不同情境的做法。

## 最後更新

Wed Jun 21 2023 08:00:00 GMT+0800 (Taiwan Standard Time)
`;export{e as default};