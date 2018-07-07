import { Component, OnInit } from '@angular/core';
import {RoutingComponentBase} from '../../../core/base-classes/routing-component-base';
import {AppStore} from '../../../app/app-store';
import {ActivatedRoute} from '@angular/router';
import {RuleService} from '../../_common/services/rule.service';

@Component({
  selector: 'fin-open-period',
  templateUrl: './open-period.component.html',
  styleUrls: ['./open-period.component.scss']
})
export class OpenPeriodComponent  extends RoutingComponentBase {

  constructor(
    private store: AppStore,
    private route: ActivatedRoute
  ) {
    super(store, route);

  }


}
