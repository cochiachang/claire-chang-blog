var e=`---
title: Docker 推送到 AKS 教學：用 Docker Desktop 把 image 部署到 Azure Container Instances
description: 這篇教學筆記說明如何把 Docker image 推送到 AKS／Azure：用 docker login azure 連接 Azure 帳號、建立 ACI context 一鍵部署容器，並示範把自建 image tag 成 azurecr.io 格式後用 docker push 推送到 Azure Container Registry 的完整流程。
date: 2023-08-25
category: DevOps
tags: [Docker, AKS, Azure, Container]
readingTime: 3 分鐘
image: /images/tech/hero_push-docker-image-to-aks.webp
imageAlt: Docker 與 Azure 雲端容器部署流程示意圖
---


# Docker 推送到 AKS 教學：用 Docker Desktop 把 image 部署到 Azure Container Instances

想把本機的 Docker image 部署到 Azure 上，其實不需要寫一長串的 az CLI 指令。這篇筆記整理我實際操作過的最短路徑：先讓 Docker 與 Azure 帳號連接、建立 ACI context，再用一個指令把 image 跑起來，最後補上推送自建容器到 Azure Container Registry 的流程。

## 如何把 Docker 和 Azure 帳號連接起來？

首先要登入 Azure，讓 Docker 和 Azure 帳號做連接：

\`\`\`bash
docker login azure
\`\`\`

執行後會跳出瀏覽器，登入 Azure 的帳號即可完成綁定。官方的整合說明可以參考 [Docker 的 ACI 整合文件](https://docs.docker.com/cloud/aci-integration/)。

## 怎麼建立 ACI 的 context？

接著建立 aci 的 context：

\`\`\`bash
docker context create aci myacicontext
\`\`\`

使用 \`docker context ls\` 可以檢視現在有哪些 context，確認 myacicontext 已經建立成功。

## 如何把 image 部署到 AKS？

建立好 context 之後，這樣就可以把 image 部署上 AKS 了：

\`\`\`bash
docker --context myacicontext run -p 80:80 nginx
\`\`\`

這行指令會透過 myacicontext 把 nginx 容器跑在 Azure 上，並把 80 port 對外開放。整條流程從登入到部署，其實只需要三個指令。

## 如何推送自建的 container 到 Azure？

如果要部署自己 build 的 image，可以參考 [Microsoft Learn 的容器部署練習](https://learn.microsoft.com/zh-tw/training/modules/intro-to-containers/7-exercise-deploy-docker-image-to-container-instance)，流程分兩步：

1. 在 Azure 中建立容器登錄檔（Container Registry）。
2. 為 image 改名並推送上去：

\`\`\`bash
docker tag reservationsystem:latest <registry-name>.azurecr.io/reservationsystem:latest
docker image ls
docker login <login-server>
docker push <registry-name>.azurecr.io/reservationsystem:latest
\`\`\`

先把 image tag 成 \`<registry-name>.azurecr.io/...\` 的格式，登入 registry 的 login server，再用 \`docker push\` 推上去，之後就能從 Azure 端部署這個 image。

## 常見問題

### 一定要有 AKS 叢集才能用 docker context aci 嗎？

不用。\`docker context create aci\` 走的是 Azure Container Instances（ACI）整合，容器會直接跑在 ACI 上，不需要預先建立 AKS 叢集。若目標是正式的 AKS，仍建議走 ACR + Kubernetes 部署流程。

### docker login azure 之後沒有跳出瀏覽器怎麼辦？

確認本機的 Docker Desktop 版本有支援 azure 登入擴充，並檢查是否在無 GUI 的遠端環境執行。遠端環境可改用裝置碼登入，或先在本地完成授權再同步設定。

### 推送 image 到 azurecr.io 前一定要 docker tag 嗎？

要。Azure Container Registry 只接受位於自己 registry 網域下的 image 名稱，所以必須先用 \`docker tag\` 把 image 標成 \`<registry-name>.azurecr.io/<image>:<tag>\` 的格式才能 push。

## 參考資料

- [Docker ACI integration 官方文件](https://docs.docker.com/cloud/aci-integration/)
- [Microsoft Learn：部署 Docker image 到容器執行個體](https://learn.microsoft.com/zh-tw/training/modules/intro-to-containers/7-exercise-deploy-docker-image-to-container-instance)

## 延伸閱讀

- [Docker 初探：安裝、常用指令與容器管理入門筆記](/post/docker-introduction-basics)：同樣聚焦 Docker、Container，可接著比較不同情境的做法。
- [Docker 刪除所有 tag 為 None 的 image：清理 dangling images 指令](/post/docker-remove-none-tag-images)：同樣聚焦 Docker，可接著比較不同情境的做法。
- [docker pull failed to register layer 錯誤怎麼解？](/post/docker-pull-failed-to-register-layer)：同樣聚焦 Docker，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2023-08-25，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};