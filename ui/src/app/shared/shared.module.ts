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
import { TestComponent } from './components/test/test.component';

@NgModule({
  imports: [
    CoreModule,
    CommonModule,
    RouterModule,
    MaterialIndexModule,
    CuiIndexModule,
    FlexLayoutModule.withConfig({disableDefaultBps: true}),
    FormsModule,
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
    TestComponent
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
    TestComponent
  ],
  entryComponents: [
    ErrorModalComponent,
    NotImplementedComponent
  ]
})
export class SharedModule {
}
