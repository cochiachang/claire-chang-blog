var e=`---
title: 在CentOS7安裝docker與kubernates失敗：yum 源頭與 8080 port 錯誤排解
description: 記錄 CentOS7 安裝 docker 與 kubernetes 時遇到的兩個錯誤：yum 源頭找不到安裝程式的 Loading mirror speeds 錯誤，以及 kube-apiserver 因 8080 port 被占用而反覆重啟的問題與解決方法。
date: 2021-11-06
category: DevOps
tags: [CentOS, Docker, Kubernetes, yum, 錯誤排解]
readingTime: 2 分鐘
image: /images/tech/hero_centos7-docker-kubernetes-install-failure.webp
imageAlt: 黑色螢幕上的紅色錯誤訊息，代表被阻擋的網路資源
---


# 在CentOS7安裝docker與kubernates失敗：yum 源頭與 8080 port 錯誤排解

這篇記錄我在 CentOS7 上安裝 docker 與 kubernetes 時先後踩到的兩個錯誤：一是 yum 的源頭連結找不到所需要的安裝程式，二是 kube-apiserver 因為 8080 port 被其他程式占用而反覆重啟。附上當時實際的錯誤畫面與解決步驟，給遇到同樣問題的人參考。

## 安裝時出現「Loading mirror speeds from cached hostfile」錯誤怎麼辦？

安裝時出現了下面的錯誤，原因是 yum 的源頭連結找不到所需要的安裝程式，錯誤訊息如下：

\`\`\`
Loading mirror speeds from cached hostfile
\`\`\`

![yum 源頭錯誤的終端機截圖](/images/articles/centos7-docker-kubernetes-install-failure-1.webp)

解決方法：修改 yum 源頭。

\`\`\`bash
cd /etc/yum.repos.d
mv CentOS-Base.repo CentOS-Base.repo.backup
wget http://mirrors.163.com/.help/CentOS6-Base-163.repo
mv CentOS6-Base-163.repo CentOS-Base.repo
yum clean all
\`\`\`


## kube-apiserver 反覆重啟（holdoff time over, scheduling restart）怎麼解決？

改好 yum 源頭、接著安裝 kubernetes 後，又出現以下錯誤：

\`\`\`
kube-apiserver.service holdoff time over, scheduling restart.
\`\`\`

![kube-apiserver 服務重啟錯誤的終端機截圖](/images/articles/centos7-docker-kubernetes-install-failure-2.webp)

原來是有其他程式占用了 8080 port。把占用 8080 port 的程式找出來並停掉之後，kube-apiserver 就能正常啟動了。

參考：[https://www.cnblogs.com/minseo/p/12936878.html](https://www.cnblogs.com/minseo/p/12936878.html)

## 常見問題

### 為什麼 CentOS7 安裝套件時會出現 Loading mirror speeds from cached hostfile 錯誤？

這通常是 yum 預設的源頭連結已失效或找不到所需的安裝程式。解法是備份原本的 \`CentOS-Base.repo\`，改用可用的鏡像源（如 163.com 提供的 repo），再執行 \`yum clean all\` 清除快取後重新安裝。

### kube-apiserver.service holdoff time over 是什麼問題？

這個訊息表示 kube-apiserver 服務啟動失敗、反覆排程重啟。我在 CentOS7 上遇到的原因是 8080 port 已被其他程式占用，把該程式移除或更換 port 之後，kube-apiserver 就能正常啟動。

### 怎麼找出是哪個程式占用了 8080 port？

可以用 \`netstat -tunlp | grep 8080\` 或 \`lsof -i:8080\` 找出占用 port 的 process，確認不是必要服務後再用 kill 結束它，讓 kube-apiserver 可以綁定該 port。

## 參考資料

- [kube-apiserver 8080 port 占用解法參考](https://www.cnblogs.com/minseo/p/12936878.html)

## 延伸閱讀

- [Docker 初探：安裝、常用指令與容器管理入門筆記](/post/docker-introduction-basics)：同樣聚焦 Docker、CentOS，可接著比較不同情境的做法。
- [CentOS 無法連接 mirror.centos.org：改用 vault.centos.org 修復 yum repo](/post/centos-mirror-centos-org-unreachable)：同樣聚焦 CentOS、yum，可接著比較不同情境的做法。
- [docker pull failed to register layer 錯誤怎麼解？](/post/docker-pull-failed-to-register-layer)：同樣聚焦 Docker，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2021-11-06，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};