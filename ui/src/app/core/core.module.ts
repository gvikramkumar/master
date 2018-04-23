import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {Store} from "../store/store";
import {ProgressService} from "./services/common/progress.service";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {SpinnerInterceptor} from "./interceptors/spinner.interceptor";
import {TimingInterceptor} from "./interceptors/timing.interceptor";
import {ErrorInterceptor} from "./interceptors/error.interceptor";
import {Init1, Init2, Init3, Init4, Init5} from "./services/common/init-service";
import {ModifyRequestInterceptor} from "./interceptors/modify-request.interceptor";
import {InitializationGuard} from "../routing/guards/initialization.guard";
import {RouterModule} from "@angular/router";
import {StoreModule} from "../store/store.module";
import {BreakpointService} from "./services/common/breakpoint.service";
import {ModuleService} from './services/common/module.service';
import {RuleService} from './services/profitability/rule.service';
import {SubmeasureService} from './services/profitability/submeasure.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    StoreModule
  ],
  exports: [HttpClientModule, StoreModule],
  providers: [Store, Init1, Init2, Init3, Init4, Init5, ProgressService,
    {provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: TimingInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ModifyRequestInterceptor, multi: true},
    BreakpointService, ModuleService, RuleService, SubmeasureService

  ]
})
export class CoreModule {
}
