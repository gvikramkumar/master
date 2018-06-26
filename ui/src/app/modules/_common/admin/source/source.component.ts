import { Component, OnInit } from '@angular/core';
import {AppStore} from '../../../../app/app-store';
import {ActivatedRoute} from '@angular/router';
import {RoutingComponentBase} from '../../../../shared/routing-component-base';

@Component({
  selector: 'fin-source',
  templateUrl: './source.component.html',
  styleUrls: ['./source.component.scss']
})
export class SourceComponent extends RoutingComponentBase {

  constructor(
    private store: AppStore,
    private route: ActivatedRoute
  ) {
    super(store, route);

  }

}
