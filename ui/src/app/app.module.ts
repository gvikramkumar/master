import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {SharedModule} from "./shared/shared.module";
import {FinCommonModule} from './common/common.module';
import {ProfitabilityModule} from './profitability/profitability.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    FinCommonModule,
    ProfitabilityModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
