import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {PageNotFoundComponent} from './components/page-not-found/page-not-found.component';
import {ForbiddenNameValidator} from './validators/forbidden-name.validator';
import {MinValidator} from './validators/min.validator';
import {MaxValidator} from './validators/max.validator';
import {MaterialIndexModule} from './material-index/material-index.module';
import {ProgressComponent} from './components/progress/progress.component';
import {ErrorModalComponent} from './dialogs/error-modal/error-modal.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {NotImplementedComponent} from './dialogs/not-implemented/not-implemented.component';
import {TrimInputValueAccessor} from './accessors/trim-input-value.accessor';
import {CuiIndexModule} from "./cui-index/cui-index.module";
import {SidebarModule} from 'ng-sidebar';
import {RouterModule} from '@angular/router';
import {CoreModule} from '../core/core.module';
import {HomeComponent} from './components/home';
import {MainComponent} from './components/main/main.component';
import {AuthShowDirective} from './directives/auth-show.directive';
import {AuthHideDirective} from './directives/auth-hide.directive';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialIndexModule,
    CuiIndexModule,
    FlexLayoutModule,
    FormsModule,
    SidebarModule.forRoot(),
    CoreModule
  ],
  exports: [
    CoreModule,
    MaterialIndexModule,
    CuiIndexModule,
    FlexLayoutModule,
    FormsModule,
    SidebarModule,
    PageNotFoundComponent,
    ForbiddenNameValidator,
    MinValidator,
    MaxValidator,
    ProgressComponent,
    ErrorModalComponent,
    NotImplementedComponent,
    TrimInputValueAccessor,
    AuthShowDirective,
    AuthHideDirective
  ],

  declarations: [
    PageNotFoundComponent,
    ForbiddenNameValidator,
    MinValidator,
    MaxValidator,
    ProgressComponent,
    ErrorModalComponent,
    NotImplementedComponent,
    TrimInputValueAccessor,
    HomeComponent,
    MainComponent,
    AuthShowDirective,
    AuthHideDirective
  ],
  entryComponents: [
    ErrorModalComponent,
    NotImplementedComponent
  ]
})
export class SharedModule {
}
