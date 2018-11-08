import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource, MatCheckbox} from '@angular/material';
import {FormControl} from '@angular/forms';
import {Subject, Subscription} from 'rxjs';
import * as moment from 'moment';
import {ActivatedRoute, Router} from '@angular/router';
import * as _ from 'lodash';
import {debounceTime} from 'rxjs/operators';
import {RoutingComponentBase} from '../../../../core/base-classes/routing-component-base';
import {AllocationRule} from '../../../../../../../shared/models/allocation-rule';
import {Submeasure} from '../../models/submeasure';
import {MeasureService} from '../../services/measure.service';
import {RuleService} from '../../services/rule.service';
import {SubmeasureService} from '../../services/submeasure.service';
import {AppStore} from '../../../../app/app-store';
import {UiUtil} from '../../../../core/services/ui-util';
import {SelectionModel} from '@angular/cdk/collections';
import {DialogInputType} from '../../../../core/models/ui-enums';

@Component({
  selector: 'fin-approval',
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.scss']
})
export class ApprovalComponent extends RoutingComponentBase implements OnInit {
  moment = moment;
  submeasures: Submeasure[];
  rules: AllocationRule[];
  measureNameMap: Map<number, string> = new Map();
  formControl = new FormControl();
  nameFilter: Subject<string> = new Subject<string>();
  ruleColumns = ['select', 'name', 'driver', 'period', 'submittedBy', 'submittedDate'];
  submeasureColumns = ['select', 'name', 'measure', 'rulelist', 'submittedBy', 'submittedDate'];
  ruleDataSource: MatTableDataSource<AllocationRule>;
  submeasureDataSource: MatTableDataSource<Submeasure>;
  showRules = true;
  showSubmeasures = true;
  UiUtil = UiUtil;

  ruleSelection = new SelectionModel<AllocationRule>(true, []);
  submeasureSelection = new SelectionModel<Submeasure>(true, []);

  constructor(
    private ruleService: RuleService,
    private submeasureService: SubmeasureService,
    private measureService: MeasureService,
    private store: AppStore,
    private route: ActivatedRoute,
    private router: Router,
    private uiUtil: UiUtil
  ) {
    super(store, route);
  }

  @ViewChild('rulePaginator') rulePaginator: MatPaginator;
  @ViewChild(MatSort) ruleSort: MatSort;

  @ViewChild('subPaginator') submeasurePaginator: MatPaginator;
  @ViewChild(MatSort) submeasureSort: MatSort;

  ngOnInit() {
    this.formControl.valueChanges.pipe(debounceTime(300))
      .subscribe(name => {
        this.nameFilter.next(name);
      });

    this.measureService.getManyLatest('name')
      .subscribe(measures => {
        for (let i = 0; i < measures.length; i++) {
          this.measureNameMap.set(measures[i].measureId, measures[i].name);
        }
      });

    this.ruleService.getManyPending()
      .subscribe(rules => {
        this.rules = _.orderBy(rules, ['updatedDate'], ['desc']);
        // this.rulesCount = rules.length;
        this.ruleDataSource = new MatTableDataSource(this.rules);
        this.ruleDataSource.paginator = this.rulePaginator;
        this.ruleDataSource.sort = this.ruleSort;
      });

    this.submeasureService.getManyPending()
      .subscribe(submeasures => {
        this.submeasures = _.orderBy(submeasures, ['updatedDate'], ['desc']);
        // this.submeasuresCount = submeasures.length;
        this.submeasureDataSource = new MatTableDataSource(this.submeasures);
        this.submeasureDataSource.paginator = this.submeasurePaginator;
        this.submeasureDataSource.sort = this.submeasureSort;
      });

  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  applyRuleFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.ruleDataSource.filter = filterValue;
  }

  applySubmeasureFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.submeasureDataSource.filter = filterValue;
  }

  approveRules() {
    this.uiUtil.confirmApprove('rule')
      .subscribe(resultConfirm => {
        if (resultConfirm) {
          this.uiUtil.promptDialog('Add approval comments', null, DialogInputType.textarea)
            .subscribe(resultPrompt => {
              if (resultPrompt !== undefined) {
                let promises: Promise<any>[] = [];
                for (let i = 0; i < this.ruleSelection.selected.length; i++) {
                  this.ruleSelection.selected[i].approveRejectMessage = '[BULK APPROVAL] ' + resultPrompt;
                  promises.push(this.ruleService.approve(this.ruleSelection.selected[i]).toPromise());
                }
                Promise.all(promises)
                  .then(result => {
                    this.uiUtil.toast('Rule(s) approved, user(s) notified.');
                    this.ngOnInit(); // refreshes data
                  });
              }
            });
        }
      });
  }

  approveSubmeasures() {
    this.uiUtil.confirmApprove('submeasure')
      .subscribe(resultConfirm => {
        if (resultConfirm) {
          this.uiUtil.promptDialog('Add approval comments', null, DialogInputType.textarea)
            .subscribe(resultPrompt => {
              if (resultPrompt !== undefined) {
                let promises: Promise<any>[] = [];
                for (let i = 0; i < this.submeasureSelection.selected.length; i++) {
                  this.submeasureSelection.selected[i].approveRejectMessage = '[BULK APPROVAL] ' + resultPrompt;
                  promises.push(this.submeasureService.approve(this.submeasureSelection.selected[i]).toPromise());
                }
                Promise.all(promises)
                  .then(result => {
                    this.uiUtil.toast('Submeasure(s) approved, user(s) notified.');
                    this.ngOnInit(); // refreshes data
                  });
              }
            });
        }
      });
  }

  rejectRules() {
    this.uiUtil.confirmReject('rule')
      .subscribe(resultConfirm => {
        if (resultConfirm) {
          this.uiUtil.promptDialog('Enter a reason for rejection', null, DialogInputType.textarea)
            .subscribe(resultPrompt => {
              if (resultPrompt !== undefined) {
                let promises: Promise<any>[] = [];
                for (let i = 0; i < this.ruleSelection.selected.length; i++) {
                  this.ruleSelection.selected[i].approveRejectMessage = '[BULK REJECT] ' + resultPrompt;
                  promises.push(this.ruleService.reject(this.ruleSelection.selected[i]).toPromise());
                }
                Promise.all(promises)
                  .then(result => {
                    this.uiUtil.toast('Rule(s) rejected, user(s) notified.');
                    this.ngOnInit(); // refreshes data
                  });
              }
            });
        }
      });
  }

  rejectSubmeasures() {
    this.uiUtil.confirmReject('submeasure')
      .subscribe(resultConfirm => {
        if (resultConfirm) {
          this.uiUtil.promptDialog('Enter a reason for rejection', null, DialogInputType.textarea)
            .subscribe(resultPrompt => {
              if (resultPrompt !== undefined) {
                let promises: Promise<any>[]= [];
                for (let i = 0; i < this.submeasureSelection.selected.length; i++) {
                  this.submeasureSelection.selected[i].approveRejectMessage = '[BULK REJECT] ' + resultPrompt;
                  promises.push(this.submeasureService.reject(this.submeasureSelection.selected[i]).toPromise());
                }
                Promise.all(promises)
                  .then(result => {
                    this.uiUtil.toast('Submeasure(s) rejected, user(s) notified.');
                    this.ngOnInit(); // refreshes data
                  });
              }
            });
        }
      });
  }

  getUrl(type: string, id: string) {
    return`/prof/${type}/edit/${id};mode=view`;
  }

  getRuleListString(rules: string[]) {
    if (rules.length === 0) {
      return '';
    }
    let result = '';
    for (let i = 0; i < rules.length - 1; i++) {
      result += rules[i] + '\n';
    }
    result += rules[rules.length - 1];
    return result;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  allRulesSelected(): boolean {
    const numSelected = this.ruleSelection.selected.length;
    const numRows = this.ruleDataSource.data.length;
    return numSelected === numRows;
  }

  allSubmeasuresSelected(): boolean {
    const numSelected = this.submeasureSelection.selected.length;
    const numRows = this.submeasureDataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  ruleMasterToggle() {
    this.allRulesSelected() ?
      this.ruleSelection.clear() :
      this.ruleDataSource.data.forEach(row => this.ruleSelection.select(row));
  }

  submeasureMasterToggle() {
    this.allSubmeasuresSelected() ?
      this.submeasureSelection.clear() :
      this.submeasureDataSource.data.forEach(row => this.submeasureSelection.select(row));
  }

}






