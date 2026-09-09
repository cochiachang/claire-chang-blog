var e=`---
title: 查看某個 Linux 裡服務的狀態
description: 想知道 Linux 伺服器上某個服務或程序是否正常運作？本文整理 ps、ps aux、grep 過濾與 service status 等常用指令，搭配實際終端機截圖，快速查看 Linux 服務與程序的運行狀態。
date: 2019-10-05
category: DevOps
tags: [Linux, 服務管理, ps, 系統管理, DevOps]
readingTime: 3 分鐘
image: /images/tech/hero_check-linux-service-status.webp
imageAlt: 終端機畫面上顯示 Linux 程序與服務的運行狀態列表
---


# 查看某個 Linux 裡服務的狀態

管理 Linux 伺服器時，最基本也最常見的問題之一就是：「這個服務現在到底有沒有在跑？」這篇文章整理幾個我常用來查看 Linux 服務與程序狀態的指令，包括 \`ps\` 搭配 \`grep\` 過濾程序、以及用 \`service\` 查詢單一服務的運行狀態，並附上實際終端機截圖，讓你可以直接照著操作。

## 怎麼用 ps 指令查看程序的運作情況？

\`ps\` 指令可以將某個時間點的程序運作情況擷取下來，是查看 Linux 程序狀態最基礎的工具。

![ps 指令的常用參數說明](/images/articles/check-linux-service-status-1.webp)

### 僅觀察自己的 bash 相關程序

只想看自己這個登入環境底下相關的程序時，使用：

\`\`\`bash
ps -l
\`\`\`

![ps -l 觀察自己的 bash 相關程序](/images/articles/check-linux-service-status-2.webp)

### 觀察系統所有程序

想看整台機器上所有正在執行的程序，使用：

\`\`\`bash
ps aux
\`\`\`

![ps aux 觀察系統所有程序](/images/articles/check-linux-service-status-3.webp)

若覺得這個列表太長，可以搭配 \`grep\`（或 \`egrep\`）來過濾出想要知道的服務，例如想同時確認 cron 與 rsyslog 這兩個服務：

\`\`\`bash
[root@study ~]# ps aux | egrep '(cron|rsyslog)'
\`\`\`

| 常用指令 | 用途 |
| --- | --- |
| \`ps -l\` | 僅觀察自己 bash 相關的程序 |
| \`ps aux\` | 觀察系統所有程序 |
| \`ps aux \\| grep <服務名>\` | 過濾出特定服務的程序 |

## 怎麼用 service 命令查詢單一服務的狀態？

如果只想確認某一個服務的運行狀態，直接使用 \`service\` 指令加上 \`status\` 參數即可：

\`\`\`bash
[root@localhost ~]# service sshd status
\`\`\`

這會回傳該服務（此例為 sshd）目前是否正在執行，以及相關的程序資訊，比在 \`ps aux\` 裡慢慢找更快。

## 有更完整的服務管理工具嗎？

\`service\` 屬於較舊式的 SysV init 管理方式，現代發行版多改用 \`systemctl\`。若需要更完整的服務管理（啟動、停止、開機自動啟用等），可以參考我的另一篇筆記：[Linux 管理 Service 的指令](/post/systemctl-target-runlevel)，以及整理新舊指令對照的 [Linux 服務管理指令：chkconfig 與 service](/post/linux-service-commands-chkconfig-service)。

## 常見問題

### ps 與 service status 有什麼差別？

\`ps\` 擷取的是某個時間點所有程序的快照，適合用來確認「某個程序」是否存在；\`service <服務> status\` 則是針對「註冊過的服務」查詢狀態，會由服務管理系統回報是否運行中。兩者搭配使用最保險。

### ps aux 輸出太長怎麼辦？

用管線搭配 \`grep\` 過濾即可，例如 \`ps aux | egrep '(cron|rsyslog)'\` 只會列出名稱包含 cron 或 rsyslog 的程序列。

### 現在的 Linux 還能用 service 指令嗎？

多數主流發行版（CentOS 7+、Ubuntu 16.04+）已改用 systemd，\`service\` 指令通常還能使用（會被轉接到 systemctl），但新寫法建議直接用 \`systemctl status <服務名>\`。

### 怎麼確認服務有沒有在背景執行？

先 \`ps aux | grep <服務名>\` 看是否有對應程序，或用 \`service <服務> status\`／\`systemctl status <服務名>\` 查詢，輸出中的 \`active (running)\` 即代表正在執行。

## 參考資料

- [鳥哥的 Linux 私房菜：第十六章、程序管理與 SELinux 初探](https://linux.vbird.org/linux_basic/centos7/0160startlinux.php)
- [Linux 查看服务状态（服务与进程）](https://www.freedesktop.org/software/systemd/man/latest/systemctl.html)

## 延伸閱讀

- [Linux 管理 Service 的指令：systemctl 完整用法與範例](/post/linux-service-commands-chkconfig-service)：同樣聚焦 Linux、服務管理，可接著比較不同情境的做法。
- [Linux 開機自動執行程式：profile、bashrc 與 bash_logout 設定教學](/post/linux-startup-programs-rc-local)：同樣聚焦 Linux、系統管理，可接著比較不同情境的做法。
- [Linux 用 pm2 來管理伺服器](/post/linux-pm2-server-management)：同樣聚焦 Linux、DevOps，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2019-10-05，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};