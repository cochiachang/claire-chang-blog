var e=`---
title: 如何提高機器學習準確率：資料、超參數與模型結構調整
description: 整理提高機器學習準確率的常見方向，包含增加資料、調整超參數、改變模型結構、延長訓練與使用 Keras Tuner。
date: 2022-12-22
category: 機器學習
tags: [機器學習, Keras, 超參數調整]
readingTime: 10 分鐘
image: /images/tech/5-fold-cv.webp
imageAlt: 機器學習交叉驗證流程示意圖
---


# 如何提高機器學習準確率：資料、超參數與模型結構調整

提高機器學習準確率通常不是只改一個參數，而是依序檢查資料品質、訓練資料量、超參數、模型結構與訓練流程。實務上最穩的做法，是先確認資料集切分與標註沒有問題，再用交叉驗證、網格搜索、隨機搜索或 Keras Tuner 找到較好的設定。

## 提高機器學習準確率有哪些方向？

提高機器學習準確率可以從資料、參數、模型與訓練時間四個方向處理。若資料品質不好，後面的超參數調整通常只能有限改善。

常見做法如下：

| 方向 | 做法 | 適用情境 |
| --- | --- | --- |
| 增加訓練數據 | 收集更多樣本、修正標註、補足稀有類別 | 模型在驗證集表現不穩 |
| 調整超參數 | 學習率、損失函數、正則化、批量大小 | 模型可學習，但效果卡住 |
| 改變模型結構 | 增減層數、神經元數量、激活函數 | 欠擬合或過擬合明顯 |
| 訓練更長時間 | 增加 epoch 並搭配 early stopping | 損失仍持續下降 |
| 更換模型 | 嘗試卷積神經網路、殘差網路等架構 | 目前模型不適合資料型態 |

這些方向需要搭配驗證集或交叉驗證觀察，而不是只看訓練集準確率。訓練集準確率提高但驗證集下降，通常代表過擬合。

## 超參數是什麼？

超參數是在訓練前由開發者設定、模型不會自動學到的參數。學習率、批量大小、正則化強度與損失函數都會直接影響模型收斂速度與泛化能力。

常見超參數包含：

- 學習率：決定模型每次更新權重的幅度。
- 損失函數：決定模型要最小化的目標。
- 正則化項：控制模型複雜度，降低過擬合。
- 批量大小：決定每次更新權重時使用的樣本數。
- 層數與神經元數量：決定模型容量。

原文提到可先嘗試的範圍很實用：學習率可從 \`0.001\` 到 \`0.01\` 之間試，正則化率可從 \`0.001\` 到 \`0.01\` 之間試，批量大小可先試 \`32\`、\`64\`、\`128\`。

## 如何用 Keras Tuner 調整模型參數？

Keras Tuner 可以把超參數搜尋流程自動化。開發者先定義可搜尋的 units 與 learning_rate，再由 tuner 依目標指標尋找較好的模型設定。

\`\`\`py
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

def build_model(hp):
    model = keras.Sequential()
    model.add(
        layers.Dense(
            units=hp.Int("units", min_value=32, max_value=512, step=32),
            activation="relu",
            input_shape=(784,),
        )
    )
    model.add(layers.Dense(10, activation="softmax"))
    model.compile(
        optimizer=keras.optimizers.Adam(
            hp.Choice("learning_rate", values=[1e-2, 1e-3, 1e-4])
        ),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )
    return model

tuner = keras.tuner.RandomSearch(
    build_model,
    objective="val_accuracy",
    max_trials=5,
    directory="my_dir",
    project_name="MNIST",
)
\`\`\`

這個範例的資訊增益在於把「要調什麼」收斂成兩個可操作欄位：神經元數量與學習率。若剛開始調參，不建議同時放太多變數，否則很難判斷是哪個設定造成改善。

## 網格搜索和隨機搜索怎麼選？

網格搜索會枚舉所有指定組合，結果較完整但成本較高。隨機搜索只抽樣部分組合，速度較快，適合參數範圍大或訓練成本高的模型。

\`\`\`py
from sklearn.model_selection import GridSearchCV

model = SomeModel()

param_grid = {
    "learning_rate": [0.1, 0.01, 0.001],
    "regularization_rate": [0.1, 0.01, 0.001],
    "batch_size": [32, 64, 128],
}

grid_search = GridSearchCV(model, param_grid, cv=5)
grid_search.fit(X_train, y_train)

print(grid_search.best_params_)
\`\`\`

\`\`\`py
from sklearn.model_selection import RandomizedSearchCV
from scipy.stats import uniform

model = SomeModel()

param_dist = {
    "learning_rate": uniform(0.01, 0.1),
    "regularization_rate": uniform(0.01, 0.1),
    "batch_size": [32, 64, 128],
}

random_search = RandomizedSearchCV(model, param_dist, n_iter=10, cv=5)
random_search.fit(X_train, y_train)

print(random_search.best_params_)
\`\`\`

如果模型訓練一次只要幾秒，網格搜索很適合建立基準。若模型訓練一次需要數分鐘以上，隨機搜索通常更務實。

## 改變模型結構時要注意什麼？

改變模型結構是在調整模型容量。增加層數或神經元可能改善欠擬合，但也可能讓模型記住訓練資料而無法泛化。

神經元是人工神經網路的基本計算單元，通常由輸入、權重、偏差與激活函數組成。訓練神經網路時，模型會調整權重與偏差，讓輸出逐步接近標註答案。

實務上可以依序檢查：

- 訓練集與驗證集準確率都低：可能欠擬合，可增加模型容量或訓練時間。
- 訓練集準確率高、驗證集準確率低：可能過擬合，可增加正則化、Dropout 或資料增強。
- 準確率大幅震盪：可能學習率太大或批量大小不合適。

## 常見問題
### 機器學習準確率低時應該先調模型還是先看資料？

機器學習準確率低時應先看資料。資料標註錯誤、類別不平衡或訓練驗證切分不合理，會讓模型調參失去意義。

### 網格搜索一定比隨機搜索準嗎？

網格搜索不一定比隨機搜索更好。網格搜索只會測試開發者列出的固定值，隨機搜索反而可能在連續範圍中找到更好的組合。

### 訓練更久一定會提高準確率嗎？

訓練更久不一定提高驗證準確率。若模型已經過擬合，增加 epoch 只會讓訓練集表現更好，驗證集表現更差。

### Keras Tuner 適合初學者使用嗎？

Keras Tuner 適合初學者用來理解超參數搜尋流程。建議先限制搜尋範圍，例如只調 learning rate 與 units，避免一次搜尋太多維度。

## 參考資料
- TensorFlow 官方文件，Keras Tuner，https://www.tensorflow.org/tutorials/keras/keras_tuner，存取日期：2026-08-27。
- Optuna 官方網站，https://optuna.org/，存取日期：2026-08-27。
- Hyperopt GitHub，https://github.com/hyperopt/hyperopt，存取日期：2026-08-27。

## 延伸閱讀

- [如何判讀機器學習訓練結果：loss、accuracy、val_loss、val_accuracy 完整解讀](/post/how-to-read-training-results)：同樣聚焦 機器學習、Keras，可接著比較不同情境的做法。
- [二元分類器 (binary classification) 介紹](/post/binary-classifier-introduction)：同樣聚焦 機器學習、Keras，可接著比較不同情境的做法。
- [準備數據集資料的方針：機器學習訓練資料品質、數量與篩選原則](/post/dataset-preparation-guidelines)：同樣聚焦 機器學習，可接著比較不同情境的做法。
`;export{e as default};