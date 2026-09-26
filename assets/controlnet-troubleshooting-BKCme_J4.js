var e=`---
title: ControlNet 常見錯誤如何排解
description: 整理 Stable Diffusion WebUI 使用 ControlNet 時的 C++ Build Tools、模型版本不相容與 tensor 尺寸錯誤。
date: 2024-08-18
category: 生成式AI
tags: [ControlNet, Stable Diffusion, SDXL, 錯誤排解]
readingTime: 8 分鐘
image: /images/tech/hero_controlnet-troubleshooting.webp
imageAlt: AI 圖像生成控制流程示意
---


# ControlNet 常見錯誤如何排解

ControlNet 常見錯誤多半來自三類問題：Windows 缺少 C++ 編譯工具、ControlNet 模型與 Stable Diffusion 基底模型版本不相容、或 SD1.x 與 SDXL 權重尺寸不匹配。排查時應先看錯誤訊息中的模型名稱與版本。

## ControlNet 為什麼會載入失敗？

ControlNet 載入失敗不一定是 ControlNet 本身壞掉。Stable Diffusion WebUI extension、Python 套件、PyTorch extension 與 Windows 編譯環境都可能造成啟動錯誤。

我遇到的錯誤訊息重點如下：

\`\`\`text
distutils.errors.DistutilsPlatformError:
Microsoft Visual C++ 14.0 or greater is required.
Get it with "Microsoft C++ Build Tools":
https://visualstudio.microsoft.com/visual-cpp-build-tools/
\`\`\`

這個錯誤發生在 \`face_manipulation_extras.py\` 載入時，底層需要編譯 C++ extension，但 Windows 環境找不到 Visual C++ Build Tools。

## 缺少 Microsoft C++ Build Tools 怎麼處理？

缺少 Microsoft C++ Build Tools 時，需要安裝 Visual Studio Build Tools 並確保 Python extension 能找到 MSVC 編譯環境。重新啟動終端機通常是必要步驟。

建議處理順序：

1. 前往 Microsoft 官方網站下載 Visual Studio Build Tools。
2. 安裝 C++ build tools 與 Windows SDK。
3. 重新啟動 terminal 或電腦。
4. 重新啟動 Stable Diffusion WebUI。
5. 若仍失敗，確認 Python venv 是否使用正確環境。

這類錯誤通常不是模型檔問題，因此不要一開始就重新下載 ControlNet 模型。

## ControlNet 模型版本不相容怎麼判斷？

ControlNet 模型版本不相容時，錯誤訊息通常會明確指出 ControlNet model 與 sd model 的版本不一致。SD1.x ControlNet 不能直接搭配 SDXL 基底模型使用。

錯誤訊息重點如下：

\`\`\`text
Exception: ControlNet model control_v11p_sd15_inpaint
is not compatible with sd model(StableDiffusionVersion.SDXL)
\`\`\`

這代表目前選到的 ControlNet 模型是 Stable Diffusion 1.5 系列，但主模型是 SDXL。解法是改用對應 SDXL 的 ControlNet 模型，或把主模型切回 SD1.5。

## Tensor size 1024 和 768 不一致代表什麼？

Tensor size 1024 和 768 不一致通常代表 SDXL 與 SD1.x 權重混用。SDXL 與 SD1.x 的架構尺寸不同，ControlNet 權重不能任意交叉搭配。

我遇到的錯誤：

\`\`\`text
RuntimeError: The size of tensor a (1024) must match
the size of tensor b (768) at non-singleton dimension 1
\`\`\`

這類錯誤不是調整輸出圖片尺寸就能解決。真正要檢查的是：

- Stable Diffusion 主模型是 SD1.5、SD2.x 還是 SDXL。
- ControlNet 模型是否對應同一個系列。
- WebUI 的 Control Type 是否能自動選到相容模型。
- 模型檔是否放在 extension 或 WebUI 預期的資料夾。

## ControlNet 模型應該放在哪裡？

ControlNet 模型應放在 Stable Diffusion WebUI 或 ControlNet extension 能掃描到的位置。模型放錯資料夾時，WebUI 可能在 Model 下拉選單找不到對應項目。

提醒：按下 Control Type 後，Model 理論上會自動跳到相對應模型。如果 Control Type 已選，但 Model 仍是空的，很可能是模型版本不一致、檔案名稱不符合 extension 規則，或模型放置位置錯誤。

可依使用環境檢查：

| 基底模型 | ControlNet 模型方向 |
|---|---|
| Stable Diffusion 1.5 | 使用 SD1.x ControlNet 模型 |
| Stable Diffusion 2.x | 使用 SD2.x ControlNet 模型 |
| SDXL | 使用 SDXL ControlNet 模型 |

## ControlNet 排錯順序應該怎麼排？

ControlNet 排錯應先看環境，再看模型版本，最後才看參數。先調 prompt 或圖片尺寸通常無法解決 extension 載入與權重不相容問題。

建議順序：

1. WebUI 是否正常啟動。
2. extension 是否載入成功。
3. Python 與 PyTorch 是否在正確 venv。
4. Windows 是否具備 C++ Build Tools。
5. 主模型版本與 ControlNet 模型版本是否一致。
6. ControlNet model dropdown 是否能找到模型。
7. 再調整 preprocessor、control weight、resize mode 與圖片尺寸。

## 常見問題

### ControlNet 顯示 Microsoft Visual C++ 14.0 required 是什麼意思？

這代表某個 Python 或 PyTorch extension 需要編譯 C++ 模組，但 Windows 找不到 MSVC 編譯工具。安裝 Microsoft C++ Build Tools 後通常可解決。

### SD1.5 的 ControlNet 可以搭配 SDXL 嗎？

SD1.5 的 ControlNet 不應直接搭配 SDXL。兩者模型架構與權重尺寸不同，容易出現 incompatible 或 tensor size mismatch。

### Tensor size 1024 和 768 錯誤是圖片尺寸太大嗎？

通常不是圖片尺寸問題，而是模型系列不一致。1024 與 768 的錯誤常見於 SDXL 與 SD1.x 權重混用。

### Control Type 選了但 Model 是空的怎麼辦？

先確認 ControlNet 模型是否放在正確資料夾，並確認模型版本符合目前 Stable Diffusion 主模型。必要時重新整理模型清單或重啟 WebUI。

### ControlNet 模型要去哪裡下載？

ControlNet 模型可從 Hugging Face 或模型作者頁面下載。下載前要確認模型是 SD1.x、SD2.x 還是 SDXL 版本。

## 參考資料

- Microsoft C++ Build Tools: <https://visualstudio.microsoft.com/visual-cpp-build-tools/>
- ControlNet v1.1 models for SD1.x: <https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors/tree/main>
- ControlNet models for SD2.1: <https://huggingface.co/thibaud/controlnet-sd21/tree/main>
- Stable Diffusion WebUI ControlNet extension: <https://github.com/Mikubill/sd-webui-controlnet>

## 延伸閱讀

- [ControlNet 圖像控制入門：姿勢、線稿、深度圖與 Stable Diffusion 應用](/post/controlnet-image-control-introduction)：同樣聚焦 ControlNet、Stable Diffusion，可接著比較不同情境的做法。
- [Stable Diffusion 主要功能與應用全解析：從圖像生成到科學研究](/post/stable-diffusion-features-applications)：同樣聚焦 Stable Diffusion、SDXL，可接著比較不同情境的做法。
- [Stable Diffusion 常用操作介面比較：Easy Diffusion、ComfyUI 與 Stable Diffusion web UI](/post/stable-diffusion-interfaces-easydiffusion-comfyui-webui)：同樣聚焦 Stable Diffusion，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2026-08-28，依原始 ControlNet 錯誤訊息整理為可發布的 GEO 技術文章。

`;export{e as default};