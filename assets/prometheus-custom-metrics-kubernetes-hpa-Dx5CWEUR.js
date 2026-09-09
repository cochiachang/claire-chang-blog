var e=`---
title: 使用 Prometheus 自定義指標為 Kubernetes 做 HPA 縮放
description: 說明如何用 Prometheus Exporter、ServiceMonitor、PrometheusRule 與 Kubernetes HPA Object metric 建立 custom metrics 縮放流程。
date: 2022-12-05
category: DevOps
tags: [Prometheus, Kubernetes, HPA, Custom Metrics, DevOps]
readingTime: 8 分鐘
image: /images/tech/hero_setup-prometheus-operator-kubernetes.webp
imageAlt: Kubernetes 監控系統與 Prometheus 指標儀表板
---


# 使用 Prometheus 自定義指標為 Kubernetes 做 HPA 縮放

Kubernetes HorizontalPodAutoscaler（HPA）可以使用 Prometheus 自定義指標做 Pod 縮放，但 HPA 不會直接讀 Prometheus。實作流程是先用 Exporter 暴露 custom metrics，再讓 Prometheus Operator 透過 ServiceMonitor scrape 指標，接著用 PrometheusRule 產生 HPA 可查的 recording rule，最後由 Kubernetes custom metrics API 提供給 HPA 使用。

這篇整理的是我在 Rancher、Prometheus、Prometheus Operator 與 Kubernetes 環境中使用自定義指標做 HPA 縮放的設定流程。重點不只是 YAML 怎麼寫，而是 Exporter、ServiceMonitor、PrometheusRule 與 HPA \`metrics.object\` 之間的名稱、label 與 namespace 要對齊。

## Prometheus custom metrics 如何接到 Kubernetes HPA？

Prometheus custom metrics 接到 Kubernetes HPA 的核心流程是「產生指標、收集指標、整理指標、暴露給 HPA」。Prometheus 負責監控資料，Kubernetes HPA 透過 metrics API 取得縮放依據。

Kubernetes 官方文件說明，HPA 控制器會依 HPA 設定查詢 metrics API，再計算 Deployment、StatefulSet 或其他 scale target 的 replicas 數量（Kubernetes，存取日期：2026-08-28）。因此 Prometheus 指標要能被 HPA 使用，中間通常還需要 Prometheus Adapter 或等效的 custom metrics API adapter。

本篇流程使用這些元件：

| 元件 | 負責的事 |
|---|---|
| Exporter | 把應用程式或外部 API 的資料轉成 Prometheus metrics。 |
| Service | 讓 Prometheus 可以透過 Kubernetes service discovery 找到 Exporter。 |
| ServiceMonitor | Prometheus Operator 用來宣告 scrape path、port 與參數。 |
| PrometheusRule | 用 recording rule 整理 HPA 要查的 metric 名稱與 label。 |
| Prometheus Adapter | 把 Prometheus metric 暴露到 Kubernetes custom metrics API。 |
| Kubernetes HPA | 依 custom metric 與 target value 調整 Pod 數量。 |

## 步驟一：如何設定 Exporter 與 ServiceMonitor？

Exporter 要先能提供 Prometheus 格式的 custom metrics，ServiceMonitor 才有資料可以 scrape。Prometheus 官方也提供多種 client libraries，可以在應用程式內直接輸出 metrics。

如果服務本身可以接 Prometheus client library，最乾淨的做法是在服務內提供 \`/metrics\` endpoint。Prometheus 官方 client libraries 涵蓋 Go、Java、Python、Ruby、Rust、Node.js 等常見語言（Prometheus，存取日期：2026-08-28）。如果服務只能吐 JSON API，也可以用 json_exporter 先轉成 Prometheus metrics。

以下範例建立名為 \`my-export\` 的 Service。這裡保留當時的 headless Service 設定，重點是 Service label、selector 與 port name 要能被 ServiceMonitor 對上。

\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app: my-export
  name: my-export
  namespace: default
spec:
  clusterIP: None
  clusterIPs:
    - None
  ports:
    - name: my-export
      port: 7979
      protocol: TCP
      targetPort: 7979
  selector:
    prometheus-customized-metrix: my-export
  type: ClusterIP
\`\`\`

ServiceMonitor 選的是 Service label，不是 Pod label。Prometheus Operator 的 ServiceMonitor CRD 會用 \`spec.selector.matchLabels\` 找到符合條件的 Service，再依 \`endpoints\` 設定 scrape path、port 與 query params（Prometheus Operator，存取日期：2026-08-28）。

\`\`\`yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  labels:
    app: my-export
  name: my-export
  namespace: default
spec:
  endpoints:
    - interval: 30s
      params:
        module:
          - default
        target:
          - http://127.0.0.1:1985/api/v1/streams/
      path: /probe
      port: my-export
  jobLabel: jobLabel
  namespaceSelector:
    matchNames:
      - default
  selector:
    matchLabels:
      app: my-export
\`\`\`

這段 ServiceMonitor 適合搭配 \`/probe\` 類型的 Exporter，例如 json_exporter。\`target\` 指向真正要抓的 API，\`path: /probe\` 指向 Exporter 入口，\`port: my-export\` 則必須對到 Service 裡的 port name。

## 步驟二：PrometheusRule 要怎麼整理 HPA 指標？

PrometheusRule 可以把 PromQL 查詢結果記錄成新的 time series，讓 HPA 查詢時使用穩定的 metric name。HPA 需要的是可被 adapter 對應到 Kubernetes object 的 metric。

Prometheus recording rules 會預先計算 PromQL 表達式，並用 \`record\` 欄位指定新 metric 名稱。PrometheusRule 是 Prometheus Operator 在 Kubernetes 裡管理 rule group 的 Custom Resource（Prometheus Operator，存取日期：2026-08-28）。

以下範例把 \`mydata\` 依 \`pod\` 聚合，並在 recording rule 上補上 \`namespace\` 與 \`service\` label。這個 \`service: eventqueue\` 後面會被 HPA Object metric 用來對齊 \`Service/eventqueue\`。

\`\`\`yaml
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  labels:
    app: rancher-monitoring
    app.kubernetes.io/instance: rancher-monitoring
    app.kubernetes.io/managed-by: Helm
    app.kubernetes.io/part-of: rancher-monitoring
    app.kubernetes.io/version: 16.6.1_up16.6.0
    chart: rancher-monitoring-16.6.1_up16.6.0
    heritage: Helm
    release: rancher-monitoring
  name: my-data
  namespace: default
spec:
  groups:
    - name: my-data
      rules:
        - expr: sum(mydata{container="my-container", name=~".+", namespace=~"default"}) by (pod)
          labels:
            namespace: default
            service: eventqueue
          record: mydata
\`\`\`

我會特別檢查三件事：\`record\` 名稱是否就是 HPA 的 \`metric.name\`、\`labels.service\` 是否就是 HPA 的 \`describedObject.name\`、\`namespace\` 是否和 HPA、Service、Prometheus Adapter 規則一致。這三個欄位任何一個飄掉，Prometheus 可能查得到資料，但 HPA 仍然會顯示找不到 metric。

## 步驟三：HPA Object metric 怎麼設定？

HPA Object metric 會針對某一個 Kubernetes object 查詢指標，再把目前值和目標值比較。這種寫法適合把 metric 關聯到 Service、Ingress 或其他明確物件。

Kubernetes \`autoscaling/v2\` 的 HPA 支援 Resource、ContainerResource、Pods、Object 與 External metrics。Object metric 需要設定 \`describedObject\`、\`metric\` 與 \`target\`，讓 HPA 知道要查哪個物件上的哪個指標（Kubernetes API Reference，存取日期：2026-08-28）。

以下範例保留當時使用的 \`autoscaling/v2beta2\` 寫法。新叢集若已支援穩定版，建議改成 \`apiVersion: autoscaling/v2\`。

\`\`\`yaml
apiVersion: autoscaling/v2beta2
kind: HorizontalPodAutoscaler
metadata:
  name: my-hpa
  namespace: default
spec:
  behavior:
    scaleDown:
      policies:
        - periodSeconds: 60
          type: Pods
          value: 1
      selectPolicy: Max
      stabilizationWindowSeconds: 300
    scaleUp:
      policies:
        - periodSeconds: 60
          type: Pods
          value: 1
      selectPolicy: Max
      stabilizationWindowSeconds: 300
  maxReplicas: 2
  metrics:
    - object:
        describedObject:
          apiVersion: v1
          kind: Service
          name: eventqueue
        metric:
          name: mydata
        target:
          type: Value
          value: 1k
      type: Object
  minReplicas: 1
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-container
\`\`\`

這段 HPA 會擴縮 \`Deployment/my-container\`，但縮放依據來自 \`Service/eventqueue\` 上的 \`mydata\` 指標。\`scaleTargetRef\` 和 \`describedObject\` 不是同一件事：前者是被調整 replicas 的 workload，後者是 custom metric 關聯的 Kubernetes object。

## HPA scale up 與 scale down behavior 如何控制？

HPA behavior 用來限制擴容與縮容速度，避免 custom metrics 短時間波動造成 replicas 震盪。這段設定讓 scale up 與 scale down 每 60 秒最多變動 1 個 Pod。

Kubernetes HPA API Reference 說明，\`behavior.scaleUp\` 與 \`behavior.scaleDown\` 可以設定 policies、selectPolicy 與 stabilizationWindowSeconds。\`stabilizationWindowSeconds\` 會讓 HPA 在指定秒數內參考歷史建議值，降低短暫尖峰或短暫低谷造成的反覆縮放（Kubernetes API Reference，存取日期：2026-08-28）。

本篇範例的縮放策略可以這樣解讀：

| 欄位 | 範例值 | 意義 |
|---|---:|---|
| \`scaleUp.policies[].value\` | \`1\` | 每次最多增加 1 個 Pod。 |
| \`scaleDown.policies[].value\` | \`1\` | 每次最多減少 1 個 Pod。 |
| \`periodSeconds\` | \`60\` | 以 60 秒為一個策略計算週期。 |
| \`stabilizationWindowSeconds\` | \`300\` | 以 300 秒穩定視窗降低縮放震盪。 |
| \`minReplicas\` / \`maxReplicas\` | \`1\` / \`2\` | 限制 replicas 的下限與上限。 |

如果 custom metric 是連線數、queue depth 或串流數量，數值常常會短時間上下跳。我的習慣是先用保守 behavior 觀察 HPA event，再依服務可承受的排隊時間、啟動時間與成本調整 \`periodSeconds\` 和 \`maxReplicas\`。

## 設定完成後要怎麼驗證 custom metrics？

Prometheus custom metrics 的驗證順序要從資料來源一路查到 HPA。不要只看 HPA YAML，因為 metric 可能卡在 Exporter、Prometheus scrape、recording rule 或 adapter 任一層。

我會用這個順序排查：

1. 在 Exporter endpoint 確認 \`/metrics\` 或 \`/probe\` 有回傳 \`mydata\`。
2. 在 Prometheus Targets 確認 \`my-export\` scrape 狀態是 UP。
3. 在 Prometheus 查 PromQL，確認 \`mydata{namespace="default", service="eventqueue"}\` 有值。
4. 確認 PrometheusRule 產出的 \`record: mydata\` 與 HPA \`metric.name: mydata\` 完全一致。
5. 確認 Prometheus Adapter 已把 \`mydata\` 暴露到 \`custom.metrics.k8s.io\`。
6. 用 \`kubectl describe hpa -n default my-hpa\` 看目前 metric value 與 event。

常見狀況是 Prometheus 查得到 \`mydata\`，但 HPA event 顯示 unable to get metric。這時先查 adapter 的 discovery、association、naming 與 query 規則；HPA 找不到 metric 多半不是 HPA controller 壞掉，而是 Prometheus label 和 Kubernetes resource 的關聯沒有對上。

## Prometheus custom metrics HPA 設定檢查表

Prometheus custom metrics HPA 成功與否，通常取決於名稱、label、namespace、adapter 與 target value 是否一致。把檢查表跑完，比單看 YAML 更容易定位問題。

| 檢查項目 | 要確認的內容 |
|---|---|
| Exporter | endpoint 有 Prometheus text format，metric 名稱穩定。 |
| Service | Service selector 選得到 Exporter Pod，port name 和 ServiceMonitor 一致。 |
| ServiceMonitor | selector 選得到 Service，\`path\`、\`params\`、\`namespaceSelector\` 正確。 |
| PrometheusRule | \`record\` 名稱等於 HPA \`metric.name\`，必要 label 已補齊。 |
| Prometheus Adapter | custom metric 已出現在 Kubernetes metrics API。 |
| HPA | \`describedObject\` 對到 adapter 可辨識的 Kubernetes resource。 |
| Scaling target | \`scaleTargetRef\` 指向真正要擴縮的 Deployment 或 workload。 |
| Behavior | scale up/down 速度符合服務啟動時間與負載變化。 |

資訊增益在這裡：我不會先改 HPA target value。HPA 沒有動作時，第一步應該先確認 \`current metrics\` 是否讀得到；只有 metric 已讀到但 replicas 不符合預期，才進一步調整 \`value: 1k\` 或 behavior。

## 常見問題

### Prometheus custom metrics 可以直接給 Kubernetes HPA 用嗎？
Prometheus custom metrics 通常不能直接給 Kubernetes HPA 用。Kubernetes HPA 會查 Kubernetes metrics API，所以 Prometheus 指標需要透過 Prometheus Adapter 或等效 adapter 暴露成 \`custom.metrics.k8s.io\` 或 \`external.metrics.k8s.io\`。

### ServiceMonitor 的 selector 是選 Pod 還是 Service？
ServiceMonitor 的 selector 是選 Service。Pod 先由 Service selector 選中，Service 再由 ServiceMonitor selector 選中；如果 Service label 對不上，Prometheus Operator 就不會產生正確 scrape 設定。

### PrometheusRule 的 record 名稱要和 HPA metric.name 一樣嗎？
PrometheusRule 的 \`record\` 名稱要和 HPA \`metric.name\` 對齊。本文範例使用 \`record: mydata\`，所以 HPA 也設定 \`metric.name: mydata\`。

### HPA Object metric 的 describedObject 是 scale target 嗎？
HPA Object metric 的 \`describedObject\` 不是 scale target。\`describedObject\` 是 metric 關聯的 Kubernetes object，例如 \`Service/eventqueue\`；\`scaleTargetRef\` 才是 HPA 要調整 replicas 的 Deployment 或其他 workload。

### custom metrics HPA 找不到 metric 時要先查哪裡？
custom metrics HPA 找不到 metric 時，先查 Prometheus 是否有值，再查 Prometheus Adapter 是否把 metric 暴露到 Kubernetes custom metrics API。最後確認 HPA 的 \`metric.name\`、\`describedObject.kind\`、\`describedObject.name\` 和 PrometheusRule label 是否一致。

### autoscaling/v2beta2 和 autoscaling/v2 應該用哪一個？
新 Kubernetes 叢集建議使用 \`autoscaling/v2\`。本文 YAML 保留當時的 \`autoscaling/v2beta2\` 寫法，是為了對應既有環境；正式套用前應依叢集版本確認 HPA API 是否支援。

## 參考資料

- Kubernetes，〈[Horizontal Pod Autoscaling](https://kubernetes.io/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/)〉，存取日期：2026-08-28。
- Kubernetes，〈[HorizontalPodAutoscaler autoscaling/v2 API Reference](https://kubernetes.io/docs/reference/kubernetes-api/autoscaling/horizontal-pod-autoscaler-v2/)〉，存取日期：2026-08-28。
- Prometheus，〈[Client libraries](https://prometheus.io/docs/instrumenting/clientlibs/)〉，存取日期：2026-08-28。
- Prometheus Operator，〈[API reference](https://prometheus-operator.dev/docs/api-reference/api/)〉，存取日期：2026-08-28。
- kubernetes-sigs，〈[Prometheus Adapter configuration documentation](https://github.com/kubernetes-sigs/prometheus-adapter/blob/master/docs/config.md)〉，存取日期：2026-08-28。

## 延伸閱讀

- [Kubernetes HPA 如何用 Prometheus 自訂指標擴縮 Pod](/post/kubernetes-hpa-custom-metrics-prometheus)：同樣聚焦 Kubernetes、HPA，可接著比較不同情境的做法。
- [Prometheus Exporter 是什麼：資料格式、Targets 與 PromQL 查詢](/post/prometheus-exporter-metrics)：同樣聚焦 Prometheus、Kubernetes，可接著比較不同情境的做法。
- [Prometheus Operator 是什麼？Kubernetes 監控的自動化利器](/post/prometheus-operator)：同樣聚焦 Prometheus、Kubernetes，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2026-08-28。這次整理保留 Prometheus 自定義指標、custom metrics、ServiceMonitor、PrometheusRule 與 Kubernetes HPA 縮放設定，補上 Answer Blocks、FAQ、參考資料與站內延伸閱讀。
`;export{e as default};