import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Apollo } from 'apollo-angular';
import {AllocationRule} from '../../store/models/allocation-rule';
import {RuleService} from '../../../core/services/pft/rule.service';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'fin-rule-management-create',
  templateUrl: './rule-management-create.component.html',
  styleUrls: ['./rule-management-create.component.scss']
})
export class RuleManagementCreateComponent implements OnInit {
  rule: AllocationRule = <AllocationRule>{};
  title: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apollo: Apollo,
    private ruleService: RuleService
  ) {
    this.addMode = this.route.snapshot.data.mode === 'add';
  }

  public ngOnInit(): void {
    if (this.addMode) {
      this.title = 'Create Rule';
    } else {
      this.title = 'Edit Rule';
      this.ruleService.getOne(this.route.snapshot.params.id)
        .subscribe(rule => {
          this.rule = rule;
          this.formChange();
        });

      // load from routing params id
    }
  }

  driverNamesAbbrev = ['GLREVMIX', 'MANUALMAP', 'REVPOS', 'SERVMAP', 'SHIPMENT', 'SHIPREV', 'VIP'];
  driverNamesMap: {[key: string]: any} = {
    'GLREVMIX':1,
    'MANUALMAP':2,
    'REVPOS':3,
    'SERVMAP':4,
    'SHIPMENT':5,
    'SHIPREV':6,
    'VIP':7
  }

  periodNamesMap: {[key: string]: any} = {
    'MTD':1,
    'ROLL6':2,
    'ROLL3':3
  }

  salesLevelsMap: {[key: string]: any} = {
    'SL1':1,
    'SL2':2,
    'SL3':3,
    'SL4':4,
    'SL5':5,
    'SL6':6
  }
  productLevelsMap: {[key: string]: any} = {
    'BU':1,
    'PF':2,
    'TG':3,
    'PID':4
  }
  scmsLevelsMap: {[key: string]: any} = {
    'SCMS':1
  }
  legalLevelsMap: {[key: string]: any} = {
    'Business Entity':1
  }
  beLevelsMap: {[key: string]: any} = {
    'BE':1,
    'Sub BE':2
  }

  periodSelection: number;
  driverSelection: number;
  addMode = false;
  salesMatch: number;
  productMatch: number;
  scmsMatch: number;
  legalMatch: number;
  beMatch: number;

  driverNames = [
    {
      "name": "GL Revenue Mix", //GLREVMIX
      "value": 1,
      "selected":null
    },
    {
      "name": "Manual Mapping", //MANUALMAP
      "value": 2,
      "selected":null
    },
    {
      "name": "POS Revenue", //REVPOS
      "value": 3,
      "selected":null
    },
    {
      "name": "Service Map", //SERVMAP
      "value": 4,
      "selected":null
    },
    {
      "name": "Shipment", //SHIPMENT
      "value": 5,
      "selected":null
    },
    {
      "name": "Shipped Revenue", //SHIPREV
      "value": 6,
      "selected":null
    },
    {
      "name": "VIP Rebates", //VIP
      "value": 7,
      "selected":null
    }
  ]

  driverPeriods = [
    {
      "name": "MTD",
      "value": 1,
      "selected":null
    },
    {
      "name": "ROLL6",
      "value": 2,
      "selected":null
    },
    {
      "name": "ROLL3",
      "value": 3,
      "selected":null
    }
  ]

  salesLevels = [
    {
      "name": "SL1",
      "value": 1,
      "selected":null
    },
    {
      "name": "SL2",
      "value": 2,
      "selected":null
    },
    {
      "name": "SL3",
      "value": 3,
      "selected":null
    },
    {
      "name": "SL4",
      "value": 4,
      "selected":null
    },
    {
      "name": "SL5",
      "value": 5,
      "selected":null
    },
    {
      "name": "SL6",
      "value": 6,
      "selected":null
    }
  ]

  productLevels = [
    {
      "name": "BU",
      "value": 1,
      "selected":null
    },
    {
      "name": "PF",
      "value": 2,
      "selected":null
    },
    {
      "name": "TG",
      "value": 3,
      "selected":null
    },
    {
      "name": "PID",
      "value": 4,
      "selected":null
    }
  ]

  scmsLevels = [
    {
      "name": "SCMS",
      "value": 1,
      "selected":null
    }
  ]

  legalEntityLevels = [
    {
      "name": "Business Entity",
      "value": 1,
      "selected":null
    }
  ]

  ibeLevels = [
    {
      "name": "BE",
      "value": 1,
      "selected":null
    },
    {
      "name": "Sub BE",
      "value": 2,
      "selected":null
    }
  ]

/*   salesSelectionCriteria: string = "";
  productSelectionCriteria: string = "";
  scmsSelectionCriteria: string;
  legalSelectionCriteria: string;
  internalSelectionCriteria: string; */


  formChange() {
    //logic here for form change
    if(this.periodSelection && this.driverPeriods[this.periodSelection-1].name != null) {
      this.rule.period = this.driverPeriods[this.periodSelection-1].name;
    }
    if(this.driverSelection && this.driverNamesAbbrev[this.driverSelection-1] != null) {
      this.rule.driverName = this.driverNamesAbbrev[this.driverSelection-1];
    }
    if(this.salesMatch && this.salesLevels[this.salesMatch-1].name != null) {
      this.rule.salesMatch = this.salesLevels[this.salesMatch-1].name;
    }
    if (this.productMatch && this.productLevels[this.productMatch-1].name != null) {
      this.rule.productMatch = this.productLevels[this.productMatch-1].name;
    }
    if (this.scmsMatch && this.scmsLevels[this.scmsMatch-1].name != null) {
      this.rule.scmsMatch = this.scmsLevels[this.scmsMatch-1].name;
    }
    if (this.legalMatch && this.legalEntityLevels[this.legalMatch-1].name != null) {
      this.rule.legalEntityMatch = this.legalEntityLevels[this.legalMatch-1].name;
    }
    if (this.beMatch && this.ibeLevels[this.beMatch-1].name != null) {
      this.rule.beMatch = this.ibeLevels[this.beMatch-1].name;
    }
  }

  public save() {
    // if (!this.form.valid) //todo: isn't this needed? where's the validation enforced?
    //   return;

    let obs: Observable<AllocationRule>;
    if (this.addMode) {
      obs = this.ruleService.add(this.rule);
    } else {
      obs = this.ruleService.update(this.rule)
    }
    obs.subscribe(rule => this.router.navigate(['/pft/rule_management']));



  }

}
