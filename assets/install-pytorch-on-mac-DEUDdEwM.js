var e=`---
title: PyTorch 於 Mac 系統下的安裝教學：conda、原始碼編譯與 iOS Demo
description: 整理 Mac 安裝 PyTorch 的 conda 環境、原始碼編譯、pip/conda 直接安裝，以及 iOS demo app 與 CocoaPods 設定。
date: 2023-08-07
category: 機器學習
tags: [PyTorch, Mac, Conda]
readingTime: 6 分鐘
image: /images/tech/2023-06-21_122024.webp
imageAlt: Mac 深度學習開發環境示意截圖
---
# PyTorch 於 Mac 系統下的安裝教學：conda、原始碼編譯與 iOS Demo

Mac 安裝 PyTorch 最簡單的方式是使用官方提供的 pip 或 conda 預編譯版本。只有在需要開發 PyTorch 本體、修改原始碼或測試特定功能時，才建議從 GitHub clone 原始碼並執行 \`python setup.py develop\`。

## Mac 安裝 PyTorch 前要準備什麼？

PyTorch 需要先有 Python 環境。我使用 Anaconda 建立 Python 3.8.1 虛擬環境，再進入該環境安裝或編譯 PyTorch。

建立環境指令如下：

\`\`\`bash
conda create -n aia16 python=3.8.1
conda activate aia16
\`\`\`

我參考的 PyTorch GitHub 專案是 [https://github.com/pytorch/pytorch](https://github.com/pytorch/pytorch)。如果只是要使用 PyTorch 訓練模型，不一定需要 clone 原始碼；直接安裝官方 build 通常比較省時間。

## 如何從原始碼下載 PyTorch？

從原始碼安裝 PyTorch 時，需要 clone repository 並同步 submodule。PyTorch 專案很大，下載和編譯都需要時間。

我使用的指令如下：

\`\`\`bash
git clone --recursive https://github.com/pytorch/pytorch
cd pytorch

# if you are updating an existing checkout
git submodule sync
git submodule update --init --recursive
\`\`\`

\`--recursive\` 很重要，因為 PyTorch 依賴多個子模組。若忘記拉 submodule，後續編譯很容易失敗。

## 什麼時候需要編譯 PyTorch？

只有需要開發 PyTorch 本體或修改源碼時，才需要編譯 PyTorch。一般模型開發者直接安裝預編譯版本會快很多。

\`python setup.py develop\` 是以開發模式安裝套件。這代表源碼變更能立即反映到 Python 環境，不需要每次重新安裝。但 PyTorch 是大型專案，這個過程相對慢。

編譯前先安裝工具：

\`\`\`bash
conda install cmake ninja
pip install -r requirements.txt

# Intel x86 processor machines only
conda install mkl mkl-include

# if torch.distributed is needed
conda install pkg-config libuv
\`\`\`

開始編譯：

\`\`\`bash
python3 setup.py develop
\`\`\`

## 如何直接安裝 PyTorch？

直接安裝 PyTorch 是多數使用者的建議路線。pip 或 conda 都可以安裝 PyTorch 與 torchvision。

使用 pip：

\`\`\`bash
pip install torch torchvision
\`\`\`

使用 conda：

\`\`\`bash
conda install pytorch torchvision -c pytorch
\`\`\`

正式安裝時，建議到 PyTorch 官方安裝頁選擇作業系統、套件管理器、Python 版本與硬體後，再複製最新指令。這裡保留的是我當時測試可用的簡化寫法。

## 如何下載第一個 PyTorch iOS 測試專案？

PyTorch iOS demo app 可以用來測試模型在 iOS 專案中的整合。我使用官方 iOS demo app 當作第一個測試專案。

專案連結是 [https://github.com/pytorch/ios-demo-app](https://github.com/pytorch/ios-demo-app)。

iOS 專案通常需要 CocoaPods 管理依賴。我先嘗試用 gem 安裝：

\`\`\`bash
sudo gem install cocoapods
\`\`\`

若在 macOS Monterey 或 Xcode 版本相容性上遇到問題，可以改用 Homebrew：

\`\`\`bash
brew install cocoapods
\`\`\`

接著切到有 \`Podfile\` 的目錄，執行：

\`\`\`bash
pod install
\`\`\`

這部分的資訊增益在於提醒：PyTorch 安裝完成不代表 iOS demo 也會直接跑起來，Mac 上的 Ruby、Xcode 與 CocoaPods 也可能是除錯點。

## 常見問題
### Mac 安裝 PyTorch 一定要編譯原始碼嗎？

不一定。一般使用 PyTorch 訓練模型，直接用 pip 或 conda 安裝預編譯版本即可。只有要修改 PyTorch 本體時才需要編譯。

### \`python setup.py develop\` 是什麼意思？

\`python setup.py develop\` 會以開發模式安裝套件。源碼修改後可以直接反映到環境中，適合開發套件本身。

### Mac 上可以用 conda 管理 PyTorch 環境嗎？

可以。conda 能建立獨立 Python 環境，避免不同專案的套件版本互相影響。

### CocoaPods 安裝失敗怎麼辦？

可先檢查 Ruby、Xcode command line tools 與 macOS 版本。我遇到問題時改用 \`brew install cocoapods\`。

### PyTorch iOS demo app 需要先做什麼？

先 clone 官方 iOS demo app，切到有 \`Podfile\` 的目錄，再執行 \`pod install\` 安裝 iOS 依賴。

## 參考資料
- PyTorch，〈[pytorch/pytorch](https://github.com/pytorch/pytorch)〉。
- PyTorch，〈[Get Started](https://pytorch.org/get-started/locally/)〉。
- PyTorch，〈[ios-demo-app](https://github.com/pytorch/ios-demo-app)〉。
- CocoaPods，〈[CocoaPods](https://cocoapods.org/)〉。
- Stack Overflow，〈[Unable to install CocoaPods in macOS Monterey](https://stackoverflow.com/questions/69460048/unable-to-install-cocoapods-in-macos-monterey-version-12-0-beta-xcode-13-013a)〉。

## 延伸閱讀

- [使用 Conda 管理 Python 版本與函式庫](/post/conda-python-environment-management)：同樣聚焦 Conda，可接著比較不同情境的做法。
- [Albumentations 資料增強工具教學：PyTorch 影像訓練前處理範例](/post/albumentations-image-augmentation)：同樣聚焦 PyTorch，可接著比較不同情境的做法。
- [Conda 無法安裝套件缺少 OpenSSL：CondaSSLError 解決方案](/post/conda-openssl-package-install-error)：同樣聚焦 Conda，可接著比較不同情境的做法。

## 最後更新

2026-08-28

`;export{e as default};