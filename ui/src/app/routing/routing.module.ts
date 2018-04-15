import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule, Routes} from "@angular/router";
import {InitializationGuard} from "./guards/initialization.guard";
import {UserEditComponent} from "../users/user-edit/user-edit.component";
import {UserResolver} from "./resolves/user.resolver";
import {UserListComponent} from "../users/user-list/user-list.component";
import {StoreModule} from "../store/store.module";
import {CoreModule} from "../core/core.module";

const routes: Routes = [
  {
    path: 'user',
    component: UserListComponent,
    canActivate: [InitializationGuard]
  },
  {
    path: 'user/:id',
    component: UserEditComponent,
    resolve: {user: UserResolver},
    canActivate: [InitializationGuard]
  },
  {path: '**', redirectTo: '/user'}
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
