var e=`---
title: 用 Docker 運行 Ollama：本地 LLM 容器化部署完整指南
description: 用 Docker 運行 Ollama 的完整指南：說明容器化部署本地 LLM 的優點、CPU 與 NVIDIA/AMD GPU 環境的安裝指令，以及如何把 Ollama API 服務擴展到多台機器。
date: 2024-07-24
category: 生成式AI
tags: [Ollama, Docker, LLM, 本地模型, GPU]
readingTime: 5 分鐘
image: /images/tech/hero_ollama-local-llm-service.webp
imageAlt: 伺服器機房中運行 Ollama 容器的運算設備，象徵以 Docker 部署本地 LLM 服務
---


# 用 Docker 運行 Ollama：本地 LLM 容器化部署完整指南

想在伺服器上穩定地提供本地 LLM 的 API 服務嗎？這篇文章整理我用 Docker 運行 Ollama 的原因、適用場景，以及 CPU、NVIDIA GPU、AMD GPU 三種環境的完整啟動指令，幫助你把 Ollama 容器化並具備水平擴展能力。

## 為什麼要使用 Docker 來運行 Ollama？

使用 Docker 來運行 Ollama 可以提供許多優點，包括簡化設置、可移植性、隔離、資源管理、可擴展性和可重複性。可以把 Ollama 變成一個 API 服務，提供其他的應用程式直接使用 API 的方式來呼叫 Ollama，並運行不同的本地端模型。而把 Ollama 變為一個 Docker 服務，更可以在多台機器上分發 Ollama 模型，這對於需要在高可用性環境中運行 Ollama 的情況非常有用。

Ollama 的 API 手冊：[https://github.com/ollama/ollama/blob/main/docs/api.md](https://github.com/ollama/ollama/blob/main/docs/api.md)

## 哪些情境適合用 Docker 運行 Ollama 服務？

以下是一些使用 Docker 運行 Ollama 的具體示例：

- **在本地機器上開發和測試 Ollama 模型**：Docker 允許我在本地機器上設置一個隔離的環境來開發和測試 Ollama 模型，確保模型在部署到生產環境之前按預期工作。
- **在生產環境中部署 Ollama 模型**：可以使用 Docker 映像來創建和管理 Ollama 服務器，這些服務器可以提供對模型的 API 訪問。
- **在多台機器上分發 Ollama 模型**：對於需要在高可用性環境中運行 Ollama 的情況非常有用。

其中最重要的好處會是第三點：當我們把本地端 LLM 視為一個 API 服務，便可以對此服務做負載平衡，並根據使用量來增加機器、擴張服務的 Scale，讓整體服務具備良好的擴充性。

## 如何安裝 Ollama 的 Docker image？

官方網站：[https://hub.docker.com/r/ollama/ollama](https://hub.docker.com/r/ollama/ollama)

Ollama 使得在本地啟動和運行大型語言模型變得容易。以下依硬體環境分成三種啟動方式。

### 僅 CPU

\`\`\`bash
docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
\`\`\`

### Nvidia GPU

先安裝 [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html#installation)。

**使用 Apt 安裝**

配置存儲庫：

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

**配置 Docker 以使用 Nvidia 驅動程式，並啟動容器**

\`\`\`bash
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker
\`\`\`

\`\`\`bash
docker run -d --gpus=all -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
\`\`\`

### AMD GPU

要使用帶有 AMD GPU 的 Docker 執行 Llama，請使用標籤 \`rocm\` 和以下命令：

\`\`\`bash
docker run -d --device /dev/kfd --device /dev/dri -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama:rocm
\`\`\`

### 在容器內本地運行模型

三種環境啟動容器後，都可以用 \`docker exec\` 進入容器直接運行模型，例如運行 llama3：

\`\`\`bash
docker exec -it ollama ollama run llama3
\`\`\`

## 常見問題

### 為什麼要把 Ollama 放進 Docker 而不是直接安裝？

把 Ollama 容器化後具備可移植性、隔離性與可重複性，部署設定只需一條指令就能在任何機器重現。同時也能把它當成標準 API 服務，方便做多台機器間的分發與負載平衡。

### Ollama 容器預設使用哪個埠號？

Ollama API 預設監聽 11434 埠，啟動容器時以 \`-p 11434:11434\` 對外暴露。其他應用程式即可透過 \`http://<主機>:11434\` 呼叫 Ollama 的 API。

### 如何讓 Ollama 容器使用 GPU？

NVIDIA GPU 需先安裝 NVIDIA Container Toolkit，並在 \`docker run\` 加上 \`--gpus=all\`。AMD GPU 則改用 \`rocm\` 標籤的映像，並掛載 \`/dev/kfd\` 與 \`/dev/dri\` 裝置。

### 模型資料會不會因為容器刪除而消失？

不會。啟動指令中的 \`-v ollama:/root/.ollama\` 把模型資料存在名為 \`ollama\` 的 Docker volume 中，即使容器被刪除重建，已下載的模型仍然保留。

## 參考資料

- [Ollama API 手冊（GitHub）](https://github.com/ollama/ollama/blob/main/docs/api.md)
- [Ollama 官方 Docker image（Docker Hub）](https://hub.docker.com/r/ollama/ollama)
- [NVIDIA Container Toolkit 安裝指南](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html#installation)
- [Ollama Docker 映像指南](https://ollama.qianniu.city/doc/Ollama%20Docker%20%E9%95%9C%E5%83%8F%E6%8C%87%E5%8D%97.html)
- [傻瓜LLM 架設 - Ollama + Open WebUI 之 Docker Compose 懶人包](https://blog.darkthread.net/blog/ollam-open-webui/)

## 延伸閱讀

- [使用Docker來運行Ollama](/post/run-ollama-with-docker)：同樣聚焦 Ollama、Docker，可接著比較不同情境的做法。
- [Ollama 本地端運行 LLM 服務教學](/post/ollama-local-llm-service)：同樣聚焦 Ollama、LLM，可接著比較不同情境的做法。
- [在 Ollama 載入自己建立的模型：Modelfile 與本地模型管理流程](/post/ollama-load-custom-model)：同樣聚焦 Ollama、LLM，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2024-07-24，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};