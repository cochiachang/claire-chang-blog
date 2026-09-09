var e=`---
title: 在 K8S 內 Node.js 紀錄 log 的解決方案
description: 在 Kubernetes 內跑 Node.js 時 log 該怎麼記？本文整理 PM2 與 K8S 機制衝突的問題、stdout 導出由 kubelet 收集、寫檔掛載 volume、送到 ELK 等方案優缺點，附 log4js 每日分檔範例，幫你選擇適合 K8S 環境的 Node.js 日誌方案。
date: 2023-01-10
category: DevOps
tags: [Kubernetes, Node.js, PM2, Log, log4js]
readingTime: 5 分鐘
image: /images/tech/hero_k8s-nodejs-logging-solution.webp
imageAlt: Kubernetes 叢集與伺服器日誌紀錄概念示意圖
---


# 在 K8S 內 Node.js 紀錄 log 的解決方案

在 Kubernetes 環境裡跑 Node.js 時，很多人習慣沿用 PM2 來管理程序與紀錄 log，但這樣反而容易出問題。本篇說明為什麼在 K8S 中不該使用 PM2、可能發生哪些狀況，以及改用 log4js 自行管理文字檔 log 的實作範例。

## 為什麼在 K8S 裡千萬不要使用 PM2？

PM2 是一個在 Linux 裡面管理 Node.js 程序的好工具，它可以讓 Node.js 在死掉時自動控制重啟，並可於重啟次數超過時停止重啟。

但由於在 K8S 之中，這種管理的機制已經交由 K8S 去管理了，因此若再於裡面包一層 PM2，很容易出問題。

## 在 K8S 裡用 PM2 可能發生哪些問題？

- PM2 一開始起來時會依你的參數去試著把 resource 給最大化，所以會一下子把 resource 吃滿，這會讓 K8S 覺得是不是這個 pod 又很忙了，就馬上又起一個 pod 要來試著接手。
- PM2 會自己重啟 node process：這會讓 K8S 不知道其實 pod 已經死了，就不會再建新的 pod 來接手。

## PM2 的 log 功能有哪些替代方案？

因為 PM2 的部分功能與 K8S 重疊，不推薦使用。關於 PM2 另外的文字檔 log 功能，則有幾種方案可解決：

- container 吐到 stdout，K8S 的 CRI 會寫到 host 上。
- 自己實作 log 系統。

我們公司由於管 K8S 系統的運營部門不處理我們的 log 儲存以及打至 ELK 的問題，所以就只能採用第二種方案，以下為我們 Node.js 的解決方案 log4js。

## 怎麼用 log4js 管理 Node.js 的 log？

log4js 是 Node.js 的 log 管理系統：<https://www.npmjs.com/package/log4js>

官方的說明非常簡單好懂，下面為一個基礎使用範例，可每日分檔案，儲存三天：

\`\`\`js
const log4js = require("log4js");
log4js.configure({
    appenders: {
        log: { type: "dateFile", filename: "logs/log.log", pattern: "yyyy-MM-dd", layout: { type: "pattern", pattern: "[%d] %m", }, keepFileExt: true, fileNameSep: "-", numBackups: 3 },
        error: { type: "dateFile", filename: "logs/error.log", pattern: "yyyy-MM-dd", layout: { type: "pattern", pattern: "[%d] %m", }, keepFileExt: true, fileNameSep: "-", numBackups: 3 },
    },
    categories: { default: { appenders: ["log"], level: "debug" }, error: { appenders: ["error"], level: "error" } }
});
var logger = log4js.getLogger();
var logger_error = log4js.getLogger("error");
logger.level = "debug";

exports.log = (...msg) => {
    logger.debug(...msg);
}

exports.error = (...msg) => {
    logger_error.error(...msg);
}
\`\`\`

## 常見問題

### 在 K8S 裡跑 Node.js 還需要 PM2 嗎？

不需要。K8S 已經負責程序的啟動、重啟與資源管理，再包一層 PM2 會與 K8S 的機制衝突，例如 PM2 自己重啟 process 會讓 K8S 誤判 pod 還活著，反而不會建立新的 pod 來接手。

### PM2 在 K8S 中會造成什麼具體問題？

一是 PM2 啟動時會依參數把 resource 最大化，短時間吃滿資源，讓 K8S 誤以為 pod 很忙而再起一個 pod 接手；二是 PM2 會自己重啟 node process，讓 K8S 感知不到 pod 已經掛掉，跳過重建。

### K8S 環境下 Node.js 的 log 有哪些做法？

最簡單的做法是讓 container 直接把 log 吐到 stdout，K8S 的 CRI 會自動寫到 host 上。如果運營單位不負責 log 收集（例如送往 ELK），就要自行實作 log 系統，例如使用 log4js 做每日分檔並保留數天的檔案。

### log4js 怎麼做到每日分檔與保留三天？

在 appender 使用 \`dateFile\` 類型，設定 \`pattern: "yyyy-MM-dd"\` 讓檔案按日期切分，並用 \`numBackups: 3\` 只保留最近三天的備份檔，\`keepFileExt: true\` 則讓切割後的檔案保留原始副檔名。

## 參考資料

- [log4js（npm）](https://www.npmjs.com/package/log4js)

## 延伸閱讀

- [使用 PM2 管理 Node.js 伺服器教學](/post/pm2-node-server-management)：同樣聚焦 PM2、Node.js，可接著比較不同情境的做法。
- [Linux 用 pm2 來管理伺服器](/post/linux-pm2-server-management)：同樣聚焦 Node.js，可接著比較不同情境的做法。
- [K8S裡CPU和MEMORY的計算單位](/post/kubernetes-cpu-memory-units)：同樣聚焦 Kubernetes，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2023-01-10，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};