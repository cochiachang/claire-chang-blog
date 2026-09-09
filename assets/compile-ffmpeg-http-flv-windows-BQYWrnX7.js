var e=`---
title: Windows 編譯支援 HTTP-FLV 的 FFmpeg：OBS 虛擬鏡頭推流到 SRS
description: 整理 Windows 編譯 FFmpeg、確認 HTTP-FLV/RTMP 支援，以及用 OBS 虛擬鏡頭推流到 SRS 的流程。
date: 2023-04-18
category: 後端開發
tags: [FFmpeg, HTTP-FLV, RTMP, OBS, SRS, Windows]
readingTime: 9 分鐘
image: /images/tech/hero_ffmpeg-video-filter-compositing.webp
imageAlt: 影片剪輯軟體的時間軸畫面，象徵 FFmpeg 在 Windows 上處理影音串流與合成流程
---


# Windows 編譯支援 HTTP-FLV 的 FFmpeg：OBS 虛擬鏡頭推流到 SRS

在 Windows 編譯支援 HTTP-FLV 的 FFmpeg，重點不是只打開一個 \`http-flv\` 開關，而是同時確認 FFmpeg 具備 \`http\`、\`https\`、\`tcp\`、\`rtmp\` protocol、\`flv\` muxer/demuxer，以及 Windows 端擷取 OBS Virtual Camera 會用到的 DirectShow input。我的做法是先讓 OBS Studio 輸出成虛擬鏡頭，再用 FFmpeg 從 DirectShow 抓畫面、編碼、封裝成 FLV，最後推到 SRS，由 SRS 提供 HTTP-FLV 播放端。

## 為什麼 Windows 推 HEVC 到 SRS 會需要這條繞路？

Windows 推 HEVC 到 SRS 時，真正卡住的是 RTMP 舊協定、OBS 輸出能力與瀏覽器播放端支援度的交界。FFmpeg 加 OBS Virtual Camera 可以把畫面擷取、編碼與推流控制權拿回來。

我當時的需求是：在 Windows 上把 OBS Studio 裡的視訊源、素材與畫面合成後，推送到 SRS，再讓網頁端用 HTTP-FLV 播放。OBS Studio 可以做場景合成，但早期 OBS 直接推 HEVC over RTMP 到 SRS 時，RTMP codec id 與播放器相容性會卡住；SRS 維護者也曾提醒，SRT 更適合傳 HEVC，RTMP 則要注意舊協定限制。

SRS 文件對 HTTP-FLV 的定位也很接近這個情境：RTMP 常用在直播製作端推流，HTTP-FLV 或 HLS 常用在播放端分發，因為播放設備對 HTTP 類傳輸的支援比較普遍（SRS，HTTP-FLV 文件，存取日期：2026-08-28）。所以這條路線拆成兩段：Windows/FFmpeg 負責輸入與推流，SRS 負責把直播流分發給瀏覽器。

## Windows 編譯 FFmpeg 前要準備哪些工具？

Windows 原生編譯 FFmpeg 建議使用 MSYS2 的 MinGW-w64 環境。FFmpeg 官方文件也提醒，應使用 \`mingw64_shell.bat\` 或 \`mingw32_shell.bat\`，不要用一般 MSYS shell 直接編 Windows native binary。

我會先安裝 MSYS2，開啟 **MinGW-w64 Win64 Shell**，再安裝基本編譯工具與常用影音套件：

\`\`\`bash
pacman -Syu
pacman -S --needed git make pkgconf diffutils nasm yasm \\
  mingw-w64-x86_64-gcc \\
  mingw-w64-x86_64-SDL2 \\
  mingw-w64-x86_64-x264 \\
  mingw-w64-x86_64-x265
\`\`\`

FFmpeg 官方 Windows 平台文件列出的 MSYS2 基本套件包含 \`make\`、\`pkgconf\`、\`diffutils\`、\`nasm\`、\`gcc\` 與 SDL2；若要編進 \`libx264\` 或 \`libx265\`，還要確保對應的 MinGW-w64 套件在同一個 shell 環境裡可被 \`pkg-config\` 找到（FFmpeg，Platform Specific Information，存取日期：2026-08-28）。

這裡最容易踩的坑是 shell 開錯。用 \`msys2_shell.bat\` 進去時，路徑和 toolchain 看起來也能動，但最後產出的 binary、library 搜尋路徑或套件偵測結果可能不是我要的 Windows native MinGW build。

## FFmpeg 要怎麼設定 HTTP-FLV、RTMP 和 DirectShow 支援？

FFmpeg 的 protocol 預設通常全部啟用；只有在使用 \`--disable-protocols\` 或 \`--disable-everything\` 做精簡編譯時，才需要逐一打開 \`http\`、\`https\`、\`tcp\`、\`rtmp\`、\`flv\` 與 \`dshow\` 相關能力。

以下是我會保留的編譯方向，適合 Windows 上用 DirectShow 抓 OBS Virtual Camera，並把輸出推到 RTMP/SRS：

\`\`\`bash
git clone https://git.ffmpeg.org/ffmpeg.git ffmpeg
cd ffmpeg

./configure \\
  --prefix=/c/apps/ffmpeg-http-flv \\
  --enable-gpl \\
  --enable-version3 \\
  --enable-libx264 \\
  --enable-libx265 \\
  --enable-ffplay \\
  --enable-indev=dshow \\
  --enable-protocol=http \\
  --enable-protocol=https \\
  --enable-protocol=tcp \\
  --enable-protocol=rtmp \\
  --enable-muxer=flv \\
  --enable-demuxer=flv

make -j$(nproc)
make install
\`\`\`

如果沒有先關掉 FFmpeg 的預設元件，\`--enable-protocol=*\` 和 \`--enable-muxer=flv\` 多半不是必要選項；我仍會把它們寫進編譯紀錄，是因為日後查問題時可以一眼看出這個 build 的目的。FFmpeg protocol 文件也說明，configure 階段可用 \`--list-protocols\` 查看可用 protocol，工具執行時則可用 \`ffmpeg -protocols\` 列出目前 binary 支援的 protocol（FFmpeg，Protocols Documentation，存取日期：2026-08-28）。

## 編譯完要怎麼確認 FFmpeg 真的支援 HTTP-FLV？

確認 FFmpeg 支援 HTTP-FLV，要分開檢查 protocol、format、device 與 encoder。只看到 \`ffmpeg.exe\` 可以執行還不夠，推流前一定要確認 \`http\`、\`rtmp\`、\`flv\`、\`dshow\` 和編碼器都有出現。

我會在新的命令提示字元或 PowerShell 裡先把編譯輸出加入 \`Path\`：

\`\`\`bat
set ffmpegBin=C:\\apps\\ffmpeg-http-flv\\bin
set PATH=%PATH%;%ffmpegBin%
\`\`\`

接著逐項確認：

\`\`\`bash
ffmpeg -version
ffmpeg -protocols
ffmpeg -formats
ffmpeg -devices
ffmpeg -encoders
\`\`\`

檢查重點如下：

| 檢查項目 | 需要看到什麼 | 用途 |
|---|---|---|
| \`ffmpeg -protocols\` | \`http\`、\`https\`、\`tcp\`、\`rtmp\` | 讀取 HTTP-FLV 或推 RTMP |
| \`ffmpeg -formats\` | \`flv\` | 讀寫 FLV container |
| \`ffmpeg -devices\` | \`dshow\` | Windows 擷取 OBS Virtual Camera |
| \`ffmpeg -encoders\` | \`libx264\`、\`libx265\` 或硬體 encoder | 直播推流編碼 |

如果要確認 Windows 上的攝影機名稱，可以列出 DirectShow 裝置：

\`\`\`bash
ffmpeg -list_devices true -f dshow -i dummy
\`\`\`

OBS Virtual Camera 的名稱可能是 \`OBS Virtual Camera\`，也可能因版本或外掛顯示成 \`OBS-Camera\`。FFmpeg 指令裡的 \`video="..."\` 必須和 DirectShow 列出的名稱一致，不然會出現找不到裝置的錯誤。

## 如何把 OBS 輸出掛成虛擬鏡頭？

OBS Virtual Camera 會把 OBS Studio 的場景輸出成系統攝影機來源。FFmpeg 可以透過 Windows DirectShow 讀取這個來源，再接續做編碼、濾鏡或推流。

在 OBS Studio 裡，我會先把輸出影片格式、解析度和幀率設定好。如果目標是測 HEVC，可以先把 OBS 內部素材或錄影輸出設定成 H.265；如果目標是穩定推 RTMP 給瀏覽器播放，實務上仍常回到 H.264 + FLV container。

接著在 OBS Studio 右下角按 **Start Virtual Camera**：

![OBS Studio 控制區中按下 Start Virtual Camera](/images/tech/obs-virtual-camera-start.webp)

OBS 官方 Virtual Camera Guide 說明，按下 Controls dock 裡的 Start Virtual Camera 後，OBS Studio 的輸出就可以被 Zoom、Discord、Skype 或其他可讀攝影機的程式使用；設定齒輪可以調整輸出來源（OBS Project，2022-08-31）。

虛擬相機設定裡常見的輸出選項如下：

| OBS Virtual Camera 輸出 | 適合情境 |
|---|---|
| Program Output | 讓 FFmpeg 讀到 OBS 正在正式輸出的畫面 |
| Preview Output | Studio Mode 下讀預覽畫面，調場景時也會被看到 |
| Scene | 固定輸出某一個 Scene，不跟目前 Program 切換 |
| Source | 固定輸出某一個 Source |

![OBS Virtual Camera 設定視窗](/images/tech/obs-virtual-camera-settings.webp)

我通常選 Program Output，因為推流端要看的就是觀眾實際會看到的畫面。如果只是測某個場景或來源，才會改成 Scene 或 Source。

## 如何用 FFmpeg 抓 OBS Virtual Camera 並推到 SRS？

FFmpeg 抓 OBS Virtual Camera 推到 SRS 的核心指令是 \`-f dshow -i video="OBS Virtual Camera"\` 加上 \`-f flv rtmp://...\`。SRS 收到 RTMP 後，再提供 HTTP-FLV 播放 URL。

最小可用版本可以先這樣測：

\`\`\`bash
ffmpeg -f dshow -rtbufsize 200M -i video="OBS Virtual Camera" \\
  -pix_fmt yuv420p \\
  -c:v libx264 -profile:v baseline -level:v 3.1 -preset ultrafast \\
  -r 24 -s 800x450 -g 120 \\
  -an \\
  -f flv rtmp://127.0.0.1/live/livestream
\`\`\`

若使用 NVIDIA GPU，也可以把 encoder 換成 \`h264_nvenc\`：

\`\`\`bash
ffmpeg -f dshow -rtbufsize 200M -i video="OBS Virtual Camera" \\
  -pix_fmt yuv420p \\
  -c:v h264_nvenc -preset p1 -tune ll \\
  -r 24 -s 800x450 -g 120 \\
  -an \\
  -f flv rtmp://127.0.0.1/live/livestream
\`\`\`

SRS HTTP-FLV 文件提供的典型推流測試是把 FLV source 推到 \`rtmp://localhost/live/livestream\`，再用 \`http://localhost:8080/live/livestream.flv\` 播放（SRS，HTTP-FLV 文件，存取日期：2026-08-28）。正式環境把 \`127.0.0.1\` 換成 SRS server IP 或網域即可。

參數拆解如下：

| 參數 | 說明 |
|---|---|
| \`-f dshow\` | Windows DirectShow input |
| \`-rtbufsize 200M\` | 增加擷取緩衝，降低畫面卡住或掉幀機率 |
| \`-i video="OBS Virtual Camera"\` | 讀取 OBS 虛擬鏡頭 |
| \`-pix_fmt yuv420p\` | 使用播放器相容性較高的像素格式 |
| \`-profile:v baseline -level:v 3.1\` | 較保守的 H.264 串流相容設定 |
| \`-preset ultrafast\` | 編碼速度優先，適合低延遲測試 |
| \`-g 120\` | 24fps 時約每 5 秒一個關鍵幀 |
| \`-an\` | 不帶音訊；需要聲音時要另外指定 audio device |
| \`-f flv\` | 以 FLV container 輸出到 RTMP endpoint |

## 這條流程最容易踩到哪些坑？

Windows 編譯與推流最常出問題的地方，是把 protocol、container、codec、device 名稱和播放端支援混成同一件事。排查時逐層確認，比反覆改同一條 FFmpeg 指令更快。

我會照這份清單排查：

| 問題 | 我會先檢查什麼 |
|---|---|
| FFmpeg 找不到 OBS Virtual Camera | 用 \`ffmpeg -list_devices true -f dshow -i dummy\` 確認裝置名稱 |
| 推流成功但瀏覽器黑畫面 | 確認輸出是否為 H.264 + FLV，以及播放端是否支援該 codec |
| \`rtmp\` 或 \`http\` 不在 protocol 清單 | 回到 configure 選項，確認沒有 \`--disable-protocols\` 或精簡掉 protocol |
| \`flv\` 不在 format 清單 | 確認 \`flv\` muxer/demuxer 沒被移除 |
| 延遲越播越高 | 檢查 GOP、encoder preset、播放器 buffer、SRS 分發設定 |
| CPU 滿載 | 改用硬體 encoder，或降低解析度、fps、bitrate |
| HEVC 推流後不能播 | 分清楚 SRT、Enhanced RTMP、HTTP-FLV 與瀏覽器 codec 支援，不要只看 server 是否收得到流 |

我的經驗是，HTTP-FLV 播放端若要給一般瀏覽器使用，H.264 仍然是最省心的 baseline。HEVC 可以省頻寬，也適合 SRT 或支援 Enhanced RTMP 的新流程，但播放器、瀏覽器與中間服務每一段都要確認；只要其中一段不支援，最後看到的就是黑畫面或無法解碼。

## 常見問題

### Windows 編譯 FFmpeg 支援 HTTP-FLV 需要開哪個選項？
Windows 編譯 FFmpeg 支援 HTTP-FLV 時，要確認 \`http\`、\`https\`、\`tcp\` protocol 和 \`flv\` muxer/demuxer 存在。如果要推到 RTMP/SRS，還要確認 \`rtmp\` protocol；如果要抓 OBS Virtual Camera，還要確認 \`dshow\` input device。

### HTTP-FLV 和 RTMP 有什麼差別？
RTMP 常用在直播製作端推流，HTTP-FLV 常用在播放端透過 HTTP 分發 FLV 串流。這篇流程是用 FFmpeg 推 RTMP 到 SRS，再由 SRS 提供 HTTP-FLV URL 給播放器。

### OBS Virtual Camera 在 FFmpeg 裡找不到怎麼辦？
先執行 \`ffmpeg -list_devices true -f dshow -i dummy\` 看 DirectShow 裝置名稱。OBS Virtual Camera 的實際名稱必須完整放進 \`video="..."\`，名稱不一致時 FFmpeg 會直接回報找不到裝置。

### 為什麼不用 OBS 直接推 HEVC over RTMP？
早期 OBS Studio 推 HEVC over RTMP 到 SRS 時，會遇到 RTMP codec id 與舊協定支援問題。現在 Enhanced RTMP 已改善 HEVC/AV1 over RTMP 的路線，但舊環境或瀏覽器 HTTP-FLV 播放端仍要逐段確認支援度。

### SRT 比 RTMP 更適合 HEVC 嗎？
SRT 天然比較適合新 codec 與弱網路低延遲傳輸，SRS 文件也把 SRT 定位為取代 RTMP 的廣播協定之一。不過如果使用者端播放器習慣 HTTP-FLV，仍可能需要保留 RTMP ingest 與 HTTP-FLV distribution。

### FFmpeg 推流到 SRS 後要怎麼播放 HTTP-FLV？
SRS 預設 HTTP 服務常用 \`8080\` port。推流到 \`rtmp://127.0.0.1/live/livestream\` 後，可以用 \`http://127.0.0.1:8080/live/livestream.flv\` 測試 HTTP-FLV 播放；正式環境要把 host 換成 SRS server 位址。

### HTTP-FLV 可以承載 HEVC 嗎？
FLV/RTMP 傳 HEVC 涉及 Enhanced RTMP、server 實作與播放器支援，不能只看副檔名或 container。若目標是一般瀏覽器穩定播放，H.264 + FLV 仍是比較保守的選擇。

## 參考資料

- FFmpeg Project, [Platform Specific Information: Windows](https://www.ffmpeg.org/platform.html)（存取日期：2026-08-28）
- FFmpeg Project, [Protocols Documentation](https://ffmpeg.org/ffmpeg-protocols.html)（存取日期：2026-08-28）
- FFmpeg Project, [FFmpeg Documentation](https://ffmpeg.org/ffmpeg.html)（存取日期：2026-08-28）
- OBS Project, [Virtual Camera Guide](https://obsproject.com/kb/virtual-camera-guide)（發布日期：2022-08-31，存取日期：2026-08-28）
- SRS, [HTTP-FLV](https://ossrs.io/lts/en-us/docs/v6/doc/flv)（存取日期：2026-08-28）
- SRS, [SRT](https://www.ossrs.io/lts/en-us/docs/v8/doc/srt)（存取日期：2026-08-28）
- Reddit, [Secure Reliable Transport (SRT) Player](https://www.reddit.com/r/VIDEOENGINEERING/comments/giabu7/secure_reliable_transport_srt_player/)（存取日期：2026-08-28）

## 延伸閱讀

- [為 SRS6 編譯支援 HTTP-FLV 的 FFmpeg：H.265 over RTMP 推流實作](/post/srs6-ffmpeg-http-flv-compile)：同樣聚焦 SRS、FFmpeg，可接著比較不同情境的做法。
- [OBS 推送 HEVC 直播串流到 SRS：Enhanced RTMP 設定教學](/post/obs-hevc-rtmp-srs-streaming)：同樣聚焦 OBS、RTMP，可接著比較不同情境的做法。
- [使用 OBS 推流 H.265：v29 後的 HEVC over RTMP 設定筆記](/post/obs-rtmp-h265-streaming)：同樣聚焦 OBS、RTMP，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2026-08-28。這次整理保留 Windows 編譯 FFmpeg、OBS Virtual Camera、SRS、HTTP-FLV/RTMP 推流脈絡，補上 GEO Answer Blocks、FAQ、參考資料與 OBS、PyAV、WebM、AV1、FFmpeg 站內延伸閱讀。
`;export{e as default};