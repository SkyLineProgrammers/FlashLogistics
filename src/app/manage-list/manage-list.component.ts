import { Component, OnInit, HostListener } from '@angular/core';
import { AngularFireDatabase } from "@angular/fire/database";
import { HelperService } from "app/helper.service";
import * as firebase from "firebase";
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-list',
  templateUrl: './manage-list.component.html',
  styleUrls: ['./manage-list.component.scss']
})
export class ManageListComponent implements OnInit {

  manageList: any = [];
  logerInfo: any;
  originalBookingList = [];
  bookingList = [];
  PaymentInfo: any;
  isPrintShow = false;
  ShiperList = [];
  printShiperInfo: any;
  PrintGrandTotal = 0;


  constructor(private database: AngularFireDatabase, private Helper: HelperService, private toastr: ToastrService, private router: Router) {
    this.logerInfo = JSON.parse(sessionStorage.getItem('UserInfo'));

    let guard = this.Helper.getUserGuardPrivilages(this.router.url);
    if (guard) {

    } else {
      this.router.navigate(['/Logistic/Error']);
    }
    this.FetchData();
    this.FetchBookigData();
    this.FetchShiperData();
  }

  FetchShiperData() {
    this.database.object('Shiper').valueChanges().subscribe(data => {
      let SubArr = Object.keys(data);
      this.ShiperList = [];
      for (var loop = 0; loop < SubArr.length; loop++) {
        const object2 = Object.assign({ ShiperKey: SubArr[loop] }, data[SubArr[loop]]);
        this.ShiperList.push(object2);
      }
      this.ShiperList.reverse();
    })
  }

  ngOnInit() {
  }

  printDiv(divName) {

    var printContents = document.getElementById(divName).innerHTML;
    var originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;

    window.print();

    document.body.innerHTML = originalContents;

  }

  FetchBookigData() {
    this.database.object('Booking').valueChanges().subscribe(data => {
      let SubArr = Object.keys(data);
      this.originalBookingList = [];
      for (var loop = 0; loop < SubArr.length; loop++) {
        const object2 = Object.assign({ BookingKey: SubArr[loop] }, data[SubArr[loop]], { isCheck: false });
        if (!object2.isCencle) {
          if (object2.isPaid || !object2.isPaid) {
            this.originalBookingList.push(object2);
          }
        }

      }

      if (this.logerInfo.isAdmin == 1) {
        this.originalBookingList = this.originalBookingList.filter(data => data.ShiperID == this.logerInfo.ShiperKey);
      }
    })
  }

  getcurrentDateTime() {
    let DATE = new Date().toLocaleDateString();
    let TIME = new Date().toLocaleTimeString();
    return DATE;
  }

  printSummary(param) {
    let data;
    let key;
    var ref = firebase.database().ref().child('Payment');
    ref.orderByChild('cheque').startAt(param.cheque).endAt(param.cheque).on('child_added', function (result) {
      data = result.val();
      key = result.key;
    })
    setTimeout(() => {
      this.PaymentInfo = data;
      if (this.PaymentInfo.status != "Cencelled") {

        this.printShiperInfo = this.ShiperList.find(shiperData => shiperData.ShiperKey == this.PaymentInfo.ClientID);

        this.isPrintShow = true;
        this.bookingList = [];
        data.bookingArray.forEach(element => {
          this.bookingList.push(this.originalBookingList.find(info => info.BookingKey == element));
        });
        this.Helper.isShowSideMenu = false;

        this.bookingList.forEach(element => {
          this.PrintGrandTotal = this.PrintGrandTotal + parseFloat(element.Amount);
        });



        setTimeout(() => {
          this.printDiv('printSummaryPopUp');
        }, 1000);


      } else {
        this.toastr.show('<span class="now-ui-icons ui-1_bell-53"></span> Your cheaque has been cencelled', '', {
          timeOut: 8000,
          closeButton: true,
          enableHtml: true,
          toastClass: "alert alert-danger alert-with-icon",
        });
      }



    }, 500);
  }

  FetchData() {
    this.database.object('Payment').valueChanges().subscribe(data => {
      let SubArr = Object.keys(data);
      this.manageList = [];
      for (var loop = 0; loop < SubArr.length; loop++) {
        const object2 = Object.assign({ ManageId: SubArr[loop] }, data[SubArr[loop]]);

        if (this.logerInfo.isAdmin == 1) {
          if (this.logerInfo.ShiperKey == object2.ClientID) {
            this.manageList.push(object2);
          }
        } else {
          this.manageList.push(object2);
        }
      }
      this.manageList.reverse();
    })
  }

  @HostListener("window:afterprint", [])
  onWindowAfterPrint() {
    window.location.reload();
  }

}
