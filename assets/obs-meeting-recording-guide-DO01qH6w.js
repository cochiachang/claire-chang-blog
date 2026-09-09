var e=`---
title: OBS 會議錄影教學：視窗擷取、聲音設定與 FFmpeg 剪輯流程
description: 用 OBS 錄線上會議時，建議用視窗擷取鎖定會議程式，再用 FFmpeg 做剪裁、合併與浮水印。
date: 2023-05-31
category: 後端開發
tags: [OBS, 會議錄影, FFmpeg, 影音處理, 視窗擷取]
readingTime: 8 分鐘
image: /images/tech/hero_obs-meeting-recording-guide.webp
imageAlt: OBS Studio 視窗擷取設定畫面中選擇 Google Meet 會議視窗
---


# OBS 會議錄影教學：視窗擷取、聲音設定與 FFmpeg 剪輯流程

用 OBS Studio 錄線上會議時，我會優先選「視窗擷取」而不是整個螢幕錄影。OBS Studio 可以把特定應用程式視窗加入場景，會議進行中即使我切去回訊息、查資料或開其他分頁，錄影畫面仍只保留指定的 Google Meet、Zoom 或 Teams 視窗；錄完之後，再用 FFmpeg 做基本剪裁、刪除片段、合併與浮水印處理。

## OBS 會議錄影適合用哪一種擷取方式？

OBS 會議錄影建議先用 Window Capture 或 macOS Screen Capture 鎖定會議視窗。只錄指定視窗可以降低誤錄桌面通知、私訊與其他工作畫面的風險。

OBS Studio 的核心概念是 Scenes 與 Sources：Scene 是畫面配置，Source 是視窗、螢幕、攝影機、圖片或音訊等素材。OBS 官方 Sources Guide 說明，Window Capture 可擷取單一視窗，Display Capture 則會擷取整個顯示器；macOS 13 之後建議使用 macOS Screen Capture 來源來擷取螢幕、視窗或應用程式（OBS Project，2022-01）。

我的會議錄影流程通常是：

1. 開啟 OBS Studio。
2. 在 Sources 區塊按 \`+\`。
3. Windows 或 Linux 選 **Window Capture**；macOS 13 以上選 **macOS Screen Capture**。
4. 從視窗清單選 Google Meet、Zoom、Microsoft Teams 或其他會議程式。
5. 確認 OBS 預覽畫面只出現會議視窗。

![OBS Studio 新增視窗擷取來源](/images/tech/obs-meeting-recording-source-window.webp)

下圖是只選 Google Chrome 內的 Google Meet 視窗。這樣我在電腦上回 Line、切到其他 Chrome 視窗或處理別的工作，都不會被錄進會議影片。

![OBS Studio 視窗擷取只鎖定 Google Meet 會議視窗](/images/tech/obs-meeting-recording-chrome-window.webp)

## OBS 錄會議前要怎麼確認聲音？

OBS 會議錄影一定要先看 Audio Mixer 音量條是否有動。Windows 可以用桌面音訊或應用程式音訊擷取，macOS 則要依系統版本選 macOS Audio Capture 或額外音訊路由工具。

OBS 官方 Quick Start Guide 建議，在正式錄影前先錄幾分鐘測試影片，確認 Settings → Output、桌面音訊與麥克風都符合需求（OBS Project，Quick Start Guide）。這個步驟很樸素，但會救很多會議錄完才發現沒聲音的慘劇。

Windows 10 2004 以上與 Windows 11 可使用 OBS 的 Application Audio Capture；OBS Studio 30.1 之後，也可以在 Window Capture 或 Game Capture source 裡勾選 Capture Audio，將指定應用程式的聲音一起納入（OBS Project，2023-07）。

macOS 的狀況要分版本看：

| 環境 | 建議做法 |
|---|---|
| macOS 13 以上、OBS Studio 30 以上 | 使用 macOS Audio Capture Source，可錄全部桌面音訊或指定應用程式音訊 |
| macOS 13 以上、OBS Studio 28/29 | 使用 macOS Screen Capture Source，並可切到 Application Capture 或 Window Capture |
| 較舊 macOS | 使用 VB-CABLE、Loopback、Sound Siphon 等音訊路由工具 |

如果會議內容很重要，我會在正式開始前做兩件事：先讓會議視窗播放一段聲音，看 OBS Audio Mixer 有沒有反應；再按開始錄製 10 到 20 秒，停止後打開影片檢查畫面與聲音。這一步比事後補救便宜太多。

## OBS 如何開始與結束會議錄影？

OBS 會議錄影設定完成後，按右下角 Start Recording 開始錄製，會議結束後按 Stop Recording。錄好的檔案通常會依錄影時間命名，存到設定中的錄影輸出資料夾。

OBS 官方 Quick Start Guide 把 Start Recording 放在 Controls Dock 裡，並提醒使用者先測試設定再正式錄影（OBS Project，Quick Start Guide）。我自己的習慣是錄影前先確認三個地方：預覽畫面是否只剩會議視窗、Audio Mixer 是否有聲音、硬碟空間是否足夠。

![OBS Studio 控制列中的開始錄製按鈕](/images/tech/obs-meeting-recording-start-button.webp)

錄影輸出位置可以在 **Settings → Output → Recording** 調整。若只是會議存檔，建議先用 OBS 預設或穩定的本機資料夾，不要直接錄到雲端同步資料夾；長時間會議邊錄邊同步，偶爾會讓 I/O 變得不穩。

## FFmpeg 要怎麼安裝到 Windows？

Windows 上使用 FFmpeg 時，可以從 FFmpeg 官方下載頁連到 Windows builds，再把 \`ffmpeg.exe\` 所在資料夾加入 Path。安裝後在命令提示字元輸入 \`ffmpeg\`，能看到版本資訊就代表路徑設定成功。

FFmpeg 是跨平台影音處理工具，能讀取、解碼、編碼、轉檔、封裝、剪輯與串流多種媒體格式（FFmpeg Project，Documentation）。Windows 使用者可以從 FFmpeg 官方下載頁找到第三方 build 來源；Gyan.dev 提供 Windows 64-bit build，頁面也列出 package manager 安裝方式，例如 Chocolatey、Scoop 與 winget（Gyan Doshi，2026-08）。

基本步驟：

1. 到 [FFmpeg 官方下載頁](https://ffmpeg.org/download.html) 選 Windows build。
2. 下載 Gyan.dev 的 release full 或 release essentials build。
3. 解壓縮後找到 \`bin\` 資料夾，裡面會有 \`ffmpeg.exe\`。
4. 將 \`bin\` 路徑加入 Windows 環境變數 \`Path\`，或把 \`ffmpeg.exe\` 放到系統可找到的位置。
5. 開啟新的命令提示字元，輸入 \`ffmpeg\` 驗證。

![Windows 命令提示字元成功執行 ffmpeg](/images/tech/obs-meeting-recording-ffmpeg-command.webp)

## FFmpeg 如何剪裁會議錄影片段？

FFmpeg 剪裁會議影片最常用 \`-ss\` 指定開始時間、\`-to\` 指定結束時間。若只做無重編碼剪裁，可搭配 \`-c:v copy -c:a copy\`，速度快但切點會受關鍵幀影響。

以下指令會把 \`input.mp4\` 從 00:12 剪到 00:15:30，輸出為 \`output.mp4\`：

\`\`\`bash
ffmpeg -i input.mp4 -ss 00:12 -to 00:15:30 -c:v copy -c:a copy output.mp4
\`\`\`

參數意思如下：

| 參數 | 說明 |
|---|---|
| \`-i input.mp4\` | 指定輸入影片 |
| \`-ss 00:12\` | 從第 12 秒開始 |
| \`-to 00:15:30\` | 到 15 分 30 秒結束 |
| \`-c:v copy\` | 影片串流直接複製，不重新編碼 |
| \`-c:a copy\` | 音訊串流直接複製，不重新編碼 |

\`copy\` 模式很適合快速切掉會議前等待、會議後閒聊。若需要精準到每一幀，就要改成重新編碼，時間會比較久。

## FFmpeg 如何刪除會議中間一段內容？

FFmpeg 刪除中間片段可以用 \`trim\` 切出保留區間，再用 \`concat\` 接回一支影片。這種做法會重新編碼，適合刪掉等待時間、錯誤分享畫面或不該公開的會議片段。

以下範例會保留 0 到 4 秒，以及 8 秒之後的影片，中間 4 到 8 秒會被移除：

\`\`\`bash
ffmpeg -i input.mp4 -filter_complex "[0:v]trim=0:4,setpts=PTS-STARTPTS[v1]; [0:v]trim=8,setpts=PTS-STARTPTS[v2]; [v1][v2]concat=n=2:v=1:a=0" -c:v libx264 -preset veryfast -crf 18 output.mp4
\`\`\`

這個範例只處理影像，沒有處理音訊。如果會議錄影需要保留聲音，要另外對 audio stream 做 \`atrim\`，再和 video 一起 \`concat\`。FFmpeg 官方文件中，\`filter_complex\` 用來建立多輸入、多輸出的濾鏡圖，並可透過標籤把濾鏡輸出交給後續處理或 \`-map\` 指定輸出（FFmpeg Project，Documentation）。

## FFmpeg 如何合併多個會議影片檔案？

FFmpeg 合併多段會議影片時，可以先建立一份清單檔，再用 concat demuxer 合併。若每段影片的編碼、解析度、fps 與音訊格式一致，\`-c copy\` 可以很快完成。

先建立 \`input.txt\`：

\`\`\`text
file 'video1.mp4'
file 'video2.mp4'
file 'video3.mp4'
\`\`\`

再執行合併：

\`\`\`bash
ffmpeg -f concat -safe 0 -i input.txt -c copy output.mp4
\`\`\`

這個做法適合會議分段錄影、錄到一半暫停後再接著錄，或把前後場次合成一個檔案。若每段影片參數不同，合併前最好先轉成一致格式，避免播放時出現音畫不同步或播放器無法解析。

## FFmpeg 如何幫會議錄影加上浮水印？

FFmpeg 加浮水印可以用 \`overlay\` 濾鏡，把圖片疊到影片指定位置。常見情境是把公司 logo、課程名稱或「內部資料」字樣放在右下角。

以下指令會把 \`watermark.png\` 放在影片右下角，並距離邊緣 10 像素：

\`\`\`bash
ffmpeg -i input.mp4 -i watermark.png -filter_complex "overlay=W-w-10:H-h-10" -c:a copy output.mp4
\`\`\`

\`overlay=W-w-10:H-h-10\` 的意思是：用主影片寬高 \`W\`、\`H\` 減去浮水印圖片寬高 \`w\`、\`h\`，再往內縮 10 像素。FFmpeg 官方文件也用 \`overlay\` 展示如何把圖片疊到影片上，並透過 \`filter_complex\` 管理輸入與輸出標籤（FFmpeg Project，Documentation）。

## OBS 會議錄影前的檢查表

OBS 會議錄影前最重要的是先驗證「畫面只錄該錄的、聲音真的錄得到、輸出位置不會出事」。這份檢查表可以在正式會議開始前一分鐘快速掃過。

| 檢查項目 | 為什麼要檢查 |
|---|---|
| OBS 預覽畫面只出現會議視窗 | 避免錄到私訊、信件、其他桌面操作 |
| Audio Mixer 有桌面音訊與麥克風音量 | 避免錄完才發現沒有聲音 |
| 錄影輸出資料夾在本機硬碟 | 避免雲端同步或外接磁碟造成寫入不穩 |
| 先錄 10 到 20 秒測試檔 | 確認播放器能正常打開、聲音沒有爆音 |
| 關閉不必要通知 | 避免會議中跳出敏感訊息或干擾畫面 |
| 準備足夠硬碟空間 | 長時間會議影片檔案可能很大 |

這也是我偏好 OBS 視窗擷取的原因：會議錄影最怕的不是畫質不夠漂亮，而是錄進不該錄的內容。先把擷取範圍縮小，後面再用 FFmpeg 修剪，整個流程比較穩。

## 常見問題

### OBS 錄線上會議應該用視窗擷取還是螢幕擷取？
OBS 錄線上會議建議優先用視窗擷取，因為視窗擷取只會錄指定會議程式。螢幕擷取適合需要展示整個桌面的情境，但也比較容易錄到通知、私訊或其他工作畫面。

### OBS 可以只錄 Google Meet、Zoom 或 Teams 的視窗嗎？
OBS 可以只錄 Google Meet、Zoom 或 Teams 的視窗。Windows 與 Linux 可用 Window Capture，macOS 13 以上則建議使用 macOS Screen Capture，並選擇指定視窗或應用程式。

### OBS 錄影沒有聲音怎麼檢查？
OBS 錄影沒有聲音時，先看 Audio Mixer 的音量條有沒有跳動，再到 Settings → Audio 確認桌面音訊與麥克風裝置。macOS 還要確認 OBS 版本與系統版本是否支援內建音訊擷取，較舊系統可能需要額外音訊路由工具。

### OBS 錄完的會議影片在哪裡？
OBS 錄完的會議影片會存到 Settings → Output → Recording 指定的資料夾。若沒有改過設定，檔名通常會以錄影開始時間命名，方便用日期回頭找檔案。

### FFmpeg 剪裁會議影片會不會降低畫質？
使用 \`-c:v copy -c:a copy\` 剪裁時，FFmpeg 會直接複製影音串流，通常不會重新壓縮畫質。若使用 \`trim\`、\`overlay\` 或其他濾鏡，FFmpeg 需要重新編碼，輸出品質會受 codec、CRF、bitrate 與 preset 影響。

### FFmpeg 合併影片失敗通常是什麼原因？
FFmpeg 合併影片失敗常見原因是各段影片的 codec、解析度、fps、time base 或音訊格式不一致。可以先把每段影片轉成相同格式，再用 concat 合併。

### 會議錄影需要先取得同意嗎？
會議錄影是否需要同意，要依公司規範、會議性質與所在地法規判斷。實務上我會在會議開始前明確告知正在錄影，並確認錄影檔的保存位置、存取權限與刪除期限。

## 參考資料

- OBS Project, [Quick Start Guide](https://obsproject.com/kb/quick-start-guide)（存取日期：2026-08-28）
- OBS Project, [Sources Guide](https://obsproject.com/kb/sources-guide)（發布日期：2022-01-11，存取日期：2026-08-28）
- OBS Project, [Application Audio Capture Guide](https://obsproject.com/kb/application-audio-capture-guide)（發布日期：2023-07-12，存取日期：2026-08-28）
- OBS Project, [macOS Desktop Audio Capture Guide](https://obsproject.com/kb/macos-desktop-audio-capture-guide)（發布日期：2022-04-19，存取日期：2026-08-28）
- FFmpeg Project, [FFmpeg Documentation](https://ffmpeg.org/ffmpeg.html)（存取日期：2026-08-28）
- FFmpeg Project, [Download FFmpeg](https://ffmpeg.org/download.html)（存取日期：2026-08-28）
- Gyan Doshi, [FFmpeg Builds for Windows](https://www.gyan.dev/ffmpeg/builds/)（存取日期：2026-08-28）

## 延伸閱讀

- [Windows 編譯支援 HTTP-FLV 的 FFmpeg：OBS 虛擬鏡頭推流到 SRS](/post/compile-ffmpeg-http-flv-windows)：同樣聚焦 FFmpeg、OBS，可接著比較不同情境的做法。
- [限制 FFmpeg 初始連接的時間：analyzeduration 與 probesize 參數調校](/post/ffmpeg-limit-initial-connection-time)：同樣聚焦 FFmpeg、影音處理，可接著比較不同情境的做法。
- [AV1 影片編碼介紹：高壓縮比、WebRTC 與影音格式比較](/post/av1-video-codec-introduction)：同樣聚焦 OBS、FFmpeg，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2026-08-28。本文最早發布於 2023-05-31，這次整理保留 OBS 會議錄影流程與 FFmpeg 基礎指令，並補上 GEO Answer Blocks、FAQ、參考資料與站內延伸閱讀。
`;export{e as default};