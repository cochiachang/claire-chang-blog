var e=`---
title: 單元測試寫作原則：測試替身、物件比較與避免測試碼壞味道
description: 整理單元測試的基本原則：stub、mock、spy 三種測試替身的差異，ExpectedObject 比較物件屬性，以及測試程式不該出現 if、try-catch、迴圈等商業邏輯的寫法要點。
date: 2018-07-28
category: 後端開發
tags: [單元測試, C#, 測試替身, Mock, 斷言]
readingTime: 6 分鐘
image: /images/tech/hero_unit-testing-principles.webp
imageAlt: 單元測試寫作原則筆記示意圖
---


# 單元測試寫作原則：測試替身、物件比較與避免測試碼壞味道

這篇文章整理我在練習單元測試時歸納的基本原則：如何分辨 stub、mock、spy 三種測試替身、怎麼用 ExpectedObject 比較物件與集合、以及撰寫測試時應該遵守哪些規則（測試碼不放商業邏輯、善用 assertion 套件、一定要重構測試程式）。這些原則能讓測試更好維護、更快撰寫，也更容易看出測試的意圖。

## 測試替身有哪三種？stub、mock、spy 有什麼差別？

測試替身（Test Double）常見有三種，差別在於「驗證」的方式：

| 類型 | 特性 | 驗證方式 |
| --- | --- | --- |
| stub | 不做驗證，單純只模擬相依物件的行為 | 無 |
| mock | 一開始就要把所有互動定義清楚，呼叫的方法與所有值必須一模一樣，否則就會報錯（嚴格、敏感、不穩定） | 內含驗證（從嚴） |
| spy | 把所有互動先記錄下來，只驗證要驗的部分，其餘沒測的都算過（寬鬆） | 內含驗證（從寬） |

換句話說，mock 和 spy 本身含有驗證（Assertion），stub 則只有在模擬相依的物件而已。mock 從嚴、spy 從寬，實務上依測試想要的敏感度來選擇。

## 如何比較物件屬性？用 ExpectedObject 取代逐一攤開

比較兩邊物件（包含子物件）是否完全相同，可以用 \`ShouldEqual\`：

\`\`\`csharp
expected.ToExpectedObject().ShouldEqual(actual);
\`\`\`

如果只想要「以 expected 為主」去比對相對應的 actual 屬性是否相同，則用 \`ShouldMatch\`：

\`\`\`csharp
expected.ToExpectedObject().ShouldMatch(actual);
\`\`\`

測試範例如下，涵蓋單一物件、集合、組合式物件與部分欄位比較四種情境：

\`\`\`csharp
namespace AssertionSample
{
    [TestFixture]
    public class AssertionSample
    {
        private CustomerRepo customerRepo = new CustomerRepo();

        //比較物件屬性的方式
        [Test]
        public void CompareCustomer()
        {
            var actual = customerRepo.Get();
            var expected = new Customer
            {
                Id = 2,
                Age = 18,
                Birthday = new DateTime(1990, 1, 26)
            };

            //CollectionAssert也是在比較物件的位置，所以也會有相同的問題
            expected.ToExpectedObject().ShouldEqual(actual);
        }

        //比較集合的方式
        [Test]
        public void CompareCustomerList()
        {
            var actual = customerRepo.GetAll();
            var expected = new List<Customer>
            {
                new Customer()
                {
                    Id = 3,
                    Age = 20,
                    Birthday = new DateTime(1993,1,2)
                },
                new Customer()
                {
                    Id = 4,
                    Age = 21,
                    Birthday = new DateTime(1993,1,3)
                }
            };

            expected.ToExpectedObject().ShouldEqual(actual);
        }

        //組合式物件的比較
        [Test]
        public void CompareComposedCustomer()
        {
            var actual = customerRepo.GetComposedCustomer();

            var expected = new Customer()
            {
                Age = 30,
                Id = 11,
                Birthday = new DateTime(1999, 9, 9),
                Order = new Order {Id = 19, Price = 91},
            };

            expected.ToExpectedObject().ShouldEqual(actual);
        }

        //回傳的資料的property很多，但是我們只想比其中幾項
        [Test]
        public void PartialCompare_Customer_Birthday_And_Order_Price()
        {
            var actual = customerRepo.GetComposedCustomer();

            //有自定型別的一定要改成匿名型別
            var expected = new
            {
                Birthday = new DateTime(1999, 9, 9),
                Order = new {Price = 91},
            };

            //使用匿名型別 去比較以expected為主去比較相對應的actual是否相同
            expected.ToExpectedObject().ShouldMatch(actual);
        }
    }
}
\`\`\`

## 寫測試有哪些規則？測試碼為什麼不能有商業邏輯？

測試程式不含商業邏輯，所有的測試都應該是直述句。測試碼不應包含以下元素：

- prod business logic（產品的商業邏輯）
- 不含 \`if\`、\`else\`、\`switch case\` 等邏輯程式碼
- 更不含 \`try..catch\`
- 不含 \`for\`、\`while\`、\`foreach\`、\`do..while\` 等迴圈

![寫測試的規則筆記](/images/articles/unit-testing-principles-1.webp)

斷言的部分要善用 assertion package，讓驗證程式碼更簡潔：

- C#：expectedObjects、FluentAssertions
- Java：AssertJ

例如驗證除以零要丟出例外，用 FluentAssertions 的 \`Throw<T>()\`，而不是在測試裡寫 try/catch：

\`\`\`csharp
[Test]
public void Divide_Zero()
{
    var calculator = new Calculator();
    Action action = () =>
    {
        calculator.Divide(5, 0);
    };
    action.Should().Throw<YouShallNotPassException>();
    //never use try/catch in unit test
}
\`\`\`

同時也不要攤開 property 做比較——改用 ExpectedObject 這類工具，測試意圖會清楚很多。

## 為什麼寫測試一定要重構？

寫測試一定要重構，不然在測試需求異動時和寫測試時會太花時間。我的做法是：

- 不應該有太多不會用到的資訊，讓測試目標的意圖可以很明顯
- 加快單元測試撰寫的速度很重要，這樣才有可能持續實踐單元測試
- 「沒有時間」是個問題，但要正面面對怎麼解決它：要知道怎麼用工具、怎麼寫比較快

例如善用 IDE 熱鍵與 live template 可以大幅加速：\`Alt+Enter\` Quick Action、\`Ctrl+R,M\` 抽方法、\`Ctrl+R,F\` Extract Field、\`ctor\`／\`prop\`／\`cw\` 等 code snippets，以及 \`Ctrl+Shift+V\` 循環剪貼簿。把重複的測試模板自動化，時間就不是借口。

## 常見問題

### stub、mock、spy 該選哪一個？

只需要模擬相依物件行為時用 stub；需要驗證互動時選 mock 或 spy。mock 把所有互動都定死、驗證從嚴，較容易因細節不符而變脆；spy 只驗證你在意的互動、從寬處理，通常更穩定。

### 為什麼測試程式不能有 if、try-catch 或迴圈？

測試應該是直述句，一眼就能看出驗證什麼。一旦出現商業邏輯，測試本身可能出錯，失敗時你分不清是產品錯還是測試錯，維護成本也會暴增。

### 比較物件一定要一個個 property 斷言嗎？

不用。用 ExpectedObject 的 \`ShouldEqual\`（完全相同）或 \`ShouldMatch\`（以 expected 為主比對部分屬性）就能取代逐項攤開，集合與巢狀物件也適用。

### 測試拋例外要怎麼驗證？

用 assertion 套件提供的例外驗證 API，例如 FluentAssertions 的 \`action.Should().Throw<T>()\`。不要在測試裡寫 try/catch 來接例外，那是把驗證邏輯藏進商業邏輯的壞味道。

### 沒時間寫測試怎麼辦？

把「寫得快」當成一等問題來解：重構測試碼、只保留必要的資訊、善用 IDE 熱鍵與 live template。撰寫速度上來，單元測試才有可能變成日常習慣。

## 參考資料

- 發表於 Claire Chang 部落格（2018-07-28，IT 邦幫忙鐵人賽系列筆記）

## 延伸閱讀

- [單元測試 NSubstitute 教學：Substitute.For、Returns 與 Received 範例](/post/unit-test-substitute-for)：同樣聚焦 單元測試、C#，可接著比較不同情境的做法。
- [單元測試 Fake Object 教學：隔離時間與外部依賴的 C# 範例](/post/unit-test-fake-object)：同樣聚焦 單元測試、C#，可接著比較不同情境的做法。
- [單元測試基礎入門：工作單元、AAA 三步驟與優秀測試的特質](/post/unit-testing-basics)：同樣聚焦 單元測試，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2018-07-28，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};