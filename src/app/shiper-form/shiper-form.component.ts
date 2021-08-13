import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from "@angular/fire/database";
import { ToastrService } from 'ngx-toastr';
import { Route, ActivatedRoute, Router } from "@angular/router";
import { HelperService } from "app/helper.service";
import * as firebase from "firebase";

@Component({
  selector: 'app-shiper-form',
  templateUrl: './shiper-form.component.html',
  styleUrls: ['./shiper-form.component.scss']
})
export class ShiperFormComponent implements OnInit {
  Document: any;
  NICBackLink: any;
  NICFrontLink: any;
  ShiperStatus = "Add Shipper";
  ngOnInit(): void {

  }

  ShiperInfo = {
    ShiperID: "",
    CompanyName: "",
    OwnerName: "",
    CNICNumber: "",
    NTNNumber: "",
    City: "",
    CompanyEmail: "",
    Location: "",
    PickupAddress: "",
    CompanyPhone: "",
    MobileNumber1: "",
    MobileNumber2: "",
    URL: "",
    UserName: "",
    Password: "",
    IsActive: false,
    BusinessName: "",
    NatureofBusiness: "",
    BillingAddress: "",
    SalesTax: "",
    weigthAmountHalf: "",
    weigthAmountOne: "",
    weigthAmountIncludingOne: "",
    NICfrontLink: "",
    NICbackLink: "",
    DocumentLink: "",
    GST: "0",
    fuel: "0",
    cityPricingInfo: [
      {
        weight: "0.5",
        zoneA: 0,
        zoneB: 0,
        zoneC: 0
      },
      {
        weight: "1",
        zoneA: 0,
        zoneB: 0,
        zoneC: 0
      },
      {
        weight: "1+",
        zoneA: 0,
        zoneB: 0,
        zoneC: 0
      }
    ]
  }



  cityList = [];
  ButtonName = "SK";
  ShiperKey = "";
  ShiperLoginKey;
  logerInfo: any;

  constructor(private database: AngularFireDatabase, private toastr: ToastrService, private route: ActivatedRoute, private Helper: HelperService, private router: Router) {



    let guard = this.Helper.getUserGuardPrivilages(this.router.url);
    if (guard) {

    } else {
      this.router.navigate(['/Logistic/Error']);
    }


    this.FetchCityData();

    this.logerInfo = JSON.parse(sessionStorage.getItem('UserInfo'));
    if (this.logerInfo.isAdmin == 1) {
      this.ShiperKey = this.logerInfo.ShiperKey;
      this.ShiperLoginKey = this.logerInfo.loggerKey;

      this.ShiperStatus = "Edit / Update Shipper";
      this.database.object('Shiper').valueChanges().subscribe(data => {
        let SubArr = Object.keys(data);
        for (var loop = 0; loop < SubArr.length; loop++) {
          const object2 = Object.assign({ UserId: SubArr[loop] }, data[SubArr[loop]]);
          if (object2.UserName == this.logerInfo.UserName && object2.Password == this.logerInfo.Password) {
            this.ShiperInfo = object2;
          }
        }
      })

    } else {

      var data = JSON.parse(sessionStorage.getItem('ShiperInformation'));
      if (data != undefined && data != "") {
        this.ShiperInfo = data;
        this.ShiperKey = data.ShiperKey;
        sessionStorage.removeItem('ShiperInformation');
        this.ShiperStatus = "Edit / Update Shiper";
        let info;
        let key;
        var ref = firebase.database().ref().child('UserLogin');
        ref.orderByChild('UserName').startAt(this.ShiperInfo.UserName).endAt(this.ShiperInfo.UserName).on('child_added', function (result) {
          info = result.val();
          key = result.key;
        })
        setTimeout(() => {
          this.ShiperLoginKey = key;
        }, 500);



      }
      else {
        this.Reset();
        this.ShiperStatus = "Add Shiper";
      }
    }


  }

