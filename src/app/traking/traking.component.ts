import { Component, OnInit } from '@angular/core';
import { HelperService } from "app/helper.service";
import { AngularFireDatabase } from "@angular/fire/database";
import * as firebase from "firebase";
import * as XLSX from 'ts-xlsx';
import { ExcelService } from 'app/excel.service';
import { Router } from '@angular/router';
import { BlueExServicesService } from 'app/blue-ex-services.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-traking',
  templateUrl: './traking.component.html',
  styleUrls: ['./traking.component.scss']
})
export class TrakingComponent implements OnInit {

  SearchKey = ""
  Search_Data = {};
  isShow = false;
  Status = {
    OrderBooked: false,
    ArrivedatStation: false,
    ReadytoDispatch: false,
    ArrivedatLocation: false,
    CallNotResponse: false,
    Delivered: false,
    UnDelivered: false,
    UnTrackAble: false,
    MarkasReturn: false
  }

  logerInfo: any;
  bookingList = [];
  originalBookingList = [];

  constructor(private toastr: ToastrService, private ngxService: NgxUiLoaderService, private database: AngularFireDatabase, private objBlueExServices: BlueExServicesService, private Helper: HelperService, private excelService: ExcelService, private router: Router) {

    let guard = this.Helper.getUserGuardPrivilages(this.router.url);
    if (guard) {

    } else {
      this.router.navigate(['/Logistic/Error']);
    }

    this.logerInfo = JSON.parse(sessionStorage.getItem('UserInfo'));
    let test = this.getcurrentDateTime();
    this.FetchData();
  }



  test() {

  }

  blueExStatusUpdate(booking, index) {


    this.ngxService.start(); // start foreground spinner of the master loader with 'default' taskId
    this.objBlueExServices.blueExstatus(booking).subscribe(data => {

      // if (data.response == "Received") {
      //   this.bookingList[index].ArrivedatStation = true;
      //   this.bookingList[index].ArrivedDate = this.bookingList[index].ArrivedatStation ? this.getcurrentDateTime() : "";
      // } else if (data.response == "In Transit") {
      //   this.bookingList[index].ReadyToDispatch = true;
      //   this.bookingList[index].ReadyToDispatchDate = this.bookingList[index].ArrivedatStation ? this.getcurrentDateTime() : "";
      // } else if (data.response == "Out For Delivery") {
      //   this.bookingList[index].Dispacthed = true;
      //   this.bookingList[index].DispacthedDate = this.bookingList[index].Dispacthed ? this.getcurrentDateTime() : "";
      // } else if (data.response == "Delivered") {
      //   this.bookingList[index].Delivered = true;
      //   this.bookingList[index].DeliveredDate = this.bookingList[index].Delivered ? this.getcurrentDateTime() : "";
      // } else if (data.response == "Returned") {
      //   this.bookingList[index].ReturnToShiper = true;
      //   this.bookingList[index].ReturnToShiperDate = this.bookingList[index].ReturnToShiper ? this.getcurrentDateTime() : "";
      // }

      this.objBlueExServices.blueExstatusTime(booking).subscribe(data => {

      }, error => {

        console.clear();
        console.log(error);
        this.ngxService.stop();

      })


      this.copyMessage("blueEx status has been fetched press updated status to complete the process");

      //  
      this.ngxService.stop();
    }, error => {

      console.clear();
      console.log(error);
      this.ngxService.stop();

    })

    // this.objBlueExServices.getStatus(booking).subscribe(data => {
    //   this.ngxService.stop();
    //    
    //   alert("Sucesss");
    // }, error => {
    //   this.ngxService.stop();
    //   console.clear();
    //   console.log(error);
    // })
  }

  ngOnInit() {
  }

  copyMessage(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    this.toastr.show('<span class="now-ui-icons ui-1_bell-53"></span>' + val, '', {
      timeOut: 2000,
      closeButton: true,
      enableHtml: true,
      toastClass: "alert alert-success alert-with-icon",
    });

  }

  title = 'excel';

