import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {RuleService} from '../../services/rule.service';
import {FormControl} from '@angular/forms';
import {Subject, Subscription} from 'rxjs';
import {AllocationRule} from '../../../../../../../shared/models/allocation-rule';
import * as moment from 'moment';
import {ActivatedRoute} from '@angular/router';
import {AppStore} from '../../../../app/app-store';
import {RoutingComponentBase} from '../../../../core/base-classes/routing-component-base';
import * as _ from 'lodash';
import {debounceTime} from 'rxjs/operators';
import {UiUtil} from '../../../../core/services/ui-util';

@Component({
  selector: 'fin-rule-management',
  templateUrl: './rule-management.component.html',
  styleUrls: ['./rule-management.component.scss']
})
export class RuleManagementComponent extends RoutingComponentBase implements OnInit {
  moment = moment;
  rules: AllocationRule[];
  rulesCount: Number = 0;
  formControl = new FormControl();
  nameFilter: Subject<string> = new Subject<string>();
  tableColumns = ['name', 'period', 'driverName', 'status', 'updatedBy', 'updatedDate', 'icons'];
  dataSource: MatTableDataSource<AllocationRule>;
  UiUtil = UiUtil;

  constructor(
    private ruleService: RuleService,
    private store: AppStore,
    private route: ActivatedRoute,
    private uiUtil: UiUtil,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super(store, route);

  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.formControl.valueChanges.pipe(debounceTime(300))
      .subscribe(name => {
      this.nameFilter.next(name);
    });

    this.ruleService.getApprovalVersionedListByNameAndUserType()
      .subscribe(rules => {
        this.rules = _.orderBy(rules, ['updatedDate'], ['desc']);
        this.rulesCount = rules.length;
        this.dataSource = new MatTableDataSource(this.rules);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });

  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  remove(rule) {
    this.uiUtil.confirmDelete()
      .subscribe(resp => {
        if (resp) {
          this.ruleService.remove(rule.id)
            .subscribe(() => {
              this.rules.splice(this.rules.indexOf(rule), 1);
              this.changeDetectorRef.detectChanges();
            });
        }
      });
  }

  showDeleteIcon(rule) {
    return _.includes(['D', 'P'], rule.status);
  }
}





