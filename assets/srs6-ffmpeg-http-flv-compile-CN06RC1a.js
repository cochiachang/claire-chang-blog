var e=`---
title: 為 SRS6 編譯支援 HTTP-FLV 的 FFmpeg：H.265 over RTMP 推流實作
description: SRS6 支援 H.265，但官方 FFmpeg 不支援 FLV 封裝 HEVC。本文記錄如何加入 runner365 補丁、編譯 libx264/libx265 與 FFmpeg，實現 H.265 over RTMP 推流。
date: 2023-03-09
category: 後端開發
tags: [SRS, FFmpeg, H.265, RTMP, 串流伺服器]
readingTime: 9 分鐘
image: /images/tech/hero_srs6-ffmpeg-http-flv-compile.webp
imageAlt: FFmpeg 編譯與 SRS 串流伺服器推流示意圖
---


# 為 SRS6 編譯支援 HTTP-FLV 的 FFmpeg：H.265 over RTMP 推流實作

SRS 6.0 已支援 H.265 編碼，但官方版本的 FFmpeg 雖然支援 H.265，卻不支援用 FLV 封裝 HEVC，導致實際推流時會失敗。這篇文章記錄如何透過 runner365 的補丁重新編譯 FFmpeg（含 libx264/libx265），讓 RTMP 能正確推送 H.265 的流到 SRS 伺服器。

## SRS 是什麼？

SRS 是一個簡單高效的實時視頻服務器，支援 RTMP/WebRTC/HLS/HTTP-FLV/SRT/GB28181。

- 是一個運營級的互聯網直播服務器，集群併發 7.5k+
- 支援多種轉碼：RTMP→HLS、RTMP→FLV 等
- 支援 HTTP 回調、RTMP 0.1 秒延遲

在 HTTP-FLV 的低延遲實踐方案上，可以說是繼 FMS 之後非常有用心地在更新、維護的一個開源專案。主要開發者很熱心地回答問題，相關文件也隨著時間越來越完整，使用人數越來越多，是一個高效能且穩定的開源串流服務器。

## SRS 6.0 的 H.265 支援遇到什麼問題？

在 SRS 6.0 之中，終於看到 SRS 支援 H.265 了。這其中很重要的一個工作，就是在推流端讓 RTMP 的 FLV 格式推流能夠支援 H.265。

但是，若使用從 FFmpeg 官網下載的 .exe 檔案，即便 \`ffmpeg -version\` 顯示支援 H.265，在實際推 H.265 的流時仍然會發生錯誤：

![使用官方 FFmpeg 推 H.265 流時的指令畫面截圖](/images/articles/srs6-ffmpeg-http-flv-compile-1.webp)

錯誤訊息如下圖：

![官方 FFmpeg 推 H.265 流失敗的錯誤訊息截圖](/images/articles/srs6-ffmpeg-http-flv-compile-2.webp)

這個錯誤代表：官方提供的版本雖然支援 H.265，但**不支援使用 FLV 來封裝 H.265 的編碼格式**。

## 為什麼需要 HEVC over RTMP 的補丁？

關於 SRS 6.0 支援 HEVC over RTMP 的詳細說明，請見 [SRS GitHub issue #465](https://github.com/ossrs/srs/issues/465)：

> 支援 HEVC over RTMP 或 FLV 的規範和用法。runner365 為 FFmpeg 提供了 FFmpeg 4.1/5.1/6.0 的補丁，以支援透過 RTMP 或 FLV 的 HEVC。Intel 也有針對此功能的補丁。

也就是說，SRS 6 之所以能支援 H.265 over RTMP，是因為使用了 runner365 自己為 FFmpeg 增加的補丁功能。官方版本並不支援 HEVC over RTMP，若希望用 RTMP 推 H.265，就必須重新編譯包含這份補丁的 FFmpeg 執行檔。

另外要注意的是：OBS（v29.0.2）採用 HEVC 支援 RTMP 的實作方式與 SRS 6.0 使用的 FFmpeg 方案並不一致，若使用 OBS 推 H.265 的流到 SRS 伺服器，伺服器並沒有辦法正確解析串流內容。因此推流時，一定要使用編譯過的（runner365 補丁版本）、可支援 HEVC over RTMP 的 FFmpeg 來推流，才可以正確把 H.265 的流推送到 SRS。

官方如何編譯 FFmpeg 的教學在 [issue #465 的 ffmpeg-tools 段落](https://github.com/ossrs/srs/issues/465#ffmpeg-tools)。

使用 FFmpeg 推送 HEVC 格式的影片，重點在於把 vcodec 指定為 \`libx265\`：

\`\`\`bash
ffmpeg -i sample.mp4 -c:v libx265 -b:v 350k -f flv rtmp://127.0.0.1/live/livestream
\`\`\`

以下指令可推送極低延遲的 H.265 影片：

\`\`\`bash
ffmpeg -i sample.mp4 -c:v libx265 -crf 28 -x265-params profile=fast -preset veryfast -tune zerolatency -b:v 300k -minrate 300k -maxrate 300k -f flv rtmp://127.0.0.1/live/livestream
\`\`\`

## 怎麼在 Linux 裡編譯支援 H.265 over RTMP 的 FFmpeg？

首先取得 [runner365 的 FFmpeg 4.1/5.1/6.0 HEVC over RTMP 補丁](https://github.com/runner365/ffmpeg_rtmp_h265)。

### 第一步：編譯 libx264

\`\`\`bash
cd ~/git
git clone https://code.videolan.org/videolan/x264.git
cd ~/git/x264
./configure --prefix=$(pwd)/build --disable-asm --disable-cli --disable-shared --enable-static
make -j10
make install
\`\`\`

### 第二步：編譯 libx265

\`\`\`bash
cd ~/git
cd ~/git/x265_git/build/linux
cmake -DCMAKE_INSTALL_PREFIX=$(pwd)/build -DENABLE_SHARED=OFF ../../source
make -j10
make install
\`\`\`

### 第三步：載入 HEVC over RTMP/FLV 補丁

\`\`\`bash
cd ~/git
git clone -b 5.1 https://github.com/runner365/ffmpeg_rtmp_h265.git
cp ~/git/ffmpeg_rtmp_h265/flv.h ~/git/FFmpeg/libavformat/
cp ~/git/ffmpeg_rtmp_h265/flv*.c ~/git/FFmpeg/libavformat
\`\`\`

### 第四步：編譯 FFmpeg

\`\`\`bash
cd ~/git/FFmpeg
env PKG_CONFIG_PATH=~/git/x264/build/lib/pkgconfig:~/git/x265_git/build/linux/build/lib/pkgconfig \\
./configure \\
  --prefix=$(pwd)/build \\
  --enable-gpl --enable-nonfree --enable-pthreads --extra-libs=-lpthread \\
  --disable-asm --disable-x86asm --disable-inline-asm \\
  --enable-decoder=aac --enable-decoder=aac_fixed --enable-decoder=aac_latm --enable-encoder=aac \\
  --enable-libx264 --enable-libx265 \\
  --pkg-config-flags='--static'
make -j10
\`\`\`

### 第五步：嘗試推流

\`\`\`bash
./ffmpeg -stream_loop -1 -re -i ~/srs/doc/source.flv -acodec copy -vcodec libx265 \\
  -f flv rtmp://localhost/live/livestream
\`\`\`

## 常見問題

### 為什麼官方 FFmpeg 版本顯示支援 H.265 卻推流失敗？

因為官方版本不支援用 FLV 封裝 HEVC（HEVC over RTMP 不是官方功能），需要使用 runner365 為 FFmpeg 4.1/5.1/6.0 提供的補丁重新編譯才能推送。

### 可以用 OBS 29 推 H.265 到 SRS6 嗎？

不行。OBS v29.0.2 實作 HEVC over RTMP 的方式與 SRS 6.0 使用的 FFmpeg 方案不一致，SRS 會無法正確解析串流內容，必須使用補丁版 FFmpeg 推流。

### 推 H.265 流的 FFmpeg 指令重點是什麼？

把視訊編碼器指定為 \`libx265\`（\`-c:v libx265\`），輸出格式為 \`-f flv\` 推到 RTMP 位址；若要低延遲，可再加上 \`-tune zerolatency\` 與固定碼率參數。

### 編譯 FFmpeg 前要先裝什麼？

要先編譯並安裝 libx264 與 libx265，之後以 \`PKG_CONFIG_PATH\` 指向兩者的 pkgconfig 路徑，configure 時加上 \`--enable-libx264 --enable-libx265\`。

## 參考資料

- [SRS issue #465：SRS 支援 HEVC over RTMP 的說明](https://github.com/ossrs/srs/issues/465)
- [官方 FFmpeg 編譯教學（issue #465#ffmpeg-tools）](https://github.com/ossrs/srs/issues/465#ffmpeg-tools)
- [runner365 的 FFmpeg HEVC over RTMP 補丁](https://github.com/runner365/ffmpeg_rtmp_h265)

## 延伸閱讀

- [Windows 編譯支援 HTTP-FLV 的 FFmpeg：OBS 虛擬鏡頭推流到 SRS](/post/compile-ffmpeg-http-flv-windows)：同樣聚焦 FFmpeg、RTMP，可接著比較不同情境的做法。
- [使用 OBS 推流 H.265：v29 後的 HEVC over RTMP 設定筆記](/post/obs-rtmp-h265-streaming)：同樣聚焦 H.265、RTMP，可接著比較不同情境的做法。
- [HEVC(H.265) 高壓縮比編碼格式介紹：瀏覽器支援與 RTMP 推流全解析](/post/hevc-codec-introduction)：同樣聚焦 H.265、RTMP，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2023-03-09，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};