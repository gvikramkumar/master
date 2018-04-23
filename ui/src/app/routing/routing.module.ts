import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule, Routes} from "@angular/router";
import {InitializationGuard} from "./guards/initialization.guard";
import {StoreModule} from "../store/store.module";
import {CoreModule} from "../core/core.module";
import {HomeComponent} from '../common/home';
import {SubmeasureComponent} from '../profitability/submeasure/submeasure/submeasure.component';
import {SubmeasureUploadComponent} from '../profitability/submeasure/submeasure-upload/submeasure-upload.component';
import {SubmeasureAddComponent} from '../profitability/submeasure/submeasure-add/submeasure-add.component';
import {RuleManagementComponent} from '../profitability/rule-management/rule-management/rule-management.component';
import {RuleManagementEditComponent} from '../profitability/rule-management/rule-management-edit/rule-management-edit.component';
import {RuleManagementAssignComponent} from '../profitability/rule-management/rule-management-assign/rule-management-assign.component';
import {BusinessUploadComponent} from '../profitability/business-upload/business-upload/business-upload.component';
import {MainComponent} from '../common/main/main.component';

const routes: Routes = [
  {
    path: '',
    component:HomeComponent,
    canActivate: [InitializationGuard] },
  {
    path: 'pft',
    component:MainComponent,
    canActivate: [InitializationGuard],
    children: [
      {
        path: 'submeasure',
        children: [

          { path: '', component:SubmeasureComponent },
          { path: 'add', component:SubmeasureAddComponent },
          { path: 'upload', component:SubmeasureUploadComponent },
        ]
      },
      {
        path: 'rule-management',
        children: [
          {path: '', component: RuleManagementComponent},
          { path: 'add', component:RuleManagementEditComponent},
          { path: 'edit/:id', component:RuleManagementEditComponent },
          { path: 'assign', component:RuleManagementAssignComponent },
        ],
      },
      { path: 'business-upload', component:BusinessUploadComponent },
    ]
  },
  {path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [
    CommonModule,
    StoreModule,
    CoreModule,
    RouterModule.forRoot(
      routes,
      {enableTracing: false} // <-- debugging purposes only
    )
  ],
  exports: [RouterModule],
  providers: [InitializationGuard]
})
export class RoutingModule {
}
