var e=`---
title: PHP Header 檔案下載控制：Content-Disposition 與安全下載範例
description: 說明如何用 PHP header 控制檔案下載，包含 Content-Type、Content-Disposition、Gzip 輸出與安全注意事項。
date: 2009-01-07
category: 後端開發
tags: [PHP, HTTP Header, 檔案下載]
readingTime: 8 分鐘
image: /images/tech/hero_php-header-file-download.webp
imageAlt: HTTP header 控制檔案下載的後端程式示意圖
---
# PHP Header 檔案下載控制：Content-Disposition 與安全下載範例

PHP 可以透過 HTTP header 控制瀏覽器下載檔案，而不是直接暴露檔案網址。常見做法是把檔案放在 Web root 之外，由 PHP 驗證權限後輸出 \`Content-Type\`、\`Content-Disposition\` 與檔案內容。

## 為什麼要用 PHP header 控制檔案下載？

PHP header 下載控制可以避免使用者直接取得檔案公開網址。這種方式適合需要登入、權限檢查、下載次數紀錄或避免外站盜連的檔案服務。

常見檔案下載有兩種架構：

| 架構 | 說明 | 適合情境 |
| --- | --- | --- |
| PHP 讀取本機檔案後輸出 | 檔案放在 Web root 外，PHP 驗證後 \`readfile()\` | 多數下載站、會員檔案 |
| 檔案以 BLOB 存入資料庫 | 檔案內容存在資料庫欄位 | 小檔案、需要交易一致性 |

實務上，大型檔案通常不要直接塞進資料庫。檔案系統或物件儲存較容易做備份、串流、快取與權限控管。

## PHP 下載檔案需要哪些 header？

檔案下載最重要的 header 是 \`Content-Type\`、\`Content-Disposition\` 與 \`Content-Length\`。\`Content-Disposition: attachment\` 會提示瀏覽器下載，而不是直接在頁面中開啟內容。

以下是整理後的基本範例：

\`\`\`php
function dl_file(string $file): void
{
    if (!is_file($file)) {
        http_response_code(404);
        exit('404 File not found');
    }

    $filename = basename($file);
    $len = filesize($file);
    $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));

    $types = [
        'pdf' => 'application/pdf',
        'zip' => 'application/zip',
        'doc' => 'application/msword',
        'xls' => 'application/vnd.ms-excel',
        'ppt' => 'application/vnd.ms-powerpoint',
        'gif' => 'image/gif',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'mp3' => 'audio/mpeg',
    ];

    if (in_array($extension, ['php', 'htm', 'html', 'txt'], true)) {
        http_response_code(403);
        exit('File type is not allowed');
    }

    $ctype = $types[$extension] ?? 'application/octet-stream';

    header('Pragma: public');
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Content-Description: File Transfer');
    header("Content-Type: {$ctype}");
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    header('Content-Transfer-Encoding: binary');
    header("Content-Length: {$len}");

    readfile($file);
    exit;
}
\`\`\`

## 如何輸出動態產生的下載內容？

動態產生的下載內容不一定要先寫入伺服器檔案。PHP 可以先送出下載 header，再直接 \`echo\` CSV、文字或壓縮後內容。

例如輸出一個 CSV：

\`\`\`php
$saveasname = 'report.csv';

header('Content-Type: text/csv; charset=UTF-8');
header('Content-Disposition: attachment; filename="' . $saveasname . '"');

echo "name,total\\n";
echo "Claire,100\\n";
\`\`\`

如果要輸出 Gzip 壓縮內容，可使用：

\`\`\`php
$saveasname = 'report.txt.gz';

header('Content-Encoding: x-gzip');
header('Content-Type: application/x-gzip');
header('Content-Disposition: attachment; filename="' . $saveasname . '"');
header('Pragma: no-cache');

echo gzencode('hi', 9);
\`\`\`

這種做法適合資料庫備份或報表下載。若檔案很大，需再評估串流輸出、記憶體用量與逾時設定。

## PHP 檔案下載有哪些安全注意事項？

PHP 檔案下載最大的風險是路徑穿越與未授權存取。下載程式不能直接相信使用者傳入的檔名，應用白名單、權限檢查與固定下載目錄限制範圍。

實作檢查表：

| 檢查項目 | 建議做法 |
| --- | --- |
| 路徑穿越 | 使用檔案 ID 查資料庫，不直接接收路徑 |
| 權限控制 | 下載前確認登入狀態與檔案擁有權 |
| 檔名輸出 | 使用 \`basename()\`，避免輸出任意路徑 |
| MIME 類型 | 用白名單設定，不完全相信副檔名 |
| 大檔案 | 使用串流與分段讀取，避免一次吃滿記憶體 |

資訊增益：如果下載檔案需要權限控管，推薦資料庫只存「檔案 ID、實際路徑、原始檔名、擁有者、可下載狀態」，檔案本體留在私有目錄。這樣比把使用者提供的 path 塞進 \`readfile()\` 安全許多。

## 常見問題

### \`Content-Disposition: attachment\` 是什麼意思？

\`Content-Disposition: attachment\` 會告訴瀏覽器把回應視為下載附件。搭配 \`filename\` 可指定使用者儲存時看到的檔名。

### PHP 下載檔案一定要設定 \`Content-Length\` 嗎？

不是絕對必要，但建議設定。\`Content-Length\` 可以讓瀏覽器顯示下載進度，也能讓部分代理或客戶端更穩定處理檔案。

### 可以直接讓使用者下載 \`.php\` 檔嗎？

不建議。若伺服器設定錯誤，程式碼可能被外洩；下載系統應避免把可執行程式碼類型列入允許清單。

### \`application/octet-stream\` 可以用在所有檔案嗎？

\`application/octet-stream\` 是通用二進位類型，可作為 fallback。若已知檔案類型，仍建議提供正確 MIME type。

### 大檔案下載適合用 \`readfile()\` 嗎？

小到中型檔案可以用 \`readfile()\`。大型檔案應改用分段讀取、伺服器加速下載，或交給 Nginx、S3 等儲存服務處理。

## 參考資料

- PHP Manual：[header](https://www.php.net/manual/en/function.header.php)
- MDN Web Docs：[Content-Disposition](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition)
- MDN Web Docs：[Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type)
- IETF：[RFC 9110 HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110)

## 延伸閱讀

- [PHP 產生 Excel 文件：用 XML xls 解決 CSV 編碼問題](/post/php-generate-excel-xml-xls)：同樣聚焦 PHP，可接著比較不同情境的做法。
- [PHP 讀取檔案的幾種方式比較](/post/php-file-reading-methods-comparison)：同樣聚焦 PHP，可接著比較不同情境的做法。
- [PHP 使用 SOAP：SoapServer 與 SoapClient 基本架設](/post/php-soap-server-client)：同樣聚焦 PHP，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2026-08-28。原文發布於 2009-01-07，本文保留 PHP header 下載核心範例，並補上現代安全檢查。

`;export{e as default};