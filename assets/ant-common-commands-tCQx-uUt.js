var e=`---
title: Apache Ant 常用命令整理：copy、delete、mkdir、move、echo 用法範例
description: 整理 Apache Ant 建構腳本最常用的五個命令：copy 複製檔案目錄、delete 刪除檔案、mkdir 建立目錄、move 移動檔案、echo 輸出訊息，附完整 XML 範例可直接套用。
date: 2013-07-28
category: DevOps
tags: [Ant, Java, 建構工具, DevOps]
readingTime: 3 分鐘
image: /images/tech/hero_ant-common-commands.webp
imageAlt: 螢幕上顯示 XML 原始碼的深色程式編輯器畫面
---


# Apache Ant 常用命令整理：copy、delete、mkdir、move、echo 用法範例

寫 Ant 建構腳本時，最常反覆查的就是 copy、delete、mkdir、move、echo 這幾個基本命令的寫法。這篇我把自己常用的用法整理成範例清單，涵蓋複製單一檔案與整個目錄、刪除檔案與備份、建立目錄、搬移檔案，以及把訊息寫進日誌檔，需要時直接照抄改路徑就能用。

## 怎麼用 copy 命令複製檔案和目錄？

\`copy\` 主要用來對檔案和目錄做複製，常見三種情境：

1. 複製單個檔案：

\`\`\`xml
<copy file="original.txt" tofile="copied.txt"/>
\`\`\`

2. 對檔案目錄進行複製：

\`\`\`xml
<copy todir="../dest_dir">
  <fileset dir="src_dir"/>
</copy>
\`\`\`

3. 將檔案複製到另外的目錄：

\`\`\`xml
<copy file="source.txt" todir="../home/philander"/>
\`\`\`

## delete 命令怎麼刪除檔案與目錄？

\`delete\` 用來對檔案或目錄進行刪除，幾個常見例子：

1. 刪除某個檔案：

\`\`\`xml
<delete file="/home/photos/philander.jpg"/>
\`\`\`

2. 刪除某個目錄：

\`\`\`xml
<delete dir="/home/photos"/>
\`\`\`

3. 刪除所有的備份檔或空目錄：

\`\`\`xml
<delete includeEmptyDirs="true">
  <fileset dir="." includes="**/*.bak"/>
</delete>
\`\`\`

## mkdir 命令怎麼建立目錄？

\`mkdir\` 用來建立目錄，一次指定完整路徑即可：

\`\`\`xml
<mkdir dir="/home/philander/build/classes"/>
\`\`\`

## move 命令怎麼移動檔案或目錄？

\`move\` 用來移動檔案或目錄，寫法和 \`copy\` 很像，但來源會被搬走：

1. 移動單個檔案：

\`\`\`xml
<move file="sourcefile" tofile="destfile"/>
\`\`\`

2. 移動單個檔案到另一個目錄：

\`\`\`xml
<move file="sourcefile" todir="movedir"/>
\`\`\`

3. 移動某個目錄到另一個目錄：

\`\`\`xml
<move todir="newdir">
  <fileset dir="olddir"/>
</move>
\`\`\`

## echo 命令怎麼輸出訊息到日誌？

\`echo\` 的作用是根據日誌或監控器的級別輸出資訊。它包括 \`message\`、\`file\`、\`append\` 和 \`level\` 四個屬性，例如把訊息附加寫入日誌檔：

\`\`\`xml
<echo message="Hello,ANT" file="/home/philander/logs/ant.log" append="true"/>
\`\`\`

## 常見問題

### Ant 的 copy 和 move 命令有什麼差別？

兩者語法幾乎相同，都支援 \`file\`/\`tofile\`/\`todir\` 與 \`fileset\`。差別在於 \`copy\` 會保留來源檔案，而 \`move\` 在複製後會刪除來源，等同「搬移」。

### 怎麼用 Ant 刪除所有備份檔（*.bak）？

使用 \`delete\` 搭配 \`fileset\` 的 \`includes="**/*.bak"\`，並加上 \`includeEmptyDirs="true"\` 把清空後的目錄一併刪掉。\`**\` 代表遞迴比對所有子目錄。

### Ant 的 echo 可以把訊息寫進檔案嗎？

可以。指定 \`file\` 屬性就會把 \`message\` 寫入該檔案，再加上 \`append="true"\` 表示附加而非覆蓋，適合用來累積建置日誌。

### Ant 還在用嗎？不是都用 Maven 或 Gradle 了嗎？

Maven、Gradle 確實是現在的主流，但不少維護中的舊 Java 專案仍是 Ant 腳本。理解 copy、delete、mkdir、move、echo 這些基本命令，對接手舊專案或撰寫簡單的自動化流程仍然很有幫助。

## 參考資料

- [Apache Ant Manual: Core Tasks](https://ant.apache.org/manual/)

## 延伸閱讀

- [利用 Ant 構建和部署 Java 專案](/post/ant-build-and-deploy-java-projects)：同樣聚焦 Ant、Java，可接著比較不同情境的做法。
- [Ant 建構腳本編寫入門：project、target、property 三大關鍵元素](/post/ant-build-script-key-elements)：同樣聚焦 Ant、Java，可接著比較不同情境的做法。
- [Ant 建構與部署 Java 專案完整教學：javac、java、jar、war 任務實戰](/post/ant-build-and-deploy-java-projects)：同樣聚焦 Java、Ant，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2013-07-28，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};