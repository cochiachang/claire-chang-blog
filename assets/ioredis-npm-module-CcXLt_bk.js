var e=`---
title: ioredis 是什麼？Node.js 高效能 Redis 客戶端完整介紹與使用範例
description: ioredis 是功能齊全的 Node.js Redis 客戶端，支援 Cluster、Sentinel、Pipelining、Lua 腳本與 Pub/Sub。本文整理 ioredis 的核心特性與自訂 Sentinel Connector 的完整使用範例。
date: 2020-02-27
category: 後端開發
tags: [Node.js, Redis, ioredis, npm, 資料庫]
readingTime: 4 分鐘
image: /images/tech/hero_ioredis-npm-module.webp
imageAlt: ioredis Node.js Redis 客戶端模組介紹示意圖
---


# ioredis 是什麼？Node.js 高效能 Redis 客戶端完整介紹與使用範例

這篇文章解決「Node.js 要用哪個 Redis 客戶端、怎麼用」的問題。我會先簡介 Redis 本身的記憶體存儲與持久化特性，再整理 ioredis 的完整功能清單，最後用一段完整的程式碼示範如何自訂 Sentinel Connector 並執行基本的 Redis 命令。

## Redis 是什麼？為什麼它這麼快？

Redis 是 REmote DIctionary Server（遠程字典服務器）的縮寫，它以字典結構（key-value 鍵值對結構）存儲數據，並允許其他應用通過 TCP 協議讀寫字典中的內容。所以，Redis 是一個 key-value 存儲系統，或者說是一個 key-value 數據庫。

Redis 數據庫中的**所有數據都存儲在內存中**。由於內存的讀寫速度遠快於硬盤，因此 Redis 在性能上對比其他基於硬盤存儲的數據庫有非常明顯的優勢——在一台普通的筆記本電腦上，Redis 可以在一秒內讀寫超過十萬個鍵值。

將數據存儲在內存中也有問題，例如程序退出後內存中的數據會丟失。不過 Redis 提供了對持久化的支持，可以將內存中的數據**異步寫入到硬盤中，同時不影響繼續提供服務**。

## ioredis 有哪些功能？

ioredis 是一個功能強大的 Redis 客戶端，已被世界上最大的在線商務公司阿里巴巴和許多其他公司所使用。它的主要特性包括：

- **功能齊全**：支持 Cluster、Sentinel、Pipelining，還支持 Lua 腳本和 Pub/Sub（具有二進制消息的支持）。
- **高性能**。
- **令人愉快的 API**：它與 Node 回調和本機 Promise 一起使用。
- 命令參數和答復的轉換。
- Transparent key prefixing（透明鍵前綴）。
- Lua 腳本的抽象，允許定義自定義命令。
- 支持二進制數據。
- 支持 TLS。
- 支持 offline queue 和 ready checking。
- 支持 ES6 類型，如 \`Map\` 和 \`Set\`。
- 支持 GEO 命令（Redis 3.2 不穩定）。
- 複雜的錯誤處理策略。
- 支持 NAT 映射。

## ioredis 使用範例：自訂 Sentinel Connector

下面是一個簡單的使用範例，示範如何建立一個從外部服務動態取得 Sentinel 清單的自訂 Connector，並執行基本的 get / set / del 命令：

\`\`\`js
"use strict";

const Redis = require("ioredis");
const MyService = require("path/to/my/service");

// Create a custom connector that fetches sentinels from an external call
class AsyncSentinelConnector extends Redis.SentinelConnector {
  constructor(options = {}) {
    // Placeholder
    options.sentinels = options.sentinels || [
      { host: "localhost", port: 6379 }
    ];

    // SentinelConnector saves options as its property
    super(options);
  }

  connect(eventEmitter) {
    return MyService.getSentinels().then(sentinels => {
      this.options.sentinels = sentinels;
      this.sentinelIterator = new Redis.SentinelIterator(sentinels);
      return Redis.SentinelConnector.prototype.connect.call(this, eventEmitter);
    });
  }
}

const redis = new Redis({
  Connector: AsyncSentinelConnector
});

// ioredis supports all Redis commands:
redis.set("foo", "bar");
redis.get("foo", function(err, result) {
  if (err) {
    console.error(err);
  } else {
    console.log(result);
  }
});
redis.del("foo");

// Or using a promise if the last argument isn't a function
redis.get("foo").then(function(result) {
  console.log(result);
});

// Arguments to commands are flattened, so the following are the same:
redis.sadd("set", 1, 3, 5, 7);
redis.sadd("set", [1, 3, 5, 7]);

// All arguments are passed directly to the redis server:
redis.set("key", 100, "EX", 10);

// Change the server configuration
redis.config("set", "notify-keyspace-events", "KEA");
\`\`\`

![ioredis 模組示意圖](/images/articles/ioredis-npm-module-1.webp)

更多範例請見 [ioredis 官方 GitHub examples](https://github.com/luin/ioredis/tree/master/examples)。

## 常見問題

### ioredis 和 node-redis 有什麼差別？

ioredis 是功能更完整的 Redis 客戶端，原生支持 Cluster、Sentinel、離線佇列與較複雜的錯誤處理策略；node-redis 則較輕量。需要 Sentinel 或 Cluster 功能時，ioredis 通常是首選。

### ioredis 支援 Promise 嗎？

支援。當命令的最後一個參數不是函數時，ioredis 會回傳 Promise；最後一個參數是函數時則走 Node 回調風格，兩種寫法可以混用。

### 如何用 ioredis 連接 Redis Sentinel？

在建立連線時傳入 Sentinel 相關設定，或像本文範例一樣繼承 \`Redis.SentinelConnector\` 自訂 \`connect()\` 方法，動態從外部服務取得 Sentinel 清單後再進行連線。

### Redis 的資料放在記憶體，重啟會消失嗎？

不會全部消失。Redis 提供持久化機制，可將內存中的數據異步寫入硬盤，且寫入過程不影響繼續提供服務。

## 參考資料

- [ioredis 官方 GitHub（含 examples 目錄）](https://github.com/luin/ioredis/tree/master/examples)

## 延伸閱讀

- [Redis Sentinel 是什麼？高可用性架構、連線方式與資料瀏覽實戰](/post/redis-sentinel)：同樣聚焦 Redis、資料庫，可接著比較不同情境的做法。
- [Node.js yeast 模組教學：短 ID 產生、encode 與 decode 用法](/post/nodejs-yeast-encryption-module)：同樣聚焦 Node.js、npm，可接著比較不同情境的做法。
- [Angular NPM 與 package.json 設定教學](/post/angular-npm-package-json-setup)：同樣聚焦 npm、Node.js，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2020-02-27，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};