import {Component, HostBinding, OnInit} from "@angular/core";
import {environment} from "../environments/environment";
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {CuiHeaderOptions} from '@cisco-ngx/cui-components';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'fin-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @HostBinding('@.disabled') animationsDisabled = environment.disableAnimations;
  @HostBinding('class.notransition') transitionDisabled = environment.disableAnimations;
  title = 'fin-dfa';

  constructor(private titleService: Title) {
  }

  public ngOnInit() {
    this.titleService.setTitle('FIN-DFA')
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
