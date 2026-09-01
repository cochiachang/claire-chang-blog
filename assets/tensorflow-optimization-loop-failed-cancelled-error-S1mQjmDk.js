var e=`---
title: "TensorFlow Optimization loop failed 原因與解法"
description: TensorFlow 出現此警告代表運算資源耗盡、優化循環被強制中斷，說明原因與記憶體/CPU 兩種解法。
date: 2023-06-14
category: 機器學習
tags:
  - TensorFlow
  - 錯誤排解
  - 模型訓練
  - 資源監控
readingTime: 6 分鐘
image: /images/tech/hero_tensorflow-optimization-loop-failed-cancelled-error.webp
imageAlt: 電腦螢幕上重複顯示紅色錯誤訊息的畫面
---
# Optimization loop failed: Cancelled: Operation was cancelled

訓練模型時我在終端機裡看到一長串重複的警告：

\`\`\`
2023-06-14 16:32:39.652288: W tensorflow/core/data/root_dataset.cc:167] Optimization loop failed: Cancelled: Operation was cancelled
\`\`\`

![終端機中重複出現的 TensorFlow 錯誤訊息](/images/tech/tensorflow-optimization-loop-error-log.webp)

畫面上同一行訊息不斷刷新，時間戳一個接一個往後跳。這篇記錄這個警告的意思、常見成因，以及我實際用來解決它的兩個方向。

## 這個錯誤訊息代表什麼？

這行訊息代表 TensorFlow 在優化資料管線（\`tf.data\`）的過程中，操作被取消了。優化循環沒能跑完，代表 TensorFlow 沒有拿到它想要的計算結果。

被取消之後可能發生三種情況：

- **訓練中斷**：如果正在訓練模型，這次中斷會讓整個訓練流程停下來，拿不到最終訓練好的模型。
- **只剩部分結果**：依中斷發生的時間點，TensorFlow 有時會嘗試回傳已經算出來的部分結果，但這些結果通常不完整、不能直接拿來用。
- **推論失敗**：如果是拿模型做推論（例如丟一段文字進去做分類），取消會讓你拿不到預測結果，或結果不準確。

## 為什麼會出現這個錯誤？

大部分情況都是資源不夠，運算被系統或 TensorFlow 自己中斷：

- **計算資源不足**：CPU 模式下跑大型模型或大資料集，本來就需要比較久的時間，資源撐不住就會被取消。
- **記憶體不足**：模型或資料一大，記憶體吃緊，操作同樣會被取消。
- **設定錯誤**：TensorFlow 版本或依賴套件裝錯，也可能讓操作跑不完。

## 怎麼確認是 CPU 還是記憶體的問題？

先在程式裡加監控，才知道要往哪個方向修。可以參考這篇教學：[How to get current CPU and RAM usage in Python](https://www.geeksforgeeks.org/how-to-get-current-cpu-and-ram-usage-in-python/)。

\`\`\`python
# Importing the library
import psutil

# Getting % usage of virtual_memory ( 3rd field)
if psutil.virtual_memory()[2] > 80:
    print(time.strftime("%Y-%m-%d_%H-%M-%S") + ' RAM memory % used:', psutil.virtual_memory()[2])
    # Getting usage of virtual_memory in GB ( 4th field)
    print('RAM Used (GB):', psutil.virtual_memory()[3]/1000000000)

cpu_usage = psutil.cpu_percent()
if cpu_usage > 80:
    print(time.strftime("%Y-%m-%d_%H-%M-%S") + ' The CPU usage is: ', cpu_usage)
\`\`\`

跑起來之後盯著這兩個數字，超過 80% 的那一項通常就是瓶頸所在。

## 記憶體用太多時該怎麼解決？

如果有 GPU，先試試看放寬可用的記憶體上限。TensorFlow 官方討論串裡也有人靠這一招解決：

\`\`\`python
gpus = tf.config.experimental.list_physical_devices('GPU')
tf.config.experimental.set_memory_growth(gpu, True)
\`\`\`
（原討論串已下架）
沒有 GPU 或記憶體本來就有限的話，可以從這幾個方向下手：

- **調整 batch_size**：batch_size 越大，記憶體需求越高。先把它調小，但太小會影響訓練穩定度和收斂速度，要抓一個平衡點。
- **縮小模型**：減少層數或參數量、換成 MobileNet、SqueezeNet 這類輕量架構、做剪枝、或改用 16 位元浮點數存參數。
- **縮小資料集**：隨機抽樣一部分資料訓練（注意抽出來的子集仍要有代表性），或把大資料集切成小份，用交叉驗證分批訓練。

## CPU 用太多時該怎麼解決？

- **減少輸入資料的處理量**：縮小圖片尺寸、縮短輸入序列長度、降低資料維度。
- **用批次預測**：\`Model.predict()\` 本來就支援批量輸入，一次丟多筆樣本進去，比一筆一筆算更省。
- **善用並行處理**：系統支援多執行緒或多進程的話，Python 的 \`multiprocessing\`，或 \`tf.data.Dataset\` 內建的並行化功能都能用上。
- **檢查模型是否有冗餘計算**：用 \`tf.function\`、\`tf.autograph\` 這類圖優化工具，看看計算圖裡有沒有可以簡化的部分。
- **考慮換一套工具**：某些場景下 PyTorch 或 Scikit-learn 的效率會更適合你的需求。
- **升級硬體**：如果預算允許，加 CPU 核心或升級到更強的 CPU，能直接提高並行處理能力。

## 常見問題

### 這個警告會讓程式直接崩潰嗎？

不一定。它是一個警告（\`W\` 開頭），不是致命錯誤，但代表這次的優化循環沒有跑完，訓練或推論的結果通常也因此不完整或缺失。

### 沒有 GPU 也能解決這個問題嗎？

可以。前面提到的調整 batch_size、縮小模型、縮減資料集規模，都是不依賴 GPU 的做法，實務上也是多數人優先會試的方向。

### 應該先查記憶體還是先查 CPU？

先用 \`psutil\` 把兩個指標都印出來看，哪個先衝到 80% 以上就先處理哪個，不用用猜的。

## 參考資料
TensorFlow 官方文件，tf.data 效能優化指南，說明資料管線的 prefetch、平行化與快取等優化機制，存取日期：2026-08-27。[https://www.tensorflow.org/guide/data_performance](https://www.tensorflow.org/guide/data_performance)

## 延伸閱讀

- [TensorFlow 和 Keras 版本不相容錯誤：cannot import name 'dtensor' 解法](/post/tensorflow-keras-version-compatibility-error)：同樣聚焦 TensorFlow、錯誤排解，可接著比較不同情境的做法。
- [在 Python 裡面使用 GPU 3 – 開發 GPU 程式](/post/python-gpu-development)：同樣聚焦 TensorFlow、模型訓練，可接著比較不同情境的做法。
- [如何使用 TensorBoard 觀察模型效能](/post/tensorboard-monitor-model-performance)：同樣聚焦 TensorFlow、模型訓練，可接著比較不同情境的做法。
`;export{e as default};