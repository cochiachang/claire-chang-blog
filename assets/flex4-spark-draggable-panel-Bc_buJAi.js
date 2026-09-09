var e=`---
title: Flex 4 Spark Panel 怎麼做成可拖動？自訂 DraggablePanel 完整範例
description: Flex 4 的 Spark Panel 元件沒有內建拖動功能。這篇文章說明如何繼承 Panel、宣告 topGroup skin part 並監聽滑鼠事件，實作一個可自由拖曳的 DraggablePanel，附完整 ActionScript 程式碼。
date: 2011-12-20
category: 前端開發
tags: [Flex4, Spark, ActionScript3, Panel, Drag]
readingTime: 5 分鐘
image: /images/tech/hero_flex4-spark-draggable-panel.webp
imageAlt: 桌面上的視窗被滑鼠拖曳移動，象徵可拖動的 Panel 元件
---
# Flex 4 Spark Panel 怎麼做成可拖動？自訂 DraggablePanel 完整範例


Flex 4 裡的 Spark Panel 元件預設沒有內建拖動功能。如果希望 Panel 可以像視窗一樣被使用者用滑鼠拖著走，我們必須自己攔截使用者拖動標題列（topGroup）區塊時的滑鼠事件，並在事件處理函式中呼叫 \`startDrag()\` / \`stopDrag()\`。本文的做法是繼承 Spark Panel，寫一個 \`DraggablePanel\` 元件，程式碼可直接複製使用。

## 為什麼 Spark Panel 沒有內建拖動功能？

Spark 架構把 Panel 的外觀全部交給 skin（預設是 \`PanelSkin\`）來處理。在預設的 PanelSkin 裡其實有一個代表標題列區域的 \`topGroup\`，只是 Panel 類別本身並沒有把它宣告成 skinPart，自然也不會幫你綁任何拖動行為。

所以我們要做的只有兩件事：

1. 在自訂的 Panel 子類別中，把 \`topGroup\` 宣告為必需的 skinPart。
2. 在 skin part 加入時（\`partAdded\`）監聽它的 \`MouseEvent.MOUSE_DOWN\` 與 \`MouseEvent.MOUSE_UP\`，分別啟動與結束拖動。

## DraggablePanel 完整程式碼

\`\`\`actionscript
package components
{
	import flash.events.MouseEvent;

	import mx.managers.DragManager;

	import spark.components.Group;
	import spark.components.Panel;

	/**
	 * A simple extension of the Spark Panel component
	 * that enables dragging.
	 */
	public class DraggablePanel extends Panel
	{
		//--------------------------------------
		// Constructor
		//--------------------------------------

		public function DraggablePanel()
		{
			super();
		}

		//--------------------------------------
		// Skin Parts
		//--------------------------------------

		/**
		 * The skin part that represents the title bar of the underlying Panel.
		 * NOTE: The default PanelSkin already has this, it's just not defined as a skinPart in the Panel class.
		 * We want it so that we can capture dragging.
		 */
		[SkinPart(required="true")]
		public var topGroup:Group;

		//--------------------------------------
		// Overridden Methods
		//--------------------------------------

		protected override function partAdded( partName:String, instance:Object ) : void
		{
			super.partAdded( partName, instance );

			if (instance == topGroup)
			{
				Group( instance ).addEventListener( MouseEvent.MOUSE_DOWN, topGroup_mouseDownHandler );
				Group( instance ).addEventListener( MouseEvent.MOUSE_UP, topGroup_mouseUpHandler );
			}
		}

		protected override function partRemoved( partName:String, instance:Object ) : void
		{
			super.partRemoved( partName, instance );

			if (instance == topGroup)
			{
				Group( instance ).removeEventListener( MouseEvent.MOUSE_DOWN, topGroup_mouseDownHandler );
				Group( instance ).removeEventListener( MouseEvent.MOUSE_UP, topGroup_mouseUpHandler );
			}
		}

		//--------------------------------------
		// Event Handlers
		//--------------------------------------

		protected function topGroup_mouseDownHandler( event:MouseEvent ):void
		{
			if ( !DragManager.isDragging )
				startDrag();
		}

		protected function topGroup_mouseUpHandler( event:MouseEvent ):void
		{
			stopDrag();
		}
	}
}
\`\`\`

## 這段程式碼的重點解析

- **\`[SkinPart(required="true")] public var topGroup:Group;\`**：預設的 PanelSkin 本來就有 \`topGroup\`，只是 Panel 類別沒把它定義成 skinPart。我們補上這個宣告，才能在程式裡拿到它並綁事件。
- **\`partAdded()\` / \`partRemoved()\`**：這是 skin part 生命週期的掛鉤。在 \`partAdded\` 加入監聽、\`partRemoved\` 移除監聽，確保 skin 換掉或卸載時不會留下孤兒事件。
- **\`startDrag()\` / \`stopDrag()\`**：滑鼠按下標題列就開始拖動、放開就結束。這裡用的是 DisplayObject 內建的拖動 API，而不是 Flex 的 DragManager 拖放流程。
- **\`if (!DragManager.isDragging)\`**：如果這個 Panel 同時被用在 Flex 的拖放（Drag & Drop）操作中，要避免兩種拖動互相干擾——正在 DragManager 拖放時就不要再呼叫 \`startDrag()\`。

使用時只要把原本的 \`<s:Panel>\` 換成自訂的 \`<components:DraggablePanel>\`，使用者就能按住標題列拖動整個 Panel 了。

## 常見問題

### 為什麼 Flex 4 的 Spark Panel 不能直接拖動？

Spark 架構下 Panel 的外觀與行為分離，拖動區域（topGroup）存在於 PanelSkin 中，但 Panel 類別沒有將它宣告為 skinPart，也沒有綁任何滑鼠事件，所以必須自己繼承 Panel 來實作。

### 為什麼要監聽 topGroup 而不是整個 Panel？

如果把整個 Panel 都設成可拖動，使用者點擊內容、按鈕或捲動軸時也會觸發拖動。只監聽 topGroup（標題列區域）才符合一般視窗的操作習慣。

### 為什麼 mouseDown 處理函式要檢查 DragManager.isDragging？

如果 Panel 同時參與 Flex 的 Drag & Drop 拖放流程，\`DragManager.isDragging\` 會是 true。先檢查這個旗標可以避免內建的 \`startDrag()\` 和 DragManager 的拖放操作互相衝突。

### 這個做法需要自訂 skin 嗎？

不需要。預設的 PanelSkin 已經含有 \`topGroup\`，只要在子類別裡把它宣告為 \`[SkinPart(required="true")]\`，執行時就會自動對應到 skin 裡的實例，換用自訂 skin 時記得保留同名節點即可。

## 參考資料
- Adobe 官方文件：Spark Panel 與 Skinning 機制（Spark skinning lifecycle、SkinPart metadata）
- Adobe ActionScript 3.0 參考：\`DisplayObject.startDrag()\` / \`stopDrag()\`、\`mx.managers.DragManager\`

## 延伸閱讀

- [如何在 Flex 4 自製 resize 事件：clipAndEnableScrolling 設定教學](/post/flex4-custom-resize-event)：同樣聚焦 Flex4、ActionScript3，可接著比較不同情境的做法。
- [Flex 圖片不等比縮放設定：Flex3 與 Flex4 的正確寫法](/post/flex-image-non-uniform-scaling)：同樣聚焦 Flex4，可接著比較不同情境的做法。
- [Flex如何讓圖片不等比縮放？](/post/flex-aspect-ratio-image-scaling)：同樣聚焦 Flex4，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2011-12-20，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};