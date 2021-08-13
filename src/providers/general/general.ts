import { Injectable } from '@angular/core';

/*
  Generated class for the GeneralProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GeneralProvider {

UserInfo = [];
UserName = "";
UserAddtoCart :any;

  constructor() {
    console.log('Hello GeneralProvider Provider');
  }

  setUserInfo(param){
    this.UserInfo = param;
  }
  
  setUserName(param){
    this.UserName = param;
  }

}
