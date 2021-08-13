import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { ShiperListComponent } from '../../shiper-list/shiper-list.component';
import { ShiperFormComponent } from '../../shiper-form/shiper-form.component';
import { RiderListComponent } from '../../rider-list/rider-list.component';
import { RiderFormComponent } from '../../rider-form/rider-form.component';
import { BookingFormComponent } from '../../booking-form/booking-form.component';
import { BookingListComponent } from '../../booking-list/booking-list.component';
import { UserListComponent } from '../../user-list/user-list.component';
import { UserFormComponent } from '../../user-form/user-form.component';
import { ManageFormComponent } from '../../manage-form/manage-form.component';
import { ManageListComponent } from '../../manage-list/manage-list.component';
import { WorkOutListComponent } from '../../WorkOut/WorkOut.component';
import { TrakingComponent } from '../../traking/traking.component';
import { SettingComponent } from '../../setting/setting.component';
import { ErrorComponent } from '../../error/error.component';
import { TrackIdComponent } from '../../track-id/track-id.component';



export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'user-profile', component: UserProfileComponent },
    { path: 'table-list', component: TableListComponent },
    { path: 'typography', component: TypographyComponent },
    { path: 'icons', component: IconsComponent },
    { path: 'maps', component: MapsComponent },
    { path: 'notifications', component: NotificationsComponent },
    { path: 'ShiperList', component: ShiperListComponent },
    { path: 'ShiperForm', component: ShiperFormComponent },
    { path: 'RiderList', component: RiderListComponent },
    { path: 'RiderForm', component: RiderFormComponent },
    { path: 'BookingForm', component: BookingFormComponent },
    { path: 'BookingList', component: BookingListComponent },
    { path: 'UserList', component: UserListComponent },
    { path: 'UserForm', component: UserFormComponent },
    { path: 'ManageCHQ', component: ManageFormComponent },
    { path: 'ManageCHQList', component: ManageListComponent },
    { path: 'WorkOut', component: WorkOutListComponent },
    { path: 'Tracking', component: TrakingComponent },
    { path: 'Setting', component: SettingComponent },
    { path: 'Error', component: ErrorComponent },
    { path: 'TrackID', component: TrackIdComponent },

];

