var e=`---
title: 用 Nmap 掃描某個 IP 所有可接受連接的 PORT
description: 用 Nmap 掃描某個 IP 所有可接受連接的 PORT，這篇筆記整理 Nmap 網路掃描工具的介紹、使用目的、主要功能與常用指令，包含埠掃描、服務檢測、作業系統偵測與 NSE 腳本，幫你快速掌握網路安全審計與 Port 掃描的基本操作。
date: 2024-07-19
category: DevOps
tags: [Nmap, 網路安全, Port 掃描, Linux, 資安]
readingTime: 3 分鐘
image: /images/tech/hero_nmap-port-scanning.webp
imageAlt: 機房配線面板上插滿網路線的連接埠特寫
---
# 用 Nmap 掃描某個 IP 所有可接受連接的 PORT

想知道某個 IP 上哪些 PORT 是可以連接的嗎？這篇筆記整理我用 Nmap 掃描目標主機開放埠的心得，從 Nmap 是什麼、它能拿來做什麼，到幾個最常用的掃描指令，一次整理給你。Nmap 是網路安全審計的入門必備工具，學會基本用法就能快速盤點一台主機對外的服務面。

## Nmap 是什麼？為什麼要用它掃 PORT？

Nmap（Network Mapper）是一款免費且開源的網路安全工具，用於網路發現和安全審計。它可以使用原始 IP 封包以新穎的方式來確定網路上的哪些主機可用、這些主機提供哪些服務（應用程式名稱和版本）、它們運行的作業系統（和作業系統版本）、使用的封包過濾器/防火牆類型以及其他數十種特性。

Nmap 的工作原理是向目標主機發送原始 IP 封包並分析響應。Nmap 可以使用各種技術來掃描埠、檢測服務和確定作業系統。

## Nmap 在實務上有哪些使用目的？

Nmap 對網路管理員來說非常實用，常見的使用目的包括：

- **列舉網路主機清單**：Nmap 可以掃描網路並列出所有可用的主機。這對於網路管理員了解其網路上的內容非常有用。
- **管理服務升級排程**：Nmap 可用於識別正在運行的服務和版本。這對於網路管理員跟踪軟體升級和修補程式非常有用。
- **監視主機或服務執行狀況**：Nmap 可用於監視主機或服務是否可用。這對於網路管理員確保其網路正常運行非常有用。
- **漏洞檢測**：Nmap 可用於掃描主機中的已知漏洞。這對於網路管理員保護其網路免受攻擊非常有用。

## Nmap 有哪些主要功能？

Nmap 的核心功能可以分成四類：

- **埠掃描**：Nmap 可以掃描目標主機的埠以確定哪些埠已開啟、已關閉或過濾。
- **服務檢測**：Nmap 可以檢測目標主機上運行的服務。它可以識別服務的應用程式名稱、版本和協定。
- **作業系統偵測**：Nmap 可以識別目標主機的作業系統。它可以識別作業系統的類型、版本和發行版。
- **NSE 腳本**：Nmap 可以使用 NSE（Nmap Scripting Engine）腳本來擴展其功能。NSE 腳本可以用於執行各種任務，例如漏洞掃描、Web 應用程式掃描和網路枚舉。

## 怎麼用 Nmap 掃描目標 IP 的開放 PORT？

使用以下指令來安裝套件：

\`\`\`bash
sudo yum install nmap
\`\`\`

接著使用以下指令來掃描所有可連接的 port：

\`\`\`bash
nmap -v www.hinet.net
\`\`\`

也可以使用 \`-A\` 來偵測對方主機的作業系統與各種服務的版本：

\`\`\`bash
nmap -A scanme.nmap.org
\`\`\`

只需各種服務的版本的話，改用 \`-sV\`：

\`\`\`bash
nmap -sV scanme.nmap.org
\`\`\`

## 常見問題

### Nmap 是免費的嗎？

是的，Nmap 是免費且開源的網路安全工具，適用於網路發現和安全審計。它可以從官方網站 nmap.org 下載，Linux 上也能直接用套件管理器安裝，例如 \`sudo yum install nmap\`。

### 如何掃描某個 IP 上所有可接受的連接 PORT？

安裝 Nmap 後執行 \`nmap -v <目標IP或網址>\` 即可掃描所有可連接的 port。加上 \`-A\` 可以進一步偵測對方主機的作業系統與各種服務版本，只想看服務版本則用 \`-sV\`。

### Nmap 可以偵測作業系統和服務版本嗎？

可以。Nmap 的服務檢測能識別應用程式名稱、版本和協定，作業系統偵測能識別 OS 的類型、版本和發行版。使用 \`nmap -A\` 或 \`nmap -sV\` 就能取得這些資訊。

### 什麼是 NSE 腳本？

NSE（Nmap Scripting Engine）是 Nmap 的腳本引擎，用來擴展 Nmap 的功能。NSE 腳本可以用於執行各種任務，例如漏洞掃描、Web 應用程式掃描和網路枚舉。

### 用 Nmap 掃描別人的主機合法嗎？

Nmap 本身是合法的工具，但掃描前必須確認你對目標主機有授權，例如自己的機器或獲得書面同意的系統。未經授權掃描他人主機可能違反法律，實務上可先用 Nmap 官方提供的 scanme.nmap.org 練習。

## 參考資料

- [Nmap 官方網站](https://nmap.org/)
- [Nmap 文檔](https://nmap.org/book/man.html)
- [Nmap NSE 腳本](https://nmap.org/book/man-nse.html)
- [Nmap 網路診斷工具基本使用技巧與教學](https://blog.gtwang.org/linux/nmap-command-examples-tutorials/)

## 延伸閱讀

- [Nmap 教學:掃描某個 IP 所有可接受連接的 Port](/post/nmap-port-scanning)：同樣聚焦 Nmap、網路安全，可接著比較不同情境的做法。
- [Linux 網路功能指令介紹：ifconfig、route、ping、nslookup、traceroute](/post/linux-network-commands-intro)：同樣聚焦 Linux，可接著比較不同情境的做法。
- [查看某個 Linux 裡服務的狀態](/post/check-linux-service-status)：同樣聚焦 Linux，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2024-07-19，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};