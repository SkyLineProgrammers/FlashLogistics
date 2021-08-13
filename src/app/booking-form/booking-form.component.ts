import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from "@angular/fire/database";
import { ToastrService } from 'ngx-toastr';
import { Route, ActivatedRoute, Router } from "@angular/router";
import { HelperService } from "app/helper.service";
import * as XLSX from 'ts-xlsx';
import { ExcelService } from 'app/excel.service';
import { BlueExServicesService } from 'app/blue-ex-services.service';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.scss']
})
export class BookingFormComponent implements OnInit {
  selectedEmployee: any;
  empInfo = [{
    StatusName: "Yes"
  },
  {
    StatusName: "No"
  }
  ]
  ngOnInit(): void {


  }

  BookingInfo = {
    BookingID: "-1",
    ShiperID: "",
    Origin: "Karachi",
    DestinationCountry: "Pakistan",
    DestinationCity: "",
    ConsigneeName: "",
    ConsigneeContact: "",
    ConsigneeEmail: "",
    ConsigneeAdress: "",
    Pieces: "",
    Weight: "",
    CustomerRef: "",
    Amount: "",
    ProductDetail: "",
    Fragile: "No",
    Remarks: "",
    OrderBooked: true,
    BookedDate: "",
    ArrivedatStation: false,
    ArrivedDate: "",
    ReadyToDispatch: false,
    ReadyToDispatchDate: "",
    Dispacthed: false,
    DispacthedDate: "",
    CallNotResponse: false,
    CallNotResponseDate: "",
    Delivered: false,
    DeliveredDate: "",
    Refused: false,
    RefusedDate: "",
    ReAttempRequest: false,
    ReAttempRequestDate: "",
    MarkAsReturn: false,
    MarkAsReturnDate: "",
    ReturnToShiper: false,
    ReturnToShiperDate: "",
    isRiderAssign: false,
    isCencle: false,
    isCencleDate: ""
  }
  ButtonName = "SK";
  BookingKey = "";
  BookingBtn = "Add Booking";
  logerInfo: any;
  cityList = [];
  SelectShiper: any;

  constructor(private objBlueExServices: BlueExServicesService, private database: AngularFireDatabase, private router: Router, private toastr: ToastrService, private route: ActivatedRoute, private Helper: HelperService) {




    let guard = this.Helper.getUserGuardPrivilages(this.router.url);
    if (guard) {

    } else {
      this.router.navigate(['/Logistic/Error']);
    }

    this.FetchCityData();

    this.logerInfo = JSON.parse(sessionStorage.getItem("UserInfo"));
    this.shipperInfo(this.logerInfo.ShiperKey);

    let data = JSON.parse(sessionStorage.getItem("BookingInformation"));
    sessionStorage.removeItem('BookingInformation');
    if (data == undefined) {
      this.Reset();
    } else {
      this.BookingBtn = "update Booking"
      this.BookingInfo = data;
      this.BookingKey = data.BookingKey;
    }

  }

