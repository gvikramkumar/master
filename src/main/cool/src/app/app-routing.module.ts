import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { APP_ROUTES } from './app.routes';

@NgModule({
    exports: [
        RouterModule
    ],
    imports: [
        [
            RouterModule.forRoot(APP_ROUTES, {
                useHash: true,
            })
        ]
    ],
    providers: [],
    declarations: []
})
export class AppRoutingModule { }
