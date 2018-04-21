import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule, Routes} from "@angular/router";
import {InitializationGuard} from "./guards/initialization.guard";
import {UserResolver} from "./resolves/user.resolver";
import {StoreModule} from "../store/store.module";
import {CoreModule} from "../core/core.module";
import {HomeComponent} from '../common/home';
import {SubmeasureComponent} from '../pft/submeasure/submeasure/submeasure.component';
import {SubmeasureUploadComponent} from '../pft/submeasure/submeasure-upload/submeasure-upload.component';
import {SubmeasureAddComponent} from '../pft/submeasure/submeasure-add/submeasure-add.component';
import {RuleManagementComponent} from '../pft/rule-management/rule-management/rule-management.component';
import {RuleManagementCreateComponent} from '../pft/rule-management/rule-management-create/rule-management-create.component';
import {RuleManagementAssignComponent} from '../pft/rule-management/rule-management-assign/rule-management-assign.component';
import {RuleManagementUpdateComponent} from '../pft/rule-management/rule-management-update/rule-management-update.component';
import {BusinessUploadComponent} from '../pft/business-upload/business-upload/business-upload.component';
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
          { path: 'upload', component:SubmeasureUploadComponent },
          { path: 'addnew', component:SubmeasureAddComponent },
        ]
      },
      {
        path: 'rule_management',
        children: [
          {path: '', component: RuleManagementComponent},
          { path: 'add',
            component:RuleManagementCreateComponent,
            data: {mode: 'add'}
          },
          { path: 'assign', component:RuleManagementAssignComponent },
          { path: 'edit/:id', component:RuleManagementCreateComponent },
        ],
      },
      { path: 'business_upload', component:BusinessUploadComponent },
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
  providers: [UserResolver, InitializationGuard]
})
export class RoutingModule {
}
