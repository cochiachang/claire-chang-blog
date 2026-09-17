var e=`---
title: 把 Prometheus 的資料打到 ELK
description: 想把 Prometheus 的指標資料送進 ELK？這篇 DevOps 筆記用 Metricbeat 的 prometheus 模組定期執行 PromQL 查詢，把結果送到 Logstash 與 ELK，含 Docker 映像檔下載與 metricbeat.yml、prometheus.yml 設定範例。
date: 2022-12-16
category: DevOps
tags: [Prometheus, Metricbeat, ELK, Kubernetes, Logstash]
readingTime: 4 分鐘
image: /images/tech/hero_prometheus-metrics-to-elk.webp
imageAlt: ELK 與 Prometheus 監控儀表板介面截圖
---


# 把 Prometheus 的資料打到 ELK

想把 Prometheus 裡的指標資料送進 ELK 做長期保存與分析，最省事的做法是透過 Metricbeat 內建的 prometheus 模組。這篇筆記記錄從下載 Docker 映像檔、在 Kubernetes 建 Metricbeat Pod，到設定 metricbeat.yml 與 prometheus.yml 兩個 config 的完整流程。

## 怎麼下載 Metricbeat 的 Docker 版本？

Metricbeat 是 Elastic Beats 家族的一員，官方網站有完整介紹：<https://www.elastic.co/beats/metricbeat>。其中給 Prometheus 使用的模組說明在這裡：<https://www.elastic.co/guide/en/beats/metricbeat/current/metricbeat-module-prometheus.html>，官方映像檔則發佈在 Docker Hub：<https://hub.docker.com/r/elastic/metricbeat>。

下載映像檔：

\`\`\`bash
docker pull docker.elastic.co/beats/metricbeat:8.5.3
\`\`\`

## 怎麼在 Kubernetes 新建一個 Metricbeat 的 Pod？

設定 metricbeat 的 Deployment，重點是把兩個 config 檔用 ConfigMap 掛進容器內：

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: metricbeat
  namespace: default
spec:
  progressDeadlineSeconds: 600
  replicas: 1
  revisionHistoryLimit: 10
  selector:
    matchLabels:
      workload.user.cattle.io/workloadselector: apps.deployment-srs3-metricbeat
  template:
    spec:
      affinity: {}
      containers:
      - image: dev-registry.xycloud.org/ldr/streaming/metricbeat
        imagePullPolicy: Always
        name: metricbeat
        resources: {}
        terminationMessagePath: /dev/termination-log
        terminationMessagePolicy: File
        volumeMounts:
        - mountPath: /usr/share/metricbeat/metricbeat.yml
          name: vol0
          subPath: metricbeat.yml
        - mountPath: /usr/share/metricbeat/prometheus.yml
          name: vol0
          subPath: prometheus.yml
      dnsPolicy: ClusterFirst
      imagePullSecrets:
      - name: regsecret
      restartPolicy: Always
      schedulerName: default-scheduler
      securityContext: {}
      terminationGracePeriodSeconds: 30
      volumes:
      - configMap:
          defaultMode: 420
          name: filebeat-config
        name: vol0
\`\`\`

## 兩個 config 檔要怎麼設定？

### metricbeat.yml

負責設定模組載入路徑，以及輸出到 Logstash：

\`\`\`yaml
metricbeat.config.modules:
  path: \${path.config}/modules.d/*.yml
  reload.enabled: false
metricbeat.max_start_delay: 10s
output.logstash:
  enabled: true
  hosts: ["logstash-logstash.tool-elk.svc.cluster.local:5043"]
  index: 'metricbeat'
  logging.level: info
logging.metrics.enabled: false
logging.metrics.period: 30s
\`\`\`

### prometheus.yml

負責定義要向 Prometheus 查詢哪些指標。這裡用 \`metricsets: ["query"]\` 搭配自訂 query，每 10 秒向叢集內的 Prometheus 服務查詢一次 \`stream_total_clients_by_pod\` 這個指標：

\`\`\`yaml
- module: prometheus
  metricsets: ["query"]
  hosts: ["http://rancher-monitoring-prometheus.cattle-monitoring-system.svc.cluster.local:9090"]
  period: 10s
  queries:
  - name: "stream_total_clients_by_pod"
    path: "/api/v1/query"
    params:
      query: "stream_total_clients_by_pod"
\`\`\`

最後把這兩個 config mount 進 Pod 的 \`/usr/share/metricbeat\`，Metricbeat 就會依照設定的週期抓取 Prometheus 的查詢結果並送往 Logstash，再由 ELK 收進對應的 index。

## 常見問題

### 為什麼要用 Metricbeat 而不是直接讓 ELK 讀 Prometheus？

ELK 本身不會主動向 Prometheus 抓資料，透過 Metricbeat 的 prometheus 模組可以定期執行 PromQL 查詢，把結果以文件形式送進 Logstash，讓指標資料和日誌在同一套 ELK 中統一查詢。

### prometheus 模組的 metricsets: ["query"] 是什麼意思？

它表示 Metricbeat 不直接抓 exporter 的 /metrics，而是透過 \`/api/v1/query\` 這個 API 執行你在 \`queries:\` 區塊中定義的 PromQL 查詢，並把每個查詢結果轉成一筆 event 送出。

### 兩個 config 檔要放在容器內哪個位置？

都要 mount 到 \`/usr/share/metricbeat\` 底下：\`metricbeat.yml\` 是 Metricbeat 的主設定檔，\`prometheus.yml\` 則是 prometheus 模組的設定。這篇範例用 ConfigMap 搭配 subPath 分別掛載這兩個檔案。

## 參考資料

- [Metricbeat 官網介紹](https://www.elastic.co/beats/metricbeat)
- [Metricbeat Prometheus 模組文件](https://www.elastic.co/guide/en/beats/metricbeat/current/metricbeat-module-prometheus.html)
- [Metricbeat 官方映像檔](https://hub.docker.com/r/elastic/metricbeat)

## 延伸閱讀

- [ELK Stack 是什麼？Elasticsearch、Logstash、Kibana 架構與安裝設定入門](/post/elk-stack-introduction)：同樣聚焦 ELK、Logstash，可接著比較不同情境的做法。
- [Prometheus Operator 是什麼？Kubernetes 監控的自動化利器](/post/prometheus-operator)：同樣聚焦 Prometheus、Kubernetes，可接著比較不同情境的做法。
- [使用 Prometheus 自定義指標為 Kubernetes 做 HPA 縮放](/post/prometheus-custom-metrics-kubernetes-hpa)：同樣聚焦 Prometheus、Kubernetes，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2022-12-16，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};