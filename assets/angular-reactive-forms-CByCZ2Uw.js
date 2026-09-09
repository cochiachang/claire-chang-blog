var e=`---
title: Angular Reactive Forms 完整教學：Model-Driven Forms 表單驗證實戰
description: Angular Reactive Forms（Model-Driven Forms）教學：比較 Reactive 與 Template-Driven Forms 的同步與非同步差異，並用 FormGroup、FormBuilder、Validators、FormArray 實作完整表單驗證。
date: 2018-01-05
category: 前端開發
tags: [Angular, Reactive Forms, FormGroup, FormBuilder, 表單驗證]
readingTime: 9 分鐘
image: /images/tech/hero_angular-reactive-forms.webp
imageAlt: 開發者在筆電上撰寫表單驗證程式碼的特寫畫面
---


# Angular Reactive Forms 完整教學：Model-Driven Forms 表單驗證實戰

Angular 的表單有兩條路線：Template-Driven Forms 與 Reactive Forms（又稱 Model-Driven Forms）。這篇文章先比較兩者的核心差異——同步與非同步，再帶你從 \`FormGroup\`、\`FormBuilder\`、驗證器（Validators）、Nested FormGroup 一路做到用 \`FormArray\` 動態新增多組地址，所有程式碼都可以直接照著用。

## Reactive Forms 和 Template-Driven Forms 有什麼差別？

### Reactive forms

Reactive forms 的驗證大多是直接寫在 controller 裡的，會是一個明確的、非 UI 的 data flowing。Reactive forms 的 reactive patterns 可以讓測試與驗證更加簡單。

使用 Reactive forms 可以用一個樹狀的控制物件來 binding 到表單 template 的元件上，這讓所有驗證的程式碼都集中在一起，方便維護與管理，在撰寫單元測試時也會較為容易。使用 Model-Driven Forms 也較符合 reactive programming 的概念（延伸閱讀：[Functional Reactive Programming 的入門心得](https://medium.com/@rayshih771012/functional-reactive-programming-70be6bd8726b)）。

### Template-driven forms

Template-driven forms 是將組件驗證控制的功能寫在像是 \`<input>\` 或 \`<select>\` 的標籤內，並利用 ngModel 來確認是否輸入了合法的內容。使用表單驅動驗證不需要自己創建 control objects，因為 Angular 已經為我們建好了。

ngModel 會處理使用者改變與輸入表單的事件，並更新 ngModel 裡面的可變數據，讓我們可以去處理後續的事。也因此 ngModel 並不是 ReactiveFormsModule 的一部份。

這代表著使用表單驅動驗證，我們需要撰寫的程式碼更少。但是如果我們的表單需要很複雜的驗證步驟並且要顯示很多不同的錯誤訊息時，使用表單驅動驗證會使事情變得更複雜並難以維護。

### 最大的差異：同步與非同步

Reactive forms 是同步的，而 Template-driven forms 為非同步處理，是這兩者間最大的差異。

| | Reactive Forms | Template-Driven Forms |
|---|---|---|
| 邏輯位置 | controller（程式碼） | template（HTML 標籤） |
| 資料流 | 同步、即時 | 非同步（directive 委派檢查） |
| Control objects | 自己建立（樹狀結構） | Angular 自動建立 |
| 複雜驗證 | 集中、好維護 | 變複雜、難維護 |
| 單元測試 | 簡單 | 需靠 \`setTimeout\` 等待結果 |

對 Reactive forms 來說，所有表單的資料是在 code 裡以 tree 的方式來呈現，所以在任一個節點可以取得其他表單的資料，並且這些資料是即時同步被更新的。我們也可以在使用者修改了某個 input 的值時，去為使用者自動 update 另一個 input 內的預設值，這是因為所有資料都是隨時可取得的。

Template-driven forms 在每一個表單元件各自透過 directive 委派檢查的功能，為了避免檢查後修改而造成檢查失效的問題，directive 會在更多的時候去檢查輸入的值的正確性，因此並沒有辦法立即得到回應，而需要一小段的時間才有辦法得到使用者輸入的值是否合法的回應。這會讓我們在撰寫單元測試時更加複雜，我們會需要利用 \`setTimeout\` 去讓取得的檢查結果是正確的。

## 如何開始使用 Reactive Forms？

Reactive Forms 的功能封裝在 ReactiveFormsModule 中，和 FormsModule 同樣在 \`@angular/forms\` 之下。如果要使用 Reactive Forms 需要使用下面的程式碼：

\`\`\`js
import { ReactiveFormsModule } from '@angular/forms';
\`\`\`

## Reactive Forms 的四個重要成員是什麼？

- [AbstractControl](https://angular.io/api/forms/AbstractControl)：AbstractControl 是 FormControl、FormGroup、FormArray 這三個實例表單類的抽象基類。它提供了它們的通用行為以及屬性，例如 observable。
- [FormControl](https://angular.io/api/forms/FormControl)：在單個表單元件中檢查值並驗證狀態（比如 input、select 等等）。
- [FormGroup](https://angular.io/api/forms/FormGroup)：一組值與驗證狀態（FormControl），其屬性包含了它們的子控件。例如一個 form 表單就是一個 FormGroup。
- [FormArray](https://angular.io/api/forms/FormArray)：用索引的方式去追蹤檢查表單的驗證狀態。

## 如何新增一個 FormGroup？

首先要新增 FormGroup 所需使用的類別：

\`\`\`js
import { Component }              from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
\`\`\`

然後創建這個 Group，並定義裡面的驗證元素：

\`\`\`js
export class HeroDetailComponent2 {
  heroForm = new FormGroup ({
    name: new FormControl()
  });
}
\`\`\`

接著，在 template 裡面的 form 裡指定這個 form 要使用 heroForm 來做表單驗證，並且在 input 裡面指定它的 formControlName：

\`\`\`html
<h2>Hero Detail</h2>
<h3><i>FormControl in a FormGroup</i></h3>
<form [formGroup]="heroForm" novalidate>
  <div class="form-group">
    <label class="center-block">Name:
      <input class="form-control" formControlName="name">
    </label>
  </div>
</form>
\`\`\`

form 標籤下的 novalidate 屬性，是為了要防止瀏覽器自己執行 native 的驗證：

\`\`\`html
<form [formGroup]="heroForm" novalidate>
\`\`\`

而 \`[formGroup]="heroForm"\` 則是將 template 內的 form 元件與 controller 裡所創的 formGroup 做關連：

\`\`\`html
<input class="form-control" formControlName="name">
\`\`\`

這個則是將 input 與 formGroup 下名為 name 的 formControl 做關連。

註：bootstrap 的 form-group 以及 form-control 與 Angular 完全無關。下面是 bootstrap 為我們設計的 form 表單樣式範例，但是這只是 css，沒辦法讓組件與控制器結合：

\`\`\`html
<form>
  <div class="form-group">
    <label for="formGroupExampleInput">Example label</label>
    <input type="text" class="form-control" id="formGroupExampleInput" placeholder="Example input">
  </div>
  <div class="form-group">
    <label for="formGroupExampleInput2">Another label</label>
    <input type="text" class="form-control" id="formGroupExampleInput2" placeholder="Another input">
  </div>
</form>
\`\`\`

![Bootstrap 表單樣式與 Angular FormGroup 的關係示意](/images/articles/angular-reactive-forms-1.webp)

## FormBuilder 怎麼用？

FormBuilder 可以減少我們在創建 formGroup 時有太多重複的定義，要使用要先 import 必要的檔案：

\`\`\`js
import { Component }              from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
\`\`\`

使用 FormBuilder 大致要做的事如下：

- 宣告 heroForm 為 FormGroup
- 在初始化元件時 inject FormBuilder
- 創建 form 控件時需要另外去呼叫函數 createForm，使用注入的 FormBuilder 來創建 formControl
- 在創建 formGroup 時，用 \`this.fb.group\` 來宣告這個 formGroup 裡所有的 formControl

\`\`\`js
export class HeroDetailComponent3 {
  heroForm: FormGroup; // <--- 宣告heroForm為FormGroup

  constructor(private fb: FormBuilder) { // <--- 注入FormBuilder
    this.createForm();
  }

  createForm() {
    this.heroForm = this.fb.group({
      name: '', // <--- 建立一個名為name，預設值為''的formControl
    });
  }
}
\`\`\`

FormBuilder 的宣告方式如上，name 控件由其初始數據值（一個空字符串）定義。

## 如何使用驗證器（Validators）？

首先要先 import 該驗證器：

\`\`\`js
import { Component }                          from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
\`\`\`

然後在建立 formControl 時指定使用該驗證器：

\`\`\`js
this.heroForm = this.fb.group({
  name: ['', Validators.required ],
});
\`\`\`

## 什麼時候需要 Nested FormGroups？

有時我們在做地址輸入框時，會有如國家、區、鄉、市、街、郵遞區號等不同的輸入欄位，但它們應該是一個 group，這時候就可以用 nested formGroup。透過這樣的結構層次，可以讓我們在追蹤表格狀態更為容易清楚：

\`\`\`js
export class HeroDetailComponent5 {
  heroForm: FormGroup;
  states = states;

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  createForm() {
    this.heroForm = this.fb.group({ // <-- the parent FormGroup
      name: ['', Validators.required ],
      address: this.fb.group({ // <-- the child FormGroup
        street: '',
        city: '',
        state: '',
        zip: ''
      }),
      power: '',
      sidekick: ''
    });
  }
}
\`\`\`

我們用一個 div 將整個地址的區塊包起來，並用 formGroupName="address" 來與 heroForm 裡的 address 做連結：

\`\`\`html
<div formGroupName="address" class="well well-lg">
  <h4>Secret Lair</h4>
  <div class="form-group">
    <label class="center-block">Street:
      <input class="form-control" formControlName="street">
    </label>
  </div>
  <div class="form-group">
    <label class="center-block">City:
      <input class="form-control" formControlName="city">
    </label>
  </div>
  <div class="form-group">
    <label class="center-block">State:
      <select class="form-control" formControlName="state">
        <option *ngFor="let state of states" [value]="state">{{state}}</option>
      </select>
    </label>
  </div>
  <div class="form-group">
    <label class="center-block">Zip Code:
      <input class="form-control" formControlName="zip">
    </label>
  </div>
</div>
\`\`\`

## FormControl 有哪些常用屬性？

我們可以用下面的方式來將 formControl 裡可使用的屬性都印出來：

\`\`\`html
<p>Form value: {{ heroForm.value | json }}</p>
\`\`\`

基本上會有下面四個屬性可以讓我們使用：

| 屬性 | 描述 |
|------|------|
| \`myControl.value\` | FormControl 使用者輸入的值 |
| \`myControl.status\` | 這個 FormControl 的驗證結果。可能的值有：\`VALID\`、\`INVALID\`、\`PENDING\` 或 \`DISABLED\` |
| \`myControl.pristine\` | 使用者是否有在 UI 上更動過這個元素，假如沒有的話會是 true。相反的屬性為 \`myControl.dirty\` |
| \`myControl.untouched\` | 使用者尚未輸入並且從未觸發過 blur event 時為 true。相反的屬性為 \`myControl.touched\` |

## Data model 和 form model 有什麼不同？

以往我們在創建資料類型時是像這樣子的：

\`\`\`js
export class Hero {
  id = 0;
  name = '';
  addresses: Address[];
}

export class Address {
  street = '';
  city   = '';
  state  = '';
  zip    = '';
}
\`\`\`

但是我們在創建 formGroup 是這樣子的：

\`\`\`js
this.heroForm = this.fb.group({
  name: ['', Validators.required ],
  address: this.fb.group({
    street: '',
    city: '',
    state: '',
    zip: ''
  }),
  power: '',
  sidekick: ''
});
\`\`\`

我們可以直接利用 class 來創建 formControl：

\`\`\`js
this.heroForm = this.fb.group({
  name: ['', Validators.required ],
  address: this.fb.group(new Address()), // <-- a FormGroup with a new address
  power: '',
  sidekick: ''
});
\`\`\`

## 如何用 setValue 和 patchValue 為表單填入初始值？

在上面 data model 和 form model 的介紹範例中，可以看到 Hero 與 formGroup 建立 heroForm 模型有兩個顯著的區別：

- Hero class 有 id，formGroup 沒有。
- Hero class 的地址是一個陣列。

但是我們可以利用 setValue 來更簡單地將一個 class 的資料填進表單中：

\`\`\`js
this.heroForm.setValue({
  name:    this.hero.name,
  address: this.hero.addresses[0] || new Address()//這是因為form元件只能顯示一個地址，如果class內容沒有值時，要預設新建立一個Address物件
});
\`\`\`

也可以使用 patchValue 來將單一的值填入表單裡：

\`\`\`js
this.heroForm.patchValue({
  name: this.hero.name
});
\`\`\`

如果我們要做一個修改 hero 資料的列表，當點下某個 hero 時就可以修改該 hero 的資料：

\`\`\`html
<nav>
  <a *ngFor="let hero of heroes | async" (click)="select(hero)">{{hero.name}}</a>
</nav>

<div *ngIf="selectedHero">
  <app-hero-detail [hero]="selectedHero"></app-hero-detail>
</div>
\`\`\`

然後在 controller 裡面去監聽 ngOnChange 事件並且用 setValue 來設定要修改的值：

\`\`\`js
ngOnChanges() {
  this.heroForm.reset({
    name: this.hero.name,
    address: this.hero.addresses[0] || new Address()
  });
}
\`\`\`

會需要使用 reset 是為了要清除前一個 hero 的資料。

## 如何用 FormArray 呈現多組 FormGroup？

如果一個 hero 可能需要有多組的地址時，就會需要使用 FormArray。原本我們是這樣定義 Address 的：

\`\`\`js
this.heroForm = this.fb.group({
  name: ['', Validators.required ],
  address: this.fb.group(new Address()), // <-- a FormGroup with a new address
  power: '',
  sidekick: ''
});
\`\`\`

使用 FormArray 則變成這樣：

\`\`\`js
this.heroForm = this.fb.group({
  name: ['', Validators.required ],
  secretLairs: this.fb.array([]), // <-- secretLairs as an empty FormArray
  power: '',
  sidekick: ''
});
\`\`\`

可以用下面的 function 將很多組的 address 設定進去 formArray 成為預設值：

\`\`\`js
setAddresses(addresses: Address[]) {
  const addressFGs = addresses.map(address => this.fb.group(address));
  const addressFormArray = this.fb.array(addressFGs);
  this.heroForm.setControl('secretLairs', addressFormArray);
}
\`\`\`

要取得 formArray 可以撰寫下面的方法：

\`\`\`js
get secretLairs(): FormArray {
  return this.heroForm.get('secretLairs') as FormArray;
};
\`\`\`

而顯示方式如下：

\`\`\`html
<div formArrayName="secretLairs" class="well well-lg">
  <div *ngFor="let address of secretLairs.controls; let i=index" [formGroupName]="i" >
    <!-- The repeated address template -->
  </div>
</div>
\`\`\`

完整內容如下：

\`\`\`html
<div formArrayName="secretLairs" class="well well-lg">
  <div *ngFor="let address of secretLairs.controls; let i=index" [formGroupName]="i" >
    <!-- The repeated address template -->
    <h4>Address #{{i + 1}}</h4>
    <div style="margin-left: 1em;">
      <div class="form-group">
        <label class="center-block">Street:
          <input class="form-control" formControlName="street">
        </label>
      </div>
      <div class="form-group">
        <label class="center-block">City:
          <input class="form-control" formControlName="city">
        </label>
      </div>
      <div class="form-group">
        <label class="center-block">State:
          <select class="form-control" formControlName="state">
            <option *ngFor="let state of states" [value]="state">{{state}}</option>
          </select>
        </label>
      </div>
      <div class="form-group">
        <label class="center-block">Zip Code:
          <input class="form-control" formControlName="zip">
        </label>
      </div>
    </div>
    <br />
    <!-- End of the repeated address template -->
  </div>
</div>
\`\`\`

要為這個 hero 新增一個地址可以用下面這個方法：

\`\`\`js
addLair() {
  this.secretLairs.push(this.fb.group(new Address()));
}
\`\`\`

按下增加地址按鈕時呼叫這個方法：

\`\`\`html
<button (click)="addLair()" type="button">Add a Secret Lair</button>
\`\`\`

將 formControl 的資料用深層複製存回 class 裡的方法：

\`\`\`js
prepareSaveHero(): Hero {
  const formModel = this.heroForm.value;

  // deep copy of form model lairs
  const secretLairsDeepCopy: Address[] = formModel.secretLairs.map(
    (address: Address) => Object.assign({}, address)
  );

  // return new \`Hero\` object containing a combination of original hero value(s)
  // and deep copies of changed form model values
  const saveHero: Hero = {
    id: this.hero.id,
    name: formModel.name as string,
    // addresses: formModel.secretLairs // <-- bad!
    addresses: secretLairsDeepCopy
  };
  return saveHero;
}
\`\`\`

## 常見問題

### Angular 的 Reactive Forms 是什麼？

Reactive Forms（又稱 Model-Driven Forms）是 Angular 表單的其中一種做法，把表單的控制與驗證邏輯直接寫在 controller 裡，用 \`FormGroup\`、\`FormControl\` 等樹狀物件綁定到 template 上。它讓所有驗證程式碼集中、資料流同步即時，單元測試也更好寫。

### Reactive Forms 和 Template-Driven Forms 該選哪一個？

表單簡單、驗證單純時，Template-Driven Forms 程式碼最少、上手最快；當表單需要複雜的驗證步驟、多種錯誤訊息或動態欄位時，Reactive Forms 的同步資料流與集中管理會好維護得多。兩者最大的差異是 Reactive Forms 為同步處理、Template-Driven Forms 為非同步。

### FormBuilder 和直接 new FormGroup 的差別是什麼？

\`new FormGroup\` 需要為每個欄位明確 \`new FormControl()\`，欄位一多重複的定義就會變多。FormBuilder 提供 \`this.fb.group()\` 的簡寫語法，直接用物件字面值宣告所有 control，程式碼更精簡；兩者產生的表單結構完全相同。

### 什麼時候該用 FormArray？

當一個欄位需要重複出現多組時（例如一個 hero 有多組地址），就要用 FormArray。它用索引的方式追蹤每組 FormControl／FormGroup 的驗證狀態，可以透過 \`push()\` 動態新增、用 \`*ngFor\` 配合 \`formGroupName\` 或 \`formArrayName\` 在 template 中渲染。

### setValue 和 patchValue 有什麼不同？

\`setValue\` 會要求填入 formGroup 中「所有」欄位的值，少一個都會報錯，適合完整覆蓋表單資料；\`patchValue\` 只更新指定的欄位，其餘保持原值，適合局部更新。切換編輯對象時通常會搭配 \`reset()\` 一起使用，以清除前一筆資料。

## 參考資料

- [Angular 4.x Reactive Forms](https://segmentfault.com/a/1190000009041192)
- [Bootstrap Forms — Form groups](https://v4-alpha.getbootstrap.com/components/forms/#form-groups)
- [Functional Reactive Programming 的入門心得](https://medium.com/@rayshih771012/functional-reactive-programming-70be6bd8726b)

## 延伸閱讀

- [Angular Reactive Forms 教學：Model-Driven Forms 的驗證、FormBuilder 與 FormArray](/post/angular-reactive-forms)：同樣聚焦 Angular、Reactive Forms，可接著比較不同情境的做法。
- [Angular Template-Driven Forms 教學：ngModel、驗證與自訂 Validator](/post/angular-template-driven-forms)：同樣聚焦 Angular，可接著比較不同情境的做法。
- [Angular NPM 與 package.json 設定教學](/post/angular-npm-package-json-setup)：同樣聚焦 Angular，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2018-01-05，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};