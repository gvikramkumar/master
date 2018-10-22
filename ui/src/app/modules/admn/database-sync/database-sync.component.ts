import {Component} from '@angular/core';
import {RoutingComponentBase} from '../../../core/base-classes/routing-component-base';
import {AppStore} from '../../../app/app-store';
import {ActivatedRoute} from '@angular/router';
import {UiUtil} from '../../../core/services/ui-util';
import {DatabaseService} from '../../_common/services/database.service';
import {DialogType} from '../../../core/models/ui-enums';

@Component({
  selector: 'fin-database-sync',
  templateUrl: './database-sync.component.html',
  styleUrls: ['./database-sync.component.scss']
})
export class DatabaseSyncComponent extends RoutingComponentBase {
  results = null;

  constructor(
    private store: AppStore,
    private route: ActivatedRoute,
    private databaseService: DatabaseService,
    private uiUtil: UiUtil
  ) {
    super(store, route);
  }

  mongoToPgSync() {
    this.results = null;
    this.uiUtil.genericDialog('Are you sure you want to sync data from Mongo to Postgres?',
      null, 'Database Sync', DialogType.yesNo)
      .subscribe(resp => {
        if (resp) {
          this.databaseService.mongoToPgSync()
            .subscribe(results => this.results = results);
        }
      });
  }

  pgToMongoSync() {
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

}
