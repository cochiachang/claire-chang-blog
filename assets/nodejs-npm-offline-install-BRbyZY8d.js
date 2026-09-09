var e=`---
title: Node.js 與 npm 離線安裝教學：無網路伺服器安裝指南
description: 離線安裝 Node.js 和 npm 怎麼做？本文整理在無網路的 Linux 伺服器上，透過官方安裝包解壓、搬移到 /opt 並建立符號連結，完成 node 與 npm 命令離線安裝的完整步驟與驗證方法。
date: 2019-09-29
category: DevOps
tags: [Node.js, npm, 離線安裝, Linux, 伺服器環境]
readingTime: 3 分鐘
image: /images/tech/hero_nodejs-npm-offline-install.webp
imageAlt: Node.js 與 npm 離線安裝示意：在 Linux 伺服器終端機執行安裝命令
---


# Node.js 與 npm 離線安裝教學：無網路伺服器安裝指南

在沒有對外網路的伺服器上要安裝 Node.js 和 npm，只要先把官方安裝包拷貝過去，解壓後建立符號連結即可，不需要編譯原始碼。這篇文章整理完整的離線安裝步驟。

## 離線安裝 Node.js 要準備什麼？

只需要一份官方安裝包。先在有網路的機器上從官方下載頁取得對應平台的安裝包，再拷貝到離線機器上：

官方下載地址：[https://nodejs.org/en/download/](https://nodejs.org/en/download/)

## 怎麼解壓並安裝到系統目錄？

以 Linux x64 的 \`.tar.xz\` 安裝包為例：

### 1. 解壓檔案

\`\`\`bash
tar -xJf node-v8.9.4-linux-x64.tar.xz
\`\`\`

### 2. 放到相應目錄（例如 /opt/）

\`\`\`bash
sudo mv node-v8.9.4-linux-x64 /opt/
\`\`\`

### 3. 建立檔案連結，讓 node 與 npm 命令進入系統命令

\`\`\`bash
sudo ln -s /opt/node-v8.9.4-linux-x64/bin/node /usr/local/bin/node
\`\`\`

\`\`\`bash
sudo ln -s /opt/node-v8.9.4-linux-x64/bin/npm /usr/local/bin/npm
\`\`\`

## 怎麼確認安裝成功？

檢查 node 與 npm 的版本輸出即可：

\`\`\`bash
node -v

npm -v
\`\`\`

兩個命令都能正確回傳版本號，就代表離線安裝完成。

## 常見問題

### 離線安裝 Node.js 一定要編譯原始碼嗎？

不用。官方提供各平台的預編譯二進位安裝包（如 linux-x64 的 .tar.xz），解壓後把 node 與 npm 用 \`ln -s\` 建立符號連結到 \`/usr/local/bin\` 就能直接使用，過程不需要編譯。

### 為什麼要建立符號連結到 /usr/local/bin？

解壓出來的執行檔放在 \`/opt/node-vX.Y.Z-linux-x64/bin/\` 下，系統預設的 PATH 找不到它們。用 \`ln -s\` 把 node 和 npm 連結到 \`/usr/local/bin\`，之後在任何目錄都能直接執行這兩個命令。

### 版本太舊的安裝包還能用嗎？

文章中使用的是 node v8.9.4 作為示範，實際安裝時請到 [Node.js 官方下載頁](https://nodejs.org/en/download/) 選擇目前所需的 LTS 版本，步驟完全相同，只要替換檔名中的版本號即可。

## 參考資料

- [Node.js 官方下載頁](https://nodejs.org/en/download/)

本文其餘內容整理自個人實作筆記。

## 延伸閱讀

- [在 Linux 離線安裝 pm2 的完整步驟教學](/post/install-pm2-offline-linux)：同樣聚焦 Linux、Node.js，可接著比較不同情境的做法。
- [Linux 用 pm2 來管理伺服器](/post/linux-pm2-server-management)：同樣聚焦 Node.js、Linux，可接著比較不同情境的做法。
- [Angular NPM 與 package.json 設定教學](/post/angular-npm-package-json-setup)：同樣聚焦 npm、Node.js，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2019-09-29，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};