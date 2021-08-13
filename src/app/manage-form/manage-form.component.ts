import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from "@angular/fire/database";
import { ToastrService } from 'ngx-toastr';
import { Route, ActivatedRoute, Router } from "@angular/router";
import { HelperService } from "app/helper.service";
import * as firebase from "firebase";

@Component({
  selector: 'app-manage-form',
  templateUrl: './manage-form.component.html',
  styleUrls: ['./manage-form.component.scss']
})
export class ManageFormComponent implements OnInit {
  PaymentInfo = {
    PaymentID: "-1",
    ClientName: "",
    PayerName: "",
    City: "Karachi",
    cheque: "",
    Bank: "",
    Amount: 0,
    Date: "",
    PaymentMethod: "",
    LoginID: 'SK001je3',
    bookingArray: [],
    status: ""
  }

  isPaid = false;
  isCencel = false;
  SearchKey = "";
  ShiperList = [];
  SelectShiper: any;
  bookingList = [];
  originalBookingList = [];
  OriginalAllBookingList = [];
  ngOnInit(): void {
  }
  bookingListArray = [];
  logerInfo: any;
  ButtonName = "SK";
  PaymentKey = "";
  constructor(private database: AngularFireDatabase, private toastr: ToastrService, private route: ActivatedRoute, private Helper: HelperService, private router: Router) {

    let guard = this.Helper.getUserGuardPrivilages(this.router.url);
    if (guard) {

    } else {
      this.router.navigate(['/Logistic/Error']);
    }


    this.logerInfo = JSON.parse(sessionStorage.getItem('UserInfo'));
    this.PaymentInfo.LoginID = this.logerInfo.loggerKey;
    this.FetchShiperData();
    this.FetchBookigData();
    this.Reset();
  }

  FetchBookigData() {
    this.database.object('Booking').valueChanges().subscribe(data => {
      let SubArr = Object.keys(data);
      this.originalBookingList = [];
      for (var loop = 0; loop < SubArr.length; loop++) {
        const object2 = Object.assign({ BookingKey: SubArr[loop] }, data[SubArr[loop]], { isCheck: false });
        if (!object2.isCencle) {
          this.OriginalAllBookingList.push(object2);
          if (object2.Delivered && (object2.isPaid == undefined || !object2.isPaid)) {
            this.originalBookingList.push(object2);
          }
        }
      }
    })
  }

  isRadioCenceled() {
    this.isCencel = !this.isCencel;
    if (this.isCencel) {
      this.isPaid = false;
    }
  }

  updateStatus() {
    this.isCencel;
    this.isPaid;
    if (this.isPaid) {
      this.PaymentInfo.status = 'Cleared';
    } else {
      this.PaymentInfo.status = 'Cencelled';
    }
    this.database.list('/Payment/').update(this.PaymentKey, this.PaymentInfo).then(data => {

      if (this.PaymentInfo.status == 'Cencelled') {
        this.PaymentInfo.bookingArray.forEach(element => {
          this.database.list('/Booking/').update(element, {
            isPaid: false,
            isPaidDate: ""
          });
        });
      }

      this.Reset();
      this.toastr.show('<span class="now-ui-icons ui-1_bell-53"></span> Your status has been saved', '', {
        timeOut: 8000,
        closeButton: true,
        enableHtml: true,
        toastClass: "alert alert-success alert-with-icon",
      });
    })

  }

  isRadioPaid() {
    this.isPaid = !this.isPaid;
    if (this.isPaid) {
      this.isCencel = false;
    }
  }

  showShiperBookingData(shiperKey) {
    this.bookingList = this.originalBookingList.filter(data => data.ShiperID == shiperKey);
  }

  checkValue(loop, param) {
    this.bookingList[loop].isCheck = param.target.checked;
    if (param.target.checked) {

      var totalDeduction = 0;
      var deliveryCharges = parseFloat(this.bookingList[loop].DeliveryCharges);
      var gstCharges = (parseFloat(this.bookingList[loop].Amount) / 100) * parseFloat(this.SelectShiper.GST);
      var fuelCharges = (parseFloat(this.bookingList[loop].Amount) / 100) * parseFloat(this.SelectShiper.fuel);
      var otherCharges;
      if (parseFloat(this.bookingList[loop].Amount) <= 5000) {
        otherCharges = 50;
      } else if (parseFloat(this.bookingList[loop].Amount) > 5000 && parseFloat(this.bookingList[loop].Amount) <= 10000) {
        otherCharges = 100;
      } else {
        otherCharges = 150;
      }

      totalDeduction = deliveryCharges + gstCharges + fuelCharges + otherCharges;

      this.PaymentInfo.Amount = this.PaymentInfo.Amount + (parseFloat(this.bookingList[loop].Amount) - totalDeduction);
      this.bookingListArray.push(this.bookingList[loop].BookingKey);


    } else {



      var totalDeduction = 0;
      var deliveryCharges = parseFloat(this.bookingList[loop].DeliveryCharges);
      var gstCharges = (parseFloat(this.bookingList[loop].Amount) / 100) * parseFloat(this.SelectShiper.GST);
      var fuelCharges = (parseFloat(this.bookingList[loop].Amount) / 100) * parseFloat(this.SelectShiper.fuel);
      var otherCharges;
      if (parseFloat(this.bookingList[loop].Amount) <= 5000) {
        otherCharges = 50;
      } else if (parseFloat(this.bookingList[loop].Amount) > 5000 && parseFloat(this.bookingList[loop].Amount) <= 10000) {
        otherCharges = 100;
      } else {
        otherCharges = 150;
      }

      totalDeduction = deliveryCharges + gstCharges + fuelCharges + otherCharges;


      this.PaymentInfo.Amount = this.PaymentInfo.Amount - (parseFloat(this.bookingList[loop].Amount) - totalDeduction);
      let index = this.bookingListArray.findIndex(data => data == this.bookingList[loop].BookingKey);
      this.bookingListArray.splice(index, 1);
    }
  }

