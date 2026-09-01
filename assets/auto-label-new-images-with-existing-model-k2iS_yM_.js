var e=`---
title: 使用現有模型標記新圖片：SAM、Roboflow 與 YOLO label 轉換流程
description: 整理用 Segment Anything、Roboflow 智慧圈選與 YOLOv8 既有模型加速圖片標記，並將預測結果輸出為 YOLO 格式 label。
date: 2023-08-30
category: 機器學習
tags: [Auto Labeling, YOLOv8, Segment Anything]
readingTime: 9 分鐘
image: /images/tech/2024-05-17_161226.webp
imageAlt: 影像標記與物件偵測結果示意截圖
---
# 使用現有模型標記新圖片：SAM、Roboflow 與 YOLO label 轉換流程

使用現有模型標記新圖片的做法，是先讓 SAM、Roboflow 或 YOLOv8 對圖片產生候選遮罩或框選結果，再把預測結果轉成標註檔，最後由人工在標記工具中檢查與修正。這種流程不能完全取代人工標記，但能大幅減少從零開始圈選的時間。

## Auto Labeling 為什麼有用？

Auto Labeling 可以先產生候選標註，讓人工從「畫第一筆」變成「檢查與修正」。影像資料量大時，這能明顯降低標記成本。

圖片標記常花很多時間和力氣，因此市面上有許多 auto labeling 工具。Meta 發表的 Segment Anything Model（SAM）就是受到關注的模型之一。SAM 官方網站是 [https://segment-anything.com/](https://segment-anything.com/)。

Auto Labeling 最適合用在常見物件、邊界明確、已有預訓練模型可辨識的資料。例如汽車、人、機車等類別，YOLO 類模型通常已有不錯的預測能力。

## 如何用 SAM 產生圖片遮罩？

Segment Anything Model 可以對圖片產生多個 segmentation masks。使用者可以把 SAM 的結果當成初始標註，再進一步挑選或修正。

我實測時使用 \`SamAutomaticMaskGenerator\`：

\`\`\`python
from segment_anything import sam_model_registry, SamAutomaticMaskGenerator
import matplotlib.pyplot as plt
import cv2
import numpy as np

def show_anns(anns):
    if len(anns) == 0:
        return
    sorted_anns = sorted(anns, key=(lambda x: x['area']), reverse=True)
    ax = plt.gca()
    ax.set_autoscale_on(False)

    img = np.ones((sorted_anns[0]['segmentation'].shape[0], sorted_anns[0]['segmentation'].shape[1], 4))
    img[:, :, 3] = 0
    for ann in sorted_anns:
        m = ann['segmentation']
        color_mask = np.concatenate([np.random.random(3), [0.35]])
        img[m] = color_mask
    ax.imshow(img)

image = cv2.imread('./train/example.jpg')
image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

sam_checkpoint = "sam_vit_h_4b8939.pth"
model_type = "vit_h"
device = "cpu"

sam = sam_model_registry[model_type](checkpoint=sam_checkpoint)
sam.to(device=device)

mask_generator = SamAutomaticMaskGenerator(sam)
masks = mask_generator.generate(image)
print(len(masks))
print(masks[0].keys())

plt.figure(figsize=(20, 20))
plt.imshow(image)
show_anns(masks)
plt.axis('off')
plt.show()
\`\`\`

這段程式的重點是先取得 \`masks\`，再檢查每個 mask 裡有哪些欄位。真正落地時，還需要把遮罩轉成標註格式。

## Roboflow 的智慧圈選工具適合做什麼？

Roboflow 的智慧圈選工具適合在人機協作標註流程中使用。使用者可以讓工具先圈選目標形狀，再人工確認邊界是否正確。

Roboflow 也有類似智慧圈選工具，可以自動圈選目標形狀。這類工具最實用的地方是介面化：不用先寫轉檔程式，也能快速修正模型產生的候選標註。

如果團隊已經在 Roboflow 管理資料集，可以把模型預測結果匯入 Roboflow，再集中檢查錯誤標記。這樣標註品質會比完全自動化更可靠。

## 為什麼要用現有 YOLO 模型標記新圖片？

既有 YOLO 模型對常見物件已有不錯偵測能力。把 YOLO 預測轉成 label 後，再匯入標註工具修正，可以加快新資料集建立。

我的做法是使用 YOLOv8 既有模型預測新圖片，將預測結果轉成 YOLO 格式 label，然後匯入 Roboflow 等標記軟體檢視和修正。這個流程尤其適合常見類別，例如汽車、人、機車。

注意：預測結果只是初稿，不是最終標註。模型可能漏標、誤標或邊界不精準，正式訓練前仍應人工審核。

## 如何讀取 YOLOv8 的預測結果？

YOLOv8 的 Results 物件會包含 boxes、masks、keypoints 和 probs 等欄位。使用者可以依任務類型取出需要的標註資訊。

我參考 Ultralytics Results 文件，並用以下程式觀察返回物件：

\`\`\`python
from ultralytics import YOLO

model = YOLO('yolov8n.pt')
results = model(['im1.jpg', 'im2.jpg'])

for result in results:
    boxes = result.boxes
    masks = result.masks
    keypoints = result.keypoints
    probs = result.probs
    print(masks)
\`\`\`

我的心得是，YOLOv8 文件寫得很清楚，尤其可以從程式碼印出返回物件結構，快速理解如何取得所需資訊。這是工程實作中很實用的除錯方式。

## 如何把 YOLOv8 segmentation 結果轉成 label？

YOLO segmentation label 可由類別編號加上 normalized polygon 座標組成。程式可讀取 \`r.masks.xyn\` 和 \`r.boxes.cls\`，逐張圖片輸出 txt。

完整範例整理如下：

\`\`\`python
from ultralytics import YOLO
import os

folder_path = './datasets/coco8-seg/images/train'
images = []

if not os.path.exists(folder_path):
    print("資料夾不存在")
else:
    file_list = os.listdir(folder_path)
    for filename in file_list:
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            file_path = os.path.join(folder_path, filename)
            images.append(file_path)

model = YOLO('yolov8n-seg.pt')
results = model(images)

for r in results:
    formatted_string = ""
    if r is not None and r.masks is not None:
        for i in range(len(r.masks.xyn)):
            mask = r.masks.xyn[i]
            cls = int(r.boxes.cls[i].item())
            formatted_rows = [cls]
            for row in mask:
                formatted_rows.append(row[0])
                formatted_rows.append(row[1])

            line = " ".join(str(x) for x in formatted_rows)
            formatted_string = ((formatted_string + '\\n') if formatted_string else "") + line

        label_path = r.path.replace('.jpg', '.txt').replace('images', 'labels')
        with open(label_path, "a") as file:
            file.write(formatted_string)
\`\`\`

實務上建議把 \`"a"\` 改成可控策略，例如覆蓋前先備份，避免重跑程式時把同一張圖片的標註重複 append。

## YOLO 格式如何轉成 COCO 格式？

YOLO 與 COCO 是不同標註格式。若訓練流程或平台要求 COCO，可使用轉換工具把 YOLO label 轉成 COCO JSON。

我參考的專案是 [Taeyoung96/Yolo-to-COCO-format-converter](https://github.com/Taeyoung96/Yolo-to-COCO-format-converter/tree/master)。

格式轉換前建議先確認：

- 類別清單順序是否一致。
- 圖片尺寸是否正確。
- segmentation polygon 是否完整。
- train/valid/test 路徑是否符合工具預期。
- 轉換後用標註工具抽查幾張圖片。

Auto Labeling 的價值不是完全自動，而是讓人工審核站在更好的起點。

## 常見問題
### Auto Labeling 可以完全取代人工標記嗎？

不建議完全取代。Auto Labeling 適合產生初稿，正式訓練前仍應人工檢查漏標、誤標與邊界品質。

### SAM 和 YOLO Auto Labeling 差在哪？

SAM 擅長產生 segmentation masks，YOLO 擅長依既有類別做物件偵測或分割。若需要類別標籤，YOLO 預訓練模型通常更直接。

### YOLOv8 segmentation label 長什麼樣子？

YOLO segmentation label 通常是一行一個物件，包含 class id 與 normalized polygon 座標。上面的程式使用 \`r.masks.xyn\` 取得這些座標。

### Roboflow 在流程中扮演什麼角色？

Roboflow 可用來視覺化、檢查與修正模型產生的標註。模型先做初稿，Roboflow 協助人工管理資料集品質。

### 轉 COCO 格式前要檢查什麼？

要檢查類別順序、圖片尺寸、標註座標、資料夾路徑與轉換後 JSON。格式轉換成功不代表標註語意正確。

## 參考資料
- Meta AI，〈[Segment Anything](https://segment-anything.com/)〉。
- Ultralytics，〈[Results API reference](https://docs.ultralytics.com/reference/engine/results/#ultralytics.engine.results.Results.tojson)〉。
- GitHub，〈[Taeyoung96/Yolo-to-COCO-format-converter](https://github.com/Taeyoung96/Yolo-to-COCO-format-converter/tree/master)〉。
- Roboflow，〈[Roboflow](https://roboflow.com/)〉。

## 延伸閱讀

- [Segment Anything（SAM）論文筆記：提示式分割模型、SA-1B 資料集與 Zero-Shot 實驗](/post/segment-anything-notes)：同樣聚焦 Segment Anything，可接著比較不同情境的做法。
- [YOLOv8 使用範例：Roboflow 資料集訓練與 best.pt 即時偵測](/post/yolov8-usage-example)：同樣聚焦 YOLOv8，可接著比較不同情境的做法。
- [YOLOv8 物件偵測模型介紹：安裝、預測、訓練與輸出流程](/post/yolov8-object-detection-model)：同樣聚焦 YOLOv8，可接著比較不同情境的做法。

## 最後更新

2026-08-28

`;export{e as default};