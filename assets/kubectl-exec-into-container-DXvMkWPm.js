var e=`---
title: 使用 kubectl exec 進入 Pod 裡的 Container：完整指令教學
description: 用 kubectl exec -it 指令進入 Kubernetes Pod 裡的特定 Container 進行除錯，包含 --container 參數、/bin/sh 替代方案、kubeconfig 設定與常見錯誤排查。
date: 2023-04-14
category: DevOps
tags: [Kubernetes, kubectl, Container, DevOps]
readingTime: 3 分鐘
image: /images/tech/hero_kubectl-exec-into-container.webp
imageAlt: 終端機畫面上顯示綠色的命令列輸出文字
---


# 使用 kubectl exec 進入 Pod 裡的 Container：完整指令教學

在管理 Kubernetes 叢集時，我常常需要直接進入某個 Pod 裡的 Container 查看 Log、測試網路連線或檢查設定。這篇文章整理使用 \`kubectl exec\` 進入 Pod 指定 Container 的完整指令寫法，以及搭配的 \`kubeconfig\` 設定方法，讓你在本機就能對叢集下指令。

## 如何用 kubectl exec 進入指定的 container？

若要使用 \`kubectl\` 進入某個 pod 裡的某個 container，可以使用 \`kubectl exec\` 命令。基本範例如下：

\`\`\`bash
kubectl exec -it -n <namespace> <pod_NAME> --container <container_NAME> -- /bin/sh
\`\`\`

請將 \`<pod_name>\` 替換為想要進入的 pod 名稱，將 \`<container_name>\` 替換為想要進入的 container 名稱。

當 Pod 裡只有一個 container 時，可以省略 \`-c\` 參數：

\`\`\`bash
kubectl exec -it -n <namespace> <pod_name> -- /bin/sh
\`\`\`

## container 裡沒有 bash 怎麼辦？

上面的指令會使用 shell 進入 container，如果該 container 的映像檔是精簡版（例如 Alpine 或 distroless），很可能沒有 \`/bin/bash\`，這時可以嘗試使用 \`/bin/sh\` 作為替代：

\`\`\`bash
kubectl exec -it -n <namespace> <pod_name> -c <container_name> -- /bin/sh
\`\`\`

\`--container\` 可以簡寫成 \`-c\`，兩者效果相同。如果連 \`/bin/sh\` 都沒有，可以改用 \`-- /bin/ash\`（Alpine）或直接執行單一命令而不進入互動模式：

\`\`\`bash
kubectl exec -n <namespace> <pod_name> -c <container_name> -- ls /app
\`\`\`

## 進入 container 前需要哪些前置條件？

這些指令假設你已經成功地安裝並設置了 \`kubectl\`，並能夠與 Kubernetes 叢集通信。可用以下指令快速確認：

\`\`\`bash
kubectl config current-context   # 確認目前連線的叢集
kubectl get pods -n <namespace>  # 確認目標 Pod 正在運行
\`\`\`

## 如何設定 kubeconfig 連線到 Kubernetes 叢集？

要配置 \`kubectl\`，你需要一個包含叢集連線資訊的 \`kubeconfig\` 檔案。通常使用雲端服務（如 GKE、EKS 或 AKS）或 Kubernetes 配置工具（如 \`kops\` 或 \`kubeadm\`）建立叢集時，它們會自動生成一個 \`kubeconfig\` 檔案。

\`kubeconfig\` 檔案通常位於 \`~/.kube/config\`。你可以使用環境變數 \`KUBECONFIG\` 來指定 \`kubeconfig\` 檔案的位置，例如：

\`\`\`bash
export KUBECONFIG=~/.kube/my-kubeconfig.yaml
\`\`\`

或者直接將 kubeconfig 檔案的內容複製到 \`~/.kube/config\` 裡面。

下載 [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/) 或 [Lens](https://k8slens.dev/) 圖形化工具，即可於本機對 Kubernetes 叢集下指令：

![使用 Lens 連線 Kubernetes 叢集後的介面截圖](/images/articles/kubectl-exec-into-container-1.webp)

![透過本機終端機對 Kubernetes 叢集成功執行 kubectl 指令的截圖](/images/articles/kubectl-exec-into-container-2.webp)

## 常見問題

### kubectl exec 的 -it 參數是什麼意思？

\`-i\`（stdin）保持標準輸入開啟，\`-t\`（tty）配置一個偽終端機。兩個參數搭配才能在 container 裡使用互動式 shell。

### Pod 裡有多個 container 時要怎麼指定？

用 \`--container\`（或簡寫 \`-c\`）後面接 container 名稱，例如 \`kubectl exec -it <pod> -c <container> -- /bin/sh\`。若不指定，kubectl 會預設選擇 Pod 裡的第一個 container。

### kubectl exec 進去後出現 OCI runtime exec failed 是什麼問題？

通常是 shell 路徑不存在，例如映像檔裡沒有 \`/bin/bash\`。改用 \`/bin/sh\` 或 \`/bin/ash\`，或先執行 \`kubectl exec <pod> -- ls /bin\` 確認有哪些可執行檔。

### kubectl exec 和 kubectl attach 有什麼差別？

\`kubectl exec\` 是在 container 裡啟動一個新的處理程序，適合除錯；\`kubectl attach\` 則是連上 container 主要處理程序的輸入輸出，離開時可能會影響該處理程序。

### 哪裡可以查到 Pod 的 container 名稱？

執行 \`kubectl describe pod <pod_name> -n <namespace>\`，在 Containers 區段可以看到所有 container 的名稱與映像檔；或用 \`kubectl get pod <pod_name> -o jsonpath='{.spec.containers[*].name}'\` 直接列出。

## 參考資料

- [kubectl 官方文件 — kubectl exec](https://kubernetes.io/docs/reference/kubernetes-api/workload-resources/pod-v1/)
- [安裝 kubectl（Windows）](https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/)
- [Lens — Kubernetes IDE](https://k8slens.dev/)

## 延伸閱讀

- [Kubernetes 常用指令筆記：從 YAML 建立 Pod 與 ReplicationController](/post/kubernetes-commands-notes)：同樣聚焦 Kubernetes、kubectl，可接著比較不同情境的做法。
- [Docker 初探：安裝、常用指令與容器管理入門筆記](/post/docker-introduction-basics)：同樣聚焦 Container、DevOps，可接著比較不同情境的做法。
- [使用 Prometheus 自定義指標為 Kubernetes 做 HPA 縮放](/post/prometheus-custom-metrics-kubernetes-hpa)：同樣聚焦 Kubernetes、DevOps，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2023-04-14，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};