var e=`---
title: "了解 LLM 的函數調用 Function Calling"
description: "說明 LLM function calling 的運作原理、實際用途，並用天氣查詢範例示範如何串接外部 API。"
date: 2024-10-10
category: 生成式AI
tags: [Function Calling, LLM, OpenAI, API 整合]
readingTime: 8 分鐘
image: /images/tech/hero_llm-function-calling.webp
imageAlt: 螢幕上顯示程式碼，象徵 LLM function calling 串接外部 API
---


# 了解 LLM 的函數調用 Function Calling

## Function calling 是什麼？

Function calling 讓 LLM 在對話過程中自己判斷要不要呼叫一個事先定義好的函數，再把函數執行的結果組織成回答交給使用者。這件事之所以重要,是因為模型本身只認識訓練當下凍結的知識——它答不出「現在」的天氣、股價或庫存,除非有辦法把外部世界的即時資料接進來。Function calling 就是這條接線。

整個流程大致是這樣跑的：

1. **使用者提問**：使用者輸入一句話，模型判斷這句話背後需要調用某個函數才能回答。
2. **函數觸發**：模型解析輸入內容，決定該叫哪一個函數。
3. **函數執行**：模型輸出一個包含函數名稱與參數的 JSON，實際的呼叫則由開發者的程式碼去執行。
4. **回應交付**：函數執行完的結果丟回給模型，模型再用自然語言把結果講給使用者聽。

官方文件在這裡：[OpenAI Actions 介紹](https://platform.openai.com/docs/actions/introduction)，中文版可以看[這份翻譯文件](https://openai.xiniushu.com/docs/plugins/getting-started)。

## Function calling 能拿來做什麼？

四種最常見的場景：

- **查詢即時資料回答問題**：例如「伯利茲的天氣怎麼樣？」會被轉換成類似 \`get_current_weather(location: string, unit: 'celsius' | 'fahrenheit')\` 的函數呼叫。
- **抽取與標記資料**：例如從一篇維基百科文章裡把人名都抓出來。
- **把自然語言轉成 API 呼叫或資料庫查詢**：讓使用者用講的就能觸發後端操作，不用自己寫查詢語法。
- **對話式知識檢索**：讓模型可以邊聊邊查知識庫，而不是只能回答訓練資料裡背過的內容。

## 怎麼實作一個 function calling 範例？

拿「查詢台北市今天天氣」當例子最直觀。一般 LLM 回答不了這種即時性問題,因為訓練資料本來就不含當下的天氣。解法是把模型的 function calling 能力和外部工具接起來——讓模型自己決定要呼叫哪個函數、帶什麼參數,實際的資料抓取交給你寫的程式去做,模型只負責把結果組成人話。

假設使用者問：

> 台北市今天的天氣如何

要接上外部 API，得先在模型的介面裡「註冊」這些函數，把函數的用途和參數說明一併傳給模型，模型才有辦法在對的時機挑出對的函數。這篇範例用的是公開的 [Weather.gov API](https://www.weather.gov/documentation/services-web-api)，拿到預報要分兩步：

1. 把經緯度丟給 \`api.weather.gov/points\`，換回 WFO（天氣預報辦公室代碼）、grid-X、grid-Y 三個座標值。
2. 把這三個值丟進 \`api.weather.gov/forecast\`，才拿得到該座標對應的天氣預報。

下面是這兩支 API 的 OpenAPI 3.1 schema，定義了每個 endpoint 要收什麼參數、回什麼格式：

\`\`\`yaml
openapi: 3.1.0
info:
  title: NWS Weather API
  description: Access to weather data including forecasts, alerts, and observations.
  version: 1.0.0
servers:
  - url: https://api.weather.gov
    description: Main API Server
paths:
  /points/{latitude},{longitude}:
    get:
      operationId: getPointData
      summary: Get forecast grid endpoints for a specific location
      parameters:
        - name: latitude
          in: path
          required: true
          schema:
            type: number
            format: float
          description: Latitude of the point
        - name: longitude
          in: path
          required: true
          schema:
            type: number
            format: float
          description: Longitude of the point
      responses:
        '200':
          description: Successfully retrieved grid endpoints
          content:
            application/json:
              schema:
                type: object
                properties:
                  properties:
                    type: object
                    properties:
                      forecast:
                        type: string
                        format: uri
                      forecastHourly:
                        type: string
                        format: uri
                      forecastGridData:
                        type: string
                        format: uri

  /gridpoints/{office}/{gridX},{gridY}/forecast:
    get:
      operationId: getGridpointForecast
      summary: Get forecast for a given grid point
      parameters:
        - name: office
          in: path
          required: true
          schema:
            type: string
          description: Weather Forecast Office ID
        - name: gridX
          in: path
          required: true
          schema:
            type: integer
          description: X coordinate of the grid
        - name: gridY
          in: path
          required: true
          schema:
            type: integer
          description: Y coordinate of the grid
      responses:
        '200':
          description: Successfully retrieved gridpoint forecast
          content:
            application/json:
              schema:
                type: object
                properties:
                  properties:
                    type: object
                    properties:
                      periods:
                        type: array
                        items:
                          type: object
                          properties:
                            number:
                              type: integer
                            name:
                              type: string
                            startTime:
                              type: string
                              format: date-time
                            endTime:
                              type: string
                              format: date-time
                            temperature:
                              type: integer
                            temperatureUnit:
                              type: string
                            windSpeed:
                              type: string
                            windDirection:
                              type: string
                            icon:
                              type: string
                              format: uri
                            shortForecast:
                              type: string
                            detailedForecast:
                              type: string
\`\`\`

模型會先看 schema 最上面的 \`info\`（尤其是 \`description\`），判斷這個 API 跟使用者的問題有沒有關係；再往下看每個 path 定義了哪些操作。\`parameters\` 那一段則負責告訴模型每個欄位實際代表什麼——比如 \`office\` 這個參數,schema 裡寫明是「天氣預報辦公室 (WFO)」,模型看到這行說明才知道該塞什麼值進去。

實際查詢時，\`/points\` API 回傳的結果長這樣：

\`\`\`json
{
    "latitude": 38.9072,
    "longitude": -77.0369
}
\`\`\`

再丟進 \`/forecast\` API，換回這三個座標：

\`\`\`json
{
    "wfo": "LWX",
    "x": 97,
    "y": 71
}
\`\`\`

實際在瀏覽器或 API 測試工具裡跑起來,兩支 API 的請求與回傳大概長這樣：

![weather.gov 的 points 與 forecast API 呼叫範例](/images/tech/function-calling-api-schema.webp)

## 手寫 OpenAPI schema 太累怎麼辦？

不想自己一行一行刻 YAML,OpenAI 提供了一個專門做這件事的 GPT：[ActionsGPT](https://chatgpt.com/g/g-TYEliDU6A-actionsgpt)。餵給它一份文件、一段 curl 指令，或直接描述 API 怎麼用，它就能生出對應的 OpenAPI schema 草稿。

![ActionsGPT 的操作介面，可貼上文件或 curl 指令生成 OpenAPI schema](/images/tech/function-calling-actionsgpt.webp)

## 怎麼測試寫好的 API schema？

寫完 schema 別急著接上模型,先用 [Postman](https://www.postman.com/) 跑一遍。免費註冊、錯誤訊息給得夠細、驗證方式支援得也全,而且可以直接匯入寫好的 OpenAPI 檔案,不用自己重新建 request：

![Postman 匯入 OpenAPI schema 的選項畫面](/images/tech/function-calling-postman-import.webp)

如果 API 需要驗證（API Key、OAuth 之類的），可以參考官方的[身份驗證文件](https://platform.openai.com/docs/actions/authentication)，裡面列了幾種常見的驗證方式怎麼接。

## 常見問題

### Function calling 和一般的 API 呼叫有什麼不同？

一般 API 呼叫是開發者自己在程式裡寫死「什麼時候呼叫哪個函數」；function calling 則是把決策權交給模型——模型讀了使用者的話之後,自己判斷要不要呼叫、呼叫哪一個、帶什麼參數。實際發送 HTTP 請求的動作仍然是開發者的程式在做,模型只負責產生呼叫的意圖跟參數。

### 沒有 function calling，LLM 就完全查不到即時資料嗎？

對,純粹的 LLM 本身答不出訓練資料截止之後的事情。要嘛透過 function calling 接外部 API,要嘛用其他檢索方式（例如 RAG）把最新資料塞進 prompt,兩者思路不同但目的一樣：把模型不知道的東西想辦法餵給它。

## 參考資料
1. OpenAI 官方文件，Function calling / tool calling 指南，說明工具定義、呼叫流程與 JSON schema 寫法，存取日期：2026-08-27。[https://developers.openai.com/api/docs/guides/function-calling](https://developers.openai.com/api/docs/guides/function-calling)
2. National Weather Service，Weather.gov API 文件，範例中查詢天氣預報所使用的公開 API 說明，存取日期：2026-08-27。[https://www.weather.gov/documentation/services-web-api](https://www.weather.gov/documentation/services-web-api)

## 延伸閱讀

- [Prompt Engineering 提示工程：獲得更好 LLM 輸出的六大策略](/post/prompt-engineering-techniques)：同樣聚焦 LLM、OpenAI，可接著比較不同情境的做法。
- [Prompt engineering 提示工程：獲得更好結果的六種策略](/post/prompt-engineering-six-strategies)：同樣聚焦 LLM、OpenAI，可接著比較不同情境的做法。
- [OpenAI o1-preview 介紹：推理模型帶來什麼改變？](/post/openai-o1-preview-introduction)：同樣聚焦 OpenAI、LLM，可接著比較不同情境的做法。
`;export{e as default};