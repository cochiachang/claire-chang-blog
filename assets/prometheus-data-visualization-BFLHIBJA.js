var e=`---
title: Prometheus 資料如何用 Web UI、Grafana 與 API 顯示
description: 說明 Prometheus Web UI、Grafana、PromQL 查詢型態與 .NET 專案串接 Prometheus API 的方法。
date: 2022-12-16
category: DevOps
tags: [Prometheus, Grafana, PromQL, 監控]
readingTime: 7 分鐘
image: /images/tech/hero_prometheus-data-visualization.webp
imageAlt: 筆電螢幕顯示效能分析圖表，象徵 Prometheus 與 Grafana 監控資料視覺化
---


# Prometheus 資料如何用 Web UI、Grafana 與 API 顯示

Prometheus 資料可以透過三種方式顯示：Prometheus Web UI 適合排查 targets 與即時查詢，Grafana 適合建立長期監控儀表板，HTTP API 適合把 PromQL 結果整合到自有 .NET 或其他後端專案。

## Prometheus Web UI 可以看什麼？

Prometheus Web UI 是 Prometheus 內建狀態與查詢介面。Web UI 適合查看 config、targets、service discovery 與 PromQL 即時查詢結果。

在 Rancher monitoring 環境中，若 Prometheus pod 跑在 \`cattle-monitoring-system\` namespace，可以用 port-forward 把 Web UI 轉到本機：

\`\`\`bash
kubectl -n cattle-monitoring-system port-forward \\
  prometheus-rancher-monitoring-prometheus-0 9090:9090
\`\`\`

開啟 \`http://localhost:9090\` 後，可先確認：

- \`Status > Targets\`：哪些 exporter 正在被 scrape。
- \`Status > Configuration\`：Prometheus 實際載入的設定。
- \`Graph\` 或查詢頁：PromQL 是否能回傳預期資料。

## Grafana 如何顯示 Prometheus 資料？

Grafana 透過 Prometheus data source 讀取 PromQL 查詢結果，適合建立 dashboard、alert、annotation 與團隊監控頁。

Grafana 官方文件說明，Prometheus data source 已預裝在 Grafana 中，不需要手動安裝。設定 data source 後，可以在 query editor 寫 PromQL，或用 Metrics Drilldown 探索 metrics。

Ubuntu/Debian 安裝流程可參考原文：

\`\`\`bash
sudo apt-get install -y apt-transport-https
sudo apt-get install -y software-properties-common wget
sudo wget -q -O /usr/share/keyrings/grafana.key https://apt.grafana.com/gpg.key
echo "deb [signed-by=/usr/share/keyrings/grafana.key] https://apt.grafana.com stable main" | \\
  sudo tee -a /etc/apt/sources.list.d/grafana.list
sudo apt-get update
sudo apt-get install grafana
\`\`\`

Kubernetes 環境建議優先使用 Helm chart 或官方 Kubernetes 安裝文件，避免手動安裝造成升級與設定漂移。

## PromQL 查詢結果有哪些型態？

PromQL 查詢結果主要有 instant vector、range vector、scalar 與 string 四種型態。Grafana 圖表通常使用 instant vector 或 range query 結果。

Prometheus 官方文件定義如下：

| 型態 | 說明 | 範例 |
|---|---|---|
| Instant vector | 每個 time series 在單一時間點的樣本 | \`http_requests_total\` |
| Range vector | 每個 time series 在一段時間內的多個樣本 | \`http_requests_total[5m]\` |
| Scalar | 單一浮點數 | \`count(http_requests_total)\` |
| String | 字串，PromQL 目前很少直接使用 | 不常用 |

原文提到可從 Target 頁面找 label，用 label 區分不同資料來源。例如 SRS core 與 edge 使用相同 exporter 時，可用不同 label 讓 Grafana 分別顯示。

## 如何用 label 與 regex 篩選資料？

PromQL label selector 可以精準或模糊篩選 time series。多個服務共用 exporter 時，label 設計會直接影響 dashboard 是否清楚。

常見查詢方式：

\`\`\`promql
http_requests_total{job="api"}
http_requests_total{instance=~".+"}
sum by (job) (rate(http_requests_total[5m]))
\`\`\`

Prometheus 使用 RE2 正規表示式，且 regex match 是 fully anchored。寫 \`name=~"api"\` 時代表完整匹配 \`api\`，若要包含字串通常要寫成 \`name=~".*api.*"\`。

## 如何把 Prometheus 資料放進 .NET 專案？

Prometheus 提供 HTTP API，後端專案可以呼叫 API 取得 PromQL 結果，再做自訂監控頁、報表或產品內部狀態面板。

原文提到 .NET 可參考 \`prometheus-net\`。需要注意的是，\`prometheus-net\` 常用於在 .NET 服務中暴露 metrics；若目標是查詢 Prometheus server，則可直接呼叫 Prometheus HTTP API。

整合時要先決定：

- 服務是要「暴露 metrics」還是「查詢 metrics」。
- Prometheus endpoint 是否需要內網、token 或 port-forward。
- 查詢結果要即時顯示，還是定期快取。
- Grafana 是否已能滿足需求，是否真的需要自建顯示端。

## 常見問題

### Prometheus Web UI 和 Grafana 差在哪裡？

Prometheus Web UI 適合排查設定、targets 與快速 PromQL 查詢。Grafana 適合建立長期 dashboard、圖表、alert 與團隊監控入口。

### Rancher 裡的 Prometheus Web UI 怎麼開？

可以透過 Rancher UI 找到 Prometheus 服務，也可以用 \`kubectl port-forward\` 把 pod 的 9090 port 轉到本機。

### PromQL 的 instant vector 和 range vector 差在哪裡？

Instant vector 是單一時間點的多組 time series。Range vector 是每組 time series 在一段時間內的多個樣本，常搭配 \`rate()\`、\`avg_over_time()\` 等函數。

### Grafana 需要另外安裝 Prometheus data source 嗎？

Grafana 官方文件說明 Prometheus data source 已預裝在 Grafana 中。使用者通常只需要新增 data source 設定與 Prometheus URL。

### .NET 專案可以讀 Prometheus 資料嗎？

.NET 專案可以透過 Prometheus HTTP API 查詢 PromQL 結果。若是要讓 .NET 服務被 Prometheus 監控，則可使用 \`prometheus-net\` 暴露 metrics endpoint。

## 參考資料

- Prometheus Querying basics: <https://prometheus.io/docs/prometheus/latest/querying/basics/>
- Grafana Prometheus data source documentation: <https://grafana.com/docs/grafana/latest/datasources/prometheus/>
- prometheus-net GitHub repository: <https://github.com/prometheus-net/prometheus-net>

## 延伸閱讀

- [Prometheus Exporter 是什麼：資料格式、Targets 與 PromQL 查詢](/post/prometheus-exporter-metrics)：同樣聚焦 Prometheus、Grafana，可接著比較不同情境的做法。
- [如何用 PromQL 查詢某個 Pod 內所有的指標值？](/post/prometheus-query-pod-metrics)：同樣聚焦 Prometheus、PromQL，可接著比較不同情境的做法。
- [Prometheus Operator 是什麼？Kubernetes 監控的自動化利器](/post/prometheus-operator)：同樣聚焦 Prometheus、監控，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2026-08-28，內容依 Prometheus 與 Grafana 官方文件補齊查詢型態說明。

`;export{e as default};