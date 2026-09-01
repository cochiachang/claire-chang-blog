var e=`---
title: Flex ResourceManager 動態載入多國語系的實作方式
description: 用 Ant 編譯 locale 資源檔，搭配 ResourceManager 在 Flex 專案中動態切換多國語系。
date: 2011-06-21
category: 前端開發
tags: [Flex, ActionScript, Ant, 多國語系, ResourceManager]
readingTime: 4 分鐘
image: /images/tech/hero_flex-resourcemanager-multilingual-locale.webp
imageAlt: 桌上地球儀特寫，象徵多國語系與在地化
---


# Flex ResourceManager 動態載入多國語系的實作方式

Flex 專案要支援多國語系，做法是把每種語言的文字放進獨立的 \`.properties\` locale 檔，用 Ant 編譯成對應的 resource bundle swf，再透過 \`ResourceManager\` 在執行期間讀取。以下記錄實際設定過程中會用到的 Ant XML、Flash Builder 設定步驟，以及容易漏掉的編譯參數。

## Ant 編譯 locale swf 的 XML 要怎麼寫？

Ant 編譯 locale swf 的 XML 需要指定 Flex SDK 路徑、載入 \`flexTasks.jar\`，並為每個語言各自定義一個 \`mxmlc\` 編譯目標。以下範例编译出 \`en_US\` 與 \`zh_TW\` 兩種語言的 resource bundle：

\`\`\`xml
<?xml version="1.0" encoding="utf-8"?>
<project name="Example resource bundle builder" basedir="." default="main">
<!--這邊應設定為自己電腦的flex sdk的位置-->
<property name="FLEX_HOME" value="C:\\Program Files\\Adobe\\Adobe Flash Builder 4.5\\sdks\\4.5.0" />
<property name="APP_ROOT" value="\${basedir}"/>
<!--這邊需要載入ant編譯as檔案所需的flexTasks.jar以及所有相關編譯所需的函式庫-->
<taskdef resource="flexTasks.tasks" >
    <classpath> <pathelement path="\${FLEX_HOME}/ant/lib/flexTasks.jar"/>
        <pathelement path="\${FLEX_HOME}/lib/flexTasks.jar"/>
        <fileset dir="\${FLEX_HOME}/lib">
            <include name="**/*.jar"/>
        </fileset>
    </classpath>
</taskdef>
<!--定義所有的語言-->
<target name="main">
    <antcall target="en_US"></antcall>
    <antcall target="zh_TW"></antcall>
</target>
<target name="en_US">
    <mxmlc>
        <locale>en_US</locale>
        <source-path>locale/{locale}</source-path>
        <include-resource-bundles>test</include-resource-bundles>
        <output>src/Resources_en_US.swf</output>
    </mxmlc>
</target>
<target name="zh_TW">
    <mxmlc keep-generated-actionscript="true">
        <allow-source-path-overlap>true</allow-source-path-overlap>
        <locale>zh_TW</locale>
        <source-path>locale/{locale}</source-path>
        <!--載入相關的函式庫-->
        <compiler.library-path dir="\${FLEX_HOME}/frameworks" append="true">
            <include name="libs" />
            <include name="locale/{locale}" />
        </compiler.library-path>
        <!--定義要載入的語言檔案(可以用很多檔案)-->
        <include-resource-bundles>test</include-resource-bundles>
        <!--<include-resource-bundles>other</include-resource-bundles>-->
        <output>src/Resources_zh_TW.swf</output>
    </mxmlc>
</target>
</project>
\`\`\`

\`FLEX_HOME\` 要改成自己電腦上 Flex SDK 的實際安裝路徑，\`include-resource-bundles\` 則對應 locale 資料夾裡的 \`.properties\` 檔名（不含副檔名）。每新增一種語言，就多加一個 \`target\` 並在 \`main\` 裡 \`antcall\` 它。

## 怎麼讓 Flash Builder 認得這份 Ant 腳本？

Flash Builder 預設沒有開啟 Ant 面板，要先更新編輯器外掛再手動叫出視窗、載入 XML。步驟如下：

1. 從 Help → Software Updates 更新 Flash Builder 的 Ant 編輯程式。
2. 從 Windows → Show View → Other → Ant，把 Ant 視窗叫出來。
3. 按 Ant 編譯視窗最左邊的「Add Buildfiles」，選擇剛剛寫好的 XML。
4. 執行它，確認 \`src\` 目錄下產生了 \`Resources_en_US.swf\` 與 \`Resources_zh_TW.swf\`。

## 為什麼專案編譯時一定要加 -locale 參數？

Flex 專案本身的編譯參數如果沒有指定 \`-locale\`，執行期切換語言時會找不到核心語言的 CORE 檔案而報錯。同時支援中文與英文，編譯參數要寫成：

\`\`\`text
-locale en_US zh_TW
\`\`\`

漏掉這個設定，是這個做法裡最容易卡關的地方——resource bundle swf 編譯成功，但主專案不吃 locale 參數，執行期還是讀不到對應的字串。

## locale 檔案的副檔名與格式是什麼？

Locale 檔案使用 \`.properties\` 副檔名，內容是純文字的 key-value 對照表，一個 key 對應一種語言的翻譯字串。每個語言各自一份 \`.properties\`，放在 \`locale/{locale}\` 資料夾下，和 Ant XML 裡 \`source-path\` 設定的路徑對應。

## 常見問題

### 為什麼執行時會缺少核心語言 CORE 檔案？

因為主專案的編譯設定沒有加上 \`-locale en_US zh_TW\` 這類參數。只編譯 resource bundle swf 是不夠的，Flex 專案本身也要知道自己要支援哪些 locale，兩邊設定要一致。

### resource bundle 一定要用 Ant 編譯嗎？

這個做法是用 Ant 呼叫 \`mxmlc\` 產出獨立的 resource bundle swf，方便語言檔案獨立更新、不用重新編譯整個專案。如果語言檔數量少、不常變動，也可以考慮把 locale 資源直接打包進主專案編譯。

## 參考資料

- Nate Bilyk, Flex Localization Example（原文已下架）
- Judah Frangipane, Flex Builder 3 Ant Support（原文已下架）
- Adobe, ResourceManager (Flash Platform ActionScript 3 Reference), http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/mx/resources/ResourceManager.html

## 延伸閱讀

- [把 Flex SDK 4 整合進 Flex Builder 3](/post/integrate-flex-sdk-4-into-flex-builder-3)：同樣聚焦 Flex、ActionScript，可接著比較不同情境的做法。
- [Flex Builder 怎麼裝自動格式化外掛？](/post/flex-builder-auto-format-code)：同樣聚焦 Flex、ActionScript，可接著比較不同情境的做法。
- [Flex 3 原生 TabNavigator 分頁太多怎麼辦？SuperTabNavigator 解法整理](/post/flex-supertabnavigator-scrollable-tabs)：同樣聚焦 Flex、ActionScript，可接著比較不同情境的做法。
`;export{e as default};