var e=`---
title: Prometheus 簡介：監控系統與時序資料庫的核心特性與架構
description: 介紹 Prometheus 的起源與四大特性：多維度數據模型、方便部署維護、靈活數據採集與強大查詢語言，並用架構圖說明 Prometheus server、Pushgateway、Alertmanager 等核心組件。
date: 2022-12-16
category: DevOps
tags: [Prometheus, 監控, 時序資料庫, Exporter]
readingTime: 4 分鐘
image: /images/tech/hero_prometheus-introduction.webp
imageAlt: Prometheus 監控系統架構與組件示意圖
---


# Prometheus 簡介：監控系統與時序資料庫的核心特性與架構

這篇文章要回答的問題是：Prometheus 是什麼、它為什麼會誕生、又具備哪些核心特性？我從 SoundCloud 的官方博客出發，整理 Prometheus 的四大特性、Pull 採集模式與整體架構組件，幫助你快速建立對這套監控系統的全貌理解。

## Prometheus 為什麼會被開發出來？

我們在 SoundCloud 的官方博客中可以找到一篇關於他們為什麼需要新開發一個監控系統的文章：[Monitoring at SoundCloud](https://developers.soundcloud.com/blog/prometheus-monitoring-at-soundcloud)。在這篇文章中，他們介紹到他們需要的監控系統必須滿足下面四個特性：

- 多維度數據模型
- 方便的部署和維護
- 靈活的數據採集
- 強大的查詢語言

## Prometheus 為什麼不直接用現有的時序資料庫？

實際上，多維度數據模型和強大的查詢語言這兩個特性，正是時序數據庫所要求的，所以 Prometheus 不僅僅是一個監控系統，同時也是一個時序數據庫。

那為什麼 Prometheus 不直接使用現有的時序數據庫作為後端存儲呢？這是因為 SoundCloud 不僅希望他們的監控系統有著時序數據庫的特點，而且還需要部署和維護非常方便。

## Prometheus 怎麼採集監控資料？

Prometheus 數據採集方式也非常靈活。要採集目標的監控數據，首先需要在目標處安裝數據採集組件，這被稱之為 Exporter。它會在目標處收集監控數據，並暴露出一個 HTTP 接口供 Prometheus 查詢；Prometheus 通過 Pull 的方式來採集數據，這和傳統的 Push 模式不同。

不過 Prometheus 也提供了一種方式來支持 Push 模式：你可以將你的數據推送到 Push Gateway，Prometheus 再通過 Pull 的方式從 Push Gateway 獲取數據。

目前的 Exporter 已經可以採集絕大多數的第三方數據，比如 Docker、HAProxy、StatsD、JMX 等等，官網有一份完整的 Exporter 列表可以查詢。

## Prometheus 的整體架構圖長什麼樣？

![Prometheus 整體架構圖，包含 Prometheus server、Pushgateway、Alertmanager 與 Web UI 等組件](/images/articles/prometheus-introduction-1.webp)

從上圖可以看出，Prometheus 生態系統包含了幾個關鍵的組件：Prometheus server、Pushgateway、Alertmanager、Web UI 等，但是大多數組件都不是必需的。

其中最核心的組件當然是 Prometheus server，它負責收集和存儲指標數據，支持表達式查詢，和告警的生成。

## 常見問題

### Prometheus 是監控系統還是時序資料庫？

兩者都是。它的多維度數據模型與強大查詢語言正是時序資料庫的特性，所以 Prometheus 同時具備監控與時序資料庫的能力，只是為了部署方便而選擇自建存儲而非依賴現有資料庫。

### Prometheus 用 Pull 還是 Push 模式採集資料？

預設是 Pull 模式：Prometheus 主動向各目標的 Exporter HTTP 端點抓取指標。若目標是短生命週期的批處理作業，可以改用 Pushgateway 先收資料，Prometheus 再從 Pushgateway Pull。

### Exporter 的作用是什麼？

Exporter 安裝在要監控的目標上，負責收集該目標的監控數據並以 HTTP 接口暴露，供 Prometheus 定期抓取。官方已有 Docker、HAProxy、StatsD、JMX 等大量現成 Exporter。

## 參考資料

- [Prometheus: Monitoring at SoundCloud — SoundCloud 開發者博客](https://developers.soundcloud.com/blog/prometheus-monitoring-at-soundcloud)

## 延伸閱讀

- [Prometheus json_exporter 設定教學：把 JSON API 轉成監控指標](/post/prometheus-json-exporter)：同樣聚焦 Prometheus、Exporter，可接著比較不同情境的做法。
- [Prometheus Operator 是什麼？Kubernetes 監控的自動化利器](/post/prometheus-operator)：同樣聚焦 Prometheus、監控，可接著比較不同情境的做法。
- [Prometheus Exporter 是什麼：資料格式、Targets 與 PromQL 查詢](/post/prometheus-exporter-metrics)：同樣聚焦 Prometheus、Exporter，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2022-12-16，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};