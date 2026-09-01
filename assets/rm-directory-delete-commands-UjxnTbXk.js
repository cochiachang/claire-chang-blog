var e=`---
title: Linux 目錄刪除教學：rm 與 rmdir 指令用法整理
description: Linux 刪除目錄與檔案怎麼做？整理 rmdir 與 rm 指令的差異、rm -rf 遞迴強制刪除的用法與 -i -d -f 等參數說明，並附刪除資料夾與檔案的實例指令，幫你避免誤刪檔案，安全管理 Linux 檔案系統。
date: 2019-09-30
category: DevOps
tags: [Linux, rm, rmdir, 指令教學, 檔案管理]
readingTime: 3 分鐘
image: /images/tech/hero_rm-directory-delete-commands.webp
imageAlt: Linux 終端機中執行 rm 指令刪除目錄的示意畫面
---


# Linux 目錄刪除教學：rm 與 rmdir 指令用法整理

在 Linux 上刪除資料夾，很多人第一個想到的是 rmdir，但遇到非空資料夾就會出錯。這篇文章整理 rmdir 的限制，以及 rm 指令搭配 -r、-f、-d、-i 等參數正確刪除目錄與檔案的方法。

## 為什麼刪除非空資料夾不能用 rmdir？

許多人刪除資料夾時仍會使用 rmdir 指令。這個指令在刪除空資料夾時是 OK 的，但若資料夾內有其他檔案，便會顯示錯誤：

![rmdir 對非空資料夾執行時出現錯誤訊息的終端機截圖](/images/articles/rm-directory-delete-commands-1.webp)

而且這個指令只能刪除資料夾，無法刪除檔案。

## rm 指令怎麼用？-r 和 -f 參數是什麼？

\`rm\` 是 remove 的意思，可以刪除目錄或檔案。若要完全刪除一個含有內容的資料夾，應加上 \`-rf\` 參數，也就是：

\`\`\`bash
rm -rf 目錄名字
\`\`\`

常用參數整理如下：

| 參數 | 意義 |
| --- | --- |
| \`-r\` | 向下遞迴，不管有多少級目錄，一併刪除 |
| \`-f\` | 直接強行刪除，不作任何提示 |
| \`-d\` | 直接刪除目錄，但目錄裡面不能有檔案或資料夾 |
| \`-i\` | 刪除之前會詢問，建議使用這個參數避免誤刪 |

## 有哪些實用的 rm 刪除範例？

### 1、刪除資料夾

\`\`\`bash
rm -rf /var/log/httpd/access
\`\`\`

將會刪除 \`/var/log/httpd/access\` 目錄以及其下所有檔案、資料夾。

### 2、刪除檔案

\`\`\`bash
rm -f /var/log/httpd/access.log
\`\`\`

## 常見問題

### rm -rf 可以刪除非空資料夾嗎？

可以。\`-r\` 會遞迴進入所有層級的子目錄，\`-f\` 則強制刪除不做提示，兩者合用就能連同內容一次刪掉整個資料夾，例如 \`rm -rf /var/log/httpd/access\`。

### rm -rf 有什麼風險？怎麼避免誤刪？

\`-f\` 不會跳出任何確認，路徑打錯就可能直接刪掉重要資料。若要刪除的內容不確定，建議改用 \`rm -ri\`，讓系統在刪除前逐一詢問確認。

### rmdir 和 rm 有什麼差別？

rmdir 只能刪除「空的」資料夾，遇到非空資料夾會直接報錯，也不能刪除檔案；rm 搭配 \`-r\` 參數則可以遞迴刪除目錄及其下所有內容，也能刪除單一檔案。

### -d 參數的用途是什麼？

\`rm -d\` 可以直接刪除目錄，但前提是目錄裡面不能有檔案或資料夾，功能類似 rmdir，適合用來清空後的目錄。

## 參考資料

本文整理自個人實作筆記。

## 延伸閱讀

- [Linux 基本操作指令介紹](/post/linux-basic-commands-cheatsheet)：同樣聚焦 Linux，可接著比較不同情境的做法。
- [在 Linux 與 Windows 間傳送檔案：PSCP 指令教學](/post/transfer-files-between-linux-and-windows)：同樣聚焦 Linux，可接著比較不同情境的做法。
- [Hard Link 與 Symbolic Link 的比較](/post/hard-link-vs-symbolic-link)：同樣聚焦 Linux，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2019-09-30，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};