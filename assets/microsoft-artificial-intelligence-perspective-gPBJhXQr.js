var e=`---
title: 微軟如何看待人工智慧浪潮：從 Bing、ChatGPT 到 Microsoft 365 Copilot
description: 整理我對微軟 AI 策略的觀察，包含企業高層關注、Bing 與 ChatGPT 差異、Embedding、Plugin 與 Microsoft 365 Copilot。
date: 2023-07-18
category: AI趨勢
tags: [微軟, 人工智慧, Microsoft 365 Copilot, Bing, ChatGPT]
readingTime: 9 分鐘
image: /images/tech/hero_microsoft-artificial-intelligence-perspective.webp
imageAlt: 蘋果切面與貓頭鷹臉部圖像並排，象徵人工智慧辨識與理解的挑戰
---


# 微軟如何看待人工智慧浪潮：從 Bing、ChatGPT 到 Microsoft 365 Copilot

微軟看待人工智慧浪潮時，重點不只是模型能力，而是 AI 如何改變企業工作流程、客戶互動與商業模式。我在聽微軟台灣區總經理卞志祥分享後，最有感的是：2023 年的 AI 討論已經從技術圈擴散到企業高層，企業真正要問的不是「AI 會不會紅」，而是「組織能不能用 AI 重新設計工作」。

## 微軟為什麼把人工智慧視為企業轉型議題？

人工智慧對微軟而言是企業轉型議題，不只是單一軟體功能。微軟關注的是 AI 如何進入 Office、搜尋、開發工具與企業資料流程，並重新定義工作方式。

卞志祥在分享中提到，他很少看到一項科技能在三到六個月內，從產業討論快速變成每一家公司高層都在談的課題。這句話很精準地描述了 2023 年生成式 AI 的速度感。

我的觀察是，企業領導者那時關心的已經不只是「模型能回答什麼」，而是「商業模式會怎麼變」。所以過去幾個月，我也一直在看不同產業怎麼學習 AI，尤其是把 AI 和 domain know-how 接在一起的方式。

2023 年是高度不確定的一年。不確定性會帶來風險，也會讓落後者有機會在轉彎處超車。就像賽車在晴天很難突然超越專業車手，但大雨天反而會讓適應能力變成勝負關鍵。AI 浪潮裡，適應改變的速度會變得非常重要。

## 企業使用 AI 的核心能力有哪些？

企業使用 AI 的核心能力可以先看摘要、情緒判斷與意圖理解。這三種能力看似基礎，卻能直接接到客服、行銷、知識管理與營運決策。

我會把當時聽到的 AI 核心能力整理成三類：

| 能力 | 說明 | 企業用途 |
|---|---|---|
| 摘要生成 | 從大量文字中整理重點，產生短版摘要或報告 | 會議記錄、客服紀錄、研究資料整理 |
| 網路聲量正負評判斷 | 分析公開文字中的情緒傾向 | 品牌監測、輿情分析、產品回饋追蹤 |
| 文章意圖與情緒判斷 | 判斷內容背後的目的、情緒與溝通方向 | 客戶分類、內容分析、銷售線索判讀 |

這些能力真正的價值，不在於單點自動化，而在於能不能高度賦能員工、改變與客戶互動的方式、優化既有流程。做到這三件事，產品與服務才有機會長出新的可能性。

## Bing 和 ChatGPT 的差異是什麼？

Bing 與 ChatGPT 的主要差異在於是否把搜尋結果接入回答流程。Bing 先檢索公開網頁，再把相關資料交給模型生成回答，因此較適合需要近期資訊與來源追溯的問題。

我當時理解的差異是：ChatGPT 比較像一個已訓練完成的模型，回答會受訓練資料時間與可用工具限制影響；Bing 則會先做搜尋前處理，把網路上的相關資料帶進生成流程。

這也是為什麼 Bing 在需要查詢公開資訊時，會比單純聊天模型更接近「帶來源的回答」。微軟在 2023 年 2 月推出新版 Bing 與 Edge 時，也把新版 Bing 稱為 web copilot，重點就是搜尋、回答、聊天與內容生成放在同一個入口（Microsoft，2023-02）。

以今天回頭看，這個方向其實就是後來大家熟悉的檢索增強生成（Retrieval-Augmented Generation，RAG）思路：不是只靠模型記憶，而是先取得外部資料，再讓模型用資料生成回答。這讓 AI 回答更容易接近當下資訊，但仍然需要檢查來源品質與引用是否正確。

## ChatGPT 的模型架構可以怎麼理解？

ChatGPT 可以先從 Transformer 與 Embedding 兩個概念理解。Transformer 負責處理序列關係，Embedding 則把文字轉成模型能計算的向量表示。

Embedding model 的作用，是把輸入文字轉成連續向量。這些向量讓模型能捕捉語意、上下文與相似性，後續才有辦法做生成、搜尋、分類或推薦。

不過 ChatGPT 不只是 Embedding model。ChatGPT 是基於 Transformer 架構的大型語言模型，核心包含自注意力機制與前饋神經網路，用來處理長文字序列中的關係。Embedding 是入口之一，不是整個模型的全部。

我覺得 Embedding 後續能力很值得注意，因為向量表示可以延伸到很多任務：

1. **特徵提取**：把文字、圖片或其他資料轉成可供模型使用的特徵。
2. **相似性計算**：用向量距離判斷文件、商品、問題或使用者需求是否接近。
3. **聚類與分群**：把相似資料放到相近位置，協助整理大量內容。
4. **視覺化與理解**：把高維資料降維後觀察資料之間的關係。

從工程角度看，Embedding 是很多 AI 應用的底層拼圖。RAG、語意搜尋、推薦系統與文件分類，都會碰到向量表示這件事。

## Plugin 對 AI 生態系有什麼影響？

Plugin 對 AI 生態系的影響在於把模型從文字回答推向可操作服務。AI 系統若能安全連接外部工具、資料與交易流程，應用範圍就會明顯擴大。

我當時最在意的是 Plugin 的後續可能性。模型本身可以理解與生成文字，但 Plugin 能把模型接到特定領域的知識、資料源或服務。例如旅遊規劃不只是給建議，還可能串到訂房、行程、付款或客服流程。

對 ChatGPT、Bing 或 Copilot 這類 AI 系統來說，外掛或連接器的成熟度會直接影響實用性。成熟的外掛能讓 AI 和更多業務單位互動，也能讓使用者少一點複製貼上，多一點流程整合。

但這裡也有另一面。Plugin 需要權限、資料保護、錯誤處理與商業合作。AI 一旦能替使用者採取動作，風險就不只是回答錯，而是可能把錯誤帶進真實流程。這也是企業導入 AI 時，不能只看示範畫面有多驚艷的原因。

## Microsoft 365 Copilot 代表什麼後續應用？

Microsoft 365 Copilot 代表 AI 進入日常辦公流程。Microsoft 365 Copilot 把大型語言模型接到 Word、Excel、PowerPoint、Outlook、Teams 與企業資料。

微軟在 2023 年 3 月發表 Microsoft 365 Copilot，定位是工作上的 AI 助手。官方介紹中，Copilot 能在 Word 協助起草與改寫，在 Excel 協助分析資料，在 PowerPoint 協助產生簡報，在 Outlook 協助整理與撰寫郵件（Microsoft，2023-03）。

看到 Microsoft 365 Copilot 的示範時，我的感覺是真的有點瞠目結舌。因為這不再只是聊天視窗裡的一段回答，而是 AI 直接進入每天使用的工作工具。

Microsoft 365 Copilot 的意義可以拆成三層：

| 層次 | 代表意義 | 使用者會感受到什麼 |
|---|---|---|
| 工具層 | AI 進入 Word、Excel、PowerPoint、Outlook、Teams | 草稿、摘要、分析與整理更快出現 |
| 資料層 | AI 連接企業文件、信件、會議與權限資料 | 回答更貼近公司內部脈絡 |
| 流程層 | AI 參與日常協作與決策準備 | 工作不只被加速，流程本身也會被重新設計 |

我認為這才是微軟 AI 策略最關鍵的地方：微軟不是只把 AI 做成一個新產品，而是把 AI 放進既有產品線，讓企業在熟悉的工作場景裡重新調整流程。

## 企業看微軟 AI 策略時應該學到什麼？

企業看微軟 AI 策略時，應該學的是流程重設能力，而不是只採購 Copilot 或聊天工具。AI 價值會出現在任務、資料、權限與人類判斷重新分工之後。

如果把這篇心得收斂成一個檢查表，我會先問五個問題：

1. 哪些工作現在花太多時間在摘要、整理、查找與初稿？
2. 哪些流程需要即時資料，不能只靠模型記憶？
3. 哪些工作能讓 AI 先做草稿，但必須由人確認？
4. 哪些內部資料可以被 AI 安全使用，哪些資料不能輸入？
5. 哪些工具連接後會帶來真實行動，需要額外權限與審核？

我的心得是，AI 導入不是把人換掉，而是重新分配「人負責判斷、AI 負責整理與生成、系統負責紀錄與權限」的邊界。微軟的方向剛好把這件事講得很清楚：真正的競爭力不是會不會用 AI，而是能不能把 AI 變成組織運作的一部分。

## 常見問題

### 微軟為什麼這麼重視人工智慧？
微軟重視人工智慧，是因為 AI 可以直接進入搜尋、Office、開發工具、雲端服務與企業資料流程。這讓 AI 不只是新功能，而是改變企業工作方式的基礎能力。

### Bing 和 ChatGPT 最大差異是什麼？
Bing 和 ChatGPT 最大差異是 Bing 會把搜尋結果帶入回答流程。ChatGPT 的回答則取決於模型能力、可用工具與當下產品設定，因此使用時仍要確認資料來源。

### Microsoft 365 Copilot 是什麼？
Microsoft 365 Copilot 是微軟把大型語言模型整合進 Microsoft 365 的 AI 助手。Microsoft 365 Copilot 可協助 Word 起草文件、Excel 分析資料、PowerPoint 建立簡報、Outlook 整理郵件與 Teams 摘要會議。

### Embedding 在 ChatGPT 裡扮演什麼角色？
Embedding 會把文字轉成向量表示，讓模型能計算語意關係。Embedding 常被用在語意搜尋、相似度比對、分類、推薦與 RAG 類型應用。

### Plugin 或連接器為什麼會影響 AI 應用成熟度？
Plugin 或連接器讓 AI 可以接到外部資料、工具與服務。當 AI 能讀取資料或執行動作時，企業就需要同時處理權限、稽核、錯誤回復與資料安全。

### 企業導入 AI 應該先買工具嗎？
企業導入 AI 不一定要先買工具。比較好的第一步是盤點任務、資料、權限與人工審核點，再決定 ChatGPT、Bing、Microsoft 365 Copilot 或其他工具適合放在哪個流程。

## 參考資料

- Microsoft, [Reinventing search with a new AI-powered Microsoft Bing and Edge, your copilot for the web](https://blogs.microsoft.com/blog/2023/02/07/reinventing-search-with-a-new-ai-powered-microsoft-bing-and-edge-your-copilot-for-the-web/)，2023-02-07，存取日期：2026-08-28。
- Microsoft, [Introducing Microsoft 365 Copilot - your copilot for work](https://www.microsoft.com/en-us/microsoft-365/blog/2023/03/16/introducing-microsoft-365-copilot-a-whole-new-way-to-work/)，2023-03-16，存取日期：2026-08-28。
- Microsoft Taiwan, [重塑未來工作樣貌：微軟推出 Microsoft 365 Copilot，工作上的最佳 AI 助手](https://news.microsoft.com/zh-tw/microsoft-365-copilot/)，2023-03，存取日期：2026-08-28。
- Microsoft, [2023 Annual Report](https://www.microsoft.com/investor/reports/ar23/)，2023，存取日期：2026-08-28。

## 延伸閱讀

- [AI 現況概觀：人工智慧如何改變產業、職能與技術架構](/post/ai-current-state-overview)：同樣聚焦 人工智慧，可接著比較不同情境的做法。
- [人工智慧概論：從符號邏輯、專家系統到機器學習](/post/artificial-intelligence-introduction)：同樣聚焦 人工智慧，可接著比較不同情境的做法。
- [AI大師論壇：人工智慧如何形塑人類未來](/post/ai-master-forum-human-future)：同樣聚焦 人工智慧，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2026-08-28，已補上 GEO 結構、FAQ、參考資料與 Microsoft 365 Copilot 相關來源。
`;export{e as default};