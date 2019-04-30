import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule, OverlayPanelModule } from 'primeng/primeng';

import { LoaderComponent } from './components';
import { BupmGuard, AuthGuard } from './guards';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';

import { UserService } from './services';
import { HeaderService } from './services/header.service';
import { LoaderService } from './services/loader.service';
import { ConfigurationService } from './services/configuration.service';
import { HttpInterceptorService } from './services/http-interceptor/http-interceptor.service';

import { AppRoutingModule } from '@app/app-routing.module';

@NgModule({
  declarations: [
    LoaderComponent,
    FooterComponent,
    HeaderComponent,
  ],
  imports: [
    CommonModule,
    AccordionModule,
    AppRoutingModule,
    OverlayPanelModule,
  ],
  providers: [
    BupmGuard,
    AuthGuard,
    UserService,
    HeaderService,
    LoaderService,
    ConfigurationService,
    HttpInterceptorService,
  ],
  exports: [
    LoaderComponent,
    FooterComponent,
    HeaderComponent,
    AppRoutingModule
  ]
})
export class CoreModule { }
