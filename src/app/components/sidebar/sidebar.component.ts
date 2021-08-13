import { Component, OnInit } from '@angular/core';
import { HelperService } from 'app/helper.service';
import { Router } from '@angular/router';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/Logistic/dashboard', title: 'Dashboard', icon: 'design_app', class: '' },
    { path: '/Logistic/ShiperForm', title: 'Shiper Info', icon: 'users_circle-08', class: '' },
    { path: '/Logistic/ShiperList', title: 'Shiper List', icon: 'users_circle-08', class: '' },
    { path: '/Logistic/RiderList', title: 'Riders List', icon: 'shopping_delivery-fast', class: '' },
    { path: '/Logistic/BookingForm', title: 'Booking Form', icon: 'education_paper', class: '' },
    { path: '/Logistic/BookingList', title: 'Booking List', icon: 'text_align-center', class: '' },
    { path: '/Logistic/UserList', title: 'User List', icon: 'users_single-02', class: '' },
    { path: '/Logistic/ManageCHQ', title: 'Manage Payment', icon: 'shopping_credit-card', class: '' },
    { path: '/Logistic/ManageCHQList', title: 'Manage Payment List', icon: 'files_single-copy-04', class: '' },
    { path: '/Logistic/WorkOut', title: 'Work Out', icon: 'sport_user-run', class: '' },
    { path: '/Logistic/Tracking', title: 'Status Update', icon: 'business_chart-bar-32', class: '' },
    { path: '/Logistic/Setting', title: 'Setting', icon: 'ui-1_settings-gear-63', class: '' },
    { path: '/Logistic/TrackID', title: 'Track Order', icon: 'business_chart-bar-32', class: '' },
    { path: '/Logistic/icons', title: 'Icons', icon: 'education_atom', class: '' },
    { path: '/Logistic/maps', title: 'Maps', icon: 'location_map-big', class: '' },
    { path: '/Logistic/notifications', title: 'Notifications', icon: 'ui-1_bell-53', class: '' },
    { path: '/Logistic/user-profile', title: 'User Profile', icon: 'users_single-02', class: '' },
    { path: '/Logistic/table-list', title: 'Table List', icon: 'design_bullet-list-67', class: '' },
    { path: '/Logistic/typography', title: 'Typography', icon: 'text_caps-small', class: '' }
];

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
    menuItems: any[];
    UserInfo: any;
    Priviliges = [];

    constructor(private Helper: HelperService, private router: Router) {

    }


    logOut() {
        this.router.navigate(['/Login']);
    }

    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
        if (JSON.parse(sessionStorage.getItem('UserInfo')) != null) {
            let privilages = this.UserInfo = JSON.parse(sessionStorage.getItem('UserInfo')).Privilages;
            let menuSelection = [];
            privilages.forEach(element => {
                let sideMenuItem = this.menuItems.find(data => data.path == element.item_id);
                if (sideMenuItem != undefined) {
                    if (sideMenuItem.path != "/Logistic/ShiperForm" || JSON.parse(sessionStorage.getItem('UserInfo')).isAdmin == 1) {
                        menuSelection.push(sideMenuItem);
                    }
                }
            });

            this.menuItems = menuSelection;
        } else {
            this.router.navigate(['/Login']);
        }
    }
    isMobileMenu() {
        if (window.innerWidth > 991) {
            return false;
        }
        return true;
    };
}
