var e=`---
title: 解決 Windows 下路徑名稱異常問題：8.3 短檔名縮寫教學
description: Windows 下 cmd 執行工具時，路徑含中文或空白常導致執行失敗。本文介紹如何用 dir /x 查詢資料夾短檔名，以 C:\\PROGRA~1 取代 C:\\Program Files，一次解決路徑異常問題。
date: 2020-03-18
category: DevOps
tags: [Windows, CMD, 短檔名, 路徑問題, 8.3檔名]
readingTime: 2 分鐘
image: /images/tech/hero_fix-windows-path-name-error.webp
imageAlt: 終端機畫面上顯示的程式碼與命令列介面
---


# 解決 Windows 下路徑名稱異常問題：8.3 短檔名縮寫教學

在 Windows 的 cmd 命令列環境下，許多 command line 工具只要路徑出現中文或空白，就會執行失敗。最常見的例子就是 \`C:\\Program Files\`——中間那個空格經常讓指令解析錯誤。這篇文章教你用 \`dir /x\` 查出資料夾的 8.3 短檔名，用 \`C:\\PROGRA~1\` 這類縮寫取代原本的路徑，快速繞過這個問題。

## 為什麼路徑有中文或空白會導致執行失敗？

使用 cmd 指令時，有許多 command line 執行的工具，當路徑出現中文或是空白時，會導致執行失敗。例如 \`C:\\Program Files\` 因為中間有一個空格，就很容易造成在執行時出現錯誤——工具把空格當成參數分隔符，後半段路徑就被誤認成另一個參數。

若遇到這種狀況，建議可以改用資料夾的縮寫（也就是 Windows 的 8.3 短檔名格式）：

| 原本路徑 | 改用縮寫 |
| --- | --- |
| \`C:\\Program Files\` | \`C:\\PROGRA~1\` |
| \`C:\\Program Files (x86)\` | \`C:\\PROGRA~2\` |

## 如何查找資料夾名稱縮寫？

在 cmd 裡切到目標資料夾的上一層，執行 \`dir /x\`：

\`\`\`cmd
C:\\Users\\claire.chang>dir /x
\`\`\`

\`/x\` 參數會額外顯示每個檔案與資料夾的短檔名（8.3 格式）欄位：

![dir /x 指令顯示資料夾短檔名](/images/articles/fix-windows-path-name-error-1.webp)

以上圖來說，資料夾 \`.android\` 的縮寫即為 \`ANDROI~1\`。之後在指令中就能用這個短檔名取代原本含特殊字元的完整路徑。

## 使用短檔名要注意什麼？

- 短檔名的 \`~1\`、\`~2\` 編號依資料夾建立順序決定，同一台機器上通常固定，但不同機器可能不同，部署腳本要避免寫死。
- 若系統以 \`fsutil 8dot3name\` 停用了 8.3 檔名產生，\`dir /x\` 會查不到縮寫，需先確認系統設定。
- 另一個常見替代做法是用雙引號包住含空格的路徑（如 \`"C:\\Program Files"\`），但部分老旧工具不支援引號解析，此時短檔名仍是最保險的方式。

## 常見問題

### 為什麼 C:\\Program Files 會造成指令執行失敗？

因為路徑中間的空格會被 command line 工具當成參數分隔符，導致路徑被切斷、工具收到錯誤的參數。用短檔名 \`C:\\PROGRA~1\` 或雙引號包住路徑都可以解決。

### 如何查詢 Windows 資料夾的短檔名？

在該資料夾的上一層執行 \`dir /x\`，輸出中會多出一欄 8.3 格式的短檔名，例如 \`.android\` 對應 \`ANDROI~1\`。

### C:\\Program Files (x86) 的短檔名是什麼？

一般是 \`C:\\PROGRA~2\`。\`~1\` 給先建立的 \`Program Files\`，\`~2\` 給 \`Program Files (x86)\`，實際編號仍建議用 \`dir /x\` 確認。

### 除了短檔名還有其他解法嗎？

可以用雙引號把含空格的路徑包起來，例如 \`"C:\\Program Files"\`。不過部分老舊工具不支援引號解析，這時短檔名縮寫會是更可靠的做法。

## 參考資料

- Microsoft Learn：[fsutil 8dot3name](https://learn.microsoft.com/windows-server/administration/windows-commands/fsutil-8dot3name)

## 延伸閱讀

- [Windows Services 設置教學：把 EXE 程式註冊為 Windows 服務](/post/windows-services-setup)：同樣聚焦 Windows，可接著比較不同情境的做法。
- [在 Linux 與 Windows 間傳送檔案：PSCP 指令教學](/post/transfer-files-between-linux-and-windows)：同樣聚焦 Windows，可接著比較不同情境的做法。
- [使用 Plink 快速在 Linux 伺服器下指令](/post/plink-remote-commands-windows-linux)：同樣聚焦 Windows，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2020-03-18，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};