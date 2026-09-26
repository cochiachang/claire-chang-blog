var e=`---
title: 使用Docker來運行Ollama
description: 為什麼要使用Docker來運行Ollama？本文整理用Docker把Ollama變成API服務的完整做法：涵蓋CPU、NVIDIA GPU（NVIDIA Container Toolkit）與AMD GPU（rocm標籤）三種啟動方式，並說明負載平衡與多機分發等擴充性優勢，讓本地端LLM服務更容易部署與擴展。
date: 2024-07-24
category: DevOps
tags: [Ollama, Docker, 本地端LLM, NVIDIA Container Toolkit, GPU]
readingTime: 6 分鐘
image: /images/tech/hero_run-ollama-with-docker.webp
imageAlt: 黑色背景上的金色 Docker 鯨魚標誌，象徵以 Docker 容器運行 Ollama 服務
---


# 使用Docker來運行Ollama

使用 Docker 來運行 Ollama，可以把本地端大型語言模型變成一個穩定的 API 服務。本文整理我實際操作過的完整流程：為什麼要用 Docker 跑 Ollama、三種硬體環境（CPU、NVIDIA GPU、AMD GPU）的啟動指令，以及如何在容器內直接運行模型。

## 為什麼要使用Docker來運行Ollama？

使用 Docker 來運行 Ollama 可以提供許多優點，包括簡化設置、可移植性、隔離、資源管理、可擴展性和可重複性。可以把Ollama變成一個API服務，提供其他的應用程式直接使用API的方式來呼叫Ollama，並運行不同的本地端模型。而把Ollama變為一個Docker服務，更可以在多台機器上分發 Ollama 模型。這對於需要在高可用性環境中運行 Ollama 的情況非常有用。

以下為Ollama的API手冊：

- [https://github.com/ollama/ollama/blob/main/docs/api.md](https://github.com/ollama/ollama/blob/main/docs/api.md)

## 有哪些適合用Docker運行Ollama服務的狀況？

以下是一些使用 Docker 運行 Ollama 的具體示例：

- **在您的本地機器上開發和測試 Ollama 模型：** Docker 允許您在本地機器上設置一個隔離的環境來開發和測試 Ollama 模型。這可以幫助您確保模型在部署到生產環境之前按預期工作。
- **在生產環境中部署 Ollama 模型：** Docker 可用於在生產環境中部署 Ollama 模型。您可以使用 Docker 映像來創建和管理 Ollama 服務器，這些服務器可以提供對模型的 API 訪問。
- **在多台機器上分發 Ollama 模型：** Docker 可用於在多台機器上分發 Ollama 模型。這對於需要在高可用性環境中運行 Ollama 的情況非常有用。

其中最重要好處的會是第三點，當我們把本地端LLM視為一個API服務，便可以對此服務做平衡負載，並根據使用量來增加機器，擴張服務的Scale，讓整體服務具備有良好的擴充性。

## 如何安裝Ollama Docker image？

官方網站：[https://hub.docker.com/r/ollama/ollama](https://hub.docker.com/r/ollama/ollama)

Ollama 使得在本地啟動和運行大型語言模型變得容易。以下依硬體環境分成三種啟動方式。

### 僅 CPU

\`\`\`bash
docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
\`\`\`

### Nvidia GPU

安裝 [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html#installation)。

**使用 Apt 安裝**

Configure the repository 配置存儲庫：

\`\`\`bash
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey \\
    | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list \\
    | sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' \\
    | sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list
sudo apt-get update
\`\`\`

安裝 NVIDIA Container Toolkit 軟體包：

\`\`\`bash
sudo apt-get install -y nvidia-container-toolkit
\`\`\`

**使用 Yum 或 Dnf 安裝**

配置存儲庫：

\`\`\`bash
curl -s -L https://nvidia.github.io/libnvidia-container/stable/rpm/nvidia-container-toolkit.repo \\
    | sudo tee /etc/yum.repos.d/nvidia-container-toolkit.repo
\`\`\`

安裝 NVIDIA Container Toolkit 軟體包：

\`\`\`bash
sudo yum install -y nvidia-container-toolkit
\`\`\`

配置 Docker 以使用 Nvidia 驅動程式：

\`\`\`bash
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker
\`\`\`

**啟動容器**

\`\`\`bash
docker run -d --gpus=all -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
\`\`\`

### AMD GPU

要使用帶有 AMD GPU 的 Docker 執行 Llama，請使用標籤 \`rocm\` 和以下命令：

\`\`\`bash
docker run -d --device /dev/kfd --device /dev/dri -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama:rocm
\`\`\`

## 服務啟動後，如何在本地運行模型？

容器啟動後，用 \`docker exec\` 進入容器並用 \`ollama run\` 指令載入模型，例如運行 llama3：

\`\`\`bash
docker exec -it ollama ollama run llama3
\`\`\`

之後其他的應用程式就可以透過 \`11434\` 埠的 API 來呼叫這個 Ollama 服務。

## 常見問題

### 為什麼要改用Docker來運行Ollama？

把 Ollama 容器化之後，可以獲得簡化設置、可移植性、環境隔離、資源管理、可擴展性與可重複性等優點，並且能把 Ollama 當成 API 服務提供給其他應用程式呼叫，也方便在多台機器上分發模型。

### 三種硬體環境的啟動指令差別在哪裡？

僅 CPU 的版本直接 \`docker run\` 即可；NVIDIA GPU 需先安裝 NVIDIA Container Toolkit，並加上 \`--gpus=all\` 參數；AMD GPU 則使用 \`rocm\` 標籤的映像，並透過 \`--device\` 掛載 \`/dev/kfd\` 與 \`/dev/dri\` 裝置。

### Ollama 容器預設使用哪個埠號？

預設使用 \`11434\` 埠，啟動容器時以 \`-p 11434:11434\` 對外暴露，其他應用程式即可透過這個埠呼叫 Ollama 的 API。

### 如何在已啟動的容器中運行模型？

使用 \`docker exec -it ollama ollama run llama3\` 進入容器並載入模型，模型資料則透過 \`-v ollama:/root/.ollama\` 掛載的 volume 持久化保存。

### 模型資料在容器重建後會消失嗎？

不會。啟動指令中的 \`-v ollama:/root/.ollama\` 會建立名為 \`ollama\` 的 Docker volume，模型權重與設定都保存在 volume 中，容器刪除重建後資料仍然保留。

## 參考資料

- [Ollama Docker 映像指南](https://docs.ollama.com/docker)
- [Chat Ollama docker部署及运行本地大模型（LLM）+本地知识库搭建强烈推荐](https://blog.csdn.net/weixin_42984235/article/details/137592173)
- [傻瓜LLM 架設- Ollama + Open WebUI 之Docker Compose 懶人包](https://blog.darkthread.net/blog/ollam-open-webui/)

## 延伸閱讀

- [用 Docker 運行 Ollama：本地 LLM 容器化部署完整指南](/post/docker-run-ollama)：同樣聚焦 Ollama、Docker，可接著比較不同情境的做法。
- [Ollama 本地端運行 LLM 服務教學](/post/ollama-local-llm-service)：同樣聚焦 Ollama，可接著比較不同情境的做法。
- [docker pull failed to register layer 錯誤怎麼解？](/post/docker-pull-failed-to-register-layer)：同樣聚焦 Docker，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2024-07-24，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};