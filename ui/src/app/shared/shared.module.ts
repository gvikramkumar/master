import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {PageNotFoundComponent} from './components/page-not-found/page-not-found.component';
import {ForbiddenNameValidator} from './validators/forbidden-name.validator';
import {MinValidator} from './validators/min.validator';
import {MaxValidator} from './validators/max.validator';
import {MaterialIndexModule} from './indexes/material-index.module';
import {ErrorModalComponent} from './dialogs/error-modal/error-modal.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {NotImplementedComponent} from './dialogs/not-implemented/not-implemented.component';
import {TrimInputValueAccessor} from './accessors/trim-input-value.accessor';
import {RouterModule} from '@angular/router';
import {CoreModule} from '../core/core.module';
import {HomeComponent} from './components/home';
import {MainComponent} from './components/main/main.component';
import {AuthDirective} from './directives/auth.directive';
import { LeftnavComponent } from './components/leftnav/leftnav.component';
import {CuiIndexModule} from './indexes/cui-index.module';
import { TestComponent } from './components/test/test/test.component';
import { GenericDialogComponent } from './dialogs/generic-dialog/generic-dialog.component';
import { PromptDialogComponent } from './dialogs/prompt-dialog/prompt-dialog.component';
import { RuleDetailDialogComponent } from '../modules/_common/dialogs/rule-detail-dialog/rule-detail-dialog.component';
import { SubmeasureDetailDialogComponent } from '../modules/_common/dialogs/submeasure-detail-dialog/submeasure-detail-dialog.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import {SwitchComponent} from './components/switch/switch.component';
import { TestValidationComponent } from './components/test/test-validation/test-validation.component';
import {NotInListValidator} from './validators/not-in-list.validator';
import {AsyncNotInListValidator} from './validators/async-not-in-list.validator';
import { ErrorFlashDirective } from './directives/error-flash.directive';
import { ValidationInputComponent } from './components/validation-input/validation-input.component';
import {InListValidator} from './validators/in-list.validator';
import {NumberValidator} from './validators/number.validator';
import {AuthDisableDirective} from './directives/auth-disable.directive';
import {AuthOnlyDirective} from './directives/auth-only.directive';
// import {CuiSelectModule} from './components/cui-select/cui-select.module';
// import {CuiMultiselectModule} from './components/cui-multiselect/cui-multiselect.module';
import {ProgressComponent} from './components/progress/progress.component';
import { StatusChoiceComponent } from './components/status-choice/status-choice.component';
import { TestSelectsComponent } from './components/test/test-selects/test-selects.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';

@NgModule({
  imports: [
    CoreModule,
    CommonModule,
    RouterModule,
    MaterialIndexModule,
    CuiIndexModule,
    // FlexLayoutModule.withConfig({disableDefaultBps: true}), // causing this jenkins error currently (7/12/18)
    // ERROR in Error during template compile of 'SharedModule'
    //   Function calls are not supported in decorators but 'FlexLayoutModule' was called.
    //     FlexLayoutModule.withConfig({disableDefaultBps: true}),
    FlexLayoutModule,
    FormsModule,
    // CuiSelectModule,
    // CuiMultiselectModule,
  ],
  exports: [
    CoreModule,
    MaterialIndexModule,
    CuiIndexModule,
    FlexLayoutModule,
    FormsModule,
    PageNotFoundComponent,
    ForbiddenNameValidator,
    MinValidator,
    MaxValidator,
    ErrorModalComponent,
    NotImplementedComponent,
    TrimInputValueAccessor,
    AuthDirective,
    TestComponent,
    CheckboxComponent,
    SwitchComponent,
    TestValidationComponent,
    NotInListValidator,
    InListValidator,
    AsyncNotInListValidator,
    ErrorFlashDirective,
    ValidationInputComponent,
    NumberValidator,
    AuthDisableDirective,
    AuthOnlyDirective,
    ProgressComponent,
    StatusChoiceComponent,
    TestSelectsComponent,
    SafeHtmlPipe,
    // CuiSelectModule,
    // CuiMultiselectModule,
  ],

  declarations: [
    PageNotFoundComponent,
    ForbiddenNameValidator,
    MinValidator,
    MaxValidator,
    ErrorModalComponent,
    NotImplementedComponent,
    TrimInputValueAccessor,
    HomeComponent,
    MainComponent,
    AuthDirective,
    LeftnavComponent,
    TestComponent,
    GenericDialogComponent,
    PromptDialogComponent,
    RuleDetailDialogComponent,
    SubmeasureDetailDialogComponent,
    CheckboxComponent,
    SwitchComponent,
    TestValidationComponent,
    NotInListValidator,
    InListValidator,
    AsyncNotInListValidator,
    ErrorFlashDirective,
    ValidationInputComponent,
    NumberValidator,
    AuthDisableDirective,
    AuthOnlyDirective,
    ProgressComponent,
    StatusChoiceComponent,
    TestSelectsComponent,
    SafeHtmlPipe,
  ],
  entryComponents: [
    ErrorModalComponent,
    NotImplementedComponent,
    GenericDialogComponent,
    PromptDialogComponent,
    RuleDetailDialogComponent,
    SubmeasureDetailDialogComponent
  ]
})
export class SharedModule {
}
