var e=`---
title: Eclipse Ant 建置設定教學：安裝 ant-contrib 與解決 Java heap space 錯誤
description: 在 Eclipse 裡用 Ant 編譯檔案的兩個常見問題一次解決：如何把 ant-contrib 的 jar 加進 Ant Runtime 的 global entries，以及遇到 java.lang.OutOfMemoryError 時怎麼調整 VM 記憶體參數。
date: 2011-07-27
category: DevOps
tags: [Ant, Eclipse, Java, 建置工具, OutOfMemoryError]
readingTime: 2 分鐘
image: /images/tech/hero_eclipse-ant-build-setup.webp
imageAlt: 在 Eclipse IDE 中執行 Apache Ant 建置任務的示意圖
---


# Eclipse Ant 建置設定教學：安裝 ant-contrib 與解決 Java heap space 錯誤

在 Eclipse 裡用 Apache Ant 編譯檔案時，最常撞到兩個問題：ant-contrib 任務抓不到、以及建置跑到一半拋出 \`java.lang.OutOfMemoryError: Java heap space\`。這篇文章記錄我當時在 Eclipse 中設定 ant-contrib 與調整 JVM 記憶體參數的完整做法，照著步驟做就能順利完成建置。

## 如何把 ant-contrib 裝進 Eclipse 的 Ant？

打開 Eclipse 的偏好設定，把 ant-contrib 的 jar 檔加進 Ant 的 classpath 就可以了：

1. 選單路徑：\`Window → Preferences → Ant → Runtime\`
2. 在 **Global entries** 頁籤中，選擇（加入）ant-contrib 的 jar 檔

加進去之後，\`<for>\`、\`<foreach>\`、\`<if>\` 等 ant-contrib 提供的任務就能在建置檔裡直接使用了。

## 遇到 java.lang.OutOfMemoryError: Java heap space 怎麼辦？

如果建置過程拋出 \`java.lang.OutOfMemoryError: Java heap space\`，代表 JVM 預設的堆積記憶體不夠用，把 VM 參數調大即可。有兩種設定位置：

### 方法一：調整全域的 Installed JREs 設定

1. \`Window → Preferences → Java → Installed JREs\`
2. 選擇執行建置的那個 JDK，按 **Edit...**
3. 在 **Default VM arguments** 填入：

\`\`\`
-Xms64m -Xmx512m
\`\`\`

### 方法二：只針對單一檔案的執行設定（我實際使用的方法）

改全域設定會影響所有專案，所以我後來改用只針對單一 build 檔的方式：

1. 在檔案上按右鍵 → **Properties**
2. 進入 **Run/Debug Settings**，按 **Edit**
3. 切到 **JRE** 頁籤
4. 把 **VM arguments** 設為：

\`\`\`
-Xms64m -Xmx512m
\`\`\`

這樣只有這個建置檔會用比較大的 heap，不會動到其他專案的預設行為。

## 常見問題

### ant-contrib 的 jar 檔要去哪裡下載？

可以從 Apache 的 ant-contrib 專案頁面（SourceForge 上的 ant-contrib）下載 release 版本的 jar 檔，下載後不需要放進 Ant 的 lib 目錄，只要透過 Eclipse 的 Ant Runtime → Global entries 指定路徑即可。

### -Xms 和 -Xmx 有什麼差別？

\`-Xms\` 是 JVM 啟動時配置的初始堆積大小，\`-Xmx\` 是堆積的上限。把 \`-Xmx\` 調大（例如 512m）通常就能解決 \`Java heap space\` 的錯誤。

### 為什麼建議用 Run/Debug Settings 而不是改全域 JRE 參數？

改 Installed JREs 的 Default VM arguments 會影響所有使用該 JRE 的專案；用單一檔案的 Run/Debug Settings 設定，記憶體參數只對這個建置檔生效，影響範圍最小、也更容易追踪。

### 設定完還是 OutOfMemoryError 怎麼辦？

先確認建置實際跑的是哪一個 JRE/JDK（Run configuration 的 JRE 頁籤），參數要設在對的設定上。若 512m 還不夠，可以再往上調，例如 \`-Xmx1024m\`，但要留意機器本身的可用記憶體。

## 參考資料

- [Apache Ant 官方網站](https://ant.apache.org/)
- [ant-contrib 專案](https://ant-contrib.sourceforge.net/)

## 延伸閱讀

- [利用 Ant 構建和部署 Java 專案](/post/ant-build-and-deploy-java-projects)：同樣聚焦 Ant、Java，可接著比較不同情境的做法。
- [ant 腳本編寫 – 關鍵元素](/post/ant-build-script-key-elements)：同樣聚焦 Ant、Java，可接著比較不同情境的做法。
- [Apache Ant 常用命令整理：copy、delete、mkdir、move、echo 用法範例](/post/ant-common-commands)：同樣聚焦 Ant、Java，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2011-07-27，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};