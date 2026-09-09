var e=`---
title: Flex 圖片不等比縮放設定：Flex3 與 Flex4 的正確寫法
description: Flex 圖片不等比縮放教學：Flex3 用 scaleContent 搭配 maintainAspectRatio=false，Flex4 只要設 scaleMode="stretch"，即可任意比例拉伸圖片，完整寫法與常見問題一次整理。
date: 2011-11-29
category: 前端開發
tags: [Flex, Flex3, Flex4, ActionScript, 圖片處理]
readingTime: 2 分鐘
image: /images/tech/hero_flex-image-non-uniform-scaling.webp
imageAlt: Flex 圖片不等比縮放設定示意圖
---


# Flex 圖片不等比縮放設定：Flex3 與 Flex4 的正確寫法

在 Flex 中想讓圖片填滿指定容器、但不維持原始長寬比（不等比縮放），Flex3 與 Flex4 的寫法不同：Flex3 要同時設定 \`scaleContent\` 與 \`maintainAspectRatio\` 兩個屬性，Flex4 則改用 \`scaleMode="stretch"\` 一行搞定。這篇筆記記錄兩個版本的實際寫法。

## Flex3 要怎麼讓圖片不等比縮放？

Flex3 的 Image 元件預設會維持長寬比，想任意拉伸圖片必須設兩個屬性：

\`\`\`actionscript
image.scaleContent = true;
image.maintainAspectRatio = false;
\`\`\`

設置了這兩項後就可以任意比例放縮圖片了：

- \`scaleContent = true\`：讓圖片隨元件尺寸縮放，而不是以原始大小顯示。
- \`maintainAspectRatio = false\`：取消維持長寬比，圖片會被拉伸成元件的寬高，也就是不等比縮放。

只要少設 \`maintainAspectRatio = false\`，圖片就會保持等比、留下空白，這是最常見的踩雷點。

## Flex4 的 scaleMode 要怎麼設？

Flex4（Spark）改用 \`scaleMode\` 屬性，一行就能做到不等比拉伸：

\`\`\`actionscript
scaleMode = "stretch";
\`\`\`

\`stretch\` 模式會把圖片直接拉伸到填滿元件的寬高，不理會原始長寬比。若需要維持比例，可改用其他 scaleMode 值（例如 \`letterbox\`）。

## 常見問題

### Flex3 圖片設了 scaleContent 還是不能拉伸？

只設 \`scaleContent = true\` 時圖片仍會維持長寬比。必須再加上 \`maintainAspectRatio = false\`，兩個屬性同時設定才會真正不等比縮放。

### Flex4 的 stretch 模式和其他 scaleMode 有什麼差別？

\`stretch\` 會忽略原始長寬比，直接把圖片拉到元件大小；\`letterbox\` 則維持比例並在不足處留白。要填滿不留白就用 \`stretch\`。

### 不等比縮放會造成圖片變形嗎？

會。因為長寬比被強制改變，圖片內容會被拉寬或壓扁。適合背景、佔位圖等不在意外觀變形的場景，重要的主體圖片建議仍維持等比縮放。

## 延伸閱讀

- [Flex如何讓圖片不等比縮放？](/post/flex-aspect-ratio-image-scaling)：同樣聚焦 Flex3、Flex4，可接著比較不同情境的做法。
- [Flex 元數據標籤——告訴編譯器如何編譯](/post/flex-metadata-tags)：同樣聚焦 Flex、Flex3，可接著比較不同情境的做法。
- [把 Flex SDK 4 整合進 Flex Builder 3](/post/integrate-flex-sdk-4-into-flex-builder-3)：同樣聚焦 Flex、ActionScript，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2011-11-29，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};