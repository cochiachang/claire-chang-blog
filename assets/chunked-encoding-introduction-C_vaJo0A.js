var e=`---
title: Chunked Encoding 分塊編碼介紹與 Nginx 設定教學
description: "說明 HTTP/1.1 Chunked Encoding 分塊編碼（分塊傳輸）的運作原理與優點，包括 Transfer-Encoding: chunked 的使用時機，並示範如何在 Nginx 反向代理設定中開啟 chunked_transfer_encoding，以及如何用開發者工具驗證回應是否啟用分塊傳輸。"
date: 2023-04-26
category: 後端開發
tags: [HTTP, Nginx, Chunked Encoding, 網路傳輸]
readingTime: 4 分鐘
image: /images/tech/hero_chunked-encoding-introduction.webp
imageAlt: HTTP Chunked Encoding 分塊傳輸概念示意圖
---


# Chunked Encoding 分塊編碼介紹與 Nginx 設定教學

Chunked Encoding（分塊編碼）是 HTTP/1.1 中的一種傳輸編碼方式，能把回應主體切成多個塊（chunks）依序送出，讓伺服器在不知道內容總大小的情況下就開始傳輸。這篇文章整理分塊編碼的工作原理、適用場景，以及如何在 Nginx 反向代理設定中正確開啟它，並驗證回應是否真的啟用了分塊傳輸。

## 什麼是 Chunked Encoding？它解決什麼問題？

Chunked encoding（分塊編碼）是一種 HTTP/1.1 協議中的傳輸編碼方式，用於將 HTTP 訊息主體分成多個塊（chunks），以便在網路上進行有效傳輸。分塊編碼主要用於動態生成的內容，以及在事先不知道內容大小的情況下傳輸資料。

要使用分塊編碼，伺服器需要在 HTTP 回應頭中設置 \`Transfer-Encoding\` 欄位為 \`chunked\`。這告訴客戶端，接收到的資料將使用分塊編碼格式。

分塊編碼的主要優點是允許伺服器在不知道最終內容大小的情況下開始傳輸資料。這對於動態生成的內容、即時資料流和大檔案傳輸非常有用。此外，分塊編碼還可以實現資料的即時壓縮和傳輸，從而提高傳輸效率。

## Chunked Encoding 的工作原理是什麼？

分塊編碼的傳輸流程如下：

1. 伺服器將 HTTP 訊息主體分成多個大小可變的塊。每個塊由兩部分組成：塊大小（十六進制表示）和實際資料。
2. 每個塊都以塊大小開頭，然後是一個回車換行符（CRLF），接著是實際資料。在每個塊的資料之後，還有另一個回車換行符（CRLF）。
3. 資料傳輸完成後，伺服器會發送一個大小為 0 的塊，表示資料已經全部傳輸完畢。接著，伺服器可以選擇性地傳輸附加的 HTTP 標頭，以提供更多關於已傳輸資料的資訊。
4. 客戶端接收到分塊編碼的資料後，將各個塊重新組合成完整的 HTTP 訊息主體。

## 如何設定 Nginx 以支援 Chunked Encoding？

以下是一個簡單的 \`nginx.conf\` 範例，用於支援在 \`http://127.0.0.1/live\` 下的檔案開啟 chunked encoding。此設定檔會將請求代理到後端應用伺服器（例如：Node.js、Python 或其他後端應用）進行處理。請注意，這裡假設後端應用伺服器已經正確設定並支援分塊編碼。

\`\`\`nginx
http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    keepalive_timeout  65;

    gzip  on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_types text/plain text/css text/javascript application/json application/javascript application/x-javascript application/xml application/xml+rss;

    server {
        listen       80;
        server_name  127.0.0.1;

        location / {
            root   /usr/share/nginx/html;
            index  index.html index.htm;
        }

        location /live {
            proxy_pass http://backend:3000; # 請將 "backend" 替換為您的後端應用伺服器地址（IP 或 域名），並將 "3000" 替換為您的後端應用伺服器的連接埠

            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            proxy_http_version 1.1;
            proxy_set_header Connection "";
            chunked_transfer_encoding on;
        }

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   /usr/share/nginx/html;
        }
    }
}
events {
    worker_connections  1024;
}
\`\`\`

這個設定檔將 Nginx 設置為代理位於 \`http://127.0.0.1/live\` 的請求，並將請求轉發到後端應用伺服器。在 \`location /live\` 部分，使用 \`chunked_transfer_encoding on;\` 指令開啟分塊編碼。

## 如何觀察檔案傳輸是否有啟用 Chunked Encoding？

我們可以從伺服器的回應標頭看到這個伺服器的檔案傳輸是否有支援 Chunked Encoding，如下圖——在開發者工具的 Response Headers 中可以看到 \`Transfer-Encoding: chunked\`：

![瀏覽器開發者工具顯示伺服器回應標頭 Transfer-Encoding: chunked 的截圖](/images/articles/chunked-encoding-introduction-1.webp)

## 常見問題

### Chunked Encoding 和 Content-Length 有什麼差別？

一般 HTTP 回應會用 \`Content-Length\` 標明主體的總長度；但動態內容或串流在傳輸時還不知道總大小，此時可改用 \`Transfer-Encoding: chunked\`，把資料切成多塊依序送出，最後以一個大小為 0 的塊結尾。

### 哪些情境適合使用 Chunked Encoding？

動態生成的內容、即時資料流、大檔案傳輸等事先無法得知內容大小的情境都適合。分塊傳輸也能搭配 gzip 做邊壓縮邊傳輸，提高傳輸效率。

### Nginx 反向代理時要怎麼開啟 chunked transfer encoding？

在對應的 \`location\` 區塊中加上 \`chunked_transfer_encoding on;\`，並設定 \`proxy_http_version 1.1;\` 與 \`proxy_set_header Connection "";\` 以啟用 HTTP/1.1 長連接，分塊編碼才能正確運作。

### 怎麼確認伺服器回應有啟用 Chunked Encoding？

打開瀏覽器開發者工具的 Network 面板，查看回應標頭中是否出現 \`Transfer-Encoding: chunked\`；有出現即代表該回應採用分塊編碼傳輸。

## 參考資料

- [NGINX 官方文件：ngx_http_core_module（chunked_transfer_encoding）](https://nginx.org/en/docs/http/ngx_http_core_module.html#chunked_transfer_encoding)
- 本文整理自個人實作筆記。

## 延伸閱讀

- [網路概念模型：OSI 七層與 TCP/IP 四層完整對照](/post/network-concept-model)：同樣聚焦 HTTP，可接著比較不同情境的做法。
- [Nginx 基礎設定教學：安裝、設定檔檢查與反向代理入門](/post/nginx-basic-configuration)：同樣聚焦 Nginx，可接著比較不同情境的做法。
- [網路概念模型介紹：OSI 七層與 TCP/IP 四層差異、應用與封包傳送流程](/post/network-concept-model)：同樣聚焦 HTTP，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2023-04-26，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};