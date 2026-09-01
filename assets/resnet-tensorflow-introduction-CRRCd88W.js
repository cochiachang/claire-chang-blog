var e=`---
title: ResNet 殘差網路是什麼？TensorFlow ResNet 介紹與使用範例
description: ResNet 殘差網路（Residual Network）是深度學習影像辨識的里程碑模型。本文介紹 ResNet 的殘差連結原理、解決梯度消失的方式，以及用 TensorFlow/Keras 建構 ResNet 的做法。
date: 2023-01-11
category: 機器學習
tags: [ResNet, TensorFlow, 深度學習, CNN, 梯度消失]
readingTime: 8 分鐘
image: /images/tech/hero_resnet-tensorflow-introduction.webp
imageAlt: ResNet 殘差網路架構示意圖
---


# ResNet 殘差網路是什麼？TensorFlow ResNet 介紹與使用範例

ResNet（殘差網路）是為解決深度神經網路梯度消失問題而設計的卷積神經網路架構。這篇文章整理 ResNet 的原理、它與自己用 Conv2D 湊出模型的關鍵差異、TensorFlow/Keras 的使用範例，以及 ResNet50/101/152 與 V2 版本之間的比較和超參數設定建議。

## 殘差網路 ResNet 是什麼？

殘差網路（Residual Network，簡稱 ResNet）是一種深度卷積神經網路，它被設計用來解決深度神經網路中的梯度消失問題。

在深度神經網路中，隨著層數的增加，梯度有可能會越來越小，導致模型無法有效地學習。殘差網路透過在每一層中引入一個「殘差塊（Residual Block）」來解決這個問題。殘差塊包含兩個卷積層和一個殘差路徑，殘差路徑會把輸入數據直接加到輸出數據上。這樣，當殘差塊的輸出數據與輸入數據相加時，梯度就不會被消失。

更多殘差網路的原理說明，可以參考[這篇介紹文章（iThelp）](https://ithelp.ithome.com.tw/articles/10264843?sc=hot)。

## ResNet 與 Conv2D 有什麼關鍵不同？

Conv2D 是提取圖片特徵的方式，它可以讓圖片也能丟進 Dense 層找到共通特徵，但 Conv2D 一定需要與其他層（池化層、全連接層、輸出層等）一起使用，通常要自己從頭搭建一個模型。

而殘差網路則是機器學習前人用卷積層、池化層、連接層等組合出來、可有效降低梯度消失問題的一個**已經建立好的模型**。例如以下是一個原始的 TF 模型建立方式：

\`\`\`python
model = tf.keras.Sequential([
    tf.keras.layers.Rescaling(1./255),
    tf.keras.layers.Conv2D(32, 3, activation='relu'),
    tf.keras.layers.MaxPooling2D(),
    tf.keras.layers.Conv2D(32, 3, activation='relu'),
    tf.keras.layers.MaxPooling2D(),
    tf.keras.layers.Conv2D(32, 3, activation='relu'),
    tf.keras.layers.MaxPooling2D(),
    tf.keras.layers.Flatten(),
    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.Dense(num_classes)
])
\`\`\`

## ResNet 在 TensorFlow 裡怎麼使用？

使用 ResNet 非常簡單，直接使用別人已建立好的 ResNet 架構即可。以下範例中的 ResNet 使用了 20 個 ResidualBlock，每個 ResidualBlock 使用 64 個濾波器，卷積核大小為 3x3，步長為 2：

\`\`\`python
import tensorflow as tf
from tensorflow.keras import layers

class ResidualBlock(layers.Layer):
    def __init__(self, filters, kernel_size, strides, use_projection=False):
        super(ResidualBlock, self).__init__()
        self.use_projection = use_projection
        self.conv1 = layers.Conv2D(filters, kernel_size, strides=strides, padding='same')
        self.bn1 = layers.BatchNormalization()
        self.relu = layers.ReLU()
        self.conv2 = layers.Conv2D(filters, kernel_size, strides=1, padding='same')
        self.bn2 = layers.BatchNormalization()
        if use_projection:
            self.projection = layers.Conv2D(filters, 1, strides=strides, padding='same')

    def call(self, inputs, training=False):
        x = self.conv1(inputs)
        x = self.bn1(x, training=training)
        x = self.relu(x)
        x = self.conv2(x)
        x = self.bn2(x, training=training)
        if self.use_projection:
            shortcut = self.projection(inputs)
        else:
            shortcut = inputs
        x += shortcut
        x = self.relu(x)
        return x

class ResNet(layers.Layer):
    def __init__(self, blocks, filters, kernel_size, strides):
        super(ResNet, self).__init__()
        self.conv = layers.Conv2D(filters, kernel_size, strides=strides, padding='same')
        self.bn = layers.BatchNormalization()
        self.relu = layers.ReLU()
        self.blocks = blocks
        self.res_blocks = [ResidualBlock(filters, kernel_size, strides) for _ in range(blocks)]

    def call(self, inputs, training=False):
        x = self.conv(inputs)
        x = self.bn(x, training=training)
        x = self.relu(x)
        for res_block in self.res_blocks:
            x = res_block(x, training=training)
        return x

inputs = tf.keras.Input(shape=(224, 224, 3))
resnet = ResNet(20, 64, 3, 2)(inputs)
outputs = layers.Dense(10, activation='softmax')(resnet)
model = tf.keras.Model(inputs, outputs)
\`\`\`

除了自己實作，也可以直接用 Keras 內建的 applications 模組：

- [ResNet V1 官方 API 文件](https://www.tensorflow.org/api_docs/python/tf/keras/applications/resnet)
- [ResNet V2 官方 API 文件](https://www.tensorflow.org/api_docs/python/tf/keras/applications/resnet_v2)

## ResNet50、ResNet101、ResNet152 與 V2 版本有什麼差別？

ResNet50、ResNet101、ResNet152 是 TensorFlow 中原始版本的 ResNet 模型，而 ResNet50V2、ResNet101V2、ResNet152V2 是 V2 版本。主要區別如下：

| 面向 | V1（50/101/152） | V2（50V2/101V2/152V2） |
| --- | --- | --- |
| 深度 | 50 / 101 / 152 層 | 分別對應 50 / 101 / 152 層 |
| 架構 | 原始殘差架構 | 增加 bottleneck layer 減少參數數量，輸入層與輸出層之間使用高密度連接（dense connection） |
| 參數數量 | 較多 | 通常較少（架構更高效） |
| 效能 | — | 通常更好 |

總結來說：如果要在效能和參數數量之間取得平衡，使用 V2 版本是比較好的選擇；如果效能是優先考量，則可以使用原始版本的 ResNet 模型。

## ResNet 的超參數要怎麼設定？

建立殘差網路 ResNet 模型時，有一些重要的超參數可以考慮調整：

- **卷積層數量（num_blocks）**：越多的卷積層通常表現更好，但模型越大、訓練時間越長，需依實際情況決定。
- **初始濾波器數量（initial_filters）**：較大的濾波器通常表現更好，同樣會增加模型大小與訓練時間。
- **激活函數（activation）**：對輸入施加非線性轉換，讓模型能學習更複雜的模式；常見的有 ReLU、Sigmoid 和 tanh。
- **優化器（optimizer）**：更新模型參數的算法，常見如 SGD、Adam 和 RMSprop。
- **學習率（learning rate）**：學習率過大會震盪、無法有效學習；過小則收斂太慢，需依實際情況選擇。
- **批次大小（batch size）**：過大更新快但可能影響表現；過小更新慢，但有可能讓表現更好。
- **訓練輪數（epochs）**：過多可能過擬合導致驗證集表現變差；過少則學不到訓練集中的模式。
- **正規化（regularization）**：加入額外限制防止過度擬合，常見方法有 L1 與 L2 正規化。
- **丟棄率（dropout rate）**：訓練過程中隨機丟棄一定比例的神經元，防止過度擬合。
- **濾波器數量（filters）**與**濾波器大小（filter size）**：越多、越大的濾波器通常表現更好，但也讓模型更大、訓練更久。

## 如何使用 Keras Tuner 自動調參（Tunable ResNet）？

如果不想手動試超參數，可以使用 Keras Tuner 來自動搜尋：

- GitHub 位置：<https://github.com/keras-team/keras-tuner>
- 官方網站：<https://keras.io/keras_tuner/>

![Keras Tuner 官方頁面截圖，展示超參數調校介面](/images/articles/resnet-tensorflow-introduction-1.webp)

## 常見問題

### ResNet 為什麼能解決梯度消失？

因為殘差塊有一條把輸入直接加到輸出的捷徑（shortcut）路徑，讓梯度可以沿著這條路徑直接回傳，不會在層層堆疊中不斷變小。

### 應該選 ResNet50 還是 ResNet50V2？

一般建議優先選 V2：參數更少、效能通常更好，是效能與模型大小的平衡點。若要重現原始論文結果或效能優先，才選 V1。

### ResNet 一定要從頭自己寫嗎？

不需要。Keras 的 \`tf.keras.applications\` 已內建 ResNet50/101/152 與 V2 版本，可以直接載入預訓練權重做遷移學習。

### ResNet 只能用在圖片分類嗎？

ResNet 原本是為影像分類設計的，但殘差連接的概念已被廣泛用於各種深度網路（物件偵測、分割等）作為骨幹網路。

## 參考資料

- [iThelp：ResNet 殘差網路介紹](https://ithelp.ithome.com.tw/articles/10264843?sc=hot)
- [TensorFlow ResNet V1 API 文件](https://www.tensorflow.org/api_docs/python/tf/keras/applications/resnet)
- [TensorFlow ResNet V2 API 文件](https://www.tensorflow.org/api_docs/python/tf/keras/applications/resnet_v2)
- [Keras Tuner GitHub](https://github.com/keras-team/keras-tuner) 與 [官方網站](https://keras.io/keras_tuner/)

## 延伸閱讀

- [卷積神經網路 CNN 介紹：卷積層、池化層與彩色圖片處理原理](/post/cnn-convolutional-neural-network-intro)：同樣聚焦 CNN、TensorFlow，可接著比較不同情境的做法。
- [Keras 介紹：用 Python 快速建立深度學習模型的高階 API](/post/keras-introduction)：同樣聚焦 TensorFlow、深度學習，可接著比較不同情境的做法。
- [深度學習模型-MLP、CNN與 RNN](/post/deep-learning-models-mlp-cnn-rnn)：同樣聚焦 深度學習、CNN，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2023-01-11，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};