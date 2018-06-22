import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AllocationRule} from '../../store/models/allocation-rule';
import {RuleService} from '../../services/rule.service';
import {Observable, of} from 'rxjs';
import {RoutingComponentBase} from '../../../shared/routing-component-base';
import {Store} from '../../../store/store';

@Component({
  selector: 'fin-rule-management-create',
  templateUrl: './rule-management-edit.component.html',
  styleUrls: ['./rule-management-edit.component.scss']
})
export class RuleManagementEditComponent extends RoutingComponentBase implements OnInit {
  editMode = false;
  rule: AllocationRule = new AllocationRule();
  title: string = "";
  periodSelection: number = 0;
  driverSelection: number = 0;
  salesMatch: number = 0;
  productMatch: number = 0;
  scmsMatch: number = 0;
  legalMatch: number = 0;
  beMatch: number = 0;

  sl1Select: string = "";
  scmsSelect: string = "";
  beSelect: string = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ruleService: RuleService,
    private store: Store
  ) {
    super(store, route);
    this.editMode = !!this.route.snapshot.params.id;
  }

  public ngOnInit(): void {
    if (this.editMode) {
      this.title = 'Edit Rule';
      this.ruleService.getOneById(this.route.snapshot.params.id)
        .subscribe(rule => {
          this.rule = rule;
          this.driverSelection = this.rule.driverName? this.driverNamesMap[this.rule.driverName]: '';
          this.periodSelection = this.rule.period? this.periodNamesMap[this.rule.period]: '';
          this.salesMatch = this.rule.salesMatch? this.salesLevelsMap[this.rule.salesMatch]: '';
          this.productMatch = this.rule.productMatch? this.productLevelsMap[this.rule.productMatch]: '';
          this.scmsMatch = this.rule.scmsMatch? this.scmsLevelsMap[this.rule.scmsMatch]: '';
          this.legalMatch = this.rule.legalEntityMatch? this.legalLevelsMap[this.rule.legalEntityMatch]: '';
          this.beMatch = this.rule.beMatch? this.beLevelsMap[this.rule.beMatch]: '';
          this.sl1Select = this.rule.sl1Select;
          this.scmsSelect = this.rule.scmsSelect;
          this.beSelect = this.rule.beSelect;
          this.formChange();
        });
    } else {
      this.title = 'Create Rule';
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
    if(this.periodSelection && this.driverPeriods[this.periodSelection-1].name != null) {
      this.rule.period = this.driverPeriods[this.periodSelection-1].name;
    }
    else {
      this.rule.period = "";
    }
    if(this.driverSelection && this.driverNamesAbbrev[this.driverSelection-1] != null) {
      this.rule.driverName = this.driverNamesAbbrev[this.driverSelection-1];
    }
    else {
      this.rule.driverName = "";
    }
    if(this.salesMatch && this.salesLevels[this.salesMatch-1].name != null) {
      this.rule.salesMatch = this.salesLevels[this.salesMatch-1].name;
    }
    else {
      this.rule.salesMatch = "";
    }
    if (this.productMatch && this.productLevels[this.productMatch-1].name != null) {
      this.rule.productMatch = this.productLevels[this.productMatch-1].name;
    }
    else {
      this.rule.productMatch = "";
    }
    if (this.scmsMatch && this.scmsLevels[this.scmsMatch-1].name != null) {
      this.rule.scmsMatch = this.scmsLevels[this.scmsMatch-1].name;
    }
    else {
      this.rule.scmsMatch = "";
    }
    if (this.legalMatch && this.legalEntityLevels[this.legalMatch-1].name != null) {
      this.rule.legalEntityMatch = this.legalEntityLevels[this.legalMatch-1].name;
    }
    else {
      this.rule.legalEntityMatch = "";
    }
    if (this.beMatch && this.ibeLevels[this.beMatch-1].name != null) {
      this.rule.beMatch = this.ibeLevels[this.beMatch-1].name;
    }
    else {
      this.rule.beMatch = "";
    }

    if (this.sl1Select.length > 0) {
      this.rule.sl1Select = this.sl1Select;
    }
    else {
      this.rule.sl1Select = "";
    }
    if (this.scmsSelect.length > 0) {
      this.rule.scmsSelect = this.scmsSelect;
    }
    else {
      this.rule.scmsSelect = "";
    }
    if (this. beSelect.length > 0) {
      this.rule.beSelect = this.beSelect;
    }
    else {
      this.rule.beSelect = "";
    }
  }

  public save() {
    this.formChange();

    this.validate()
      .subscribe(valid => {
        if (valid) {
          this.ruleService.add(this.rule)
            .subscribe(rule => this.router.navigateByUrl('/prof/rule-management'));
        }
      })
  }

  validate(): Observable<boolean> {
    //todo: need to search for rule name duplicity on add only
    let obs: Observable<AllocationRule>;
    if (this.editMode) {
      return of(true);
    } else {
      //todo: validate name doesn't exist already. Could be done with an ngModel validator realtime if rules cached
      // otherwise hit server here
      // check for fule name existence in store (if cached rules) or hit the server (why it's observable)
      return of(true);
    }
  }
}
