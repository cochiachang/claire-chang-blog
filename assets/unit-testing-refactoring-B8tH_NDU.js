var e=`---
title: 單元測試重構指南：用 3A 原則與 Given/Should 命名讓測試更好維護
description: 說明如何重構單元測試：測試不應包含 if、while、for 等程式邏輯，並透過抽出 field、Setup、Given 與 Should 命名方法，重構成符合 3A（Arrange、Act、Assert）原則的可維護測試，附 C#/NUnit/NSubstitute 完整範例。
date: 2018-08-19
category: 後端開發
tags: [單元測試, 重構, NUnit, NSubstitute, 3A原則]
readingTime: 6 分鐘
image: /images/tech/hero_unit-testing-refactoring.webp
imageAlt: 螢幕上顯示程式碼的照片，象徵測試程式碼重構
---


# 單元測試重構指南：用 3A 原則與 Given/Should 命名讓測試更好維護

測試程式碼也是程式碼，同樣需要重構。好的測試應該容易維護、容易閱讀，而且不應包含程式邏輯——\`if\`、\`while\`、\`for\` 迴圈都不該出現在測試裡。這篇文章整理我重構單元測試的步驟與完整的 C# 範例，讓測試符合 3A 原則（Arrange、Act、Assert）。

## 為什麼測試需要重構？

如果驗證的內容和資料有關，我建議使用 Substitute 來建立假物件，這樣可以在每一個測試裡塞入不同的資料，而且直接在測試裡就能看到資料的內容是什麼，不必再去翻共用假物件的定義。

舉例來說，與其在多個測試之間共用一個寫死資料的 helper，不如把「準備資料 → 建立假物件 → 執行 → 驗證」抽成參數化的方法，讓每個測試案例獨立、一眼看懂：

\`\`\`csharp
private void AmountShouldBe(int expected, DateTime start, DateTime end)
{
    IList<Budget> data = new List<Budget>()
    {
        new Budget() {Amount = 310, YearMonth = "201801"},
        new Budget() {Amount = 620, YearMonth = "201803"},
        new Budget() {Amount = 900, YearMonth = "201804"}
    };

    var budgetCalculator = new BudgetCalculator(new TestDataBudgetRepository(data));
    var budget = budgetCalculator.TotalAmount(start, end);
    Assert.AreEqual(expected, budget);
}
\`\`\`

在 91 的課程中提到一個好習慣：每成功寫完一個測試案例，就先做一次重構。這樣測試程式碼不會隨時間腐化，之後的開發速度也能更快。

## 重構測試的步驟有哪些？

我慣用的重構步驟如下：

| 步驟 | 說明 |
|---|---|
| 抽出 field | mock object（繼承假物件再去創建）或 stub（用 Substitute）抽成測試類別的欄位 |
| Setup | SUT 初始化，放在 \`[SetUp]\`（或 \`[TestInitialize]\`） |
| 抽出 Given 開頭的方法 | 定義 mock object 行為，代表「假如在跑這個 scenario 時……」 |
| 抽出 Should 開頭的方法 | \`ShouldXxx()\` = SUT 行為 + Assertion |

這樣重構完之後，整個測試就會自然符合 3A pattern：**Arrange、Act、Assert**。Arrange 對應 \`Given...\`（與 Setup），Act 對應 SUT 行為，Assert 對應 \`ShouldXxx()\` 裡的驗證。

## 重構後的測試長什麼樣？

下面是一個認證服務的測試重構後的完整程式碼（NUnit + NSubstitute）：

\`\`\`csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NSubstitute;
using NUnit.Framework;
using RsaSecureToken;
using Assert = NUnit.Framework.Assert;

namespace RsaSecureToken.Tests
{
    [TestFixture]
    public class AuthenticationServiceTests
    {
        private IProfile _fakeProfile;
        private IRsaToken _fakeToken;
        private ILogger _logger;
        private AuthenticationService _authenticationService;

        [SetUp]
        public void Given()
        {
            _fakeProfile = Substitute.For<IProfile>();

            _fakeToken = Substitute.For<IRsaToken>();

            _logger = Substitute.For<ILogger>();

            _authenticationService = new AuthenticationService(_fakeProfile, _fakeToken, _logger);
        }

        private void GivenToken(string token)
        {
            _fakeToken.GetRandom("").ReturnsForAnyArgs(token);
        }

        private void GivenPassword(string account, string password)
        {
            _fakeProfile.GetPassword(account).Returns(password);
        }

        private void ShouldBeValid(string account, string password)
        {
            var actual = _authenticationService.IsValid(account, password, _logger);
            Assert.IsTrue(actual);
        }

        [Test()]
        public void IsValidTest()
        {
            GivenPassword(account: "joey", password: "91");
            GivenToken(token: "000000");

            ShouldBeValid(account: "joey", password: "91000000");
        }

        [Test()]
        public void IsInValidTest()
        {
            GivenPassword(account: "joey", password: "91");
            GivenToken(token: "000000");

            ShouldBeInValid(account: "joey", errorPassword: "error password");
        }

        private void ShouldBeInValid(string account, string errorPassword)
        {
            var actual = _authenticationService.IsValid(account, errorPassword, _logger);
            Assert.IsFalse(actual);
        }

        [Test()]
        public void ShouldLog()
        {
            GivenPassword(account: "joey", password: "91");
            GivenToken(token: "000000");

            ShouldBeInValid(account: "joey", errorPassword: "error password");

            //這個可能會有過度指定的問題，或許加一個逗號就會導致測試失敗
            //_logger.Received(1).Save(Arg.Is<string>("account: joey try to login failed"));
            _logger.Received(1).Save(Arg.Is<string>(m => m.Contains("joey") && m.Contains("login failed")));
        }
    }
}
\`\`\`

幾個值得注意的地方：

- \`[SetUp]\` 的 \`Given()\` 負責初始化所有 Substitute 與 SUT，每個測試都從乾淨狀態開始。
- \`GivenToken()\`、\`GivenPassword()\` 把「假物件的行為設定」收斂成語意化方法，測試案例讀起來就像場景描述。
- \`ShouldBeValid()\`、\`ShouldBeInValid()\` 把 Act 與 Assert 綁在一起，測試本體只剩三行 3A 結構。
- 驗證 log 時用 \`Arg.Is<string>(m => m.Contains(...))\` 而不是完整字串比對，避免測試過度指定（over-specification）——訊息多一個逗號就讓測試失敗並不是我們想要的。

## 常見問題

### 為什麼測試裡不該出現 if、while、for？

測試應該是線性的敘述：準備資料、執行、驗證。一旦測試裡有邏輯分支或迴圈，測試本身就可能出錯，你就無法確定失敗是產品程式的問題還是測試程式的問題。

### 什麼是 3A 原則？

3A 是 Arrange、Act、Assert 三個階段：Arrange 準備被測物件與相依假物件、Act 呼叫被測行為、Assert 驗證結果。把測試按這三段切清楚，可讀性與維護性都會大幅提升。

### Given 與 Should 命名法是什麼？

\`GivenXxx()\` 方法用來設定假物件的行為（對應 Arrange），\`ShouldXxx()\` 方法封裝呼叫 SUT 與斷言（對應 Act + Assert）。測試案例本體因此只剩場景描述，一看就懂。

### 驗證 log 字串時為什麼不要用完整字串比對？

完整字串比對屬於過度指定：只要訊息格式稍有調整（多一個逗號、換詞），測試就會失敗，但行為其實沒錯。改用 \`Contains\` 之類的寬鬆條件，只驗證真正重要的內容。

### 何時該重構測試？

建議每成功寫完一個測試案例就立刻重構一次，趁記憶猶新時消除重複、抽出 Given/Should 方法，避免測試程式碼隨專案成長而腐化。

## 參考資料

- 發布於我參加 IT邦幫忙鐵人賽系列文章期間（2018-08-19）的單元測試筆記。

## 延伸閱讀

- [單元測試 NSubstitute 教學：Substitute.For、Returns 與 Received 範例](/post/unit-test-substitute-for)：同樣聚焦 單元測試、NSubstitute，可接著比較不同情境的做法。
- [單元測試 Fake Object 教學：隔離時間與外部依賴的 C# 範例](/post/unit-test-fake-object)：同樣聚焦 單元測試、NUnit，可接著比較不同情境的做法。
- [單元測試基礎入門：工作單元、AAA 三步驟與優秀測試的特質](/post/unit-testing-basics)：同樣聚焦 單元測試，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2018-08-19，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};