import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from "@angular/fire/database";
import { Router } from '@angular/router';
import { HelperService } from 'app/helper.service';
import * as CanvasJS from '../../assets/js/canvasjs/canvasjs.min.js';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public lineBigDashboardChartType;
  public gradientStroke;
  public chartColor;
  public canvas: any;
  public ctx;
  public gradientFill;
  public lineBigDashboardChartData: Array<any>;
  public lineBigDashboardChartOptions: any;
  public lineBigDashboardChartLabels: Array<any>;
  public lineBigDashboardChartColors: Array<any>
  public gradientChartOptionsConfiguration: any;
  public gradientChartOptionsConfigurationWithNumbersAndGrid: any;

  public lineChartType;
  public lineChartData: Array<any>;
  public lineChartOptions: any;
  public lineChartLabels: Array<any>;
  public lineChartColors: Array<any>

  public lineChartWithNumbersAndGridType;
  public lineChartWithNumbersAndGridData: Array<any>;
  public lineChartWithNumbersAndGridOptions: any;
  public lineChartWithNumbersAndGridLabels: Array<any>;
  public lineChartWithNumbersAndGridColors: Array<any>

  public lineChartGradientsNumbersType;
  public lineChartGradientsNumbersData: Array<any>;
  public lineChartGradientsNumbersOptions: any;
  public lineChartGradientsNumbersLabels: Array<any>;
  public lineChartGradientsNumbersColors: Array<any>
  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }
  public hexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
      return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
      return "rgb(" + r + ", " + g + ", " + b + ")";
    }
  }


  public currentValue: number;

  public incrementProgress() {
    this.currentValue += 10;
    if (this.currentValue > 100) {
      this.currentValue = 100;
    }
  }

  public decrementProgress() {
    this.currentValue -= 10;
    if (this.currentValue < 0) {
      this.currentValue = 0;
    }
  }


  SearchKey = "";
  bookingList = [];
  orderPrice = [70, 80, 90];
  logerInfo: any;
  orderData: any;
  SelectedDates = [];
  languageData: any;
  constructor(
    private database: AngularFireDatabase,
    private router: Router,
    private Helper: HelperService,
  ) {
    this.languageData = 0;
    this.filterName = this.languageData == 0 ? "Monthly" : "Miesięczny";
    this.logerInfo = JSON.parse(sessionStorage.getItem('UserInfo'));
    this.orderData = JSON.parse(sessionStorage.getItem('OrderPriceAndID'));
    let guard = this.Helper.getUserGuardPrivilages(this.router.url);
    // this.orderData.list.length = 10;

    // this.orderData.list.length = 10
    if (guard == "goToLogin") {
      this.router.navigate(['/Login']);
    }

    else if (guard) {

    } else {
      this.router.navigate(['/Logistic/Error']);
    }
  }

  startDate = "2020-12-01";
  endDate = "2020-12-31";
  filterName = "";

  dateFilter() {

    // let mon = parseFloat(new Date().getMonth().toString()) + 1;
    // let year = parseFloat(new Date().getFullYear().toString());

    // if (mon < 10) {
    //   this.startDate = year + "-" + 0 + mon.toString() + "-01";
    //   this.endDate = year + "-" + 0 + mon.toString() + + "-31";
    // } else {
    //   this.startDate = year + "-" + mon + "-01";
    //   this.endDate = year + "-" + mon + + "-31";
    // }

    this.SelectedDates = [];

    let startDate = parseFloat(this.startDate.split("-")[2]);
    let endDate = parseFloat(this.endDate.split("-")[2]);
    let startMonth = parseFloat(this.startDate.split("-")[1]);
    let endMonth = parseFloat(this.endDate.split("-")[1]);
    let startYear = parseFloat(this.startDate.split("-")[0]);
    let endYear = parseFloat(this.endDate.split("-")[0]);

    for (let index = 0; index < 50; index++) {

      let date;

      if (startDate < 10 && startMonth < 10) {
        date = startYear + "-0" + startMonth + "-0" + startDate;
      } else if (startDate >= 10 && startMonth < 10) {
        date = startYear + "-0" + startMonth + "-" + startDate;
      } else if (startDate < 10 && startMonth >= 10) {
        date = startYear + "-" + startMonth + "-0" + startDate;
      } else {
        date = startYear + "-" + startMonth + "-" + startDate;
      }


      this.SelectedDates.push(date);
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

    // SelectedDates.forEach(element => {
    //   let filterArray = data;
    //   if (filterArray.length != 0) {
    //     filterArray.forEach(innerElement => {
    //       this.bookingList.push(innerElement);
    //     });
    //   }

    // });

  }

  test(param) {
    let day = new Date().getDate();
    let year = new Date().getFullYear()
    let mon = new Date().getMonth() + 1

    if (param == 1) { // Monthly
      this.filterName = this.languageData == 0 ? "Monthly" : "Miesięczny";
      this.startDate = year + "-" + mon + "-01";
      this.endDate = year + "-" + mon + "-31";
    } else if (param == 2) { // Weekly
      this.filterName = this.languageData == 0 ? "Weekly" : "Tygodniowo";
      let chk = day - 6;
      let weekStartDay = 0;
      if (chk <= 0) {
        weekStartDay = 1;
      } else {
        weekStartDay = chk;
      }
      if (day < 10) {
        if (weekStartDay < 10) {
          this.startDate = year + "-" + mon + "-0" + weekStartDay;
        } else {
          this.startDate = year + "-" + mon + "-0" + weekStartDay;
        }
        this.endDate = year + "-" + mon + "-0" + day;
      } else {
        if (weekStartDay < 10) {
          this.startDate = year + "-" + mon + "-0" + weekStartDay;
        } else {
          this.startDate = year + "-" + mon + "-0" + weekStartDay;
        }
        this.endDate = year + "-" + mon + "-" + day;
      }


    } else if (param == 3) { // Daily
      this.filterName = this.languageData == 0 ? "Daily" : "Codziennie";
      this.startDate = year + "-" + mon + "-" + day;
      if (day < 10) {
        this.startDate = year + "-" + mon + "-0" + day;
        this.endDate = year + "-" + mon + "-0" + day;
      } else {
        this.startDate = year + "-" + mon + "-" + day;
        this.endDate = year + "-" + mon + "-" + day;
      }
    }



    this.dashBoardData();

  }

  dashBoardData() {
    this.dateFilter();
    let DATA = JSON.parse(sessionStorage.getItem('OrderPriceAndID'));
    this.bookingList = [];
    DATA.list.forEach(element => {
      if (this.SelectedDates.findIndex(data => data == element.BookedDate.split(" ")[0]) != -1) {
        this.bookingList.push(element)
      }
    });


    let barChart = []

    DATA.amount.forEach(element => {
      if (this.SelectedDates.findIndex(data => data == element.date) != -1) {
        barChart.push({
          label: element.id,
          y: element.amount
        });
      }
    });

    let pieData = [
      { y: DATA.arrivedOrder, name: this.languageData == 0 ? "Arrived" : "Przybył" },
      { y: DATA.deliverdOrder, name: this.languageData == 0 ? "Delivered" : "Dostarczono" },
      { y: DATA.dispatedOrder, name: this.languageData == 0 ? "Dispatched" : "wysyłane" },
      { y: DATA.orderNumber, name: this.languageData == 0 ? "Total Order" : "Całkowite zamówienie" },
      { y: DATA.returned, name: this.languageData == 0 ? "Total Returned" : "Razem zwrócone" },
    ];

    let chart = new CanvasJS.Chart("chartContainer", {
      theme: "light2",
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: this.languageData == 0 ? "All Order Report" : "Raport wszystkich zamówień"
      },
      data: [{
        type: "pie",
        showInLegend: true,
        toolTipContent: "<b>{name}</b>: {y} (#percent%)",
        indexLabel: "{name} - #percent%",
        dataPoints: pieData
      }]
    });

    chart.render();


    let pieData2 = [
      { y: 0, name: this.languageData == 0 ? "Delivered" : "Dostarczono" },
      { y: DATA.deliverdOrder, name: this.languageData == 0 ? "Delivered" : "Dostarczono" },
    ];

    let chart2 = new CanvasJS.Chart("chartContainer2", {
      theme: "light2",
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: this.languageData == 0 ? "All Delivered" : "Wszystkie dostarczone" + " (" + DATA.deliverdOrder + " )"
      },
      data: [{
        type: "pie",
        showInLegend: true,
        toolTipContent: "<b>{name}</b>: {y} (#percent%)",
        // indexLabel: "{name} - #percent%",
        dataPoints: pieData2
      }]
    });

    chart2.render();

    let pieData3 = [
      // { y: 0, name: "Arrived" },
      // { y: 0, name: "Delivered" },
      { y: 0, name: this.languageData == 0 ? "Total Returned" : "Razem zwrócone" },
      { y: 0, name: this.languageData == 0 ? "Total Returned" : "Razem zwrócone" },
      { y: DATA.returned, name: this.languageData == 0 ? "Total Returned" : "Razem zwrócone" },
    ];

    let chart3 = new CanvasJS.Chart("chartContainer3", {
      theme: "light2",
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: this.languageData == 0 ? "All Returned" : "Wszystkie zwrócone" + " (" + DATA.returned + " )"
      },
      data: [{
        type: "pie",
        showInLegend: true,
        toolTipContent: "<b>{name}</b>: {y} (#percent%)",
        // indexLabel: "{name} - #percent%",
        dataPoints: pieData3
      }]
    });

    chart3.render();


    let chartLine = new CanvasJS.Chart("LinechartContainer", {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: ""
      },
      data: [{
        type: "column",
        dataPoints: barChart
      }]
    });

    chartLine.render();

  }


  ngOnInit() {
    // this.dashBoardData();
    this.test(1);

  }
}
