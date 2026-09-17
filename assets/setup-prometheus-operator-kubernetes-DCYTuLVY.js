var e=`---
title: Prometheus Operator 設定教學：在 Kubernetes 建立 ServiceMonitor
description: 說明 Prometheus Operator 的安裝、Deployment、Service、ServiceMonitor、RBAC 與 Prometheus CRD 設定流程。
date: 2022-12-16
category: DevOps
tags: [Prometheus Operator, Kubernetes, ServiceMonitor, 監控]
readingTime: 8 分鐘
image: /images/tech/hero_setup-prometheus-operator-kubernetes.webp
imageAlt: Kubernetes 監控系統與 Prometheus 指標儀表板
---


# Prometheus Operator 設定教學：在 Kubernetes 建立 ServiceMonitor

Prometheus Operator 讓 Kubernetes 監控設定可以用 Custom Resource 管理。典型流程是先安裝 Operator 與 CRD，再建立應用 Deployment、Service、ServiceMonitor，最後建立 Prometheus 物件選取要監控的 ServiceMonitor。

## 安裝 Prometheus Operator 前需要什麼？

安裝 Prometheus Operator 前需要一個可管理 Kubernetes 資源的叢集帳號。因為 Prometheus Operator 會建立 CRD、RBAC 與監控相關資源，操作帳號通常需要 cluster-admin 或等效權限。

先決條件：

- 可連線的 Kubernetes 叢集。
- 已設定好的 \`kubectl\`。
- 可建立 CRD 與 RBAC 的權限。
- 若用 shell 取得最新版，環境需要 \`curl\` 與 \`jq\`。

正式環境建議用 GitOps 或 Helm 管理版本。原稿使用直接套用 bundle 的方式，適合測試或理解 Prometheus Operator 的基本資源關係。

## 如何安裝 Prometheus Operator？

Prometheus Operator 可以透過官方 release bundle 安裝 CRD、RBAC 與 Operator。測試環境可直接抓最新版本 bundle，但正式環境應固定版本，避免不可預期升級。

原稿安裝指令：

\`\`\`bash
LATEST=$(curl -s https://api.github.com/repos/prometheus-operator/prometheus-operator/releases/latest | jq -cr .tag_name)
curl -sL https://github.com/prometheus-operator/prometheus-operator/releases/download/\${LATEST}/bundle.yaml | kubectl create -f -
\`\`\`

確認 Operator Pod ready：

\`\`\`bash
kubectl wait --for=condition=Ready pods \\
  -l app.kubernetes.io/name=prometheus-operator \\
  -n default
\`\`\`

如果叢集已有 kube-prometheus-stack、Rancher Monitoring 或 OpenShift Monitoring，請先確認是否已安裝 Operator，避免重複管理 CRD 與相同資源。

## 如何建立被監控的範例應用？

Prometheus Operator 不會直接監控 Deployment。Prometheus 透過 ServiceMonitor 選取 Service，再由 Service 指向 Pod，所以 Deployment、Service 與 label 必須對齊。

範例 Deployment：

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: example-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: example-app
  template:
    metadata:
      labels:
        app: example-app
    spec:
      containers:
        - name: example-app
          image: fabxc/instrumented_app
          ports:
            - name: web
              containerPort: 8080
\`\`\`

Service 需要選到同一批 Pod，並把 metrics port 命名為 \`web\`：

\`\`\`yaml
kind: Service
apiVersion: v1
metadata:
  name: example-app
  labels:
    app: example-app
spec:
  selector:
    app: example-app
  ports:
    - name: web
      port: 8080
\`\`\`

## ServiceMonitor 怎麼選到 Service？

ServiceMonitor 的 selector 選的是 Service label，不是 Pod label。ServiceMonitor 的 endpoints port 名稱也必須對應 Service ports 裡的 \`name\`。

範例 ServiceMonitor：

\`\`\`yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: example-app
  labels:
    team: frontend
spec:
  selector:
    matchLabels:
      app: example-app
  endpoints:
    - port: web
\`\`\`

排查 ServiceMonitor 時先看三件事：

1. Service 是否有 \`app: example-app\` label。
2. Service port 名稱是否叫 \`web\`。
3. Prometheus 物件的 \`serviceMonitorSelector\` 是否會選到 \`team: frontend\`。

## Prometheus 物件需要哪些 RBAC？

Prometheus 需要 ServiceAccount 與 RBAC 讀取 nodes、services、endpoints、pods、ingresses 與 metrics。若權限不足，Prometheus 可能無法發現 target 或抓取 metrics。

ServiceAccount：

\`\`\`yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: prometheus
\`\`\`

ClusterRole：

\`\`\`yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: prometheus
rules:
  - apiGroups: [""]
    resources:
      - nodes
      - nodes/metrics
      - services
      - endpoints
      - pods
    verbs: ["get", "list", "watch"]
  - apiGroups: [""]
    resources:
      - configmaps
    verbs: ["get"]
  - apiGroups:
      - networking.k8s.io
    resources:
      - ingresses
    verbs: ["get", "list", "watch"]
  - nonResourceURLs: ["/metrics"]
    verbs: ["get"]
\`\`\`

ClusterRoleBinding：

\`\`\`yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: prometheus
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: prometheus
subjects:
  - kind: ServiceAccount
    name: prometheus
    namespace: default
\`\`\`

## 如何建立 Prometheus CRD 物件？

Prometheus CRD 物件會宣告 Prometheus server 本身，並透過 selector 決定要採用哪些 ServiceMonitor。\`serviceMonitorSelector\` 是團隊自助建立監控規則時最重要的邊界。

範例：

\`\`\`yaml
apiVersion: monitoring.coreos.com/v1
kind: Prometheus
metadata:
  name: prometheus
spec:
  serviceAccountName: prometheus
  serviceMonitorSelector:
    matchLabels:
      team: frontend
  resources:
    requests:
      memory: 400Mi
  enableAdminAPI: false
\`\`\`

驗證 Prometheus 是否啟動：

\`\`\`bash
kubectl get -n default prometheus prometheus -w
\`\`\`

資訊增益建議：把 \`team\` label 當成監控 ownership 邊界。Prometheus 管理者只要設定 selector，前端團隊就能自行建立帶 \`team: frontend\` 的 ServiceMonitor，而不必每次修改 Prometheus 本體設定。

## 常見問題

### Prometheus Operator 是什麼？

Prometheus Operator 是 Kubernetes Operator，用 CRD 管理 Prometheus、Alertmanager、ServiceMonitor 與相關監控資源。Prometheus Operator 可以把監控設定變成 Kubernetes 原生物件。

### ServiceMonitor 是選 Pod 還是 Service？

ServiceMonitor 是選 Service。Pod label 要先被 Service selector 選中，Service label 再被 ServiceMonitor selector 選中。

### endpoints 裡的 port 要填什麼？

ServiceMonitor endpoints 的 \`port\` 要填 Service port 的名稱，不是 containerPort 數字。若 Service port 沒有命名或名稱不一致，target 可能不會產生。

### 為什麼 Prometheus 看不到 target？

常見原因是 Service label 不符合 ServiceMonitor selector、Prometheus 沒有選到 ServiceMonitor、namespace selector 不包含目標 namespace，或 RBAC 權限不足。

### 正式環境可以直接套用 latest bundle 嗎？

正式環境不建議直接套用 latest bundle。固定版本、經過測試再升級，會比每次抓最新 release 更可控。

## 參考資料

- Prometheus Operator GitHub：<https://github.com/prometheus-operator/prometheus-operator>
- Prometheus Operator API Reference：<https://prometheus-operator.dev/docs/api-reference/api/>
- Prometheus Operator RBAC 文件（Kubernetes RBAC 權限設定）：<https://kubernetes.io/docs/reference/access-authn-authz/rbac/>
- Kubernetes Documentation, Service：<https://kubernetes.io/docs/concepts/services-networking/service/>
- OpenShift Monitoring APIs, Prometheus：<https://docs.openshift.com/container-platform/4.11/rest_api/monitoring_apis/prometheus-monitoring-coreos-com-v1.html>

## 延伸閱讀

- [Prometheus Operator 是什麼？Kubernetes 監控的自動化利器](/post/prometheus-operator)：同樣聚焦 Prometheus Operator、Kubernetes，可接著比較不同情境的做法。
- [Prometheus 如何查看監控目標的 exporter 資訊](/post/prometheus-exporter-target-info)：同樣聚焦 Kubernetes、監控，可接著比較不同情境的做法。
- [如何用 PromQL 查詢某個 Pod 內所有的指標值？](/post/prometheus-query-pod-metrics)：同樣聚焦 Kubernetes、ServiceMonitor，可接著比較不同情境的做法。

## 最後更新

2026-08-28

`;export{e as default};