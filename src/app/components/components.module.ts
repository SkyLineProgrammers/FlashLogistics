import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AngularFireModule } from 'angularfire2'
import { AngularFireDatabaseModule } from 'angularfire2/database'

// Flash Logistics
const firebase = {
  apiKey: "AIzaSyByD8SsSEb-8r-6riz7IVewNQ455llcssQ",
  authDomain: "flashlogistics-d5ec6.firebaseapp.com",
  databaseURL: "https://flashlogistics-d5ec6.firebaseio.com",
  projectId: "flashlogistics-d5ec6",
  storageBucket: "flashlogistics-d5ec6.appspot.com",
  messagingSenderId: "537808697870",
  appId: "1:537808697870:web:24ed67f9ea760a65fe5a5f"
}


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(firebase),
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent
  ]
})
export class ComponentsModule { }
