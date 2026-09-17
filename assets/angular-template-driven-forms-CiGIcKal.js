var e=`---
title: Angular Template-Driven Forms 教學：ngModel、驗證與自訂 Validator
description: 介紹 Angular 模版驅動表單的雙向綁定、內建驗證器、自訂 Validator 與 ngSubmit 送出流程。
date: 2018-01-04
category: 前端開發
tags: [Angular, Forms, ngModel, TypeScript]
readingTime: 8 分鐘
image: /images/tech/hero_angular-template-driven-forms.webp
imageAlt: 使用筆電輸入表單資料的特寫畫面
---
# Angular Template-Driven Forms 教學：ngModel、驗證與自訂 Validator

Angular 的模版驅動表單（Template-Driven Forms）把大部分邏輯寫在 HTML 模版裡，靠 \`ngModel\` 做雙向綁定、靠內建或自訂的 directive 做驗證。它跟後來的 Reactive Forms 是兩條不同路線，但在中小型表單、原型驗證這類場景，模版驅動表單少寫很多樣板程式碼，上手也快。

## 如何用 Event 從 template 傳資料給 Component？

不透過 \`ngModel\`，直接用 \`(keyup)\` 這類事件把 \`$event\` 傳回 component，是最原始也最直接的做法：

\`\`\`html
<input (keyup)="onKey($event)">
<p>{{values}}</p>
\`\`\`

在 component 裡透過 \`event.target\` 存取這個 \`HTMLInputElement\` 的資料（詳細規格見 [MDN HTMLInputElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement)）：

\`\`\`ts
export class KeyUpComponent_v1 {
  values = '';

  onKey(event: any) {
    this.values += event.target.value + ' | ';
  }
}
\`\`\`

## 如何啟用模版驅動表單？

模版驅動表單需要先在 \`AppModule\` 匯入 \`FormsModule\`，才能使用 \`ngModel\` 等相關指令：

\`\`\`ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // 使用模版驅動表單需要 import 這個模組

import { AppComponent } from './app.component';
import { HeroFormComponent } from './hero-form/hero-form.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule, // 加上這個模組後，應用程式才能使用所有模版驅動表單功能，包括 ngModel
  ],
  declarations: [AppComponent, HeroFormComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
\`\`\`

## ngModel 如何做雙向綁定？

\`[(ngModel)]\` 是 Angular 的 banana-in-a-box 語法，把 input 的值跟 component 屬性雙向同步，使用者打字時 component 裡的值即時更新，反過來改 component 屬性也會反映到畫面上：

\`\`\`html
<input
  type="text"
  class="form-control"
  id="name"
  required
  [(ngModel)]="model.name"
  name="name"
/>
你所輸入的資料是：{{ model.name }}
\`\`\`

component 端只要準備好被綁定的屬性即可：

\`\`\`ts
export class HeroFormComponent {
  model = {};
}
\`\`\`

## ngModel 會附加哪些 CSS class？

\`ngModel\` 會依照 input 的互動狀態自動切換一組 class，這些 class 可以直接拿來做樣式或驗證訊息判斷：

| 狀態 | Class if true | Class if false |
| --- | --- | --- |
| 被點擊接觸過 | \`ng-touched\` | \`ng-untouched\` |
| 值被改變 | \`ng-dirty\` | \`ng-pristine\` |
| 值不符合驗證 | \`ng-valid\` | \`ng-invalid\` |

在 input 上加 \`#spy\` 這個模版參考變數，可以即時觀察 class 名稱如何隨互動變化：

\`\`\`html
<input
  type="text"
  class="form-control"
  id="name"
  required
  [(ngModel)]="model.name"
  name="name"
  #spy
/>
{{ spy.className }}
\`\`\`

## 如何顯示與隱藏驗證錯誤訊息？

要讓某個 input 支援驗證，它必須宣告 \`ngModel\`（不論有沒有做雙向綁定），或宣告 \`formControlName\` / \`formControl\` —— 沒有這三者之一，Angular 不會對這個欄位做任何驗證。

最基本的必填驗證只要加上 \`required\`：

\`\`\`html
<input name="fullName" ngModel required />
\`\`\`

如果要顯示客製化的錯誤訊息，可以把 \`ngModel\` 匯出成模版變數，因為 \`ngModel\` directive 的 [\`exportAs\`](https://angular.io/api/core/Directive) 值剛好就是 \`ngModel\`：

\`\`\`html
<label for="name">Name</label>
<input
  type="text"
  class="form-control"
  id="name"
  required
  [(ngModel)]="model.name"
  name="name"
  #name="ngModel"
/>
\`\`\`

拿到 \`#name="ngModel"\` 這個變數後，就能用 \`name.valid\`、\`name.pristine\` 判斷是否顯示錯誤：

\`\`\`html
<div [hidden]="name.valid || name.pristine" class="alert alert-danger">
  Name is required
</div>
\`\`\`

\`pristine\` 代表這個欄位還沒被使用者改變過。\`[hidden]="name.valid || name.pristine"\` 的意思是：只要欄位還沒填寫，或填寫的值合法，就不顯示錯誤訊息 —— 避免表單一載入就滿版紅字。

## Angular 內建哪些表單驗證器？

\`required\` 是最常見的驗證 directive，完整用法可以查 [RequiredValidator](https://angular.io/api/forms/RequiredValidator) 的官方文件。要注意 \`required\` 不能直接用在 checkbox 上，checkbox 必填要換一個驗證器：

- [\`CheckboxRequiredValidator\`](https://angular.io/api/forms/CheckboxRequiredValidator)：checkbox 必填驗證器
- [\`EmailValidator\`](https://angular.io/api/forms/EmailValidator)：e-mail 格式驗證器
- [\`MaxLengthValidator\`](https://angular.io/api/forms/MaxLengthValidator)：最長字元數驗證
- [\`MinLengthValidator\`](https://angular.io/api/forms/MinLengthValidator)：最短字元數驗證
- [\`PatternValidator\`](https://angular.io/api/forms/PatternValidator)：用 regular expression 驗證輸入字串
- [\`RequiredValidator\`](https://angular.io/api/forms/RequiredValidator)：非 checkbox 的必填驗證器

## 如何寫一個自訂的模版驅動表單驗證器？

內建驗證器不夠用時，可以自己寫一個實作 \`Validator\` 介面的 directive，透過 \`NG_VALIDATORS\` token 註冊進表單驗證流程：

\`\`\`ts
@Directive({
  selector: '[forbiddenName]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: ForbiddenValidatorDirective, multi: true },
  ],
})
export class ForbiddenValidatorDirective implements Validator {
  @Input() forbiddenName: string;

  validate(control: AbstractControl): { [key: string]: any } {
    return this.forbiddenName
      ? forbiddenNameValidator(new RegExp(this.forbiddenName, 'i'))(control)
      : null;
  }
}
\`\`\`

使用方式跟內建驗證器一樣，直接當 attribute 加在 input 上：

\`\`\`html
<input
  id="name"
  name="name"
  class="form-control"
  required
  minlength="2"
  forbiddenName="bob"
  [(ngModel)]="hero.name"
  #name="ngModel"
/>
<div *ngIf="name.errors.forbiddenName">Name cannot be Bob.</div>
\`\`\`

資訊增益：Angular 官網早期範例把 \`forbidden-name.directive.ts\` 的 selector 誤寫成 \`appForbiddenName\`，實際上要用 \`forbiddenName\` 才能跟上面的 attribute 對起來，這個落差已經有人回報成 [angular/angular#20206](https://github.com/angular/angular/issues/20206)。照抄官方範例卻驗證不生效時，這往往就是原因。

## ngSubmit 怎麼送出表單？

\`<form>\` 裡的 submit 按鈕按下後不會自己觸發任何事，Angular 會發出一個 \`ngSubmit\` 事件，需要自己在表單上註冊：

\`\`\`html
<form (ngSubmit)="onSubmit()" #heroForm="ngForm"></form>
\`\`\`

把整個 \`ngForm\` 存進 \`heroForm\` 這個模版變數後，就能在 submit 按鈕上讀取表單目前是否通過驗證，決定要不要讓按鈕可以按：

\`\`\`html
<button type="submit" class="btn btn-success" [disabled]="!heroForm.form.valid">
  Submit
</button>
\`\`\`

## 常見問題

### ngModel 一定要搭配雙向綁定才能驗證嗎？

不用。只要 input 上有 \`ngModel\`（單純 \`ngModel\`，不寫成 \`[(ngModel)]\`），Angular 就會把它納入表單驗證，\`formControlName\` 或 \`formControl\` 也是同樣效果。

### 為什麼我的自訂 Validator directive 完全沒作用？

先檢查 selector 名稱是否跟 input 上寫的 attribute 完全一致，這正是官方範例曾經出過的落差（見上文 [issue #20206](https://github.com/angular/angular/issues/20206)）；其次確認有把它加進 \`NG_VALIDATORS\` 並設 \`multi: true\`，否則會直接覆蓋掉其他驗證器。

### \`[hidden]="name.valid || name.pristine"\` 這種寫法要注意什麼？

它只是控制錯誤訊息何時顯示的其中一種寫法，實務上要留意 \`pristine\` 只代表「使用者還沒動過」，如果表單一開始就帶入不合法的預設值，使用者不去碰它，錯誤訊息也不會跳出來，這種情況要另外處理。

## 參考資料

- [Angular 2 Forms 介紹：Template-Driven Forms](https://jeffwu85182.github.io/2016/09/27/angular2-form-template-driven/)
- [2017-05-16 [angular2]表單的操作和驗證](https://dotblogs.com.tw/kinanson/2017/05/16/075506)
- [Angular 2 form fundamentals: template-driven forms](https://ultimatecourses.com/blog/angular-2-forms-template-driven)
- Angular API：[Directive.exportAs](https://angular.io/api/core/Directive)

## 延伸閱讀

- [Angular Reactive Forms 教學：Model-Driven Forms 的驗證、FormBuilder 與 FormArray](/post/angular-reactive-forms)：同樣聚焦 Angular、TypeScript，可接著比較不同情境的做法。
- [Angular Reactive Forms 完整教學：Model-Driven Forms 表單驗證實戰](/post/angular-reactive-forms)：同樣聚焦 Angular，可接著比較不同情境的做法。
- [建立一個 Angular 5 的專案](/post/angular-cli-new-project-setup)：同樣聚焦 Angular、TypeScript，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2026-08-28。原文發布於 2018-01-04，內容保留原始的模版驅動表單教學與自訂驗證器範例，並重新整理為 GEO 適用的問答式段落。

`;export{e as default};