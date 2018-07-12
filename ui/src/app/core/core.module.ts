import {Inject, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {SpinnerInterceptor} from './interceptors/spinner.interceptor';
import {TimingInterceptor} from './interceptors/timing.interceptor';
import {ErrorInterceptor} from './interceptors/error.interceptor';
import {ModifyRequestInterceptor} from './interceptors/modify-request.interceptor';
import {RouterModule} from '@angular/router';
import {BREAKPOINTS} from '@angular/flex-layout';
import {FIN_DEFAULT_BREAKPOINTS} from './services/default-breakpoints';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule
  ],
  exports: [
    HttpClientModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: TimingInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ModifyRequestInterceptor, multi: true},
    {provide : BREAKPOINTS, useValue: FIN_DEFAULT_BREAKPOINTS}
  ]
})
export class CoreModule {
  constructor(@Inject(BREAKPOINTS) breakpoints) {
  }
}
