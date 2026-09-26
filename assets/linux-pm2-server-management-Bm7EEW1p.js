var e=`---
title: Linux 用 pm2 來管理伺服器
description: pm2 是 Node.js 最常用的 process 管理工具，本文整理 pm2 的安裝、目錄結構、啟動 cluster、刪除/停止/重啟 process 與 monit 監控等常用指令，幫你把 Linux 伺服器上的 Node.js 應用管理自動化。
date: 2019-09-19
category: DevOps
tags: [PM2, Node.js, Linux, 伺服器管理, DevOps]
readingTime: 4 分鐘
image: /images/tech/hero_linux-pm2-server-management.webp
imageAlt: 深色螢幕上捲動的綠色終端機文字，象徵 Linux 伺服器上的 process 監控
---


# Linux 用 pm2 來管理伺服器

在 Linux 伺服器上跑 Node.js 應用，最麻煩的不是寫程式，而是 process 管理：程式掛了要自動重啟、要多核心跑滿 CPU、要能隨時監控狀態。pm2 就是用來解決這些問題的工具——用簡單的指令就能啟動 Node.js cluster、自動重啟、做負載均衡和性能監控，而且使用非常簡單。這篇整理我當初導入 pm2 時的安裝方式、目錄結構與最常用的操作指令。

## 為什麼要用 pm2 管理 Node.js 伺服器？

pm2 是一個管理 Node.js process 的工具，它可以讓我用簡單的指令啟動 Node.js cluster，並最大化使用伺服器的 CPU。它可以簡化很多 Node 應用管理的繁瑣任務，例如：

- **性能監控**：即時查看每個 process 的 CPU 與記憶體用量
- **自動重啟**：程式崩潰時自動拉起，不需要人守著伺服器
- **負載均衡**：用 cluster 模式把請求分散到多個 process

## 怎麼安裝 pm2？

用 npm 全域安裝即可：

\`\`\`bash
npm install pm2 -g
\`\`\`

安裝完成後，\`pm2\` 指令就可以在任何目錄下直接使用。

## pm2 安裝後產生了哪些目錄與檔案？

pm2 安裝好後，會自動在使用者 home 目錄下建立 \`.pm2\` 資料夾，所有 pm2 相關的檔案都放在這裡：

| 路徑 | 用途 |
| --- | --- |
| \`$HOME/.pm2\` | 所有 PM2 相關文件 |
| \`$HOME/.pm2/logs\` | 所有應用程式日誌 |
| \`$HOME/.pm2/pids\` | 所有應用程式的 pid |
| \`$HOME/.pm2/pm2.log\` | PM2 本身的記錄 |
| \`$HOME/.pm2/pm2.pid\` | PM2 的 pid |
| \`$HOME/.pm2/rpc.sock\` | 遠程命令的 socket 檔案 |
| \`$HOME/.pm2/pub.sock\` | 可發布事件的 socket 檔案 |
| \`$HOME/.pm2/conf.js\` | PM2 配置 |

排查問題時，最常看的就是 \`logs/\` 底下的應用程式日誌，以及 \`pm2.log\` 這份 PM2 自身的記錄。

## 怎麼啟動 Node.js 應用程式？

最基本的啟動方式，是在 \`pm2 start\` 後面加上 Node.js 的起始檔案：

\`\`\`bash
pm2 start app.js
\`\`\`

如果想要用叢集（cluster）的方式啟動，充分使用多核心 CPU，可以加上 \`-i\` 參數指定 process 數量，並用 \`--name\` 幫應用命名：

\`\`\`bash
pm2 start -i 4 --name server app.js
\`\`\`

這樣會啟動 4 個 process 組成的 cluster，之後就可以用 \`server\` 這個名字來管理它。

## 怎麼刪除、停止與重新啟動 process？

日常管理只會用到三個指令，都可以用 id 或 name 指定目標 process：

\`\`\`bash
# 刪除 process
pm2 delete { id or name }

# 停止 process
pm2 stop { id or name }

# 重新啟動 process
pm2 restart { id or name }
\`\`\`

\`stop\` 之後 process 還留在 pm2 的清單裡，隨時可以 \`restart\`；\`delete\` 則是把它從清單移除。

## 怎麼即時監控所有 process？

用 \`pm2 monit\` 可以列出目前所有已啟動的 process，並即時顯示它們的狀態與資源用量，按下 \`Ctrl+C\` 可以離開 monitor：

\`\`\`bash
pm2 monit
\`\`\`

![pm2 monit 即時監控所有 process 的狀態](/images/articles/linux-pm2-server-management-1.webp)

## 利用 cluster 增加效能的效果有多明顯？

cluster 模式的實測效果非常直接。參考〈[使用 pm2 啟動 Node.js cluster 以提升效能](https://pm2.keymetrics.io/docs/usage/cluster-mode/)〉一文的實測結果：

> 可以發現開多個 process 處理的時候，消化 1000 個 request 的時間從 17.4 秒降到 9.9 秒，而每個 request 的回應時間也從 1668ms 降到 930ms，整體的速度大概快了兩倍（我的電腦是四核心，如果配備更好的話會快更多）。

簡單說：在多核心機器上用 cluster 模式，吞吐量幾乎可以隨核心數等比例提升。

## 常見問題

### pm2 是做什麼用的？

pm2 是 Node.js 的 production process 管理工具，提供自動重啟、cluster 負載均衡、日誌管理與效能監控等功能，讓你用簡單指令管理伺服器上的 Node.js 應用。

### pm2 怎麼用 cluster 模式啟動應用？

加上 \`-i\` 參數指定 process 數量即可，例如 \`pm2 start -i 4 --name server app.js\` 會啟動 4 個 process 的 cluster，把請求分散到各核心，大幅提升吞吐量。

### pm2 stop 和 pm2 delete 有什麼差別？

\`pm2 stop\` 只是停止 process，應用仍留在 pm2 清單中，可隨時 \`pm2 restart\`；\`pm2 delete\` 則會把應用從清單中完全移除，要再執行得重新 \`pm2 start\`。

### pm2 的日誌檔放在哪裡？

所有日誌都在 \`$HOME/.pm2/logs/\` 目錄下，每個應用各有 out 與 error 兩種日誌；pm2 自身的記錄則是 \`$HOME/.pm2/pm2.log\`。

### pm2 monit 是什麼？

\`pm2 monit\` 是 pm2 內建的即時終端機監控介面，會列出所有已啟動的 process 與其狀態、CPU／記憶體用量，按 \`Ctrl+C\` 離開。

## 參考資料

- [使用 pm2 啟動 Node.js cluster 以提升效能](https://pm2.keymetrics.io/docs/usage/cluster-mode/)
- [pm2: Advanced, production process manager for Node.js](https://pm2.keymetrics.io/)

## 延伸閱讀

- [使用 PM2 管理 Node.js 伺服器教學](/post/pm2-node-server-management)：同樣聚焦 Node.js、伺服器管理，可接著比較不同情境的做法。
- [在 Linux 離線安裝 pm2 的完整步驟教學](/post/install-pm2-offline-linux)：同樣聚焦 Linux、pm2，可接著比較不同情境的做法。
- [在 K8S 內 Node.js 紀錄 log 的解決方案](/post/k8s-nodejs-logging-solution)：同樣聚焦 Node.js，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2019-09-19，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};