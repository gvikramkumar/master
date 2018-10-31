import {AfterViewInit, Component, HostBinding, OnInit, ViewChild} from '@angular/core';
import {environment} from '../../environments/environment';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {CuiHeaderOptions, CuiToastComponent} from '@cisco-ngx/cui-components';
import {Title} from '@angular/platform-browser';
import {AppStore} from './app-store';
import * as _ from 'lodash';
import {UiUtil} from '../core/services/ui-util';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';

@Component({
  selector: 'fin-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}]
})
export class AppComponent implements OnInit, AfterViewInit {
  @HostBinding('@.disabled') animationsDisabled = environment.disableAnimations;
  @HostBinding('class.notransition') transitionDisabled = environment.disableAnimations;
  title = 'fin-dfa';
  @ViewChild('permToast') permToast: CuiToastComponent;
  @ViewChild('autoHideToast') autoHideToast: CuiToastComponent;

  constructor(
    private titleService: Title,
    public store: AppStore,
    private uiUtil: UiUtil,
    private location: Location
  ) {
    this.store.location = location;
  }

  public ngOnInit() {
    this.titleService.setTitle('FIN-DFA');
    this.store.routeDataSub(data => {
      this.store.headerOptions = _.clone(this.store.headerOptions);
      this.store.headerOptions.breadcrumbs = data.breadcrumbs;
    });
  }

  public ngAfterViewInit() {
/* cui toast
    this.toastService.permToast = this.permToast;
    this.toastService.autoHideToast = this.autoHideToast;
*/
  }

}
