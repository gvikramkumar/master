import {Component, OnInit} from '@angular/core';
import {CuiHeaderOptions} from '@cisco-ngx/cui-components';
import {Store} from '../../../store/store';
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

  constructor(private store: Store, private router: Router) {
    const i = 5;
  }

  ngOnInit() {
    this.headerOptions = _.clone(this.store.headerOptionsBase);
    this.store.routeDataSub(data => {
        this.hero = data.hero;
        this.headerOptions.breadcrumbs = data.breadcrumbs;
      })
  }

}
