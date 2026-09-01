var e=`---
title: K8S裡CPU和MEMORY的計算單位
description: 在 Kubernetes 中限制 Pod 資源或設定 HPA 前，必須先看懂 kubectl top 顯示的 CPU(m) 與 Memory(Mi) 單位。本文完整解析 1000m=1 vCore、Mi 與 MB 換算等 K8s 資源計算單位。
date: 2022-11-08
category: DevOps
tags: [Kubernetes, K8s, CPU, Memory, HPA]
readingTime: 4 分鐘
image: /images/tech/hero_kubernetes-cpu-memory-units.webp
imageAlt: Kubernetes 容器資源管理示意圖，藍色調的貨櫃碼頭與起重機
---


# K8S裡CPU和MEMORY的計算單位

在 K8S 裡我可以對資源做 resource isolation，限制 Pod 所使用的資源，或者設立 HPA 去決定何時要自動擴展/縮小。要做這些設定之前，就必須先了解 K8S 裡所用的度量單位的意義，才能正確地讀取資源利用率指標。

## 如何用 kubectl 讀取 Pod 內資源使用狀況？

使用 \`kubectl top\` 指令讀取 Pod 的資源使用狀況：

\`\`\`cmd
kubectl top pod srs-core1-dbbb776bd-5s9rz -n srs3
\`\`\`

會得到下面的回應：

\`\`\`cmd
NAME                        CPU(cores)   MEMORY(bytes)
srs-core1-dbbb776bd-5s9rz   3m           73Mi
\`\`\`

如果要確認 Pod 裡面不同 Container 所使用的資源，加上 \`--containers\` 參數：

\`\`\`cmd
kubectl top pod srs-core1-dbbb776bd-5s9rz -n srs3 --containers
\`\`\`

會得到以下回應：

\`\`\`cmd
POD                         NAME            CPU(cores)   MEMORY(bytes)
srs-core1-dbbb776bd-5s9rz   filebeat        1m           60Mi
srs-core1-dbbb776bd-5s9rz   json-exporter   2m           7Mi
srs-core1-dbbb776bd-5s9rz   logrotate       1m           0Mi
srs-core1-dbbb776bd-5s9rz   srs-core1       1m           5Mi
\`\`\`

## 如何取得 Node 的資源使用資訊？

同樣用 \`kubectl top\` 讀取 Node 層級的資訊：

\`\`\`cmd
kubectl top node qatk8sworker01 -n srs3
\`\`\`

會得到以下回應：

\`\`\`cmd
NAME             CPU(cores)   CPU%   MEMORY(bytes)   MEMORY%
qatk8sworker01   1280m        32%    3713Mi          48%
\`\`\`

## K8S 的 CPU 單位 m 是什麼意思？

CPU 設定的單位是 \`m\`（millicore），每 \`1000m = 1 vCore\`，也可以使用分數表示，因此設定的方式可以是：

- \`1\`（相當於 1000m）
- \`0.5\`（相當於 500m）
- \`300m\`（相當於 0.3 Core）

從上面取得 Node 的值可以看到 CPU 的資訊是 \`1280m 32%\`，代表這台 Node 總共有 \`4000m = 4 Core CPU\`。

PS：設定 \`1m\` 是不被允許的，官方建議最低從 \`100m\` 開始。

## K8S 的 Memory 單位 Mi 和 M 有什麼不同？

Memory 設定的單位最低則是從 byte 開始，可以使用單一字母的 \`E, P, T, G, M, K\`，也可以是雙字母的 \`Ei, Pi, Ti, Gi, Mi, Ki\`（比較常見）。單一字母是十進位（1M = 1000 × 1000 bytes），雙字母是二進位（1Mi = 1024 × 1024 bytes）。以下是幾個設定範例：

- \`104857600\`（相當於 100 MiB = 100 × 1024 × 1024）
- \`100M\`（十進位的 100 MB）
- \`100Mi\`（二進位的 100 MiB）

換算關係如下：

\`\`\`txt
128974848 = 129e6 = 129M = 123Mi
123Mi * 1024 * 1024 = 128974848 bytes
129 MB * 1000 * 1000 = 128974848 bytes
\`\`\`

## 怎麼將 Mi 轉成 MB？

以 \`kubectl top node\` 回傳的 \`3713Mi\` 為例：

\`\`\`txt
3713Mi * 1024 * 1024 / 1000 / 1000 = 3893MB
\`\`\`

也就是說二進位的 Mi 值乘上 1024²、再除以 1000²，就能換成十進位的 MB。

## 常見問題

### K8S 裡 1000m 的 CPU 等於多少？

1000m 等於 1 個 vCore。CPU 單位 \`m\` 是 millicore，所以 500m 代表半個 Core、300m 代表 0.3 個 Core。

### 為什麼 K8S 不允許設定 1m 的 CPU？

\`1m\` 低於系統可排程的最小粒度，Kubernetes 官方建議 CPU requests/limits 最低從 \`100m\` 開始設定。

### Mi 和 MB 差在哪裡？

\`Mi\`（Mebibyte）是二進位單位，1Mi = 1024 × 1024 bytes；\`M\`（MB）是十進位單位，1M = 1000 × 1000 bytes。K8S 設定比較常使用 \`Mi\` 系列的雙字母單位。

### 怎麼把 kubectl top 顯示的 Mi 換算成 MB？

把 Mi 值乘上 1024 × 1024 再除以 1000 × 1000 即可，例如 \`3713Mi ≈ 3893MB\`。

## 參考資料

- [Kubernetes 官方文件：Resource Management for Pods and Containers](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/)

## 延伸閱讀

- [Kubernetes HPA 如何用 Prometheus 自訂指標擴縮 Pod](/post/kubernetes-hpa-custom-metrics-prometheus)：同樣聚焦 Kubernetes、HPA，可接著比較不同情境的做法。
- [使用 Prometheus 自定義指標為 Kubernetes 做 HPA 縮放](/post/prometheus-custom-metrics-kubernetes-hpa)：同樣聚焦 Kubernetes、HPA，可接著比較不同情境的做法。
- [Helm 是什麼？Kubernetes 套件管理器安裝與部署 Chart 實作筆記](/post/helm-deploy-k8s)：同樣聚焦 Kubernetes、K8s，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2022-11-08，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};