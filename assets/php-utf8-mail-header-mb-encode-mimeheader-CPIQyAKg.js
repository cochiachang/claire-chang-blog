var e=`---
title: PHP 寄送 UTF-8 信件標題變亂碼怎麼辦？用 mb_encode_mimeheader 解決 header 編碼
description: 寄送 UTF-8 信件時標題或寄件者常變成亂碼，原因是電子郵件表頭不允許雙位元文字。本文整理使用 PHP mb_encode_mimeheader() 與 base64 編碼解決 mail header 亂碼的完整做法。
date: 2011-02-14
category: 後端開發
tags: [PHP, mail, UTF-8, mb_encode_mimeheader, 編碼]
readingTime: 3 分鐘
image: /images/tech/hero_php-utf8-mail-header-mb-encode-mimeheader.webp
imageAlt: 桌上型筆電螢幕上顯示著密密麻麻的程式碼，呈現後端開發除錯的情境
---


# PHP 寄送 UTF-8 信件標題變亂碼怎麼辦？用 mb_encode_mimeheader 解決 header 編碼

現在大多數的信件系統都已使用 UTF-8，但我之前寄出 UTF-8 的信件時，常會發生信件標題和 headers 資訊變成亂碼的狀況。查了老半天網路才發現，主要原因在於電子郵件標準格式中，表頭的部分不允許使用雙位元文字，所以中文主旨、中文寄件者名稱都會出事。解法是使用 \`mb_encode_mimeheader()\` 函式，將雙位元文字編碼為單位元字串。

## 為什麼信件標題會變成亂碼？

電子郵件的標準格式（RFC 822 / MIME）中，表頭（header）的部分只允許 ASCII 單位元文字，而 UTF-8 的中文字是雙位元以上的字元，直接放進 header 就會被郵件系統誤讀成亂碼。內文可以透過 \`Content-type: text/html; charset=utf-8\` 宣告編碼，但表頭必須另外用 MIME 編碼處理，這就是 \`mb_encode_mimeheader()\` 存在的目的——把雙位元文字編碼成單位元字串再放進 header。

## PHP 怎麼用 mb_encode_mimeheader 寄出正確的 UTF-8 信件？

以下為 headers 的範例，重點有三：先設定內部編碼、header 宣告 charset 為 utf-8、主旨與寄件者名稱都經過 \`mb_encode_mimeheader()\` 編碼：

\`\`\`php
mb_internal_encoding('UTF-8');
$headers  = 'MIME-Version: 1.0' . "\\r\\n";
$headers .= 'Content-type: text/html; charset=utf-8' . "\\r\\n";
$headers .= 'From: '.mb_encode_mimeheader('標題') .'<test@test.test> ' . "\\r\\n";
mail($to, mb_encode_mimeheader($title, 'UTF-8'), $content, $headers);
\`\`\`

這樣便可成功解決「郵件標題」或「寄件者」是亂碼的問題。

## 沒有安裝 mbstring 函式庫時該怎麼寄信？

若是電腦沒有安裝 \`mb_encode_mimeheader()\` 的函式庫（mbstring），則可以使用下面的程式碼，改用 \`base64_encode()\` 手動組出 MIME 編碼的字串來寄信：

\`\`\`php
$to = " yourmail@your.com "; //收件者
$subject="=?UTF-8?B?".base64_encode('主旨')."?="; //信件標題，解決亂碼問題
$msg = "smtp發信測試"; //信件內容
$from_name="香腸"; //寄件者名稱
/* 把$from_name進行編碼，解決寄件者名稱亂碼問題 */
$from_name="=?UTF-8?B?".base64_encode($from_name)."?=";
$headers = "From:".$from_name." <admin@your.com>"; //寄件者名稱和信箱
if(mail("$to", "$subject", "$msg", "$headers"))
echo "信件已經發送成功。"; //寄信成功就會顯示的提示訊息
else
echo "信件發送失敗！"; //寄信失敗顯示的錯誤訊息
\`\`\`

這裡的 \`=?UTF-8?B?...?=\` 就是 MIME encoded-word 的格式：宣告字元集為 UTF-8、使用 Base64（B）編碼，讓郵件系統知道要先把字串解碼再顯示。寄件者名稱同樣要編碼，否則收件人看到的 From 欄位一樣會是亂碼。

## 常見問題

### 為什麼信件內文正常，只有標題和寄件者是亂碼？

因為信件內文可以靠 \`Content-type: charset=utf-8\` 宣告編碼，但電子郵件標準格式的表頭不允許雙位元文字，中文主旨與寄件者名稱必須用 \`mb_encode_mimeheader()\` 或 \`=?UTF-8?B?...?=\` 的 MIME encoded-word 格式另外編碼。

### mb_encode_mimeheader() 函式不存在怎麼辦？

代表主機沒有安裝 PHP 的 mbstring 函式庫。可以改用 \`base64_encode()\` 手動組出 \`=?UTF-8?B?...?=\` 格式的字串，放在主旨或 From 欄位中，效果與 \`mb_encode_mimeheader()\` 相同。

### Content-type header 要設成什麼才能讓內文顯示 UTF-8？

在 headers 中加上 \`MIME-Version: 1.0\` 與 \`Content-type: text/html; charset=utf-8\`，並確保程式內部編碼（\`mb_internal_encoding\`）與實際送出的內容都是 UTF-8，內文就不會出現亂碼。

## 參考資料

- PHP 官方文件：[mb_encode_mimeheader](https://www.php.net/manual/en/function.mb-encode-mimeheader.php)
- PHP 官方文件：[mail 函式](https://www.php.net/manual/en/function.mail.php)

## 延伸閱讀

- [PHP 寄送 UTF-8 信件標題亂碼：header 與內文編碼設定完整指南](/post/php-utf8-mail-header-encoding)：同樣聚焦 PHP、UTF-8，可接著比較不同情境的做法。
- [PHP 產生 Excel 文件：用 XML xls 解決 CSV 編碼問題](/post/php-generate-excel-xml-xls)：同樣聚焦 PHP，可接著比較不同情境的做法。
- [PHP Header 檔案下載控制：Content-Disposition 與安全下載範例](/post/php-header-file-download)：同樣聚焦 PHP，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2011-02-14，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};