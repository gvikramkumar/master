import {AfterViewInit, Component, HostBinding, OnInit, ViewChild} from "@angular/core";
import {environment} from "../environments/environment";
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {CuiHeaderOptions, CuiToastComponent} from '@cisco-ngx/cui-components';
import {Title} from '@angular/platform-browser';
import {Store} from './store/store';

@Component({
  selector: 'fin-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  @HostBinding('@.disabled') animationsDisabled = environment.disableAnimations;
  @HostBinding('class.notransition') transitionDisabled = environment.disableAnimations;
  title = 'fin-dfa';
  @ViewChild(CuiToastComponent) toast: CuiToastComponent;

  constructor(private titleService: Title, private store: Store) {
  }

  public ngOnInit() {
    this.titleService.setTitle('FIN-DFA')
  }

  public ngAfterViewInit() {
    this.store.toast = this.toast;
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
