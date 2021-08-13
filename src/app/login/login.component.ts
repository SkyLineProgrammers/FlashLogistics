import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from "@angular/fire/database";
import * as firebase from "firebase";
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  UserName = "";
  Password = "";
  isCheckFirebase = 0;
  WrongUser = 0;
  languageData: any;

  constructor(private database: AngularFireDatabase, private router: Router, private ngxService: NgxUiLoaderService) {
    this.languageData = 0;
    this.isCheckFirebase = 0;
    sessionStorage.removeItem('UserInfo');
    sessionStorage.removeItem('OrderPriceAndID');
  }

  ngOnInit() {
  }

  GoToDashBoard2() {

    this.WrongUser = 0;
    if (this.UserName != "" && this.Password != "") {
      this.database.object('/UserLogin/').valueChanges().subscribe(data => {
        let SubArr = Object.keys(data); //SubArr have all data inside signUp
        if (this.isCheckFirebase == 0) {
          for (let loop = 0; loop < SubArr.length; loop++) {
            if (data[SubArr[loop]].UserName == this.UserName && data[SubArr[loop]].Password == this.Password) {
              this.isCheckFirebase = 1;

              this.router.navigate(['/Logistic/dashboard']);
              const object2 = Object.assign({ loggerKey: SubArr[loop] }, data[SubArr[loop]]);



              sessionStorage.removeItem('UserInfo');
              sessionStorage.setItem('UserInfo', JSON.stringify(object2));
              this.WrongUser = 0;
              break;
            } else {
              this.WrongUser = 1;
            }
          }
        }
        if (this.WrongUser == 1) {
          alert('Invalid');
        }
      })
    }
  }

  startDate;
  endDate;
  bookingListFinal;

  dateTest(param) {

    let mon = parseFloat(new Date().getMonth().toString()) + 1;
    let year = parseFloat(new Date().getFullYear().toString());

    if (mon < 10) {
      this.startDate = year + "-" + 0 + mon.toString() + "-01";
      this.endDate = year + "-" + 0 + mon.toString() + + "-31";
    } else {
      this.startDate = year + "-" + mon + "-01";
      this.endDate = year + "-" + mon + + "-31";
    }

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

    this.bookingListFinal = [];
    SelectedDates.forEach(element => {
      let filterArray = param.filter(data => data.BookedDate.includes(element));

      if (filterArray.length != 0) {
        filterArray.forEach(innerElement => {
          delete innerElement.ArrivedDate;
          delete innerElement.ArrivedatStation;
          delete innerElement.BookingKey;
          delete innerElement.CallNotResponse;
          delete innerElement.CallNotResponseDate;
          delete innerElement.ConsigneeAdress;
          delete innerElement.ConsigneeEmail;
          delete innerElement.CustomerRef;
          delete innerElement.Delivered;
          delete innerElement.DeliveredDate;
          delete innerElement.DestinationCountry;
          delete innerElement.Dispacthed;
          delete innerElement.DispacthedDate;
          delete innerElement.Fragile;
          delete innerElement.MarkAsReturn;
          delete innerElement.MarkAsReturnDate;
          delete innerElement.Origin;
          delete innerElement.ProductDetail;
          delete innerElement.ReAttempRequest;
          delete innerElement.ReAttempRequestDate;
          delete innerElement.ReadyToDispatch;
          delete innerElement.ReadyToDispatchDate;
          delete innerElement.Refused;
          delete innerElement.RefusedDate;
          delete innerElement.Remarks;
          delete innerElement.ReturnToShiper;
          delete innerElement.ReturnToShiperDate;
          delete innerElement.RiderKey;
          delete innerElement.ShiperID;
          delete innerElement.isCencle;
          delete innerElement.isCencleDate;
          delete innerElement.isRiderAssign;
          this.bookingListFinal.push(innerElement);
        });
      }

    });

  }

  GoToDashBoard() {
    var orderAmount = [];
    var orderId = [];
    var bookingList = [];
    var allOrders = [];
    this.isCheckFirebase = 0;
    this.WrongUser = 0;
    if (this.UserName != "" && this.Password != "") {

      this.ngxService.start(); // start foreground spinner of the master loader with 'default' taskId

      this.database.object('UserLogin').valueChanges().subscribe(data => {
        let SubArr = Object.keys(data); //SubArr have all data inside signUp

        if (this.isCheckFirebase == 0) {
          for (let loop = 0; loop < SubArr.length; loop++) {
            console.log(loop);
            if (data[SubArr[loop]].UserName == this.UserName &&
              data[SubArr[loop]].Password == this.Password) {
              if (data[SubArr[loop]].isActive == undefined) {

                this.database.object('Booking').valueChanges().subscribe(bookingData => {
                  orderAmount = [];
                  orderId = [];
                  bookingList = [];
                  let bookingSubArr = Object.keys(bookingData);
                  if (this.isCheckFirebase == 0) {
                    let loopAllow = 1;
                    this.isCheckFirebase = 1;
                    bookingSubArr.reverse();
                    for (var bookingLoop = 0; bookingLoop < bookingSubArr.length; bookingLoop++) {
                      const object2 = Object.assign({ BookingKey: bookingSubArr[loop] }, bookingData[bookingSubArr[bookingLoop]]);
                      if (true) {
                        // if (loopAllow <= 10) {
                        if (data[SubArr[loop]].isAdmin == 1) {
                          if (object2.ShiperID == data[SubArr[loop]].ShiperKey) {
                            loopAllow++;
                            orderId.push(object2.BookingID);
                            orderAmount.push({
                              amount: parseInt(object2.Amount),
                              date: object2.BookedDate.split(' ')[0],
                              id: object2.BookingID
                            });
                            bookingList.push(object2);
                            allOrders.push(object2);
                          }
                        } else {
                          loopAllow++;
                          orderId.push(object2.BookingID);
                          orderAmount.push({
                            amount: parseInt(object2.Amount),
                            date: object2.BookedDate.split(' ')[0],
                            id: object2.BookingID
                          });

                          bookingList.push(object2);
                          allOrders.push(object2);
                        }
                      }


                    }
                    let arrive = 0;
                    let dispatch = 0;
                    let deliver = 0;
                    let returnOrder = 0;

                    allOrders.forEach(data => {
                      if (data.ArrivedatStation == true) {
                        arrive++;
                      } if (data.Dispacthed == true) {
                        dispatch++;
                      } if (data.Delivered == true) {
                        deliver++;
                      } if (data.MarkAsReturn == true) {
                        returnOrder++;
                      }
                    });
                    this.ngxService.stop();
                    // start foreground spinner of the master loader with 'default' taskId

                    this.router.navigate(['/Logistic/dashboard']);
                    const object2 = Object.assign({ loggerKey: SubArr[loop] }, data[SubArr[loop]]);
                    if (object2.isAdmin == 1) {
                      object2.Privilages = [
                        { item_text: "Dashboard", item_id: "/Logistic/dashboard" },
                        { item_text: "ShiperForm", item_id: "/Logistic/ShiperForm" },
                        // { item_text: "RiderList", item_id: "/Logistic/RiderList" },
                        // { item_text: "RiderForm", item_id: "/Logistic/RiderForm" },
                        { item_text: "BookingForm", item_id: "/Logistic/BookingForm" },
                        { item_text: "BookingList", item_id: "/Logistic/BookingList" },
                        // { item_text: "UserList", item_id: "/Logistic/UserList" },
                        // { item_text: "UserForm", item_id: "/Logistic/UserForm" },
                        { item_text: "ManageCHQList", item_id: "/Logistic/ManageCHQList" },
                        // { item_text: "WorkOut", item_id: "/Logistic/WorkOut" },
                        { item_text: "TrackOrder", item_id: "/Logistic/TrackID" },
                        { item_text: "Setting", item_id: "/Logistic/Setting" },
                      ]
                    }
                    sessionStorage.removeItem('UserInfo');
                    sessionStorage.removeItem('OrderPriceAndID');
                    // language initializeApp
                    // sessionStorage.removeItem('language');
                    // sessionStorage.setItem('language', JSON.stringify(1));
                    sessionStorage.setItem('UserInfo', JSON.stringify(object2));



                    // One Month Filter 

                    this.dateTest(bookingList);

                    //  One Month Filter



                    let aa = this.bookingListFinal;

                    sessionStorage.setItem('OrderPriceAndID', JSON.stringify({
                      id: orderId,
                      amount: orderAmount,
                      list: this.bookingListFinal,
                      orderNumber: allOrders.length,
                      arrivedOrder: arrive,
                      dispatedOrder: dispatch,
                      deliverdOrder: deliver,
                      returned: returnOrder
                    }));
                  }

                })

              } else {
                if (!data[SubArr[loop]].isActive) {
                  alert("User has been UnActivated please contact to admin");
                  this.ngxService.stop();

                } else {
                  this.database.object('Booking').valueChanges().subscribe(bookingData => {
                    orderAmount = [];
                    orderId = [];
                    bookingList = [];
                    let bookingSubArr = Object.keys(bookingData);
                    if (this.isCheckFirebase == 0) {
                      let loopAllow = 1;
                      this.isCheckFirebase = 1;
                      bookingSubArr.reverse();
                      for (var bookingLoop = 0; bookingLoop < bookingSubArr.length; bookingLoop++) {
                        const object2 = Object.assign({ BookingKey: bookingSubArr[loop] }, bookingData[bookingSubArr[bookingLoop]]);
                        if (loopAllow <= 10) {
                          if (data[SubArr[loop]].isAdmin == 1) {
                            if (object2.ShiperID == data[SubArr[loop]].ShiperKey) {
                              loopAllow++;
                              orderId.push(object2.BookingID);
                              orderAmount.push({
                                amount: parseInt(object2.Amount),
                                date: object2.BookedDate.split(' ')[0],
                                id: object2.BookingID
                              });
                              // orderAmount.push(parseInt(object2.Amount));
                              bookingList.push(object2);
                              allOrders.push(object2);
                            }
                          } else {
                            loopAllow++;
                            orderId.push(object2.BookingID);
                            orderAmount.push({
                              amount: parseInt(object2.Amount),
                              date: object2.BookedDate.split(' ')[0],
                              id: object2.BookingID
                            });
                            // orderAmount.push(parseInt(object2.Amount));
                            bookingList.push(object2);
                            allOrders.push(object2);
                          }
                        } else {
                          if (data[SubArr[loop]].isAdmin == 1) {
                            if (object2.ShiperID == data[SubArr[loop]].ShiperKey) {
                              allOrders.push(object2);
                            }
                          }
                          else {
                            allOrders.push(object2);
                          }

                        }

                      }
                      let arrive = 0;
                      let dispatch = 0;
                      let deliver = 0;
                      let returnOrder = 0;

                      allOrders.forEach(data => {
                        if (data.ArrivedatStation == true) {
                          arrive++;
                        } if (data.Dispacthed == true) {
                          dispatch++;
                        } if (data.Delivered == true) {
                          deliver++
                        } if (data.MarkAsReturn == true) {
                          returnOrder++;
                        }
                      });
                      this.ngxService.stop();
                      // start foreground spinner of the master loader with 'default' taskId

                      this.router.navigate(['/Logistic/dashboard']);
                      const object2 = Object.assign({ loggerKey: SubArr[loop] }, data[SubArr[loop]]);
                      if (object2.isAdmin == 1) {
                        object2.Privilages = [
                          { item_text: "Dashboard", item_id: "/Logistic/dashboard" },
                          { item_text: "ShiperForm", item_id: "/Logistic/ShiperForm" },
                          // { item_text: "RiderList", item_id: "/Logistic/RiderList" },
                          // { item_text: "RiderForm", item_id: "/Logistic/RiderForm" },
                          { item_text: "BookingForm", item_id: "/Logistic/BookingForm" },
                          { item_text: "BookingList", item_id: "/Logistic/BookingList" },
                          // { item_text: "UserList", item_id: "/Logistic/UserList" },
                          // { item_text: "UserForm", item_id: "/Logistic/UserForm" },
                          { item_text: "ManageCHQList", item_id: "/Logistic/ManageCHQList" },
                          // { item_text: "WorkOut", item_id: "/Logistic/WorkOut" },
                          { item_text: "TrackOrder", item_id: "/Logistic/TrackID" },
                          { item_text: "Setting", item_id: "/Logistic/Setting" },
                        ]
                      }
                      sessionStorage.removeItem('UserInfo');
                      sessionStorage.removeItem('OrderPriceAndID');
                      // language initializeApp
                      // sessionStorage.removeItem('language');
                      // sessionStorage.setItem('language', JSON.stringify(1));
                      sessionStorage.setItem('UserInfo', JSON.stringify(object2));


                      // One Month Filter 

                      this.dateTest(bookingList);

                      //  One Month Filter

                      sessionStorage.setItem('OrderPriceAndID', JSON.stringify({
                        id: orderId,
                        amount: orderAmount,
                        list: this.bookingListFinal,
                        orderNumber: allOrders.length,
                        arrivedOrder: arrive,
                        dispatedOrder: dispatch,
                        deliverdOrder: deliver,
                        returned: returnOrder
                      }));
                    }

                  })
                }
              }


              this.WrongUser = 0;
              break;


              // } else {
              //   this.WrongUser = 0;
              //   alert("Please contact to the admin your account has been disabled");
              // }
            } else {
              this.WrongUser = 1;
            }
          }
        }
        if (this.WrongUser == 1) {
          this.ngxService.stop();
          alert('Invalid User');
        }
      })







    }
  }

}

