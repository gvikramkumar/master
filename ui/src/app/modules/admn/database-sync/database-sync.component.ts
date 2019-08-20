import {Component} from '@angular/core';
import {RoutingComponentBase} from '../../../core/base-classes/routing-component-base';
import {AppStore} from '../../../app/app-store';
import {ActivatedRoute} from '@angular/router';
import {UiUtil} from '../../../core/services/ui-util';
import {DatabaseService} from '../../_common/services/database.service';
import {DialogType} from '../../../core/models/ui-enums';
import {SyncMap} from '../../../../../../shared/models/sync-map';
import AnyObj from '../../../../../../shared/models/any-obj';

@Component({
  selector: 'fin-database-sync',
  templateUrl: './database-sync.component.html',
  styleUrls: ['./database-sync.component.scss']
})
export class DatabaseSyncComponent extends RoutingComponentBase {
  results = null;
  syncMap = new SyncMap();
  allValue = false;
  keys = Object.keys(this.syncMap);
  noChoices = false;

  constructor(
    private store: AppStore,
    private route: ActivatedRoute,
    private databaseService: DatabaseService,
    private uiUtil: UiUtil
  ) {
    super(store, route);
  }

  mongoToPgSync() {
    if (!this.syncMap.hasSelections()) {
      this.noChoices = true;
      return;
    } else {
      this.noChoices = false;
    }

    this.results = null;
    this.uiUtil.genericDialog('Are you sure you want to sync data from Mongo to Postgres?',
      null, 'Database Sync', DialogType.yesNo)
      .subscribe(resp => {
        if (resp) {
          this.databaseService.mongoToPgSync(this.syncMap)
            .subscribe((jobLog: AnyObj)  => {
              this.results = jobLog.data;
            });
        }
      });
  }

  pgToMongoSync() {
    this.noChoices = false;
    this.results = null;
    this.uiUtil.genericDialog('Are you sure you want to sync data from Postgres to Mongo?',
      null, 'Database Sync', DialogType.yesNo)
      .subscribe(resp => {
        if (resp) {
          this.databaseService.pgToMongoSync()
            .subscribe(results => this.results = results);
        }
      });
  }

  changeAll() {
    this.noChoices = false;
    this.keys.forEach((key) => {
      if(key !=='dfa_prof_input_amnt_upld_autosync'){
        this.syncMap[key] = this.allValue
      }
        
    });
  }

  change() {
    this.noChoices = false;
  }

}
