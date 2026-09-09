var e=`---
title: OSMF相關資源整理
description: 整理我當年學習OSMF（Open Source Media Framework）時收集的中文與英文資源：入門教學、官方開發指南、簡報投影片與自訂影音播放器教材，給需要開發Flash影音播放器的你一份快速索引。
date: 2013-01-10
category: 前端開發
tags: [OSMF, Flash, ActionScript, 影音播放器, 學習資源]
readingTime: 3 分鐘
image: /images/tech/hero_osmf-related-resources.webp
imageAlt: 手拿紙剪的播放鍵圖示，象徵影音播放器與OSMF多媒體框架
---


# OSMF相關資源整理

這篇整理了我當年在學OSMF（Open Source Media Framework，開源媒體框架）時收集的資源，涵蓋中文入門文章、官方開發指南、研討會簡報與實作教學。如果你正要踏入Flash影音播放器開發，這份清單可以當作快速索引使用。

## OSMF入門要從哪些文章開始讀？

介紹類的資源適合建立整體概念，我建議先讀中文入門，再進入官方指南：

- OSMF第一步
- Open Source Media Framework中文介紹
- [開源媒體框架（OSMF）的介紹和概況：上 [譯]](http://airfans.iteye.com/blog/763691)
- Open Source Media Framework – Plug-in Developer's Guide
- Open Source Media Framework Developer's Guide

其中Plug-in Developer's Guide和Developer's Guide是官方文件，內容最完整，往後開發時也會反覆回來查。

## 有哪些OSMF簡報值得一看？

研討會簡報的好處是有實戰脈絡，講者通常會帶實際案例：

- Almer Blank - OSMF Slides and Code from FITC SF（附程式碼）
- David Hassoun - 360 Flex Going Deep with OSMF
- OSMF Presentation（官方簡報，附講者備註）

## 想動手做播放器，有哪些教學？

- [DZone - Open Source Media Framework Building Simple Custom Video Players](http://refcardz.dzone.com/refcardz/getting-started-web-video)：Refcardz速查卡，從零做出一個簡單的自訂影音播放器，很適合第一次實作。
- ADC - Tag Search - OSMF：Adobe開發者中心以OSMF為關鍵字的文章索引，可以照主題挖更多教學。

## 常見問題

### OSMF是什麼？

OSMF（Open Source Media Framework）是Adobe釋出的開源媒體框架，用ActionScript 3撰寫，讓開發者快速建構Flash影音播放器，並透過Plug-in機制擴充播放行為。

### 學OSMF需要什麼背景？

需要熟悉ActionScript 3與Flash平台的基本開發方式。若已有Flex或Flash Builder經驗，上手會更快。

### 現在還適合學OSMF嗎？

Flash平台已停止支援，OSMF屬於歷史技術。但它的媒體播放架構設計（MediaElement、Plug-in、Trait）仍有參考價值，理解後學習MSE、HLS.js等現代方案會更有概念。

### 這份清單的連結失效了怎麼辦？

部分連結年代久遠可能已失效，可嘗試用Wayback Machine（web.archive.org）查詢原始頁面存檔。

## 參考資料

- OSMF官方網站
- Open Source Media Framework Developer's Guide
- Open Source Media Framework – Plug-in Developer's Guide（PDF）

## 延伸閱讀

- [OSMF 學習資源整理：入門教學、官方文件與簡報清單](/post/osmf-related-resources)：同樣聚焦 OSMF、Flash，可接著比較不同情境的做法。
- [初探OSMF的Plug-in開發](/post/osmf-plugin-development-guide)：同樣聚焦 ActionScript、OSMF，可接著比較不同情境的做法。
- [OSMF 簡介：用開源框架建置多媒體播放器](/post/osmf-introduction)：同樣聚焦 OSMF，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2013-01-10，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};