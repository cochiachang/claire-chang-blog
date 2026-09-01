var e=`---
title: Ubuntu 18.04 執行 apt update 出現 NO_PUBKEY 錯誤的解法
description: Ubuntu 18.04 執行 apt update 時出現「NO_PUBKEY 467B942D3A79BD29」簽章驗證失敗錯誤，原因是系統缺少 MySQL 軟體庫的公鑰。本文示範用 apt-key 從 keyserver 匯入公鑰並完成更新。
date: 2023-05-11
category: DevOps
tags: [Ubuntu, apt, NO_PUBKEY, Linux, MySQL]
readingTime: 3 分鐘
image: /images/tech/hero_ubuntu-1804-apt-update-failure.webp
imageAlt: Ubuntu 終端機執行 apt 指令的示意圖
---


# Ubuntu 18.04 執行 apt update 出現 NO_PUBKEY 錯誤的解法

在 Ubuntu 18.04 上執行 \`sudo apt update\` 時，如果出現 \`NO_PUBKEY 467B942D3A79BD29\` 的簽章驗證失敗警告，代表系統缺少 MySQL 軟體庫的公鑰，無法驗證下載的套件索引。本文說明錯誤訊息的意義，並提供從 Ubuntu keyserver 匯入公鑰、恢復更新的具體指令。

## 錯誤訊息長什麼樣子？

執行 \`apt update\` 時出現以下警告：

\`\`\`text
W: Failed to fetch http://repo.mysql.com/apt/ubuntu/dists/bionic/InRelease The following signatures couldn't be verified because the public key is not available: NO_PUBKEY 467B942D3A79BD29
W: Some index files failed to download. They have been ignored, or old ones used instead.
\`\`\`

## 為什麼會出現 NO_PUBKEY 錯誤？

這個錯誤訊息表示系統在嘗試從 [http://repo.mysql.com/apt/ubuntu/dists/bionic/](http://repo.mysql.com/apt/ubuntu/dists/bionic/) 的軟體庫下載軟體索引時發生了問題，可能是由於網路連線中斷或是軟體庫網址變更所導致。

訊息中提到的 \`NO_PUBKEY 467B942D3A79BD29\` 表示系統沒有此軟體庫的公鑰，導致無法驗證下載的軟體索引是否正確。APT 為了安全起見，只信任有正確簽章的索引，因此會略過這些索引或改用舊版本。

## 怎麼解決 NO_PUBKEY 錯誤？

要解決這個問題，可以更新系統的軟體庫並安裝相關的公鑰。在終端機中執行以下指令：

\`\`\`bash
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 467B942D3A79BD29
sudo apt-get update
\`\`\`

第一個指令會從 Ubuntu 的公鑰伺服器中下載指定的公鑰，第二個指令則重新更新系統的軟體庫。完成後，再次嘗試安裝所需的軟體，問題就會解決了。

## 常見問題

### NO_PUBKEY 錯誤代表什麼？

代表系統上沒有該軟體庫用來簽署套件索引的 GPG 公鑰，APT 無法驗證索引的正確性，因此拒絕使用這些索引，出現 \`Failed to fetch\` 與 \`NO_PUBKEY <金鑰ID>\` 的警告。

### 如何匯入缺少的公鑰？

把錯誤訊息中的金鑰 ID 拿來執行 \`sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys <金鑰ID>\`，從 Ubuntu keyserver 下載公鑰後再執行 \`sudo apt-get update\` 即可。

### 匯入公鑰後 apt update 還是失敗怎麼辦？

先確認網路連線正常、軟體庫網址仍有效（本例為 MySQL 的 bionic 庫）。若軟體庫已變更或不再支援該版本，可改用新版軟體庫位址，或從 sources.list 移除該來源。

### apt-key 被棄用了怎麼辦？

較新的 Ubuntu 版本已建議改用 \`/etc/apt/trusted.gpg.d/\` 搭配 \`gpg --dearmor\` 的方式管理金鑰，或直接由軟體庫提供 \`signed-by\` 指定的 keyring 檔案；本筆記的環境為 Ubuntu 18.04，仍可使用 apt-key。

## 參考資料

- [MySQL APT Repository](http://repo.mysql.com/apt/ubuntu/dists/bionic/)
- 本文整理自個人實作筆記。

## 延伸閱讀

- [Linux 給使用者 sudo 權限：useradd、visudo 與 wheel 群組設定](/post/linux-sudo-user-permission)：同樣聚焦 Linux，可接著比較不同情境的做法。
- [取得 Linux 安裝的系統版本：uname、/proc/version 與 /etc/os-release 指令教學](/post/get-linux-distribution-version)：同樣聚焦 Linux，可接著比較不同情境的做法。
- [查看某個 Linux 裡服務的狀態](/post/check-linux-service-status)：同樣聚焦 Linux，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2023-05-11，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};