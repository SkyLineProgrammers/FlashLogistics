import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';

import { AppComponent } from './app.component';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './login/login.component';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { NgxBarcodeModule } from 'ngx-barcode';
import { HashLocationStrategy, LocationStrategy } from '@angular/common'
import { BlueExServicesService } from './blue-ex-services.service';
import { HttpClientModule } from '@angular/common/http';

// import { TrakingComponent } from './traking/traking.component';

// import { ShiperFormComponent } from './shiper-form/shiper-form.component';
// import { ShiperListComponent } from './shiper-list/shiper-list.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    NgxUiLoaderModule,
    NgxBarcodeModule,
    HttpClientModule,
    NgbModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot()
  ],
  schemas: [
    // CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    LoginComponent,
    // TrakingComponent,
    // ShiperFormComponent,
    // ShiperListComponent,

  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    BlueExServicesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
