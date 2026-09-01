var e=`---
title: Prometheus Exporter 是什麼：資料格式、Targets 與 PromQL 查詢
description: 說明 Prometheus Exporter 的 Counter、Gauge、Histogram、Summary 格式與 Kubernetes metrics 查看方式。
date: 2022-12-16
category: DevOps
tags: [Prometheus, Exporter, Grafana, Kubernetes]
readingTime: 6 分鐘
image: /images/tech/Screenshot-2024-04-23-102615.webp
imageAlt: Prometheus Exporter 技術文章封面圖
---


# Prometheus Exporter 是什麼：資料格式、Targets 與 PromQL 查詢

Prometheus Exporter 是把應用程式或系統狀態轉成 Prometheus 可抓取 metrics 的資料提供端。理解 Exporter 輸出的資料格式，才能在 Prometheus Targets 找到來源，並在 Grafana 用 PromQL 查到真正需要監控的指標。

## Prometheus Exporter 在監控架構中扮演什麼角色？

Prometheus Exporter 是監控資料的提供端。Prometheus 會定期 scrape Exporter endpoint，取得純文字 metrics，再提供給 Grafana 查詢與視覺化。

在 Prometheus 架構裡，Exporter 通常位於被監控服務旁邊。Exporter 可能直接嵌在應用程式中，也可能是獨立服務，例如 node-exporter、json-exporter 或 kubelet metrics endpoint。

實務上，監控不是只有「Grafana 畫圖」。如果不知道 Exporter 提供哪些 metrics，就很難寫出正確 PromQL，也很難判斷圖表數值到底代表什麼。

## Exporter metrics 有哪些基本型別？

Prometheus Exporter 常見型別包含 Counter、Gauge、Histogram 與 Summary。這四種型別分別適合計數、狀態值、分布桶與分位數摘要。

| 型別 | 用途 |
|---|---|
| Counter | 單調遞增的計數器，例如請求總數。 |
| Gauge | 可上可下的單一數值，例如記憶體使用量或線上人數。 |
| Histogram | 將觀察值放入可設定 bucket，常用於請求時間或回應大小。 |
| Summary | 類似 Histogram，但會在滑動時間窗口上計算分位數。 |

選型時要注意查詢方式。Counter 常搭配 \`rate()\` 或 \`increase()\`；Gauge 可直接查當下值；Histogram 常用 \`_bucket\` 搭配 \`histogram_quantile()\`。

## 如何查看現有 Exporter 提供哪些資訊？

查看 Prometheus Exporter 資訊可以從 Prometheus Targets 頁面開始。Targets 會列出每個 scrape endpoint、狀態與可點擊的 metrics 來源。

在 Prometheus 面板打開 Targets 後，選擇要查看的目標 endpoint。除了 node-exporter 這類可能可直接存取的目標，Kubernetes 內部 exporter 常需要在 namespace 內部或 Pod 內部讀取。

以 json-exporter 為例，可以在 namespace 內部用 curl 測試：

\`\`\`bash
curl "http://127.0.0.1:7979/probe?module=default&target=http://127.0.0.1:1985/api/v1/streams/"
\`\`\`

如果部分網址無法連上，常見原因是 exporter 需要 token、憑證或必須從叢集內部網路存取。

## Kubernetes pod exporter metrics 如何取得？

Kubernetes pod exporter metrics 常需要認證。以 kubelet cadvisor metrics 為例，需要取得 namespace 中的 secret token，再用 Authorization header 呼叫 endpoint。

原文範例使用 \`cattle-monitoring-system\` namespace：

\`\`\`bash
# 取得該 namespace 的所有密鑰
kubectl get secret -n cattle-monitoring-system

# 取得密鑰內容
kubectl -n cattle-monitoring-system get secret rancher-monitoring-prometheus-token-hvlqt -o jsonpath={.data.token} | base64 -d

# 將 pod exporter 網址帶入 token
curl https://172.17.2.22:10250/metrics/cadvisor -H "Authorization: Bearer \${TOKEN}"
\`\`\`

實際 secret 名稱會依叢集而不同。這類指令適合用於排查，正式環境應遵守 Kubernetes RBAC 與最小權限原則。

## 為什麼要先理解 Exporter 輸出？

理解 Exporter 輸出能讓 PromQL 查詢更準確。Grafana 圖表的品質取決於 metrics 名稱、label 與聚合方式是否正確。

例如要查詢串流連線數，可以使用類似下面的 PromQL，把所有符合條件的 \`stream_clients_clients\` 依 pod 加總：

\`\`\`promql
sum(stream_clients_clients{namespace=~"namespace_name", pod=~"pod_name.+", name=~".+"}) by (pod)
\`\`\`

這段 PromQL 的關鍵在於 label 過濾與 \`by (pod)\` 分組。若沒有先看 Exporter endpoint 輸出的 label，就很容易查不到資料，或把不該加總的序列混在一起。

## 如何產生 Prometheus Exporter 資料？

產生 Prometheus Exporter 資料可以使用官方 client library、現成 exporter 或 Pushgateway。最終目標都是輸出 Prometheus 可讀的純文字 metrics endpoint。

官方提供多種語言的 client library。原文中嘗試過幾種方式：

| 方法 | 適合情境 |
|---|---|
| swagger-stats | Node.js API 需要快速輸出 HTTP 指標。 |
| json-exporter | 既有 JSON API 需要轉成 Prometheus metrics。 |
| Pushgateway | 短生命週期 job 或 batch 任務需要推送結果。 |

不論使用哪種方法，最後都應該能看到類似 \`/metrics\` 的純文字頁面，裡面列出要觀察的數值與 label。

## 常見問題
### Prometheus Exporter 一定要自己寫嗎？

Prometheus Exporter 不一定要自己寫。常見系統與服務已經有現成 exporter；只有當應用程式有自訂業務指標時，才需要用 client library 自己輸出 metrics。

### Counter 和 Gauge 有什麼差別？

Counter 只會遞增，適合累計事件數。Gauge 可以增加也可以減少，適合表示目前狀態，例如目前連線數或記憶體使用量。

### 為什麼 Prometheus Targets 有些 endpoint 連不上？

Targets endpoint 連不上可能是網路位置、TLS、RBAC、token 或服務本身異常造成。Kubernetes 內部 exporter 常需要從叢集內部或帶認證存取。

### PromQL 為什麼要先看 label？

PromQL 的篩選、分組與聚合都依賴 label。沒有確認 label 名稱與值，就容易寫出查不到資料或聚合錯誤的查詢。

### Pushgateway 適合拿來監控長駐服務嗎？

Pushgateway 通常不適合監控長駐服務。長駐服務應讓 Prometheus scrape \`/metrics\`；Pushgateway 比較適合短時間執行後就結束的 batch job。

## 參考資料
- Prometheus, Client libraries, https://prometheus.io/docs/instrumenting/clientlibs/，存取日期：2026-08-27。
- Kubernetes, Accessing the Kubernetes API from a Pod, https://kubernetes.io/docs/tasks/run-application/access-api-from-pod/，存取日期：2026-08-27。
- prometheus-community/json_exporter, https://github.com/prometheus-community/json_exporter，存取日期：2026-08-27。
- prometheus/pushgateway, https://github.com/prometheus/pushgateway，存取日期：2026-08-27。

## 延伸閱讀

- [Prometheus json_exporter 設定教學：把 JSON API 轉成監控指標](/post/prometheus-json-exporter)：同樣聚焦 Prometheus、Kubernetes，可接著比較不同情境的做法。
- [Prometheus 如何查看監控目標的 exporter 資訊](/post/prometheus-exporter-target-info)：同樣聚焦 Prometheus、Kubernetes，可接著比較不同情境的做法。
- [Prometheus 資料如何用 Web UI、Grafana 與 API 顯示](/post/prometheus-data-visualization)：同樣聚焦 Prometheus、Grafana，可接著比較不同情境的做法。

## 最後更新

Fri Dec 16 2022 08:00:00 GMT+0800 (Taiwan Standard Time)
`;export{e as default};