var e=`---
title: Redis Sentinel 是什麼？高可用性架構、連線方式與資料瀏覽實戰
description: Redis Sentinel 為 Redis 提供監控、通知、自動故障轉移與配置提供者四大功能。本文整理 Sentinel 的特性、如何用 redis-cli 連線查詢 master 資訊，以及用 Redis Desktop Manager 瀏覽資料的方法。
date: 2020-02-27
category: 後端開發
tags: [Redis, Sentinel, 高可用性, 資料庫, DevOps]
readingTime: 4 分鐘
image: /images/tech/hero_redis-sentinel.webp
imageAlt: Redis Sentinel 高可用性架構示意圖
---


# Redis Sentinel 是什麼？高可用性架構、連線方式與資料瀏覽實戰

這篇文章解決「Redis 主機掛掉怎麼辦」的問題。我會整理 Redis Sentinel 的四大功能與分散式設計的原因，接著示範如何用 redis-cli 連線到 Sentinel 查詢真正的 master port，最後介紹如何用 Redis Desktop Manager 瀏覽 Redis 裡的資料。

## Sentinel 有哪些特性？

Redis Sentinel 為 Redis 提供高可用性。實際上，這意味著使用 Sentinel 可以創建 Redis 部署，該部署可以在沒有人工干預的情況下抵抗某些類型的故障。

Redis Sentinel 還提供其他附帶任務，例如監視、通知，並充當客戶端的配置提供程序。宏觀上 Sentinel 功能的完整列表如下：

| 功能 | 說明 |
| --- | --- |
| 監控 | Sentinel 會不斷檢查主實例和副本實例是否按預期工作 |
| 通知 | Sentinel 可以通過 API 通知系統管理員或其他程序，某個受監視的 Redis 實例出了問題 |
| 自動故障轉移 | 如果主服務器未按預期工作，Sentinel 可以啟動故障轉移過程，將副本升級為主服務器，將其他副本重新配置為使用新的主服務器，並通知使用 Redis 的應用程序新的連接地址 |
| 配置提供程序 | Sentinel 充當客戶端服務發現的授權來源：客戶端連接到 Sentinels 詢問負責給定服務的當前 Redis 主服務器地址；發生故障轉移時，Sentinels 會報告新地址 |

## 為什麼 Sentinel 是分散式系統？

Sentinel 本身設計為在有多個 Sentinel 進程協同合作的配置中運行。具有多個 Sentinel 進程進行協作的優點如下：

- 當多個哨兵就「給定的主機不再可用」這一事實達成共識時，才會執行故障檢測。這降低了誤報的可能性。
- 即使不是所有的 Sentinel 進程都在工作，Sentinel 仍能正常工作，從而使系統能夠應對故障。畢竟，擁有故障轉移系統本身就是一個單點故障，這沒有任何樂趣。

更多介紹請見 [Redis 官方 Sentinel 文件](https://redis.io/topics/sentinel)。

## 如何連接至 Redis Sentinel？

用 redis-cli 連線到 Sentinel（注意 port 通常是 26379）：

\`\`\`cmd
redis-cli -h redis.test -p 26379
\`\`\`

接著進行認證：

\`\`\`cmd
AUTH my_password
\`\`\`

ping 一下確認連線：

\`\`\`cmd
ping
\`\`\`

查看某個 master 的相關資料：

\`\`\`cmd
sentinel master myDBName
\`\`\`

![sentinel master 查詢結果截圖，可看到真正的 master port](/images/articles/redis-sentinel-1.webp)

這時候可以看到 Sentinel 真正所使用的 port，然後就可得知這是真正要連接的 Redis 的 port。

## 如何瀏覽 Redis 裡的資料？

下載客戶端工具：[Redis Desktop Manager](https://redisdesktop.com/)。

![Redis Desktop Manager 連線設定畫面截圖](/images/articles/redis-sentinel-2.webp)

連線設定欄位說明：

- **Name**：連線名稱（自己取）。
- **host**：打上 Redis 主機的 IP 或 FQDN。
- **port**：打上 Redis 所使用的 port。
- **Auth**：如果有填則會做認證。

按下 Test Connection 就可以測試連線。如果 Test Connection 成功而瀏覽資料失敗的話，很可能是因為該 port 並不是給看資料用的，可以用 console 打 \`info\`，用 command line 去確認相關資訊。

## 常見問題

### Redis Sentinel 的作用是什麼？

Sentinel 為 Redis 提供高可用性：持續監控 master 與 replica、異常時通知管理者、自動執行故障轉移（把副本升級為 master），並充當客戶端查詢目前 master 地址的配置來源。

### 為什麼要跑多個 Sentinel 進程？

多個 Sentinel 需要對「master 掛了」達成共識才會執行故障檢測，可降低誤報；同時即使部分 Sentinel 進程失效，整個高可用系統仍能運作，避免故障轉移系統本身成為單點故障。

### Sentinel 的 port 和 Redis 的 port 一樣嗎？

不一樣。Sentinel 通常使用 26379，透過 \`sentinel master <name>\` 查詢後可以看到真正要連接的 Redis master 的 port。

### Redis Desktop Manager 連線成功卻看不到資料？

很可能是連到的 port 是 Sentinel 而不是真正的 Redis 資料節點。可以用 console 打 \`info\` 命令，用 command line 確認相關資訊後改連正確的 master port。

## 參考資料

- [Redis Sentinel 官方文件](https://redis.io/topics/sentinel)
- [Redis Desktop Manager](https://redisdesktop.com/)

## 延伸閱讀

- [ioredis 是什麼？Node.js 高效能 Redis 客戶端完整介紹與使用範例](/post/ioredis-npm-module)：同樣聚焦 Redis、資料庫，可接著比較不同情境的做法。
- [向量搜尋資料庫比較：RAG 系統該如何選擇 Vector Database](/post/vector-database-comparison)：同樣聚焦 資料庫，可接著比較不同情境的做法。
- [PostgreSQL 和 pgAdmin 安裝教學：Linux 指令、連線設定與常見錯誤](/post/install-postgresql-pgadmin-guide)：同樣聚焦 資料庫，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2020-02-27，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};