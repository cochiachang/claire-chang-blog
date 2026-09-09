var e=`---
title: PostgreSQL 設定與操作教學：CentOS 服務檢查、遠端連線、psql 與 pgAdmin
description: 整理 PostgreSQL 13 在 CentOS 上的服務檢查、設定檔位置、遠端連線設定、psql 建庫授權與 pgAdmin 操作重點。
date: 2024-06-24
category: 後端開發
tags: [PostgreSQL, CentOS, psql, pgAdmin, 資料庫設定]
readingTime: 8 分鐘
image: /images/tech/hero_install-postgresql-pgadmin-guide.webp
imageAlt: pgAdmin 建立 PostgreSQL 資料表欄位的操作畫面
---


# PostgreSQL 設定與操作教學：CentOS 服務檢查、遠端連線、psql 與 pgAdmin

PostgreSQL 設定與操作的第一步，是先確認資料庫服務是否正在執行、資料目錄在哪裡，再決定要用 \`psql\`、SQL 指令或 pgAdmin 管理。以我在 CentOS 上安裝的 PostgreSQL 13 為例，常見工作會集中在 \`systemctl\` 服務狀態、\`/var/lib/pgsql/13/data/\` 底下的設定檔，以及 \`postgresql.conf\`、\`pg_hba.conf\` 兩個遠端連線設定。

## 如何確認 PostgreSQL 13 服務狀態與資料目錄？

PostgreSQL 13 在 CentOS 上通常由 systemd 管理。先用 \`systemctl status postgresql-13\` 檢查服務，再從輸出中的 \`-D\` 參數確認資料目錄。

我會先看 PostgreSQL 目前是否真的在跑：

\`\`\`bash
sudo systemctl status postgresql-13
\`\`\`

在我的環境裡，輸出會長得像這樣：

\`\`\`text
● postgresql-13.service - PostgreSQL 13 database server
   Loaded: loaded (/usr/lib/systemd/system/postgresql-13.service; enabled; vend>
   Active: active (running) since Sat 2024-06-08 22:48:41 UTC; 2 weeks 1 days a>
     Docs: https://www.postgresql.org/docs/13/static/
 Main PID: 3264201 (postmaster)
    Tasks: 8 (limit: 23678)
   Memory: 27.6M
   CGroup: /system.slice/postgresql-13.service
           ├─3264201 /usr/pgsql-13/bin/postmaster -D /var/lib/pgsql/13/data/
           ├─3264202 postgres: logger
           ├─3264204 postgres: checkpointer
           ├─3264205 postgres: background writer
           ├─3264206 postgres: walwriter
           ├─3264207 postgres: autovacuum launcher
           ├─3264208 postgres: stats collector
           └─3264209 postgres: logical replication launcher

Warning: Journal has been rotated since unit was started. Log output is incomplete.
\`\`\`

這段輸出裡最重要的是兩件事：

| 欄位 | 判讀方式 |
| --- | --- |
| \`Active: active (running)\` | PostgreSQL 服務已經啟動 |
| \`-D /var/lib/pgsql/13/data/\` | PostgreSQL 13 的資料目錄與設定檔位置 |

PostgreSQL 官方文件也建議在啟動伺服器時指定 data directory，套件安裝版則通常交給作業系統服務管理工具處理（PostgreSQL Global Development Group，PostgreSQL 13 文件）。我在 CentOS 上會優先讀 systemd 的狀態，而不是先猜設定檔放在哪裡。

## PostgreSQL 13 的設定檔在哪裡？

PostgreSQL 13 的主要設定檔通常放在 data directory 底下。CentOS 套件常見位置是 \`/var/lib/pgsql/13/data/\`，可用 \`find\` 找出 \`.conf\` 檔。

確認資料目錄後，我會直接搜尋 PostgreSQL 13 底下的設定檔：

\`\`\`bash
find /var/lib/pgsql/13 -name "*.conf"
\`\`\`

實際找到的檔案如下：

\`\`\`text
/var/lib/pgsql/13/data/postgresql.conf
/var/lib/pgsql/13/data/postgresql.auto.conf
/var/lib/pgsql/13/data/pg_hba.conf
/var/lib/pgsql/13/data/pg_ident.conf
\`\`\`

這幾個檔案各自負責不同設定：

| 檔案 | 用途 |
| --- | --- |
| \`postgresql.conf\` | PostgreSQL 主設定檔，例如 listen address、port、connection 數量 |
| \`postgresql.auto.conf\` | \`ALTER SYSTEM\` 寫入的自動設定檔，不建議手動亂改 |
| \`pg_hba.conf\` | Host-Based Authentication，控制哪些來源、使用者、資料庫可連線 |
| \`pg_ident.conf\` | 身分對應設定，通常在 ident/peer 類型認證才會碰到 |

我最常改的是 \`postgresql.conf\` 和 \`pg_hba.conf\`。前者決定 PostgreSQL 要不要聽外部網卡，後者決定連進來的人是否通過認證。

## 如何允許非本機連線 PostgreSQL？

PostgreSQL 遠端連線至少要同時處理 \`listen_addresses\` 與 \`pg_hba.conf\`。只改其中一個通常不夠，還要確認防火牆與雲端安全群組是否開放 5432。

PostgreSQL 預設常只接受本機連線，這是合理的安全設計。官方文件說明，\`listen_addresses\` 的預設值是 \`localhost\`，代表只接受本機 TCP/IP loopback 連線；若要讓其他主機連線，必須改成指定 IP 或 \`*\`（PostgreSQL Global Development Group，PostgreSQL 13 文件）。

先打開 \`postgresql.conf\`，找到 \`listen_addresses\`：

\`\`\`conf
listen_addresses = '*'
\`\`\`

\`*\` 代表所有可用網卡都會接受連線。正式環境我比較少直接開 \`*\`，通常會改成資料庫伺服器要綁定的內網 IP，讓暴露面小一點。

接著修改 \`pg_hba.conf\`。如果只是測試環境，可能會看到這種寫法：

\`\`\`conf
host    all             all             0.0.0.0/0               md5
\`\`\`

這代表所有 IPv4 來源都可以嘗試用密碼認證連進所有資料庫。這個規則太寬，正式環境不建議直接使用。比較合理的方式，是只允許可信任的網段：

\`\`\`conf
host    all             all             192.168.1.0/24          md5
\`\`\`

PostgreSQL 官方文件提醒，\`pg_hba.conf\` 會由上往下依序比對，每一行的順序有意義；修改後在 Linux 上需要 reload 或重新啟動，伺服器才會重新讀取設定（PostgreSQL Global Development Group，PostgreSQL 13 文件）。

## 修改 PostgreSQL 設定後怎麼套用？

PostgreSQL 修改連線監聽設定後通常需要重新啟動。若只改 \`pg_hba.conf\`，reload 常常就夠；若改 \`listen_addresses\`，需要 restart 才會生效。

保守流程是先備份設定，再修改，最後重啟服務：

\`\`\`bash
sudo cp /var/lib/pgsql/13/data/postgresql.conf /var/lib/pgsql/13/data/postgresql.conf.bak
sudo cp /var/lib/pgsql/13/data/pg_hba.conf /var/lib/pgsql/13/data/pg_hba.conf.bak
sudo systemctl restart postgresql-13
\`\`\`

有些系統上的服務名稱可能是 \`postgresql\`，不是 \`postgresql-13\`。如果下面這個指令失敗：

\`\`\`bash
sudo systemctl restart postgresql
\`\`\`

我會回頭用這個確認實際服務名稱：

\`\`\`bash
systemctl list-units --type=service | grep postgres
\`\`\`

如果只是改 \`pg_hba.conf\`，可以用 reload：

\`\`\`bash
sudo systemctl reload postgresql-13
\`\`\`

我的檢查順序是：服務是否啟動、5432 port 是否開啟、\`listen_addresses\` 是否聽對網卡、\`pg_hba.conf\` 是否允許來源網段、使用者是否有資料庫權限。這樣拆開看，通常比重複重啟有效。

## 如何用 psql 建立使用者、資料庫與授權？

psql 是 PostgreSQL 內建的命令列工具。建立資料庫時，我會先切到 \`postgres\` 系統使用者，再用 SQL 建立 role、database 與權限。

如果 PostgreSQL 已經安裝並啟動，可以用下面的方式進入 \`psql\`：

\`\`\`bash
sudo -i -u postgres
psql
\`\`\`

接著建立使用者與資料庫：

\`\`\`sql
CREATE USER myuser WITH PASSWORD 'mypassword';
CREATE DATABASE mydb;
GRANT ALL PRIVILEGES ON DATABASE mydb TO myuser;
\`\`\`

完成後離開 \`psql\` 與 \`postgres\` shell：

\`\`\`bash
\\q
exit
\`\`\`

PostgreSQL 官方文件把 \`CREATE DATABASE\` 定義為建立新資料庫的 SQL 指令，建立者通常需要 superuser 或 \`CREATEDB\` 權限（PostgreSQL Global Development Group，PostgreSQL 16 文件）。我在初次設定時會先用 superuser 建好最小權限帳號，再讓應用程式使用獨立帳號連線，避免直接把 \`postgres\` 超級使用者拿去給服務使用。

## 如何用 SQL 檢查 PostgreSQL 連線與權限？

PostgreSQL 設定改完後，不要只看服務狀態。用 \`psql\` 實際連線、列資料庫、切資料庫，才能確認帳號、密碼、網路與權限都有對齊。

先從本機測試指定帳號是否能連線：

\`\`\`bash
psql -h 127.0.0.1 -p 5432 -U myuser -d mydb
\`\`\`

進入 \`psql\` 後，我會用幾個基本指令檢查：

\`\`\`sql
\\l
\\c mydb
\\dt
SELECT current_database(), current_user;
\`\`\`

如果要確認 \`pg_hba.conf\` 規則是否被 PostgreSQL 正確讀取，也可以查系統檢視：

\`\`\`sql
SELECT line_number, type, database, user_name, address, auth_method, error
FROM pg_hba_file_rules
ORDER BY line_number;
\`\`\`

\`error\` 欄位如果不是空值，代表對應行可能有格式或設定問題。這個查法比只看檔案內容可靠，因為 PostgreSQL 讀到的狀態才是真正會影響連線的狀態。

## 如何用 pgAdmin 管理 PostgreSQL？

pgAdmin 適合用圖形介面瀏覽 schema、table、query tool 與資料內容。命令列適合快速驗證，pgAdmin 則適合看結構與手動測試 SQL。

pgAdmin 4 是 PostgreSQL 常用的開源管理與開發平台，官方文件也把部署模式分成桌面、伺服器與容器等方式（pgAdmin Development Team，pgAdmin 4 文件）。如果已經能用瀏覽器開啟 pgAdmin，通常會照這個流程操作：

1. 登入 pgAdmin。
2. 在 Object Explorer 新增或選擇 PostgreSQL server。
3. 展開 \`Databases\`、\`Schemas\`、\`Tables\` 確認資料表。
4. 對資料庫按右鍵開啟 Query Tool。
5. 執行 SQL 並檢查結果。

![pgAdmin 建立 PostgreSQL 資料表欄位的畫面，左側是 Object Explorer，右側是 Columns 設定視窗](/images/tech/postgresql-pgadmin-table-created.webp)

我會把 pgAdmin 當成「看資料庫結構」的工具，而不是取代版本控管中的 migration。正式專案的 schema 變更仍然應該寫成 SQL migration 或框架 migration，避免只有 pgAdmin 裡有操作紀錄、程式碼倉庫卻看不到變更原因。

## PostgreSQL 遠端連線失敗時怎麼排查？

PostgreSQL 遠端連線失敗通常不是單一問題，而是服務、網路、監聽位址、認證規則與資料庫權限其中一層沒通。排查時照層級檢查最快。

我會照下面順序查：

| 層級 | 檢查項目 | 常用指令或位置 |
| --- | --- | --- |
| 服務 | PostgreSQL 是否在跑 | \`systemctl status postgresql-13\` |
| Port | 5432 是否有 listen | \`ss -lntp\` |
| 監聽 | 是否只聽 localhost | \`postgresql.conf\` 的 \`listen_addresses\` |
| 認證 | 來源網段是否允許 | \`pg_hba.conf\` |
| 防火牆 | OS 或雲端安全群組是否阻擋 | \`firewall-cmd\`、雲端控制台 |
| 帳號 | 使用者是否存在且密碼正確 | \`\\du\` |
| 權限 | 使用者是否能連指定資料庫 | \`GRANT CONNECT ON DATABASE mydb TO myuser;\` |

最常見的盲點是只改了 \`pg_hba.conf\`，但 \`listen_addresses\` 仍是 \`localhost\`；或是 PostgreSQL 已經開放了，CentOS firewalld 或雲端安全群組還擋著 5432。

## 常見問題

### PostgreSQL 設定檔通常放在哪裡？
PostgreSQL 設定檔通常放在 database cluster 的 data directory。以 CentOS 上的 PostgreSQL 13 套件安裝為例，常見位置是 \`/var/lib/pgsql/13/data/\`，其中 \`postgresql.conf\` 管主設定，\`pg_hba.conf\` 管連線認證。

### PostgreSQL 遠端連線一定要把 \`listen_addresses\` 設成 \`*\` 嗎？
PostgreSQL 遠端連線不一定要把 \`listen_addresses\` 設成 \`*\`。正式環境更建議指定內網 IP 或必要網卡，再搭配 \`pg_hba.conf\` 限制來源網段，降低資料庫暴露範圍。

### \`pg_hba.conf\` 裡的 \`0.0.0.0/0\` 可以用在正式環境嗎？
\`pg_hba.conf\` 裡的 \`0.0.0.0/0\` 代表所有 IPv4 來源都可以嘗試連線，正式環境不建議這樣開。比較安全的做法是限制到應用伺服器、VPN 或內網 CIDR，例如 \`192.168.1.0/24\`。

### 修改 PostgreSQL 設定後要 reload 還是 restart？
只修改 \`pg_hba.conf\` 時，PostgreSQL reload 通常就能重新讀取認證規則。修改 \`listen_addresses\` 這類啟動時才生效的參數，則需要 restart PostgreSQL 服務。

### psql 和 pgAdmin 該怎麼分工？
psql 適合快速檢查連線、執行 SQL、寫腳本與排查權限問題。pgAdmin 適合用圖形介面瀏覽資料庫結構、開 Query Tool、查看表格與手動驗證查詢結果。

### PostgreSQL 連不上時應該先查哪裡？
PostgreSQL 連不上時，我會先查 \`systemctl status postgresql-13\`，確認服務是否啟動。接著檢查 5432 port、\`listen_addresses\`、\`pg_hba.conf\`、防火牆、帳號密碼與資料庫權限。

## 參考資料

- PostgreSQL Global Development Group，[PostgreSQL 13 Documentation: Starting the Database Server](https://www.postgresql.org/docs/13/server-start.html)，存取日期：2026-08-28。
- PostgreSQL Global Development Group，[PostgreSQL 13 Documentation: Connections and Authentication](https://www.postgresql.org/docs/13/runtime-config-connection.html)，存取日期：2026-08-28。
- PostgreSQL Global Development Group，[PostgreSQL 13 Documentation: The pg_hba.conf File](https://www.postgresql.org/docs/13/auth-pg-hba-conf.html)，存取日期：2026-08-28。
- PostgreSQL Global Development Group，[PostgreSQL 16 Documentation: CREATE DATABASE](https://www.postgresql.org/docs/16/sql-createdatabase.html)，存取日期：2026-08-28。
- pgAdmin Development Team，[pgAdmin 4 Documentation: Deployment](https://www.pgadmin.org/docs/pgadmin4/latest/deployment.html)，存取日期：2026-08-28。

## 延伸閱讀

- [PostgreSQL 和 pgAdmin 安裝教學：Linux 指令、連線設定與常見錯誤](/post/install-postgresql-pgadmin-guide)：同樣聚焦 PostgreSQL、pgAdmin，可接著比較不同情境的做法。
- [使用 pgvector 讓 PostgreSQL 支援向量相似度搜尋](/post/pgvector-postgresql-similarity-search)：同樣聚焦 PostgreSQL，可接著比較不同情境的做法。
- [CentOS 無法連接 mirror.centos.org：改用 vault.centos.org 修復 yum repo](/post/centos-mirror-centos-org-unreachable)：同樣聚焦 CentOS，可接著比較不同情境的做法。

## 最後更新

2026-08-28
`;export{e as default};