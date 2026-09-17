var e=`---
title: Kubernetes 常用指令筆記：從 YAML 建立 Pod 與 ReplicationController
description: 用一份 redis-master-controller.yaml 範本，示範 kubectl create -f、kubectl get rc、kubectl get pods、kubectl describe rc 等 Kubernetes 入門常用指令，快速上手叢集操作。
date: 2021-11-06
category: DevOps
tags: [Kubernetes, kubectl, DevOps, 容器, YAML]
readingTime: 3 分鐘
image: /images/tech/hero_kubernetes-commands-notes.webp
imageAlt: 藍色立體方塊上印有 Kubernetes 舵輪標誌，象徵容器編排
---


# Kubernetes 常用指令筆記：從 YAML 建立 Pod 與 ReplicationController

這篇是我的 Kubernetes 入門指令筆記：從一份 \`redis-master-controller.yaml\` 範本出發，
示範如何用 \`kubectl\` 建立 Pod、查看 ReplicationController 與 Pod 狀態。如果你剛開始
接觸 Kubernetes，這幾條指令就是每天操作叢集的基本功。

## 如何用 YAML 範本建立 ReplicationController？

先準備一份 YAML 定義檔，描述要跑的容器、副本數與標籤選擇器：

\`\`\`yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: redis-master
  labels:
    name: redis-master
spec:
  replicas: 1
  selector:
    name: redis-master
  template:
    metadata:
      labels:
        name: redis-master
    spec:
      containers:
      - name: master
        image: kubeguide/redis-master
        ports:
        - containerPort: 6379
\`\`\`

這份 \`redis-master-controller.yaml\` 定義了一個 ReplicationController：它會維持
1 個副本，透過 \`name: redis-master\` 這組標籤選擇器找到自己管理的 Pod，並啟動
\`kubeguide/redis-master\` 映像、開放 6379 埠（Redis 預設埠）。

## 怎麼用 kubectl 建立 Pod？

寫好 YAML 之後，用 \`-f\` 指定檔案送進叢集：

\`\`\`bash
kubectl create -f redis-master-controller.yaml
\`\`\`

執行後 Kubernetes 會依照定義建立 ReplicationController，並由它拉起對應的 Pod。

## 怎麼查看 ReplicationController 與 Pod 狀態？

建立完成後，可以用這幾條指令確認資源狀態：

\`\`\`bash
# 查看這個 ReplicationController
kubectl get rc

# 查看現有的 Pod
kubectl get pods

# 查看現有 ReplicationController 的詳細狀態
kubectl describe rc frontend
\`\`\`

- \`kubectl get rc\`：列出叢集裡所有 ReplicationController，可以看到想要的副本數與目前就緒數。
- \`kubectl get pods\`：列出目前所有的 Pod，確認剛建立的 Pod 是否進入 \`Running\`。
- \`kubectl describe rc <名稱>\`：顯示單一 ReplicationController 的完整資訊，
  包含事件（Events），排查 Pod 起不來時特別有用。

## 常見問題

### kubectl create -f 和 kubectl apply -f 有什麼差別？

\`create -f\` 是一次性建立，資源已存在時會報錯；\`apply -f\` 是宣告式套用，可以反覆執行來更新設定。實務上日常維運較建議用 \`apply\`。

### ReplicationController 和 Deployment 差在哪裡？

ReplicationController 只負責維持指定數量的 Pod 副本；Deployment 則在此之上支援滾動更新、版本回溯等能力。現在新的專案大多直接使用 Deployment。

### kubectl get pods 之後要怎麼看 Pod 詳細資訊？

用 \`kubectl describe pod <pod名稱>\` 可以看到事件、容器狀態與重啟原因。若要看即時日誌，則用 \`kubectl logs <pod名稱>\`。

### kubectl describe rc 是做什麼用的？

它會顯示某個 ReplicationController 的完整狀態，包含副本數、標籤選擇器與 Events。當 Pod 建立失敗或數量對不上時，先看這裡的事件訊息通常就能找到原因。

## 參考資料

- [Kubernetes 官方文件：kubectl Command Reference](https://kubernetes.io/docs/reference/kubectl/)
- [Kubernetes 官方文件：ReplicationController](https://kubernetes.io/docs/concepts/workloads/controllers/replicationcontroller/)

## 延伸閱讀

- [使用 kubectl exec 進入 Pod 裡的 Container：完整指令教學](/post/kubectl-exec-into-container)：同樣聚焦 Kubernetes、kubectl，可接著比較不同情境的做法。
- [使用 Prometheus 自定義指標為 Kubernetes 做 HPA 縮放](/post/prometheus-custom-metrics-kubernetes-hpa)：同樣聚焦 Kubernetes、DevOps，可接著比較不同情境的做法。
- [Helm 是什麼？Kubernetes 套件管理器安裝與部署 Chart 實作筆記](/post/helm-deploy-k8s)：同樣聚焦 Kubernetes、DevOps，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2021-11-06，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};