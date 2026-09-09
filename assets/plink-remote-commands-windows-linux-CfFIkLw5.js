var e=`---
title: 使用 Plink 快速在 Linux 伺服器下指令
description: 示範如何用 PuTTY 內建的 Plink 工具，在 Windows 上一行指令自動 SSH 連線 Linux 伺服器並批次執行遠端命令，適合自動化部署前後自動執行指令的場景。
date: 2019-09-24
category: DevOps
tags: [Plink, SSH, Linux, 自動化部署, Windows]
readingTime: 3 分鐘
image: /images/tech/hero_plink-remote-commands-windows-linux.webp
imageAlt: 終端機畫面顯示程式碼與指令輸出
---


# 使用 Plink 快速在 Linux 伺服器下指令

需要在 Windows 上自動連進 Linux 伺服器執行指令嗎？Plink 是 PuTTY 工具組裡的一個命令列小工具，可以將「連進 server 並執行某個指令」用一行指令完成，特別適合自動化部署檔案到伺服器的前後，自動執行某些 SSH 指令的場景。

## 什麼是 Plink？為什麼要用它？

Plink 是 PuTTY 附屬的命令列連線工具，多被使用在自動執行的部分。一般用 PuTTY 連線要開視窗、輸入帳密，但若我們可能在自動化部署檔案到伺服器的前後自動執行某些 SSH 指令，就可以用 Plink 把整個流程濃縮成一行指令。

下載連結：[PuTTY 官方下載頁](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html)

實際操作起來像這樣——登入、執行指令一次到位：

![使用 Plink 自動連線並執行遠端指令的實際畫面](/images/articles/plink-remote-commands-windows-linux-1.webp)

## Plink 有哪些常用參數？

執行 \`plink\` 不帶參數（或 \`plink -h\`）可以看到完整的使用說明，常用的選項包括 \`-ssh\`（指定 SSH 協定）、\`-l\`（登入帳號）、\`-pw\`（密碼）、\`-m\`（從檔案讀取要執行的指令）等：

![plink 的指令參數說明](/images/articles/plink-remote-commands-windows-linux-2.webp)

![plink 常用選項清單](/images/articles/plink-remote-commands-windows-linux-3.webp)

## 怎麼用 Plink 自動連線並批次執行指令？

**1. 自動連上（包含 username 與密碼）**

\`\`\`bat
c:\\plink -ssh login.example.com -l 使用者名稱 -pw 密碼
\`\`\`

**2. 在遠端機器上批次執行一堆指令**

在指令後面直接接上要執行的命令，多個命令用分號 \`;\` 分隔：

\`\`\`bat
c:\\plink -ssh login.example.com -l 使用者名稱 -pw 密碼 命令1;命令2
\`\`\`

例如登入後依序執行 \`ls\`、\`echo Hello World\`、\`ls\`：

\`\`\`bat
c:\\plink -ssh login.example.com -l 使用者名稱 -pw 密碼 ls;echo Hello World;ls
\`\`\`

這樣一來，不論是部署前重啟服務、部署後清快取，都可以寫進批次檔（.bat）或 CI 腳本裡自動執行。

## 常見問題

### Plink 和 PuTTY 有什麼不同？

PuTTY 是圖形介面的 SSH 連線工具，Plink 則是同一個套件附的命令列版本。Plink 沒有視窗，專門設計給腳本與自動化流程使用，可以把連線與執行指令寫成一行。

### Plink 的密碼直接寫在指令上安全嗎？

\`-pw\` 參數會把密碼以明文留在指令與腳本裡，方便但不安全。正式環境建議改用 SSH 金鑰認證，或在互動時輸入密碼，避免密碼出現在批次檔與命令歷史中。

### 第一次用 Plink 連線時卡在主機金鑰確認怎麼辦？

Plink 首次連到新主機時會詢問是否信任主機金鑰，在自動化腳本中會卡住。可以先用 PuTTY 手動連一次記下金鑰，或在指令加上 \`-batch\` 搭配已信任的主機金鑰設定。

### Plink 一次可以執行多個遠端指令嗎？

可以。在指令尾端用分號把多個命令串起來即可，例如 \`plink -ssh host -l user -pw pass ls;df -h\`。指令太多時也可以用 \`-m 檔案\` 從文字檔讀取整批指令。

## 參考資料

- [PLink 教學](https://www.putty.org/)
- [PuTTY / Plink 官方下載點](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html)
- [plink 的簡易教學：自動連到遠端機器下批次指令（ssh 版）](https://gist.github.com/HoriLiu/3c338404389a311d2f6b7527b9cfe998)

## 延伸閱讀

- [在 Linux 與 Windows 間傳送檔案：PSCP 指令教學](/post/transfer-files-between-linux-and-windows)：同樣聚焦 Linux、Windows，可接著比較不同情境的做法。
- [PieTTY 免費 SSH 與 Telnet Client 怎麼用？](/post/pietty-ssh-telnet-client)：同樣聚焦 SSH、Linux，可接著比較不同情境的做法。
- [Linux 開機自動執行程式：profile、bashrc 與 bash_logout 設定教學](/post/linux-startup-programs-rc-local)：同樣聚焦 Linux，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2019-09-24，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};