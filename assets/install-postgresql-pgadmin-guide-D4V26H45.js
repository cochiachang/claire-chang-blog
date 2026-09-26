var e=`---
title: "PostgreSQL 和 pgAdmin 安裝教學：Linux 指令、連線設定與常見錯誤"
description: "整理 PostgreSQL 13 與 pgAdmin 的安裝流程、建庫指令、遠端連線設定，以及 _sqlite3、5050 連接埠與 SELinux 常見問題。"
date: 2024-06-09
category: 後端開發
tags: [PostgreSQL, pgAdmin, Linux, 資料庫, 後端開發]
readingTime: 8 分鐘
image: /images/tech/hero_install-postgresql-pgadmin-guide.webp
imageAlt: pgAdmin 建立 PostgreSQL 資料表欄位的操作畫面
---


# PostgreSQL 和 pgAdmin 安裝教學：Linux 指令、連線設定與常見錯誤

PostgreSQL 和 pgAdmin 的基本安裝流程，是先在 Linux 上加入 PostgreSQL 官方 Yum Repository，安裝並初始化 PostgreSQL 服務，再用 Python 虛擬環境安裝 pgAdmin。這份記錄保留我當時使用 PostgreSQL 13 與 pgAdmin 的完整指令，也補上遠端連線、5050 連接埠與 \`_sqlite3\` 錯誤的處理方式。

截至 2026-08-28，PostgreSQL 官方版本政策已將 PostgreSQL 13 標示為不再支援，最後版本是 13.23，最終發布日為 2025-11-13（PostgreSQL Global Development Group，[Versioning Policy](https://www.postgresql.org/support/versioning/)，存取日期：2026-08-28）。下面指令適合還原我當時的安裝環境；新機器若要上正式環境，建議把 \`13\` 換成仍受支援的 PostgreSQL 大版本。

## PostgreSQL 13 在 Linux 上怎麼安裝？

PostgreSQL 13 在 Red Hat 系列 Linux 上，可先安裝 PostgreSQL 官方 Yum Repository，再安裝 server 與 client 套件。資料庫叢集初始化只需要做一次。

我當時使用的指令如下：

\`\`\`bash
sudo yum install -y https://download.postgresql.org/pub/repos/yum/reporpms/EL-$(rpm -E %rhel)-x86_64/pgdg-redhat-repo-latest.noarch.rpm
sudo yum -qy module disable postgresql
sudo yum install -y postgresql13-server postgresql13
sudo /usr/pgsql-13/bin/postgresql-13-setup initdb
sudo systemctl enable postgresql-13
sudo systemctl start postgresql-13
sudo -i -u postgres
psql
\`\`\`

PostgreSQL 官方文件說明，Red Hat、Rocky Linux、AlmaLinux 與 Fedora 可透過 PostgreSQL Yum Repository 取得不同 PostgreSQL 版本；Red Hat 系列的安裝後步驟通常需要手動初始化資料庫並啟動 systemd 服務（PostgreSQL Global Development Group，[Linux downloads - Red Hat family](https://www.postgresql.org/download/linux/redhat/)，存取日期：2026-08-28）。

這段指令裡最容易忽略的是 \`initdb\`。\`initdb\` 會建立新的 PostgreSQL database cluster，也就是由同一個 PostgreSQL server instance 管理的一組資料庫（PostgreSQL Global Development Group，[initdb](https://www.postgresql.org/docs/13/app-initdb.html)，存取日期：2026-08-28）。如果這台機器已經有既有資料庫，不要直接重跑初始化指令，應先確認資料目錄與服務狀態。

## PostgreSQL 安裝後如何建立使用者和資料庫？

PostgreSQL 服務啟動後，可以切換成 \`postgres\` 系統使用者進入 \`psql\`，再建立應用程式使用者與資料庫。測試環境可照做，正式環境要改掉帳號、密碼與授權範圍。

進入 \`psql\` 後，我建立使用者與資料庫的 SQL 如下：

\`\`\`sql
CREATE USER myuser WITH PASSWORD 'mypassword';
CREATE DATABASE mydb;
GRANT ALL PRIVILEGES ON DATABASE mydb TO myuser;
\`\`\`

PostgreSQL 的 \`CREATE USER\` 是 \`CREATE ROLE\` 的別名，差異在於 \`CREATE USER\` 預設包含 \`LOGIN\` 權限（PostgreSQL Global Development Group，[CREATE USER](https://www.postgresql.org/docs/current/sql-createuser.html)，存取日期：2026-08-28）。我習慣在測試環境先用最短路徑確認資料庫能連，之後再回頭收斂權限；正式環境則不建議直接給應用帳號全部權限。

完成後離開 \`psql\` 和 \`postgres\` 使用者：

\`\`\`bash
\\q
exit
\`\`\`

## pgAdmin 如何用 Python 虛擬環境安裝？

pgAdmin 可以透過 PyPI 安裝成 Python web application。使用 Python 虛擬環境能把 pgAdmin 相關套件隔離起來，降低與系統 Python 套件互相衝突的機率。

我當時使用這組指令安裝與啟動 pgAdmin：

\`\`\`bash
sudo mkdir /var/lib/pgadmin
sudo mkdir /var/log/pgadmin
sudo chown $USER /var/lib/pgadmin
sudo chown $USER /var/log/pgadmin
python3 -m venv pgadmin4
source pgadmin4/bin/activate
pip install pgadmin4
pgadmin4
\`\`\`

第一次啟動 pgAdmin 時，終端機會要求設定初始帳號：

\`\`\`text
NOTE: Configuring authentication for SERVER mode.

Enter the email address and password to use for the initial pgAdmin user account:

Email address: user@domain.com
Password:
Retype password:
Starting pgAdmin 4. Please navigate to http://127.0.0.1:5050 in your browser.
 * Serving Flask app "pgadmin" (lazy loading)
 * Environment: production
   WARNING: Do not use the development server in a production environment.
   Use a production WSGI server instead.
 * Debug mode: off
\`\`\`

pgAdmin 官方 Python 套件頁也建議先建立 \`/var/lib/pgadmin\`、\`/var/log/pgadmin\`，再用 \`python3 -m venv pgadmin4\` 建立虛擬環境並透過 \`pip install pgadmin4\` 安裝；官方同時提醒 Python package 不包含 Desktop Runtime，執行時會以 server mode 啟動（pgAdmin Development Team，[pgAdmin 4 Python Download](https://www.pgadmin.org/download/pgadmin-4-python/)，存取日期：2026-08-28）。

## pgAdmin 安裝後如何再次啟動？

pgAdmin 已安裝完成後，不需要每次重建資料夾或重新安裝套件。回到同一個 Python 虛擬環境，啟動 \`pgadmin4\` 指令即可。

我後續啟動 pgAdmin 時，只跑下面兩行：

\`\`\`bash
source pgadmin4/bin/activate
pgadmin4
\`\`\`

啟動後瀏覽器預設連到 \`http://127.0.0.1:5050\`。如果只在伺服器本機操作，這個預設值就夠用；如果要從其他電腦連進來，還需要調整 pgAdmin 監聽位址、防火牆與 SELinux。

## pgAdmin 出現 No module named '_sqlite3' 怎麼辦？

\`No module named '_sqlite3'\` 通常表示目前使用的 Python 缺少 SQLite 模組支援。先安裝 SQLite 開發套件，再重新編譯或更換包含 \`_sqlite3\` 的 Python。

我遇到的錯誤訊息是：

\`\`\`text
No module named '_sqlite3'
\`\`\`

當時的處理方式，是先補上 SQLite 開發套件：

\`\`\`bash
sudo apt update
sudo apt install libsqlite3-dev
\`\`\`

接著找到 Python 原始碼目錄，重新編譯 Python。下面的 \`/path/to/python/source\` 要換成實際的 Python source 根目錄：

\`\`\`bash
cd /path/to/python/source
sudo ./configure --enable-optimizations
sudo make
sudo make altinstall
\`\`\`

這個問題的重點不是 pgAdmin 本身，而是 pgAdmin server mode 會使用 SQLite 儲存設定資料。pgAdmin 官方 server deployment 文件也列出 \`SQLITE_PATH\`、\`SESSION_DB_PATH\`、\`STORAGE_DIR\` 等設定路徑，這些目錄需要能被執行 pgAdmin 的使用者寫入（pgAdmin Development Team，[Server Deployment](https://www.pgadmin.org/docs/pgadmin4/latest/server_deployment.html)，存取日期：2026-08-28）。

## pgAdmin 只能從 127.0.0.1 連線時怎麼設定？

pgAdmin 預設只監聽本機位址，外部電腦無法直接連到 \`127.0.0.1:5050\`。測試環境可把 \`DEFAULT_SERVER\` 改成 \`0.0.0.0\`，正式環境建議放在反向代理後面。

先用下面指令找到 pgAdmin 套件位置：

\`\`\`bash
pip show pgadmin4 | grep Location
\`\`\`

我當時找到的設定檔位置在 Python 虛擬環境的 \`site-packages/pgadmin4/\` 裡，畫面上可以看到 \`config.py\`：

![pgAdmin Python 套件目錄中 config.py 的位置，紅框標示設定檔](/images/tech/postgresql-pgadmin-config-py.webp)

在 \`config.py\` 裡找到 \`DEFAULT_SERVER\`，把預設本機位址改成可對外監聽：

\`\`\`python
DEFAULT_SERVER = '0.0.0.0'
\`\`\`

pgAdmin 官方 \`config.py\` 文件說明，\`DEFAULT_SERVER = '127.0.0.1'\` 是預設值；若要讓 pgAdmin 在 LAN 中被其他機器連線，可以設定成 \`0.0.0.0\` 或指定網卡位址，但官方也明確提醒這不建議用在 production，正式部署應使用 WSGI application 搭配 Apache HTTPD 等 web server（pgAdmin Development Team，[The config.py File](https://www.pgadmin.org/docs/pgadmin4/latest/config_py.html)，存取日期：2026-08-28）。

## pgAdmin 5050 連接埠和 SELinux 要怎麼開？

pgAdmin 改成對外監聽後，Linux 防火牆也要允許 TCP 5050。若系統啟用 SELinux，還需要把 5050 加到允許的 HTTP port 類型。

firewalld 的設定指令如下：

\`\`\`bash
sudo systemctl start firewalld
sudo systemctl enable firewalld
sudo firewall-cmd --zone=public --add-port=5050/tcp --permanent
sudo firewall-cmd --reload
sudo firewall-cmd --zone=public --list-ports
\`\`\`

最後一行用來檢查 \`5050/tcp\` 是否已出現在開放清單。接著處理 SELinux port：

\`\`\`bash
sudo semanage port -a -t http_port_t -p tcp 5050
\`\`\`

如果 \`semanage\` 指令不存在，通常要先安裝 SELinux 管理工具套件；套件名稱會依 Linux 發行版而不同。完成後重新啟動 pgAdmin，再用瀏覽器連到伺服器 IP 的 \`5050\` port。

連線成功後，我在 pgAdmin 裡可以看到 PostgreSQL server、database、schema，也能建立資料表欄位：

![pgAdmin 連線 PostgreSQL 後建立資料表欄位的畫面](/images/tech/postgresql-pgadmin-table-created.webp)

## PostgreSQL 與 pgAdmin 安裝時我會先檢查什麼？

PostgreSQL 和 pgAdmin 的安裝問題通常卡在版本、權限、監聽位址與連接埠。先把這四件事拆開看，比反覆重裝更快找到問題。

我會照這個順序檢查：

| 檢查項目 | 檢查指令或位置 | 判斷重點 |
|---|---|---|
| PostgreSQL 服務 | \`systemctl status postgresql-13\` | 服務是否 active，是否已執行過 \`initdb\` |
| PostgreSQL 登入 | \`sudo -i -u postgres\`、\`psql\` | \`postgres\` 使用者是否能進入資料庫 |
| pgAdmin 啟動 | \`source pgadmin4/bin/activate\`、\`pgadmin4\` | 是否在正確的 Python 虛擬環境 |
| SQLite 支援 | Python \`_sqlite3\` 模組 | pgAdmin 設定資料庫是否能初始化 |
| 監聽位址 | \`DEFAULT_SERVER\` | 本機使用維持 \`127.0.0.1\`，測試外部連線才改 \`0.0.0.0\` |
| 防火牆 | \`firewall-cmd --zone=public --list-ports\` | 是否包含 \`5050/tcp\` |
| SELinux | \`semanage port\` | 5050 是否被允許作為 HTTP port |

這份檢查表是我後來整理安裝紀錄時補上的。因為 PostgreSQL 啟不來、pgAdmin 啟不來、瀏覽器連不到，三者看起來都像「資料庫不能用」，但真正的故障點完全不同。

## 常見問題

### PostgreSQL 13 現在還適合新專案使用嗎？
PostgreSQL 13 不適合新正式專案使用。PostgreSQL 官方版本政策顯示 PostgreSQL 13 已在 2025-11-13 結束支援；如果只是重現舊環境，可以保留 PostgreSQL 13 指令，新專案建議改用仍受支援的大版本。

### pgAdmin 一定要用 Python 虛擬環境安裝嗎？
pgAdmin 不一定只能用 Python 虛擬環境安裝，但我建議這樣做。pgAdmin 牽涉的 Python package 不少，虛擬環境可以避免和系統 Python 或其他專案的套件版本互相影響。

### pgAdmin 預設網址為什麼是 127.0.0.1:5050？
pgAdmin Python package 啟動後預設監聽本機位址 \`127.0.0.1\` 與 port \`5050\`。這樣比較適合本機測試；若要讓其他機器連入，需要調整 \`DEFAULT_SERVER\`、防火牆與 SELinux。

### 把 DEFAULT_SERVER 改成 0.0.0.0 安全嗎？
\`DEFAULT_SERVER = '0.0.0.0'\` 適合測試環境或受控內網，不適合直接裸露在正式環境。pgAdmin 官方文件也提醒 production 應使用 WSGI application 搭配 web server 或反向代理。

### No module named '_sqlite3' 是 PostgreSQL 的問題嗎？
\`No module named '_sqlite3'\` 不是 PostgreSQL 的問題，而是 pgAdmin 使用的 Python 缺少 SQLite 模組支援。補上 SQLite 開發套件並使用支援 \`_sqlite3\` 的 Python 後，pgAdmin 才能建立自己的設定資料庫。

### 開了 firewalld 5050 port 還是連不到 pgAdmin，要查哪裡？
先確認 pgAdmin 是否真的在 \`0.0.0.0:5050\` 監聽，再檢查 firewalld 是否列出 \`5050/tcp\`。如果系統啟用 SELinux，還要確認 5050 是否被加入 \`http_port_t\` 類型。

## 參考資料

- PostgreSQL Global Development Group，[Linux downloads - Red Hat family](https://www.postgresql.org/download/linux/redhat/)，存取日期：2026-08-28。
- PostgreSQL Global Development Group，[initdb](https://www.postgresql.org/docs/13/app-initdb.html)，存取日期：2026-08-28。
- PostgreSQL Global Development Group，[CREATE USER](https://www.postgresql.org/docs/current/sql-createuser.html)，存取日期：2026-08-28。
- PostgreSQL Global Development Group，[Versioning Policy](https://www.postgresql.org/support/versioning/)，存取日期：2026-08-28。
- pgAdmin Development Team，[pgAdmin 4 Python Download](https://www.pgadmin.org/download/pgadmin-4-python/)，存取日期：2026-08-28。
- pgAdmin Development Team，[Server Deployment](https://www.pgadmin.org/docs/pgadmin4/latest/server_deployment.html)，存取日期：2026-08-28。
- pgAdmin Development Team，[The config.py File](https://www.pgadmin.org/docs/pgadmin4/latest/config_py.html)，存取日期：2026-08-28。

## 延伸閱讀

- [PostgreSQL 設定與操作教學：CentOS 服務檢查、遠端連線、psql 與 pgAdmin](/post/postgresql-setup-and-operation)：同樣聚焦 PostgreSQL、pgAdmin，可接著比較不同情境的做法。
- [使用 pgvector 讓 PostgreSQL 支援向量相似度搜尋](/post/pgvector-postgresql-similarity-search)：同樣聚焦 PostgreSQL，可接著比較不同情境的做法。
- [向量搜尋資料庫比較：RAG 系統該如何選擇 Vector Database](/post/vector-database-comparison)：同樣聚焦 資料庫，可接著比較不同情境的做法。

## 最後更新

2026-08-28
`;export{e as default};