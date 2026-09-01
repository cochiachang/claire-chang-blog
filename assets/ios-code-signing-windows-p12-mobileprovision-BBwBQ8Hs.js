var e=`---
title: "在 Windows 產生 iOS 簽署用的 .p12 及 .mobileprovision"
description: "沒有 Mac 也能簽 iOS App：用 OpenSSL 在 Windows 產生 CSR，換發 .cer、轉出 .p12，再申請 .mobileprovision。"
date: 2014-01-07
category: "DevOps"
tags: ["iOS", "程式碼簽署", "OpenSSL", "Provisioning Profile", "Flex"]
readingTime: "6 分鐘"
image: /images/tech/hero_ios-code-signing-windows-p12-mobileprovision.webp
imageAlt: "紅綠燈光下的鎖頭擺在鍵盤上，象徵程式碼簽署與憑證安全"
---
# 在 Windows 產生 iOS 簽署用的 .p12 及 .mobileprovision

沒有 Mac 電腦，一樣可以走完 iOS App 的簽署流程。iPhone 開發人員憑證原本假設你在 Mac 上用「鑰匙圈存取」建立 CSR，但 Windows 開發者可以用 OpenSSL 產生同樣格式的憑證簽名要求，再拿到 Apple Developer 後台換發憑證、產生 .p12 與 .mobileprovision。以下是實際跑過的完整流程，原本是為 Flex/AIR 專案整理的，但簽署這幾步跟用什麼框架寫 App 無關。

## 為什麼 Windows 也能做 iOS 憑證簽署？

iOS 的程式碼簽署本質上是標準的 X.509 憑證流程：先產生一組公私鑰，用私鑰產生 CSR（Certificate Signing Request）送給 Apple，Apple 核發憑證後，再把憑證跟私鑰打包成 .p12。這一整套動作只需要 OpenSSL，跟作業系統無關。Mac 版流程只是把「產生 CSR」這一步包裝進了鑰匙圈存取的圖形介面，Windows 上用命令列一樣做得到。

## 如何用 OpenSSL 在 Windows 產生 CSR？

先安裝 OpenSSL（到 [openssl.org 的 binaries 頁面](http://www.openssl.org/related/binaries.html) 抓 Windows 版），開啟命令提示字元切到 OpenSSL 的 bin 目錄，接著兩個指令：

先產生私鑰：

\`\`\`dos
openssl genrsa -out mykey.key 2048
\`\`\`

這把私鑰要留著，之後轉 .p12 會用到。OpenSSL 執行過程如果跳出錯誤訊息，不要略過——即使跳錯誤，它有時候還是會生出檔案，但那個檔案通常不能用。出錯就檢查指令語法重跑一次。

再用這把私鑰產生 CSR：

\`\`\`dos
openssl req -new -key mykey.key -out CertificateSigningRequest.certSigningRequest -subj "/emailAddress=yourAddress@example.com, CN=John Doe, C=US"
\`\`\`

\`emailAddress\`、\`CN\`（憑證名稱）、\`C\`（國家代碼）都要換成自己的資料。

## 如何拿 CSR 向 Apple 換發 .cer 憑證？

1. 登入 [Apple Developer Member Center](https://developer.apple.com/membercenter/index.action)。
2. 進入 Certificates, Identifiers & Profiles。
3. 選擇 Certificates，按右上角的「+」新增。
4. 身份類型選 iOS App Development。
5. 上傳剛剛產生的 .certSigningRequest 檔案。
6. 下載 Apple 核發的 .cer 檔。

這一段完全在 Apple 後台操作，跟開發機器是 Windows 還是 Mac 無關——CSR 只是一個標準格式的文字檔，Apple 不在乎它從哪裡生出來。

## 如何把 .cer 轉換成 .p12？

拿到 .cer 後，要跟一開始那把私鑰組合成 .p12，才能給建置工具（例如 Flex Builder 或 Xcode）用來簽署 App。分兩步：

先把 Apple 發的 DER 格式憑證轉成 PEM：

\`\`\`dos
openssl x509 -in developer_identity.cer -inform DER -out developer_identity.pem -outform PEM
\`\`\`

再用私鑰 + PEM 憑證產生 .p12：

\`\`\`dos
openssl pkcs12 -export -inkey mykey.key -in developer_identity.pem -out iphone_dev.p12
\`\`\`

.p12 檔案打包了私鑰跟憑證，匯入到建置環境後就能對 App 簽署。

## .mobileprovision 檔案怎麼產生？

.mobileprovision 是把「App ID + 憑證身份 + 授權裝置」綁在一起的授權檔，少了它，簽好名的 App 也無法安裝到實體裝置上測試。步驟如下：

1. **註冊 App ID**——側欄選 Identifiers → App IDs。如果只是想先跑通流程，可以選 Wildcard App ID，Bundle ID 填 \`*\`。
2. **註冊測試機 UUID**——側欄選 Devices → All 新增裝置。UUID 可以在 iTunes 連上 iPhone 後，點摘要頁的序號欄位切換顯示取得。
3. **建立 Provisioning Profile**——側欄選 Provisioning Profiles，按「+」新增，身份選 iOS App Development，依序選擇剛剛建立的 App ID、憑證、測試裝置，命名後下載 .mobileprovision 檔。

App ID、憑證、裝置這三者要先都存在，Provisioning Profile 才組得起來——這是最容易漏掉步驟的地方，少一項就會在下拉選單裡找不到對應項目。

## 在 Flex Builder 專案裡怎麼套用 .p12 和 .mobileprovision？

在專案上按右鍵開啟 Properties，在憑證/簽署設定頁面分別指向剛才產生的 .p12 檔與 .mobileprovision 檔即可。之後打包 iOS 版 AIR App 時，建置工具就會用這兩個檔案完成簽署。

## 常見問題

### 一定要有 Mac 才能申請 iOS 開發憑證嗎？

不用。CSR 只是標準格式的憑證請求檔，Apple 後台不檢查它是從 Mac 鑰匙圈還是 Windows OpenSSL 產生的。整個流程——CSR、.cer、.p12、.mobileprovision——在 Windows 上都能走完。

### OpenSSL 跳出錯誤訊息但還是生出檔案了，可以用嗎？

不建議。OpenSSL 即使報錯，有時仍會輸出檔案，但這種檔案往往格式不完整或內容有誤。看到錯誤訊息就先檢查指令語法（尤其是路徑跟參數的引號），修正後重新執行，不要直接拿疑似有問題的輸出檔繼續下一步。

### .p12 跟 .mobileprovision 差在哪？

.p12 是「你是誰」——打包了開發者的私鑰跟憑證，用來對 App 簽章。.mobileprovision 是「這個簽章可以在哪裡跑」——綁定了 App ID 跟授權測試裝置清單，決定簽好名的 App 能不能裝到特定 iPhone 上。兩者缺一不可。

### Wildcard App ID 什麼時候可以用？

如果只是要驗證整條簽署流程能不能跑通，或做內部測試，用 Wildcard App ID（Bundle ID 填 \`*\`）可以省掉為每個專案分別申請 App ID 的步驟。但正式上架 App Store 的 App，通常需要對應到明確 Bundle ID 的 App ID，不能用萬用字元版本。

## 參考資料
Apple Developer 官方說明，Create a Certificate Signing Request，說明 CSR 的產生方式與各類憑證的要求，存取日期：2026-08-27。[https://developer.apple.com/help/account/certificates/create-a-certificate-signing-request](https://developer.apple.com/help/account/certificates/create-a-certificate-signing-request)

## 延伸閱讀

- [iOS 6 與 iOS 7 的不同處整理](/post/ios6-ios7-ui-behavior-differences)：同樣聚焦 iOS，可接著比較不同情境的做法。
- [Conda 無法安裝套件缺少 OpenSSL：CondaSSLError 解決方案](/post/conda-openssl-package-install-error)：同樣聚焦 OpenSSL，可接著比較不同情境的做法。
- [iOS 7 App 轉換指南：舊 App 升級前要檢查哪些項目？](/post/ios7-app-migration-guide)：同樣聚焦 iOS，可接著比較不同情境的做法。

## 最後更新

2026-08-28

`;export{e as default};