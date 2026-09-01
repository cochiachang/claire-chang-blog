var e=`---
title: Dockerfile 簡單範例：從零打造你的第一個 Docker Image
description: 用簡單範例學會 Dockerfile 撰寫：從 Docker Hub 選基礎映像檔、認識 FROM、ENV、ARG、RUN、COPY、CMD、ENTRYPOINT 等指令，到 docker build 建立並上傳自己的 Docker image。
date: 2022-10-06
category: DevOps
tags: [Docker, Dockerfile, 容器化, DevOps, docker build]
readingTime: 3 分鐘
image: /images/tech/hero_dockerfile-simple-example.webp
imageAlt: 彩色貨櫃堆疊，象徵 Docker 容器化打包的概念
---


# Dockerfile 簡單範例：從零打造你的第一個 Docker Image

這篇文章用一個簡單的 Dockerfile 範例，帶你走完「製作 Docker image」的完整流程：如何到 Docker Hub 挑選適合的基礎映像檔、自行撰寫客製化部分，最後用 \`docker build\` 建出自己的映像檔並上傳到儲存庫。文中同時整理了 FROM、ENV、ARG、RUN、COPY、CMD、ENTRYPOINT 等常用指令的用途。

## 如何製作 Docker Image？完整流程是什麼？

製作一個自己的 Docker image，流程可以拆成以下幾步：

1. 到 [Docker Hub](https://hub.docker.com/) 尋找適合的基礎容器或官方提供的映像檔
2. 自行撰寫需要客製化的部分
3. 在專案資料夾根部創建一個文字檔，命名為 \`Dockerfile\`
4. 撰寫 Dockerfile 內容
5. 執行 command line，切換到專案資料夾，執行建置指令：

\`\`\`bash
docker build --tag NAME .
\`\`\`

6. 上傳映像檔至儲存庫

下圖是實際執行 \`docker build\` 的畫面：

![docker build 執行畫面](/images/articles/dockerfile-simple-example-1.webp)

## Dockerfile 常用指令有哪些？FROM、CMD、ENTRYPOINT 差在哪？

先看一個實際的 Dockerfile 範例：

![Dockerfile 範例內容](/images/articles/dockerfile-simple-example-2.webp)

各個指令的作用整理如下：

| 指令 | 用途 |
| --- | --- |
| \`FROM\` | 從某個別人建好的容器開始製作自己的容器，例如 \`centos:6.7\` |
| \`ENV\` | 定義一些環境變數，後面的指令可以直接使用 |
| \`ARG\` | 在 build image 時可從外部帶入參數 |
| \`WORKDIR\` | 指定後續指令執行的工作目錄 |
| \`RUN\` | 在容器內下指令（安裝套件、執行腳本等） |
| \`COPY\` | 把本機檔案複製進 image 裡 |
| \`CMD\` | 容器啟動時要執行的主程式指令 |
| \`ENTRYPOINT\` | 與 CMD 類似，差別在於不會被 \`docker run\` 後面帶的指令蓋掉，而是相加 |

其中 \`ARG\` 搭配 build 指令的用法如下：

\`\`\`bash
docker build --build-arg SCRIPT=tmp.js .
\`\`\`

\`CMD\` 與 \`ENTRYPOINT\` 的差別是新手最容易混淆的地方：\`docker run\` 之後帶的指令會**覆蓋** \`CMD\`，但會**附加**在 \`ENTRYPOINT\` 之後。需要固定執行入口時用 \`ENTRYPOINT\`，需要可替換的預設指令時用 \`CMD\`。

## 常見問題

### Dockerfile 一定要放在專案根目錄嗎？

不一定要放在根目錄，但 \`docker build\` 預設會以當前目錄（\`.\`）作為 build context 尋找名為 \`Dockerfile\` 的檔案。放在其他位置時，可用 \`-f\` 參數指定路徑。

### FROM 指令的作用是什麼？

\`FROM\` 指定以哪個現成的映像檔作為基礎，例如 \`centos:6.7\` 或官方的 \`node\`、\`python\` 映像檔。在自己的容器不需要從零開始製作，選一個合適的基礎映像檔再客製化即可。

### CMD 與 ENTRYPOINT 有什麼不同？

兩者都定義容器啟動時執行的指令。差別在於 \`docker run\` 後面帶的參數會蓋掉 \`CMD\`，但會附加在 \`ENTRYPOINT\` 之後一起執行，所以固定入口用 \`ENTRYPOINT\`、預設參數用 \`CMD\`。

### ARG 和 ENV 都能定義變數，差別在哪？

\`ARG\` 只在 build image 階段有效，可透過 \`--build-arg\` 從外部帶入；\`ENV\` 定義的環境變數會保留到容器運行階段，容器內的程式也能讀取。

### 建好的 image 要怎麼上傳到 Docker Hub？

先用 \`docker tag\` 把 image 標上 \`<帳號>/<儲存庫>:<標籤>\` 格式，再執行 \`docker push\` 上傳即可。上傳前需要先 \`docker login\` 登入 Docker Hub。

## 參考資料

- [Docker Hub](https://hub.docker.com/)
- [Dockerfile reference（官方文件）](https://docs.docker.com/engine/reference/builder/)

## 延伸閱讀

- [docker pull failed to register layer 錯誤怎麼解？](/post/docker-pull-failed-to-register-layer)：同樣聚焦 Docker、DevOps，可接著比較不同情境的做法。
- [Docker 刪除所有 tag 為 None 的 image：清理 dangling images 指令](/post/docker-remove-none-tag-images)：同樣聚焦 Docker、DevOps，可接著比較不同情境的做法。
- [Docker 初探：安裝、常用指令與容器管理入門筆記](/post/docker-introduction-basics)：同樣聚焦 Docker、DevOps，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2022-10-06，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};