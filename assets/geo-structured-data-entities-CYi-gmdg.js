var e=`---
title: "GEO 結構化資料怎麼做？Article、Person、Organization 實體關係教學"
description: "我以個人品牌網站為例，說明 Article、Person、Organization、ProfilePage 與固定 @id 如何串起作者、公司、文章及主題。"
entity: Claire Chang-張可佳
date: 2026-08-28
category: GEO 優化
tags: [結構化資料, Schema.org, JSON-LD, GEO 優化]
readingTime: 10 分鐘
image: /images/articles/hero_geo-structured-data-entities.webp
imageAlt: Article、Person 與 Organization 透過 author、publisher 和 worksFor 形成實體關係
about: [Schema.org, JSON-LD, Article, Person, Organization, 實體關係]
---

GEO 結構化資料的重點不是每頁塞滿 Schema，而是讓同一位作者、同一家公司與每篇文章保持一致關係。我在自己的網站為 Claire Chang 與允愛數位科技建立固定 \`@id\`，文章只引用既有實體，避免每一頁產生一個新的同名作者。

## 結構化資料對 GEO 有什麼幫助？

<div class="answer"><p>結構化資料使用標準詞彙描述頁面類型、作者、發布者、日期與主題，協助搜尋引擎降低理解歧義。結構化資料不能取代正文、來源與專業經驗，也不能保證取得複合式搜尋結果或 AI 引用。</p></div>

Google 說明，結構化資料是描述頁面資訊並分類頁面內容的標準格式；標記應放在其所描述的頁面，而且不得加入頁面上不存在或讀者看不到的內容。[Google 結構化資料介紹](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)

## Article、Person 與 Organization 如何分工？

<div class="answer"><p>Article 描述單篇文章，Person 描述作者，Organization 描述品牌或發布單位。Article 應透過 author 與 publisher 連到既有 Person 和 Organization，而不是把作者及公司只寫成無關聯的文字。</p></div>

| 實體 | 代表內容 | 適合的主要頁面 |
| --- | --- | --- |
| \`Article\` | 一篇文章 | 每篇文章頁 |
| \`Person\` | 作者本人 | 關於作者或個人資料頁 |
| \`Organization\` | 公司或品牌 | 首頁或公司介紹頁 |
| \`ProfilePage\` | 以人物或組織為主體的頁面 | 作者頁、個人介紹頁 |

Google 建議人物使用 \`Person\`、組織使用 \`Organization\`，不要為方便而全部使用泛用的 \`Thing\`。[Google Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article)

## 固定 @id 為什麼重要？

<div class="answer"><p>固定 @id 能讓不同頁面的結構化資料指向同一個網站實體。只要 Claire Chang 與允愛數位科技的 @id 全站一致，搜尋引擎就能把文章作者、公司與個人頁合併理解，而不是視為多個同名物件。</p></div>

我目前採用：

- Claire Chang：\`https://claire-chang.com/#claire-chang\`
- 允愛數位科技：\`https://claire-chang.com/#organization\`

\`@id\` 是識別符，不一定要成為獨立可瀏覽頁面；但實體本身仍應有對應的可見資訊與網址。名稱、職稱與關係若改變，也要同步更新主要實體定義。

## worksFor、author 與 publisher 要怎麼串？

<div class="answer"><p>Person.worksFor 表達作者任職或所屬組織，Article.author 表達文章作者，Article.publisher 表達發布單位。三種關係的方向與意義不同，應分別指向正確 @id，不能互相替代。</p></div>

我網站上的關係可整理為：

| 主體 | 關係 | 指向 |
| --- | --- | --- |
| Claire Chang | \`worksFor\` | 允愛數位科技 |
| Article | \`author\` | Claire Chang |
| Article | \`publisher\` | 允愛數位科技 |

同一組核心 Person 與 Organization 不必在每篇文章完整重寫；文章可以用 \`{"@id":"…"}\` 引用全站一致的實體。這種做法也比較容易集中維護作者職稱、社群連結與公司識別資料。

## 哪些頁面應該放完整 Person 與 Organization？

<div class="answer"><p>個人介紹頁適合完整描述 Person 與 ProfilePage，首頁或公司介紹頁適合完整描述 Organization。文章頁應保留 Article，並以 author、publisher 引用核心實體；不需要每頁都塞入所有詳細欄位。</p></div>

Google 表示，在首頁加入 Organization 結構化資料可協助理解組織行政資訊與消歧。[Google Organization](https://developers.google.com/search/docs/appearance/structured-data/organization) ProfilePage 則適合以人物或組織為主要焦點、呈現第一手觀點的頁面。[Google ProfilePage](https://developers.google.com/search/docs/appearance/structured-data/profile-page)

## about 與 mentions 有什麼差別？

<div class="answer"><p>about 表示文章主要討論的主題，mentions 表示文章提到但不是核心主題的具體實體。兩者都應根據正文內容建立，不能為了增加關鍵字而把未實際討論的工具、公司或技術加入標記。</p></div>

例如本文的 \`about\` 可以包含 Schema.org、JSON-LD 與實體關係；Google Rich Results Test 雖然在文中出現，若只是驗證工具而非核心主題，則較適合 \`mentions\`。

這一節只決定結構化資料如何表達既有主題；如何選主查詢、安排 H2 與建立資訊增益，請參考[〈GEO 文章內容優化教學〉](/post/geo-content-optimization)。

## FAQPage 應該在什麼情況使用？

<div class="answer"><p>只有頁面實際顯示由網站提供的問題與答案時，才應建立 FAQPage。FAQPage 不應標記隱藏內容，也不要期待一般商業網站一定取得 Google FAQ 複合式搜尋結果。</p></div>

Google 目前將 FAQ 複合式搜尋結果的顯示範圍限制在知名且具權威性的政府與健康網站，但準確的問答結構仍有助於機器理解內容。[Google FAQ structured data](https://developers.google.com/search/docs/appearance/structured-data/faqpage)

## 結構化資料要怎麼驗證？

<div class="answer"><p>結構化資料應同時用 Rich Results Test 與 Schema Markup Validator 檢查。前者檢查 Google 支援的搜尋功能，後者檢查較完整的 Schema.org 詞彙；通過驗證仍不代表內容一定顯示為複合式結果。</p></div>

我的驗證順序是先看 JSON-LD 能否解析，再檢查實體關係與頁面可見內容是否一致，最後才看 Google 是否支援該類複合式搜尋結果。

## GEO 結構化資料要怎麼從零規劃？

<div class="answer"><p>GEO 結構化資料應從頁面可見內容與實體清單開始，再選擇頁面類型、建立穩定識別符、連接作者與發布者，最後驗證語法及內容一致性。不要先產生一大段 JSON-LD，再回頭猜每個欄位代表誰。</p></div>

### 步驟一：先做可見內容盤點

列出頁面真的顯示哪些資訊：文章標題、作者、作者頁、發布與更新日期、品牌、圖片、摘要、主要主題與 FAQ。Google 要求結構化資料描述所在頁面的內容，不應標記讀者看不到的資訊。[Google 結構化資料介紹](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)

作者是否具備足夠經驗與專業證據，不在這一步判斷；可信度證據請依[〈E-E-A-T 網站可信度教學〉](/post/eeat-author-trust)盤點，這裡只負責正確描述已確認的事實。

### 步驟二：為每種頁面選一個主體

文章頁主體通常是 \`Article\` 或 \`BlogPosting\`；作者介紹頁可用 \`ProfilePage\` 搭配 \`Person\`；首頁或公司介紹頁可描述 \`Organization\`。類型越具體越好，但必須符合頁面真正用途。

### 步驟三：建立全站實體登錄表

我會先維護一張表，固定每個核心實體的名稱、替代名稱、\`@id\`、正式網址與關係。這一步能避免同一位作者在不同文章被建立成多個互不相連的 \`Person\`。

| 實體 | 主要名稱 | 固定識別 | 主要關係 |
| --- | --- | --- | --- |
| 作者 | Claire Chang | \`https://claire-chang.com/#claire-chang\` | \`worksFor\` 允愛數位科技 |
| 組織 | 允愛數位科技 | \`https://claire-chang.com/#organization\` | 發布網站與文章 |
| 單篇文章 | 文章標準網址 | 每篇唯一網址 | \`author\`、\`publisher\`、\`isPartOf\` |

### 步驟四：先連關係，再補屬性

先確認 Article → author → Person、Article → publisher → Organization、Person → worksFor → Organization 的方向正確，再補圖片、日期、摘要與 \`sameAs\`。關係錯誤時，欄位再多也只會增加衝突。

### 步驟五：區分主題與順帶提及

只有文章真正主要解釋的概念才放進 \`about\`；只是範例、工具或比較對象則視網站規則放入 \`mentions\`。兩者都不應拿來堆關鍵字。

### 步驟六：用兩種驗證器與人工比對

先用 Schema Markup Validator 看 Schema.org 語法與關係，再用 Rich Results Test 看 Google 支援的搜尋功能。最後人工逐項對照頁面可見內容；驗證器通過，不代表資料真實或一定取得複合式結果。[Google 結構化資料測試工具](https://developers.google.com/search/docs/appearance/structured-data)

## 如何建立結構化資料關係表？

<div class="answer"><p>結構化資料關係表把「哪個頁面描述哪個實體、用什麼名稱與識別符、連到誰」集中管理。它比逐頁複製程式碼更能避免重複作者、名稱漂移與 publisher 指向錯誤。</p></div>

可直接複製以下欄位到試算表：

| 頁面網址 | 頁面主體類型 | 主體名稱 | 主體 @id | author 指向 | publisher 指向 | about | 可見證據 | 驗證結果 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 待填 | Article | 待填 | 待填 | Person @id | Organization @id | 3～6 個核心主題 | 作者、日期、正文 | 待驗證 |

## GEO 結構化資料檢核表

<div class="answer"><p>結構化資料檢核應同時確認語法、實體唯一性、關係方向與可見內容一致性。真正高風險的問題通常是資料互相矛盾，而不是少填一個建議欄位。</p></div>

- [ ] 每個頁面類型符合頁面實際用途。
- [ ] Article 的標題、摘要、日期、圖片與頁面可見內容一致。
- [ ] 同一 Person 與 Organization 全站使用固定名稱及 \`@id\`。
- [ ] Article.author 指向正確 Person。
- [ ] Article.publisher 指向正確 Organization。
- [ ] Person.worksFor 的方向與實際關係一致。
- [ ] 作者名稱連到可辨識作者的頁面；作者頁資訊完整。
- [ ] \`sameAs\` 只放能確認同一實體的官方外部頁面。
- [ ] \`about\` 與 \`mentions\` 均可從正文找到證據。
- [ ] FAQPage 只標記頁面實際顯示的問答。
- [ ] canonical、Article URL 與主要圖片 URL 使用正確標準網址。
- [ ] 通過 Schema Markup Validator 與適用的 Rich Results Test。
- [ ] 沒有因模板產生重複、空白或互相衝突的物件。

## 如何請 AI 檢查既有結構化資料？

<div class="answer"><p>請 AI 檢查結構化資料時，要同時提供 JSON-LD 與頁面可見文字，並要求它分開檢查語法、關係及真實性。只貼 JSON-LD，AI 無法判斷標記是否與頁面內容一致。</p></div>

\`\`\`text
你是 Schema.org 與 GEO 結構化資料稽核員。請檢查下列資料，但不要直接新增不存在的事實。

頁面網址：[網址]
頁面類型與用途：[文章／作者頁／首頁／服務頁]
頁面可見文字：[貼上標題、作者、日期、摘要、正文與 FAQ]
既有 JSON-LD：[貼上]
全站核心實體表：[貼上 Person、Organization 的名稱與固定 @id]

請輸出四部分：
1. 語法與型別問題。
2. 實體是否重複、@id 是否穩定、關係方向是否正確。
3. JSON-LD 與可見內容不一致或無證據的欄位。
4. 依風險排序的修改建議與驗收方式。

用表格標示：項目｜結果（通過／錯誤／無法驗證）｜證據｜建議。
不得把通過驗證描述成排名、複合式結果或 AI 引用保證。
\`\`\`

## 想要我用的 GEO SKILLS 嗎？

<div class="answer"><p>這篇文章的寫作、結構化資料與上線前檢查，背後是我實際在用的三套 GEO SKILLS。加我的 LINE 官方帳號免費索取，告訴我想要哪一套，之後也會陸續收到更多 AI 應用教學資訊。</p></div>

**[加 LINE 免費索取 GEO SKILLS →](https://line.me/R/ti/p/@maz3267h)**

## GEO 結構化資料常見問題

<div class="answer"><p>結構化資料最常見的錯誤不是少放欄位，而是建立重複實體、使用錯誤類型或標記頁面沒有的內容。先確保關係正確與資料真實，再增加建議欄位。</p></div>

### 每篇文章都要建立新的 Person 嗎？

不用。同一作者應使用一致 \`@id\`，讓不同 Article 指向同一 Person。

### publisher 可以直接填公司名稱字串嗎？

Schema.org 雖允許不同表達方式，但個人品牌網站若已建立 Organization，使用固定 \`@id\` 引用會有更一致的實體關係。

### sameAs 可以放任何社群連結嗎？

\`sameAs\` 應放能確認同一人物或組織身分的官方外部頁面，不應放一般文章、合作夥伴或無法驗證身分的頁面。

### 結構化資料錯誤會影響一般排名嗎？

Google 說明，結構化資料人工處置會使頁面失去複合式結果資格，但不等同直接影響一般網頁排名。[Google 結構化資料規範](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)

### JSON-LD 一定比 Microdata 好嗎？

Google 支援 JSON-LD、Microdata 與 RDFa，並普遍建議 JSON-LD。選擇格式後，最重要的是資料與可見內容保持同步。

## 參考資料

<div class="answer"><p>本文以 Google Search Central 與 Schema.org 的結構化資料定義為主要依據，實體關係範例則來自 claire-chang.com 當前網站架構。</p></div>

- [Google：Introduction to structured data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [Google：Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Google：Organization structured data](https://developers.google.com/search/docs/appearance/structured-data/organization)
- [Google：ProfilePage structured data](https://developers.google.com/search/docs/appearance/structured-data/profile-page)
- [Schema.org Article](https://schema.org/Article)
- [Schema.org Person](https://schema.org/Person)
- [Schema.org Organization](https://schema.org/Organization)

## 延伸閱讀

- [E-E-A-T 怎麼強化？讓 AI 與搜尋引擎看懂作者專業度](/post/eeat-author-trust)：Person 與作者頁如何互相支撐，這篇有完整的可信度說明。
- [如何讓文章更容易被 AI 搜尋引擎理解與引用？GEO 內容優化教學](/post/geo-content-optimization)：結構化資料之外，內容本身如何做到可獨立理解。
- [網站 GEO 技術優化怎麼做？從索引、canonical 到 AI 爬蟲完整檢查](/post/geo-technical-optimization)：結構化資料之外，這篇確認爬蟲能否先拿到頁面內容。
- [免費 GEO 檢測工具推薦：用 AI、Search Console、Bing 與 PageSpeed 檢查網站](/post/free-geo-audit-tools)：結構化資料做完後，可以用這篇的工具驗證是否真的被辨識。
- [AI 搜尋引擎優化怎麼做？技術文章寫得夠專業，為什麼 AI 還是不引用](/post/why-ai-does-not-cite-technical-blog)：Schema 做對了，還是可能遇到的引用落差，這篇有具體原因分析。
- [GEO 文章從寫作到上線需要哪些 SKILLS？我實際使用的 3 套流程](/post/geo-skills-writing-schema-audit)：本文的結構化資料落地方式，對應這篇介紹的第二套 SKILL。

## 作者

<div class="answer"><p>本文由張可佳撰寫，內容來自我重新建立 Claire Chang、允愛數位科技與網站文章之間固定實體關係的實作經驗。</p></div>

張可佳（Claire Chang）是企業 AI 導入與流程轉型顧問，擁有 19 年軟體工程經驗。

**最後更新：** 2026-08-28
`;export{e as default};