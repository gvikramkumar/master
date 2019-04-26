import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import * as _ from 'lodash';
import { MenuBarComponent } from '@app/menu/menu-bar/menu-bar.component';
import { MenuBarPopupComponent } from '@app/menu/menu-bar-popup/menu-bar-popup.component';


@NgModule({
    declarations: [
        MenuBarComponent,
        MenuBarPopupComponent,
    ],
    imports: [
        FormsModule,
        CommonModule
    ], exports: [
        MenuBarComponent,
        MenuBarPopupComponent
    ]
})

export class MenuBarModule { }
