var e=`---
title: 在 VSCode 建構 Nx Meta 套件：NX SDK、CMake 與 MSYS2 設定
description: 說明如何在 VSCode 準備 Nx Meta 套件開發環境，包含 NX SDK、CMake、MSYS2、CMake Tools 與 settings.json 設定。
date: 2025-05-11
category: 前端開發
tags: [VS Code, Nx Meta, CMake, MSYS2, C++]
readingTime: 6 分鐘
image: /images/tech/hero_generate-used-library-list.webp
imageAlt: 深色程式碼編輯器與編譯工具畫面，象徵 VSCode 中的 CMake 與 C++ 套件建構流程
---
# 在 VSCode 建構 Nx Meta 套件：NX SDK、CMake 與 MSYS2 設定

在 VSCode 建構 Nx Meta 套件時，核心流程是先下載 NX SDK，準備 CMake 與 C++ 編譯器，再用 VSCode 的 CMake Tools 對含有 \`CMakeLists.txt\` 的專案執行 configure 與 build。若專案是 Network Optix 的 C++ analytics plugin 範例，還需要在 \`.vscode/settings.json\` 指定 \`metadataSdkDir\` 與 \`SERVER_DIR\`，讓 CMake 找得到 SDK 與 Nx MetaVMS mediaserver。

## 建構 Nx Meta 套件前需要哪些官方資源？

建構 Nx Meta 套件前，先準備官方教學文件、官方範例套件與 NX SDK 下載頁。這三個資源分別對應 workspace 準備、plugin 範例程式碼與本機 SDK。

我會先把這三個連結放在同一份筆記裡，避免環境設定做到一半才回頭找資料：

- 官方教學文件：[Preparing a Workspace](https://meta.nxvms.com/docs/developers/knowledgebase/234-preparing-a-workspace)
- 官方範例套件：[opencv_object_detection_analytics_plugin](https://github.com/networkoptix/nx_open_integrations/tree/72d9c30658531d954e0de59e73b431122bcf29cc/cpp/vms_server_plugins/opencv_object_detection_analytics_plugin)
- NX SDK 下載頁：[Nx Meta SDK releases](https://meta.nxvms.com/download/releases/sdk)

這篇的設定以 Windows 開發環境為主，因為範例中使用 MSYS2、Visual Studio 2022 generator，以及 \`C:/Program Files/Network Optix/Nx MetaVMS/mediaserver\` 這類 Windows 路徑。

## VSCode 建構 Nx Meta 套件要安裝哪些工具？

VSCode 建構 Nx Meta 套件至少需要 CMake、C++ 編譯器、Ninja，以及 VSCode 的 CMake Tools 與 C/C++ Extension Pack。缺少任一工具都可能讓 configure 或 build 階段失敗。

需要先準備的工具如下：

| 工具 | 用途 | 來源 |
|---|---|---|
| CMake | 讀取 \`CMakeLists.txt\` 並產生建置設定 | [CMake Download](https://cmake.org/download/) |
| MSYS2 | 在 Windows 上提供 MinGW / UCRT64 編譯環境 | [MSYS2](https://www.msys2.org/) |
| GCC | C++ 編譯器 | 透過 MSYS2 \`pacman\` 安裝 |
| Ninja | CMake 可使用的 build tool | 透過 MSYS2 \`pacman\` 安裝 |
| CMake Tools | VSCode 裡執行 configure、build 與切換 kit | VSCode Extensions |
| C/C++ Extension Pack | VSCode 的 C/C++ 編輯、IntelliSense 與除錯支援 | VSCode Extensions |

來源稿建議 CMake 使用 3.15 以上版本。版本太舊時，CMake 對 generator、toolchain 或 project 設定的支援可能跟範例專案需求不一致。

## 如何用 MSYS2 安裝 GCC 與 Ninja？

MSYS2 安裝完成後，打開 MSYS2 終端機並用 \`pacman\` 安裝 UCRT64 版本的 GCC 與 Ninja。安裝後先檢查 \`gcc --version\`，確認編譯器已可被終端機呼叫。

在 MSYS2 裡執行：

\`\`\`bash
pacman -S mingw-w64-ucrt-x86_64-gcc
pacman -S mingw-w64-ucrt-x86_64-ninja
gcc --version
\`\`\`

如果 \`gcc --version\` 沒有輸出版本資訊，先檢查目前開的是不是正確的 MSYS2 shell，以及 UCRT64 的路徑是否被加入環境變數。CMake Tools 後續選 kit 時，也需要找得到這個編譯環境。

## 如何在 VSCode 設定 CMake Tools？

VSCode 開啟 C++ 專案根目錄後，專案根目錄應該要有 \`CMakeLists.txt\`。接著用 Command Palette 執行 \`CMake: Configure\`，選擇合適的編譯環境後再執行 \`CMake: Build\`。

操作流程很短：

1. 用 VSCode 開啟 C++ 專案資料夾。
2. 確認資料夾根目錄有 \`CMakeLists.txt\`。
3. 按 \`F1\`，搜尋並執行 \`CMake: Configure\`。
4. 選擇編譯環境；若不確定，可以先讓 CMake Tools 自動搜尋。
5. 再按 \`F1\`，執行 \`CMake: Build\`。

我在這一步會特別留意 CMake Tools 找到的是哪一組 kit。電腦同時裝了 Visual Studio、MSYS2、MinGW 或其他 compiler 時，自動搜尋不一定會選到你真正想用的環境。

## \`.vscode/settings.json\` 要設定哪些 CMake 參數？

Nx Meta 套件建構時，\`.vscode/settings.json\` 的重點是指定 CMake generator、NX SDK 路徑、mediaserver 路徑、build 目錄、Release 模式與 install 目錄。路徑要改成本機實際安裝位置。

可以在專案根目錄新增 \`.vscode/settings.json\`：

\`\`\`json
{
  "cmake.generator": "Visual Studio 17 2022",
  "cmake.configureSettings": {
    "metadataSdkDir": "D:/metadata_sdk",
    "SERVER_DIR": "C:/Program Files/Network Optix/Nx MetaVMS/mediaserver"
  },
  "cmake.buildDirectory": "\${workspaceFolder}/build",
  "cmake.buildType": "Release",
  "cmake.configureArgs": [
    "-A",
    "x64"
  ],
  "cmake.installPrefix": "\${workspaceFolder}/install"
}
\`\`\`

\`metadataSdkDir\` 要指向解壓後的 NX SDK 目錄，\`SERVER_DIR\` 要指向 Nx MetaVMS 的 mediaserver 目錄。若這兩個路徑寫錯，CMake configure 階段通常會找不到 header、library 或伺服器相關檔案。

## 建構完成後如何確認 DLL 已產生？

Nx Meta 套件 build 成功後，通常要到 build 或 install 目錄確認 DLL 是否產生。若 VSCode 顯示 build 成功但找不到 DLL，優先檢查 build directory、install prefix 與 CMake output log。

我會用這份檢查表排除常見問題：

| 檢查項目 | 判斷方式 |
|---|---|
| \`CMakeLists.txt\` 位置 | VSCode 開啟的是專案根目錄，不是上層或子資料夾 |
| NX SDK 路徑 | \`metadataSdkDir\` 指到 SDK 實際解壓位置 |
| Nx MetaVMS 路徑 | \`SERVER_DIR\` 指到 mediaserver 目錄 |
| 目標平台 | \`cmake.configureArgs\` 有設定 \`-A x64\` |
| 建置模式 | \`cmake.buildType\` 使用 \`Release\` |
| 產出位置 | 檢查 \`\${workspaceFolder}/build\` 與 \`\${workspaceFolder}/install\` |
| 中文路徑 | 若 configure 或 build 出現奇怪錯誤，先把專案搬到英文路徑 |

資訊增益：CMake 在某些 Windows 開發環境下會因為中文路徑或空白路徑出現難讀的錯誤訊息。若錯誤看起來不像程式碼問題，先把專案移到例如 \`D:/workspace/nx-plugin\` 這類純英文路徑，常常比追 log 更快找到方向。

## 常見問題

### VSCode 建構 Nx Meta 套件一定要用 CMake Tools 嗎？

不一定，但 CMake Tools 可以直接在 VSCode 裡執行 configure、選 kit、切 build type 與啟動 build。若不使用 CMake Tools，也可以在終端機手動執行 CMake 指令，只是環境與路徑要自己管理。

### \`metadataSdkDir\` 要填哪個路徑？

\`metadataSdkDir\` 要填 NX SDK 解壓後的本機資料夾路徑。範例使用 \`D:/metadata_sdk\`，實際專案要改成自己的 SDK 位置。

### \`SERVER_DIR\` 要填哪個路徑？

\`SERVER_DIR\` 要填 Nx MetaVMS mediaserver 的安裝目錄。範例使用 \`C:/Program Files/Network Optix/Nx MetaVMS/mediaserver\`，如果 Nx MetaVMS 安裝在其他位置，必須同步修改。

### CMake 找不到 MSYS2 或 GCC 怎麼辦？

先確認 MSYS2 內的 \`gcc --version\` 可以正常輸出版本，再檢查 VSCode CMake Tools 選到的 kit。若電腦上同時有多套 compiler，建議手動選擇正確 kit，不要只依賴自動搜尋。

### Nx Meta 套件建構失敗時先查什麼？

先查 \`CMakeLists.txt\` 是否在 VSCode 開啟的根目錄內，再查 \`metadataSdkDir\`、\`SERVER_DIR\`、generator、平台參數與中文路徑。這幾項是環境型錯誤最常見的位置。

### 為什麼建構成功後找不到 DLL？

DLL 位置取決於 CMake 專案設定、\`cmake.buildDirectory\` 與 \`cmake.installPrefix\`。先檢查 \`\${workspaceFolder}/build\` 與 \`\${workspaceFolder}/install\`，再看 CMake Tools 的 output log 有沒有列出實際輸出路徑。

## 參考資料

- Network Optix，〈[Preparing a Workspace](https://meta.nxvms.com/docs/developers/knowledgebase/234-preparing-a-workspace)〉。
- Network Optix GitHub，〈[opencv_object_detection_analytics_plugin](https://github.com/networkoptix/nx_open_integrations/tree/72d9c30658531d954e0de59e73b431122bcf29cc/cpp/vms_server_plugins/opencv_object_detection_analytics_plugin)〉。
- Network Optix，〈[Nx Meta SDK releases](https://meta.nxvms.com/download/releases/sdk)〉。
- CMake，〈[Download CMake](https://cmake.org/download/)〉。
- MSYS2，〈[MSYS2 Installation](https://www.msys2.org/)〉。

**最後更新：** 2026-08-28

## 延伸閱讀

- [Emscripten 編譯 WebAssembly 實作筆記：從 MSYS2 到 emmake](/post/emscripten-webassembly-compile-guide)：同樣聚焦 C++，可接著比較不同情境的做法。
- [使用VSCode繪製UML文件](/post/vscode-plantuml-diagrams)：同樣聚焦 VSCode，可接著比較不同情境的做法。
- [讓 IDE 支援 Angular Language Service](/post/angular-language-service-ide-support)：同屬「前端開發」主題，可延伸理解相近問題的判斷方式。
`;export{e as default};