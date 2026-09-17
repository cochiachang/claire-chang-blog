var e=`---
title: 單元測試 Fake Object 教學：隔離時間與外部依賴的 C# 範例
description: 說明單元測試如何用 Fake Object 隔離 DateTime、DAO 與 token 等不可控依賴。
date: 2018-07-28
category: 後端開發
tags: [單元測試, Fake Object, C#, 依賴注入, NUnit]
readingTime: 8 分鐘
image: /images/tech/unit-test-fake-object-flow.png
imageAlt: 單元測試中抽取不可控依賴並用 Fake Object 覆寫的流程圖
---


# 單元測試 Fake Object 教學：隔離時間與外部依賴的 C# 範例

單元測試使用 Fake Object 的目的，是把時間、資料庫、亂數、外部服務這些不可控制的依賴換成可控制的測試替身。當測試目標（System Under Test，SUT）不再直接依賴真實環境，測試結果就不會因為今天日期、資料狀態或 token 亂數而忽然改變。

## 為什麼單元測試需要 Fake Object？

Fake Object 可以讓單元測試固定外部條件，專心驗證 SUT 的商業邏輯。只要測試依賴真實日期、亂數或資料來源，測試就可能在不同時間得到不同結果。

下面的 C# 範例中，\`Holiday\` 會判斷今天是不是 Joey 的生日。如果今天是 9 月 1 日就回傳 \`HappyBirthday\`，否則回傳 \`No\`。

問題在於 \`DateTime.Today\` 會隨真實日期改變。單元測試若直接測這段程式，測試結果會跟執行日期綁在一起，這就違反了單元測試應該可重複、可隔離的基本條件。

## 如何用繼承覆寫不可控制的時間依賴？

抽取不可控制的時間依賴後，可以在測試用子類別中覆寫該方法。這種做法適合處理既有程式碼，尤其是暫時還不能大幅重構 constructor 或介面的情境。

先把取得今日日期的行為抽成 \`protected virtual\` 方法：

\`\`\`csharp
using System;

namespace TestProject1
{
    public class Holiday
    {
        public string IsTodayJoeyBirthday()
        {
            var date = GetToday();
            return (date.Month == 9 && date.Day == 1) ? "HappyBirthday" : "No";
        }

        // 將有相依的部分抽出來
        protected virtual DateTime GetToday()
        {
            return DateTime.Today;
        }
    }
}
\`\`\`

接著在測試專案建立 \`HolidayForTest\`，讓測試可以自行設定日期：

\`\`\`csharp
using System;
using NUnit.Framework;
using TestProject1;

namespace TestProject1
{
    [TestFixture]
    public class Test2Cs
    {
        [Test]
        public void today_is_not_joey_birthday()
        {
            var target = new HolidayForTest();
            target.SetToday(new DateTime(2015, 1, 1));

            Assert.AreEqual(target.IsTodayJoeyBirthday(), "No");
        }

        [Test]
        public void today_is_joey_birthday()
        {
            var target = new HolidayForTest();
            target.SetToday(new DateTime(2015, 9, 1));

            Assert.AreEqual(target.IsTodayJoeyBirthday(), "HappyBirthday");
        }
    }

    // 創建一個假物件並且繼承 Holiday，替換掉取得今日日期這件事
    internal class HolidayForTest : Holiday
    {
        private DateTime _today;

        protected override DateTime GetToday()
        {
            return _today;
        }

        public void SetToday(DateTime date)
        {
            _today = date;
        }
    }
}
\`\`\`

這段測試的重點不是生日判斷，而是把「今天日期」從真實系統時間改成測試可設定的值。\`HolidayForTest\` 就是 Fake Object：測試仍然呼叫 SUT 的公開方法，但把不可控制的相依行為換成固定輸出。

## 如何替沒有測試的既有程式補上 unit test？

替既有 production code 補單元測試時，先找出不可控制的依賴，再決定用覆寫方法或依賴注入替換。不要一開始就重寫整個類別，測試切入點越小，越容易保留原本行為。

我會用這個順序處理沒有測試的既有程式碼：

1. 找到不可控制的依賴，例如時間、亂數、資料庫、網路或檔案系統。
2. 抽出方法，讓相依行為集中在小範圍內。
3. 把 \`private\` 方法改成 \`protected virtual\`，讓測試子類別可以覆寫。
4. 在測試專案新增子類別繼承 SUT。
5. 覆寫 \`protected\` 方法，必要時加上 setter 讓測試指定回傳值。
6. 測試 SUT 時改測這個測試子類別。
7. 在測試案例中設定依賴值，再驗證公開方法的結果。

![單元測試抽取相依物件與 Fake Object 流程圖](/images/tech/unit-test-fake-object-flow.png)

這張流程圖保留了舊筆記裡的測試切入順序。最重要的判斷是：測試失敗時，原因應該來自商業邏輯錯誤，而不是今天剛好不是 9 月 1 日。

## Fake Object 和依賴注入怎麼搭配？

Fake Object 和依賴注入常一起使用。依賴注入把物件建立責任移出 SUT，Fake Object 則在測試時提供固定行為，讓 SUT 不必碰真實 DAO、token 或外部服務。

使用依賴注入改造既有程式碼時，可以照這個順序做：

1. 針對相依物件抽出 interface；針對相依值抽出 field。
2. 產生可注入 field 的 constructor。
3. 保留無參數 constructor，讓既有 production code 行為不被破壞。
4. 在測試程式新增實作 interface 的 Fake Object。
5. 把 Fake Object 注入 SUT，再驗證 SUT 的結果。

這種做法讓程式碼更接近低耦合、高內聚。SUT 不需要知道資料從哪裡來，只需要依照 interface 取得密碼與 token；測試也不需要準備真實資料庫或真實 RSA token 服務。

## 如何用 Fake Object 取代 DAO 與 token 依賴？

當測試資料可以固定時，可以在測試裡建立 Fake Object 並注入 SUT。這種測試不驗證資料庫或 token 產生器，只驗證 \`AuthenticationService.IsValid()\` 的密碼組合邏輯。

測試程式先建立 \`FakeProfile\` 與 \`FakeToken\`，再注入 \`AuthenticationService\`：

\`\`\`csharp
using System;
using NUnit.Framework;
using RsaSecureToken;
using Assert = NUnit.Framework.Assert;

namespace RsaSecureToken.Tests
{
    [TestFixture]
    public class AuthenticationServiceTests
    {
        [Test()]
        public void IsValidTest()
        {
            var target = new AuthenticationService(new FakeProfile(), new FakeToken());

            var actual = target.IsValid("joey", "91000000");

            Assert.IsTrue(actual);
        }
    }

    public class FakeProfile : IProfile
    {
        public string GetPassword(string account)
        {
            if (account == "joey")
            {
                return "91";
            }

            throw new Exception();
        }
    }

    public class FakeToken : IRsaToken
    {
        public string GetRandom(string account)
        {
            return "000000";
        }
    }
}
\`\`\`

\`AuthenticationService\` 則透過 constructor 接收 \`IProfile\` 與 \`IRsaToken\`：

\`\`\`csharp
using System;
using System.Collections.Generic;

namespace RsaSecureToken
{
    public class AuthenticationService
    {
        private IProfile _profileDao;
        private IRsaToken _rsaToken;

        public AuthenticationService()
        {
            _profileDao = new ProfileDao();
            _rsaToken = new RsaTokenDao();
        }

        // for test
        public AuthenticationService(IProfile profile, IRsaToken rsaToken)
        {
            _profileDao = profile;
            _rsaToken = rsaToken;
        }

        public bool IsValid(string account, string password)
        {
            // 根據 account 取得自訂密碼
            var passwordFromDao = _profileDao.GetPassword(account);

            // 根據 account 取得 RSA token 目前的亂數
            var randomCode = _rsaToken.GetRandom(account);

            // 驗證傳入的 password 是否等於自訂密碼 + RSA token 亂數
            var validPassword = passwordFromDao + randomCode;
            var isValid = password == validPassword;

            if (isValid)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }

    public interface IProfile
    {
        string GetPassword(string account);
    }

    public class ProfileDao : IProfile
    {
        public string GetPassword(string account)
        {
            return Context.GetPassword(account);
        }
    }

    public static class Context
    {
        public static Dictionary<string, string> profiles;

        static Context()
        {
            profiles = new Dictionary<string, string>();
            profiles.Add("joey", "91");
            profiles.Add("mei", "99");
        }

        public static string GetPassword(string key)
        {
            return profiles[key];
        }
    }

    public interface IRsaToken
    {
        string GetRandom(string account);
    }

    public class RsaTokenDao : IRsaToken
    {
        public string GetRandom(string account)
        {
            var seed = new Random((int)DateTime.Now.Ticks & 0x0000FFFF);
            var result = seed.Next(0, 999999).ToString("000000");
            Console.WriteLine("randomCode:{0}", result);

            return result;
        }
    }
}
\`\`\`

在這個例子裡，\`FakeProfile.GetPassword("joey")\` 固定回傳 \`91\`，\`FakeToken.GetRandom()\` 固定回傳 \`000000\`。因此測試可以穩定驗證：當使用者輸入 \`91000000\` 時，\`AuthenticationService.IsValid()\` 應該回傳 \`true\`。

## Fake Object、Stub、Mock 該怎麼分？

Fake Object 在這篇文章中指「測試用的替身物件」，重點是提供可控制的相依行為。若團隊需要更精準的測試術語，可以再區分 Stub、Fake、Mock，但第一步仍是先把不可控制依賴抽出來。

實務上可以先用這張表判斷：

| 測試替身 | 主要目的 | 本文範例 |
|---|---|---|
| Fake Object | 用簡化實作取代真實依賴 | \`FakeProfile\`、\`FakeToken\` |
| Stub | 回傳固定資料給 SUT 使用 | \`GetToday()\` 固定回傳測試日期 |
| Mock | 驗證某個互動是否發生 | 例如驗證寄信服務是否被呼叫 |

如果只是要讓日期、亂數或資料查詢變成固定結果，用 Fake Object 或 Stub 就很夠了。不要為了導入測試框架而先把簡單範例變複雜；測試替身的價值是讓測試更清楚，不是讓測試更像框架展示。

## 什麼時候該用覆寫方法，什麼時候該用依賴注入？

覆寫方法適合小幅度替既有程式補測試，依賴注入適合長期維護與多個依賴替換。若程式碼還會持續演進，介面搭配 constructor injection 通常比較清楚。

我會這樣選：

| 情境 | 建議做法 | 原因 |
|---|---|---|
| 只需要控制一個 \`DateTime.Today\` | 抽出 \`protected virtual\` 方法 | 修改範圍小，適合替舊程式先補測試 |
| 需要替換資料庫、API、token 服務 | 抽 interface 並用 constructor injection | 相依物件明確，測試與 production 可使用不同實作 |
| 新功能從一開始就要可測試 | 優先設計依賴注入 | 不必為了測試再改公開或繼承結構 |
| 需要驗證互動次數或參數 | 使用 Mock framework | 手寫 Fake Object 可能會累積太多驗證邏輯 |

資訊增益：面對沒有測試的舊程式，我通常不會第一步就追求最漂亮的架構。先用最小改動把一個不可控依賴固定住，讓測試能跑起來；等測試保護住既有行為，再慢慢把依賴注入整理乾淨。

## 常見問題

單元測試 Fake Object 常見問題，多半集中在「該不該改 production code」以及「Fake Object 和 Mock 到底差在哪」。判斷時先回到測試目標：單元測試要驗證 SUT 的邏輯，不是驗證外部依賴本身。

### 單元測試為什麼不應該直接用 \`DateTime.Today\`？

\`DateTime.Today\` 會跟著真實日期改變，導致同一個測試在不同日期可能得到不同結果。單元測試應該把時間來源抽出來，讓測試可以固定日期後再驗證商業邏輯。

### Fake Object 和 Mock 有什麼差別？

Fake Object 通常提供一個簡化但可運作的測試替身，Mock 則常用來驗證互動是否發生、呼叫參數是否正確。本文的 \`FakeProfile\` 與 \`FakeToken\` 主要是提供固定資料，所以更接近 Fake Object 或 Stub 的用途。

### 既有程式沒有 interface，還能寫 unit test 嗎？

既有程式沒有 interface 時，可以先把不可控制的行為抽成 \`protected virtual\` 方法，再用測試子類別覆寫。這種做法不是最終架構，但很適合替 legacy code 建立第一層測試保護。

### 為什麼 production code 要保留無參數 constructor？

保留無參數 constructor 可以降低既有呼叫端的改動範圍。測試使用可注入依賴的 constructor，production code 則先維持原本建立 \`ProfileDao\` 與 \`RsaTokenDao\` 的方式。

### Fake Object 會不會讓測試變得不真實？

Fake Object 會讓單元測試刻意避開真實外部系統，這是單元測試的目的之一。若要確認資料庫、token 服務或網路真的能串接，應另外寫整合測試，不要把所有責任塞進單元測試。

## 參考資料

- 舊筆記來源：\`markdown-export/單元測試 – 使用Fake Object.md\`

## 延伸閱讀

- [單元測試 NSubstitute 教學：Substitute.For、Returns 與 Received 範例](/post/unit-test-substitute-for)：同樣聚焦 單元測試、C#，可接著比較不同情境的做法。
- [單元測試基礎入門：工作單元、AAA 三步驟與優秀測試的特質](/post/unit-testing-basics)：同樣聚焦 單元測試，可接著比較不同情境的做法。
- [單元測試重構指南：用 3A 原則與 Given/Should 命名讓測試更好維護](/post/unit-testing-refactoring)：同樣聚焦 單元測試、NUnit，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2026-08-28。這次整理保留 \`Holiday\`、\`HolidayForTest\`、\`AuthenticationService\`、\`FakeProfile\` 與 \`FakeToken\` 範例，並補上 GEO Answer Blocks、決策表、FAQ、延伸閱讀與站內圖片路徑。
`;export{e as default};