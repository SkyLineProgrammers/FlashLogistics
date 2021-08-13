import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AngularFireDatabase } from "@angular/fire/database";
import { Router } from '@angular/router';
import { HelperService } from 'app/helper.service';
import { BlueExServicesService } from 'app/blue-ex-services.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {

  cityInfo = {
    cityId: "",
    cityName: "",
    cityCharges: "",
    Zone: "",
    BlueCode: ""
  }
  editKey = false;
  cityList: any;

  constructor(
    private toastr: ToastrService,
    private database: AngularFireDatabase,
    private router: Router,
    private Helper: HelperService,
    private objBlueExServices: BlueExServicesService
  ) {

    let guard = this.Helper.getUserGuardPrivilages(this.router.url);
    if (guard) {

    } else {
      this.router.navigate(['/Logistic/Error']);
    }

    let ID: string = new Date().getTime().toString();
    this.cityInfo.cityId = "LS-" + ID.substring(ID.length - 6);
    this.FetchData();
  }


  Editmove(loopData) {
    this.editKey = true;
    this.cityInfo = loopData;
  }

  FetchData() {
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


  getUpdateCities() {


    this.cityList.forEach(element => {

      // if (element.cityName != "Abottabad" || element.cityName != "Bahawalpur" || element.cityName != "Faisalabad" ||
      //   element.cityName != "Gujranwala" || element.cityName != "Gujrat" || element.cityName != "Hyderabad" ||
      //   element.cityName != "Islamabad" || element.cityName != "Jhelum" || element.cityName != "Lahore" ||
      //   element.cityName != "Larkana" || element.cityName != "Multan" || element.cityName != "Peshawar" ||
      //   element.cityName != "Quetta" || element.cityName != "Rahim yar khan" || element.cityName != "Rawalpindi" ||
      //   element.cityName != "Sahiwal" || element.cityName != "Sargodha" || element.cityName != "Sialkot" ||
      //   element.cityName != "Sukkur" || element.cityName != "Wah cantt") {


      if (element.cityName == "Abottabad" || element.cityName == "Bahawalpur" || element.cityName == "Faisalabad" ||
        element.cityName == "Gujranwala" || element.cityName == "Gujrat" || element.cityName == "Hyderabad" ||
        element.cityName == "Islamabad" || element.cityName == "Jhelum" || element.cityName == "Lahore" ||
        element.cityName == "Larkana" || element.cityName == "Multan" || element.cityName == "Peshawar" ||
        element.cityName == "Quetta" || element.cityName == "Rahim Yar Khan" || element.cityName == "Rawalpindi" ||
        element.cityName == "Sahiwal" || element.cityName == "Sargodha" || element.cityName == "Sialkot" ||
        element.cityName == "Sukkur" || element.cityName == "Wah Cantt") {

        this.database.list('/city/').update(element.CityId, {
          Zone: "B"
        })

      }


    });


    // this.objBlueExServices.getCities().subscribe(data => {



    //   data.cities.forEach(element => {


    //     var param = {
    //       cityId: "",
    //       cityName: element.CITY_NAME,
    //       cityCharges: "0",
    //       Zone: "A",
    //       BlueCode: element.CITY_CODE
    //     };

    //     let ID: string = new Date().getTime().toString();
    //     param.cityId = "LS-" + ID.substring(ID.length - 10);

    //     this.database.list("/city/").push(param).then(data => {

    //     })

    //   });








    // }, error => {
    //    
    //   console.clear();
    //   console.log(error);

    // })
  }


  BtnSaveData(param) {
    param.Zone = "";
    param.BlueCode = "";
    if (param.cityName != "" && param.cityCharges != "") {

      if (!this.editKey) {
        // Save
        this.database.list("/city/").push(param).then(data => {
          this.reset();
          this.toastr.show('<span class="now-ui-icons ui-1_bell-53"></span> Save data sucessfully', '', {
            timeOut: 8000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-sucess alert-with-icon",
          });
        })
        // Save
      } else {
        this.database.list('/city/').update(param.CityId, param).then(data => {
          this.reset();
          this.toastr.show('<span class="now-ui-icons ui-1_bell-53"></span> Updated data sucessfully', '', {
            timeOut: 8000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-sucess alert-with-icon",
          });
        });
      }






    } else {
      this.reset();
      this.toastr.show('<span class="now-ui-icons ui-1_bell-53"></span> Some feilds are empty', '', {
        timeOut: 8000,
        closeButton: true,
        enableHtml: true,
        toastClass: "alert alert-danger alert-with-icon",
      });
    }
  }

  reset() {
    let ID: string = new Date().getTime().toString();
    this.cityInfo.cityId = "LS-" + ID.substring(ID.length - 6);
    this.cityInfo = {
      cityId: "",
      cityName: "",
      cityCharges: "",
      Zone: "",
      BlueCode: ""
    }
  }

  ngOnInit() {
  }

}
