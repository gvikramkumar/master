import {BrowserModule} from '@angular/platform-browser';
import {ApplicationRef, NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {SharedModule} from "./shared/shared.module";
import {NavigationEnd, Router} from '@angular/router';
import {Store} from './store/store';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(private store: Store, private router: Router, private appRef: ApplicationRef) {
    this.init();
  }

  init() {
    this.router.events.filter(e => e instanceof NavigationEnd)
      .subscribe((event: NavigationEnd) => {
        this.store.currentUrlPub(event.url);
      });

  }

}
