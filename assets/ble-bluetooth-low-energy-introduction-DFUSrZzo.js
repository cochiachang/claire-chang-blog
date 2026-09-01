var e=`---
title: BLE（Bluetooth Low Energy）簡介：低功耗藍牙的原理與 iOS 開發限制
description: 說明 BLE 與傳統藍牙、WiFi 的差異、GATT/GAP 協定架構、連線參數設計，以及 iOS 開發時的注意事項。
date: 2013-11-15
category: 後端開發
tags: [BLE, Bluetooth, iOS, GATT, 藍牙通訊]
readingTime: 6 分鐘
image: /images/tech/ble-vs-wifi-bt-comparison.webp
imageAlt: BLE 與傳統藍牙、WiFi 在頻段、耗電量與傳輸量上的比較圖
---


# BLE（Bluetooth Low Energy）簡介：低功耗藍牙的原理與 iOS 開發限制

BLE（Bluetooth Low Energy）是 Bluetooth 4.0 規格的一部分，主打低功耗、低延遲，代價是傳輸速度低於 100kb/s——只有傳統藍牙（3Mb/s 以上）的零頭。一顆鈕扣型電池就能撐起一年以上的運作，這也是心率帶、血壓計這類穿戴裝置普遍改採 BLE 的原因。它另一個實務上的好處是不需要像傳統藍牙一樣通過 MFi 認證，就能跟蘋果設備連線。

## BLE、傳統藍牙、WiFi 的差異在哪裡？

三者其實共用同一個 2.4GHz 頻段，BLE 刻意避開了 WiFi 常用的幾個頻道，讓兩者可以共存而不太互相干擾。下圖是 TI 的比較資料：左邊是三者的頻段分佈，右上是所需供電量，右下是最大傳輸量。

![BLE 與傳統藍牙、WiFi 在頻段、耗電量與傳輸量上的比較圖](/images/tech/ble-vs-wifi-bt-comparison.webp)

可以看出 BLE 用一顆鈕扣電池就能運作，傳統藍牙要 AAA 電池等級，WiFi 則需要鋰電池；傳輸量正好反過來，WiFi 最高、BLE 最低。這張圖說明了 BLE 的設計取捨：犧牲吞吐量換取極低功耗。

現有的藍牙設備大致分三種模式：

- **Single Mode（BLE only）**：只支援 BLE，例如心率帶、運動手環這類感測裝置。
- **Dual Mode（Bluetooth Smart Ready）**：同時支援 BLE 與傳統藍牙，手機、筆電多半是這一類。連到 BLE 設備時用 BLE 的功耗與速度，連到傳統藍牙設備時則切換回傳統藍牙的模式。
- **Classic**：只支援傳統藍牙，例如藍牙耳機、鍵盤。

![BLE 與傳統藍牙、WiFi 在頻段、耗電量與傳輸量上的比較圖之外，各類藍牙裝置的連接模式示意](/images/tech/bluetooth-single-dual-classic-mode.webp)

## BLE 協定分成哪幾層？

BLE 協定堆疊由下到上分成 Controller、Host、App 三個大區塊：

![BLE 協定堆疊，由 Physical Layer 到 Applications 共七層](/images/tech/ble-protocol-stack-layers.webp)

- **Physical Layer / Link Layer / HCI**：屬於 Controller，負責實體傳輸與標準藍牙事件通知。
- **Logical Link Control and Adaption Protocol**：負責連接建立與事件處理。
- **Security Manager**：處理配對與資料加密。
- **Attribute Protocol（ATT）**：所有資料傳輸都經過這一層，定義了 Client / Server 角色——Client 發 Request，Server 回 Response。
- **Generic Attribute Profile（GATT）**：在 ATT 之上把資料組織成一個個 Service，將讀寫操作整合成一套通信流程，供上層 Profile 使用。
- **Generic Access Profile（GAP）**：負責設備查找與連接建立，定義了四種角色。

GAP 定義的四種角色是理解 BLE 通訊模式的關鍵：

| 角色 | 適用情境 | 說明 |
| --- | --- | --- |
| Peripheral | 已連接通訊 | 通常是從設備（如血壓計），扮演 ATT/GATT 的 Client |
| Central | 已連接通訊 | 通常是主設備（如手機、電腦），扮演 ATT/GATT 的 Server |
| Broadcaster | 未連接通訊 | 單向持續廣播資料，例如單純的溫度計 |
| Observer | 未連接通訊 | 接收 Broadcaster 送出的封包並記錄下來 |

## Connection Parameter 為什麼會直接影響耗電量？

BLE 設備建立連線後，所有通訊都發生在 Connection Event 裡，其餘時間設備處於 Sleeping 狀態、耗電量極低——這正是 BLE 省電的核心機制。每次 Connection Event 一律由 Master 發起、Slave 回覆。

三個關鍵參數共同決定了傳輸速度與耗電表現：

- **Connection Interval**：多久觸發一次 Connection Event，直接影響傳輸速度與耗電量。
- **Slave Latency**：Slave 沒有新資料要傳時，最多可以忽略幾次 Master 發起的通訊請求，藉此省電。
- **Supervision Timeout**：多久沒收到任何通訊請求就判定斷線。

這三個參數必須滿足：

\`\`\`
Supervision Timeout > (1 + Slave Latency) × Connection Interval
\`\`\`

原因是 Slave Latency 允許的忽略次數不能算進 Supervision Timeout 的判斷裡，否則會在正常的省電行為中被誤判成斷線。三個參數在連線建立後都可以動態調整，開發時可依實際情境（例如即時性要求 vs. 續航需求）重新配置。

## 藍牙產品上市前需要通過什麼認證？

要在全球市場上市，藍牙產品必須通過 SIG（Bluetooth Special Interest Group）認證，官方網站是 [bluetooth.org](https://www.bluetooth.org/)。此外還有 Unplug Fest 這類互通性測試活動，可以在正式送測前先驗證藍牙功能是否與其他裝置相容。

## iOS 開發 BLE 有哪些限制？

蘋果對 iOS 上的 BLE 開發設下了幾個跟一般藍牙開發不同的限制：

- **拿不到真正的裝置位址**：連接 iPhone 時無法取得 IEEE 位址，只能拿到一個 resolvable address，因此也無法直接對 iOS 設備發送 advertisement。
- **連接參數有範圍限制**：Interval 必須大於 20 毫秒、小於 2 秒；Supervisor Timeout 需小於等於 6 秒；Slave Latency 需小於等於 4 秒。
- **部分底層資訊被隱藏**：藍牙實體位址、Characteristic handles、Characteristic descriptors 以及連接參數在 iOS 裡都被系統隱藏。連接參數雖然可以設定，但如果連線建立後是由 Slave 端修改了這些數值，App 端無法取得被修改後的實際值。
- **改用 UUID 做連線識別**：既然拿不到 IEEE 位址，iOS 7 之後改用 UUID 來識別並連線裝置。

開發時還需要分別處理前景、背景、被系統暫停三種狀態下的重新連線邏輯，以及裝置掃描（scan for peripherals）的實作方式，這些都跟一般桌面藍牙開發的假設不太一樣，是實際踩坑後才會注意到的細節。

## 常見問題

### BLE 跟傳統藍牙可以直接互通嗎？

不能直接互通，但 Dual Mode（Bluetooth Smart Ready）設備可以同時支援兩者，依連線對象自動切換使用哪一種模式。

### BLE 的傳輸速度大概是多少？

低於 100kb/s，傳統藍牙則在 3Mb/s 以上，這也是 BLE 犧牲吞吐量換取低功耗的直接結果。

### Peripheral 和 Central 這兩個角色怎麼分？

連接後負責被連線、通常是資料來源的一方是 Peripheral（如感測裝置）；主動發起連線、彙整資料的一方是 Central（如手機）。

## 參考資料

- [TI BLE 課程](http://v.youku.com/v_show/id_XNTk4MDUyODM2.html)
- [Core Bluetooth on iOS](http://www.slideshare.net/storywithoutend/core-bluetooth-on-ios)
- [Bluetooth SIG](https://www.bluetooth.org/)


## 延伸閱讀

- [Objective-C 語言入門：物件、Message Syntax 與 Selector](/post/objective-c-language-message-syntax)：同樣聚焦 iOS，可接著比較不同情境的做法。
- [iOS 6 與 iOS 7 的不同處整理](/post/ios6-ios7-ui-behavior-differences)：同樣聚焦 iOS，可接著比較不同情境的做法。
- [iOS 7 App 轉換指南：舊 App 升級前要檢查哪些項目？](/post/ios7-app-migration-guide)：同樣聚焦 iOS，可接著比較不同情境的做法。
`;export{e as default};