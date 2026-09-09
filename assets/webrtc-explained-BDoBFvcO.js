var e=`---
title: 什麼是 WebRTC？瀏覽器間即時通訊的運作原理
description: 說明 WebRTC 的 SDP、ICE、STUN/TURN、RTP 與信令伺服器如何協作，建立瀏覽器間的點對點即時通訊。
date: 2023-04-07
category: 後端開發
tags: [WebRTC, 即時通訊, STUN, TURN, 音視訊串流]
readingTime: 6 分鐘
image: /images/tech/hero_webrtc-explained.webp
imageAlt: 伺服器機櫃上的網路配線與交換器面板，象徵節點間的即時資料傳輸
---


# 什麼是 WebRTC？瀏覽器間即時通訊的運作原理

WebRTC（Web Real-Time Communication）是一套讓瀏覽器之間不必安裝外掛就能直接交換即時音訊、視訊與資料的協議與 API 集合。Chrome、Firefox、Safari、Opera 等主流瀏覽器都已支援，這也是視訊會議、直播互動這類低延遲應用能夠直接跑在網頁裡的原因。

這篇整理翻譯並重新拆解自 Ant Media 的技術文章 [What is WebRTC and how does it work?](https://antmedia.io/what-is-webrtc-and-how-webrtc-works/)，把原文對各元件的說明按 client-A / client-B 的實際互動順序重新梳理一次。

## WebRTC 由哪些元件組成？

WebRTC 建立一條點對點連線，需要五個元件互相配合：SDP 負責交換雙方支援的編碼格式，ICE 負責找出可用的連線路徑，STUN 和 TURN 負責穿透 NAT 與防火牆，RTP 負責實際搬運音視訊資料，signaling server 則負責在雙方之間傳遞前面這些協商用的訊息。少了任何一環，瀏覽器都無法直接建立連線。

以下用 client-A 和 client-B 兩端通訊的情境，依序說明每個元件實際在做什麼。

## SDP 如何讓兩端瀏覽器談妥共同的編碼格式？

SDP（Session Description Protocol）是一個以純文字字串描述的協議,用來讓雙方交換各自支援的媒體編碼器。過程是這樣的：

- client-A 產生自己的 SDP（稱為 offer），存成本地 SDP，再透過 signaling server 傳給 client-B。
- client-B 收到後存成遠端 SDP。
- client-B 產生自己的 SDP（稱為 answer），存成本地 SDP，回傳給 client-A。
- client-A 收到後存成遠端 SDP。

舉例來說，如果 client-A 支援 H264、VP8、VP9 做視訊編碼，Opus 和 PCM 做音訊編碼，而 client-B 只支援 H264 和 Opus，兩邊最終就會選用雙方都支援的 H264 加 Opus。如果雙方完全沒有共同的編碼器，這段點對點通訊就建立不起來——這也是為什麼 SDP 協商必須在傳輸媒體資料之前完成。

## ICE、STUN、TURN 如何幫瀏覽器穿透 NAT 建立連線？

多數裝置都躲在 NAT 或防火牆後面，彼此看不到對方的真實網路位址，這正是 ICE（Interactive Connectivity Establishment）要解決的問題：在兩個節點之間找出一條盡可能直接的連線路徑。ICE 本身依賴兩種輔助技術：

| 技術 | 作用 |
|---|---|
| STUN（Session Traversal Utilities for NAT） | 讓每一端得知自己的公網 IP 位址與本地 IP 位址 |
| TURN（Traversal Using Relays around NAT） | 當直接連線行不通時，透過中繼伺服器轉送資料 |

以我們常用的家用網路為例：電腦在區域網路內通常有一個像 192.168.0.x 的本地位址，但連上 [whatismyip.com](https://www.whatismyip.com/) 看到的會是另一個位址——那其實是路由器或數據機對外的公網 IP。STUN 伺服器的工作,就是讓對等端知道自己同時擁有的這兩種位址。Google 本身就提供一個公開的免費 STUN 伺服器：\`stun.l.google.com:19302\`。

實際流程如下：

1. client-A 透過 STUN 伺服器查出自己的本地與公網位址，經由 signaling server 傳給 client-B。每一個從 STUN 伺服器拿到的位址都稱為一個 ICE candidate。
2. client-B 做同樣的事，把自己的位址透過 signaling server 傳給 client-A。
3. client-A 收到 client-B 的位址清單後，逐一發送測試性的 ping，記錄每個位址的回應與延遲，再從中挑出表現最好的一個。
4. client-B 對 client-A 的位址做同樣的測試與挑選。

如果雙方所在的 NAT 類型不允許直接建立連線——這在企業防火牆或某些對稱型 NAT 環境下並不少見——STUN 拿到的位址就無法用來打通連線，這時資料會改由 TURN 伺服器中繼轉送。TURN 可以理解成 STUN 的延伸：STUN 只負責「告知位址」，TURN 則在直連失敗時親自幫忙轉送封包，代價是多一段中繼延遲。

## RTP 如何在 WebRTC 裡傳輸音視訊資料？

RTP（Real-time Transport Protocol）是建立在 UDP 之上、專門用來傳輸即時媒體資料的成熟協議，WebRTC 的音訊與視訊都透過 RTP 傳送。它有一個姊妹協議 RTCP（RTP Control Protocol），負責在傳輸過程中回報服務品質（QoS）相關的統計資訊。RTSP（Real Time Streaming Protocol）這類串流協議底層同樣仰賴 RTP 搬運資料。

## Signaling server 在 WebRTC 架構中扮演什麼角色？

Signaling server 是 WebRTC 規格裡唯一沒有標準化的部分，但少了它,前面提到的 SDP 交換與 ICE candidate 傳遞根本無從發生。它的工作是在 client-A 與 client-B 之間傳遞 SDP 字串和 ICE candidate,並決定哪些對等端該互相連線。多數實作會選擇 WebSocket 來實作這段通訊，因為它天生支援伺服器與瀏覽器之間的雙向即時推送。

下圖是這五個元件之間的互動關係示意（來源:Ant Media 原文配圖）：

![WebRTC 中 client、signaling server 與 SDP/ICE 交換流程示意圖](/images/tech/webrtc-peers-diagram.webp)

## 常見問題

### WebRTC 一定需要 TURN 伺服器嗎？

不一定。如果雙方能透過 STUN 取得的位址直接建立連線，就不需要 TURN 中繼。但企業網路或對稱型 NAT 環境下,直連常會失敗，這時就得靠 TURN 伺服器轉送，所以正式環境通常會同時準備 STUN 和 TURN 兩種伺服器。

### Signaling server 一定要用 WebSocket 嗎？

不是硬性規定,只是業界慣例。WebRTC 規格本身沒有定義 signaling 該用什麼協議，只要能可靠地在雙方之間傳遞 SDP 與 ICE candidate 訊息,用 HTTP 輪詢或其他即時通訊機制理論上也做得到，只是 WebSocket 的雙向推送特性最適合這個場景。

### 為什麼有時候瀏覽器之間就是連不上？

最常見的原因是雙方沒有共同支援的編碼器（SDP 協商失敗），或雙方所在的 NAT 類型太嚴格導致 STUN 找到的位址無法直連,又剛好沒有設定 TURN 伺服器可以中繼。檢查這兩點通常能定位問題。

## 參考資料
WebRTC.org 官方文件，Getting started with WebRTC，說明 RTCPeerConnection、媒體擷取與點對點連線建立方式，存取日期：2026-08-27。[https://webrtc.org/getting-started/overview](https://webrtc.org/getting-started/overview)

## 延伸閱讀

- [WebRTC 點對點特性帶來的複雜性：NAT 穿透、信令與連線穩定性解析](/post/webrtc-p2p-complexity)：同樣聚焦 WebRTC、STUN，可接著比較不同情境的做法。
- [串流的網路概念：FFmpeg、WebRTC 與 SRT 在 OSI 模型中的定位](/post/streaming-network-concepts)：同樣聚焦 WebRTC，可接著比較不同情境的做法。
- [Engine.io 介紹](/post/engine-io-introduction)：同樣聚焦 即時通訊，可接著比較不同情境的做法。
`;export{e as default};