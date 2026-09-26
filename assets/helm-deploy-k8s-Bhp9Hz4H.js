var e=`---
title: Helm 是什麼？Kubernetes 套件管理器安裝與部署 Chart 實作筆記
description: 介紹 Kubernetes 套件管理器 Helm 的架構（Helm CLI 與 Chart）、Chart.yaml/values.yaml/templates 目錄結構，以及 helm install 與 helm upgrade --install 部署到 K8s 的實際指令。
date: 2023-04-21
category: DevOps
tags: [Helm, Kubernetes, K8s, DevOps, 部署]
readingTime: 4 分鐘
image: /images/tech/hero_helm-deploy-k8s.webp
imageAlt: 使用 Helm 將 Chart 部署到 Kubernetes 叢集的示意圖
---


# Helm 是什麼？Kubernetes 套件管理器安裝與部署 Chart 實作筆記

Helm 是 Kubernetes 的套件管理器，這篇筆記整理它的架構組成（Helm CLI 與 Helm Charts）、安裝步驟、Chart 的資料夾結構（Chart.yaml、values.yaml、templates），以及用 \`helm install\` 和 \`helm upgrade --install\` 實際部署到 K8s 的指令。

## Helm 是什麼？它能解決什麼問題？

Helm 是一個 Kubernetes 套件管理器，可以幫助在 Kubernetes 上部署和管理應用程式。Helm 允許定義、安裝和升級 Kubernetes 應用程式，並且可以管理它們的依賴關係。

Helm 由兩部分組成：

- **Helm CLI**：命令列介面，用於管理 Helm Charts。
- **Helm Charts**：包含 Kubernetes 資源描述檔案的打包檔案，例如 Deployment、Service、Ingress、ConfigMap 等等。這些檔案被打包到一個壓縮檔中，通常是 tar.gz 或 zip 格式。

使用 Helm，可以透過建立自己的 Charts 或使用社群提供的 Charts 快速部署應用程式：先用 Helm Charts 定義 Kubernetes 資源，再透過 Helm CLI 安裝 Charts 來建立和管理 Kubernetes 資源。

Helm 還允許管理 Charts 的版本控制，從而可以輕鬆地升級或回滾到先前的版本。此外，Helm 支援模板化和參數化 Charts，因此可以透過使用不同的參數集，在同一環境中把同一個 Chart 部署到不同環境。

## 如何安裝 Helm？

1. 下載 Helm：[下載頁面](https://github.com/helm/helm/releases)有各個作業系統的下載檔案，這邊是官方的安裝指南（[Installing Helm](https://helm.sh/docs/intro/install/)）
2. 解壓 Helm
3. 將 Helm 的執行檔複製到可執行路徑中，Linux 可能為 \`/usr/local/bin/\`，Windows 則為 \`C:\\Users\\my_name\`
4. 驗證 Helm 是否正確安裝，執行以下命令應該會顯示 Helm 的版本資訊：

\`\`\`bash
helm version
\`\`\`

## 如何用 Helm 部署應用到 Kubernetes？

這邊是使用的指令介紹：[https://helm.sh/docs/intro/using_helm/](https://helm.sh/docs/intro/using_helm/)

建立新的專案可用下面指令：

\`\`\`bash
helm install happy-panda bitnami/wordpress
\`\`\`

會有類似這樣的資料夾結構：

![Helm Chart 的資料夾結構截圖，包含 Chart.yaml、values.yaml 與 templates 目錄](/images/articles/helm-deploy-k8s-1.webp)

其中 \`Chart.yaml\` 會在建立時設定好，\`values.yaml\` 可以設定在 templates 要使用的變數，而 \`templates\` 則是放我們要部署的 YAML 設定檔。

接著用下面的指令就可以部署到 K8s 了：

\`\`\`bash
helm upgrade --install -n stu-srs --set APP_ENV=QAT srs-core1 . --values ./values-core1.yaml --version v1.0.0
\`\`\`

## 常見問題

### Helm 和直接寫 kubectl apply 有什麼差別？

Helm 把多個 Kubernetes YAML 打包成一個 Chart 來管理，支援模板化、參數化（values.yaml）、版本控制與一鍵升級回滾，適合管理複雜應用；kubectl apply 則是逐一套用 YAML 檔案，適合簡單或一次性的部署。

### Chart 裡的 values.yaml 是做什麼用的？

values.yaml 用來存放模板變數。templates 目錄中的 YAML 檔可以引用這些變數，部署時透過 \`--set\` 或 \`--values\` 覆寫，讓同一個 Chart 用不同參數部署到不同環境。

### helm upgrade --install 是什麼意思？

它代表「有就升級、沒有就安裝」：如果該 release 不存在就等同 install，存在則執行升級，因此同一條指令可以重複執行而不會出錯。

### 怎麼驗證 Helm 有安裝成功？

執行 \`helm version\`，若正確安裝會顯示 Helm 的版本資訊。

## 參考資料

- [Helm 官方安裝指南](https://helm.sh/docs/intro/install/)
- [Helm 官方使用指令介紹](https://helm.sh/docs/intro/using_helm/)
- [Helm GitHub Releases 下載頁面](https://github.com/helm/helm/releases)

## 延伸閱讀

- [Kubernetes 常用指令筆記：從 YAML 建立 Pod 與 ReplicationController](/post/kubernetes-commands-notes)：同樣聚焦 Kubernetes、DevOps，可接著比較不同情境的做法。
- [K8S裡CPU和MEMORY的計算單位](/post/kubernetes-cpu-memory-units)：同樣聚焦 Kubernetes、K8s，可接著比較不同情境的做法。
- [使用 kubectl exec 進入 Pod 裡的 Container：完整指令教學](/post/kubectl-exec-into-container)：同樣聚焦 Kubernetes、DevOps，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2023-04-21，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};