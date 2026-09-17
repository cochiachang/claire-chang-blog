var e=`---
title: "docker pull failed to register layer 錯誤怎麼解？"
description: "整理 docker pull 出現 failed to register layer、directory not empty 時的原因與處理順序，保留 Docker 1.10 與 Docker Machine 0.6 的錯誤範例，並補上清理 image、重啟 Docker 引擎與刪除工作目錄前的注意事項。"
date: 2020-11-26
category: DevOps
tags: [Docker, docker pull, Docker layer, DevOps]
readingTime: 4 分鐘
image: /images/tech/hero_docker-pull-failed-to-register-layer.webp
imageAlt: Docker pull 與 Linux 檔案系統 layer 清理示意圖
---


# docker pull failed to register layer 錯誤怎麼解？

\`docker pull\` 出現 \`failed to register layer\`，常見原因是 Docker 本機工作目錄裡的 image layer metadata 狀態混亂，導致新的 layer 下載完後無法註冊。處理時不要一開始就刪整個 Docker 目錄；我會先停止相關容器、刪除有問題的 image，再重拉一次，必要時才重啟 Docker 引擎或清掉 Docker 工作目錄。

## docker pull failed to register layer 是什麼錯誤？

\`docker pull failed to register layer\` 代表 image layer 已下載或解壓到一半，但 Docker daemon 無法把 layer 正常登錄到本機 layer database。錯誤訊息若包含 \`directory not empty\`，多半是本機 layer metadata 目錄已有殘留狀態。

當時遇到的環境是 Docker 1.10.0 與 Docker Machine 0.6.0，在 pull \`java:8\` 時失敗。錯誤發生在 \`/mnt/sda1/var/lib/docker/image/aufs/layerdb/\`，也就是 Docker Machine VM 裡 Docker daemon 使用的 AUFS layer metadata 位置。

\`\`\`cmd
> docker -v
Docker version 1.10.0, build 590d5108
> docker-machine -v
docker-machine version 0.6.0, build e27fb87
> docker pull java:8
8: Pulling from library/java
03e1855d4f31: Extracting [==================================================>] 51.36 MB/51.36 MB
a3ed95caeb02: Download complete
9269ba3950bb: Download complete
6ecee6444751: Download complete
5b865d39f77d: Download complete
e7e5c0273866: Download complete
6a4effbc4451: Download complete
4b6cb08bb4bc: Download complete
7b07ad270e2c: Download complete
failed to register layer: rename /mnt/sda1/var/lib/docker/image/aufs/layerdb/tmp/layer-273420626 /mnt/sda1/var/lib/docker/image/aufs/layerdb/sha256/78dbfa5b7cbc2bd94ccbdba52e71be39b359ed7eac43972891b136334f5ce181: directory not empty
\`\`\`

## 為什麼 Docker 會出現 directory not empty？

Docker 出現 \`directory not empty\`，通常是 Docker 工作空間裡已有同名或殘留的 layerdb 目錄，讓 rename 動作無法完成。這不一定是 registry 端問題，也不一定是 \`java:8\` image 本身壞掉。

這類錯誤常見於 pull 或 build 過程被中斷、Docker daemon 狀態不一致、舊版 storage driver 留下暫存目錄，或 Docker Machine VM 的檔案系統狀態異常。當 Docker 想把 \`tmp/layer-*\` 搬到正式的 \`sha256/<digest>\` 目錄時，如果目標目錄不是空的，就會停在 \`failed to register layer\`。

可以先把錯誤拆成三個線索看：

| 錯誤片段 | 代表意思 | 排查方向 |
|---|---|---|
| \`failed to register layer\` | Docker 無法登錄本機 image layer | 看本機 Docker daemon 與 image layer 狀態 |
| \`rename ... tmp/layer-* ... sha256/*\` | Docker 正在搬移暫存 layer metadata | 代表下載已進到本機寫入階段 |
| \`directory not empty\` | 目標 layerdb 目錄已有內容 | 清掉相關 image、重啟 daemon，最後才清工作目錄 |

## 第一個解法：先停止容器並刪除相關 image

第一個解法是停止所有使用相關 image 的 container，刪除這些 container，再刪除有問題的 image，最後重新執行 \`docker pull\`。這是破壞範圍最小的處理方式。

以這篇筆記裡的 \`java:8\` 為例，可以先確認是否有 container 使用 Java image：

\`\`\`bash
docker ps -a
docker images
\`\`\`

接著停止並移除相關 container，再刪除 Java image 或有問題的 image：

\`\`\`bash
docker stop <container_id>
docker rm <container_id>
docker rmi java:8
docker pull java:8
\`\`\`

如果不確定是哪個 image 卡住，可以先清掉 dangling images。Docker 官方文件說明，\`docker image prune\` 預設只清理 dangling images；加上 \`-a\` 才會清理所有沒有被 container 參照的 images（Docker Docs，存取日期：2026-08-28）。

\`\`\`bash
docker image prune
\`\`\`

## 第二個解法：重啟 Docker 引擎

第二個解法是重啟 Docker 引擎，讓 Docker daemon 重新整理本機狀態。若 layer metadata 只是 daemon 暫時卡住，重啟通常比手動刪目錄安全。

在 Docker Machine 環境，可以重啟 machine：

\`\`\`bash
docker-machine restart <machine_name>
\`\`\`

在 Linux systemd 環境，可以重啟 Docker 服務：

\`\`\`bash
sudo systemctl restart docker
\`\`\`

重啟後再重新執行：

\`\`\`bash
docker pull java:8
\`\`\`

以我的經驗，這一步常常可以解掉類似的 \`failed to register layer\` 問題。若重啟後仍失敗，再進入下一個清理層級。

## 第三個解法：最後才刪除 Docker 工作目錄

刪除 Docker 工作目錄是最後手段，因為這會移除本機 images、containers、volumes 或 storage driver 狀態。正式環境操作前要先備份需要保留的資料，尤其是 volume。

當時筆記裡的做法是：停止 Docker 引擎，刪除 Docker 工作目錄，重新啟動 Docker 引擎。這能清掉混亂的 layerdb，但代價是本機 Docker 狀態會被重建。

Docker 工作目錄常見位置是：

\`\`\`bash
/var/lib/docker
\`\`\`

在 Docker Machine 的 boot2docker VM 裡，錯誤訊息顯示的路徑是：

\`\`\`bash
/mnt/sda1/var/lib/docker
\`\`\`

建議先用 Docker 內建清理指令處理不用的資源，再考慮刪整個工作目錄。Docker 官方文件說明，\`docker system prune\` 會清理 stopped containers、未使用 networks、dangling images 與 unused build cache；預設不會清 volume，除非加上 \`--volumes\`（Docker Docs，存取日期：2026-08-28）。

\`\`\`bash
docker system prune
\`\`\`

## 處理順序怎麼選比較安全？

安全處理順序是先做小範圍清理，再做 daemon 重啟，最後才碰 Docker 工作目錄。\`failed to register layer\` 看起來像底層錯誤，但多數情況不需要一開始就刪 \`/var/lib/docker\`。

我會照這個順序排查：

1. 確認錯誤是否固定出現在同一個 image。
2. 停止並移除相關 container。
3. 刪除相關 image，重新 \`docker pull\`。
4. 執行 \`docker image prune\` 清理 dangling images。
5. 重啟 Docker daemon 或 Docker Machine。
6. 仍失敗時，備份需要保留的資料後，再考慮清 Docker 工作目錄。

這篇的資訊增益是風險排序：不要把「刪 Docker 工作目錄」當成第一步。\`/var/lib/docker\` 裡可能有仍要使用的 image、container 狀態與 volume metadata，清掉之前要確認這台機器不是 production 狀態，或至少確認資料已備份。

## 常見問題

### docker pull failed to register layer 要先重拉 image 嗎？

\`docker pull failed to register layer\` 可以先刪除相關 image 後重拉，但建議先確認是否有 container 正在使用該 image。若 container 還在，先停止並移除相關 container，再重新 pull image。

### failed to register layer 是 Docker Hub 壞掉嗎？

\`failed to register layer\` 不一定是 Docker Hub 或 registry 壞掉。錯誤訊息若指向 \`/var/lib/docker/image/.../layerdb/\` 並出現 \`directory not empty\`，通常要先排查本機 Docker daemon 與 layer metadata。

### 可以直接刪除 /var/lib/docker 嗎？

不建議直接刪除 \`/var/lib/docker\`。刪除 Docker 工作目錄可能移除本機 images、containers 與 volume 相關狀態，正式環境要先備份需要保留的資料，並把這一步視為最後手段。

### docker image prune 可以解決 failed to register layer 嗎？

\`docker image prune\` 有機會解決 dangling image 或殘留 image metadata 造成的問題，但不保證修復所有 layerdb 錯誤。若清理 image 後仍失敗，可以再重啟 Docker daemon。

### Docker Machine 環境要怎麼重啟 Docker？

Docker Machine 環境可以用 \`docker-machine restart <machine_name>\` 重啟 VM 與其中的 Docker daemon。重啟後再執行 \`docker pull\`，確認 layer 註冊是否恢復正常。

## 參考資料

- Stack Overflow：[Docker error when pulling Java 8 image - “failed to register layer”](https://stackoverflow.com/questions/35325103/docker-error-when-pulling-java-8-image-failed-to-register-layer)（筆記參考討論，存取日期：2026-08-28）
- Docker Docs：[docker image prune](https://docs.docker.com/reference/cli/docker/image/prune/)（存取日期：2026-08-28）
- Docker Docs：[Prune unused Docker objects](https://docs.docker.com/engine/manage-resources/pruning/)（存取日期：2026-08-28）
- Docker Docs：[docker system prune](https://docs.docker.com/reference/cli/docker/system/prune/)（存取日期：2026-08-28）

## 延伸閱讀

- [Docker 刪除所有 tag 為 None 的 image：清理 dangling images 指令](/post/docker-remove-none-tag-images)：同樣聚焦 Docker、DevOps，可接著比較不同情境的做法。
- [Dockerfile 簡單範例：從零打造你的第一個 Docker Image](/post/dockerfile-simple-example)：同樣聚焦 Docker、DevOps，可接著比較不同情境的做法。
- [Docker 初探：安裝、常用指令與容器管理入門筆記](/post/docker-introduction-basics)：同樣聚焦 Docker、DevOps，可接著比較不同情境的做法。

## 最後更新

2026-08-28。本文初次發布於 2020-11-26，這次保留當時的 Docker 1.10.0、Docker Machine 0.6.0 錯誤紀錄，並補上 GEO 結構、清理順序與現代 Docker prune 指令的注意事項。
`;export{e as default};