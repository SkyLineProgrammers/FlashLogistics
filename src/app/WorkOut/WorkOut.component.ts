import { Component, OnInit, HostListener } from '@angular/core';
import { AngularFireDatabase } from "@angular/fire/database";
import { HelperService } from "app/helper.service";
import * as firebase from "firebase";
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-WorkOut',
  templateUrl: './WorkOut.component.html',
  styleUrls: ['./WorkOut.component.scss']
})
export class WorkOutListComponent implements OnInit {



  WorkoutType = [{
    StatusName: "Pick"
  },
  {
    StatusName: "Dispatch"
  },
  ]

  SelectWorkOutType: any;
  SelectShiper: any;
  SelectRider: any;
  selectedRiderName = "";
  PickBookingList: any = [];
  DeliverBookingList: any = [];
  RiderCombo = [];
  PickListCheck = false
  DeliverListCheck = false
  DeliveryCharges = 0;
  ShiperList = [];
  cityList = [];
  printList = [];
  isPrintView = false;
  isPrintCODamount = 0;
  workOutType = "";

  constructor(private database: AngularFireDatabase, private Helper: HelperService, private toastr: ToastrService, private router: Router) {

    let guard = this.Helper.getUserGuardPrivilages(this.router.url);
    if (guard) {

    } else {
      this.router.navigate(['/Logistic/Error']);
    }

    this.FetchShiperData();
    this.FetchRider();
    this.FetchCityData();
  }

