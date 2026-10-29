var e=`---
title: AI 讓寫程式變便宜，系統開發的成本為什麼沒有跟著降？
description: 從員工用 AI 做出 Dashboard 的談案經驗，談寫程式變便宜後，系統開發成本為什麼不一定下降，以及需求、分工與審查怎麼調整。
entity: Claire Chang-張可佳
pinned: true
date: 2026-10-19
category: Vibe Coding
tags: [AI 輔助開發, 客製化系統開發, AI 陪跑, 敏捷開發]
readingTime: 6 分鐘
image: /images/articles/hero_ai-development-capability-transfer.webp
imageAlt: 業務員工與核心工程師共同檢視內部平台並討論需求
about: [AI 輔助開發, 企業內部系統, 需求釐清, 開發成本]
---

# AI 讓寫程式變便宜，系統開發的成本為什麼沒有跟著降？

AI 讓寫程式變便宜，但系統開發的總成本不一定跟著降：瓶頸移到了需求釐清、角色分工與審查驗收。要讓成本真的降下來，需求、分工與文件都得配合 AI 的開發方式調整。

## AI 讓寫程式變便宜，系統開發的成本為什麼沒有跟著降？

前幾天去談案子，客戶拿出一個員工做的 Dashboard，也就是資料儀表板，告訴我：那位員工完全不會寫程式，卻已經可以做出這樣的成果。

他認為，現在寫程式真的變容易了。因此，如果要請我開發他們內部使用的系統，希望我透過 AI 降低開發成本，提出更便宜的價格。

這個期待，我可以理解。

當企業親眼看見不會寫程式的員工也能做出工具，自然會重新評估：過去需要付費委外的工作，現在還需要投入多少預算？

我提出了陪跑計畫，但客戶接著說，他們找一般系統整合商開發軟體，對方也會盡量把成品做到讓他們滿意。即使一開始報價較高，對大公司而言，最後成果令人滿意，依然非常重要。

我同意。只是這次對話也讓我想把一件事說清楚：寫程式變便宜，只是整個系統開發的其中一段變便宜。成本會降多少，要看瓶頸在哪裡，而我的看法是，瓶頸多半已經不在寫程式這一段。

<div class="answer"><p>寫程式變便宜後，瓶頸移到需求釐清、分工與審查驗收。精簡人力讓需求更容易模糊，AI 只好依自己的模式補完，周邊角色沒有配合時，返工與審查會吃掉省下的時間，總成本就降不下來。</p></div>

先看傳統委外開發是怎麼運作的。

需求通常不是一開始就清楚的。企業與開發團隊來回溝通、開會、確認範圍，需求在這個過程裡逐漸成形。這段溝通很花時間，但它同時也是需求被釐清的過程。

所以我認為，傳統開發很難因為某一段工作變快，就讓總價大幅下降。溝通與釐清需求的成本還在，瓶頸本來就不只在寫程式。

改用 Vibe Coding、又想精簡人力時，情況會不一樣。

少了專職的需求訪談、專案管理或系統分析，需求常常用一兩句話就交給 AI。需求比較模糊時，AI 不一定會停下來追問，而是用自己的一套做法把空白補起來，包括挑技術、設計資料結構與流程。[Pluralsight 的文章](https://www.pluralsight.com/resources/blog/software-development/spec-driven-development-with-AI-SDD)描述過類似狀況：不同開發者的 AI agent 各自選了不同的登入驗證方式，事後審查時，沒有人說得出為什麼這樣決定，因為決定是在一個已經不存在的對話裡做的。

如果其他角色沒有按照「讓 AI 最好開發」的方式配合，例如需求沒有寫成可驗收的條件、流程變動沒有同步、驗收仍靠事後口頭說明，AI 做出來的東西就容易和預期不一致。結果是返工、重新審查、再來回溝通，省下的寫程式時間又被補回去。這是我對這類專案的觀察。

| 比較項目 | 傳統委外開發 | 精簡人力的 Vibe Coding |
| --- | --- | --- |
| 需求如何成形 | 靠來回溝通與確認，逐步釐清 | 常以簡短描述交給 AI，較容易留下空白 |
| 需求模糊時 | 人員會追問、開會確認 | AI 傾向自行補完，要靠人事後發現與修正 |
| 成本集中的地方 | 溝通、協調與實作 | 返工、審查與驗收 |
| 想降低成本需要 | 縮短溝通與實作時間 | 先把需求寫成可驗收的條件，周邊角色配合 |

表格是本文的整理，實際情況依專案規模與團隊而異。

<figure>
<svg viewBox="0 0 1100 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="寫程式變便宜後的兩種結果：需求變模糊、AI 自行補完、返工與審查增加，總成本沒有降；先把需求寫成可驗收條件、周邊角色配合、核心工程師審查，總成本才有機會降" style="width:100%;height:auto;max-width:1100px"><defs><marker id="mq" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#1f6f78"/></marker></defs><g font-family="sans-serif" font-size="14" text-anchor="middle"><text x="20" y="28" text-anchor="start" font-weight="700" fill="#14304f">沒有調整需求與分工</text><rect x="20" y="40" width="150" height="84" rx="10" fill="#eef7f6" stroke="#1f6f78" stroke-width="1.5"/><text x="95" y="74" font-weight="700" fill="#14304f">寫程式</text><text x="95" y="100" fill="#33506b">變便宜</text><line x1="173" y1="82" x2="197" y2="82" stroke="#1f6f78" stroke-width="2" marker-end="url(#mq)"/><rect x="200" y="40" width="150" height="84" rx="10" fill="#eef7f6" stroke="#1f6f78" stroke-width="1.5"/><text x="275" y="74" font-weight="700" fill="#14304f">精簡人力</text><text x="275" y="100" fill="#33506b">少了需求釐清角色</text><line x1="353" y1="82" x2="377" y2="82" stroke="#1f6f78" stroke-width="2" marker-end="url(#mq)"/><rect x="380" y="40" width="150" height="84" rx="10" fill="#eef7f6" stroke="#1f6f78" stroke-width="1.5"/><text x="455" y="74" font-weight="700" fill="#14304f">需求變模糊</text><text x="455" y="100" fill="#33506b">以簡短描述交給 AI</text><line x1="533" y1="82" x2="557" y2="82" stroke="#1f6f78" stroke-width="2" marker-end="url(#mq)"/><rect x="560" y="40" width="150" height="84" rx="10" fill="#eef7f6" stroke="#1f6f78" stroke-width="1.5"/><text x="635" y="74" font-weight="700" fill="#14304f">AI 自行補完</text><text x="635" y="100" fill="#33506b">依自己的模式開發</text><line x1="713" y1="82" x2="737" y2="82" stroke="#1f6f78" stroke-width="2" marker-end="url(#mq)"/><rect x="740" y="40" width="150" height="84" rx="10" fill="#fbeeea" stroke="#b4584a" stroke-width="1.5"/><text x="815" y="74" font-weight="700" fill="#14304f">返工與審查</text><text x="815" y="100" fill="#33506b">來回溝通增加</text><line x1="893" y1="82" x2="917" y2="82" stroke="#1f6f78" stroke-width="2" marker-end="url(#mq)"/><rect x="920" y="40" width="150" height="84" rx="10" fill="#fbeeea" stroke="#b4584a" stroke-width="1.5"/><text x="995" y="74" font-weight="700" fill="#14304f">總成本</text><text x="995" y="100" fill="#33506b">沒有跟著降</text><text x="20" y="178" text-anchor="start" font-weight="700" fill="#14304f">先調整需求與分工</text><rect x="20" y="190" width="150" height="84" rx="10" fill="#eef7f6" stroke="#1f6f78" stroke-width="1.5"/><text x="95" y="224" font-weight="700" fill="#14304f">需求寫成</text><text x="95" y="250" fill="#33506b">可驗收的條件</text><line x1="173" y1="232" x2="197" y2="232" stroke="#1f6f78" stroke-width="2" marker-end="url(#mq)"/><rect x="200" y="190" width="150" height="84" rx="10" fill="#eef7f6" stroke="#1f6f78" stroke-width="1.5"/><text x="275" y="224" font-weight="700" fill="#14304f">周邊角色</text><text x="275" y="250" fill="#33506b">配合同一份規格</text><line x1="353" y1="232" x2="377" y2="232" stroke="#1f6f78" stroke-width="2" marker-end="url(#mq)"/><rect x="380" y="190" width="150" height="84" rx="10" fill="#eef7f6" stroke="#1f6f78" stroke-width="1.5"/><text x="455" y="224" font-weight="700" fill="#14304f">AI 實作</text><text x="455" y="250" fill="#33506b">依規格與驗收案例</text><line x1="533" y1="232" x2="557" y2="232" stroke="#1f6f78" stroke-width="2" marker-end="url(#mq)"/><rect x="560" y="190" width="150" height="84" rx="10" fill="#eef7f6" stroke="#1f6f78" stroke-width="1.5"/><text x="635" y="224" font-weight="700" fill="#14304f">核心工程師</text><text x="635" y="250" fill="#33506b">審查重要決策</text><line x1="713" y1="232" x2="737" y2="232" stroke="#1f6f78" stroke-width="2" marker-end="url(#mq)"/><rect x="740" y="190" width="150" height="84" rx="10" fill="#eef7f6" stroke="#1f6f78" stroke-width="1.5"/><text x="815" y="224" font-weight="700" fill="#14304f">總成本</text><text x="815" y="250" fill="#33506b">才有機會降</text></g></svg>
</figure>

<strong>圖解重點：</strong>寫程式變便宜之後，結果取決於需求與分工有沒有一起調整。圖中的因果是本文的實務觀察。

業界也看到瓶頸在移動。LeadDev 刊出的一篇文章（[Faster code isn't faster delivery](https://leaddev.com/software-quality/faster-code-isnt-faster-delivery)，Emma Bostian，2026-10-06）指出，軟體開發的瓶頸沒有消失，只是移動了：在許多團隊，限制已經從寫程式變成審查，程式變更累積的速度超過工程師能理解、測試與核准的速度。

[METR 針對 16 位資深開源開發者做的隨機對照試驗](https://getdx.com/blog/metr-study-on-how-ai-affects-developer-productivity/)也提醒我們，速度的感受與實際結果可能不同：246 項任務中，開發者事前預期 AI 會讓他們快 24%，結果允許使用 AI 的任務平均多花了 19% 的時間。這項研究的對象是熟悉自己大型專案的資深開發者，樣本小；它顯示「寫得快」和「交付快」之間可能出現落差。

## AI 開發要真的變便宜，企業要先調整哪些做法？

<div class="answer"><p>要讓 AI 開發真的降低成本，企業需要先把需求寫成可驗收的規格，讓周邊角色配合 AI 的開發方式，並保留核心工程師審查重要決策。這些調整比單純換成 AI 寫程式，更影響最後的成本與品質。</p></div>

我會建議先從四件事調整：

1. **需求寫成可驗收的條件。** 說明誰使用、要解決什麼問題、什麼情況算正確，並附上真實案例。業界把先寫規格再讓 AI 實作的做法稱為 spec-driven development，[Pluralsight](https://www.pluralsight.com/resources/blog/software-development/spec-driven-development-with-AI-SDD) 把規格形容成在第一行程式碼之前就寫好的合約。
2. **讓周邊角色配合。** 提需求、設計、測試與驗收的人，用同一份規格與驗收案例工作。
3. **決定哪些事 AI 不能自己決定。** 技術選擇、資料結構與權限等重要決策，由核心工程師決定並留下紀錄，不讓它們只存在於某一次對話裡。
4. **事先安排審查。** 審查是新的瓶頸，要先決定誰審、審什麼、多久內完成。

這四件事如果做不到，AI 再快，成本也不容易降下來。做得到，後面談的分工、文件與陪跑才有意義。

## 員工已經用 AI 做出 Dashboard，委外開發應該更便宜嗎？

<div class="answer"><p>AI 輔助開發有機會降低程式實作、原型與文件整理的投入，因此企業期待成本效益很合理。實際報價仍須依交付範圍與品質條件估算；既有 Dashboard 則應先評估能否沿用，作為後續開發的基礎。</p></div>

如果同樣的工作，透過 AI 可以用較少時間完成，開發者就應該重新檢視估算與工作方式。企業有理由期待這些效率反映在價格、交付速度或可完成的範圍上。

至於客戶的那位員工，我認為他做出的成果很有價值。他了解自己的工作，知道需要哪些數字，也願意嘗試把問題做成工具。

這其實已經透露出一個機會：企業內部的人，可以更直接參與系統的形成。

後續合作可以先看現有成果：哪些功能已經適用？哪些資料與流程可以沿用？如果要擴大使用，還需要補上什麼？能沿用的部分就沿用，只調整需要補強的地方。

同樣地，判斷系統是否具備所有需要的條件，要看畫面之外的部分。當使用者、資料來源與操作流程增加，資料正確性、權限、備份及維護安排，都需要進一步確認。

<figure>
<svg viewBox="0 0 750 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="既有 Dashboard 評估流程圖：先檢查資料、功能、權限與維護安排，再決定沿用、補強後沿用，或只針對不符用途的部分調整" style="width:100%;height:auto;max-width:750px"><defs><marker id="mA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#1f6f78"/></marker></defs><g font-family="sans-serif" font-size="14" text-anchor="middle"><rect x="20" y="108" width="170" height="84" rx="10" fill="#eef7f6" stroke="#1f6f78" stroke-width="1.5"/><text x="105.0" y="138" font-weight="700" fill="#14304f">既有 Dashboard</text><text x="105.0" y="164" fill="#33506b">員工做的雛形</text><line x1="193" y1="150" x2="237" y2="150" stroke="#1f6f78" stroke-width="2" marker-end="url(#mA)"/><rect x="240" y="108" width="170" height="84" rx="10" fill="#eef7f6" stroke="#1f6f78" stroke-width="1.5"/><text x="325.0" y="138" font-weight="700" fill="#14304f">評估四件事</text><text x="325.0" y="164" fill="#33506b">資料、功能、權限、維護</text><text x="325" y="222" fill="#14304f"></text><line x1="413" y1="150" x2="477" y2="42" stroke="#1f6f78" stroke-width="2" marker-end="url(#mA)"/><line x1="413" y1="150" x2="477" y2="150" stroke="#1f6f78" stroke-width="2" marker-end="url(#mA)"/><line x1="413" y1="150" x2="477" y2="258" stroke="#1f6f78" stroke-width="2" marker-end="url(#mA)"/><rect x="480" y="0" width="250" height="84" rx="10" fill="#eef7f6" stroke="#1f6f78" stroke-width="1.5"/><text x="605.0" y="30" font-weight="700" fill="#14304f">可直接沿用</text><text x="605.0" y="56" fill="#33506b">納入後續開發基礎</text><rect x="480" y="108" width="250" height="84" rx="10" fill="#eef7f6" stroke="#1f6f78" stroke-width="1.5"/><text x="605.0" y="138" font-weight="700" fill="#14304f">補強後沿用</text><text x="605.0" y="164" fill="#33506b">補資料正確性、權限、備份</text><rect x="480" y="216" width="250" height="84" rx="10" fill="#eef7f6" stroke="#1f6f78" stroke-width="1.5"/><text x="605.0" y="246" font-weight="700" fill="#14304f">調整或重做</text><text x="605.0" y="272" fill="#33506b">只限確實不符用途的部分</text></g></svg>
</figure>

<strong>圖解重點：</strong>既有成果先評估再決定。圖中的判斷項目是本文建議，實際標準依系統用途而定。


我更在意的是：既然員工已經能把需求做出雛形，接下來如何讓這份能力在企業裡持續發展？

## 客戶期待做到滿意，AI 開發陪跑還能留下什麼？

<div class="answer"><p>AI 開發陪跑可以同時以系統可用與內部承接能力為目標。除了依約完成系統，也讓企業人員參與需求、修改與驗證，逐步建立持續改善的方法，讓後續工作不必每次都從外部詢價與重新說明開始。</p></div>

客戶重視成果滿意，這點完全合理。陪跑也需要清楚的交付物、品質要求與驗收方式，讓企業知道自己付費後會得到什麼。

但內部系統完成第一版之後，工作通常還會繼續。

例如多一個報表篩選條件、調整一段簽核流程、增加一種例外狀態，或是某個部門終於發現有更好的操作方式。

每次修改都需要重新詢價、等待排程、再次說明背景，有些需求可能就被擱著。尤其是那些對第一線很有幫助、卻不容易排進大型專案的小改善。

我希望陪跑可以讓企業逐步縮短這段距離。了解工作的人能提出規則，運用 AI 嘗試實作，再透過共同建立的測試與審查流程，把改善帶回日常工作。

這也是我所理解的員工賦能：員工能實際參與工具的改進，讓自己遇到的問題更有機會被解決。

### 一次合作可以留下的成果比較

這張表比較的是合作時是否納入能力移轉，兩種方式都可以採用 AI，也都需要清楚的品質與驗收要求。

| 比較項目 | 以系統交付為主要範圍 | 同時納入能力移轉的陪跑 |
| --- | --- | --- |
| 核心成果 | 完成約定功能與交付項目 | 完成系統，並建立內部修改與維運方法 |
| 員工參與 | 提供需求、試用與驗收 | 再依角色參與修改、測試及文件更新 |
| 後續修改 | 依維護合約或另案委託 | 約定範圍由內部承接，其他由工程師支援 |
| 文件用途 | 說明操作與技術內容 | 同時支援員工、接手工程師及 AI 理解系統 |
| 驗收方式 | 檢查功能、品質與文件 | 再加入實際承接演練 |

合作範圍實際仍應逐項約定。

回到那次談案，如果客戶問我，AI 能不能讓開發更便宜，我的回答是：寫程式的部分有機會，而且值得把實際節省的工作攤開來看。但總成本會不會降，要看需求、分工與審查有沒有一起調整。

至於陪跑結束後，企業怎麼接得住這套系統，包括核心工程師的分工、文件化、共同開發與交接驗收，我寫在[下一篇](/post/ai-development-handover-after-coaching)。

手上有幾個開發需求，想知道哪一個最適合先用 AI 做，可以用[AI 專案選題評分表](/tools/ai-project-scorecard/)依八項標準比較。需要把系統做出來、同時讓團隊接得住的企業，可以參考[AI 導入陪跑](/services/)：從需求訪談、PoC 原型到上線驗證，並在過程中把修改與維運能力留在企業。有具體案子想討論，歡迎[預約諮詢](/contact/)。

<tool-card slug="ai-project-scorecard">
</tool-card>

## 常見問題

<div class="answer"><p>企業評估 AI 輔助開發的成本時，應先確認需求能否寫成可驗收的條件、現有成果能否沿用，以及審查由誰負責。實際報價須依交付範圍與品質條件估算，並把需求、審查與驗收的總投入一併計入。</p></div>

### AI 讓寫程式變便宜，系統開發就會變便宜嗎？

不一定。寫程式只是開發成本的一部分，需求釐清、溝通、審查與驗收仍然需要投入。如果精簡人力後需求變得模糊，AI 又依自己的方式補完，返工與審查可能吃掉省下的時間。實際效果要看專案是否同步調整需求與分工。


### Vibe Coding 為什麼容易讓需求變模糊？

因為團隊常為了精簡人力，省去專職的需求釐清與分析角色，需求以簡短描述交給 AI。AI 遇到空白時不一定追問，而是自行決定做法。這是作者的實務觀察，建議把需求寫成可驗收的規格，並由核心工程師審查重要決策。


### 已有員工做的 Dashboard，可以直接沿用嗎？

可以先評估。應確認目前的資料、功能與架構是否符合預定用途，再決定沿用、補強或調整的範圍。


### 客戶期待成果滿意，AI 開發陪跑還需要做什麼？

陪跑同樣需要清楚的交付物、品質要求與驗收方式，這些與一般委外開發相同。差別在於合作範圍可以再納入內部人員參與修改，讓後續的小改善不必每次都從外部詢價開始。實際內容應逐項約定。

## 參考資料

<div class="answer"><p>本文以作者提供的談案經驗為主，引用業界文章與研究摘要作為補充。不同來源的適用條件各異，實際降價幅度與成效依個別企業而定。</p></div>

- [LeadDev：Faster code isn't faster delivery](https://leaddev.com/software-quality/faster-code-isnt-faster-delivery)，2026-10-06。程式變快之後，瓶頸移到審查。
- [Pluralsight：Spec-driven development (SDD) with AI](https://www.pluralsight.com/resources/blog/software-development/spec-driven-development-with-AI-SDD)，2026-06-18。AI agent 各自決策造成的不一致，以及先寫規格的做法。
- [DX：METR's study on how AI affects developer productivity](https://getdx.com/blog/metr-study-on-how-ai-affects-developer-productivity/)。16 位資深開發者、246 項任務的隨機對照試驗摘要。

## 延伸閱讀

- [企業 AI 內訓、工作坊與 AI 導入陪跑有什麼不同？依團隊現況怎麼選](/post/ai-training-workshop-coaching-difference)：三種服務各自解決的問題、產出與選擇順序。
- [AI 開發陪跑結束後，如何把系統運營能力留在企業](/post/ai-development-handover-after-coaching)：續談核心工程師分工、文件化、能力移轉與交接驗收。
- [Vibe Coding 是什麼？三種定義、適用範圍，與企業及個人案例的閱讀路徑](/post/what-is-vibe-coding)：先釐清定義與適用範圍，再依情況挑選本分類的文章。

## 作者

<div class="answer"><p>張可佳（Claire Chang）為企業 AI 導入與流程轉型顧問，擁有 19 年軟體工程經驗，協助企業釐清工作需求、規劃 AI 應用，並推進系統與流程改善。</p></div>

談案情境依作者提供的經驗整理，客戶與員工均匿名。文中的分工、流程與能力驗收是作者提出的合作建議，實際內容以雙方約定為準。

**最後更新：2026-10-19**
`;export{e as default};