var e=`---
title: PHP 產生 Excel 文件：用 XML xls 解決 CSV 編碼問題
description: 說明 PHP 匯出 Excel 時 CSV 與 XML xls 的差異，並整理 UTF-8 中文資料匯出的簡單實作方式。
date: 2011-02-12
category: 後端開發
tags: [PHP, Excel, CSV, XML]
readingTime: 5 分鐘
image: /images/tech/hero_php-generate-excel-xml-xls.webp
imageAlt: 後端程式產生試算表檔案的工作畫面
---


# PHP 產生 Excel 文件：用 XML xls 解決 CSV 編碼問題

PHP 匯出 Excel 不一定只能產生 CSV。若網站資料是 UTF-8 中文，CSV 在舊版 Excel 或 Big5 流程中容易出現漏字與亂碼，改用 XML 格式的 xls 可以保留 UTF-8 並指定欄位型別。

## 為什麼 PHP 匯出 CSV 會遇到中文編碼問題？

CSV 是純文字格式，Excel 開啟 CSV 時會受作業系統、Excel 版本與檔案編碼判斷影響。PHP 網站若使用 UTF-8，但下載流程又被當成 Big5 解讀，就容易發生中文漏字或亂碼。

CSV 的優點是檔案小、格式簡單、容易串接。CSV 的限制是欄位型別、編碼宣告與格式控制能力都很弱。當使用者期待「下載後直接用 Excel 開啟」，後端就需要考慮 Excel 的實際解析方式。

原稿的實務情境是：網站系統使用 UTF-8，CSV 下載後在 Excel 流程中發生嚴重漏字。這種問題不一定是 PHP 字串本身錯，而是檔案格式與 Excel 開檔判斷不一致。

## XML xls 為什麼適合舊式 PHP 匯出？

XML xls 是用 XML 描述 Excel 工作表內容的格式。XML xls 檔案通常比 CSV 大，但可以明確指定 UTF-8、工作表、列、欄與儲存格型別。

XML xls 適合下列情境：

| 情境 | CSV | XML xls |
|---|---|---|
| 純資料交換 | 適合 | 可用但較大 |
| 中文 UTF-8 直接開啟 | 容易受 Excel 判斷影響 | 較容易保留編碼 |
| 指定欄位是文字或數字 | 能力有限 | 可明確指定 |
| 需要多工作表或格式 | 不適合 | 較適合 |

如果只是給程式讀取，CSV 仍然很好。若目標使用者是開啟 Excel 檔案看報表，XML xls 或現代 \`.xlsx\` 套件通常比較可靠。

## PHP 如何用 php-excel 產生 xls？

php-excel 類別可以把 PHP 陣列轉成 Excel 可開啟的 XML xls。這種做法適合舊 PHP 專案快速改善 CSV 中文問題。

原稿使用的範例：

\`\`\`php
// include the php-excel class
require(dirname(__FILE__) . "/class-excel-xml.inc.php");

// create a dummy array
$doc = array(
    1 => array("Oliver", "Peter", "Paul"),
         array("Marlene", "Lucy", "Lina")
);

// generate excel file
$xls = new Excel_XML;
$xls->addArray($doc);
$xls->generateXML("mytest");
\`\`\`

這段程式的重點是把資料整理成二維陣列，再交給 \`Excel_XML\` 輸出。檔名 \`mytest\` 會成為使用者下載的 Excel 檔案名稱。

## 現代 PHP 專案還應該用 XML xls 嗎？

現代 PHP 專案通常優先考慮 PhpSpreadsheet 產生 \`.xlsx\`。XML xls 仍適合維護舊系統，但新專案若需要格式、公式、樣式與長期相容性，\`.xlsx\` 會是比較穩定的選擇。

選擇建議：

1. 只要簡單資料交換：輸出 UTF-8 CSV，並確認 Excel 開啟流程。
2. 舊系統要快速改善中文亂碼：使用 XML xls。
3. 新系統要正式報表：使用 PhpSpreadsheet 產生 \`.xlsx\`。
4. 資料量很大：測試記憶體用量，必要時採串流輸出。

資訊增益判斷：如果使用者只要求「可以用 Excel 開」，不要直接等同於「必須是 CSV」。先問資料是否有中文、前導零、日期欄位與多工作表需求，格式選擇會更準。

## 常見問題

### PHP 產生 Excel 一定要用 CSV 嗎？

PHP 產生 Excel 不一定要用 CSV。PHP 可以輸出 CSV、XML xls 或 \`.xlsx\`，應依中文編碼、欄位型別、格式需求與檔案大小選擇。

### CSV 為什麼在 Excel 開啟後會亂碼？

Excel 開啟 CSV 時可能沒有依 UTF-8 解讀內容，尤其在舊版或特定語系環境中更常見。可以嘗試加入 BOM、改用資料匯入流程，或改用 Excel 原生格式。

### XML xls 的缺點是什麼？

XML xls 的缺點是檔案比 CSV 大，也不是現代 Excel 最主要的檔案格式。若新專案要長期維護，通常建議評估 \`.xlsx\` 套件。

### php-excel 還適合新專案嗎？

php-excel 適合理解舊系統做法或快速修補舊 PHP 專案。新專案通常建議使用仍在維護、支援 \`.xlsx\` 的 PhpSpreadsheet。

### Excel 欄位前導零消失怎麼辦？

電話、郵遞區號、會員編號等欄位應指定為文字格式。CSV 很難穩定控制這件事，XML xls 或 \`.xlsx\` 比較容易保留前導零。

## 參考資料

- PhpSpreadsheet 官方文件：<https://phpspreadsheet.readthedocs.io/>
- PHP 官方文件，fputcsv：<https://www.php.net/manual/en/function.fputcsv.php>
- 原 php-excel 專案封存頁：<https://code.google.com/archive/p/php-excel/>

## 延伸閱讀

- [PHP 寄送 UTF-8 信件標題亂碼：header 與內文編碼設定完整指南](/post/php-utf8-mail-header-encoding)：同樣聚焦 PHP，可接著比較不同情境的做法。
- [PHP 讀取檔案的幾種方式比較](/post/php-file-reading-methods-comparison)：同樣聚焦 PHP，可接著比較不同情境的做法。
- [PHP 寄送 UTF-8 信件標題變亂碼怎麼辦？用 mb_encode_mimeheader 解決 header 編碼](/post/php-utf8-mail-header-mb-encode-mimeheader)：同樣聚焦 PHP，可接著比較不同情境的做法。

## 最後更新

2026-08-28

`;export{e as default};