var e=`---
title: YOLOv8 使用範例：Roboflow 資料集訓練與 best.pt 即時偵測
description: 整理 YOLOv8 使用範例，從 pip install ultralytics、Roboflow 下載 YOLOv8 資料集、設定 data.yaml 與 datasets_dir，到載入 best.pt 搭配 OpenCV 做即時物件偵測。
date: 2023-12-15
category: 機器學習
tags: [YOLOv8, Roboflow, 物件偵測, OpenCV, Python]
readingTime: 7 分鐘
image: /images/tech/hero_yolov8-usage-example.webp
imageAlt: YOLOv8 使用範例：Roboflow 資料集訓練與 best.pt 即時偵測封面圖
---


# YOLOv8 使用範例：Roboflow 資料集訓練與 best.pt 即時偵測

YOLOv8 使用範例可以拆成兩段：先用 Roboflow 匯出的 \`data.yaml\` 訓練模型，再用訓練完成的 \`best.pt\` 做圖片或攝影機畫面偵測。這篇保留 2023-12-15 的實作筆記，補上安裝、資料集位置、訓練程式、常見路徑錯誤，以及 OpenCV 即時偵測的拆解。

## YOLOv8 訓練前要先準備什麼？

YOLOv8 訓練前需要先安裝 \`ultralytics\`，再準備含有 \`data.yaml\` 的 YOLOv8 格式資料集。\`data.yaml\` 會告訴訓練流程圖片資料夾、驗證資料夾與類別名稱。

先用下面指令安裝好所需的套件：

\`\`\`bash
pip install ultralytics
\`\`\`

然後在 [Roboflow Universe](https://universe.roboflow.com/) 下載要訓練的素材集，格式選擇 YOLOv8。Roboflow 匯出的壓縮檔通常會包含 \`data.yaml\`、訓練圖片、驗證圖片與 label 檔案；Ultralytics 的訓練 API 會透過 \`data.yaml\` 找到資料集路徑與類別設定（Ultralytics，存取日期：2026-08-28）。

![Roboflow 匯出資料集時選擇 YOLOv8 格式](/images/articles/yolov8-usage-example-01.webp)

## Roboflow 下載後的資料夾應該怎麼放？

Roboflow 下載後的資料夾要和訓練程式放在容易引用的位置，並確認 \`data.yaml\` 路徑正確。最簡單的做法是把資料集解壓縮到專案同層，讓程式直接讀取 \`./data.yaml\`。

把裡面的資料（含 \`data.yaml\`）解壓縮在同層資料夾下，如圖：

![YOLOv8 資料集與 data.yaml 放在同層資料夾](/images/articles/yolov8-usage-example-02.webp)

這個結構的好處是訓練程式可以用 \`model.train(data='./data.yaml', epochs=300, imgsz=640)\` 直接讀取設定，不需要在程式裡拼很長的絕對路徑。若資料夾移動過，先打開 \`data.yaml\` 檢查 \`train\`、\`val\` 與 \`names\` 是否仍對應正確。

## YOLOv8 訓練程式怎麼寫？

YOLOv8 訓練程式可以用 \`YOLO('yolov8.yaml').load('yolov8n.pt')\` 建立模型並載入預訓練權重。接著呼叫 \`train()\` 指定 \`data.yaml\`、訓練週期與輸入影像尺寸，再用 \`val()\` 驗證模型。

接著直接執行下面的程式，YOLOv8 會自動下載所需要的 \`yolov8.yaml\` 及 \`yolov8n.pt\`：

\`\`\`python
import multiprocessing
import os

from ultralytics import YOLO

os.environ["CUDA_LAUNCH_BLOCKING"] = "1"


def my_function():
    model = YOLO("yolov8.yaml").load("yolov8n.pt")
    model.train(data="./data.yaml", epochs=300, imgsz=640)
    model.val(data="./data.yaml")


if __name__ == "__main__":
    multiprocessing.freeze_support()
    my_function()
\`\`\`

Ultralytics 官方 Python 文件也提供相同方向的流程：建立或載入 YOLO 模型、呼叫 \`train()\` 訓練、呼叫 \`val()\` 驗證，再用模型物件進行預測（Ultralytics，存取日期：2026-08-28）。這裡沿用當時筆記中的 \`yolov8.yaml\` 與 \`yolov8n.pt\`，不延伸到其他新版模型命名。

## datasets_dir 錯誤要怎麼處理？

YOLOv8 若找不到資料集，通常要檢查 Ultralytics 設定檔裡的 \`datasets_dir\`。資料集路徑不是訓練腳本猜出來的，\`data.yaml\` 和 Ultralytics 全域設定都可能影響實際讀取位置。

這時候可能會出現錯誤如下，因為資料集放在哪邊也是剛剛才自動下載或解壓縮好的，所以要打開設定檔案，設定資料集的正確位置 \`datasets_dir\`。

![YOLOv8 訓練時 datasets_dir 路徑錯誤訊息](/images/articles/yolov8-usage-example-03.webp)

我的排查順序通常是：

| 檢查項目 | 要確認的內容 |
|---|---|
| \`data.yaml\` 位置 | 程式中的 \`data='./data.yaml'\` 是否真的讀得到檔案 |
| \`train\` / \`val\` 路徑 | \`data.yaml\` 裡的相對路徑是否對到圖片資料夾 |
| \`datasets_dir\` | Ultralytics 設定檔是否指向資料集所在目錄 |
| 執行工作目錄 | 終端機目前目錄是否和程式預期一致 |

看到這些訊息就代表成功開始建模型了：

![YOLOv8 開始訓練模型的終端機輸出](/images/articles/yolov8-usage-example-04.webp)

## 訓練完成後如何載入 best.pt 做偵測？

YOLOv8 訓練完成後，推論重點是載入自己的 \`best.pt\`。\`best.pt\` 是訓練過程保留下來的模型權重，載入後就可以對圖片、影片或攝影機畫面呼叫模型進行預測。

重點是在這行：

\`\`\`python
model = YOLO("best.pt")
\`\`\`

這行在載入我們建好的模型：

\`\`\`python
results = model(image, show=False, verbose=False)
\`\`\`

\`model\` 這個預測方法有很多可控制的參數，例如要不要直接秀出圖片、要不要存圖片等等。Ultralytics 官方文件說明，預測結果會回傳 \`Results\` 物件；對物件偵測任務來說，常用欄位包含 \`result.boxes\`、\`result.boxes.xywh\`、\`result.boxes.cls\` 與 \`result.names\`（Ultralytics，存取日期：2026-08-28）。

![YOLOv8 model predict 可用參數與輸出範例](/images/articles/yolov8-usage-example-05.webp)

## YOLOv8 如何搭配 OpenCV 做即時攝影機偵測？

YOLOv8 搭配 OpenCV 做即時偵測時，流程是讀取攝影機畫面、縮放影像、呼叫模型預測、取出 bounding box，再用 OpenCV 畫框與標籤。\`result.boxes.xywh\` 可用來取得中心點、寬與高。

YOLOv8 很方便的一點是，吐出的物件如 \`result\`，只要 \`print\` 這個物件，就會有很詳細的結構和屬性意義教學，在開發上很省時間。

![YOLOv8 Results 物件列印後顯示偵測結構](/images/articles/yolov8-usage-example-06.webp)

下面是搭配 OpenCV 即時攝影機畫面做偵測的範例。這段程式保留當時的 \`VideoStream\` 使用方式；如果專案沒有這個自訂模組，需要改成自己的攝影機讀取類別或 OpenCV 的 \`cv2.VideoCapture()\`。

\`\`\`python
import VideoStream
import cv2
import numpy as np
from ultralytics import YOLO


videostream = VideoStream.VideoStream((1280, 720), 30, 0).start()
cam_quit = 0
model = YOLO("best.pt")


def detect(image):
    results = model(image, show=False, verbose=False)
    result = list(results)[0]

    for i in range(len(result.boxes)):
        r = result[i].boxes
        cls = int(r.cls[0].item())
        xywh = r.xywh[0].tolist()
        x_center, y_center, width, height = [int(x) for x in xywh[:4]]

        if width < 100 and height < 100:
            x1 = int(x_center - (width / 2))
            y1 = int(y_center - (height / 2))
            x2 = x1 + width
            y2 = y1 + height
            cv2.rectangle(image, (x1, y1), (x2, y2), (0, 0, 255), 3)
            cv2.putText(
                image,
                result.names[cls],
                (x1, y1),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.8,
                (0, 255, 255),
                1,
                cv2.LINE_AA,
            )


while cam_quit == 0:
    imageSource = videostream.read()
    imageSource = cv2.resize(imageSource, (960, 540))
    detect(imageSource)
    cv2.imshow("image", imageSource)
    key = cv2.waitKey(1) & 0xFF

    if key == ord("q"):
        cam_quit = 1

videostream.stop()
cv2.destroyAllWindows()
\`\`\`

這段範例有一個實務限制：只畫出寬高都小於 100 的偵測框。如果自己的任務不是小物件偵測，\`if width < 100 and height < 100:\` 這個條件要拿掉或改成符合應用場景的門檻。

## 常見問題

### YOLOv8 使用範例一定要先準備 Roboflow 資料集嗎？

YOLOv8 使用範例不一定要用 Roboflow，但訓練自己的物件偵測模型時，一定要有符合 YOLO 格式的圖片與標註。Roboflow 的好處是可以直接匯出 YOLOv8 格式，減少手動整理資料夾與 label 的時間。

### YOLOv8 的 \`data.yaml\` 是做什麼用的？

\`data.yaml\` 是 YOLOv8 訓練資料的入口設定檔。Ultralytics 會透過 \`data.yaml\` 找到訓練集、驗證集與類別名稱，所以路徑錯誤時模型通常不是壞掉，而是資料集位置沒有對齊。

### \`yolov8.yaml\`、\`yolov8n.pt\` 和 \`best.pt\` 差在哪？

\`yolov8.yaml\` 描述模型結構，\`yolov8n.pt\` 是預訓練權重，\`best.pt\` 是用自己的資料訓練後保留下來的最佳權重。訓練時可以從預訓練權重開始，推論時則載入自己的 \`best.pt\`。

### YOLOv8 找不到資料集時應該先改哪裡？

YOLOv8 找不到資料集時，先確認程式執行目錄與 \`data='./data.yaml'\` 是否一致，再檢查 \`data.yaml\` 裡的 \`train\` 和 \`val\` 路徑。若錯誤訊息指向 Ultralytics 設定檔，再調整 \`datasets_dir\`。

### YOLOv8 可以直接吃 OpenCV 的影像陣列嗎？

YOLOv8 可以直接對 OpenCV 讀到的影像陣列做預測。Ultralytics Python API 支援圖片路徑、影片、URL、PIL 影像與 NumPy 陣列等輸入型態，因此攝影機串流可以先由 OpenCV 讀取，再交給模型推論。

## 參考資料

- Roboflow Universe，〈[Roboflow Universe](https://universe.roboflow.com/)〉，存取日期：2026-08-28。
- Ultralytics，〈[YOLO Python Usage](https://docs.ultralytics.com/usage/python/)〉，存取日期：2026-08-28。
- Ultralytics，〈[Model Prediction with Ultralytics YOLO](https://docs.ultralytics.com/modes/predict/)〉，存取日期：2026-08-28。

## 延伸閱讀

- [OpenCV Template Matching 教學：在圖像中查找物件與縮放旋轉限制](/post/opencv-template-matching-object-detection)：同樣聚焦 OpenCV、物件偵測，可接著比較不同情境的做法。
- [YOLOv8 物件偵測模型介紹：安裝、預測、訓練與輸出流程](/post/yolov8-object-detection-model)：同樣聚焦 YOLOv8，可接著比較不同情境的做法。
- [YOLOv8 模型訓練指標解析：IoU、mAP、Precision、Recall 與優化策略](/post/yolov8-training-metrics-optimization)：同樣聚焦 YOLOv8，可接著比較不同情境的做法。

## 最後更新

2023-12-15（本文保留 2023-12-15 的實作筆記內容，並補上 GEO 結構、FAQ 與站內延伸閱讀。）
`;export{e as default};