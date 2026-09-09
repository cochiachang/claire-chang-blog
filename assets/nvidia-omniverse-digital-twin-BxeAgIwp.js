var e=`---
title: NVIDIA Omniverse 數位孿生：從 OpenUSD 到工廠模擬的實作筆記
description: 記錄 NVIDIA Omniverse 工作坊重點，說明 OpenUSD 架構、專案資料夾規劃與工廠數位孿生的建置方式。
date: 2025-05-21
category: AI趨勢
tags: [NVIDIA Omniverse, OpenUSD, 數位孿生, Physical AI, 智慧製造]
readingTime: 7 分鐘
image: /images/tech/hero_nvidia-omniverse-digital-twin.webp
imageAlt: 工廠產線上的藍色工業機械手臂，象徵數位孿生所模擬的實體製造現場
---


# NVIDIA Omniverse 數位孿生：從 OpenUSD 到工廠模擬的實作筆記

這篇是參加 NVIDIA 的 [Building Digital Twins for Physical AI With NVIDIA Omniverse](https://www.nvidia.com/en-tw/gtc/workshops-and-training) 工作坊後整理的筆記，重點放在 Omniverse 專案怎麼組織資料夾、OpenUSD 解決了什麼問題，以及實際搭建工廠數位孿生時要注意的細節。

## NVIDIA Omniverse 是什麼？

NVIDIA Omniverse 是建立在 OpenUSD 之上的開發平台，目的是把實體世界的資料和應用程式整合在同一個環境裡。它本身是一組 API 與 SDK 的集合，讓開發者能打造用於複雜 3D 工作流程、工業數位化的應用——這次工作坊操作的方向正是這個。想直接下載相關工具，可以到 [NVIDIA Omniverse 開發者頁面](https://developer.nvidia.com/omniverse)找對應套件。

## OpenUSD 在數位孿生裡扮演什麼角色？

OpenUSD（Universal Scene Description）是 Pixar 動畫工作室開發的開放 3D 場景描述格式，最初是為了讓不同軟體工具之間能交換資產、簡化內容製作流程。隨著工業數位化需求增加，OpenUSD 逐漸變成產業互通的核心標準之一，而不只是動畫產業內部的格式。

對開發團隊來說，採用 OpenUSD 帶來幾個實際好處：

- 統一且可擴充的開放架構，方便不同工具與流程串接
- 非破壞性編輯，原始資產不會被覆寫
- 不綁定特定檔案系統，可跨平台搬移
- 支援自訂渲染與模組化工作流程
- 能撐住大型、多團隊協作的虛擬世界專案

## Omniverse 專案的資料夾應該怎麼規劃？

Omniverse 的專案結構會直接影響後續資產能不能正確被組合與參照，一旦專案跑起來後才調整資料夾，很容易造成參照失效。實務上會先按用途分成幾層：

**Library（資料庫）** 存放具唯一性、可重複使用的資產，也叫「目錄資產」。當這些資產被放進數位孿生並指派唯一 ID 後，才升級成「庫存資產」。Library 底下再細分：

| 子資料夾 | 存放內容 |
|---|---|
| Materials | 專案使用的所有材質檔案 |
| Assets | 機械設備、機器人等實體資產，對應 OpenUSD 裡具名稱、版本、可組合的資產容器 |
| Entourage | HDRI 背景圖、道具幾何等輔助資源，不是真實物件的孿生，但能提升場景真實感 |

**Factory（工廠）** 放工廠建築本體、照明設計，以及其他跟廠房相關的幾何與資料。

**Assemblies（組合）** 把多個資產群組成一個組合，方便獨立開發與管理。建議做法是每個組合檔案依製程分開存放（例如 SMT 一個檔案、ICT 另一個檔案），並設定正確的座標與方向，避免場景越大越難維護。

**ProdLines（生產線）** 存放實際的生產線組合，特別是機台配置。每台機器裝進產線後要指派唯一 ID；如果有多條相同類型的產線，也要分別命名。每條產線以座標 (0, 0) 為起點，沿 x 正方向往後排列流程。

**World File（世界場景檔）** 是整個專案的核心舞台，用來把上面所有資源整合在一起。

## 為什麼要先規劃好資料夾結構再開始建置？

因為 Omniverse 的資產是透過參照（reference）方式組合進場景的，資料夾一旦搬動或改名，原本指向這些路徑的參照就會斷掉，輕則貼圖遺失，重則整條產線的組合關係跑掉。與其事後修參照，不如在專案啟動前先把 Library、Factory、Assemblies、ProdLines、World File 的層級定下來。

## Viewport 該怎麼調整才看得清楚場景？

工作坊裡實際操作時，有兩個 viewport 設定值得先調整：

1. **切換即時渲染模式**：視窗上方預設是「RTX - Real Time」，改選「RTX - Real-Time 2.0 (Preview)」，場景會更明亮、細節也更清楚。
2. **隱藏干擾元素**：透過 \`Show > Show by Type\`，取消勾選 Cameras、Lights 等項目，讓畫面只保留真正要檢視的模型，方便對照資產擺放是否正確。

## 常見問題

### Omniverse 一定要搭配 OpenUSD 才能用嗎？

Omniverse 的核心工作流程就是建立在 OpenUSD 之上，資產組合、參照、非破壞性編輯這些特性都依賴 OpenUSD 的場景描述機制，因此實務上兩者是綁在一起使用的。

### 數位孿生跟一般 3D 模型有什麼差別？

數位孿生強調的是資產與唯一 ID 的對應關係——每台機器、每條產線都要能追溯回實體世界的具體設備，而不只是視覺上相似的 3D 模型。這也是為什麼 Library 資產要先被放進場景、指派 ID 後才算「庫存資產」。

### 這套資料夾結構適合小型專案嗎？

即使是小型專案，先把 Library、Assemblies、ProdLines 分開規劃，仍然能避免後續資產搬動導致參照失效。專案規模變大時，這套結構能少走很多重工的路。

## 參考資料
- NVIDIA, GTC Workshops and Training, https://www.nvidia.com/en-tw/gtc/workshops-and-training，存取日期：2026-08-27。
- NVIDIA Developer, Omniverse, https://developer.nvidia.com/omniverse，存取日期：2026-08-27。

## 延伸閱讀

- [Mixamo：你的3D角色動畫工廠](/post/mixamo-3d-character-animation)：同屬「AI趨勢」主題，可延伸理解相近問題的判斷方式。
- [工廠關鍵知識都在老師傅腦中，AI 要怎麼協助傳承？](/post/factory-knowledge-transfer)：同樣聚焦 智慧製造，可接著比較不同情境的做法。
- [AI 現況概觀：人工智慧如何改變產業、職能與技術架構](/post/ai-current-state-overview)：同屬「AI趨勢」主題，可延伸理解相近問題的判斷方式。
`;export{e as default};