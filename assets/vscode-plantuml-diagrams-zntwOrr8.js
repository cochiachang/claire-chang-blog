var e=`---
title: 使用VSCode繪製UML文件
description: 用 VSCode 的 PlantUML 外掛，就能以純文字描述直接產生循序圖、類圖、活動圖等 UML 圖表。本文介紹 PlantUML 支援的模型類型、安裝步驟與學習資源，讓文件圖表也能納入版本控制。
date: 2019-10-12
category: 後端開發
tags: [VS Code, PlantUML, UML, 文件工具]
readingTime: 3 分鐘
image: /images/tech/hero_vscode-plantuml-diagrams.webp
imageAlt: 手繪的流程圖草稿，展示以圖表描述系統流程的概念
---


# 使用VSCode繪製UML文件

我想在 VSCode 裡直接畫 UML 圖，不用再來回切換繪圖軟體。這篇文章介紹的 PlantUML 外掛，可以透過直觀的文字描述產生對應的 UML 模型，語法不用死背，需要時查官方網站即可，上手難度不大。

## 為什麼要用 PlantUML 在 VSCode 畫 UML？

PlantUML 是一個 VSCode 的插件，核心概念是「圖表即程式碼」：你用純文字描述模型結構，工具就幫你渲染成圖。這對開發者有幾個好處：

- **版本控制友善**：\`.puml\` 原始檔是純文字，可以跟程式碼一起 commit、code review、比對差異。
- **修改成本低**：改一張圖只要改幾行文字，不用在繪圖工具裡拖拉重排。
- **上手快**：官方網站提供詳細的範例與說明，語法需要時查詢即可。

## PlantUML 支援哪些 UML 模型？

PlantUML 目前支援下列 UML 圖表類型，官方每種都有完整範例：

- **循序圖（Sequence Diagram）**
  ![循序圖範例](/images/articles/vscode-plantuml-diagrams-1.webp)
- **用例圖（Use Case Diagram）**
  ![用例圖範例](/images/articles/vscode-plantuml-diagrams-2.webp)
- **類圖（Class Diagram）**
  ![類圖範例](/images/articles/vscode-plantuml-diagrams-3.webp)
- **活動圖（Activity Diagram）**
  ![活動圖範例](/images/articles/vscode-plantuml-diagrams-4.webp)
- **組件圖（Component Diagram）**
  ![組件圖範例](/images/articles/vscode-plantuml-diagrams-5.webp)
- **狀態圖（State Diagram）**
  ![狀態圖範例](/images/articles/vscode-plantuml-diagrams-6.webp)
- **對象圖（Object Diagram）**
  ![對象圖範例](/images/articles/vscode-plantuml-diagrams-7.webp)
- **部署圖（Deployment Diagram）**
  ![部署圖範例](/images/articles/vscode-plantuml-diagrams-8.webp)
- **定時圖（Timing Diagram）**
  ![定時圖範例](/images/articles/vscode-plantuml-diagrams-9.webp)

## 如何在 VSCode 安裝 PlantUML？

安裝方式跟一般 VSCode 插件一樣，三步完成：

1. 按下側邊欄的插件（Extensions）圖示。
2. 在搜尋名稱輸入：\`PlantUML\`。
3. 按下 Install。

![在 VSCode 擴充套件市場安裝 PlantUML 插件](https://jonny-huang.github.io/images/projects/markdown_preview_enhanced/mpe_07.png)

安裝完成後，在 \`.puml\` 檔案裡撰寫描述，用 \`Alt + D\` 即可即時預覽渲染結果（本機渲染需要 Java 或 Graphviz 環境，也可以改用 PlantUML Server 線上渲染）。

## 常見問題

### PlantUML 是什麼？

PlantUML 是一個可以用純文字描述產生 UML 圖表的開源工具，透過 VSCode 插件就能在編輯器內即時預覽循序圖、類圖、活動圖等模型。

### 使用 PlantUML 需要背語法嗎？

不需要。官方網站提供了每種圖表的詳細範例與說明，需要時查詢即可，上手難度不大。

### PlantUML 比 Draw.io 之類的繪圖工具好在哪裡？

最大的差異是「圖表即程式碼」：原始檔是純文字，可以納入 Git 版本控制、進行差異比對與 code review，修改圖表也只需要改文字。

### 本機預覽 PlantUML 需要什麼環境？

本機渲染需要 Java（部分圖表還需要 Graphviz）；如果不想裝這些環境，也可以把渲染伺服器指向公開的 PlantUML Server，由線上服務出圖。

## 參考資料

- [用筆記也可以管理專案(二)：Markdown Preview Enhanced](https://jonny-huang.github.io/projects/02_markdown_preview_enhanced/)
- [[TIL] 在 vscode 上面安裝並且使用 PlantUML](https://www.evanlin.com/til-vscode-plantuml/)
- [PlantUML in a nutshell](http://plantuml.com/zh/)

## 延伸閱讀

- [在 VSCode 建構 Nx Meta 套件：NX SDK、CMake 與 MSYS2 設定](/post/vscode-nx-package-setup)：同樣聚焦 VSCode，可接著比較不同情境的做法。
- [直播相關教學文章庫：串流、編碼、推流與 SRS 學習資源整理](/post/live-streaming-tutorial-resources)：同屬「後端開發」主題，可延伸理解相近問題的判斷方式。
- [PyCharm 是什麼？好用的 Python 開發環境（IDE）推薦指南](/post/pycharm-python-ide)：同屬「後端開發」主題，可延伸理解相近問題的判斷方式。

## 最後更新

2026-08-28（原文發布於 2019-10-12，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};