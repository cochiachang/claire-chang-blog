var e=`---
title: PyAV 介紹：用 Python 操作 FFmpeg 的影音處理入門
description: 介紹 PyAV 是什麼、何時該用 PyAV 而不是 FFmpeg 指令，並保留 RTMP 拉流與 OpenCV 顯示範例。
date: 2023-10-06
category: 後端開發
tags: [PyAV, FFmpeg, Python, RTMP, OpenCV]
readingTime: 8 分鐘
image: /images/tech/hero_pyav-python-ffmpeg-introduction.webp
imageAlt: PyAV 範例程式以 OpenCV 視窗顯示 RTMP 串流影像
---


# PyAV 介紹：用 Python 操作 FFmpeg 的影音處理入門

PyAV 是 FFmpeg 的 Python 封裝，適合在 Python 程式裡直接讀寫影音容器、串流、封包、編解碼器與影格。我的判斷是：如果需求只是轉檔、剪裁、合併影片，直接用 \`ffmpeg\` 指令比較省事；如果需求是把每一幀交給 OpenCV、NumPy 或 AI 模型處理，PyAV 才會真正派上用場。

## PyAV 是什麼？

PyAV 是 FFmpeg libraries 的 Pythonic binding，讓 Python 程式能操作 media container、stream、packet、codec 和 frame。PyAV 也能把影格轉成 NumPy 或 Pillow 可處理的資料格式。

PyAV 官方文件把 PyAV 定位成「直接且精準存取媒體」的工具，而不是把影音處理複雜度完全藏起來的高階套件（PyAV Documentation，存取日期：2026-08-28）。這個定位很重要，因為影音任務常牽涉 container、codec、pixel format、PTS、time base 與播放器相容性。

我通常會把 PyAV 想成「Python 裡的 FFmpeg API」。PyAV 可以少掉 subprocess 呼叫與字串拼接，但開發者仍然要理解 FFmpeg 的基本概念。

## PyAV 和 FFmpeg 指令要怎麼選？

PyAV 適合程式內逐幀處理，FFmpeg 指令適合一次性或腳本化轉檔。選擇標準不是哪個工具比較強，而是哪個工具比較貼近工作流。

| 情境 | 建議工具 | 原因 |
|---|---|---|
| 轉檔、剪裁、合併影片 | FFmpeg 指令 | 指令短、可重複、部署簡單 |
| 批次處理大量檔案 | FFmpeg 指令或 Python + subprocess | 多數情境不需要碰到 frame 物件 |
| RTMP 拉流後交給 OpenCV | PyAV | 影格可直接轉成 NumPy array |
| 影像辨識、偵測、疊圖後再輸出 | PyAV | Python 程式可以控制每一幀 |
| 自訂封包、串流、編碼流程 | PyAV | 可接近 FFmpeg 的底層資料結構 |

如果 FFmpeg 一行指令已經能穩定完成需求，我不會為了「用 Python」硬換 PyAV。PyAV 的價值在需要條件判斷、迴圈、資料分析、AI 推論或服務整合時才明顯。

## PyAV 要怎麼安裝？

PyAV 可透過 \`pip install av\` 安裝；現代 Linux、macOS 與 Windows 多數情況可使用 PyPI 提供的 wheel。若環境需要自行連結 FFmpeg，安裝流程會變得比較挑版本。

最簡單的安裝方式是：

\`\`\`bash
pip install av
\`\`\`

如果安裝失敗，我會先回到 [PyAV installation 官方文件](https://pyav.org/docs/stable/overview/installation.html) 確認 Python 版本、作業系統 wheel、FFmpeg library 與 compiler 條件。PyAV 的安裝問題常不是 Python 程式碼錯，而是 FFmpeg 開發檔、編譯工具或環境變數沒有對上。

我當時在 Windows 環境有用過下面這組方式成功編譯，重點是把 \`--ffmpeg-dir\` 指到本機 FFmpeg 目錄：

\`\`\`bash
pip install av --no-binary av
git clone https://github.com/PyAV-Org/PyAV.git
cd PyAV-main
python setup.py build --ffmpeg-dir=C:\\ffmpeg
\`\`\`

這段指令適合排查或特殊環境，不是日常首選。日常開發先試 wheel，失敗後再進入編譯路線。

## 如何用 PyAV 拉取 RTMP 串流並交給 OpenCV 顯示？

PyAV 拉 RTMP 的核心流程是 \`av.open()\` 開啟輸入、\`demux()\` 取出封包、\`decode()\` 取得 frame，再把 video frame 轉成 OpenCV 使用的 BGR array。

下面的範例會拉取 \`rtmp://127.0.0.1/live/testStream\`，並用 OpenCV 視窗顯示畫面。這段程式保留了我測試 RTMP source 時最直接的寫法：

\`\`\`python
import av
import cv2
import numpy as np
import os
import signal

def exit(*args, **kwargs):
    os.kill(os.getpid(), 9)

signal.signal(signal.SIGINT, exit)

print("opening video...")
video = av.open("rtmp://127.0.0.1/live/testStream", "r")

print("start streaming")
try:
    for packet in video.demux():
        for frame in packet.decode():
            if packet.stream.type == "video":
                img = frame.to_ndarray(format="bgr24")
                cv2.imshow("Test", img)
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break
except KeyboardInterrupt:
    print(KeyboardInterrupt)
    pass

cv2.destroyAllWindows()
\`\`\`

![PyAV 拉取 RTMP source 後用 OpenCV 視窗顯示影像](/images/tech/pyav-rtmp-opencv-preview.webp)

正式專案我會再補三件事：第一，明確釋放 container 與視窗資源；第二，處理 RTMP 中斷重連；第三，把 \`packet.stream.type == "video"\` 的判斷移到更靠近 stream selection 的地方，避免音訊封包也進入不必要的 decode 流程。

## PyAV 開發時最容易踩到哪些問題？

PyAV 最容易踩到的不是 Python 語法，而是影音管線的狀態管理。container、codec、pixel format、時間戳與播放器支援度，只要一個環節不合，就可能出現黑畫面、卡住或不同步。

我會用下面這份檢查表排查：

| 檢查項目 | 我會確認什麼 |
|---|---|
| container 和 codec | 例如 RTMP 常見輸出是 FLV container 搭配 H.264 |
| pixel format | OpenCV 常用 BGR，編碼器常需要 YUV420P |
| PTS 與 time base | 影格播放速度是否正常，音畫是否同步 |
| encode flush | 最後幾幀是否有正確寫出 |
| 資源釋放 | container、camera、OpenCV window 是否關閉 |
| 斷線重連 | RTMP source 或 server 中斷後是否能恢復 |

PyAV 官方也提醒，媒體處理本身很複雜，PyAV 不會替開發者自動做出所有最佳決策（PyAV Documentation，存取日期：2026-08-28）。這句話我很認同：PyAV 給的是控制權，控制權換來的是更多需要自己負責的細節。

## 什麼情況我不建議用 PyAV？

單純轉檔、裁切、調整解析度、合併音軌或套 FFmpeg filter 時，我通常不建議先用 PyAV。FFmpeg 指令比較短，也比較容易交給 DevOps 或排程系統維護。

例如影片濾鏡合成、綠幕去背、低延遲推流這類任務，如果流程能用 \`ffmpeg -filter_complex\` 清楚描述，我會先用 FFmpeg 指令。等到需求變成「每一幀都要進 Python 做判斷」或「影格要送進 OpenCV / AI model」，PyAV 才是更好的抽象層。

這也是我整理這篇 PyAV 介紹時最想留下的取捨：PyAV 不是 FFmpeg 指令的替代品，而是讓 Python 可以進入 FFmpeg 管線的工具。

## 常見問題

### PyAV 是什麼？
PyAV 是 FFmpeg libraries 的 Python 封裝，讓 Python 程式可以操作容器、串流、封包、編解碼器與影格。PyAV 適合需要在程式內逐幀處理影音資料的任務。

### PyAV 和 FFmpeg 有什麼差別？
FFmpeg 通常指命令列工具，適合轉檔、裁切、合併與濾鏡處理。PyAV 是 Python 函式庫，適合把影音 frame 接到 OpenCV、NumPy、Pillow 或 AI 模型。

### PyAV 可以處理 RTMP 串流嗎？
PyAV 可以用 \`av.open()\` 讀取 RTMP source，也可以在合適的 container 與 codec 設定下輸出串流。正式服務需要另外處理斷線重連、時間戳、資源釋放與監控。

### PyAV 安裝失敗通常是哪裡出問題？
PyAV 安裝失敗常見原因是 Python 版本、作業系統 wheel、FFmpeg library 或編譯工具沒有對上。先試 \`pip install av\`，失敗後再依 PyAV installation 文件檢查本機 FFmpeg 與 compiler 環境。

### PyAV 可以和 OpenCV 一起用嗎？
PyAV 可以把 video frame 轉成 NumPy array，再交給 OpenCV 處理。OpenCV 常用 BGR 格式，所以範例使用 \`frame.to_ndarray(format="bgr24")\`。

### 什麼時候不該用 PyAV？
如果影音任務可以用一行 FFmpeg 指令穩定完成，通常不需要引入 PyAV。PyAV 比較適合需要 Python 程式邏輯介入影音管線的任務。

## 參考資料

- PyAV Documentation. "Overview." <https://pyav.org/docs/stable/>，存取日期：2026-08-28。
- PyAV Documentation. "Installation." <https://pyav.org/docs/stable/overview/installation.html>，存取日期：2026-08-28。
- PyAV GitHub Repository. <https://github.com/PyAV-Org/PyAV>，存取日期：2026-08-28。
- FFmpeg Documentation. <https://ffmpeg.org/documentation.html>，存取日期：2026-08-28。

## 延伸閱讀

- [PyAV 如何用 Python 處理 RTMP 串流與透明影片](/post/pyav-video-streaming-examples)：同樣聚焦 PyAV、FFmpeg，可接著比較不同情境的做法。
- [為 SRS6 編譯支援 HTTP-FLV 的 FFmpeg：H.265 over RTMP 推流實作](/post/srs6-ffmpeg-http-flv-compile)：同樣聚焦 FFmpeg、RTMP，可接著比較不同情境的做法。
- [Windows 編譯支援 HTTP-FLV 的 FFmpeg：OBS 虛擬鏡頭推流到 SRS](/post/compile-ffmpeg-http-flv-windows)：同樣聚焦 FFmpeg、RTMP，可接著比較不同情境的做法。

## 最後更新

2026-08-28
`;export{e as default};