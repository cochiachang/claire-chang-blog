var e=`---
title: "初探OSMF的Plug-in開發"
description: "整理OSMF官方Plugin開發指南重點：PluginInfo建立方式、靜態與動態載入、三種Plug-in類型的差異"
date: 2013-03-05
category: 前端開發
tags: [ActionScript, OSMF, Flash, 影音播放器]
readingTime: 6 分鐘
image: /images/tech/hero_osmf-plugin-development-guide.webp
imageAlt: 紅色播放鍵圖示，象徵OSMF影音播放框架的Plug-in架構
---


# 初探OSMF的Plug-in開發

這篇是我讀完OSMF官方Plugin開發指南（官方PDF已下架）之後整理的心得。OSMF（Open Source Media Framework）是Adobe釋出的Flash影音播放框架，Plug-in機制讓開發者可以在不改動播放器核心程式的前提下，擴充或替換播放行為。

## 建立一個OSMF Plug-in要做哪些事？

建立OSMF Plug-in分兩步：先建一個\`PluginInfo\`物件並提供讓框架取得它的存取點，再建立實際的Plugin類別去繼承\`PluginInfo\`並註冊要處理的媒體項目。

第一步，寫一個getter讓OSMF能拿到\`PluginInfo\`物件：

\`\`\`java
public function get pluginInfo():PluginInfo
{
	return _pluginInfo;
}
\`\`\`

第二步，建立一個類別繼承\`PluginInfo\`，在建構子裡組出一個\`Vector.<MediaFactoryItem>\`，塞進要註冊的項目後呼叫\`super(items)\`：

\`\`\`java
public function HelloWorldPluginInfo()
{
	var items:Vector.<MediaFactoryItem> = new Vector.<MediaFactoryItem>();
	// Create the MediaFactoryItem and add to our list of items.
	var item:MediaFactoryItem = new MediaFactoryItem
	("com.example.helloworld", canHandleResourceFunction, mediaElementCreationFunction);
	items.push(item);
	// Pass the list to the base class.
	super(items);
}
\`\`\`

## MediaFactoryItem的三個參數各自負責什麼？

\`MediaFactoryItem\`建構子吃三個參數，分別負責識別、判斷、建立這三件事：

1. **id字串**——這個MediaFactoryItem的識別名稱，例如上面範例的\`"com.example.helloworld"\`。
2. **判斷函數**——當有資源被指定給\`MediaFactory.createMediaElement\`時會被呼叫，傳入該資源，回傳布林值決定要不要接著呼叫第三個參數的函數：
   \`\`\`java
   private function canHandleResourceFunction(resource:MediaResourceBase):Boolean
   \`\`\`
3. **建立函數**——當判斷函數回傳\`true\`時才會被呼叫，不吃參數，直接回傳一個\`MediaElement\`：
   \`\`\`java
   private function mediaElementCreationFunction():MediaElement
   \`\`\`

## 靜態載入和動態載入Plug-in有什麼差別？

差別在Plugin程式碼是編譯期就打包進主程式，還是執行期才從外部下載進來——這決定了更新Plugin需不需要重新發布整個播放器。

靜態建立是把Plugin用\`includes\`加進原始碼或編進lib庫裡直接呼叫：

\`\`\`java
mediaFactory.loadPlugin(new PluginInfoResource(new HelloWorldPluginInfo()));
\`\`\`

動態建立則是把Plugin編成獨立的swf檔，執行期用URL去載入：

\`\`\`java
mediaFactory.loadPlugin(new URLResource("http://example.com/HelloWorldPlugin.swf"));
\`\`\`

動態載入的好處是Plugin可以獨立更新、不用重新發布整個播放器；缺點是多一次網路請求，也要自己處理載入失敗的情況。OSMF下載包裡的sample資料夾有不少現成的Plugin範例，兩種載入方式都能在裡面找到對照著讀。

## OSMF的三種Plug-in類型怎麼選？

OSMF把Plugin分成Standard、Proxy、Reference三種，差異在於它們跟\`MediaElement\`之間的關係——是直接產生一個、包一層代理、還是單純參考既有的。

| 類型 | 用途 | 常見場景 |
| --- | --- | --- |
| Standard Plug-in | 建立並回傳單一\`MediaElement\`，需指定\`MediaFactoryItemType.STANDARD\` | 支援新的媒體格式或來源，分客製化與OSMF內建兩種子類型 |
| Proxy Plug-in | 回傳空的\`ProxyElement\`（或其子類），代理既有的\`MediaElement\`，需指定\`MediaFactoryItemType.PROXY\` | 在不動播放器程式碼的前提下改變既有MediaElement的行為，例如關閉某個VideoElement的Seeking功能 |
| Reference Plug-in | 取得一或多個\`MediaElement\`的參考進行操作，通常也會自己產生一個MediaElement | 把SWF疊加層蓋在VideoElement上並控制它，或監聽VideoElement送出追蹤報告 |

**Standard Plug-in**是最基本的類型：它負責建立與回傳單一\`MediaElement\`，有客製化與OSMF內建兩種子類型。

**Proxy Plug-in**回傳一個空的\`ProxyElement\`，讓MediaFactory在真正的\`MediaElement\`回傳之前把它注入到這個ProxyElement裡。因為\`ProxyElement\`跟\`MediaElement\`介面相同，播放器程式可以像操作一般MediaElement一樣跟它互動，完全不用知道背後多了一層代理——所有方法與屬性呼叫預設都會轉發給被代理的MediaElement，除非Proxy Plug-in主動想修改行為。

**Reference Plug-in**取得一或多個MediaElement的參考來操作，多數情況下也會產生自己的MediaElement。典型用法是把SWF疊加層蓋在VideoElement上、取得該參考後用SWF去控制VideoElement；或是封裝某種追蹤邏輯，監聽VideoElement並回報數據。建立Reference Plug-in時必須提供\`PluginInfo.mediaElementCreationNotificationFunction\`方法，每次MediaFactory建立MediaElement都會呼叫它。

## 常見問題

### Q：Plugin要用靜態載入還是動態載入？

看更新頻率決定：如果Plugin跟主程式一起發版就用靜態載入，寫法簡單、沒有額外的網路請求；如果Plugin需要獨立更新（例如廣告SDK、第三方追蹤模組），就用動態載入的swf檔方式，換取彈性但要自己處理載入失敗的容錯。

### Q：什麼時候該用Proxy Plug-in而不是直接改MediaElement？

當你不想動到既有MediaElement或播放器主程式的程式碼，只想在外面加一層行為修改（例如關掉某個功能、加一層權限檢查）時，Proxy Plug-in是比較乾淨的做法，因為呼叫端完全不需要知道背後多了代理層。


## 參考資料
1. Adobe Systems，\`PluginInfo\` API Reference（AS3 OSMF），存取日期：2026-08-27。[https://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/org/osmf/media/PluginInfo.html](https://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/org/osmf/media/PluginInfo.html)
2. OSMF 2.0 Release 官方封存（含 Plug-in Developer's Guide、ASDocs），存取日期：2026-08-27。[https://sourceforge.net/projects/osmf.adobe/files/OSMF%202.0%20Release%20(final%20source,%20ASDocs,%20pdf%20guides%20and%20release%20notes)/](https://sourceforge.net/projects/osmf.adobe/files/OSMF%202.0%20Release%20(final%20source,%20ASDocs,%20pdf%20guides%20and%20release%20notes)/)

## 延伸閱讀

- [OSMF相關資源整理](/post/osmf-related-resources)：同樣聚焦 OSMF、Flash，可接著比較不同情境的做法。
- [OSMF 學習資源整理：入門教學、官方文件與簡報清單](/post/osmf-related-resources)：同樣聚焦 OSMF、Flash，可接著比較不同情境的做法。
- [OSMF 簡介：用開源框架建置多媒體播放器](/post/osmf-introduction)：同樣聚焦 OSMF，可接著比較不同情境的做法。
`;export{e as default};