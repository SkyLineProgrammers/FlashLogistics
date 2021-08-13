import { Component, OnInit, HostListener } from '@angular/core';
import { AngularFireDatabase } from "@angular/fire/database";
import { HelperService } from "app/helper.service";
import { ExcelService } from 'app/excel.service';
import { Router } from '@angular/router';
import { NgxBarcodeModule } from 'ngx-barcode';
import * as firebase from "firebase";
import { ToastrService } from 'ngx-toastr';
import { BlueExServicesService } from 'app/blue-ex-services.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { data } from 'jquery';


@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss']
})
export class BookingListComponent implements OnInit {



  bookingModal = {
    BookingID: 123,
    Amount: 123,
    shiperName: '123',
    ConsigneeName: "123",
    ConsigneeContact: "123",
    DestinationCity: "karachi",
    ConsigneeAdress: "123",
    ArrivedatStation: false,
    ArrivedDate: "123456",
    BookedDate: "1234666",
    Dispacthed: false,
    DispacthedDate: "12345678",
    Delivered: false,
    DeliveredDate: "12345678",
    Refused: false,
    RefusedDate: "1234567",
    CallNotResponse: false,
    CallNotResponseDate: "12367",
    isBlueExVar: false,
    blueExOrderCode: "",
    blueExCn: ""
  };
  originalBookingList = [];
  bookingList = [];
  logerInfo: any;
  searchContent = ""
  siPrintShow = false;
  printArry = [];
  ShiperList = [];
  statusBtn = 0;
  isLoadMoreShow = true;
  isCount = 0;
  cityList = [];

