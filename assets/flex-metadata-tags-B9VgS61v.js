var e=`---
title: Flex 元數據標籤（Metadata Tags）完整指南——告訴編譯器如何編譯
description: Flex 元數據標籤完整指南：從最常用的 [Bindable] 到 [Embed]、[Event]、[RemoteClass] 等 12 個標籤的定義與用法範例，搞懂這些告訴編譯器如何編譯 SWF 的特殊標籤，就知道該在何時何處使用它們。
date: 2009-11-13
category: 前端開發
tags: [Flex, ActionScript, MXML, 編譯器]
readingTime: 9 分鐘
image: /images/tech/hero_flex-metadata-tags.webp
imageAlt: 程式碼編輯器中的標籤與編譯概念示意圖
---


# Flex 元數據標籤（Metadata Tags）完整指南——告訴編譯器如何編譯

雖然多數 Flex 開發者都用過 \`[Bindable]\` 標籤，但很多人其實不知道這個標籤的作用，甚至不知道它為何物。\`[Bindable]\` 就是所謂的元數據標籤（metadata tag）——一種特殊的標籤，它在程式碼中的作用是向編譯器提供如何編譯程式的資訊。實際上，這些標籤並不會被編譯到生成的 SWF 檔案中，而只是告訴編譯器如何生成 SWF。文件中列出的元數據標籤共有 12 個，本文將逐一講解它們的定義並給出使用範例，看完之後你就會明白該在何時何處於 Flex 應用程式中使用元數據標籤了。

## 什麼是元數據標籤？它和一般程式碼有什麼不同？

元數據標籤是一種「寫給編譯器看」的特殊標籤。它不會出現在最終生成的 SWF 中，也不佔執行期的邏輯，而是影響編譯器如何生成 SWF——例如綁定資料、嵌入資源、宣告事件等。最常見的例子就是 \`[Bindable]\`：多數人都用過，但它背後的機制（編譯器為你生成事件分派與綁定程式碼）往往被忽略。以下按照用途整理 12 個標籤。

## [ArrayElementType]：如何限制陣列元素的資料型別？

定義一個陣列通常來說是一件很平常的事情，因為陣列中的元素可以是任何型別。不過，使用 \`[ArrayElementType]\` 元數據標籤可以讓你定義陣列元素的資料型別：

\`\`\`actionscript
[ArrayElementType("String")]
public var arrayOfStrings:Array;

[ArrayElementType("Number")]
public var arrayOfNumbers:Array;

[ArrayElementType("mx.core.UIComponent")]
public var arrayOfUIComponents:Array;
\`\`\`

## [Bindable]：最常用的資料綁定標籤怎麼用？

\`[Bindable]\` 是最常用到的一個元數據標籤，因為它讓程式組件之間的資料同步變得很容易。Bindable 可以用來綁定簡單資料型別、類別、複雜資料型別以及函式。綁定資料的時候，你必須先使用元數據標籤定義資料。

Bindable 也可以用來綁定到事件。你可以使用 getter 和 setter 函式將一個屬性綁定到一個事件上。例如有一個叫做 \`phoneNumber\` 的私有變數，還有一個公有的 setter 和 getter 函式。使用 \`[Bindable]\` 標籤將這個 getter 方法綁定到一個叫做 \`phoneNumberChanged\` 的事件上，只要資料發生改變，setter 方法就會分派 \`phoneNumberChanged\` 事件。

透過使用 setter 方法，可以在資料賦予私有變數之前對其進行操作——例如只有在長度大於等於 10 的時候才進行格式化。當 \`phoneNumberChanged\` 事件被分派時，第二個 TextInput 組件會被更新，因為它的 \`text\` 屬性綁定到了 \`phoneNumber\` 變數上。

## [DefaultProperty]：如何省略屬性名稱直接設定預設屬性？

\`[DefaultProperty]\` 元數據標籤用來將一個單一屬性設定為某個類別的預設屬性。它允許在一個容器標籤內設定屬性，而不用定義屬性的名字。一個簡單的例子就是自訂 Button 類別：將 \`label\` 屬性設定為 DefaultProperty 之後，\`label\` 屬性就可以在自訂 Button 標籤中直接以字串定義。

## [Embed]：如何把圖片等資源嵌入程式？

\`[Embed]\` 元數據標籤用來匯入圖片到程式。可以透過兩種方式使用 Embed：你可以將圖片嵌入到 ActionScript 中並將其指派給一個變數，或者你也可以將圖片直接指派給組件的屬性。

例 1（嵌入為 Class 變數）：

\`\`\`actionscript
[Embed(source="myIcon.gif")]
[Bindable]
public var myIcon:Class;
\`\`\`

\`\`\`xml
<mx:Button label="Icon Button 1" icon="{myIcon}"/>
<mx:Button label="Icon Button 2" icon="{myIcon}"/>
\`\`\`

例 2（直接在屬性上使用 @Embed）：

\`\`\`xml
<mx:Button label="Icon Button 1" icon="@Embed(source='myIcon.gif')"/>
<mx:Button label="Icon Button 2" icon="@Embed(source='myIcon.gif')"/>
\`\`\`

上面這兩個例子產生的結果是一樣的。建立 \`myIcon\` 類別的好處是，它在一個類別中只定義一次，就可以綁定到程式中的多個組件。

## [Event] 與 [Effect]：如何宣告自訂事件與效果？

\`[Event]\` 元數據標籤用來宣告那些被自訂類別分派的事件。將這個元數據標籤加入類別定義之後，你就可以在 MXML 標籤中加入事件處理函式來初始化該自訂類別。例如建立一個自訂 Button 類別，每當它的 \`label\` 屬性改變時就會分派一個事件；主程式檔案初始化這個自訂 Button 並建立事件處理函式，該函式將新的 label 屬性值賦給一個 TextArea 組件以顯示當前發生的更改。

\`[Effect]\` 元數據標籤用來定義一個自訂效果，當某個事件發生的時候該效果會被分派。這個示例可以基於前面 Event 的例子來建立，只要簡單地更改 ButtonLabel 類別中的一行程式碼，就定義了一個效果，該效果可以在 MXML 標籤中直接使用。

## [IconFile]：自訂類別的圖標用哪個標籤？

\`[IconFile]\` 用來定義一個 jpg、gif 或 png 檔案的檔名，它在你的自訂類別中作為圖標使用。\`[Embed]\` 可以用來嵌入圖片、SWF 檔案、音樂檔案以及視訊檔案等，而 IconFile 則只是用來嵌入作為自訂類別圖標的檔案：

\`\`\`actionscript
[IconFile("icon.png")]
public class CustomButton extends Button {}
\`\`\`

## [Inspectable]：如何讓屬性出現在程式碼提示與屬性檢查器？

在使用 Flex Builder 的時候，你可能會希望某些自訂組件的屬性在程式碼提示和屬性檢查器（property inspector）中顯示，\`[Inspectable]\` 元數據標籤就是用來定義那些屬性的。例如定義一個 inspectable 的 \`ccType\` 變數，指定 Visa 為預設值、Credit Card 為類別，並將取值範圍定義為包含 Visa、Mastercard、Discover 和 American Express 的枚舉。切到設計視圖時，就能在屬性檢查器中看到 \`ccType\` 的類別為 Credit Card，所有可選的值都在下拉列表中。

## [InstanceType]：模板物件的型別怎麼宣告？

當在一個模板物件中宣告一個像 \`IDeferredInstance\` 這樣的變數時，\`[InstanceType]\` 元數據標籤就用來宣告物件的型別：

\`\`\`actionscript
[InstanceType("package.className")]
\`\`\`

## [NonCommittingChangeEvent]：如何避免中途變更觸發綁定？

\`[NonCommittingChangeEvent]\` 元數據標籤可以在某個特定事件發生時，防止變數在事件發生的過程中被更改。實際例子：一個名為 \`s\` 的字串型私有變數被綁定到 id 為 \`ti2\` 的 TextInput 組件上；另一個 id 為 \`ti1\` 的 TextInput 組件在它的 \`text\` 發生更改時，會把 \`s\` 的值設為它的 \`text\` 屬性值。另外，當 \`triggerBinding\` 事件被分派時，附加在 \`s\` 變數上的 Binding 元數據標籤才會進行綁定——只有在 Enter 鍵在 \`ti1\` TextInput 組件中被按下時才會分派 \`triggerBinding\` 事件。

## [RemoteClass]：ActionScript 如何對應 Java / ColdFusion 類別？

\`[RemoteClass]\` 可以用來將一個 ActionScript 類別綁定到一個 Java 類別或一個 ColdFusion CFC，這樣做可以自動轉換資料型別。下面的例子將套件 com.mydomain 中名為 MyClass 的 ActionScript 類別綁定到同一個套件中名為 MyClass 的 Java 類別：

\`\`\`actionscript
package com.mydomain {
    [Bindable]
    [RemoteClass(alias="com.mydomain.MyClass")]
    public class MyClass {
        public var id:int;
        public var myText:String;
    }
}
\`\`\`

## [Style]：如何為組件定義自訂樣式屬性？

\`[Style]\` 元數據標籤用來為組件定義自訂樣式屬性。只需要簡單地將 Style 元數據標籤加入類別的定義，之後就可以使用 \`getStyle\` 方法取得它的值。例如定義 \`borderColor\` 和 \`fillColor\` 兩個樣式，它們的資料型別都是 uint。當類別初始化時這兩個樣式就會在標籤中被設定；程式碼中覆寫 \`updateDisplayList\` 函式，用自訂的樣式畫出一個圓形邊框並將其填充。

## 什麼時候該用這些元數據標籤？

看完這些標籤，你應該會有這樣的感覺：「喔，現在我知道在哪裡可以使用它們了」或者「嗯，我想我會在新專案中嘗試使用這些元數據標籤」。如果沒有，那麼你可能需要回過頭再看一遍。Adobe Flex 小組提供給我們的元數據標籤不只是非常強大，可以讓我們擴展或自訂要做的東西，而且還非常易於使用——透過使用它們，僅僅幾行程式碼就可以完成一大堆事情。如果不使用這些標籤，你會發現在 Flex 中實現某些功能是很辛苦的。

## 常見問題

### 什麼是 Flex 元數據標籤？

元數據標籤是一種特殊的標籤，作用是向編譯器提供如何編譯程式的資訊。它們不會被編譯到最終的 SWF 檔案中，而是影響編譯器生成 SWF 的方式，例如資料綁定、資源嵌入、事件宣告等。

### [Bindable] 標籤的作用是什麼？

\`[Bindable]\` 讓程式組件之間的資料同步變得容易，可用於綁定簡單資料型別、類別、複雜資料型別與函式，也可以搭配 getter/setter 綁定到自訂事件，在資料變更時自動更新綁定的組件。

### [Embed] 和 [IconFile] 有什麼不同？

\`[Embed]\` 可以嵌入圖片、SWF、音樂、視訊等各種資源，並指派給變數或組件屬性；\`[IconFile]\` 則只用來指定作為自訂類別圖示的 jpg/gif/png 檔名，用途單一。

### [RemoteClass] 解決什麼問題？

\`[RemoteClass]\` 用來把 ActionScript 類別對應到 Java 類別或 ColdFusion CFC，透過 \`alias\` 指定遠端類別全名，讓兩端之間的資料型別自動轉換，省去手動序列化。

### 元數據標籤會增加 SWF 大小嗎？

標籤本身不會被編譯進 SWF，但它觸發編譯器生成的程式碼（例如 \`[Bindable]\` 產生的事件分派邏輯）會包含在 SWF 中。整體而言這些生成程式碼非常精簡，幾行程式碼就能完成原本要手寫很多的工作。

## 參考資料

- Adobe Flex 說明文件：Metadata tags（官方文件中列出的 12 個元數據標籤清單）

## 延伸閱讀

- [Flex 元數據標籤——告訴編譯器如何編譯](/post/flex-metadata-tags)：同樣聚焦 Flex、ActionScript，可接著比較不同情境的做法。
- [把 Flex SDK 4 整合進 Flex Builder 3](/post/integrate-flex-sdk-4-into-flex-builder-3)：同樣聚焦 Flex、ActionScript，可接著比較不同情境的做法。
- [Flex Builder 怎麼裝自動格式化外掛？](/post/flex-builder-auto-format-code)：同樣聚焦 Flex、ActionScript，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2009-11-13，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};