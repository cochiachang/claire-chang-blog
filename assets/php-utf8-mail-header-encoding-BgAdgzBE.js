var e=`---
title: PHP 寄送 UTF-8 信件標題亂碼：header 與內文編碼設定完整指南
description: 寄送 UTF-8 中文信件時標題或寄件者變亂碼？本文說明電子郵件標準表頭不允許雙位元文字的原因，並用 mb_encode_mimeheader() 與 base64_encode 的 PHP 範例，解決 mail() 函式寄信亂碼問題。
date: 2011-02-14
category: 後端開發
tags: [PHP, UTF-8, Email, mb_encode_mimeheader, phpmailer]
readingTime: 3 分鐘
image: /images/tech/hero_php-utf8-mail-header-encoding.webp
imageAlt: 寄送電子郵件與字元編碼設定的示意圖
---


# PHP 寄送 UTF-8 信件標題亂碼：header 與內文編碼設定完整指南

用 PHP 的 \`mail()\` 函式寄送 UTF-8 中文信件時，信件標題或寄件者名稱經常變成亂碼。這篇文章說明亂碼的根本原因——電子郵件標準格式中表頭不允許雙位元文字——並提供 \`mb_encode_mimeheader()\` 與 \`base64_encode()\` 兩種解法與完整程式碼範例。

## 為什麼 UTF-8 信件的標題和 header 會變成亂碼？

現在大多數的信件系統都已使用 UTF-8，但之前寄出 UTF-8 的信件時，我常遇到信件標題和 headers 資訊變成亂碼的問題。查了老半天網路才發現，不支援的主要原因在於：

**電子郵件標準格式（RFC 822 系列）中，表頭（header）的部分不允許使用雙位元的文字。**

也就是說，信件內文本（body）宣告 \`charset=utf-8\` 後可以正常顯示中文，但標題（Subject）、寄件者名稱（From）這些表頭欄位只能放單位元字串。所以解法是使用 \`mb_encode_mimeheader()\` 函式，將雙位元文字編碼為單位元字串（MIME encoded-word 格式）。

## 如何用 mb_encode_mimeheader() 解決標題亂碼？

以下為 headers 的範例：

\`\`\`php
mb_internal_encoding('UTF-8');
$headers  = 'MIME-Version: 1.0' . "\\r\\n";
$headers .= 'Content-type: text/html; charset=utf-8' . "\\r\\n";
$headers .= 'From: '.mb_encode_mimeheader('標題') .'<test@test.test> ' . "\\r\\n";
mail($to, mb_encode_mimeheader($title, 'UTF-8'), $content, $headers);
\`\`\`

重點有三處：

1. \`mb_internal_encoding('UTF-8')\` 先指定內部編碼，確保 mb_* 函式正確處理字串。
2. \`Content-type: text/html; charset=utf-8\` 讓信件內文以 UTF-8 顯示。
3. 標題與寄件者名稱都要過 \`mb_encode_mimeheader()\`，把中文編碼成 MIME 格式。

這樣便可成功解決「郵件標題」或「寄件者」是亂碼的問題。

## 沒有 mbstring 函式庫時，怎麼用 base64_encode 寄信？

若是電腦沒有安裝 \`mb_encode_mimeheader()\` 的函式庫（mbstring），則可以使用下面的程式碼來寄信——原理相同，改用 \`base64_encode()\` 手動組出 \`=?UTF-8?B?...?=\` 的 MIME encoded-word：

\`\`\`php
$to =" yourmail@your.com "; //收件者
$subject="=?UTF-8?B?".base64_encode('主旨')."?=";//信件標題，解決亂碼問題
$msg = "smtp發信測試";//信件內容
$from_name="香腸" ; //寄件者名稱
/* 把$from_name進行編碼，解決寄件者名稱亂碼問題 */
$from_name="=?UTF-8?B?".base64_encode($from_name)."?=";
$headers = "From:".$from_name." <admin@your.com>"; //寄件者名稱和信箱
if(mail("$to", "$subject", "$msg", "$headers"))
echo "信件已經發送成功。";//寄信成功就會顯示的提示訊息
else
echo "信件發送失敗！";//寄信失敗顯示的錯誤訊息
\`\`\`

\`=?UTF-8?B?....?=\` 是 MIME encoded-word 的標準格式：\`UTF-8\` 是字元集，\`B\` 表示 Base64 編碼。收件端的郵件軟體看到這個格式就會自動解碼回中文，亂碼問題隨之消失。

## 常見問題

### 為什麼信件內文正常顯示，標題卻是亂碼？

因為電子郵件標準格式中，表頭不允許雙位元文字，只有內文可以透過 \`charset=utf-8\` 宣告編碼。標題、寄件者名稱屬於表頭，必須先用 \`mb_encode_mimeheader()\` 或 Base64 編碼成 MIME encoded-word 才能正常顯示。

### mb_encode_mimeheader() 是什麼？

它是 PHP mbstring 擴充提供的函式，會把 UTF-8 等多位元字串編碼成單位元的 MIME encoded-word 字串（如 \`=?UTF-8?B?...?=\`），讓中文可以安全地放進信件表頭。使用前先用 \`mb_internal_encoding('UTF-8')\` 指定內部編碼。

### 沒有安裝 mbstring 時怎麼辦？

可以改用 \`base64_encode()\` 手動組出 \`=?UTF-8?B?\` + base64 字串 + \`?=\` 的格式，套在信件標題與寄件者名稱上，效果與 \`mb_encode_mimeheader()\` 相同。本文第二段程式碼就是完整範例。

### 信件內文要如何避免亂碼？

在 headers 加上 \`MIME-Version: 1.0\` 與 \`Content-type: text/html; charset=utf-8\`，並確保 \`$content\` 本身是 UTF-8 編碼，內文就會正常顯示中文。

## 參考資料

- PHP 官方文件：[mb_encode_mimeheader](https://www.php.net/manual/en/function.mb-encode-mimeheader.php)
- PHP 官方文件：[mail() 函式](https://www.php.net/manual/en/function.mail.php)
- RFC 2047：MIME (Multipurpose Internet Mail Extensions) Part Three: Message Header Extensions for Non-ASCII Text

## 延伸閱讀

- [PHP 寄送 UTF-8 信件標題變亂碼怎麼辦？用 mb_encode_mimeheader 解決 header 編碼](/post/php-utf8-mail-header-mb-encode-mimeheader)：同樣聚焦 PHP、UTF-8，可接著比較不同情境的做法。
- [PHP 產生 Excel 文件：用 XML xls 解決 CSV 編碼問題](/post/php-generate-excel-xml-xls)：同樣聚焦 PHP，可接著比較不同情境的做法。
- [PHP Header 檔案下載控制：Content-Disposition 與安全下載範例](/post/php-header-file-download)：同樣聚焦 PHP，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2011-02-14，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};