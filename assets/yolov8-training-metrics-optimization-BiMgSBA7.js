var e=`---
title: YOLOv8 模型訓練指標解析：IoU、mAP、Precision、Recall 與優化策略
description: 深入整理 YOLOv8 訓練流程、遷移學習、IoU、mAP50、mAP50-95、Precision、Recall 與 TensorBoard 監控重點。
date: 2023-08-16
category: 機器學習
tags: [YOLOv8, 物件偵測, mAP, IoU, TensorBoard]
readingTime: 10 分鐘
image: /images/tech/hero_yolov8-training-metrics-optimization.webp
imageAlt: YOLOv8 模型訓練指標解析：IoU、mAP、Precision、Recall 與優化策略 hero image
---


# YOLOv8 模型訓練指標解析：IoU、mAP、Precision、Recall 與優化策略

YOLOv8 模型訓練不能只看 loss 是否下降，還要同時解讀 IoU、mAP50、mAP50-95、Precision 與 Recall。這些指標分別回答定位準不準、整體偵測好不好、誤報多不多，以及漏檢是否嚴重。

## YOLOv8 如何開始訓練自訂資料集？

YOLOv8 訓練自訂資料集通常從預訓練權重開始。載入 \`yolov8n.pt\` 這類權重後，再用自己的 dataset YAML 微調，是最常見的遷移學習流程。

\`\`\`python
from ultralytics import YOLO

model = YOLO('yolov8n.pt')
results = model.train(data='custom_dataset.yaml', epochs=100, imgsz=640)
\`\`\`

Ultralytics 官方 Python 用法文件提供 \`YOLO(...)\`、\`train()\`、\`val()\`、\`predict()\` 等流程（Ultralytics，存取日期：2026-08-27）。若資料量不大，從預訓練模型開始通常比從 YAML 隨機初始化更穩定。

## YOLOv8 模型大小怎麼選？

YOLOv8 模型大小通常在速度、記憶體與準確率之間取捨。YOLOv8n 最小最快，YOLOv8x 最大最慢但容量較高。

| 模型 | 適合情境 |
|---|---|
| YOLOv8n | 邊緣裝置、快速原型、即時性優先 |
| YOLOv8s | 一般輕量部署 |
| YOLOv8m | 準確率與速度平衡 |
| YOLOv8l | 準確率優先 |
| YOLOv8x | 資源充足、追求較高容量 |

實務資訊增益：模型選型不要只看驗證集 mAP。若部署環境是 CPU 或邊緣 GPU，推論延遲與記憶體峰值常比 mAP 小數點差異更重要。

## IoU、Precision 和 Recall 怎麼解讀？

IoU 衡量預測框與真實框的重疊程度，Precision 衡量預測框有多少是正確的，Recall 衡量真實目標有多少被找出來。三個指標要一起看。

| 指標 | 回答的問題 |
|---|---|
| IoU | 框的位置準不準 |
| Precision | 誤報多不多 |
| Recall | 漏檢多不多 |

若 Precision 高但 Recall 低，模型可能很保守，只偵測最有把握的目標。若 Recall 高但 Precision 低，模型可能框出很多錯誤物件。

## mAP50 和 mAP50-95 差在哪？

mAP50 是在 IoU 0.50 門檻下計算平均精度，mAP50-95 則跨 0.50 到 0.95 多個 IoU 門檻取平均。mAP50-95 對定位品質要求更高。

Ultralytics 指標文件把 precision、recall、mAP50 與 mAP50-95 列為 YOLO 評估重點（Ultralytics，存取日期：2026-08-27）。若 mAP50 不錯但 mAP50-95 明顯偏低，代表模型大致找得到物件，但框的位置不夠精準。

## 如何用 TensorBoard 監控訓練？

TensorBoard 適合觀察 YOLOv8 訓練過程中的 loss 與驗證指標。監控曲線可以幫助判斷模型是否過擬合、欠擬合或需要調整資料。

\`\`\`python
results = model.train(
    data='custom_dataset.yaml',
    epochs=100,
    imgsz=640,
    project='YOLOv8_training',
    name='experiment1',
)
\`\`\`

優化策略：

- validation 指標停滯時，先檢查標註品質。
- recall 偏低時，補充漏檢場景資料。
- precision 偏低時，檢查類別定義與背景誤標。
- mAP50-95 偏低時，提升標註框一致性與輸入解析度。

## 常見問題

### YOLOv8 一定要從預訓練模型開始嗎？

YOLOv8 不一定要從預訓練模型開始，但自訂資料集通常建議使用預訓練權重微調。從零訓練需要更多資料、時間與算力。

### mAP50 高就代表模型很好嗎？

mAP50 高只代表 IoU 0.50 門檻下表現不錯。若任務要求精準定位，還要看 mAP50-95 與實際錯誤案例。

### Precision 和 Recall 哪個比較重要？

Precision 和 Recall 的重要性取決於任務成本。誤報成本高時重視 Precision，漏檢成本高時重視 Recall。

### YOLOv8n 和 YOLOv8x 怎麼選？

即時部署或硬體有限時先選 YOLOv8n 或 YOLOv8s。資料充足且準確率優先時，再評估 YOLOv8l 或 YOLOv8x。

### 訓練 loss 下降但 mAP 沒提升怎麼辦？

loss 下降但 mAP 沒提升時，應檢查驗證集標註、類別分布、資料切分與輸入解析度。這種情況常代表模型在學訓練資料，但泛化沒有改善。

## 參考資料

- Ultralytics，〈[YOLO Python Usage](https://docs.ultralytics.com/usage/python/)〉，存取日期：2026-08-27。
- Ultralytics，〈[YOLO Performance Metrics](https://docs.ultralytics.com/guides/yolo-performance-metrics/)〉，存取日期：2026-08-27。

## 延伸閱讀

- [YOLOv8 物件偵測模型介紹：安裝、預測、訓練與輸出流程](/post/yolov8-object-detection-model)：同樣聚焦 YOLOv8、物體偵測，可接著比較不同情境的做法。
- [物體偵測技術介紹：Bounding Box、類別分類與常見模型架構](/post/object-detection-technology-introduction)：同樣聚焦 物體偵測，可接著比較不同情境的做法。
- [YOLOv8 使用範例：Roboflow 資料集訓練與 best.pt 即時偵測](/post/yolov8-usage-example)：同樣聚焦 YOLOv8，可接著比較不同情境的做法。

## 最後更新

2026-08-28

`;export{e as default};