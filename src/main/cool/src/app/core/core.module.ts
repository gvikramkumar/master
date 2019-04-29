import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { HeaderService } from './services/header.service';
import { BupmGuard, AuthGuard } from './guards';
import { LoaderService } from './services/loader.service';
import { ConfigurationService } from './services/configuration.service';
import { HttpInterceptorService } from './services/http-interceptor/http-interceptor.service';
import { UserService } from './services';
import { AccordionModule, OverlayPanelModule } from 'primeng/primeng';

@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
  ],
  imports: [
    CommonModule,
    AccordionModule,
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
    FooterComponent,
    HeaderComponent,
  ]
})
export class CoreModule { }
