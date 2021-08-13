import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './login/login.component';
import { HelperService } from './helper.service';
import { ExcelService } from './excel.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AuthGuard } from './auth.guard';


const routes: Routes = [
  { path: '', redirectTo: 'Login', pathMatch: 'full', },
  { path: '', component: LoginComponent },
  { path: 'Login', component: LoginComponent },
  {
    path: 'Logistic', component: AdminLayoutComponent,
    children: [{
      path: '', loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'
    }]
  },
  { path: '**', redirectTo: 'Login' }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes),
    NgMultiSelectDropDownModule.forRoot()

  ],
  exports: [
  ],
  declarations: [

  ],
  providers: [
    HelperService,
    ExcelService,
    AuthGuard
  ]
})
export class AppRoutingModule { }
