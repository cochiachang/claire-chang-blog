var e=`---
title: WordPress Plugin 開發入門：做出你的第一個 WordPress 外掛
description: 完整解析 WordPress Plugin 開發流程：從在 wp-content/plugins 建立 PHP 檔、撰寫外掛資訊註解與版本檢查，到用 add_filter 攔截 the_content，在文章底部自動加入 Facebook 按讚按鈕的完整程式碼教學。
date: 2013-03-27
category: 後端開發
tags: [WordPress, PHP, Plugin 開發, add_filter]
readingTime: 3 分鐘
image: /images/tech/hero_wordpress-first-plugin-development.webp
imageAlt: WordPress 外掛開發教學配圖
---


# WordPress Plugin 開發入門：做出你的第一個 WordPress 外掛

想替 WordPress 加上自訂功能，卻不知道從哪裡下手？這篇文章帶你用最少的程式碼寫出第一個 WordPress 外掛：只要在 \`wp-content/plugins\` 下新增一個 PHP 檔、加上外掛資訊註解，再用 \`add_filter\` 攔截文章內容，就能在每篇文章底下自動產生 Facebook 按讚連結。整個過程不到 40 行程式碼。

## 如何用最少的程式碼寫出第一個 WordPress 外掛？

WordPress 外掛的基本架構非常單純，我當時的做法分成兩步：

1. 在 \`wp-content/plugins\` 下隨意新增一個資料夾，建立一支 PHP 檔案，這邊我命名為 \`Claire.php\`。
2. 在 \`Claire.php\` 裡加入下列程式碼：

\`\`\`php
<?php
/*
Plugin Name: Claire's PlugIn
Version: 0.1
Description: 小佳的第一個插件
Author: ClaireChang
Author URI: http://claire-chang.com
Plugin URI: http://claire-chang.com
*/

/* 版本檢查 */
global $wp_version;
$exit_msg='小佳的插件適用於wordpress2.5以上';
if (version_compare($wp_version,"2.5","<")){
	exit($exit_msg);
}

/*產生FB按讚連結*/
function claireLink()
{
	global $post;
	$link=urlencode(get_permalink($post->ID));
	$title=urlencode($post->post_title);
	$text=urlencode(substr(strip_tags($post->post_content),
	0, 350));

	return '<div id="fb-root"></div>
	  <script src="http://connect.facebook.net/zh_TW/all.js#appId=&amp;xfbml=1"><\/script>
	  <fb:like href="'.$link.'" send="false" width="450" show_faces="true" font=""></fb:like>';
}

/* 將按讚連結加至文章底下 */
function claireFilter($content){
	return $content.claireLink();
}

/* 增加hook */
add_filter('the_content', 'claireFilter');
?>
\`\`\`

## 這段外掛程式碼各自負責什麼？

拆開來看，這支外掛只做了三件事：

| 區塊 | 作用 |
| --- | --- |
| 檔頭註解 | \`Plugin Name\`、\`Version\`、\`Description\` 等欄位是 WordPress 辨識外掛的依據，後台外掛列表顯示的資訊就是從這裡來的 |
| 版本檢查 | 用 \`version_compare()\` 檢查目前 WordPress 版本，低於 2.5 就中止執行，避免外掛在不支援的環境下出錯 |
| \`add_filter('the_content', ...)\` | 這是最關鍵的一行：把 \`claireFilter\` 掛到 \`the_content\` filter 上，每篇文章內容輸出前都會先經過這個函式，在文章內容後面接上 \`claireLink()\` 產生的 FB 按讚 markup |

## 如何啟用外掛並看到成果？

把檔案放好之後，到 WordPress 後台的「外掛」頁面，就可以看到剛剛新增的外掛資訊了：

![WordPress 後台外掛列表顯示新外掛資訊](/images/articles/wordpress-first-plugin-development-1.webp)

將它啟用，文章底下就會出現 Facebook 的按讚連結了。

## 常見問題

### WordPress 外掛一定要放在自己的資料夾裡嗎？
不是必須，但強烈建議。一個外掛一個資料夾方便管理、停用與搬移；單一 PHP 檔直接放進 \`wp-content/plugins\` 也會被 WordPress 辨識，但外掛變複雜後會難以維護。

### 為什麼外掛檔案開頭要寫那一段註解？
那段 \`Plugin Name:\` 開頭的註解是 WordPress 的外掛中繼資料，少了它 WordPress 就不會把這個檔案當成外掛。\`Description\`、\`Author\` 等欄位會直接顯示在後台外掛列表。

### add_filter('the_content', ...) 是在做什麼？
\`the_content\` 是 WordPress 的內容 filter hook，文章內容輸出前會依序通過所有掛在上面的函式。把自訂函式掛上去並回傳修改後的內容，就能在每篇文章後面附加任何 HTML，例如社群分享按鈕。

### 現在還適合用 fb:like 這種寫法嗎？
不適合。文中用的是舊版 XFBML 語法與 \`http://\` 的 Facebook SDK，現行做法是載入新版 Facebook JavaScript SDK 並使用 HTML5 的 \`<div class="fb-like">\` 標籤。不過外掛的整體架構（filter + hook）到今天仍然完全相同。

## 參考資料
- [WordPress Plugin Developer Handbook](https://developer.wordpress.org/plugins/)
- [WordPress add_filter() 文件](https://developer.wordpress.org/reference/functions/add_filter/)

## 延伸閱讀

- [WordPress Plugins 開發入門：佈景檔案、頁面層級與外掛架構解析](/post/wordpress-plugin-development-share)：同樣聚焦 WordPress、PHP，可接著比較不同情境的做法。
- [WordPress Plugins開發怎麼入門？我的佈景結構與外掛架構分享](/post/wordpress-plugins-development-overview)：同樣聚焦 WordPress、PHP，可接著比較不同情境的做法。
- [PHP 使用 SOAP：SoapServer 與 SoapClient 基本架設](/post/php-soap-server-client)：同樣聚焦 PHP，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2013-03-27，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};