import {Component, HostBinding, OnInit} from "@angular/core";
import {environment} from "../environments/environment";
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {CuiHeaderOptions} from '@cisco-ngx/cui-components';

@Component({
  selector: 'fin-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @HostBinding('@.disabled') animationsDisabled = environment.disableAnimations;
  @HostBinding('class.notransition') transitionDisabled = environment.disableAnimations;
  title = 'fin-dfa';


  constructor(router: Router) {
    //handle breadcrumbs (navigation labels)
    //todo: make this work for all scenarios (currently hardcoded)
    router.events.forEach((event) => {
      if(event instanceof NavigationStart) {
      }
      else if(event instanceof NavigationEnd) {
        if (router.url=="/profitability/submeasure") {
          this.headerOptions.breadcrumbs = [
            {
              "label": "Home",
              "url": "dfa"
            },
            {
              "label": "Profitability",
            },
            {
              "label": "Sub-Measure",
              //"url": "submeasure"
            }];
        }
        else if (router.url=="/profitability/rule_management") {
          this.headerOptions.breadcrumbs = [
            {
              "label": "Home",
              "url": "dfa"
            },
            {
              "label": "Profitability",
            },
            {
              "label": "Rule Management",
              //"url": "rule_management"
            }];
        }
        else if (router.url=="/profitability/submeasure/upload") {
          this.headerOptions.breadcrumbs = [
            {
              "label": "Home",
              "url": "dfa"
            },
            {
              "label": "Profitability",
            },
            {
              "label": "Sub-Measure",
              "url": "profitability/submeasure"
            },
            {
              "label": "Upload"
            }];
        }
        else if (router.url=="/profitability/submeasure/addnew") {
          this.headerOptions.breadcrumbs = [
            {
              "label": "Home",
              "url": "dfa"
            },
            {
              "label": "Profitability",
            },
            {
              "label": "Sub-Measure",
              "url": "profitability/submeasure"
            },
            {
              "label": "Add New"
            }];
        }
        else if (router.url=="/profitability/rule_management/create") {
          this.headerOptions.breadcrumbs = [
            {
              "label": "Home",
              "url": "/"
            },
            {
              "label": "Profitability",
            },
            {
              "label": "Rule Management",
              "url": "profitability/rule_management"
            },
            {
              "label": "Create"
            }];
        }
        else if (router.url=="/profitability/rule_management/assign") {
          this.headerOptions.breadcrumbs = [
            {
              "label": "Home",
              "url": "dfa"
            },
            {
              "label": "Profitability",
            },
            {
              "label": "Rule Management",
              "url": "profitability/rule-management"
            },
            {
              "label": "Assign"
            }];
        }
        else if (router.url=="/profitability/rule_management/update/:id") {
          this.headerOptions.breadcrumbs = [
            {
              "label": "Home",
              "url": "dfa"
            },
            {
              "label": "Profitability",
            },
            {
              "label": "Rule Management",
              "url": "profitability/rule-management"
            },
            {
              "label": "Update"
            }];
        }
      }
    });
  }

  public ngOnInit() {
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
