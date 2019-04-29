

import {
    DialogModule, AccordionModule, AutoCompleteModule, MultiSelectModule, TreeTableModule,
    TooltipModule, OverlayPanelModule, DataTableModule, DragDropModule
} from 'primeng/primeng';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '@shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import * as _ from 'lodash';
import { OfferConstructComponent } from './offer-construct/offer-construct.component';
import { OfferconstructChildComponent } from './child_component/offerconstruct-child/offerconstruct-child.component';
import { DynamicFormMultipleComponent } from './offer-construct-canvas/dynamic-form-multiple';
import { OfferconstructCanvasComponent } from './offer-construct-canvas/offer-construct-canvas.component';
import { RightPanelModule } from '@app/right-panel/right-panel.module';
import { TaskBarModule } from '@app/taskbar/task-bar.module';
import { MenuBarModule } from '@app/menu/menu-bar.module';
import { OfferDetailModule } from '@app/offer-detail/offer-detail.module';
import { DynamicFormQuestionComponent } from './dynamic-form-question/dynamic-form-question.component';
import { TableModule } from 'primeng/table';


const routes: Routes = [
    {
        path: '',
        component: OfferConstructComponent
    },
];

@NgModule({
    declarations: [
        OfferConstructComponent,
        OfferconstructChildComponent,
        DynamicFormMultipleComponent,
        DynamicFormQuestionComponent,
        OfferconstructCanvasComponent,
    ],
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        TooltipModule,
        AccordionModule,
        OverlayPanelModule,
        TableModule,
        DialogModule,
        DragDropModule,
        DataTableModule,
        SharedModule,
        TaskBarModule,
        TreeTableModule,
        MultiSelectModule,
        AutoCompleteModule,
        MenuBarModule,
        RightPanelModule,
        OfferDetailModule,
        RouterModule.forChild(routes)
    ]
})
export class ConstructModule { }
