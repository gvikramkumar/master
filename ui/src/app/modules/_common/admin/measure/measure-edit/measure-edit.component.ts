import {ApplicationRef, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Measure} from '../../../models/measure';
import {MeasureService} from '../../../services/measure.service';
import {Observable, of} from 'rxjs';
import {RoutingComponentBase} from '../../../../../core/base-classes/routing-component-base';
import {AppStore} from '../../../../../app/app-store';
import _ from 'lodash';
import {DialogType} from '../../../../../core/models/ui-enums';
import {UiUtil} from '../../../../../core/services/ui-util';
import {Source} from '../../../../../../../../shared/models/source';
import {SourceService} from '../../../services/source.service';
import {ModuleLookupService} from '../../../services/module-lookup.service';
import {shUtil} from '../../../../../../../../shared/misc/shared-util';
import {NgForm} from '@angular/forms';
import {ModuleSourceService} from '../../../services/module-source.service';
import AnyObj from '../../../../../../../../shared/models/any-obj';

@Component({
  selector: 'fin-measure-create',
  templateUrl: './measure-edit.component.html',
  styleUrls: ['./measure-edit.component.scss']
})
export class MeasureEditComponent extends RoutingComponentBase implements OnInit {
  editMode = false;
  measure = new Measure();
  measures: Measure[];
  orgMeasure = _.cloneDeep(this.measure);
  sources: Source[] = [];
  measureNames: string[] = [];
  measureTypecodes: string[] = [];
  moduleSourceIds: number[] = [];
  moduleSources: Source[] = [];
  hierarchies: AnyObj[] = [
    {name: 'Product', value: 'PRODUCT'},
    {name: 'Sales', value: 'SALES'}
  ];

  shUtil = shUtil;
  @ViewChild('form') form: NgForm;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private measureService: MeasureService,
    private store: AppStore,
    private uiUtil: UiUtil,
    private sourceService: SourceService,
    private moduleSourceService: ModuleSourceService
  ) {
    super(store, route);
    this.editMode = !!this.route.snapshot.params.id;
  }

  getData(): Promise<void> {
    return Promise.all([
      this.sourceService.getMany().toPromise(),
      this.moduleSourceService.getQueryOne({moduleId: this.store.module.moduleId}).toPromise(),
      this.measureService.getMany().toPromise()
    ])
      .then(results => {
        this.sources = results[0];
        this.moduleSourceIds = results[1].sources;
        this.measures = results[2];
        this.measureNames = this.measures.map(x => x.name);
        this.measureTypecodes = this.measures.map(x => x.typeCode);
        // filter sources by current module
        this.moduleSources = this.sources.filter(source => _.includes(this.moduleSourceIds, source.sourceId));
      });
  }

  public ngOnInit(): void {
    this.getData()
      .then(() => {
        if (this.editMode) {
          this.measure = _.find(this.measures, {id: this.route.snapshot.params.id});
          this.measureNames = this.measureNames.filter(name => name !== this.measure.name);
          this.measureTypecodes = this.measureTypecodes.filter(typeCode => typeCode !== this.measure.typeCode);
          this.orgMeasure = _.cloneDeep(this.measure);
        }
      });
  }

  hasChanges() {
    return !_.isEqual(this.measure, this.orgMeasure);
  }

  verifyLosingChanges() {
    if (this.hasChanges()) {
      return this.uiUtil.genericDialog('Are you sure you want to lose your changes?', null, null, DialogType.yesNo);
    } else {
      return of(true);
    }
  }

  cancel() {
    this.verifyLosingChanges()
      .subscribe(resp => {
        if (resp) {
          this.router.navigateByUrl('/prof/admin/measure');
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
        }
      });
  }

  /*
    // not sure we ever do this, not finding async/await to be much more readable, guess if tabs were
    // 4 spaces more readable, not indented enough. Also... promise.rejects in await throws errors, not that
    // ng won't throw an error on unhandled rejections, but still, it throws an error so would have
    // to use a try/catch block instead of catch(fcn), more awkward for sure.
    public async saveExampleWithAsync() {
      const resp = await this.uiUtil.confirmSave().toPromise()
      if (resp) {
        const valid = await this.validate().toPromise();
        if (valid) {
          let obs: Observable<Measure>;
          if (this.editMode) {
            obs = this.measureService.add(this.measure);
          } else {
            obs = this.measureService.update(this.measure);
          }
          obs.subscribe(measure => this.router.navigateByUrl('/prof/measure'));
        }
      }
    }
  */

  cleanUp() {
    this.measure.sources = this.measure.sources.filter(sourceId => !!_.find(this.moduleSources, {sourceId}));
  }

  save() {
    UiUtil.triggerBlur('');
    if (this.form.valid) {
      this.cleanUp();
      this.uiUtil.confirmSave()
        .subscribe(resp => {
          if (resp) {
            let obs: Observable<Measure>;
            if (this.editMode) {
              obs = this.measureService.update(this.measure);
            } else {
              obs = this.measureService.add(this.measure);
            }
            obs.subscribe(measure => this.router.navigateByUrl('/prof/admin/measure'));
          }
        });
    }
  }

  reportingLevel3SetToSubmeasureNameChange() {
    if (this.measure.reportingLevel3SetToSubmeasureName) {
      this.measure.reportingLevels[2] = undefined;
    }
  }

}
