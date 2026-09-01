var e=`---
title: GitHub HTTPS 憑證拉取私有庫：Personal Access Token 設定教學
description: 說明 GitHub 私有庫用 HTTPS clone 或 pull 時，為什麼要用 Personal Access Token，以及 token 權限、GitAhead 與 credential helper 設定方式。
date: 2024-07-24
category: DevOps
tags: [GitHub, Git, Personal Access Token, 私有庫, DevOps]
readingTime: 6 分鐘
image: /images/tech/hero_git-version-control-notes.webp
imageAlt: Git 版本控管與 DevOps 操作示意圖
---
# GitHub HTTPS 憑證拉取私有庫：Personal Access Token 設定教學

GitHub 私有庫如果用 HTTPS URL 進行 \`git clone\`、\`git pull\` 或 \`git push\`，密碼欄位不能再填 GitHub 帳戶密碼，而是要填 Personal Access Token。GitHub 已在 2021-08-13 停用 Git 操作的帳戶密碼驗證，HTTPS 私有庫現在應使用 token、Git Credential Manager、GitHub CLI 或改走 SSH。

## 為什麼 GitHub HTTPS 不能再用登入密碼拉取私有庫？

GitHub HTTPS 私有庫不能用登入密碼，是因為 GitHub 已移除 Git 操作的 password-based authentication。命令列或 GUI 工具要求 password 時，實際應輸入 Personal Access Token。

GitHub 在 2021-08-13 09:00 PST 起，不再接受帳戶密碼做 GitHub.com 的 Git 操作驗證，改要求 token-based authentication，例如 Personal Access Token、OAuth token、SSH key 或 GitHub App installation token（GitHub Changelog，[Git password authentication is shutting down](https://github.blog/changelog/2021-08-12-git-password-authentication-is-shutting-down/)，2021-08）。

這個調整的重點是安全邊界。登入密碼可以進入整個帳號；Personal Access Token 可以設定到期日、限制 repository 與權限，外洩時也能單獨撤銷。我在處理舊 GUI Git 工具時，最常看到的誤會就是「password 欄位是不是填 GitHub 密碼？」答案是：用 HTTPS 拉私有庫時，password 欄位填 token。

## GitHub Personal Access Token 要選哪一種？

GitHub Personal Access Token 建議優先選 fine-grained personal access token。若工具或組織限制不支援 fine-grained token，再改用 personal access token classic。

GitHub 目前支援 fine-grained personal access token 與 personal access token classic，官方建議在可行時使用 fine-grained token，因為 fine-grained token 可以限制 resource owner、指定 repository，並設定更細的 repository permissions（GitHub Docs，[Managing your personal access tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)，存取日期：2026-08-28）。

只要目標是拉取私有庫，權限不要開太大：

| 使用情境 | 建議權限 |
|---|---|
| 只需要 \`git clone\` 或 \`git pull\` | 指定 repository，Contents: Read-only |
| 需要 \`git push\` | 指定 repository，Contents: Read and write |
| 組織啟用 SAML SSO | token 可能還需要完成組織授權 |
| 工具不支援 fine-grained token | 再評估 classic token 的 \`repo\` scope |

我的習慣是把 token 名稱寫清楚，例如 \`gitahead-fare-helper-readonly\`，並設定到期日。之後看到 GitHub token 清單時，才知道哪一顆 token 是哪台電腦、哪個工具、哪個 repository 在用。

## 如何建立 GitHub Personal Access Token？

建立 GitHub Personal Access Token 的路徑是 Settings → Developer settings → Personal access tokens。拉取私有庫時，fine-grained token 至少要選到目標 repository，並給 Contents read 權限。

操作流程：

1. 登入 GitHub。
2. 點右上角個人頭像，進入 **Settings**。
3. 左側選 **Developer settings**。
4. 進入 **Personal access tokens**。
5. 優先選 **Fine-grained tokens**，再點 **Generate new token**。
6. 設定 token name、expiration、resource owner。
7. Repository access 選目標私有 repository。
8. Repository permissions 裡把 **Contents** 設為 \`Read-only\`；若需要 push，才改成 \`Read and write\`。
9. 產生 token 後立即複製並放進密碼管理器，離開頁面後通常無法再次看到完整 token。

GitHub 文件也提醒，Personal Access Token 應像密碼一樣保管；若只是命令列操作，也可以用 GitHub CLI 或 Git Credential Manager 代管登入流程，降低手動保存 token 的風險（GitHub Docs，[Managing your personal access tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)，存取日期：2026-08-28）。

## 如何用 HTTPS 拉取 GitHub 私有庫？

GitHub HTTPS 拉取私有庫時，remote URL 仍是 \`https://github.com/OWNER/REPO.git\`。Git 詢問 username 時填 GitHub 帳號；詢問 password 時填 Personal Access Token。

從 GitHub repository 頁面複製 HTTPS URL 後，在命令列執行：

\`\`\`bash
git clone https://github.com/OWNER/REPO.git
\`\`\`

若已經有本機 repository，只要更新 remote：

\`\`\`bash
git remote set-url origin https://github.com/OWNER/REPO.git
git pull origin main
\`\`\`

互動輸入時：

\`\`\`text
Username for 'https://github.com': YOUR_GITHUB_USERNAME
Password for 'https://YOUR_GITHUB_USERNAME@github.com': YOUR_PERSONAL_ACCESS_TOKEN
\`\`\`

GitHub 官方文件說明，HTTPS clone URL 可用於所有 repository；當私有 repository 透過 HTTPS 做 \`git clone\`、\`git fetch\`、\`git pull\` 或 \`git push\` 時，Git 要求 password 的位置應輸入 Personal Access Token（GitHub Docs，[About remote repositories](https://docs.github.com/en/get-started/git-basics/about-remote-repositories)，存取日期：2026-08-28）。

## GitAhead 圖形化工具如何連接 GitHub 私有庫？

GitAhead 連接 GitHub 私有庫時，Host 選 GitHub，Username 填 GitHub 帳號，Password 欄位填 Personal Access Token。GitAhead 介面中的 password label 不代表要填帳戶密碼。

我當時使用 GitAhead 管理 Git repository，左側可以選 GitHub、Bitbucket、Beanstalk、GitLab 等遠端服務。進入 GitHub 帳號新增畫面後，GitAhead 會顯示 Add Remote Account：

![GitAhead 首頁可以新增 GitHub 帳號](/images/tech/gitahead-add-github-account.webp)

在 GitAhead 的 Add Remote Account 視窗中，Host 選 GitHub。Username 填 GitHub 使用者名稱，Password 欄位請貼上 Personal Access Token。

![GitAhead Add Remote Account 視窗中，Password 欄位應填 Personal Access Token](/images/tech/gitahead-https-token-password-field.webp)

如果 GitAhead 仍然登入失敗，我會先檢查三件事：token 是否過期、token 是否真的包含該私有 repository、以及 repository access 是否至少有 Contents read。若組織啟用 SAML SSO，還要到 GitHub 裡授權該 token 存取組織資源。

## 要不要把 GitHub token 存在 Git 設定裡？

GitHub token 不應寫進 repository、\`.gitconfig\` 明文或任何會 commit 的檔案。比較安全的做法是使用 Git Credential Manager、GitHub CLI 或作業系統的 credential helper。

GitHub 文件建議可用 Git Credential Manager 儲存 HTTPS credential；macOS 會存在 Keychain，Windows 會存在 Windows Credential Manager，Linux 則依設定的 backing store 儲存。GitHub CLI 也能在 \`gh auth login\` 流程中設定 Git operations 使用 HTTPS 並代管認證（GitHub Docs，[Caching your GitHub credentials in Git](https://docs.github.com/en/get-started/git-basics/caching-your-github-credentials-in-git)，存取日期：2026-08-28）。

我會避免這些做法：

- 不把 token 寫進 \`README.md\`、部署文件或 shell script。
- 不把 token 直接拼進 remote URL，例如 \`https://TOKEN@github.com/OWNER/REPO.git\`。
- 不把 long-lived classic token 給所有 repository 權限後到處共用。
- 不把公司組織用 token 放在個人筆記或截圖裡。

若只是自己電腦拉取私有庫，Git Credential Manager 通常最省心。若是 CI/CD 或伺服器部署，則應改用 GitHub Actions secrets、deploy key、GitHub App 或平台提供的 secret manager。

## 常見問題

GitHub HTTPS 憑證最常卡在 password 欄位、token 權限、credential cache 與 GUI 工具登入。先確認 remote URL 是 HTTPS，再確認 token 對私有 repository 有正確讀取權限。

### GitHub HTTPS clone 私有庫時 password 要填什麼？
GitHub HTTPS clone 私有庫時，password 欄位要填 Personal Access Token，不是 GitHub 帳戶密碼。Username 仍填 GitHub 帳號或使用者名稱。

### 只拉取 GitHub 私有庫需要開 repo write 權限嗎？
只做 \`git clone\` 或 \`git pull\` 時，不需要開 write 權限。Fine-grained token 建議只指定目標 repository，並把 Contents 設成 Read-only。

### Personal Access Token 產生後還能再看一次嗎？
通常不能。GitHub 產生 token 後應立即複製，放進密碼管理器；如果遺失，只能重新產生一顆新 token，並撤銷舊 token。

### GitAhead 的 password 欄位可以填 GitHub 密碼嗎？
不可以。GitAhead 介面如果要求 GitHub password，HTTPS 私有庫情境應填 Personal Access Token。GitHub 帳戶密碼只能用於網站登入，不再用於 Git 操作驗證。

### HTTPS 和 SSH 哪一個比較適合 GitHub 私有庫？
HTTPS 適合被防火牆或 proxy 限制的環境，也容易搭配 Git Credential Manager。SSH 適合長期開發機與部署環境，但需要先建立 SSH key 並加入 GitHub 帳號。

### GitHub token 外洩時要怎麼處理？
先到 GitHub 的 Personal access tokens 頁面撤銷外洩 token，再檢查該 token 能存取的 repository 是否有異常操作。若 token 曾用於 CI/CD，也要更新 secret 並檢查近期 workflow logs。

## 參考資料

- GitHub Changelog：[Git password authentication is shutting down](https://github.blog/changelog/2021-08-12-git-password-authentication-is-shutting-down/)（發布日期：2021-08-12，存取日期：2026-08-28）
- GitHub Docs：[About authentication to GitHub](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-authentication-to-github)（存取日期：2026-08-28）
- GitHub Docs：[Managing your personal access tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)（存取日期：2026-08-28）
- GitHub Docs：[About remote repositories](https://docs.github.com/en/get-started/git-basics/about-remote-repositories)（存取日期：2026-08-28）
- GitHub Docs：[Caching your GitHub credentials in Git](https://docs.github.com/en/get-started/git-basics/caching-your-github-credentials-in-git)（存取日期：2026-08-28）

## 延伸閱讀

- [Git 版本控管入門筆記：從 SVN 轉換到分散式開發](/post/git-version-control-getting-started)：同樣聚焦 Git、GitHub，可接著比較不同情境的做法。
- [CentOS 無法連接 mirror.centos.org：改用 vault.centos.org 修復 yum repo](/post/centos-mirror-centos-org-unreachable)：同樣聚焦 DevOps，可接著比較不同情境的做法。
- [docker pull failed to register layer 錯誤怎麼解？](/post/docker-pull-failed-to-register-layer)：同樣聚焦 DevOps，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2026-08-28。我在這次整理中保留 GitHub HTTPS credential、Personal Access Token 與 GitAhead 拉取私有庫步驟，補上 fine-grained token 權限建議、credential helper、安全檢查、FAQ、參考資料與站內延伸閱讀。
`;export{e as default};