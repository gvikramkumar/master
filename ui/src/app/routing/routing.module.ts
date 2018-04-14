import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PageNotFoundComponent} from '../shared/components/page-not-found/page-not-found.component';
import {InitializationGuard} from './guards/initialization.guard';
import {AuthGuard} from './guards/auth.guard';
import {RouterModule, Routes} from '@angular/router';
import {StoreModule} from '../store/store.module';
import {CoreModule} from '../core/core.module';

const appRoutes: Routes = [
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes, {enableTracing: false}),
    CoreModule
  ],
})
export class RoutingModule {
}
