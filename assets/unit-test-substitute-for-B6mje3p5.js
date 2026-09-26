var e=`---
title: 單元測試 NSubstitute 教學：Substitute.For、Returns 與 Received 範例
description: 說明 C# 單元測試如何用 NSubstitute 建立替身物件、設定回傳值並驗證方法呼叫與參數。
date: 2018-08-19
category: 後端開發
tags: [單元測試, NSubstitute, C#, NUnit, Mock]
readingTime: 8 分鐘
image: /images/tech/unit-test-substitute-for-getting-started.png
imageAlt: NSubstitute 官方 Getting Started 頁面截圖
---
# 單元測試 NSubstitute 教學：Substitute.For、Returns 與 Received 範例

NSubstitute 是 .NET 測試裡常用的隔離框架，可以在單元測試中動態產生替身物件、設定方法回傳值、驗證方法是否被呼叫，也能檢查傳入參數是否符合預期。當手寫 Fake Object 開始變多，NSubstitute 可以讓測試案例更短，測試意圖也更容易直接從程式碼看出來。

![NSubstitute 官方 Getting Started 頁面截圖](/images/tech/unit-test-substitute-for-getting-started.png)

## NSubstitute 在單元測試裡解決什麼問題？

NSubstitute 解決的是測試替身建立成本太高的問題。測試不必為每個相依情境手寫一個 Fake Object，而是用 \`Substitute.For<T>()\` 產生替身並在測試中描述行為。

NSubstitute 是 .NET 裡的隔離框架。若要使用，需要先在測試專案透過 NuGet 安裝 \`NSubstitute\`，再於測試檔引用套件命名空間。

NSubstitute 常見用途有四種：

1. 動態產生假物件。
2. 模擬方法回傳值。
3. 測試事件或互動是否發生。
4. 驗證傳入參數是否正確。

這類工具適合用在 SUT（System Under Test，測試目標）依賴外部物件時，例如 DAO、token 產生器、logger 或第三方服務。測試的重點仍然是 SUT 的商業邏輯，而不是替身框架本身。

## \`Substitute.For<T>()\` 怎麼動態產生替身物件？

\`Substitute.For<T>()\` 會依照 interface 或可替代型別建立測試替身。測試可以直接指定替身方法的行為，省掉額外撰寫 Fake Object 類別的時間。

最基本的寫法是用 \`Substitute.For<ICalculator>()\` 建立 \`ICalculator\` 的替身：

\`\`\`csharp
calculator = Substitute.For<ICalculator>();
\`\`\`

接著可以設定呼叫某個方法時應該回傳什麼值：

\`\`\`csharp
calculator.Add(1, 2).Returns(3);

Assert.That(calculator.Add(1, 2), Is.EqualTo(3));
\`\`\`

如果測試只需要固定回傳值，\`Returns()\` 就能直接表達測試條件。這比先另外寫一個 \`FakeCalculator\` 類別更短，也比較容易讓人看出「輸入 1 和 2 時，測試希望得到 3」。

## NSubstitute 如何驗證方法是否被呼叫？

NSubstitute 使用 \`Received()\` 驗證某個方法曾被呼叫，使用 \`DidNotReceive()\` 驗證某個方法沒有被呼叫。這種寫法適合驗證 logger、repository 或通知服務是否被觸發。

下面的程式可以驗證 \`Add(1, 2)\` 有被呼叫，也可以驗證 \`Add(5, 7)\` 沒有被呼叫：

\`\`\`csharp
calculator.Add(1, 2);

calculator.Received().Add(1, 2);
calculator.DidNotReceive().Add(5, 7);
\`\`\`

互動驗證要克制使用。若 production code 只是把內部實作拆成不同方法，測試就跟著壞掉，代表測試過度指定了實作細節。比較適合驗證互動的情境，是「非法登入時必須寫 log」、「符合條件的訂單必須送進 DAO」這類真正有外部效果的行為。

## NSubstitute 怎麼驗證傳入參數是否正確？

NSubstitute 的 \`Arg.Any<T>()\` 可以接受任意參數，\`Arg.Is<T>()\` 可以用條件式檢查參數內容。當測試不只關心方法有沒有被呼叫，也關心呼叫時帶了什麼資料，就需要參數驗證。

下面的程式可以判斷傳入的參數是否正確：

\`\`\`csharp
calculator.Add(10, -5);

calculator.Received().Add(10, Arg.Any<int>());
calculator.Received().Add(10, Arg.Is<int>(x => x < 0));
\`\`\`

如果要驗證字串內容，也可以用 \`Arg.Is<string>()\` 檢查是否包含關鍵字：

\`\`\`csharp
_logger
    .Received(1)
    .Save(Arg.Is<string>(m => m.Contains("joey") && m.Contains("login failed")));
\`\`\`

這類測試適合放在邊界行為，例如錯誤訊息、稽核紀錄、送出通知或資料寫入。參數條件寫得越精準，測試越能描述規格；但若條件只是重複 production code 的每個細節，測試反而會變脆。

## \`Returns()\` 能不能依照傳入參數計算回傳值？

\`Returns()\` 可以讀取呼叫時的參數，再依照參數計算回傳值。這種寫法適合替身方法的輸出和輸入有簡單關係時，例如加總、格式化或回傳特定欄位。

下面的範例會讓 \`Add()\` 依照實際傳入的兩個整數回傳加總結果：

\`\`\`csharp
calculator
    .Add(Arg.Any<int>(), Arg.Any<int>())
    .Returns(x => (int)x[0] + (int)x[1]);

Assert.That(calculator.Add(5, 10), Is.EqualTo(15));
\`\`\`

這種寫法比每一組輸入都各自寫一個 \`Returns()\` 更彈性。不過替身邏輯仍然應該保持簡單；如果 \`Returns()\` 裡開始出現複雜規則，測試可能正在複製另一份 production code。

## 為什麼手寫 Fake Object 會讓測試變慢？

手寫 Fake Object 的問題不在於錯，而在於案例一多就會膨脹。每個不同依賴情境都做一個 Fake Object，測試維護成本會變高，也比較難從測試本身看出有效條件。

下面是一個手寫 Fake Object 的範例。\`AuthenticationService\` 需要 \`IProfile\` 和 \`IRsaToken\`，測試為了固定密碼與 token，另外寫了 \`FakeProfile\` 和 \`FakeToken\`：

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

這個做法有兩個缺點：

1. 每一種依賴案例都要製作不同的 Fake Object，寫測試的時間會變長。
2. 測試者無法直接從測試方法裡看出 \`joey\` 為什麼應該是 valid，因為條件藏在 \`FakeProfile\` 和 \`FakeToken\` 類別裡。

## 如何用 NSubstitute 改寫手寫 Fake Object？

用 NSubstitute 改寫後，測試可以把替身行為留在同一個測試案例裡。讀測試的人不用跳到其他 Fake Object 類別，就能看懂密碼與 token 的測試條件。

\`Substitute.For<T>()\` 用來產生替身物件，\`Returns()\` 用來定義 stub 行為：

\`\`\`csharp
Substitute.For<T>();
\`\`\`

\`\`\`csharp
fake.Method(arguments).Returns(value);
\`\`\`

改寫 \`AuthenticationService\` 測試後，可以直接在測試中指定 \`IProfile\` 與 \`IRsaToken\` 的回傳值：

\`\`\`csharp
[Test()]
public void IsValidTest()
{
    var fakeProfile = Substitute.For<IProfile>();
    fakeProfile.GetPassword("joey").Returns("91");

    var fakeToken = Substitute.For<IRsaToken>();
    fakeToken.GetRandom("").ReturnsForAnyArgs("000000");

    var target = new AuthenticationService(fakeProfile, fakeToken);
    var actual = target.IsValid("joey", "91000000");

    Assert.IsTrue(actual);
}
\`\`\`

這段測試的條件很明確：\`joey\` 的密碼前段是 \`91\`，RSA token 固定回傳 \`000000\`，所以 \`91000000\` 應該通過驗證。測試不再需要為這個案例額外維護兩個 Fake Object 類別。

## 如何用 \`Received(2)\` 驗證呼叫次數？

\`Received(2)\` 可以驗證某個方法被呼叫兩次。當規格要求某類資料要被處理固定次數時，呼叫次數驗證能直接反映業務規則。

需求是：呼叫 \`SyncBookOrders()\` 時，只要訂單類型是 \`Book\`，就應該呼叫 \`Insert()\`。下面的測試資料有兩筆 \`Book\`、一筆 \`Item\`，所以 \`Insert()\` 應該被呼叫兩次：

\`\`\`csharp
[Test]
public void Test_SyncBookOrders_3_Orders_Only_2_book_order()
{
    var result = new List<Order>
    {
        new Order
        {
            Type = "Book"
        },
        new Order
        {
            Type = "Book"
        },
        new Order
        {
            Type = "Item"
        }
    };

    var target = new OrderServiceForTest();
    target.SetOrder(result);

    var fakeBookDao = Substitute.For<IBookDao>();
    target.SetDao(fakeBookDao);

    target.SyncBookOrders();

    fakeBookDao.Received(2).Insert(Arg.Is<Order>(m => m.Type == "Book"));
}
\`\`\`

資訊增益：我會把 \`Received()\` 放在「外部效果」或「規格明確要求的互動」上，而不是到處檢查內部函數。單元測試應該保護行為，不應該讓小幅重構就造成大量測試失敗。

## NSubstitute 使用時要注意什麼？

NSubstitute 可以減少手寫替身類別，但不能取代好的測試設計。測試仍然要避免過度 mock，並讓每個驗證都對應真實規格。

實務上可以用這張表判斷要不要使用 NSubstitute：

| 情境 | 建議做法 | 原因 |
|---|---|---|
| 只需要固定簡單回傳值 | 使用 \`Returns()\` | 測試條件直接留在案例內 |
| 需要驗證 logger 或 DAO 是否被呼叫 | 使用 \`Received()\` | 互動本身就是規格的一部分 |
| 需要檢查傳入參數內容 | 使用 \`Arg.Is<T>()\` | 讓測試描述資料條件 |
| 替身邏輯已經很複雜 | 考慮手寫 Fake Object | 複雜邏輯放進 \`Returns()\` 會讓測試難讀 |
| 測試因為 production code 小重構就壞掉 | 減少互動驗證 | 測試可能綁太多實作細節 |

NSubstitute 的價值，是讓測試案例能直接說清楚「我需要哪個依賴回傳什麼」以及「我期待哪個外部行為發生」。如果測試開始驗證太多不重要的呼叫順序、呼叫次數或內部協作，測試就會變成重構阻力。

## 常見問題

### NSubstitute 是什麼？

NSubstitute 是 .NET 單元測試使用的隔離框架，可以產生替身物件、設定方法回傳值、驗證方法呼叫與檢查參數。常見搭配是 C#、NUnit，以及以 interface 注入的相依物件。

### \`Substitute.For<T>()\` 通常用在什麼地方？

\`Substitute.For<T>()\` 通常用在測試需要替換 interface 相依物件時，例如 DAO、logger、token 產生器或外部服務 client。測試用替身物件取代真實依賴後，就能把焦點放回 SUT 的邏輯。

### \`Returns()\` 和 \`ReturnsForAnyArgs()\` 有什麼差別？

\`Returns()\` 會針對指定參數設定回傳值，適合測試關心特定輸入的情境。\`ReturnsForAnyArgs()\` 則不在意呼叫時傳入什麼參數，只要方法被呼叫就回傳指定值。

### \`Received()\` 是不是越多越好？

\`Received()\` 不是越多越好。只有當方法呼叫本身代表重要規格，例如寫入資料、記錄 log 或送出通知時，才適合驗證互動；一般內部協作如果驗證太細，測試會變得很容易因重構而失敗。

### NSubstitute 可以完全取代 Fake Object 嗎？

NSubstitute 不一定要完全取代 Fake Object。簡單回傳值與互動驗證適合交給 NSubstitute；若替身需要維持狀態、模擬較完整流程，手寫 Fake Object 可能更清楚。

### 單元測試要驗證回傳值，還是驗證方法呼叫？

單元測試優先驗證可觀察的結果，例如回傳值或狀態改變。只有在行為沒有直接回傳值、但會呼叫外部依賴產生效果時，才用 \`Received()\` 驗證方法呼叫。

## 參考資料

- NSubstitute Documentation：[Getting started](https://nsubstitute.github.io/help/getting-started/)
- 來源筆記：\`markdown-export/單元測試 – 隔離框架Substitute.For.md\`

## 延伸閱讀

- [單元測試 Fake Object 教學：隔離時間與外部依賴的 C# 範例](/post/unit-test-fake-object)：同樣聚焦 單元測試、C#，可接著比較不同情境的做法。
- [單元測試重構指南：用 3A 原則與 Given/Should 命名讓測試更好維護](/post/unit-testing-refactoring)：同樣聚焦 單元測試、NUnit，可接著比較不同情境的做法。
- [單元測試寫作原則：測試替身、物件比較與避免測試碼壞味道](/post/unit-testing-principles)：同樣聚焦 單元測試、C#，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2026-08-28。這次整理保留 \`Substitute.For<T>()\`、\`Returns()\`、\`Received()\`、\`Arg.Any<T>()\`、\`Arg.Is<T>()\`、\`AuthenticationService\` 與 \`OrderServiceForTest\` 範例，並補上 GEO Answer Blocks、FAQ、延伸閱讀與站內圖片路徑。
`;export{e as default};