  constructor(private ngxService: NgxUiLoaderService, private objBlueExServices: BlueExServicesService, private database: AngularFireDatabase, private toastr: ToastrService, private Helper: HelperService, private excelService: ExcelService, private router: Router,) {

    let guard = this.Helper.getUserGuardPrivilages(this.router.url);
    if (guard) {

    } else {
      this.router.navigate(['/Logistic/Error']);
    }

    this.logerInfo = JSON.parse(sessionStorage.getItem('UserInfo'));
    this.FetchCityData();
    this.FetchShiperData();
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
        this.cityList.reverse();
      }
    })
  }

  BtnSaveBlueEx(param) {
    var cityCode = this.cityList.find(data => data.cityName == param.DestinationCity).BlueCode;
    let test2 = `{"acno": "KHI-06123", "testbit": "y", "userid": "feuztek", "password": "Feuz1122", "service_code": "BG", "cn_generate": "y","customer_name": "${param.ConsigneeName}", "customer_email": "${param.ConsigneeEmail}", "customer_contact": "${param.ConsigneeContact}","customer_address": "${param.ConsigneeAdress}", "customer_city": "${cityCode}", "customer_country": "PK","customer_comment": "${param.Remarks}", "shipping_charges": "0", "payment_type": "COD", "shipper_origion_city": "KHI","total_order_amount": "${param.Amount}", "order_refernce_code": "${param.CustomerRef}","products_detail": [{ "product_code": "1005", "product_name": "${param.ProductDetail}", "product_price": "${param.Amount}", "product_weight": "${param.Weight}", "product_quantity": "2", "product_variations": " ", "sku_code": "12assk11aa" }]}`;

    let booking = `order=${test2}`;

    this.ngxService.start(); // start foreground spinner of the master loader with 'default' taskId

    this.objBlueExServices.saveBlueExOrder(booking).subscribe(data => {

      console.clear();
      console.log(data);


      this.database.list('/Booking/').update(param.BookingKey, {
        isBlueEx: true,
        blueExCn: data.cn,
        blueExOrderCode: data.order_code
      }).then(sucess => {
        this.ngxService.stop();
      })

    }, error => {

      console.clear();
      console.log(error);
      this.ngxService.stop();

    })


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
      this.FetchData();
      this.ShiperList.reverse();

    })
  }

  checkAll(param) {

    if (param.target.checked) {
      this.bookingList.forEach(element => {
        element.isCheck = true;
        this.isCount++;
      });
    } else {
      this.isCount = 0;
      this.bookingList.forEach(element => {
        element.isCheck = false;
      });
    }

  }

  changeShipper(param) {
    if (param == "") {
      this.isLoadMoreShow = true;
      if (this.statusBtn == 0) {
        this.bookingList = this.originalBookingList.slice(0, 25);
      } else if (this.statusBtn == 5) {
        this.bookingList = this.originalBookingList.filter(data => !data.ArrivedatStation);
      } else if (this.statusBtn == 1) {
        this.bookingList = this.originalBookingList.filter(data => data.ArrivedatStation);
      } else if (this.statusBtn == 2) {
        this.bookingList = this.originalBookingList.filter(data => data.Dispacthed);
      } else if (this.statusBtn == 3) {
        this.bookingList = this.originalBookingList.filter(data => data.Delivered);
      } else if (this.statusBtn == 4) {
        this.bookingList = this.originalBookingList.filter(data => data.Refused || data.CallNotResponse);
      }
    } else {
      this.isLoadMoreShow = false;
      this.bookingList = this.originalBookingList.filter(data => data.shiperName.includes(param));
    }

  }

  changeName(param) {

    if (param == "") {
      this.isLoadMoreShow = true;
      if (this.statusBtn == 0) {
        this.bookingList = this.originalBookingList.slice(0, 25);
      } else if (this.statusBtn == 5) {
        this.bookingList = this.originalBookingList.filter(data => !data.ArrivedatStation);
      } else if (this.statusBtn == 1) {
        this.bookingList = this.originalBookingList.filter(data => data.ArrivedatStation);
      } else if (this.statusBtn == 2) {
        this.bookingList = this.originalBookingList.filter(data => data.Dispacthed);
      } else if (this.statusBtn == 3) {
        this.bookingList = this.originalBookingList.filter(data => data.Delivered);
      } else if (this.statusBtn == 4) {
        this.bookingList = this.originalBookingList.filter(data => data.Refused || data.CallNotResponse);
      }
    } else {
      this.isLoadMoreShow = false;
      this.bookingList = this.originalBookingList.filter(data => data.ConsigneeName.includes(param));
    }
  }

  update() {

    this.bookingList.forEach(element => {

      this.database.list('/Booking/').update(element.BookingKey, {
        DeliveryCharges: 0
      }).then(sucess => {
      })

    });


  }

  changeCN(param) {
    if (param == "") {
      this.isLoadMoreShow = true;
      if (this.statusBtn == 0) {
        this.bookingList = this.originalBookingList.slice(0, 25);
      } else if (this.statusBtn == 5) {
        this.bookingList = this.originalBookingList.filter(data => !data.ArrivedatStation);
      } else if (this.statusBtn == 1) {
        this.bookingList = this.originalBookingList.filter(data => data.ArrivedatStation);
      } else if (this.statusBtn == 2) {
        this.bookingList = this.originalBookingList.filter(data => data.Dispacthed);
      } else if (this.statusBtn == 3) {
        this.bookingList = this.originalBookingList.filter(data => data.Delivered);
      } else if (this.statusBtn == 4) {
        this.bookingList = this.originalBookingList.filter(data => data.Refused || data.CallNotResponse);
      }
    } else {
      this.isLoadMoreShow = false;
      this.bookingList = this.originalBookingList.filter(data => data.BookingID.includes(param));
    }

  }

  ngOnInit() {
  }

  search(param) {
    if (param == "") {
      this.isLoadMoreShow = true;
      this.bookingList = this.originalBookingList.slice(0, 25);
    } else {
      this.isLoadMoreShow = false;
      var searchArray = param.split(',');
      this.bookingList = [];
      searchArray.forEach(element => {

        let findID = this.originalBookingList.filter(data => data.BookingID == element);
        if (findID.length != 0) {
          this.bookingList = findID;
        } else {
          let findPhone = this.originalBookingList.filter(data => data.ConsigneeContact.toString().includes(param));
          if (findPhone.length != 0) {
            this.bookingList = findPhone;
          } else {
            let findName = this.originalBookingList.filter(data => data.ConsigneeName.includes(param));
            if (findName.length != 0) {
              this.bookingList = findName;
            } else {

              let findAmount = this.originalBookingList.filter(data => data.Amount == element);
              if (findAmount.length != 0) {
                this.bookingList = findAmount;
              }
            }
          }
        }
      });
    }
  }

  viewBooking(param) {
    this.bookingModal = param;

  }

  copy() {
    let val = "";
    this.bookingList.forEach(element => {
      if (element.isCheck) {
        val = val + element.BookingID;
        val = val + ",";
      }
    });
    val = val.slice(0, -1);
    this.copyMessage(val);
  }

  closePrint() {
    this.siPrintShow = false;
    this.printArry = [];
  }

  openPrint() {
    // document.getElementById('printBarcode').style.marginTop = "-4%";
    var printContents = document.getElementById('PrintDiv').innerHTML;
    var originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    this.siPrintShow = false;
    document.body.innerHTML = originalContents;

  }

  @HostListener("window:afterprint", [])
  onWindowAfterPrint() {
    window.location.reload();
  }

  print() {
    this.printArry = [];
    this.siPrintShow = true;
    this.bookingList.forEach(element => {
      if (element.isCheck) {
        const object2 = Object.assign(element, { ShiperInfo: this.ShiperList.find(info => info.ShiperKey == element.ShiperID) });
        this.printArry.push(object2);
      }
    });

    for (let index = 0; index < this.bookingList.length; index++) {
      this.bookingList[index].isCheck = false;

    }
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

    this.toastr.show('<span class="now-ui-icons ui-1_bell-53"></span> Your Data Has Been Copied', '', {
      timeOut: 1000,
      closeButton: true,
      enableHtml: true,
      toastClass: "alert alert-success alert-with-icon",
    });

  }

  individualPrint(loop, param) {
    this.printArry = [];
    this.siPrintShow = true;
    this.bookingList[loop].isCheck = param.target.checked;
    const object2 = Object.assign(this.bookingList[loop], { ShiperInfo: this.ShiperList.find(info => info.ShiperKey == this.bookingList[loop].ShiperID) });
    this.printArry.push(object2);

  }

  checkValue(loop, param) {
    this.bookingList[loop].isCheck = param.target.checked;
    if (param.target.checked) {
      this.isCount++;
    } else {
      this.isCount--;
    }
  }

  selectAllCheck() {

    for (let index = 0; index < this.bookingList.length; index++) {
      this.bookingList[index].isCheck = true;
    }
  }

  FetchData() {
    this.database.object('Booking').valueChanges().subscribe(data => {
      let SubArr = Object.keys(data);
      this.bookingList = [];
      for (var loop = 0; loop < SubArr.length; loop++) {
        let DeliveryCharges = 0;
        if (data[SubArr[loop]].DeliveryCharges != undefined) {
          DeliveryCharges = data[SubArr[loop]].DeliveryCharges;
        } else {
          data[SubArr[loop]].DeliveryCharges = 0;
        }
        let ShiperId = data[SubArr[loop]].ShiperID;
        let shiperInfo = this.ShiperList.find(data => data.ShiperKey == ShiperId).CompanyName;
        // { COD: parseFloat(data[SubArr[loop]].Amount) + parseFloat(DeliveryCharges.toString()) }
        if (data[SubArr[loop]].isBlueEx != undefined) {
          const object2 = Object.assign({ BookingKey: SubArr[loop] }, data[SubArr[loop]], { shiperName: shiperInfo }, { isCheck: false }, { isBlueExVar: true });
          this.bookingList.push(object2);
          this.originalBookingList.push(object2);
        } else {
          const object2 = Object.assign({ BookingKey: SubArr[loop] }, data[SubArr[loop]], { shiperName: shiperInfo }, { isCheck: false }, { isBlueExVar: false });
          this.bookingList.push(object2);
          this.originalBookingList.push(object2);
        }
      }


      if (this.logerInfo.isAdmin == 1) {
        this.bookingList = this.bookingList.filter(data => data.ShiperID == this.logerInfo.ShiperKey);
        this.originalBookingList = this.bookingList.filter(data => data.ShiperID == this.logerInfo.ShiperKey);
      }

      this.bookingList.reverse();
      this.bookingList = this.bookingList.slice(0, 25);
      this.originalBookingList.reverse();

    })
  }

  loadMore() {
    this.originalBookingList;
    let currentLength = (this.bookingList.length);
    let newBookList = [];

    if (this.statusBtn == 0) {
      newBookList = this.originalBookingList;
    } else if (this.statusBtn == 5) {
      newBookList = this.originalBookingList.filter(data => !data.ArrivedatStation);
    } else if (this.statusBtn == 1) {
      newBookList = this.originalBookingList.filter(data => data.ArrivedatStation);
    } else if (this.statusBtn == 2) {
      newBookList = this.originalBookingList.filter(data => data.Dispacthed);
    } else if (this.statusBtn == 3) {
      newBookList = this.originalBookingList.filter(data => data.Delivered);
    } else if (this.statusBtn == 4) {
      newBookList = this.originalBookingList.filter(data => data.Refused || data.CallNotResponse);
    }


    for (let index = currentLength; index < (currentLength + 25); index++) {
      console.log(this.bookingList.length);
      if (this.bookingList.length == newBookList.length) {

        this.toastr.show('<span class="now-ui-icons ui-1_bell-53"></span> No more data to show ', '', {
          timeOut: 1000,
          closeButton: true,
          enableHtml: true,
          toastClass: "alert alert-success alert-with-icon",
        });
        break;
      } else {
        if (this.statusBtn == 0) {
          this.bookingList.push(newBookList[index]);
        } else if (this.statusBtn == 5) {
          if (!newBookList[index].ArrivedatStation) {
            this.bookingList.push(newBookList[index]);
          }
        } else if (this.statusBtn == 1) {
          if (newBookList[index].ArrivedatStation) {
            this.bookingList.push(newBookList[index]);
          }
        } else if (this.statusBtn == 2) {
          if (newBookList[index].Dispacthed) {
            this.bookingList.push(newBookList[index]);
          }
        }
        else if (this.statusBtn == 3) {
          if (newBookList[index].Delivered) {
            this.bookingList.push(newBookList[index]);
          }
        }
        else if (this.statusBtn == 4) {
          if (newBookList[index].Refused || newBookList[index].CallNotResponse) {
            this.bookingList.push(newBookList[index]);
          }
        }
      }
    }
  }

  // Date Filter

  startDate;
  endDate;

  dateTest() {
    this.isLoadMoreShow = false;
    this.startDate;
    this.endDate
    let SelectedDates = [];

    let startDate = parseFloat(this.startDate.split("-")[2]);
    let endDate = parseFloat(this.endDate.split("-")[2]);
    let startMonth = parseFloat(this.startDate.split("-")[1]);
    let endMonth = parseFloat(this.endDate.split("-")[1]);
    let startYear = parseFloat(this.startDate.split("-")[0]);
    let endYear = parseFloat(this.endDate.split("-")[0]);

    for (let index = 0; index < 1000; index++) {

      let date

      if (startDate < 10 && startMonth < 10) {
        date = startYear + "-0" + startMonth + "-0" + startDate;
      } else if (startDate >= 10 && startMonth < 10) {
        date = startYear + "-0" + startMonth + "-" + startDate;
      } else if (startDate < 10 && startMonth >= 10) {
        date = startYear + "-" + startMonth + "-0" + startDate;
      } else {
        date = startYear + "-" + startMonth + "-" + startDate;
      }


      SelectedDates.push(date);
      if (date == this.endDate) {
        break;
      } else {
        if (startDate == 31) {
          if (startMonth == endMonth || startMonth == 12) {
            if (startYear == endYear) {
              break;
            } else {
              startYear++;
              startMonth = 1;
              startDate = 1;
            }
          } else {
            startMonth++;
            startDate = 1;
          }
        } else {
          startDate++;
        }
      }
    }

    this.bookingList = [];
    SelectedDates.forEach(element => {
      let filterArray = this.originalBookingList.filter(data => data.BookedDate.includes(element));

      if (filterArray.length != 0) {
        filterArray.forEach(innerElement => {
          this.bookingList.push(innerElement);
        });
      }

    });

    // let data = [];
    // let key;
    // var ref = firebase.database().ref().child('Booking');
    // ref.orderByChild('BookedDate').startAt("2020-07-13").endAt("2020-07-13").on('child_added', function (result) {
    //   data.push(result.val());
    //   key = result.key;
    // })

    // setTimeout(() => {
    //    
    // }, 1000);

  }

  // Date Filter

  // test
  tabStatus(param) {

    this.isLoadMoreShow = true;
    this.bookingList = [];
    if (param == "all") {
      this.statusBtn = 0;
      this.bookingList = this.originalBookingList.slice(0, 25);
      // .slice(0, 15);
    } else if (param == "Booked") {
      this.statusBtn = 5;
      this.bookingList = this.originalBookingList;
      this.bookingList = this.bookingList.filter(data => !data.ArrivedatStation);
      // .slice(0, 15);
    }
    else if (param == "Arrived") {
      this.statusBtn = 1;
      this.bookingList = this.originalBookingList;
      // .slice(0, 15);
      this.bookingList = this.bookingList.filter(data => data.ArrivedatStation && !data.Dispacthed && !data.Delivered && !data.Refused && !data.CallNotResponse);
    } else if (param == "Dispatched") {
      this.statusBtn = 2;
      this.bookingList = this.originalBookingList;
      // .slice(0, 15);
      this.bookingList = this.bookingList.filter(data => data.ArrivedatStation && data.Dispacthed && !data.Delivered && !data.Refused && !data.CallNotResponse);
    } else if (param == "Delivered") {
      this.statusBtn = 3;
      this.bookingList = this.originalBookingList;
      // .slice(0, 15);
      this.bookingList = this.bookingList.filter(data => data.Delivered);
    }
    else if (param == "Refused") {
      this.statusBtn = 4;
      this.bookingList = this.originalBookingList;
      // .slice(0, 15);
      this.bookingList = this.bookingList.filter(data => data.Refused || data.CallNotResponse);
    }
  }

  export(): void {
    let array = [];
    this.bookingList.forEach(element => {
      if (element.isCheck) {
        if (this.logerInfo.isAdmin != 1) {
          array.push(element)
        } else {
          delete element.ArrivedatStation;
          delete element.BookingKey;
          delete element.CallNotResponse;
          delete element.CallNotResponseDate;
          delete element.Delivered;
          delete element.Dispacthed;
          delete element.MarkAsReturn;
          delete element.OrderBooked;
          delete element.ReAttempRequest;
          delete element.ReadyToDispatch;
          delete element.Refused;
          delete element.ReturnToShiper;
          delete element.RiderKey;
          delete element.ShiperID;
          delete element.isCencle;
          delete element.isCheck;
          delete element.isRiderAssign;

          array.push(element)

        }
      }
    });
    if (array.length > 0) {
      this.excelService.exportAsExcelFile(array, 'BookingList');
    } else {
      this.toastr.show('<span class="now-ui-icons ui-1_bell-53"></span> Booking first', '', {
        timeOut: 8000,
        closeButton: true,
        enableHtml: true,
        toastClass: "alert alert-success alert-with-icon",
      });
    }
  }

  Editmove(param) {
    sessionStorage.setItem('BookingInformation', JSON.stringify(param));
  }
}
