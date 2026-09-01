var e=`---
title: Linux 檢查硬碟使用量：df 指令完整教學
description: 用 df 指令檢查 Linux 硬碟使用量：查詢各分割區磁碟空間、以 -h 顯示人類可讀單位、用 -l 只看本機磁碟，附實際輸出截圖與常見問題整理。
date: 2019-10-08
category: DevOps
tags: [Linux, df, 硬碟使用量, 磁碟管理, DevOps]
readingTime: 3 分鐘
image: /images/tech/hero_linux-check-disk-usage.webp
imageAlt: 終端機畫面上顯示 Linux shell 提示符與 sudo 指令
---


# Linux 檢查硬碟使用量：df 指令完整教學

在 Linux 上檢查硬碟使用量，最常用的就是 \`df\` 指令。這篇筆記整理我在管理伺服器時最常
用到的幾種 df 用法：查看整體磁碟用量、查詢單一分割區、改變顯示單位，以及只列出本機磁碟。

## 如何用 df 指令查看硬碟使用量？

直接輸入 \`df\` 指令：

\`\`\`bash
df
\`\`\`

![df 指令的輸出，顯示各檔案系統的磁碟使用量](/images/articles/linux-check-disk-usage-1.webp)

輸出中每一列代表一個檔案系統，重點欄位有：

- **Mounted on**：這個空間是掛載在哪一個分割區（路徑）。
- **Used / Available**：已使用與可用的空間。
- **Use%**：使用率百分比，巡伺服器時最先看這一欄。

## 如何查詢某個分割區的硬碟使用狀況？

在 \`df\` 後面接上掛載路徑，就只會顯示該分割區的資訊。例如查詢 \`/dev\`：

\`\`\`bash
df /dev
\`\`\`

![df /dev 只顯示 dev 分割區的使用狀況](/images/articles/linux-check-disk-usage-2.webp)

這個用法在只想確認某個目錄所在分割區還剩多少空間時特別方便，例如上線前檢查網站目錄
所在的分割區空間是否足夠。

## 如何讓 df 顯示人類可讀的單位（KB → GB）？

預設的 \`df\` 輸出會以 KB 為單位顯示磁碟用量，但是現在的硬碟容量都很大，這樣的輸出較
不好閱讀。這時可以加上 \`-h\`（human-readable），以適合閱讀的單位（如 GB）顯示資訊：

\`\`\`bash
df -h
\`\`\`

![df -h 以人類可讀單位顯示磁碟用量](/images/articles/linux-check-disk-usage-3.webp)

\`-h\` 是日常最常用的參數，一眼就能看出每個分割區還剩多少可用空間。

## 如何只顯示本機磁碟？

加上 \`-l\` 參數，可以只列出本機的檔案系統，過濾掉 NFS 等遠端掛載：

\`\`\`bash
df -l
\`\`\`

![df -l 只顯示本機磁碟的使用狀況](/images/articles/linux-check-disk-usage-4.webp)

## 常見問題

### df 和 du 有什麼差別？

\`df\` 查看的是「檔案系統」層級的磁碟使用量（整個分割區），而 \`du\` 是逐目錄統計檔案
實際佔用的空間。巡伺服器整體空間用 \`df\`，找出哪個目錄最肥用 \`du\`。

### df -h 的 -h 是什麼意思？

\`-h\` 是 human-readable 的縮寫，會把 KB 之類的原始數字自動換算成 KB、MB、GB 等易讀
單位。另一個類似參數 \`-H\` 則是以 1000 為進位（SI 單位）。

### 為什麼 df 顯示的使用量和實際檔案大小加總不一致？

常見原因是檔案已被刪除但仍有程式持有開啟的 file descriptor，空間不會立刻釋放。另外
ext 檔案系統會保留約 5% 的 reserved blocks 給 root，也不會計入可用空間。

### 如何只查某個目錄所在分割區的空間？

直接把目錄路徑接在 df 後面，例如 \`df /var\`，就會顯示該目錄所在檔案系統的使用狀況。
搭配 \`-h\` 使用：\`df -h /var\`。

## 延伸閱讀

- [Linux 刪除檔案後空間未釋放？用 lsof 找出 unlinked 檔案並釋放磁碟空間](/post/linux-deleted-file-space-not-released)：同樣聚焦 Linux、df，可接著比較不同情境的做法。
- [取得 Linux 安裝的系統版本：uname、/proc/version 與 /etc/os-release 指令教學](/post/get-linux-distribution-version)：同樣聚焦 Linux、DevOps，可接著比較不同情境的做法。
- [查看某個 Linux 裡服務的狀態](/post/check-linux-service-status)：同樣聚焦 Linux、DevOps，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2019-10-08，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};