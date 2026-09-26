var e=`---
title: PHP 使用 SOAP：SoapServer 與 SoapClient 基本架設
description: 說明 PHP 內建 SOAP 擴充套件如何建立 SoapServer 與 SoapClient，並比較有無 WSDL 兩種寫法。
date: 2009-02-09
category: 後端開發
tags: [PHP, SOAP, WSDL, Web Service]
readingTime: 6 分鐘
image: /images/tech/hero_php-soap-server-client.webp
imageAlt: 深色背景的程式碼編輯畫面，象徵後端服務程式開發
---
# PHP 使用 SOAP：SoapServer 與 SoapClient 基本架設

PHP 內建的 \`SoapServer\` 與 \`SoapClient\` 類別可以直接架設 SOAP 服務，不需要額外安裝套件，只要 \`php.ini\` 開啟 \`soap\` 擴充套件即可。做法分兩種：不用 WSDL、直接用函式名稱互相呼叫；或是先產生 WSDL 檔案，再讓客戶端照著 WSDL 呼叫。

## PHP 不用 WSDL 要怎麼建立 SOAP 服務？

不用 WSDL 的做法是把 \`SoapServer\` 建構子的第一個參數傳 \`NULL\`，改用 \`uri\` 選項當作命名空間，伺服器端把要開放的函式用 \`addFunction()\` 註冊進去即可。

伺服器端（\`server.php\`）：

\`\`\`php
// 接收要求的函數
function request($arg1, $arg2) {
    $response = $arg1 + $arg2;
    return $response;
}

// 宣告 SOAP Server
$server = new SoapServer(NULL, array('uri' => 'http://myweb.com/'));
$server->addFunction('request'); // 定義 request 可以讓外部呼叫
$server->handle();               // 啟動 SOAP Server
\`\`\`

客戶端也要用同樣的 \`uri\`，並指定伺服器實際位置：

\`\`\`php
$client = new SoapClient(NULL, array(
    'location' => 'http://127.0.0.1/soap/server.php',
    'uri' => 'http://myweb.com/',
));

try {
    print_r($client->request(1, 2));
} catch (SoapFault $err) {
    echo "Web Service on Response(" . $err->getMessage() . ")";
}
\`\`\`

這種寫法最大的好處是簡單、少一份 WSDL 檔案要維護，適合內部系統之間互相呼叫、或是快速驗證 SOAP 通不通。缺點是客戶端沒有明確的服務規格文件可查，函式簽章、參數型別都要靠雙方口頭或文件溝通對齊。

## PHP 用 WSDL 建立 SOAP 服務要注意什麼？

要用 WSDL 的話，需要一個能產生 WSDL 內容的類別（原文使用 \`SoapDiscovery.class.php\`），把要開放的方法包成一個 class，再依請求方式決定是回傳 WSDL、還是進入 SOAP 處理流程。

伺服器端（\`server.php\`）：

\`\`\`php
// 接收端要求的參數皆定義在此
class requestClass {
    function request($obj) {
        return array('out' => $obj->in1 . ',' . $obj->in2);
    }
}

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] == 'POST') {
    // 這邊請輸入你的 wsdl 網址，也就是本 php 檔案的網址
    $servidorSoap = new SoapServer('http://localhost/SOAP/server.php?wsdl');
    $servidorSoap->setClass('requestClass');
    $servidorSoap->handle();
} else {
    require_once 'SoapDiscovery.class.php';

    // requestClass 是要產生 wsdl 文件的類別名稱，SoapDiscovery 是你要產生後的 wsdl 的命名
    $disco = new SoapDiscovery('requestClass', 'SoapDiscovery');
    header("Content-type: text/xml");
    if (isset($_SERVER['QUERY_STRING']) && strcasecmp($_SERVER['QUERY_STRING'], 'wsdl') == 0) {
        echo $disco->getWSDL();
    } else {
        echo $disco->getDiscovery();
    }
}
\`\`\`

客戶端只要拿到 WSDL 網址就能建立連線，不需要自己知道函式簽章：

\`\`\`php
// 建立客戶端連線
$objClient = new SoapClient('http://localhost/SOAP/server.php?wsdl');
$objResponse = $objClient->request(array('in1' => '你好', 'in2' => '呵'));

// 印出傳回結果，利用 wsdl 產生的結果是一個關連式陣列
print_r($objResponse);

// 以下方法可以印出傳回的物件的型態和規格
var_dump($objClient->__getFunctions());
var_dump($objClient->__getTypes());
\`\`\`

\`__getFunctions()\` 和 \`__getTypes()\` 這兩個方法在除錯時很好用，可以直接看到 WSDL 目前公開了哪些方法、參數型別長什麼樣子，不必回頭翻 WSDL 原始 XML。

## 有 WSDL 跟沒 WSDL 的 SOAP 寫法差在哪？

|  | 不用 WSDL | 用 WSDL |
|---|---|---|
| 需要的檔案 | 只要 server / client 兩支 php | 多一份產生 WSDL 的類別 |
| 客戶端怎麼知道有哪些方法 | 需另外溝通或看程式碼 | 可用 \`__getFunctions()\` 查詢 |
| 建構子寫法 | \`new SoapServer(NULL, array('uri'=>...))\` | \`new SoapServer('位置?wsdl')\` |
| 適合情境 | 內部系統快速串接 | 對外提供服務、需要明確規格 |

資訊增益：如果 SOAP 服務只在自己團隊內部兩支程式之間呼叫，且雙方都能同步修改，不用 WSDL 的寫法就夠用，可以省掉維護 WSDL 檔案的成本。但只要服務會被其他團隊或外部系統呼叫，先把 WSDL 產生出來會省下大量事後溝通函式簽章的時間。

## 現在還適合用 PHP SOAP 嗎？

這篇原稿寫於 PHP SOAP 擴充套件還很常見的年代，現在多數新專案的 API 已經改用 REST 或 GraphQL。不過 SOAP 依然常出現在對接既有企業系統、政府單位介接、或某些金融與 ERP 系統的場景，PHP 內建的 \`soap\` 擴充套件在維護這類舊系統時仍然實用，值得知道它的基本用法。

## 常見問題

### PHP 要開啟 SOAP 功能需要裝什麼？

需要在 \`php.ini\` 中啟用 \`extension=soap\`（或對應的 \`php-soap\` 套件），啟用後才能使用 \`SoapServer\`、\`SoapClient\` 這兩個類別。

### \`SoapServer\` 建構子第一個參數是什麼意思？

第一個參數是 WSDL 檔案的路徑或網址。傳入 \`NULL\` 表示不使用 WSDL，改用 \`uri\` 選項當作服務的命名空間；傳入實際 WSDL 網址則會依 WSDL 內容自動建立服務規格。

### 客戶端呼叫失敗要怎麼抓錯誤？

用 \`try/catch\` 包住呼叫，捕捉 \`SoapFault\` 例外，\`$err->getMessage()\` 會回傳伺服器端拋出的錯誤訊息，是排查 SOAP 呼叫失敗最直接的方式。

### WSDL 是必須要手寫的嗎？

不一定。像原稿用的 \`SoapDiscovery\` 這類輔助類別，可以根據 PHP class 的方法定義自動產生 WSDL 內容，不需要手動撰寫 WSDL XML。

## 參考資料

- PHP 官方文件：[SOAP 擴充套件](https://www.php.net/manual/en/ref.soap.php)
- PHP 官方文件：[SoapServer](https://www.php.net/manual/en/class.soapserver.php)
- PHP 官方文件：[SoapClient](https://www.php.net/manual/en/class.soapclient.php)

## 延伸閱讀

- [PHP 產生 Excel 文件：用 XML xls 解決 CSV 編碼問題](/post/php-generate-excel-xml-xls)：同樣聚焦 PHP，可接著比較不同情境的做法。
- [PHP 讀取檔案的幾種方式比較](/post/php-file-reading-methods-comparison)：同樣聚焦 PHP，可接著比較不同情境的做法。
- [PHP Header 檔案下載控制：Content-Disposition 與安全下載範例](/post/php-header-file-download)：同樣聚焦 PHP，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2026-08-28。原文發布於 2009-02-09，本文保留原始 SOAP server/client 範例，並補上比較表與現代適用情境說明。

`;export{e as default};