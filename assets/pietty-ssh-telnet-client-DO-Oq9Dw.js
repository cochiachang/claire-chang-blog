var e=`---
title: PieTTY 免費 SSH 與 Telnet Client 怎麼用？
description: 介紹 PieTTY 這套由 PuTTY 衍生的免費 SSH、Telnet 連線工具，包含連線 Linux 與字元編碼設定。
date: 2019-09-17
category: DevOps
tags: [PieTTY, PuTTY, SSH, Telnet, Linux]
readingTime: 4 分鐘
image: /images/tech/pietty-ssh-connection-settings.png
imageAlt: PieTTY SSH 連線設定視窗
---


# PieTTY 免費 SSH 與 Telnet Client 怎麼用？

PieTTY 是一套免費的 SSH 與 Telnet Client，適合需要從 Windows 連線到 Linux 伺服器、又希望處理中文與其他亞洲語系字元顯示問題的人。PieTTY 源自 PuTTY，保留輕量連線工具的定位，同時改善非英語系文字支援與操作介面。

## PieTTY 是什麼？

PieTTY 是從 PuTTY 衍生出來的終端機連線工具，舊稱 pputty。PieTTY 的重點不是取代所有終端機工具，而是讓 SSH、Telnet 連線在中文環境下更容易正常顯示。

PuTTY 本身小巧、方便，是常見的 Telnet/SSH 安全遠端連線程式。不過在非英語系文字上，舊版 PuTTY 容易遇到編碼顯示問題；對初學者來說，PuTTY 的設定介面也不算直覺。

PieTTY 修正並補強多國語系字元支援，尤其是亞洲語系常見的編碼顯示需求。若工作內容常需要登入 Linux 主機、BBS、舊系統或內部伺服器，PieTTY 會比只靠預設終端機更順手。

## PieTTY 適合什麼使用情境？

PieTTY 適合需要快速連到 Linux 主機、又不想花太多時間調整編碼的人。PieTTY 的價值在於「能連線」之外，也能讓遠端主機輸出的中文比較容易讀。

常見使用情境包含：

| 情境 | PieTTY 的用途 |
|---|---|
| 連線 Linux 伺服器 | 使用 SSH 登入遠端主機，執行 Linux 指令或檢查服務狀態 |
| 連線 Telnet/BBS | 使用 Telnet 模式連到仍採用 Telnet 的系統 |
| 處理中文亂碼 | 切換 Big5、UTF-8、CP950 等字元編碼 |
| 初學者練習遠端登入 | 用較簡單的介面理解主機名稱、IP、port 與帳密登入流程 |

如果工作已經大量依賴 Windows Terminal、OpenSSH 或 VS Code Remote SSH，PieTTY 不一定是第一選擇；但在舊環境、中文編碼或 Telnet/BBS 場景裡，PieTTY 仍然有明確用途。

## 如何用 PieTTY 連線到 Linux 伺服器？

PieTTY 連線 Linux 伺服器時，先輸入主機名稱或 IP 位址，再選 SSH 並確認 port 通常是 22。按下連線後，依畫面提示輸入帳號與密碼即可登入遠端 Linux 主機。

![PieTTY SSH 連線設定視窗](/images/tech/pietty-ssh-connection-settings.png)

基本流程如下：

1. 開啟 PieTTY。
2. 在「主機名稱或 IP 位址」輸入 Linux 伺服器位置。
3. 選擇 \`SSH\`，port 通常填 \`22\`。
4. 按下「連線」。
5. 等待登入畫面出現，輸入帳號與密碼。

登入成功後，就能在 PieTTY 視窗內操作遠端 Linux。若只是剛開始熟悉伺服器操作，可以先練習 \`pwd\`、\`ls\`、\`cd\`、\`cat\` 這類基本指令，再進一步處理服務設定或檔案權限。

## PieTTY 如何調整字元編碼避免中文亂碼？

PieTTY 的字元編碼可從「選項 > 字元編碼」切換。遠端主機若輸出 Big5、UTF-8、CP950 等不同編碼，改成對應的選項通常就能改善中文亂碼。

![PieTTY 字元編碼選單](/images/tech/pietty-character-encoding-menu.png)

調整路徑是：

\`\`\`text
選項 > 字元編碼 > 選擇要顯示的編碼
\`\`\`

如果遠端 Linux 主機使用 UTF-8，PieTTY 也要選 UTF-8；如果連線的是傳統中文 BBS 或舊系統，可能需要選 Big5 或 CP950。這類問題看起來像「系統壞掉」，實際上常只是終端機與遠端主機對同一段文字採用不同編碼。

## PieTTY 和 PuTTY 要怎麼選？

PieTTY 與 PuTTY 都能做 SSH、Telnet 遠端連線。若重點是中文與亞洲語系顯示，PieTTY 較容易調整；若重點是使用最主流、文件最多的工具，PuTTY 仍然是常見選擇。

可以用下面方式判斷：

| 需求 | 建議 |
|---|---|
| 需要 SSH 登入 Linux 主機 | PieTTY 或 PuTTY 都可以 |
| 經常遇到中文亂碼 | 優先試 PieTTY |
| 公司文件指定 PuTTY | 依公司文件使用 PuTTY |
| 需要大量查官方文件與教學 | PuTTY 資源較多 |
| 需要 Telnet/BBS 中文環境 | PieTTY 通常比較友善 |

資訊增益：對新手來說，選工具時不要只看「能不能連上」。遠端連線工具還要看字元編碼、預設 port、登入提示是否容易理解；PieTTY 的優勢剛好集中在這幾個容易卡住的細節。

## 哪裡可以下載與查更多 SSH 連線方式？

PieTTY 可從官方專案頁查詢資訊，PuTTY 則可從 PuTTY 官方網站取得。若要理解 SSH、Telnet、VNC、RDP 等遠端連線差異，可以搭配 Linux 遠端連線教學一起看。

可參考：

- PieTTY 官方網站：[PieTTY: A terminal forked from PuTTY by piaip](https://sites.google.com/view/pietty-project)
- PuTTY 官方網站：[PuTTY: a free SSH and Telnet client](https://www.chiark.greenend.org.uk/~sgtatham/putty/)
- 遠端連線教學：[鳥哥的 Linux 私房菜：遠端連線伺服器 SSH / XDMCP / VNC / RDP](https://linux.vbird.org/linux_server/centos6/0310telnetssh.php)

舊版匯出資料中保留了 \`pietty0400b14.exe_.zip\` 這個安裝檔名稱；公開頁面建議仍以 PieTTY 官方專案頁能取得的版本為準，避免下載到來路不明的執行檔。

## 常見問題

### PieTTY 是免費的 SSH Client 嗎？

是。PieTTY 是免費的 SSH 與 Telnet Client，主要用於遠端連線到 Linux 主機、Telnet 系統或 BBS。PieTTY 的特色是改善 PuTTY 在非英語系文字顯示上的使用體驗。

### PieTTY 可以連線 Linux 嗎？

可以。PieTTY 連線 Linux 時通常選 SSH，port 使用 22，再輸入 Linux 主機的 IP 位址、帳號與密碼。登入後就能在終端機內執行 Linux 指令。

### PieTTY 中文亂碼要怎麼處理？

PieTTY 中文亂碼通常要從字元編碼設定處理。可到「選項 > 字元編碼」改成遠端主機使用的編碼，例如 UTF-8、Big5 或 CP950。

### PieTTY 和 PuTTY 有什麼不同？

PieTTY 源自 PuTTY，但更重視亞洲語系字元支援與易用性。PuTTY 文件與使用者基礎較大；PieTTY 則適合中文顯示、Telnet/BBS 或舊系統連線情境。

### SSH 和 Telnet 有什麼差別？

SSH 是加密遠端連線協定，適合登入伺服器做管理操作。Telnet 通常不加密，安全性較低，除非連線的是特定舊系統或受控內網環境，否則伺服器管理應優先使用 SSH。

## 參考資料

- PieTTY Project：[PieTTY: A terminal forked from PuTTY by piaip](https://sites.google.com/view/pietty-project)
- PuTTY：[PuTTY: a free SSH and Telnet client](https://www.chiark.greenend.org.uk/~sgtatham/putty/)
- 鳥哥的 Linux 私房菜：[遠端連線伺服器 SSH / XDMCP / VNC / RDP](https://linux.vbird.org/linux_server/centos6/0310telnetssh.php)
- Jeremy Su：[Tool-Putty-使用PSCP在Linux與Windows間傳送檔案](https://jeremysu0131.github.io/Tool-Putty-%E4%BD%BF%E7%94%A8PSCP%E5%9C%A8Linux%E8%88%87Windows%E9%96%93%E5%82%B3%E9%80%81%E6%AA%94%E6%A1%88/)

## 延伸閱讀

- [使用 Plink 快速在 Linux 伺服器下指令](/post/plink-remote-commands-windows-linux)：同樣聚焦 SSH、Linux，可接著比較不同情境的做法。
- [在 Linux 與 Windows 間傳送檔案：PSCP 指令教學](/post/transfer-files-between-linux-and-windows)：同樣聚焦 Linux、SSH，可接著比較不同情境的做法。
- [線上練習 Linux 指令：不用裝虛擬機的 4 個免費網站](/post/practice-linux-commands-online)：同樣聚焦 Linux，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2026-08-28；初版發布日為 2019-09-17。
`;export{e as default};