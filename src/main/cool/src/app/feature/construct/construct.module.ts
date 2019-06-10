

import {
  DialogModule, AutoCompleteModule, MultiSelectModule, TreeTableModule,
  TooltipModule, DragDropModule
} from 'primeng/primeng';

import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { RouterModule } from '@angular/router';


import * as _ from 'lodash';
import { OfferConstructComponent } from './offer-construct/offer-construct.component';
import { OfferconstructChildComponent } from './child_component/offerconstruct-child/offerconstruct-child.component';
import { OfferconstructCanvasComponent } from './offer-construct-canvas/offer-construct-canvas.component';
import { RightPanelModule } from '@app/feature/right-panel/right-panel.module';
import { TaskBarModule } from '@app/feature/taskbar/task-bar.module';
import { MenuBarModule } from '@app/feature/menu/menu-bar.module';
import { OfferDetailModule } from '@app/feature/offer-detail/offer-detail.module';
import { DynamicFormQuestionComponent } from './dynamic-form-question/dynamic-form-question.component';
import { TableModule } from 'primeng/table';

import { CONSTRUCT_ROUTES } from './construct.routes';


@NgModule({
  declarations: [
    OfferConstructComponent,
    OfferconstructChildComponent,
    DynamicFormQuestionComponent,
    OfferconstructCanvasComponent
  ],
  imports: [
    TableModule,
    DialogModule,
    DragDropModule,
    TooltipModule,
    TreeTableModule,
    MultiSelectModule,
    AutoCompleteModule,
    SharedModule,
    MenuBarModule,
    TaskBarModule,
    RightPanelModule,
    OfferDetailModule,
    RouterModule.forChild(CONSTRUCT_ROUTES)
  ]
})
export class ConstructModule { }
