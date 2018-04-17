import { Component, OnInit } from '@angular/core';
import {CuiHeaderOptions} from '@cisco-ngx/cui-components';

@Component({
  selector: 'fin-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  // todo: same as home page or different. If same, then share
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

  constructor() { }

  ngOnInit() {
  }

}
