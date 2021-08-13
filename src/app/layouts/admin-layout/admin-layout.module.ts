import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { ShiperListComponent } from '../../shiper-list/shiper-list.component';
import { ShiperFormComponent } from '../../shiper-form/shiper-form.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { RiderListComponent } from '../../rider-list/rider-list.component';
import { RiderFormComponent } from '../../rider-form/rider-form.component';
import { BookingFormComponent } from '../../booking-form/booking-form.component';
import { BookingListComponent } from '../../booking-list/booking-list.component';
import { UserListComponent } from '../../user-list/user-list.component';
import { UserFormComponent } from '../../user-form/user-form.component';
import { ManageFormComponent } from '../../manage-form/manage-form.component';
import { ManageListComponent } from '../../manage-list/manage-list.component';
import { WorkOutListComponent } from '../../WorkOut/WorkOut.component';
import { ChartsModule } from 'ng2-charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TrakingComponent } from '../../traking/traking.component';
import { SettingComponent } from '../../setting/setting.component';
import { ErrorComponent } from '../../error/error.component';
import { TrackIdComponent } from '../../track-id/track-id.component';
import { NgxBarcodeModule } from 'ngx-barcode';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ChartsModule,
    NgbModule,
    NgxBarcodeModule,
    ToastrModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot()

  ],


  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TableListComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    ShiperListComponent,
    NotificationsComponent,
    ShiperFormComponent,
    RiderListComponent,
    RiderFormComponent,
    BookingFormComponent,
    BookingListComponent,
    UserListComponent,
    UserFormComponent,
    ManageFormComponent,
    ManageListComponent,
    WorkOutListComponent,
    TrakingComponent,
    SettingComponent,
    ErrorComponent,
    TrackIdComponent
  ]
})

export class AdminLayoutModule { }
