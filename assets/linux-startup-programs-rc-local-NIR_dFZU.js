var e=`---
title: Linux 開機自動執行程式：profile、bashrc 與 bash_logout 設定教學
description: 整理 Linux 設定開機與登入自動執行程式的方法：/etc/profile、~/.bash_profile、~/.bashrc 與 ~/.bash_logout 的差異、寫法與執行權限設定。
date: 2019-09-21
category: DevOps
tags: [Linux, bash, Shell Script, 系統管理]
readingTime: 4 分鐘
image: /images/tech/hero_linux-startup-programs-rc-local.webp
imageAlt: Linux 終端機命令列畫面，顯示開機自動執行程式相關設定
---


# Linux 開機自動執行程式：profile、bashrc 與 bash_logout 設定教學

在 Linux 上想讓程式「開機後自動執行」，最常見的做法不是改 rc.local，而是把指令寫進 shell 的設定檔：所有使用者共用就寫 \`/etc/profile\`，個別使用者就寫家目錄下的 profile 類檔案。這篇文章整理我實際設定時的做法，包含登入、非登入 shell 的差異，以及登出時自動執行程式的方法。

## 如何讓所有使用者登入時自動執行程式？

編輯 \`/etc/profile\`，在檔案最後加上要執行的指令即可：

\`\`\`bash
vi /etc/profile
\`\`\`

在裡面打入要執行的指令，例如：

\`\`\`bash
/home/gtwang/my_script.sh
\`\`\`

![在 /etc/profile 加入開機自動執行的指令](/images/articles/linux-startup-programs-rc-local-1.webp)

然後記得確認腳本有執行權限：

\`\`\`bash
chmod +x /home/gtwang/my_script.sh
\`\`\`

這樣任何使用者登入系統時，都會自動執行這個腳本。

## 如何只讓個別使用者登入時自動執行程式？

如果只想讓特定使用者登入時執行程式，就把指令寫在使用者個人的 \`~/.bash_profile\`、\`~/.bash_login\` 或 \`~/.profile\` 當中——看自己的家目錄下實際存在哪一個，把指令加進去即可。

bash 在使用者登入時會依序尋找這三個檔案，但只會執行**第一個找到的那一個**：假設 \`~/.bash_profile\` 存在，它就只執行這一個，後面兩個就不管了，以此類推。所以如果加了指令卻沒生效，先檢查是不是寫錯檔案了。

## profile 和 bashrc 有什麼差別？

另外，\`/etc/bash.bashrc\` 與 \`~/.bashrc\` 也是很常被使用的 bash 設定檔，這兩個檔案的用途跟上面的 profile 設定檔很類似，不過有些差異：

| 設定檔 | 執行時機 | 典型例子 |
| --- | --- | --- |
| profile 類（\`/etc/profile\`、\`~/.bash_profile\` 等） | 登入型 shell（login shell） | 使用者登入 |
| bashrc 類（\`/etc/bash.bashrc\`、\`~/.bashrc\`） | 非登入型 shell | 開啟終端機視窗 |

簡單說：要「登入時跑一次」的程式寫 profile；「每開一個終端機都要跑」的環境設定寫 bashrc。

## 如何設定登出時自動執行程式？

若要設定使用者**登出**時自動執行的程式，可將指令寫在自己的 \`~/.bash_logout\` 指令稿中（如果不存在，就自己建立一個），例如：

\`\`\`bash
/home/gtwang/my_script2.sh
\`\`\`

同樣要確認執行權限：

\`\`\`bash
chmod +x /home/gtwang/my_script2.sh
\`\`\`

## 常見問題

### rc.local 和 profile 有什麼不同？

rc.local 是系統開機流程（init）執行的腳本，適合在登入前啟動服務；profile 類設定檔則是在使用者登入 shell 時執行，適合設定環境變數或個人化的啟動程式。要看程式需要「開機就跑」還是「登入才跑」來選擇。

### 為什麼我加了 ~/.bash_profile 卻沒有生效？

bash 登入時只會執行 \`~/.bash_profile\`、\`~/.bash_login\`、\`~/.profile\` 三者中第一個找到的檔案。如果 \`~/.bash_profile\` 已存在，寫在 \`~/.profile\` 裡的指令就永遠不會被執行，請確認指令放在優先序最前面的那個檔案。

### 自動執行的腳本一定要 chmod +x 嗎？

是的。profile 設定檔中的指令是直接以路徑執行的，腳本必須有執行權限，否則會出現 Permission denied。用 \`chmod +x /path/to/script.sh\` 加上即可。

### /etc/profile 的修改會影響哪些人？

\`/etc/profile\` 是系統層級設定檔，所有使用者登入時都會執行。只想讓特定使用者執行程式時，應該改寫該使用者家目錄下的 profile 類檔案，避免影響其他帳號。

## 參考資料

- 本系列文章：IT邦幫忙鐵人賽 Linux 筆記系列
- [GNU Bash 官方手冊（Bash Startup Files）](https://www.gnu.org/software/bash/manual/html_node/Bash-Startup-Files.html)

## 延伸閱讀

- [查看某個 Linux 裡服務的狀態](/post/check-linux-service-status)：同樣聚焦 Linux、系統管理，可接著比較不同情境的做法。
- [使用 Plink 快速在 Linux 伺服器下指令](/post/plink-remote-commands-windows-linux)：同樣聚焦 Linux，可接著比較不同情境的做法。
- [Linux 管理 Service 的指令：systemctl 完整用法與範例](/post/linux-service-commands-chkconfig-service)：同樣聚焦 Linux，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2019-09-21，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};