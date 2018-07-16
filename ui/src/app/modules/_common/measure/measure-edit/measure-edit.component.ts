import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Measure} from '../../models/measure';
import {MeasureService} from '../../services/measure.service';
import {Observable, of} from 'rxjs';
import {RoutingComponentBase} from '../../../../core/base-classes/routing-component-base';
import {AppStore} from '../../../../app/app-store';
import * as _ from 'lodash';
import {DialogType} from '../../../../core/models/ui-enums';
import {UiUtil} from '../../../../core/services/ui-util';

@Component({
  selector: 'fin-measure-create',
  templateUrl: './measure-edit.component.html',
  styleUrls: ['./measure-edit.component.scss']
})
export class MeasureEditComponent extends RoutingComponentBase implements OnInit {
  editMode = false;
  measure = new Measure();
  orgMeasure = _.cloneDeep(this.measure);
  title: string;
  driverNames = [
    {name: 'GL Revenue Mix', value: 'GLREVMIX'},
    {name: 'Manual Mapping', value: 'MANUALMAP'},
    {name: 'POS Revenue', value: 'REVPOS'},
    {name: 'Service Map', value: 'SERVMAP'},
    {name: 'Shipment', value: 'SHIPMENT'},
    {name: 'Shipped Revenue', value: 'SHIPREV'},
    {name: 'VIP Rebates', value: 'VIP'},
  ]
  periods = ['MTD', 'ROLL6', 'ROLL3'];
  salesMatches = ['SL1', 'SL2', 'SL3', 'SL4', 'SL5', 'SL6'];
  productMatches = ['BU', 'PF', 'TG', 'PID'];
  scmsMatches = ['SCMS'];
  legalEntityMatches = ['Business Entity'];
  legalEntityLevels = ['Business Entity'];
  beMatches = ['BE', 'Sub BE'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private measureService: MeasureService,
    private store: AppStore,
    private uiUtil: UiUtil
  ) {
    super(store, route);
    this.editMode = !!this.route.snapshot.params.id;
  }

  public ngOnInit(): void {
    if (this.editMode) {
      this.title = 'Edit Measure';
      this.measureService.getOneById(this.route.snapshot.params.id)
        .subscribe(measure => {
          this.measure = measure;
          this.orgMeasure = _.cloneDeep(this.measure);
          this.init();
        });
    } else {
      this.title = 'Create Measure';
    }
  }

  init() {

  }

  hasChanges() {
    return !_.isEqual(this.measure, this.orgMeasure);
  }

  verifyLosingChanges() {
    if (this.hasChanges()) {
      return this.uiUtil.genericDialog('Are you sure you want to lose your changes?', DialogType.okCancel);
    } else {
      return of(true);
    }
  }

  cancel() {
    this.verifyLosingChanges()
      .subscribe(resp => {
        if (resp) {
          this.router.navigateByUrl('/prof/measure');
        }
      });
  }

  reset() {
    this.verifyLosingChanges()
      .subscribe(resp => {
        if (resp) {
          if (this.editMode) {
            this.measure = _.cloneDeep(this.orgMeasure);
          } else {
            this.measure = new Measure();
          }
          this.init();
        }
      });
  }

  confirmSave() {
    return this.uiUtil.genericDialog('Are you sure you want to save?', DialogType.okCancel);
  }

  public save() {
    this.confirmSave()
      .subscribe(resp => {
        if (resp) {
          this.validate()
            .subscribe(valid => {
              if (valid) {
                this.measureService.add(this.measure)
                  .subscribe(measure => this.router.navigateByUrl('/prof/measure'));
              }
            });
        }
      });
  }

  validate(): Observable<boolean> {
    // todo: need to search for measure name duplicity on add only
    if (this.editMode) {
      return of(true);
    } else {
      // todo: validate name doesn't exist already. Could be done with an ngModel validator realtime if measures cached
      // otherwise hit server here
      // check for fule name existence in store (if cached measures) or hit the server (why it's observable)
      return of(true);
    }
  }
}
