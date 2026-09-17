var e=`---
title: Git 版本控管入門筆記：從 SVN 轉換到分散式開發
description: 記錄從 SVN 轉用 Git 的初期學習過程，包含工具選擇、SSH Key 設定與三個基本指令。
date: 2013-11-11
category: DevOps
tags: [Git, 版本控制, SourceTree, GitHub]
readingTime: 4 分鐘
image: /images/tech/hero_git-version-control-notes.webp
imageAlt: 深色背景上顯示彩色語法標示的程式碼畫面
---


# Git 版本控管入門筆記：從 SVN 轉換到分散式開發

我過去一直用 SVN 做專案的版本控管，最近圈內很多人開始用 Git，強調它分散式、適合分散式開發。剛好看到保哥的《30 天精通 Git 版本控管》教學文，就決定認真學一次這套新系統。

## Git 和 SVN 差在哪裡？

過去常見的檔案管理系統像 SVN、CVS、Visual SourceSafe、VSTS，大多是集中式控制，一定要連上 Server 才能 commit 資料。Git 則是分散式管理，可以先在本機 commit，等連上網路後再跟 server 上的系統合併。

這對實際工作影響很大：人在國外連不上網路，或公司 SVN 走區網、暫時連不到公司網路時，Git 一樣可以先在本機把變更 commit 下來，之後再同步。這個特性在分散式開發上非常方便。

## 剛開始學 Git 該用什麼工具？

CloudHsu 推薦兩款圖形化 GUI 工具：

- Mac 上用 [SourceTree](https://www.sourcetreeapp.com/)
- Windows 上用 [gitextensions](http://code.google.com/p/gitextensions/)

保哥在文章裡也提到，實際操作上因為方便性,大家最後多半還是會選 GUI 工具，但剛開始學的時候,他建議先從指令列學起，理由是能更直接掌握 Git 的觀念。他的學習建議大致是：

- 先建立 Git 基礎觀念，透過下指令的方式學習最快，不要跳過這一段。
- 找多一點人一起學 Git，最好能直接用在實務開發工作上。
- 團隊裡最好有幾個先遣部隊，先多學一點 Git 觀念，之後能分享給其他人，或有人卡關時能幫忙。
- Git 是「分散式版本控管」，每個人都有一份完整的儲存庫（Repository），所以要經常合併檔案。
- 用 Git 的時候，分支與合併是常態，只要合併就可能有衝突，要學會怎麼解決衝突。

我照著保哥的建議先裝了 [Git for Windows](https://git-scm.com/download/win)。要注意的是，一定要先裝好 Git for Windows，才能再裝 GitHub for Windows。詳細安裝步驟可以參考〈在 Windows 平台必裝的三套 Git 工具〉。SourceTree 這套 CloudHsu 也大推,說很好用。

## GitHub for Windows 的 SSH Key 放在哪裡？

首次登入 GitHub 帳戶成功後，GitHub for Windows 會自動幫你建立一組 SSH Key-Pair，預設路徑如下：

\`\`\`
"C:\\Users\\<username>\\.ssh\\github_rsa"
"C:\\Users\\<username>\\.ssh\\github_rsa.pub"
\`\`\`

有了這組 Key，之後每次跟 GitHub 互動就不用再輸入帳號密碼。預設的工作目錄則是：

\`\`\`
C:\\Users\\<username>\\Documents\\GitHub
\`\`\`

登入 GitHub 網站後，點右上角的 Account settings，再點 SSH Keys，就能看到目前有哪些電腦的 SSH key 已經連接到你的帳號。

![GitHub 網站上檢視已連接 SSH Key 的畫面](/images/tech/git-notes-github-for-windows-ssh.webp)

![GitHub for Windows 安裝完成後的介面](/images/tech/git-notes-github-for-windows-ui.webp)

安裝好之後，GitHub for Windows 的介面大致長這樣，左側會列出 local 端的 repositories，也會顯示 GitHub 帳號下的內容。

## 新手第一天該學哪三個 Git 指令？

保哥教學文裡第一天教的三個基本操作，剛好對應到「建立本地儲存庫」「建立共用儲存庫」「從遠端取出儲存庫」這三種最常見的起手情境。

**建立本地儲存庫：**

\`\`\`bash
mkdir demo
cd demo
git init
\`\`\`

**建立本地共用儲存庫：**

\`\`\`bash
mkdir demo
cd demo
git init --bare
\`\`\`

**從遠端取出儲存庫：**

先在 GitHub 上取得儲存庫網址，再執行：

\`\`\`bash
git clone [REPOSITORY_URI]
\`\`\`

![取得遠端儲存庫網址的畫面](/images/tech/git-notes-clone-url.webp)

這三個指令是後面所有 Git 操作的起點——不管是自己建一個全新專案、跟團隊共用一份儲存庫，還是把別人已經寫好的專案抓下來，都是從這三選一開始。

## 常見問題

### Git 和 SVN 最大的差異是什麼？

Git 是分散式版本控管，每個人本機都有完整儲存庫，可以離線 commit；SVN 是集中式管理，commit 前一定要連得上 Server。

### 剛學 Git 應該先用 GUI 工具還是指令列？

保哥的建議是先從指令列建立基礎觀念，之後再依個人習慣改用 SourceTree、gitextensions 這類 GUI 工具操作。

### GitHub for Windows 的 SSH Key 存在哪裡？

預設會存在 \`C:\\Users\\<username>\\.ssh\\github_rsa\`（私鑰）與對應的 \`.pub\`（公鑰），首次成功登入 GitHub 帳戶後會自動產生。

## 參考資料

- 保哥《30 天精通 Git 版本控管》：[http://blog.miniasp.com/post/2013/11/04/Learning-Git-Part-2-Master-Git-in-30-days.aspx](http://blog.miniasp.com/post/2013/11/04/Learning-Git-Part-2-Master-Git-in-30-days.aspx)
- Git Magic 中文版：[http://www-cs-students.stanford.edu/~blynn/gitmagic/intl/zh_tw/index.html](http://www-cs-students.stanford.edu/~blynn/gitmagic/intl/zh_tw/index.html)
- Git 教學：[http://gogojimmy.net/2012/01/17/how-to-use-git-1-git-basic/](http://gogojimmy.net/2012/01/17/how-to-use-git-1-git-basic/)

## 延伸閱讀

- [GitHub HTTPS 憑證拉取私有庫：Personal Access Token 設定教學](/post/github-https-credentials-private-repo)：同樣聚焦 GitHub、Git，可接著比較不同情境的做法。
- [GGJ 2014 遊戲開發心得：用 Pair Programming 與極限編程撐過 48 小時協作地獄](/post/ggj-2014-game-dev-collaboration-insights)：同屬「DevOps」主題，可延伸理解相近問題的判斷方式。
- [Docker 初探：安裝、常用指令與容器管理入門筆記](/post/docker-introduction-basics)：同屬「DevOps」主題，可延伸理解相近問題的判斷方式。
`;export{e as default};