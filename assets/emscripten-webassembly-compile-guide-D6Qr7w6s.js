var e=`---
title: Emscripten 編譯 WebAssembly 實作筆記：從 MSYS2 到 emmake
description: 整理 WebAssembly 是什麼、Emscripten 如何編譯 C/C++ 專案，以及在 MSYS2 環境處理 libde265.js 與 AV1/AOM 編譯流程。
date: 2024-09-12
category: 前端開發
tags: [Emscripten, WebAssembly, Wasm, C++, AV1, 前端開發]
readingTime: 10 分鐘
image: /images/tech/hero_rwd-media-queries-css.webp
imageAlt: 桌上並排的多支手機，各自顯示不同畫面比例的網頁內容，象徵前端 Web 技術在不同瀏覽環境中的執行需求
---


# Emscripten 編譯 WebAssembly 實作筆記：從 MSYS2 到 emmake

Emscripten 編譯 WebAssembly 的核心，是把原本依賴 \`gcc\`、\`g++\`、\`make\` 或 CMake 的 C/C++ 專案，改成使用 \`emcc\`、\`em++\`、\`emmake\` 與 \`emcmake\` 產出可在瀏覽器載入的 Wasm 檔案。我的實作重點不是只安裝工具，而是確認整條編譯鏈都真的走 Emscripten，不要中途又回到原生編譯器。

## WebAssembly 是什麼？

WebAssembly 是一種安全、可攜、低階的二進位程式碼格式，目標是在 Web 上執行接近原生效能的應用。WebAssembly 常作為 C、C++、Rust 等語言的編譯目標，並透過 JavaScript API 與前端程式協作。

WebAssembly（Wasm）由 W3C WebAssembly Community Group 推動，W3C Core Specification 將 WebAssembly 描述為安全、可攜、低階、適合高效執行與緊湊表示的程式碼格式（W3C，2026-05）。MDN 也把 WebAssembly 定位成一種低階、類組合語言的技術，可作為 C/C++、C#、Rust 等語言的編譯目標，並在瀏覽器中與 JavaScript 一起運作（MDN Web Docs，2026-07）。

我會把 WebAssembly 當成前端效能工具箱裡的一層：畫面、事件與產品邏輯仍然可以交給 JavaScript 或 TypeScript；影像解碼、編碼、壓縮、數學計算這類重運算，才適合移到 WebAssembly。

## 什麼情境適合用 Emscripten 編譯 WebAssembly？

Emscripten 適合把既有 C/C++ 函式庫搬到瀏覽器，尤其是影音處理、圖像處理、遊戲引擎與演算法模組。若需求只是一般 UI 互動，JavaScript 通常比 WebAssembly 更好維護。

WebAssembly 的常見應用場景包含：

| 情境 | 為什麼適合 WebAssembly |
|---|---|
| 遊戲開發 | 可把 C/C++ 遊戲引擎或核心邏輯移植到瀏覽器 |
| 影片與圖像處理 | 解碼、濾鏡、編碼等重運算可減少 JavaScript 主執行緒壓力 |
| 科學計算 | 大量數值運算可利用接近原生的執行效率 |
| 既有 C/C++ 函式庫移植 | 可以重用成熟程式碼，而不是在前端重寫整套邏輯 |

Emscripten 官方文件說明，\`emcc\` 可以作為類似 \`gcc\` 或 \`clang\` 的編譯器前端，負責呼叫工具鏈並產出 JavaScript 與 WebAssembly（Emscripten Documentation，存取日期：2026-08-28）。這也是我在移植影音相關專案時會先選 Emscripten 的原因：前端最後需要的是可載入的 \`.js\` glue code 和 \`.wasm\`，不是只產生一包原生平台的 object file。

## 如何在 Windows/MSYS2 安裝 Emscripten？

Windows/MSYS2 安裝 Emscripten 時，先準備 MSYS2 UCRT64、編譯工具、Node.js，再安裝 \`emsdk\`。重點是讓 shell 的 \`PATH\` 找得到 \`emcc\`、\`em++\`、\`emmake\` 與 \`emcmake\`。

我當時使用 MSYS2 的 UCRT64 環境處理 C/C++ 專案。先下載 MSYS2 installer：

\`\`\`text
https://github.com/msys2/msys2-installer/releases/download/2024-01-13/msys2-x86_64-20240113.exe
\`\`\`

開啟 \`ucrt64.exe\` 後，切到專案目錄：

\`\`\`bash
cd /D/Git/lbde265/
\`\`\`

安裝所需套件：

\`\`\`bash
pacman -Syu
pacman -S python3 clang cmake git make autoconf automake gcc
pacman -S mingw-w64-ucrt-x86_64-nodejs
pacman -S mingw-w64-ucrt-x86_64-gcc
pacman -S mingw-w64-ucrt-x86_64-emscripten
pacman -S base-devel mingw-w64-x86_64-toolchain
\`\`\`

再安裝 \`emsdk\`：

\`\`\`bash
nano ~/.bashrc
export EMSDK="/D/Git/lbde265/emsdk"
export PATH="$PATH:/D/Git/lbde265/emsdk"
source ~/.bashrc

git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
./emsdk install latest
./emsdk activate latest --permanent
source ./emsdk_env.sh
\`\`\`

如果 shell 開新視窗後找不到 Emscripten，就把相關路徑補進 \`~/.bashrc\`：

\`\`\`bash
nano ~/.bashrc
export PATH="$PATH:/d/Git/lbde265/emsdk/upstream/emscripten"
export PATH="$PATH:/d/Git/lbde265/emsdk"
export PATH="$PATH:/c/msys64/ucrt64/bin"
export PATH="$PATH:/c/msys64/usr/local/bin"
export PATH="$PATH:/c/msys64/usr/bin"
export PATH="$PATH:/c/Windows/System32"
export PATH="$PATH:/c/Windows"
export PATH="$PATH:/c/Windows/System32/Wbem"
export PATH="$PATH:/c/Windows/System32/WindowsPowerShell/v1.0/"
export PATH="$PATH:/c/msys64/usr/bin/site_perl"
export PATH="$PATH:/c/msys64/usr/bin/vendor_perl"
export PATH="$PATH:/c/msys64/usr/bin/core_perl"
source ~/.bashrc
\`\`\`

最後確認 \`emcc\` 能正常執行：

\`\`\`bash
emcc -v
\`\`\`

## 如何用 Emscripten 編譯既有 C/C++ 專案？

Emscripten 編譯既有 C/C++ 專案時，關鍵是用 \`emconfigure\`、\`emcmake\`、\`emmake\` 包住原本的 configure、CMake 與 make 流程。直接執行 \`make\` 常會回到原生編譯器，導致產物不能被瀏覽器載入。

Emscripten 官方建議，在 configure 型專案中用 \`emconfigure ./configure\` 與 \`emmake make\`；在 CMake 型專案中，用 \`emcmake cmake\` 讓 CMake 取得正確的 compiler 與 toolchain 設定（Emscripten Documentation，存取日期：2026-08-28）。

我的檢查表會抓三件事：

| 檢查點 | 我會看什麼 |
|---|---|
| 編譯器是否正確 | verbose log 裡應該看到 \`emcc\` 或 \`em++\`，不是 \`gcc\` 或 \`g++\` |
| build wrapper 是否使用 | configure/CMake 用 \`emconfigure\` 或 \`emcmake\`，make 用 \`emmake\` |
| 輸出格式是否合理 | 最後應產出可部署的 \`.js\`、\`.wasm\`，或可再由 \`emcc\` link 的 Wasm object |

如果 Makefile 裡有寫死 \`gcc\` 或 \`g++\`，就要替換成 \`emcc\` 或 \`em++\`。子目錄裡的 Makefile 也要一起檢查，否則主層改完仍可能在某個 library build 階段失敗。

## 如何編譯 libde265.js？

libde265.js 編譯流程要先取得專案與 libde265 source，再用 Emscripten 的 make 流程建立 Wasm 相關產物。遇到 Makefile 寫死原生 compiler 時，需要把 \`gcc\`/\`g++\` 改成 \`emcc\`/\`em++\`。

我保留當時使用的指令，因為這段最能說明實務上會卡在哪裡：

\`\`\`bash
git clone https://github.com/strukturag/libde265.js.git
chmod +x ./configure
sh build.sh

wget https://github.com/strukturag/libde265/releases/download/v1.0.15/libde265-1.0.15.tar.gz
tar xzf libde265-1.0.15.tar.gz
cd libde265-1.0.15
./configure --disable-sse --disable-dec265 --disable-sherlock265 --enable-log-error --enable-log-info --enable-log-trace
emmake make
\`\`\`

這裡要注意兩件事。第一，凡是引用 \`gcc\` 或 \`g++\` 的地方，針對 WebAssembly 編譯時都要改成 \`emcc\` 或 \`em++\`。第二，如果專案裡有多層子目錄，不能只改最外層 Makefile。

我當時也把 \`CFLAGS\` 調整成：

\`\`\`makefile
CFLAGS = -g -O2 -Wall
\`\`\`

三個選項的意思如下：

| 參數 | 作用 |
|---|---|
| \`-g\` | 產生除錯資訊，方便排查編譯或執行問題 |
| \`-O2\` | 啟用第二級最佳化，在速度與編譯成本之間取得平衡 |
| \`-Wall\` | 開啟常見警告，提早找出潛在問題 |

## 如何編譯 AV1/AOM 的 WebAssembly？

AV1/AOM 這類 C/C++ 專案不能只照一般原生流程執行 \`make\`。使用 Emscripten 時，CMake 設定階段要先用 \`emcmake\`，建置階段再用 \`emmake\`。

GoogleChromeLabs 的 \`wasm-av1\` 專案把 AOM 帶進 WebAssembly 情境，適合用來理解 AV1 decoder 或 encoder 在瀏覽器環境的編譯方式（GoogleChromeLabs，存取日期：2026-08-28）。我遇到的重點是：只跑一般 \`make\` 會失敗，因為 build system 沒有被切到 Emscripten toolchain。

不要只執行：

\`\`\`bash
make
\`\`\`

改用這組流程：

\`\`\`bash
emcmake cmake ./third_party/aom -DAOM_TARGET_CPU=generic
emmake make
\`\`\`

\`-DAOM_TARGET_CPU=generic\` 讓目標 CPU 設定保守一點，避免產生瀏覽器 WebAssembly 環境不適合的原生 CPU 假設。若後續要做更細的最佳化，再依目標瀏覽器、Wasm feature 與 codec 需求逐步收窄。

## 編譯失敗時要先檢查什麼？

Emscripten 編譯失敗時，我會先檢查工具鏈是否被原生 compiler 偷偷接回去。多數問題不是 WebAssembly 本身壞掉，而是 configure、CMake、Makefile 或環境變數仍指向 \`gcc\`、\`g++\`、原生 library。

我通常照這個順序排查：

1. 執行 \`emcc -v\`，確認目前 shell 真的吃到 Emscripten。
2. 用 verbose build log 檢查實際 compiler，確定不是 \`gcc\` 或 \`g++\`。
3. 檢查 Makefile、CMake cache、子目錄 build script 是否寫死原生 compiler。
4. 確認需要停用的原生指令集，例如 SSE、平台專用 decoder 或 GUI tool。
5. 把 configure/CMake 階段重跑一次，不要沿用原生 build 留下來的 cache。

Emscripten 官方文件也提醒，\`make\` 產物可能是 \`.o\`、\`.a\`、\`.so\` 或其他副檔名；副檔名本身不能保證內容可用，必要時要用 build log 或檔案檢查確認產物是否來自 Wasm object 或 LLVM bitcode（Emscripten Documentation，存取日期：2026-08-28）。

## 常見問題

### WebAssembly 和 JavaScript 是替代關係嗎？
WebAssembly 和 JavaScript 不是單純替代關係。WebAssembly 適合搬運高效能運算核心，JavaScript 適合處理 DOM、事件、資料流與前端整合；實務上兩者通常一起使用。

### Emscripten 一定會輸出 WebAssembly 嗎？
新版 Emscripten 預設會建置 WebAssembly，除非在 linking 階段明確關掉 Wasm 輸出。Emscripten 文件也說明，是否輸出 WebAssembly 主要取決於 linking 階段設定，而不是每個 object file 的副檔名。

### 為什麼直接執行 make 會失敗？
直接執行 \`make\` 可能讓專案繼續使用原生 \`gcc\` 或 \`g++\`。Emscripten 專案通常要用 \`emconfigure\`、\`emcmake\` 與 \`emmake\` 包住既有 build 流程，讓 compiler、linker 與 library path 全部切到 WebAssembly 目標。

### 什麼時候要把 gcc 改成 emcc？
當 Makefile 或 build script 寫死 \`gcc\` 時，就要把 C compiler 改成 \`emcc\`。如果是 C++ 程式，則要把 \`g++\` 改成 \`em++\`，並同步檢查子目錄是否也有寫死 compiler。

### CFLAGS 的 -g、-O2、-Wall 可以保留嗎？
\`-g\`、\`-O2\`、\`-Wall\` 通常可以保留。\`-g\` 方便除錯，\`-O2\` 提供常用最佳化，\`-Wall\` 能讓警告提早浮出；真正需要小心的是平台專用參數，例如 SSE 或只適用原生 CPU 的旗標。

### AV1/AOM 編譯 WebAssembly 為什麼要用 emcmake？
AV1/AOM 這類 CMake 專案需要在設定階段就指定 Emscripten toolchain。\`emcmake cmake ./third_party/aom -DAOM_TARGET_CPU=generic\` 會讓 CMake 產生適合 WebAssembly 的建置設定，後續再用 \`emmake make\` 執行編譯。

### Emscripten 適合所有前端功能嗎？
Emscripten 不適合拿來取代一般前端功能。表單、路由、互動 UI、資料顯示仍然適合 JavaScript 或 TypeScript；WebAssembly 比較適合重運算、既有 C/C++ 函式庫移植、影像影音處理等工作。

## 參考資料

- [W3C WebAssembly Core Specification](https://www.w3.org/TR/wasm-core/)
- [MDN Web Docs: WebAssembly](https://developer.mozilla.org/en-US/docs/WebAssembly)
- [Emscripten Documentation: Compiling and Running Projects](https://emscripten.org/docs/compiling/index.html)
- [Emscripten Documentation: Building Projects](https://emscripten.org/docs/compiling/Building-Projects.html)
- [Emscripten Documentation: Building to WebAssembly](https://emscripten.org/docs/compiling/WebAssembly.html)
- [Emscripten Documentation: Tutorial](https://emscripten.org/docs/getting_started/Tutorial.html)
- [web.dev: Emscripting a C library to Wasm](https://web.dev/articles/emscripting-a-c-library)
- [GoogleChromeLabs wasm-av1](https://github.com/GoogleChromeLabs/wasm-av1)
- [strukturag libde265.js](https://github.com/strukturag/libde265.js)
- [strukturag libde265 releases](https://github.com/strukturag/libde265/releases)

## 延伸閱讀

- [WebCodecs + WebGPU：開啟個人化串流新視界](/post/webcodecs-webgpu-personalized-streaming)：同樣聚焦 WebAssembly、前端開發，可接著比較不同情境的做法。
- [在 VSCode 建構 Nx Meta 套件：NX SDK、CMake 與 MSYS2 設定](/post/vscode-nx-package-setup)：同樣聚焦 C++，可接著比較不同情境的做法。
- [TypeScript 設定全攻略：看懂 tsconfig.json 的核心編譯選項](/post/typescript-tsconfig-settings)：同樣聚焦 前端開發，可接著比較不同情境的做法。

## 最後更新

2026-08-28
`;export{e as default};