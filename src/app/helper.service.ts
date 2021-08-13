import { Injectable } from '@angular/core';
import * as firebase from "firebase";

@Injectable()
export class HelperService {

  ShiperInformation: any;
  RiderInformation: any;
  UserInformation: any;
  isShowSideMenu = true;

  Roles = [
    { roleName: "Dashboard", url: "/Logistic/dashboard" },
    { roleName: "ShiperList", url: "/Logistic/ShiperList" },
    { roleName: "ShiperForm", url: "/Logistic/ShiperForm" },
    { roleName: "RiderList", url: "/Logistic/RiderList" },
    { roleName: "RiderForm", url: "/Logistic/RiderForm" },
    { roleName: "BookingForm", url: "/Logistic/BookingForm" },
    { roleName: "BookingList", url: "/Logistic/BookingList" },
    { roleName: "UserList", url: "/Logistic/UserList" },
    { roleName: "UserForm", url: "/Logistic/UserForm" },
    { roleName: "ManageCHQ", url: "/Logistic/ManageCHQ" },
    { roleName: "ManageCHQList", url: "/Logistic/ManageCHQList" },
    { roleName: "WorkOut", url: "/Logistic/WorkOut" },
    { roleName: "Tracking", url: "/Logistic/Tracking" },
    { roleName: "Setting", url: "/Logistic/Setting" },
  ]
  constructor() { }


  getUserGuardPrivilages(link) {
    let userInfo = JSON.parse(sessionStorage.getItem('UserInfo'));
    let role = this.Roles;

    if (userInfo != null) {
      let index = userInfo.Privilages.findIndex(data => data.item_id == link);
      if (index == -1) {
        return false;
      } else {
        return true;
      }
    } else {
      return "goToLogin";
    }


  }

}
