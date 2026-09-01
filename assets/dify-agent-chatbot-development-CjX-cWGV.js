var e=`---
title: 使用 Dify 開發 Agent 聊天機器人：工具串接、OpenAPI YAML 與實作觀察
description: 記錄用 Dify 建立 Agent 聊天機器人的流程，包含自訂工具、OpenAPI YAML、工具描述撰寫與測試觀察。
date: 2024-10-16
category: 生成式AI
tags: [Dify, Agent, 聊天機器人, Function Calling, OpenAPI, 生成式AI]
readingTime: 8 分鐘
image: /images/tech/hero_dify-agent-chatbot-development.webp
imageAlt: Dify 探索頁面中的智能助理應用列表
---


# 使用 Dify 開發 Agent 聊天機器人：工具串接、OpenAPI YAML 與實作觀察

Dify 適合拿來快速開發 Agent 聊天機器人，尤其是需求不只文字回覆，還需要讓大型語言模型判斷何時呼叫外部 API、使用工具、查資料或執行動作。我的實作重點是先分清楚「固定流程」和「Agent 自主判斷」的差異，再把自訂 API 轉成 Dify 能理解的 OpenAPI YAML，最後用工具描述和測試紀錄調整呼叫成功率。

## Dify Agent 是什麼？

Dify Agent 是一種可自主判斷下一步的聊天式應用。Dify Agent 會根據使用者需求推理、選擇工具、呼叫外部服務，再把工具結果整理成回答。

Dify 官方把 Agent 定位成可在聊天中推理、決策並自主使用工具的應用，適合不想把每一步都寫死成 Workflow 的情境（Dify Docs，2026-08 存取）。例如資料分析助理、客服查詢助理、旅遊規劃助理，都可能需要依照使用者追問動態決定要不要查資料、呼叫 API 或繼續追問。

我自己的理解是：Workflow 像一條事先畫好的路線，Agent 則像一個可以自己判斷路線的人。當任務有明確順序時，Workflow 比較穩；當使用者輸入會一直變、工具使用時機也不固定時，Dify Agent 比較有彈性。

![Dify Studio 中建立 Agent 的入口](/images/tech/dify-agent-studio-entry.webp)

## 什麼情況適合用 Dify Agent，而不是 Workflow？

Dify Agent 適合流程不固定、需要模型自己判斷工具使用時機的情境。若每一步都能事先排好，Dify Workflow 通常更可控。

我在 Dify 裡做聊天機器人時，先碰到的問題是「工具」到底該放在哪裡。Workflow 也可以呼叫外部 API，但 Workflow 的呼叫順序通常是開發者自己設計好的；如果流程會隨著使用者回答改變，固定節點就會開始卡住。

我的判斷方式很簡單：

| 任務型態 | 較適合的 Dify 應用 | 原因 |
|---|---|---|
| 每次都照固定步驟處理 | Workflow | 節點順序明確，測試與除錯比較穩定 |
| 使用者問題很多變 | Agent | 模型可以依語意判斷下一步 |
| 需要不定時呼叫外部 API | Agent | 模型可依工具描述選擇是否呼叫 |
| 需要嚴格流程控管 | Workflow 或 Chatflow | 條件、分支與輸出格式比較容易固定 |

這也是我後來選 Agent 的原因。我要做的不是一個單純問答機器人，而是讓大型語言模型根據使用者的問題，自己判斷何時該呼叫哪些外部 API 或功能。

## 如何在 Dify 建立 Agent 聊天機器人？

在 Dify 建立 Agent 聊天機器人，可以從 Studio 或 Agents 建立應用，再設定提示詞、模型、工具與知識庫。工具加入後，模型會依使用者問題決定是否呼叫。

我當時的操作路徑是進到 \`Studio > Agent\`，建立一個具備 Agent 功能的聊天機器人。新版 Dify 文件也提到，建立 Agent 後要在 Configure 裡設定模型、Prompt、Skills、Files、Tools 與環境變數等能力（Dify Docs，2026-08 存取）。

我會先把 Agent 的責任寫清楚：

1. Agent 扮演什麼角色。
2. Agent 可以回答哪些問題。
3. Agent 什麼時候應該使用工具。
4. Agent 呼叫工具失敗時要怎麼回應。
5. Agent 不確定使用者意圖時要不要追問。

這些規則最好放進 Prompt。Dify 官方也建議在 Agent prompt 裡明確描述工具使用時機、輸出格式與工作流程，因為 Agent 需要靠這些描述判斷下一步（Dify Docs，2026-08 存取）。

## Dify 自訂工具要怎麼建立？

Dify 自訂工具可以把外部 API 包成 Agent 可呼叫的能力。常見做法是先準備 API，再用 OpenAPI 或 Swagger schema 匯入 Dify。

在認識 Agent 之前，要先理解 Dify 的「工具」是什麼。Dify 官方說明，工具可以被 Chatflow、Workflow 或 Agent 類型應用呼叫，用來連接第三方服務與 API，例如搜尋、圖片生成、資料查詢或其他外部能力（Dify Docs，2026-08 存取）。

Dify 內建不少工具，但很多實務需求會需要自己的 API。我的流程是：

1. 先寫好可被外部呼叫的 API。
2. 把 API 的 endpoint、參數、回傳格式整理成 OpenAPI YAML。
3. 到 Dify 的 Tools 區域建立 Custom Tool。
4. 匯入 YAML，確認 Dify 有解析出正確參數。
5. 回到 Agent 設定，把自訂工具加進去。

![Dify 自訂工具頁面](/images/tech/dify-custom-tool-page.webp)

## OpenAPI YAML 為什麼會影響 Agent 呼叫成功率？

OpenAPI YAML 會直接影響 Dify Agent 對工具的理解。工具名稱、摘要、描述與參數說明寫得越清楚，模型越容易在正確時機填入正確參數。

我當時的做法很偷懶，也很實用：把 API 程式碼貼給 ActionsGPT，請它幫我產生一份 YAML。產出的 YAML 大致可用，解釋也接近正確；但我不會直接相信第一版，因為 Dify Agent 最後看的是 schema 裡的工具描述和參數描述。

需要特別檢查的欄位有：

| YAML 欄位 | 需要檢查的重點 |
|---|---|
| \`operationId\` | 名稱要穩定、語意清楚，避免只叫 \`run\` 或 \`query\` |
| \`summary\` | 用一句話說明工具用途 |
| \`description\` | 說清楚何時該用這個工具，何時不該用 |
| \`parameters\` | 每個參數都要有型別、必要性與清楚說明 |
| \`requestBody\` | POST 類 API 要確認欄位結構能被 Dify 解析 |
| \`responses\` | 回傳格式要讓 Agent 知道可以拿哪些欄位回答 |

Dify 的工具解析會讀 OpenAPI / Swagger 類 schema；如果 schema 缺少 server、path、operation 描述或參數定義，Agent 就算被加入工具，也可能不知道該怎麼呼叫。這也是我在實作後最想提醒的一點：工具描述不要隨便寫，因為描述品質會直接反映在呼叫成功率上。

## 實作 Dify Agent 聊天機器人時，我會怎麼測試？

Dify Agent 測試不能只看是否有回答文字。Dify Agent 測試要確認工具是否被正確選中、參數是否正確、外部 API 是否回傳可用資料。

我會用三層測試來看 Agent 是否真的可靠：

1. **工具解析測試**：匯入 YAML 後，先確認 Dify 顯示出的工具名稱、參數與測試呼叫是否符合 API 設計。
2. **意圖判斷測試**：用不同問法問同一件事，觀察 Agent 是否都會選到同一個正確工具。
3. **失敗情境測試**：故意缺少必要參數、輸入模糊地點或查不到資料，看 Agent 是追問、改用其他工具，還是硬回答。

Dify 官方文件提到，Agent 的表現會受到模型推理能力與原生 tool calling 支援影響；支援 Function Calling 的模型可以直接呼叫工具，其他模型則可能透過 ReAct 策略使用工具（Dify Docs，2026-08 存取）。所以如果工具常常選錯，我會先檢查 Prompt 和 YAML，再換推理能力較好的模型測一次。

![Dify Agent 應用列表](/images/tech/dify-agent-app-gallery.webp)

## Dify Agent 開發流程可以怎麼整理？

Dify Agent 開發流程可以拆成六步：定義任務、準備 API、產生 OpenAPI YAML、建立自訂工具、加入 Agent、反覆測試工具呼叫。

我最後會把流程整理成這樣：

| 步驟 | 要做的事 | 觀察重點 |
|---|---|---|
| 1. 定義 Agent 任務 | 寫清楚 Agent 要解決什麼問題 | 任務是否真的需要自主判斷 |
| 2. 準備外部 API | 寫好可被呼叫的服務 | API 是否有穩定輸入與輸出 |
| 3. 產生 OpenAPI YAML | 用工具輔助產生 schema，再人工修正 | 描述是否足以讓模型理解 |
| 4. 建立 Custom Tool | 在 Dify Tools 裡匯入 schema | Dify 是否正確解析工具 |
| 5. 加入 Agent | 在 Agent 設定中啟用工具 | Prompt 是否說明何時使用 |
| 6. 測試與調整 | 用多種問法測工具呼叫 | 工具選擇、參數、回覆是否穩定 |

這條流程的重點不是「把 API 接進 Dify 就結束」。真正花時間的地方，是讓 Agent 在各種語意變化下仍然知道該不該用工具、要填哪些參數、拿到資料後該怎麼回答。

## 常見問題

### Dify Agent 和 Dify Workflow 有什麼不同？
Dify Agent 讓模型自己判斷下一步，適合流程會因使用者輸入改變的任務。Dify Workflow 則適合固定步驟、固定分支與需要明確控管的自動化流程。

### Dify Agent 一定要自己寫 API 嗎？
Dify Agent 不一定要自己寫 API。Dify 內建工具與外部工具已能處理部分需求，但如果任務需要公司內部資料、客製查詢或專屬系統操作，就需要建立自訂工具。

### Dify 自訂工具一定要用 OpenAPI YAML 嗎？
Dify 自訂工具常見做法是使用 OpenAPI 或 Swagger schema。OpenAPI YAML 可以清楚描述 endpoint、參數與回傳格式，讓 Dify 解析成 Agent 可呼叫的工具。

### 為什麼 Dify Agent 沒有正確呼叫工具？
Dify Agent 沒有正確呼叫工具時，常見原因是工具描述太模糊、參數說明不足、Prompt 沒有定義工具使用時機，或模型本身 tool calling 能力不穩。建議先檢查 YAML 的 \`summary\`、\`description\`、\`parameters\`，再檢查 Agent Prompt。

### Dify Agent 適合做客服聊天機器人嗎？
Dify Agent 適合做需要查資料、呼叫 API 或處理多步驟問題的客服聊天機器人。若客服問題主要是固定知識庫問答，Dify Chatbot 或 Chatflow 可能更簡單。

### Dify Agent 可以降低開發門檻嗎？
Dify Agent 可以降低應用編排與工具串接的門檻，但不能省掉 API 設計、資料權限、錯誤處理與測試。真正可靠的 Agent 仍需要把工具邊界和失敗情境設計清楚。

## 參考資料

- Dify Docs, [Agent](https://docs.dify.ai/en/cloud/use-dify/build/agent)，存取日期：2026-08-28。
- Dify Docs, [Build an Agent](https://docs.dify.ai/en/cloud/use-dify/build/new-agent/build)，存取日期：2026-08-28。
- Dify Docs, [Dify Tools](https://docs.dify.ai/en/cloud/use-dify/workspace/tools)，存取日期：2026-08-28。
- Dify Docs, [Tool Plugin](https://docs.dify.ai/en/develop-plugin/dev-guides-and-walkthroughs/tool-plugin)，存取日期：2026-08-28。

最後更新：2026-08-28

## 延伸閱讀

- [Coze：快速產生專屬於你的聊天機器人](/post/coze-chatbot-builder-introduction)：同樣聚焦 聊天機器人、生成式AI，可接著比較不同情境的做法。
- [Dify 開源大語言模型應用開發平台完整介紹](/post/dify-open-source-llm-app-platform)：同樣聚焦 Dify，可接著比較不同情境的做法。
- [在 Dify 內整合 LangSmith](/post/dify-langsmith-integration)：同樣聚焦 Dify，可接著比較不同情境的做法。
`;export{e as default};