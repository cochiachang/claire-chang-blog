var e=`---
title: Linux 給使用者 sudo 權限：useradd、visudo 與 wheel 群組設定
description: 說明如何在 Linux 建立使用者、用 visudo 啟用 wheel 群組、加入 sudo 權限並測試設定是否成功。
date: 2019-10-04
category: DevOps
tags: [Linux, sudo, 使用者權限]
readingTime: 5 分鐘
image: /images/tech/hero_linux-sudo-user-permission.webp
imageAlt: Linux sudo 使用者權限設定示意圖
---
# Linux 給使用者 sudo 權限：useradd、visudo 與 wheel 群組設定

Linux 給使用者 sudo 權限的安全做法，是先建立一般帳號，再把帳號加入具有 sudo 權限的群組。不要直接讓多人共用 root 密碼，也不要手動用一般編輯器亂改 \`/etc/sudoers\`。

## 如何建立 Linux 使用者帳號？

Linux 新使用者可用 \`useradd\` 建立，再用 \`passwd\` 設定密碼。建立完成後，帳號仍是一般使用者，尚未自動取得 sudo 權限。

以 root 或具 sudo 權限的帳號執行：

\`\`\`bash
useradd USERNAME
passwd USERNAME
\`\`\`

\`passwd\` 會要求輸入兩次新密碼：

\`\`\`text
Changing password for user USERNAME.
New password:
Retype new password:
passwd: all authentication tokens updated successfully.
\`\`\`

若是 Ubuntu 或 Debian 系統，也常見用 \`adduser USERNAME\` 建立互動式帳號。不同發行版預設群組名稱不同，設定 sudo 前應先確認系統慣例。

## 為什麼要用 visudo 編輯 sudoers？

\`visudo\` 會在儲存前檢查 sudoers 語法，避免錯誤設定導致所有管理者失去 sudo 權限。直接用 vim 或 nano 編輯 \`/etc/sudoers\` 風險較高。

執行：

\`\`\`bash
visudo
\`\`\`

在 Red Hat、CentOS、Rocky Linux 類系統，常見設定是啟用 \`wheel\` 群組：

\`\`\`text
## Allows people in group wheel to run all commands
%wheel        ALL=(ALL)       ALL
\`\`\`

如果前面有 \`#\`，代表該行被註解。移除註解後，屬於 \`wheel\` 群組的使用者即可使用 sudo。

## 如何把使用者加入 wheel 或 sudo 群組？

把使用者加入管理群組應使用 \`usermod -aG\`。\`-a\` 代表 append，缺少 \`-a\` 可能會覆蓋使用者原本的附加群組。

Red Hat 系列常用：

\`\`\`bash
usermod -aG wheel USERNAME
\`\`\`

Ubuntu 或 Debian 常用：

\`\`\`bash
usermod -aG sudo USERNAME
\`\`\`

資訊增益：\`usermod -G wheel USERNAME\` 和 \`usermod -aG wheel USERNAME\` 差一個 \`-a\`，風險差很多。前者可能清掉原本附加群組；後者才是把新群組加上去。

## 如何測試 sudo 權限是否成功？

測試 sudo 權限應切換到新帳號，確認群組與 \`sudo whoami\` 結果。若輸出 \`root\`，代表 sudo 權限已生效。

切換使用者：

\`\`\`bash
su - USERNAME
\`\`\`

查看群組：

\`\`\`bash
groups
\`\`\`

預期會看到：

\`\`\`text
USERNAME wheel
\`\`\`

測試 sudo：

\`\`\`bash
sudo whoami
\`\`\`

若成功，輸出會是：

\`\`\`text
root
\`\`\`

第一次使用 sudo 時，系統可能顯示提醒並要求輸入使用者密碼。

## 常見問題

### Linux 一定要把使用者加入 wheel 群組嗎？

不一定。Red Hat 系列常用 \`wheel\`，Ubuntu 和 Debian 常用 \`sudo\`。應依發行版預設 sudoers 設定決定。

### 可以直接把使用者寫進 \`/etc/sudoers\` 嗎？

可以，但一般建議用群組管理。群組設定比較容易維護，也能避免 sudoers 檔案累積太多個別帳號規則。

### 為什麼一定要用 \`visudo\`？

\`visudo\` 會檢查語法。sudoers 語法錯誤可能導致 sudo 無法使用，遠端主機尤其危險。

### \`usermod -aG\` 後為什麼沒有立即生效？

使用者可能需要重新登入，新的群組成員資格才會套用。可以登出重進，或重新建立 shell session。

### sudo 權限應該給所有開發者嗎？

不應該。sudo 是高權限操作，應依職責最小授權，並保留操作紀錄與審核流程。

## 參考資料

- Red Hat Documentation：[Managing sudo access](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/)
- Ubuntu Documentation：[RootSudo](https://help.ubuntu.com/community/RootSudo)
- sudo Project：[sudoers manual](https://www.sudo.ws/docs/man/sudoers.man/)

## 延伸閱讀

- [Linux切換使用者：su 與 sudo -u 指令完整教學](/post/linux-switch-user-su)：同樣聚焦 Linux、sudo，可接著比較不同情境的做法。
- [Linux sudoers is world writable 錯誤修復：/etc/sudoers 權限檢查與還原](/post/sudoers-world-writable-error)：同樣聚焦 Linux、sudo，可接著比較不同情境的做法。
- [Linux crontab 排程設定教學：時間格式、特殊字元與常用範例](/post/linux-crontab-schedule)：同樣聚焦 Linux，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2026-08-28。原文發布於 2019-10-04，本文補上不同 Linux 發行版的群組差異與安全注意事項。

`;export{e as default};