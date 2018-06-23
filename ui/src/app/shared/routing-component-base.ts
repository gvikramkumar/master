import {ActivatedRoute} from '@angular/router';
import {AppStore} from '../app/app-store';
import {MainComponent} from './components/main/main.component';

  export class RoutingComponentBase {

  constructor(store: AppStore, route: ActivatedRoute) {
    store.routeDataPub(route.snapshot.data);
  }

/*
  ngOnInit() {
    const p = this.parent;
  }
*/
}
