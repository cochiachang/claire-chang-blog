var e=`---
title: "如何查詢 Prometheus 某個 POD 內所有的指標值？"
description: "想查看 Prometheus 中某個 POD 內所有的指標值嗎？本文分享一條 sum by(__name__) 查詢語句，搭配 namespace 與 pod 標籤選擇器，快速列出該 POD 的所有 metrics，並進一步設定 ServiceMonitor 讓 Prometheus Operator 監控正確的監控目標。"
date: 2023-04-14
category: "DevOps"
tags: ["Prometheus", "Kubernetes", "ServiceMonitor", "PromQL"]
readingTime: "3 分鐘"
image: "/images/tech/hero_prometheus-query-pod-values.webp"
imageAlt: "Prometheus 監控指標查詢示意圖"
---


# 如何查詢 Prometheus 某個 POD 內所有的指標值？

## 在 Prometheus 中要怎麼列出某個 POD 的所有指標？

使用的指令如下：

\`\`\`bash
sum by(__name__)({namespace="default",pod="pod_name", __name__=~".*"})
\`\`\`

解釋如下：

- \`sum by(__name__)\` 是一個 Prometheus 查詢語句，用於計算符合指定條件的指標值之和，並根據指標名稱進行分組。
- \`{namespace="default",pod_name="my-pod"}\` 是一個標籤選擇器 (label selector)，用來選擇符合條件的 POD。其中，\`namespace\` 表示命名空間 (namespace)，\`pod_name\` 表示 POD 名稱。
- \`__name__=~"MEERIC.*"\` 是一個正則表達式選擇器 (regular expression selector)，用於選擇符合特定模式的指標名稱。在本例中，我們使用 \`~\` 運算符將正則表達式 \`"MEERIC.*"\` 用於指標名稱，以找到符合條件的指標。這個正則表達式的意思是：以 \`MEERIC\` 開頭的所有指標名稱。
- \`__name__\` 是一個特殊的標籤 (label)，代表指標名稱。使用 \`sum by\` 子句時，我們將其作為分組條件之一，以根據指標名稱對指標值進行分組。

## 為什麼要設定 ServiceMonitor 才能正確監控？

在可以看到所有的值之後，就可以確認你的 ServiceMonitor 是否正確，可以來設定 ServiceMonitor 讓普羅米修斯監控正確的對象。

以下為一個簡單的範例：

\`\`\`yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  labels:
    app.kubernetes.io/instance: srs-json-exporter
  name: json-exporter
  namespace: stu-dashboard
spec:
  endpoints:
  - interval: 30s
    params:
      module:
      - default
      target:
      - http://127.0.0.1:1985/api/v1/streams/
    path: probe
    port: json-exporter
  jobLabel: jobLabel
  namespaceSelector:
    matchNames:
    - stu-srs
  selector:
    matchLabels:
      app: json-exporter
\`\`\`

更多關於 ServiceMonitor 可用的設定值請見：<https://docs.openshift.com/container-platform/4.9/rest_api/monitoring_apis/servicemonitor-monitoring-coreos-com-v1.html>

## 常見問題

### 為什麼要用 sum by(__name__) 而不是直接列出所有指標？

因為同一個指標名稱可能有多個帶不同標籤的時間序列，直接列出會出現大量重複項目。用 \`sum by(__name__)\` 可以依指標名稱分組彙總，一次看到該 POD 有哪些指標。

### 查不到任何值可能是什麼原因？

先確認標籤選擇器是否正確，例如 namespace 與 pod 的標籤名稱是否真的存在。可以用 \`{__name__=~".+", namespace="default"}\` 縮小範圍逐步測試，也別忘了檢查 Prometheus 的資料保留時間。

### ServiceMonitor 一定要放在和目標 Service 同一個 namespace 嗎？

不一定，ServiceMonitor 本身可以放在別的 namespace，但 Prometheus Operator 的 namespaceSelector 必須涵蓋目標 Service 所在的 namespace，否則不會被抓到監控目標。

## 參考資料

- [OpenShift: ServiceMonitor API 文件](https://docs.openshift.com/container-platform/4.9/rest_api/monitoring_apis/servicemonitor-monitoring-coreos-com-v1.html)

## 延伸閱讀

- [如何用 PromQL 查詢某個 Pod 內所有的指標值？](/post/prometheus-query-pod-metrics)：同樣聚焦 Prometheus、PromQL，可接著比較不同情境的做法。
- [Prometheus Operator 設定教學：在 Kubernetes 建立 ServiceMonitor](/post/setup-prometheus-operator-kubernetes)：同樣聚焦 Kubernetes、ServiceMonitor，可接著比較不同情境的做法。
- [Prometheus 如何查看監控目標的 exporter 資訊](/post/prometheus-exporter-target-info)：同樣聚焦 Prometheus、Kubernetes，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2023-04-14，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};