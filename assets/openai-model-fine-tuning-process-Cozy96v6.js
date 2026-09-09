var e=`---
title: OpenAI 模型微調（Fine-tuning）完整流程：資料準備到上線實戰
description: 手把手記錄我用 OpenAI 微調模型的完整過程：五種訓練資料設計方向、法規問答 data.jsonl 範例、平台操作步驟與費用估算工具，讓機器人學會你的領域知識。
date: 2024-11-29
category: 機器學習
tags: [OpenAI, Fine-tuning, 微調, LLM, 機器學習]
readingTime: 15 分鐘
image: /images/tech/hero_openai-model-fine-tuning-process.webp
imageAlt: OpenAI 模型微調流程示意圖
---


# OpenAI 模型微調（Fine-tuning）完整流程：資料準備到上線實戰

這篇文章記錄我用 OpenAI 微調（fine-tuning）模型的完整實作過程：從設計訓練資料的五種方向（生成問題、細化回答、分類、摘要、結構化標記），到用法規問答實例組出 \`data.jsonl\`，再到 OpenAI 平台上傳、訓練、更換 API 模型的每一個步驟。讀完你就能照著把自己的領域資料餵給模型，訓練出符合需求的專屬機器人。

## 微調可以做什麼？五種常見的訓練資料方向

我們可以用微調來調整機器人有一致的回覆口吻和邏輯，或針對特定任務來加強模型的能力，例如生成問題、回答細化，到分類、摘要生成和結構化標記。每一行訓練資料都是一組 \`messages\` 對話（system / user / assistant），以下是我在每種方向使用的資料格式。

### 1. 生成問題

**任務目標**：根據提供的文本生成可能的相關問題。

\`\`\`json
{
  "messages": [
    {
      "role": "system",
      "content": "你是一個能根據文本生成相關問題的助手。"
    },
    {
      "role": "user",
      "content": "台灣位於東亞，擁有世界領先的半導體產業，尤其以台積電（TSMC）為代表。"
    },
    {
      "role": "assistant",
      "content": "1. 台灣在哪裡？\\n2. 台灣的主要產業是什麼？\\n3. 哪家公司代表了台灣的半導體產業？"
    }
  ]
}
\`\`\`

### 2. 細化回答

**任務目標**：根據問題生成多種類型的回答（簡潔、詳細、多角度）。

\`\`\`json
{
  "messages": [
    {
      "role": "system",
      "content": "你是一個能根據問題生成不同類型回答的助手，包括簡潔、詳細和多角度回答。"
    },
    {
      "role": "user",
      "content": "台灣的主要產業是什麼？"
    },
    {
      "role": "assistant",
      "content": "簡潔回答：半導體。\\n詳細回答：台灣的主要產業是半導體，此外電子製造業和資訊科技服務業也佔有重要地位。\\n多角度回答：半導體是台灣的核心產業，特別是在晶圓代工和芯片設計方面。此外，電子產品的生產與出口也非常重要。"
    }
  ]
}
\`\`\`

### 3. 分類

**任務目標**：將文本分配至特定的類別（如情感分類或主題分類）。

**情感分類範例**：

\`\`\`json
{
  "messages": [
    {
      "role": "system",
      "content": "你是一個情感分析助手，能判斷文本是正面、負面或中性的情感。"
    },
    {
      "role": "user",
      "content": "台灣的自然風景令人驚嘆，擁有多樣的生態系統。"
    },
    {
      "role": "assistant",
      "content": "正面"
    }
  ]
}
\`\`\`

**主題分類範例**：

\`\`\`json
{
  "messages": [
    {
      "role": "system",
      "content": "你是一個主題分類助手，能根據文本內容將其歸類為科技、旅遊、醫療等主題。"
    },
    {
      "role": "user",
      "content": "台積電的先進製程技術使其成為全球晶圓代工的領導者。"
    },
    {
      "role": "assistant",
      "content": "科技"
    }
  ]
}
\`\`\`

### 4. 摘要

**任務目標**：從提供的文本中生成簡短的摘要。

\`\`\`json
{
  "messages": [
    {
      "role": "system",
      "content": "你是一個能根據文本生成摘要的助手，專注於提取關鍵資訊。"
    },
    {
      "role": "user",
      "content": "台灣位於東亞，擁有世界領先的半導體產業，尤其以台積電（TSMC）為代表。該國的科技產業是其經濟增長的主要推動力，並在全球供應鏈中扮演重要角色。此外，台灣的教育水準和基礎建設也為產業發展提供了良好條件。"
    },
    {
      "role": "assistant",
      "content": "台灣以半導體產業為經濟增長主要推動力，台積電是其核心代表。"
    }
  ]
}
\`\`\`

### 5. 特定任務的結構化標記

**任務目標**：從文本中提取關鍵實體並將其標記為結構化數據。

**命名實體識別（NER）範例**：

\`\`\`json
{
  "messages": [
    {
      "role": "system",
      "content": "你是一個命名實體識別助手，能從文本中提取實體並標記其類型（如人名、地點、組織）。"
    },
    {
      "role": "user",
      "content": "台積電總部位於新竹，是世界領先的半導體公司之一。"
    },
    {
      "role": "assistant",
      "content": "- 台積電: 公司名\\n- 新竹: 地點"
    }
  ]
}
\`\`\`

**結構化數據抽取範例**：

\`\`\`json
{
  "messages": [
    {
      "role": "system",
      "content": "你是一個數據抽取助手，能從文本中提取結構化信息。"
    },
    {
      "role": "user",
      "content": "台積電的市值約為6000億美元，創立於1987年。"
    },
    {
      "role": "assistant",
      "content": "- 公司: 台積電\\n- 市值: 6000億美元\\n- 創立年份: 1987年"
    }
  ]
}
\`\`\`

## 實戰範例：用法規問答資料訓練法規助手

如果我期待機器人可以更深入的理解法條，例如下面這份「衛生福利部急難救助金申請審核及撥款作業規定」：

> **【衛生福利部】衛生福利部急難救助金申請審核及撥款作業規定**
>
> 一、急難救助對象： （一）戶內人口死亡無力殮葬者。 （二）戶內人口遭受意外傷害或罹患重病，致生活陷於困境者。 （三）負家庭主要生計責任者，失業、失蹤、應徵集召集入營服役或替代役現役、入獄服刑、因案羈押、依法拘禁或其他原因，無法工作致生活陷於困境者。 （四）財產或存款帳戶因遭強制執行、凍結或其他原因未能及時運用，致生活陷於困境者。 （五）已申請福利項目或保險給付，尚未核准期間生活陷於困境。 （六）其他因遭遇重大變故，致生活陷於困境，經直轄市、縣（市）主管機關訪視評估，認定確有救助需要者。
>
> ※同一事故之救助，以一次為限。
>
> 二、申請流程 申請急難救助者，應備齊申請表件，檢同相關證明文件，向戶籍所在地鄉（鎮、市、區）公所提出申請，轉報直轄市政府社會局或縣（市）政府核定之﹔直轄市政府社會局或縣（市）政府對於急難救助對象經核予救助後，仍陷於困境者，得轉報衛生福利部（以下簡稱本部）核定再予救助。

可以設計以下 \`data.jsonl\` 檔案內容，每一行都是一組完整的問答對話：

\`\`\`json
{"messages": [{"role": "system", "content": "你是一個專業的法規助手，能夠精確解析法條並提供準確回答。"}, {"role": "user", "content": "請說明急難救助的對象包含哪些情形？"}, {"role": "assistant", "content": "急難救助對象包含以下情形：\\n1. 戶內人口死亡無力殮葬者。\\n2. 戶內人口遭受意外傷害或罹患重病，致生活陷於困境者。\\n3. 負家庭主要生計責任者，因失業、失蹤、服役、入獄等原因無法工作，致生活陷於困境者。\\n4. 財產或存款帳戶遭強制執行、凍結或其他原因未能及時運用，致生活陷於困境者。\\n5. 已申請福利或保險給付，尚未核准期間生活陷於困境者。\\n6. 其他因重大變故，經地方政府評估認定確有救助需要者。"}]}
{"messages": [{"role": "system", "content": "你是一個專業的法規助手，能夠精確解析法條並提供準確回答。"}, {"role": "user", "content": "是否可以針對同一事故申請多次急難救助？"}, {"role": "assistant", "content": "不可以，依規定，同一事故的急難救助以一次為限。"}]}
{"messages": [{"role": "system", "content": "你是一個專業的法規助手，能夠精確解析法條並提供準確回答。"}, {"role": "user", "content": "申請急難救助需要經過哪些流程？"}, {"role": "assistant", "content": "申請急難救助的流程如下：\\n1. 準備申請表件及相關證明文件。\\n2. 向戶籍所在地的鄉（鎮、市、區）公所提出申請。\\n3. 公所轉報直轄市政府社會局或縣（市）政府核定。\\n4. 若救助後仍陷於困境，可由地方政府轉報衛生福利部核定再予救助。"}]}
{"messages": [{"role": "system", "content": "你是一個專業的法規助手，能夠精確解析法條並提供準確回答。"}, {"role": "user", "content": "如果戶內有人因意外傷害導致生活困境，是否符合急難救助條件？"}, {"role": "assistant", "content": "是的，戶內人口遭受意外傷害，導致生活陷於困境者，符合急難救助的條件之一。"}]}
{"messages": [{"role": "system", "content": "你是一個專業的法規助手，能夠精確解析法條並提供準確回答。"}, {"role": "user", "content": "某家庭主要生計者因入獄服刑，導致家人生活陷於困境，是否可申請急難救助？"}, {"role": "assistant", "content": "可以，家庭主要生計責任者因入獄服刑無法工作，導致生活陷於困境，符合急難救助對象的條件之一。"}]}
{"messages": [{"role": "system", "content": "你是一個專業的法規助手，能夠精確解析法條並提供準確回答。"}, {"role": "user", "content": "急難救助的申請對象有什麼限制？"}, {"role": "assistant", "content": "急難救助的申請對象需要符合以下條件之一：\\n1. 戶內人口死亡無力殮葬者。\\n2. 戶內人口因意外或疾病導致生活困難。\\n3. 家庭主要生計者無法工作導致家庭困境。\\n4. 財產或存款帳戶因特定原因無法運用。\\n5. 已申請福利或保險但尚未核准期間。\\n6. 因重大變故生活陷於困境，經地方政府認定確有需要者。"}]}
{"messages": [{"role": "system", "content": "你是一個專業的法規助手，能夠精確解析法條並提供準確回答。"}, {"role": "user", "content": "急難救助申請時需要準備哪些資料？"}, {"role": "assistant", "content": "申請急難救助時需要準備以下資料：\\n1. 填寫完整的急難救助申請表。\\n2. 相關證明文件，例如醫療證明、財務資料、戶籍資料等。\\n3. 符合條件的其他輔助證明文件。"}]}
{"messages": [{"role": "system", "content": "你是一個專業的法規助手，能夠精確解析法條並提供準確回答。"}, {"role": "user", "content": "急難救助的撥款程序是怎樣的？"}, {"role": "assistant", "content": "撥款程序如下：\\n1. 由地方政府對急難救助申請進行審核並核定金額。\\n2. 審核通過後，將救助款項撥至申請人指定的帳戶。\\n3. 若地方救助後仍陷於困境，地方政府可轉報衛生福利部核定追加撥款。"}]}
{"messages": [{"role": "system", "content": "你是一個專業的法規助手，能夠精確解析法條並提供準確回答。"}, {"role": "user", "content": "如果財產或存款遭強制執行，是否符合急難救助的條件？"}, {"role": "assistant", "content": "是的，若財產或存款帳戶因遭強制執行或凍結而無法運用，導致生活陷於困境，符合急難救助條件之一。"}]}
{"messages": [{"role": "system", "content": "你是一個專業的法規助手，能夠精確解析法條並提供準確回答。"}, {"role": "user", "content": "已申請其他福利項目，但尚未核准期間可以申請急難救助嗎？"}, {"role": "assistant", "content": "可以，若已申請其他福利或保險給付，但尚未核准期間生活陷於困境，符合急難救助條件之一。"}]}
\`\`\`

## 在 OpenAI 平台上執行微調

接著來到 OpenAI 的微調頁面：[https://platform.openai.com/finetune](https://platform.openai.com/finetune)

按 **+ Create**：

![OpenAI 微調頁面，按 + Create 開始新的微調任務](/images/articles/openai-model-fine-tuning-process-1.webp)

接著在畫面中選擇剛剛儲存的 \`data.jsonl\` 檔案：

![在微調畫面選擇 data.jsonl 訓練資料檔案](/images/articles/openai-model-fine-tuning-process-2.webp)

## 訓練前檢查資料集與費用估算

在微調之前，可以先閱讀這篇文章，學習如何在訓練前檢查資料集的格式、數據結構，並預估可能耗費的錢：[https://cookbook.openai.com/examples/chat_finetuning_data_prep](https://cookbook.openai.com/examples/chat_finetuning_data_prep)

該工具提供多項實用功能，幫助開發者準備高質量的數據集並規劃微調模型的成本：

1. **格式檢查**：自動檢查數據集中的格式錯誤，確保數據符合微調需求。
2. **統計分析**：生成基本的數據統計信息，例如對話回合數、用戶和助手訊息的分佈情況，便於了解數據結構。
3. **代幣數量估算**：預估微調所需的代幣數量，為開發者提供費用規劃參考，避免超出預算。

## 開始訓練與呼叫微調後的模型

然後就可以開始微調：

![OpenAI 微調訓練執行畫面](/images/articles/openai-model-fine-tuning-process-3.webp)

會跑出一些訓練數據，代表模型對這些資料的訓練學習狀況。

訓練完成之後可以看見你訓練好的模型名稱，接著在 API 改變呼叫的模型就可以了：

![訓練完成後取得的微調模型名稱](/images/articles/openai-model-fine-tuning-process-4.webp)

## 常見問題

### OpenAI 微調的訓練資料格式是什麼？

每一行都是一個 JSON 物件，包含 \`messages\` 陣列，裡面依序是 system（設定角色）、user（輸入）與 assistant（期望輸出）三種角色的對話。整份檔案以 JSONL 格式儲存，副檔名為 \`.jsonl\`。

### 微調前要怎麼檢查資料集有沒有問題？

可以使用 OpenAI Cookbook 提供的資料準備工具，它會自動做格式檢查、統計分析（對話回合數、訊息分佈），並估算微調所需的 token 數量與費用，幫助你在訓練前就發現格式錯誤並規劃預算。

### 微調完成後要怎麼使用訓練好的模型？

訓練完成後，OpenAI 平台會顯示你訓練好的模型名稱。只要在呼叫 OpenAI API 時，把 \`model\` 參數從原本的基礎模型改成這個微調模型名稱，就能使用訓練後的模型。

### 哪些任務適合用微調來加強？

適合微調的任務包括：讓機器人有一致的回覆口吻與邏輯、根據文本生成問題、細化回答、文本分類（情感或主題）、摘要生成，以及從文本中提取實體做結構化標記等特定任務。

## 參考資料

- [Real-World Example: Building a Fine-Tuned Model with OpenAI](https://medium.com/gptalk/real-world-example-building-a-fine-tuned-model-with-openai-58a0557143af)
- [Fine-tuning with OpenAI](https://medium.com/@j622amilah/fine-tuning-with-openai-624a6055517d)
- [OpenAI 官方教學：Fine-tuning examples](https://platform.openai.com/docs/guides/fine-tuning#fine-tuning-examples)
- [OpenAI Cookbook：Chat fine-tuning data prep](https://cookbook.openai.com/examples/chat_finetuning_data_prep)

## 延伸閱讀

- [OpenAI 的模型微調過程完整教學：從準備資料到訓練出專屬模型](/post/openai-model-finetuning-process)：同樣聚焦 OpenAI、Fine-tuning，可接著比較不同情境的做法。
- [LoRA（Low-Rank Adaptation）是什麼？低參數微調 LLM 的原理與優點解析](/post/lora-low-rank-adaptation)：同樣聚焦 LLM、Fine-tuning，可接著比較不同情境的做法。
- [LLM 微調是什麼？與 RAG 的選擇與資料準備挑戰](/post/llm-fine-tuning-vs-rag-guide)：同樣聚焦 Fine-tuning、LLM，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2024-11-29，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};