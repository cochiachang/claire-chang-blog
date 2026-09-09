var e=`---
title: Prometheus Operator 是什麼？Kubernetes 監控的自動化利器
description: 介紹 Prometheus Operator 的功能與優點：用 Kubernetes 自定義資源（Prometheus、ServiceMonitor、PrometheusRule、Alertmanager）自動化管理監控配置，隨 Pod 增減動態發現監控目標。
date: 2022-12-16
category: DevOps
tags: [Prometheus, Prometheus Operator, Kubernetes, 監控]
readingTime: 4 分鐘
image: /images/tech/hero_prometheus-operator.webp
imageAlt: Prometheus Operator 與 Kubernetes 自定義資源架構示意圖
---


# Prometheus Operator 是什麼？Kubernetes 監控的自動化利器

這篇文章回答的問題是：Prometheus Operator 解決了什麼痛點、它提供哪些 Kubernetes 自定義資源、以及它的架構如何運作。看完可以理解為什麼在 Kubernetes 上管理 Prometheus 監控堆疊，用 Operator 比手動設定更省力。

## Prometheus Operator 是什麼？

官方網站：<https://prometheus-operator.dev/>

Prometheus Operator 提供 Kubernetes 原生部署和管理 Prometheus 及相關監控組件。該項目的目的是為 Kubernetes 集群簡化和自動化基於 Prometheus 的監控堆棧的配置。

Prometheus 算子包括但不限於以下特性：

- **Kubernetes 自定義資源**：使用 Kubernetes 自定義資源部署和管理 Prometheus、Alertmanager 及相關組件。
- **簡化的部署配置**：配置 Prometheus 的基礎知識，例如版本、持久性、保留策略和本地 Kubernetes 資源的副本。
- **Prometheus Target Configuration**：根據熟悉的 Kubernetes 標籤查詢，自動生成監控目標配置；無需學習 Prometheus 特定的配置語言。

## 為什麼需要 Prometheus Operator？

下面是一個最原始的 Prometheus 的設定範例，若是這樣設定，每一個監控目標都需要手動設定，當 Pod 自動增加/減少時，會需要有人幫忙更改監控對象，所以 Prometheus Operator 就出現了。

![原始 Prometheus 監控目標需逐一手動設定的範例截圖](/images/articles/prometheus-operator-1.webp)

它的主要功能是去做 Services Discovery。例如我們可以用 Deployment 去管理 Pod 的產生，用 Service 去管理 Pod 之間的互連，而 Operator 可以透過 ServiceMonitor 去發現需要監控的 Service，並且可以隨著 Pod 的增減動態改變。

Prometheus Operator 裡面有一個叫做 \`prometheus-config-reloader\` 的組件，可以透過 ServiceMonitor 產生新的 \`prometheus.yml\`。

## Prometheus Operator 能做什麼？

要了解 Prometheus Operator 能做什麼，其實就是要了解它為我們提供了哪些自定義的 Kubernetes 資源。Prometheus Operator 目前提供 4 類資源：

- **Prometheus**：聲明式創建和管理 Prometheus Server 實例。
- **ServiceMonitor**：負責聲明式的管理監控配置。
- **PrometheusRule**：負責聲明式的管理告警配置。
- **Alertmanager**：聲明式的創建和管理 Alertmanager 實例。

簡言之，Prometheus Operator 能夠幫助用戶自動化的創建以及管理 Prometheus Server 以及其相應的配置。

## Prometheus Operator 的架構示意圖

![Prometheus Operator 架構示意圖，透過 ServiceMonitor 動態發現監控目標](/images/articles/prometheus-operator-2.webp)

## 常見問題

### Prometheus Operator 解決了什麼問題？

傳統 Prometheus 需要手動為每個監控目標寫設定，Pod 擴縮時要人工更新監控對象。Operator 透過 ServiceMonitor 依 Kubernetes 標籤自動發現監控目標，隨 Pod 增減動態改變配置。

### Prometheus Operator 提供哪些自定義資源？

四類：Prometheus（管理 Server 實例）、ServiceMonitor（管理監控配置）、PrometheusRule（管理告警配置）、Alertmanager（管理告警服務實例）。

### prometheus-config-reloader 的作用是什麼？

它是 Prometheus Operator 內的組件，會依據 ServiceMonitor 的變更產生新的 \`prometheus.yml\`，讓監控配置可以自動更新而不用手動改寫。

## 參考資料

- [Prometheus Operator 官方網站](https://prometheus-operator.dev/)

## 延伸閱讀

- [Prometheus Operator 設定教學：在 Kubernetes 建立 ServiceMonitor](/post/setup-prometheus-operator-kubernetes)：同樣聚焦 Prometheus Operator、Kubernetes，可接著比較不同情境的做法。
- [Prometheus 如何查看監控目標的 exporter 資訊](/post/prometheus-exporter-target-info)：同樣聚焦 Prometheus、Kubernetes，可接著比較不同情境的做法。
- [Prometheus 執行時更新 config 的兩種方式](/post/prometheus-config-hot-reload)：同樣聚焦 Prometheus、監控，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2022-12-16，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};