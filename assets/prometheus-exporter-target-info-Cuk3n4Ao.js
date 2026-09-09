var e=`---
title: Prometheus 如何查看監控目標的 exporter 資訊
description: 說明 Prometheus Targets、Service Discovery、Kubernetes kubelet exporter 權限與 ServiceMonitor 排查方式。
date: 2023-04-13T00:00:00.000Z
category: DevOps
tags:
  - Prometheus
  - Kubernetes
  - 監控
readingTime: 7 分鐘
image: /images/tech/hero_prometheus-exporter-target-info.webp
imageAlt: graphs of performance analytics on a laptop screen
---
# Prometheus 如何查看監控目標的 exporter 資訊

Prometheus 要查看 exporter 資訊，通常先從網頁介面的 Targets 頁面確認目前 scrape 的監控目標，再進入 Service Discovery 檢查服務是否被正確發現。若 exporter endpoint 需要 Kubernetes 認證，就必須帶 token 才能直接讀到 metrics。

## Prometheus Target 是什麼？

Prometheus Target 是 Prometheus 定期抓取 metrics 的監控目標。Target 通常由 exporter 暴露 HTTP endpoint，Prometheus 會依設定定期呼叫 endpoint 並收集服務狀態資料。

Service Monitoring 可以監控服務可用性、吞吐量、延遲、錯誤率與請求數量。對 Kubernetes 服務來說，Target 是否出現，通常能直接反映 Service、ServiceMonitor、label selector 與 namespace selector 是否搭配正確。

Prometheus Target 可用來觀察：

- 服務是否正常回應。
- exporter endpoint 是否能被 Prometheus 抓取。
- scrape 是否成功，以及失敗原因。
- Service Discovery 是否找到預期服務。

## 如何瀏覽 exporter 回傳內容？

Prometheus exporter 內容可從 Targets 頁面找到 endpoint，再直接開啟 metrics URL。若 Target 沒有正確出現，應先到 Service Discovery 頁籤檢查服務發現結果。

原文截圖沒有在 \`markdown-export/uploads\` 找到，所以這裡保留操作邏輯：先看 Targets，確認 job、endpoint、status 與 last scrape；再看 Service Discovery，確認 label 與 namespace 是否符合設定。

常見檢查順序：

1. 進入 Prometheus 網頁介面的 \`Status > Targets\`。
2. 找到對應 job 或 ServiceMonitor 產生的 target。
3. 點開 endpoint 或複製 metrics URL。
4. 如果 target 不存在，改看 \`Status > Service Discovery\`。
5. 比對 Service label、ServiceMonitor selector 與 namespaceSelector。

## kubelet exporter 為什麼不能直接讀？

Kubernetes kubelet metrics endpoint 通常需要叢集認證。直接讀 \`https://127.0.0.1:10250/metrics/cadvisor\` 可能失敗，因為 kubelet 不會接受未授權請求。

在 Rancher monitoring 環境中，Prometheus 可能透過 \`rancher-monitoring-kubelet\` 取得 Pod 狀態。若要手動呼叫 kubelet exporter，原文做法是先取得 monitoring namespace 的 token，再用 Bearer token 呼叫 endpoint。

\`\`\`bash
# 取得該 namespace 的所有 secret
kubectl get secret -n cattle-monitoring-system

# 取得 Prometheus token，secret 名稱請替換成實際環境中的名稱
kubectl -n cattle-monitoring-system get secret rancher-monitoring-prometheus-token-hvlqt \\
  -o jsonpath={.data.token} | base64 -d

# 帶入 token 呼叫 kubelet metrics endpoint
curl https://127.0.0.1:10250/metrics/cadvisor \\
  -k \\
  -H "Authorization: Bearer token_content_xxxxxxxxx"
\`\`\`

## ServiceMonitor 抓不到目標要查哪裡？

ServiceMonitor 抓不到監控目標時，最常見原因是 selector 對不到 Service label，或 namespaceSelector 沒有包含 Service 所在 namespace。ServiceMonitor 監控的是 Service，不是直接用 Pod label。

下面是原文提供的 ServiceMonitor 範例：

\`\`\`yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  generation: 4
  labels:
    app.kubernetes.io/instance: srs-json-exporter
    manager: agent
    operation: Update
  name: json-exporter
  namespace: stu-srs
spec:
  endpoints:
    - interval: 30s
      params:
        module:
          - default
        target:
          - http://127.0.0.1:1985/api/v1/streams/
      port: json-exporter
  jobLabel: jobLabel
  namespaceSelector:
    matchNames:
      - stu-srs
  selector:
    matchLabels:
      app.kubernetes.io/instance: srs-json-exporter
\`\`\`

排查時我會先確認三件事：Service 是否有 \`app.kubernetes.io/instance: srs-json-exporter\` 這個 label、Service 是否真的在 \`stu-srs\` namespace、Service port 名稱是否叫 \`json-exporter\`。

## 常見問題
### Prometheus Targets 頁面看不到服務怎麼辦？

先到 Service Discovery 頁面確認服務是否被發現。若 Service Discovery 也沒有出現，多半是 namespaceSelector 或 selector 沒有對到。

### ServiceMonitor 的 selector 是選 Pod 還是 Service？

ServiceMonitor 的 selector 是選 Service。即使 Pod label 正確，只要 Service label 不符合，Prometheus Operator 就不會產生預期 target。

### kubelet metrics endpoint 為什麼需要 token？

kubelet endpoint 會暴露節點與容器相關 metrics，通常受 Kubernetes 認證保護。手動讀取時要使用具備權限的 Bearer token。

### \`curl -k\` 是必要的嗎？

\`curl -k\` 是略過 TLS 憑證驗證，常用於內部測試。正式環境應盡量使用可信憑證，避免把略過憑證驗證當成長期做法。

## 參考資料
- Prometheus Documentation, Jobs and instances: <https://prometheus.io/docs/concepts/jobs_instances/>
- Prometheus Operator Documentation, ServiceMonitor: <https://prometheus-operator.dev/docs/api-reference/api/>
- Kubernetes Documentation, kubelet authentication/authorization: <https://kubernetes.io/docs/reference/access-authn-authz/kubelet-authn-authz/>

## 延伸閱讀

- [Prometheus Operator 是什麼？Kubernetes 監控的自動化利器](/post/prometheus-operator)：同樣聚焦 Prometheus、Kubernetes，可接著比較不同情境的做法。
- [Prometheus json_exporter 設定教學：把 JSON API 轉成監控指標](/post/prometheus-json-exporter)：同樣聚焦 Prometheus、Kubernetes，可接著比較不同情境的做法。
- [Prometheus Exporter 是什麼：資料格式、Targets 與 PromQL 查詢](/post/prometheus-exporter-metrics)：同樣聚焦 Prometheus、Kubernetes，可接著比較不同情境的做法。

## 最後更新

Thu Apr 13 2023 08:00:00 GMT+0800 (Taiwan Standard Time)

`;export{e as default};