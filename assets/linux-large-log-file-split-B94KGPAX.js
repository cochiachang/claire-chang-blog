var e=`---
title: Linux 大檔案分割教學：split 按大小/行數切割與 logrotate 定時輪替 LOG
description: Linux 大型 log 檔怎麼分割處理？整理 split、grep、sed 等指令切割數 GB 大檔案的方法與參數範例，搭配 logrotate 輪替概念，處理伺服器日誌時能快速切出需要的記錄段落。
date: 2020-03-18
category: DevOps
tags: [Linux, split, logrotate, 日誌管理, DevOps]
readingTime: 5 分鐘
image: /images/tech/hero_linux-large-log-file-split.webp
imageAlt: Linux 大檔案分割與 logrotate 日誌輪替示意圖
---


# Linux 大檔案分割教學：split 按大小/行數切割與 logrotate 定時輪替 LOG

這篇文章解決「檔案或 LOG 太大要怎麼管理」的問題。我會先整理 \`split\` 指令按大小、行數、二進位檔切割的三種用法，接著介紹 \`logrotate\` 的選項、設定檔範例與常用參數，最後說明如何立刻手動執行一次 logrotate。

## 如何用 split 指令分割大檔案？

**按檔案大小分割**：

\`\`\`cmd
split -C 100M large_file.txt stxt
\`\`\`

**按行數分割**：

\`\`\`cmd
split -l 1000 large_file.txt stxt
\`\`\`

**二進位檔案分割**（以 \`-b\` 參數指定分割後的檔案大小）：

\`\`\`cmd
split -b 100M data.bak sdata
\`\`\`

## logrotate 是做什麼的？

logrotate 的官方說明請見 [logrotate.conf(5) - Linux man page](https://linux.die.net/man/5/logrotate.conf)。

> logrotate 旨在簡化對生成大量日誌文件的系統的管理。它允許自動旋轉、壓縮、刪除和郵寄日誌文件。每個日誌文件可以每天、每週、每月或當文件太大時進行處理。
>
> 通常，logrotate 作為日常 cron 作業運行。除非該日誌的標準基於日誌的大小並且每天要多次運行 logrotate，或者除非使用了 \`-f\` 或 \`--force\` 選項，否則它不會在一天內多次修改日誌。
>
> 命令行上可以提供任意數量的配置文件。較新的配置文件可能會覆蓋較早的文件中提供的選項，因此列出 logrotate 配置文件的順序很重要。通常，應使用包含所需其他任何配置文件的單個配置文件（有關如何使用 include 指令完成此操作，請參見 man page）。如果在命令行上給出了目錄，則該目錄中的每個文件都將用作配置文件。
>
> 如果未提供命令行參數，logrotate 將打印版本和版權信息以及簡短的使用摘要。如果輪換日誌時發生任何錯誤，logrotate 將以非零狀態退出。

## logrotate 有哪些 Options？

- \`-d，--debug\`：打開調試模式並暗含 \`-v\`。在調試模式下，將不會對日誌或 \`logrotate\` 狀態文件進行任何更改。
- \`-f，--force\`：告訴 \`logrotate\` 強制 rotate，即使它認為沒有必要也是如此。有時，在將新條目添加到 \`logrotate\` 配置文件後，或者如果手動刪除了舊日誌文件，這將很有用，因為將創建新文件，並且日誌記錄將繼續正確進行。
- \`-m, --mail <command>\`：告訴 logrotate 郵寄日誌時使用哪個命令。此命令應接受兩個參數：1）郵件的主題，2）收件人。然後該命令必須閱讀標準輸入上的消息並將其郵寄給收件人。預設的 mail 命令是 \`/bin/mail -s\`。
- \`-s, --state <statefile>\`：告訴 logrotate 使用備用狀態文件。如果 logrotate 以不同的用戶身份運行各種日誌文件集，這將很有用。預設狀態文件是 \`/var/lib/logrotate.status\`。
- \`--usage\`：打印簡短的使用信息。
- \`--?, --help\`：打印幫助消息。
- \`-v, --verbose\`：打開詳細模式。

## logrotate.conf 範例長什麼樣？

\`\`\`js
# sample logrotate configuration file
compress

/var/log/messages {
    rotate 5
    weekly
    postrotate
        /usr/bin/killall -HUP syslogd
    endscript
}

"/var/log/httpd/access.log" /var/log/httpd/error.log {
    rotate 5
    mail www@my.org
    size 100k
    sharedscripts
    postrotate
        /usr/bin/killall -HUP httpd
    endscript
}

/var/log/news/* {
    monthly
    rotate 2
    olddir /var/log/news/old
    missingok
    postrotate
        kill -HUP 'cat /var/run/inn.pid'
    endscript
    nocompress
}
\`\`\`

## logrotate 常用參數有哪些？

- \`copytruncate\`：會先複製一個 log 檔然後再將原本的 log 檔案清空，可用在無法通知使用此 Log 檔案的程序停止寫入的狀態。
- \`compress\`：是否要壓縮分割後的 log。
- \`daily, monthly, weekly, yearly\`：多久分割一次。
- \`missingok\`：沒有此檔案也不跳錯誤。

## logrotate 的相關檔案有哪些？

- \`/etc/logrotate.conf\`：Configuration options（主要設定檔）。
- \`/var/lib/logrotate.status\`：Default state file（預設狀態檔）。
- \`/etc/cron.daily/logrotate\`：每天執行（如要改成每小時執行，可以將 \`logrotate\` 移到 \`cron.hourly\`）。

logrotate 是在規定的時間到了之後才來進行登錄檔的輪替，所以這個 logrotate 程序當然就是掛在 cron 底下進行的。

## 如何立刻執行 logrotate？

\`\`\`cmd
logrotate -v /etc/logrotate.conf
\`\`\`

![logrotate -v 執行時的詳細輸出截圖，顯示各項處理參數](/images/articles/linux-large-log-file-split-1.webp)

## 常見問題

### split 怎麼按行數分割檔案？

使用 \`split -l 1000 large_file.txt stxt\`，其中 \`-l 1000\` 代表每 1000 行切割成一個檔案，輸出檔名以 \`stxt\` 為前綴。二進位檔則改用 \`-b\`（如 \`split -b 100M data.bak sdata\`）。

### logrotate 是怎麼定時執行的？

logrotate 掛在 cron 底下執行，預設透過 \`/etc/cron.daily/logrotate\` 每天輪替一次；若要改成每小時執行，可以把 logrotate 移到 \`cron.hourly\`。

### logrotate 也可以按檔案大小輪替嗎？

可以。在設定檔中加上 \`size 100k\` 這類條件，日誌超過指定大小就會觸發輪替；若需要一天內多次輪替，要配合 \`-f\`（\`--force\`）選項執行。

### 改完 logrotate 設定後想馬上驗證怎麼辦？

直接手動執行 \`logrotate -v /etc/logrotate.conf\`，加上 \`-v\` 可以看到詳細的處理過程；若只是想測試而不真的輪替，可用 \`-d\`（debug）模式，它不會對日誌或狀態檔做任何更改。

## 參考資料

- [logrotate.conf(5) - Linux man page](https://linux.die.net/man/5/logrotate.conf)
- [Linux 中 split 大檔案分割和 cat 合併檔案詳解](https://codertw.com/%E4%BC%BA%E6%9C%8D%E5%99%A8/377205/)
- [[CENTOS7] 使用 logrotate 來整理 mongo 日誌檔](http://n.sfs.tw/content/index/12980)
- [鳥哥的 Linux 私房菜：登錄檔的輪替 (logrotate)](https://linux.vbird.org/linux_basic/)

## 延伸閱讀

- [Linux 用 pm2 來管理伺服器](/post/linux-pm2-server-management)：同樣聚焦 Linux、DevOps，可接著比較不同情境的做法。
- [查看某個 Linux 裡服務的狀態](/post/check-linux-service-status)：同樣聚焦 Linux、DevOps，可接著比較不同情境的做法。
- [線上練習 Linux 指令：不用裝虛擬機的 4 個免費網站](/post/practice-linux-commands-online)：同樣聚焦 Linux、DevOps，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2020-03-18，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};