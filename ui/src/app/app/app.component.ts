import {AfterViewInit, Component, HostBinding, OnInit, ViewChild} from "@angular/core";
import {environment} from "../../environments/environment";
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {CuiHeaderOptions, CuiToastComponent} from '@cisco-ngx/cui-components';
import {Title} from '@angular/platform-browser';
import {AppStore} from './app-store';
import {ToastService} from '../core/services/toast.service';

@Component({
  selector: 'fin-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  @HostBinding('@.disabled') animationsDisabled = environment.disableAnimations;
  @HostBinding('class.notransition') transitionDisabled = environment.disableAnimations;
  title = 'fin-dfa';
  @ViewChild('permToast') permToast: CuiToastComponent;
  @ViewChild('autoHideToast') autoHideToast: CuiToastComponent;

  constructor(private titleService: Title, public store: AppStore, private toastService: ToastService) {
  }

  public ngOnInit() {
    this.titleService.setTitle('FIN-DFA')
  }

  public ngAfterViewInit() {
    this.toastService.permToast = this.permToast;
    this.toastService.autoHideToast = this.autoHideToast;
  }

  headerOptions = new CuiHeaderOptions({
    "showBrandingLogo": true,
    "brandingLink": "https://cisco.com",
    "brandingTitle": "",
    "showMobileNav": true,
    "title": "Digitized Financial Allocations",
    "breadcrumbs": [
      {
        "label": "Home",
        "url": "dfa"
      }
    ],
    "username": "Maryellen Oltman",
  });

}
