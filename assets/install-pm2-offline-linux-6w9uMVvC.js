var e=`---
title: 在 Linux 離線安裝 pm2 的完整步驟教學
description: 伺服器沒有對外網路時怎麼裝 pm2？我在能連網的機器上打包 npm 全域目錄裡的 pm2，上傳到離線 Linux 伺服器解壓縮、npm build 後即可用 pm2 -v 驗證安裝成功。
date: 2019-09-28
category: DevOps
tags: [Linux, PM2, Node.js, npm, 離線安裝]
readingTime: 2 分鐘
image: /images/tech/hero_install-pm2-offline-linux.webp
imageAlt: 深色終端機畫面上捲動的程式碼，象徵在 Linux 伺服器上進行命令列安裝作業
---


# 在 Linux 離線安裝 pm2 的完整步驟教學

在沒有對外網路的 Linux 伺服器上，\`npm install -g pm2\` 是行不通的。這篇文章記錄我實際使用的離線安裝做法：先在能連網的機器上安裝並打包 pm2，再把 tarball 上傳到目標伺服器解壓、重新編譯，最後用 \`pm2 -v\` 驗證。整個流程只需要 tar 與 npm，不需要額外工具。

## 為什麼離線環境無法直接 npm install -g pm2？

\`npm install\` 預設要連到 npm registry 下載套件。生產環境的 Linux 伺服器常因資安政策不開放對外網路，這時就有兩個選擇：在內網架 npm registry 鏡像，或是像這篇一樣——直接把裝好的套件目錄打包帶過去。對只需要裝一兩個套件的情境，打包搬移是最快的方式。

## 事前準備：在連網機器上打包 pm2

先在一台能連網的 Linux 伺服器上安裝 pm2：

\`\`\`bash
npm install pm2 -g
\`\`\`

接著查詢本機 npm 預設的全域安裝目錄：

\`\`\`bash
npm config get prefix
\`\`\`

如果顯示 \`/usr/local/node\`，那麼 npm 預設的全域安裝目錄就是 \`/usr/local/node/lib/node_modules/\`。

進到全域目錄下找到 pm2：

\`\`\`bash
cd /usr/local/node/lib/node_modules/
\`\`\`

把 pm2 目錄打包成 tarball：

\`\`\`bash
tar -cvzf pm2.tar.gz pm2
\`\`\`

## 安裝方式：上傳、解壓縮、重新編譯

把 \`pm2.tar.gz\` 上傳到無網路的 Linux 伺服器上 npm 預設的全域目錄下，解壓縮：

\`\`\`bash
tar -xvzf pm2.tar.gz
\`\`\`

接著重新編譯：

\`\`\`bash
npm build pm2 -g
\`\`\`

大功告成，最後檢驗安裝是否可用：

\`\`\`bash
pm2 -v
\`\`\`

如果可以看到 pm2 的版本資訊，代表離線安裝成功。

## 離線安裝 pm2 要注意什麼？

- **兩台機器的環境要盡量一致**：Node.js 版本與作業系統架構差異太大時，含原生模組的套件可能出問題；pm2 本身以純 JavaScript 為主，通常沒有影響。
- **路徑要對**：解壓縮的位置必須是目標機器 npm 的全域目錄（用 \`npm config get prefix\` 確認），否則全域指令會找不到。
- **權限**：若全域目錄需要 root 權限，tar 解壓縮與 \`npm build\` 記得搭配 \`sudo\`。

## 2026 年的現在，我會怎麼做？現代 npm 的離線安裝替代方案

上面這套流程是我 2019 年的做法。要提醒的是，\`npm build pm2 -g\` 這個指令在較新的 npm 版本已經被移除了，舊環境可以用，但新機器上會失敗。現在我會改用 npm 內建的 tarball 安裝流程，官方支援、更乾淨：

在連網機器上直接把套件打包成 npm 標準的 tarball：

\`\`\`bash
npm pack pm2
\`\`\`

會產生像 \`pm2-5.x.x.tgz\` 這樣的檔案，把它上傳到離線伺服器後，一個指令完成安裝（連依賴都會一併打包在內，不需要另外搬 node_modules）：

\`\`\`bash
npm install -g ./pm2-5.x.x.tgz
\`\`\`

同樣用 \`pm2 -v\` 驗證即可。如果離線機器連 npm 環境都不齊，另一條路是把 Node.js 本體整包（tarball 版）連同全域目錄一起搬過去，這在完全無網路的內網主機上也是常見做法。

## 常見問題

### 沒有網路的伺服器要怎麼安裝 pm2？

先在能連網的機器上 \`npm install pm2 -g\`，到 npm 全域目錄（\`npm config get prefix\` 查出的路徑下的 \`lib/node_modules/\`）把 pm2 目錄 \`tar -cvzf\` 打包，上傳到目標伺服器解壓後執行 \`npm build pm2 -g\` 即可。

### 怎麼知道 npm 的全域安裝目錄在哪裡？

執行 \`npm config get prefix\`，它輸出的路徑再加上 \`lib/node_modules/\` 就是全域套件的安裝位置。例如 prefix 是 \`/usr/local/node\`，全域目錄就是 \`/usr/local/node/lib/node_modules/\`。

### 安裝完怎麼確認 pm2 可以用？

執行 \`pm2 -v\`，有正常顯示版本資訊就代表安裝成功。若出現 command not found，通常是解壓路徑不在 npm 全域目錄，或該目錄不在 \`PATH\` 設定內。

### \`npm build pm2 -g\` 這步是必須的嗎？

是。打包搬移只帶走了套件原始檔，\`npm build -g\` 會在目標機器上完成註冊與連結，讓 \`pm2\` 指令可以被全域呼叫。跳過這步可能會找不到指令。

## 參考資料

- [pm2 官方文件](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [npm config 文件](https://docs.npmjs.com/cli/v6/commands/npm-config)

## 延伸閱讀

- [Node.js 與 npm 離線安裝教學：無網路伺服器安裝指南](/post/nodejs-npm-offline-install)：同樣聚焦 Node.js、npm，可接著比較不同情境的做法。
- [Linux 用 pm2 來管理伺服器](/post/linux-pm2-server-management)：同樣聚焦 pm2、Node.js，可接著比較不同情境的做法。
- [使用 PM2 管理 Node.js 伺服器教學](/post/pm2-node-server-management)：同樣聚焦 Node.js，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2019-09-28，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};