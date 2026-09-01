var e=`---
title: 使用 systemctl 操作 Linux 系統層級與 target
description: 整理 systemctl list-units、get-default、isolate 與 WantedBy，用來查看與切換 Linux target。
date: 2019-10-02
category: DevOps
tags: [Linux, systemctl, systemd, runlevel]
readingTime: 4 分鐘
image: /images/tech/Screenshot-2024-04-23-102615.webp
imageAlt: Linux systemctl 指令教學技術封面圖
---


# 使用 systemctl 操作 Linux 系統層級與 target

在 systemd 系統中，傳統 runlevel 對應到 target。使用 \`systemctl\` 可以列出所有 target、查看預設 target、切換到文字模式，並檢查某個服務會被哪個 target 啟動。

## 如何列出所有 systemd target？

列出 systemd target 可以使用 \`systemctl list-units --type target\`。這個指令會顯示目前系統載入的 target unit。

\`\`\`bash
systemctl list-units --type target
\`\`\`

target 是 systemd 用來表示系統狀態或服務集合的 unit。常見 target 包含 \`multi-user.target\`、\`graphical.target\`、\`rescue.target\` 等。

如果你正在排查系統開機後進入哪個模式，先列出 target 可以快速理解目前系統可用的層級。

## 如何查看目前預設運作層級？

查看預設運作層級可以使用 \`systemctl get-default\`。這個指令會回傳系統開機後預設進入的 target。

\`\`\`bash
systemctl get-default
\`\`\`

常見結果包含：

| target | 對應概念 |
|---|---|
| \`multi-user.target\` | 類似傳統 runlevel 3，文字模式與多使用者服務。 |
| \`graphical.target\` | 類似傳統 runlevel 5，包含圖形介面。 |
| \`rescue.target\` | 類似單人救援模式。 |

## 如何切換到文字模式？

切換到文字模式可以使用 \`systemctl isolate multi-user.target\`。這個指令會停止不屬於目標 target 的 unit，並切換到指定 target。

\`\`\`bash
systemctl isolate multi-user.target
\`\`\`

\`isolate\` 會立即改變目前系統狀態，因此不要在不熟悉的正式環境隨意執行。若只是想設定下次開機預設 target，應改用 \`systemctl set-default\`。

\`\`\`bash
sudo systemctl set-default multi-user.target
\`\`\`

## 如何查看某個服務屬於哪個 target？

查看服務被哪個 target 啟動，可以使用 \`systemctl show -p WantedBy service-name\`。\`WantedBy\` 會顯示 unit install 時掛到哪個 target。

\`\`\`bash
systemctl show -p WantedBy service-name
\`\`\`

如果要檢查服務是否會在開機時啟動，也可以搭配：

\`\`\`bash
systemctl is-enabled service-name
systemctl status service-name
\`\`\`

\`WantedBy=multi-user.target\` 通常代表服務在多使用者模式會被啟動。這個資訊對排查服務為什麼開機沒起來很有幫助。

## systemd target 和 chkconfig runlevel 如何對照？

systemd target 是傳統 SysV runlevel 的替代概念。理解 target 與 runlevel 對照，可以幫助從舊版 Linux 管理方式轉到 systemd。

| 傳統 runlevel | systemd target | 說明 |
|---|---|---|
| 0 | \`poweroff.target\` | 關機 |
| 1 | \`rescue.target\` | 救援模式 |
| 3 | \`multi-user.target\` | 多使用者文字模式 |
| 5 | \`graphical.target\` | 圖形介面模式 |
| 6 | \`reboot.target\` | 重新啟動 |

從 \`chkconfig\` 轉到 \`systemctl\` 時，重點不是記住每個數字，而是理解服務被哪個 target 需要、是否 enable，以及目前 active 狀態。

## 常見問題
### systemctl target 是什麼？

systemctl target 是 systemd 中用來組織服務與系統狀態的 unit。target 可以代表文字模式、圖形模式、救援模式或關機狀態。

### multi-user.target 等於 runlevel 3 嗎？

\`multi-user.target\` 大致對應傳統 runlevel 3。兩者概念相近，但 systemd target 更彈性，實作方式也不同。

### graphical.target 等於 runlevel 5 嗎？

\`graphical.target\` 大致對應傳統 runlevel 5。\`graphical.target\` 通常包含 \`multi-user.target\` 再加上 display manager。

### isolate 和 set-default 差在哪裡？

\`systemctl isolate\` 會立刻切換目前 target。\`systemctl set-default\` 只改變下次開機的預設 target。

### WantedBy 可以判斷服務是否正在執行嗎？

\`WantedBy\` 不能判斷服務是否正在執行。\`WantedBy\` 只表示服務 install 時掛到哪個 target；是否正在執行要看 \`systemctl status\`。

## 參考資料
- freedesktop.org, systemctl, https://www.freedesktop.org/software/systemd/man/latest/systemctl.html，存取日期：2026-08-27。
- freedesktop.org, systemd.target, https://www.freedesktop.org/software/systemd/man/latest/systemd.target.html，存取日期：2026-08-27。

## 延伸閱讀

- [Linux 管理 Service 的指令：systemctl 完整用法與範例](/post/linux-service-commands-chkconfig-service)：同樣聚焦 Linux、systemctl，可接著比較不同情境的做法。
- [查看某個 Linux 裡服務的狀態](/post/check-linux-service-status)：同樣聚焦 Linux，可接著比較不同情境的做法。
- [Linux 基本操作指令介紹](/post/linux-basic-commands-cheatsheet)：同樣聚焦 Linux，可接著比較不同情境的做法。

## 最後更新

Wed Oct 02 2019 08:00:00 GMT+0800 (Taiwan Standard Time)
`;export{e as default};