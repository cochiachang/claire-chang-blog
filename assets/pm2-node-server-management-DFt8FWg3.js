var e=`---
title: 使用 PM2 管理 Node.js 伺服器教學
description: 整理 PM2 安裝、啟動、cluster、記憶體重啟、日誌、ecosystem 設定與部署指令。
date: 2019-10-06
category: DevOps
tags: [PM2, Node.js, 伺服器管理, Nginx]
readingTime: 5 分鐘
image: /images/tech/2024-05-17_161226.webp
imageAlt: 使用 PM2 管理 Node.js 伺服器與背景程序示意圖
---


# 使用 PM2 管理 Node.js 伺服器教學

PM2 是 Node.js 服務常用的 process manager，可以啟動服務、維持背景執行、監控記憶體、管理日誌，並用 cluster 模式啟動多個進程。若 Node.js 服務要長時間在線，PM2 是很實用的基礎工具。

## PM2 基本操作有哪些？

PM2 基本操作包含安裝、啟動、重啟、監控與記憶體限制。開發者先熟悉這幾個指令，就能處理多數 Node.js 服務管理情境。

\`\`\`bash
# 安裝 PM2
npm install pm2 -g

# 啟動服務
pm2 start app.js

# 啟動 N 個名為 SERVICE_NAME 的服務進程
pm2 start app.js -i N --name SERVICE_NAME

# 重啟服務
pm2 restart SERVICE_NAME

# 設定記憶體超過 1024M 後自動重啟
pm2 start app.js --max_memory_restart 1024M

# 監控服務
pm2 monit
\`\`\`

原文的 \`npm restart SERVICE_NAME\` 比較像 npm script 用法；PM2 管理服務時，建議使用 \`pm2 restart SERVICE_NAME\`。

## 如何判斷 PM2 要開幾個進程？

PM2 cluster 進程數通常會參考 CPU 核心數與服務負載。CPU-bound 任務不能只靠多開進程解決，I/O-bound Node.js API 則常用 cluster 提升吞吐。

Linux 查看 CPU 資訊：

\`\`\`bash
# 查看物理 CPU 個數
cat /proc/cpuinfo | grep "physical id" | sort | uniq | wc -l

# 查看每個物理 CPU 的核心數
cat /proc/cpuinfo | grep "cpu cores" | uniq

# 查看邏輯 CPU 個數
cat /proc/cpuinfo | grep "processor" | wc -l
\`\`\`

實務上可以先用邏輯 CPU 數作為上限，再透過壓力測試觀察 CPU、記憶體、response time 與錯誤率。

## PM2 需要搭配 Nginx 嗎？

PM2 負責 Node.js process 管理，Nginx 負責反向代理、TLS、快取與負載分流。正式服務通常會讓 Nginx 站在 PM2 前面。

Nginx 常見用途：

- 反向代理，把外部流量導到 Node.js port。
- 簡單負載均衡，支援多台伺服器或多個 port。
- 靜態資源快取，提高 JS、CSS、圖片等資源回應效率。
- TLS 憑證與 HTTP header 管理。

若只有內部小工具，PM2 單獨使用也可以。若要面向公開網路，建議搭配 Nginx 或雲端 load balancer。

## PM2 日誌在哪裡？

PM2 日誌預設存放在 \`$HOME/.pm2/\`。應用服務的 stdout 與 stderr 會分開保存，方便排查錯誤。

PM2 相關日誌位置：

| 類型 | 預設位置 |
|---|---|
| PM2 自身日誌 | \`$HOME/.pm2/pm2.log\` |
| 應用標準輸出 | \`$HOME/.pm2/logs/\${APP_NAME}_out.log\` |
| 應用錯誤輸出 | \`$HOME/.pm2/logs/\${APP_NAME}_error.log\` |

正式環境還要搭配 log rotation，避免長期運行後磁碟被 log 塞滿。

## 如何用 ecosystem 設定檔啟動 PM2？

PM2 ecosystem 設定檔可以把服務名稱、script、instance、記憶體限制與 log 路徑寫成版本化設定。多人維護服務時，比手動輸入指令更穩定。

常見操作：

\`\`\`bash
pm2 ecosystem
pm2 startOrRestart /file/path/ecosystem.json
\`\`\`

範例設定：

\`\`\`js
{
  apps: [
    {
      name: "nova",
      max_memory_restart: "300M",
      script: "/root/nova/app.js",
      out_file: "/logs/nova_out.log",
      error_file: "/logs/nova_error.log",
      instances: 4,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
}
\`\`\`

這個設定使用 cluster 模式啟動 4 個服務進程；如果服務記憶體超過 300M，PM2 會自動重啟。

## PM2 如何支援自動化部署？

PM2 deploy 可以把遠端主機、Git repo、部署路徑與 post-deploy 指令寫進設定檔。小型服務可以用這種方式快速建立部署流程。

\`process.json\` 範例：

\`\`\`json
{
  "apps": [{
    "name": "HTTP-API",
    "script": "http.js"
  }],
  "deploy": {
    "production": {
      "user": "ubuntu",
      "host": ["192.168.0.13"],
      "ref": "origin/master",
      "repo": "git@github.com:Username/repository.git",
      "path": "/var/www/my-repository",
      "post-deploy": "npm install; grunt dist"
    }
  }
}
\`\`\`

部署指令：

\`\`\`bash
pm2 deploy production setup
pm2 deploy production update
pm2 deploy production revert 1
pm2 deploy production exec "pm2 reload all"
\`\`\`

若團隊已使用 GitHub Actions、GitLab CI 或雲端部署平台，PM2 deploy 可以只保留給簡單服務，不必勉強取代完整 CI/CD。

## 常見問題
### PM2 是什麼？

PM2 是 Node.js process manager，用來管理背景服務、重啟、cluster、監控與日誌。PM2 特別適合需要長時間運行的 Node.js API。

### PM2 可以自動重啟當掉的服務嗎？

PM2 可以在服務崩潰後自動重啟，也可以設定記憶體超過門檻後重啟。正式環境仍應搭配監控與告警。

### PM2 cluster 要開幾個 instances？

PM2 cluster instances 可先參考 CPU 邏輯核心數。最終數量應透過壓力測試與實際監控決定。

### PM2 和 Nginx 是替代關係嗎？

PM2 和 Nginx 不是替代關係。PM2 管理 Node.js process，Nginx 處理反向代理、TLS、快取與流量入口。

### PM2 log 需要清理嗎？

PM2 log 需要清理或輪替。長時間運行的服務若沒有 log rotation，可能因 log 檔過大造成磁碟空間問題。

## 參考資料
- PM2 官方文件：[https://pm2.keymetrics.io/docs/usage/quick-start/](https://pm2.keymetrics.io/docs/usage/quick-start/)
- PM2 ecosystem file：[https://pm2.keymetrics.io/docs/usage/application-declaration/](https://pm2.keymetrics.io/docs/usage/application-declaration/)
- PM2 deployment：[https://pm2.keymetrics.io/docs/usage/deployment/](https://pm2.keymetrics.io/docs/usage/deployment/)

## 延伸閱讀

- [Linux 用 pm2 來管理伺服器](/post/linux-pm2-server-management)：同樣聚焦 Node.js、伺服器管理，可接著比較不同情境的做法。
- [在 K8S 內 Node.js 紀錄 log 的解決方案](/post/k8s-nodejs-logging-solution)：同樣聚焦 Node.js、PM2，可接著比較不同情境的做法。
- [在 Linux 離線安裝 pm2 的完整步驟教學](/post/install-pm2-offline-linux)：同樣聚焦 Node.js，可接著比較不同情境的做法。

## 最後更新

Sun Oct 06 2019 08:00:00 GMT+0800 (Taiwan Standard Time)
`;export{e as default};