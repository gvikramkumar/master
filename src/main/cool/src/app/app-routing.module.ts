import { NgModule } from '@angular/core';
import { RouterModule, PreloadAllModules } from '@angular/router';

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
