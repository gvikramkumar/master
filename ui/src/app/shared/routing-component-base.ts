import {ActivatedRoute} from '@angular/router';
import {AppStore} from '../app/app-store';

  export class RoutingComponentBase {

  constructor(store: AppStore, route: ActivatedRoute) {
    store.routeDataPub(route.snapshot.data);
  }
}
