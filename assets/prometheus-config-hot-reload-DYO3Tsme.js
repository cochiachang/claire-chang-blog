var e=`---
title: Prometheus 執行時更新 config 的兩種方式
description: 介紹 Prometheus 不重啟服務就套用新設定的兩種方法：SIGHUP 訊號與 /-/reload API。
date: 2022-11-07
category: DevOps
tags: [Prometheus, 監控, Kubernetes, Rancher]
readingTime: 3 分鐘
image: /images/tech/hero_prometheus-config-hot-reload.webp
imageAlt: 資料中心伺服器機櫃特寫
---


# Prometheus 執行時更新 config 的兩種方式

Prometheus 支援在不中斷服務的情況下重新載入設定檔。只要新的 config 格式正確，就能讓改動立刻生效，不必重啟整個 Prometheus process，這對正在跑監控的環境特別重要——重啟代表短暫失去監控能力。

## Prometheus 為什麼可以不重啟就套用新設定？

Prometheus 官方文件說得很直接：

> Prometheus can reload its configuration at runtime. If the new configuration is not well-formed, the changes will not be applied. A configuration reload is triggered by sending a SIGHUP to the Prometheus process or sending a HTTP POST request to the /-/reload endpoint (when the --web.enable-lifecycle flag is enabled). This will also reload any configured rule files.

重點有兩個：第一，設定檔會先被驗證，格式有問題就直接不套用，原本跑著的設定不受影響；第二，重載的觸發方式有兩種，一種是傳統的 Unix 訊號，一種是 HTTP API。連 rule files（告警規則）也會一併重新載入，不用另外處理。

來源：[Prometheus 官方 Configuration 文件](https://prometheus.io/docs/prometheus/latest/configuration/configuration/)

## 方法一：對 Prometheus process 送 SIGHUP

如果能直接摸到 Prometheus 的 process，最簡單的做法是送 SIGHUP：

\`\`\`cmd
kill -HUP  pid
\`\`\`

這種方式不需要額外開任何參數，缺點是你得先知道 pid，在容器化環境裡通常不會這樣操作。

## 方法二：呼叫 /-/reload API

第二種方式是對 Prometheus 發送 HTTP POST 請求：

\`\`\`cmd
curl -XPOST http://127.0.0.1:9090/-/reload
\`\`\`

這個 endpoint 預設是關閉的，要先在啟動參數加上 \`--web.enable-lifecycle\` 才能用。在 Kubernetes / Rancher 這類用 Deployment 或 StatefulSet 管理 Prometheus 的環境下，這是比送訊號更實際的做法——直接在 container args 裡加這個 flag：

\`\`\`yaml
template:
    metadata:
      labels:
        ...
        prometheus: rancher-monitoring-prometheus
    spec:
      containers:
      - args:
        - --web.enable-lifecycle
        image: rancher/mirrored-prometheus-prometheus:v2.27.1
        imagePullPolicy: IfNotPresent
        name: prometheus
        ....
\`\`\`

加上這個參數重新部署後，之後任何時候改了 ConfigMap 或 scrape config，都可以直接打 \`/-/reload\` 讓它生效，不用重啟整個 Pod。

## 常見問題

### 兩種方式可以同時用嗎？

可以。SIGHUP 和 \`/-/reload\` 只是觸發重載的不同管道，效果一樣，看你的環境哪種比較方便操作就選哪種。

### 沒有加 \`--web.enable-lifecycle\` 會怎樣？

呼叫 \`/-/reload\` 會被拒絕。這個 flag 預設關閉是因為它會暴露一個能觸發重載的公開 endpoint，等於變相的攻擊面，正式環境要評估好再開。

### 新設定寫錯了會發生什麼事？

Prometheus 會驗證新的設定檔，格式不對就不會套用，原本執行中的設定繼續運作，不會因為一次錯誤的改動就整個中斷監控。

## 參考資料
- Prometheus 官方文件，Configuration 頁面（SIGHUP、\`/-/reload\` 與 \`--web.enable-lifecycle\` 說明），存取日期：2026-08-27。[https://prometheus.io/docs/prometheus/latest/configuration/configuration/](https://prometheus.io/docs/prometheus/latest/configuration/configuration/)

## 延伸閱讀

- [Prometheus Operator 是什麼？Kubernetes 監控的自動化利器](/post/prometheus-operator)：同樣聚焦 Prometheus、Kubernetes，可接著比較不同情境的做法。
- [Prometheus 如何查看監控目標的 exporter 資訊](/post/prometheus-exporter-target-info)：同樣聚焦 Prometheus、Kubernetes，可接著比較不同情境的做法。
- [Prometheus json_exporter 設定教學：把 JSON API 轉成監控指標](/post/prometheus-json-exporter)：同樣聚焦 Prometheus、Kubernetes，可接著比較不同情境的做法。
`;export{e as default};