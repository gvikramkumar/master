import {BrowserModule} from '@angular/platform-browser';
import {ApplicationRef, NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {Router} from '@angular/router';
import {AppStore} from './app-store';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DfaCommonModule} from '../dfa-common/dfa-common.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    DfaCommonModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(private store: AppStore, private router: Router, private appRef: ApplicationRef) {
  }

}
