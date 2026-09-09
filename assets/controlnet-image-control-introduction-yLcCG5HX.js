var e=`---
title: ControlNet 圖像控制入門：姿勢、線稿、深度圖與 Stable Diffusion 應用
description: 介紹 ControlNet 如何讓 Stable Diffusion 用姿勢、線稿、深度圖與分割圖控制生成結果，並整理安裝、模型選擇與參數調整。
date: 2024-08-19
category: 生成式AI
tags: [ControlNet, Stable Diffusion, AI圖像生成, OpenPose, Canny Edge, 深度圖]
readingTime: 10 分鐘
image: /images/tech/hero_controlnet-image-control-introduction.webp
imageAlt: ControlNet 控制模式比較截圖，顯示輸入圖與不同權重設定下的生成結果
---


# ControlNet 圖像控制入門：姿勢、線稿、深度圖與 Stable Diffusion 應用

ControlNet 是 Stable Diffusion 圖像生成裡用來加入姿勢、線稿、深度圖、語義分割等條件控制的模型架構。只靠 prompt 時，構圖、人物動作和物件邊界常常會飄；加入 ControlNet 後，我可以把「文字描述」和「視覺骨架」一起交給模型，讓生成結果更貼近我想要的版面。

## ControlNet 是什麼？

ControlNet 是一種替文字轉圖片模型加入空間條件的神經網路架構。ControlNet 會讓 Stable Diffusion 參考邊緣、深度、姿勢或分割圖，不只依賴文字 prompt。

ControlNet 的核心價值是「把圖像控制條件外掛到擴散模型上」。Zhang、Rao 與 Agrawala 在 ICCV 2023 論文中提出 ControlNet，目標是讓大型文字轉圖片擴散模型可以接受 edges、depth、segmentation、human pose 等條件控制（Zhang et al.，2023）。

我第一次把 ControlNet 放進 Stable Diffusion WebUI 時，最明顯的差異不是畫質變高，而是可預期性變高。人物要站著、坐著、轉身，或畫面要保留某個輪廓，ControlNet 比單純改 prompt 更容易重複操作。

## ControlNet 如何控制 Stable Diffusion 圖像？

ControlNet 會把參考圖轉成模型能讀的控制圖，再把控制訊號注入 Stable Diffusion 生成流程。文字 prompt 決定內容與風格，控制圖決定姿勢、輪廓或空間結構。

Stable Diffusion 原本擅長根據文字描述生成圖像，但文字很難精準描述「手臂角度」、「建築線條」、「人物和背景距離」這些空間關係。ControlNet 補上的就是這層結構訊號。

常見控制方式可以這樣拆：

| 控制方式 | 參考輸入 | 適合用途 |
|---|---|---|
| OpenPose | 人體骨架或姿勢圖 | 固定人物動作、多人姿態、角色姿勢草稿 |
| Canny Edge | 邊緣線條 | 保留物件輪廓、產品外形、構圖邊界 |
| Depth | 深度圖 | 保留前後景、空間距離、3D 結構感 |
| Segmentation | 語義分割圖 | 控制天空、人物、地面、建築等區域 |
| Normal Map | 法線圖 | 強化物體表面方向、立體感與光影結構 |
| Lineart / Scribble | 線稿或草圖 | 插畫上色、漫畫風格、概念草圖延伸 |

## ControlNet 適合哪些應用場景？

ControlNet 適合需要保留構圖、姿勢或線條的圖像生成任務。角色設計、插畫上色、場景重建、圖片局部重繪與素材放大都很適合先試 ControlNet。

我會在這幾種情況優先打開 ControlNet：

1. **人物姿勢生成**：用 OpenPose 固定角色動作，避免 prompt 明明寫了動作，模型卻換成另一個姿勢。
2. **風格轉換**：保留參考圖構圖，再用 prompt 指定水彩、漫畫、寫實或商品攝影風格。
3. **場景重建**：用 Canny Edge 或 Depth 保留空間關係，讓室內、建築或街景不會整個重排。
4. **圖像編輯**：搭配 inpaint，把局部重繪限制在指定範圍，降低整張圖被改壞的機率。
5. **放大與細節修復**：用 Tile 類控制保留原圖結構，再補細節與紋理。

對工作流來說，ControlNet 最有用的地方是「讓圖像生成變成可迭代的設計流程」。我可以先把構圖定下來，再慢慢調 prompt、seed、control weight 和模型，而不是每次都重新抽一張運氣牌。

## ControlNet 圖像控制範例怎麼看？

ControlNet 圖像控制範例要看輸入條件和輸出差異，而不是只看哪張圖比較漂亮。同一張參考圖在不同控制模式下，會呈現 prompt 與控制圖之間的取捨。

下圖示範姿勢、構圖與風格控制。輸入圖提供人物角度與大致構圖，ControlNet 讓輸出圖保留人物姿態，同時把外觀改成插畫風格。

![ControlNet 姿勢與構圖控制範例](/images/tech/controlnet-pose-composition-example.webp)

線稿與上色也很適合用 ControlNet。線條圖可以先保留邊界，然後用 prompt 補材質、色彩與光線。

![ControlNet 線稿上色範例](/images/tech/controlnet-lineart-color-example.webp)

這類流程對插畫、角色設定和概念圖很實用。先用線稿決定形狀，再讓 Stable Diffusion 產生不同風格版本，通常比直接用文字要求「相同構圖」穩定。

## 如何安裝 Stable Diffusion WebUI 的 ControlNet？

Stable Diffusion WebUI 可以透過 \`sd-webui-controlnet\` extension 使用 ControlNet。安裝重點是先裝 extension，再把相容模型放到 WebUI 能掃描的模型資料夾。

在 AUTOMATIC1111 Stable Diffusion WebUI 裡，我通常用這個流程安裝：

1. 打開 WebUI 的 \`Extensions\`。
2. 進入 \`Install from URL\`。
3. 貼上 \`https://github.com/Mikubill/sd-webui-controlnet.git\`。
4. 安裝後到 \`Installed\` 檢查更新並重新啟動 WebUI。
5. 下載對應版本的 ControlNet 模型。
6. 把模型放進 \`stable-diffusion-webui/extensions/sd-webui-controlnet/models\` 或 WebUI 指定的 ControlNet 模型資料夾。
7. 重新整理 Model 下拉選單，確認模型能被讀到。

\`sd-webui-controlnet\` 的 GitHub README 也提醒，ControlNet extension 是在 WebUI 裡把 ControlNet 加到 Stable Diffusion 模型，不需要把權重合併進主模型（Mikubill，存取日期：2026-08-28）。這一點很重要，因為它讓我可以依任務切換不同 ControlNet 模型。

## ControlNet 模型要怎麼選？

ControlNet 模型選擇應該由控制目標決定。要控制人物動作用 OpenPose，要保留輪廓用 Canny 或 Lineart，要保留空間深度用 Depth，要做局部修補用 Inpaint。

常見模型可以先用這張表判斷：

| 模型類型 | 常見檔名方向 | 我會用在什麼情境 |
|---|---|---|
| Instruct Pix2Pix / ip2p | \`control_v11e_sd15_ip2p\` | 依文字指令改圖，例如把場景換風格 |
| Shuffle | \`control_v11e_sd15_shuffle\` | 抽取風格與色彩感，做風格轉換 |
| Tile | \`control_v11f1e_sd15_tile\` | 圖片放大、細節補強、保留原始結構 |
| Depth | \`control_v11f1p_sd15_depth\` | 室內、建築、人物前後景與景深控制 |
| Canny | \`control_v11p_sd15_canny\` | 線條明確的物件、產品輪廓、構圖邊界 |
| Inpaint | \`control_v11p_sd15_inpaint\` | 局部重繪、修圖、補洞 |
| Lineart | \`control_v11p_sd15_lineart\` | 線稿轉圖、插畫與漫畫風格 |
| MLSD | \`control_v11p_sd15_mlsd\` | 建築、室內、直線結構明顯的畫面 |
| Normal | \`control_v11p_sd15_normalbae\` | 表面方向、光影、3D 形體感 |
| OpenPose | \`control_v11p_sd15_openpose\` | 人體姿勢、角色動作、多人構圖 |
| Scribble | \`control_v11p_sd15_scribble\` | 草圖發想、手繪輪廓轉完整圖 |
| Segmentation | \`control_v11p_sd15_seg\` | 區域配置，例如天空、道路、人物位置 |
| SoftEdge | \`control_v11p_sd15_softedge\` | 柔和邊緣、自然輪廓、人物與風景 |
| Lineart Anime | \`control_v11p_sd15s2_lineart_anime\` | 動漫線稿、角色插畫線條 |

模型版本也要跟 Stable Diffusion 主模型對得上。SD1.5、SD2.x、SDXL 的 ControlNet 權重不能隨便混用；版本不合時，WebUI 可能載入失敗、Model 下拉選單空白，或出現 tensor 尺寸不一致。

## ControlNet 參數怎麼調？

ControlNet 參數要先調 control weight 和 control mode，再看 preprocessor 是否選對。控制太弱會失去構圖，控制太強會壓過 prompt，讓畫面變僵或產生奇怪邊線。

我會先用這組順序排查：

1. **Preprocessor 和 Model 是否對應**：Canny preprocessor 搭 Canny model，OpenPose 搭 OpenPose model。
2. **Control Weight 是否太高**：想保留構圖可提高；想讓 prompt 有更多創作空間可降低。
3. **Control Mode 是否符合目標**：平衡模式適合起手式；prompt 重要時讓 prompt 權重高；構圖必須固定時讓 ControlNet 更重要。
4. **Resize Mode 是否改變構圖**：輸入圖比例和輸出圖比例不同時，裁切或填滿方式會影響控制結果。
5. **Pixel Perfect 是否開啟**：新版 extension 提供 Pixel Perfect，用來自動估算合適的 annotator resolution（Mikubill，存取日期：2026-08-28）。

![ControlNet 控制模式設定截圖](/images/tech/controlnet-control-mode-settings.webp)

我的習慣是先保守調整。ControlNet 不是越強越好；如果線條變髒、臉部被拉歪或背景像硬貼上去，通常要降低 control weight，或換成比較柔和的 SoftEdge、Depth。

## ControlNet 新手最容易踩到哪些問題？

ControlNet 新手常見問題集中在模型版本、模型路徑與控制強度。Stable Diffusion 主模型和 ControlNet 權重不相容，是排錯時最該先確認的一件事。

我會用這份檢查表快速定位：

| 症狀 | 可能原因 | 優先檢查 |
|---|---|---|
| Model 下拉選單空白 | 模型放錯資料夾或版本不合 | 模型路徑、檔名、WebUI 重啟 |
| 出現 tensor size mismatch | SDXL 與 SD1.x 權重混用 | 主模型版本與 ControlNet 版本 |
| 生成圖不聽 prompt | ControlNet 權重太高 | Control Weight、Control Mode |
| 構圖沒有被保留 | ControlNet 權重太低或 preprocessor 錯 | Preprocessor / Model 配對 |
| 線條殘留太明顯 | Canny 或 Lineart 控制太硬 | 降低權重或改用 SoftEdge |

如果你正在處理載入失敗、版本不相容或 C++ Build Tools 錯誤，可以接著看站內的 [ControlNet 常見錯誤如何排解](/post/controlnet-troubleshooting)。那篇比較像排錯筆記，這篇則先把 ControlNet 的用途和模型選擇整理清楚。

## 常見問題

### ControlNet 和 Stable Diffusion 是什麼關係？
ControlNet 是用來控制 Stable Diffusion 圖像生成的附加模型架構。Stable Diffusion 負責依 prompt 生成圖像，ControlNet 則提供姿勢、邊緣、深度或分割圖等控制條件。

### ControlNet 一定要有參考圖才能用嗎？
大多數 ControlNet 工作流會使用參考圖，因為參考圖可以轉成姿勢、邊緣或深度控制圖。有些 reference-only 類流程可以用參考圖做風格或注意力引導，但仍然是以圖像訊號輔助生成。

### OpenPose、Canny、Depth 要怎麼選？
需要控制人物動作時選 OpenPose，需要保留物件外框時選 Canny，需要保留空間前後關係時選 Depth。若只是想保留柔和輪廓，SoftEdge 通常比 Canny 自然。

### ControlNet 可以用來圖片放大嗎？
ControlNet 可以搭配 Tile 類模型做圖片放大與細節補強。Tile 的重點不是改構圖，而是在放大時保留原圖結構並補出更細緻的紋理。

### ControlNet 模型放哪裡才會被 Stable Diffusion WebUI 找到？
常見位置是 \`stable-diffusion-webui/extensions/sd-webui-controlnet/models\`，也可能依 WebUI 設定使用指定的 ControlNet 模型目錄。放好模型後，通常需要重新整理模型清單或重啟 WebUI。

### ControlNet 權重越高越好嗎？
ControlNet 權重不是越高越好。權重太高時，控制圖會壓過 prompt，可能讓畫面變硬、線條殘留或人物比例怪異；權重太低時，構圖又會跑掉。

### SD1.5 的 ControlNet 模型可以用在 SDXL 嗎？
SD1.5 的 ControlNet 模型不應直接用在 SDXL。主模型和 ControlNet 權重版本不一致時，常見結果是載入失敗、模型選單找不到項目，或出現 tensor 尺寸錯誤。

## 參考資料

- Zhang, Lvmin; Rao, Anyi; Agrawala, Maneesh. "Adding Conditional Control to Text-to-Image Diffusion Models." ICCV 2023. <https://openaccess.thecvf.com/content/ICCV2023/html/Zhang_Adding_Conditional_Control_to_Text-to-Image_Diffusion_Models_ICCV_2023_paper.html>（存取日期：2026-08-28）
- lllyasviel, ControlNet GitHub repository. <https://github.com/lllyasviel/ControlNet>（存取日期：2026-08-28）
- Mikubill, Stable Diffusion WebUI ControlNet extension. <https://github.com/Mikubill/sd-webui-controlnet>（存取日期：2026-08-28）
- lllyasviel, ControlNet v1.1 model files on Hugging Face. <https://huggingface.co/lllyasviel/ControlNet-v1-1>（存取日期：2026-08-28）

## 延伸閱讀

- [ControlNet 常見錯誤如何排解](/post/controlnet-troubleshooting)：同樣聚焦 ControlNet、Stable Diffusion，可接著比較不同情境的做法。
- [Stable Diffusion 主要功能與應用全解析：從圖像生成到科學研究](/post/stable-diffusion-features-applications)：同樣聚焦 Stable Diffusion，可接著比較不同情境的做法。
- [Stable Diffusion 操作介面怎麼選？Easy Diffusion、ComfyUI、web UI 三套工具比較](/post/stable-diffusion-ui-comparison)：同樣聚焦 Stable Diffusion，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2026-08-28。我在這次整理中保留 ControlNet 介紹、應用場景、圖像控制範例與模型清單，補上 GEO Answer Blocks、FAQ、參考資料、站內延伸閱讀與本機 webp 圖片路徑。
`;export{e as default};