  selectStatus(index, statusType, data) {

    if (statusType == 'arrive') {
      this.bookingList[index].ArrivedDate = this.bookingList[index].ArrivedatStation ? this.getcurrentDateTime() : "";
    } else if (statusType == 'ReadyToDispatch') {
      this.bookingList[index].ReadyToDispatchDate = this.bookingList[index].ReadyToDispatch ? this.getcurrentDateTime() : "";
    } else if (statusType == 'Dispacthed') {
      this.bookingList[index].DispacthedDate = this.bookingList[index].Dispacthed ? this.getcurrentDateTime() : "";
    } else if (statusType == 'CallNotResponse') {
      this.bookingList[index].CallNotResponseDate = this.bookingList[index].CallNotResponse ? this.getcurrentDateTime() : "";
    } else if (statusType == 'Delivered') {
      this.bookingList[index].DeliveredDate = this.bookingList[index].Delivered ? this.getcurrentDateTime() : "";
    } else if (statusType == 'Refused') {
      this.bookingList[index].RefusedDate = this.bookingList[index].Refused ? this.getcurrentDateTime() : "";
    } else if (statusType == 'ReAttempRequest') {
      this.bookingList[index].ReAttempRequestDate = this.bookingList[index].ReAttempRequest ? this.getcurrentDateTime() : "";
    } else if (statusType == 'MarkAsReturn') {
      this.bookingList[index].MarkAsReturnDate = this.bookingList[index].MarkAsReturn ? this.getcurrentDateTime() : "";
    } else if (statusType == 'ReturnToShiper') {
      this.bookingList[index].ReturnToShiperDate = this.bookingList[index].ReturnToShiper ? this.getcurrentDateTime() : "";
    } else if (statusType == 'CancelBooking') {
      this.bookingList[index].isCencleDate = this.bookingList[index].isCencle ? this.getcurrentDateTime() : "";
    }
  }

  // Import Excel
  arrayBuffer: any;
  file: File;
  incomingfile(event) {
    this.file = event.target.files[0];
    this.ImportExcel();
  }

  ListArray = [];
  ImportExcel() {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      // console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
      this.ListArray = XLSX.utils.sheet_to_json(worksheet, { raw: true });

      this.saveImportedProducts(this.ListArray);
    }


    fileReader.readAsArrayBuffer(this.file);

  }

  getcurrentDateTime() {
    let DATE = new Date().toLocaleDateString();
    let TIME = new Date().toLocaleTimeString();
    return DATE + " " + TIME + "Z";
  }

  saveImportedProducts(bookingData) {
    this.isShow = false;
    console.clear();
    bookingData.forEach(objBooking => {

      if (objBooking.isCheck) {
        delete objBooking.isCheck;  // or delete person["age"];
        this.database.list('/Booking/').update(objBooking.BookingKey, objBooking);
      }
    });
  }

  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.bookingList, 'sample');
  }

  updateStatus() {
    this.bookingList.forEach(element => {
      this.database.list('/Booking/').update(element.BookingKey, element);
    });
    this.isShow = false;
  }

  search(param) {
    if (param == "") {
      this.bookingList = this.originalBookingList;
    } else {
      this.isShow = true
      var searchArray = param.split(',');
      this.bookingList = [];
      searchArray.forEach(element => {
        let check = this.originalBookingList.find(data => data.BookingID == element);
        if (check != undefined) {
          this.bookingList.push(check);
        }
      });
    }
  }

  FetchData() {
    this.database.object('Booking').valueChanges().subscribe(data => {
      let SubArr = Object.keys(data);
      this.bookingList = [];
      for (var loop = 0; loop < SubArr.length; loop++) {
        const object2 = Object.assign({ BookingKey: SubArr[loop] }, data[SubArr[loop]]);
        // if (!object2.isCencle) {
        this.bookingList.push(object2);
        this.originalBookingList.push(object2);
        // }
      }

      if (this.logerInfo.isAdmin == 1) {
        this.bookingList = this.bookingList.filter(data => data.ShiperID == this.logerInfo.ShiperKey);
        this.originalBookingList = this.bookingList.filter(data => data.ShiperID == this.logerInfo.ShiperKey);
      }
      this.bookingList.reverse();
      this.originalBookingList.reverse();
    })
  }

  SearchData(param) {
    var Search_Data;
    var ref = firebase.database().ref().child('Booking');
    ref.orderByChild('BookingID').startAt(param).endAt(param).on('child_added', function (snapshot) {
      snapshot.val();
      Search_Data = snapshot.val();
      // console.log(Search_Data);  
    })
    setTimeout(() => {
      this.Search_Data = Search_Data;
      this.Status.OrderBooked = Search_Data.OrderBooked
      this.Status.ArrivedatLocation = Search_Data.ArrivedAtLcation
      this.Status.CallNotResponse = Search_Data.CallNotResponse
      this.Status.Delivered = Search_Data.Delivered
      this.Status.UnDelivered = Search_Data.UnDelivered
      this.Status.UnTrackAble = Search_Data.UnTrackAble
      this.Status.MarkasReturn = Search_Data.MarkasReturn
      this.isShow = true
    }, 1000);

  }
}
