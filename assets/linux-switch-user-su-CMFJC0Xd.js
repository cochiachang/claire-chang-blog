var e=`---
title: Linux切換使用者：su 與 sudo -u 指令完整教學
description: 在 Linux 上切換使用者有兩種主要做法：su - 與 sudo -u。本文用實際終端機範例示範 su 切換使用者、exit 跳回、以及 sudo -u 以指定使用者執行指令，並說明兩者的差異與適用時機。
date: 2019-09-23
category: DevOps
tags: [Linux, su, sudo, 使用者管理, 權限]
readingTime: 3 分鐘
image: /images/tech/hero_linux-switch-user-su.webp
imageAlt: 終端機畫面顯示程式碼與命令列輸出，代表 Linux 指令操作
---


# Linux切換使用者：su 與 sudo -u 指令完整教學

在 Linux 伺服器管理中，經常需要以不同使用者的身分執行指令或測試權限。這篇文章整理兩種最常用的切換使用者方式：\`su\` 與 \`sudo -u\`，附上實際終端機操作範例，並說明 \`exit\` 如何跳回原本的使用者。

## 如何用 su 切換使用者？

\`su\`（switch user）是最直接的切換使用者指令，加上 \`-\` 參數會連環境變數一起載入目標使用者的完整登入環境：

\`\`\`bash
$ whoami
user1
$ su - user2
Password:
$ whoami
user2
$ exit
logout
\`\`\`

操作重點：

- 執行 \`su - user2\` 後系統會要求輸入 **user2 的密碼**（不是自己的）。
- \`-\`（等同 \`-l\` / \`--login\`）會載入 user2 的家目錄與環境變數；不加 \`-\` 則只切換身分、保留原本環境。
- 操作完輸入 \`exit\` 或按 \`Ctrl+D\` 就會 logout，回到原本的使用者。

## 如何用 sudo 以指定使用者執行指令？

如果不想真正登入另一個使用者，可以用 \`sudo -u\` 直接以該使用者身分執行單一指令，例如開一個新的 shell：

\`\`\`bash
$ whoami
user1
$ sudo -u user2 zsh
$ whoami
user2
\`\`\`

這種方式的前提是自己的帳號在 sudoers 白名單中。與 \`su\` 最大的差別在於：\`sudo\` 只需要輸入**自己的密碼**（或設定為免密碼），不需要知道目標使用者的密碼，因此更適合管理者臨時授權或自動化腳本使用。

## su 與 sudo -u 有什麼差別？

| 比較項目 | \`su - user2\` | \`sudo -u user2 <指令>\` |
| --- | --- | --- |
| 需要的密碼 | user2 的密碼 | 自己的密碼（或免密碼） |
| 權限依據 | 目標使用者帳號 | sudoers 設定 |
| 適用情境 | 長時間以該使用者操作 | 單次執行指令或短暫切換 |
| 環境變數 | 加 \`-\` 載入完整登入環境 | 可搭配 \`-i\` 或 \`-H\` 控制 |
| 離線方式 | \`exit\` 登出 | 指令執行完即結束 |

實務上的分工：管理者臨時要幫某個服務帳號跑指令時用 \`sudo -u\`；要完整模擬該使用者登入環境除錯時用 \`su -\`。

## 常見問題

### su 和 su - 有什麼不同？

\`su user2\` 只切換使用者身分，保留原本的環境變數與工作目錄；\`su - user2\` 會以 login shell 方式載入 user2 完整的環境設定（PATH、家目錄等）。要模擬真正的登入環境時建議加 \`-\`。

### sudo -u 需要 root 密碼嗎？

不需要。\`sudo -u user2 <指令>\` 驗證的是你自己的密碼（若帳號已設定 NOPASSWD 則連密碼都不用），前提是你的帳號必須被列在 sudoers 中並允許以該使用者執行。

### 為什麼 su 切換後指令找不到或路徑不對？

因為沒有加 \`-\`，環境變數（特別是 PATH）仍是原本使用者的設定。改用 \`su - user2\` 重新載入完整登入環境即可解決。

### 如何離開 su 切換後的環境？

直接輸入 \`exit\` 或按 \`Ctrl+D\`，就會結束該 shell 並回到切換前的使用者，終端機會顯示 \`logout\`。

## 參考資料

- 本文為 Claire Chang 的 Linux 伺服器管理筆記系列（IT邦幫忙鐵人賽），可搭配 [Linux sudo 與使用者權限設定](/post/linux-sudo-user-permission) 閱讀。

## 延伸閱讀

- [Linux 給使用者 sudo 權限：useradd、visudo 與 wheel 群組設定](/post/linux-sudo-user-permission)：同樣聚焦 Linux、sudo，可接著比較不同情境的做法。
- [Linux sudoers is world writable 錯誤修復：/etc/sudoers 權限檢查與還原](/post/sudoers-world-writable-error)：同樣聚焦 Linux、sudo，可接著比較不同情境的做法。
- [Linux 開機自動執行程式：profile、bashrc 與 bash_logout 設定教學](/post/linux-startup-programs-rc-local)：同樣聚焦 Linux，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2019-09-23，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};