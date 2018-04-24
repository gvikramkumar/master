import {Component, OnInit} from '@angular/core';
import {CuiHeaderOptions} from '@cisco-ngx/cui-components';
import {Store} from '../../store/store';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';

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
    this.headerOptions = this.store.headerOptions;

    this.store.routeDataSub(data => {
        console.log('data>>>>', data);
        this.hero = data.hero;
        this.headerOptions.breadcrumbs = data.breadcrumbs;
      })
  }

}
