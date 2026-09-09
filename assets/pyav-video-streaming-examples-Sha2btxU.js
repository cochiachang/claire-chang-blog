var e=`---
title: PyAV 如何用 Python 處理 RTMP 串流與透明影片
description: 說明 PyAV 適用情境、RTMP 推流、透明 WebM 輸出與串流 metadata 處理範例。
date: 2023-10-23
category: 後端開發
tags: [PyAV, FFmpeg, RTMP, Python]
readingTime: 8 分鐘
image: /images/tech/hero_pyav-video-streaming-examples.webp
imageAlt: 螢幕顯示影片時間軸與音訊軌，象徵 PyAV 處理 RTMP 串流、編碼與影格流程
---


# PyAV 如何用 Python 處理 RTMP 串流與透明影片

PyAV 適合用在單純 FFmpeg 指令難以完成的媒體處理，例如在推流前改寫影格、拉流後分析內容、或在 Python 程式內控制編碼流程。若只是轉檔、裁切或合併影片，直接使用 \`ffmpeg\` 指令通常更簡單。

## PyAV 適合什麼情境？

PyAV 是 FFmpeg 的 Pythonic binding，提供容器、串流、封包、編解碼器與影格層級的控制。PyAV 的價值在於讓 Python 程式直接介入媒體管線。

根據 PyAV 官方文件，PyAV 讓開發者精準存取 media container、stream、packet、codec 和 frame，也能和 NumPy、Pillow 等 Python 套件交換資料。這代表 PyAV 適合「需要在每一幀做事」的場景，而不是所有影音任務的預設選擇。

常見適用情境：

- 在 webcam 影格送出前疊加影像、偵測結果或濾鏡。
- 從 RTMP 串流解碼後，把影格交給 OpenCV 或 AI 模型。
- 自行控制編碼器、封包與輸出容器。
- 需要在 Python 服務內建立長時間運行的串流處理流程。

## 如何用 PyAV 將 webcam 推到 RTMP？

PyAV 推 RTMP 的基本流程是開啟輸出容器、建立 H.264 video stream、把 OpenCV 影格轉成 \`VideoFrame\`，再 encode 與 mux 到 FLV 容器。

原文範例以本機 RTMP endpoint 示範：

\`\`\`python
import av
import cv2
import threading
from av import VideoFrame

rtmp_url = "rtmp://127.0.0.1/live/test1"

def capture_and_push():
    cap = cv2.VideoCapture(0)
    output_container = av.open(rtmp_url, "w", format="flv")

    video_stream = output_container.add_stream("h264", rate=30)
    video_stream.width = 640
    video_stream.height = 480

    def encode_and_push_frames():
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            video_frame = VideoFrame.from_ndarray(frame, format="bgr24")
            packet = video_stream.encode(video_frame)
            output_container.mux(packet)

    encode_thread = threading.Thread(target=encode_and_push_frames)
    encode_thread.start()
    encode_thread.join()

    cap.release()
    output_container.close()

if __name__ == "__main__":
    capture_and_push()
\`\`\`

實務上還要補上錯誤處理、時間戳設定、編碼器 flush、RTMP 斷線重連與 thread 結束條件。原文範例適合理解管線，不建議直接當成 production streaming server。

## 如何用 PyAV 輸出透明背景影片？

透明影片需要容器與 codec 同時支援 alpha channel。PyAV 可以用 RGBA frame 產生素材，再輸出成支援透明度的 WebM VP9 或 ProRes 4444。

以下範例建立 5 秒、30 FPS 的透明 WebM，並在中央畫出半透明紅色圓形：

\`\`\`python
import av
import numpy as np

width, height = 640, 480
duration = 5
fps = 30
total_frames = duration * fps

container = av.open("output.webm", mode="w")
stream = container.add_stream("libvpx-vp9", rate=fps)
stream.width = width
stream.height = height
stream.pix_fmt = "yuv420p"

for frame_idx in range(total_frames):
    img = np.zeros((height, width, 4), dtype=np.uint8)
    center_x, center_y = width // 2, height // 2
    radius = min(width, height) // 4
    y, x = np.ogrid[-center_y:height-center_y, -center_x:width-center_x]
    mask = x * x + y * y <= radius * radius
    img[mask] = [255, 0, 0, 128]

    frame = av.VideoFrame.from_ndarray(img, format="rgba")
    for packet in stream.encode(frame):
        container.mux(packet)

for packet in stream.encode():
    container.mux(packet)

container.close()
\`\`\`

如果透明度沒有出現，優先檢查 pixel format、播放器支援度與瀏覽器 codec 支援。不同播放器對 WebM alpha 的支援狀況不完全相同。

## 如何在串流中處理額外資料？

PyAV 的 \`frame.side_data\` 可讀取影格附加資訊，例如 HDR metadata、motion vector 或 codec 定義的 side data。若要寫入自訂 SEI，需要確認 codec 與封包流程是否支援。

原文想做的事情是從 RTMP source 讀取 video frame，加入 SEI 類資訊，再輸出到另一個 RTMP endpoint。這類流程比一般轉推更容易踩到封包與重編碼問題：解碼後若要修改 frame，通常就需要重新 encode；若只是複製 packet，則不能期待 frame 層級變更自動生效。

實作時建議先拆成三個驗證點：

1. 能否穩定 demux 與 decode source RTMP。
2. 能否把處理後 frame 正確 encode 成目標 codec。
3. 目標播放器或下游服務是否真的讀得到 side data 或 SEI。

## PyAV 開發時要注意哪些風險？

PyAV 最大風險是媒體管線狀態很多，錯誤不一定在 Python 層立刻顯示。時間戳、codec option、容器格式與播放器支援度都可能影響結果。

建議用下面的檢查表降低排錯成本：

| 檢查項目 | 目的 |
|---|---|
| codec 與 container 是否匹配 | 避免 H.264、VP9、FLV、WebM 組合不支援 |
| frame format 是否正確 | 避免 BGR、RGB、RGBA、YUV 轉換錯誤 |
| PTS 與 time_base 是否合理 | 避免畫面卡住、倍速或音畫不同步 |
| encode 是否 flush | 避免最後幾幀沒有寫入 |
| 是否需要重連 | 避免 RTMP server 中斷後 thread 卡死 |

## 常見問題

### PyAV 和 FFmpeg 指令要選哪一個？

固定轉檔、裁切、合併影片時，FFmpeg 指令通常比較簡單。需要在 Python 內逐幀處理、串接 OpenCV 或 AI 模型時，PyAV 比較適合。

### PyAV 可以直接推 RTMP 嗎？

PyAV 可以透過 FLV container 和 H.264 stream 推到 RTMP endpoint。正式服務還需要處理編碼器設定、斷線重連與資源釋放。

### PyAV 可以輸出透明影片嗎？

PyAV 可以輸出透明影片，但 codec、container、pixel format 和播放器都必須支援 alpha channel。WebM VP9 與 ProRes 4444 是常見選項。

### \`frame.side_data\` 可以放任何自訂資料嗎？

\`frame.side_data\` 主要對應 FFmpeg 與 codec 支援的影格附加資訊。若要讓下游讀到自訂資料，必須確認使用的 codec、封包格式與播放器都支援該資料型態。

### PyAV 適合做長時間直播服務嗎？

PyAV 可以做長時間串流處理，但必須自行處理 thread、記憶體、重連與監控。若需求只是穩定轉推，專用 streaming server 或 FFmpeg process 可能更穩。

## 參考資料

- PyAV Documentation, Overview: <https://pyav.org/docs/stable/>
- FFmpeg Documentation: <https://ffmpeg.org/documentation.html>

## 延伸閱讀

- [PyAV 介紹：用 Python 操作 FFmpeg 的影音處理入門](/post/pyav-python-ffmpeg-introduction)：同樣聚焦 PyAV、FFmpeg，可接著比較不同情境的做法。
- [為 SRS6 編譯支援 HTTP-FLV 的 FFmpeg：H.265 over RTMP 推流實作](/post/srs6-ffmpeg-http-flv-compile)：同樣聚焦 FFmpeg、RTMP，可接著比較不同情境的做法。
- [使用 FFmpeg 濾鏡功能做影片合成](/post/ffmpeg-video-filter-compositing)：同樣聚焦 FFmpeg、RTMP，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2026-08-28，依原始 PyAV 範例整理為可發布的 GEO 技術文章。

`;export{e as default};