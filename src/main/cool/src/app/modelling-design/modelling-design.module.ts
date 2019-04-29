import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DataTableModule} from 'primeng/primeng';
import { NgModule } from '@angular/core';

import * as _ from 'lodash';
import { AtoListComponent } from './ato-list/ato-list.component';
import { AtoMainComponent } from './ato-main/ato-main.component';
import { AtoSummaryComponent } from './ato-summary/ato-summary.component';

import { SharedModule } from '@shared/shared.module';
import { MenuBarModule } from '../menu/menu-bar.module';
import { RightPanelModule } from '../right-panel/right-panel.module';


const routes: Routes = [
  {
    path: '',
    component: AtoMainComponent
  },
];

@NgModule({
  declarations: [
    AtoSummaryComponent,
    AtoListComponent,
    AtoMainComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    MenuBarModule,
    RightPanelModule,
    SharedModule,
    DataTableModule,
    RouterModule.forChild(routes)
  ]
})
export class ModellingDesignModule { }
