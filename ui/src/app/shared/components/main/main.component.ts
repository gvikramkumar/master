import {Component, OnInit} from '@angular/core';
import {CuiHeaderOptions} from '@cisco-ngx/cui-components';
import {AppStore} from '../../../app/app-store';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'fin-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  hero: { title: string, desc: string } = {title: '', desc: ''};
  headerOptions;

  constructor(public store: AppStore, private router: Router, route: ActivatedRoute) {
    store.updateModule(route.snapshot.data.module);
  }

  ngOnInit() {
    this.headerOptions = _.clone(this.store.headerOptions);
    this.store.routeDataSub(data => {
        this.hero = data.hero;
        this.headerOptions.breadcrumbs = data.breadcrumbs;
      });
  }

}
