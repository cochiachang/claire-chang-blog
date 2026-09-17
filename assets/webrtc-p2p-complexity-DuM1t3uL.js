var e=`---
title: "WebRTC 點對點特性帶來的複雜性：NAT 穿透、信令與連線穩定性解析"
description: "WebRTC 以點對點（P2P）架構實現低延遲即時通訊，但也帶來 NAT 穿透、信令伺服器、連線穩定性三大複雜性。本文解析 ICE、STUN、TURN 運作原理，以及 WebRTC 不適合大規模直播的原因與替代方案。"
date: 2024-09-23
category: 前端開發
tags: [WebRTC, NAT穿透, ICE, STUN, 即時通訊]
readingTime: 9 分鐘
image: /images/tech/hero_webrtc-p2p-complexity.webp
imageAlt: "WebRTC 點對點即時通訊架構示意圖"
---


# WebRTC 點對點特性帶來的複雜性：NAT 穿透、信令與連線穩定性解析

WebRTC 以點對點（P2P）架構實現瀏覽器間的低延遲即時音視訊通訊，但這個特性也帶來了 NAT 穿透、信令伺服器與連線穩定性三大工程複雜性。本文解析 ICE、STUN、TURN 的運作原理，說明為什麼 WebRTC 不適合大規模直播，以及在哪些情境下應該改用其他方案。

## WebRTC 是什麼？為什麼它的低延遲特性如此重要？

WebRTC（Web Real-Time Communication）是一種開源技術，允許瀏覽器和行動應用程式進行音訊、視訊和資料的即時通訊。它能在瀏覽器內直接進行音視訊通話，無需安裝任何插件或額外軟體，大大簡化了使用者的操作。

WebRTC 支援多種平台，包括 Web、Android、iOS、Windows、macOS 和 Linux。它的延遲非常低，這對於需要即時反應的應用場景（如視訊會議、線上遊戲等）非常重要。

## WebRTC 的關鍵技術與架構包含哪些層次？

![WebRTC 架構圖](/images/articles/webrtc-p2p-complexity-1.webp)

參考資料：[WebRTC Architecture](https://webrtc.github.io/webrtc-org/architecture/)

WebRTC 的架構分為兩個主要層次：一層是針對瀏覽器開發者的 WebRTC C++ API，另一層是針對網路應用開發者的 Web API。

WebRTC 支援的音訊與影像引擎具備多種功能，包括：

- 各種音訊編解碼器（如 iSAC、iLBC、Opus）
- 回音消除（AEC）、降噪（NR）
- 影像編解碼器（如 VP8）
- 影像抖動緩衝（Video Jitter Buffer）與畫面增強

除此之外，WebRTC 的傳輸與會話層包含 RTP 網路層、STUN/ICE 用於網路連線建立，以及抽象的會話管理層，讓應用開發者可自行選擇協議實作方式。

## WebRTC 的技術目標與限制是什麼？

WebRTC 的目標是打造一個強大的端對端即時通訊平台，讓開發者能創建豐富的即時多媒體應用，並能在不同的網頁瀏覽器及平台上執行。

WebRTC 利用點對點（P2P）的 UDP 傳輸來實現低延遲的資料流傳輸。然而，由於網路環境中的 NAT（Network Address Translation）和防火牆的存在，直接的 P2P 連接可能會受到限制。因此，WebRTC 使用 **ICE 框架來解決 NAT 穿透問題**。

## WebRTC 如何透過 ICE、STUN、TURN 實現 NAT 穿透？

NAT 穿透技術是 WebRTC 實現點對點（P2P）通信的關鍵。如果 NAT 穿透失敗，就無法建立直接的 P2P 連線，這會影響通信的品質和延遲。WebRTC 主要使用三種技術：

| 技術 | 全名 | 作用 |
|------|------|------|
| ICE | Interactive Connectivity Establishment | 整合 STUN 和 TURN 的框架，確保端點之間的連接 |
| STUN | Session Traversal Utilities for NAT | 取得 NAT 後設備的公共 IP，實現 UDP 打洞以建立直接 P2P 連接 |
| TURN | Traversal Using Relays around NAT | 當 STUN 失敗時，提供中繼伺服器轉發資料流，確保通信可靠性 |

即使有了這些協議，WebRTC 在某些情況下仍無法達到 100% 的網路穿透性，特別是在某些複雜的網路環境中：

- **無法建立 P2P 連線就無法播放串流**：即使 TURN 伺服器能夠建立連接，由於資料需要通過中繼伺服器轉發，會增加通信延遲，影響用戶體驗。
- **頻寬成本增加**：使用 TURN 伺服器會增加網路頻寬消耗，因為所有資料都需要通過中繼伺服器轉發，這對高流量的應用來說是一大挑戰。

相比之下，基於 HTTP 的協議如 HLS 更具普遍性和 CDN 支援，但延遲較高。

## 哪些情境不適合使用 WebRTC？

- **大規模廣播**：WebRTC 的點對點架構非常適合小規模的通訊，但當需要大規模的多人廣播或直播時，WebRTC 效率較低，因為它需要每個用戶單獨建立連線，會消耗大量的網路頻寬和資源。
- **資料存儲與回放**：WebRTC 主要設計用於即時通訊，不適合處理錄製和回放功能。如果需要錄製通訊內容，還需結合其他伺服器端解決方案來存儲和管理這些資料。
- **多媒體品質保證**：WebRTC 的多媒體傳輸受限於網路環境，無法完全保證高品質的影像和音訊。若需要穩定且高畫質的多媒體傳輸，可能需要更專業的解決方案。

## 為什麼 WebRTC 不適合大規模直播？

WebRTC 雖然適合小規模通信（1-4 名參與者），但在大規模應用時需要後端基礎設施的支持。

這是因為 WebRTC 主要設計用於點對點（P2P）通信，這意味著它在處理大規模直播時會遇到性能瓶頸。當用戶數量超過一定範圍時，WebRTC 的效能會顯著下降，並且需要額外的媒體伺服器（如 MCU 或 SFU）來中繼和分發流量。

關於如何利用中繼點來避免效能瓶頸問題，可以參考這篇文章：[WebRTC Architectures: Advantages & Limitations](https://medium.com/agora-io/webrtc-architectures-advantages-limitations-7016b666e1ae)

## WebRTC 點對點特性帶來哪三大複雜性？

### 1. NAT 穿透（NAT Traversal）

**NAT（Network Address Translation，網路地址轉換）** 是大多數家庭路由器或公司防火牆使用的技術，用來讓多個設備共享一個公共 IP 地址，並同時保護內網免受外部未經授權的訪問。

WebRTC 是點對點的協議，兩個終端需要直接互相通信。然而，當設備位於 NAT 後面時，直接的連線會變得困難，因為內網中的設備沒有公共 IP，無法直接被外部訪問。

**NAT 穿透技術如何運作：**

- **STUN**：STUN 伺服器幫助客戶端找到自己的公共 IP 和端口。當 WebRTC 用戶端連接到 STUN 伺服器時，伺服器會回傳用戶端的公共 IP 和端口，這些資訊可用來嘗試與另一個用戶端進行點對點連線。
- **TURN**：如果 STUN 無法成功穿透 NAT（例如某些嚴格的 NAT 或防火牆阻止了連線），TURN 伺服器會作為中繼來幫助兩個用戶端連接。TURN 實際上會中繼點對點之間的數據，但這會增加延遲和成本。
- **ICE**：ICE 用來協調和選擇最佳連線方式。它會嘗試使用 STUN 獲得公共 IP，如果 STUN 失敗則回退到 TURN 中繼伺服器。ICE 的工作原理是嘗試多種連接路徑（直接連線、STUN、TURN），然後選擇最有效的路徑。

**複雜性所在：**

- **NAT 類型差異**：不同類型的 NAT（如對稱 NAT 和全錐形 NAT）在處理穿透時行為不同，這會導致有時候明明兩個用戶端理論上能夠直接通信，卻仍需要 TURN 伺服器來中繼。
- **STUN 和 TURN 伺服器部署**：使用 WebRTC 的應用需要設置和維護 STUN 和（可能的）TURN 伺服器，這增加了基礎架構的複雜性。

### 2. 信令伺服器（Signaling Server）

WebRTC 需要在兩個用戶端之間交換連線資訊，例如 ICE 候選者、SDP（Session Description Protocol，用於交換媒體能力的協議），以協調和建立點對點的連線。這些交換必須透過一個中心伺服器進行，這個伺服器稱為**信令伺服器**。

信令本身不屬於 WebRTC 的範疇，開發者需要自行選擇或實現信令系統。信令系統可以使用任何協議，如 WebSocket、HTTP 或 WebRTC DataChannel。

**信令的功能：**

- **交換 SDP 和 ICE 資訊**：信令伺服器的主要作用是幫助兩個用戶端交換 SDP 和 ICE 資訊，以便雙方可以建立連線。
- **管理連線建立與斷開**：信令伺服器還負責管理連線的建立和斷開，例如處理 WebRTC 呼叫的邀請、接受、取消和斷開等控制訊息。

**複雜性所在：**

- **不標準化**：WebRTC 並沒有標準的信令協議，開發者需要選擇或設計一個合適的信令系統。常見的做法是使用 WebSocket 來實現即時的雙向信令通信。
- **額外伺服器需求**：信令伺服器必須在應用中持續運行，以支持每個連線的初始設置，這增加了額外的伺服器和開發成本。

### 3. 連線穩定性（Connection Stability）

由於 WebRTC 依賴點對點連線，網路條件的波動會直接影響連線的穩定性。特別是在行動設備或網路不穩定的情況下，WebRTC 連線可能會中斷或劣化。

**主要挑戰：**

- **網路切換**：如果使用者在 Wi-Fi 和行動數據網路之間切換，WebRTC 連線可能會中斷，因為 IP 地址和路由會發生變化。
- **封包丟失與延遲**：在不穩定的網路環境中（如高延遲或丟包率高的網路），WebRTC 連線的品質會受到很大影響，導致視訊或音訊卡頓、延遲增加，甚至連線斷開。
- **重連機制**：WebRTC 並沒有內建的自動重連機制，如果連線中斷，應用需要自己實現重連邏輯，這增加了實作的複雜性。

## 常見問題

### WebRTC 為什麼需要 STUN 和 TURN 伺服器？

因為大多數設備位於 NAT 或防火牆後面，沒有公共 IP，無法被直接存取。STUN 伺服器幫助客戶端取得自己的公共 IP 來建立直接 P2P 連線；當 STUN 穿透失敗時，TURN 伺服器則作為中繼轉發資料，確保通信仍能進行，但會增加延遲和頻寬成本。

### WebRTC 適合做大規模直播嗎？

不適合。WebRTC 為點對點架構設計，適合 1-4 名參與者的小規模通信；大規模直播時每個觀眾都要單獨建立連線，效能會顯著下降。若要做大規模直播，需要額外部署媒體伺服器（MCU 或 SFU），或改用 HLS 這類基於 HTTP、有 CDN 支援的協議。

### WebRTC 的信令伺服器是什麼？一定要自己架嗎？

信令伺服器負責在兩個用戶端之間交換 SDP 和 ICE 連線資訊，以協調建立 P2P 連線。WebRTC 標準並未規範信令協議，開發者需自行選擇或實作，常見做法是用 WebSocket 實現雙向信令通信，也可以使用現成的開源方案。

### WebRTC 連線不穩定時該怎麼處理？

WebRTC 沒有內建自動重連機制，連線中斷（例如 Wi-Fi 切換到行動網路）時，應用必須自己實作重連邏輯。此外可透過 ICE restart 機制嘗試在網路變化後重建連線，並在前端做好封包丟失與延遲的監控與降級提示。

## 參考資料

- [WebRTC Architecture](https://webrtc.github.io/webrtc-org/architecture/)
- [WebRTC Architectures: Advantages & Limitations（Agora.io @ Medium）](https://medium.com/agora-io/webrtc-architectures-advantages-limitations-7016b666e1ae)

## 延伸閱讀

- [什麼是 WebRTC？瀏覽器間即時通訊的運作原理](/post/webrtc-explained)：同樣聚焦 WebRTC、即時通訊，可接著比較不同情境的做法。
- [串流的網路概念：FFmpeg、WebRTC 與 SRT 在 OSI 模型中的定位](/post/streaming-network-concepts)：同樣聚焦 WebRTC，可接著比較不同情境的做法。
- [從零架設直播伺服器](/post/build-live-streaming-server-from-scratch)：同樣聚焦 WebRTC，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2024-09-23，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};