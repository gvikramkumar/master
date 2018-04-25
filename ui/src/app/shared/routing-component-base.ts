import {ActivatedRoute} from '@angular/router';
import {Store} from '../store/store';

  export class RoutingComponentBase {

  constructor(store: Store, route: ActivatedRoute) {
    store.routeDataPub(route.snapshot.data);
  }
}
