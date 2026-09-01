var e=`---
title: OSMF 簡介：用開源框架建置多媒體播放器
description: OSMF（Open Source Media Framework）是一套開源免費的 ActionScript 框架，用來建置多媒體播放器。本文介紹 OSMF 的插件（plug-in）架構、動態與靜態載入、宣告式設計，以及 MediaFactory 如何整合第三方功能，幫你降低播放器開發成本。
date: 2013-02-22
category: 前端開發
tags: [ActionScript3, OSMF, 多媒體播放器, 影音串流]
readingTime: 3 分鐘
image: /images/tech/hero_osmf-introduction.webp
imageAlt: OSMF 開源多媒體播放器框架概念圖
---


# OSMF 簡介：用開源框架建置多媒體播放器

OSMF（Open Source Media Framework）是一個開源且免費的 ActionScript 框架，用來建置多媒體播放器。這篇文章整理我對 OSMF 核心架構的理解：它如何透過標準化的插件（plug-in）機制，把廣告、分析、社交等功能與播放器整合，降低開發成本。

## 為什麼播放器開發需要 OSMF？

現今的播放器很多時候不止是播放器，它們可能需要連接至 CDN、呈現廣告、補捉使用者事件給伺服器分析、在使用者介面上提供社交功能等。每個功能可能都需要該方面的專業人士去專門開發，而 OSMF 就是為了解決這個狀況、降低開發成本而產生的。

在 OSMF 裡，開發人員所開發的播放器，可以透過一套標準的 API，與第三方所開發的 plug-in 功能整合。簡單來說，可能今天我的播放器想要與聊天功能整合、或由特定事件引發特定廣告，我可以用 OSMF 所提供的標準 API 去開發相關功能——第三方程式不需要關心播放器相關議題，只需透過 OSMF 所提供的 API 來做，以提高程式的重用性。

## OSMF 的核心思想：hooks 與插件載入方式

OSMF 的開發核心思想是『hooks』，每一個插件都是可被動態加載的功能，可被宣告為動態或靜態載入：

| 載入方式 | 說明 |
| --- | --- |
| 靜態載入 | 編譯時就被編譯進播放器 |
| 動態載入 | 播放時再動態載入 SWF 插件 |

Plug-ins 分成可視與非可視的元件：

- **可視元件**：可在載入 SWF 時覆蓋原本的使用者介面（例如一個暫停按鈕）。
- **非可視元件**：可將使用者操作紀錄和分析資料傳送給分析伺服器。

## 什麼是宣告式（declarative）插件？

在 OSMF 裡，plug-in 是 declarative（宣告性）的。plug-in 的功能是經由 OSMF 的 API 去做宣告，framework 只負責檢查插件的功能，然後建立插件與媒體播放器之間的關係。

plug-in 無法直接存取任何播放器的內容，而 OSMF 則是扮演著 plug-in 和 media player 之間的溝通者。這可以確保播放器和插件之間的溝通是標準化的。

## MediaFactory 扮演什麼角色？

MediaFactory 是處理 media 和 plug-in 之間溝通的角色。開發 player 的 developer 用 MediaFactory 去載入 plug-in 並產生 MediaElements。

雖然我們也可以直接創建 MediaElements，但使用 MediaFactory 產生的 MediaElements 可讓我們用載入的插件影響原來的輸出結果。

## 常見問題

### 什麼是 OSMF？

OSMF（Open Source Media Framework）是一個開源且免費的 ActionScript 框架，用來建置多媒體播放器。它透過標準化的插件 API，讓播放器能與廣告、分析、社交等第三方功能整合，降低開發成本。

### OSMF 的插件有哪些載入方式？

分為靜態載入與動態載入兩種。靜態載入是插件在編譯時就被編譯進播放器；動態載入則是播放時再動態載入 SWF 插件，讓功能可以視需要加載。

### OSMF 插件分為哪兩類元件？

分為可視與非可視元件。可視元件可在載入 SWF 時覆蓋原本的使用者介面（例如暫停按鈕）；非可視元件則負責把使用者操作紀錄與分析資料傳送給分析伺服器。

### 為什麼要用 MediaFactory 而不直接創建 MediaElements？

使用 MediaFactory 產生的 MediaElements，可以讓載入的插件影響原來的輸出結果。若直接創建 MediaElements，就少了插件介入媒體處理流程的能力。

## 參考資料

- [OSMF 官方網站（Adobe Open Source）](https://opensourcemediaframework.com/)

## 延伸閱讀

- [OSMF 學習資源整理：入門教學、官方文件與簡報清單](/post/osmf-related-resources)：同樣聚焦 OSMF、影音串流，可接著比較不同情境的做法。
- [初探OSMF的Plug-in開發](/post/osmf-plugin-development-guide)：同樣聚焦 OSMF，可接著比較不同情境的做法。
- [OSMF相關資源整理](/post/osmf-related-resources)：同樣聚焦 OSMF，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2013-02-22，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};