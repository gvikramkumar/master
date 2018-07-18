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
import {Source} from '../../models/source';
import {SourceService} from '../../services/source.service';
import {shUtil} from '../../../../../../../shared/shared-util';

@Component({
  selector: 'fin-measure-create',
  templateUrl: './measure-edit.component.html',
  styleUrls: ['./measure-edit.component.scss']
})
export class MeasureEditComponent extends RoutingComponentBase implements OnInit {
  editMode = false;
  measure = new Measure();
  orgMeasure = _.cloneDeep(this.measure);
  sources: Source[] = [];
  hierarchies: {name: string}[] = [];
  shUtil = shUtil;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private measureService: MeasureService,
    private store: AppStore,
    private uiUtil: UiUtil,
    private sourceService: SourceService
  ) {
    super(store, route);
    this.editMode = !!this.route.snapshot.params.id;
  }

  getData(): Promise<void> {
    return Promise.all([
      this.sourceService.getMany().toPromise(),
      Promise.resolve([
        {name: 'Product'},
        {name: 'Sales'},
      ]),
    ])
      .then(data => {
        this.sources = data[0];
        this.hierarchies = data[1];
      });
  }

  public ngOnInit(): void {
    this.getData()
      .then(() => {
        if (this.editMode) {
          this.measureService.getOneById(this.route.snapshot.params.id)
            .subscribe(measure => {
              this.measure = measure;
              this.orgMeasure = _.cloneDeep(this.measure);
              this.prepForUi();
            });
        } else {
          this.prepForUi();
        }
      });
  }

  prepForUi() {
    this.measure.statusBool = this.measure.status === 'A';
  }

  isPending() {
    // return this.measure.status === 'P';
    return true;
  }

  hasChanges() {
    return !_.isEqual(this.measure, this.orgMeasure);
  }

  verifyLosingChanges() {
    if (this.hasChanges()) {
      return this.uiUtil.genericDialog('Are you sure you want to lose your changes?', DialogType.yesNo);
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
          this.prepForUi();
        }
      });
  }

  prepForSave() {
    this.measure.status = this.measure.statusBool ? 'A' : 'I';
  }

  confirmSave() {
    return this.uiUtil.genericDialog('Are you sure you want to save?', DialogType.yesNo);
  }

  public save() {
    this.confirmSave()
      .subscribe(resp => {
        if (resp) {
          this.prepForSave();
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
