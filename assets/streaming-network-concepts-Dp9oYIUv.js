var e=`---
title: 串流的網路概念：FFmpeg、WebRTC 與 SRT 在 OSI 模型中的定位
description: 串流的網路概念整理：從 FFmpeg 在 OSI 模型的定位、HTTP 與 WebSocket 的握手差異，到 WebRTC 的 RTP、STUN/TURN/ICE 協定架構，以及 SRT 如何在 UDP 上實現可靠又低延遲的視訊串流傳輸，幫你建立即時影音串流服務架構設計所需的網路基礎觀念，是串流工程入門的第一課。
date: 2022-08-02
category: 後端開發
tags: [串流, FFmpeg, WebRTC, SRT, 網路協定]
readingTime: 6 分鐘
image: /images/tech/hero_streaming-network-concepts.webp
imageAlt: 串流網路協定架構示意圖，包含 FFmpeg、WebRTC 與 SRT 在 OSI 模型中的層次定位
---


# 串流的網路概念：FFmpeg、WebRTC 與 SRT 在 OSI 模型中的定位

這篇文章整理串流技術涉及的網路概念：FFmpeg 在 OSI 模型中扮演什麼角色、HTTP 與 WebSocket 的握手差異、WebRTC 為什麼是跨層技術，以及 SRT 協定如何在 UDP 上做到可靠又低延遲的視訊傳輸。讀完可以建立起串流協定的整體網路架構觀念。

## FFmpeg 屬於 OSI 模型的哪一層？

FFmpeg 是一個應用程式工具，主要功能包括讀取、解碼、編碼、轉碼、重新封裝、串流等各種視頻和音頻格式。這種應用程式大多數情況下被認為是在**應用層（Application Layer）**。

然而，如果從數據表示、編碼和轉換的角度來看，也可以說 FFmpeg 做的工作涉及到**表示層（Presentation Layer）**的部分功能。例如，它會解碼影片檔案（從一種表現形式轉換為另一種），並將其轉換為對應的像素和音頻資料。

若是使用 FFmpeg 讀取 HTTP-FLV 的串流，HTTP-FLV 協議主要是在應用層工作，而接收端的應用程序（例如媒體播放器）則在應用層和表示層之間工作，負責解封裝和解碼接收到的數據。

## HTTP 和 WebSocket 的握手過程有什麼不同？

HTTP 協議的握手過程通常包括客戶端發送一個請求到伺服器，然後伺服器回應這個請求。這種請求/回應模式構成了 HTTP 的基本交互模式。

而 WebSocket 協議的握手過程稍微有些不同。WebSocket 的握手過程基於 HTTP，一開始由客戶端發送一個 HTTP 升級請求到伺服器。如果伺服器接受這個升級請求，它會回應一個升級的回應，此時連接就會從 HTTP 轉變為 WebSocket。然後這個 WebSocket 連接就可以用來做全雙工的通訊，直到一方選擇關閉連接為止。

這些握手過程都是在應用層進行的，並且直接涉及到最終的應用程序（例如網頁瀏覽器或者 Web 伺服器）的行為。

## WebRTC 為什麼是跨層次的網路技術？

WebRTC（Web Real-Time Communications）是一種用於網頁瀏覽器的 P2P（Peer-to-Peer，即點對點）通訊技術。它可以讓網頁瀏覽器直接與另一個網頁瀏覽器進行實時的音視頻通訊，不需要中間的伺服器轉發。

WebRTC 在 OSI 模型中的定位並不容易確定，因為它實際上涉及到了多個 OSI 層次：

- WebRTC 使用了 RTP（Real-time Transport Protocol，實時傳輸協議）來傳輸音視頻數據，RTP 通常被認為是在傳輸層（第四層）。
- WebRTC 還需要用到 STUN/TURN/ICE 這些協議來進行 NAT 穿透和對等節點的發現，這些協議也工作在傳輸層。
- WebRTC 最終的實際應用（例如在網頁瀏覽器中進行音視頻通話）則是在應用層（第七層）。

所以，我們不能簡單地說 WebRTC 屬於 OSI 模型的某一個層次。相反，我們可以說 WebRTC 是一種跨層次的技術，它涉及到了 OSI 模型中的多個層次。這也再次顯示了 OSI 模型在實際應用中的限制，並非所有的網路技術都能夠簡單地映射到 OSI 的七個層次中。

## WebRTC 用到哪些協議？

WebRTC 是一個開放標準，允許通過網頁進行實時通信（RTC）。它使用一系列的協議和技術來實現這一點，關鍵部分包括：

1. **RTP（實時傳輸協議）**：用於媒體數據（例如音頻和視頻）的傳輸，通常基於 UDP。
2. **STUN/TURN/ICE**：這些協議和技術用於 NAT 穿透和對等節點發現。STUN 和 TURN 伺服器協助 WebRTC 節點找到彼此並建立直接連接。TURN 伺服器可以在需要時中轉數據，可能使用 TCP 或 UDP。
3. **信令**：WebRTC 本身不規定信令協議。信令用於在通信的兩個端點之間交換元信息，例如呼叫設置、能力協商等。這可以通過各種方式實現，例如使用 WebSocket、HTTP 或其他協議，通常基於 TCP。

所以，WebRTC 使用了多個協議，其中一些是基於 UDP 的（如 RTP 和某些 TURN 場景），而其他一些可能是基於 TCP 的（如信令或當 TURN 使用 TCP 時）。

![WebRTC 協定架構圖：左邊為 TCP 上的 Signal 應用，右邊為 UDP 上的串流應用](/images/articles/streaming-network-concepts-1.webp)

上圖展示了整個 WebRTC 所運用的協定架構，左邊（TCP）為 Signal 應用，右邊（UDP）為串流應用，協定堆的搭配使用，補足彼此的不足。這裡主要專注在串流應用（右邊）上的協定，為 WebRTC 提供了哪些功能。

## SRT 協定是什麼？為什麼適合高品質視訊串流？

SRT（Secure Reliable Transport）是一種基於 UDP 的開源傳輸協定，由 Haivision 公司發起並由 SRT 聯盟持續開發。它的主要目的是優化在公共網路（如互聯網）上進行高品質視訊串流的性能。

SRT 旨在解決在廣播等高品質視訊串流場景下，對於低延遲、丟包率低的傳輸要求。它在 UDP 之上實現了數據包重傳機制，並且加入了 AES 加密，以確保傳輸的安全性。此外，SRT 還提供了一個預測網路傳輸性能的機制（稱為「SRT 預測模型」），該模型可動態調整傳輸參數，以優化傳輸性能並減少延遲。

因此，SRT 協定將 UDP 的低延遲特性與 TCP 的可靠傳輸特性相結合，旨在在公共網路上提供一種安全、可靠、低延遲的視訊傳輸解決方案。這使得它在如廣播、遠程生產和 OTT 串流等領域中得到了廣泛應用。

SRT 加入了一些特性來強化它的穩定性和效能，這使得它能夠對傳輸過程進行更細膩的控制，同時也提供了比 TCP 更低的延遲。這些特性包括：

1. 數據包重傳：如果檢測到數據包丟失，SRT 會嘗試重新傳輸這些丟失的數據包，這樣就可以保證數據的完整性。
2. 端到端的安全性：SRT 支持數據加密，確保數據在傳輸過程中的安全性。
3. 低延遲：相比 TCP，UDP 的傳輸延遲更低，這使得 SRT 更適合實時或近實時的視訊串流。

## 為什麼 SRT 通常無法直接在網頁上播放？

SRT 通常不直接在網頁上播放的原因是它使用 UDP 作為傳輸協定：

1. **協議支援**：瀏覽器通常支援的協議，如 HTTP 和 WebSocket，是基於 TCP 的。這些協議被廣泛用於 Web 應用程序中，因為它們提供了可靠的連接和內建的流控制。由於 SRT 是基於 UDP 的，它不是瀏覽器原生支援的協議之一。
2. **UDP 的限制**：UDP 不保證資料包的到達順序或可靠性。SRT 在此基礎上增加了一些特性來改善這些問題，但這並不意味著它可以直接在所有客戶端上使用。瀏覽器可能因安全和可靠性的考量而限制或不支援 UDP 流量。
3. **轉碼和轉封裝**：為了在網頁上播放 SRT 流，可能需要額外的伺服器組件來轉碼或轉封裝流為瀏覽器支援的格式，例如 HLS 或 MPEG-DASH。這可能增加了複雜性和延遲。
4. **安全性考量**：網頁的安全模型可能限制了直接使用 UDP 的能力。WebRTC 是一個允許網頁使用 UDP 的技術，但即使如此，它也需要符合特定的安全和隱私要求。

## 常見問題

### FFmpeg 到底屬於應用層還是表示層？

兩者都有涉及。作為處理音視頻格式的工具，它被歸類在應用層；但從解碼、格式轉換的角度來看，它做的事情橫跨了表示層（Presentation Layer）的部分功能。

### WebRTC 是單一協定嗎？

不是。WebRTC 是一組協議和技術的組合，包括 RTP（媒體傳輸）、STUN/TURN/ICE（NAT 穿透與節點發現）以及信令機制，各自工作在不同的 OSI 層次上。

### SRT 和 TCP 有什麼差別？

SRT 建立在 UDP 之上，透過數據包重傳與 AES 加密達到接近 TCP 的可靠性，同時保有 UDP 的低延遲特性，更適合廣播與 OTT 串流等即時場景。

### 網頁可以播 SRT 串流嗎？

瀏覽器原生不支援 UDP 上的 SRT，通常需要中間伺服器把 SRT 轉封裝為 HLS 或 MPEG-DASH 等瀏覽器支援的格式才能播放。

## 參考資料

- [Haivision SRT 官方說明](https://www.haivision.com/products/srt-secure-reliable-transport/)
- 本文其餘內容整理自個人實作筆記。

## 延伸閱讀

- [TCP/UDP 協議中的串流協定整理：RTP、RTSP、SRT、QUIC、RTMP 與 HLS](/post/tcp-udp-streaming-protocols)：同樣聚焦 串流、WebRTC，可接著比較不同情境的做法。
- [AV1 影片編碼介紹：高壓縮比、WebRTC 與影音格式比較](/post/av1-video-codec-introduction)：同樣聚焦 WebRTC、FFmpeg，可接著比較不同情境的做法。
- [什麼是 WebRTC？瀏覽器間即時通訊的運作原理](/post/webrtc-explained)：同樣聚焦 WebRTC，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2022-08-02，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};