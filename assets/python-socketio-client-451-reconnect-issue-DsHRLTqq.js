var e=`---
title: Python Socket.IO Client 4.5.1 不會自動重連：503 後的排查與手動重連寫法
description: 記錄 python-socketio 4.5.1 遇到 HTTP 503 後沒有自動重連的排查，並整理用 Timer 手動重連的處理方式。
date: 2022-12-16
category: 後端開發
tags: [Python, Socket.IO, 即時通訊]
readingTime: 6 分鐘
image: /images/tech/hero_socketio-error-messages.webp
imageAlt: Socket.IO 連線錯誤與重連排查示意圖
---
# Python Socket.IO Client 4.5.1 不會自動重連：503 後的排查與手動重連寫法

我遇到的問題是 \`python-socketio\` 4.5.1 在 polling 連線收到 HTTP 503 後，client 結束連線流程，但沒有照預期自動重連。當時的處理方式是先關掉套件內建重連，改用 \`threading.Timer\` 包一層自己的重連邏輯，讓服務在斷線或連線失敗時持續嘗試重新連上。

## 問題版本與現象是什麼？

\`python-socketio\` 4.5.1 的問題情境是 polling request 收到 HTTP 503 後，client 沒有再進入自動重連。這個行為也出現在 GitHub issue #485 的討論，回報者使用 \`python-socketio\` 4.5.1 與 \`python-engineio\` 3.12.1。

當時我記下的版本與線索：

| 項目 | 內容 |
| --- | --- |
| Python 套件 | \`python-socketio\` |
| 問題版本 | \`4.5.1\` |
| 相關 Engine.IO 版本 | GitHub issue 中提到 \`python-engineio\` 3.12.1 |
| 連線方式 | \`transports='polling'\` |
| 主要現象 | HTTP 503 後沒有自動重連 |
| 相關討論 | GitHub issue #485：Reconnect on HTTP 503 |

GitHub issue #485 的 log 顯示，client 在送出 PING packet 時收到 HTTP 503，接著 Engine.IO client 記錄 unexpected status code 並 abort；回報者描述 client 直接離開，沒有再嘗試 reconnect（GitHub，2020-05）。

## 為什麼需要自己寫重連？

\`python-socketio\` 文件說明 \`Client(reconnection=True)\` 預設會在連線中斷後嘗試重連，但 4.5.1 遇到 503 abort 的情境並沒有如預期恢復。我的取捨是先把內建重連設為 \`False\`，把重連時機收斂到自己能控制的程式碼。

官方 v4 API 文件中，\`socketio.Client\` 的 \`reconnection\` 預設為 \`True\`，\`reconnection_attempts=0\` 代表無限次嘗試，\`reconnection_delay\` 預設第一段延遲為 1 秒（python-socketio documentation，v4 API）。照文件看，正常的斷線應該可以交給 client 自己處理。

問題在於，我碰到的不是一般網路斷線，而是 server 回了 HTTP 503 之後 client 中止 polling 流程。為了讓服務不要停在斷線狀態，我選擇用最小可控的方式補一層 retry。

## 手動重連程式碼怎麼寫？

手動重連的核心是讓 \`connectSocket()\` 負責連線，失敗時取消舊 Timer，再排下一次嘗試。\`disconnect\` event 也用同一個入口重新排程，避免連線失敗與已連線後斷線走兩套不同邏輯。

我當時整理的重連寫法如下，重點是 \`socketio.Client(reconnection=False)\` 與 \`Timer(1.0, connectSocket)\`：

\`\`\`python
import socketio
from threading import Timer

timer = None
address = "http://127.0.0.1:2027"
sio = socketio.Client(reconnection=False, logger=False, engineio_logger=False)
isConnected = False


def connectSocket():
    global timer
    try:
        sio.connect(address, transports='polling')
    except:
        if timer is not None:
            timer.cancel()
        timer = Timer(1.0, connectSocket)
        timer.start()


def close():
    global sio
    global timer
    global isConnected
    sio.disconnect()
    isConnected = False
    if timer is not None:
        timer.cancel()


@sio.event
def test():
    print('(test)')


def send(data):
    sio.emit('send', data)


@sio.event
def connect():
    global isConnected
    print('(connect)')
    isConnected = True


@sio.event
def disconnect():
    global timer
    global isConnected
    print('(disconnected)')
    sio.disconnect()
    isConnected = False
    if timer is not None:
        timer.cancel()
    timer = Timer(1.0, connectSocket)
    timer.start()
\`\`\`

這段程式碼的想法很直接：連不上就一秒後再試，斷線也一秒後再試。\`close()\` 則負責在程式主動關閉時取消 timer，避免背景還有排程繼續呼叫 \`connectSocket()\`。

## 排查時要注意哪些細節？

排查 \`python-socketio\` 4.5.1 重連問題時，不要只看 client 是否觸發 \`disconnect\`。需要同時看 HTTP status code、Engine.IO log、transport 類型，以及是初次連線失敗還是已連線後中斷。

我會先確認幾件事：

| 檢查項目 | 為什麼要看 |
| --- | --- |
| \`logger=True\` / \`engineio_logger=True\` | 看 PING、PONG、polling request 與 abort 位置 |
| HTTP status code | 503 表示 server 或中間層暫時不可用，不等同 client 主動斷線 |
| transport | 這個案例用 polling，和 WebSocket upgrade 失敗是不同問題 |
| reconnect 是否真的被觸發 | 不要只看 \`disconnect\`，也要看後續是否有新的 connect request |
| server / proxy log | 503 可能來自應用伺服器、反向代理或負載平衡器 |

如果只是暫時性的網路波動，內建重連通常比較適合；如果是 4.5.1 這種特定錯誤路徑沒有恢復，手動重連才是務實的補洞方式。

## 這個寫法有哪些限制？

\`Timer\` 手動重連能讓服務恢復，但不是完整的連線管理框架。實務上要避免重複 timer、無限密集重試、程式關閉後還在背景重連，以及多執行緒同時呼叫 \`emit()\` 的競態。

這段程式碼是解決當下問題的最小做法，不是我會直接拿去當長期通用模組的版本。若要放進正式服務，我會補上：

1. 明確捕捉例外，不使用裸 \`except\`。
2. 加上最大延遲或 backoff，避免 server 故障時每秒固定打一次。
3. 在 \`connect()\` 成功後清掉舊 timer 狀態。
4. 區分「主動關閉」與「意外斷線」，避免 \`close()\` 後又被 \`disconnect()\` 排回重連。
5. 對 \`emit()\` 加上 connected 狀態檢查，避免斷線期間送資料失敗。

官方文件也提醒，\`emit()\` 不是 thread safe；如果多個 thread 同時透過同一個 client 發送訊息，應該用 Lock 等同步機制保護封包順序（python-socketio documentation，v4 API）。

## 什麼時候應該升級而不是補手動重連？

如果專案允許升級套件，優先測試新版 \`python-socketio\` 會比長期維護自製重連更好。手動重連適合無法立即升級、但服務又需要持續連線的短期修補。

我會用這個順序判斷：

| 情境 | 建議 |
| --- | --- |
| 只能留在 4.5.1 | 先補手動重連，並把 log 打清楚 |
| 可以升級但風險未知 | 在測試環境重放 503、timeout、server restart |
| 服務需要長期穩定 | 升級後保留監控，不依賴單一 retry 寫法 |
| server 經常回 503 | 先查 server、proxy、負載平衡器，不要只在 client 重試 |

新版 python-socketio 文件仍保留 client 端重連選項，也說明 accidental disconnection 後 client 會嘗試 reconnect；如果升級後行為符合預期，就應該移除臨時性的 Timer retry，讓連線生命週期回到套件管理。

## 常見問題
### python-socketio 4.5.1 為什麼不會自動重連？
我遇到的情境是 polling request 收到 HTTP 503 後，Engine.IO client 中止流程，沒有再走預期的 reconnect。GitHub issue #485 也描述了相同方向的問題：client 在 503 後直接離開，沒有再嘗試連線。

### \`reconnection=True\` 不是預設值嗎？
是，\`python-socketio\` v4 文件中 \`socketio.Client\` 的 \`reconnection\` 預設值是 \`True\`。但 4.5.1 在 HTTP 503 abort 這條路徑上，實際行為和一般斷線重連不同，所以我才改成 \`reconnection=False\`，自己接管重連。

### 為什麼範例使用 \`transports='polling'\`？
當時的連線情境就是 polling，所以我保留這個設定來對應實際問題。\`python-socketio\` 的 \`connect()\` 可以指定 \`polling\` 或 \`websocket\` transport；若不指定，通常會先連 polling，再嘗試升級 WebSocket。

### 手動重連間隔一秒會不會太短？
一秒適合用在單機或低流量排查，不一定適合正式環境。正式服務建議改成 exponential backoff、最大延遲與停止條件，避免 server 503 時 client 同時重試造成更大壓力。

### 這段程式碼可以直接用在正式環境嗎？
這段程式碼可以當作修補方向，但正式環境至少要補例外分類、關閉狀態、timer 去重、重試上限或 backoff。若多 thread 會呼叫 \`emit()\`，還要加同步保護。

### 升級 python-socketio 後還需要 Timer 重連嗎？
升級後應先用測試重放 503、server restart、timeout 等情境。若新版內建重連已能正確恢復，就不需要保留 Timer 重連，避免自製邏輯和套件內建生命週期互相干擾。

## 參考資料

- python-socketio documentation：[API Reference - Client class](https://python-socketio.readthedocs.io/en/v4/api.html)，存取日期：2026-08-28。
- python-socketio documentation：[The Socket.IO Clients](https://python-socketio.readthedocs.io/en/latest/client.html)，存取日期：2026-08-28。
- GitHub：miguelgrinberg/python-socketio issue #485，[Reconnect on HTTP 503](https://github.com/miguelgrinberg/python-socketio/issues/485)，opened on 2020-05-14，存取日期：2026-08-28。

## 延伸閱讀

- [Socket.IO 錯誤訊息意義：ping timeout、transport close 與 disconnect](/post/socketio-error-messages)：同樣聚焦 Socket.IO、即時通訊，可接著比較不同情境的做法。
- [Engine.io 介紹](/post/engine-io-introduction)：同樣聚焦 Socket.IO、即時通訊，可接著比較不同情境的做法。
- [Socket.IO 自行增加 Header：Server CORS 與 Client extraHeaders 設定](/post/socketio-custom-header)：同樣聚焦 Socket.IO，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2026-08-28。首次整理日期為 2022-12-16，本次更新補上 GEO 結構、FAQ、參考資料與延伸閱讀。
`;export{e as default};