import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { Routes, RouterModule } from '@angular/router';

import { MenuBarModule } from '@app/menu/menu-bar.module';
import { RightPanelModule } from '@app/right-panel/right-panel.module';

import * as _ from 'lodash';
import { TreeTableModule, AutoCompleteModule } from 'primeng/primeng';

import { ItemCreationComponent } from './item-creation.component';
import { ReviewEditForm } from './components/review-edit-form/review-edit-form';

const routes: Routes = [
    {
        path: '',
        component: ItemCreationComponent
    },
];

@NgModule({
    declarations: [
        ReviewEditForm,
        ItemCreationComponent,
    ],
    imports: [
        SharedModule,
        MenuBarModule,
        TreeTableModule,
        RightPanelModule,
        AutoCompleteModule,
        RouterModule.forChild(routes)
    ]
})
export class ItemCreationModule { }
