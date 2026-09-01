var e=`---
title: 直播相關教學文章庫：串流、編碼、推流與 SRS 學習資源整理
description: 整理直播開發必讀的學習資源：點播直播錄播概念、直播原理、H.264 視訊編解碼、OBS 等推流軟體、RTMP/HLS 串流格式、Nginx 與 SRS 效能比較、CDN 品質關鍵、srs-bench 壓力測試與 DASH 技術的文章連結庫。
date: 2020-10-20
category: 後端開發
tags: [直播, 串流, SRS, H.264, 學習資源]
readingTime: 3 分鐘
image: /images/tech/hero_live-streaming-tutorial-resources.webp
imageAlt: 專業攝影機正在錄製樂團的現場演出
---


# 直播相關教學文章庫：串流、編碼、推流與 SRS 學習資源整理

這篇是我在研究直播技術時收集的教學文章資源庫，涵蓋直播原理、H.264 視訊編解碼、推流軟體（OBS、Wirecast、vMix 等）、RTMP/HLS 串流格式、Nginx 與 SRS 的效能比較、CDN 與直播品質、srs-bench 壓力測試，以及 DASH 自適應串流技術。找直播相關資料時，可以從這裡快速出發。

## 想搞懂點播、直播、錄播的差異該讀什麼？

- [录播、点播、直播傻傻分不清楚？1篇文章帮你搞定](https://zhuanlan.zhihu.com/p/101993437)

## 直播原理介紹有哪些值得讀的文章？

- [直播理论](https://www.wuwuseo.com/other/59.html)
- [直播系統搭建所用到的技術原理](https://kknews.cc/zh-tw/tech/gpyqbo9.html)
- [技術人員看過來！詳細的直播原理介紹！](https://kknews.cc/zh-tw/tech/z64nz43.html)
- [網絡視頻直播的原理是什麼？](https://www.zhihu.com/question/21146270)

## 視訊編解碼（H.264）要從哪些文章入門？

- [壓縮畫質比較](http://www.yaba.com.tw/cctv/h264mp4/h264mp4.htm)
- [H.264 / MPEG4 / AVC 壓縮編碼](https://wellswoo.pixnet.net/blog/post/186857523)
- [H.264 Profile and Level，H.264的類型與等級說明](https://wellswoo.pixnet.net/blog/post/218466617-h.264-profile-and-level-,-h.264%E7%9A%84%E9%A1%9E%E5%9E%8B%E8%88%87%E7%AD%89%E7%B4%9A%E8%AA%AA%E6%98%8E)
- [H264編碼中Baseline Main High簡介](https://blog.csdn.net/yangzhenhui/article/details/104298335)

## 常見的推流軟體有哪些？

- OBS
- Wirecast
- vMix
- XSplit
- [第二課的主題：實況的硬體與軟體](https://worldofwarships.asia/zh-tw/news/general-news/streaming-school-2/)

## 串流格式與協定有哪些參考資料？

- [什麼是串流與 HLS 串流協議](https://medium.com/@zoejoyuliao/%E7%94%A8-aws-lambda-aws-mediaconvert-%E5%AF%A6%E7%8F%BE%E5%BD%B1%E7%89%87%E8%BD%89%E6%AA%94%E8%88%87%E4%B8%B2%E6%B5%81-%E4%B8%80-%E4%BB%80%E9%BA%BC%E6%98%AF%E4%B8%B2%E6%B5%81%E8%88%87-hls-72c8a7b9201)
- [RTMP、HTTP-FLV、HLS，你了解常見的三大直播協議嗎](https://zhuanlan.zhihu.com/p/48100533)

## Nginx 與 SRS 等串流伺服器的效能比較在哪裡看？

- [流媒體選擇Nginx是福還是禍？](https://kknews.cc/zh-tw/tech/qeezmb8.html)
- [Red5与Nginx Rtmp性能对比](https://blog.csdn.net/educast/article/details/81772184)
- [srs之与nginx-rtmp性能对比](https://blog.csdn.net/zjqlovell/article/details/50785867)
- [基于nginx-rtmp-module实现的直播项目小结](https://juejin.im/post/5d2182b75188250501476c17#heading-0)

## 直播品質的關鍵因素有哪些？

- CDN（內容分發網路）
- [RTMP 直播推流时延](https://blog.csdn.net/haima1998/article/details/78007123)

## 如何對直播伺服器做壓力測試？

搭建直播伺服器以後需要對直播性能進行測試，srs-bench 針對特定業務性能測試並發推流：

- [视频流并发测试工具srs-bench使用问题汇总](https://blog.csdn.net/achang21/article/details/76260947) ＋ [SB(SRS Bench)](https://github.com/ossrs/srs-bench)
- [srs-bench测试环境](https://blog.csdn.net/u011455056/article/details/78775262)
- st-load：伺服器負載測試工具 ＋ [st-load](https://github.com/leanhd/st-load)

## K8S 與 DASH 技術要怎麼入門？

- K8S：[Azure Kubernetes Services (AKS) 的 Kubernetes 核心概念](https://docs.microsoft.com/zh-tw/azure/aks/concepts-clusters-workloads)
- DASH 技術：
  - [Dynamic Adaptive Streaming over HTTP（維基百科）](https://zh.wikipedia.org/wiki/%E5%9F%BA%E4%BA%8EHTTP%E7%9A%84%E5%8A%A8%E6%80%81%E8%87%AA%E9%80%82%E5%BA%94%E6%B5%81)
  - [关于引入DASH技术，提升用户播放体验的说明](https://www.bilibili.com/read/cv949156)

## 常見問題

### 這篇文章適合什麼人看？

適合正在學習直播與串流技術的開發者。它是一份資源索引，把直播原理、H.264 編解碼、推流軟體、串流協定、伺服器效能比較到壓力測試的優質文章集中整理，方便按主題查找。

### srs-bench 是做什麼用的？

srs-bench 是針對直播伺服器的性能測試工具，可以對特定業務進行並發推流測試，用來驗證搭好的直播伺服器在實際負載下的表現。類似的還有 st-load 這個伺服器負載測試工具。

### DASH 是什麼技術？

DASH（Dynamic Adaptive Streaming over HTTP）是基於 HTTP 的動態自適應串流技術，能依據使用者的網路狀況動態切換不同位元率的影片分段，提升播放體驗。它與 HLS 屬於同一類型的自適應串流方案。

## 參考資料

- 本文整理自個人實作筆記，所有條目均為我收集的外部教學連結，出處見各段落連結。

## 延伸閱讀

- [影音服務介紹：點播、直播、錄播的差異與直播串流原理](/post/video-streaming-service-introduction)：同樣聚焦 直播、串流，可接著比較不同情境的做法。
- [從零架設直播伺服器](/post/build-live-streaming-server-from-scratch)：同樣聚焦 SRS，可接著比較不同情境的做法。
- [OBS 推送 HEVC 直播串流到 SRS：Enhanced RTMP 設定教學](/post/obs-hevc-rtmp-srs-streaming)：同樣聚焦 SRS，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2020-10-20，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};