  shipperInfo(key) {
    this.database.object('Shiper/' + key).valueChanges().subscribe(data => {
      if (data != null) {
        this.SelectShiper = data;
      }
    })
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

  calculateDeliveryCharges(data) {

    let cityZone = this.cityList.find(abc => abc.cityName == data.DestinationCity).Zone;
    if (cityZone == undefined) {

    } else {

      let weigthAmountOne;
      let weigthAmountHalf;
      let weigthAmountIncludingOne;

      //  weigthAmountOne = this.SelectShiper.weigthAmountOne;
      //  weigthAmountHalf = this.SelectShiper.weigthAmountHalf;
      //  weigthAmountIncludingOne = this.SelectShiper.weigthAmountIncludingOne;


      if (this.SelectShiper.City.toString().toLowerCase() == data.DestinationCity.toString().toLowerCase()) {

        weigthAmountOne = this.SelectShiper.cityPricingInfo[1].zoneA;
        weigthAmountHalf = this.SelectShiper.cityPricingInfo[0].zoneA;;
        weigthAmountIncludingOne = this.SelectShiper.cityPricingInfo[2].zoneA;

      }

      else if (this.cityList.find(loop => loop.cityName == data.DestinationCity).Zone == "B") {

        weigthAmountOne = this.SelectShiper.cityPricingInfo[1].zoneB;
        weigthAmountHalf = this.SelectShiper.cityPricingInfo[0].zoneB;;
        weigthAmountIncludingOne = this.SelectShiper.cityPricingInfo[2].zoneB;

      } else {

        weigthAmountOne = this.SelectShiper.cityPricingInfo[1].zoneC;
        weigthAmountHalf = this.SelectShiper.cityPricingInfo[0].zoneC;;
        weigthAmountIncludingOne = this.SelectShiper.cityPricingInfo[2].zoneC;

      }




      let totalDeliveryCharges = 0;
      if (data.Weight == 1) {
        totalDeliveryCharges = parseFloat(weigthAmountOne);
        return totalDeliveryCharges;
      } else if (data.Weight == 0.5) {
        totalDeliveryCharges = parseFloat(weigthAmountHalf);
        return totalDeliveryCharges;
      } else {
        let excludingWeight = parseFloat(data.Weight) - 1;
        let amount = (excludingWeight * weigthAmountIncludingOne) + parseFloat(weigthAmountOne);
        amount = amount;
        return amount;
      }
    }

  }

  BtnSaveBlueEx() {
    this.objBlueExServices.saveBlueExOrder("123").subscribe(data => {

    }, error => {

    })
  }

  selectionComboCity(param) {
    this.BookingInfo.DestinationCity = param.target.value;
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
    fileReader.onload = async (e) => {
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
      // await this.saveImportedProducts(this.ListArray);
      this.toastr.show('<span class="now-ui-icons ui-1_bell-53"></span> Uploading ...... ', '', {
        timeOut: 4900,
        closeButton: true,
        enableHtml: true,
        toastClass: "alert alert-success alert-with-icon",
      });
      let loop = await this.getHero(this.ListArray);
      setTimeout(() => {
        this.toastr.show('<span class="now-ui-icons ui-1_bell-53"></span> Booking uploded sucessfully', '', {
          timeOut: 3000,
          closeButton: true,
          enableHtml: true,
          toastClass: "alert alert-success alert-with-icon",
        });
      }, 5000);
      // this.getHero(this.ListArray).then(data => {
      //    
      //   alert("Booking uploded sucessfully");
      // })
    }

    fileReader.readAsArrayBuffer(this.file);

  }

  getHero(bookingData: any) {

    var test = [];

    return new Promise<any>((resolve, reject) => {
      console.clear();
      let Id = "";
      let length = bookingData.length;
      let loopLengh = 0;
      bookingData.forEach(objBooking => {
        loopLengh++;
        if (objBooking.isCheck) {
          setTimeout(async () => {
            objBooking.DeliveryCharges = await this.calculateDeliveryCharges(objBooking);
            objBooking.ArrivedDate = "";
            objBooking.ArrivedatStation = false;
            objBooking.CallNotResponse = false;
            objBooking.CallNotResponseDate = ""
            objBooking.Delivered = false;
            objBooking.DeliveredDate = "";
            objBooking.Dispacthed = false;
            objBooking.DispacthedDate = "";
            objBooking.MarkAsReturn = false;
            objBooking.MarkAsReturnDate = ""
            objBooking.OrderBooked = true;
            objBooking.ReAttempRequest = false;
            objBooking.ReAttempRequestDate = "";
            objBooking.ReadyToDispatch = false;
            objBooking.ReadyToDispatchDate = "";
            objBooking.Refused = false;
            objBooking.RefusedDate = "";
            objBooking.ReturnToShiper = false;
            objBooking.ReturnToShiperDate = "";
            objBooking.isRiderAssign = false;
            objBooking.isCencle = false;
            objBooking.isCencleDate = "";
            objBooking.ShiperID = this.logerInfo.ShiperKey;
            objBooking.BookedDate = this.getcurrentDateTime();
            let ID: string = new Date().getTime().toString();
            let math = Math.random() + "";
            objBooking.BookingID = "FX-" + ID.substring(ID.length - 4) + math.split(".")[1].substring(math.split(".")[1].length - 5);
            delete objBooking.isCheck;  // or delete person["age"];
            delete objBooking.BookingKey;  // or delete person["age"];
            // test.push(objBooking);

            this.database.list('/Booking/').push(objBooking).then(data => {
              console.log("Uploaded");
            })
          }, 500);
        }
      });
      resolve(true);
    });
  }

  // testing() new Promise<string>((resolve, reject) => { });

  saveImportedProducts(bookingData) {

  }
  // Import Excel

  getcurrentDateTime() {


    // Future Problem
    //  
    // let DATE = new Date().toLocaleString().split(", ")[0];
    // let TIME = new Date().toLocaleString().split(", ")[1];
    // return DATE + " " + TIME;

    // toISOString ye london ka time utha ke larhi hain masla hain aage dhkenge isko 

    let DATE = new Date().toISOString().split('T')[0];
    let TIME = new Date().toISOString().split('T')[1];
    return DATE + " " + TIME;
  }

  Reset() {

    this.BookingBtn = "Add Booking";
    this.BookingInfo = {
      BookingID: "-1",
      ShiperID: this.logerInfo.ShiperKey,
      Origin: "Karachi",
      DestinationCountry: "Pakistan",
      DestinationCity: "Karachi",
      ConsigneeName: "",
      ConsigneeContact: "",
      ConsigneeEmail: "",
      ConsigneeAdress: "",
      Pieces: "",
      Weight: "",
      CustomerRef: "",
      Amount: "",
      ProductDetail: "",
      Fragile: "No",
      Remarks: "",
      OrderBooked: true,
      BookedDate: "",
      ArrivedatStation: false,
      ArrivedDate: "",
      ReadyToDispatch: false,
      ReadyToDispatchDate: "",
      Dispacthed: false,
      DispacthedDate: "",
      CallNotResponse: false,
      CallNotResponseDate: "",
      Delivered: false,
      DeliveredDate: "",
      Refused: false,
      RefusedDate: "",
      ReAttempRequest: false,
      ReAttempRequestDate: "",
      MarkAsReturn: false,
      MarkAsReturnDate: "",
      ReturnToShiper: false,
      ReturnToShiperDate: "",
      isRiderAssign: false,
      isCencle: false,
      isCencleDate: ""
    }

  }

  statusSelected(param) {

    this.BookingInfo.Fragile = param.target.value;
  }

  BtnSaveData(param) {

    let ID: string = new Date().getTime().toString();
    let math = Math.random() + "";
    param.BookingID = "FX-" + ID.substring(ID.length - 4) + math.split(".")[1].substring(math.split(".")[1].length - 5);
    // param.BookingID = "FX-" + ID.substring(ID.length - 6);
    param.BookedDate = this.getcurrentDateTime();
    if (this.BookingInfo.Pieces == "") {
      this.BookingInfo.Pieces = "1";
    }
    if (this.BookingInfo.DestinationCountry == "" || this.BookingInfo.DestinationCity == "" || this.BookingInfo.Origin == "" || this.BookingInfo.ConsigneeName == "" || this.BookingInfo.ConsigneeContact == "" || this.BookingInfo.ConsigneeAdress == "" || this.BookingInfo.Weight == "" || this.BookingInfo.CustomerRef == "" || this.BookingInfo.Amount == "" || this.BookingInfo.Fragile == "") {
      this.toastr.show('<span class="now-ui-icons ui-1_bell-53"></span> Some Fields are required!', '', {
        timeOut: 8000,
        closeButton: true,
        enableHtml: true,
        toastClass: "alert alert-danger alert-with-icon",
      });
    }
    else {
      this.SaveData(param);
    }
  }

  async SaveData(param) {

    if (this.BookingKey == "") {

      param.DeliveryCharges = await this.calculateDeliveryCharges(param);

      this.database.list("/Booking/").push(
        param
      );
    } else {
      this.database.list('/Booking/').update(this.BookingKey, param);
    }


    this.Reset();
    this.toastr.show('<span class="now-ui-icons ui-1_bell-53"></span> Your Data Has Been Saved', '', {
      timeOut: 8000,
      closeButton: true,
      enableHtml: true,
      toastClass: "alert alert-success alert-with-icon",
    });

  }

}
