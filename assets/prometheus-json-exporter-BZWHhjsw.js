var e=`---
title: Prometheus json_exporter 設定教學：把 JSON API 轉成監控指標
description: 說明 Prometheus json_exporter 如何讀取 JSON API，設定 JSONPath metrics，並在 Kubernetes Pod 旁部署 exporter。
date: 2023-04-19
category: DevOps
tags: [Prometheus, json_exporter, Kubernetes, Exporter, 監控]
readingTime: 8 分鐘
image: /images/tech/hero_prometheus-exporter-target-info.webp
imageAlt: graphs of performance analytics on a laptop screen
---


# Prometheus json_exporter 設定教學：把 JSON API 轉成監控指標

Prometheus json_exporter 適合把既有 JSON API 轉成 Prometheus 可 scrape 的 metrics。核心做法是先用 JSONPath 在 \`config.yml\` 定義要抽取的欄位，再讓 Prometheus 透過 \`/probe\` 呼叫 json_exporter，最後把回傳的 metrics 接到 Grafana 或 PromQL 查詢。

## Prometheus json_exporter 是什麼？

Prometheus json_exporter 是一個用 JSONPath 抓取遠端 JSON 的 Prometheus exporter。Prometheus json_exporter 會把 JSON 欄位轉成 Prometheus metrics，讓原本沒有 \`/metrics\` endpoint 的服務也能被監控。

Prometheus exporter 是監控資料的提供端；Prometheus 會定期 scrape exporter endpoint，取得時間序列資料。json_exporter 的定位比較特殊：被監控服務仍然提供 JSON API，json_exporter 負責把 JSON response 轉譯成 Prometheus 格式。

官方專案對 json_exporter 的描述是「scrapes remote JSON by JSONPath」，也就是用 JSONPath 從遠端 JSON 抽取資料（prometheus-community/json_exporter，存取日期：2026-08-28）。這篇筆記保留我當時以 SRS stream API 為例的設定，把 \`clients\`、\`send_bytes\`、\`recv_bytes\`、\`frames\` 與 \`publish.active\` 轉成可查詢指標。

## json_exporter 應該怎麼部署在服務旁邊？

json_exporter 建議和被監控的服務部署在同一個 Pod 或同一台主機旁。Prometheus 官方建議每個 exporter 監控一個 application instance，讓服務發現留在 Prometheus，而不是讓 exporter 自己管理一批目標。

Prometheus 官方 Writing exporters 文件指出，exporter 最好坐在被監控 instance 旁邊，且一個 exporter 對應一個 application instance（Prometheus Docs，存取日期：2026-08-28）。放在 Kubernetes Pod 裡時，常見做法是 sidecar container：主要服務負責提供 JSON API，json_exporter 在同一個 Pod 內用 \`127.0.0.1\` 呼叫主要服務。

這樣部署的好處有三個：

| 設計 | 好處 |
|---|---|
| json_exporter 與主要服務在同一個 Pod | 可直接用 localhost 呼叫內部 API，減少網路與權限變數 |
| 每個 Pod 各自帶一個 json_exporter | Prometheus 可以清楚知道是哪個 instance 回傳 metrics |
| 服務發現交給 Prometheus 或 Prometheus Operator | target 狀態、label 與 scrape error 更容易排查 |

我當時的截圖顯示的是 sidecar 部署概念；目前本 repo 沒有該截圖的本機檔案，因此本文改用文字與 YAML 保留部署邏輯。

## JSON API 範例資料長什麼樣？

JSON API 範例資料代表 SRS stream 狀態，每個 stream 物件包含連線數、流量、影格與推流狀態。json_exporter 需要先知道 JSON 結構，才能用 JSONPath 抽出 metrics value 與 label。

這篇筆記使用的 JSON 範例如下：

\`\`\`json
{
  "code": 0,
  "server": "vid-69t27o3",
  "streams": [
    {
      "id": "vid-0diw412",
      "name": "livestream",
      "vhost": "vid-y000397",
      "app": "live",
      "tcUrl": "rtmp://172.16.46.86:1935/live",
      "url": "/live/livestream",
      "live_ms": 1681903514993,
      "clients": 4,
      "frames": 0,
      "send_bytes": 45370,
      "recv_bytes": 34930,
      "kbps": {
        "recv_30s": 0,
        "send_30s": 0
      },
      "publish": {
        "active": false
      },
      "video": null,
      "audio": null
    }
  ]
}
\`\`\`

這份資料的監控重點不是整包 JSON，而是 \`streams[]\` 裡每條 stream 的數值。實務上會先選出穩定欄位當 label，例如 \`name\`；再選出可量測欄位當 value，例如 \`clients\`、\`send_bytes\`、\`recv_bytes\` 與 \`frames\`。

## json_exporter 的 config.yml 要怎麼寫？

json_exporter 的 \`config.yml\` 會定義 module、metrics、JSONPath、labels 與 values。Prometheus 呼叫 \`/probe?module=default&target=...\` 時，json_exporter 會用對應 module 解析目標 JSON。

當時使用的 \`config.yml\` 如下，本文保留欄位與指令意圖：

\`\`\`yaml
modules:
  default:
    metrics:
      - name: server
        path: "{ .server}"

      - name: stream_clients
        type: object
        help: Example of sub-level value scrapes from a json
        path: '{.streams[?(@.name!="")]}'
        labels:
          name: '{.name}'
        values:
          clients: '{.clients}'
          send_bytes: '{.send_bytes}'
          recv_bytes: '{.recv_bytes}'
          frames: '{.frames}'
          publish: '{.publish.active}'

    headers:
      X-Dummy: my-test-header
\`\`\`

這段設定會從 \`streams\` 陣列中挑出 \`name\` 不為空的項目，並把同一個物件底下的欄位轉成 metrics。資訊增益：我會把這類設定拆成「label 欄位」與「value 欄位」檢查；label 應該穩定且低基數，value 才是會隨時間變動的監控數字。

## Kubernetes Pod 裡如何掛載 json_exporter？

Kubernetes 裡部署 json_exporter 時，可以把 exporter 當成 sidecar container，並用 ConfigMap 掛載 \`config.yml\`。json_exporter container 啟動時用 \`--config.file\` 指向掛載後的設定檔。

這段 Deployment 片段只整理縮排，保留當時的設定意圖：

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app.kubernetes.io/instance: srs-core1
  name: srs-core1
  namespace: stu-srs
spec:
  template:
    metadata:
      labels:
        app.kubernetes.io/instance: srs-core1
    spec:
      containers:
        # Other container here
        - image: dev-registry.xycloud.org/ldr/streaming/json-exporter
          imagePullPolicy: IfNotPresent
          name: json-exporter
          resources: {}
          terminationMessagePath: /dev/termination-log
          terminationMessagePolicy: File
          args: ["--config.file", "/config.yml"]
          volumeMounts:
            - mountPath: /config.yml
              name: json-exporter
              subPath: config.yml
      volumes:
        - configMap:
            defaultMode: 420
            name: json-exporter
          name: json-exporter
\`\`\`

正式環境還要補上 container port、readiness probe、resource requests/limits，以及對外供 Prometheus scrape 的 Service。這段範例沒有包含 Service 與 ServiceMonitor，因此這篇只把缺口標出，不替實際叢集 invent selector。

## 如何測試 json_exporter 是否吐出 metrics？

測試 json_exporter 時，先進入同一個 Pod 或同一個 network namespace，直接 curl \`/probe\` endpoint。只要 \`target\` 指到 JSON API，json_exporter 就會依 \`module\` 設定回傳 Prometheus metrics。

這篇筆記保留的測試指令如下：

\`\`\`bash
curl "http://localhost:7979/probe?target=http://127.0.0.1:1985/api/v1/streams/"
\`\`\`

若有多個 module，建議明確帶上 \`module=default\`：

\`\`\`bash
curl "http://localhost:7979/probe?module=default&target=http://127.0.0.1:1985/api/v1/streams/"
\`\`\`

測試時先看三件事：

1. \`/probe\` 是否回傳 Prometheus text format，而不是 JSON 或 HTML error。
2. metrics 名稱是否符合預期，例如 \`stream_clients_clients\`、\`stream_clients_send_bytes\`。
3. label 是否出現預期值，例如 \`name="livestream"\`。

## Prometheus 要怎麼 scrape json_exporter？

Prometheus scrape json_exporter 時，通常把 exporter 本身當 target，再用 \`params.target\` 指定真正的 JSON API。Prometheus 設定檔可透過 \`metrics_path\`、\`params\` 與 static 或動態 target 設定完成。

Prometheus configuration 文件說明，\`scrape_config\` 會定義 targets 與 scrape 參數，\`metrics_path\` 預設是 \`/metrics\`，但可以改成其他 HTTP path（Prometheus Docs，存取日期：2026-08-28）。json_exporter 的常見寫法會把 \`metrics_path\` 設成 \`/probe\`：

\`\`\`yaml
scrape_configs:
  - job_name: srs-json-exporter
    metrics_path: /probe
    params:
      module: [default]
      target: [http://127.0.0.1:1985/api/v1/streams/]
    static_configs:
      - targets:
          - json-exporter.stu-srs.svc.cluster.local:7979
\`\`\`

若使用 Prometheus Operator，通常會改用 ServiceMonitor 管理 scrape 設定。這時要確認 Service label、ServiceMonitor selector、port name 與 namespaceSelector 都對得上；相關排查可接著看站內文章〈Prometheus 如何查看監控目標的 exporter 資訊〉。

## 常見問題

### Prometheus json_exporter 和一般 Exporter 差在哪裡？
Prometheus json_exporter 不直接讀系統狀態，而是把遠端 JSON API 轉成 Prometheus metrics。一般 exporter 多半內建特定系統的採集邏輯，例如 node_exporter 讀主機指標，json_exporter 則需要自己寫 JSONPath 設定。

### json_exporter 一定要和主要服務放同一個 Pod 嗎？
json_exporter 不一定要和主要服務放同一個 Pod，但在 Kubernetes 裡用 sidecar 部署最容易維持一個 exporter 對應一個 application instance。若 JSON API 是外部設備或無法部署 sidecar 的服務，就要改用 Prometheus target 與 relabeling 管理目標。

### json_exporter 的 target 要寫在 exporter 還是 Prometheus？
json_exporter 的 target 通常由 Prometheus scrape 設定傳入 \`/probe\` query string。這樣做可以讓 Prometheus 保留 target 與 label 資訊，符合 Prometheus 官方把 service discovery 放在 Prometheus 端的設計。

### JSONPath label 應該怎麼選？
JSONPath label 應該選穩定、可分辨來源、基數不會爆炸的欄位，例如 stream name、service name 或 instance name。不建議把 request id、timestamp 或高變動字串當 label，否則 Prometheus time series 數量會快速膨脹。

### json_exporter 回傳 metrics 但 Grafana 查不到怎麼辦？
先在 Prometheus Targets 確認 scrape 是否成功，再到 Graph 頁面查 metrics 名稱。若 Prometheus 查得到但 Grafana 查不到，多半是 Grafana data source、dashboard query、label selector 或時間範圍設定問題。

### json_exporter 可以用 HTTP header 呼叫 JSON API 嗎？
json_exporter 可以在 module 設定 headers。這段範例使用 \`X-Dummy: my-test-header\`，實務上也可用於內部 API 需要固定 header 的情境；若涉及 token，建議用 Kubernetes Secret 或安全的設定管理方式處理，不要把敏感值寫進文章或公開 repo。

## 參考資料

- Prometheus Docs：[Writing exporters](https://prometheus.io/docs/instrumenting/writing_exporters/)（存取日期：2026-08-28）
- Prometheus Docs：[Configuration](https://prometheus.io/docs/prometheus/latest/configuration/configuration/)（存取日期：2026-08-28）
- prometheus-community/json_exporter GitHub repository：<https://github.com/prometheus-community/json_exporter>（存取日期：2026-08-28）

## 延伸閱讀

- [Prometheus Exporter 是什麼：資料格式、Targets 與 PromQL 查詢](/post/prometheus-exporter-metrics)：同樣聚焦 Prometheus、Exporter，可接著比較不同情境的做法。
- [Prometheus 如何查看監控目標的 exporter 資訊](/post/prometheus-exporter-target-info)：同樣聚焦 Prometheus、Kubernetes，可接著比較不同情境的做法。
- [Prometheus Operator 是什麼？Kubernetes 監控的自動化利器](/post/prometheus-operator)：同樣聚焦 Prometheus、Kubernetes，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2026-08-28。這篇筆記最早發布於 2023-04-19，本文保留 SRS JSON API、json_exporter \`config.yml\`、Kubernetes sidecar 部署片段與 curl 測試指令，並補上 Prometheus scrape 設定、FAQ 與官方參考資料。
`;export{e as default};