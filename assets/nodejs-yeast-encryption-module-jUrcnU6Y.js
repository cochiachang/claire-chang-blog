var e=`---
title: Node.js yeast 模組教學：短 ID 產生、encode 與 decode 用法
description: 說明 Node.js yeast 模組如何產生短 ID，整理 timestamp encode/decode、碰撞 seed 規則與適用情境。
date: 2020-02-27
category: 後端開發
tags: [Node.js, npm, yeast, ID 生成, Socket.IO]
readingTime: 5 分鐘
image: /images/tech/hero_socketio-probe-websocket-failed.webp
imageAlt: Socket.IO WebSocket upgrade 與 Node.js 後端連線示意圖
---


# Node.js yeast 模組教學：短 ID 產生、encode 與 decode 用法

Node.js 的 \`yeast\` 是一個用來產生短字串 ID 的 npm 模組，常見用途是 cache busting、連線識別或需要比 13 位 timestamp 更短的唯一標記。\`yeast\` 提供 \`yeast()\`、\`yeast.encode(num)\` 與 \`yeast.decode(str)\`，但 \`yeast\` 不是密碼學加密工具，不適合拿來保護密碼、token 或敏感資料。

## yeast 是什麼？

\`yeast\` 是 Node.js 與瀏覽器都能使用的短 ID 產生器，主要把時間戳壓縮成更短的 URL-safe 字串。\`yeast\` 適合產生臨時識別碼，不適合作為安全加密或授權憑證。

我當時的筆記把這篇歸在「加解密用的模組」，實際整理時要先校正語意：\`yeast.encode()\` 和 \`yeast.decode()\` 比較像數字與字串之間的編碼轉換，不是 encryption/decryption。若要做密碼雜湊、資料加密或簽章驗證，應改用 Node.js 內建 \`crypto\` 或專門的安全套件。

模組資訊：

| 項目 | 連結 |
|---|---|
| npm | [yeast](https://www.npmjs.com/package/yeast) |
| GitHub | [unshiftio/yeast](https://github.com/unshiftio/yeast) |

## yeast 解決 timestamp 產生 ID 的哪些問題？

\`yeast\` 解決 timestamp 過長與同毫秒碰撞兩個問題。\`yeast\` 會壓縮時間戳，並在同一毫秒產生多個 ID 時加上 seed，讓字串仍能維持唯一。

直接用 timestamp 產生 ID 很直覺，但會遇到兩個限制：

1. JavaScript timestamp 通常是 13 個字元，若大量請求都帶著 timestamp，字串長度會累積成額外傳輸成本。
2. timestamp 精度通常只到毫秒，兩個 ID 若在同一毫秒內產生，內容可能完全相同。

\`yeast\` 的做法是先用自訂 \`encode()\` 把數字轉成短字串；如果新產生的 ID 和前一次相同，就用 \`.\` 加上 seed，例如 \`KyxidwN.0\`、\`KyxidwN.1\`。這個設計讓 ID 保持短，也避免同毫秒內重複。

資訊增益：我會把 \`yeast\` 放在「短識別碼」而不是「安全加密」清單。看到 \`encode/decode\` 這種 API 名稱時，先確認套件是否有金鑰、演算法與安全模型；如果沒有，通常只是格式轉換，不是加密。

## 如何安裝 yeast？

\`yeast\` 可以透過 npm 安裝到 Node.js 專案。安裝後可用 CommonJS \`require('yeast')\` 載入，舊版後端專案或 Socket.IO 相關程式碼很常見這種寫法。

安裝指令：

\`\`\`bash
npm install --save yeast
\`\`\`

載入函式庫：

\`\`\`js
'use strict';

var yeast = require('yeast');
\`\`\`

若專案使用 ES Modules，可以先確認目前 bundler 或 runtime 是否支援 CommonJS 套件互通。維護舊 Node.js 專案時，直接保留 \`require()\` 通常最少牽動既有程式碼。

## 如何用 yeast 產生唯一 ID？

呼叫 \`yeast()\` 會回傳短字串 ID。若同一毫秒內連續呼叫多次，\`yeast\` 會保留同一個時間字串，再用 \`.0\`、\`.1\` 這類 seed 區分碰撞。

這段範例保留我當時的筆記中的輸出型態：

\`\`\`js
console.log(yeast(), yeast(), yeast()); // outputs: KyxidwN KyxidwN.0 KyxidwN.1

setTimeout(function () {
  console.log(yeast()); // outputs: KyxidwO
});
\`\`\`

第一行連續產生三個 ID 時，三個呼叫可能落在同一毫秒內，所以後兩個 ID 會加上 seed。\`setTimeout()\` 之後再呼叫一次，時間戳已經往前，輸出就會換成另一個短字串。

這種 ID 適合放在 cache busting query、暫時性訊息編號或後端內部追蹤。若 ID 需要不可預測性，例如 reset password token、登入 session token 或付款流程識別碼，\`yeast()\` 不應取代安全亂數。

## yeast.encode 與 yeast.decode 怎麼用？

\`yeast.encode(num)\` 會把數字轉成較短字串，\`yeast.decode(str)\` 會把字串轉回整數。這組 API 可用來保存 timestamp 資訊，但不會隱藏資料意義或提供安全保護。

\`yeast.encode(num)\` 範例：

\`\`\`js
yeast.encode(+new Date()); // outputs: Kyxjuo1
\`\`\`

\`yeast.decode(str)\` 範例：

\`\`\`js
var id = yeast(); // holds the value: Kyxl1OU

yeast.decode(id); // outputs: 1439816226334
\`\`\`

從這段範例可以看出，\`decode()\` 仍然能還原 timestamp 整數。這也是為什麼 \`yeast\` 不該被視為安全加密：只要知道編碼規則，字串就能被轉回原本的數字資訊。

## yeast 適合用在哪些 Node.js 情境？

\`yeast\` 適合用在需要短、線性增加、可快速產生的臨時 ID 場景。\`yeast\` 不適合用在需要高隨機性、抗猜測或長期安全性的資料識別。

我會用這張表判斷是否適合：

| 使用情境 | 是否適合 yeast | 原因 |
|---|---:|---|
| 靜態資源 cache busting | 適合 | ID 短，目的只是讓 URL 版本變動 |
| Socket.IO 或即時通訊內部識別 | 視情況適合 | 適合內部暫時標記，不適合權限驗證 |
| log correlation id | 視情況適合 | 可讀性尚可，但正式追蹤常會需要更完整的 request id |
| password reset token | 不適合 | 需要安全亂數與過期機制 |
| API key 或 session token | 不適合 | 需要不可預測性與安全儲存 |

\`yeast\` 的優勢是小、快、短。\`yeast\` 的限制也很明確：ID 來源仍與時間有關，設計目標不是密碼學安全。

## 常見問題

\`yeast\` 常見問題多半來自名稱誤解：\`encode/decode\` 看起來像加解密，但 \`yeast\` 實際上是短 ID 產生器。判斷使用場景時，先分清楚「唯一」和「安全」是兩件事。

### yeast 是加密模組嗎？
\`yeast\` 不是加密模組。\`yeast.encode()\` 和 \`yeast.decode()\` 是數字與短字串之間的轉換，沒有金鑰、加密演算法或安全強度設計。

### yeast 產生的 ID 會重複嗎？
\`yeast\` 會用 timestamp 產生短字串，並在同一毫秒內發生碰撞時加上 seed。這能降低連續產生 ID 的重複問題，但不代表 \`yeast\` 適合所有分散式系統的全域唯一 ID。

### yeast.encode 可以把資料藏起來嗎？
\`yeast.encode()\` 不適合用來藏資料。\`yeast.decode()\` 可以把字串轉回整數，所以 \`encode()\` 應理解為壓縮或格式轉換，而不是保密。

### yeast 適合拿來產生 token 嗎？
\`yeast\` 不適合產生登入 token、API key 或 password reset token。這些資料需要不可預測的安全亂數、有效期限與安全儲存，應改用 Node.js \`crypto\` 或成熟的認證方案。

### yeast 和 UUID 差在哪？
\`yeast\` 產生的字串通常比 UUID 短，且偏向線性時間順序。UUID 更適合跨系統識別與資料庫主鍵，但字串較長；兩者選擇取決於唯一性範圍、可讀性與安全需求。

### yeast 可以在瀏覽器使用嗎？
\`yeast\` 的官方 README 說明此模組可用在瀏覽器與 Node.js。實務上仍要看專案打包工具、模組格式與瀏覽器端使用目的。

## 參考資料

本文參考 \`yeast\` 官方 npm 與 GitHub README，並保留我當時的筆記中的 Node.js 使用範例。外部來源皆為 HTTPS，並以 2026-08-28 存取內容為準。

- npm：[yeast package](https://www.npmjs.com/package/yeast)（存取日期：2026-08-28）
- GitHub：[unshiftio/yeast](https://github.com/unshiftio/yeast)（存取日期：2026-08-28）
- npm Docs：[Package spec](https://docs.npmjs.com/cli/v11/using-npm/package-spec/)（存取日期：2026-08-28）
- Node.js Docs：[Crypto](https://nodejs.org/api/crypto.html)（存取日期：2026-08-28）
- 我當時的筆記：\`markdown-export/加解密用的模組 – yeast.md\`

## 延伸閱讀

- [Socket.IO 自行增加 Header：Server CORS 與 Client extraHeaders 設定](/post/socketio-custom-header)：同樣聚焦 Socket.IO、Node.js，可接著比較不同情境的做法。
- [ioredis 是什麼？Node.js 高效能 Redis 客戶端完整介紹與使用範例](/post/ioredis-npm-module)：同樣聚焦 Node.js、npm，可接著比較不同情境的做法。
- [Angular NPM 與 package.json 設定教學](/post/angular-npm-package-json-setup)：同樣聚焦 npm、Node.js，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2026-08-28。我當時的筆記發布於 2020-02-27，這次整理保留 \`yeast()\`、\`yeast.encode()\` 與 \`yeast.decode()\` 程式碼，並補上 GEO Answer Blocks、FAQ、參考資料與安全適用情境提醒。
`;export{e as default};