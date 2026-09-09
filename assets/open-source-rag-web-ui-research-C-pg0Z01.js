var e=`---
title: 開源RAG網頁套件研究：Open WebUI、LibreChat 等 6 款自託管 LLM 介面比較
description: 整理 Open WebUI、Hollama、LoLLMs、BionicGPT、LibreChat、LLMStack 等 6 款開源 RAG 網頁套件的核心功能、本地部署與企業級特性，幫你快速選出適合的自託管 LLM WebUI。
date: 2024-07-24
category: 生成式AI
tags: [RAG, Open WebUI, LibreChat, LLM, 開源工具]
readingTime: 11 分鐘
image: /images/tech/hero_open-source-rag-web-ui-research.webp
imageAlt: 筆記型電腦上顯示聊天介面的開源 AI 工具畫面
---


# 開源RAG網頁套件研究：Open WebUI、LibreChat 等 6 款自託管 LLM 介面比較

想把本地 LLM 接上一個好用的網頁介面，並加入 RAG（檢索增強生成）能力，其實有很多開源選項。這篇整理我研究過的 6 款開源 RAG 網頁套件：Open WebUI、Hollama、LoLLMs Webui、BionicGPT、LibreChat 和 LLMStack，從個人用的輕量 WebUI 到企業級的資料隱私方案都有，給正在選型的人一個快速比較的切入點。

## 哪一款開源 WebUI 功能最完整？Open WebUI 是什麼？

Github位置: [https://github.com/open-webui/open-webui](https://github.com/open-webui/open-webui)

Open WebUI 是一種可擴展、功能豐富且使用者友好的自託管 WebUI，旨在完全離線運行。它支援各種 LLM 運行器，包括 Ollama 和 OpenAI 相容的 API。有關更多資訊，請查看：[https://docs.openwebui.com/](https://docs.openwebui.com/)

![Open WebUI 介面示範](/images/articles/open-source-rag-web-ui-research-1.webp)

Open WebUI 的主要功能：

- Ollama/OpenAI API 集成：毫不費力地集成與 OpenAI 相容的 API，以實現與 Ollama 模型一起進行的多功能對話。自定義 OpenAI API URL 以連結到 LMStudio、GroqCloud、Mistral、OpenRouter 等。
- Pipelines、Open WebUI 外掛程式支援：使用 Pipelines 外掛程式框架將自定義邏輯和 Python 庫無縫集成到 Open WebUI 中。啟動您的 Pipelines 實例，將 OpenAI URL 設置為 Pipelines URL，並探索無限的可能性。示例包括函數調用、用於控制訪問的用戶速率限制、使用 Langfuse 等工具進行使用監控、使用 LibreTranslate 進行即時翻譯以實現多語言支援、有毒消息過濾等等。
- 網頁，支援 PWA、回應式設計：在台式電腦、筆記型電腦和行動裝置上享受無縫體驗。
- 免提語音/視頻通話：通過集成的免提語音和視頻通話功能體驗無縫通信，從而實現更加動態和互動的聊天環境。
- 模型生成器：通過 Web UI 輕鬆創建 Ollama 模型。通過 Open WebUI 社區集成，輕鬆創建和添加自定義角色/代理、自定義聊天元素和導入模型。
- 本機 Python 函數調用工具：通過工具工作區中的內置代碼編輯器支援來增強您的 LLMs 功能。只需添加純 Python 函數，即可自帶函數（BYOF），從而實現與 LLMs 的無縫集成。
- 本地 RAG 整合：通過突破性的檢索增強生成（RAG）支援，深入瞭解聊天交互的未來。此功能將文檔交互無縫集成到您的聊天體驗中。您可以將文件直接載入到聊天中或將檔案添加到文件庫中，在查詢之前使用 \`#\` 命令輕鬆訪問它們。
- RAG 的 Web 搜尋：使用 SearXNG、Google PSE、Brave Search、serpstack、serper、Serply、DuckDuckGo 和 TavilySearch 等提供程式執行 Web 搜尋，並將結果直接注入到您的聊天體驗中。
- Web 瀏覽功能：使用後跟 URL 的命令將網站無縫集成到您的聊天體驗中。此功能允許您將 Web 內容直接合併到您的對話中，從而增強交互的豐富性和深度。
- 圖像生成集成：使用 AUTOMATIC1111 API 或 ComfyUI（本地）和 OpenAI 的 DALL-E（外部）等選項無縫整合圖像生成功能，通過動態視覺內容豐富您的聊天體驗。
- 多種模型對話：毫不費力地同時與各種模型互動，利用它們的獨特優勢獲得最佳回應。通過並行利用一組不同的模型來增強您的體驗。
- 基於角色的訪問控制（RBAC）：確保具有受限許可權的安全訪問；只有經過授權的個人才能訪問您的 Ollama，並且為管理員保留了獨佔的模型創建/拉取許可權。

## 需要極簡介面跟 Ollama 聊天？Hollama 適合你嗎？

Github位置：[https://github.com/fmaclen/hollama](https://github.com/fmaclen/hollama)

線上 DEMO: [https://hollama.fernando.is](https://hollama.fernando.is)

用於與 Ollama 伺服器通訊的最小 Web UI。

![Hollama 的 session 畫面](/images/articles/open-source-rag-web-ui-research-2.webp)

Hollama 的主要功能：

- 具有代碼編輯器功能的大型 prompt 輸入框
- Markdown 解析，帶語法高亮顯示
- 輕鬆將 Markdown 複製為原始文字
- 可自定義的系統提示
- 保存瀏覽器上 \`localStorage\` 的所有更改
- 桌面和移動友好的佈局
- 淺色和深色主題
- 支援重新產出答案以及流式輸出

## LoLLMs Webui 能做哪些事？

LoLLMs Webui 是一個基於 Web 的用戶介面，用來運行和管理大型語言模型（Large Language Models，簡稱 LLMs）。它提供了一個友好的界面，讓使用者能夠輕鬆地與各種大型語言模型互動，進行文本生成、對話、翻譯等操作。這個 Webui 通常用於研究和開發人員，需要處理自然語言處理任務的專業人員，或任何對語言模型有興趣的人。

lollms v6 支持文本生成，例如自動寫詩，並允許用戶在「遊樂場」應用中測試不同的文本完成任務。此外，用戶可以進行討論和創建自定義預設以應對特定任務。

![LoLLMs Webui 介面](/images/articles/open-source-rag-web-ui-research-3.webp)

LoLLMs Webui 的主要功能：

1. **模型選擇**：允許使用者選擇和切換不同的語言模型。
2. **文本生成**：根據用戶輸入的提示生成文本。
3. **對話系統**：進行類似於聊天機器人的對話。
4. **多語言支持**：支持多種語言的文本生成和翻譯。
5. **性能監控**：提供模型運行的性能數據和使用統計。
6. **擴展和自定義**：允許用戶添加自定義模型和擴展功能。

## 企業導入自託管 LLM 首選？BionicGPT 有什麼企業級功能？

Github頁面: [https://github.com/bionic-gpt/bionic-gpt](https://github.com/bionic-gpt/bionic-gpt)

BionicGPT 是 ChatGPT 的本地替代品，提供生成式 AI 的優勢，同時保持嚴格的數據機密性。BionicGPT 可以在您的筆記型電腦上運行或擴展到數據中心。

![BionicGPT 的 GitHub Readme 畫面](/images/articles/open-source-rag-web-ui-research-4.webp)

BionicGPT 的主要功能：

- 在幾秒鐘內本地運行 Gen AI：嘗試 Docker Compose 安裝，適合本地運行 AI 和小型試點項目。
- 熟悉的聊天體驗：聊天介面借鑒了 ChatGPT，確保使用者友好的體驗。仿生主題完全可定製，提供快速回應的性能，並支援聊天記錄管理。
- AI 助手（檢索增強產生）：用戶可以創建使用自己的數據來增強 AI 的助手，並在團隊中無縫共享。助手是企業級 RAG 管道，支援多種格式文件，並可通過 UI 進行無代碼配置。
- 團隊功能：利用團隊設置最大化效果，支持邀請和管理團隊成員。用戶可以在團隊之間切換，保持數據隔離，並使用 SSO 系統配置訪問權限。
- 縱深防禦安全：CI/CD 管道運行 SAST 測試，並在 Postgres 中使用行級別安全性。內容安全策略處於最高級別，容器構建和運行具備安全保障，並支持 SIEM 集成和機密管理。
- 可觀察性和報告：與 Prometheus 相容的可觀測性 API，使用 Grafana 創建儀錶板，所有問題和回復都記錄在 Postgres 資料庫中。
- 令牌使用限制和控制：設置令牌使用限制，保護模型不過載，通過反向代理和角色基於限制確保公平使用。
- 將 AI 助手轉變為 API：任何助手都可以轉換為相容 OpenAI 的 API，並支持 API 金鑰管理和限制。
- 使用 GuardRails 管理數據治理：將規則應用於批量和流式數據管道，抵禦提示注入攻擊等多種威脅。
- 本地或遠端大型語言模型：支援在本地或數據中心運行的開源模型，支持多模型管理和無縫切換。
- 基於角色的訪問控制：根據 IAM 系統中的角色授予或限制功能訪問權限，確保數據安全。
- 數據集成：通過 Airbyte 集成，批量上傳數據，並支援手動上傳和即時數據捕獲，確保數據不洩露。
- 部署到裸機或雲端：使用 Kubernetes 無縫安裝，定期更新和引入新功能以改進 Bionic。

## LibreChat 有哪些特色功能？

LibreChat 將助理 AI 的未來與 OpenAI 的 ChatGPT 的革命性技術相結合。相容遠端和本地 AI 服務：groq、Ollama、Cohere、Mistral AI、Apple MLX、koboldcpp、OpenRouter、together.ai、Perplexity、ShuttleAI 等。

**RAG API:** [github.com/danny-avila/rag_api](https://github.com/danny-avila/rag_api)

![LibreChat 介面畫面](/images/articles/open-source-rag-web-ui-research-5.webp)

LibreChat 的主要功能：

1. **語音轉文字和文字轉語音功能**：用戶可以透過語音與系統互動，系統能夠識別語音並回應，也能將文字信息轉換為語音輸出。
2. **共享連結功能**：允許用戶創建訊息的共享連結，並將共享訊息在創建時固定，確保即使後來有新訊息添加，共享的內容也不會變更。更新共享訊息只需重新生成連結。
3. **電子郵件驗證和密碼重設**：增加註冊和登入的安全性，用戶可以通過驗證電子郵件地址來保護帳戶安全，並支持通過電子郵件重設密碼。
4. **搜索功能增強**：改進了搜索功能，使用戶更容易在聊天記錄中找到特定的信息。
5. **初步支持 OpenAI 助理 V2**：包括支持 GPT-4.0，原生圖像視覺支持，以及由 LibreChat 支持的圖像和代碼解釋功能。
6. **增強的隱私保護**：用戶可以設定只顯示自己創建或沒有作者的助理，這在使用共享 API 密鑰的環境中尤為重要，以防止用戶間的信息洩露。
7. **LDAP 支持**：支持輕量級目錄訪問協議（LDAP）服務器認證，方便組織管理對 LibreChat 的訪問。
8. 可以從 LibreChat、ChatGPT、Chatbot UI 導入對話

## 不寫程式也能打造 AI 代理？LLMStack 怎麼做到的？

LLMStack 是一個強大的生成式 AI 平台，旨在簡化 AI 應用的構建和部署。無需編寫任何代碼，您就可以構建多種 AI 代理，並將它們連接到您的內部或外部工具，進行網頁搜索或互聯網瀏覽。這是一個專為現代業務需求設計的全面解決方案。

![LLMStack 平台畫面](/images/articles/open-source-rag-web-ui-research-6.webp)

LLMStack 的主要功能：

- **代理**：構建生成式 AI 代理，如 AI SDR、研究分析師、RPA 自動化等，無需編寫任何代碼。將代理連接到您的內部或外部工具，搜索 Web 或與代理一起瀏覽互聯網。
- **連結多個模型**：LLMStack 允許您將多個 LLMs 模型連結在一起，以構建複雜的生成式 AI 應用程式。
- **對您的數據使用生成式 AI**：將您的數據導入帳戶，並在 AI 鏈中使用它。LLMStack 支援從各種來源（如 gdrive、notion、網站、直接上傳等）導入多種類型的數據（如 CSV、TXT、PDF、DOCX、PPTX 等）。平台將自動進行預處理和向量化，並將數據存儲在開箱即用的向量資料庫中。
- **無代碼構建器**：LLMStack 帶有一個無代碼構建器，允許您在沒有任何編碼經驗的情況下構建 AI 鏈。您可以將多個 LLMs 連結在一起，並將它們連接到您的數據和業務流程。
- **部署到雲端或本地**：LLMStack 可以部署到雲端或本地。您可以將其部署到您自己的基礎架構中，或使用雲產品 Promptly。
- **API 訪問**：使用 LLMStack 構建的應用程式或聊天機器人可以通過 HTTP API 訪問。您還可以從 Slack 或 Discord 觸發您的 AI 鏈。
- **多租戶**：LLMStack 是多租戶的。您可以建立多個組織並向其中添加使用者。使用者只能訪問屬於其組織的數據和 AI 鏈。

## 常見問題

### 什麼是 RAG 網頁套件？

RAG 網頁套件是提供聊天網頁介面並內建檢索增強生成（Retrieval-Augmented Generation）能力的自託管工具，讓你可以把本地文件餵給 LLM，在對話中直接查詢文件內容，而不需要把資料交給外部雲端服務。

### 自託管 LLM WebUI 可以完全離線運行嗎？

可以。像 Open WebUI 這類工具設計上就支援完全離線運行，搭配 Ollama 等本地 LLM 運行器，模型推論、文件檢索都在自己的機器上完成，適合對資料隱私有要求的場景。

### 個人使用與企業使用應該怎麼選？

個人使用建議從 Open WebUI 或 Hollama 開始，安裝簡單、功能足夠；企業導入則優先考慮 BionicGPT 或 LibreChat，它們具備團隊管理、SSO、RBAC、審計日誌與資料隔離等企業級功能。

### BionicGPT 和一般聊天 WebUI 有什麼不同？

BionicGPT 專注在企業級需求：數據機密性、行級別安全、SIEM 集成、GuardRails 資料治理，以及能把 AI 助手一鍵轉成相容 OpenAI 的 API，適合要正式部署給團隊使用的組織。

### LLMStack 真的不用寫程式嗎？

是的。LLMStack 提供無代碼構建器，用拖放方式把多個 LLM 連結成 AI 鏈，並可連接內外部工具、導入各種格式的文件做向量化，構建完成的應用還能透過 HTTP API 或 Slack/Discord 觸發。

## 參考資料

- [Open WebUI GitHub](https://github.com/open-webui/open-webui)
- [Open WebUI 官方文件](https://docs.openwebui.com/)
- [Hollama GitHub](https://github.com/fmaclen/hollama)
- [BionicGPT GitHub](https://github.com/bionic-gpt/bionic-gpt)
- [LibreChat RAG API](https://github.com/danny-avila/rag_api)

## 延伸閱讀

- [開源 RAG 網頁套件研究：Open WebUI、Hollama、BionicGPT 等 6 款自託管 LLM 介面比較](/post/open-source-rag-web-ui-research)：同樣聚焦 RAG、LLM，可接著比較不同情境的做法。
- [檢索增強生成（RAG）如何讓 LLM 回答更準確](/post/retrieval-augmented-generation)：同樣聚焦 RAG、LLM，可接著比較不同情境的做法。
- [RAPTOR 是什麼？基於樹狀結構的 RAG 方法](/post/raptor-tree-structured-rag-method)：同樣聚焦 RAG、LLM，可接著比較不同情境的做法。

## 最後更新

2026年8月28日（原文發布於 2024-07-24，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};