  FetchCityData() {
    this.database.object('city').valueChanges().subscribe(data => {
      if (data != null) {
        let SubArr = Object.keys(data);
        this.cityList = [];
        for (var loop = 0; loop < SubArr.length; loop++) {
          const object2 = Object.assign({ CityId: SubArr[loop] }, data[SubArr[loop]]);
          this.cityList.push(object2);
        }
      }
    })
  }

  selectionComboCity(param) {
    this.ShiperInfo.City = param.target.value;
  }

  Reset() {
    this.ShiperInfo = {
      ShiperID: "",
      CompanyName: "",
      OwnerName: "",
      CNICNumber: "",
      NTNNumber: "",
      City: "",
      CompanyEmail: "",
      Location: "",
      PickupAddress: "",
      CompanyPhone: "",
      MobileNumber1: "",
      MobileNumber2: "",
      URL: "",
      BusinessName: "",
      NatureofBusiness: "",
      BillingAddress: "",
      SalesTax: "",
      UserName: "",
      Password: "",
      IsActive: false,
      weigthAmountHalf: "",
      weigthAmountOne: "",
      weigthAmountIncludingOne: "",
      NICfrontLink: "",
      NICbackLink: "",
      DocumentLink: "",
      GST: "0",
      fuel: "0",
      cityPricingInfo: [
        {
          weight: "0.5",
          zoneA: 0,
          zoneB: 0,
          zoneC: 0
        },
        {
          weight: "1",
          zoneA: 0,
          zoneB: 0,
          zoneC: 0
        },
        {
          weight: "1+",
          zoneA: 0,
          zoneB: 0,
          zoneC: 0
        }
      ]
    }


  }

