import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from "@angular/fire/database";
import { ToastrService } from 'ngx-toastr';
import { Route, ActivatedRoute, Router } from "@angular/router";
import { HelperService } from "app/helper.service";

@Component({
  selector: 'app-rider-form',
  templateUrl: './rider-form.component.html',
  styleUrls: ['./rider-form.component.scss']
})
export class RiderFormComponent implements OnInit {
  selectedEmployee: any;
  empInfo = [{ StatusName: "Beginner" },
  { StatusName: "Middle" },
  { StatusName: "Expert" }
  ]

  RiderStatus = "Add Rider";
  ngOnInit(): void {

  }


  RiderInfo = {
    RiderID: "-1",
    RiderName: "",
    FatherName: "",
    CNICNumber: "",
    Mobile1: "",
    Mobile2: "",
    Mobile3: "",
    Location: "",
    DOB: "",
    Status: "",
    Balance: "",
  }

  ButtonName = "SK";
  RiderKey = "";
  constructor(private database: AngularFireDatabase, private toastr: ToastrService, private route: ActivatedRoute, private Helper: HelperService, private router: Router) {


    let guard = this.Helper.getUserGuardPrivilages(this.router.url);
    if (guard) {

    } else {
      this.router.navigate(['/Logistic/Error']);
    }


    var data = JSON.parse(sessionStorage.getItem('RiderInformation'));
    if (data != undefined && data != "") {
      sessionStorage.removeItem('RiderInformation');
      this.RiderInfo = data;
      // alert(this.RiderInfo.CNICNumber);
      this.RiderKey = data.RiderId;
      this.Helper.RiderInformation = "";
      this.RiderInfo.Status = data.Status;
      // alert(this.RiderInfo.Status)
      this.RiderStatus = "Edit Rider";
    }
    else {
      this.RiderStatus = "Add Rider"
      this.Reset();
    }

  }


  Reset() {
    this.RiderInfo = {
      RiderID: "-1",
      RiderName: "",
      FatherName: "",
      CNICNumber: "",
      Mobile1: "",
      Mobile2: "",
      Mobile3: "",
      Location: "",
      DOB: "",
      Status: "",
      Balance: "",
    }
  }

  checkValue(event) {

  }

  statusSelected(param) {
    this.RiderInfo.Status = param;
  }
  BtnSaveData(RiderInfo) {
    let ID: string = new Date().getTime().toString();
    RiderInfo.RiderID = "LS-" + ID.substring(ID.length - 6);
    // alert(RiderInfo.RiderID)

    if (this.RiderInfo.RiderName == "" || this.RiderInfo.FatherName == "" || this.RiderInfo.CNICNumber == "" || this.RiderInfo.Mobile1 == "") {
      this.toastr.show('<span class="now-ui-icons ui-1_bell-53"></span> Some Fields are required!', '', {
        timeOut: 8000,
        closeButton: true,
        enableHtml: true,
        toastClass: "alert alert-danger alert-with-icon",
      });
    }
    else {
      this.SaveData(RiderInfo);
    }
  }
  SaveData(param) {
    if (this.RiderKey == "") {
      this.database.list("/Rider/").push(
        param
      );
      this.Reset();
      this.toastr.show('<span class="now-ui-icons ui-1_bell-53"></span> Yor Data Has Been Saved', '', {
        timeOut: 8000,
        closeButton: true,
        enableHtml: true,
        toastClass: "alert alert-success alert-with-icon",
      });
    }
    else {
      // alert(this.RiderKey);
      console.log(param);

      this.database.list('/Rider/').update(this.RiderKey, {
        RiderName: this.RiderInfo.RiderName,
        FatherName: this.RiderInfo.FatherName,
        CNICNumber: this.RiderInfo.CNICNumber,
        Mobile1: this.RiderInfo.Mobile1,
        Mobile2: this.RiderInfo.Mobile2,
        Mobile3: this.RiderInfo.Mobile3,
        Location: this.RiderInfo.Location,
        DOB: this.RiderInfo.DOB,
        Status: this.RiderInfo.Status,
        Balance: this.RiderInfo.Balance,
      })
      this.Reset();
    }

    this.router.navigate(['/Logistic/RiderList']);


  }

}
