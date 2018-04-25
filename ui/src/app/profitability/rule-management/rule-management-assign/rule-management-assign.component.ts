import { Component, OnInit } from '@angular/core';
import {RoutingComponentBase} from '../../../shared/routing-component-base';
import {ActivatedRoute} from '@angular/router';
import {Store} from '../../../store/store';

@Component({
  selector: 'fin-rule-management-assign',
  templateUrl: './rule-management-assign.component.html',
  styleUrls: ['./rule-management-assign.component.scss']
})
export class RuleManagementAssignComponent extends RoutingComponentBase implements OnInit {

  constructor(private store: Store, private route: ActivatedRoute) {
    super(store, route);
  }

  ngOnInit() {
  }

  subMeasureNameSelected() {
    //Actions for when submeasure name is selected
  }

  ruleNameSelected() {
    //Actions for when rule name is selected
  }

 subMeasureNames = [
    {
      "name": "2 TIER CONTRA",
      "value": 1,
      "selected":null
    },
    {
      "name": "2 TIER RMA",
      "value": 2,
      "selected":null
    },
    {
      "name": "ADMIN AND OTHER",
      "value": 3,
      "selected":null
    },
    {
      "name": "LEASE RESERVES",
      "value": 4,
      "selected":null
    },
    {
      "name": "DIRECT BU PPV",
      "value": 5,
      "selected":null
    },
    {
      "name": "PARTNER LEASING",
      "value": 6,
      "selected":null
    }
  ]

ruleNames = [
    {
      "name": "SHIP-SL2-ROLL3",
      "value": 1,
      "selected":null
    },
    {
      "name": "SHIP-SL1-NOWWWEST-ROLL2",
      "value": 2,
      "selected":null
    },
    {
      "name": "SERVMAP-PL3BE-MTD",
      "value": 3,
      "selected":null
    },
    {
      "name": "SHIPREV-SL6-SCMS-ROLL3",
      "value": 4,
      "selected":null
    },
    {
      "name": "MANUALMAP-PL3SL6-PERCEN",
      "value": 5,
      "selected":null
    },
    {
      "name": "SHIP-SL3-ROLL1",
      "value": 6,
      "selected":null
    }
  ]

}
