var e=`---
title: 如何用 PromQL 查詢某個 Pod 內所有的指標值？
description: 一條 Prometheus 查詢語句 sum by(__name__) 搭配 label selector，快速列出 Kubernetes 中特定 namespace 下某個 Pod 內所有的指標值，並用 ServiceMonitor 設定正確監控。
date: 2023-04-14
category: DevOps
tags: [Prometheus, PromQL, Kubernetes, ServiceMonitor, 監控]
readingTime: 4 分鐘
image: /images/tech/hero_prometheus-query-pod-metrics.webp
imageAlt: 筆記型電腦螢幕上顯示效能分析的圖表
---


# 如何用 PromQL 查詢某個 Pod 內所有的指標值？

想確認 Prometheus 到底抓到了某個 Pod 的哪些指標嗎？本文用一條 \`sum by(__name__)\` 的 PromQL 查詢，搭配 namespace 與 pod 的 label selector，一次列出該 Pod 內所有的指標值，再進一步用它驗證 ServiceMonitor 的設定是否正確。

## 用什麼指令可以一次列出 Pod 內所有的值？

使用的指令如下：

\`\`\`bash
sum by(__name__)({namespace="default",pod="pod_name", __name__=~".*"})
\`\`\`

## 這條 PromQL 查詢語句的各部分是什麼意思？

- \`sum by(__name__)\` 是一個 Prometheus 查詢語句，用於計算符合指定條件的指標值之和，並根據指標名稱進行分組。
- \`{namespace="default",pod="pod_name"}\` 是一個標籤選擇器（label selector），用來選擇符合條件的 POD。其中 \`namespace\` 表示命名空間（namespace），\`pod\` 表示 POD 名稱。
- \`__name__=~".*"\` 是一個正則表達式選擇器（regular expression selector），用於選擇符合特定模式的指標名稱。我們使用 \`~\` 運算符將正則表達式用於指標名稱，\`.*\` 的意思是匹配所有指標名稱。也可以換成例如 \`"MEERIC.*"\`，表示以 \`MEERIC\` 開頭的所有指標名稱。
- \`__name__\` 是一個特殊的標籤（label），代表指標名稱。使用 \`sum by\` 子句時，我們將其作為分組條件之一，以根據指標名稱對指標值進行分組。

## 查到所有指標後，如何用 ServiceMonitor 讓 Prometheus 監控正確的對象？

在可以看到所有的值之後，就可以確認你的 ServiceMonitor 是否正確，接著來設定 ServiceMonitor 讓普羅米修斯監控正確的對象。

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

更多關於 ServiceMonitor 可用的設定值請見 [OpenShift 的 ServiceMonitor API 文件](https://docs.openshift.com/container-platform/4.9/rest_api/monitoring_apis/servicemonitor-monitoring-coreos-com-v1.html)。

## 常見問題

### 為什麼要用 sum by(__name__) 而不是直接查指標？

因為一開始可能不知道這個 Pod 到底有哪些指標，用 \`__name__=~".*"\` 匹配所有指標名稱並依 \`__name__\` 分組，就能一次列出全部的指標與其值。

### \`__name__\` 是什麼？

\`__name__\` 是 Prometheus 的特殊標籤，代表指標本身的名稱。在 \`sum by\` 中把它當作分組欄位，查詢結果就會依指標名稱一行行列出。

### ServiceMonitor 的作用是什麼？

ServiceMonitor 是 Prometheus Operator 的 CRD，用來告訴 Prometheus 要抓取哪些 Service 的哪些 endpoint，包含抓取路徑、port、間隔等設定，不用手動改 Prometheus 設定檔。

### namespace 和 pod 的 label 要怎麼填？

把 \`namespace\` 填成 Pod 所在的命名空間，\`pod\` 填成實際的 Pod 名稱（或正則匹配），即可縮小查詢範圍到該 Pod。

## 參考資料

- [OpenShift Container Platform 4.9 — ServiceMonitor API 文件](https://docs.openshift.com/container-platform/4.9/rest_api/monitoring_apis/servicemonitor-monitoring-coreos-com-v1.html)

## 延伸閱讀

- [如何查詢 Prometheus 某個 POD 內所有的指標值？](/post/prometheus-query-pod-values)：同樣聚焦 Prometheus、Kubernetes，可接著比較不同情境的做法。
- [Prometheus Operator 設定教學：在 Kubernetes 建立 ServiceMonitor](/post/setup-prometheus-operator-kubernetes)：同樣聚焦 Kubernetes、ServiceMonitor，可接著比較不同情境的做法。
- [Prometheus Operator 是什麼？Kubernetes 監控的自動化利器](/post/prometheus-operator)：同樣聚焦 Prometheus、Kubernetes，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2023-04-14，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};