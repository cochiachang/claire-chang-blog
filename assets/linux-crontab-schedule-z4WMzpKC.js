var e=`---
title: Linux crontab 排程設定教學：時間格式、特殊字元與常用範例
description: 說明 Linux crontab 如何查看、編輯、刪除與設定排程，包含五欄時間格式、星號、逗號、區間與每隔幾分鐘範例。
date: 2020-03-26
category: DevOps
tags: [Linux, crontab, 排程]
readingTime: 6 分鐘
image: /images/tech/hero_linux-crontab-schedule.webp
imageAlt: Linux crontab 排程與自動化任務示意圖
---
# Linux crontab 排程設定教學：時間格式、特殊字元與常用範例

Linux crontab 可用固定時間格式執行週期性任務，例如每天備份、每 10 分鐘檢查服務或每月產生報表。設定時最重要的是看懂五個時間欄位，並確認任務使用絕對路徑與正確環境變數。

## 如何查看與編輯 crontab？

crontab 的常用操作包含查看、編輯與刪除。一般使用者可管理自己的 crontab，具 sudo 權限者也可查看或編輯指定使用者的 crontab。

查看自己的 crontab：

\`\`\`bash
crontab -l
\`\`\`

查看指定使用者的 crontab：

\`\`\`bash
sudo crontab -u gtwang -l
\`\`\`

編輯自己的 crontab：

\`\`\`bash
crontab -e
\`\`\`

編輯指定使用者的 crontab：

\`\`\`bash
sudo crontab -u gtwang -e
\`\`\`

刪除自己的 crontab：

\`\`\`bash
crontab -r
\`\`\`

刪除前建議先用 \`crontab -l > backup.cron\` 備份，因為 \`crontab -r\` 不會逐項詢問。

## crontab 時間格式怎麼看？

crontab 使用五個時間欄位，依序代表分鐘、小時、日期、月份與星期。每一列後方接要執行的 command。

格式如下：

\`\`\`text
# .---------------- minute (0 - 59)
# |  .------------- hour (0 - 23)
# |  |  .---------- day of month (1 - 31)
# |  |  |  .------- month (1 - 12) OR jan,feb,mar,apr ...
# |  |  |  |  .---- day of week (0 - 6) (Sunday=0 or 7) OR sun,mon,tue,wed,thu,fri,sat
# |  |  |  |  |
# *  *  *  *  * command to be executed
\`\`\`

在使用者自己的 crontab 中，通常不需要寫 \`user-name\` 欄位；\`/etc/crontab\` 這類系統層級檔案才常見 user 欄位。

## crontab 常用範例有哪些？

crontab 範例最好從需求句子反推時間欄位。先寫出「每天幾點」、「每週幾」、「每隔多久」，再填入五欄格式。

\`\`\`bash
# 每天早上 8 點 30 分執行
30 08 * * * /home/gtwang/script.sh --your --parameter

# 每週日下午 6 點 30 分執行
30 18 * * 0 yourcommand

# 每週日下午 6 點 30 分執行
30 18 * * Sun yourcommand

# 每年 6 月 10 日早上 8 點 30 分執行
30 08 10 06 * yourcommand

# 每月 1 日、15 日、29 日晚上 9 點 30 分各執行一次
30 21 1,15,29 * * yourcommand

# 每隔 10 分鐘執行一次
*/10 * * * * yourcommand

# 從早上 9 點到下午 6 點，凡遇到整點就執行
00 09-18 * * * yourcommand
\`\`\`

資訊增益：crontab 裡的 command 建議使用絕對路徑，例如 \`/usr/bin/node /app/job.js\`。cron 的環境變數比登入 shell 少，很多「手動執行會過、排程不會過」都和 PATH 不同有關。

## crontab 特殊字元代表什麼？

crontab 特殊字元用來表達任意時間、多個值、區間與間隔。看懂 \`*\`、\`,\`、\`-\`、\`/\` 就能處理多數排程。

| 特殊字元 | 代表意義 | 範例 |
| --- | --- | --- |
| \`*\` | 任意值 | \`* * * * *\` 每分鐘 |
| \`,\` | 多個指定值 | \`0 3,6,9 * * *\` 每天 3、6、9 點 |
| \`-\` | 一段區間 | \`0 8-12 * * *\` 8 點到 12 點整點 |
| \`/n\` | 每隔 n 單位 | \`*/5 * * * *\` 每 5 分鐘 |

如果排程牽涉時區，應確認 server timezone。容器環境、雲端主機與本機開發機的時區可能不同。

## crontab 任務如何避免常見錯誤？

crontab 任務最常失敗在路徑、權限、環境變數與輸出未記錄。每個排程都應該能被手動執行，並把 stdout、stderr 寫入 log。

建議寫法：

\`\`\`bash
*/10 * * * * /usr/bin/bash /opt/jobs/check.sh >> /var/log/check-job.log 2>&1
\`\`\`

檢查表：

| 檢查項目 | 建議 |
| --- | --- |
| command 路徑 | 使用絕對路徑 |
| shell | 明確指定 bash 或 sh |
| log | 將 stdout/stderr 寫到檔案 |
| 權限 | 確認執行使用者可讀寫目標 |
| 重複執行 | 長任務需加 lock 避免疊在一起 |

若排程任務可能執行超過間隔時間，應加 lock file 或使用 systemd timer、任務佇列等更可控的機制。

## 常見問題

### crontab 的星期 0 是星期幾？

多數 cron 實作中，星期 0 或 7 都代表星期日。也可使用 \`Sun\` 讓設定較易讀。

### \`crontab -e\` 和 \`/etc/crontab\` 有什麼不同？

\`crontab -e\` 編輯目前使用者的排程，通常不寫 user 欄位。\`/etc/crontab\` 是系統層級排程，常會多一欄指定執行使用者。

### 為什麼 crontab 手動執行可以、排程執行失敗？

最常見原因是 PATH、工作目錄、環境變數或權限不同。排程 command 應使用絕對路徑並寫 log。

### 每 10 分鐘執行一次怎麼寫？

可寫成 \`*/10 * * * * yourcommand\`。這代表每個小時的 0、10、20、30、40、50 分執行。

### crontab 適合跑所有背景任務嗎？

不一定。簡單週期任務適合 crontab；需要重試、佇列、依賴關係或監控告警的任務，應考慮 systemd timer、任務佇列或工作流系統。

## 參考資料

- man7.org：[crontab(5)](https://man7.org/linux/man-pages/man5/crontab.5.html)
- Ubuntu Documentation：[CronHowto](https://help.ubuntu.com/community/CronHowto)
- Debian Manpages：[crontab](https://manpages.debian.org/crontab)

## 延伸閱讀

- [Linux 開機自動執行程式：profile、bashrc 與 bash_logout 設定教學](/post/linux-startup-programs-rc-local)：同樣聚焦 Linux，可接著比較不同情境的做法。
- [Linux 給使用者 sudo 權限：useradd、visudo 與 wheel 群組設定](/post/linux-sudo-user-permission)：同樣聚焦 Linux，可接著比較不同情境的做法。
- [Linux 基本操作指令介紹](/post/linux-basic-commands-cheatsheet)：同樣聚焦 Linux，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2026-08-28。原文發布於 2020-03-26，本文補上使用者 crontab 與系統 crontab 差異，以及排程除錯檢查表。

`;export{e as default};