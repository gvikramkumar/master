import { Component, OnInit } from '@angular/core';
import {RoutingComponentBase} from '../../../core/base-classes/routing-component-base';
import {AppStore} from '../../../app/app-store';
import {ActivatedRoute, Router} from '@angular/router';
import {SourceService} from '../../_common/services/source.service';
import {ToastService} from '../../../core/services/toast.service';
import {UiUtil} from '../../../core/services/ui-util';
import {ModuleSourceService} from '../../_common/services/module-source.service';
import {DatabaseService} from '../../_common/services/database.service';

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
    private databaseService: DatabaseService
  ) {
    super(store, route);
  }

  mongoToPgSync() {
    this.results = null;
    this.databaseService.mongoToPgSync()
      .subscribe(results => this.results = results);
  }

  pgToMongoSync() {
    this.results = null;
    this.databaseService.pgToMongoSync()
      .subscribe(results => this.results = results);
  }

}
