var e=`---
title: Prometheus relabel_config 用法整理：標籤增刪改寫與指標過濾
description: 整理 Prometheus relabel_config 的用途與能力：在看 Prometheus Operator 產生的 YAML 時，Endpoint 由 __scheme__、__address__、__metrics_path__ 組成，relabel 階段可新增、更新、重寫標籤，也能刪除不需要的標籤與指標。
date: 2022-12-16
category: DevOps
tags: [Prometheus, relabel, Service Discovery, 監控]
readingTime: 3 分鐘
image: /images/tech/hero_prometheus-relabel-config.webp
imageAlt: Prometheus relabel_config 標籤重寫筆記示意圖
---


# Prometheus relabel_config 用法整理：標籤增刪改寫與指標過濾

這篇文章整理 Prometheus \`relabel_config\` 的核心用途：在看 Prometheus Operator 產生的 YAML 時常見的 \`source_labels\` 到底在做什麼，以及 relabel 能對標籤與指標做哪些增刪改寫的操作。文中也附上更深入的教學連結。

## 為什麼會看到 source_labels？

當我們在看使用 Prometheus Operator 產生出來的 YAML 檔案時，會發現裡面用了許多的 \`source_labels\` 標籤。這個是讓 Operator 可以進一步處理資料標籤的方式（如增/刪要送出的資料、端點）。

## relabel_config 能做什麼？

Endpoint 的值是由 \`__scheme__\` + \`__address__\` + \`__metrics_path__\` 所組成。

透過 relabel_config 可以做到：

- 添加新標籤
- 更新現有標籤
- 重寫現有標籤
- 更新指標名稱
- 刪除不需要的標籤
- 刪除不需要的指標
- 在特定條件下刪除指標
- 修改標籤名稱
- 從多個現有標籤構建標籤

## 更多教學

關於 Service Discovery 與 Relabel 的完整流程，請見這篇整理：[Prometheus Service Discovery & Relabel](https://godleon.github.io/blog/Prometheus/Prometheus-Relabel/)。

## 常見問題

### relabel_config 的 Endpoint 是由什麼組成的？

由三個內部標籤組成：\`__scheme__\`（協定）、\`__address__\`（位址）與 \`__metrics_path__\`（抓取路徑），relabel 階段可以改寫這些值來調整抓取端點。

### relabel_config 可以刪除指標嗎？

可以。透過 \`action: drop\` 或在特定條件下匹配標籤後 drop，可以在抓取前就過濾掉不需要的指標，減少儲存負擔。

### source_labels 在 Operator 產生的 YAML 裡做什麼？

\`source_labels\` 指定 relabel 規則要從哪些現有標籤取值，搭配 \`regex\`、\`target_label\` 等欄位，用來新增、重寫或刪除標籤與指標。

## 參考資料

- [Prometheus Service Discovery & Relabel — godleon's blog](https://godleon.github.io/blog/Prometheus/Prometheus-Relabel/)

## 延伸閱讀

- [Prometheus Operator 是什麼？Kubernetes 監控的自動化利器](/post/prometheus-operator)：同樣聚焦 Prometheus、監控，可接著比較不同情境的做法。
- [Prometheus 如何查看監控目標的 exporter 資訊](/post/prometheus-exporter-target-info)：同樣聚焦 Prometheus、監控，可接著比較不同情境的做法。
- [Prometheus 執行時更新 config 的兩種方式](/post/prometheus-config-hot-reload)：同樣聚焦 Prometheus、監控，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2022-12-16，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};