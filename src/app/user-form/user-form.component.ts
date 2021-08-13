import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from "@angular/fire/database";
import { ToastrService } from 'ngx-toastr';
import { Route, ActivatedRoute, Router } from "@angular/router";
import { HelperService } from "app/helper.service";
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as firebase from "firebase";

@NgModule({
  // declarations: [SampleComponent],
  imports: [
    CommonModule
  ],
  // exports: [SampleComponent],
  schemas: [
    // CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  UserInfo: {
    UserID: string; Name: string; FatherName: string; CNICNumber: string; Mobile1: string; Mobile2: string; Mobile3: string; Location: string; DOB: string; UserName: string; Password: string;
    Privileges: Array<string>
  };
  selectedEmployee: any;
  empInfo = [{
    StatusName: "Bigenner"
  },
  {
    StatusName: "Middle"
  },
  {
    StatusName: "Expert"
  }
  ]

  UserStatus = "Add User";

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};


  onItemSelect(item: any) {
    console.log(item);
  }

  onSelectAll(items: any) {
    console.log(items);
  }

  ngOnInit(): void {

    this.dropdownList = [
      { item_text: 'Dashboard', item_id: "/Logistic/dashboard" },
      { item_text: 'ShiperList', item_id: "/Logistic/ShiperList" },
      { item_text: 'ShiperForm', item_id: "/Logistic/ShiperForm" },
      { item_text: 'RiderList', item_id: "/Logistic/RiderList" },
      { item_text: 'RiderForm', item_id: "/Logistic/RiderForm" },
      { item_text: 'BookingForm', item_id: "/Logistic/BookingForm" },
      { item_text: 'BookingList', item_id: "/Logistic/BookingList" },
      { item_text: 'UserList', item_id: "/Logistic/UserList" },
      { item_text: 'UserForm', item_id: "/Logistic/UserForm" },
      { item_text: 'ManageCHQ', item_id: "/Logistic/ManageCHQ" },
      { item_text: 'ManageCHQList', item_id: "/Logistic/ManageCHQList" },
      { item_text: 'Workout', item_id: "/Logistic/WorkOut" },
      { item_text: 'Tracking', item_id: "/Logistic/Tracking" },
      { item_text: "Setting", item_id: "/Logistic/Setting" },
      { item_text: "TrackOrder", item_id: "/Logistic/TrackID" },


    ];
    // this.selectedItems = [
    //   // { item_id: 3, item_text: 'Pune' },
    //   // { item_id: 4, item_text: 'Navsari' }
    // ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };


    // var data = this.route.paramMap['ShiperInfo']
    // if(data == 0 ){

    // }
    // else{
    //   this.ShiperInfo = data;
    // }


    // this.route.paramMap.subscribe(data => {
    //   data = data["params"].ShiperInfo;
    //    

    // })
    //   // this.route.paramMap['shipername']
    //   // data.get('shipername');

    //    
    //   this.ShiperKey = data["params"].shipername;
    //   if(data["params"].shipername == 0){
    //     this.ButtonName = "Add Shiper"
    //   }else{
    //     this.ButtonName = "Update Shiper";
    //   }
    // })
  }

  ButtonName = "SK";
  UserKey = "";
  UserLoginKey = "";

  constructor(private database: AngularFireDatabase, private toastr: ToastrService, private route: ActivatedRoute, private Helper: HelperService, private router: Router) {


    let guard = this.Helper.getUserGuardPrivilages(this.router.url);
    if (guard) {

    } else {
      this.router.navigate(['/Logistic/Error']);
    }

    var data = JSON.parse(sessionStorage.getItem('EmployeeInformation'));
    if (data != undefined && data != "") {
      sessionStorage.removeItem('EmployeeInformation');
      this.UserInfo = data;
      this.UserKey = data.UserId;
      this.UserLoginKey = data.UserLoginKey;
      this.selectedItems = data.Privileges;
      this.Helper.UserInformation = "";
      this.UserStatus = "Edit User";
    }
    else {
      this.UserStatus = "Add User";
      this.Reset();
    }

  }

  Reset() {
    this.UserInfo = {
      UserID: "-1",
      Name: "",
      FatherName: "",
      CNICNumber: "",
      Mobile1: "",
      Mobile2: "",
      Mobile3: "",
      Location: "",
      DOB: "",
      UserName: "",
      Password: "",
      Privileges: []
    }
    this.selectedItems = [];
  }

  BtnSaveData(params) {
    let ID: string = new Date().getTime().toString();
    params.UserID = "LS-" + ID.substring(ID.length - 6);
    // alert(params.UserID)


    if (this.UserKey == "") {
      let data;
      let key;
      var ref = firebase.database().ref().child('UserLogin');
      ref.orderByChild('UserName').startAt(this.UserInfo.UserName).endAt(this.UserInfo.UserName).on('child_added', function (result) {
        data = result.val();
        key = result.key;
      })
      setTimeout(() => {

        if (data == undefined) {


          if (this.UserInfo.Name == "" || this.UserInfo.FatherName == "" || this.UserInfo.CNICNumber == "" || this.UserInfo.Mobile1 == "") {
            this.toastr.show('<span class="now-ui-icons ui-1_bell-53"></span> Some Fields are required!', '', {
              timeOut: 8000,
              closeButton: true,
              enableHtml: true,
              toastClass: "alert alert-danger alert-with-icon",
            });
          }
          else if (this.selectedItems.length == 0) {
            this.toastr.show('<span class="now-ui-icons ui-1_bell-53"></span> Please select Privileges!', '', {
              timeOut: 8000,
              closeButton: true,
              enableHtml: true,
              toastClass: "alert alert-danger alert-with-icon",
            });
          }
          else {
            this.SaveData(params);
          }

        } else {
          this.toastr.show('<span class="now-ui-icons ui-1_bell-53"></span> UserName has been already taken ', '', {
            timeOut: 8000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-danger alert-with-icon",
          });
        }
      }, 500);



    } else {


      if (this.UserInfo.Name == "" || this.UserInfo.FatherName == "" || this.UserInfo.CNICNumber == "" || this.UserInfo.Mobile1 == "") {
        this.toastr.show('<span class="now-ui-icons ui-1_bell-53"></span> Some Fields are required!', '', {
          timeOut: 8000,
          closeButton: true,
          enableHtml: true,
          toastClass: "alert alert-danger alert-with-icon",
        });
      }
      else if (this.selectedItems.length == 0) {
        this.toastr.show('<span class="now-ui-icons ui-1_bell-53"></span> Please select Privileges!', '', {
          timeOut: 8000,
          closeButton: true,
          enableHtml: true,
          toastClass: "alert alert-danger alert-with-icon",
        });
      }
      else {
        this.SaveData(params);
      }


    }





  }

  SaveData(param) {

    param.Privileges = this.selectedItems;
    if (this.UserKey == "") {

      this.database.list("/UserLogin/").push(
        {
          Privilages: this.selectedItems,
          UserName: param.UserName,
          Password: param.Password,
          isAdmin: 0
        }
      ).then(data => {
        param.UserLoginKey = data.key;
        this.database.list("/Empolyee/").push(
          param
        )
        this.Reset();
        this.toastr.show('<span class="now-ui-icons ui-1_bell-53"></span> Yor Data Has Been Saved', '', {
          timeOut: 8000,
          closeButton: true,
          enableHtml: true,
          toastClass: "alert alert-success alert-with-icon",
        });
      });


    }
    else {

      console.log(param);
      this.database.list('/Empolyee/').update(this.UserKey, param).then(data => {
        this.database.list('/UserLogin/').update(this.UserLoginKey, {
          Privilages: this.selectedItems,
          UserName: param.UserName,
          Password: param.Password,
          isAdmin: 0
        });
        this.Reset();


      })
    }
    // });
  }

}
