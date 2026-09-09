var e=`---
title: 在 Kubernetes 上使用 Prometheus Pushgateway：用途、陷阱與部署範例
description: 說明 Prometheus Pushgateway 為什麼存在、何時該用與何時不該用，並提供在 Kubernetes 上以 Deployment 與 Service 部署 Pushgateway、推送與查詢指標的完整範例。
date: 2022-12-16
category: DevOps
tags: [Prometheus, Pushgateway, Kubernetes, 監控]
readingTime: 5 分鐘
image: /images/tech/hero_prometheus-pushgateway-exporter-k8s.webp
imageAlt: Kubernetes 上部署 Prometheus Pushgateway 的操作筆記截圖
---


# 在 Kubernetes 上使用 Prometheus Pushgateway：用途、陷阱與部署範例

這篇文章解決的問題是：Prometheus Pushgateway 該在什麼情境下使用、盲目使用會踩哪些坑，以及如何在 Kubernetes 上實際部署一個 Pushgateway 並推送、查詢指標。內容包含完整的 Deployment/Service YAML 與 curl 指令範例。

## Pushgateway 是什麼？為什麼會存在？

Prometheus Pushgateway 的存在是為了允許臨時和批處理作業將其指標公開給 Prometheus。由於這類工作存在的時間可能不夠長，無法被 Prometheus 主動抓取（pull），因此他們可以將指標推送到 Pushgateway，Pushgateway 然後將這些指標公開給 Prometheus。

## 什麼時候該用 Pushgateway？有哪些陷阱？

我們只建議在某些有限的情況下使用 Pushgateway。盲目地使用 Pushgateway 而不是 Prometheus 通常的 pull 模型來進行一般指標收集時，有幾個陷阱：

- 當通過單個 Pushgateway 監控多個實例時，Pushgateway 既成為單點故障又成為潛在的瓶頸。
- 你失去了 Prometheus 通過 \`up\` 指標（在每次抓取時生成）的自動實例健康監控。
- Pushgateway 永遠不會忘記推送給它的系列，並將它們永遠暴露給 Prometheus，除非這些系列是通過 Pushgateway 的 API 手動刪除的。

當作業的多個實例通過 \`instance\` 標籤或類似物在 Pushgateway 中區分它們的指標時，後一點尤其重要。即使原始實例被重命名或刪除，實例的指標也會保留在 Pushgateway 中。這是因為作為指標緩存的 Pushgateway 的生命週期，從根本上獨立於將指標推送給它的進程的生命週期。

將此與 Prometheus 通常的拉式監控進行對比：當一個實例消失時（有意或無意），其指標將隨之自動消失。使用 Pushgateway 時，情況並非如此，你現在必須手動刪除任何陳舊的指標，或自己自動執行此生命週期同步。

通常，Pushgateway 的唯一有效用例是捕獲「服務級」批處理作業的結果。「服務級」批處理作業是在語義上與特定機器或作業實例不相關的作業（例如，為整個服務刪除多個用戶的批處理作業）。此類作業的指標不應包含機器或實例標籤，以將特定機器或實例的生命週期與推送的指標分離，這減少了在 Pushgateway 中管理陳舊指標的負擔。

## 怎麼取得 Pushgateway 的 image？

官方檔案：<https://hub.docker.com/r/prom/pushgateway>

或在 cmd 輸入：

\`\`\`cmd
docker pull prom/pushgateway
\`\`\`

## 怎麼在 Kubernetes 建立含有 Pushgateway 的 Pod？

為 Pushgateway 寫 Deployments：

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: pushgateway
  name: pushgateway
  namespace: default
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: pushgateway
    spec:
      containers:
      - image: prom/pushgateway
        imagePullPolicy: Always
        name: pushgateway
        ports:
        - containerPort: 9091
          name: pushgateway
          protocol: TCP
      dnsPolicy: ClusterFirst
      restartPolicy: Always
\`\`\`

## 怎麼為 Pushgateway 的 Pod 建立服務並推送指標？

為 Pushgateway 的 Pod 產生一個 Headless Service，將 Service 指到對應的 Pod：

![Kubernetes 中將 Service 指向 Pushgateway Pod 的設定截圖](/images/articles/prometheus-pushgateway-exporter-k8s-1.webp)

接著到同域名的容器打：

\`\`\`cmd
echo "some_metric 3.14" | curl --data-binary @- http://pushgateway:9091/metrics/job/some_job
\`\`\`

然後就可以用下面指令看資料：

\`\`\`cmd
curl http://pushgateway:9091/metrics
\`\`\`

![透過 curl 查詢 Pushgateway metrics 並看到 some_metric 的截圖](/images/articles/prometheus-pushgateway-exporter-k8s-2.webp)

## 常見問題

### 為什麼 Pushgateway 不適合取代一般的 Pull 監控？

Pushgateway 是單點故障與潛在瓶頸，也會失去 \`up\` 指標的自動健康監控，而且指標永不過期，陳舊資料要手動刪除。它只適合服務級批處理作業的結果收集。

### Pushgateway 裡的陳舊指標會自己消失嗎？

不會。Pushgateway 的生命週期獨立於推送指標的進程，即使原實例被刪除，指標仍會保留，必須透過 API 手動刪除或自行同步生命週期。

### Pushgateway 的預設埠是多少？

\`prom/pushgateway\` image 的預設埠是 9091，推送端點為 \`/metrics/job/<job_name>\`，查詢端點為 \`/metrics\`。

### 什麼是「服務級」批處理作業？

指在語義上與特定機器或實例無關的作業，例如為整個服務批次刪除多個用戶。這類作業的指標不應帶機器或實例標籤，以降低管理陳舊指標的負擔。

## 參考資料

- [prom/pushgateway — Docker Hub 官方檔案](https://hub.docker.com/r/prom/pushgateway)

## 延伸閱讀

- [Prometheus Operator 是什麼？Kubernetes 監控的自動化利器](/post/prometheus-operator)：同樣聚焦 Prometheus、Kubernetes，可接著比較不同情境的做法。
- [Prometheus 如何查看監控目標的 exporter 資訊](/post/prometheus-exporter-target-info)：同樣聚焦 Prometheus、Kubernetes，可接著比較不同情境的做法。
- [Prometheus json_exporter 設定教學：把 JSON API 轉成監控指標](/post/prometheus-json-exporter)：同樣聚焦 Prometheus、Kubernetes，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2022-12-16，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};