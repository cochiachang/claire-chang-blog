var e=`---
title: LBP 區域二值模式：原理與 scikit-image 實作踩坑記
description: 介紹 LBP（Local Binary Pattern）區域二值模式在影像特徵萃取與 OCR 場景的應用，並記錄使用 scikit-image local_binary_pattern 時輸出變成 0 和 1 二值陣列的踩坑經驗，附上原始 LBP 演算法的 Python 實作程式碼。
date: 2022-10-04
category: 機器學習
tags: [LBP, 影像處理, scikit-image, 機器學習, 特徵萃取]
readingTime: 3 分鐘
image: /images/tech/hero_lbp-local-binary-pattern.webp
imageAlt: 黑色背景上散布的白色小點，象徵影像特徵點
---


# LBP 區域二值模式：原理與 scikit-image 實作踩坑記

這篇記錄我為了提升 OCR 辨識正確率而與 LBP（Local Binary Pattern，區域二值模式）打交道的過程：LBP 的基本概念、用 scikit-image 的 \`local_binary_pattern\` 實作時遇到的輸出異常問題（本該是 1-256 的值卻變成 0 和 1 的二值陣列），以及最後找到的原始 LBP 演算法 Python 實作。

## 什麼是 LBP（Local Binary Pattern）？

LBP 是一種影像紋理特徵的萃取方法：對每個像素，比較它與周圍 8 個鄰居像素的大小關係，比中心大的記為 1、小的記為 0，再把這 8 個 bit 組成一個 0-255 之間的編碼值。整張影像經過 LBP 運算後，就得到一張反映紋理結構的特徵圖，常用於人臉辨識、紋理分類，也可以輔助 OCR 提升辨識正確率。

詳細定義可以參考維基百科：[局部二值模式](https://zh.wikipedia.org/wiki/%E5%B1%80%E9%83%A8%E4%BA%8C%E5%80%BC%E6%A8%A1%E5%BC%8F)。

## 為什麼我開始研究 LBP？

會發這一篇文，主要是看到這個博客的文章真的感動到快哭了：

![讓我感動的博客文章截圖](/images/articles/lbp-local-binary-pattern-1.webp)

這幾天因為想增加 OCR 辨識正確率，開始與 LBP 打交道。我找到了一個看起來很強大很棒的函式庫——scikit-image 的 [local_binary_pattern](https://scikit-image.org/docs/stable/api/skimage.feature.html#skimage.feature.local_binary_pattern)，網路上有很多教學文章，看起來是很知名的套件（例如 [Recognizing hand-written digits 範例](https://machine-learning-python.kspax.io/classification/ex1_recognizing_hand-written_digits)）。

## scikit-image 的 LBP 輸出變成 0 和 1 怎麼回事？

然後我遇到了和這位博主一樣的問題：[scikit-image LBP 輸出異常](https://www.cnblogs.com/ilk123/p/11797261.html)。

沒錯……LBP 明明出來的應該是 1-256 的值，我也是設定 R=1, P=8，這樣用 default 的 LBP 出來的應該要是 1-256 之間的值，但是卻是 0 和 1 的二值陣列……

我一直想，這麼偉大的一個 scikit-image 怎麼可能有錯，一定是我的使用方法有誤……害我撞頭撞到快崩潰……沒想到在此遇到一個和我一樣的苦主，太感動了，特此記錄！

## 原始的 LBP 演算法程式碼長什麼樣子？

後來我也找到了一個最原始的 LBP 算法，程式碼下載於 [zhongqianli/local_binary_pattern](https://github.com/zhongqianli/local_binary_pattern/blob/master/local_binary_pattern.py)：

\`\`\`python
def original_lbp(image):
    """origianl local binary pattern"""
    rows = image.shape[0]
    cols = image.shape[1]

    lbp_image = np.zeros((rows - 2, cols - 2), np.uint8)

    for i in range(1, rows - 1):
        for j in range(1, cols - 1):
            code = 0
            center_pix = image[i, j]
            if image[i - 1, j - 1] > center_pix:
                code = code | (1 << 7)
            if image[i - 1, j] > center_pix:
                code = code | (1 << 6)
            if image[i - 1, j + 1] > center_pix:
                code = code | (1 << 5)
            if image[i, j + 1] > center_pix:
                code = code | (1 << 4)
            if image[i + 1, j + 1] > center_pix:
                code = code | (1 << 3)
            if image[i + 1, j] > center_pix:
                code = code | (1 << 2)
            if image[i + 1, j - 1] > center_pix:
                code = code | (1 << 1)
            if image[i, j - 1] > center_pix:
                code = code | (1 << 0)
            lbp_image[i - 1, j - 1] = code
    return lbp_image
\`\`\`

這份實作清楚展示了原始 LBP 的邏輯：以中心像素為基準，逐一比較 8 個鄰居並用位元運算組成 8-bit 編碼，輸出正是我們預期的 0-255 值域。

## 常見問題

### LBP 是什麼？有什麼用途？

LBP（Local Binary Pattern）是一種紋理特徵萃取方法：比較每個像素與其周圍鄰居的大小關係，組成 8-bit 的二進制編碼（0-255）。常應用於人臉辨識、紋理分類，也能輔助 OCR 提升辨識正確率。

### 為什麼 scikit-image 的 local_binary_pattern 輸出只有 0 和 1？

如果傳入的影像 dtype 或呼叫方式不對，輸出可能變成 0 和 1 的二值陣列而非預期的 0-255 值域。這是不少人踩過的坑；若需要原始 LBP 的行為，可以直接使用文末的 \`original_lbp\` 實作，邏輯透明且輸出正確。

### LBP 的 R 和 P 參數是什麼意思？

P 是取樣點數（鄰居個數），R 是以中心像素為圓心的取樣半徑。例如 R=1、P=8 就是最原始的版本：取周圍 8 個相鄰像素做比較，產生 8-bit 的編碼值。

## 參考資料

- [局部二值模式（維基百科）](https://zh.wikipedia.org/wiki/%E5%B1%80%E9%83%A8%E4%BA%8C%E5%80%BC%E6%A8%A1%E5%BC%8F)
- [scikit-image local_binary_pattern API 文件](https://scikit-image.org/docs/stable/api/skimage.feature.html#skimage.feature.local_binary_pattern)
- [與我遇到相同 LBP 問題的博客](https://www.cnblogs.com/ilk123/p/11797261.html)
- [原始 LBP 演算法程式碼（GitHub）](https://github.com/zhongqianli/local_binary_pattern/blob/master/local_binary_pattern.py)

## 延伸閱讀

- [OpenCV 圖片降維：彩色轉灰階再轉黑白](/post/opencv-image-threshold-grayscale-binary)：同樣聚焦 影像處理，可接著比較不同情境的做法。
- [機器學習所需的前置知識：數學、程式、算法與心理學基礎一次盤點](/post/machine-learning-prerequisites)：同樣聚焦 機器學習，可接著比較不同情境的做法。
- [使用 OpenCV 做圖片後製處理（如 Photoshop）的三個實用技巧](/post/opencv-photo-editing-like-photoshop)：同樣聚焦 影像處理，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2022-10-04，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};