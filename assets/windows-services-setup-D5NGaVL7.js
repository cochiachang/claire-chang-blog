var e=`---
title: Windows Services 設置教學：把 EXE 程式註冊為 Windows 服務
description: 整理 Windows 服務設置方法：用 services.msc 查看服務狀態，用 sc create 把 EXE 註冊為開機自動執行的 Windows 服務，並用 sc delete 移除服務，附完整指令與參數說明。
date: 2019-09-16
category: DevOps
tags: [Windows, Windows Services, sc create, 服務管理, 系統維運]
readingTime: 3 分鐘
image: /images/tech/hero_windows-services-setup.webp
imageAlt: 伺服器機箱內整齊排列的散熱風扇，象徵背景持續運作的 Windows 服務
---


如果我們想要把一個 EXE 檔設定為開機自動執行，就需要把這個程式設定為 Windows 服務（Windows Services）。服務可以在使用者登入前就在背景啟動、當機後自動重啟，比放在啟動資料夾或排程更穩定。這篇筆記整理我用 \`services.msc\` 查看服務、用 \`sc create\` 新增服務、用 \`sc delete\` 移除服務的完整做法。

# Windows Services 設置教學：把 EXE 程式註冊為 Windows 服務

## 如何開啟 Windows 服務管理畫面？

打開 Windows 搜尋，輸入：

\`\`\`cmd
services.msc
\`\`\`

就會看到以下畫面，可以瀏覽現有的所有服務列表和狀態：

![Windows 服務管理畫面，列出所有服務與狀態](/images/articles/windows-services-setup-1.webp)

在這個畫面可以確認每個服務的名稱、描述與執行狀態，也可以對特定服務手動啟動、停止或重啟。把程式註冊為服務之後，就是回到這裡確認它有沒有正常跑起來。

## 如何用 sc create 把 EXE 新增為 Windows 服務？

使用 \`sc create\` 並設定呼叫程式的方式，如下：

\`\`\`cmd
sc create MyProgramName binpath= "C:\\MyFolder\\MyProgram.exe" type= own start= auto
\`\`\`

三個關鍵參數的意義：

| 參數 | 說明 |
| --- | --- |
| \`binpath=\` | EXE 檔的完整路徑，路徑含空白時要用雙引號包起來 |
| \`type= own\` | 這個服務使用自己的執行程序，不與其他服務共用 |
| \`start= auto\` | 開機時自動啟動（對應服務管理畫面裡的「自動」啟動類型） |

要注意 \`sc create\` 的參數寫法是「參數名稱後面接一個空格再接值」（例如 \`binpath= "..."\`），等號前後的空格不能省，這是指令失敗最常見的原因。建立完成後回到 \`services.msc\` 就能看到新服務，第一次可以手動啟動測試。

## 如何刪除現有的 Windows 服務？

使用以下的語法，可移除現有的服務：

\`\`\`cmd
sc delete ServiceName
\`\`\`

\`ServiceName\` 換成服務的名稱即可。刪除前建議先在 \`services.msc\` 停止該服務；如果服務正在執行，刪除後可能要重開機才會完全移除。

## 常見問題

### 為什麼要把 EXE 設定為 Windows 服務？

服務會在開機時於背景自動執行，不依賴任何使用者登入，也不會因為登出而被關閉。對需要長時間在線的程式（例如 API server、背景排程工具）來說，註冊為服務是最可靠的做法。

### sc create 指令一直失敗，常見原因是什麼？

最常見是參數等號後的空格問題：\`binpath=\`、\`type=\`、\`start=\` 的等號後面必須有一個空格再接值。另外，\`sc create\` 需要以系統管理員身分執行命令提示字元，權限不足也會失敗。

### sc delete 刪除服務後服務還在列表裡怎麼辦？

服務可能還在執行中，先在 \`services.msc\` 停止它，或直接重開機，列表就會更新。也可以用 \`sc query ServiceName\` 確認服務是否真的還存在。

### sc create 和工作排程器有什麼不同？

兩者都能做到開機自動執行，但服務由 Windows Service Control Manager 管理，支援自動重啟、依存關係與本機系統帳戶執行；工作排程器則適合定期觸發的一次性工作。需要常駐在背景的程式，建議用服務。

## 參考資料

- [sc create 指令 | Microsoft Learn](https://learn.microsoft.com/zh-tw/windows-server/administration/windows-commands/sc-create)
- [sc delete 指令 | Microsoft Learn](https://learn.microsoft.com/zh-tw/windows-server/administration/windows-commands/sc-delete)

## 延伸閱讀

- [Linux 管理 Service 的指令：systemctl 完整用法與範例](/post/linux-service-commands-chkconfig-service)：同樣聚焦 服務管理，可接著比較不同情境的做法。
- [查看某個 Linux 裡服務的狀態](/post/check-linux-service-status)：同樣聚焦 服務管理，可接著比較不同情境的做法。
- [在 Linux 與 Windows 間傳送檔案：PSCP 指令教學](/post/transfer-files-between-linux-and-windows)：同樣聚焦 Windows，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2019-09-16，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};