  selectShiperFunc(param) {
    param.target.value;
    this.SelectShiper = this.ShiperList.find(data => data.ShiperKey == param.target.value);
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

  selectAllPick(param) {
    if (param.target.checked) {
      this.PickBookingList.forEach(element => {
        element.isChecked = true;
      });
    } else {
      this.PickBookingList.forEach(element => {
        element.isChecked = false;
      });
    }
  }


  selectAllDeliver(param) {
    if (param.target.checked) {
      this.DeliverBookingList.forEach(element => {
        element.isChecked = true;
      });
    } else {
      this.DeliverBookingList.forEach(element => {
        element.isChecked = true;
      });
    }
  }

  deleteBookings() {
    this.database.object('Booking').valueChanges().subscribe(data => {
      let SubArr = Object.keys(data);
      for (var loop = 0; loop < SubArr.length; loop++) {
        if (data[SubArr[loop]].BookingID != "AL-653690") {
          this.database.list('/Booking/').remove(SubArr[loop]);
        }
      }
    })

  }

  openPrint() {
    var printContents = document.getElementById('PrintDiv').innerHTML;
    var originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  }

  @HostListener("window:afterprint", [])
  onWindowAfterPrint() {
    window.location.reload();
  }

  closePrint() {
    this.isPrintView = false;
  }

  chngesinDB() {
    this.database.object('Booking').valueChanges().subscribe(data => {
      let SubArr = Object.keys(data);

      for (var loop = 0; loop < SubArr.length; loop++) {
        if (data[SubArr[loop]].RiderKey != undefined) {
          this.database.list('/Booking/').update(SubArr[loop], {
            isRiderAssign: true,
          });
        } else {
          this.database.list('/Booking/').update(SubArr[loop], {
            isRiderAssign: false,
          });
        }
      }
    })
  }

  printRiderList() {
    this.isPrintView = true;
    this.selectedRiderName = this.RiderCombo.find(data => data.RiderId == this.SelectRider).RiderName;
    let DeliveryCharges = 0;

    if (this.PickListCheck) {
      this.PickBookingList.forEach(element => {

        if (element.isChecked) {
          if (element.DeliveryCharges != undefined) {
            DeliveryCharges = element.DeliveryCharges;
          } else {
            element.DeliveryCharges = 0;
          }
          this.isPrintCODamount = this.isPrintCODamount + parseFloat(element.Amount);
          element.COD = parseFloat(element.Amount) + parseFloat(DeliveryCharges.toString())
          // const object2 = Object.assign({ element, COD:  });
          this.printList.push(element);
        }
      });
    } else {
      this.DeliverBookingList.forEach(element => {

        if (element.isChecked) {
          if (element.DeliveryCharges != undefined) {
            DeliveryCharges = element.DeliveryCharges;
          } else {
            element.DeliveryCharges = 0;
          }
          this.isPrintCODamount = this.isPrintCODamount + parseFloat(element.Amount);
          element.COD = parseFloat(element.Amount) + parseFloat(DeliveryCharges.toString())
          // const object2 = Object.assign({ element, COD:  });
          this.printList.push(element);
        }
      });
    }



  }

  ngOnInit() {
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

  FetchPickData() {
    console.log(this.SelectShiper);
    this.database.object('Booking').valueChanges().subscribe(data => {
      let SubArr = Object.keys(data);
      this.PickBookingList = [];
      for (var loop = 0; loop < SubArr.length; loop++) {
        if (this.SelectShiper.ShiperKey == data[SubArr[loop]].ShiperID && data[SubArr[loop]].OrderBooked == true && data[SubArr[loop]].ArrivedatStation == false && data[SubArr[loop]].isRiderAssign == false) {
          const object2 = Object.assign({ Key: SubArr[loop] }, data[SubArr[loop]], { isChecked: false });
          if (!object2.isCencle) {
            object2.Zone = this.cityList.find(abc => abc.cityName == object2.DestinationCity).Zone;
            if (object2.Zone == this.SelectShiper.City) {
              object2.Zone = "A";
            }
            this.PickBookingList.push(object2);
          }
        }
      }
      this.PickBookingList.reverse();
    })
  }

  checkValueForPick(loop, param) {
    this.PickBookingList[loop].isChecked = param.target.checked;
  }

  checkValueForDeliver(loop, param) {
    // var sk = this.DeliverBookingList;
    //  
    this.DeliverBookingList[loop].isChecked = param.target.checked;
  }



  // Zone Prices Calculation

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

  FetchDeliverData() {
    this.database.object('Booking').valueChanges().subscribe(data => {
      let SubArr = Object.keys(data);
      this.DeliverBookingList = [];
      for (var loop = 0; loop < SubArr.length; loop++) {
        // Ask question to LARAIB about ready to dipatched - true or false
        if (this.SelectShiper.ShiperKey == data[SubArr[loop]].ShiperID && data[SubArr[loop]].OrderBooked == true && data[SubArr[loop]].ArrivedatStation == true && data[SubArr[loop]].ReadyToDispatch == false) {
          if (data[SubArr[loop]].DeliveryCharges == 0) {
            const object2 = Object.assign({ Key: SubArr[loop] }, data[SubArr[loop]], { isChecked: false }, { DeliveryCharges: this.calculateDeliveryCharges(data[SubArr[loop]]) });
            if (!object2.isCencle) {
              object2.Zone = this.cityList.find(abc => abc.cityName == object2.DestinationCity).Zone;
              if (object2.Zone == this.SelectShiper.City) {
                object2.Zone = "A";
              }
              this.DeliverBookingList.push(object2);
            }
          } else {
            const object2 = Object.assign({ Key: SubArr[loop] }, data[SubArr[loop]], { isChecked: false }, { DeliveryCharges: data[SubArr[loop]].DeliveryCharges });
            if (!object2.isCencle) {
              object2.Zone = this.cityList.find(abc => abc.cityName == object2.DestinationCity).Zone;
              if (object2.Zone == this.SelectShiper.City) {
                object2.Zone = "A";
              }
              this.DeliverBookingList.push(object2);
            }
          }
        }
      }
      this.DeliverBookingList.reverse();
    })
  }

  getcurrentDateTime() {
    let DATE = new Date().toLocaleDateString();
    let TIME = new Date().toLocaleTimeString();
    return DATE + " " + TIME + "Z";
  }

  SaveWorkOrder() {

    if (this.SelectRider == undefined) {
      this.toastr.show('<span class="now-ui-icons ui-1_bell-53"></span> Select Rider First', '', {
        timeOut: 8000,
        closeButton: true,
        enableHtml: true,
        toastClass: "alert alert-success alert-with-icon",
      });
    } else {
      var ArrayList = [];
      if (this.PickListCheck == true && this.DeliverListCheck == false) {

        for (let loop = 0; loop < this.PickBookingList.length; loop++) {
          if (this.PickBookingList[loop].isChecked == true) {
            ArrayList.push(this.PickBookingList[loop]);
          }
        }

        for (let loop = 0; loop < ArrayList.length; loop++) {
          this.database.list('/Booking/').update(ArrayList[loop].Key, {
            RiderKey: this.SelectRider,
            isRiderAssign: true
          })
        }

      }
      else if (this.PickListCheck == false && this.DeliverListCheck == true) {

        for (let loop = 0; loop < this.DeliverBookingList.length; loop++) {
          if (this.DeliverBookingList[loop].isChecked == true) {
            ArrayList.push(this.DeliverBookingList[loop]);
          }
        }
        for (let loop = 0; loop < ArrayList.length; loop++) {
          this.database.list('/Booking/').update(ArrayList[loop].Key, {
            RiderKey: this.SelectRider,
            DeliveryCharges: ArrayList[loop].DeliveryCharges,
            Weight: ArrayList[loop].Weight,
            ReadyToDispatch: true,
            isRiderAssign: true,
            ReadyToDispatchDate: this.getcurrentDateTime()
          })
        }

      }

      this.printRiderList();

    }




  }

  EditDeliveryCharges(Value, key) {

    this.database.list('/Booking/').update(key, {
      DeliveryCharges: Value,
    })
  }

  FetchRider() {
    this.database.object('Rider').valueChanges().subscribe(data => {
      let SubArr = Object.keys(data);
      this.RiderCombo = [];
      for (var loop = 0; loop < SubArr.length; loop++) {
        const object2 = Object.assign({ RiderId: SubArr[loop] }, data[SubArr[loop]]);
        this.RiderCombo.push(object2);
      }
    })
  }

  selectWorkType(param) {

    if (this.SelectShiper == undefined) {
      this.toastr.show('<span class="now-ui-icons ui-1_bell-53"></span> Select Shiper First', '', {
        timeOut: 8000,
        closeButton: true,
        enableHtml: true,
        toastClass: "alert alert-success alert-with-icon",
      });
    } else {
      if (param.target.value == "Pick") {
        this.workOutType = "Pick Workout";
        this.FetchPickData();
        this.PickListCheck = true;
        this.DeliverListCheck = false
      }
      else {
        this.workOutType = "Delivery Workout";
        this.FetchDeliverData();
        this.PickListCheck = false;
        this.DeliverListCheck = true
      }
    }


  }

  Editmove(param) {
    this.Helper.ShiperInformation = param;
  }
}
