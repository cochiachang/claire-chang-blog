var e=`---
title: Docker 初探：安裝、常用指令與容器管理入門筆記
description: Docker 新手入門怎麼開始？我整理在 CentOS 7 安裝 Docker 的步驟，以及 docker pull、run、exec、ps、rm、rmi 等容器與映象檔常用指令，加上掛載 volume、docker build、entrypoint、ENV、HEALTHCHECK 與常見報錯的實戰筆記。
date: 2020-11-13
category: DevOps
tags: [Docker, Container, DevOps, CentOS, 指令教學]
readingTime: 8 分鐘
image: /images/tech/hero_docker-introduction-basics.webp
imageAlt: 容器與 Docker 概念的科技感配圖
---


# Docker 初探：安裝、常用指令與容器管理入門筆記

這篇是我第一次接觸 Docker 時留下的入門筆記，涵蓋在 CentOS 7 上安裝 Docker、用 docker pull / run / exec / ps / rm / rmi 管理映象檔與容器，以及 volume 掛載、docker build、entrypoint、ENV、HEALTHCHECK 等進階用法和當時遇到的報錯。適合想快速掌握 Docker 常用指令的新手參考。

## 怎麼在 CentOS 7 上安裝 Docker？

安裝步驟直接照官方文件走即可：[https://docs.docker.com/engine/install/centos/](https://docs.docker.com/engine/install/centos/)。裝完之後就可以用下面的測試指令確認環境正常。

## Docker 有哪些測試用基本指令？

- 顯示 docker 的資訊：

\`\`\`bash
$ docker info
\`\`\`

- 顯示 docker 的版本：

\`\`\`bash
$ docker version
\`\`\`

## 怎麼取得指定版本的 image？

用 \`docker pull\` 取得 image；如果不指定版本，該版本則為 latest：

\`\`\`bash
$ docker pull [Image 名稱]:[Image 版本]
\`\`\`

範例：

\`\`\`bash
$ docker pull hello-world
$ docker pull ubuntu
$ docker pull ubuntu:14.04
\`\`\`

顯示 docker 的 images 清單：

\`\`\`bash
$ docker images
\`\`\`

## 怎麼透過 image 執行並產生一個新的 container？

\`\`\`bash
$ docker run [Image 名稱]:[Image 版本] [執行指令]
\`\`\`

範例：

\`\`\`bash
$ docker run hello-world
$ docker run ubuntu /bin/echo "example 1 - ubuntu"
$ docker run ubuntu:14.04 /bin/echo "example 2 - ubuntu:14.04"
\`\`\`

\`docker run\` 常用的 \`[OPTIONS]\`：

| Option | 說明 |
| --- | --- |
| \`-i\`, \`--interactive\` | 互動模式 |
| \`-t\`, \`--tty\` | 配置一個終端機 |
| \`-d\`, \`--detach\` | 在背景執行 |

完整格式：

\`\`\`bash
$ docker run [OPTIONS] [Image 名稱]:[Image 版本] [執行指令]
\`\`\`

範例——進入互動模式的 bash：

\`\`\`bash
$ docker run -i -t ubuntu:14.04 bash
$ exit
\`\`\`

## 怎麼查看正在執行的 containers？

- 查看正在執行的 containers：

\`\`\`bash
$ docker ps
\`\`\`

- 查看所有的 containers：

\`\`\`bash
$ docker ps -a
\`\`\`

## 怎麼對正在執行的 container 下指令？

用 \`docker exec\`，常用 \`[OPTIONS]\` 同樣是 \`-i, --interactive\`（互動模式）與 \`-t, --tty\`（配置一個終端機）：

\`\`\`bash
docker exec [OPTIONS] [Container ID] [執行指令]
\`\`\`

範例——產生一個 container 在背景執行，再進去操作：

\`\`\`bash
$ docker run -i -t -d ubuntu:14.04 bash
$ docker ps
$ docker exec -i -t [Container ID] bash
$ exit
\`\`\`

## 怎麼啟動、停止與重新啟動 container？

- 啟動 docker container：

\`\`\`bash
$ docker start [Container ID]
\`\`\`

- 停止 docker container：

\`\`\`bash
$ docker stop [Container ID]
\`\`\`

- 重新啟動 docker container：

\`\`\`bash
$ docker restart [Container ID]
\`\`\`

完整走一遍的範例：

\`\`\`bash
$ docker run -i -t -d ubuntu bash
$ docker ps
$ docker stop [Container ID]
$ docker ps
$ docker start [Container ID]
$ docker ps
$ docker restart [Container ID]
\`\`\`

## 怎麼刪除 container 與 image？

- 刪除 container：

\`\`\`bash
$ docker rm [Container ID]
\`\`\`

範例：

\`\`\`bash
$ docker ps
$ docker stop [Container ID]
$ docker rm [Container ID]
$ docker ps -a
\`\`\`

- 刪除 image：

\`\`\`bash
$ docker rmi [Image ID]
\`\`\`

注意：刪除 image 前必需將透過該 image 所產生的 container 移除。範例——移除 hello-world image 所產生的 container，再移除 image 本身：

\`\`\`bash
$ docker ps -a
$ docker rm [Container ID]
$ docker ps -a
$ docker images
$ docker rmi [Image ID]
$ docker images
\`\`\`

## 有哪些一次處理全部的 Docker 小技巧？

- 停止所有的 containers：

\`\`\`bash
$ docker stop $(docker ps -a -q)
\`\`\`

- 刪除所有的 containers：

\`\`\`bash
$ docker rm $(docker ps -a -q)
\`\`\`

- 刪除所有的 images：

\`\`\`bash
$ docker rmi $(docker images -a -q)
\`\`\`

## 怎麼讓容器停止後還能保留資料（掛載 volume）？

Docker 容器不會保存它們產生的數據。該過程完成後，容器將停止運行，並且容器中的所有物品都將被移走。如果要在容器停止後仍要存儲持久性數據，則需要啟用共享存儲卷。

對於安裝卷，請使用 \`-v\` 屬性以及要在其中保存數據的目錄的指定位置，然後是該數據在容器內的位置：

\`\`\`bash
-v [/host/volume/location]:[/container/storage]
\`\`\`

整個 docker container run 命令是：

\`\`\`bash
docker container run -v [/host/volume/location]:[/container/storage] [docker_image]
\`\`\`

## Dockerfile 與 run 進階用法有哪些？

- docker file 寫法 / run 寫法：[https://docs.docker.com/engine/reference/run/](https://docs.docker.com/engine/reference/run/)
- build（\`--no-cache\` 強制重建）：

\`\`\`bash
docker build -t fmsdocker . --no-cache
\`\`\`

- entrypoint：

\`\`\`bash
docker run --entrypoint=/bin/hostname test
\`\`\`

- ENV：

\`\`\`bash
ENV HOSTNAME testhost
export today=Wednesday
docker run -e "deep=purple" -e today --rm alpine env
\`\`\`

- HEALTHCHECK：

\`\`\`bash
docker run --name=test -d \\
    --health-cmd='stat /etc/passwd || exit 1' \\
    --health-interval=2s \\
    busybox sleep 1d
\`\`\`

Dockerfile 內的寫法：

\`\`\`dockerfile
HEALTHCHECK --interval=5s --timeout=3s \\
  CMD curl \${HOSTNAME}:1111/admin/getServerStats?auser=admin&apswd=pass.123 || exit 1
\`\`\`

## 當時遇到哪些報錯與參考資源？

- 報錯：\`Rpmdb checksum is invalid: dCDPT\`，解法參考：[https://www.codeleading.com/article/6028666895/](https://www.codeleading.com/article/6028666895/)
- 參考別人的 FMS 映象檔：
  - [https://github.com/oprearocks/docker-adobe-media-server/tree/master/conf](https://github.com/oprearocks/docker-adobe-media-server/tree/master/conf)
  - [https://hub.docker.com/r/flexconstructor/docker-adobe-media-server](https://hub.docker.com/r/flexconstructor/docker-adobe-media-server)
  - [https://github.com/d93921012/docker-adobe-media-server](https://github.com/d93921012/docker-adobe-media-server)

## 常見問題

### Docker 的 image 和 container 有什麼差別？

image 是唯讀的範本，container 是用 image 執行起來的實例。同一個 image 可以同時跑出多個 container，container 停止後預設不保留資料。

### 刪除 image 時出現錯誤怎麼辦？

必須先把透過該 image 產生的所有 container 刪除，才能 \`docker rmi\` 刪除 image。可以用 \`docker ps -a\` 找出 container，先 \`docker rm\` 再 \`docker rmi\`。

### 如何一次停止或刪除所有 containers？

\`docker stop $(docker ps -a -q)\` 可以停止全部，\`docker rm $(docker ps -a -q)\` 可以刪除全部。\`docker ps -a -q\` 會輸出所有 container 的 ID 當成參數傳入。

### 容器裡的資料在停止後會消失嗎？

會。Docker 容器不會保存它產生的數據，過程結束後容器內的所有物品都會被移走。要持久化資料需用 \`-v [/host/volume/location]:[/container/storage]\` 掛載共享存儲卷。

### 不指定版本 pull image 會拿到什麼？

會拿到標記為 \`latest\` 的版本。例如 \`docker pull ubuntu\` 等同於 \`docker pull ubuntu:latest\`，要固定版本就要明確指定如 \`ubuntu:14.04\`。

## 參考資料

- [Docker 官方安裝文件（CentOS）](https://docs.docker.com/engine/install/centos/)
- [docker run 官方參考文件](https://docs.docker.com/engine/reference/run/)
- [Rpmdb checksum is invalid 解法](https://www.codeleading.com/article/6028666895/)
- [docker-adobe-media-server（FMS 映象檔參考）](https://github.com/d93921012/docker-adobe-media-server)

## 延伸閱讀

- [docker pull failed to register layer 錯誤怎麼解？](/post/docker-pull-failed-to-register-layer)：同樣聚焦 Docker、DevOps，可接著比較不同情境的做法。
- [Dockerfile 簡單範例：從零打造你的第一個 Docker Image](/post/dockerfile-simple-example)：同樣聚焦 Docker、DevOps，可接著比較不同情境的做法。
- [Docker 刪除所有 tag 為 None 的 image：清理 dangling images 指令](/post/docker-remove-none-tag-images)：同樣聚焦 Docker、DevOps，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2020-11-13，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};