var e=`---
title: Hadoop 開放原始碼平台環境入門：雲端運算、MapReduce、HDFS 與 HBase
description: 說明 Hadoop 在雲端運算與分散式資料處理中的定位，整理 MapReduce、HDFS、HBase 與周邊專案的核心概念。
date: 2012-01-10
category: 後端開發
tags: [Hadoop, MapReduce, HDFS, HBase, 分散式系統]
readingTime: 12 分鐘
image: ""
imageAlt: ""
---


# Hadoop 開放原始碼平台環境入門：雲端運算、MapReduce、HDFS 與 HBase

Hadoop 是一套用來處理與保存大量資料的開放原始碼分散式平台。Hadoop 的價值不在於單一伺服器跑得更快，而是把大量資料切成可分配的工作，交給多台一般等級伺服器共同處理，再用分散式儲存與容錯機制降低硬體故障的影響。

這篇整理自 2009 年 11 月 RUN!PC 雜誌〈開放原始碼的雲端運算平台技術〉系列文章內容，保留當時從雲端運算談到 Hadoop 的脈絡，也補上較適合現在閱讀的段落結構。讀者可以先理解 Hadoop 為什麼會出現，再看 MapReduce、Hadoop Distributed File System（HDFS）與 Apache HBase 各自解決哪一段問題。

## Hadoop 開放原始碼平台主要解決什麼問題？

Hadoop 開放原始碼平台主要解決大量資料的分散式儲存與平行處理問題。開發者把資料處理邏輯拆成 Map 與 Reduce，Hadoop 負責叢集上的排程、容錯與資料位置管理。

大量資料處理一直是電腦科學與實務應用裡的重要課題。當網路公司開始面對搜尋索引、使用者行為、網站日誌與推薦系統等資料量時，單機資料庫或單台伺服器很快就會碰到容量與運算上限。

Hadoop 的定位，是讓開發者在一般商用伺服器組成的叢集上處理大量資料。Apache Hadoop 文件也把 Hadoop 描述為適合使用 commodity hardware 進行分散式儲存與分散式處理的系統，HDFS 負責儲存，MapReduce 則是常見的資料處理模型（Apache Hadoop HDFS Users Guide，2022-05）。

以 2009 年前後的語境來看，Google、Yahoo、Amazon、Facebook 這類大型網路服務需要處理大量使用者請求與資料分析工作。當時 Facebook 曾把 Hadoop 用在 Lexicon 等資料分析應用上，這也讓 Hadoop 成為許多開發者理解雲端運算與大數據平台的入口。

## 雲端運算和分散式運算有什麼關係？

雲端運算可以視為分散式運算在網際網路服務上的實作模式。分散式運算強調多台機器共同處理任務，雲端運算則把這些運算資源包裝成可透過網路取得的服務。

雲端運算（Cloud Computing）結合了 Infrastructure as a Service（IaaS）、Platform as a Service（PaaS）、Software as a Service（SaaS）、Web 2.0、虛擬化與 MapReduce 等技術。使用者看到的是遠端服務，底層則是伺服器叢集、儲存系統、網路與自動化管理共同支撐。

叢集運算（Cluster Computing）通常強調同一資料中心內大量電腦協同工作；雲端運算則把網際網路納入架構，讓分散在不同資料中心的伺服器群共同提供服務。從使用者角度來看，使用者不需要知道是哪一台伺服器處理了請求，只需要知道服務能透過網路取得。

這也是 Hadoop 容易被放進雲端運算脈絡討論的原因。Hadoop 不等於雲端服務本身，但 Hadoop 提供了建立大規模資料處理平台時常見的底層能力：分散式儲存、平行運算、失敗復原，以及把工作移到資料所在節點附近執行。

## 雲端服務和雲端運算差在哪裡？

雲端服務偏向使用者取得的服務成果，雲端運算偏向支撐服務的運算資源與技術架構。前者回答「使用者拿到什麼」，後者回答「系統如何提供這些能力」。

雲端服務專注在透過網路取得遠端能力，例如線上購物、影音娛樂、軟體即服務、遠端伺服器租用與儲存服務。使用者在意的是服務是否可用、是否容易存取、是否能用較低成本取得需要的功能。

雲端運算則更靠近資料中心與系統架構，重點是如何用虛擬化、自動化、叢集管理與分散式系統，把 CPU、記憶體、磁碟、網路與儲存資源組織成可彈性調度的基礎能力。

用後端開發的角度看，這兩個詞可以這樣拆：

| 面向 | 雲端服務 | 雲端運算 |
|---|---|---|
| 主要焦點 | 使用者透過網路取得的服務 | 服務背後的運算與儲存架構 |
| 常見例子 | SaaS、線上購物、影音服務、雲端主機 | 虛擬化、叢集、分散式儲存、批次運算 |
| 開發者關心 | API、體驗、可用性、成本 | 排程、容錯、擴展、資料位置 |
| Hadoop 位置 | 支撐雲端服務的底層能力之一 | 分散式儲存與運算平台 |

## 雲端運算架構通常包含哪些層次？

雲端運算架構通常由基礎架構、儲存服務、平台服務、應用程式服務與客戶端組成。每一層都把下層資源包裝成更容易使用的能力。

基礎架構層提供虛擬化運算、電腦叢集、硬體抽象化、作業系統、網路、記憶體、磁碟與 CPU 等設定。這一層接近 IaaS，也是多數大規模系統能動態擴展的根基。

儲存服務層負責分散式持續資料儲存。資料可以是不具結構化的檔案系統，例如 HDFS 與 Amazon S3；也可以是結構化或半結構化資料儲存，例如 Google App Engine DataStore、Amazon SimpleDB 或後來常見的 NoSQL 系統。

平台服務層提供開發與執行應用程式的環境，例如應用執行環境、資料處理框架與服務 API。應用程式服務層則把底層能力整理成使用者可以直接操作的服務。客戶端通常透過瀏覽器、桌面程式或行動裝置存取這些服務。

資訊增益放在這裡：從 Hadoop 的角度讀雲端架構，不要只記 IaaS、PaaS、SaaS 三個名詞。真正重要的是資料會放在哪裡、運算會在哪裡跑、節點故障時誰負責復原。這三個問題，比名詞分類更接近後端系統設計的核心。

## Hadoop 的來源與命名背景是什麼？

Hadoop 最初來自 Apache Nutch 的分散式資料處理需求，後來成為獨立專案。Hadoop 這個名稱沒有技術縮寫意義，來自 Doug Cutting 家中一個黃色大象玩具的名字。

Hadoop 的原始作者 Doug Cutting 曾開發 Apache Lucene。Apache Lucene 是以 Java 設計的高效能文件索引引擎 API，可索引文件中的文字，使搜尋效率高於傳統逐字比對。後來 Doug Cutting 又參與 Apache Nutch，Apache Nutch 是以 Lucene 為基礎發展的開放原始碼網頁搜尋引擎元件。

Apache Nutch 加入了網頁爬蟲、網頁連結資料庫、HTML 與其他文件格式解析器等能力。隨著 Nutch 需要處理更大規模的抓取與索引工作，Hadoop 逐漸從 Nutch 裡抽離，成為獨立的分散式運算與儲存平台。

Hadoop 這個名字本身不是縮寫，也不直接描述功能。Doug Cutting 曾說，Hadoop 來自孩子的黃色大象玩具名稱。這個名字容易拼、容易唸、沒有既有含義，也不容易和其他專案混淆，於是成為專案代號。

## Hadoop 由哪些核心元件組成？

Hadoop 生態系以 HDFS、MapReduce 與一組周邊資料處理專案為核心。HDFS 保存大量資料，MapReduce 執行批次運算，HBase、Hive、Pig、ZooKeeper 等專案補上不同資料處理需求。

Hadoop 核心使用 Java 開發，並提供 Java、C++、Shell、Command 等使用與開發介面。早期 Hadoop 可執行於 Linux、Mac OS X、Windows 與 Solaris，也常部署在一般商用等級伺服器組成的叢集上。

常見 Hadoop 相關元件可以整理如下：

| 元件 | 主要用途 |
|---|---|
| HDFS | Hadoop Distributed File System，提供分散式檔案儲存 |
| MapReduce | 把大量資料處理工作拆成 Map 與 Reduce 階段 |
| HBase | 建立在 HDFS 之上的分散式資料庫，適合大量資料的隨機讀寫 |
| Pig | 處理大型資料集的資料流語言與執行環境 |
| Hive | 分散式資料倉儲，提供類 SQL 的查詢方式管理 HDFS 資料 |
| ZooKeeper | 分散式協調服務，提供鎖定、組態與服務協調能力 |
| Avro | 跨語言資料序列化與 RPC 系統 |
| Chukwa | 分散式資料收集與分析系統 |

這些專案讓 Hadoop 不只是單一程式，而是一組大數據平台工具箱。後端開發者可以依需求選擇：需要批次分析時看 MapReduce，需要分散式檔案儲存時看 HDFS，需要大量稀疏資料隨機讀寫時看 HBase。

## MapReduce 在 Hadoop 裡負責什麼？

MapReduce 是 Hadoop 常見的批次資料處理模型。開發者定義 Map 函數產生中繼鍵值資料，再由 Reduce 函數合併相同鍵的資料並輸出結果。

MapReduce 的概念來自 Google 面對大規模資料處理時整理出的模型。Google 在 2004 年發表的 MapReduce 論文，把 MapReduce 定義為處理與產生大型資料集的程式模型與實作方式；使用者提供 map 與 reduce 函數，執行系統負責分割輸入、排程、容錯與機器間通訊（Dean and Ghemawat，2004）。

Map 函數的輸入通常是一組鍵值對，輸出則是一組中繼鍵值對。Reduce 函數會把相同中繼鍵底下的值合併起來，再產生最終輸出。這個思路很接近 divide and conquer：先把大問題拆成許多小問題，各自處理後再彙整結果。

MapReduce 適合搜尋索引製作、排序、網站存取日誌分析、資料採礦與機器學習前處理等大型批次任務。開發者不需要自己處理每台機器的資料分配與失敗重跑，因為框架會處理大部分叢集執行細節。

## HDFS 為什麼適合儲存大量資料？

HDFS 適合大量資料，是因為 HDFS 會把檔案切成區塊，複製到多個 DataNode，並由 NameNode 管理中繼資料。HDFS 用資料複本換取容錯與擴展性。

Hadoop Distributed File System（HDFS）是在分散式儲存環境裡提供單一目錄系統的檔案系統。典型的大型分散式檔案系統可能有大量節點、巨量檔案與 PB 等級資料量，因此 HDFS 的設計重點不是像本機檔案系統一樣頻繁修改小檔案，而是保存與讀取大型資料集。

HDFS 常被描述為 Write Once Read Many 的存取模式：檔案建立並寫入後，主要用途是被反覆讀取與分析。每個檔案會被切成多個 block，並複製成多份 replica，分散放在不同 DataNode。HDFS 官方文件說明，HDFS 叢集主要由管理檔案系統中繼資料的 NameNode，以及保存實際資料的 DataNode 組成（Apache Hadoop HDFS Users Guide，2022-05）。

HDFS 還有一個重要想法：把運算移到資料附近，通常比把大量資料搬到運算節點更划算。當資料量很大時，網路傳輸成本可能比 CPU 計算更昂貴。Hadoop 會利用資料位置資訊，把工作排到接近資料的節點上執行，減少跨網路搬移資料。

## HBase 在 Hadoop 生態系裡扮演什麼角色？

HBase 是建立在 HDFS 之上的分散式資料庫，適合需要大量資料隨機、即時讀寫的場景。HBase 讓 Hadoop 不只做批次檔案處理，也能承接寬欄資料存取需求。

Apache HBase 官方把 HBase 描述為「Hadoop database」，適用於需要對 Big Data 做隨機、即時讀寫的情境，目標是在一般硬體叢集上承載非常大的資料表（Apache HBase Project Summary，存取日期：2026-08-28）。

HBase 的資料模型接近 Google Bigtable：資料表由許多資料列組成，每一列有可排序的 row key，並可包含大量欄位。HBase 適合保存稀疏、寬欄、版本化的資料，也能和 MapReduce 整合，作為 MapReduce job 的資料來源或資料輸出端。

以系統選型來說，HBase 不是用來取代所有關聯式資料庫。HBase 比較適合超大量資料、資料列很寬、欄位稀疏、寫入量大，且需要依 row key 快速查詢的場景。傳統交易系統、複雜 JOIN 與標準報表，仍然更常用 PostgreSQL、MySQL 或其他關聯式資料庫處理。

## 開發者什麼時候該學 Hadoop？

開發者在需要理解大規模資料處理、分散式檔案系統或批次運算架構時，很適合學 Hadoop。即使正式環境改用 Spark、雲端託管服務或資料倉儲，Hadoop 的概念仍然是重要基礎。

Hadoop 早期讓開發者不用先成為分散式系統專家，就能把大量資料處理問題拆成 Map 與 Reduce，再交給叢集執行。這對搜尋、索引、日誌分析與離線報表都很有價值。

放到現在，許多團隊可能不會從零架一套 Hadoop 叢集，而是使用雲端資料平台、託管 Spark、物件儲存、資料倉儲或即時串流系統。不過 Hadoop 留下的幾個觀念仍然很值得學：

- 大資料處理要關心資料切分、排程與失敗重跑。
- 分散式儲存要處理 replica、metadata、節點故障與資料位置。
- 批次運算和即時查詢是不同需求，不應混成同一個工具選型問題。
- 開放原始碼平台常會從核心框架長出完整生態系，選型時要看整體維運成本。

我會把 Hadoop 當成一個理解大數據後端架構的入口，而不是一個「一定要在新專案安裝」的工具。讀懂 Hadoop，就比較容易讀懂後來的資料湖、分散式查詢引擎、批次運算平台與雲端資料服務。

## 常見問題

### Hadoop 是雲端運算平台嗎？

Hadoop 可以作為雲端運算環境裡的大量資料處理平台，但 Hadoop 本身不等於完整雲端服務。Hadoop 主要提供分散式儲存與批次運算能力，常被放在雲端或資料中心架構底層。

### Hadoop 和 MapReduce 是同一件事嗎？

Hadoop 和 MapReduce 不是同一件事。Hadoop 是一套分散式平台與生態系，MapReduce 是其中一種資料處理模型；Hadoop 還包含 HDFS、YARN 與許多周邊專案。

### HDFS 和一般檔案系統差在哪裡？

HDFS 是為大型資料集與分散式叢集設計的檔案系統。HDFS 會把檔案切成區塊並複製到多台機器，適合大量讀取與批次分析，不適合拿來當一般小檔案頻繁修改的本機檔案系統。

### HBase 適合拿來做交易資料庫嗎？

HBase 通常不適合取代傳統交易資料庫。HBase 適合大規模、寬欄、稀疏資料與依 row key 的快速讀寫；需要複雜交易、JOIN 與標準 SQL 報表時，關聯式資料庫通常比較合適。

### 現在還需要學 Hadoop 嗎？

如果工作會碰到資料平台、資料湖、批次運算、分散式儲存或大數據歷史架構，Hadoop 仍然值得學。新專案不一定要自己部署 Hadoop，但理解 Hadoop 能幫助開發者看懂許多後來的資料工程工具。

### Hadoop 適合什麼類型的資料處理？

Hadoop 適合大型批次資料處理，例如搜尋索引、排序、網站日誌分析、離線統計、資料採礦與機器學習前處理。需要毫秒級互動查詢或複雜交易時，通常要評估其他資料庫或即時處理架構。

## 參考資料

- Apache Hadoop，〈[HDFS Users Guide](https://hadoop.apache.org/docs/stable2/hadoop-project-dist/hadoop-hdfs/HdfsUserGuide.html)〉，發布日期：2022-05-24，存取日期：2026-08-28。
- Jeffrey Dean and Sanjay Ghemawat，〈[MapReduce: Simplified Data Processing on Large Clusters](https://www.usenix.org/conference/osdi-04/mapreduce-simplified-data-processing-large-clusters)〉，OSDI 2004。
- Apache HBase，〈[Project Summary](https://hbase.apache.org/summary.html)〉，存取日期：2026-08-28。
- Apache HBase，〈[HBase and MapReduce](https://hbase.apache.org/docs/mapreduce/)〉，存取日期：2026-08-28。

## 延伸閱讀

- [適用於雲端的物件存儲系統 Minio 是什麼？如何部署與測試？](/post/minio-object-storage-cloud)：同屬「後端開發」主題，可延伸理解相近問題的判斷方式。
- [圖形資料庫的概念入門](/post/graph-database-concepts-introduction)：同屬「後端開發」主題，可延伸理解相近問題的判斷方式。
- [現代資料架構 on AWS：從資料湖到 Lake House 的設計思考](/post/modern-data-architecture-on-aws)：同屬「後端開發」主題，可延伸理解相近問題的判斷方式。

## 最後更新

本文最後更新於 2026-08-28。來源刊載於 RUN!PC 雜誌 2009 年 11 月號，並於 2012-01-10 匯入舊站；本次整理保留雲端運算、Hadoop、MapReduce、HDFS 與 HBase 的主體內容，移除已失效的遠端圖片引用。
`;export{e as default};