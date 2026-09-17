var e=`---
title: 在 Linux 與 Windows 間傳送檔案：PSCP 指令教學
description: 在 Windows 與 Linux 之間互傳檔案，用 PuTTY 附屬的 PSCP 指令列工具就能透過 SSH 加密安全完成。本文整理 PSCP 的下載安裝、從 Linux 下載檔案與資料夾到 Windows、從 Windows 上傳檔案到 Linux 的指令範例，並比較 PSCP 與 PSFTP 的選擇建議。
date: 2019-09-18
category: DevOps
tags: [Linux, Windows, PSCP, SSH, 檔案傳輸]
readingTime: 3 分鐘
image: /images/tech/hero_transfer-files-between-linux-and-windows.webp
imageAlt: 網路交換器插上藍色光纖線的特寫，象徵跨主機之間的檔案傳輸
---


# 在 Linux 與 Windows 間傳送檔案：PSCP 指令教學

管理遠端 Linux 伺服器時，最常見的需求之一就是把檔案在 Windows 工作機與伺服器之間互傳：把報表、程式或設定檔上傳上去，或是把 log、資料抓回本機。這篇文章整理我用 PSCP（PuTTY 附屬的 SCP client）在 Linux 與 Windows 之間傳送檔案的做法，包含下載安裝與單一檔案、整個資料夾的雙向傳輸指令，全程走 SSH 加密，不用另外架 FTP。

## PSCP 是什麼？為什麼透過 SSH 傳檔比較安全？

PSCP 是一套使用命令提示列的軟體，屬於 PuTTY 相關、可選擇搭配使用的工具，提供 SCP client 的功能。當我只需要將一個或少數檔案從 PC 端 upload 到 server 端時，這套軟體提供非常安全的方法——傳送的內容透過 SSH 加密，不會被其他人竊聽。倘若遠端有提供 SSH2，建議還是使用 PSFTP 會比較好。

兩者的定位差異可以這樣理解：

| 工具 | 介面型態 | 適合場景 |
|---|---|---|
| PSCP | 單次指令式複製（類似 \`cp\`） | 快速上傳／下載一個檔案或一個資料夾 |
| PSFTP | 互動式 FTP 介面 | 需要連續做多個檔案操作，或遠端提供 SSH2 時 |

## 怎麼下載與安裝 PSCP？

PSCP 不用安裝，從 [PuTTY 官方下載頁](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html)抓下 \`pscp.exe\`，放到有加入 PATH 的資料夾（例如 \`C:\\Windows\`，或乾脆跟執行時切到該目錄）就可以在命令提示字元直接使用。安裝 PuTTY 主程式的話，安裝包裡也可以勾選一併裝上 PSCP。

![PuTTY 官方下載頁面截圖](/images/articles/transfer-files-between-linux-and-windows-1.webp)

一條 PSCP 指令的基本結構如下，把兩端的「位置」接起來：

\`\`\`
pscp [參數] [來源] [目的地]
\`\`\`

遠端位置固定寫成 \`使用者@主機IP:路徑\` 的 Linux 絕對路徑格式；本機位置則照各作業系統的慣例寫（Windows 用 \`C:\\...\`，Linux 用 \`/tmp\` 這類路徑）。

## 怎麼把 Linux 的檔案傳到 Windows？

**下載單一檔案**：\`/claire/test.txt\` 為 Linux 上的檔案位置，\`/tmp\` 為 Windows 要下載到的位置：

\`\`\`bash
pscp claire@8.8.8.8:/claire/test.txt /tmp
\`\`\`

**下載整個資料夾**：加上 \`-r\` 參數遞迴複製，\`/claire/\` 為 Linux 檔案位置，\`/tmp\` 為 Windows 要下載到的位置：

\`\`\`bash
pscp -r claire@8.8.8.8:/claire /tmp
\`\`\`

## 怎麼把 Windows 的檔案傳到 Linux？

\`\`\`bash
pscp c:\\123.xls root@xxx.xxx.xxx.xxx:/home/uploads
\`\`\`

這行指令代表將 Windows C 槽下的 \`123.xls\` 檔案，傳送至 IP 為 \`xxx.xxx.xxx.xxx\` 的 Linux 主機中的 \`/home/uploads\` 資料夾下。

執行後會先要求輸入該使用者在 Linux 上的登入密碼（跟 \`ssh\` 登入用的同一組），輸入正確就會開始傳輸並顯示進度。要傳多個檔案時可以用萬用字元，例如 \`pscp c:\\logs\\*.log root@主機:/home/uploads\`。

## 常見問題

### PSCP 跟 PSFTP 有什麼差別？

PSCP 是單次指令式的檔案複製工具，適合一次搬一個檔案或資料夾；PSFTP 則提供互動式介面，可以連續切換目錄、列清單、批次傳檔。遠端主機有提供 SSH2 時，建議改用 PSFTP。

### 用 PSCP 傳檔案安全嗎？

安全。PSCP 走 SSH 加密通道，傳輸內容不會被旁人竊聽，比明文的 FTP 可靠。前提是務必從 PuTTY 官方網站下載 \`pscp.exe\`，避免來路不明的執行檔。

### 出現「pscp 不是內部或外部命令」怎麼辦？

代表系統找不到 \`pscp.exe\`。把它放到有加入 PATH 的資料夾，或先用 \`cd\` 切到 \`pscp.exe\` 所在的目錄再執行，也可以重新從 PuTTY 官方下載頁取得。

### 怎麼傳送整個資料夾而不是單一檔案？

加上 \`-r\` 參數即可遞迴複製整個資料夾，例如 \`pscp -r claire@8.8.8.8:/claire /tmp\`。反向從 Windows 傳資料夾到 Linux 也是同樣加 \`-r\`。

### PSCP 指令中的帳號密碼是哪一組？

是 \`@\` 前面那個使用者在遠端 Linux 主機上的帳號密碼，與 SSH 登入使用的是同一組。若不想每次輸入密碼，可以改設定 SSH 金鑰認證。

## 參考資料

- [[Tool] Putty - 使用PSCP在Linux與Windows間傳送檔案](https://jeremysu0131.github.io/Tool-Putty-%E4%BD%BF%E7%94%A8PSCP%E5%9C%A8Linux%E8%88%87Windows%E9%96%93%E5%82%B3%E9%80%81%E6%AA%94%E6%A1%88/)
- [Download PuTTY: latest release (0.72)](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html)

## 延伸閱讀

- [使用 Plink 快速在 Linux 伺服器下指令](/post/plink-remote-commands-windows-linux)：同樣聚焦 SSH、Linux，可接著比較不同情境的做法。
- [PieTTY 免費 SSH 與 Telnet Client 怎麼用？](/post/pietty-ssh-telnet-client)：同樣聚焦 SSH、Linux，可接著比較不同情境的做法。
- [Linux 基本操作指令介紹](/post/linux-basic-commands-cheatsheet)：同樣聚焦 Linux，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2019-09-18，本文保留原始筆記內容並補上 GEO 結構。
`;export{e as default};