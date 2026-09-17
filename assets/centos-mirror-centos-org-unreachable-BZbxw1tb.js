var e=`---
title: "CentOS 無法連接 mirror.centos.org：改用 vault.centos.org 修復 yum repo"
description: "整理 CentOS 無法解析 mirrorlist.centos.org、mirror.centos.org 失效後，如何檢查 repo 設定並改用 vault.centos.org。"
date: 2024-10-05
category: DevOps
tags: [CentOS, yum, repository, Linux, DevOps]
readingTime: 5 分鐘
image: /images/tech/hero_linux-basic-commands-cheatsheet.webp
imageAlt: Linux 指令列與 DevOps 伺服器維護示意圖
---


# CentOS 無法連接 mirror.centos.org：改用 vault.centos.org 修復 yum repo

CentOS 8 或 CentOS Stream 8 執行 \`yum\`、\`dnf\` 安裝套件時，如果出現 \`Couldn't resolve host name for http://mirrorlist.centos.org\`，通常不是本機 DNS 壞掉，而是舊版 CentOS repo 已經不能再依賴 \`mirrorlist.centos.org\` 或 \`mirror.centos.org\`。短期處理方式是把 repo 設定改到 \`vault.centos.org\`，長期處理方式是規劃升級到仍有維護的作業系統版本。

## 為什麼 CentOS 會無法連接 mirror.centos.org？

CentOS 無法連接 mirror.centos.org 的主因是版本進入 End of Life 後，套件內容會從主要 mirror 移到 vault 封存區。舊 repo 仍指向 mirrorlist 或 mirror，就會在更新 metadata 時失敗。

我遇到的錯誤訊息長這樣：

\`\`\`text
Error: Failed to download metadata for repo 'extras': Cannot prepare internal mirrorlist: Curl error (6): Couldn't resolve host name for http://mirrorlist.centos.org/?release=8-stream&arch=x86_64&repo=extras&infra=stock
\`\`\`

CentOS 官方在 2023 年公告 CentOS Stream 8 於 2024-05-31 結束建置，套件會封存到 \`vault.centos.org\`；CentOS Linux 7 則於 2024-06-30 End of Life，之後也不再發布更新（CentOS Blog，2023-04）。CentOS 專案 FAQ 也說明 CentOS Stream 8 退休後會從 build server、community build system 與 primary mirror site 移除，副本保留在 \`vault.centos.org\`（CentOS Project FAQ，2026-08 存取）。

## 如何確認問題不是本機 DNS 壞掉？

確認 CentOS mirror 問題時，可以先測 \`mirrorlist.centos.org\` 與一般網域。若一般網域可解析，但 CentOS mirrorlist 不可用，問題多半在 repo 指向舊服務。

可以先用以下指令確認：

\`\`\`bash
ping -c 4 mirrorlist.centos.org
nslookup mirrorlist.centos.org
nslookup centos.org
\`\`\`

如果 \`centos.org\` 可以解析，但 \`mirrorlist.centos.org\` 失敗，方向就不應該只放在 \`/etc/resolv.conf\`。這時候我會接著檢查 \`/etc/yum.repos.d/\` 裡的 repo 檔案，看是否仍使用 \`mirrorlist=http://mirrorlist.centos.org\` 或 \`baseurl=http://mirror.centos.org\`。

## 如何把 CentOS repo 改到 vault.centos.org？

CentOS repo 改到 vault.centos.org 的核心做法，是停用 \`mirrorlist\`，啟用 \`baseurl\`，再把 \`mirror.centos.org\` 換成 \`vault.centos.org\`。這是舊系統臨時取回封存套件的修復方式。

我當時保留的修復指令如下：

\`\`\`bash
sed -i s/mirror.centos.org/vault.centos.org/g /etc/yum.repos.d/CentOS-*.repo
sed -i s/^#.*baseurl=http/baseurl=http/g /etc/yum.repos.d/CentOS-*.repo
sed -i s/^mirrorlist=http/#mirrorlist=http/g /etc/yum.repos.d/CentOS-*.repo
\`\`\`

這三行分別做三件事：

| 指令 | 作用 |
|---|---|
| \`s/mirror.centos.org/vault.centos.org/g\` | 把 repo base URL 改到 CentOS Vault |
| \`s/^#.*baseurl=http/baseurl=http/g\` | 取消註解原本被關閉的 \`baseurl\` |
| \`s/^mirrorlist=http/#mirrorlist=http/g\` | 註解掉已不可依賴的 \`mirrorlist\` |

執行前建議先備份 repo 設定：

\`\`\`bash
cp -a /etc/yum.repos.d /etc/yum.repos.d.backup.$(date +%Y%m%d)
\`\`\`

## 修改 repo 後還需要檢查什麼？

修改 CentOS repo 後，應先清掉 yum 或 dnf 快取，再重新產生 metadata。若 repo 路徑版本不正確，vault 仍然可能回傳找不到套件或 metadata 的錯誤。

常用檢查順序如下：

\`\`\`bash
yum clean all
yum makecache
yum repolist
\`\`\`

如果系統使用 \`dnf\`，可以改成：

\`\`\`bash
dnf clean all
dnf makecache
dnf repolist
\`\`\`

資訊增益：我會把這次修復拆成「DNS 檢查、repo 指向檢查、vault 切換、cache 重建」四步，而不是看到 Curl error 就直接改 DNS。CentOS EOL 後，repo 入口失效和 DNS 設定錯誤的表面症狀很像，但修法完全不同。

## vault.centos.org 可以當成長期解法嗎？

vault.centos.org 不是長期維護來源，而是舊版 CentOS 套件封存區。CentOS Vault 可以讓舊機器暫時安裝套件，但不會提供新的安全更新。

CentOS Vault 頁面明確說明，vault 是已從主要 CentOS server 移除的舊版本 snapshot，不是持續更新的安裝樹，也不會在這些樹上加入安全更新（CentOS Vault，2026-08 存取）。所以把 repo 改到 \`vault.centos.org\` 只能算是「讓舊系統先能動」的應急做法。

我會把後續處理分成三種情境：

| 情境 | 建議 |
|---|---|
| 臨時補裝套件 | 可先改到 \`vault.centos.org\`，完成後記錄變更 |
| 仍在線上提供服務 | 優先排升級或遷移，不把 vault 當安全更新來源 |
| 容器映像檔仍用舊 CentOS | 重建 base image，避免未維護套件繼續進入部署流程 |

## 常見問題

### CentOS 出現 Couldn't resolve host name for mirrorlist.centos.org 是 DNS 問題嗎？
不一定。若其他網域可以解析，只有 \`mirrorlist.centos.org\` 失敗，常見原因是 CentOS 版本已經 EOL，舊 repo 入口不再可用。這時應檢查 \`/etc/yum.repos.d/\`，而不是只修改 DNS server。

### CentOS 8 還可以用 yum 安裝套件嗎？
CentOS 8 或 CentOS Stream 8 的舊系統可以透過 \`vault.centos.org\` 取回封存套件，但這不是持續維護來源。若機器仍承載服務，應規劃升級或遷移到仍有安全更新的版本。

### mirror.centos.org 和 vault.centos.org 差在哪裡？
\`mirror.centos.org\` 是舊 CentOS mirror 網路入口，主要服務仍在維護的內容；\`vault.centos.org\` 是封存舊版本內容的地方。系統進入 EOL 後，套件可能被移到 vault，但 vault 不提供新的安全更新。

### 修改 CentOS repo 前需要備份嗎？
需要。\`/etc/yum.repos.d/\` 會影響所有 yum 或 dnf 套件來源，改錯可能讓系統完全無法更新。最簡單的做法是先用 \`cp -a /etc/yum.repos.d /etc/yum.repos.d.backup.$(date +%Y%m%d)\` 保留一份。

### 改成 vault.centos.org 後還是失敗怎麼辦？
先執行 \`yum clean all\` 或 \`dnf clean all\` 清快取，再用 \`yum makecache\` 或 \`dnf makecache\` 重建 metadata。若仍失敗，檢查 repo 檔裡的版本路徑是否和 vault 實際目錄一致，例如 CentOS Stream 8 常見路徑是 \`8-stream\`。

## 參考資料

- CentOS Project：[End dates are coming for CentOS Stream 8 and CentOS Linux 7](https://blog.centos.org/2023/04/end-dates-are-coming-for-centos-stream-8-and-centos-linux-7/)（存取日期：2026-08-28）
- CentOS Project：[FAQ - CentOS Project shifts focus to CentOS Stream](https://www.centos.org/distro-faq/)（存取日期：2026-08-28）
- CentOS Documentation：[Mirror network](https://docs.centos.org/infra-docs/buildsys/mirror-network/)（存取日期：2026-08-28）
- CentOS Vault：[Index of /8-stream/core/x86_64](https://vault.centos.org/8-stream/core/x86_64/)（存取日期：2026-08-28）
- Server Fault：[mirrorlist.centos.org no longer resolve?](https://serverfault.com/questions/1161816/mirrorlist-centos-org-no-longer-resolve)（我當時參考的問答，存取日期：2026-08-28）

## 延伸閱讀

- [在CentOS7安裝docker與kubernates失敗：yum 源頭與 8080 port 錯誤排解](/post/centos7-docker-kubernetes-install-failure)：同樣聚焦 CentOS、yum，可接著比較不同情境的做法。
- [Docker 初探：安裝、常用指令與容器管理入門筆記](/post/docker-introduction-basics)：同樣聚焦 DevOps、CentOS，可接著比較不同情境的做法。
- [取得 Linux 安裝的系統版本：uname、/proc/version 與 /etc/os-release 指令教學](/post/get-linux-distribution-version)：同樣聚焦 Linux、DevOps，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2026-08-28。我保留當時遇到的 CentOS mirrorlist 錯誤與 sed 修復指令，並補上 CentOS Stream 8、CentOS Linux 7 EOL 後使用 vault 的限制。
`;export{e as default};