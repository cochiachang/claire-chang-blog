var e=`---
title: OBS Studio 啟動參數教學：自動開始直播、錄影與便攜模式設定
description: 整理 OBS Studio 官方支援的啟動參數（Launch Parameters），包括 --startstreaming 自動開始直播、--startrecording 自動錄影、--profile 指定配置檔、--multi 多開、--safe-mode 安全模式等完整清單，並說明如何在 Windows 捷徑或排程任務中正確加上啟動參數與工作目錄。
date: 2023-11-17
category: DevOps
tags: [OBS, 啟動參數, 直播, 錄影, Windows]
readingTime: 4 分鐘
image: /images/tech/hero_obs-launch-parameters.webp
imageAlt: 深色工作環境中的電腦螢幕顯示影音製作軟體介面，象徵 OBS Studio 的啟動與自動化設定
---


# OBS Studio 啟動參數教學：自動開始直播、錄影與便攜模式設定

OBS Studio 支援一組官方的啟動參數（Launch Parameters），可以在開啟程式的同時自動開始直播、開始錄影、指定場景集合或配置檔，甚至以安全模式排除第三方插件。這篇整理我使用這些參數的方法與完整參數清單，適合想讓 OBS 隨開即用、或需要用排程任務自動啟動的讀者。

## 如何在 Windows 捷徑中使用啟動參數？

要使用自定義啟動參數建立 OBS Studio 的捷徑：

1. 複製一個指向 OBS Studio 的捷徑，或選擇一個已存在的捷徑（從「開始」功能表、工作列等處）。
2. 右鍵點擊捷徑，然後點擊「內容」。
3. 在「目標」欄位中，於 obs64.exe 路徑後面加上啟動參數。

![在 Windows 捷徑的目標欄位中，於 obs64.exe 路徑後面添加啟動參數](/images/articles/obs-launch-parameters-1.webp)

若要透過排程任務或其他自動方式啟動 OBS Studio，請務必也設定工作目錄（「開始於...」），該目錄必須指向 obs64.exe 所在的資料夾，否則 OBS 可能無法正確啟動。

## OBS Studio 支援哪些啟動參數？

官方啟動參數介紹頁面在 [obsproject.com/kb/launch-parameters](https://obsproject.com/kb/launch-parameters)。這些參數主要用於自動化和便攜式使用，每個參數都有特定功能：

| 參數 | 功能 |
| --- | --- |
| \`--help, -h\` | 顯示可用參數清單 |
| \`--version, -v\` | 顯示 OBS 版本 |
| \`--startstreaming\` | 自動開始直播 |
| \`--startrecording\` | 自動開始錄影 |
| \`--startvirtualcam\` | 自動開始虛擬攝影機 |
| \`--startreplaybuffer\` | 自動開始重播緩存 |
| \`--collection "name"\` | 使用指定的場景集合啟動 |
| \`--profile "name"\` | 使用指定的配置檔啟動 |
| \`--scene "name"\` | 使用指定的場景啟動 |
| \`--studio-mode\` | 啟動時啟用 Studio 模式 |
| \`--minimize-to-tray\` | 啟動時最小化到系統匣 |
| \`--portable, -p\` | 使用便攜模式 |
| \`--multi, -m\` | 啟動多個實例時不顯示警告 |
| \`--always-on-top\` | 啟動時開啟「總在最前面」模式 |
| \`--verbose\` | 讓日誌更詳細 |
| \`--unfiltered_log\` | 停用日誌過濾（不抑制重複行） |
| \`--disable-updater\` | 停用內建更新器（僅限 Windows/macOS） |
| \`--allow-opengl\` | 在 Windows 上允許 OpenGL 渲染器 |
| \`--only-bundled-plugins\` | 僅使用內建模組啟動 |
| \`--safe-mode\` | 強制以安全模式啟動，停用所有第三方插件、腳本和 WebSockets |
| \`--disable-shutdown-check\` | 停用不潔關機檢測（該檢測會提示以安全模式啟動） |
| \`--disable-missing-files-check\` | 停用啟動時可能出現的缺失檔案對話框 |

舉例來說，想讓 OBS 一打開就直接開始錄影並載入特定配置檔，可以把捷徑目標設成類似：

\`\`\`
"C:\\Program Files\\obs-studio\\bin\\64bit\\obs64.exe" --startrecording --profile "會議錄影"
\`\`\`

這些參數提供了更多控制與彈性，可以依照自己的需求和工作流程自定義 OBS Studio 的啟動與運行方式。

## 常見問題

### OBS 的啟動參數要加在哪裡？

Windows 上加在捷徑「內容」的「目標」欄位，放在 obs64.exe 路徑後面，以空格分隔。若是用排程任務啟動，也要把「開始於」工作目錄設成 obs64.exe 所在資料夾。

### 為什麼用排程任務啟動 OBS 會失敗？

最常見的原因是沒有設定工作目錄。OBS 除了啟動路徑之外，還需要「開始於」指向 obs64.exe 所在的資料夾，否則程式可能找不到必要的檔案而無法正常啟動。

### --safe-mode 什麼時候會用到？

當 OBS 因為第三方插件、腳本或 WebSockets 出問題而無法正常啟動時，可以用 \`--safe-mode\` 強制以安全模式啟動，停用所有第三方擴充。另外 OBS 偵測到不潔關機時也會提示進入安全模式，可用 \`--disable-shutdown-check\` 停用該檢測。

### 可以同時開啟多個 OBS 嗎？

可以。加上 \`--multi\`（或 \`-m\`）參數啟動多個實例時不會顯示警告。若想讓每個實例使用不同設定，可以再搭配 \`--profile\` 與 \`--collection\` 分別指定配置檔和場景集合。

## 參考資料

- [OBS Studio 官方啟動指令介紹頁面](https://obsproject.com/kb/launch-parameters)

## 延伸閱讀

- [OBS 推送 HEVC 直播串流到 SRS：Enhanced RTMP 設定教學](/post/obs-hevc-rtmp-srs-streaming)：同樣聚焦 OBS，可接著比較不同情境的做法。
- [Windows 編譯支援 HTTP-FLV 的 FFmpeg：OBS 虛擬鏡頭推流到 SRS](/post/compile-ffmpeg-http-flv-windows)：同樣聚焦 OBS、Windows，可接著比較不同情境的做法。
- [OBS 會議錄影教學：視窗擷取、聲音設定與 FFmpeg 剪輯流程](/post/obs-meeting-recording-guide)：同樣聚焦 OBS，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2023-11-17，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};