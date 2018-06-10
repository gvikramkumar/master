import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {SpinnerInterceptor} from "./interceptors/spinner.interceptor";
import {TimingInterceptor} from "./interceptors/timing.interceptor";
import {ErrorInterceptor} from "./interceptors/error.interceptor";
import {Init1, Init2, Init3, Init4, Init5} from "./services/test-init-service";
import {ModifyRequestInterceptor} from "./interceptors/modify-request.interceptor";
import {InitializationGuard} from "./guards/initialization.guard";
import {RouterModule} from "@angular/router";
import {BreakpointService} from "./services/breakpoint.service";
import {ModuleService} from './services/module.service';
import {RuleService} from '../profitability/services/rule.service';
import {SubmeasureService} from './services/submeasure.service';
import {TestService} from './services/test.service';
import {FsFileService} from './services/fsfile.service';
import {AuthorizationGuard} from './guards/authorization.guard';
import {ToastService} from './services/toast.service';
import {UtilService} from './services/util.service';
import {MeasureService} from "./services/measure.service";
import {DollarUploadService} from '../profitability/services/dollar-upload.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule
  ],
  exports: [
    HttpClientModule
  ],
  providers: [InitializationGuard, Init1, Init2, Init3, Init4, Init5,
    {provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: TimingInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ModifyRequestInterceptor, multi: true},
    BreakpointService, ModuleService, RuleService, SubmeasureService, TestService,
    FsFileService, AuthorizationGuard, ToastService, UtilService, MeasureService
  ]
})
export class CoreModule {
}
