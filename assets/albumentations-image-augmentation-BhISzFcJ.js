var e=`---
title: Albumentations 資料增強工具教學：PyTorch 影像訓練前處理範例
description: 介紹 Albumentations 的影像資料增強用途、常見 transform、PyTorch 整合方式與 Resize、Flip、Rotate、Normalize 範例。
date: 2023-08-21
category: 機器學習
tags: [Albumentations, 資料增強, PyTorch]
readingTime: 6 分鐘
image: /images/tech/5-fold-cv.webp
imageAlt: 機器學習資料切分與訓練流程示意圖
---
# Albumentations 資料增強工具教學：PyTorch 影像訓練前處理範例

Albumentations 是一個常用的電腦視覺資料增強函式庫，適合影像分類、物件偵測與語意分割任務。Albumentations 可以把旋轉、翻轉、裁切、亮度調整、正規化與 tensor 轉換組成流水線，讓模型在訓練時看到更多影像變化。

## Albumentations 是什麼？

Albumentations 是專為影像資料增強設計的 Python 函式庫。Albumentations 支援 PyTorch、TensorFlow 等深度學習流程，常用於提升模型泛化能力。

我整理的官方資源如下：

- GitHub：[https://github.com/albumentations-team/albumentations](https://github.com/albumentations-team/albumentations)
- 官方文件：[https://albumentations.ai/docs/2-core-concepts/transforms/](https://albumentations.ai/docs/2-core-concepts/transforms/)
- 官方範例：[PyTorch semantic segmentation notebook](https://github.com/albumentations-team/albumentations_examples/blob/master/notebooks/pytorch_semantic_segmentation.ipynb)

資料增強（Data Augmentation）指的是在不改變標籤語意的前提下，對訓練影像做合理變換，例如翻轉、裁切、旋轉或調整亮度。對影像模型來說，這能降低模型只記住訓練集細節的風險。

## Albumentations 有哪些特點？

Albumentations 的優點是 transform 豐富、速度快、容易組合，並且能同時處理 image、mask、bbox 等不同標註目標。

整理的特點包含：

| 特點 | 說明 |
| --- | --- |
| 多樣增強技術 | 旋轉、翻轉、裁切、縮放、亮度、對比、顏色、模糊、噪聲 |
| 高性能 | 以速度和記憶體效率為目標，適合訓練流程 |
| 靈活組合 | 可用 \`A.Compose\` 組合多個增強操作 |
| 易於整合 | 可接 PyTorch、TensorFlow 等框架 |
| 可預覽 | 可視化原圖與增強後圖片 |
| 多線程支援 | 適合大型資料集前處理 |
| 範例完整 | 官方文件和 notebook 可直接參考 |

Albumentations 的資訊增益在於，它不只轉圖片，也能處理分割 mask 或 bounding box。這對物件偵測和語意分割特別重要。

## 如何使用 Albumentations 建立增強流程？

Albumentations 通常用 \`A.Compose\` 建立資料增強流水線。每個 transform 可以設定機率，讓訓練資料產生不同變化。

以下保留核心範例：

\`\`\`python
import albumentations as A
from albumentations.pytorch import ToTensorV2
import cv2
import matplotlib.pyplot as plt

image_path = 'path_to_your_image.jpg'
image = cv2.imread(image_path)
image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

transform = A.Compose([
    A.Resize(width=256, height=256),
    A.HorizontalFlip(p=0.5),
    A.VerticalFlip(p=0.5),
    A.Rotate(limit=30, p=0.5),
    A.RandomBrightnessContrast(p=0.2),
    A.Normalize(),
    ToTensorV2(),
])

transformed_image = transform(image=image)['image']
\`\`\`

\`p=0.5\` 代表該操作有 50% 機率被套用。\`A.Normalize()\` 會做正規化，\`ToTensorV2()\` 則把影像轉成 PyTorch tensor。

## 如何預覽 Albumentations 的增強結果？

資料增強一定要預覽，因為錯誤 transform 可能讓標籤失真。Albumentations 產生結果後，可用 Matplotlib 顯示原圖與增強圖。

我使用的可視化方式如下：

\`\`\`python
plt.figure(figsize=(10, 5))

plt.subplot(1, 2, 1)
plt.imshow(image)
plt.title('Original Image')

plt.subplot(1, 2, 2)
plt.imshow(transformed_image[0])
plt.title('Transformed Image')

plt.show()
\`\`\`

實務上要注意 tensor 維度與通道順序。OpenCV 讀圖是 BGR，Matplotlib 顯示通常需要 RGB；PyTorch tensor 則常是 channel-first。若顏色怪怪的，先檢查通道順序。

## Albumentations 使用時要注意什麼？

資料增強不是越多越好。增強策略要符合真實資料可能出現的變化，否則模型會學到不合理的影像分布。

實作檢查表：

| 任務 | 注意事項 |
| --- | --- |
| 影像分類 | 翻轉或旋轉不能改變類別語意 |
| 物件偵測 | bbox 必須跟著圖片變換 |
| 語意分割 | mask 必須使用相同幾何變換 |
| 醫療或工業影像 | 亮度與顏色增強要符合設備條件 |
| 小資料集 | 增強可降低過擬合，但仍要保留驗證集 |

例如辨識左右方向有意義的交通標誌時，水平翻轉可能會製造錯誤樣本。資料增強應該服務任務，而不是把 transform 清單全部打開。

## 常見問題
### Albumentations 可以和 PyTorch 一起用嗎？

可以。Albumentations 提供 \`albumentations.pytorch.ToTensorV2\`，可把增強後影像轉成 PyTorch tensor。

### Albumentations 可以處理 segmentation mask 嗎？

可以。Albumentations 支援 image 與 mask 同步變換，因此常用在語意分割任務。

### 資料增強會提升模型準確率嗎？

資料增強可能提升泛化能力，但不保證每個任務都提升準確率。增強策略要符合真實資料分布，並用驗證集確認效果。

### Albumentations 和 torchvision transforms 差在哪？

Albumentations 在影像增強種類、速度與偵測/分割標註支援上很完整。torchvision transforms 則和 PyTorch 生態整合簡單。

### 為什麼 OpenCV 讀圖後要轉 RGB？

OpenCV 預設讀取 BGR 通道，Matplotlib 和多數影像處理流程常用 RGB。若不轉換，顯示顏色可能會不正確。

## 參考資料
- Albumentations，〈[GitHub repository](https://github.com/albumentations-team/albumentations)〉。
- Albumentations，〈[Transforms and targets](https://albumentations.ai/docs/2-core-concepts/transforms/)〉。
- Albumentations examples，〈[PyTorch semantic segmentation notebook](https://github.com/albumentations-team/albumentations_examples/blob/master/notebooks/pytorch_semantic_segmentation.ipynb)〉。

## 延伸閱讀

- [TensorFlow 圖像操作功能筆記：tf.image 常用前處理與資料增強](/post/tensorflow-image-operations)：同樣聚焦 資料增強，可接著比較不同情境的做法。
- [使用數據增強提高圖像辨識準確率：ImageDataGenerator 與 tf.image 範例](/post/image-data-augmentation-accuracy)：同樣聚焦 資料增強，可接著比較不同情境的做法。
- [Roboflow 線上標記工具介紹：團隊協作標註、匯入資料集與 no code 建模](/post/roboflow-online-labeling-tool)：同樣聚焦 資料增強，可接著比較不同情境的做法。

## 最後更新

2026-08-28

`;export{e as default};