import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import {CuiProgressbarModule} from "@cisco-ngx/cui-components";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CuiProgressbarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
