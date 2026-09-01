var e=`---
title: ELK Stack 是什麼？Elasticsearch、Logstash、Kibana 架構與安裝設定入門
description: 介紹 ELK Stack 三大組件——Elasticsearch 搜索分析引擎、Logstash 數據處理管道、Kibana 視覺化工具的角色分工，並整理安裝步驟、Config 設定與 Logstash grok/mutate filter 學習資源。
date: 2019-10-09
category: DevOps
tags: [ELK, Elasticsearch, Logstash, Kibana, 日誌分析]
readingTime: 5 分鐘
image: /images/tech/hero_elk-stack-introduction.webp
imageAlt: ELK Stack 架構示意圖，展示 Elasticsearch、Logstash 與 Kibana 三個組件的關係
---


# ELK Stack 是什麼？Elasticsearch、Logstash、Kibana 架構與安裝設定入門

ELK 是三個開源項目的縮寫，用來解決「大量日誌要怎麼採集、儲存、搜尋與呈現」的問題。這篇文章整理我接觸 ELK 時的架構筆記：三大組件各自負責什麼、安裝流程怎麼走，以及 Config 與 Logstash filter 的設定學習資源。

## ELK 三大組件各自負責什麼？

**ELK** 是三個開源項目的首字母縮寫，這三個項目分別是：

1. \`Elasticsearch\`：一個搜索和分析引擎，負責儲存資料並提供全文搜索。
2. \`Logstash\`：服務器端數據處理管道，能夠同時從多個來源採集數據、轉換數據，然後將數據發送到諸如 \`Elasticsearch\` 等存儲庫中。
3. \`Kibana\`：讓用戶在 \`Elasticsearch\` 之上用圖形和圖表對數據進行可視化。

![ELK Stack 架構示意圖：Logstash 採集資料進 Elasticsearch，再由 Kibana 呈現](/images/articles/elk-stack-introduction-1.webp)

簡單來說，資料流是「Logstash 收集與轉換 → Elasticsearch 儲存與索引 → Kibana 查詢與畫圖」。

## ELK 要怎麼安裝？

安裝流程可以參考這篇非常詳細的教學：[ELK 教學 - 從無到有安裝 ELK (CentOS/Red Hat)](https://blog.johnwu.cc/article/how-to-install-elasticsearch-logstash-and-kibana-elk-stack-on-centos-red-hat.html)。

大致步驟整理如下：

1. 安裝 VirtualBox
2. 安裝 Java
3. 安裝 Elasticsearch
4. 安裝 Beats

## Config 設定要看哪些文件？

三個組件各自有 config 檔需要調整，再加上外掛安裝，我當時主要參考下面這幾份文件：

1. [Config Of Logstash](https://mmx362003.gitbooks.io/elk-stack-guide/config_of_logstash.html)
2. [Config Of ElasticSearch](https://mmx362003.gitbooks.io/elk-stack-guide/config_of_elasticsearch.html)
3. [Config Of Kibana](https://mmx362003.gitbooks.io/elk-stack-guide/config_of_kibana.html)
4. [Plugin Install Of All Module](https://mmx362003.gitbooks.io/elk-stack-guide/plugin_install_of_all_module.html)

## Logstash 的 filter 要怎麼設定？

Logstash 的 filter 負責把原始日誌解析成結構化欄位，我主要用兩個 filter：

**grok**（用正規表示式解析非結構化日誌）：

- [Elastic 官方 grok filter 文件](https://www.elastic.co/guide/en/logstash/7.3/plugins-filters-grok.html)
- [3 種常用 Logstash filter 教學（Medium）](https://medium.com/@hungtaohsieh/3%E7%A8%AE%E5%B8%B8%E7%94%A8logstash-filter-493e94a391b7)

**mutate**（欄位的改名、型別轉換、刪減等操作）：

- [mutate filter 用法教學（CSDN）](https://blog.csdn.net/cromma/article/details/52919742)

寫 grok pattern 時建議搭配線上測試工具 [Grok Debugger](Grok Debugger 已終止服務（Elastic 官方已下線此工具）)，可以即時驗證 pattern 是否正確解析出想要的欄位。

## 常見問題

### ELK 三個組件各自的角色是什麼？

Elasticsearch 是搜索與分析引擎，負責儲存與索引資料；Logstash 是伺服器端資料處理管道，從多個來源採集並轉換資料後送往 Elasticsearch；Kibana 則提供圖形化介面，讓你對 Elasticsearch 中的資料做視覺化查詢。

### ELK 安裝的基本步驟有哪些？

先準備好虛擬環境（VirtualBox）與 Java 環境，接著安裝 Elasticsearch 作為儲存核心，最後安裝 Beats 收集資料，再依需求補上 Logstash 與 Kibana。

### grok filter 是做什麼用的？

grok 用正規表示式把非結構化的原始日誌（例如 access log）解析成結構化欄位，方便後續在 Elasticsearch 中搜尋與統計。建議用 Grok Debugger 先測試 pattern 再放進正式設定。

## 參考資料

- [ELK 教學 - 從無到有安裝 ELK (CentOS/Red Hat)](https://blog.johnwu.cc/article/how-to-install-elasticsearch-logstash-and-kibana-elk-stack-on-centos-red-hat.html)
- [Logstash grok filter 官方文件](https://www.elastic.co/guide/en/logstash/7.3/plugins-filters-grok.html)
- [Grok Debugger](Grok Debugger 已終止服務（Elastic 官方已下線此工具）)
- [ELK Stack Guide（Config 系列文件）](https://mmx362003.gitbooks.io/elk-stack-guide/config_of_logstash.html)

## 延伸閱讀

- [把 Prometheus 的資料打到 ELK](/post/prometheus-metrics-to-elk)：同樣聚焦 ELK、Logstash，可接著比較不同情境的做法。
- [在 K8S 內 Node.js 紀錄 log 的解決方案](/post/k8s-nodejs-logging-solution)：同屬「DevOps」主題，可延伸理解相近問題的判斷方式。
- [使用 PM2 管理 Node.js 伺服器教學](/post/pm2-node-server-management)：同屬「DevOps」主題，可延伸理解相近問題的判斷方式。

## 最後更新

2026-08-28（原文發布於 2019-10-09，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};