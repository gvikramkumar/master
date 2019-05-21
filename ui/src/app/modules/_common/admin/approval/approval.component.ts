import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource, MatCheckbox, MatDialogConfig, MatDialog} from '@angular/material';
import {FormControl} from '@angular/forms';
import {Subject, Subscription} from 'rxjs';
import moment from 'moment';
import {ActivatedRoute, Router} from '@angular/router';
import _ from 'lodash';
import {debounceTime} from 'rxjs/operators';
import {RoutingComponentBase} from '../../../../core/base-classes/routing-component-base';
import {AllocationRule} from '../../../../../../../shared/models/allocation-rule';
import {Submeasure} from '../../../../../../../shared/models/submeasure';
import {MeasureService} from '../../services/measure.service';
import {RuleService} from '../../services/rule.service';
import {SubmeasureService} from '../../services/submeasure.service';
import {AppStore} from '../../../../app/app-store';
import {UiUtil} from '../../../../core/services/ui-util';
import {SelectionModel} from '@angular/cdk/collections';
import {DialogInputType, DialogSize} from '../../../../core/models/ui-enums';
import {RuleDetailDialogComponent} from '../../dialogs/rule-detail-dialog/rule-detail-dialog.component';
import {SubmeasureDetailDialogComponent} from '../../dialogs/submeasure-detail-dialog/submeasure-detail-dialog.component';

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
  ruleColumns = ['select', 'name', 'driver', 'period', 'updatedBy', 'updatedDate'];
  submeasureColumns = ['select', 'name', 'measure', 'rulelist', 'updatedBy', 'updatedDate'];
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
    private uiUtil: UiUtil,
    public dialog: MatDialog
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

    this.measureService.getManyActive()
      .subscribe(measures => {
        for (let i = 0; i < measures.length; i++) {
          this.measureNameMap.set(measures[i].measureId, measures[i].name);
        }
      });
    this.refreshRules();
    this.refreshSubmeasures();
  }

  refreshRules() {
    this.ruleService.getManyPending()
      .subscribe(rules => {
        const filteredRules = rules.filter(rule => this.uiUtil.canAdminApprove(rule.updatedBy));
        this.rules = _.orderBy(filteredRules, ['updatedDate'], ['desc']);
        this.ruleDataSource = new MatTableDataSource(this.rules);
        this.ruleDataSource.paginator = this.rulePaginator;
        this.ruleDataSource.sort = this.ruleSort;
      });
    this.ruleSelection.clear();
  }

  refreshSubmeasures() {
    this.submeasureService.getManyPending()
      .subscribe(submeasures => {
        const filteredSms = submeasures.filter(sm => this.uiUtil.canAdminApprove(sm.updatedBy));
        this.submeasures = _.orderBy(filteredSms, ['updatedDate'], ['desc']);
        this.submeasureDataSource = new MatTableDataSource(this.submeasures);
        this.submeasureDataSource.paginator = this.submeasurePaginator;
        this.submeasureDataSource.sort = this.submeasureSort;
      });
    this.submeasureSelection.clear();
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
    this.uiUtil.confirmApprove('rule(s)')
      .subscribe(resultConfirm => {
        if (resultConfirm) {
          this.uiUtil.promptDialog('Add approval comments', null, DialogInputType.textarea)
            .subscribe(resultPrompt => {
              if (resultPrompt !== 'DIALOG_CANCEL') {
                const arr = [];
                this.ruleSelection.selected.forEach(rule => {
                  rule.approveRejectMessage = resultPrompt;
                })
                this.ruleService.approveMany(this.ruleSelection.selected).toPromise()
                  .then(result => {
                    this.uiUtil.toast('Rule(s) approved, user(s) notified.');
                    this.refreshRules();
                  });
              }
            });
        }
      });
  }

  approveSubmeasures() {
    this.uiUtil.confirmApprove('submeasure(s)')
      .subscribe(resultConfirm => {
        if (resultConfirm) {
          this.uiUtil.promptDialog('Add approval comments', null, DialogInputType.textarea)
            .subscribe(resultPrompt => {
              if (resultPrompt !== 'DIALOG_CANCEL') {
                const promises = [];
                this.submeasureSelection.selected.forEach(sm => {
                  sm.approveRejectMessage = resultPrompt;
                })
                this.submeasureService.approveMany(this.submeasureSelection.selected).toPromise()
                  .then(result => {
                    this.uiUtil.toast('Submeasure(s) approved, user(s) notified.');
                    this.refreshSubmeasures();
                  });
              }
            });
        }
      });
  }

  rejectRules() {
    this.uiUtil.confirmReject('rule(s)')
      .subscribe(resultConfirm => {
        if (resultConfirm) {
          this.uiUtil.promptDialog('Enter a reason for rejection', null, DialogInputType.textarea)
            .subscribe(resultPrompt => {
              if (resultPrompt !== 'DIALOG_CANCEL') {
                const promises = [];
                for (let i = 0; i < this.ruleSelection.selected.length; i++) {
                  this.ruleSelection.selected[i].approveRejectMessage = resultPrompt;
                  promises.push(this.ruleService.reject(this.ruleSelection.selected[i]).toPromise());
                }
                Promise.all(promises)
                  .then(result => {
                    this.uiUtil.toast('Rule(s) rejected, user(s) notified.');
                    this.refreshRules();
                  });
              }
            });
        }
      });
  }

  rejectSubmeasures() {
    this.uiUtil.confirmReject('submeasure(s)')
      .subscribe(resultConfirm => {
        if (resultConfirm) {
          this.uiUtil.promptDialog('Enter a reason for rejection', null, DialogInputType.textarea)
            .subscribe(resultPrompt => {
              if (resultPrompt !== 'DIALOG_CANCEL') {
                const promises = [];
                for (let i = 0; i < this.submeasureSelection.selected.length; i++) {
                  this.submeasureSelection.selected[i].approveRejectMessage = resultPrompt;
                  promises.push(this.submeasureService.reject(this.submeasureSelection.selected[i]).toPromise());
                }
                Promise.all(promises)
                  .then(result => {
                    this.uiUtil.toast('Submeasure(s) rejected, user(s) notified.');
                    this.refreshSubmeasures();
                  });
              }
            });
        }
      });
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

  openRuleDialog(rule) {
    const config = <MatDialogConfig> {
      data: rule,
      width: DialogSize.xlarge,
      backdropClass: 'bg-modal-backdrop'
    };
    return this.dialog.open(RuleDetailDialogComponent, config)
      .afterClosed();
  }

  openSubmeasureDialog(submeasure) {
    const config = <MatDialogConfig> {
      data: submeasure,
      width: DialogSize.xlarge,
      backdropClass: 'bg-modal-backdrop'
    };
    return this.dialog.open(SubmeasureDetailDialogComponent, config)
      .afterClosed();
  }

}