  FetchShiperData() {
    // alert("Shiper");
    this.database.object('Shiper').valueChanges().subscribe(data => {
      let SubArr = Object.keys(data);
      this.ShiperList = [];
      for (var loop = 0; loop < SubArr.length; loop++) {
        const object2 = Object.assign({ ShiperKey: SubArr[loop] }, data[SubArr[loop]]);
        this.ShiperList.push(object2);
      }
    })
  }

  selectShiperFunc(param) {
    param.target.value;
    this.SelectShiper = this.ShiperList.find(data => data.ShiperKey == param.target.value);
    this.showShiperBookingData(this.SelectShiper.ShiperKey);
  }

  Reset() {
    this.SearchKey = "";
    this.PaymentKey = "";
    this.PaymentInfo = {
      PaymentID: "-1",
      ClientName: "",
      PayerName: "",
      City: "Karachi",
      cheque: "",
      Bank: "",
      Amount: 0,
      Date: "",
      PaymentMethod: "",
      LoginID: 'SK001je3',
      bookingArray: [],
      status: ""
    }

    this.bookingList = [];
  }

  BtnSaveData(params) {
    let ID: string = new Date().getTime().toString();
    params.PaymentID = "LS-" + ID.substring(ID.length - 6);
    // alert(params.PaymentID)
    if (this.SelectShiper == undefined || this.PaymentInfo.PayerName == "" || this.PaymentInfo.cheque == "" || this.PaymentInfo.Bank == "" ||
      this.PaymentInfo.Amount == 0) {
      this.toastr.show('<span class="now-ui-icons ui-1_bell-53"></span> Some Fields are required!', '', {
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

  test() {
    this.PaymentInfo;
    this.bookingListArray;

  }

  SaveData(param) {

    if (this.PaymentKey == "" || this.PaymentKey == undefined) {

      param.ClientName = this.SelectShiper.CompanyName;
      param.ClientID = this.SelectShiper.ShiperKey;
      param.bookingArray = this.bookingListArray;
      this.database.list("/Payment/").push(
        param
      ).then(data => {
        param.bookingArray.forEach(element => {
          this.database.list('/Booking/').update(element, {
            isPaid: true,
            isPaidDate: ""
          });
        });

      })
      this.Reset();
      this.toastr.show('<span class="now-ui-icons ui-1_bell-53"></span> Yor Data Has Been Saved', '', {
        timeOut: 8000,
        closeButton: true,
        enableHtml: true,
        toastClass: "alert alert-success alert-with-icon",
      });

    }
    else {
      // alert(this.UserKey);
      console.log(param);

      this.database.list('/Payment/').update(this.PaymentKey, {
        ClientName: this.PaymentInfo.ClientName,
        PayerName: this.PaymentInfo.PayerName,
        City: this.PaymentInfo.City,
        cheque: this.PaymentInfo.cheque,
        Bank: this.PaymentInfo.Bank,
        Amount: this.PaymentInfo.Amount,
        Date: this.PaymentInfo.Date,
        PaymentMethod: this.PaymentInfo.PaymentMethod,
        LoginID: 'SK001je5'
      })
      this.Reset();
      this.toastr.show('<span class="now-ui-icons ui-1_bell-53"></span> Yor Data Has Been Update', '', {
        timeOut: 8000,
        closeButton: true,
        enableHtml: true,
        toastClass: "alert alert-success alert-with-icon",
      });
    }


  }

  SearchData(param) {
    let data;
    let key;
    var ref = firebase.database().ref().child('Payment');
    ref.orderByChild('cheque').startAt(param).endAt(param).on('child_added', function (result) {
      data = result.val();
      key = result.key;
    })
    setTimeout(() => {
      this.PaymentInfo = data;
      if (this.PaymentInfo.status != "Cencelled") {
        this.PaymentKey = key;
        this.bookingList = [];
        data.bookingArray.forEach(element => {
          this.bookingList.push(this.OriginalAllBookingList.find(info => info.BookingKey == element));

        });
      } else {
        this.Reset();
        this.toastr.show('<span class="now-ui-icons ui-1_bell-53"></span> Your cheaque has been cencelled', '', {
          timeOut: 8000,
          closeButton: true,
          enableHtml: true,
          toastClass: "alert alert-danger alert-with-icon",
        });
      }
    }, 500);


  }


}
