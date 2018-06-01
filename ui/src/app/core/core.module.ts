import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ProgressService} from "./services/common/progress.service";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {SpinnerInterceptor} from "./interceptors/spinner.interceptor";
import {TimingInterceptor} from "./interceptors/timing.interceptor";
import {ErrorInterceptor} from "./interceptors/error.interceptor";
import {Init1, Init2, Init3, Init4, Init5} from "./services/common/test-init-service";
import {ModifyRequestInterceptor} from "./interceptors/modify-request.interceptor";
import {InitializationGuard} from "./guards/initialization.guard";
import {RouterModule} from "@angular/router";
import {BreakpointService} from "./services/common/breakpoint.service";
import {ModuleService} from './services/common/module.service';
import {RuleService} from '../profitability/services/rule.service';
import {SubmeasureService} from '../profitability/services/submeasure.service';
import {TestService} from './services/common/test.service';
import {FsFileService} from './services/common/fsfile.service';
import {AuthorizationGuard} from './guards/authorization.guard';
import {ToastService} from './services/common/toast.service';
import {UtilService} from './services/common/util';
import {MeasureService} from "../profitability/services/measure.service";

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule
  ],
  exports: [
    HttpClientModule
  ],
  providers: [InitializationGuard, Init1, Init2, Init3, Init4, Init5, ProgressService,
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
