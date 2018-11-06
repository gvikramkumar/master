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
  // submeasuresCount: Number = 0;
  // rulesCount: Number = 0;
  formControl = new FormControl();
  nameFilter: Subject<string> = new Subject<string>();
  tableColumns = ['select', 'name', 'typeCode', 'status', 'updatedBy', 'updatedDate'];
  ruleDataSource: MatTableDataSource<AllocationRule>;
  submeasureDataSource: MatTableDataSource<Submeasure>;
  showRules = true;
  showSubmeasures = true;
  UiUtil = UiUtil;

  ruleSelection = new SelectionModel<AllocationRule>(false, null);
  submeasureSelection = new SelectionModel<Submeasure>(false, null);

  constructor(
    private ruleService: RuleService,
    private submeasureService: SubmeasureService,
    private store: AppStore,
    private route: ActivatedRoute,
    private router: Router,
    private uiUtil: UiUtil
  ) {
    super(store, route);
  }

  @ViewChild(MatPaginator) rulePaginator: MatPaginator;
  @ViewChild(MatSort) ruleSort: MatSort;

  @ViewChild(MatPaginator) submeasurePaginator: MatPaginator;
  @ViewChild(MatSort) submeasureSort: MatSort;

  ngOnInit() {
    this.formControl.valueChanges.pipe(debounceTime(300))
      .subscribe(name => {
        this.nameFilter.next(name);
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

  approveRule() {
    this.uiUtil.confirmApprove('rule')
      .subscribe(resultConfirm => {
        if (resultConfirm) {
          this.uiUtil.promptDialog('Add approval comments', null, DialogInputType.textarea)
            .subscribe(resultPrompt => {
              if (resultPrompt !== undefined) {
                this.ruleSelection.selected[0].approveRejectMessage = resultPrompt;
                this.ruleService.approve(this.ruleSelection.selected[0])
                  .subscribe(() => {
                    this.uiUtil.toast('Rule approved, user notified.');
                    this.ngOnInit(); // refreshes data
                  });
              }
            });
        }
      });
  }

  approveSubmeasure() {
    this.uiUtil.confirmApprove('submeasure')
      .subscribe(resultConfirm => {
        if (resultConfirm) {
          this.uiUtil.promptDialog('Add approval comments', null, DialogInputType.textarea)
            .subscribe(resultPrompt => {
              if (resultPrompt !== undefined) {
                this.submeasureSelection.selected[0].approveRejectMessage = resultPrompt;
                this.submeasureService.approve(this.submeasureSelection.selected[0])
                  .subscribe(() => {
                    this.uiUtil.toast('Submeasure approved, user notified.');
                    this.ngOnInit(); // refreshes data
                  });
              }
            });
        }
      });
  }

  rejectRule() {
    this.uiUtil.confirmReject('rule')
      .subscribe(resultConfirm => {
        if (resultConfirm) {
          this.uiUtil.promptDialog('Enter a reason for rejection', null, DialogInputType.textarea)
            .subscribe(resultPrompt => {
              if (resultPrompt !== undefined) {
                this.ruleSelection.selected[0].approveRejectMessage = resultPrompt;
                this.ruleService.reject(this.ruleSelection.selected[0])
                  .subscribe(sm => {
                    this.uiUtil.toast('Rule has been rejected, user notified.');
                    this.ngOnInit(); // refreshes data
                  });
              }
            });
        }
      });
  }

  rejectSubmeasure() {
    this.uiUtil.confirmReject('submeasure')
      .subscribe(resultConfirm => {
        if (resultConfirm) {
          this.uiUtil.promptDialog('Enter a reason for rejection', null, DialogInputType.textarea)
            .subscribe(resultPrompt => {
              if (resultPrompt !== undefined) {
                this.submeasureSelection.selected[0].approveRejectMessage = resultPrompt;
                this.submeasureService.reject(this.submeasureSelection.selected[0])
                  .subscribe(sm => {
                    this.uiUtil.toast('Submeasure has been rejected, user notified.');
                    this.ngOnInit(); // refreshes data
                  });
              }
            });
        }
      });
  }

  inspectItem(type: string, id: string) {
    window.open(`/prof/${type}/edit/${id};mode=view`);
  }

}






