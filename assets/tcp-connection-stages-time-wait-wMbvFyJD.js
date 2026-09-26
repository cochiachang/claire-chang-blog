var e=`---
title: TCP連線階段與TIME_WAIT意義
description: TCP協定分為連接建立、資料傳送、連接終止三個階段。完整解析 three-way handshake 與 four-way handshake、TCP 狀態碼（LISTEN、ESTABLISHED、TIME_WAIT 等），以及伺服器出現大量 TIME_WAIT 連線的原因與解法。
date: 2020-03-01
category: 後端開發
tags: [TCP, 網路基礎, TIME_WAIT, three-way handshake, Linux]
readingTime: 4 分鐘
image: /images/tech/hero_tcp-connection-stages-time-wait.webp
imageAlt: 伺服器機房中的網路線與交換器，象徵 TCP 連線的建立與終止
---


# TCP連線階段與TIME_WAIT意義

TCP 協定的執行可劃分為三個階段：**連接建立（connection establishment）、資料傳送（data transfer）和連接終止（connection termination）**。理解這三個階段與對應的 TCP 狀態碼，是排查伺服器連線問題（例如大量 TIME_WAIT）的基礎。

## TCP 如何建立連線？three-way handshake 是什麼？

TCP 用三路握手（或稱三次握手，three-way handshake）過程建立一個連接。在連接建立過程中，很多參數要被初始化，例如序號被初始化以保證按序傳輸和連接的強壯性。

![TCP 三路握手過程：SYN、SYN+ACK、ACK 三個步驟](/images/articles/tcp-connection-stages-time-wait-2.webp)

## TCP 如何傳送資料？

主機收到一個 TCP 包時，**用兩端的 IP 位址與埠號來標識這個 TCP 包屬於哪個 session**。在 TCP 的資料傳送狀態，很多重要的機制（如序號、確認重傳、流量控制）保證了 TCP 的可靠性和強壯性。

## TCP 如何終止連線？four-way handshake 與 TIME_WAIT

連接終止使用了四路握手過程（或稱四次握手，four-way handshake），在這個過程中連接的每一側都獨立地被終止。當一個端點要停止它這一側的連接，就向對側傳送 FIN，對側回覆 ACK 表示確認。因此，拆掉一側的連接過程需要一對 FIN 和 ACK，分別由兩側端點發出。

![TCP 連線關閉的四路握手過程與 TIME_WAIT 狀態](/images/articles/tcp-connection-stages-time-wait-3.webp)

![TCP 連線關閉階段的狀態轉移（CLOSE_WAIT 與 LAST_ACK）](/images/articles/tcp-connection-stages-time-wait-4.webp)

## TCP 狀態碼一覽表

下表為 TCP 狀態碼列表，以 S 指代伺服器，C 指代客戶端，S&C 表示兩者，S/C 表示兩者之一：

| 狀態碼 | 端點 | 意義 |
| --- | --- | --- |
| \`LISTEN\` | S | 伺服器等待從任意遠端 TCP 埠的連接請求。偵聽狀態。 |
| \`SYN-SENT\` | C | 客戶端在傳送連接請求後等待匹配的連接請求。透過 connect() 函式向伺服器發出一個同步（SYN）訊號後進入此狀態。 |
| \`SYN-RECEIVED\` | S | 伺服器已經收到並回送同步（SYN）訊號之後等待確認（ACK）請求。 |
| \`ESTABLISHED\` | S&C | 伺服器與客戶的連接已經開啟，收到的資料可以傳送給用戶。資料傳輸步驟的正常情況。此時連接兩端是平等的，稱作全連接。 |
| \`FIN-WAIT-1\` | S&C | 主動關閉端呼叫 close() 函式發出 FIN 請求包，表示本方的資料傳送全部結束，等待 TCP 連接另一端的 ACK 確認包或 FIN&ACK 請求包。 |
| \`FIN-WAIT-2\` | S&C | 主動關閉端在 FIN-WAIT-1 狀態下收到 ACK 確認包，進入等待遠端 TCP 連接終止請求的半關閉狀態。這時可以接收資料，但不再傳送資料。 |
| \`CLOSE-WAIT\` | S&C | 被動關閉端接到 FIN 後，就發出 ACK 以回應 FIN 請求，並進入等待本地用戶的連接終止請求的半關閉狀態。這時可以傳送資料，但不再接收資料。 |
| \`CLOSING\` | S&C | 在發出 FIN 後，又收到對方發來的 FIN，進入等待對方對己方連接終止（FIN）的確認（ACK）的狀態。少見。 |
| \`LAST-ACK\` | S&C | 被動關閉端全部資料傳送完成之後，向主動關閉端傳送 FIN，進入等待確認包的狀態。 |
| \`TIME-WAIT\` | S/C | 主動關閉端接收到 FIN 後，就傳送 ACK 包，等待足夠時間以確保被動關閉端收到了終止請求的確認包。按照 RFC 793，一個連接可以在 TIME-WAIT 保持最多四分鐘，即最大分段壽命（MSL，maximum segment lifetime）的 2 倍。 |
| \`CLOSED\` | S&C | 完全沒有連接。 |

完整的 TCP 狀態轉移圖可參考 Wikimedia 上的 TCP state diagram：

![TCP 狀態圖（Wikimedia）](https://upload.wikimedia.org/wikipedia/commons/f/f6/Tcp_state_diagram_fixed_new.svg)

## 伺服器出現大量 TIME_WAIT 連線怎麼辦？

根據 TCP 協定定義的斷開連接規定，發起 socket 主動關閉的一方會進入 TIME_WAIT 狀態，TIME_WAIT 狀態將持續 2 個 MSL（Max Segment Lifetime），在 Windows 下預設為 4 分鐘（240 秒）。TIME_WAIT 狀態下的 socket 不能被立即回收使用。

具體現象是：對於一個處理大量短連接的伺服器，如果是由伺服器主動關閉客戶端的連接，將導致伺服器端存在大量處於 TIME_WAIT 狀態的 socket，甚至比處於 ESTABLISHED 狀態下的 socket 多得多，嚴重影響伺服器的處理能力，甚至耗盡可用的 socket 而停止服務。

暫時解決的方式是縮短系統預設的 TIME_WAIT 時間（例如 Linux 下調整 \`tcp_fin_timeout\` 或開啟 \`tcp_tw_reuse\`）。以長時間來講，則應該檢查程式是否有不正常未將連線正常關閉的狀況，以修改程式來避免此狀況才是根本之道。

## 常見問題

### TCP 連線建立為什麼需要三次握手，而不是兩次？

第三次握手（ACK）用來確認客戶端收到了伺服器的 SYN+ACK，同時讓雙方的初始序號都被確認。只有兩次握手的話，伺服器無法確認客戶端能收到自己的封包，容易產生半開連接。

### TIME_WAIT 狀態是誰會進入的？

只有**主動關閉**連線的一方會進入 TIME_WAIT。它的目的是確保最後一個 ACK 能送達對方，並讓網路上殘留的舊封包過期，避免污染下一個使用相同埠號的連線。

### TIME_WAIT 要等多久才會消失？

按照 RFC 793，TIME_WAIT 會持續 2 倍 MSL（maximum segment lifetime），Windows 預設 4 分鐘（240 秒），Linux 常見為 60 秒左右，之後連線轉為 CLOSED 並釋放資源。

### 伺服器出現大量 TIME_WAIT 是誰的問題？

通常是「伺服器主動關閉連線」造成的，常見於短連接密集的服務。短期可調整核心參數（如 \`tcp_tw_reuse\`、\`tcp_fin_timeout\`）緩解，根本解法是檢查程式是否未正確關閉連線。

## 參考資料

- [谈谈 TCP 的 TIME_WAIT](https://zhenbianshu.github.io/2018/12/talk_about_tcp_timewait.html)
- [TCP TIME_WAIT 的釋義](http://low-understated.blogspot.com/2009/03/tcp-timewait.html)
- [TCP state diagram — Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Tcp_state_diagram_fixed_new.svg)

## 延伸閱讀

- [利用 netstat 查詢連線數量（connections）](/post/netstat-connection-count)：同樣聚焦 Linux、TCP，可接著比較不同情境的做法。
- [網路概念模型：OSI 七層與 TCP/IP 四層完整對照](/post/network-concept-model)：同樣聚焦 網路基礎，可接著比較不同情境的做法。
- [網路概念模型介紹：OSI 七層與 TCP/IP 四層差異、應用與封包傳送流程](/post/network-concept-model)：同樣聚焦 網路基礎，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2020-03-01，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};