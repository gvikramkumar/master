import {ApplicationRef, Component, OnInit} from '@angular/core';
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
import {ModuleLookupService} from '../../services/module-lookup.service';
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
  moduleSourceIds: number[] = [];
  moduleSources: Source[] = [];
  hierarchies: { name: string, selected?: boolean }[] = [];
  shUtil = shUtil;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private measureService: MeasureService,
    private store: AppStore,
    private uiUtil: UiUtil,
    private sourceService: SourceService,
    private moduleLookupService: ModuleLookupService
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
      // promise getting sourceIds for current module
      this.moduleLookupService.get('sources', this.store.module.moduleId).toPromise()
    ])
      .then(data => {
        this.sources = data[0];
        this.hierarchies = data[1];
        this.moduleSourceIds = data[2];

        // filter sources by current module
        this.moduleSources = this.sources.filter(source => _.includes(this.moduleSourceIds, source.sourceId));
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
    this.hierarchies.forEach(h => {
      h.selected = this.measure.hierarchies.indexOf(h.name) !== -1 ? true : false;
      return h;
    });

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

  prepForSave() {
    this.measure.hierarchies = this.hierarchies
      .filter(h => h.selected)
      .map(h => h.name);
  }

  public save() {
    this.uiUtil.confirmSave()
      .subscribe(resp => {
        if (resp) {
          this.prepForSave();
          this.validate().subscribe(valid => {
            if (valid) {
              let obs: Observable<Measure>;
              if (this.editMode) {
                obs = this.measureService.update(this.measure);
              } else {
                obs = this.measureService.add(this.measure);
              }
              obs.subscribe(measure => this.router.navigateByUrl('/prof/measure'));
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
      return of(true);
    }
  }
}