  onFileChanged1(param) {
    var aa;
    const file: File = param.target.files[0];

    const metaData = { 'contentType': file.type };
    const StorageRef: firebase.storage.Reference = firebase.storage().ref('/photos/' + file.name);
    const Store = StorageRef.put(file, metaData);

    setTimeout(() => {
      const UP: firebase.storage.UploadTask = Store;
      UP.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        console.log('File available at', downloadURL);
        aa = downloadURL;
      });
    }, 5000);

    setTimeout(() => {
      this.ShiperInfo.NICfrontLink = aa;
      alert(this.ShiperInfo.NICfrontLink);

    }, 10000);

  }

  onFileChanged2(param) {
    var aa;
    const file: File = param.target.files[0];

    const metaData = { 'contentType': file.type };
    const StorageRef: firebase.storage.Reference = firebase.storage().ref('/photos/' + file.name);
    const Store = StorageRef.put(file, metaData);

    setTimeout(() => {
      const UP: firebase.storage.UploadTask = Store;
      UP.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        console.log('File available at', downloadURL);
        aa = downloadURL;
      });
    }, 5000);

    setTimeout(() => {
      this.ShiperInfo.NICbackLink = aa;

      alert(this.ShiperInfo.NICbackLink);
    }, 10000);

  }

  onFileChanged3(param) {
    var aa;
    const file: File = param.target.files[0];

    const metaData = { 'contentType': file.type };
    const StorageRef: firebase.storage.Reference = firebase.storage().ref('/photos/' + file.name);
    const Store = StorageRef.put(file, metaData);

    setTimeout(() => {
      const UP: firebase.storage.UploadTask = Store;
      UP.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        console.log('File available at', downloadURL);
        aa = downloadURL;
      });
    }, 5000);

    setTimeout(() => {
      this.ShiperInfo.DocumentLink = aa;

      // alert(this.ShiperInfo.DocumentLink);
    }, 10000);

  }

  updateOldShipper() {

    var test = {
      cityPricingInfo: this.ShiperInfo.cityPricingInfo
    }
    this.database.list("/Shiper/").update(this.ShiperKey,
      test
    ).then(data => {
      alert("Updated");
    })

  }

  BtnSaveClick(ShiperInfo) {

    let ID: string = new Date().getTime().toString();
    ShiperInfo.ShiperID = "LS-" + ID.substring(ID.length - 6);
    // alert(ShiperInfo.ShiperID)


    if (this.ShiperKey == "") {
      let info;
      let key;
      var ref = firebase.database().ref().child('UserLogin');
      ref.orderByChild('UserName').startAt(this.ShiperInfo.UserName).endAt(this.ShiperInfo.UserName).on('child_added', function (result) {
        info = result.val();
        key = result.key;
      })
      setTimeout(() => {

        if (info == undefined) {


          if (this.ShiperInfo.CompanyName == "" || this.ShiperInfo.OwnerName == "" || this.ShiperInfo.CNICNumber == "" || this.ShiperInfo.City == "" ||
            this.ShiperInfo.Location == "" || this.ShiperInfo.PickupAddress == "" || this.ShiperInfo.CompanyPhone == "" || this.ShiperInfo.MobileNumber1 == "" || this.ShiperInfo.BusinessName == "" ||
            this.ShiperInfo.NatureofBusiness == "" || this.ShiperInfo.UserName == "" || this.ShiperInfo.Password == "" || this.ShiperInfo.BillingAddress == ""
          ) {
            this.toastr.show('<span class="now-ui-icons ui-1_bell-53"></span> Some Fields are required!', '', {
              timeOut: 8000,
              closeButton: true,
              enableHtml: true,
              toastClass: "alert alert-danger alert-with-icon",
            });
          }
          else {
            this.SaveData(ShiperInfo);
          }


        } else {

          this.toastr.show('<span class="now-ui-icons ui-1_bell-53"></span> Username has been already taken ', '', {
            timeOut: 8000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-danger alert-with-icon",
          });

        }


      }, 500);
    }

    else {
      if (this.ShiperInfo.CompanyName == "" || this.ShiperInfo.OwnerName == "" || this.ShiperInfo.CNICNumber == "" || this.ShiperInfo.NTNNumber == "" || this.ShiperInfo.CompanyEmail == "" ||
        this.ShiperInfo.Location == "" || this.ShiperInfo.PickupAddress == "" || this.ShiperInfo.CompanyPhone == "" || this.ShiperInfo.MobileNumber1 == "" || this.ShiperInfo.BusinessName == "" ||
        this.ShiperInfo.NatureofBusiness == "" || this.ShiperInfo.UserName == "" || this.ShiperInfo.Password == "" || this.ShiperInfo.BillingAddress == "") {
        this.toastr.show('<span class="now-ui-icons ui-1_bell-53"></span> Some Fields are required!', '', {
          timeOut: 8000,
          closeButton: true,
          enableHtml: true,
          toastClass: "alert alert-danger alert-with-icon",
        });
      }
      else {
        this.SaveData(ShiperInfo);
      }
    }







  }

  SaveData(param) {

    if (this.ShiperKey == "") {
      this.database.list("/Shiper/").push(
        param
      ).then(data => {
        this.database.list("/UserLogin/").push(
          {
            ShiperKey: data.key,
            Password: param.Password,
            isAdmin: 1,
            UserName: param.UserName,
            isActive: param.IsActive
          }
        ).then(data => {
          this.Reset();
          this.router.navigate(['/Logistic/ShiperList']);
          this.toastr.show('<span class="now-ui-icons ui-1_bell-53"></span> Yor Data Has Been Saved', '', {
            timeOut: 8000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-success alert-with-icon",
          });
        })
      })

    } else {

      this.database.list("/Shiper/").update(this.ShiperKey,
        param
      ).then(data => {


        this.database.list("/UserLogin/").update(this.ShiperLoginKey,
          {
            Password: param.Password,
            isAdmin: 1,
            UserName: param.UserName,
            isActive: param.IsActive
          }
        ).then(data => {

          this.Reset();
          if (this.logerInfo.isAdmin != 1) {
            this.router.navigate(['/Logistic/ShiperList']);
          } else {
            this.router.navigate(['/Login']);
          }
          this.toastr.show('<span class="now-ui-icons ui-1_bell-53"></span> Yor Data Has Been Updated Sucessfully', '', {
            timeOut: 8000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-success alert-with-icon",
          });
        })
      })
    }



  }

}
