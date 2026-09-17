var e=`---
title: 利用 Ant 構建和部署 Java 專案
description: 用 Ant 取代 javac、java、jar 等手動命令，從編譯、執行到打包 jar 與 war 完整自動化 Java 專案的構建與部署流程，附上可直接使用的 build.xml 範例。
date: 2013-08-01
category: DevOps
tags: [Ant, Java, 自動化建置, DevOps, build.xml]
readingTime: 5 分鐘
image: /images/tech/hero_ant-build-and-deploy-java-projects.webp
imageAlt: 螢幕上顯示程式碼的深色照片，象徵 Java 專案的自動化構建與部署
---


# 利用 Ant 構建和部署 Java 專案

Ant 可以代替使用 javac、java 和 jar 等命令來執行 Java 操作，從而達到輕鬆構建和部署 Java 專案的目的。這篇我用幾個由淺入深的例子，示範怎麼用一個 build.xml 檔把編譯、執行、打包到部署全部自動化。

## 怎麼用 Ant 的 javac 命令編譯 Java 程式？

Ant 的 javac 命令用於實現編譯 Java 程式的功能。下面來看一個簡單的例子：首先我建立名為 JAVATestPro 的 Java 項目，建立 src 目錄為源代碼目錄，在 src 目錄下建立 HelloWorld.java 這個類檔。該類檔的內容如下：

\`\`\`java
public class HelloWorld {
    public static void main(String[] args) {
       System.out.println("hello world!");
    }
}
\`\`\`

同時在 JAVATestPro 項目的根目錄下建立 build.xml 檔，在該檔中編譯 src 目錄下的 Java 檔，並將編譯後的 class 檔放入 build/classes 目錄中，整個項目的目錄結構如下：

\`\`\`
|JAVATestPro
  |src
  |build
    |classes
  |build.xml
\`\`\`

在編譯前，需清除 classes 目錄，該檔的內容如下：

\`\`\`xml
<?xml version="1.0" ?>
<project name ="javacTest" default="compile" basedir=".">
  <target name="clean">
    <delete dir="\${basedir}/build"/>
  </target>
  <target name="compile" depends="clean">
    <mkdir dir ="\${basedir}/build/classes"/>
    <javac srcdir ="\${basedir}/src" destdir ="\${basedir}/build/classes"/>
  </target>
</project>
\`\`\`

在項目根目錄（\`C:\\ThinkInJAVACode\\JAVATestPro\`）執行 ant 命令後，可在該目錄下發現新生成的 build/classes 子目錄，編譯後生成的 HelloWorld.class 檔就在該目錄下。

## 怎麼用 Ant 的 java 命令執行程式？

Ant 中可以使用 java 命令實現運行 Java 程式的功能。可以在上面的 build.xml 基礎上做修改來實現：

\`\`\`xml
<?xml version="1.0" ?>
<project name ="javacTest" default="run" basedir=".">
  <target name="clean">
    <delete dir="\${basedir}/build"/>
  </target>
  <target name="compile" depends="clean">
    <mkdir dir ="\${basedir}/build/classes"/>
    <javac srcdir ="\${basedir}/src" destdir ="\${basedir}/build/classes"/>
  </target>
  <target name="run" depends="compile">
    <java classname ="HelloWorld">
      <classpath>
        <pathelement path ="\${basedir}/build/classes"/>
      </classpath>
    </java>
  </target>
</project>
\`\`\`

接著，就可以在主控台看見輸出：\`[java] hello world!\`

## 怎麼用 Ant 的 jar 命令生成 jar 檔？

還可以在上例的基礎上更進一步，來生成 jar 包，可在 run 這個 target 下再加上如下 target：

\`\`\`xml
<?xml version="1.0" ?>
<project name ="javacTest" default="jar" basedir=".">
  <target name="clean">
    <delete dir="\${basedir}/build"/>
  </target>
  <target name="compile" depends="clean">
    <mkdir dir ="\${basedir}/build/classes"/>
    <javac srcdir ="\${basedir}/src" destdir ="\${basedir}/build/classes"/>
  </target>
  <target name="run" depends="compile">
    <java classname ="HelloWorld">
      <classpath>
        <pathelement path ="\${basedir}/build/classes"/>
      </classpath>
    </java>
  </target>
  <target name="jar" depends="run">
    <jar destfile="helloworld.jar" basedir="\${basedir}/build/classes">
      <manifest>
        <attribute name="Main-class" value="HelloWorld"/>
      </manifest>
    </jar>
  </target>
</project>
\`\`\`

其中，project 的 default 屬性應設為 jar，ant 運行完畢後，可看到在項目的根目錄下生成了一個 helloworld.jar 的 jar 包。可通過運行以下命令來執行該 jar 包：

\`\`\`bash
java -jar helloworld.jar
\`\`\`

## 怎麼用 Ant 的 war 命令打包 JavaEE 專案？

建立一個 JavaEE 項目，其中 src 為 Java 源代碼目錄，WebContent 為各 jsp 存放目錄，lib 為項目引用的包的目錄。在 WebTest 項目目錄下建立了 build.xml 檔，該檔為該工程的 Ant 構件檔。

\`\`\`
|WebContent
  |src
  |build
    |classes
  |WebContent
    |META-INF
      |MANIFEST.MF
    |WEB-INF
      |lib
      |classes
  |HelloJSP.jsp
  |build.xml
\`\`\`

可以在 src 目錄下放入在前續例子中開發的 HelloWorld.java 檔，並在 WebContent 下建立 HelloJSP.jsp 檔，其內容很簡單，就是輸出 Hello 資訊，代碼如下所示：

\`\`\`xml
<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "HTTP://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta HTTP-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>war test for ant</title>
</head>
<body>
Hello JSP!Hello Ant!
</body>
</html>
\`\`\`

接下來編寫 build.xml 檔，其內容如下：

\`\`\`xml
<?xml version="1.0" encoding="UTF-8" ?>
<project name ="WebTest" default ="war" basedir =".">
  <property name ="classes" value ="\${basedir}/build/classes"/>
  <property name ="build" value ="\${basedir}/build"/>
  <property name ="lib" value ="\${basedir}/WebContent/WEB-INF/lib"/>
  <!-- 刪除build 路徑-->
  <target name ="clean">
    <delete dir ="\${build}"/>
  </target>

  <!-- 建立build/classes 路徑，並編譯class 檔到build/classes 路徑下-->
  <target name ="compile" depends ="clean">
    <mkdir dir ="\${classes}"/>
    <javac srcdir ="\${basedir}/src" destdir ="\${classes}"/>
  </target>

  <!-- 打war 包-->
  <target name ="war" depends ="compile">
    <war destfile ="\${build}/WebTest.war" webxml ="\${basedir}/WebContent/WEB-INF/web.xml">
      <!-- 拷貝WebRoot 下除了WEB-INF 和META-INF 的兩個檔夾-->
      <fileset dir ="\${basedir}/WebContent" includes ="**/*.jsp"/>
      <!-- 拷貝lib 目錄下的jar 包-->
      <lib dir ="\${lib}"/>
      <!-- 拷貝build/classes 下的class 檔-->
      <classes dir ="\${classes}"/>
    </war>
  </target>
</project>
\`\`\`

在 \`C:\\ThinkInJAVACode\\WebTest\` 目錄下運行 ant 後，就生成了 WebTest.war 檔了，然後可以將其放入 Web 容器（如 Tomcat）的相應目錄下（\`\${Tomcat安裝目錄}\\webapps\`）運行該 web 項目了。

## 常見問題

### Ant 的 default 屬性有什麼作用？

default 指定直接執行 \`ant\` 命令時要跑的 target，例如設為 \`jar\` 時，輸入 ant 就會依賴鏈依序執行 clean、compile、run，最後打包 jar。每個 target 的 depends 屬性就是用來串起這條執行鏈的。

### 為什麼 build.xml 裡通常會先寫一個 clean target？

clean 用 \`delete\` 刪掉整個 build 目錄，確保每次構建都是乾淨的狀態，避免殘留舊的 class 檔造成行為不一致。通常 compile target 會用 \`depends="clean"\` 讓它在編譯前自動執行。

### jar 和 war 任務最大的差別是什麼？

jar 用來打包一般的 Java 應用程式，並可在 manifest 中指定 Main-class；war 則針對 JavaEE web 專案，除了 class 檔外還要放 jsp、lib 目錄下的 jar 包，並用 webxml 屬性指定 web.xml，打包完可直接丟進 Tomcat 的 webapps 目錄部署。

### 編譯後的 class 檔要放哪裡？

慣例是放在 build/classes 目錄下。先用 mkdir 建立，再用 javac 的 destdir 屬性指定輸出位置，後續的 java、jar、war 任務都以這個目錄為基礎。

## 延伸閱讀

- [Ant 建構與部署 Java 專案完整教學：javac、java、jar、war 任務實戰](/post/ant-build-and-deploy-java-projects)：同樣聚焦 Java、Ant，可接著比較不同情境的做法。
- [ant 腳本編寫 – 關鍵元素](/post/ant-build-script-key-elements)：同樣聚焦 Ant、Java，可接著比較不同情境的做法。
- [Apache Ant 常用命令整理：copy、delete、mkdir、move、echo 用法範例](/post/ant-common-commands)：同樣聚焦 Ant、Java，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2013-08-01，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};